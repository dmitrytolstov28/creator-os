"use client";

import {
  Flame,
  Activity,
} from "lucide-react";


type Props = {
  streak?: number;
};


export default function StreakCard({
  streak = 7,
}: Props) {


  const message =
    streak >= 30
      ? "Maximum consistency achieved."
      : streak >= 14
      ? "Strong creator momentum detected."
      : streak >= 7
      ? "Momentum is building."
      : "Begin establishing consistency.";



  const progress = Math.min(
    (streak / 30) * 100,
    100
  );


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
        shadow-[0_0_35px_rgba(0,255,136,0.08)]
      "
    >


      {/* Glow */}

      <div
        className="
          absolute
          -left-20
          top-10
          h-60
          w-60
          rounded-full
          bg-emerald-400/10
          blur-3xl
        "
      />



      <div className="relative z-10">


        {/* Header */}

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

            <Flame
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
              Consistency Engine
            </p>


            <p className="text-sm text-emerald-400">
              Creator Activity Tracking
            </p>


          </div>


        </div>





        {/* Main Number */}

        <div className="mt-8 flex items-end gap-3">


          <p
            className="
              text-7xl
              font-bold
              text-white
            "
          >
            {streak}
          </p>


          <p
            className="
              mb-3
              text-zinc-400
            "
          >
            days
          </p>


        </div>





        {/* Progress */}

        <div className="mt-6">


          <div
            className="
              mb-2
              flex
              justify-between
              text-xs
            "
          >

            <span className="text-zinc-400">
              30 Day Goal
            </span>


            <span className="text-emerald-400">
              {Math.round(progress)}%
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
                width: `${progress}%`,
              }}
            />

          </div>


        </div>





        <div
          className="
            mt-6
            flex
            items-center
            gap-2
            text-sm
            text-emerald-400
          "
        >

          <Activity size={16}/>

          <span>
            {message}
          </span>


        </div>


      </div>


    </div>

  );
}