"use client";

import { useState } from "react";

import {
  X,
  Pencil,
  Sparkles,
} from "lucide-react";

import { supabase } from "@/lib/supabase";


type EditContentModalProps = {
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



export default function EditContentModal({
  video,
  onUpdated,
}: EditContentModalProps) {


  const [open, setOpen] = useState(false);


  const [title, setTitle] =
    useState(video.title);

  const [platform, setPlatform] =
    useState(video.platform);

  const [views, setViews] =
    useState(String(video.views));

  const [likes, setLikes] =
    useState(String(video.likes));

  const [comments, setComments] =
    useState(String(video.comments));


  const [loading, setLoading] =
    useState(false);





  async function handleSave(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setLoading(true);


    const { error } = await supabase
      .from("videos")
      .update({
        title,
        platform,
        views: Number(views),
        likes: Number(likes),
        comments: Number(comments),
      })
      .eq("id", video.id);



    if (error) {

      console.error(error);

    } else {

      setOpen(false);

      onUpdated?.();

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
          text-zinc-300
          transition
          hover:bg-emerald-400/10
          hover:text-white
        "

      >

        <Pencil
          size={16}
          className="text-emerald-400"
        />

        Edit Content

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

                  <Pencil
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
                    Content System
                  </p>


                  <h2 className="text-xl font-semibold text-white">
                    Edit Content Node
                  </h2>


                </div>


              </div>





              <button
                onClick={() => setOpen(false)}
              >

                <X
                  className="
                    text-zinc-400
                    hover:text-white
                  "
                />

              </button>


            </div>







            <form

              onSubmit={handleSave}

              className="mt-6 space-y-4"

            >


              <input

                value={title}

                onChange={(e) =>
                  setTitle(e.target.value)
                }

                placeholder="Title"

                className="
                  w-full
                  rounded-xl
                  border
                  border-emerald-400/10
                  bg-black/30
                  p-3
                  text-white
                  outline-none
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

              ].map((field) => (

                <input

                  key={field.placeholder}

                  value={field.value}

                  onChange={(e) =>
                    field.set(e.target.value)
                  }

                  type="number"

                  placeholder={field.placeholder}

                  className="
                    w-full
                    rounded-xl
                    border
                    border-emerald-400/10
                    bg-black/30
                    p-3
                    text-white
                    outline-none
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
                  ? "Updating..."
                  : "Deploy Changes"}

              </button>



            </form>


          </div>


        </div>

      )}


    </>

  );

}