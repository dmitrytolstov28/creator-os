"use client";

import { useState } from "react";
import Link from "next/link";

import {
  Bell,
  Search,
  UserCircle2,
  Activity,
  Plus,
  FileText,
  Video,
  FolderPlus,
  CalendarPlus,
  X,
} from "lucide-react";


export default function Topbar() {

  const [open, setOpen] = useState(false);


  return (

<header
className="
sticky
top-0
z-20
flex
items-center
justify-between
border-b
border-emerald-400/10
bg-black/30
px-8
py-5
backdrop-blur-xl
"
>


<div className="flex items-center gap-4">


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

<Activity
size={20}
className="text-emerald-400"
/>

</div>



<div>

<p
className="
text-xs
uppercase
tracking-[0.3em]
text-emerald-400/70
"
>
CreatorOS
</p>


<h2 className="text-lg font-semibold text-white">
Command Center
</h2>


</div>


</div>








<div className="flex items-center gap-3">


<button

onClick={() => setOpen(!open)}

className="
flex
items-center
gap-2
rounded-xl
bg-emerald-400
px-4
py-2.5
font-semibold
text-black
transition
hover:bg-emerald-300
"

>

{open ? (
<X size={18}/>
) : (
<Plus size={18}/>
)}

Create

</button>





<button
className="
flex
h-10
w-10
items-center
justify-center
rounded-xl
border
border-emerald-400/20
bg-white/[0.04]
text-zinc-400
hover:text-white
"
>

<Search size={18}/>

</button>





<button
className="
flex
h-10
w-10
items-center
justify-center
rounded-xl
border
border-emerald-400/20
bg-white/[0.04]
text-zinc-400
hover:text-white
"
>

<Bell size={18}/>

</button>





<div
className="
flex
items-center
gap-2
rounded-xl
border
border-emerald-400/20
bg-white/[0.04]
px-3
py-2
"
>

<UserCircle2
size={28}
className="text-emerald-400"
/>


<span className="text-sm text-white">
Creator
</span>


</div>



</div>








{open && (

<div
className="
absolute
right-8
top-20
w-64
rounded-2xl
border
border-emerald-400/20
bg-[#050807]
p-3
shadow-[0_0_40px_rgba(0,255,136,0.15)]
"
>


<p
className="
px-3
pb-3
text-xs
uppercase
tracking-[0.25em]
text-zinc-500
"
>
Create Something
</p>





<Link

href="/drafts/new"

onClick={() => setOpen(false)}

className="
flex
items-center
gap-3
rounded-xl
p-3
text-zinc-300
hover:bg-white/5
hover:text-white
"

>

<FileText
size={18}
className="text-emerald-400"
/>

New Draft

</Link>







<Link

href="/videos"

onClick={() => setOpen(false)}

className="
flex
items-center
gap-3
rounded-xl
p-3
text-zinc-300
hover:bg-white/5
hover:text-white
"

>

<Video
size={18}
className="text-emerald-400"
/>

Add Video

</Link>







<Link

href="/projects"

onClick={() => setOpen(false)}

className="
flex
items-center
gap-3
rounded-xl
p-3
text-zinc-300
hover:bg-white/5
hover:text-white
"

>

<FolderPlus
size={18}
className="text-emerald-400"
/>

New Project

</Link>







<Link

href="/calendar"

onClick={() => setOpen(false)}

className="
flex
items-center
gap-3
rounded-xl
p-3
text-zinc-300
hover:bg-white/5
hover:text-white
"

>

<CalendarPlus
size={18}
className="text-emerald-400"
/>

Schedule Post

</Link>





</div>

)}



</header>

  );

}