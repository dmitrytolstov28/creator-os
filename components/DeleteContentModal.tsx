"use client";

import { useState } from "react";

import {
  Trash2,
  X,
  AlertTriangle,
} from "lucide-react";

import { supabase } from "@/lib/supabase";


type DeleteContentModalProps = {
  videoId: number;
  onDeleted?: () => void;
};



export default function DeleteContentModal({
  videoId,
  onDeleted,
}: DeleteContentModalProps) {


  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);



  async function handleDelete() {

    setLoading(true);



    const { error } = await supabase
      .from("videos")
      .delete()
      .eq("id", videoId);



    if (error) {

      console.error(error);

    } else {

      setOpen(false);

      onDeleted?.();

    }



    setLoading(false);

  }





  return (

    <>


      <button

        onClick={() => setOpen(true)}

        className="
          flex
          w-full
          items-center
          gap-3
          rounded-lg
          px-3
          py-2
          text-sm
          text-red-400
          transition
          hover:bg-red-400/10
          hover:text-red-300
        "

      >

        <Trash2 size={16}/>

        Delete Content

      </button>






      {open && (

        <div

          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/70
            backdrop-blur-sm
          "

        >


          <div

            className="
              w-full
              max-w-md
              rounded-2xl
              border
              border-emerald-400/20
              bg-[#050807]/90
              p-6
              shadow-[0_0_50px_rgba(255,50,50,0.12)]
              backdrop-blur-xl
            "

          >




            <div className="flex items-center justify-between">



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
                    border-red-400/30
                    bg-red-400/10
                  "

                >

                  <AlertTriangle
                    size={22}
                    className="text-red-400"
                  />

                </div>





                <div>

                  <p
                    className="
                      text-xs
                      uppercase
                      tracking-[0.25em]
                      text-red-400/70
                    "
                  >
                    Warning System
                  </p>


                  <h2 className="text-xl font-semibold text-white">
                    Delete Content
                  </h2>


                </div>


              </div>





              <button

                onClick={() => setOpen(false)}

              >

                <X
                  className="
                    text-zinc-400
                    transition
                    hover:text-white
                  "
                />

              </button>


            </div>







            <p className="mt-6 text-zinc-400">

              Are you sure you want to remove this content node?

              <br />

              This action cannot be undone.

            </p>







            <div className="mt-8 flex justify-end gap-3">



              <button

                onClick={() => setOpen(false)}

                className="
                  rounded-xl
                  border
                  border-emerald-400/20
                  px-4
                  py-2
                  text-zinc-300
                  transition
                  hover:bg-white/5
                  hover:text-white
                "

              >

                Cancel

              </button>







              <button

                onClick={handleDelete}

                disabled={loading}

                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-red-400/30
                  bg-red-400/10
                  px-4
                  py-2
                  text-red-300
                  transition
                  hover:bg-red-400/20
                  hover:text-white
                "

              >

                <Trash2 size={16}/>


                {loading
                  ? "Deleting..."
                  : "Delete"}

              </button>



            </div>




          </div>


        </div>

      )}


    </>

  );

}