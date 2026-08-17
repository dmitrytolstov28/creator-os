"use client";

import { useEffect, useState } from "react";

import {
  CalendarDays,
  Activity,
} from "lucide-react";

import CalendarCard from "./CalendarCard";

import { supabase } from "@/lib/supabase";



const weekDays = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];





export default function CalendarGrid() {


const [scheduledPosts,setScheduledPosts] =
useState<
{
day:number;
title:string;
platform:"Instagram";
}[]
>([]);







useEffect(()=>{


async function loadPosts(){


const {data} =
await supabase
.from("content_drafts")
.select(
"title, scheduled_for"
)
.not(
"scheduled_for",
"is",
null
);



if(!data) return;





setScheduledPosts(

data.map((draft)=>({


day:
new Date(
draft.scheduled_for
).getDate(),


title:
draft.title ??
"Untitled Post",


platform:
"Instagram",


}))

);



}



void loadPosts();


},[]);









return (

<div className="space-y-5">







<div
className="
flex
items-center
justify-between
rounded-xl
border
border-emerald-400/10
bg-black/20
px-4
py-3
"
>


<div className="
flex
items-center
gap-2
">


<CalendarDays
size={18}
className="text-emerald-400"
/>


<span className="
text-sm
text-zinc-300
">

Content Timeline

</span>


</div>







<div className="
flex
items-center
gap-2
text-xs
uppercase
tracking-wider
text-emerald-400
">


<Activity size={14}/>


System Active


</div>



</div>









<div
className="
grid
grid-cols-7
gap-4
"
>


{weekDays.map((day)=>(


<div

key={day}

className="
rounded-xl
border
border-emerald-400/10
bg-white/[0.03]
py-3
text-center
text-xs
font-medium
uppercase
tracking-wider
text-emerald-400/70
"

>


{day}


</div>


))}



</div>









<div
className="
grid
grid-cols-7
gap-4
"
>


{
Array.from(
{
length:31,
},
(_,index)=>{


const day =
index + 1;



const post =
scheduledPosts.find(
(item)=>
item.day === day
);





return (

<div
key={day}
className="min-h-[120px]"
>


<CalendarCard

day={day}

title={post?.title}

platform={post?.platform}

/>


</div>


);


}

)

}



</div>







</div>

);

}