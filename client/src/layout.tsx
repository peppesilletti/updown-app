import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function Layout({ children, className = "" }: LayoutProps) {
  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <div className="absolute inset-0 z-0 bg-black bg-opacity-50 backdrop-blur-md"></div>

      <div className="absolute inset-0 z-10 opacity-50 bg-gradient-to-r from-cyan-500 to-purple-500"></div>

      <div className="relative z-20 p-6 bg-gray-900 bg-opacity-75 border border-gray-800">
        <div className="absolute inset-0 overflow-hidden">
          <div className="circuit-lines"></div>
        </div>

        <div className="relative z-30 space-y-6 text-cyan-300">{children}</div>
      </div>
    </div>
  );
}
