import { Brain, Sparkles, TrendingUp } from "lucide-react";

import { Card } from "@/components/ui/card";

export default function AIInsights() {
  return (
    <Card className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-white">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-violet-500/15 p-3">
          <Brain className="text-violet-400" size={22} />
        </div>

        <div>
          <h2 className="text-lg font-semibold">AI Insights</h2>

          <p className="text-sm text-zinc-400">
            Personalized recommendations
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <Insight
          icon={<TrendingUp size={17} />}
          title="Your views are trending up"
          description="Your last three videos averaged 18% more views than your previous three."
        />

        <Insight
          icon={<Sparkles size={17} />}
          title="Post shorter videos"
          description="Videos between 15 and 20 seconds currently have your strongest engagement."
        />
      </div>
    </Card>
  );
}

function Insight({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-black/30 p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-violet-400">{icon}</div>

        <div>
          <h3 className="font-medium text-white">{title}</h3>

          <p className="mt-1 text-sm leading-6 text-zinc-400">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}