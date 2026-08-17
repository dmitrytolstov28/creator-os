"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  ExternalLink,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Users,
  Edit,
  Trash2,
  Video,
} from "lucide-react";

import { toast } from "sonner";

import AppShell from "@/components/layout/AppShell";

import {
  getVideos,
  Video as VideoType,
} from "@/lib/analytics";

import { supabase } from "@/lib/supabase";









function PlatformBadge({
  platform,
}:{
  platform:string;
}){


const name =
platform.toLowerCase();




if(
name.includes("youtube")
||
name.includes("yt")
){

return (

<div className="
flex
items-center
gap-2
rounded-xl
bg-red-500/20
px-4
py-2
text-sm
font-semibold
text-red-300
">

▶ YouTube

</div>

);

}





if(
name.includes("tiktok")
||
name.includes("tik")
){

return (

<div className="
flex
items-center
gap-2
rounded-xl
bg-white/10
px-4
py-2
text-sm
font-semibold
text-white
">

♪ TikTok

</div>

);

}





return (

<div className="
flex
items-center
gap-2
rounded-xl
bg-pink-500/20
px-4
py-2
text-sm
font-semibold
text-pink-300
">

◎ Instagram

</div>

);


}









export default function VideoPage(){


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









useEffect(()=>{


async function loadVideo(){


try{


const videos =
await getVideos();



const found =
videos.find(
(item)=>
String(item.id) === id
);



if(!found){

toast.error(
"Video not found"
);

router.push("/videos");

return;

}



setVideo(found);




}catch(error){


console.error(error);



}finally{


setLoading(false);


}


}



void loadVideo();



},[
id,
router
]);









async function deleteVideo(){


const confirmDelete =
confirm(
"Delete this video?"
);



if(!confirmDelete){

return;

}



const {error} =
await supabase
.from("videos")
.delete()
.eq(
"id",
id
);



if(error){

toast.error(
"Could not delete video"
);

return;

}



toast.success(
"Video deleted"
);



router.push("/videos");


}









if(loading){


return (

<AppShell>

<div className="text-zinc-400">

Loading video...

</div>

</AppShell>

);

}








if(!video){

return null;

}








const engagement =

video.views > 0

?

(
(
(video.likes +
video.comments +
video.shares)
/
video.views
)
*
100
).toFixed(1)

:

"0";









return (

<AppShell>


<div className="space-y-8">







<Link

href="/videos"

className="
flex
items-center
gap-2
text-zinc-400
hover:text-white
"

>

<ArrowLeft size={18}/>

Back to Videos

</Link>









<div className="
grid
gap-8
xl:grid-cols-[420px_1fr]
"
>








{/* LEFT VIDEO PREVIEW */}


<div className="
flex
justify-center
rounded-3xl
border
border-emerald-400/20
bg-black/30
p-6
"
>


<div className="
relative
h-[760px]
overflow-hidden
rounded-2xl
bg-black
shadow-2xl
"
>


{
video.thumbnail_url ? (

<img

src={video.thumbnail_url}

alt={video.title}

className="
h-full
w-[430px]
object-cover
"

/>

)

:

(

<div className="
flex
h-full
w-[430px]
items-center
justify-center
text-zinc-600
">

<Video size={60}/>

</div>

)

}



</div>


</div>









{/* RIGHT PANEL */}


<div className="space-y-6">






<div className="
rounded-3xl
border
border-emerald-400/20
bg-white/[0.04]
p-8
"
>



<PlatformBadge
platform={video.platform}
/>





<h1 className="
mt-5
text-4xl
font-bold
text-white
">

{video.title}

</h1>




<p className="
mt-3
text-zinc-400
">

Posted:

{" "}

{
new Date(video.created_at)
.toLocaleDateString()
}

</p>






<div className="
mt-8
grid
gap-4
md:grid-cols-2
"
>





<StatCard

icon={<Eye/>}

label="Views"

value={
video.views.toLocaleString()
}

/>





<StatCard

icon={<Heart/>}

label="Likes"

value={
video.likes.toLocaleString()
}

/>





<StatCard

icon={<MessageCircle/>}

label="Comments"

value={
video.comments.toLocaleString()
}

/>





<StatCard

icon={<Share2/>}

label="Shares"

value={
video.shares.toLocaleString()
}

/>





<StatCard

icon={<Bookmark/>}

label="Saves"

value={
video.saves.toLocaleString()
}

/>





<StatCard

icon={<Users/>}

label="Followers Gained"

value={
video.followers_gained.toLocaleString()
}

/>






</div>






</div>









<div className="
rounded-3xl
border
border-emerald-400/20
bg-white/[0.04]
p-8
"
>


<h2 className="
text-xl
font-semibold
text-white
">

Performance

</h2>




<div className="
mt-5
text-5xl
font-bold
text-emerald-400
">

{engagement}%

</div>



<p className="
mt-2
text-zinc-400
">

Engagement Rate

</p>



</div>









<div className="
flex
flex-wrap
gap-4
"
>





<Link

href={`/videos/${video.id}/edit`}

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

<Edit size={18}/>

Edit Video

</Link>







{
video.post_url && (

<a

href={video.post_url}

target="_blank"

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









function StatCard({
icon,
label,
value,
}:{
icon:React.ReactNode;
label:string;
value:string;
}){


return (

<div className="
rounded-2xl
border
border-emerald-400/20
bg-black/20
p-5
"
>


<div className="
flex
items-center
gap-3
text-zinc-400
">

{icon}

{label}

</div>



<p className="
mt-3
text-3xl
font-bold
text-white
">

{value}

</p>



</div>

);


}