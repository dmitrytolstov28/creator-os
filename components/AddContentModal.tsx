"use client";

import { useState } from "react";

import {
  Plus,
  X,
  Upload,
  Sparkles,
} from "lucide-react";

import { supabase } from "@/lib/supabase";


type AddContentModalProps = {
  onAdded?: () => void;
};



export default function AddContentModal({
  onAdded,
}: AddContentModalProps) {


  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("TikTok");
  const [views, setViews] = useState("");
  const [likes, setLikes] = useState("");
  const [comments, setComments] = useState("");

  const [loading, setLoading] = useState(false);





  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setLoading(true);



    const { error } = await supabase
      .from("videos")
      .insert({

        title,

        platform,

        views: Number(views),

        likes: Number(likes),

        comments: Number(comments),

        shares: 0,

        saves: 0,

        followers_gained: 0,

        created_at:
          new Date().toISOString(),

      });




    if (error) {

      console.error(error);

    } else {

      setTitle("");

      setViews("");

      setLikes("");

      setComments("");

      setOpen(false);

      onAdded?.();

    }



    setLoading(false);

  }





  return (

    <>


      <button

        onClick={() => setOpen(true)}

        className="
          flex
          items-center
          gap-2
          rounded-xl
          border
          border-emerald-400/30
          bg-emerald-400/10
          px-5
          py-3
          font-medium
          text-emerald-300
          transition
          hover:border-emerald-400/60
          hover:bg-emerald-400/20
          hover:text-white
        "

      >

        <Plus size={18}/>

        Add Content Node

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
              relative
              w-full
              max-w-lg
              rounded-2xl
              border
              border-emerald-400/20
              bg-[#050807]/90
              p-6
              shadow-[0_0_50px_rgba(0,255,136,0.15)]
              backdrop-blur-xl
            "

          >



            <div className="flex items-center justify-between">


              <div className="flex items-center gap-3">


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

                  <Upload
                    size={20}
                    className="text-emerald-400"
                  />

                </div>



                <div>

                  <p className="
                    text-xs
                    uppercase
                    tracking-[0.25em]
                    text-emerald-400/70
                  ">
                    Content System
                  </p>


                  <h2 className="text-xl font-semibold text-white">
                    Add Content Node
                  </h2>


                </div>


              </div>





              <button
                onClick={() => setOpen(false)}
              >

                <X
                  className="text-zinc-400 hover:text-white"
                />

              </button>


            </div>






            <form

              onSubmit={handleSubmit}

              className="mt-6 space-y-4"

            >


              <input

                value={title}

                onChange={(e) =>
                  setTitle(e.target.value)
                }

                placeholder="Content title"

                className="
                  w-full
                  rounded-xl
                  border
                  border-emerald-400/10
                  bg-black/30
                  p-3
                  text-white
                  outline-none
                  placeholder:text-zinc-600
                  focus:border-emerald-400/40
                "

              />





              <select

                value={platform}

                onChange={(e) =>
                  setPlatform(e.target.value)
                }

                className="
                  w-full
                  rounded-xl
                  border
                  border-emerald-400/10
                  bg-black/30
                  p-3
                  text-white
                  outline-none
                "

              >

                <option>
                  TikTok
                </option>

                <option>
                  YouTube
                </option>

                <option>
                  Instagram
                </option>


              </select>







              {[
                {
                  value: views,
                  set: setViews,
                  placeholder: "Views",
                },
                {
                  value: likes,
                  set: setLikes,
                  placeholder: "Likes",
                },
                {
                  value: comments,
                  set: setComments,
                  placeholder: "Comments",
                },

              ].map((item) => (

                <input

                  key={item.placeholder}

                  value={item.value}

                  onChange={(e) =>
                    item.set(e.target.value)
                  }

                  placeholder={item.placeholder}

                  type="number"

                  className="
                    w-full
                    rounded-xl
                    border
                    border-emerald-400/10
                    bg-black/30
                    p-3
                    text-white
                    outline-none
                    placeholder:text-zinc-600
                    focus:border-emerald-400/40
                  "

                />

              ))}







              <button

                disabled={loading}

                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-emerald-400/30
                  bg-emerald-400/10
                  py-3
                  font-semibold
                  text-emerald-300
                  transition
                  hover:bg-emerald-400/20
                  hover:text-white
                "

              >

                <Sparkles size={18}/>


                {loading
                  ? "Saving..."
                  : "Deploy Content"}

              </button>




            </form>


          </div>


        </div>

      )}


    </>

  );

}