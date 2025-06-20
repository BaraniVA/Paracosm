import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { LinkReferenceSelector } from './LinkReferenceSelector';

interface CreateEditWorldRecordFormProps {
  worldId: string;
  initialData?: {
    id?: string;
    title: string;
    description: string;
    category: string;
    linked_to_type?: string | null;
    linked_to_id?: string | null;
  };
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

const CATEGORIES = [
  'Geography',
  'Characters',
  'Events',
  'Culture',
  'Religion',
  'Politics',
  'Technology',
  'Magic',
  'History',
  'Organizations',
  'Other'
];

export function CreateEditWorldRecordForm({ worldId, initialData, onSubmit, onCancel }: CreateEditWorldRecordFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || 'Other',
    linked_to_type: initialData?.linked_to_type || '',
    linked_to_id: initialData?.linked_to_id || '',
    linked_to_name: '' // For display purposes
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) return;

    setIsLoading(true);
    try {
      await onSubmit({
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        world_id: worldId,
        linked_to_type: formData.linked_to_type || null,
        linked_to_id: formData.linked_to_id || null
      });
    } catch (error) {
      console.error('Error submitting record:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkSelect = (id: string, name: string) => {
    setFormData(prev => ({
      ...prev,
      linked_to_id: id,
      linked_to_name: name
    }));
  };

  const handleLinkTypeChange = (type: string) => {
    setFormData(prev => ({
      ...prev,
      linked_to_type: type,
      linked_to_id: '',
      linked_to_name: ''
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">
            {initialData?.id ? 'Edit World Record' : 'Create World Record'}
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
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter record title..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={15}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Enter detailed description for this record. You can write as much as needed - this is your wiki page for this topic..."
              required
            />
            <p className="text-gray-400 text-xs mt-1">
              Write as much detail as you need. This supports large amounts of text for comprehensive lore documentation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Link To (Optional)
              </label>
              <select
                value={formData.linked_to_type}
                onChange={(e) => handleLinkTypeChange(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">None</option>
                <option value="law">World Law</option>
                <option value="role">Role</option>
                <option value="timeline">Timeline Event</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Reference
              </label>
              <LinkReferenceSelector
                worldId={worldId}
                linkedToType={formData.linked_to_type}
                selectedId={formData.linked_to_id}
                onSelect={handleLinkSelect}
              />
            </div>
          </div>

          {formData.linked_to_type && formData.linked_to_name && (
            <div className="p-3 bg-gray-700 rounded-lg border-l-4 border-indigo-500">
              <p className="text-gray-300 text-sm">
                <span className="font-medium">Will be linked to:</span> {formData.linked_to_name}
              </p>
            </div>
          )}

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
              disabled={isLoading || !formData.title.trim() || !formData.description.trim()}
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