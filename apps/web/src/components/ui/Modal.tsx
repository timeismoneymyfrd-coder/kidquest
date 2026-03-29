import React from 'react';
import { ModalProps } from '../../types';
import Button from './Button';

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, actions }) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="glass-panel w-full max-w-md">
          {title && (
            <div className="border-b border-white/10 p-4">
              <h2 className="text-xl font-display font-bold text-white">{title}</h2>
            </div>
          )}
          <div className="p-4">
            {children}
          </div>
          {actions && (
            <div className="border-t border-white/10 p-4 flex gap-2 justify-end">
              {actions.map((action, idx) => (
                <Button
                  key={idx}
                  variant={action.variant || 'secondary'}
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Modal;
