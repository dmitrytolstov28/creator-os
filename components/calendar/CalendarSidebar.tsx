"use client";

import {
  CalendarDays,
  Target,
  TrendingUp,
  Plus,
  Activity,
} from "lucide-react";



export default function CalendarSidebar() {


return (

<div className="space-y-6">







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
h-12
w-12
items-center
justify-center
rounded-xl
border
border-emerald-400/30
bg-emerald-400/10
"
>


<CalendarDays
size={24}
className="text-emerald-400"
/>


</div>






<div>


<p className="
text-xs
uppercase
tracking-[0.25em]
text-emerald-400/70
">

Current Cycle

</p>



<h2 className="
text-xl
font-bold
text-white
">

August 2026

</h2>



</div>


</div>







<button
className="
mt-6
flex
w-full
items-center
justify-center
gap-2
rounded-xl
border
border-emerald-400/30
bg-emerald-400/10
py-3
text-sm
font-medium
text-emerald-300
transition
hover:bg-emerald-400/20
"
>


<Plus size={18}/>


New Post


</button>




</div>









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


<div className="space-y-6">







<div className="flex items-center gap-3">


<CalendarDays
className="text-emerald-400"
/>


<div>


<p className="text-sm text-zinc-400">

Scheduled

</p>


<h3 className="
text-3xl
font-bold
text-white
">

12

</h3>


</div>


</div>








<div className="flex items-center gap-3">


<Target
className="text-emerald-400"
/>


<div>


<p className="text-sm text-zinc-400">

Monthly Goal

</p>


<h3 className="
text-3xl
font-bold
text-white
">

20 Posts

</h3>


</div>


</div>








<div className="flex items-center gap-3">


<TrendingUp
className="text-emerald-400"
/>


<div>


<p className="text-sm text-zinc-400">

Completion

</p>


<h3 className="
text-3xl
font-bold
text-white
">

60%

</h3>


</div>


</div>






</div>



</div>









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


<div className="flex items-center gap-2">


<Activity
size={18}
className="text-emerald-400"
/>


<h3 className="font-semibold text-white">

Upcoming

</h3>


</div>








<div className="mt-5 space-y-3">


{[
["Morning Routine","TikTok • Aug 3"],
["Gym Vlog","Instagram • Aug 8"],
["AI Productivity Tips","YouTube • Aug 13"],
].map(([title,meta])=>(


<div

key={title}

className="
rounded-xl
border
border-emerald-400/10
bg-black/20
p-3
"

>


<p className="font-medium text-white">

{title}

</p>


<p className="
mt-1
text-xs
text-zinc-500
">

{meta}

</p>



</div>


))}


</div>






</div>








</div>

);

}