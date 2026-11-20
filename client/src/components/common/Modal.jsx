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
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Box */}
      <div
        className={`relative bg-[#091126] text-white rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.8)] border border-indigo-500/30 w-full ${maxWidth} overflow-hidden z-10 transform transition-all animate-in fade-in zoom-in-95 duration-200 my-8`}
      >
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-indigo-950/80 bg-[#070d20]">
          <div>
            <h3 className="text-base font-extrabold text-white tracking-tight">{title}</h3>
            {subtitle && <p className="text-xs text-slate-300 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-800/50 transition-colors"
            aria-label="Close Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 max-h-[calc(85vh-8rem)] overflow-y-auto text-slate-200">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
