import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: "purple" | "blue" | "green" | "orange" | "red" | "slate";
  hover?: boolean;
}

export function Card({ children, className = "", gradient = "purple", hover = false }: CardProps) {
  const gradientClasses = {
    purple: "from-purple-900/30 to-pink-900/30 border-purple-500/20",
    blue: "from-blue-900/30 to-cyan-900/30 border-blue-500/20",
    green: "from-green-900/30 to-emerald-900/30 border-green-500/20",
    orange: "from-orange-900/30 to-red-900/30 border-orange-500/20",
    red: "from-red-900/30 to-orange-900/30 border-red-500/20",
    slate: "from-slate-800/50 to-slate-900/50 border-purple-500/20",
  };

  const hoverClass = hover ? "hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 cursor-pointer" : "";

  return (
    <div
      className={`bg-gradient-to-br ${gradientClasses[gradient]} backdrop-blur-sm border rounded-3xl p-8 transition-all ${hoverClass} ${className}`}
    >
      {children}
    </div>
  );
}

interface InfoCardProps {
  icon: string;
  label: string;
  value: string | number;
  gradient?: "purple" | "blue" | "green" | "orange";
}

export function InfoCard({ icon, label, value, gradient = "purple" }: InfoCardProps) {
  const gradientClasses = {
    purple: "from-purple-900/30 to-pink-900/30 border-purple-500/20 text-purple-300",
    blue: "from-blue-900/30 to-cyan-900/30 border-blue-500/20 text-blue-300",
    green: "from-green-900/30 to-emerald-900/30 border-green-500/20 text-green-300",
    orange: "from-orange-900/30 to-red-900/30 border-orange-500/20 text-orange-300",
  };

  return (
    <div className={`bg-gradient-to-br ${gradientClasses[gradient]} backdrop-blur-sm border rounded-2xl p-6`}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className={`text-sm mb-1 ${gradientClasses[gradient].split(" ")[3]}`}>{label}</div>
      <div className="text-white text-xl font-bold">{value}</div>
    </div>
  );
}

