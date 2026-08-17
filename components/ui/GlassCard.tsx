"use client";

import { ReactNode } from "react";


type GlassCardProps = {
  children: ReactNode;
  className?: string;
  glow?: boolean;
};


export function GlassCard({
  children,
  className = "",
  glow = true,
}: GlassCardProps) {

  return (
    <div
      className={`
        relative
        overflow-hidden
        rounded-2xl
        border
        border-emerald-400/20
        bg-white/[0.04]
        backdrop-blur-xl
        shadow-[0_0_30px_rgba(0,255,136,0.08)]
        transition-all
        duration-300
        hover:border-emerald-400/40
        hover:shadow-[0_0_40px_rgba(0,255,136,0.15)]
        ${glow ? "" : "shadow-none"}
        ${className}
      `}
    >

      {/* futuristic light effect */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-br
          from-emerald-400/10
          via-transparent
          to-transparent
          opacity-60
        "
      />


      <div className="relative z-10">
        {children}
      </div>


    </div>
  );
}