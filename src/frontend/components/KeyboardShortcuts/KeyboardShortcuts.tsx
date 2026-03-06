import { X, Keyboard as KeyboardIcon } from 'lucide-react';
import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    { keys: ['Tab', '+', 'Enter'], description: 'Restart test' },
    { keys: ['Ctrl', '+', '/'], description: 'Show keyboard shortcuts' },
    { keys: ['Esc'], description: 'Unfocus typing area / Close dialogs' },
    { keys: ['Any key'], description: 'Start test / Focus typing area' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#323437] bg-opacity-90 animate-fade-in-up">
      <div className="w-full max-w-2xl mx-4 bg-[#2c2e31] rounded-lg border border-[#646669] border-opacity-20 p-8 font-sans-swift">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <KeyboardIcon className="w-6 h-6 text-[#e2b714]" />
            <h2 className="text-2xl text-[#d1d0c5]">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-md text-[#646669] hover:text-[#d1d0c5] hover:bg-[#323437] transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="space-y-4">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-[#323437] rounded-lg border border-[#646669] border-opacity-10"
            >
              <div className="flex items-center gap-2">
                {shortcut.keys.map((key, keyIndex) => (
                  <span key={keyIndex} className="flex items-center gap-2">
                    {key !== '+' ? (
                      <kbd className="px-3 py-2 bg-[#2c2e31] border border-[#646669] border-opacity-30 rounded text-[#d1d0c5] font-mono-swift text-sm">
                        {key}
                      </kbd>
                    ) : (
                      <span className="text-[#646669] text-sm">+</span>
                    )}
                  </span>
                ))}
              </div>
              <span className="text-[#646669] text-sm">{shortcut.description}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-[#646669] border-opacity-20">
          <p className="text-[#646669] text-sm text-center">
            Press{' '}
            <kbd className="px-2 py-1 bg-[#323437] rounded text-xs mx-1">Esc</kbd> to
            close this dialog
          </p>
        </div>
      </div>
    </div>
  );
}
