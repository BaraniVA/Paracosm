import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Image, Plus, Edit, Trash2, EyeOff, X, AlertTriangle, Info } from 'lucide-react';
import { ImageUploadSection } from '../components/FileUpload';
import { GALLERY_IMAGE_LIMIT, deleteImage, detectImageService } from '../lib/imageUpload';

interface GalleryImage {
  id: string;
  world_id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  is_public: boolean;
  created_by: string;
  created_at: string;
}

interface WorldGalleryProps {
  worldId: string;
  isCreator: boolean;
}

export function WorldGallery({ worldId, isCreator }: WorldGalleryProps) {
  const { user } = useAuth();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    category: 'character',
    is_public: true
  });

  const categories = [
    'character', 'location', 'creature', 'artifact', 'scene', 
    'map', 'concept', 'architecture', 'landscape', 'other'
  ];

  const fetchImages = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('world_gallery')
        .select('*')
        .eq('world_id', worldId)
        .order('created_at', { ascending: false })
        .limit(100); // Limit to most recent 100 images for performance

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  }, [worldId]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Check gallery limit for new images
    if (!editingImage && images.length >= GALLERY_IMAGE_LIMIT) {
      alert(`You can only have ${GALLERY_IMAGE_LIMIT} images in your gallery. Please delete some images first.`);
      return;
    }

    if (!formData.image_url) {
      alert('Please add an image before submitting.');
      return;
    }

    try {
      const imageData = {
        ...formData,
        world_id: worldId,
        created_by: user.id
      };

      if (editingImage) {
        const { error } = await supabase
          .from('world_gallery')
          .update(imageData)
          .eq('id', editingImage.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('world_gallery')
          .insert([imageData]);
        if (error) throw error;
      }

      setFormData({
        title: '',
        description: '',
        image_url: '',
        category: 'character',
        is_public: true
      });
      setShowForm(false);
      setEditingImage(null);
      fetchImages();
    } catch (error) {
      console.error('Error saving image:', error);
      alert('Failed to save image. Please try again.');
    }
  };

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      description: image.description,
      image_url: image.image_url,
      category: image.category,
      is_public: image.is_public
    });
    setShowForm(true);
  };

  const handleDelete = async (imageId: string) => {
    const imageToDelete = images.find(img => img.id === imageId);
    if (!imageToDelete) return;

    const imageService = detectImageService(imageToDelete.image_url);
    
    let confirmMessage = 'Are you sure you want to delete this image?';
    if (imageService === 'imgbb') {
      confirmMessage += '\n\nNote: This will remove the image from your gallery, but ImgBB does not support deletion so the image will remain hosted on their servers.';
    }

    if (!confirm(confirmMessage)) return;

    try {
      // Delete from database first
      const { error } = await supabase
        .from('world_gallery')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      // Try to delete from hosting service
      if (imageService !== 'imgbb') {
        const deleteResult = await deleteImage(imageToDelete.image_url);
        if (!deleteResult.success) {
          console.warn('Failed to delete from hosting service:', deleteResult.error);
          // Still continue - database deletion was successful
        }
      }

      fetchImages();
      
      // Show info message for ImgBB
      if (imageService === 'imgbb') {
        alert('Image removed from gallery. Note: The image remains hosted on ImgBB servers.');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image. Please try again.');
    }
  };

  const visibleImages = images.filter(image => {
    const categoryMatch = selectedCategory === 'all' || image.category === selectedCategory;
    const visibilityMatch = isCreator || image.is_public;
    return categoryMatch && visibilityMatch;
  });

  const uniqueCategories = ['all', ...Array.from(new Set(images.map(img => img.category)))];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <Image className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">World Gallery</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
          >
            {uniqueCategories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          {isCreator && (
            <button
              onClick={() => {
                setEditingImage(null);
                setFormData({
                  title: '',
                  description: '',
                  image_url: '',
                  category: 'character',
                  is_public: true
                });
                setShowForm(true);
              }}
              disabled={images.length >= GALLERY_IMAGE_LIMIT}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                images.length >= GALLERY_IMAGE_LIMIT
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Image {images.length >= GALLERY_IMAGE_LIMIT ? `(${GALLERY_IMAGE_LIMIT} max)` : `(${images.length}/${GALLERY_IMAGE_LIMIT})`}
            </button>
          )}
        </div>
      </div>

      {/* Gallery Limit Warning */}
      {isCreator && images.length >= GALLERY_IMAGE_LIMIT - 2 && (
        <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0" />
            <div>
              <p className="text-yellow-300 font-medium">
                {images.length >= GALLERY_IMAGE_LIMIT 
                  ? 'Gallery limit reached' 
                  : `Approaching gallery limit (${images.length}/${GALLERY_IMAGE_LIMIT})`
                }
              </p>
              <p className="text-yellow-400 text-sm">
                {images.length >= GALLERY_IMAGE_LIMIT
                  ? 'Delete some images to add new ones'
                  : 'Consider removing old images before adding new ones'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleImages.map((image) => (
          <div key={image.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 group hover:border-indigo-500 transition-colors">
            <div className="relative aspect-square">
              <img
                src={image.image_url}
                alt={image.title}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setSelectedImage(image)}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop';
                }}
              />
              
              {/* Overlay with actions */}
              {isCreator && (
                <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(image)}
                    className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              )}

              {/* Privacy indicator */}
              {!image.is_public && isCreator && (
                <div className="absolute top-2 left-2">
                  <EyeOff className="h-4 w-4 text-yellow-400" />
                </div>
              )}

              {/* Category badge */}
              <div className="absolute bottom-2 left-2">
                <span className="px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded capitalize">
                  {image.category}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-white mb-1 truncate">{image.title}</h3>
              {image.description && (
                <p className="text-gray-400 text-sm line-clamp-2">{image.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {visibleImages.length === 0 && (
        <div className="text-center py-12">
          <Image className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-2">No images yet</h3>
          <p className="text-gray-500">
            {selectedCategory === 'all' 
              ? 'Start building your world gallery by adding images'
              : `No images in the ${selectedCategory} category`
            }
          </p>
          {isCreator && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Image
            </button>
          )}
        </div>
      )}

      {/* Image Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4">
              {editingImage ? 'Edit Image' : 'Add New Image'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  required
                />
              </div>

              <ImageUploadSection
                onImageSelect={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                currentUrl={formData.image_url}
                title="Image"
                description="Upload from your device or enter an image URL"
              />

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white resize-none"
                  placeholder="Describe this image..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_public"
                  checked={formData.is_public}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_public: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="is_public" className="text-sm text-gray-300">
                  Visible to all inhabitants
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingImage(null);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!formData.image_url}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    formData.image_url
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {editingImage ? 'Update' : 'Add'} Image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Viewer Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors z-10"
            >
              <X className="h-6 w-6" />
            </button>
            
            <img
              src={selectedImage.image_url}
              alt={selectedImage.title}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-4 rounded-b-lg">
              <h3 className="text-lg font-semibold mb-1">{selectedImage.title}</h3>
              <p className="text-gray-300 text-sm capitalize mb-1">{selectedImage.category}</p>
              {selectedImage.description && (
                <p className="text-gray-400 text-sm">{selectedImage.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}