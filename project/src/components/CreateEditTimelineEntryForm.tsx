import { useState } from 'react';
import { Save, X, Plus, Minus, EyeOff } from 'lucide-react';

interface CreateEditTimelineEntryFormProps {
  worldId: string;
  initialData?: {
    id?: string;
    era_title: string;
    year: string;
    event_title?: string;
    description: string;
    tag?: string;
    location?: string;
    roles_involved?: string[];
    is_private?: boolean;
    subnotes?: string[];
  };
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  availableRoles?: Array<{ id: string; name: string }>;
}

const tagOptions = [
  'general',
  'war',
  'magic',
  'ruler',
  'religion',
  'politics',
  'discovery',
  'disaster',
  'culture',
  'trade'
];

const tagColors = {
  general: 'bg-gray-600',
  war: 'bg-red-600',
  magic: 'bg-purple-600',
  ruler: 'bg-yellow-600',
  religion: 'bg-blue-600',
  politics: 'bg-indigo-600',
  discovery: 'bg-green-600',
  disaster: 'bg-orange-600',
  culture: 'bg-pink-600',
  trade: 'bg-emerald-600'
};

export function CreateEditTimelineEntryForm({ 
  worldId, 
  initialData, 
  onSubmit, 
  onCancel, 
  availableRoles = [] 
}: CreateEditTimelineEntryFormProps) {
  const [formData, setFormData] = useState({
    era_title: initialData?.era_title || '',
    year: initialData?.year || '',
    event_title: initialData?.event_title || '',
    description: initialData?.description || '',
    tag: initialData?.tag || 'general',
    location: initialData?.location || '',
    roles_involved: initialData?.roles_involved || [],
    is_private: initialData?.is_private || false,
    subnotes: initialData?.subnotes || ['']
  });  const [isLoading, setIsLoading] = useState(false);

  const handleRoleToggle = (roleId: string) => {
    setFormData(prev => ({
      ...prev,
      roles_involved: prev.roles_involved.includes(roleId)
        ? prev.roles_involved.filter(id => id !== roleId)
        : [...prev.roles_involved, roleId]
    }));
  };

  const addSubnote = () => {
    setFormData(prev => ({
      ...prev,
      subnotes: [...prev.subnotes, '']
    }));
  };

  const removeSubnote = (index: number) => {
    setFormData(prev => ({
      ...prev,
      subnotes: prev.subnotes.filter((_, i) => i !== index)
    }));
  };

  const updateSubnote = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      subnotes: prev.subnotes.map((note, i) => i === index ? value : note)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.era_title.trim() || !formData.year.trim() || !formData.description.trim()) return;

    setIsLoading(true);
    try {
      // Filter out empty subnotes
      const cleanedData = {
        ...formData,
        subnotes: formData.subnotes.filter(note => note.trim() !== ''),
        world_id: worldId
      };
      
      await onSubmit(cleanedData);
    } catch (error) {
      console.error('Error submitting timeline entry:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">
            {initialData?.id ? 'Edit Timeline Entry' : 'Create Timeline Entry'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Era Title *
              </label>
              <input
                type="text"
                value={formData.era_title}
                onChange={(e) => setFormData(prev => ({ ...prev, era_title: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="The Golden Age"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Year *
              </label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="1247 AC or Year 0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Event Title
            </label>
            <input
              type="text"
              value={formData.event_title}
              onChange={(e) => setFormData(prev => ({ ...prev, event_title: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="The Great Battle of..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category Tag
              </label>
              <div className="relative">
                <select
                  value={formData.tag}
                  onChange={(e) => setFormData(prev => ({ ...prev, tag: e.target.value }))}
                  className="w-full pl-10 pr-10 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                >
                  {tagOptions.map(tag => (
                    <option key={tag} value={tag} className="bg-gray-700">
                      {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <div className={`w-4 h-4 rounded-full ${tagColors[formData.tag as keyof typeof tagColors] || tagColors.general}`}></div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Kingdom of Eldoria"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Describe what happened during this era..."
              required
            />
          </div>          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Roles Involved
            </label>
            {availableRoles.length > 0 ? (
              <div className="bg-gray-700 rounded-lg p-4 max-h-40 overflow-y-auto border border-gray-600">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableRoles.map(role => (
                    <label 
                      key={role.id} 
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                        formData.roles_involved.includes(role.id)
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.roles_involved.includes(role.id)}
                        onChange={() => handleRoleToggle(role.id)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center ${
                        formData.roles_involved.includes(role.id)
                          ? 'border-white bg-white'
                          : 'border-gray-400'
                      }`}>
                        {formData.roles_involved.includes(role.id) && (
                          <svg className="w-2.5 h-2.5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-medium">{role.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                <p className="text-gray-400 text-sm text-center">No roles available in this world</p>
              </div>
            )}
          </div>          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-300">
                Additional Details (Subnotes)
              </label>
              <button
                type="button"
                onClick={addSubnote}
                className="flex items-center px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Note
              </button>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              {formData.subnotes.length > 0 ? (
                <div className="space-y-3">
                  {formData.subnotes.map((note, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      <input
                        type="text"
                        value={note}
                        onChange={(e) => updateSubnote(index, e.target.value)}
                        className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Additional detail..."
                      />
                      {formData.subnotes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSubnote(index)}
                          className="flex-shrink-0 p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm text-center py-4">No additional details added</p>
              )}
            </div>
          </div><div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center">
                <div className="mr-3">
                  <EyeOff className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-200">Private Entry</div>
                  <div className="text-xs text-gray-400">Only visible to world creator and editors</div>
                </div>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={formData.is_private}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_private: e.target.checked }))}
                  className="sr-only"
                />
                <div className={`w-12 h-6 rounded-full transition-colors ${
                  formData.is_private ? 'bg-yellow-500' : 'bg-gray-600'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform mt-0.5 ${
                    formData.is_private ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </div>
              </div>
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.era_title.trim() || !formData.year.trim() || !formData.description.trim()}
              className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : (initialData?.id ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}