"use client";

import { LucideIcon } from "lucide-react";


type StatCardProps = {
  label:string;
  value:string | number;
  icon:LucideIcon;
  description?:string;
};





export default function StatCard({
  label,
  value,
  icon:Icon,
  description,
}:StatCardProps){


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
duration-300
hover:border-emerald-400/50
hover:shadow-[0_0_30px_rgba(0,255,136,0.12)]
"
>





<div
className="
absolute
-right-10
-top-10
h-32
w-32
rounded-full
bg-emerald-400/10
blur-3xl
transition
group-hover:bg-emerald-400/20
"
/>







<div className="relative z-10">





<div
className="
flex
items-center
justify-between
"
>


<p
className="
text-sm
uppercase
tracking-wider
text-zinc-400
"
>

{label}

</p>







<div
className="
flex
h-10
w-10
items-center
justify-center
rounded-xl
border
border-emerald-400/20
bg-emerald-400/10
"
>


<Icon

size={20}

className="text-emerald-400"

/>


</div>



</div>








<h2
className="
mt-6
text-4xl
font-bold
text-white
"
>

{value}

</h2>








{
description && (

<p
className="
mt-2
text-sm
text-zinc-500
"
>

{description}

</p>

)
}





</div>





</div>

);

}