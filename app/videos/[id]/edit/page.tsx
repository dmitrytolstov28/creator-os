"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import {
  ArrowLeft,
  Save,
  Loader2,
  Trash2,
  ExternalLink,
  Video,
} from "lucide-react";

import { toast } from "sonner";

import AppShell from "@/components/layout/AppShell";

import {
  getVideos,
  Video as VideoType,
} from "@/lib/analytics";

import { supabase } from "@/lib/supabase";

import ThumbnailUpload from "@/components/videos/ThumbnailUpload";





export default function EditVideoPage(){


const params =
useParams();


const router =
useRouter();


const id =
params.id as string;





const [video,setVideo] =
useState<VideoType | null>(null);


const [loading,setLoading] =
useState(true);


const [saving,setSaving] =
useState(false);





const [title,setTitle] =
useState("");

const [platform,setPlatform] =
useState("");

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









useEffect(()=>{


async function load(){


try{


const videos =
await getVideos();


const found =
videos.find(
(item)=>
String(item.id) === id
);



if(!found){

router.push("/videos");

return;

}



setVideo(found);

setTitle(found.title);

setPlatform(found.platform);

setThumbnailUrl(
found.thumbnail_url ?? ""
);

setPostUrl(
found.post_url ?? ""
);


setViews(
String(found.views)
);


setLikes(
String(found.likes)
);


setComments(
String(found.comments)
);


setShares(
String(found.shares)
);


setSaves(
String(found.saves)
);


setFollowers(
String(found.followers_gained)
);



}catch(error){


console.error(error);


toast.error(
"Could not load video"
);



}finally{


setLoading(false);


}



}



void load();



},[
id,
router
]);









async function saveChanges(){


try{


setSaving(true);



const {error} =

await supabase
.from("videos")
.update({

title,

platform,

thumbnail_url:
thumbnailUrl || null,

post_url:
postUrl || null,

views:Number(views)||0,

likes:Number(likes)||0,

comments:Number(comments)||0,

shares:Number(shares)||0,

saves:Number(saves)||0,

followers_gained:Number(followers)||0,

})
.eq(
"id",
id
);



if(error)
throw error;



toast.success(
"Video updated"
);


router.push(
`/videos/${id}`
);


}catch(error){


console.error(error);


toast.error(
"Could not update video"
);



}finally{


setSaving(false);


}



}









async function deleteVideo(){


const confirmDelete =
confirm(
"Delete this video?"
);



if(!confirmDelete)
return;




const {error}=

await supabase
.from("videos")
.delete()
.eq(
"id",
id
);



if(error){

toast.error(
"Delete failed"
);

return;

}



toast.success(
"Video deleted"
);


router.push(
"/videos"
);



}









if(loading){


return (

<AppShell>

<div className="text-zinc-400">

Loading...

</div>

</AppShell>

);

}







if(!video)
return null;









const stats=[

{
label:"Views",
value:views,
set:setViews
},

{
label:"Likes",
value:likes,
set:setLikes
},

{
label:"Comments",
value:comments,
set:setComments
},

{
label:"Shares",
value:shares,
set:setShares
},

{
label:"Saves",
value:saves,
set:setSaves
},

{
label:"Followers",
value:followers,
set:setFollowers
},

];









return (

<AppShell>


<div className="space-y-8">







<Link

href={`/videos/${id}`}

className="
flex
items-center
gap-2
text-zinc-400
hover:text-white
"

>

<ArrowLeft size={18}/>

Back to Video

</Link>









<div className="
grid
gap-8
xl:grid-cols-[420px_700px]
items-start
">









{/* PREVIEW */}


<div className="
rounded-3xl
border
border-emerald-400/20
bg-white/[0.04]
p-6
flex
justify-center
"
>


<div className="
aspect-[9/16]
w-[330px]
overflow-hidden
rounded-2xl
bg-black
"
>


{
thumbnailUrl ? (


<img

src={thumbnailUrl}

alt={title}

className="
h-full
w-full
object-contain
"

/>


)

:

(

<div className="
flex
h-full
items-center
justify-center
text-zinc-600
">

<Video size={55}/>

</div>

)

}



</div>


</div>









{/* EDIT PANEL */}


<div className="
rounded-3xl
border
border-emerald-400/20
bg-white/[0.04]
p-8
space-y-6
"
>



<h1 className="
text-4xl
font-bold
text-white
">

Edit Video

</h1>








<div className="space-y-2">

<label className="text-sm text-zinc-400">

Title

</label>


<input

value={title}

onChange={(e)=>
setTitle(e.target.value)
}

className="
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








<div className="space-y-2">

<label className="text-sm text-zinc-400">

Platform

</label>


<select

value={platform}

onChange={(e)=>
setPlatform(e.target.value)
}

className="
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









<ThumbnailUpload

value={thumbnailUrl}

onChange={setThumbnailUrl}

/>









<div className="space-y-2">

<label className="text-sm text-zinc-400">

Post URL

</label>


<input

value={postUrl}

onChange={(e)=>
setPostUrl(e.target.value)
}

className="
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









<div className="
grid
grid-cols-2
gap-4
">


{
stats.map((stat)=>(


<div key={stat.label}>


<label className="
text-xs
text-zinc-400
">

{stat.label}

</label>


<input

type="number"

value={stat.value}

onChange={(e)=>
stat.set(
e.target.value
)
}

className="
mt-1
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


</div>









<div className="
flex
flex-wrap
gap-3
pt-4
">





<button

onClick={saveChanges}

disabled={saving}

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
"

>

{
saving ?

<Loader2
size={18}
className="animate-spin"
/>

:

<Save size={18}/>

}


Save Changes

</button>







{
postUrl && (

<a

href={postUrl}

target="_blank"

className="
flex
items-center
gap-2
rounded-xl
border
border-emerald-400/30
px-5
py-3
text-white
"

>

<ExternalLink size={18}/>

Open Post

</a>

)

}







<button

onClick={deleteVideo}

className="
flex
items-center
gap-2
rounded-xl
border
border-red-400/30
bg-red-400/10
px-5
py-3
text-red-300
"

>

<Trash2 size={18}/>

Delete

</button>







</div>







</div>








</div>






</div>


</AppShell>

);

}