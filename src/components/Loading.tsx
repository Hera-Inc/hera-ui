import React from "react";

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export function Loading({ message = "Loading...", fullScreen = true }: LoadingProps) {
  const containerClass = fullScreen 
    ? "min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center"
    : "flex items-center justify-center py-12";

  return (
    <div className={containerClass}>
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-purple-200 text-lg">{message}</p>
      </div>
    </div>
  );
}

export function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div className={`${sizeClasses[size]} border-purple-500 border-t-transparent rounded-full animate-spin`}></div>
  );
}

