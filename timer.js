// ===== timer =====
let TS={f:25,s:5,l:15,n:4,auto:false};try{Object.assign(TS,JSON.parse(localStorage.getItem(KEY+"_t")||"{}"))}catch(e){}
const MC={f:"#00d4ff",s:"#34d399",l:"#fbbf24"},ML={f:"Time to focus",s:"Take a short break",l:"Take a long break"};
const tmLen=m=>TS[m]*60,CIRC=2*Math.PI*130;
let TM={mode:"f",left:TS.f*60,run:false,end:0,cnt:0,fid:""};
const tmLeft=()=>TM.run?Math.max(0,Math.ceil((TM.end-Date.now())/1000)):TM.left;
const fmtT=s=>String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0");
const tsSave=()=>{try{localStorage.setItem(KEY+"_t",JSON.stringify(TS))}catch(e){}};
function beep(){if(TS.snd===false)return;try{const c=new(window.AudioContext||window.webkitAudioContext)();[0,.25,.5].forEach(t=>{const o=c.createOscillator(),g=c.createGain();o.frequency.value=880;o.connect(g);g.connect(c.destination);g.gain.setValueAtTime(.25,c.currentTime+t);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+t+.2);o.start(c.currentTime+t);o.stop(c.currentTime+t+.22)})}catch(e){}}
function tmDone(){
  const was=TM.mode;TM.run=false;tcInc(was);
  if(was==="f"){TM.cnt++;const dt=iso(new Date());H[dt]=Math.round(((H[dt]||0)+TS.f/60)*100)/100;save()}
  beep();
  try{if("Notification"in window&&Notification.permission==="granted")new Notification(was==="f"?"Focus session done — take a break":"Break over — back to focus")}catch(e){}
  TM.mode=was==="f"?(TM.cnt%TS.n===0?"l":"s"):"f";TM.left=tmLen(TM.mode);
  if(TS.auto){TM.run=true;TM.end=Date.now()+TM.left*1000}
  render();
}
function tmTick(){
  if(TM.run&&TM.end-Date.now()<=0)tmDone();
  const l=tmLeft(),tot=tmLen(TM.mode),tx=document.getElementById("tmt"),rg=document.getElementById("tmr");
  if(tx)tx.innerHTML=fmtT(l).replace(":",'<span class="tv-c">:</span>');
  if(rg)rg.setAttribute("stroke-dashoffset",CIRC*(1-l/tot));
  document.title=TM.run?fmtT(l)+" · "+(TM.mode==="f"?"Focus":"Break"):"Spaced Revision Tracker";
}
setInterval(tmTick,250);
function timerTab(today){
  const q=queue(today);if(TM.fid&&!q.some(x=>x.id+"|"+x.i===TM.fid))TM.fid="";
  const c=MC[TM.mode],l=tmLeft(),tot=tmLen(TM.mode);
  const modes=[["f","Focus"],["s","Short break"],["l","Long break"]].map(([k,n])=>`<button class="nv${TM.mode===k?" on":""}" data-tm="${k}">${n}</button>`).join("");
  const k=TM.cnt%TS.n,dots=Array.from({length:TS.n},(_,i)=>`<i style="background:${i<k?c:"#ffffff1f"};box-shadow:${i<k?"0 0 8px "+c:"none"}"></i>`).join("");
  const opts='<option value="">General study</option>'+q.map(x=>{const key=x.id+"|"+x.i;return `<option value="${key}"${key===TM.fid?" selected":""}>${subOf(x.id).slice(0,4)} &middot; ${nameOf(x.id)} &middot; Rev ${x.i+1}</option>`}).join("");
  const cu=TM.fid?`<button class="nv" data-m="${TM.fid}">&check; Mark revised</button>`:"";
  const hrs=Math.round((H[today]||0)*100)/100;
  const inp=(k,n,mn,mx)=>`<label>${n}<input type="number" min="${mn}" max="${mx}" data-ts="${k}" value="${TS[k]}"></label>`;
  return `<div class="cal"><section class="sec"><div class="sh"><h2>POMODORO TIMER</h2><div class="pg">${hrs}h focused today</div></div><div class="tm"><div class="tmodes">${modes}</div><div class="ring${TM.run?" run":""}"><svg viewBox="0 0 300 300"><circle cx="150" cy="150" r="130" fill="none" stroke="#ffffff14" stroke-width="12"/><circle id="tmr" cx="150" cy="150" r="130" fill="none" stroke="${c}" stroke-width="12" stroke-linecap="round" stroke-dasharray="${CIRC}" stroke-dashoffset="${CIRC*(1-l/tot)}" style="filter:drop-shadow(0 0 10px ${c})"/></svg><div class="t" id="tmt">${fmtT(l)}</div></div><div class="tml">${ML[TM.mode]}</div><div class="tmrow"><button class="nv go" data-tgo="1">${TM.run?"Pause":"Start"}</button><button class="nv" data-trs="1">Reset</button><button class="nv" data-tsk="1">Skip</button></div><div class="dots">${dots}</div></div></section><section class="sec"><div class="sh"><h2>FOCUS ON</h2></div><div class="pc tmc"><select data-tf="1">${opts}</select>${cu}<div class="sm" style="padding:0">Finished focus sessions are added to Stats &rarr; study hours automatically.</div></div><div class="sh" style="border-top:1px solid var(--line)"><h2>SETTINGS (MINUTES)</h2></div><div class="wgr tmc">${inp("f","Focus",1,180)}${inp("s","Short break",1,60)}${inp("l","Long break",1,90)}${inp("n","Sessions before long break",2,10)}<label>Auto-start next<input type="checkbox" data-ta="1"${TS.auto?" checked":""}></label></div></section></div>`;
}
document.addEventListener("click",e=>{
  const el=e.target.closest&&e.target.closest("[data-tm],[data-tgo],[data-trs],[data-tsk]");if(!el)return;const d=el.dataset;
  if(d.tm){TM.mode=d.tm;TM.run=false;TM.left=tmLen(d.tm)}
  else if(d.tgo!==undefined){if(TM.run){TM.left=tmLeft();TM.run=false}else{TM.end=Date.now()+TM.left*1000;TM.run=true;try{if("Notification"in window&&Notification.permission==="default")Notification.requestPermission()}catch(_){}}}
  else if(d.trs!==undefined){TM.run=false;TM.left=tmLen(TM.mode)}
  else if(d.tsk!==undefined){TM.run=false;TM.mode=TM.mode==="f"?"s":"f";TM.left=tmLen(TM.mode)}
  render();
});
document.addEventListener("change",e=>{
  const t=e.target,d=t.dataset||{};
  if(d.ts){const mx=d.ts==="n"?10:180;TS[d.ts]=Math.max(d.ts==="n"?2:1,Math.min(mx,Math.round(+t.value)||TS[d.ts]));tsSave();if(!TM.run)TM.left=tmLen(TM.mode);render()}
  else if(d.ta!==undefined){TS.auto=t.checked;tsSave()}
  else if(d.tf!==undefined){TM.fid=t.value;render()}
});
// ===== focus timer page =====
const SW=[{a:"#2dd4bf",b:"#c6fff1",d:"#1fb09d"},{a:"#22d3ee",b:"#cffafe",d:"#0aa5c4"},{a:"#a78bfa",b:"#ede9fe",d:"#7c5cf0"},{a:"#f472b6",b:"#fce7f3",d:"#e0529c"},{a:"#fbbf24",b:"#fef3c7",d:"#d99a0b"}];
const QU=["Either you run the day or the day runs you.","Small steps every day add up to big results.","Discipline is choosing what you want most over what you want now.","The expert in anything was once a beginner.","Don\u2019t watch the clock; do what it does. Keep going.","Success is the sum of small efforts repeated day in and day out.","Focus on the process, not the outcome.","It always seems impossible until it\u2019s done.","You don\u2019t have to be great to start, but you have to start to be great.","One focused hour beats five distracted ones."];
let TV={ac:0,sh:.45,name:"Krtk"};try{Object.assign(TV,JSON.parse(localStorage.getItem(KEY+"_tv")||"{}"))}catch(e){}
const tvSave=()=>{try{localStorage.setItem(KEY+"_tv",JSON.stringify(TV))}catch(e){}};
let TC={d:"",f:0,s:0,l:0};try{const t0=JSON.parse(localStorage.getItem(KEY+"_tc")||"null");if(t0)TC=t0}catch(e){}
let TQ=Math.floor(Math.random()*QU.length),TP="",LASTH="",TVURL="",NZ=null,TVMU=false;
const tcGet=m=>TC.d===iso(new Date())?TC[m]:0;
function tcInc(m){const d=iso(new Date());if(TC.d!==d)TC={d:d,f:0,s:0,l:0};TC[m]++;try{localStorage.setItem(KEY+"_tc",JSON.stringify(TC))}catch(e){}if(m==="f")TQ=(TQ+1)%QU.length}
const IC={
 trophy:'<svg viewBox="0 0 24 24"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
 flame:'<svg viewBox="0 0 24 24"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
 palette:'<svg viewBox="0 0 24 24"><circle cx="13.5" cy="6.5" r=".6"/><circle cx="17.5" cy="10.5" r=".6"/><circle cx="8.5" cy="7.5" r=".6"/><circle cx="6.5" cy="12.5" r=".6"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>',
 gear:'<svg viewBox="0 0 24 24"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
 back:'<svg viewBox="0 0 24 24"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>',
 music:'<svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
 pip:'<svg viewBox="0 0 24 24"><path d="M21 9V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4"/><rect x="12" y="13" width="10" height="7" rx="2"/></svg>',
 tasks:'<svg viewBox="0 0 24 24"><path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/></svg>',
 play:'<svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z"/></svg>',
 pause:'<svg viewBox="0 0 24 24"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>'
};
/* tiny key-value store (IndexedDB) so the uploaded background survives reloads */
function tvDB(){return new Promise(function(res,rej){var r=indexedDB.open("revtracker",1);r.onupgradeneeded=function(){r.result.createObjectStore("kv")};r.onsuccess=function(){res(r.result)};r.onerror=function(){rej(r.error)}})}
async function kvGet(k){try{const d=await tvDB();return await new Promise(function(res){const q=d.transaction("kv").objectStore("kv").get(k);q.onsuccess=function(){res(q.result||null)};q.onerror=function(){res(null)}})}catch(e){return null}}
async function kvSet(k,v){try{const d=await tvDB();await new Promise(function(res){const t=d.transaction("kv","readwrite");if(v===null)t.objectStore("kv").delete(k);else t.objectStore("kv").put(v,k);t.oncomplete=res;t.onerror=res})}catch(e){}}
async function tvLoadBg(){
  const b=await kvGet("tvbg"),el=document.getElementById("tvimg");
  if(TVURL){URL.revokeObjectURL(TVURL);TVURL=""}
  if(b){TVURL=URL.createObjectURL(b);el.style.backgroundImage='url("'+TVURL+'")';el.classList.remove("def")}
  else{el.style.backgroundImage="";el.classList.add("def")}
  tmvRender(true);
}
async function tvSetBg(file){
  try{
    const url=URL.createObjectURL(file);
    const im=await new Promise(function(res,rej){const i=new Image();i.onload=function(){res(i)};i.onerror=rej;i.src=url});
    const k=Math.min(1,2200/Math.max(im.naturalWidth,im.naturalHeight)),cv=document.createElement("canvas");
    cv.width=Math.round(im.naturalWidth*k);cv.height=Math.round(im.naturalHeight*k);
    cv.getContext("2d").drawImage(im,0,0,cv.width,cv.height);
    const blob=await new Promise(function(r){cv.toBlob(r,"image/jpeg",.88)});
    URL.revokeObjectURL(url);
    await kvSet("tvbg",blob||file);
  }catch(e){await kvSet("tvbg",file)}
  tvLoadBg();
}
function noiseOn(){
  try{
    const C=window.AudioContext||window.webkitAudioContext,ctx=new C(),len=ctx.sampleRate*3,buf=ctx.createBuffer(1,len,ctx.sampleRate),d=buf.getChannelData(0);
    let last=0;for(let i=0;i<len;i++){const w=Math.random()*2-1;last=(last+.02*w)/1.02;d[i]=last*3.2}
    const src=ctx.createBufferSource();src.buffer=buf;src.loop=true;const g=ctx.createGain();g.gain.value=.22;src.connect(g);g.connect(ctx.destination);src.start();NZ={ctx:ctx,src:src};
  }catch(e){}
}
function noiseOff(){try{if(NZ){NZ.src.stop();NZ.ctx.close();NZ=null}}catch(e){}}
function streak(){let n=0;const d=new Date();if(!(H[iso(d)]>0))d.setDate(d.getDate()-1);while(H[iso(d)]>0){n++;d.setDate(d.getDate()-1)}return n}
function tvStats(today){
  const r2=function(x){return Math.round(x*100)/100};let wk=0,tot=0;
  for(let i=0;i<7;i++)wk+=H[iso(add(today,-i))]||0;
  Object.keys(H).forEach(function(k){tot+=H[k]||0});
  return '<h3>Your focus</h3><div class="tv-g"><div class="tv-s"><b>'+r2(H[today]||0)+'h</b><span>Today</span></div><div class="tv-s"><b>'+r2(wk)+'h</b><span>Last 7 days</span></div><div class="tv-s"><b>'+tcGet("f")+'</b><span>Sessions today</span></div><div class="tv-s"><b>'+streak()+'</b><span>Day streak</span></div></div><p>Total focused: '+r2(tot)+'h. Finished focus sessions are added to your study hours automatically.</p>';
}
function tvPalette(){
  return '<h3>Background</h3><button class="tv-btn p" data-tvbg="1">Upload from your device</button>'+(TVURL?'<button class="tv-btn" data-tvrm="1">Remove image</button>':'')+'<label>Darkness<span id="tvshl">'+Math.round(TV.sh*100)+'%</span></label><input type="range" min="0" max="85" value="'+Math.round(TV.sh*100)+'" data-tvsh="1"><h3 style="margin-top:18px">Accent colour</h3><div class="tv-sw">'+SW.map(function(s,i){return '<button class="'+(i===TV.ac?"on":"")+'" style="--c:'+s.a+'" data-tvac="'+i+'"></button>'}).join("")+'</div>';
}
function tvSettings(){
  const inp=function(k,n,mn,mx){return '<label>'+n+'<input type="number" min="'+mn+'" max="'+mx+'" data-tvs="'+k+'" value="'+TS[k]+'"></label>'};
  return '<h3>Timer</h3>'+inp("f","Focus (min)",1,180)+inp("s","Short break (min)",1,60)+inp("l","Long break (min)",1,90)+inp("n","Focus sessions before a long break",2,10)+'<label>Auto-start next session<input type="checkbox" data-tvt="auto"'+(TS.auto?" checked":"")+'></label><label>Sound when a session ends<input type="checkbox" data-tvt="snd"'+(TS.snd!==false?" checked":"")+'></label><button class="tv-btn" data-trs="1">Reset timer</button><button class="tv-btn" data-tsk="1">Skip to next</button>';
}
function tvTasks(today){
  const q=queue(today),st=started().filter(function(id){return S[id]===today});let h='<h3>Tasks &middot; due today</h3>';
  q.forEach(function(x){const key=x.id+"|"+x.i;h+='<div class="tv-row'+(key===TM.fid?" sel":"")+'" data-tvfocus="'+key+'"><span class="tv-tag" style="--c:'+SC[subOf(x.id)]+'">'+subOf(x.id).slice(0,4)+'</span><span class="tv-rn">'+nameOf(x.id)+'<small>'+(x.od>0?"Overdue "+x.od+"d":"Due today")+' &middot; Rev '+(x.i+1)+'</small></span><button class="tv-ok" data-m="'+key+'" title="Mark revised">&check;</button></div>'});
  st.forEach(function(id){h+='<div class="tv-row"><span class="tv-tag" style="--c:'+SC[subOf(id)]+'">'+subOf(id).slice(0,4)+'</span><span class="tv-rn">'+nameOf(id)+'<small>To study today</small></span></div>'});
  h+=(q.length||st.length)?'<p>Tap a task to focus on it. Tick &check; when you have revised it.</p>':'<p>Nothing due &mdash; you are all caught up. 🎉</p>';
  return h;
}
function tmvRender(force){
  const ui=document.getElementById("tvui"),root=document.getElementById("tmv"),ae=document.activeElement;
  if(!force&&ae&&ui.contains(ae)&&/^(INPUT|SELECT)$/.test(ae.tagName))return;
  const today=iso(new Date()),sw=SW[TV.ac]||SW[0],l=tmLeft(),tot=tmLen(TM.mode);
  root.style.setProperty("--ac",sw.a);root.style.setProperty("--ac2",sw.b);root.style.setProperty("--acd",sw.d);root.style.setProperty("--sh",TV.sh);
  const q=queue(today);if(TM.fid&&!q.some(function(x){return x.id+"|"+x.i===TM.fid}))TM.fid="";
  const fx=TM.fid?nameOf(TM.fid.slice(0,TM.fid.lastIndexOf("|"))):"";
  const pill=TM.mode==="f"?(fx||"Focus session"):TM.mode==="s"?"Short break":"Long break";
  const tm=fmtT(l).replace(":",'<span class="tv-c">:</span>');
  const lab=TM.run?"Pause":(l<tot?"Resume":"Start");
  const tabs=[["f","Focus"],["s","Short Break"],["l","Long Break"]].map(function(a){return '<button class="'+(TM.mode===a[0]?"on":"")+'" data-tm="'+a[0]+'">'+a[1]+'<b>'+tcGet(a[0])+'</b></button>'}).join("");
  let pop="";
  if(TP==="tasks")pop='<div class="tv-pop B">'+tvTasks(today)+'</div>';
  else if(TP==="stats")pop='<div class="tv-pop L">'+tvStats(today)+'</div>';
  else if(TP==="palette")pop='<div class="tv-pop L">'+tvPalette()+'</div>';
  else if(TP==="settings")pop='<div class="tv-pop L">'+tvSettings()+'</div>';
  else if(TP==="about")pop='<div class="tv-pop L"><h3>About</h3><p>A distraction-free focus timer for your revision. Finished focus sessions are added to your study hours in Stats.</p><p><b>Space</b> start / pause &middot; <b>Esc</b> close panels</p><p>Use the palette button to upload your own background from your device.</p></div>';
  const bt=function(k,ic,t){return '<button data-tv="'+k+'" class="'+(TP===k?"on":"")+'" title="'+t+'">'+ic+'</button>'};
  ui.innerHTML='<button class="tv-logo" data-tvnm="1" title="Click to rename">'+TV.name+'</button>'+
  '<div class="tv-bar">'+bt("stats",IC.trophy,"Your focus")+'<button data-tv="stats" title="Day streak"><span class="tv-fl">'+IC.flame+'<span>'+streak()+'</span></span></button><div class="tv-sep"></div>'+bt("palette",IC.palette,"Background and colours")+bt("settings",IC.gear,"Timer settings")+'<button data-tvx="1" title="Back to tracker">'+IC.back+'</button></div>'+
  '<div class="tv-c0"><div class="tv-tabs">'+tabs+'</div><div class="tv-ring"><svg viewBox="0 0 300 300"><defs><linearGradient id="tvg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+sw.a+'"/><stop offset="1" stop-color="'+sw.b+'"/></linearGradient></defs><circle cx="150" cy="150" r="130" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="9"/><circle id="tmr" cx="150" cy="150" r="130" fill="none" stroke="url(#tvg)" stroke-width="9" stroke-linecap="round" stroke-dasharray="'+CIRC+'" stroke-dashoffset="'+(CIRC*(1-l/tot))+'" transform="rotate(-90 150 150)" style="filter:drop-shadow(0 0 7px '+sw.a+')"/></svg><div class="tv-t"><div class="tv-time" id="tmt">'+tm+'</div><div class="tv-pill"><i></i>'+pill+'</div></div></div><div class="tv-q">\u201c'+QU[TQ]+'\u201d</div></div>'+
  '<div class="tv-dock"><button class="tv-d tv-stop" data-trs="1" title="Stop and reset timer"><span class="tv-sq"></span></button><button class="tv-start" data-tgo="1">'+(TM.run?IC.pause:IC.play)+lab+'</button><button class="tv-d" data-tvfs="1" title="Fullscreen">'+IC.pip+'</button><button class="tv-d" data-tv="tasks" title="Tasks due today">'+IC.tasks+'<span class="tv-dl">Tasks</span></button></div>'+
  '<button class="tv-about" data-tv="about">ABOUT</button>'+pop;
}
function tvInit(){
  const p=document.getElementById("tvparts");let h="";
  for(let i=0;i<48;i++){h+='<i style="left:'+(Math.random()*100).toFixed(1)+'%;top:'+(Math.random()*100).toFixed(1)+'%;--w:'+(Math.random()*2.2+1.4).toFixed(1)+'px;--d:'+(7+Math.random()*9).toFixed(1)+'s;--dl:-'+(Math.random()*12).toFixed(1)+'s"></i>'}
  p.innerHTML=h;tvLoadBg();
}
function tvGo(){
  if(TM.run){TM.left=tmLeft();TM.run=false}
  else{TM.end=Date.now()+TM.left*1000;TM.run=true;try{if("Notification"in window&&Notification.permission==="default")Notification.requestPermission()}catch(_){}}
  render();
}
document.addEventListener("click",function(e){
  if(!document.body.classList.contains("tm-on"))return;
  const T=e.target;if(!T.closest||T.id==="tvfile"||T.closest("[data-m]"))return;
  const el=T.closest("[data-tv],[data-tvx],[data-tvfs],[data-tvmu],[data-tvbg],[data-tvrm],[data-tvac],[data-tvfocus],[data-tvnm]");
  if(!el){if(TP&&!T.closest(".tv-pop")){TP="";tmvRender(true)}return}
  const d=el.dataset;
  if(d.tv){TP=TP===d.tv?"":d.tv}
  else if(d.tvx){location.hash=LASTH||"#today";return}
  else if(d.tvfs){try{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()}catch(_){}return}
  else if(d.tvmu){TVMU=!TVMU;TVMU?noiseOn():noiseOff()}
  else if(d.tvbg){document.getElementById("tvfile").click();return}
  else if(d.tvrm){kvSet("tvbg",null).then(tvLoadBg);return}
  else if(d.tvac!==undefined){TV.ac=+d.tvac;tvSave()}
  else if(d.tvfocus){TM.fid=TM.fid===d.tvfocus?"":d.tvfocus}
  else if(d.tvnm){const n=prompt("Your name",TV.name);if(n&&n.trim()){TV.name=n.trim().slice(0,20);tvSave()}}
  tmvRender(true);
});
document.addEventListener("change",function(e){
  const t=e.target,d=t.dataset||{};
  if(d.tvs){const k=d.tvs,mx=k==="n"?10:k==="s"?60:k==="l"?90:180,mn=k==="n"?2:1;TS[k]=Math.max(mn,Math.min(mx,Math.round(+t.value)||TS[k]));tsSave();if(!TM.run&&k===TM.mode)TM.left=tmLen(TM.mode);tmvRender(true)}
  else if(d.tvt){TS[d.tvt]=t.checked;tsSave();tmvRender(true)}
  else if(t.id==="tvfile"&&t.files&&t.files[0]){tvSetBg(t.files[0]);t.value=""}
});
document.addEventListener("input",function(e){
  const t=e.target;if(t.dataset&&t.dataset.tvsh){TV.sh=t.value/100;document.getElementById("tmv").style.setProperty("--sh",TV.sh);const l=document.getElementById("tvshl");if(l)l.textContent=t.value+"%";tvSave()}
});
document.addEventListener("keydown",function(e){
  if(!document.body.classList.contains("tm-on"))return;
  const t=e.target;if(t&&/^(INPUT|SELECT|TEXTAREA)$/.test(t.tagName))return;
  if(e.code==="Space"){e.preventDefault();tvGo()}
  else if(e.key==="Escape"&&TP){TP="";tmvRender(true)}
});
if(location.hash!=="#timer")LASTH=location.hash;
addEventListener("hashchange",function(){if(location.hash!=="#timer")LASTH=location.hash});
tvInit();
