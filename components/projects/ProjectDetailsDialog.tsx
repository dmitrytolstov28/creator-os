"use client";

import { useEffect, useState } from "react";

import {
  FolderOpen,
  Layers,
  CalendarClock,
  CheckCircle2,
} from "lucide-react";

import { supabase } from "@/lib/supabase";


type Props = {
  id: string;
  name: string;
  drafts: number;
  scheduled: number;
  posted: number;
  color: string;
};


type Draft = {
  id: string;
  title: string | null;
  status: string | null;
};



export default function ProjectDetailsDialog({
  id,
  name,
  drafts,
  scheduled,
  posted,
  color,
}: Props) {


  const [content, setContent] = useState<Draft[]>([]);



  useEffect(() => {

    async function loadContent() {

      const { data, error } = await supabase
        .from("content_drafts")
        .select(
          "id,title,status"
        )
        .eq(
          "project_id",
          id
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );


      if (error) {

        console.error(error);

        return;

      }


      setContent(data ?? []);

    }


    void loadContent();


  }, [id]);



  return (

    <div
      className="
        mt-6
        rounded-2xl
        border
        border-emerald-400/20
        bg-white/[0.04]
        p-6
        backdrop-blur-xl
      "
    >


      <div className="flex items-center gap-4">


        <div
          className={`
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            border
            border-emerald-400/30
            bg-emerald-400/10
            ${color}
          `}
        >

          <FolderOpen
            size={26}
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
            Project Intelligence
          </p>


          <h2 className="mt-1 text-2xl font-bold text-white">
            {name}
          </h2>


        </div>


      </div>





      <div
        className="
          mt-8
          grid
          grid-cols-3
          gap-4
        "
      >


        <div className="rounded-xl bg-black/20 p-4">

          <Layers className="text-emerald-400"/>

          <p className="mt-2 text-zinc-400">
            Drafts
          </p>

          <p className="text-3xl font-bold text-white">
            {drafts}
          </p>

        </div>




        <div className="rounded-xl bg-black/20 p-4">

          <CalendarClock className="text-emerald-400"/>

          <p className="mt-2 text-zinc-400">
            Scheduled
          </p>

          <p className="text-3xl font-bold text-white">
            {scheduled}
          </p>

        </div>





        <div className="rounded-xl bg-black/20 p-4">

          <CheckCircle2 className="text-emerald-400"/>

          <p className="mt-2 text-zinc-400">
            Posted
          </p>

          <p className="text-3xl font-bold text-white">
            {posted}
          </p>

        </div>


      </div>





      <div className="mt-8">

        <h3 className="text-lg font-semibold text-white">
          Content Pipeline
        </h3>


        <div className="mt-4 space-y-3">


          {content.length === 0 ? (

            <p className="text-zinc-500">
              No drafts assigned yet.
            </p>


          ) : (


            content.map((draft) => (

              <div
                key={draft.id}
                className="
                  rounded-xl
                  border
                  border-emerald-400/10
                  bg-black/20
                  p-4
                "
              >

                <p className="font-medium text-white">
                  {draft.title ?? "Untitled Draft"}
                </p>


                <p className="text-sm text-emerald-400">
                  {draft.status ?? "Draft"}
                </p>


              </div>

            ))

          )}


        </div>


      </div>


    </div>

  );

}