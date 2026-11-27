import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Box */}
      <div
        className={`relative bg-[#13110e] text-stone-100 rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.85)] border border-amber-500/30 w-full ${maxWidth} overflow-hidden z-10 transform transition-all animate-fade-up my-8`}
      >
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-stone-800 bg-[#0d0b09]">
          <div>
            <h3 className="text-base font-extrabold text-white tracking-tight">{title}</h3>
            {subtitle && <p className="text-xs text-stone-400 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-amber-300 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/30 transition-colors"
            aria-label="Close Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 max-h-[calc(85vh-8rem)] overflow-y-auto text-stone-200">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
