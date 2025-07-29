import React, { useState, useRef } from 'react';
import { Bold, Italic, Underline, Strikethrough, Link, Eye, EyeOff } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
  disabled?: boolean;
  maxLength?: number;
  showPreview?: boolean;
}

interface SelectionRange {
  start: number;
  end: number;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start typing...",
  className = "",
  rows = 4,
  disabled = false,
  maxLength,
  showPreview = true
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [selectionRange, setSelectionRange] = useState<SelectionRange | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Save selection range when textarea loses focus
  const saveSelection = () => {
    if (textareaRef.current) {
      const { selectionStart, selectionEnd } = textareaRef.current;
      setSelectionRange({ start: selectionStart, end: selectionEnd });
    }
  };

  // Get current selection or saved selection
  const getCurrentSelection = (): SelectionRange => {
    if (textareaRef.current && document.activeElement === textareaRef.current) {
      return {
        start: textareaRef.current.selectionStart,
        end: textareaRef.current.selectionEnd
      };
    }
    return selectionRange || { start: 0, end: 0 };
  };

  // Apply markdown formatting
  const applyFormatting = (formatType: string) => {
    const selection = getCurrentSelection();
    const selectedText = value.substring(selection.start, selection.end);
    
    let formattedText = '';
    let newSelectionStart = selection.start;
    let newSelectionEnd = selection.end;

    switch (formatType) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        newSelectionStart = selection.start + 2;
        newSelectionEnd = selection.end + 2;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        newSelectionStart = selection.start + 1;
        newSelectionEnd = selection.end + 1;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        newSelectionStart = selection.start + 3;
        newSelectionEnd = selection.end + 3;
        break;
      case 'strikethrough':
        formattedText = `~~${selectedText}~~`;
        newSelectionStart = selection.start + 2;
        newSelectionEnd = selection.end + 2;
        break;
      default:
        return;
    }

    const newValue = value.substring(0, selection.start) + formattedText + value.substring(selection.end);
    onChange(newValue);

    // Restore selection after formatting
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        if (selectedText) {
          textareaRef.current.setSelectionRange(newSelectionStart, newSelectionEnd);
        } else {
          textareaRef.current.setSelectionRange(newSelectionStart, newSelectionStart);
        }
      }
    }, 0);
  };

  // Handle link insertion
  const handleLinkClick = () => {
    const selection = getCurrentSelection();
    const selectedText = value.substring(selection.start, selection.end);
    
    setLinkText(selectedText);
    setLinkUrl('');
    setShowLinkDialog(true);
  };

  const insertLink = () => {
    const selection = getCurrentSelection();
    const linkMarkdown = `[${linkText || 'link text'}](${linkUrl})`;
    
    const newValue = value.substring(0, selection.start) + linkMarkdown + value.substring(selection.end);
    onChange(newValue);
    
    setShowLinkDialog(false);
    setLinkText('');
    setLinkUrl('');
    
    // Focus back to textarea
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newPosition = selection.start + linkMarkdown.length;
        textareaRef.current.setSelectionRange(newPosition, newPosition);
      }
    }, 0);
  };

  // Convert markdown to HTML for preview
  const convertToHtml = (text: string): string => {
    return text
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Underline (using HTML <u> tags)
      .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
      // Strikethrough
      .replace(/~~(.*?)~~/g, '<del>$1</del>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:text-indigo-300 underline">$1</a>')
      // Line breaks
      .replace(/\n/g, '<br>');
  };

  const toolbarButtons = [
    { icon: Bold, action: () => applyFormatting('bold'), title: 'Bold (Ctrl+B)', shortcut: 'Ctrl+B' },
    { icon: Italic, action: () => applyFormatting('italic'), title: 'Italic (Ctrl+I)', shortcut: 'Ctrl+I' },
    { icon: Underline, action: () => applyFormatting('underline'), title: 'Underline (Ctrl+U)', shortcut: 'Ctrl+U' },
    { icon: Strikethrough, action: () => applyFormatting('strikethrough'), title: 'Strikethrough', shortcut: '' },
    { icon: Link, action: handleLinkClick, title: 'Insert Link (Ctrl+K)', shortcut: 'Ctrl+K' },
  ];

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          applyFormatting('bold');
          break;
        case 'i':
          e.preventDefault();
          applyFormatting('italic');
          break;
        case 'u':
          e.preventDefault();
          applyFormatting('underline');
          break;
        case 'k':
          e.preventDefault();
          handleLinkClick();
          break;
      }
    }
  };

  return (
    <div className={`border border-gray-600 rounded-lg bg-gray-700 ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-600">
        <div className="flex items-center space-x-1">
          {toolbarButtons.map((button, index) => (
            <button
              key={index}
              type="button"
              onClick={button.action}
              onMouseDown={(e) => e.preventDefault()} // Prevent textarea from losing focus
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded transition-colors"
              title={button.title}
              disabled={disabled}
            >
              <button.icon className="h-4 w-4" />
            </button>
          ))}
        </div>
        
        {showPreview && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400">
              {isPreviewMode ? 'Preview' : 'Edit'}
            </span>
            <button
              type="button"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded transition-colors"
              title={isPreviewMode ? 'Switch to Edit Mode' : 'Switch to Preview Mode'}
              disabled={disabled}
            >
              {isPreviewMode ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
          </div>
        )}
      </div>

      {/* Editor/Preview Area */}
      <div className="relative">
        {isPreviewMode ? (
          <div 
            className="p-4 min-h-[100px] text-gray-200 prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: convertToHtml(value) || '<p class="text-gray-400 italic">Nothing to preview...</p>' }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={saveSelection}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full px-4 py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none resize-none border-0"
            style={{ minHeight: `${rows * 1.5}rem` }}
            disabled={disabled}
            maxLength={maxLength}
          />
        )}
      </div>

      {/* Character count */}
      {maxLength && (
        <div className="px-3 py-1 border-t border-gray-600 text-xs text-gray-400 text-right">
          {value.length}/{maxLength}
        </div>
      )}

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">Insert Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Link Text
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Enter link text..."
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowLinkDialog(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={insertLink}
                disabled={!linkUrl.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formatting Help */}
      <div className="px-3 py-2 border-t border-gray-600 text-xs text-gray-400">
        <details className="cursor-pointer">
          <summary className="hover:text-gray-300">Formatting Help</summary>
          <div className="mt-2 space-y-1">
            <p><strong>**bold**</strong> • <em>*italic*</em> • <u>&lt;u&gt;underline&lt;/u&gt;</u> • <del>~~strikethrough~~</del></p>
            <p>Links: [link text](url)</p>
            <p>Shortcuts: Ctrl+B (bold), Ctrl+I (italic), Ctrl+U (underline), Ctrl+K (link)</p>
          </div>
        </details>
      </div>
    </div>
  );
};
