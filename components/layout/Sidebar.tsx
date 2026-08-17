"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Calendar,
  Video,
  FileText,
  FolderOpen,
  BarChart3,
  Brain,
  Settings,
  Activity,
} from "lucide-react";

const sections = [
  {
    title: "MAIN",
    items: [
      {
        name: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    title: "PLANNING",
    items: [
      {
        name: "Calendar",
        href: "/calendar",
        icon: Calendar,
      },
    ],
  },

  {
    title: "CONTENT CREATION",
    items: [
      {
        name: "Videos",
        href: "/videos",
        icon: Video,
      },
      {
        name: "Drafts",
        href: "/drafts",
        icon: FileText,
      },
      {
        name: "Projects",
        href: "/projects",
        icon: FolderOpen,
      },
    ],
  },

  {
    title: "GROWTH",
    items: [
      {
        name: "Analytics",
        href: "/analytics",
        icon: BarChart3,
      },
      {
        name: "AI Assistant",
        href: "/intelligence",
        icon: Brain,
      },
    ],
  },

  {
    title: "SYSTEM",
    items: [
      {
        name: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col p-4">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-white">
          Creator<span className="text-emerald-400">OS</span>
        </h1>

        <p
          className="
            mt-1
            text-xs
            uppercase
            tracking-[0.22em]
            text-emerald-400/70
          "
        >
          Creator Command Center
        </p>
      </div>

      <nav className="flex-1 space-y-5">
        {sections.map((section) => (
          <div key={section.title}>
            <p
              className="
                mb-2
                px-3
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.28em]
                text-zinc-600
              "
            >
              {section.title}
            </p>

            <div className="space-y-1.5">
              {section.items.map((item) => {
                const Icon = item.icon;

                const active = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      px-3
                      py-2.5
                      text-sm
                      transition
                      ${
                        active
                          ? "border border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                          : "text-zinc-400 hover:bg-white/5 hover:text-white"
                      }
                    `}
                  >
                    <Icon
                      size={18}
                      className={
                        active
                          ? "text-emerald-400"
                          : "text-zinc-500"
                      }
                    />

                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div
        className="
          rounded-2xl
          border
          border-emerald-400/20
          bg-white/[0.03]
          p-3
        "
      >
        <div className="flex items-center gap-2">
          <Activity
            size={16}
            className="text-emerald-400"
          />

          <span className="text-sm text-zinc-400">
            System Online
          </span>
        </div>
      </div>
    </aside>
  );
}