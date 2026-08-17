"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Brain,
  Flame,
  TrendingUp,
  Rocket,
  Cpu,
} from "lucide-react";

import {
  getVideos,
  getBestPlatform,
  Video,
} from "@/lib/analytics";





export default function AIInsights() {


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









const insights = useMemo(()=>{


if(!videos.length){


return {

content:"No data yet",

platform:"No data yet",

recommendation:
"Add videos to generate AI insights.",

};


}








const contentTypes:
Record<string,number> = {};





videos.forEach((video)=>{


if(video.content_type){


contentTypes[video.content_type] =
(contentTypes[video.content_type] || 0)
+
video.views;


}


});







const bestContent =

Object.entries(contentTypes)
.sort(
(a,b)=>
b[1]-a[1]
)[0]?.[0]

??

"Not enough data";








const bestPlatform =

getBestPlatform(videos)?.[0]

??

"Not enough data";








return {

content:bestContent,

platform:bestPlatform,

recommendation:

bestContent !== "Not enough data"

?

`Create more ${bestContent} content because it is currently your strongest format.`

:

"Continue testing different content styles.",


};


},[videos]);









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
-left-20
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

size={24}

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

AI Insight Engine

</p>



<h2 className="
text-xl
font-semibold
text-white
">

Content Intelligence

</h2>


</div>



</div>









<div className="mt-6 space-y-4">







<div

className="
rounded-xl
border
border-emerald-400/10
bg-black/20
p-4
"

>


<div className="flex items-center gap-2">


<Flame

size={18}

className="text-emerald-400"

/>


<p className="text-sm text-zinc-400">

Winning Signal

</p>


</div>





<p className="mt-2 font-semibold text-white">


{loading
?
"..."
:
insights.content}


</p>


</div>









<div

className="
rounded-xl
border
border-emerald-400/10
bg-black/20
p-4
"

>


<div className="flex items-center gap-2">


<TrendingUp

size={18}

className="text-emerald-400"

/>


<p className="text-sm text-zinc-400">

Platform Optimization

</p>


</div>





<p className="mt-2 font-semibold text-white">


{loading
?
"..."
:
insights.platform}


</p>


</div>









<div

className="
rounded-xl
border
border-emerald-400/20
bg-emerald-400/5
p-4
"

>


<div className="flex items-center gap-2">


<Rocket

size={18}

className="text-emerald-400"

/>


<p className="text-sm text-emerald-300">

AI Recommendation

</p>


</div>





<p className="mt-2 text-sm text-white">


{loading
?
"..."
:
insights.recommendation}


</p>


</div>






</div>









<div

className="
mt-6
flex
items-center
gap-2
text-sm
text-emerald-400
"

>


<Cpu size={16}/>


AI models analyzing creator patterns


</div>







</div>


</div>


);

}