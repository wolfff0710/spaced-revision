window.addEventListener("error",function(e){var a=document.getElementById("app");if(a&&!a.innerHTML.trim())a.innerHTML='<div class="sec"><div class="em0">\u26a0 Something failed to load: '+(e.message||"error")+'</div></div>'});
const SUPABASE_URL="https://mhfqzujwzjxusckhibkr.supabase.co";
const SUPABASE_KEY="sb_publishable_Jbv4ZSsqv5CnyFSBggMRHw_pFsGvn8o";
let sb=null;try{sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY)}catch(e){}

const D={
CHEMISTRY:[[null,["Solutions","Chemical Kinetics","Electrochemistry","Co-ordination Compounds","DnF Block"]],["ORGANIC",["Haloalkanes and Haloarenes","Alcohols, Phenols and Esters","Aldehydes, Ketones and Carboxylic Acid","Amines","Biomolecules"]]],
PHYSICS:[["VOLUME 1",["Electric Charges and Fields","Electrostatic Potential and Capacitance","Current Electricity","Moving Charges and Magnetism","Magnetism and Matter","Electromagnetic Induction","Alternating Current","Electromagnetic Waves"]],["VOLUME 2",["Ray Optics and Optical Instruments","Wave Optics","Dual Nature of Radiation and Matter","Atoms","Nuclei","Semiconductor Electronics"]]],
MATHS:[["PART 1",["Relations and Functions","Inverse Trigonometric Functions","Matrices","Determinants","Continuity and Differentiability","Application of Derivatives"]],["PART 2",["Integrals","Application of Integrals","Differential Equations","Vector Algebra","Three Dimensional Geometry","Linear Programming","Probability"]]]
};
/* ---------- Class 11 portal data ---------- */
D["XI CHEMISTRY"]=[["PART 1",["Some Basic Concepts of Chemistry","Structure of Atom","Classification of Elements and Periodicity","Chemical Bonding and Molecular Structure","Thermodynamics","Equilibrium"]],["PART 2",["Redox Reactions","Organic Chemistry: Basic Principles and Techniques","Hydrocarbons"]]];
D["XI PHYSICS"]=[["PART 1",["Units and Measurements","Motion in a Straight Line","Motion in a Plane","Laws of Motion","Work, Energy and Power","System of Particles and Rotational Motion","Gravitation"]],["PART 2",["Mechanical Properties of Solids","Mechanical Properties of Fluids","Thermal Properties of Matter","Thermodynamics","Kinetic Theory","Oscillations","Waves"]]];
D["XI MATHS"]=[["PART 1",["Sets","Relations and Functions","Trigonometric Functions","Complex Numbers and Quadratic Equations","Linear Inequalities","Permutations and Combinations","Binomial Theorem"]],["PART 2",["Sequences and Series","Straight Lines","Conic Sections","Introduction to Three Dimensional Geometry","Limits and Derivatives","Statistics","Probability"]]];
const OFF=[1,7,21],KEY="spaced_revision_v1";
let S={},R={},P={},E={},W={},H={},K={},A=true,CL="12",pending=0,loaded=false,ready=false,dirty=false,seq=0;
let SM="";try{SM=({"1":"pri","pri":"pri","date":"date"})[localStorage.getItem(KEY+"_s")]||""}catch(e){}
const setStatus=t=>{syncStatus.textContent=t};
const apply=d=>{K=d.K||{};S=d.S||{};R=d.R||{};P=d.P||{};E=d.E||{};W=d.W||{};H=d.H||{};A=d.A!==false;CL=d.CL==="11"?"11":"12"};
try{dirty=localStorage.getItem(KEY+"_d")==="1"}catch(e){}
const setD=v=>{dirty=v;try{localStorage.setItem(KEY+"_d",v?"1":"0")}catch(e){}};
try{const L0=JSON.parse(localStorage.getItem(KEY+"_all")||"null");if(L0){apply(L0);ready=true}}catch(e){}

/* ---------- login (hidden password form) ---------- */
let LP=null;
function login(){
  if(LP)return LP;
  LP=new Promise(async res=>{
    if(!sb)return res(false);
    try{const{data}=await sb.auth.getSession();if(data.session)return res(true)}catch(e){return res(false)}
    const f="padding:12px;border-radius:12px;border:1px solid rgba(255,255,255,.17);background:#000;color:#f4f6ff;font:16px DM Sans,system-ui,sans-serif;width:100%";
    const o=document.createElement("div");
    o.style.cssText="position:fixed;top:0;right:0;bottom:0;left:0;z-index:999;display:grid;place-items:center;background:rgba(0,0,0,.88);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)";
    o.innerHTML='<div style="width:min(340px,90vw);padding:26px;border-radius:20px;background:#0b0f14;border:1px solid rgba(255,255,255,.17);display:flex;flex-direction:column;gap:12px;color:#f4f6ff"><h2 style="margin:0 0 4px;font:700 22px Sora,system-ui,sans-serif">Sign in</h2><input id="lge" type="email" placeholder="Email" autocomplete="username" style="'+f+'"><input id="lgp" type="password" placeholder="Password" autocomplete="current-password" style="'+f+'"><div id="lgm" style="color:#ff9db8;font-size:13px;min-height:16px"></div><button id="lgb" style="padding:13px;border:0;border-radius:12px;background:linear-gradient(110deg,#00d4ff,#8b5cf6);color:#03121b;font:700 16px DM Sans,system-ui,sans-serif;cursor:pointer">Sign in</button></div>';
    document.body.appendChild(o);
    const em=o.querySelector("#lge"),pw=o.querySelector("#lgp"),mg=o.querySelector("#lgm"),bt=o.querySelector("#lgb");
    em.focus();
    const go=async()=>{
      if(!em.value||!pw.value){mg.textContent="Enter email and password.";return}
      bt.disabled=true;mg.textContent="";
      let error;try{({error}=await sb.auth.signInWithPassword({email:em.value.trim(),password:pw.value}))}catch(e){error={message:"Network error"}}
      bt.disabled=false;
      if(error){mg.textContent=error.message;return}
      o.remove();res(true);
    };
    bt.onclick=go;
    pw.onkeydown=e=>{if(e.key==="Enter")go()};
    em.onkeydown=e=>{if(e.key==="Enter")pw.focus()};
  });
  LP.then(()=>{LP=null});
  return LP;
}
if(sb)try{sb.auth.onAuthStateChange(ev=>{if(ev==="SIGNED_OUT")setTimeout(()=>{setStatus("🔒 Sign in needed");if(!LP)login().then(ok=>{if(ok)pull(true)})},0)})}catch(e){}

