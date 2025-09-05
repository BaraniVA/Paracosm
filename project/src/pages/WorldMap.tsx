import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Map, MapPin, Plus, Edit, Trash2, EyeOff, Navigation, Upload, Image as ImageIcon, ZoomIn, ZoomOut, Move, Grid, RotateCcw, Maximize2 } from 'lucide-react';
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
  
  // Enhanced map interaction state
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  // We used to cache mapDimensions, but relying on ResizeObserver caused 0x0 races in production.
  // Instead we compute container dimensions on demand (clientWidth/Height) for robust positioning.
  // A mounted flag forces a post-mount render so refs are populated.
  const [mounted, setMounted] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const zoomTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showCoordinates, setShowCoordinates] = useState(false);

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

  // Enhanced map interaction handlers
  const handleSmartZoomIn = useCallback(() => {
    let newZoom: number;
    if (zoom < 1.2) {
      newZoom = 2;
    } else if (zoom < 2.5) {
      newZoom = 4;
    } else {
      newZoom = Math.min(5, zoom + 0.5);
    }
    
    // Set zooming state for visual feedback
    setIsZooming(true);
    
    if (zoomTimeoutRef.current) {
      clearTimeout(zoomTimeoutRef.current);
    }
    
    zoomTimeoutRef.current = setTimeout(() => {
      setIsZooming(false);
    }, 300);
    
    setZoom(newZoom);
  }, [zoom]);

  const handleSmartZoomOut = useCallback(() => {
    let newZoom: number;
    if (zoom > 3) {
      newZoom = 2;
    } else if (zoom > 1.5) {
      newZoom = 1;
    } else {
      newZoom = Math.max(0.5, zoom - 0.2);
    }
    
    // Set zooming state for visual feedback
    setIsZooming(true);
    
    if (zoomTimeoutRef.current) {
      clearTimeout(zoomTimeoutRef.current);
    }
    
    zoomTimeoutRef.current = setTimeout(() => {
      setIsZooming(false);
    }, 300);
    
    setZoom(newZoom);
  }, [zoom]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (showForm || showMapUploadForm) return;
      
      switch (e.key) {
        case '=':
        case '+':
          e.preventDefault();
          handleSmartZoomIn();
          break;
        case '-':
          e.preventDefault();
          handleSmartZoomOut();
          break;
        case 'r':
          e.preventDefault();
          handleReset();
          break;
        case 'g':
          e.preventDefault();
          setShowGrid(!showGrid);
          break;
        case 'f':
          e.preventDefault();
          setIsFullscreen(!isFullscreen);
          break;
        case 'Escape':
          if (isFullscreen) {
            e.preventDefault();
            setIsFullscreen(false);
          }
          if (selectedLocation) {
            e.preventDefault();
            setSelectedLocation(null);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showForm, showMapUploadForm, showGrid, isFullscreen, selectedLocation, handleSmartZoomIn, handleSmartZoomOut]);

  // Handle mouse leave to stop dragging
  useEffect(() => {
    const handleMouseUpGlobal = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUpGlobal);
      return () => window.removeEventListener('mouseup', handleMouseUpGlobal);
    }
  }, [isDragging]);

  // Force re-render when zoom or pan changes to update location positions
  useEffect(() => {
    // This effect forces a re-render when zoom or pan changes
    // ensuring location positions are recalculated correctly
  }, [zoom, pan]);

  // Force a re-render after mount so ref dimensions are non-null for marker positioning.
  useEffect(() => {
    if (!mounted) {
      // Next tick to ensure layout done
      const id = requestAnimationFrame(() => setMounted(true));
      return () => cancelAnimationFrame(id);
    }
  }, [mounted]);

  // Cleanup zoom timeout on unmount
  useEffect(() => {
    return () => {
      if (zoomTimeoutRef.current) {
        clearTimeout(zoomTimeoutRef.current);
      }
    };
  }, []);

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
    // Don't handle click if we just finished dragging
    if (hasDragged) {
      setHasDragged(false);
      return;
    }

    // Prevent adding location if clicking on a location marker
    const target = e.target as HTMLElement;
    if (target.closest('.location-marker')) {
      return;
    }

    const currentTime = Date.now();
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Check for double-click (within 300ms and roughly same position)
    const timeDiff = currentTime - lastClickTime;
    const positionDiff = Math.abs(mouseX - clickPosition.x) + Math.abs(mouseY - clickPosition.y);
    
    if (timeDiff < 300 && positionDiff < 20) {
      // Double-click detected - zoom in/out
      e.preventDefault();
      handleDoubleClickZoom(mouseX, mouseY);
      return;
    }

    // Single click - add location or select
    setLastClickTime(currentTime);
    setClickPosition({ x: mouseX, y: mouseY });

    // Only add location if creator, not showing form, and it's a deliberate click (not accidental)
    if (isCreator && !showForm && timeDiff > 100) {
      // Calculate position relative to the original map coordinates
      // Account for zoom and pan transformations
      const mapWidth = rect.width;
      const mapHeight = rect.height;
      
      // Convert screen coordinates to map coordinates
      const mapX = (mouseX - pan.x) / zoom;
      const mapY = (mouseY - pan.y) / zoom;
      
      // Convert to percentage coordinates (0-100)
      const x = (mapX / mapWidth) * 100;
      const y = (mapY / mapHeight) * 100;

      // Clamp coordinates to 0-100
      const clampedX = Math.max(0, Math.min(100, x));
      const clampedY = Math.max(0, Math.min(100, y));

      setFormData(prev => ({
        ...prev,
        x_coordinate: Math.round(clampedX * 10) / 10,
        y_coordinate: Math.round(clampedY * 10) / 10
      }));
      setShowForm(true);
    }
  };

  const handleDoubleClickZoom = (mouseX: number, mouseY: number) => {
    // Determine zoom action based on current zoom level
    let newZoom: number;
    if (zoom < 1.5) {
      newZoom = 2; // Zoom in
    } else if (zoom < 3) {
      newZoom = 4; // Zoom in more
    } else {
      newZoom = 1; // Reset to original
    }

    const zoomFactor = newZoom / zoom;
    
    // Adjust pan so zoom centers on click position
    const newPanX = mouseX - (mouseX - pan.x) * zoomFactor;
    const newPanY = mouseY - (mouseY - pan.y) * zoomFactor;
    
    // Set zooming state for visual feedback
    setIsZooming(true);
    
    // Clear existing timeout
    if (zoomTimeoutRef.current) {
      clearTimeout(zoomTimeoutRef.current);
    }
    
    // Set timeout to clear zooming state
    zoomTimeoutRef.current = setTimeout(() => {
      setIsZooming(false);
    }, 300);
    
    setZoom(newZoom);
    setPan({ x: newPanX, y: newPanY });
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedLocation(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left mouse button
    setIsDragging(true);
    setHasDragged(false); // Reset drag state
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Update mouse position for coordinate display
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate map coordinates
    const mapX = (mouseX - pan.x) / zoom;
    const mapY = (mouseY - pan.y) / zoom;
    const coordX = (mapX / rect.width) * 100;
    const coordY = (mapY / rect.height) * 100;
    
    setMousePosition({ 
      x: Math.max(0, Math.min(100, coordX)), 
      y: Math.max(0, Math.min(100, coordY)) 
    });
    
    if (!isDragging) return;
    
    // Mark that we've dragged (any movement while dragging)
    if (!hasDragged) {
      setHasDragged(true);
    }
    
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Don't reset hasDragged here - let the click handler check it
  };

  const handleWheel = (e: React.WheelEvent) => {
    // Disable wheel zoom - only allow panning if holding Ctrl
    if (e.ctrlKey) {
      e.preventDefault();
      
      // Only zoom if the wheel delta is significant enough (reduces accidental zooming)
      const wheelDelta = Math.abs(e.deltaY);
      if (wheelDelta < 5) return;
      
      // Reduce sensitivity - smaller zoom increments
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      
      // Get mouse position relative to the map container
      const rect = e.currentTarget.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const newZoom = Math.max(0.5, Math.min(5, zoom + delta));
      
      // Only apply zoom if there's actually a change
      if (Math.abs(newZoom - zoom) < 0.01) return;
      
      const zoomFactor = newZoom / zoom;
      
      // Adjust pan so zoom centers on mouse position
      const newPanX = mouseX - (mouseX - pan.x) * zoomFactor;
      const newPanY = mouseY - (mouseY - pan.y) * zoomFactor;
      
      // Set zooming state for visual feedback
      setIsZooming(true);
      
      // Clear existing timeout
      if (zoomTimeoutRef.current) {
        clearTimeout(zoomTimeoutRef.current);
      }
      
      // Set timeout to clear zooming state
      zoomTimeoutRef.current = setTimeout(() => {
        setIsZooming(false);
      }, 150);
      
      setZoom(newZoom);
      setPan({ x: newPanX, y: newPanY });
    }
    // If not holding Ctrl, let the browser handle scrolling normally
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const focusOnLocation = (location: MapLocation) => {
    setSelectedLocation(location.id);
    const container = mapContainerRef.current;
    if (!container) return;
    const width = container.clientWidth || 0;
    const height = container.clientHeight || 0;
    if (width === 0 || height === 0) return;

    const centerX = width / 2;
    const centerY = height / 2;
    const locationX = (location.x_coordinate / 100) * width * zoom;
    const locationY = (location.y_coordinate / 100) * height * zoom;
    const targetPanX = centerX - locationX;
    const targetPanY = centerY - locationY;
    setPan({ x: targetPanX, y: targetPanY });
    setZoom(Math.max(zoom, 1.5));
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
      {/* Help Panel */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-lg p-4 border border-indigo-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white mb-2">Interactive Map Controls</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-300">
          <div>
            <h4 className="font-medium text-white mb-1">Mouse Controls</h4>
            <ul className="space-y-1">
              <li>• Drag to pan the map</li>
              <li>• Click <strong>R</strong> to reset map size</li>
              <li>• Double-click <strong>locations</strong> to focus on them</li>
              <li>• Ctrl + Scroll to zoom (optional)</li>
              <li>• Click locations to select/deselect</li>
              {isCreator && <li>• <strong>Single click empty space</strong> to add location</li>}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-1">Keyboard Shortcuts</h4>
            <ul className="space-y-1">
              <li>• <kbd className="px-1 bg-gray-700 rounded">+/-</kbd> Zoom in/out</li>
              <li>• <kbd className="px-1 bg-gray-700 rounded">R</kbd> Reset view</li>
              <li>• <kbd className="px-1 bg-gray-700 rounded">G</kbd> Toggle grid</li>
              <li>• <kbd className="px-1 bg-gray-700 rounded">F</kbd> Fullscreen</li>
              <li>• <kbd className="px-1 bg-gray-700 rounded">Esc</kbd> Deselect/Exit</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-1">World Anvil-like Features</h4>
            <ul className="space-y-1">
              <li>• Rich location tooltips with coordinates</li>
              <li>• Smart zoom levels for detailed work</li>
              <li>• Grid overlay for precise positioning</li>
              <li>• Focus/pan to locations from list</li>
              <li>• Public/private location visibility</li>
              <li>• Color-coded location types</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Map className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">World Map</h2>
        </div>
        <div className="flex items-center space-x-2">
          {/* Map Controls */}
          <div className="flex items-center space-x-1 bg-gray-700 rounded-lg p-1">
            <button
              onClick={handleSmartZoomIn}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={handleSmartZoomOut}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-2 rounded transition-colors ${
                showGrid 
                  ? 'text-indigo-400 bg-gray-600' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-600'
              }`}
              title="Toggle Grid"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={handleReset}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded transition-colors"
              title="Reset View"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded transition-colors"
              title="Toggle Fullscreen"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
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
      

      {/* Map Info Panel */}
      <div className={`bg-black bg-opacity-70 text-white px-4 py-3 rounded-lg transition-all duration-200 ${
        isZooming ? 'bg-opacity-90 ring-2 ring-indigo-400' : ''
      }`}>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Move className="h-4 w-4" />
              <span>Drag to pan</span>
            </div>
            <div className={`transition-colors duration-200 ${
              isZooming ? 'text-indigo-300 font-semibold' : 'text-gray-300'
            }`}>
              Zoom: {Math.round(zoom * 100)}%
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-gray-700 px-2 py-1 rounded">Click R to reset the map size</span>
            </div>
            {isCreator && (
              <div className="flex items-center space-x-2">
                <Navigation className="h-4 w-4" />
                <span>Single click empty space to add location</span>
              </div>
            )}
          </div>
          <div className="text-xs text-gray-400 flex items-center space-x-4">
            <span>Pan: ({Math.round(pan.x)}, {Math.round(pan.y)})</span>
            {showCoordinates && isCreator && (
              <span className="text-yellow-300">
                Mouse: ({mousePosition.x.toFixed(1)}%, {mousePosition.y.toFixed(1)}%)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className={`bg-gray-800 rounded-lg border border-gray-700 ${
        isFullscreen ? 'fixed inset-0 z-40 p-4' : 'p-6'
      }`}>
        {isFullscreen && (
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">World Map - Fullscreen</h3>
            <button
              onClick={toggleFullscreen}
              className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              <Maximize2 className="h-5 w-5" />
            </button>
          </div>
        )}
        
        <div 
          ref={mapContainerRef}
          className={`relative rounded-lg border-2 border-gray-600 overflow-hidden ${
            isFullscreen ? 'h-full' : 'h-96'
          } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            handleMouseUp();
            setShowCoordinates(false);
          }}
          onMouseEnter={() => setShowCoordinates(true)}
          onWheel={handleWheel}
          onClick={handleMapClick}
        >
          {/* Background Image Layer - Fixed */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-800 to-blue-900"
            style={{
              backgroundImage: mapImage 
                ? `url('${mapImage}')`
                : `url('https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
              transition: isDragging ? 'none' : 'transform 0.15s ease-out'
            }}
          >
            {/* Map Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          </div>

          {/* Interactive Elements Layer - Positioned Absolutely */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Coordinate Display */}
            {showCoordinates && isCreator && (
              <div className="absolute top-2 right-2 bg-black bg-opacity-80 text-white px-3 py-2 rounded-lg text-sm font-mono border border-gray-600">
                <div className="text-xs text-gray-400 mb-1">Coordinates</div>
                <div>X: {mousePosition.x.toFixed(1)}%</div>
                <div>Y: {mousePosition.y.toFixed(1)}%</div>
              </div>
            )}
            
            {/* Dynamic Grid Lines */}
            {showGrid && (
              <div 
                className="absolute opacity-30 pointer-events-none"
                style={{
                  width: '100%',
                  height: '100%',
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: '0 0',
                  transition: isDragging ? 'none' : 'transform 0.15s ease-out'
                }}
              >
                {[...Array(21)].map((_, i) => (
                  <div key={`v-${i}`} className="absolute h-full w-px bg-white" style={{ left: `${i * 5}%` }} />
                ))}
                {[...Array(21)].map((_, i) => (
                  <div key={`h-${i}`} className="absolute w-full h-px bg-white" style={{ top: `${i * 5}%` }} />
                ))}
              </div>
            )}

            {/* Locations - Positioned relative to map */}
            {visibleLocations.map((location) => {
              // Compute container size on demand (robust vs cached state races)
              const container = mapContainerRef.current;
              const width = container?.clientWidth || 0;
              const height = container?.clientHeight || 0;
              const x = (location.x_coordinate / 100) * width * zoom + pan.x;
              const y = (location.y_coordinate / 100) * height * zoom + pan.y;
              return (
                <div
                  key={location.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group pointer-events-auto location-marker"
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                    transition: isDragging ? 'none' : 'all 0.15s ease-out'
                  }}
                >
                  <div 
                    className={`rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-125 transition-all duration-200 ${
                      typeColors[location.location_type as keyof typeof typeColors]
                    } ${
                      selectedLocation === location.id ? 'ring-4 ring-yellow-400 ring-opacity-60 scale-125' : ''
                    }`}
                    style={{
                      width: `${Math.max(12, 16 * zoom)}px`,
                      height: `${Math.max(12, 16 * zoom)}px`
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLocation(selectedLocation === location.id ? null : location.id);
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      // Double-click on location focuses on it instead of triggering form
                      focusOnLocation(location);
                    }}
                  >
                    {!location.is_public && isCreator && (
                      <EyeOff 
                        className="text-white absolute -top-1 -right-1" 
                        style={{
                          width: `${Math.max(8, 8 * zoom)}px`,
                          height: `${Math.max(8, 8 * zoom)}px`
                        }}
                      />
                    )}
                  </div>
                  
                  {/* Enhanced Location Tooltip */}
                  <div className={`absolute left-1/2 transform -translate-x-1/2 bg-gray-900 bg-opacity-95 text-white px-3 py-2 rounded-lg whitespace-nowrap transition-all duration-200 z-20 pointer-events-none border border-gray-600 shadow-xl ${
                    selectedLocation === location.id || zoom > 1.5 
                      ? 'opacity-100 scale-100' 
                      : 'opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100'
                  }`}
                  style={{
                    bottom: `${Math.max(24, 24 * zoom)}px`,
                    fontSize: `${Math.max(12, 12 * Math.min(zoom, 1.5))}px`,
                    maxWidth: '200px'
                  }}>
                    <div className="font-semibold text-yellow-300">{location.name}</div>
                    <div className="text-gray-300 capitalize flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${typeColors[location.location_type as keyof typeof typeColors]}`}></div>
                      {location.location_type}
                    </div>
                    {location.description && (
                      <div className="text-gray-400 text-xs mt-1 break-words">{location.description}</div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      ({location.x_coordinate.toFixed(1)}%, {location.y_coordinate.toFixed(1)}%)
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>

                  {/* Edit/Delete buttons for creators */}
                  {isCreator && (
                    <div className={`absolute left-1/2 transform -translate-x-1/2 flex space-x-1 transition-all duration-200 ${
                      selectedLocation === location.id 
                        ? 'opacity-100 scale-100' 
                        : 'opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100'
                    }`}
                    style={{
                      top: `${Math.max(24, 24 * zoom)}px`
                    }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(location);
                        }}
                        className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                        style={{
                          padding: `${Math.max(4, 6 * Math.min(zoom, 1.2))}px`
                        }}
                      >
                        <Edit style={{
                          width: `${Math.max(10, 12 * Math.min(zoom, 1.2))}px`,
                          height: `${Math.max(10, 12 * Math.min(zoom, 1.2))}px`
                        }} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(location.id);
                        }}
                        className="bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg"
                        style={{
                          padding: `${Math.max(4, 6 * Math.min(zoom, 1.2))}px`
                        }}
                      >
                        <Trash2 style={{
                          width: `${Math.max(10, 12 * Math.min(zoom, 1.2))}px`,
                          height: `${Math.max(10, 12 * Math.min(zoom, 1.2))}px`
                        }} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {/* No Map Overlay */}
          {!mapImage && isCreator && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-gray-800 p-6 rounded-lg text-center border border-gray-600">
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-white font-medium mb-1">No custom map uploaded</p>
                <p className="text-gray-400 text-sm mb-4">Using default map background</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMapUploadForm(true);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm transition-colors"
                >
                  Upload Custom Map
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
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    X Position (%)
                    <span className="text-xs text-gray-400 ml-2">Left ← → Right</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.x_coordinate}
                    onChange={(e) => setFormData(prev => ({ ...prev, x_coordinate: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Y Position (%)
                    <span className="text-xs text-gray-400 ml-2">Top ↑ ↓ Bottom</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.y_coordinate}
                    onChange={(e) => setFormData(prev => ({ ...prev, y_coordinate: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="bg-gray-700 p-3 rounded-lg">
                <div className="text-sm text-gray-300 mb-2">Location Preview:</div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${typeColors[formData.location_type as keyof typeof typeColors]}`}></div>
                  <span className="text-white font-medium">{formData.name || 'Unnamed Location'}</span>
                  <span className="text-gray-400 capitalize">({formData.location_type})</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Position: {formData.x_coordinate.toFixed(1)}%, {formData.y_coordinate.toFixed(1)}%
                  {!formData.is_public && <span className="ml-2 text-yellow-400">(Private)</span>}
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

      {/* Location Type Legend */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-md font-semibold text-white mb-3 flex items-center">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-2"></div>
          Location Types
        </h3>
        <div className="flex flex-wrap gap-3 text-xs">
          {locationTypes.map(type => {
            const count = visibleLocations.filter(loc => loc.location_type === type).length;
            return (
              <div key={type} className="flex items-center space-x-1 text-gray-300">
                <div className={`w-2 h-2 rounded-full ${typeColors[type as keyof typeof typeColors]}`}></div>
                <span className="capitalize">{type}</span>
                <span className="text-gray-500">({count})</span>
              </div>
            );
          })}
        </div>
      </div>

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
              <div 
                key={location.id} 
                className={`bg-gray-700 rounded-lg p-4 transition-all duration-200 hover:bg-gray-650 cursor-pointer ${
                  selectedLocation === location.id ? 'ring-2 ring-indigo-500 bg-gray-650' : ''
                }`}
                onClick={() => focusOnLocation(location)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${typeColors[location.location_type as keyof typeof typeColors]}`}></div>
                    <h4 className="font-semibold text-white">{location.name}</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!location.is_public && isCreator && (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        focusOnLocation(location);
                      }}
                      className="p-1 text-gray-400 hover:text-indigo-400 transition-colors"
                      title="Focus on map"
                    >
                      <Navigation className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-2 capitalize">{location.location_type}</p>
                {location.description && (
                  <p className="text-gray-400 text-sm">{location.description}</p>
                )}
                <div className="mt-3 text-xs text-gray-500">
                  Position: {location.x_coordinate.toFixed(1)}%, {location.y_coordinate.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}