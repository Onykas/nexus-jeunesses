'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  }, []);

  const remove = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  useEffect(() => {
    (window as any).__nexusToast = addToast;
  }, [addToast]);

  const icons = { success: CheckCircle, error: XCircle, info: Info };
  const colors = {
    success: 'border-brand-green text-brand-green',
    error: 'border-brand-red text-brand-red',
    info: 'border-navy text-navy',
  };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      <div
        className="fixed top-24 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
        aria-live="polite"
        aria-label="Notifications"
      >
        <AnimatePresence>
          {toasts.map(({ id, message, type }) => {
            const Icon = icons[type];
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className={`pointer-events-auto bg-white rounded-xl shadow-card-hover border-l-4 px-4 py-3 flex items-start gap-3 ${colors[type]}`}
              >
                <Icon size={18} className="flex-shrink-0 mt-0.5" />
                <p className="font-inter text-[#212121] text-sm flex-1">{message}</p>
                <button
                  onClick={() => remove(id)}
                  className="text-gray-400 hover:text-[#212121] transition-colors"
                  aria-label="Fermer"
                >
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function toast(message: string, type: ToastType = 'info') {
  if (typeof window !== 'undefined' && (window as any).__nexusToast) {
    (window as any).__nexusToast(message, type);
  }
}
