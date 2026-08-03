import { Card } from "@/components/ui/card";
import {
  Eye,
  Heart,
  Users,
  Trophy,
} from "lucide-react";

const stats = [
  {
    title: "Creator Score",
    value: "91",
    icon: Trophy,
  },
  {
    title: "Views",
    value: "2.4M",
    icon: Eye,
  },
  {
    title: "Followers",
    value: "+12,430",
    icon: Users,
  },
  {
    title: "Engagement",
    value: "14.6%",
    icon: Heart,
  },
];

export default function StatGrid() {
  return (
    <div className="grid grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.title}
            className="rounded-2xl border-zinc-700 bg-zinc-900 p-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-400">
                {stat.title}
              </p>

              <Icon
                size={20}
                className="text-violet-400"
              />
            </div>

            <h2 className="mt-6 text-3xl font-bold text-white">
              {stat.value}
            </h2>
          </Card>
        );
      })}
    </div>
  );
}