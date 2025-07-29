import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { WorldPDFExporter, fetchWorldExportData } from '../lib/worldPdfExport';

interface ExportWorldButtonProps {
  worldId: string;
  worldTitle: string;
  isCreator: boolean;
}

export function ExportWorldButton({ worldId, worldTitle, isCreator }: ExportWorldButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState('');

  // Only show button if user is the creator
  if (!isCreator) {
    return null;
  }

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setExportProgress('Gathering world data...');

      // Fetch all world data
      const exportData = await fetchWorldExportData(worldId);

      setExportProgress('Generating magical PDF...');

      // Create PDF
      const exporter = new WorldPDFExporter();
      const pdfBlob = await exporter.generateWorldPDF(exportData);

      setExportProgress('Preparing download...');

      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${worldTitle.replace(/[^a-zA-Z0-9]/g, '_')}_World_Archive.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportProgress('Complete!');
      setTimeout(() => {
        setExportProgress('');
        setIsExporting(false);
      }, 2000);

    } catch (error) {
      console.error('Error exporting world:', error);
      setExportProgress('Export failed. Please try again.');
      setTimeout(() => {
        setExportProgress('');
        setIsExporting(false);
      }, 3000);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleExport}
        disabled={isExporting}
        className={`
          flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200
          ${isExporting
            ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
          }
        `}
        title="Export complete world archive as PDF"
      >
        {isExporting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </>
        )}
      </button>

      {exportProgress && (
        <div className="absolute top-full left-0 mt-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-10">
          <div className="flex items-center">
            {exportProgress.includes('failed') ? (
              <span className="text-red-400">{exportProgress}</span>
            ) : exportProgress.includes('Complete') ? (
              <span className="text-green-400">✨ {exportProgress}</span>
            ) : (
              <>
                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                <span className="text-blue-400">{exportProgress}</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
