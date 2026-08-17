import { supabase } from "@/lib/supabase";



export type Video = {

  id: number;

  title: string;

  platform: string;


  // Future integrations
  thumbnail_url?: string | null;

  post_url?: string | null;


  views: number;

  likes: number;

  comments: number;

  shares: number;

  saves: number;

  followers_gained: number;


  created_at: string;


  topic?: string | null;

  content_type?: string | null;

};







export async function getVideos() {


  const { data, error } =
    await supabase
      .from("videos")
      .select("*")
      .order(
        "created_at",
        {
          ascending: true,
        }
      );



  if (error) {

    throw error;

  }



  return (data ?? []) as Video[];

}









export function calculateTotals(
  videos: Video[]
) {


  return {


    videos: videos.length,



    views: videos.reduce(
      (sum, video) =>
        sum + (video.views ?? 0),
      0
    ),




    likes: videos.reduce(
      (sum, video) =>
        sum + (video.likes ?? 0),
      0
    ),




    comments: videos.reduce(
      (sum, video) =>
        sum + (video.comments ?? 0),
      0
    ),




    shares: videos.reduce(
      (sum, video) =>
        sum + (video.shares ?? 0),
      0
    ),




    saves: videos.reduce(
      (sum, video) =>
        sum + (video.saves ?? 0),
      0
    ),




    followers: videos.reduce(
      (sum, video) =>
        sum + (video.followers_gained ?? 0),
      0
    ),


  };


}









export function getAverageViews(
  videos: Video[]
) {


  if(!videos.length) return 0;



  const totals =
    calculateTotals(
      videos
    );



  return Math.round(
    totals.views / videos.length
  );


}









export function getBestVideo(
  videos: Video[]
) {


  return [...videos].sort(
    (a,b)=>
      b.views - a.views
  )[0];


}









export function getBestPlatform(
  videos: Video[]
) {


  const platforms:
    Record<string,number> = {};



  videos.forEach((video)=>{


    platforms[video.platform] =

      (platforms[video.platform] || 0)

      +

      video.views;



  });




  return Object.entries(
    platforms
  ).sort(
    (a,b)=>
      b[1] - a[1]
  )[0];


}









export function getEngagementRate(
  videos: Video[]
) {


  const totals =
    calculateTotals(
      videos
    );



  if(!totals.views) return 0;




  return Number(

    (

      (

        (

          totals.likes +

          totals.comments +

          totals.shares

        )

        /

        totals.views

      )

      *

      100

    ).toFixed(1)

  );


}