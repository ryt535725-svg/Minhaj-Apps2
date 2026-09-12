let sb=null, allApps=[], allPrompts=[];
if(SUPABASE_URL.startsWith("http") && !SUPABASE_KEY.startsWith("PASTE_")){
  sb=supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
}
const fallbackApps=[
 {title:"CapCut Pro",icon:"✂️",rating:5,downloads:"6.3K",description:"Video editing app",download_url:"#"},
 {title:"MovieBox",icon:"🎞️",rating:4,downloads:"2.5K",description:"Entertainment app",download_url:"#"},
 {title:"YouTube",icon:"▶️",rating:4,downloads:"1.3K",description:"Video platform",download_url:"#"}
];
const fallbackPrompts=[
 {title:"AI Photo Prompt",emoji:"🧠"},{title:"Cinematic Portrait",emoji:"🎬"},
 {title:"4K Image Prompt",emoji:"✨"},{title:"Anime Prompt",emoji:"🎨"}
];
function stars(n){return "★".repeat(n)+"☆".repeat(5-n)}
function appCard(a){return `<article class="app-card" data-search="${(a.title||"").toLowerCase()}" onclick='openDetails(${JSON.stringify(a).replace(/'/g,"&#39;")})'><div class="app-icon">${a.image_url?`<img src="${a.image_url}" onerror="this.style.display='none'">`:a.icon||"📦"}</div><h3>${a.title}</h3><div class="stars">${stars(Number(a.rating)||5)}</div><span class="downloads">⇩ ${a.downloads||"0"}</span></article>`}
function promptCard(p){return `<article class="prompt-card"><div class="prompt-img">${p.image_url?`<img src="${p.image_url}" style="width:100%;height:100%;object-fit:cover">`:p.emoji||"🤖"}<span class="badge">AI</span></div><div class="prompt-name"><span>${p.title} 👆</span><span>▼</span></div></article>`}
async function load(){
 if(sb){
   const a=await sb.from("apps").select("*").order("created_at",{ascending:false});
   const p=await sb.from("prompts").select("*").order("created_at",{ascending:false});
   if(!a.error) allApps=a.data||[]; if(!p.error) allPrompts=p.data||[];
 }
 if(!allApps.length) allApps=fallbackApps;
 if(!allPrompts.length) allPrompts=fallbackPrompts;
 render();
}
function render(){
 document.getElementById("apps").innerHTML=allApps.map(appCard).join("");
 document.getElementById("trending").innerHTML=allApps.slice(0,3).map(appCard).join("");
 document.getElementById("prompts").innerHTML=allPrompts.map(promptCard).join("");
 document.getElementById("appCount").textContent=`(${allApps.length})`;
 document.getElementById("promptCount").textContent=`(${allPrompts.length})`;
}
function openDetails(a){
 document.getElementById("dtitle").textContent=a.title||"";
 document.getElementById("ddesc").textContent=a.description||"";
 document.getElementById("dmeta").textContent=`⭐ ${a.rating||5}/5  •  ⇩ ${a.downloads||"0"}`;
 document.getElementById("download").href=a.download_url||"#";
 const im=document.getElementById("dimg"); im.src=a.image_url||"";
 im.style.display=a.image_url?"block":"none";
 document.getElementById("details").classList.add("show");
}
function closeModal(){document.getElementById("details").classList.remove("show")}
document.getElementById("themeBtn").onclick=()=>document.body.classList.toggle("dark");
document.getElementById("menuBtn").onclick=()=>alert("Categories / About / Contact এখানে যোগ করা যাবে।");
document.getElementById("search").oninput=e=>{const q=e.target.value.toLowerCase();document.querySelectorAll("[data-search]").forEach(x=>x.style.display=!q||x.dataset.search.includes(q)?"":"none")};
load();