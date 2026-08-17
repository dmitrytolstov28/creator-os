import { supabase } from "./supabase";



export async function getProjects() {

  const { data, error } =
    await supabase
      .from("projects")
      .select("*")
      .order(
        "created_at",
        {
          ascending: true,
        }
      );


  if (error) {
    console.error("GET PROJECTS ERROR:", error);
    throw error;
  }


  console.log("PROJECTS LOADED:", data);


  return data ?? [];

}







export async function createProject(
  name: string,
  color: string = "bg-emerald-400",
) {


  const { data, error } =
    await supabase
      .from("projects")
      .insert({
        name,
        color,
      })
      .select()
      .single();



  if(error){
    console.error("CREATE ERROR:", error);
    throw error;
  }


  return data;

}








export async function updateProject(
  id: string,
  name: string,
  color: string = "bg-emerald-400",
) {


  console.log(
    "UPDATE START:",
    {
      id,
      name,
      color,
    }
  );



  const response =
    await supabase
      .from("projects")
      .update({
        name,
        color,
        updated_at: new Date().toISOString(),
      })
      .eq(
        "id",
        id
      )
      .select();



  console.log(
    "UPDATE RESPONSE:",
    response
  );



  if(response.error){

    console.error(
      "UPDATE FAILED:",
      response.error
    );

    throw response.error;

  }



  if(!response.data || response.data.length === 0){

    console.error(
      "NO ROW UPDATED - POSSIBLE RLS ISSUE"
    );

  }


  return response.data;

}








export async function deleteProject(
  id:string
){

  const { error } =
    await supabase
      .from("projects")
      .delete()
      .eq(
        "id",
        id
      );


  if(error) throw error;

}