"use client";

import AppShell from "../../components/layout/AppShell";

import IntelligenceScore from "../../components/IntelligenceScore";
import ReportsDashboard from "../../components/ReportsDashboard";
import AIInsights from "../../components/AIInsights";

import {
  Brain,
  Sparkles,
  Activity,
} from "lucide-react";



export default function IntelligencePage() {


return (

<AppShell>


<div className="space-y-10">







{/* Header */}


<div>


<div className="flex items-center gap-2">


<Brain
size={18}
className="text-emerald-400"
/>



<p
className="
text-xs
uppercase
tracking-[0.35em]
text-emerald-400/70
"
>

AI Growth Engine

</p>


</div>







<h1
className="
mt-4
text-5xl
font-bold
text-white
"
>

Creator Intelligence

</h1>






<p className="mt-2 text-zinc-400">

AI insights, performance analysis, and growth recommendations.

</p>


</div>









{/* AI Core */}


<div
className="
flex
items-center
gap-2
"
>


<Sparkles
size={18}
className="text-emerald-400"
/>



<p
className="
text-xs
uppercase
tracking-[0.3em]
text-zinc-400
"
>

AI Core Systems

</p>


</div>








<div
className="
grid
gap-6
lg:grid-cols-2
"
>


<IntelligenceScore />


<AIInsights />


</div>









{/* Reports */}


<div
className="
flex
items-center
gap-2
"
>


<Activity
size={18}
className="text-emerald-400"
/>



<p
className="
text-xs
uppercase
tracking-[0.3em]
text-zinc-400
"
>

Growth Reports

</p>


</div>






<ReportsDashboard />






</div>


</AppShell>

);

}