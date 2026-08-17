"use client";

import { TrendingUp, Award } from "lucide-react";

import { Card } from "@/components/ui/card";


type VideoScoreProps = {
  views: number;
  likes: number;
  comments: number;
};



export default function VideoScore({
  views,
  likes,
  comments,
}: VideoScoreProps) {


  const engagement =
    views > 0
      ? ((likes + comments) / views) * 100
      : 0;



  let score = 0;


  // Engagement score (40 points)
  score += Math.min(
    engagement * 5,
    40
  );


  // Comment activity (25 points)
  const commentRate =
    views > 0
      ? (comments / views) * 100
      : 0;


  score += Math.min(
    commentRate * 10,
    25
  );


  // Reach score (35 points baseline)
  if (views > 1000) {
    score += 35;
  } else if (views > 500) {
    score += 25;
  } else if (views > 100) {
    score += 15;
  }



  score = Math.round(
    Math.min(score, 100)
  );



  let rating = "Needs Improvement";


  if (score >= 85) {
    rating = "Excellent";
  } else if (score >= 70) {
    rating = "Strong";
  } else if (score >= 50) {
    rating = "Average";
  }



  return (
    <Card className="border-zinc-800 bg-zinc-900 p-6">


      <div className="flex items-center gap-3">


        <div className="rounded-xl bg-violet-500/20 p-3">

          <Award
            className="text-violet-400"
            size={24}
          />

        </div>


        <div>

          <h2 className="text-xl font-semibold text-white">
            Performance Score
          </h2>

          <p className="text-sm text-zinc-400">
            Based on engagement and reach
          </p>

        </div>


      </div>




      <div className="mt-8 flex items-center justify-between">


        <div>

          <p className="text-6xl font-bold text-white">
            {score}
          </p>

          <p className="text-zinc-400">
            out of 100
          </p>

        </div>



        <div className="text-right">


          <div className="flex items-center gap-2 text-violet-400">

            <TrendingUp size={18} />

            {rating}

          </div>


          <p className="mt-2 text-sm text-zinc-400">
            {engagement.toFixed(1)}% engagement
          </p>


        </div>


      </div>


    </Card>
  );
}