/* ---------- sync ---------- */
const sg=o=>JSON.stringify(o,(k,v)=>v&&typeof v==="object"&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(x=>[x,v[x]])):v);
const snap=()=>sg({S,R,P,E,W,H,A,K,CL});
/* 3-way merge so an offline device never overwrites newer cloud edits */
const BK=KEY+"_base",blob=()=>({S,R,P,E,W,H,A,K,CL}),eq=(a,b)=>sg(a)===sg(b);
const setBase=d=>{try{localStorage.setItem(BK,JSON.stringify(d))}catch(e){}};
const getBase=()=>{try{return JSON.parse(localStorage.getItem(BK)||"{}")||{}}catch(e){return{}}};
function merge3(b,l,c){
  const o={};
  ["S","R","P","E","W","H"].forEach(m=>{const B=b[m]||{},L=l[m]||{},C=c[m]||{},r={};
    new Set([...Object.keys(B),...Object.keys(L),...Object.keys(C)]).forEach(k=>{const v=eq(L[k],B[k])?C[k]:L[k];if(v!==undefined)r[k]=v});o[m]=r});
  ["A","K","CL"].forEach(m=>{o[m]=eq(l[m],b[m])?c[m]:l[m]});
  return o;
}
async function reconcile(){
  setStatus("🔄 Merging...");
  let data,error;try{({data,error}=await sb.from('revision_tracker').select('*').eq('id',1).maybeSingle())}catch(e){setStatus("🟠 Offline · saved on this device");return}
  if(error){setStatus("🔴 "+error.message);return}
  if(data&&data.data){apply(merge3(getBase(),blob(),data.data));rd()}
  push();
}
const busy=()=>{const a=document.activeElement;return !!a&&/INPUT|SELECT/.test(a.tagName)&&app.contains(a)};
const rd=()=>{if(!busy())render()};
async function pull(quiet){
  if(!sb){loaded=ready=true;setStatus("🟠 Offline · saved on this device");return}
  let ss=null;try{ss=(await sb.auth.getSession()).data.session}catch(e){}
  if(!ss){setStatus("🔒 Sign in needed");if(!LP)login().then(ok=>{if(ok)pull(true)});return}
  if(pending>0)return;
  if(dirty&&ready){await reconcile();return}
  if(!quiet)setStatus("🔄 Syncing...");
  let data,error;try{({data,error}=await sb.from('revision_tracker').select('*').eq('id',1).maybeSingle())}catch(e){setStatus("🟠 Offline · saved on this device");return}
  if(error){setStatus("🔴 "+error.message);return}
  if(pending>0)return;
  if(data&&data.data){const b=snap();apply(data.data);setBase(data.data);loaded=ready=true;setStatus("🟢 Live Synced");if(b!==snap())rd()}
  else if(!loaded){
    let hasAll=false;try{hasAll=!!localStorage.getItem(KEY+"_all")}catch(e){}
    if(!hasAll){
      try{S=JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){}
      try{R=JSON.parse(localStorage.getItem(KEY+"_r")||"{}")}catch(e){}
      try{P=JSON.parse(localStorage.getItem(KEY+"_p")||"{}")}catch(e){}
    }
    loaded=ready=true;render();push();
  }else setStatus("🟢 Live Synced");
}
async function push(){
  if(sb&&!ready){setStatus("⏳ Waiting for first sync");return}
  try{localStorage.setItem(KEY+"_all",JSON.stringify({S,R,P,E,W,H,A,K,CL}))}catch(e){}
  if(!sb){setStatus("🟠 Saved on this device");return}
  const my=++seq;setD(true);pending++;setStatus("⏳ Saving...");
  const pl=JSON.parse(JSON.stringify(blob()));let error;try{({error}=await sb.from('revision_tracker').upsert({id:1,data:pl}))}catch(e){error={message:"offline"}}
  pending--;
  if(!error){setBase(pl);if(my===seq)setD(false)}
  setStatus(error?"🔴 Save failed: "+error.message:"🟢 Live Synced");
}
const save=()=>{try{localStorage.setItem(KEY+"_s",SM)}catch(e){}push()};
if(sb)try{sb.channel('db-changes').on('postgres_changes',{event:'*',schema:'public',table:'revision_tracker'},p=>{
  if(pending>0||dirty||!p.new||!p.new.data)return;
  const b=snap();apply(p.new.data);setBase(p.new.data);setStatus("🟢 Live Synced");if(b!==snap())rd();
}).subscribe()}catch(e){}
document.addEventListener('visibilitychange',()=>{if(!document.hidden){dayCheck();pull(true)}});
setInterval(()=>{if(!document.hidden){dayCheck();pull(true)}},15000);

