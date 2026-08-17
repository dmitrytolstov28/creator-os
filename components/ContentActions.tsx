"use client";

import {
  MoreVertical,
  BarChart3,
} from "lucide-react";

import { useState } from "react";
import Link from "next/link";

import EditContentModal from "@/components/EditContentModal";
import DeleteContentModal from "@/components/DeleteContentModal";


type ContentActionsProps = {
  video: {
    id: number;
    title: string;
    platform: string;
    views: number;
    likes: number;
    comments: number;
  };

  onUpdated?: () => void;
};


export default function ContentActions({
  video,
  onUpdated,
}: ContentActionsProps) {

  const [open, setOpen] = useState(false);


  return (
    <div className="relative">


      <button
        onClick={() => setOpen(!open)}
        className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
      >

        <MoreVertical size={18} />

      </button>



      {open && (

        <div className="absolute right-0 top-10 z-30 w-48 rounded-xl border border-zinc-800 bg-zinc-900 p-2 shadow-xl">


          <EditContentModal
            video={video}
            onUpdated={onUpdated}
          />



          <Link
            href={`/content/${video.id}`}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >

            <BarChart3 size={16} />

            View Analytics

          </Link>



          <DeleteContentModal
            videoId={video.id}
            onDeleted={onUpdated}
          />


        </div>

      )}


    </div>
  );
}