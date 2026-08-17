"use client";

import AppShell from "../../components/layout/AppShell";

import CalendarGrid from "../../components/calendar/CalendarGrid";
import CalendarSidebar from "../../components/calendar/CalendarSidebar";

import {
  CalendarDays,
  Activity,
  Plus,
} from "lucide-react";

import Link from "next/link";



export default function CalendarPage() {


return (

<AppShell>


<div className="space-y-8">








{/* Header */}


<div
className="
flex
items-start
justify-between
"
>


<div>


<div
className="
flex
items-center
gap-2
"
>


<CalendarDays
size={18}
className="text-emerald-400"
/>


<p
className="
text-xs
uppercase
tracking-[0.35em]
text-emerald-400/70
"
>

Content Scheduling

</p>


</div>






<h1
className="
mt-4
text-5xl
font-bold
text-white
"
>

Content Calendar

</h1>





<p className="mt-2 text-zinc-400">

Plan and organize your creator workflow.

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
transition
hover:bg-emerald-300
"

>


<Plus size={18}/>


Add Content


</Link>



</div>









{/* Calendar System */}


<div
className="
grid
gap-6
lg:grid-cols-[280px_1fr]
"
>







<div
className="
rounded-2xl
border
border-emerald-400/20
bg-white/[0.04]
p-5
backdrop-blur-xl
"
>


<CalendarSidebar />


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



<div
className="
mb-5
flex
items-center
gap-2
text-xs
uppercase
tracking-[0.25em]
text-emerald-400/70
"
>


<Activity size={14}/>


Publishing Schedule


</div>





<CalendarGrid />




</div>







</div>








</div>


</AppShell>

);

}