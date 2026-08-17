"use client";

import Link from "next/link";

import {
  Brain,
  Calendar,
  FileText,
  FolderKanban,
  Sparkles,
  Zap,
} from "lucide-react";



const actions = [
  {
    title: "Generate Content",
    description: "Create new content assets",
    href: "/content-studio",
    icon: Sparkles,
  },
  {
    title: "Draft Library",
    description: "Manage unfinished ideas",
    href: "/drafts",
    icon: FileText,
  },
  {
    title: "Calendar",
    description: "Schedule publishing",
    href: "/calendar",
    icon: Calendar,
  },
  {
    title: "Projects",
    description: "Organize content systems",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    title: "AI Coach",
    description: "Get creator intelligence",
    href: "/coach",
    icon: Brain,
  },
];



export default function QuickActions() {

  return (

    <div
      className="
        relative
        overflow-hidden
        rounded-2xl
        border
        border-emerald-400/20
        bg-white/[0.04]
        p-6
        backdrop-blur-xl
        shadow-[0_0_35px_rgba(0,255,136,0.08)]
      "
    >


      {/* Glow */}

      <div
        className="
          absolute
          -right-20
          -top-20
          h-60
          w-60
          rounded-full
          bg-emerald-400/10
          blur-3xl
        "
      />



      <div className="relative z-10">


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
              border-emerald-400/30
              bg-emerald-400/10
            "
          >

            <Zap
              size={22}
              className="text-emerald-400"
            />

          </div>



          <div>

            <p
              className="
                text-xs
                uppercase
                tracking-[0.25em]
                text-zinc-400
              "
            >
              Operations Center
            </p>


            <p className="text-sm text-emerald-400">
              Quick Creator Actions
            </p>


          </div>


        </div>





        <div className="mt-6 grid gap-4 md:grid-cols-2">


          {actions.map((action) => {

            const Icon = action.icon;


            return (

              <Link

                key={action.title}

                href={action.href}

                className="
                  group
                  flex
                  items-center
                  gap-4
                  rounded-xl
                  border
                  border-emerald-400/10
                  bg-black/20
                  p-4
                  transition-all
                  duration-300
                  hover:border-emerald-400/40
                  hover:bg-emerald-400/5
                "

              >


                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-emerald-400/20
                    bg-emerald-400/10
                  "
                >

                  <Icon
                    size={20}
                    className="
                      text-emerald-400
                      transition
                      group-hover:scale-110
                    "
                  />

                </div>




                <div>

                  <p className="font-medium text-white">
                    {action.title}
                  </p>


                  <p className="text-xs text-zinc-500">
                    {action.description}
                  </p>


                </div>



              </Link>

            );

          })}


        </div>


      </div>


    </div>

  );

}