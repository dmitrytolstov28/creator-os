"use client";

import { useState } from "react";

import {
  Loader2,
  Plus,
} from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  createProject,
} from "../../lib/projects";



export default function NewProjectDialog(){


const [name,setName] =
useState("");


const [loading,setLoading] =
useState(false);






async function handleCreate(){


if(!name.trim()){

toast.error(
"Enter a project name"
);

return;

}



try{


setLoading(true);



await createProject(
name,
"bg-emerald-400"
);



toast.success(
"Project created"
);



setName("");



window.location.reload();



}catch(error){


console.error(error);


toast.error(
"Could not create project"
);



}finally{


setLoading(false);


}


}










return (

<div
className="
rounded-2xl
border
border-emerald-400/20
bg-white/[0.04]
p-6
backdrop-blur-xl
"
>


<div className="flex items-center gap-3">


<div
className="
flex
h-10
w-10
items-center
justify-center
rounded-xl
border
border-emerald-400/30
bg-emerald-400/10
"
>

<Plus
size={20}
className="text-emerald-400"
/>

</div>




<div>


<h2 className="
text-xl
font-semibold
text-white
">

Create Project

</h2>


<p className="
text-sm
text-zinc-400
">

Organize your content into a workspace.

</p>


</div>


</div>








<input

value={name}

onChange={(e)=>
setName(
e.target.value
)
}

placeholder="Example: YouTube Channel"

className="
mt-6
w-full
rounded-xl
border
border-zinc-700
bg-black/40
p-3
text-white
outline-none
focus:border-emerald-400
"

/>









<Button

onClick={handleCreate}

disabled={loading}

className="
mt-4
w-full
bg-emerald-600
hover:bg-emerald-500
"

>


{
loading
?

<Loader2
size={18}
className="animate-spin"
/>

:

<Plus
size={18}
/>

}



{
loading
?
"Creating..."
:
"Create Project"
}


</Button>







</div>

);

}