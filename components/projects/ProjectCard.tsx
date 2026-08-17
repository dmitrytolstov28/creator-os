"use client";

import Link from "next/link";
import { useState } from "react";

import {
  FolderOpen,
  MoreVertical,
  Trash2,
  Eye,
  Layers,
  CalendarClock,
  CheckCircle2,
  Pencil,
} from "lucide-react";

import { toast } from "sonner";

import {
  deleteProject,
} from "../../lib/projects";



type Props = {
  id:string;
  name:string;
  drafts:number;
  scheduled?:number;
  posted?:number;
};





export default function ProjectCard({
  id,
  name,
  drafts,
  scheduled = 0,
  posted = 0,
}:Props){


const [menuOpen,setMenuOpen] =
useState(false);





async function handleDelete(){

if(
!confirm(
`Delete "${name}"?`
)
) return;


try{

await deleteProject(id);

toast.success(
"Project deleted"
);

window.location.reload();


}catch{

toast.error(
"Could not delete project"
);

}

}








return (

<div
className="
group
relative
overflow-hidden
rounded-2xl
border
border-emerald-400/20
bg-white/[0.04]
p-6
backdrop-blur-xl
transition-all
hover:border-emerald-400/50
hover:shadow-[0_0_35px_rgba(0,255,136,0.12)]
"
>


<div
className="
absolute
-right-20
-top-20
h-48
w-48
rounded-full
bg-emerald-400/10
blur-3xl
"
/>





<div
className="
relative
flex
items-start
justify-between
"
>


<div
className="
flex
h-14
w-14
items-center
justify-center
rounded-2xl
border
border-emerald-400/30
bg-emerald-400/10
"
>

<FolderOpen
size={26}
className="text-emerald-400"
/>

</div>






<div className="relative">


<button

onClick={()=>
setMenuOpen(!menuOpen)
}

className="
rounded-lg
p-2
text-zinc-500
hover:bg-white/5
hover:text-white
"

>

<MoreVertical size={18}/>

</button>





{
menuOpen && (

<div
className="
absolute
right-0
top-10
z-20
w-44
rounded-xl
border
border-emerald-400/20
bg-zinc-950
p-2
shadow-xl
"
>


<Link

href={`/projects/${id}`}

className="
flex
items-center
gap-2
rounded-lg
px-3
py-2
text-sm
text-zinc-300
hover:bg-white/5
hover:text-white
"

>

<Eye size={15}/>

View Project

</Link>






<Link

href={`/projects/${id}/edit`}

className="
flex
items-center
gap-2
rounded-lg
px-3
py-2
text-sm
text-zinc-300
hover:bg-white/5
hover:text-white
"

>

<Pencil size={15}/>

Edit Project

</Link>







<button

onClick={handleDelete}

className="
flex
w-full
items-center
gap-2
rounded-lg
px-3
py-2
text-sm
text-red-300
hover:bg-red-400/10
"

>

<Trash2 size={15}/>

Delete Project

</button>



</div>

)

}


</div>



</div>







<div className="mt-6">

<p
className="
text-xs
uppercase
tracking-[0.25em]
text-emerald-400/70
"
>

Creator Project

</p>


<h2
className="
mt-2
text-xl
font-bold
text-white
"
>

{name}

</h2>


<p className="mt-2 text-sm text-zinc-400">

Your content workspace

</p>


</div>








<div
className="
mt-6
grid
grid-cols-3
gap-3
"
>


<div className="
rounded-xl
border
border-emerald-400/10
bg-black/20
p-3
">

<Layers
size={15}
className="text-emerald-400"
/>

<p className="mt-2 text-xs text-zinc-500">
Drafts
</p>

<p className="font-semibold text-white">
{drafts}
</p>

</div>





<div className="
rounded-xl
border
border-emerald-400/10
bg-black/20
p-3
">

<CalendarClock
size={15}
className="text-emerald-400"
/>

<p className="mt-2 text-xs text-zinc-500">
Scheduled
</p>

<p className="font-semibold text-white">
{scheduled}
</p>

</div>





<div className="
rounded-xl
border
border-emerald-400/10
bg-black/20
p-3
">

<CheckCircle2
size={15}
className="text-emerald-400"
/>

<p className="mt-2 text-xs text-zinc-500">
Posted
</p>

<p className="font-semibold text-white">
{posted}
</p>

</div>


</div>








<div
className="
mt-6
flex
gap-3
"
>


<Link

href={`/projects/${id}`}

className="
flex
flex-1
items-center
justify-center
gap-2
rounded-xl
border
border-emerald-400/30
bg-emerald-400/10
py-3
text-sm
text-emerald-300
hover:bg-emerald-400/20
"

>

<Eye size={16}/>

Open

</Link>





<button

onClick={handleDelete}

className="
flex
flex-1
items-center
justify-center
gap-2
rounded-xl
border
border-red-400/30
bg-red-400/10
py-3
text-sm
text-red-300
"

>

<Trash2 size={16}/>

Delete

</button>



</div>





</div>

);

}