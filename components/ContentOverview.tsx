"use client";

import { useEffect, useState } from "react";

import {
  Video,
  FileText,
  FolderKanban,
} from "lucide-react";

import StatCard from "@/components/StatCard";

import { supabase } from "@/lib/supabase";


export default function ContentOverview() {
  const [videos, setVideos] = useState(0);
  const [drafts, setDrafts] = useState(0);
  const [projects, setProjects] = useState(0);

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function loadCounts() {

      try {

        const videosResult = await supabase
          .from("videos")
          .select("id", {
            count: "exact",
            head: true,
          });


        const draftsResult = await supabase
          .from("drafts")
          .select("id", {
            count: "exact",
            head: true,
          });


        const projectsResult = await supabase
          .from("projects")
          .select("id", {
            count: "exact",
            head: true,
          });


        setVideos(
          videosResult.count ?? 0
        );

        setDrafts(
          draftsResult.count ?? 0
        );

        setProjects(
          projectsResult.count ?? 0
        );


      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    }


    void loadCounts();

  }, []);



  const stats = [
    {
      label: "Videos",
      value: loading ? "..." : videos,
      icon: Video,
    },

    {
      label: "Drafts",
      value: loading ? "..." : drafts,
      icon: FileText,
    },

    {
      label: "Projects",
      value: loading ? "..." : projects,
      icon: FolderKanban,
    },
  ];



  return (
    <div className="grid gap-6 md:grid-cols-3">

      {stats.map((stat) => (

        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
        />

      ))}

    </div>
  );
}