"use client";

import {
  Calendar,
  Clock,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";



type CalendarCardProps = {
  day:number;
  title?:string;
  platform?:"TikTok" | "Instagram" | "YouTube";
};






const colors = {

TikTok:
"border-cyan-400/30 bg-cyan-400/10 text-cyan-300",

Instagram:
"border-pink-400/30 bg-pink-400/10 text-pink-300",

YouTube:
"border-red-400/30 bg-red-400/10 text-red-300",

};







export default function CalendarCard({
day,
title,
platform,
}:CalendarCardProps){



return (

<div
className="
group
relative
flex
min-h-[130px]
flex-col
overflow-hidden
rounded-2xl
border
border-emerald-400/20
bg-white/[0.04]
p-4
backdrop-blur-xl
transition-all
duration-300
hover:border-emerald-400/50
hover:bg-white/[0.06]
hover:shadow-[0_0_30px_rgba(0,255,136,0.12)]
"
>






<div
className="
absolute
-right-10
-top-10
h-24
w-24
rounded-full
bg-emerald-400/10
blur-3xl
opacity-0
transition
group-hover:opacity-100
"
/>







<div
className="
relative
flex
items-center
justify-between
"
>


<div
className="
flex
h-8
w-8
items-center
justify-center
rounded-lg
border
border-emerald-400/30
bg-emerald-400/10
text-sm
font-bold
text-emerald-300
"
>

{day}

</div>







<button
className="
rounded-lg
p-1
text-zinc-600
transition
hover:bg-white/5
hover:text-white
"
>

<MoreHorizontal size={16}/>

</button>



</div>









<div
className="
relative
mt-4
flex-1
"
>


{title ? (

<>


<div
className={`
inline-flex
items-center
rounded-full
border
px-2.5
py-1
text-[11px]
font-medium
uppercase
tracking-wider
${
colors[
platform ?? "Instagram"
]
}
`}
>

{platform}

</div>







<h3
className="
mt-3
line-clamp-2
text-sm
font-semibold
text-white
"
>

{title}

</h3>








<div
className="
mt-4
space-y-2
text-xs
text-zinc-400
"
>


<div
className="
flex
items-center
gap-2
"
>

<Calendar
size={13}
className="text-emerald-400"
/>

Scheduled Node

</div>





<div
className="
flex
items-center
gap-2
"
>

<Clock
size={13}
className="text-emerald-400"
/>

Ready Queue

</div>



</div>



</>

) : (


<div
className="
flex
h-full
flex-col
items-center
justify-center
gap-2
text-center
text-xs
text-zinc-600
"
>


<Sparkles size={16}/>


Empty Slot


</div>


)}



</div>







</div>

);

}