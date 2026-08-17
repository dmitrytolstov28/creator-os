import { supabase } from "./supabase";



export async function getDrafts() {

  const { data, error } = await supabase
    .from("content_drafts")
    .select("*")
    .order(
      "created_at",
      {
        ascending: false,
      }
    );


  if (error) throw error;


  return data ?? [];

}








export async function createDraft(draft: {

  topic: string;

  title: string;

  hook: string;

  script: string;

  caption: string;

  status: string;

  project_id?: string | null;

}) {


  const { data, error } = await supabase

    .from("content_drafts")

    .insert({

      ...draft,

    })

    .select()

    .single();



  if (error) throw error;


  return data;

}








export async function updateDraft(
  id: string,
  updates: {
    topic?: string;
    title?: string;
    hook?: string;
    script?: string;
    caption?: string;
  }
) {


  const { error } = await supabase

    .from("content_drafts")

    .update({

      ...updates,

      updated_at:
        new Date().toISOString(),

    })

    .eq(
      "id",
      id
    );



  if (error) throw error;

}








export async function updateDraftStatus(
  id: string,
  status: string
) {


  const { error } = await supabase

    .from("content_drafts")

    .update({

      status,

      updated_at:
        new Date().toISOString(),

    })

    .eq(
      "id",
      id
    );



  if (error) throw error;

}








export async function scheduleDraft(
  id: string,
  date: string
) {


  const { error } = await supabase

    .from("content_drafts")

    .update({

      scheduled_for: date,

      status: "Scheduled",

      updated_at:
        new Date().toISOString(),

    })

    .eq(
      "id",
      id
    );



  if (error) throw error;

}








export async function deleteDraft(
  id: string
) {


  const { error } = await supabase

    .from("content_drafts")

    .delete()

    .eq(
      "id",
      id
    );



  if (error) throw error;

}