import React, { useState } from 'react';
import { X, Edit, Save, Trash2 } from 'lucide-react';

interface WorldRecord {
  id: string;
  title: string;
  description: string;
  category: string;
  linked_to_type: string | null;
  linked_to_id: string | null;
  created_at: string;
}

interface WorldRecordModalProps {
  record: WorldRecord;
  isCreator: boolean;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<WorldRecord>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function WorldRecordModal({ record, isCreator, onClose, onUpdate, onDelete }: WorldRecordModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: record.title,
    description: record.description,
    category: record.category
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!editData.title.trim() || !editData.description.trim() || !editData.category.trim()) return;

    setIsLoading(true);
    try {
      await onUpdate(record.id, editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating record:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    try {
      await onDelete(record.id);
      onClose();
    } catch (error) {
      console.error('Error deleting record:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            {isEditing ? (
              <input
                type="text"
                value={editData.title}
                onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                className="text-xl font-semibold bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <h3 className="text-xl font-semibold text-white">{record.title}</h3>
            )}
            <span className="bg-gray-600 px-2 py-1 rounded text-xs text-gray-300">
              {isEditing ? (
                <input
                  type="text"
                  value={editData.category}
                  onChange={(e) => setEditData(prev => ({ ...prev, category: e.target.value }))}
                  className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:outline-none"
                  placeholder="Category"
                />
              ) : (
                record.category
              )}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {isCreator && (
              <>
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={isLoading || !editData.title.trim() || !editData.description.trim()}
                      className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditData({
                          title: record.title,
                          description: record.description,
                          category: record.category
                        });
                      }}
                      className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isLoading}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {isEditing ? (
            <textarea
              value={editData.description}
              onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
              rows={20}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Enter detailed description..."
            />
          ) : (
            <div className="prose prose-invert max-w-none">
              <div className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                {record.description}
              </div>
            </div>
          )}

          {record.linked_to_type && (
            <div className="mt-4 p-3 bg-gray-700 rounded-lg border-l-4 border-indigo-500">
              <p className="text-gray-300 text-sm">
                <span className="font-medium">Linked to:</span> {record.linked_to_type}
              </p>
            </div>
          )}

          <div className="text-gray-400 text-sm">
            Created on {new Date(record.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}