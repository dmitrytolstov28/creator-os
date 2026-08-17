"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  Loader2,
  Search,
  Plus,
  Lightbulb,
  CalendarClock,
  AlertCircle,
} from "lucide-react";

import { toast } from "sonner";

import AppShell from "../../components/layout/AppShell";

import DraftCard, {
  type Draft,
} from "../../components/drafts/DraftCard";

import { Card } from "@/components/ui/card";

import {
  getDrafts,
  deleteDraft,
  updateDraftStatus,
} from "../../lib/drafts";





export default function DraftsPage() {


const [drafts,setDrafts] =
useState<Draft[]>([]);


const [loading,setLoading] =
useState(true);


const [search,setSearch] =
useState("");


const [filter,setFilter] =
useState("All");








async function loadDrafts(){


try{


const data =
await getDrafts();


setDrafts(data);



}catch{


toast.error(
"Could not load drafts"
);



}finally{


setLoading(false);


}


}








useEffect(()=>{


void loadDrafts();


},[]);









async function handleDelete(id:string){


try{


await deleteDraft(id);



setDrafts((current)=>
current.filter(
(draft)=>
draft.id !== id
)
);



toast.success(
"Draft deleted"
);



}catch{


toast.error(
"Could not delete draft"
);



}



}









async function handleStatus(
id:string,
status:string
){


try{


await updateDraftStatus(
id,
status
);



setDrafts((current)=>

current.map((draft)=>

draft.id === id

?

{
...draft,
status,
}

:

draft

)

);



}catch{


toast.error(
"Could not update status"
);



}



}









const filteredDrafts =
useMemo(()=>{


const query =
search.toLowerCase();




return drafts.filter((draft)=>{



// Remove posted videos from drafts
if(
draft.status === "Posted"
){

return false;

}





const matchesSearch =

[
draft.title,
draft.topic,
draft.hook,
draft.status,
]

.some((value)=>

value
?.toLowerCase()
.includes(query)

);






const matchesFilter =

filter === "All"

||

draft.status === filter;






return (
matchesSearch &&
matchesFilter
);



});



},[
drafts,
search,
filter
]);









const stats = [

{
label:"Total Ideas",
value:
filteredDrafts.length,
icon:Lightbulb,
},


{
label:"Scheduled Next",
value:
filteredDrafts.filter(
(d)=>
d.status === "Scheduled"
).length,
icon:CalendarClock,
},


{
label:"Needs Review",
value:
filteredDrafts.filter(
(d)=>
d.status === "Draft"
).length,
icon:AlertCircle,
},


];







const filters = [

"All",

"Draft",

"Filming",

"Scheduled",

];











return (

<AppShell>


<div className="space-y-8">







<div className="flex items-start justify-between">


<div>



<p
className="
text-xs
uppercase
tracking-[0.3em]
text-emerald-400/70
"
>

Content Creation

</p>




<h1
className="
mt-3
text-5xl
font-bold
text-white
"
>

Drafts

</h1>




<p className="mt-2 text-zinc-400">

Organize your ideas and prepare your next videos.

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


New Draft


</Link>






</div>









<div
className="
grid
gap-4
md:grid-cols-3
"
>


{
stats.map((stat)=>{


const Icon =
stat.icon;



return (

<Card

key={stat.label}

className="
border-emerald-400/20
bg-white/[0.04]
p-5
"

>


<div className="flex justify-between">


<p className="text-sm text-zinc-400">

{stat.label}

</p>


<Icon

size={20}

className="text-emerald-400"

/>


</div>




<p
className="
mt-3
text-3xl
font-bold
text-white
"
>

{stat.value}

</p>




</Card>


);


})

}



</div>









<div
className="
flex
flex-wrap
gap-3
"
>


{
filters.map((item)=>(


<button

key={item}

onClick={()=>
setFilter(item)
}

className={`

rounded-xl
px-4
py-2
text-sm
transition

${
filter === item

?

"bg-emerald-400 text-black"

:

"border border-emerald-400/20 bg-white/[0.04] text-zinc-300"

}

`}

>


{item}


</button>


))

}


</div>









<div
className="
flex
items-center
gap-3
rounded-2xl
border
border-emerald-400/20
bg-white/[0.04]
px-5
py-4
"
>


<Search

size={18}

className="text-emerald-400"

/>



<input

value={search}

onChange={(e)=>
setSearch(
e.target.value
)
}

placeholder="Search content ideas..."

className="
w-full
bg-transparent
text-white
outline-none
placeholder:text-zinc-500
"

/>



</div>









{
loading ? (


<div className="flex items-center gap-3 text-zinc-400">


<Loader2

size={18}

className="animate-spin"

/>


Loading drafts...


</div>



) : filteredDrafts.length === 0 ? (



<Card

className="
border-emerald-400/20
bg-white/[0.04]
p-12
text-center
"

>


<h2 className="text-xl font-semibold text-white">

No draft content

</h2>



<p className="mt-2 text-zinc-400">

Create your next video idea.

</p>




<Link

href="/drafts/new"

className="
mt-6
inline-flex
items-center
gap-2
rounded-xl
bg-emerald-400
px-5
py-3
font-semibold
text-black
"

>


<Plus size={18}/>


Create Draft


</Link>



</Card>




) : (



<div

className="
grid
gap-6
xl:grid-cols-2
"

>


{
filteredDrafts.map((draft)=>(


<DraftCard

key={draft.id}

draft={draft}

onDelete={handleDelete}

onStatusChange={handleStatus}

/>


))

}



</div>



)

}





</div>


</AppShell>

);

}