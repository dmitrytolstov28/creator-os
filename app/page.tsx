"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  Plus,
  ArrowRight,
  Eye,
  TrendingUp,
  Activity,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";
import PerformanceChart from "@/components/PerformanceChart";
import IntelligenceScore from "@/components/IntelligenceScore";
import AIInsights from "@/components/AIInsights";

import { getDrafts } from "@/lib/drafts";
import {
  getVideos,
  calculateTotals,
  getEngagementRate,
  Video,
} from "@/lib/analytics";



type Draft = {
  id: string;
  title: string | null;
  status: string | null;
  created_at: string;
};






export default function Home() {


  const [drafts,setDrafts] =
    useState<Draft[]>([]);


  const [videos,setVideos] =
    useState<Video[]>([]);


  const [loading,setLoading] =
    useState(true);







  useEffect(()=>{


    async function loadData(){


      try{


        const [
          draftData,
          videoData,
        ] = await Promise.all([

          getDrafts(),

          getVideos(),

        ]);



        setDrafts(
          draftData
        );


        setVideos(
          videoData
        );



      }catch(error){


        console.error(error);


      }finally{


        setLoading(false);


      }


    }



    void loadData();



  },[]);









  const upcoming =
    drafts
      .filter(
        (draft)=>
          draft.status === "Scheduled"
      )
      .slice(0,3);






  const totals =
    calculateTotals(
      videos
    );



  const engagement =
    getEngagementRate(
      videos
    );





  const pipeline = [

    {
      label:"Total Views",
      value:
        loading
        ? "..."
        : totals.views.toLocaleString(),
      icon:Eye,
    },


    {
      label:"Engagement Rate",
      value:
        loading
        ? "..."
        : `${engagement.toFixed(1)}%`,
      icon:TrendingUp,
    },


    {
      label:"Content Published",
      value:
        loading
        ? "..."
        : totals.videos.toString(),
      icon:Activity,
    },

  ];







return (

<AppShell>


<div className="space-y-8">








{/* Header */}


<div>


<p
className="
text-xs
uppercase
tracking-[0.3em]
text-emerald-400/70
"
>

Creator Command Center

</p>





<h1
className="
mt-3
text-5xl
font-bold
text-white
"
>

Welcome back 👋

</h1>





<p className="mt-2 text-zinc-400">

Manage your content, track growth, and create faster.

</p>


</div>









{/* Actions */}


<div className="flex flex-wrap gap-4">


<Link

href="/drafts"

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


Create Content


</Link>







<Link

href="/analytics"

className="
flex
items-center
gap-2
rounded-xl
border
border-emerald-400/30
bg-white/[0.04]
px-5
py-3
text-white
hover:bg-white/10
"

>


View Analytics


<ArrowRight size={18}/>


</Link>



</div>









{/* Pipeline */}


<div>


<h2 className="mb-4 text-xl font-semibold text-white">

Content Pipeline

</h2>





<div
className="
grid
gap-4
md:grid-cols-3
"
>


{pipeline.map((item)=>{


const Icon =
item.icon;



return (

<div

key={item.label}

className="
rounded-2xl
border
border-emerald-400/20
bg-white/[0.04]
p-5
"

>


<div className="flex items-center justify-between">


<p className="text-sm text-zinc-400">

{item.label}

</p>


<Icon
size={20}
className="text-emerald-400"
/>


</div>




<p
className="
mt-3
text-4xl
font-bold
text-white
"
>

{item.value}

</p>



</div>


);



})}



</div>


</div>













{/* Main Grid */}


<div
className="
grid
gap-6
xl:grid-cols-2
"
>









{/* Upcoming */}


<div
className="
rounded-2xl
border
border-emerald-400/20
bg-white/[0.04]
p-6
"
>


<h2 className="text-xl font-semibold text-white">

Upcoming Content

</h2>





<div className="mt-5 space-y-3">



{
upcoming.length === 0 ? (


<p className="text-zinc-400">

No scheduled content yet.

</p>



) : (



upcoming.map((draft)=>(


<div

key={draft.id}

className="
rounded-xl
border
border-emerald-400/10
bg-black/20
p-4
"

>


<p className="font-medium text-white">

{draft.title ?? "Untitled Draft"}

</p>


<p className="mt-1 text-sm text-emerald-400">

Scheduled

</p>


</div>


))



)

}



</div>


</div>













{/* Performance */}


<div
className="
rounded-2xl
border
border-emerald-400/20
bg-white/[0.04]
p-6
"
>


<PerformanceChart />


</div>





</div>









{/* Bottom */}


<div
className="
grid
gap-6
xl:grid-cols-2
"
>


<IntelligenceScore />


<AIInsights />


</div>







</div>


</AppShell>

);

}