const pv=id=>(P[id]===undefined?1:P[id]);
const rv=(id,i)=>(R[id]||[])[i]||{};
const eff=(id,i)=>rv(id,i).o||iso(add(S[id],offs(id)[i]));
const setR=(id,i,p)=>{R[id]=R[id]||[{},{},{}];R[id][i]=R[id][i]||{};Object.assign(R[id][i],p)};
const tmr=()=>iso(add(iso(new Date()),1));
const iso=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const add=(s,n)=>{const[y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d+n)};
const fmt=d=>d.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});
/* class portal: tabs Chemistry/Physics/Maths show Class 11 ("XI ...") when CL==="11" */
const setOn=(a,on)=>{a.classList.toggle("on",on);a.setAttribute("aria-selected",on)};
const HID11=["TODAY","CURVE","PLANNER","STATS"];
const cur=()=>{let c=({"#physics":"PHYSICS","#maths":"MATHS","#calendar":"CALENDAR","#today":"TODAY","#curve":"CURVE","#planner":"PLANNER","#stats":"STATS","#timer":"TIMER"})[location.hash]||"CHEMISTRY";if(CL==="11"&&HID11.includes(c))c="CHEMISTRY";return CL==="11"&&["CHEMISTRY","PHYSICS","MATHS"].includes(c)?"XI "+c:c};
let SEL=iso(new Date()),CM=SEL.slice(0,7);
const SJ12=["CHEMISTRY","PHYSICS","MATHS"];
const SJ=[...SJ12,"XI CHEMISTRY","XI PHYSICS","XI MATHS"];
const SC={CHEMISTRY:"#fbbf24",PHYSICS:"#60a5fa",MATHS:"#a3e635","XI CHEMISTRY":"#fbbf24","XI PHYSICS":"#60a5fa","XI MATHS":"#a3e635"};
const stamp=(id,i)=>rv(id,i).od||(eff(id,i)<iso(new Date())?eff(id,i):undefined);
const moveMissed=t=>{const n=iso(new Date());Object.keys(S).forEach(id=>OFF.forEach((o,i)=>{if(!rv(id,i).d&&eff(id,i)<n)setR(id,i,{o:t,d:false,od:rv(id,i).od||eff(id,i)})}))};
const move=(id,ty,dt)=>{if(!S[id]||!dt)return;if(ty<0){S[id]=dt;(R[id]||[]).forEach(r=>{delete r.o;delete r.od})}else setR(id,ty,{o:dt,d:false,od:stamp(id,ty)})};
function calHTML(today){
  const by={};
  Object.entries(D).forEach(([sj,bl])=>bl.forEach((b,bi)=>b[1].forEach(t=>{const id=sj+"|"+bi+"|"+t;if(!S[id])return;
    (by[S[id]]=by[S[id]]||[]).push({ty:-1,sj,t,id,k:S[id]});
    OFF.forEach((o,i)=>{const k=eff(id,i);(by[k]=by[k]||[]).push({ty:i,sj,t,id,k,dn:!!rv(id,i).d})})})));
  const[y,m]=CM.split("-").map(Number),lead=(new Date(y,m-1,1).getDay()+6)%7,dim=new Date(y,m,0).getDate();
  let cells=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(w=>`<div class="wk">${w}</div>`).join("")+'<i></i>'.repeat(lead);
  for(let d=1;d<=dim;d++){
    const k=y+"-"+String(m).padStart(2,"0")+"-"+String(d).padStart(2,"0"),L=by[k]||[],st=L.filter(x=>x.ty<0).length,rl=L.filter(x=>x.ty>=0),pend=rl.filter(x=>!x.dn).length;
    let tag="";
    if(st)tag+=`<em class="g1">${st}<span class="w"> study</span></em>`;
    if(rl.length)tag+=`<em class="${!pend?"g3":k<today?"g4":k===today?"g5":"g2"}">${rl.length}<span class="w"> rev</span></em>`;
    cells+=`<button class="cd${k===today?" td":""}${k===SEL?" sl":""}" data-d="${k}"><b>${d}</b>${tag}</button>`;
  }
  const L=(by[SEL]||[]).slice().sort((a,z)=>(a.ty<0?-1:0)-(z.ty<0?-1:0)||pv(z.id)-pv(a.id));
  const rows=L.map(x=>{
    const key=x.id+"|"+x.ty;let st,btn="";
    if(x.ty<0)st='<span class="r s">To study</span>';
    else{const c=x.dn?"k":x.k===today?"d":x.k<today?"o":"f";
      st=`<span class="r ${c}">${x.dn?"&check; ":""}Rev ${x.ty+1}</span>`;
      btn=x.dn?`<button class="b" data-u="${key}" title="Undo">&#8630;</button>`:`<button class="b" data-m="${key}" title="Mark revised">&check;</button>`+(x.k<=today?`<button class="b m" data-r="${key}" title="Not revised: move to tomorrow">&#8635;</button>`:"");}
    return `<div class="dr" draggable="true" data-k="${key}" style="--c:${SC[x.sj]}"><span class="gp" title="Drag onto a day to reschedule">&#8942;&#8942;</span><span class="tg">${x.sj}</span><span class="dn">${x.t}</span><button class="pr ${["lo","md","h"][pv(x.id)]}" data-p="${x.id}" title="Click to change priority" aria-label="Priority: ${["Low","Medium","High"][pv(x.id)]}. Tap to change">${["Low","Medium","High"][pv(x.id)]}</button>${st}<span class="rc">${btn}<span class="dw"><button class="b" type="button" tabindex="-1" title="Move to another date">&#128197;</button><input type="date" data-mv="${key}"></span></span></div>`}).join("");
  const ns=L.filter(x=>x.ty<0).length,nr=L.length-ns;
  const mt=new Date(y,m-1,1).toLocaleDateString("en-GB",{month:"long",year:"numeric"}).toUpperCase();
  const dt=add(SEL,0).toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
  return `<div class="cal"><section class="sec"><div class="sh"><h2>${mt}</h2><div class="bs"><button class="nv" data-nav="-1">&lsaquo;</button><button class="nv" data-nav="0">Today</button><button class="nv" data-nav="1">&rsaquo;</button></div></div><div class="cg">${cells}</div><div class="lgd"><span>Drag a task onto any day to reschedule it</span></div></section><section class="sec"><div class="sh"><h2>${dt}</h2></div>${L.length?`<div class="sm">${ns} to study &middot; ${nr} revision${nr===1?"":"s"}</div><div class="dt">${rows}</div>`:'<div class="em0">Nothing due on this day.</div>'}</section></div>`;
}
function row(id,n,t){
  const v=S[id]||"",today=iso(new Date());
  let h=`<tr class="lr p${pv(id)}${v?" on":""}"><td class="n"><span class="nb">${n}</span></td><td class="l">${t}</td><td data-l="Priority"><button class="pr ${["lo","md","h"][pv(id)]}" data-p="${id}" title="Click to change priority" aria-label="Priority: ${["Low","Medium","High"][pv(id)]}. Tap to change">${["Low","Medium","High"][pv(id)]}</button></td><td data-l="Date to study"><span class="dw"><span class="r ${v?"s":"ph"}">${v?fmt(add(v,0)):"Pick date"}</span><input type="date" data-id="${id}" value="${v}">${v?`<button class="x" data-c="${id}" title="Clear date">&times;</button>`:""}</span></td>`;
  OFF.forEach((o,i)=>{
    if(!v){h+=`<td data-l="Rev ${i+1}"><span class="r e">&mdash;</span></td>`;return}
    const k=eff(id,i),dn=rv(id,i).d,c=dn?"k":k===today?"d":k<today?"o":"f",key=id+"|"+i;
    h+=`<td data-l="Rev ${i+1}"><span class="rc"><span class="r ${c}">${dn?"&check; ":""}${fmt(add(k,0))}</span>`+(dn?`<button class="b" data-u="${key}" title="Undo">&#8630;</button>`:`<button class="b" data-m="${key}" title="Mark revised">&check;</button>`+(k<=today?`<button class="b m" data-r="${key}" title="Not revised: move to tomorrow">&#8635;</button>`:""))+`</span></td>`;
  });
  return h+"</tr>";
}
function renderNow(){
  const today=iso(new Date());let n1=0,n2=0,n3=0,n4=0,n5=0;
  Object.entries(D).forEach(([s,bl])=>bl.forEach((b,bi)=>b[1].forEach(t=>{const id=s+"|"+bi+"|"+t;if(S[id]){n1++;OFF.forEach((o,i)=>{const k=eff(id,i);if(rv(id,i).d)n5++;else if(k===today)n2++;else if(k>today)n3++;else n4++})}})));
  const c=cur();
  const fin=()=>{document.body.classList.toggle("cl11",CL==="11");document.querySelectorAll(".tabs a,#side a").forEach(a=>setOn(a,a.dataset.t===c.replace("XI ","")));so.style.display=sd.style.display=SJ.includes(c)?"":"none";so.textContent="Sort by priority: "+(SM==="pri"?"On":"Off");so.classList.toggle("on",SM==="pri");sd.textContent="Sort by date: "+(SM==="date"?"On":"Off");sd.classList.toggle("on",SM==="date");if(clsB){clsB.textContent=CL==="11"?"Class 11 portal \u2713":"Open Class 11 portal";clsB.classList.toggle("on",CL==="11")}cnt(s1,n1);cnt(s2,n2);cnt(s3,n3);cnt(s4,n4);cnt(s5,n5)};
  document.body.classList.toggle("tm-on",c==="TIMER");
  if(c==="TIMER"){tmOpen();fin();return}
  if(c==="CALENDAR"){app.innerHTML=calHTML(today);fin();return}
  if(EXTRA.includes(c)){app.innerHTML=extraHTML(c,today);fin();return}
  const bl=D[c];let idx=0,tot=0,done=0,body="";
  const items=[];
  bl.forEach((b,bi)=>{
    b[1].forEach((t,j)=>items.push({t,n:++idx,bi,id:c+"|"+bi+"|"+t,lab:j?"":b[0]}));
  });
  if(SM==="pri")items.sort((a,z)=>pv(z.id)-pv(a.id)||a.n-z.n);
  if(SM==="date")items.sort((a,z)=>(S[a.id]||"9999").localeCompare(S[z.id]||"9999")||pv(z.id)-pv(a.id)||a.n-z.n);
  let sn=0;
  let lp=-1;items.forEach(x=>{tot++;if(S[x.id])done++;
    if(SM==="pri"&&pv(x.id)!==lp){lp=pv(x.id);body+=`<tr class="sb"><td colspan="7" style="color:${["#00d4ff","#a78bfa","#ff8fb1"][lp]}">${["LOW","MEDIUM","HIGH"][lp]} PRIORITY</td></tr>`}
    if(!SM&&x.lab)body+=`<tr class="sb"><td colspan="7">${x.lab}</td></tr>`;
    body+=row(x.id,SM?++sn:x.n,x.t)});
  app.innerHTML=`<section class="sec"><div class="sh"><h2>${c}</h2><div class="pg">${done}/${tot} started<i><u style="width:${done/tot*100}%"></u></i></div></div><div class="wrap"><table><thead><tr><th>#</th><th>Lesson</th><th>Priority</th><th>Date to study</th><th>Rev 1</th><th>Rev 2</th><th>Rev 3</th></tr></thead><tbody>${body}</tbody></table></div></section>`;
  fin();
}

/* ---------- page transition: current page floats out, new page floats in ---------- */
var LASTP=null,TRN=false;
const RMQ=matchMedia("(prefers-reduced-motion:reduce)");
function render(){
  if(TRN)return;
  const k=cur();
  if(LASTP===null){LASTP=k;renderNow();return}
  if(k===LASTP){renderNow();return}
  const was=LASTP;
  document.querySelectorAll(".tabs a,#side a").forEach(a=>setOn(a,a.dataset.t===k.replace("XI ","")));
  if(RMQ.matches||was==="TIMER"){LASTP=k;renderNow();enter();return}
  TRN=true;app.classList.remove("enter");app.classList.add("leaving");
  setTimeout(()=>{app.classList.remove("leaving");LASTP=cur();TRN=false;renderNow();enter()},160);
}
document.addEventListener("change",e=>{
  const t=e.target,v=t.value;
  if(t.id==="mmd"){if(v){moveMissed(v);t.value="";save();render()}return}
  if(t.dataset&&t.dataset.mv){if(v){const k=t.dataset.mv,p=k.lastIndexOf("|");move(k.slice(0,p),+k.slice(p+1),v);SEL=v;CM=v.slice(0,7);save();render()}return}
  const i=e.target.dataset&&e.target.dataset.id;if(!i)return;e.target.value?S[i]=e.target.value:delete S[i];delete R[i];save();render()});
document.addEventListener("click",e=>{
  const el=e.target.closest&&e.target.closest("[data-c],[data-m],[data-u],[data-r],[data-p],[data-d],[data-nav],[data-mm]"),d=el?el.dataset:{};
  if(e.target.type==="date"&&e.target.showPicker){try{e.target.showPicker()}catch(_){}}
  if(d.c){delete S[d.c];delete R[d.c]}
  else if(d.p){P[d.p]=(pv(d.p)+1)%3}
  else if(d.d){SEL=d.d;render();return}
  else if(d.mm!==undefined){moveMissed(iso(add(iso(new Date()),+d.mm)))}
  else if(d.nav!==undefined){if(d.nav==="0"){SEL=iso(new Date());CM=SEL.slice(0,7)}else{const[y,m]=CM.split("-").map(Number),n=new Date(y,m-1+(+d.nav),1);CM=n.getFullYear()+"-"+String(n.getMonth()+1).padStart(2,"0")}render();return}
  else{const x=d.m||d.u||d.r;if(!x)return;const p=x.lastIndexOf("|"),id=x.slice(0,p),i=+x.slice(p+1);
    if(d.m)setR(id,i,{d:true,c:iso(new Date()),od:rv(id,i).od||eff(id,i)});else if(d.u)setR(id,i,{d:false});else setR(id,i,{o:tmr(),d:false,od:stamp(id,i)})}
  save();render()});
