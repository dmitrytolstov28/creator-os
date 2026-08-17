"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Save,
  ArrowLeft,
  Folder,
  Lightbulb,
  Play,
  MessageSquare,
} from "lucide-react";

import Link from "next/link";

import AppShell from "@/components/layout/AppShell";

import { toast } from "sonner";

import {
  createDraft,
} from "@/lib/drafts";

import {
  getProjects,
} from "@/lib/projects";



type Project = {
  id:string;
  name:string;
};





export default function NewDraftPage(){


const router = useRouter();


const [loading,setLoading] =
useState(false);


const [projects,setProjects] =
useState<Project[]>([]);


const [projectId,setProjectId] =
useState("");



const [form,setForm] = useState({

topic:"",
title:"",
hook:"",
script:"",
caption:"",

});






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








function updateField(
key:string,
value:string
){

setForm((current)=>({

...current,

[key]:value,

}));

}









async function handleSave(){

try{


setLoading(true);



await createDraft({

topic:form.topic,

title:form.title,

hook:form.hook,

script:form.script,

caption:form.caption,

status:"Draft",

project_id:
projectId || null,

});



toast.success(
"Draft created"
);



router.push("/drafts");



}catch(error){

console.error(error);

toast.error(
"Could not create draft"
);


}finally{

setLoading(false);

}

}









return (

<AppShell>


<div className="space-y-8">






<Link

href="/drafts"

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

Back to Drafts

</Link>








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

Create New Draft

</h1>



<p className="mt-2 text-zinc-400">

Turn your idea into your next piece of content.

</p>


</div>









<div
className="
rounded-2xl
border
border-emerald-400/20
bg-white/[0.04]
p-8
space-y-8
"
>









{/* Project */}


<div className="space-y-3">


<div className="flex items-center gap-2">


<Folder
size={18}
className="text-emerald-400"
/>


<h2 className="font-semibold text-white">

Project

</h2>


</div>


<p className="text-sm text-zinc-400">

Choose where this content belongs.

</p>



<select

value={projectId}

onChange={(e)=>
setProjectId(e.target.value)
}

className="
w-full
rounded-xl
border
border-emerald-400/20
bg-black/30
p-4
text-white
outline-none
"

>

<option value="">

No Project

</option>


{projects.map((project)=>(

<option

key={project.id}

value={project.id}

>

{project.name}

</option>

))}


</select>


</div>









{/* Idea */}


<div className="space-y-3">


<div className="flex items-center gap-2">


<Lightbulb
size={18}
className="text-emerald-400"
/>


<h2 className="font-semibold text-white">

Content Idea

</h2>


</div>



<input

value={form.topic}

onChange={(e)=>
updateField(
"topic",
e.target.value
)
}

placeholder="Example: 5 mistakes new creators make"

className="
w-full
rounded-xl
border
border-emerald-400/20
bg-black/30
p-4
text-white
outline-none
"

/>



<input

value={form.title}

onChange={(e)=>
updateField(
"title",
e.target.value
)
}

placeholder="Video title"

className="
w-full
rounded-xl
border
border-emerald-400/20
bg-black/30
p-4
text-white
outline-none
"

/>


</div>









{/* Hook */}


<div className="space-y-3">


<div className="flex items-center gap-2">


<MessageSquare
size={18}
className="text-emerald-400"
/>


<h2 className="font-semibold text-white">

Hook

</h2>


</div>



<p className="text-sm text-zinc-400">

What makes someone stop scrolling?

</p>



<textarea

value={form.hook}

onChange={(e)=>
updateField(
"hook",
e.target.value
)
}

placeholder="The first sentence that grabs attention..."

className="
min-h-[100px]
w-full
rounded-xl
border
border-emerald-400/20
bg-black/30
p-4
text-white
outline-none
"

/>


</div>









{/* Script */}


<div className="space-y-3">


<div className="flex items-center gap-2">


<Play
size={18}
className="text-emerald-400"
/>


<h2 className="font-semibold text-white">

Script

</h2>


</div>



<textarea

value={form.script}

onChange={(e)=>
updateField(
"script",
e.target.value
)
}

placeholder="Write your video script..."

className="
min-h-[220px]
w-full
rounded-xl
border
border-emerald-400/20
bg-black/30
p-4
text-white
outline-none
"

/>


</div>









{/* Caption */}


<div className="space-y-3">


<h2 className="font-semibold text-white">

Caption

</h2>



<textarea

value={form.caption}

onChange={(e)=>
updateField(
"caption",
e.target.value
)
}

placeholder="Write your post caption..."

className="
min-h-[120px]
w-full
rounded-xl
border
border-emerald-400/20
bg-black/30
p-4
text-white
outline-none
"

/>


</div>









<button

onClick={handleSave}

disabled={loading}

className="
flex
items-center
gap-2
rounded-xl
bg-emerald-400
px-6
py-3
font-semibold
text-black
transition
hover:bg-emerald-300
disabled:opacity-50
"

>


<Save size={18}/>


{loading
?
"Saving..."
:
"Save Draft"
}


</button>








</div>






</div>


</AppShell>

);

}