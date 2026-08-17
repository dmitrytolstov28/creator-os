"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getProjects } from "../../lib/projects";
import { assignDraftToProject } from "../../lib/projectAssignments";



type Project = {
  id:string;
  name:string;
};



type Props = {
  draftId:string;
  value:string | null;
};






export default function ProjectSelector({
draftId,
value,
}:Props){


const [projects,setProjects] =
useState<Project[]>([]);


const [selected,setSelected] =
useState(value ?? "");







useEffect(()=>{


async function loadProjects(){


try{


const data =
await getProjects();


setProjects(data);



}catch{


toast.error(
"Could not load projects"
);



}



}



void loadProjects();



},[]);








async function handleChange(projectId:string){


try{


setSelected(projectId);



await assignDraftToProject(
draftId,
projectId === ""
?
null
:
projectId
);



toast.success(
"Project updated"
);



}catch{


toast.error(
"Could not assign project"
);



}



}









return (

<div className="space-y-2">


<label className="
text-sm
text-zinc-400
">

Project

</label>






<select

value={selected}

onChange={(e)=>
handleChange(e.target.value)
}

className="
w-full
rounded-xl
border
border-emerald-400/20
bg-black/30
px-3
py-3
text-white
outline-none
"

>


<option value="">

No Project

</option>





{
projects.map((project)=>(


<option

key={project.id}

value={project.id}

>

{project.name}

</option>


))

}



</select>





</div>

);

}