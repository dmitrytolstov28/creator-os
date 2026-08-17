"use client";


export default function TechBackground() {

  return (

    <div
      className="
        pointer-events-none
        fixed
        inset-0
        -z-10
        overflow-hidden
        bg-[#020604]
      "
    >


      {/* Green ambient glow */}

      <div
        className="
          absolute
          left-1/2
          top-0
          h-[600px]
          w-[600px]
          -translate-x-1/2
          rounded-full
          bg-emerald-500/10
          blur-[140px]
        "
      />



      {/* Grid */}

      <div
        className="
          absolute
          inset-0
          opacity-[0.08]
          [background-image:linear-gradient(rgba(0,255,136,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.4)_1px,transparent_1px)]
          [background-size:60px_60px]
        "
      />



      {/* Digital scan line */}

      <div
        className="
          absolute
          left-0
          right-0
          top-1/3
          h-px
          bg-emerald-400/20
          shadow-[0_0_40px_rgba(0,255,136,0.8)]
        "
      />


    </div>

  );

}