so.onclick=()=>{SM=SM==="pri"?"":"pri";try{localStorage.setItem(KEY+"_s",SM)}catch(e){}render()};
sd.onclick=()=>{SM=SM==="date"?"":"date";try{localStorage.setItem(KEY+"_s",SM)}catch(e){}render()};
/* ---------- Class 11 portal button (synced via CL) ---------- */
var clsB=document.getElementById("cls");
if(!clsB){clsB=document.createElement("button");clsB.id="cls";clsB.className="nv";const h=document.querySelector(".hr");if(h)h.insertBefore(clsB,h.firstChild)}
clsB.onclick=()=>{CL=CL==="11"?"12":"11";if(CL==="11"&&["#today","#curve","#planner","#stats"].includes(location.hash))location.hash="#chemistry";save();render()};

/* ---------- sidebar: Curve / Planner / Stats (Class 12 portal only) ---------- */
(()=>{
  document.querySelectorAll('.tabs a[data-t="CURVE"],.tabs a[data-t="PLANNER"],.tabs a[data-t="STATS"]').forEach(a=>a.remove());
  const ic={CURVE:'<path d="M3 17c4 0 4-10 9-10s5 10 9 10"/>',PLANNER:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 11h18"/>',STATS:'<path d="M5 21V10M12 21V4M19 21v-8"/>'};
  const el=document.createElement("aside");el.id="side";el.setAttribute("role","tablist");
  el.innerHTML=[["CURVE","Curve"],["PLANNER","Planner"],["STATS","Stats"]].map(([t,l])=>`<a role="tab" href="#${t.toLowerCase()}" data-t="${t}" title="${l}"><svg viewBox="0 0 24 24">${ic[t]}</svg><span>${l}</span></a>`).join("");
  document.body.appendChild(el);
  const st=document.createElement("style");
  st.textContent=`#side{position:fixed;left:14px;top:50%;transform:translateY(-50%);z-index:40;display:flex;flex-direction:column;gap:4px;padding:6px;width:56px;overflow:hidden;border-radius:22px;background:rgba(6,8,10,.7);backdrop-filter:blur(22px) saturate(1.5);-webkit-backdrop-filter:blur(22px) saturate(1.5);border:1px solid var(--line2);box-shadow:0 14px 44px rgba(0,0,0,.7),inset 0 1px 0 rgba(255,255,255,.08);transition:width .3s cubic-bezier(.2,.8,.2,1)}
#side:hover,#side:focus-within{width:150px}
#side a{display:flex;align-items:center;gap:14px;height:44px;padding:0 12px;border-radius:16px;color:var(--mut);text-decoration:none;font:600 13.5px DM Sans,system-ui,sans-serif;white-space:nowrap;transition:color .25s,background .25s}
#side a:hover{color:var(--tx);background:rgba(255,255,255,.07)}
#side a.on{color:#03121b;background:linear-gradient(110deg,var(--blue),var(--vio),var(--mag));box-shadow:0 0 24px rgba(0,212,255,.45)}
#side span{opacity:0;transition:opacity .15s}
#side:hover span,#side:focus-within span{opacity:1;transition:opacity .25s .1s}
#side svg{flex:0 0 auto;width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
body.cl11 #side,body.cl11 .tabs a[data-t="TODAY"],body.tm-on #side{display:none}
@media(min-width:1101px) and (hover:hover){body:not(.cl11) main{padding-left:calc(clamp(12px,2.5vw,40px) + 70px)}}
/* tablets + touch: floating bottom dock with labels */
@media(max-width:1100px),(hover:none){
#side{top:auto;bottom:calc(env(safe-area-inset-bottom,0px) + 14px);left:50%;transform:translateX(-50%);flex-direction:row;width:auto!important;border-radius:999px}
#side a{height:46px;padding:0 18px;border-radius:999px}
#side span{opacity:1}
body:not(.cl11) main{padding-bottom:120px}
}
@media(max-width:760px){#side span{display:none}#side a{padding:0 16px}}
/* tablet polish */
@media(min-width:761px) and (max-width:1100px){
main{padding-top:26px}
.stats{grid-template-columns:repeat(5,1fr);gap:12px}
.chip{padding:16px 14px 14px;border-radius:18px}
.chip span{font-size:10.5px;letter-spacing:.1em}
.tabs a{padding:12px 20px}
.bs button,.nv,.pkb{min-height:44px}
tbody{grid-template-columns:1fr}
tbody tr.lr{grid-template-columns:repeat(12,minmax(0,1fr));gap:18px 14px;align-items:center;padding:18px 22px;border-radius:22px;background:linear-gradient(180deg,rgba(255,255,255,.055),rgba(255,255,255,.025))}
td.n{grid-column:span 1}
td.l{grid-column:span 5;font-size:17px;font-weight:700;line-height:1.3}
td[data-l="Priority"]{grid-column:span 2}
td[data-l="Date to study"]{grid-column:span 4}
td[data-l^="Rev"]{grid-column:span 4}
td .pr{width:100%;min-width:0;padding:10px 4px;font-size:11.5px}
td .dw .r{padding:10px 12px;font-size:14px}
td .rc{display:flex;gap:8px;width:100%}
td .rc .r{flex:1;min-width:0;grid-column:auto;font-size:13.5px;letter-spacing:0;padding:9px 6px}
td .rc .b{flex:0 0 42px;width:42px;height:42px;border-radius:13px}
td .r.e{padding:9px 6px}
}
@media(hover:none){.chip:hover,.cd:hover,.rb:hover,.dr:hover{transform:none}}`;
  document.head.appendChild(st);
})();

/* ---------- app mode: PWA, install button, touch performance ---------- */
(()=>{
  if("serviceWorker" in navigator&&/^https?:/.test(location.protocol))addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
  let dip=null;
  addEventListener("beforeinstallprompt",e=>{
    e.preventDefault();dip=e;
    const b=document.createElement("button");b.className="nv";b.textContent="Install app";
    b.onclick=async()=>{dip.prompt();try{await dip.userChoice}catch(_){}dip=null;b.remove()};
    const h=document.querySelector(".hr");if(h)h.insertBefore(b,h.firstChild);
  });
  const st=document.createElement("style");
  st.textContent=`@keyframes aurT{0%{transform:rotate(0) scale(1)}100%{transform:rotate(6deg) scale(1.12)}}
@keyframes gridT{to{transform:translate(56px,56px)}}
@keyframes glowO{0%,100%{opacity:.3}50%{opacity:1}}
@keyframes sheenA{0%,55%{transform:translateX(0)}100%{transform:translateX(320%)}}
@keyframes sheenB{from{transform:translateX(-100%)}to{transform:translateX(280%)}}
@keyframes rot{to{transform:rotate(360deg)}}
@media (display-mode:standalone){html,body{overscroll-behavior-y:none}}
@media (hover:none),(pointer:coarse){
html{scroll-behavior:auto}
*{-webkit-tap-highlight-color:transparent}
button,a,select,input,.cd,.dr,.rb{touch-action:manipulation}
button,.tabs a,#side a{-webkit-user-select:none;user-select:none}
/* same animations, GPU-only (transform/opacity) so they stay smooth */
.bg::after{background-size:100% 100%;animation:aurT 22s ease-in-out infinite alternate;will-change:transform}
.gridfx{overflow:hidden;-webkit-mask-image:radial-gradient(ellipse 90% 75% at 50% 25%,#000 10%,transparent 92%);mask-image:radial-gradient(ellipse 90% 75% at 50% 25%,#000 10%,transparent 92%)}
.gridfx::before{-webkit-mask-image:none;mask-image:none;top:-56px;left:-56px;animation:gridT 26s linear infinite;will-change:transform}
.gridfx::after,.cur,.sec::before,.chip::before,.cd::before{display:none}
.r.d{animation:none;position:relative;box-shadow:0 0 12px rgba(0,212,255,.45)}
.r.d::after{content:"";position:absolute;top:0;right:0;bottom:0;left:0;border-radius:inherit;box-shadow:0 0 24px 2px rgba(0,212,255,.8);opacity:.3;animation:glowO 2.2s ease-in-out infinite;pointer-events:none}

.tabs a.on::after{content:"";position:absolute;top:0;bottom:0;left:-60%;width:60%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.22),transparent);animation:sheenA 4.5s ease-in-out infinite;pointer-events:none}
.pg i u{animation:none;position:relative;overflow:hidden}
.pg i u::after{content:"";position:absolute;top:0;bottom:0;left:0;width:40%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.28),transparent);animation:sheenB 2.6s ease-in-out infinite}
.cd.sl::before{display:block;top:50%;left:50%;right:auto;bottom:auto;width:220%;height:auto;aspect-ratio:1;margin:-110% 0 0 -110%;background:conic-gradient(#00d4ff,#8b5cf6,#e879f9,#00d4ff);opacity:1;animation:rot 3.5s linear infinite;z-index:0}
.cd.sl::after{top:2px;right:2px;bottom:2px;left:2px;border-radius:14px;padding:0;background:#120f26;-webkit-mask:none;mask:none;-webkit-mask-composite:source-over;mask-composite:add;animation:none;z-index:0}
.cd b,.cd em{z-index:1}
/* blur is the costliest effect on tablets: solid glass instead */
.chip,.dpill,.sync-indicator,.tabs,.bs button,.nv,.pkb,#side{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
.tabs,#side{background:rgba(8,11,14,.94)}
.chip,.dpill,.sync-indicator{background:rgba(22,28,34,.85)}
.bs button,.nv,.pkb{background:rgba(34,40,48,.9)}
/* no sticky hover on touch */
.chip:hover,.cd:hover,.rb:hover,.dr:hover,.b:hover,.pr:hover,.bs button:hover,.nv:hover,.tabs a:hover,.dw:hover .pkb{transform:none;filter:none}
.chip:hover{border-color:var(--line);box-shadow:none}
.cd:not(.td):not(.sl):hover{border-color:rgba(255,255,255,.07)}
.dr:hover{background:rgba(255,255,255,.035)}
.rb:hover{border-color:rgba(255,255,255,.07);background:rgba(255,255,255,.035)}
tr.lr:hover td{background:rgba(255,255,255,.035);border-color:rgba(255,255,255,.06)}
.b:hover,.b.m:hover{border-color:var(--line2);color:var(--tx);box-shadow:none}
.bs button:not(.on):hover,.nv:not(.on):hover,.dw:hover .pkb,.dw:hover .r{box-shadow:none}
.tabs a:not(.on):hover,#side a:not(.on):hover{color:var(--mut);background:none}
.dw .x{opacity:.8}
/* press feedback */
.b,.pr,.nv,.bs button,.tabs a,#side a,.cd,.dr,.rb{transition:transform .18s cubic-bezier(.2,.8,.2,1),background-color .15s,color .15s,border-color .15s,opacity .15s}
.b:active,.pr:active,.nv:active,.bs button:active{transform:scale(.92);transition-duration:.08s}
.tabs a:active,#side a:active{transform:scale(.95);transition-duration:.08s}
.cd:active,.dr:active,.rb:active{transform:scale(.97);transition-duration:.08s}
}
@keyframes fOut{to{opacity:0;transform:translateY(-12px) scale(.985)}}
#app.leaving{animation:fOut .16s cubic-bezier(.4,0,1,1) forwards;pointer-events:none;will-change:transform,opacity}
@media (hover:none) and (max-width:1100px),(pointer:coarse) and (max-width:1100px){tbody tr.lr:hover{background:linear-gradient(180deg,rgba(255,255,255,.055),rgba(255,255,255,.025));border-color:var(--line)}}`;
  document.head.appendChild(st);
})();
/* ---------- iOS glossy theme + glossy grid (delete this block to revert) ---------- */
(()=>{
  const st=document.createElement("style");
  st.textContent=`@keyframes glowO{0%,100%{opacity:.3}50%{opacity:1}}
*{font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text","Segoe UI",Roboto,Helvetica,Arial,sans-serif!important}
h1{font-weight:700;letter-spacing:-.03em}
/* glass shapes, original colours */
.chip{border-radius:26px}
.sec{border-radius:28px}
.bs button,.nv,.pkb{background:rgba(120,120,128,.26);border:0;border-radius:14px;color:#fff;font-weight:600}
.b{border-radius:50%!important;border:0;background:rgba(120,120,128,.28)}
.pc input,.pc select,.sh select,.hl input{border-radius:12px}
.dr{border-radius:20px}
.cd{border-radius:18px}
.lr.on .nb{box-shadow:inset 0 1px 0 rgba(255,255,255,.55),0 0 18px rgba(0,212,255,.5)}
/* darker background, touch spotlight, timer float-in */
.tglow{position:fixed;left:0;top:0;width:340px;height:340px;margin:-170px 0 0 -170px;border-radius:50%;pointer-events:none;z-index:-1;opacity:0;transition:opacity .6s ease;background:radial-gradient(circle,rgba(0,212,255,.34),rgba(0,212,255,.14) 42%,transparent 70%);will-change:transform,opacity}
.tglow.on{opacity:1;transition:opacity .12s}
body.tm-on .tglow{display:none}
@keyframes tmIn{from{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}
body.tm-on #tmv{animation:tmIn .5s cubic-bezier(.32,.72,0,1)}
/* liquid-glass sliding tab thumb */
.tabs{position:relative}
.gt a{position:relative;z-index:1;transition:color .35s,transform .2s}
.gthumb{position:absolute;left:0;top:0;z-index:0;pointer-events:none;transition:transform .55s cubic-bezier(.34,1.3,.64,1),width .55s cubic-bezier(.34,1.3,.64,1),height .3s,opacity .25s;will-change:transform,width}
.gthumb i{display:block;width:100%;height:100%;border-radius:999px;background:rgba(255,255,255,.14);box-shadow:none}
.tabs a.on,#side a.on{color:#fff;background:none;box-shadow:none}
.gthumb i.jel{animation:jel .55s cubic-bezier(.34,1.3,.64,1)}
@keyframes jel{0%{transform:scale(1)}30%{transform:scale(1.14,.86)}65%{transform:scale(.97,1.05)}100%{transform:scale(1)}}
#app.enter>*,#app.enter .cal>*,#app.enter .pl>*,#app.enter .dr,#app.enter .rb,#app.enter tr.lr{animation-timing-function:cubic-bezier(.32,.72,0,1)}`;
  document.head.appendChild(st);
})();
/* ---------- liquid-glass sliding thumb for tab bars ---------- */
(()=>{
  const mk=bar=>{
    if(!bar)return;
    const th=document.createElement("span");th.className="gthumb";th.innerHTML="<i></i>";
    bar.insertBefore(th,bar.firstChild);bar.classList.add("gt");
    let placed=false,k="";
    const place=anim=>{
      const a=bar.querySelector("a.on");
      if(!a||a.offsetParent===null){th.style.opacity=0;return}
      th.style.opacity=1;
      const x=a.offsetLeft,y=a.offsetTop,w=a.offsetWidth,h=a.offsetHeight,key=[x,y,w,h].join();
      if(key===k)return;k=key;
      const fast=!placed||!anim;
      if(fast)th.style.transition="none";
      th.style.width=w+"px";th.style.height=h+"px";th.style.transform="translate("+x+"px,"+y+"px)";
      if(fast){void th.offsetWidth;th.style.transition=""}
      else{const i=th.firstChild;i.classList.remove("jel");void i.offsetWidth;i.classList.add("jel");if(bar.scrollWidth>bar.clientWidth)bar.scrollTo({left:x-(bar.clientWidth-w)/2,behavior:"smooth"})}
      placed=true;
    };
    new MutationObserver(r=>{if(r.some(m=>!th.contains(m.target)))place(true)}).observe(bar,{attributes:true,subtree:true,attributeFilter:["class"]});
    new MutationObserver(()=>place(true)).observe(document.body,{attributes:true,attributeFilter:["class"]});
    if(window.ResizeObserver)new ResizeObserver(()=>place(false)).observe(bar);
    addEventListener("resize",()=>place(false));
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>place(false));
    place(false);
  };
  mk(document.querySelector(".tabs"));mk(document.getElementById("side"));
})();
/* ---------- touch spotlight: lights up only the touched part of the background ---------- */
(()=>{
  const g=document.createElement("div");g.className="tglow";document.body.appendChild(g);
  let off=0,x=0,y=0,f=0;
  const paint=()=>{f=0;g.style.transform="translate("+x+"px,"+y+"px)"};
  const mv=e=>{if(e.pointerType==="mouse")return;x=e.clientX;y=e.clientY;clearTimeout(off);g.classList.add("on");if(!f)f=requestAnimationFrame(paint)};
  addEventListener("pointerdown",mv,{passive:true});
  addEventListener("pointermove",e=>{if(g.classList.contains("on"))mv(e)},{passive:true});
  const up=()=>{off=setTimeout(()=>g.classList.remove("on"),90)};
  addEventListener("pointerup",up,{passive:true});addEventListener("pointercancel",up,{passive:true});
})();
const cl=(e,q)=>e.target.closest&&e.target.closest(q);
document.addEventListener("dragstart",e=>{const r=cl(e,"[data-k]");if(!r)return;e.dataTransfer.setData("text/plain",r.dataset.k);e.dataTransfer.effectAllowed="move";r.classList.add("dg")});
document.addEventListener("dragend",e=>{document.querySelectorAll(".dg,.ov").forEach(x=>x.classList.remove("dg","ov"))});
document.addEventListener("dragover",e=>{const c=cl(e,".cd");if(!c)return;e.preventDefault();document.querySelectorAll(".cd.ov").forEach(x=>x!==c&&x.classList.remove("ov"));c.classList.add("ov")});
document.addEventListener("drop",e=>{const c=cl(e,".cd");if(!c)return;e.preventDefault();const k=e.dataTransfer.getData("text/plain");if(!k)return;const p=k.lastIndexOf("|");move(k.slice(0,p),+k.slice(p+1),c.dataset.d);SEL=c.dataset.d;save();render()});
// ===== v7 extras =====
const EXTRA=["TODAY","CURVE","PLANNER","STATS","TIMER"];
let CT="";
const subOf=id=>id.split("|")[0],nameOf=id=>id.split("|")[2];
const is11=id=>subOf(id).startsWith("XI ");
const wt=id=>(W[id]===undefined?4:W[id]);
const dayN=(a,b)=>Math.round((add(b,0)-add(a,0))/864e5);
const fmtS=d=>add(d,0).toLocaleDateString("en-GB",{day:"2-digit",month:"short"});
const wkStart=d=>iso(add(d,-((add(d,0).getDay()+6)%7)));
const pct=v=>Math.round(v*100)+"%";
const col=v=>v>=.7?"#34d399":v>=.4?"#fbbf24":"#ff5c8a";
const allIds=()=>{const a=[];Object.entries(D).forEach(([s,bl])=>bl.forEach((b,bi)=>b[1].forEach(t=>a.push(s+"|"+bi+"|"+t))));return a};
const started=()=>allIds().filter(id=>S[id]);
const live=t=>started().filter(id=>S[id]<=t);
function offFor(sd,ex){
  const base=[1,7,21];if(!A||!ex||!sd)return base;
  const av=dayN(sd,ex)-1;if(av>=21||av<1)return base;
  const f=av/21,o1=Math.max(1,Math.round(f)),o2=Math.max(o1+1,Math.round(7*f)),o3=Math.max(o2+1,av);
  return[o1,o2,o3];
}
const offs=id=>offFor(S[id],E[subOf(id)]);
const stab=n=>1.5*Math.pow(2.6,n);
function events(id){
  const ev=[{d:S[id]}];
  OFF.forEach((o,i)=>{const r=rv(id,i);if(r.d)ev.push({d:r.c||eff(id,i),i})});
  ev.sort((a,b)=>a.d<b.d?-1:a.d>b.d?1:0);ev.forEach((e,j)=>e.n=j);return ev;
}
function ret(id,day,ev){
  ev=ev||events(id);let last=null;for(const e of ev)if(e.d<=day)last=e;
  return last?Math.exp(-dayN(last.d,day)/stab(last.n)):null;
}
function queue(today){
  const q=[];
  started().forEach(id=>OFF.forEach((o,i)=>{if(rv(id,i).d)return;const k=eff(id,i);if(k>today)return;const od=dayN(k,today);q.push({id,i,k,od,sc:(od+1)*wt(id)*(1+pv(id)*.25)})}));
  return q.sort((a,b)=>b.sc-a.sc);
}
function grid(w,h,L,T,B,fmt,steps){
  let s="";steps.forEach(f=>{const y=T+(1-f)*(h-T-B);s+=`<line x1="${L}" x2="${w}" y1="${y}" y2="${y}" stroke="#ffffff18"/><text x="${L-6}" y="${y+4}" text-anchor="end" fill="#9aa3c7" font-size="11">${fmt(f)}</text>`});return s;
}
function barsSVG(d,c,fmt){
  const w=640,h=220,L=36,B=28,T=18,mx=Math.max(1,...d.map(x=>x.v)),bw=(w-L)/d.length;
  let s=`<svg viewBox="0 0 ${w} ${h}">`+grid(w,h,L,T,B,f=>fmt(mx*f),[0,.5,1]);
  d.forEach((x,i)=>{const bh=x.v/mx*(h-T-B),bx=L+i*bw+bw*.18;
    s+=`<rect x="${bx}" y="${h-B-bh}" width="${bw*.64}" height="${bh}" rx="6" fill="${c}" opacity=".85"/><text x="${bx+bw*.32}" y="${h-10}" text-anchor="middle" fill="#9aa3c7" font-size="10.5">${x.l}</text>`+(x.v?`<text x="${bx+bw*.32}" y="${h-B-bh-5}" text-anchor="middle" fill="#e6e9f5" font-size="11">${fmt(x.v)}</text>`:"")});
  return s+"</svg>";
}
function lineSVG(d,c){
  const w=640,h=220,L=36,B=28,T=14,n=d.length,X=i=>L+i/(n-1)*(w-L-8),Y=v=>T+(1-v)*(h-T-B);
  let s=`<svg viewBox="0 0 ${w} ${h}">`+grid(w,h,L,T,B,pct,[0,.25,.5,.75,1]);
  const pts=d.map((x,i)=>x.v===null?null:[X(i),Y(x.v)]).filter(Boolean);
  if(pts.length)s+=`<path d="M${pts.map(p=>p.join(",")).join("L")}" fill="none" stroke="${c}" stroke-width="3" stroke-linejoin="round"/>`+pts.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="${c}"/>`).join("");
  d.forEach((x,i)=>{if(i%5===0||i===n-1)s+=`<text x="${X(i)}" y="${h-10}" text-anchor="middle" fill="#9aa3c7" font-size="10.5">${x.l}</text>`});
  return s+"</svg>";
}
function curveSVG(id,today){
  const ev=events(id),s0=S[id],ex=E[subOf(id)],w=900,h=340,L=46,B=34,T=14,Rr=14;
  const span=Math.max(40,dayN(s0,iso(add(today,35))));
  const X=d=>L+dayN(s0,d)/span*(w-L-Rr),Y=v=>T+(1-v)*(h-T-B);
  const past=[],fut=[];
  for(let n=0;n<=span;n++){const day=iso(add(s0,n)),p=X(day)+","+Y(ret(id,day,ev));if(day<=today)past.push(p);if(day>=today)fut.push(p)}
  let s=`<svg viewBox="0 0 ${w} ${h}">`+grid(w,h,L,T,B,pct,[0,.25,.5,.75,1]);
  for(let n=0;n<=span;n+=Math.ceil(span/7))s+=`<text x="${X(iso(add(s0,n)))}" y="${h-10}" text-anchor="middle" fill="#9aa3c7" font-size="11">${fmtS(iso(add(s0,n)))}</text>`;
  s+=`<line x1="${L}" x2="${w}" y1="${Y(.6)}" y2="${Y(.6)}" stroke="#fbbf24" stroke-dasharray="5 5" opacity=".6"/><text x="${w-Rr}" y="${Y(.6)-5}" text-anchor="end" fill="#fbbf24" font-size="11">revise zone</text>`;
  if(dayN(s0,today)>=0&&dayN(s0,today)<=span)s+=`<line x1="${X(today)}" x2="${X(today)}" y1="${T}" y2="${h-B}" stroke="#00d4ff" stroke-dasharray="4 4"/><text x="${X(today)+4}" y="${T+10}" fill="#00d4ff" font-size="11">today</text>`;
  if(ex&&dayN(s0,ex)>=0&&dayN(s0,ex)<=span)s+=`<line x1="${X(ex)}" x2="${X(ex)}" y1="${T}" y2="${h-B}" stroke="#ff5c8a" stroke-width="2"/><text x="${X(ex)-4}" y="${T+10}" text-anchor="end" fill="#ff5c8a" font-size="11">EXAM</text>`;
  if(past.length>1)s+=`<path d="M${past.join("L")}" fill="none" stroke="#00d4ff" stroke-width="3" stroke-linejoin="round"/>`;
  if(fut.length>1)s+=`<path d="M${fut.join("L")}" fill="none" stroke="#7ee8ff" stroke-width="3" stroke-dasharray="7 6" stroke-linejoin="round"/>`;
  ev.forEach(e=>{if(dayN(s0,e.d)<=span)s+=`<circle cx="${X(e.d)}" cy="${Y(1)}" r="6" fill="#00d4ff"/>`});
  OFF.forEach((o,i)=>{if(rv(id,i).d)return;const k=eff(id,i);if(dayN(s0,k)<=span)s+=`<circle cx="${X(k)}" cy="${Y(ret(id,k,ev))}" r="6" fill="#07080f" stroke="#7ee8ff" stroke-width="2.5"/>`});
  const r=ret(id,today);
  if(r!==null&&dayN(s0,today)<=span)s+=`<circle cx="${X(today)}" cy="${Y(r)}" r="5" fill="${col(r)}"/><text x="${X(today)+8}" y="${Y(r)-8}" fill="${col(r)}" font-size="13" font-weight="700">${pct(r)}</text>`;
  return s+"</svg>";
}
function retRows(rs){
  return rs.map(x=>`<div class="rb" data-tp="${x.id}"><span class="n">${nameOf(x.id)}</span><i><u style="width:${x.r*100}%;background:${col(x.r)}"></u></i><b style="color:${col(x.r)}">${pct(x.r)}</b></div>`).join("");
}
function todayTab(today){
  const q=queue(today),st=started().filter(id=>S[id]===today);
  const rows=q.map((x,j)=>{const key=x.id+"|"+x.i,r=ret(x.id,today);
    return `<div class="dr" style="--c:${SC[subOf(x.id)]}"><span class="nb">${j+1}</span><span class="tg">${subOf(x.id).slice(0,4)}</span><span class="dn">${nameOf(x.id)}</span>${is11(x.id)?"":`<span class="tg">${wt(x.id)} marks</span>`}<span class="r ${x.od>0?"o":"d"}">${x.od>0?"Overdue "+x.od+"d":"Due today"} &middot; Rev ${x.i+1}</span><span class="tg" style="color:${col(r)}">${pct(r)}</span><span class="rc"><button class="b" data-m="${key}" title="Mark revised">&check;</button><button class="b m" data-r="${key}" title="Move to tomorrow">&#8635;</button></span></div>`}).join("");
  const stu=st.map(id=>`<div class="dr" style="--c:${SC[subOf(id)]}"><span class="tg">${subOf(id).slice(0,4)}</span><span class="dn">${nameOf(id)}</span>${is11(id)?"":`<span class="tg">${wt(id)} marks</span>`}<span class="r s">To study</span></div>`).join("");
  return `<section class="sec"><div class="sh"><h2>DUE TODAY</h2><div class="pg">${q.length} revision${q.length===1?"":"s"} &middot; ${st.length} to study</div></div><div class="sub2">Ranked by (overdue days + 1) &times; topic marks &times; priority. Set marks in Planner (Class 12 only).</div><div class="dt">${rows||'<div class="em0">Nothing pending &mdash; you are all caught up. 🎉</div>'}${stu}</div></section>`;
}
function curveTab(today){
  const ids=started();
  if(!ids.length)return `<section class="sec"><div class="sh"><h2>FORGETTING CURVE</h2></div><div class="em0">Pick a study date for any lesson to see its curve.</div></section>`;
  const rs=live(today).map(id=>({id,r:ret(id,today)})).sort((a,b)=>a.r-b.r);
  if(!CT||!S[CT])CT=(rs[0]||{id:ids[0]}).id;
  const opts=ids.map(id=>`<option value="${id}"${id===CT?" selected":""}>${subOf(id).slice(0,4)} &middot; ${nameOf(id)}</option>`).join("");
  return `<section class="sec"><div class="sh"><h2>FORGETTING CURVE</h2><select data-sel>${opts}</select></div><div class="gr">${curveSVG(CT,today)}</div><div class="cap">Solid = so far &middot; dashed = predicted decay if you skip further revision &middot; filled dot = revised &middot; hollow dot = scheduled revision &middot; pink = exam. Each revision makes memory about 2.6&times; more durable.</div></section><section class="sec"><div class="sh"><h2>ALL TOPICS &middot; RETENTION NOW</h2></div><div class="dt">${retRows(rs)}</div></section>`;
}
function plannerTab(today){
  const load=[];for(let n=0;n<7;n++){const day=iso(add(today,n));let c=0;started().forEach(id=>OFF.forEach((o,i)=>{if(rv(id,i).d)return;const k=eff(id,i);if(n===0?k<=day:k===day)c++}));load.push({l:n?fmtS(day):"Today",v:c})}
  const cards=SJ12.map(sj=>{
    const ids=[];D[sj].forEach((b,bi)=>b[1].forEach(t=>ids.push(sj+"|"+bi+"|"+t)));
    const ex=E[sj],left=ex?dayN(today,ex):null,un=ids.filter(id=>!S[id]).length,o=offFor(today,ex);
    const badge=ex?(left>=0?`<span class="r ${left<=14?"o":left<=45?"d":"f"}">${left} day${left===1?"":"s"} left</span>`:`<span class="r p">Exam over</span>`):"";
    const d2=ex&&left>0?(left>7?left-7:left):0,pace=un&&d2?(un/d2).toFixed(1)+" topics/day":"&mdash;";
    const comp=o[2]!==21?" (compressed)":"";
    return `<section class="sec"><div class="sh"><h2>${sj}</h2>${badge}</div><div class="pc"><div class="row2"><label>Exam date</label><input type="date" data-ex="${sj}" value="${ex||""}"></div><div class="sm">Started ${ids.length-un}/${ids.length} &middot; not started ${un} &middot; pace to finish 1st pass a week before exam: <b>${pace}</b></div><div class="sm">If studied today: Rev 1 +${o[0]}d &middot; Rev 2 +${o[1]}d &middot; Rev 3 +${o[2]}d${comp}</div><div class="sm">Topic weightage (marks)</div><div class="wgr">${ids.map(id=>`<label>${nameOf(id)}<input type="number" min="1" max="20" data-w="${id}" value="${wt(id)}"></label>`).join("")}</div></div></section>`}).join("");
  return `<section class="sec" style="margin-bottom:22px"><div class="sh"><h2>EXAM COUNTDOWN PLANNER</h2><button class="nv${A?" on":""}" data-ac="1">Auto-compress intervals: ${A?"On":"Off"}</button></div><div class="sub2">When an exam date is set, Rev 1/2/3 intervals shrink automatically so Rev 3 lands before exam day (default 1 / 7 / 21 days). Manually moved dates stay as you set them. Class 11 uses the default 1 / 7 / 21 days.</div><div class="gr">${barsSVG(load,"#38e1ff",v=>Math.round(v))}</div><div class="cap">Revisions due over the next 7 days</div></section><div class="pl">${cards}</div>`;
}
function statsTab(today){
  const ids=live(today),rets=ids.map(id=>({id,r:ret(id,today)})),ws=wkStart(today);
  const avg=rets.length?rets.reduce((a,x)=>a+x.r,0)/rets.length:null;
  let done=0,ot=0,od=0,wd=0;
  ids.forEach(id=>OFF.forEach((o,i)=>{const r=rv(id,i),k=eff(id,i),b=r.od||k;if(r.d){done++;if((r.c||b)<=b)ot++;if(r.c&&r.c>=ws)wd++}else if(b<today)od++}));
  const rate=done+od?Math.round(ot/(done+od)*100):null;
  const wk=[];for(let n=7;n>=0;n--){const s0=iso(add(ws,-7*n));let h=0;for(let j=0;j<7;j++)h+=H[iso(add(s0,j))]||0;wk.push({l:fmtS(s0),v:Math.round(h*100)/100})}
  const tr=[];for(let n=29;n>=0;n--){const day=iso(add(today,-n)),a=ids.filter(id=>S[id]<=day).map(id=>ret(id,day));tr.push({l:fmtS(day),v:a.length?a.reduce((x,y)=>x+y,0)/a.length:null})}
  const sub=SJ.map(sj=>{const a=rets.filter(x=>subOf(x.id)===sj);return{l:sj.slice(0,4),v:a.length?a.reduce((x,y)=>x+y.r,0)/a.length*100:0}});
  const weak=rets.slice().sort((a,b)=>a.r-b.r).slice(0,5);
  const kp=[[avg===null?"—":pct(avg),"Avg retention now",""],[rate===null?"—":rate+"%","On-time revision rate","t"],[wk[7].v+"h","Study hours this week",""],[wd,"Revisions done this week","t"]].map(x=>`<div class="chip ${x[2]}"><b>${x[0]}</b><span>${x[1]}</span></div>`).join("");
  return `<div class="kp">${kp}</div><section class="sec" style="margin-bottom:22px"><div class="sh"><h2>LOG STUDY HOURS</h2></div><div class="hl"><input type="date" id="hd" value="${today}"><input type="number" id="hh" step="0.25" min="0" max="24" placeholder="hours (0 = clear)"><button class="nv" data-lh="1">Log</button></div></section>
<div class="pl"><section class="sec"><div class="sh"><h2>WEEKLY STUDY HOURS</h2></div><div class="gr">${barsSVG(wk,"#00d4ff",v=>(Math.round(v*10)/10)+"h")}</div></section><section class="sec"><div class="sh"><h2>RETENTION TREND &middot; 30 DAYS</h2></div><div class="gr">${lineSVG(tr,"#7ee8ff")}</div></section><section class="sec"><div class="sh"><h2>RETENTION BY SUBJECT</h2></div><div class="gr">${barsSVG(sub,"#34d399",v=>Math.round(v)+"%")}</div></section><section class="sec"><div class="sh"><h2>WEAKEST TOPICS</h2></div><div class="dt">${weak.length?retRows(weak):'<div class="em0">No topics started yet.</div>'}</div></section></div>`;
}
function extraHTML(c,today){return c==="TODAY"?todayTab(today):c==="CURVE"?curveTab(today):c==="PLANNER"?plannerTab(today):statsTab(today)}
document.addEventListener("change",e=>{
  const t=e.target,d=t.dataset||{};
  if(d.ex!==undefined){t.value?E[d.ex]=t.value:delete E[d.ex];save();render()}
  else if(d.w){W[d.w]=Math.max(1,Math.min(20,+t.value||4));save()}
  else if(d.sel!==undefined){CT=t.value;render()}
});
document.addEventListener("click",e=>{
  const el=e.target.closest&&e.target.closest("[data-tp],[data-lh],[data-ac]");if(!el)return;const d=el.dataset;
  if(d.tp){CT=d.tp;location.hash="#curve";render()}
  else if(d.ac){A=!A;save();render()}
  else if(d.lh){const dt=document.getElementById("hd").value,v=parseFloat(document.getElementById("hh").value);if(!dt)return;v>0?H[dt]=v:delete H[dt];save();render()}
});

