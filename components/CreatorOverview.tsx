"use client";

import { useEffect, useState } from "react";

import {
  Eye,
  Video,
  Users,
  TrendingUp,
  Activity,
} from "lucide-react";


import DataMetric from "@/components/ui/DataMetric";


import {
  getVideos,
  calculateTotals,
  getAverageViews,
  getEngagementRate,
  Video as VideoType,
} from "@/lib/analytics";



export default function CreatorOverview() {

  const [videos, setVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {

    async function loadData() {

      try {

        const data = await getVideos();

        setVideos(data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    }


    void loadData();


  }, []);




  const totals = calculateTotals(videos);

  const averageViews = getAverageViews(videos);

  const engagement = getEngagementRate(videos);




  const stats = [
    {
      label: "Content Nodes",
      value: loading
        ? "..."
        : totals.videos,
      icon: Video,
      trend: "Active database",
    },

    {
      label: "Total Reach",
      value: loading
        ? "..."
        : totals.views.toLocaleString(),
      icon: Eye,
      trend: "Tracked views",
    },

    {
      label: "Audience Core",
      value: loading
        ? "..."
        : totals.followers.toLocaleString(),
      icon: Users,
      trend: "Followers connected",
    },

    {
      label: "Engagement Rate",
      value: loading
        ? "..."
        : `${engagement}%`,
      icon: TrendingUp,
      trend: "Performance signal",
    },
  ];



  return (

    <div className="space-y-6">


      {/* Header */}

      <div>

        <div className="flex items-center gap-2">

          <Activity
            size={18}
            className="text-emerald-400"
          />


          <p
            className="
              text-xs
              uppercase
              tracking-[0.3em]
              text-emerald-400/70
            "
          >
            Creator Intelligence System
          </p>


        </div>


        <h2
          className="
            mt-3
            text-2xl
            font-bold
            text-white
          "
        >
          Command Overview
        </h2>


        <p className="mt-1 text-sm text-zinc-400">

          Real-time content performance monitoring.

        </p>


      </div>




      {/* Metrics */}

      <div
        className="
          grid
          gap-5
          md:grid-cols-2
          xl:grid-cols-4
        "
      >

        {stats.map((stat) => (

          <DataMetric

            key={stat.label}

            label={stat.label}

            value={stat.value}

            icon={stat.icon}

            trend={stat.trend}

          />

        ))}


      </div>





      {/* Average Views Panel */}

      <div
        className="
          relative
          overflow-hidden
          rounded-2xl
          border
          border-emerald-400/20
          bg-white/[0.04]
          p-5
          backdrop-blur-xl
        "
      >


        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-emerald-400/10
            to-transparent
          "
        />



        <div className="relative z-10">


          <p
            className="
              text-xs
              uppercase
              tracking-[0.25em]
              text-zinc-400
            "
          >
            Average Performance Metric
          </p>



          <div className="mt-3 flex items-end gap-3">


            <p
              className="
                text-4xl
                font-bold
                text-white
              "
            >

              {loading
                ? "..."
                : averageViews.toLocaleString()}

            </p>


            <span className="mb-1 text-sm text-emerald-400">
              views / content
            </span>


          </div>


        </div>


      </div>



    </div>

  );

}