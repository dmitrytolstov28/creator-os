"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import {
  ArrowLeft,
  Save,
  Loader2,
  FolderOpen,
} from "lucide-react";

import { toast } from "sonner";

import AppShell from "@/components/layout/AppShell";

import {
  getProjects,
  updateProject,
} from "@/lib/projects";



type Project = {
  id: string;
  name: string;
  color: string;
};




export default function EditProjectPage(){


const params = useParams();

const router = useRouter();


const projectId =
params.id as string;



const [loading,setLoading] =
useState(true);


const [saving,setSaving] =
useState(false);



const [name,setName] =
useState("");








useEffect(()=>{


async function loadProject(){


try{


const projects =
await getProjects();



const project =
projects.find(
(item)=>
item.id === projectId
);



if(!project){

toast.error(
"Project not found"
);

router.push("/projects");

return;

}



setName(
project.name
);



}catch{


toast.error(
"Could not load project"
);



}finally{


setLoading(false);


}


}



void loadProject();


},[projectId,router]);









async function handleSave(){


if(!name.trim()){

toast.error(
"Enter a project name"
);

return;

}



try{


setSaving(true);



await updateProject(
projectId,
name,
"bg-emerald-400"
);



toast.success(
"Project updated"
);



router.push(
`/projects/${projectId}`
);



router.refresh();



}catch{


toast.error(
"Could not update project"
);



}finally{


setSaving(false);


}


}









if(loading){


return (

<AppShell>

<div className="text-zinc-400">

Loading project...

</div>

</AppShell>

);


}








return (

<AppShell>


<div className="space-y-8">



<Link

href={`/projects/${projectId}`}

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

Back to Project

</Link>







<div>


<div className="flex items-center gap-2">


<FolderOpen
size={18}
className="text-emerald-400"
/>


<p
className="
text-xs
uppercase
tracking-[0.3em]
text-emerald-400/70
"
>

Project Settings

</p>


</div>




<h1
className="
mt-3
text-5xl
font-bold
text-white
"
>

Edit Project

</h1>



<p className="mt-2 text-zinc-400">

Update your content workspace.

</p>


</div>








<div
className="
max-w-xl
rounded-2xl
border
border-emerald-400/20
bg-white/[0.04]
p-8
"
>


<label className="text-sm text-zinc-400">

Project Name

</label>



<input

value={name}

onChange={(e)=>
setName(e.target.value)
}

className="
mt-3
w-full
rounded-xl
border
border-emerald-400/20
bg-black/30
p-4
text-white
outline-none
focus:border-emerald-400
"

placeholder="Project name"

/>







<button

onClick={handleSave}

disabled={saving}

className="
mt-6
flex
items-center
gap-2
rounded-xl
bg-emerald-400
px-6
py-3
font-semibold
text-black
hover:bg-emerald-300
disabled:opacity-50
"

>


{
saving
?

<Loader2
size={18}
className="animate-spin"
/>

:

<Save size={18}/>

}


{
saving
?
"Saving..."
:
"Save Changes"
}


</button>



</div>







</div>


</AppShell>

);

}