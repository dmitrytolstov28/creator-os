"use client";

import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import {
  getVideos,
  Video,
} from "@/lib/analytics";





export default function PerformanceChart() {


const [data,setData] = useState<
{
date:string;
views:number;
}[]
>([]);







useEffect(()=>{


async function loadData(){


try{


const videos =
await getVideos();





const chartData =
videos.map(
(video:Video)=>({

date:
new Date(video.created_at)
.toLocaleDateString(
"en-US",
{
month:"short",
day:"numeric",
}
),


views:
video.views,

})
);




setData(chartData);



}catch(error){

console.error(error);

}



}



void loadData();



},[]);







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
shadow-[0_0_35px_rgba(0,255,136,0.08)]
"
>





<div
className="
pointer-events-none
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






<div className="mb-6">


<p
className="
text-xs
uppercase
tracking-[0.3em]
text-emerald-400/70
"
>

Growth Telemetry

</p>





<h2
className="
mt-2
text-xl
font-semibold
text-white
"
>

Performance Trend

</h2>





<p className="text-sm text-zinc-400">

Views generated across your content timeline.

</p>



</div>








<div className="h-72 w-full">


<ResponsiveContainer
width="100%"
height="100%"
>


<LineChart data={data}>


<CartesianGrid
strokeDasharray="3 3"
stroke="rgba(0,255,136,0.12)"
/>





<XAxis

dataKey="date"

stroke="#71717a"

tick={{
fill:"#71717a",
fontSize:12,
}}

/>





<YAxis

stroke="#71717a"

tick={{
fill:"#71717a",
fontSize:12,
}}

/>








<Tooltip

contentStyle={{

background:"#020604",

border:
"1px solid rgba(0,255,136,0.3)",

borderRadius:"12px",

color:"#fff",

}}

/>








<Line

type="monotone"

dataKey="views"

stroke="#00ff88"

strokeWidth={3}

dot={{
fill:"#00ff88",
r:4,
}}

activeDot={{
r:7,
}}

/>





</LineChart>


</ResponsiveContainer>



</div>






</div>





</div>

);

}