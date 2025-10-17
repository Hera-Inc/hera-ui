"use client";

import { useEffect } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  onClose: (id: string) => void;
}

export function Toast({ id, message, type, duration = 5000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
    }
  };

  const getColors = () => {
    switch (type) {
      case "success":
        return "bg-green-500/20 border-green-500/50 text-green-200";
      case "error":
        return "bg-red-500/20 border-red-500/50 text-red-200";
      case "warning":
        return "bg-yellow-500/20 border-yellow-500/50 text-yellow-200";
      case "info":
        return "bg-blue-500/20 border-blue-500/50 text-blue-200";
    }
  };

  return (
    <div
      className={`${getColors()} backdrop-blur-sm border rounded-xl p-4 shadow-lg transform transition-all duration-300 ease-in-out animate-slide-in-right max-w-md`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{getIcon()}</span>
        <p className="flex-1 text-sm font-medium break-words">{message}</p>
        <button
          onClick={() => onClose(id)}
          className="flex-shrink-0 text-white/60 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export function ToastContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      <div className="pointer-events-auto">{children}</div>
    </div>
  );
}

