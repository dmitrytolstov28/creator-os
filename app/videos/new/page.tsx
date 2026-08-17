"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Save,
  Loader2,
  Image,
  Link as LinkIcon,
} from "lucide-react";

import Link from "next/link";

import { toast } from "sonner";

import AppShell from "@/components/layout/AppShell";

import { supabase } from "@/lib/supabase";






export default function NewVideoPage(){


const router = useRouter();





const [saving,setSaving] =
useState(false);





const [title,setTitle] =
useState("");

const [platform,setPlatform] =
useState("Instagram");

const [thumbnailUrl,setThumbnailUrl] =
useState("");

const [postUrl,setPostUrl] =
useState("");

const [views,setViews] =
useState("");

const [likes,setLikes] =
useState("");

const [comments,setComments] =
useState("");

const [shares,setShares] =
useState("");

const [saves,setSaves] =
useState("");

const [followers,setFollowers] =
useState("");









async function handleSave(){


if(!title.trim()){


toast.error(
"Enter a video title"
);


return;


}




try{


setSaving(true);





const { error } =

await supabase
.from("videos")
.insert({

title,

platform,


thumbnail_url:
thumbnailUrl || null,


post_url:
postUrl || null,


views:
Number(views) || 0,


likes:
Number(likes) || 0,


comments:
Number(comments) || 0,


shares:
Number(shares) || 0,


saves:
Number(saves) || 0,


followers_gained:
Number(followers) || 0,


});






if(error){

throw error;

}






toast.success(
"Video added"
);




router.push(
"/videos"
);



router.refresh();





}catch(error){


console.error(error);


toast.error(
"Could not add video"
);



}finally{


setSaving(false);


}



}









return (

<AppShell>


<div className="space-y-8">







<Link

href="/videos"

className="
flex
items-center
gap-2
text-sm
text-zinc-400
hover:text-white
"

>


<ArrowLeft size={16}/>


Back to Videos


</Link>








<div>


<p
className="
text-xs
uppercase
tracking-[0.3em]
text-emerald-400/70
"
>

Published Content

</p>



<h1
className="
mt-3
text-5xl
font-bold
text-white
"
>

Add Video

</h1>



<p className="mt-2 text-zinc-400">

Track a video you already published.

</p>


</div>









<div
className="
max-w-2xl
rounded-2xl
border
border-emerald-400/20
bg-white/[0.04]
p-8
space-y-5
"
>








<div>

<label className="text-sm text-zinc-400">

Video Title

</label>


<input

value={title}

onChange={(e)=>
setTitle(e.target.value)
}

placeholder="Example: Morning Routine"

className="
mt-2
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


</div>









<div>

<label className="text-sm text-zinc-400">

Platform

</label>


<select

value={platform}

onChange={(e)=>
setPlatform(e.target.value)
}

className="
mt-2
w-full
rounded-xl
border
border-emerald-400/20
bg-black/30
p-3
text-white
"

>


<option>
Instagram
</option>


<option>
TikTok
</option>


<option>
YouTube
</option>


</select>


</div>









<div>

<label className="flex items-center gap-2 text-sm text-zinc-400">

<Image size={15}/>

Thumbnail URL

</label>


<input

value={thumbnailUrl}

onChange={(e)=>
setThumbnailUrl(e.target.value)
}

placeholder="https://image-url.com"

className="
mt-2
w-full
rounded-xl
border
border-emerald-400/20
bg-black/30
p-3
text-white
"

/>


</div>









<div>

<label className="flex items-center gap-2 text-sm text-zinc-400">

<LinkIcon size={15}/>

Post URL

</label>


<input

value={postUrl}

onChange={(e)=>
setPostUrl(e.target.value)
}

placeholder="https://instagram.com/reel/..."

className="
mt-2
w-full
rounded-xl
border
border-emerald-400/20
bg-black/30
p-3
text-white
"

/>


</div>









{
[

{
label:"Views",
value:views,
set:setViews,
},

{
label:"Likes",
value:likes,
set:setLikes,
},

{
label:"Comments",
value:comments,
set:setComments,
},

{
label:"Shares",
value:shares,
set:setShares,
},

{
label:"Saves",
value:saves,
set:setSaves,
},

{
label:"Followers Gained",
value:followers,
set:setFollowers,
},

].map((item)=>(


<div key={item.label}>


<label className="text-sm text-zinc-400">

{item.label}

</label>



<input

type="number"

value={item.value}

onChange={(e)=>
item.set(
e.target.value
)
}

className="
mt-2
w-full
rounded-xl
border
border-emerald-400/20
bg-black/30
p-3
text-white
"

/>


</div>


))

}









<button

onClick={handleSave}

disabled={saving}

className="
mt-4
flex
items-center
gap-2
rounded-xl
bg-emerald-400
px-6
py-3
font-semibold
text-black
hover:bg-emerald-300
disabled:opacity-50
"

>


{
saving
?

<Loader2
size={18}
className="animate-spin"
/>

:

<Save size={18}/>

}



{
saving
?
"Saving..."
:
"Save Video"
}


</button>









</div>







</div>


</AppShell>

);

}