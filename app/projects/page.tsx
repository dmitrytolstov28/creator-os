"use client";

import { useEffect, useState } from "react";

import {
  FolderOpen,
  Layers,
  Video,
} from "lucide-react";

import AppShell from "../../components/layout/AppShell";
import NewProjectDialog from "../../components/projects/NewProjectDialog";
import ProjectCard from "../../components/projects/ProjectCard";

import { getProjects } from "../../lib/projects";
import { getProjectDraftCounts } from "../../lib/projectAssignments";



type Project = {
  id:string;
  name:string;
};






export default function ProjectsPage(){


const [projects,setProjects] =
useState<Project[]>([]);


const [counts,setCounts] =
useState<Map<string,number>>(
new Map()
);



async function loadProjects(){


try{


const projectData =
await getProjects();



setProjects(
projectData
);



const draftCounts =
await getProjectDraftCounts();



setCounts(
draftCounts
);



}catch(error){

console.error(error);

}


}








useEffect(()=>{


loadProjects();


},[]);









const totalDrafts =
Array.from(
counts.values()
).reduce(
(total,value)=>
total + value,
0
);









return (

<AppShell>


<div className="space-y-8">








<div
className="
flex
items-start
justify-between
"
>


<div>


<p
className="
text-xs
uppercase
tracking-[0.3em]
text-emerald-400/70
"
>

Content Creation

</p>




<h1
className="
mt-3
text-5xl
font-bold
text-white
"
>

Projects

</h1>




<p className="mt-2 text-zinc-400">

Organize your content, ideas, and videos.

</p>


</div>





<NewProjectDialog />



</div>









<div
className="
grid
gap-4
md:grid-cols-3
"
>





<div
className="
rounded-2xl
border
border-emerald-400/20
bg-white/[0.04]
p-5
"
>

<FolderOpen
size={22}
className="text-emerald-400"
/>


<p className="mt-3 text-sm text-zinc-400">

Total Projects

</p>


<p className="
text-3xl
font-bold
text-white
">

{projects.length}

</p>


</div>








<div
className="
rounded-2xl
border
border-emerald-400/20
bg-white/[0.04]
p-5
"
>

<Layers
size={22}
className="text-emerald-400"
/>


<p className="mt-3 text-sm text-zinc-400">

Organized Drafts

</p>


<p className="
text-3xl
font-bold
text-white
">

{totalDrafts}

</p>


</div>








<div
className="
rounded-2xl
border
border-emerald-400/20
bg-white/[0.04]
p-5
"
>

<Video
size={22}
className="text-emerald-400"
/>


<p className="mt-3 text-sm text-zinc-400">

Content Hub

</p>


<p className="
text-3xl
font-bold
text-white
">

Ready

</p>


</div>





</div>









{
projects.length === 0 ? (


<div
className="
rounded-2xl
border
border-zinc-800
bg-zinc-900
p-12
text-center
"
>


<h2 className="
text-xl
font-semibold
text-white
">

No projects yet

</h2>



<p className="
mt-2
text-zinc-400
">

Create your first project to organize your content.

</p>


</div>



) : (



<div
className="
grid
gap-6
md:grid-cols-2
xl:grid-cols-3
"
>


{
projects.map((project)=>(


<ProjectCard

key={project.id}

id={project.id}

name={project.name}

drafts={
counts.get(project.id) ?? 0
}

scheduled={0}

posted={0}

/>


))

}



</div>



)

}




</div>


</AppShell>

);

}