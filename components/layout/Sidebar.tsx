"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Video,
  BarChart3,
  Brain,
  Calendar,
  Lightbulb,
  FileText,
  Settings,
} from "lucide-react";

const menu = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/" },
  { name: "Videos", icon: Video, href: "/videos" },
  { name: "Analytics", icon: BarChart3, href: "/analytics" },
  { name: "AI Coach", icon: Brain, href: "/ai-coach" },
  { name: "Calendar", icon: Calendar, href: "/calendar" },
  { name: "Ideas", icon: Lightbulb, href: "/ideas" },
  { name: "Reports", icon: FileText, href: "/reports" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="min-h-screen w-64 border-r border-zinc-800 bg-zinc-950 p-6 text-white">
      <h1 className="mb-10 text-2xl font-bold">CreatorOS</h1>

      <nav className="space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                active
                  ? "bg-violet-500/15 text-violet-300"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}