"use client";

import { useEffect, useMemo, useState } from "react";

import {
  BarChart3,
  Eye,
  Heart,
  Users,
  Trophy,
  Brain,
  Activity,
} from "lucide-react";

import StatCard from "@/components/StatCard";

import {
  getVideos,
  calculateTotals,
  getAverageViews,
  getBestVideo,
  getBestPlatform,
  Video,
} from "@/lib/analytics";





export default function ReportsDashboard() {


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









const totals =
calculateTotals(videos);



const averageViews =
getAverageViews(videos);




const bestVideo =
useMemo(
()=>getBestVideo(videos),
[videos]
);




const bestPlatform =
useMemo(
()=>getBestPlatform(videos),
[videos]
);









const stats = [

{
label:"Content Created",
value:totals.videos,
icon:BarChart3,
},

{
label:"Total Reach",
value:totals.views,
icon:Eye,
},

{
label:"Engagement",
value:totals.likes,
icon:Heart,
},

{
label:"Audience",
value:totals.followers,
icon:Users,
},

];







return (

<div className="space-y-8">







<div
className="
grid
gap-6
md:grid-cols-2
xl:grid-cols-4
"
>


{stats.map((stat)=>(


<StatCard

key={stat.label}

label={
loading
?
"Loading..."
:
stat.label
}

value={
loading
?
"..."
:
stat.value.toLocaleString()
}

icon={stat.icon}

/>


))}


</div>









<div
className="
grid
gap-6
lg:grid-cols-2
"
>








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
"
>


<div
className="
absolute
-right-20
-top-20
h-40
w-40
rounded-full
bg-emerald-400/10
blur-3xl
"
/>






<div className="relative">


<div className="flex items-center gap-3">


<Trophy
size={20}
className="text-emerald-400"
/>



<h2 className="
text-xl
font-semibold
text-white
">

Top Content

</h2>


</div>







{
bestVideo ? (

<div className="mt-6">


<p className="font-semibold text-white">

{bestVideo.title}

</p>



<p className="mt-2 text-emerald-400">

{bestVideo.views.toLocaleString()} views

</p>



</div>


) : (


<p className="mt-6 text-zinc-400">

Add videos to generate reports.

</p>


)

}



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


<div className="flex items-center gap-3">


<Brain
size={20}
className="text-emerald-400"
/>



<h2 className="
text-xl
font-semibold
text-white
">

Account Intelligence

</h2>


</div>







<div className="
mt-6
space-y-4
text-zinc-300
">


<p>

Average views:

<span className="ml-2 font-bold text-white">

{averageViews.toLocaleString()}

</span>

</p>





<p>

Best platform:

<span className="ml-2 font-bold text-white">

{bestPlatform?.[0] ?? "No data"}

</span>

</p>






<p>

Total comments:

<span className="ml-2 font-bold text-white">

{totals.comments.toLocaleString()}

</span>

</p>



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


<div className="flex items-center gap-3">


<Activity
size={20}
className="text-emerald-400"
/>



<h2 className="
text-xl
font-semibold
text-white
">

AI Report Summary

</h2>


</div>






<p className="
mt-4
text-zinc-400
">

Reports update automatically as your content library grows.

</p>



</div>







</div>

);

}