"use client";

import { Card } from "@/components/ui/card";
import { Sparkles, TrendingUp, AlertTriangle } from "lucide-react";

type InsightCardProps = {
  type: "success" | "warning" | "tip";
  title: string;
  description: string;
};

export default function InsightCard({
  type,
  title,
  description,
}: InsightCardProps) {
  const config = {
    success: {
      icon: TrendingUp,
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/30",
    },
    warning: {
      icon: AlertTriangle,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/30",
    },
    tip: {
      icon: Sparkles,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/30",
    },
  };

  const style = config[type];
  const Icon = style.icon;

  return (
    <Card className={`border ${style.border} bg-zinc-900 p-6 text-white`}>
      <div className="flex items-start gap-4">
        <div className={`rounded-xl p-3 ${style.bg}`}>
          <Icon className={style.color} size={22} />
        </div>

        <div>
          <h3 className="text-lg font-semibold">{title}</h3>

          <p className="mt-2 text-sm text-zinc-400">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
}