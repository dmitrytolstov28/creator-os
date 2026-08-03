import AppShell from "@/components/layout/AppShell";
import Header from "@/components/dashboard/Header";
import StatGrid from "@/components/dashboard/StatGrid";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import AIInsights from "@/components/dashboard/AIInsights";
import RecentVideos from "@/components/dashboard/RecentVideos";

export default function Home() {
  return (
    <AppShell>
      <Header />
      <StatGrid />
      <PerformanceChart />

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <AIInsights />
        <RecentVideos />
      </div>
    </AppShell>
  );
}