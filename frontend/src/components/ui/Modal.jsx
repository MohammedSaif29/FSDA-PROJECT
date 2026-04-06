import React from 'react';

export default function Modal({ open, title, onClose, children }) {
  if (!open) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content glass-panel rounded-2xl">
        <div className="modal-header">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">X</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
