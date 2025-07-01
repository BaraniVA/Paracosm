import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Map, MapPin, Plus, Edit, Trash2, EyeOff, Navigation, Upload, Image as ImageIcon } from 'lucide-react';
import { ImageUploadSection } from '../components/FileUpload';
import { deleteImage, detectImageService } from '../lib/imageUpload';

interface MapLocation {
  id: string;
  world_id: string;
  name: string;
  description: string;
  x_coordinate: number;
  y_coordinate: number;
  location_type: string;
  is_public: boolean;
  created_by: string;
  created_at: string;
}

interface WorldMapProps {
  worldId: string;
  isCreator: boolean;
}

export function WorldMap({ worldId, isCreator }: WorldMapProps) {
  const { user } = useAuth();
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState<MapLocation | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location_type: 'city',
    is_public: true,
    x_coordinate: 50,
    y_coordinate: 50
  });
  const [mapImage, setMapImage] = useState<string | null>(null);
  const [mapId, setMapId] = useState<string | null>(null);
  const [showMapUploadForm, setShowMapUploadForm] = useState(false);
  const [mapUrl, setMapUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDeletingMap, setIsDeletingMap] = useState(false);

  const locationTypes = [
    'city', 'town', 'village', 'castle', 'forest', 'mountain', 
    'river', 'lake', 'desert', 'dungeon', 'temple', 'ruins', 'other'
  ];

  const typeColors = {
    city: 'bg-blue-600',
    town: 'bg-green-600',
    village: 'bg-yellow-600',
    castle: 'bg-purple-600',
    forest: 'bg-emerald-600',
    mountain: 'bg-gray-600',
    river: 'bg-cyan-600',
    lake: 'bg-blue-400',
    desert: 'bg-orange-600',
    dungeon: 'bg-red-600',
    temple: 'bg-indigo-600',
    ruins: 'bg-amber-600',
    other: 'bg-gray-500'
  };

  const fetchLocations = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('world_map_locations')
        .select('*')
        .eq('world_id', worldId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  }, [worldId]);

  const fetchMapImage = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('world_maps')
        .select('id, map_url')
        .eq('world_id', worldId)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') { // Not found error
          console.error('Error fetching map image:', error);
        }
        return;
      }

      if (data && data.map_url) {
        setMapImage(data.map_url);
        setMapId(data.id);
      }
    } catch (error) {
      console.error('Error fetching map image:', error);
    }
  }, [worldId]);

  useEffect(() => {
    fetchLocations();
    fetchMapImage();
  }, [fetchLocations, fetchMapImage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const locationData = {
        ...formData,
        world_id: worldId,
        created_by: user.id
      };

      if (editingLocation) {
        const { error } = await supabase
          .from('world_map_locations')
          .update(locationData)
          .eq('id', editingLocation.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('world_map_locations')
          .insert([locationData]);
        if (error) throw error;
      }

      setFormData({
        name: '',
        description: '',
        location_type: 'city',
        is_public: true,
        x_coordinate: 50,
        y_coordinate: 50
      });
      setShowForm(false);
      setEditingLocation(null);
      fetchLocations();
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  const handleMapUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !mapUrl.trim()) return;

    setIsUploading(true);
    try {
      // Check if a map already exists for this world
      const { data: existingMap } = await supabase
        .from('world_maps')
        .select('id')
        .eq('world_id', worldId)
        .single();

      if (existingMap) {
        // Update existing map
        const { error } = await supabase
          .from('world_maps')
          .update({ map_url: mapUrl.trim() })
          .eq('id', existingMap.id);
        
        if (error) throw error;
        setMapId(existingMap.id);
      } else {
        // Insert new map
        const { data, error } = await supabase
          .from('world_maps')
          .insert([{
            world_id: worldId,
            map_url: mapUrl.trim(),
            created_by: user.id
          }])
          .select('id')
          .single();
        
        if (error) throw error;
        if (data) setMapId(data.id);
      }

      setMapImage(mapUrl.trim());
      setMapUrl('');
      setShowMapUploadForm(false);
    } catch (error) {
      console.error('Error saving map image:', error);
      alert('Failed to save map image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteMap = async () => {
    if (!mapId || !isCreator || !mapImage) return;
    
    const imageService = detectImageService(mapImage);
    
    let confirmMessage = 'Are you sure you want to delete this map? This action cannot be undone.';
    if (imageService === 'imgbb') {
      confirmMessage += '\n\nNote: This will remove the map from your world, but ImgBB does not support deletion so the image will remain hosted on their servers.';
    }
    
    if (!confirm(confirmMessage)) {
      return;
    }

    setIsDeletingMap(true);
    try {
      // Delete from database first
      const { error } = await supabase
        .from('world_maps')
        .delete()
        .eq('id', mapId);
      
      if (error) throw error;
      
      // Try to delete from hosting service
      if (imageService !== 'imgbb') {
        const deleteResult = await deleteImage(mapImage);
        if (!deleteResult.success) {
          console.warn('Failed to delete from hosting service:', deleteResult.error);
          // Still continue - database deletion was successful
        }
      }
      
      setMapImage(null);
      setMapId(null);
      
      // Show info message for ImgBB
      if (imageService === 'imgbb') {
        alert('Map removed from world. Note: The image remains hosted on ImgBB servers.');
      }
    } catch (error) {
      console.error('Error deleting map:', error);
      alert('Failed to delete map. Please try again.');
    } finally {
      setIsDeletingMap(false);
    }
  };

  const handleEdit = (location: MapLocation) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      description: location.description,
      location_type: location.location_type,
      is_public: location.is_public,
      x_coordinate: location.x_coordinate,
      y_coordinate: location.y_coordinate
    });
    setShowForm(true);
  };

  const handleDelete = async (locationId: string) => {
    if (!confirm('Are you sure you want to delete this location?')) return;

    try {
      const { error } = await supabase
        .from('world_map_locations')
        .delete()
        .eq('id', locationId);

      if (error) throw error;
      fetchLocations();
    } catch (error) {
      console.error('Error deleting location:', error);
    }
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCreator || showForm) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setFormData(prev => ({
      ...prev,
      x_coordinate: Math.round(x),
      y_coordinate: Math.round(y)
    }));
    setShowForm(true);
  };

  const visibleLocations = locations.filter(location => 
    isCreator || location.is_public
  );

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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Map className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">World Map</h2>
        </div>
        <div className="flex space-x-2">
          {isCreator && mapImage && (
            <button
              onClick={handleDeleteMap}
              disabled={isDeletingMap}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isDeletingMap ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete Map
            </button>
          )}
          {isCreator && (
            <button
              onClick={() => setShowMapUploadForm(true)}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Upload className="h-4 w-4 mr-2" />
              {mapImage ? 'Change Map' : 'Upload Map'}
            </button>
          )}
          {isCreator && (
            <button
              onClick={() => {
                setEditingLocation(null);
                setFormData({
                  name: '',
                  description: '',
                  location_type: 'city',
                  is_public: true,
                  x_coordinate: 50,
                  y_coordinate: 50
                });
                setShowForm(true);
              }}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </button>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div 
          className="relative w-full h-96 bg-gradient-to-br from-green-900 via-green-800 to-blue-900 rounded-lg border-2 border-gray-600 cursor-crosshair overflow-hidden"
          onClick={handleMapClick}
          style={{
            backgroundImage: mapImage 
              ? `url('${mapImage}')`
              : `url('https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Map Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          
          {/* Grid Lines */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(10)].map((_, i) => (
              <div key={`v-${i}`} className="absolute h-full w-px bg-white" style={{ left: `${i * 10}%` }} />
            ))}
            {[...Array(10)].map((_, i) => (
              <div key={`h-${i}`} className="absolute w-full h-px bg-white" style={{ top: `${i * 10}%` }} />
            ))}
          </div>

          {/* Locations */}
          {visibleLocations.map((location) => (
            <div
              key={location.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
              style={{
                left: `${location.x_coordinate}%`,
                top: `${location.y_coordinate}%`
              }}
            >
              <div className={`w-4 h-4 rounded-full ${typeColors[location.location_type as keyof typeof typeColors]} border-2 border-white shadow-lg cursor-pointer hover:scale-125 transition-transform`}>
                {!location.is_public && isCreator && (
                  <EyeOff className="h-2 w-2 text-white absolute -top-1 -right-1" />
                )}
              </div>
              
              {/* Location Tooltip */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                <div className="font-semibold">{location.name}</div>
                <div className="text-gray-300 capitalize">{location.location_type}</div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
              </div>

              {/* Edit/Delete buttons for creators */}
              {isCreator && (
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(location);
                    }}
                    className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="h-3 w-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(location.id);
                    }}
                    className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Instructions */}
          {isCreator && (
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded text-sm">
              <Navigation className="h-4 w-4 inline mr-2" />
              Click anywhere on the map to add a location
            </div>
          )}

          {/* No Map Overlay */}
          {!mapImage && isCreator && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-white font-medium">No custom map uploaded</p>
                <p className="text-gray-400 text-sm mb-3">Using default map background</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMapUploadForm(true);
                  }}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                >
                  Upload Map
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Location Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">
              {editingLocation ? 'Edit Location' : 'Add New Location'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                <select
                  value={formData.location_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, location_type: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  {locationTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">X Position (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.x_coordinate}
                    onChange={(e) => setFormData(prev => ({ ...prev, x_coordinate: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Y Position (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.y_coordinate}
                    onChange={(e) => setFormData(prev => ({ ...prev, y_coordinate: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingLocation(null);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {editingLocation ? 'Update' : 'Add'} Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Map Upload Form Modal */}
      {showMapUploadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">Upload Custom Map</h3>
            
            <form onSubmit={handleMapUpload} className="space-y-4">
              <ImageUploadSection
                onImageSelect={(url) => setMapUrl(url)}
                currentUrl={mapUrl}
                title="Map Image"
                description="Upload a map image from your device or enter a URL"
              />

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowMapUploadForm(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!mapUrl.trim() || isUploading}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Save Map
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Location List */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Locations ({visibleLocations.length})</h3>
        
        {visibleLocations.length === 0 ? (
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No locations added yet</p>
            {isCreator && (
              <p className="text-gray-500 text-sm mt-2">Click on the map to add your first location</p>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleLocations.map((location) => (
              <div key={location.id} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${typeColors[location.location_type as keyof typeof typeColors]}`}></div>
                    <h4 className="font-semibold text-white">{location.name}</h4>
                  </div>
                  {!location.is_public && isCreator && (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                <p className="text-gray-300 text-sm mb-2 capitalize">{location.location_type}</p>
                {location.description && (
                  <p className="text-gray-400 text-sm">{location.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}