// ===== ui fx =====
function cnt(el,n){
  const from=+el.dataset.v||0;el.dataset.v=n;
  if(from===n||matchMedia("(prefers-reduced-motion:reduce)").matches){el.textContent=n;return}
  const t0=performance.now();
  (function f(t){const k=Math.min(1,(t-t0)/650),e=1-Math.pow(1-k,3);el.textContent=Math.round(from+(n-from)*e);if(k<1)requestAnimationFrame(f)})(t0);
}
const COARSE=matchMedia("(pointer:coarse)").matches;
let px=innerWidth/2,py=innerHeight/3,qx=px,qy=py,fr=0;
function fxLoop(){
  qx+=(px-qx)*.13;qy+=(py-qy)*.13;
  cglow.style.transform="translate("+qx+"px,"+qy+"px)";
  gridfx.style.setProperty("--cx",qx+"px");gridfx.style.setProperty("--cy",qy+"px");
  fr=Math.abs(px-qx)+Math.abs(py-qy)>.5?requestAnimationFrame(fxLoop):0;
}
addEventListener("pointermove",e=>{
  if(COARSE)return;
  px=e.clientX;py=e.clientY;if(!fr)fr=requestAnimationFrame(fxLoop);
  const t=e.target.closest&&e.target.closest(".sec,.chip,.cd");
  if(t){const r=t.getBoundingClientRect();t.style.setProperty("--mx",(e.clientX-r.left)+"px");t.style.setProperty("--my",(e.clientY-r.top)+"px")}
},{passive:true});
function enter(){
  app.classList.remove("enter");void app.offsetWidth;app.classList.add("enter");
  clearTimeout(enter.t);enter.t=setTimeout(()=>app.classList.remove("enter"),1200);
}
function setPill(){dpill.textContent=new Date().toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"})}
let TD0=iso(new Date());
function dayCheck(){const n=iso(new Date());if(n===TD0)return;TD0=n;SEL=n;CM=n.slice(0,7);setPill();rd()}
setPill();
fxLoop();enter();
/* ---------- focus timer page (timer.html shown full-screen) ---------- */
function tmOpen(){const f=document.getElementById("tmf");if(f&&!f.getAttribute("src"))f.setAttribute("src","timer.html")}
let LASTH="";if(location.hash!=="#timer")LASTH=location.hash;
addEventListener("hashchange",function(){if(location.hash!=="#timer")LASTH=location.hash});
addEventListener("message",function(e){if(e.data==="tracker-exit")location.hash=LASTH||"#today"});
document.getElementById("ver").textContent="v24: Class 11 portal";

window.getTasks=()=>{const t=iso(new Date());return[...queue(t).map(x=>({id:x.id,i:x.i,type:'rev',sub:subOf(x.id).slice(0,4),name:nameOf(x.id),lbl:(x.od>0?'Overdue '+x.od+'d':'Due today')+' · Rev '+(x.i+1)})),...started().filter(id=>S[id]===t).map(id=>({id,type:'study',sub:subOf(id).slice(0,4),name:nameOf(id),lbl:'To study'}))]};
window.markDone=(id,i)=>{setR(id,i,{d:true,c:iso(new Date()),od:rv(id,i).od||eff(id,i)});save();render()};
window.addHours=(k,h)=>{H[k]=Math.round(((H[k]||0)+h)*100)/100;save()};
window.setTimer=v=>{K=v;save()};
window.getTimer=()=>loaded?K:null;

/* ---------- smooth + clean touch (delete this block to revert) ---------- */
(()=>{
  const st=document.createElement("style");
  st.textContent=`
*{-webkit-tap-highlight-color:transparent}
*:focus,*:focus-visible{outline:none!important}
a,button,[role=tab],.cd,.dr,.rb,.b,.pr,.nv,.chip,label,summary{-webkit-touch-callout:none;-webkit-user-select:none;user-select:none;touch-action:manipulation}
input,select,textarea{-webkit-user-select:text;user-select:text}
html{overscroll-behavior-y:none}
.tabs,.wrap{-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain}
.b,.pr,.nv,.bs button,.tabs a,#side a,.cd,.dr,.rb,.chip{transition:transform .5s cubic-bezier(.34,1.56,.64,1),background-color .25s,color .25s,border-color .25s,box-shadow .25s,opacity .25s;will-change:transform}
.b:active,.pr:active,.nv:active,.bs button:active,.tabs a:active,#side a:active,.cd:active,.dr:active,.rb:active,.chip:active{transition-duration:.08s,.15s,.15s,.15s,.15s,.15s}
#app.enter>*,#app.enter .cal>*,#app.enter .pl>*,#app.enter .dr,#app.enter .rb,#app.enter tr.lr{animation-duration:.45s}
#app.enter tbody tr:nth-child(n+9){animation-delay:256ms}
#app.enter .dr:nth-child(n+9),#app.enter .rb:nth-child(n+9){animation-delay:256ms}
@media(hover:none),(pointer:coarse){
.chip:hover,.cd:hover,.dr:hover,.rb:hover,.b:hover,.pr:hover,.nv:hover,.nv.go:hover,.bs button:hover{transform:none;filter:none}
.chip,.sec,.bs button,.nv,.pkb,.tabs,.dock{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
.chip,.sec{background:rgba(14,18,24,.6)}
.tabs a.on,.pg i u,.nv.go{animation:none}
}`;
  document.head.appendChild(st);
  document.addEventListener("touchstart",()=>{},{passive:true});
})();
