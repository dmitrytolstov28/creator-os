"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  Plus,
  Video,
  PlayCircle,
  BarChart3,
  Eye,
  Heart,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";

import {
  getVideos,
  Video as VideoType,
  calculateTotals,
} from "@/lib/analytics";





function PlatformBadge({
  platform,
}: {
  platform: string;
}) {


  const name = platform.toLowerCase();




  if (
    name.includes("youtube") ||
    name.includes("yt")
  ) {

    return (

      <div
        className="
        flex
        items-center
        gap-2
        rounded-lg
        bg-black/70
        px-3
        py-1.5
        text-sm
        font-semibold
        text-white
        "
      >

        <span
          className="
          flex
          h-5
          w-5
          items-center
          justify-center
          rounded-md
          bg-red-500
          text-[10px]
          font-bold
          "
        >
          ▶
        </span>

        YouTube

      </div>

    );

  }







  if (
    name.includes("tiktok") ||
    name.includes("tik tok") ||
    name.includes("tik")
  ) {

    return (

      <div
        className="
        flex
        items-center
        gap-2
        rounded-lg
        bg-black/70
        px-3
        py-1.5
        text-sm
        font-semibold
        text-white
        "
      >

        <span
          className="
          flex
          h-5
          w-5
          items-center
          justify-center
          rounded-md
          bg-white
          text-black
          text-xs
          font-bold
          "
        >
          ♪
        </span>

        TikTok

      </div>

    );

  }







  if (
    name.includes("instagram") ||
    name.includes("insta") ||
    name.includes("ig")
  ) {

    return (

      <div
        className="
        flex
        items-center
        gap-2
        rounded-lg
        bg-black/70
        px-3
        py-1.5
        text-sm
        font-semibold
        text-white
        "
      >

        <span
          className="
          flex
          h-5
          w-5
          items-center
          justify-center
          rounded-md
          bg-gradient-to-tr
          from-yellow-400
          via-pink-500
          to-purple-600
          text-xs
          font-bold
          "
        >
          ◎
        </span>

        Instagram

      </div>

    );

  }







  return (

    <div
      className="
      flex
      items-center
      gap-2
      rounded-lg
      bg-black/70
      px-3
      py-1.5
      text-sm
      font-semibold
      text-white
      "
    >

      <span>
        •
      </span>

      {platform}

    </div>

  );


}









export default function VideosPage(){


  const [videos,setVideos] =
  useState<VideoType[]>([]);


  const [loading,setLoading] =
  useState(true);








  useEffect(()=>{


    async function loadVideos(){


      try{


        const data =
        await getVideos();


        setVideos(data);



      }catch(error){


        console.error(error);



      }finally{


        setLoading(false);


      }


    }



    void loadVideos();



  },[]);








  const totals =
  calculateTotals(videos);









  return (

    <AppShell>


      <div className="space-y-8">








        <div className="
        flex
        items-start
        justify-between
        ">


          <div>


            <p className="
            text-xs
            uppercase
            tracking-[0.3em]
            text-emerald-400/70
            ">

              Content Creation

            </p>



            <h1 className="
            mt-3
            text-5xl
            font-bold
            text-white
            ">

              Video Library

            </h1>



            <p className="
            mt-2
            text-zinc-400
            ">

              Manage your published content and track performance.

            </p>


          </div>







          <Link

            href="/videos/new"

            className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-emerald-400
            px-5
            py-3
            font-semibold
            text-black
            hover:bg-emerald-300
            "

          >

            <Plus size={18}/>

            Add Published Video

          </Link>



        </div>









        <div className="
        grid
        gap-4
        md:grid-cols-3
        ">


          <div className="
          rounded-2xl
          border
          border-emerald-400/20
          bg-white/[0.04]
          p-5
          ">

            <Video
              size={22}
              className="text-emerald-400"
            />


            <p className="mt-3 text-sm text-zinc-400">

              Total Videos

            </p>


            <p className="
            mt-2
            text-3xl
            font-bold
            text-white
            ">

              {totals.videos}

            </p>


          </div>







          <div className="
          rounded-2xl
          border
          border-emerald-400/20
          bg-white/[0.04]
          p-5
          ">


            <PlayCircle
              size={22}
              className="text-emerald-400"
            />


            <p className="mt-3 text-sm text-zinc-400">

              Published

            </p>


            <p className="
            mt-2
            text-3xl
            font-bold
            text-white
            ">

              {videos.length}

            </p>


          </div>







          <div className="
          rounded-2xl
          border
          border-emerald-400/20
          bg-white/[0.04]
          p-5
          ">


            <BarChart3
              size={22}
              className="text-emerald-400"
            />


            <p className="mt-3 text-sm text-zinc-400">

              Total Views

            </p>


            <p className="
            mt-2
            text-3xl
            font-bold
            text-white
            ">

              {totals.views.toLocaleString()}

            </p>


          </div>


        </div>









        <div
          className="
          grid
          gap-6
          grid-cols-[repeat(auto-fill,minmax(240px,280px))]
          justify-start
          "
        >





          {
            videos.map((video)=>(


              <Link

                key={video.id}

                href={`/videos/${video.id}`}

                className="
                w-full
                max-w-[280px]
                rounded-2xl
                border
                border-emerald-400/20
                bg-white/[0.04]
                p-4
                transition
                hover:border-emerald-400/50
                hover:-translate-y-1
                "

              >







                <div className="
                relative
                overflow-hidden
                rounded-xl
                bg-black
                ">





                  {
                    video.thumbnail_url ? (

                      <img

                        src={video.thumbnail_url}

                        alt={video.title}

                        className="
                        aspect-[9/13]
                        w-full
                        object-cover
                        "

                      />


                    ) : (


                      <div className="
                      flex
                      aspect-[9/13]
                      items-center
                      justify-center
                      text-zinc-600
                      ">

                        <Video size={45}/>

                      </div>


                    )

                  }






                  <div className="
                  absolute
                  left-3
                  top-3
                  ">

                    <PlatformBadge
                      platform={video.platform}
                    />

                  </div>






                  <div className="
                  absolute
                  bottom-3
                  left-3
                  flex
                  items-center
                  gap-2
                  rounded-lg
                  bg-black/80
                  px-3
                  py-1.5
                  text-sm
                  font-semibold
                  text-white
                  ">

                    <Eye size={15}/>

                    {video.views.toLocaleString()}

                  </div>





                </div>









                <div className="
                mt-5
                space-y-4
                ">



                  <h2 className="
                  text-lg
                  font-bold
                  leading-tight
                  text-white
                  ">

                    {video.title}

                  </h2>







                  <div className="
                  space-y-2
                  text-sm
                  text-zinc-300
                  ">



                    <div className="flex items-center gap-3">

                      <Eye size={16}/>

                      {video.views.toLocaleString()} views

                    </div>





                    <div className="flex items-center gap-3">

                      <Heart size={16}/>

                      {video.likes.toLocaleString()} likes

                    </div>





                    <div className="flex items-center gap-3">

                      <MessageCircle size={16}/>

                      {video.comments.toLocaleString()} comments

                    </div>



                  </div>








                  <div className="
                  flex
                  items-center
                  justify-between
                  border-t
                  border-white/10
                  pt-3
                  text-sm
                  text-zinc-500
                  ">


                    <span>

                      {
                        new Date(video.created_at)
                        .toLocaleDateString()
                      }

                    </span>


                    <MoreHorizontal size={18}/>


                  </div>





                </div>





              </Link>


            ))

          }




        </div>







      </div>


    </AppShell>

  );

}