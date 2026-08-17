"use client";

import {
  Lightbulb,
  Sparkles,
  Brain,
} from "lucide-react";


const insights = [
  "Your most active content stage is Drafts.",
  "Scheduling more posts will improve consistency.",
  "Your top-performing project currently has the most drafts.",
  "Try posting at least 3 times this week to stay on pace.",
];


export default function InsightsCard() {

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


      {/* AI Glow */}

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

            <Brain
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
              Intelligence Core
            </p>


            <p className="text-sm text-emerald-400">
              AI Performance Analysis
            </p>


          </div>


        </div>





        {/* Insights */}

        <div className="mt-6 space-y-3">


          {insights.map((insight, index) => (

            <div
              key={insight}
              className="
                flex
                gap-3
                rounded-xl
                border
                border-emerald-400/10
                bg-black/20
                p-4
                transition
                hover:border-emerald-400/30
              "
            >

              <div
                className="
                  mt-1
                  flex
                  h-6
                  w-6
                  items-center
                  justify-center
                  rounded-full
                  bg-emerald-400/10
                  text-xs
                  text-emerald-400
                "
              >

                {index + 1}

              </div>



              <p className="text-sm text-zinc-300">
                {insight}
              </p>


            </div>

          ))}


        </div>




        {/* AI Status */}

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

          <Sparkles size={16}/>

          AI system analyzing creator behavior patterns

        </div>


      </div>


    </div>

  );
}