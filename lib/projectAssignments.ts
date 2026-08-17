import { supabase } from "./supabase";

export async function assignDraftToProject(
  draftId: string,
  projectId: string | null,
) {
  const { error } = await supabase
    .from("content_drafts")
    .update({
      project_id: projectId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", draftId);

  if (error) throw error;
}

export async function getProjectDraftCounts() {
  const { data, error } = await supabase
    .from("content_drafts")
    .select("project_id");

  if (error) throw error;

  const counts = new Map<string, number>();

  for (const draft of data ?? []) {
    if (!draft.project_id) continue;

    counts.set(
      draft.project_id,
      (counts.get(draft.project_id) ?? 0) + 1,
    );
  }

  return counts;
}