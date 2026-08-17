import { supabase } from "./supabase";

export type DashboardStats = {
  drafts: number;
  scheduled: number;
  posted: number;
  projects: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const [{ count: draftCount }, { count: projectCount }, { data, error }] =
    await Promise.all([
      supabase
        .from("content_drafts")
        .select("*", { count: "exact", head: true }),

      supabase
        .from("projects")
        .select("*", { count: "exact", head: true }),

      supabase
        .from("content_drafts")
        .select("status"),
    ]);

  if (error) throw error;

  return {
    drafts: draftCount ?? 0,
    projects: projectCount ?? 0,
    scheduled:
      data?.filter((d) => d.status === "Scheduled").length ?? 0,
    posted:
      data?.filter((d) => d.status === "Posted").length ?? 0,
  };
}