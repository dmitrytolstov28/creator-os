"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";





export default function ThumbnailUpload({
  onChange,
}:{
  value:string;
  onChange:(url:string)=>void;
}){


const [uploading,setUploading] =
useState(false);





async function handleUpload(
e:React.ChangeEvent<HTMLInputElement>
){


const file =
e.target.files?.[0];


if(!file)
return;




try{


setUploading(true);



const fileName =
`${Date.now()}-${file.name}`;



const {
error
} =
await supabase
.storage
.from("thumbnails")
.upload(
fileName,
file
);



if(error)
throw error;





const {
data
}
=
supabase
.storage
.from("thumbnails")
.getPublicUrl(
fileName
);



onChange(
data.publicUrl
);



}catch(error){


console.error(error);



}finally{


setUploading(false);


}



}








return (

<label

className="
inline-flex
cursor-pointer
items-center
gap-2
rounded-xl
border
border-emerald-400/30
bg-emerald-400/10
px-4
py-3
text-sm
font-semibold
text-emerald-300
hover:bg-emerald-400/20
"

>

<Upload size={16}/>

{
uploading
?
"Uploading..."
:
"Upload Thumbnail"
}



<input

type="file"

accept="image/*"

onChange={handleUpload}

className="
hidden
"

/>


</label>

);

}