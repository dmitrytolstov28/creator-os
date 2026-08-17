"use client";

import { useEffect, useState } from "react";

import {
  Database,
  Play,
  FileText,
  FolderKanban,
  Activity,
} from "lucide-react";

import ContentCard from "@/components/ContentCard";
import ContentFilters from "@/components/ContentFilters";

import { supabase } from "@/lib/supabase";


const tabs = [
  {
    name: "All",
    icon: Database,
  },
  {
    name: "Published",
    icon: Play,
  },
  {
    name: "Drafts",
    icon: FileText,
  },
  {
    name: "Projects",
    icon: FolderKanban,
  },
];


type Video = {
  id: number;
  title: string;
  platform: string;
  views: number;
  likes: number;
  comments: number;
};


type ContentTabsProps = {
  refreshKey?: number;
  onRefresh?: () => void;
};



export default function ContentTabs({
  refreshKey,
  onRefresh,
}: ContentTabsProps) {


  const [active, setActive] = useState("All");

  const [videos, setVideos] =
    useState<Video[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [platform, setPlatform] =
    useState("All");

  const [sort, setSort] =
    useState("newest");





  useEffect(() => {

    async function loadVideos() {

      setLoading(true);


      const { data, error } =
        await supabase
          .from("videos")
          .select(
            "id,title,platform,views,likes,comments"
          )
          .order("created_at", {
            ascending: false,
          });



      if (error) {

        console.error(error);

      } else {

        setVideos(data ?? []);

      }


      setLoading(false);

    }


    void loadVideos();


  }, [refreshKey]);







  const filteredVideos = [...videos]

    .filter((video) => {

      const matchesSearch =
        video.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );


      const matchesPlatform =
        platform === "All" ||
        video.platform === platform;


      return (
        matchesSearch &&
        matchesPlatform
      );

    })


    .sort((a, b) => {


      if (sort === "views") {

        return b.views - a.views;

      }


      if (sort === "engagement") {

        const aRate =
          ((a.likes + a.comments) /
            a.views) || 0;


        const bRate =
          ((b.likes + b.comments) /
            b.views) || 0;


        return bRate - aRate;

      }


      return 0;

    });






  return (

    <div className="space-y-6">





      {/* Database Header */}

      <div
        className="
          flex
          items-center
          gap-3
          rounded-2xl
          border
          border-emerald-400/20
          bg-white/[0.03]
          p-4
          backdrop-blur-xl
        "
      >

        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            border
            border-emerald-400/30
            bg-emerald-400/10
          "
        >

          <Activity
            size={20}
            className="text-emerald-400"
          />

        </div>



        <div>

          <p
            className="
              text-xs
              uppercase
              tracking-[0.25em]
              text-emerald-400/70
            "
          >
            Content Intelligence
          </p>


          <p className="text-sm text-zinc-400">

            Manage and monitor content nodes

          </p>


        </div>


      </div>








      {/* Tabs */}

      <div
        className="
          rounded-2xl
          border
          border-emerald-400/20
          bg-white/[0.04]
          p-2
          backdrop-blur-xl
        "
      >

        <div className="flex flex-wrap gap-2">


          {tabs.map((tab) => {

            const Icon = tab.icon;

            const activeTab =
              active === tab.name;



            return (

              <button

                key={tab.name}

                onClick={() =>
                  setActive(tab.name)
                }

                className={`
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  px-5
                  py-3
                  text-sm
                  font-medium
                  transition-all

                  ${
                    activeTab

                    ?

                    `
                    border
                    border-emerald-400/40
                    bg-emerald-400/10
                    text-emerald-300
                    shadow-[0_0_20px_rgba(0,255,136,0.15)]
                    `

                    :

                    `
                    text-zinc-400
                    hover:bg-white/5
                    hover:text-white
                    `
                  }

                `}

              >

                <Icon size={16}/>

                {tab.name}


              </button>

            );

          })}


        </div>

      </div>







      {/* Filters */}

      <ContentFilters

        search={search}

        setSearch={setSearch}

        platform={platform}

        setPlatform={setPlatform}

        sort={sort}

        setSort={setSort}

      />








      {/* Content Nodes */}

      <div
        className="
          grid
          gap-6
          md:grid-cols-2
          xl:grid-cols-3
        "
      >


        {loading ? (

          <p className="text-emerald-400/70">

            Scanning content database...

          </p>


        ) : filteredVideos.length === 0 ? (


          <p className="text-zinc-400">

            No content nodes detected.

          </p>


        ) : (


          filteredVideos.map((video) => (

            <ContentCard

              key={video.id}

              id={video.id}

              title={video.title}

              platform={video.platform}

              views={video.views}

              likes={video.likes}

              comments={video.comments}

              status="Published"

              type="Video"

              onUpdated={onRefresh}

            />

          ))

        )}


      </div>



    </div>

  );

}