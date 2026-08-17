"use client";

import {
  ShieldCheck,
  Zap,
} from "lucide-react";


type CreatorScoreProps = {
  score: number;
};


export default function CreatorScore({
  score,
}: CreatorScoreProps) {


  const level =
    score >= 90
      ? "ELITE"
      : score >= 75
      ? "ADVANCED"
      : score >= 50
      ? "DEVELOPING"
      : "INITIALIZING";



  const metrics = [
    {
      label: "Engagement",
      value: Math.min(score + 5, 100),
    },
    {
      label: "Consistency",
      value: Math.max(Math.min(score - 5, 100), 0),
    },
    {
      label: "Growth",
      value: Math.min(score + 12, 100),
    },
  ];



  return (

    <div
      className="
        relative
        overflow-hidden
        rounded-2xl
        border
        border-emerald-400/20
        bg-white/[0.04]
        p-6
        backdrop-blur-xl
        shadow-[0_0_40px_rgba(0,255,136,0.08)]
      "
    >


      {/* Glow */}

      <div
        className="
          absolute
          -right-20
          -top-20
          h-64
          w-64
          rounded-full
          bg-emerald-400/10
          blur-3xl
        "
      />



      <div className="relative z-10">


        <div className="flex items-center gap-3">


          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              border
              border-emerald-400/30
              bg-emerald-400/10
            "
          >

            <ShieldCheck
              size={22}
              className="text-emerald-400"
            />

          </div>



          <div>

            <p
              className="
                text-xs
                uppercase
                tracking-[0.25em]
                text-zinc-400
              "
            >
              Creator Performance Core
            </p>


            <p className="text-sm text-emerald-400">
              System Rating: {level}
            </p>


          </div>


        </div>




        <div className="mt-8 flex items-center gap-8">


          <div>

            <p
              className="
                text-7xl
                font-bold
                text-white
              "
            >
              {score}
            </p>


            <p className="text-zinc-400">
              / 100
            </p>


          </div>




          <div className="flex-1 space-y-4">


            {metrics.map((metric) => (

              <div key={metric.label}>


                <div className="mb-2 flex justify-between text-xs">

                  <span className="text-zinc-400">
                    {metric.label}
                  </span>


                  <span className="text-emerald-400">
                    {metric.value}%
                  </span>


                </div>



                <div
                  className="
                    h-2
                    overflow-hidden
                    rounded-full
                    bg-white/10
                  "
                >

                  <div
                    className="
                      h-full
                      rounded-full
                      bg-emerald-400
                      shadow-[0_0_15px_rgba(0,255,136,0.8)]
                    "
                    style={{
                      width: `${metric.value}%`,
                    }}
                  />


                </div>


              </div>

            ))}


          </div>


        </div>




        <div
          className="
            mt-8
            flex
            items-center
            gap-2
            text-sm
            text-emerald-400
          "
        >

          <Zap size={16}/>

          <span>
            Performance systems operating normally
          </span>


        </div>


      </div>


    </div>

  );
}