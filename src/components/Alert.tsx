import React from "react";

interface AlertProps {
  type?: "info" | "success" | "warning" | "error";
  title?: string;
  children: React.ReactNode;
  icon?: string;
}

export function Alert({ type = "info", title, children, icon }: AlertProps) {
  const typeStyles = {
    info: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      text: "text-blue-200",
      icon: icon || "ℹ️",
    },
    success: {
      bg: "bg-green-500/10",
      border: "border-green-500/30",
      text: "text-green-200",
      icon: icon || "✅",
    },
    warning: {
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/30",
      text: "text-yellow-200",
      icon: icon || "⚠️",
    },
    error: {
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      text: "text-red-200",
      icon: icon || "❌",
    },
  };

  const styles = typeStyles[type];

  return (
    <div className={`${styles.bg} border ${styles.border} rounded-xl p-6`}>
      <div className="flex items-start gap-3">
        <div className="text-2xl">{styles.icon}</div>
        <div className="flex-1">
          {title && (
            <h3 className="text-white font-bold mb-2">{title}</h3>
          )}
          <div className={`${styles.text} text-sm`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

