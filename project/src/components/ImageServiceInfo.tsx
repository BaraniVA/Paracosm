import { useState } from 'react';
import { Info, X, AlertTriangle, CheckCircle } from 'lucide-react';

interface ImageServiceInfoProps {
  show: boolean;
  onClose: () => void;
}

export function ImageServiceInfo({ show, onClose }: ImageServiceInfoProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Image Hosting Information</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="space-y-6">
          {/* ImgBB Section */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <img 
                src="https://api.imgbb.com/favicon.ico" 
                alt="ImgBB" 
                className="w-5 h-5"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <h4 className="font-semibold text-white">ImgBB (Current Service)</h4>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">
                    <strong>Free unlimited storage</strong> - No storage limits
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">
                    <strong>32MB file size limit</strong> - Suitable for most images
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">
                    <strong>No deletion support</strong> - Images cannot be deleted once uploaded
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    When you delete an image from your gallery, it's only removed from your world - the image remains hosted on ImgBB servers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cloudinary Section */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <img 
                src="https://cloudinary.com/favicon.ico" 
                alt="Cloudinary" 
                className="w-5 h-5"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <h4 className="font-semibold text-white">Cloudinary (Alternative)</h4>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">
                    <strong>25GB storage + 25GB bandwidth</strong> - Free tier
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">
                    <strong>Full deletion support</strong> - Can delete images from servers
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">
                    <strong>Requires additional setup</strong> - Need to configure cloud name and upload preset
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Section */}
          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Info className="h-4 w-4 text-blue-400" />
              <h4 className="font-semibold text-blue-300">Privacy & Access</h4>
            </div>
            <div className="text-blue-200 text-sm space-y-2">
              <p>
                • Images are only visible in the specific world where they're uploaded
              </p>
              <p>
                • Access is controlled by your world's privacy settings and inhabitant permissions
              </p>
              <p>
                • Image URLs are stored in your Supabase database, not shared publicly
              </p>
              <p>
                • Use the "Visible to all inhabitants" checkbox to control who can see each image
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-600">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}

interface ImageServiceBadgeProps {
  imageUrl: string;
}

export function ImageServiceBadge({ imageUrl }: ImageServiceBadgeProps) {
  const [showInfo, setShowInfo] = useState(false);
  
  const getServiceInfo = (url: string) => {
    if (url.includes('i.ibb.co') || url.includes('ibb.co')) {
      return { name: 'ImgBB', color: 'bg-green-600', deletable: false };
    }
    if (url.includes('res.cloudinary.com')) {
      return { name: 'Cloudinary', color: 'bg-blue-600', deletable: true };
    }
    return { name: 'External', color: 'bg-gray-600', deletable: false };
  };

  const service = getServiceInfo(imageUrl);

  return (
    <>
      <div className="flex items-center space-x-2">
        <span className={`px-2 py-1 text-xs rounded text-white ${service.color}`}>
          {service.name}
        </span>
        {!service.deletable && (
          <button
            onClick={() => setShowInfo(true)}
            className="p-1 hover:bg-gray-700 rounded"
            title="This image cannot be deleted from the hosting service"
          >
            <Info className="h-3 w-3 text-yellow-400" />
          </button>
        )}
      </div>

      <ImageServiceInfo 
        show={showInfo} 
        onClose={() => setShowInfo(false)} 
      />
    </>
  );
}
