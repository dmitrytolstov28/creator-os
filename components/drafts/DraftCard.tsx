"use client";

import { useState } from "react";

import {
  ChevronDown,
  ChevronUp,
  Copy,
  Loader2,
  Save,
  Trash2,
  CalendarClock,
  Sparkles,
} from "lucide-react";

import { toast } from "sonner";

import {
  scheduleDraft,
  updateDraft,
} from "../../lib/drafts";

import ProjectSelector from "./ProjectSelector";



export type Draft = {
  id:string;
  topic:string | null;
  title:string | null;
  hook:string | null;
  script:string | null;
  caption:string | null;
  status:string | null;
  project_id:string | null;
  created_at:string;
};





type Props = {
  draft:Draft;
  onDelete:(id:string)=>void;
  onStatusChange:(id:string,status:string)=>void;
};








export default function DraftCard({
draft,
onDelete,
onStatusChange,
}:Props){



const [expanded,setExpanded] =
useState(false);


const [saving,setSaving] =
useState(false);




const [topic,setTopic] =
useState(draft.topic ?? "");


const [title,setTitle] =
useState(draft.title ?? "");


const [hook,setHook] =
useState(draft.hook ?? "");


const [script,setScript] =
useState(draft.script ?? "");


const [caption,setCaption] =
useState(draft.caption ?? "");








async function saveChanges(){


try{


setSaving(true);


await updateDraft(
draft.id,
{
topic,
title,
hook,
script,
caption,
}
);



toast.success(
"Draft updated"
);



}catch{


toast.error(
"Could not update draft"
);



}finally{


setSaving(false);


}



}









async function updateSchedule(date:string){


try{


await scheduleDraft(
draft.id,
date
);



onStatusChange(
draft.id,
"Scheduled"
);



toast.success(
"Draft scheduled"
);



}catch{


toast.error(
"Could not schedule draft"
);



}



}










return (

<div

className="
rounded-2xl
border
border-emerald-400/20
bg-white/[0.04]
p-6
backdrop-blur-xl
transition
hover:border-emerald-400/40
"

>







<div
className="
flex
items-start
justify-between
gap-4
"
>


<div>


<div
className="
flex
items-center
gap-2
text-xs
uppercase
tracking-[0.25em]
text-emerald-400/70
"
>


<Sparkles size={14}/>

Content Draft

</div>





<h2
className="
mt-3
text-xl
font-bold
text-white
"
>

{title || "Untitled Draft"}

</h2>





<p className="
mt-2
text-sm
text-zinc-400
">

{hook || "No hook created yet"}

</p>





<div className="
mt-4
text-xs
text-zinc-500
">

Created {new Date(draft.created_at).toLocaleDateString()}

</div>



</div>







<select

value={draft.status ?? "Draft"}

onChange={(e)=>
onStatusChange(
draft.id,
e.target.value
)
}

className="
rounded-xl
border
border-emerald-400/20
bg-black/40
px-3
py-2
text-sm
text-white
outline-none
"

>


<option>
Draft
</option>

<option>
Filming
</option>

<option>
Scheduled
</option>

<option>
Posted
</option>


</select>




</div>









<button

onClick={()=>
setExpanded(!expanded)
}

className="
mt-5
flex
items-center
gap-2
text-sm
text-emerald-400
hover:text-emerald-300
"

>


{
expanded
?

<>

<ChevronUp size={16}/>

Hide Details

</>

:

<>

<ChevronDown size={16}/>

Edit Draft

</>

}



</button>








{expanded && (

<div
className="
mt-6
space-y-4
border-t
border-emerald-400/10
pt-6
"
>


<ProjectSelector

draftId={draft.id}

value={draft.project_id}

/>






<input

value={topic}

onChange={(e)=>
setTopic(e.target.value)
}

placeholder="Topic"

className="
w-full
rounded-xl
border
border-emerald-400/20
bg-black/30
p-3
text-white
outline-none
"

/>






<input

value={title}

onChange={(e)=>
setTitle(e.target.value)
}

placeholder="Title"

className="
w-full
rounded-xl
border
border-emerald-400/20
bg-black/30
p-3
text-white
outline-none
"

/>






<textarea

value={hook}

onChange={(e)=>
setHook(e.target.value)
}

placeholder="Hook"

className="
min-h-[80px]
w-full
rounded-xl
border
border-emerald-400/20
bg-black/30
p-3
text-white
outline-none
"

/>






<textarea

value={script}

onChange={(e)=>
setScript(e.target.value)
}

placeholder="Script"

className="
min-h-[180px]
w-full
rounded-xl
border
border-emerald-400/20
bg-black/30
p-3
text-white
outline-none
"

/>






<textarea

value={caption}

onChange={(e)=>
setCaption(e.target.value)
}

placeholder="Caption"

className="
min-h-[120px]
w-full
rounded-xl
border
border-emerald-400/20
bg-black/30
p-3
text-white
outline-none
"

/>









<div className="
flex
items-center
gap-3
">


<CalendarClock
size={16}
className="text-emerald-400"
/>


<input

type="date"

onChange={(e)=>
updateSchedule(
e.target.value
)
}

className="
rounded-xl
border
border-emerald-400/20
bg-black/30
p-3
text-white
"

/>


</div>








<div className="
flex
flex-wrap
gap-3
pt-3
"
>


<button

onClick={saveChanges}

className="
flex
items-center
gap-2
rounded-xl
border
border-emerald-400/30
bg-emerald-400/10
px-4
py-2
text-emerald-300
"

>


{
saving
?

<Loader2
size={16}
className="animate-spin"
/>

:

<Save size={16}/>

}


Save


</button>







<button

onClick={()=>{

navigator.clipboard.writeText(
`${title}\n\n${hook}\n\n${script}\n\n${caption}`
);


toast.success(
"Copied"
);


}}

className="
flex
items-center
gap-2
rounded-xl
border
border-zinc-700
px-4
py-2
text-zinc-300
"

>


<Copy size={16}/>

Copy


</button>







<button

onClick={()=>
onDelete(draft.id)
}

className="
flex
items-center
gap-2
rounded-xl
border
border-red-400/30
bg-red-400/10
px-4
py-2
text-red-300
"

>


<Trash2 size={16}/>

Delete


</button>






</div>





</div>

)}




</div>

);

}