"use client";

import { useEffect, useState } from "react";

import {
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Users,
  Activity,
  BarChart3,
} from "lucide-react";

import StatCard from "@/components/StatCard";

import {
  getVideos,
  calculateTotals,
  Video,
} from "@/lib/analytics";

import PerformanceChart from "@/components/PerformanceChart";



export default function AnalyticsDashboard() {


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






const stats = [

{
label:"Total Reach",
value:totals.views.toLocaleString(),
icon:Eye,
},


{
label:"Likes",
value:totals.likes.toLocaleString(),
icon:Heart,
},


{
label:"Comments",
value:totals.comments.toLocaleString(),
icon:MessageCircle,
},


{
label:"Shares",
value:totals.shares.toLocaleString(),
icon:Share2,
},


{
label:"Saved",
value:totals.saves.toLocaleString(),
icon:Bookmark,
},


{
label:"Followers",
value:totals.followers.toLocaleString(),
icon:Users,
},

];







const topVideos =
[...videos]
.sort(
(a,b)=>
b.views-a.views
)
.slice(0,5);







return (

<div className="space-y-10">







<div>


<div className="
flex
items-center
gap-2
">


<Activity
size={18}
className="text-emerald-400"
/>



<p className="
text-xs
uppercase
tracking-[0.35em]
text-emerald-400/70
">

Growth Intelligence

</p>


</div>






<h1 className="
mt-4
text-5xl
font-bold
text-white
">

Analytics Command Center

</h1>




<p className="mt-2 text-zinc-400">

Track your content performance and audience growth.

</p>



</div>









<div
className="
grid
gap-6
md:grid-cols-2
xl:grid-cols-3
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
stat.value
}

icon={stat.icon}

/>


))}



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


<div className="
mb-6
flex
items-center
gap-3
">


<BarChart3
size={20}
className="text-emerald-400"
/>


<p className="
text-sm
uppercase
tracking-[0.25em]
text-zinc-400
">

Performance Trend

</p>


</div>




<PerformanceChart />



</div>









<div
className="
rounded-2xl
border
border-emerald-400/20
bg-white/[0.04]
p-6
"
>


<div className="
flex
items-center
gap-3
">


<Activity
size={20}
className="text-emerald-400"
/>


<h2 className="
text-xl
font-semibold
text-white
">

Top Performing Content

</h2>


</div>







<div className="mt-6 space-y-4">


{topVideos.length === 0 ? (


<p className="text-zinc-400">

Add videos to see performance data.

</p>


) : (


topVideos.map((video)=>(


<div

key={video.id}

className="
flex
items-center
justify-between
rounded-xl
border
border-emerald-400/10
bg-black/20
p-4
"

>


<div>


<p className="font-semibold text-white">

{video.title}

</p>


<p className="text-sm text-zinc-400">

{video.platform}

</p>


</div>





<p className="font-semibold text-emerald-400">

{video.views.toLocaleString()} views

</p>



</div>


))


)}



</div>



</div>






</div>

);

}