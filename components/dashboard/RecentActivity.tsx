"use client";

import { useEffect, useState } from "react";

import {
  Clock,
  Activity,
  Radio,
} from "lucide-react";

import { supabase } from "../../lib/supabase";


type ActivityItem = {
  id: string;
  title: string | null;
  status: string | null;
  updated_at: string | null;
};



export default function RecentActivity() {

  const [activities, setActivities] =
    useState<ActivityItem[]>([]);



  useEffect(() => {

    async function loadActivity() {

      const { data } = await supabase
        .from("content_drafts")
        .select("id,title,status,updated_at")
        .order("updated_at", {
          ascending: false,
        })
        .limit(5);



      setActivities(data ?? []);

    }


    void loadActivity();


  }, []);




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

            <Radio
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
              Activity Stream
            </p>


            <p className="text-sm text-emerald-400">
              Live creator operations
            </p>


          </div>


        </div>





        {/* Timeline */}

        <div className="mt-6 space-y-4">


          {activities.length === 0 ? (

            <p className="text-sm text-zinc-500">
              No recent activity detected.
            </p>


          ) : (


            activities.map((activity) => (

              <div
                key={activity.id}
                className="
                  flex
                  gap-4
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
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    bg-emerald-400/10
                  "
                >

                  <Activity
                    size={15}
                    className="text-emerald-400"
                  />

                </div>




                <div className="flex-1">


                  <p className="font-medium text-white">

                    {activity.title ?? "Untitled Draft"}

                  </p>



                  <div
                    className="
                      mt-2
                      flex
                      items-center
                      justify-between
                      text-xs
                      text-zinc-400
                    "
                  >

                    <span className="text-emerald-400">
                      {activity.status ?? "Unknown"}
                    </span>


                    <span className="flex items-center gap-1">

                      <Clock size={12}/>

                      {activity.updated_at
                        ? new Date(
                            activity.updated_at
                          ).toLocaleDateString()
                        : "-"}

                    </span>


                  </div>


                </div>


              </div>


            ))

          )}


        </div>


      </div>


    </div>

  );

}