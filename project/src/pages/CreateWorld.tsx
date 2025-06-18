import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Plus, X, Save } from 'lucide-react';

export function CreateWorld() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    laws: [''],
    roles: [{ name: '', description: '' }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Defensive check for user ID
    if (!user || !user.id) {
      setError('User authentication error. Please log out and log back in.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Filter out empty laws and roles
      const validLaws = formData.laws.filter(law => law.trim() !== '');
      const validRoles = formData.roles.filter(role => role.name.trim() !== '');

      if (validLaws.length < 3) {
        throw new Error('Please provide at least 3 laws for your world');
      }

      // Create the world
      const { data: world, error: worldError } = await supabase
        .from('worlds')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            creator_id: user.id,
            laws: validLaws,
          },
        ])
        .select()
        .single();

      if (worldError) throw worldError;

      // Create roles
      if (validRoles.length > 0) {
        const { error: rolesError } = await supabase
          .from('roles')
          .insert(
            validRoles.map(role => ({
              world_id: world.id,
              name: role.name,
              description: role.description,
              created_by: user.id,
              is_system_role: false,
            }))
          );

        if (rolesError) throw rolesError;
      }

      navigate(`/world/${world.id}/dashboard`);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addLaw = () => {
    if (formData.laws.length < 10) {
      setFormData({
        ...formData,
        laws: [...formData.laws, ''],
      });
    }
  };

  const removeLaw = (index: number) => {
    if (formData.laws.length > 1) {
      setFormData({
        ...formData,
        laws: formData.laws.filter((_, i) => i !== index),
      });
    }
  };

  const updateLaw = (index: number, value: string) => {
    const newLaws = [...formData.laws];
    newLaws[index] = value;
    setFormData({
      ...formData,
      laws: newLaws,
    });
  };

  const addRole = () => {
    setFormData({
      ...formData,
      roles: [...formData.roles, { name: '', description: '' }],
    });
  };

  const removeRole = (index: number) => {
    if (formData.roles.length > 1) {
      setFormData({
        ...formData,
        roles: formData.roles.filter((_, i) => i !== index),
      });
    }
  };

  const updateRole = (index: number, field: 'name' | 'description', value: string) => {
    const newRoles = [...formData.roles];
    newRoles[index][field] = value;
    setFormData({
      ...formData,
      roles: newRoles,
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Create a New World</h1>
        <p className="text-gray-400">
          Define the laws, roles, and structure of your fictional universe
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                World Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="The Eternal Library"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                World Description *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe your world's core concept, setting, and what makes it unique..."
              />
            </div>
          </div>
        </div>

        {/* World Laws */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">World Laws</h2>
            <button
              type="button"
              onClick={addLaw}
              disabled={formData.laws.length >= 10}
              className="flex items-center px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Law
            </button>
          </div>
          
          <p className="text-gray-400 text-sm mb-4">
            Define the fundamental rules that govern your world (minimum 3, maximum 10)
          </p>

          <div className="space-y-3">
            {formData.laws.map((law, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm w-8">{index + 1}.</span>
                <input
                  type="text"
                  value={law}
                  onChange={(e) => updateLaw(index, e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Time flows backwards every full moon..."
                />
                {formData.laws.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLaw(index)}
                    className="p-1 text-red-400 hover:text-red-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Initial Roles */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Initial Roles</h2>
            <button
              type="button"
              onClick={addRole}
              className="flex items-center px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Role
            </button>
          </div>
          
          <p className="text-gray-400 text-sm mb-4">
            Define roles that inhabitants can take on in your world (optional)
          </p>

          <div className="space-y-4">
            {formData.roles.map((role, index) => (
              <div key={index} className="bg-gray-700 rounded-md p-4">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-gray-400 text-sm">Role {index + 1}</span>
                  {formData.roles.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRole(index)}
                      className="p-1 text-red-400 hover:text-red-300"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={role.name}
                    onChange={(e) => updateRole(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Role name (e.g., Scholar, Guardian, Seeker)"
                  />
                  <textarea
                    value={role.description}
                    onChange={(e) => updateRole(index, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Role description and responsibilities..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-600 text-red-100 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-5 w-5 mr-2" />
            {loading ? 'Creating World...' : 'Create World'}
          </button>
        </div>
      </form>
    </div>
  );
}