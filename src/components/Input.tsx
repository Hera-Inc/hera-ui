import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({ label, error, helperText, className = "", ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-purple-200 mb-2 font-medium">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 bg-slate-800/50 border ${
          error ? "border-red-500/50" : "border-purple-500/30"
        } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
          error ? "focus:ring-red-500" : "focus:ring-purple-500"
        } transition-all ${className}`}
        {...props}
      />
      {error && (
        <p className="text-red-400 text-sm mt-1">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-purple-300 text-sm mt-1">{helperText}</p>
      )}
    </div>
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function TextArea({ label, error, helperText, className = "", ...props }: TextAreaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-purple-200 mb-2 font-medium">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-4 py-3 bg-slate-800/50 border ${
          error ? "border-red-500/50" : "border-purple-500/30"
        } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
          error ? "focus:ring-red-500" : "focus:ring-purple-500"
        } transition-all resize-none ${className}`}
        {...props}
      />
      {error && (
        <p className="text-red-400 text-sm mt-1">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-purple-300 text-sm mt-1">{helperText}</p>
      )}
    </div>
  );
}

