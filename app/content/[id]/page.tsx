"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import VideoScore from "@/components/VideoScore";

import {
  Eye,
  Heart,
  MessageCircle,
  TrendingUp,
} from "lucide-react";

import { Card } from "@/components/ui/card";

import AppShell from "@/components/layout/AppShell";

import { supabase } from "@/lib/supabase";


type Video = {
  id: number;
  title: string;
  platform: string;
  views: number;
  likes: number;
  comments: number;
};


export default function VideoAnalyticsPage() {

  const params = useParams();

  const id = Number(params.id);


  const [video, setVideo] =
    useState<Video | null>(null);


  const [loading, setLoading] =
    useState(true);



  useEffect(() => {

    async function loadVideo() {

      const { data, error } =
        await supabase
          .from("videos")
          .select(
            "id, title, platform, views, likes, comments"
          )
          .eq("id", id)
          .single();


      if (error) {

        console.error(error);

      } else {

        setVideo(data);

      }


      setLoading(false);

    }


    if (id) {
      void loadVideo();
    }


  }, [id]);



  if (loading) {

    return (
      <AppShell>
        <div className="text-zinc-400">
          Loading analytics...
        </div>
      </AppShell>
    );

  }



  if (!video) {

    return (
      <AppShell>
        <div className="text-zinc-400">
          Video not found.
        </div>
      </AppShell>
    );

  }



  const engagement =
    video.views > 0
      ? (
          ((video.likes + video.comments) /
            video.views) *
          100
        ).toFixed(1)
      : "0";



  const stats = [
    {
      label: "Views",
      value: video.views.toLocaleString(),
      icon: Eye,
    },
    {
      label: "Likes",
      value: video.likes.toLocaleString(),
      icon: Heart,
    },
    {
      label: "Comments",
      value: video.comments.toLocaleString(),
      icon: MessageCircle,
    },
    {
      label: "Engagement",
      value: `${engagement}%`,
      icon: TrendingUp,
    },
  ];



  return (

    <AppShell>

      <div className="space-y-8">


        <div>

          <h1 className="text-4xl font-bold text-white">
            Video Analytics
          </h1>


          <p className="mt-2 text-zinc-400">
            {video.title}
          </p>


        </div>



        <div className="grid gap-6 md:grid-cols-4">


          {stats.map((stat) => {

            const Icon = stat.icon;


            return (

              <Card
                key={stat.label}
                className="border-zinc-800 bg-zinc-900 p-5"
              >

                <Icon
                  size={22}
                  className="text-violet-400"
                />


                <p className="mt-4 text-sm text-zinc-400">
                  {stat.label}
                </p>


                <p className="mt-1 text-2xl font-bold text-white">
                  {stat.value}
                </p>


              </Card>

            );

          })}


        </div>

<VideoScore
  views={video.views}
  likes={video.likes}
  comments={video.comments}
/>

        <Card className="border-violet-500/20 bg-violet-500/10 p-6">


          <h2 className="text-xl font-semibold text-white">
            AI Insight
          </h2>


          <p className="mt-3 text-zinc-300">

            This video has a {engagement}% engagement rate.
            Continue analyzing similar content to find
            patterns that perform best.

          </p>


        </Card>


      </div>


    </AppShell>

  );

}