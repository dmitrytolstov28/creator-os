"use client";

import {
  LucideIcon,
  TrendingUp,
} from "lucide-react";


type DataMetricProps = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
};


export default function DataMetric({
  label,
  value,
  icon: Icon,
  trend,
}: DataMetricProps) {


  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-emerald-400/20
        bg-white/[0.04]
        p-5
        backdrop-blur-xl
        transition-all
        duration-300
        hover:border-emerald-400/50
        hover:shadow-[0_0_35px_rgba(0,255,136,0.15)]
      "
    >


      {/* Glow layer */}

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-br
          from-emerald-400/10
          via-transparent
          to-transparent
          opacity-0
          transition
          group-hover:opacity-100
        "
      />



      <div className="relative z-10">


        <div className="flex items-center justify-between">


          <div className="flex items-center gap-3">


            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-emerald-400/20
                bg-emerald-400/10
              "
            >

              <Icon
                size={20}
                className="text-emerald-400"
              />

            </div>



            <p
              className="
                text-xs
                uppercase
                tracking-[0.2em]
                text-zinc-400
              "
            >
              {label}
            </p>


          </div>


        </div>



        <div className="mt-6">


          <p
            className="
              text-4xl
              font-bold
              tracking-tight
              text-white
            "
          >
            {value}
          </p>



          {trend && (

            <div
              className="
                mt-3
                flex
                items-center
                gap-2
                text-sm
                text-emerald-400
              "
            >

              <TrendingUp size={15}/>

              {trend}

            </div>

          )}


        </div>



        {/* Data line */}

        <div
          className="
            mt-5
            h-px
            w-full
            bg-gradient-to-r
            from-emerald-400/40
            via-emerald-400/10
            to-transparent
          "
        />


      </div>


    </div>
  );
}