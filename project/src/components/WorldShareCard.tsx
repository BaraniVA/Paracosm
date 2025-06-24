import React, { useState } from 'react';
import { Share, Copy, X, Download, Globe } from 'lucide-react';
import html2canvas from 'html2canvas';
import { UserLink } from './UserLink';

interface World {
  id: string;
  title: string;
  description: string;
  laws: string[];
  creator_id: string;
  creator: { id: string; username: string };
}

interface WorldShareCardProps {
  world: World;
  isOpen: boolean;
  onClose: () => void;
}

export function WorldShareCard({ world, isOpen, onClose }: WorldShareCardProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}/world/${world.id}`;
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };  const downloadCard = async () => {
    const cardElement = document.getElementById('world-share-card');
    if (!cardElement) return;

    try {
      // Store original styles
      const originalOverflow = cardElement.style.overflow;
      const originalHeight = cardElement.style.height;
      const originalMaxHeight = cardElement.style.maxHeight;
      const originalTransform = cardElement.style.transform;
      
      // Temporarily modify styles to ensure full content is visible
      cardElement.style.overflow = 'visible';
      cardElement.style.height = 'auto';
      cardElement.style.maxHeight = 'none';
      cardElement.style.transform = 'none';
      cardElement.style.position = 'static';
      
      // Force layout recalculation
      void cardElement.offsetHeight;
      
      // Wait longer for any layout adjustments and ensure full rendering
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get the actual rendered dimensions after style changes
      const rect = cardElement.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(cardElement);      // Calculate proper dimensions including padding, borders, and extra space for border
      const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
      const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
      const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
      const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
      const borderWidth = parseFloat(computedStyle.borderWidth) || 3; // Account for dashed border
      const elementMargin = 8; // The margin we added to the element
      
      // Add extra margin to ensure border is fully captured
      const extraMargin = 15; // Increased to ensure full border capture
      const totalWidth = rect.width + paddingLeft + paddingRight + (borderWidth * 2) + (elementMargin * 2) + (extraMargin * 2);
      const totalHeight = Math.max(rect.height + paddingTop + paddingBottom + (borderWidth * 2) + (elementMargin * 2) + (extraMargin * 2), 370);
        // Capture the ticket element as canvas with background
      const canvas = await html2canvas(cardElement, {
        backgroundColor: '#dbeafe', // Blue-50 background to match the ticket
        scale: 2, // Good balance between quality and performance
        useCORS: true,
        allowTaint: true,
        width: totalWidth,
        height: totalHeight,
        x: -extraMargin, // Start capture slightly before the element
        y: -extraMargin, // Start capture slightly above the element
        scrollX: 0,
        scrollY: 0,
        logging: false,
        removeContainer: false,
        foreignObjectRendering: false,        ignoreElements: (element) => {
          // Ignore any absolutely positioned elements that might interfere
          return (element as HTMLElement).style?.position === 'absolute' && element !== cardElement;
        },        onclone: (clonedDoc) => {
          // Ensure all content is visible in the cloned document
          const clonedElement = clonedDoc.getElementById('world-share-card');
          if (clonedElement) {
            clonedElement.style.overflow = 'visible';
            clonedElement.style.height = 'auto';
            clonedElement.style.maxHeight = 'none';
            clonedElement.style.minHeight = '310px';
            clonedElement.style.transform = 'none';
            clonedElement.style.position = 'static';
            clonedElement.style.display = 'block';
            clonedElement.style.visibility = 'visible';
            clonedElement.style.border = '3px dashed #3b82f6'; // Ensure border is preserved
            clonedElement.style.borderRadius = '12px';
            clonedElement.style.margin = '8px';
            clonedElement.style.boxSizing = 'border-box';
            
            // Ensure all child elements are visible and properly sized
            const allElements = clonedElement.querySelectorAll('*');
            allElements.forEach(el => {
              if (el instanceof HTMLElement) {
                el.style.overflow = 'visible';
                el.style.maxHeight = 'none';
                el.style.visibility = 'visible';
                el.style.opacity = '1';
                // Ensure text elements don't get clipped
                if (el.tagName === 'P' || el.tagName === 'SPAN' || el.tagName === 'H1' || 
                    el.tagName === 'H2' || el.tagName === 'H3' || el.tagName === 'H4' || 
                    el.tagName === 'H5' || el.tagName === 'H6') {
                  el.style.whiteSpace = 'normal';
                  el.style.wordWrap = 'break-word';
                }
              }
            });
          }
        }
      });
      
      // Restore original styles
      cardElement.style.overflow = originalOverflow;
      cardElement.style.height = originalHeight;
      cardElement.style.maxHeight = originalMaxHeight;
      cardElement.style.transform = originalTransform;

      // Create a new canvas with padding and background
      const finalCanvas = document.createElement('canvas');
      const ctx = finalCanvas.getContext('2d');
      if (!ctx) return;

      const padding = 60; // Increased padding to prevent any cropping
      finalCanvas.width = canvas.width + (padding * 2);
      finalCanvas.height = canvas.height + (padding * 2);

      // Fill background with a gradient or solid color
      const gradient = ctx.createLinearGradient(0, 0, 0, finalCanvas.height);
      gradient.addColorStop(0, '#1e293b'); // Dark slate
      gradient.addColorStop(1, '#334155'); // Lighter slate
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

      // Draw the ticket in the center with proper positioning
      ctx.drawImage(canvas, padding, padding, canvas.width, canvas.height);

      // Convert final canvas to blob
      finalCanvas.toBlob((blob) => {
        if (!blob) return;
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute('href', url);
        downloadAnchorNode.setAttribute('download', `${world.title.replace(/\s+/g, '_')}_ticket.png`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        document.body.removeChild(downloadAnchorNode);
        
        // Clean up the URL object
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (error) {
      console.error('Error downloading card:', error);
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-xl max-w-4xl w-full shadow-2xl border border-slate-700 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <Share className="h-6 w-6 mr-3 text-blue-400" />
            Share World
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>        {/* Share Card Preview */}
        <div className="p-6">          <div 
            id="world-share-card"
            className="relative bg-blue-50 shadow-lg mb-6"
            style={{
              borderRadius: '12px',
              border: '3px dashed #3b82f6',
              minHeight: '310px',
              height: 'auto',
              overflow: 'visible',
              contain: 'layout',
              margin: '8px', // Add margin to ensure border isn't clipped
              boxSizing: 'border-box'
            }}
          >            {/* Horizontal layout */}
            <div className="flex h-full min-h-[310px]">{/* Main ticket body */}
              <div className="flex-1 p-4 flex flex-col justify-between">{/* Header section */}
                <div className="mb-3">
                  <h5 className="text-blue-600 text-xs uppercase tracking-wider font-semibold mb-2">
                    TICKET TO MY WORLD
                  </h5>
                  <h4 className="text-xl font-bold text-blue-900 mb-1 leading-tight">
                    {truncateText(world.title, 50)}
                  </h4>                  <p className="text-blue-700 text-xs">
                    Created by <UserLink userId={world.creator.id} username={world.creator.username} className="text-blue-700" />
                  </p>
                </div>

                {/* Content - single column layout */}
                <div className="flex-1 space-y-3">
                  {/* Description */}
                  <div>
                    <h6 className="text-blue-600 text-xs uppercase tracking-wider font-semibold mb-1">
                      DESCRIPTION
                    </h6>
                    <p className="text-blue-800 text-xs leading-snug">
                      {truncateText(world.description, 150)}
                    </p>
                  </div>                  {/* World Laws */}
                  <div>
                    <h6 className="text-blue-600 text-xs uppercase tracking-wider font-semibold mb-1">
                      WORLD LAWS
                    </h6>
                    <div className="space-y-0.5">
                      {world.laws.slice(0, 2).map((law, index) => (
                        <div key={index} className="flex items-start space-x-1">
                          <span className="text-blue-600 text-xs font-medium min-w-[12px] flex-shrink-0">
                            {index + 1}.
                          </span>
                          <p className="text-blue-800 text-xs leading-snug">
                            {truncateText(law, 150)}
                          </p>
                        </div>
                      ))}
                      {world.laws.length > 2 && (
                        <p className="text-blue-600 text-xs italic ml-3">
                          +{world.laws.length - 2} more laws...
                        </p>
                      )}
                    </div>
                  </div>
                </div>                {/* Footer */}
                <div className="flex items-center justify-between pt-3 mt-2 border-t border-blue-200">
                  <div className="flex items-center space-x-1">
                    <Globe className="h-3 w-3 text-blue-600 flex-shrink-0" />
                    <span className="text-blue-700 text-xs font-semibold">PARACOSM</span>
                  </div>
                  <span className="text-blue-600 text-xs font-medium">
                    Explore & Build Worlds
                  </span>
                </div>
              </div>              {/* Ticket stub */}
              <div className="w-18 bg-blue-100 border-l-2 border-dashed border-blue-400 flex flex-col items-center justify-between py-0 px-1 self-stretch">
                <div className="flex-1 flex items-center justify-center">
                  <div className="transform -rotate-90 origin-center whitespace-nowrap">
                    <span className="text-blue-700 text-md font-bold tracking-wide">ADMIT ONE</span>
                  </div>
                </div>
                
                <div className="space-y-1 flex flex-col items-center my-4">
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                </div>
                
                <div className="flex-1 flex items-center justify-center">
                  <div className="transform rotate-90 origin-center whitespace-nowrap">
                    <span className="text-blue-600 text-md font-mono">
                      #{world.id.slice(-6).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>{/* Share Options */}
          <div className="space-y-4">
            {/* URL Copy */}
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 bg-slate-800 text-slate-200 text-sm px-4 py-3 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
              />
              <button
                onClick={copyToClipboard}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  copied 
                    ? 'bg-green-600 text-white shadow-lg' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                }`}
              >
                {copied ? (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Copied!
                  </span>
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={downloadCard}
                className="flex-1 flex items-center justify-center px-4 py-3 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Card
              </button>
              <button
                onClick={copyToClipboard}
                className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
              >
                <Share className="h-4 w-4 mr-2" />
                Share Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
