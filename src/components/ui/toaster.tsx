'use client';

import { useState, useEffect } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

let toastQueue: Toast[] = [];
let listeners: ((toasts: Toast[]) => void)[] = [];

export function toast(message: string, type: 'success' | 'error' | 'info' = 'info') {
  const id = Math.random().toString(36).substring(7);
  const newToast = { id, message, type };
  
  toastQueue.push(newToast);
  listeners.forEach(listener => listener([...toastQueue]));
  
  setTimeout(() => {
    toastQueue = toastQueue.filter(t => t.id !== id);
    listeners.forEach(listener => listener([...toastQueue]));
  }, 5000);
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    listeners.push(setToasts);
    return () => {
      listeners = listeners.filter(listener => listener !== setToasts);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-md px-4 py-3 text-white shadow-lg ${
            toast.type === 'success' ? 'bg-green-600' :
            toast.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}