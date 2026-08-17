"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
  ArrowLeft,
  FileText,
  CalendarClock,
  CheckCircle2,
  Plus,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";

import { getDrafts } from "@/lib/drafts";
import { getProjects } from "@/lib/projects";



type Draft = {
  id:string;
  title:string | null;
  status:string | null;
  project_id:string | null;
};


type Project = {
  id:string;
  name:string;
  color:string;
};





export default function ProjectPage(){


const params = useParams();

const projectId =
params.id as string;



const [project,setProject] =
useState<Project | null>(null);


const [drafts,setDrafts] =
useState<Draft[]>([]);





async function loadData(){


try{


const projects =
await getProjects();



const currentProject =
projects.find(
(project)=>
project.id === projectId
);



setProject(
currentProject ?? null
);




const allDrafts =
await getDrafts();



setDrafts(

allDrafts.filter(
(draft)=>
draft.project_id === projectId
)

);



}catch(error){

console.error(error);

}


}






useEffect(()=>{

loadData();

},[projectId]);






const scheduled =
drafts.filter(
(draft)=>
draft.status === "Scheduled"
).length;



const posted =
drafts.filter(
(draft)=>
draft.status === "Posted"
).length;








return (

<AppShell>


<div className="space-y-8">



<Link

href="/projects"

className="
flex
items-center
gap-2
text-sm
text-zinc-400
hover:text-white
"

>

<ArrowLeft size={16}/>

Back to Projects

</Link>







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

Project Workspace

</p>



<h1
className="
mt-3
text-5xl
font-bold
text-white
"
>

{project?.name ?? "Loading..."}

</h1>


<p className="mt-2 text-zinc-400">

Your content hub for this project.

</p>


</div>





<Link

href="/drafts/new"

className="
flex
items-center
gap-2
rounded-xl
bg-emerald-400
px-5
py-3
font-semibold
text-black
hover:bg-emerald-300
"

>

<Plus size={18}/>

Add Content

</Link>


</div>








<div
className="
grid
gap-4
md:grid-cols-3
"
>


<div className="rounded-2xl border border-emerald-400/20 bg-white/[0.04] p-5">

<FileText size={22} className="text-emerald-400"/>

<p className="mt-3 text-zinc-400">
Ideas
</p>

<p className="text-3xl font-bold text-white">
{drafts.length}
</p>

</div>





<div className="rounded-2xl border border-emerald-400/20 bg-white/[0.04] p-5">

<CalendarClock size={22} className="text-emerald-400"/>

<p className="mt-3 text-zinc-400">
Scheduled
</p>

<p className="text-3xl font-bold text-white">
{scheduled}
</p>

</div>





<div className="rounded-2xl border border-emerald-400/20 bg-white/[0.04] p-5">

<CheckCircle2 size={22} className="text-emerald-400"/>

<p className="mt-3 text-zinc-400">
Published
</p>

<p className="text-3xl font-bold text-white">
{posted}
</p>

</div>


</div>






<div>

<h2 className="mb-4 text-xl font-semibold text-white">

Project Content

</h2>


{
drafts.length === 0 ? (

<div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-10 text-zinc-400">

No content assigned yet.

</div>

) : (

<div className="grid gap-4 md:grid-cols-2">

{
drafts.map((draft)=>(

<div
key={draft.id}
className="
rounded-2xl
border
border-emerald-400/20
bg-white/[0.04]
p-5
"
>

<h3 className="font-semibold text-white">

{draft.title ?? "Untitled Draft"}

</h3>


<p className="mt-2 text-sm text-emerald-400">

{draft.status}

</p>


</div>

))
}

</div>

)

}


</div>





</div>


</AppShell>

);

}