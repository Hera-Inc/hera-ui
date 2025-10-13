import React from "react";

type Status = "ACTIVE" | "INACTIVE" | "CLAIMABLE" | "COMPLETED" | "success" | "warning" | "error" | "info";

interface StatusBadgeProps {
  status: Status;
  children?: React.ReactNode;
}

export function StatusBadge({ status, children }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "ACTIVE":
      case "success":
        return "bg-green-500/20 border-green-500/30 text-green-300";
      case "CLAIMABLE":
      case "warning":
        return "bg-yellow-500/20 border-yellow-500/30 text-yellow-300";
      case "COMPLETED":
      case "INACTIVE":
      case "info":
        return "bg-gray-500/20 border-gray-500/30 text-gray-300";
      case "error":
        return "bg-red-500/20 border-red-500/30 text-red-300";
      default:
        return "bg-purple-500/20 border-purple-500/30 text-purple-300";
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyles()}`}>
      {children || status}
    </span>
  );
}

