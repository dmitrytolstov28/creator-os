"use client";

import { useEffect, useMemo, useState } from "react";

import {
  TrendingUp,
  Zap,
  Brain,
  Activity,
  ShieldCheck,
} from "lucide-react";

import {
  getVideos,
  calculateTotals,
  getEngagementRate,
  Video,
} from "@/lib/analytics";



export default function IntelligenceScore() {


const [videos,setVideos] =
useState<Video[]>([]);


const [loading,setLoading] =
useState(true);







useEffect(()=>{


async function loadData(){


try{


const data =
await getVideos();


setVideos(data);



}catch(error){

console.error(error);


}finally{


setLoading(false);


}


}



void loadData();


},[]);









const score = useMemo(()=>{


if(!videos.length){

return 0;

}



const totals =
calculateTotals(videos);



const engagement =
getEngagementRate(videos);





const activityScore =
Math.min(
videos.length * 5,
25
);



const engagementScore =
Math.min(
engagement * 5,
35
);



const growthScore =
Math.min(
totals.followers / 10,
25
);



const consistencyScore =
Math.min(
videos.length * 2,
15
);





return Math.round(

activityScore +
engagementScore +
growthScore +
consistencyScore

);



},[videos]);







const level =
score >= 90
?
"ELITE"
:
score >= 75
?
"ADVANCED"
:
score >= 50
?
"DEVELOPING"
:
"BUILDING";








return (

<div
className="
relative
overflow-hidden
rounded-2xl
border
border-emerald-400/20
bg-white/[0.04]
p-6
backdrop-blur-xl
shadow-[0_0_40px_rgba(0,255,136,0.08)]
"
>





<div
className="
absolute
-right-20
-top-20
h-64
w-64
rounded-full
bg-emerald-400/10
blur-3xl
"
/>







<div className="relative z-10">







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


<Brain
size={26}
className="text-emerald-400"
/>


</div>







<div>


<p className="
text-xs
uppercase
tracking-[0.3em]
text-zinc-400
">

AI Intelligence Core

</p>



<h2 className="
text-xl
font-semibold
text-white
">

Creator Health Score

</h2>


</div>



</div>









<div className="
mt-8
flex
items-center
justify-between
">


<div>


<p className="
text-7xl
font-bold
text-white
">

{
loading
?
"..."
:
score
}

</p>



<p className="text-zinc-400">

out of 100

</p>


</div>







<div className="
rounded-xl
border
border-emerald-400/20
bg-emerald-400/10
px-4
py-3
text-center
">


<p className="
text-xs
uppercase
tracking-wider
text-zinc-400
">

System Rank

</p>



<p className="
mt-1
font-semibold
text-emerald-400
">

{level}

</p>



</div>



</div>









<div className="mt-8">


<div className="
mb-2
flex
justify-between
text-xs
">


<span className="text-zinc-400">

Intelligence Level

</span>



<span className="text-emerald-400">

{score}%

</span>



</div>







<div className="
h-2
overflow-hidden
rounded-full
bg-white/10
">


<div

className="
h-full
rounded-full
bg-emerald-400
shadow-[0_0_15px_rgba(0,255,136,0.8)]
"

style={{
width:`${score}%`,
}}

/>


</div>



</div>









<div className="mt-8 space-y-4">


<div className="
flex
items-center
gap-2
text-sm
text-zinc-300
">


<TrendingUp
size={18}
className="text-emerald-400"
/>


Growth Analysis


</div>







<div className="
flex
items-center
gap-2
text-sm
text-zinc-300
">


<Zap
size={18}
className="text-emerald-400"
/>


Performance Model


</div>







<div className="
flex
items-center
gap-2
text-sm
text-zinc-300
">


<ShieldCheck
size={18}
className="text-emerald-400"
/>


AI Validation


</div>



</div>









<div className="
mt-8
flex
items-center
gap-2
border-t
border-emerald-400/10
pt-4
text-sm
text-emerald-400
">


<Activity size={16}/>


AI systems operating normally


</div>







</div>





</div>

);

}