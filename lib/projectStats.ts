import { supabase } from "./supabase";

export type ProjectStats = {
  id: string;
  name: string;
  color: string;
  draft_count: number;
  drafts: number;
  scheduled: number;
  posted: number;
};

export async function getProjectStats(): Promise<ProjectStats[]> {
  const { data, error } = await supabase
    .from("project_stats")
    .select("*")
    .order("name");

  if (error) throw error;

  return (data ?? []) as ProjectStats[];
}