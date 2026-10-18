const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const ld=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}};
let st=0;
function sync(){if(st)return;st=setTimeout(()=>{st=0;try{parent.setTimer({s:S,t:T,h:HS})}catch(e){}},10000)}
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){return false}if(k!=='k_p')sync();return true};
const PRE={fantasy:['Fantasy','radial-gradient(circle at 50% 40%,#33454f,#0a0e13 70%)'],pastel:['Pastel','linear-gradient(180deg,#5c6fd6,#e07aa8 55%,#f6b48a)'],lofi:['Lofi','linear-gradient(160deg,#171335,#3b2a6b 55%,#c26a8f)'],cyber:['Cyberpunk','linear-gradient(160deg,#0a0620,#3a0f6b 50%,#0aa5c4)']};
const ACC=['#5b9bff','#a98bff','#2dd4bf','#a3e635','#ff6b81','#f2c46d'];
const FX=['off','motes','drift','stars','rain','bubbles'];
const DEF={bg:'fantasy',acc:'#2dd4bf',fx:'motes',dim:45,blur:0,d:{focus:45,short:10,long:20},auto:{b:false,f:false},al:{on:true,t:'digital',v:1}};let S=ld('k_s',{});S={...DEF,...S};S.d={...DEF.d,...S.d};S.auto={...DEF.auto,...S.auto};S.al={...DEF.al,...S.al};let P=ld('k_p',[]),T=ld('k_t',{focus:0,short:0,long:0,streak:0,last:''});
let mode='focus',left=S.d.focus*60,run=false,end=0,iv;
const R=186,C=2*Math.PI*R;$('#arc').style.strokeDasharray=C;

/* ---------- dialog ---------- */
function ask(t,x,y,danger,cb){
  $('#dt').textContent=t;$('#dx').textContent=x;$('#dy').textContent=y;$('#dy').className=danger?'danger':'';
  $('#dlg').classList.add('open');
  $('#dy').onclick=()=>{$('#dlg').classList.remove('open');cb()};
  $('#dn').onclick=()=>$('#dlg').classList.remove('open');
}
$('#dlg').onclick=e=>{if(e.target.id==='dlg')$('#dlg').classList.remove('open')};
addEventListener('keydown',e=>{if(e.key==='Escape')$('#dlg').classList.remove('open')});

/* ---------- stats ---------- */
const key=d=>{d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
let HS=ld('k_h',{});
const ok=k=>HS[k]&&(HS[k].s>=900||HS[k].n>0);
const fm=s=>s>=3600?Math.floor(s/3600)+'h'+(Math.floor(s%3600/60)?' '+Math.floor(s%3600/60)+'m':''):Math.floor(s/60)+'m';
function streak(){
  const ks=Object.keys(HS).filter(ok).sort();let best=0,c=0,prev=null;
  ks.forEach(k=>{const d=new Date(k+'T00:00');c=prev&&Math.round((d-prev)/864e5)===1?c+1:1;prev=d;best=Math.max(best,c)});
  let cur=0,d=new Date();if(!ok(key(d)))d.setDate(d.getDate()-1);
  while(ok(key(d))){cur++;d.setDate(d.getDate()-1)}
  return{cur,best,days:ks.length};
}
function renderStr(){
  const st=streak(),all=Object.values(HS),tot=all.reduce((a,v)=>a+v.s,0),n=all.reduce((a,v)=>a+v.n,0);
  $('#s-n').textContent=st.cur;$('#s-t').textContent=fm((HS[key()]||{s:0}).s);
  $('#s-b').textContent=st.best+(st.best===1?' day':' days');$('#s-h').textContent=fm(tot);$('#s-d').textContent=st.days;$('#s-s').textContent=n;
  const now=new Date(),dow=(now.getDay()+6)%7,mon=new Date(now);mon.setDate(now.getDate()-dow);
  $('#wk').innerHTML='MTWTFSS'.split('').map((l,i)=>{const d=new Date(mon);d.setDate(mon.getDate()+i);return'<div class="'+(ok(key(d))?'f ':'')+(i===dow?'t':'')+'"><i></i>'+l+'</div>'}).join('');
}

/* ---------- timer ---------- */
const mm=s=>String(Math.floor(s/60)).padStart(2,'0'),ss=s=>String(s%60).padStart(2,'0');
const LBL={focus:'Focus session',short:'Short Break session',long:'Long Break session'};
let wl;
function wake(){
  if(run&&!wl&&navigator.wakeLock){wl=1;navigator.wakeLock.request('screen').then(l=>{wl=l;l.onrelease=()=>wl=null}).catch(()=>wl=null)}
  else if(!run&&wl&&wl.release)wl.release();
}
function draw(){
  $('#time').innerHTML=mm(left)+'<em>:</em>'+ss(left);
  $('#pill').textContent=LBL[mode];
  $('#go').textContent=run?'❚❚ Pause':'▶ Start';$('#ringw').classList.toggle('run',run);
  $('#arc').style.strokeDashoffset=C*(1-left/(S.d[mode]*60));
  ['focus','short','long'].forEach(k=>$('#c-'+k).textContent=T[k]);
  $('#streak').textContent=streak().cur;if(panel.classList.contains('open')&&!$('#p-str').hidden)renderStr();
  $$('.tab').forEach(t=>t.classList.toggle('on',t.dataset.m===mode));
  document.title=run?mm(left)+':'+ss(left)+' · Krtk':'Krtk';
  wake();
}
let acc=0;
function flush(){if(acc>=1&&parent!==window){try{parent.addHours(key(),acc/3600)}catch(e){}acc=0}}
addEventListener('pagehide',flush);
function renderTk(){
  let L=[];try{L=parent.getTasks()}catch(e){}
  $('#tkl').innerHTML=L.length?L.map(x=>'<div class="set"><span>'+x.sub+' · '+x.name+'<small style="display:block;color:var(--mute)">'+x.lbl+'</small></span>'+(x.type==='rev'?'<button class="pbtn" style="flex:none" data-id="'+x.id+'" data-i="'+x.i+'">✓</button>':'')+'</div>').join(''):'<p class="note">Nothing due today 🎉</p>';
}
$('#tkl').onclick=e=>{const b=e.target.closest('button');if(!b)return;parent.markDone(b.dataset.id,+b.dataset.i);renderTk()};
$('#b-tk').onclick=()=>openP('tk');

function pick(m){flush();sv('k_h',HS);clearInterval(iv);run=false;mode=m;left=S.d[m]*60;draw()}
function done(){
  T[mode]++;
  if(mode==='focus'){const d=HS[key()]=HS[key()]||{s:0,n:0};d.n++;d.s=Math.max(d.s,900);sv('k_h',HS)}
  sv('k_t',T);beep();const nx=mode==='focus'?'short':'focus';pick(nx);if(nx==='focus'?S.auto.f:S.auto.b)start();
}
let tk=0;
function start(){
  run=true;end=Date.now()+left*1000;let lt=Date.now();
  iv=setInterval(()=>{const nw=Date.now(),dt=(nw-lt)/1000;lt=nw;if(mode==='focus'){const d=HS[key()]=HS[key()]||{s:0,n:0};d.s+=dt;acc+=dt;if(acc>=60)flush();if(++tk%20===0)sv('k_h',HS)}left=Math.max(0,Math.round((end-Date.now())/1000));draw();if(!left){clearInterval(iv);run=false;done()}},250);draw();
}
$('#go').onclick=()=>{
  try{ac=ac||new(window.AudioContext||window.webkitAudioContext)()}catch(e){}
  if(run){const ps_=()=>{flush();clearInterval(iv);run=false;sv('k_h',HS);draw()};if(mode==='focus')ask('Pause the timer?','A pause breaks your flow.','Pause',false,ps_);else ps_();return}
  start();
};
$('#rs').onclick=()=>{if(mode==='focus'&&(run||left<S.d.focus*60))ask('Stop the session?','Your focused minutes are saved to today’s total — but this won’t count as a session.','Stop',true,()=>pick(mode));else pick(mode)};
$$('.tab').forEach(t=>t.onclick=()=>pick(t.dataset.m));

/* ---------- panel ---------- */
const panel=$('#panel');
function openP(w){
  const all=['aes','set','str','ph','tk'],cur=all.find(k=>!$('#p-'+k).hidden),base=w==='ph'?'aes':w;
  const same=panel.classList.contains('open')&&(cur===w||(cur==='ph'&&w==='aes'));
  panel.classList.toggle('open',!same);panel.style.width=w==='str'?'290px':'';
  all.forEach(k=>$('#p-'+k).hidden=k!==w);
  ['aes','set','str','tk'].forEach(k=>$('#b-'+k).classList.toggle('on',!same&&k===base));
  if(w==='str')renderStr();
  if(w==='tk')renderTk();
}
$('#b-aes').onclick=()=>openP('aes');$('#b-set').onclick=()=>openP('set');$('#b-str').onclick=()=>openP('str');
$('#b-ph').onclick=()=>openP('ph');
$('#back').onclick=()=>{$('#p-ph').hidden=true;$('#p-aes').hidden=false};
$('#dim').oninput=e=>{S.dim=+e.target.value;$('#dimv').textContent=S.dim+'%';sv('k_s',S);applyBg()};
$('#blur').oninput=e=>{S.blur=+e.target.value;$('#blurv').textContent=S.blur+'px';sv('k_s',S);applyBg()};
$$('[data-close]').forEach(b=>b.onclick=()=>{panel.classList.remove('open');$$('.ic').forEach(i=>i.classList.remove('on'))});

/* ---------- background ---------- */
function applyBg(){
  const el=$('#bg');el.style.background='';el.style.backgroundImage='';el.style.setProperty('--dim',S.dim/100);el.style.filter=S.blur?'blur('+S.blur+'px)':'';el.style.transform=S.blur?'scale(1.08)':'';
  if(PRE[S.bg])el.style.background=PRE[S.bg][1];
  else{const s=P[+S.bg.slice(1)];if(s){el.style.backgroundImage='url("'+s+'")';el.style.backgroundSize='cover';el.style.backgroundPosition='center'}else el.style.background=PRE.fantasy[1]}
}
function tile(bg,label,sel,onclick,del){
  const b=document.createElement('div');b.className='tile'+(sel?' sel':'');b.style.background=bg;b.style.backgroundSize='cover';b.style.backgroundPosition='center';
  if(label){const s=document.createElement('span');s.textContent=label;b.appendChild(s)}
  b.onclick=onclick;
  if(del){const d=document.createElement('i');d.textContent='✕';d.onclick=e=>{e.stopPropagation();del()};b.appendChild(d)}
  return b;
}
function renderPanel(){
  const pr=$('#presets');pr.innerHTML='';
  Object.entries(PRE).forEach(([k,v])=>pr.appendChild(tile(v[1],v[0],S.bg===k,()=>{S.bg=k;save()})));
  const ph=$('#photos');ph.innerHTML='';
  P.forEach((src,i)=>{
    const w=document.createElement('div');w.className='pw';
    const t=tile('url("'+src+'") center/cover','',S.bg==='p'+i,()=>{S.bg='p'+i;save()});
    if(S.bg==='p'+i){const c=document.createElement('i');c.className='ck';c.textContent='✓';t.appendChild(c)}
    const d=document.createElement('button');d.className='tr';d.setAttribute('aria-label','Delete photo');d.textContent='🗑';
    d.onclick=()=>{P.splice(i,1);if(S.bg==='p'+i)S.bg='fantasy';else if(S.bg.startsWith('p')&&+S.bg.slice(1)>i)S.bg='p'+(+S.bg.slice(1)-1);sv('k_p',P);save()};
    w.append(t,d);ph.appendChild(w);
  });
  const ad=document.createElement('label');ad.className='tile add';ad.htmlFor='file';ad.textContent='+';ph.appendChild(ad);
  $('#pcount').textContent=P.length?P.length+(P.length>1?' photos':' photo')+' ':'';
  $('#dim').value=S.dim;$('#dimv').textContent=S.dim+'%';$('#blur').value=S.blur;$('#blurv').textContent=S.blur+'px';
  $('#sw').innerHTML='';ACC.forEach(c=>{const b=document.createElement('button');b.style.background=c;b.className=S.acc===c?'sel':'';b.onclick=()=>{S.acc=c;save()};$('#sw').appendChild(b)});
  $('#fxg').innerHTML='';FX.forEach(f=>{const b=document.createElement('button');b.className='pbtn'+(S.fx===f?' sel':'');b.textContent=f[0].toUpperCase()+f.slice(1);b.onclick=()=>{S.fx=f;save()};$('#fxg').appendChild(b)});
}
function save(){
  sv('k_s',S);document.documentElement.style.setProperty('--acc',S.acc);applyBg();renderPanel();draw();
}
const msg=t=>$('#msg').textContent=t||'';
function addPhoto(src){
  P.push(src);
  if(!sv('k_p',P)){P.pop();msg('Storage full — remove a photo first.');return}
  S.bg='p'+(P.length-1);msg('');save();
}
$('#file').onchange=e=>{
  [...e.target.files].forEach(f=>{
    if(!f.type.startsWith('image/'))return;if(f.size>20*1048576){msg('Max 20 MB per photo.');return}
    const r=new FileReader();
    r.onload=()=>{const im=new Image();im.onload=()=>{
      const k=Math.min(1,1920/Math.max(im.width,im.height)),c=document.createElement('canvas');
      c.width=im.width*k;c.height=im.height*k;c.getContext('2d').drawImage(im,0,0,c.width,c.height);
      addPhoto(c.toDataURL('image/jpeg',.8))};im.src=r.result};
    r.readAsDataURL(f);
  });e.target.value='';
};
$('#addurl').onclick=()=>{
  const u=$('#url').value.trim();
  if(!/^https?:\/\//i.test(u)){msg('Enter a valid https link.');return}
  const safe=u.replace(/"/g,'%22').replace(/'/g,'%27').replace(/\)/g,'%29').replace(/\(/g,'%28'),im=new Image();
  im.onload=()=>{$('#url').value='';addPhoto(safe)};
  im.onerror=()=>msg('Could not load that link. Use a direct image URL.');
  im.src=safe;
};

/* ---------- settings ---------- */
let ac;
function renderSet(){
  const N={focus:'Focus',short:'Short break',long:'Long break'};
  $('#steps').innerHTML=['focus','short','long'].map(k=>'<div>'+N[k]+'<div class="stp"><button data-k="'+k+'" data-n="-1">−</button><div>'+S.d[k]+'<small>min</small></div><button data-k="'+k+'" data-n="1">+</button></div></div>').join('');
  $('#tg-b').classList.toggle('on',S.auto.b);$('#tg-f').classList.toggle('on',S.auto.f);$('#tg-a').classList.toggle('on',S.al.on);
  $('#al').innerHTML='';
  ['chime','bell','digital'].forEach(t=>{const b=document.createElement('button');b.className='pbtn'+(S.al.t===t?' sel':'');b.textContent=(S.al.t===t?'✓ ':'')+t[0].toUpperCase()+t.slice(1);b.onclick=()=>{S.al.t=t;sv('k_s',S);renderSet();beep()};$('#al').appendChild(b)});
  $('#vol').value=Math.round(S.al.v*100);$('#volv').textContent=Math.round(S.al.v*100)+'%';
}
$('#steps').onclick=e=>{const b=e.target.closest('button');if(!b)return;const k=b.dataset.k;S.d[k]=Math.max(1,Math.min(180,S.d[k]+ +b.dataset.n));sv('k_s',S);if(!run&&mode===k)left=S.d[k]*60;renderSet();draw()};
$('#tg-b').onclick=()=>{S.auto.b=!S.auto.b;sv('k_s',S);renderSet()};
$('#tg-f').onclick=()=>{S.auto.f=!S.auto.f;sv('k_s',S);renderSet()};
$('#tg-a').onclick=()=>{S.al.on=!S.al.on;sv('k_s',S);renderSet()};
$('#vol').oninput=e=>{S.al.v=e.target.value/100;$('#volv').textContent=e.target.value+'%';sv('k_s',S)};
$('#vol').onchange=()=>beep();
$('#rst').onclick=()=>{T.focus=T.short=T.long=0;sv('k_t',T);draw()};
function beep(){
  if(!S.al.on)return;
  try{
    ac=ac||new(window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume();
    const n=(f,t0,d,ty)=>{const o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime+t0;o.type=ty;o.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.3*S.al.v+.0001,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(ac.destination);o.start(t);o.stop(t+d+.05)};
    if(S.al.t==='chime'){n(880,0,.8,'sine');n(1320,.25,1,'sine')}
    else if(S.al.t==='bell'){n(660,0,1.8,'sine');n(1320,0,1,'triangle')}
    else[0,.2,.4].forEach(x=>n(1000,x,.12,'square'));
  }catch(e){}
}
renderSet();

/* ---------- ambient fx ---------- */
const cv=$('#fx'),cx=cv.getContext('2d');let W,H,ps=[],raf;
function size(){W=cv.width=innerWidth;H=cv.height=innerHeight}
addEventListener('resize',size);size();
for(let i=0;i<140;i++)ps.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.8+1,v:Math.random()*.4+.15,dx:(Math.random()-.5)*.4,p:Math.random()*6.28});
const dp=Array.from({length:70},()=>({x:Math.random(),y:Math.random(),r:Math.random()*2.2+.9,vx:(Math.random()-.5)*.00018,vy:-Math.random()*.0002-.00008,a:Math.random()*.35+.3}));
function loop(t){
  cx.clearRect(0,0,W,H);
  if(S.fx==='drift'){
    dp.forEach(p=>{p.x=(p.x+p.vx*16+1)%1;p.y=(p.y+p.vy*16+1)%1;cx.beginPath();cx.arc(p.x*W,p.y*H,p.r,0,7);cx.fillStyle='rgba(255,255,255,'+p.a+')';cx.fill()});
  }else if(S.fx!=='off'){
    ps.forEach(p=>{
      cx.shadowBlur=0;
      if(S.fx==='motes'){p.y-=p.v;p.x+=p.dx+Math.sin(t/2500+p.p)*.15;cx.shadowBlur=12;cx.shadowColor=S.acc;cx.fillStyle=S.acc;cx.globalAlpha=.9;cx.beginPath();cx.arc(p.x,p.y,p.r,0,6.28);cx.fill()}
      else if(S.fx==='stars'){cx.fillStyle='#fff';cx.globalAlpha=.1+.45*Math.abs(Math.sin(t/1600+p.p));cx.beginPath();cx.arc(p.x,p.y,p.r*.8,0,6.28);cx.fill()}
      else if(S.fx==='rain'){p.y+=p.v*28;p.x-=1;cx.strokeStyle='#fff';cx.globalAlpha=.3;cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(p.x+1,p.y-10);cx.stroke()}
      else{p.y-=p.v;p.x+=p.dx*.5+Math.sin(t/2000+p.p)*.2;cx.strokeStyle='#fff';cx.globalAlpha=.4;cx.beginPath();cx.arc(p.x,p.y,p.r*4,0,6.28);cx.stroke()}
      if(p.y<-20)p.y=H+10;if(p.y>H+20)p.y=-10;if(p.x<-10)p.x=W+10;if(p.x>W+10)p.x=-10;
    });cx.globalAlpha=1;cx.shadowBlur=0;
  }
  raf=requestAnimationFrame(loop);
}
raf=requestAnimationFrame(loop);

/* ---------- back to tracker (only when shown inside the tracker) ---------- */
if(window.parent!==window){$('#b-back').onclick=()=>parent.postMessage('tracker-exit','*')}
else{$('#b-back').style.display='none'}

addEventListener('keydown',e=>{
  if(/INPUT|TEXTAREA/.test(e.target.tagName))return;
  if(e.code==='Space'){e.preventDefault();$('#go').click()}
  else if(e.key==='r')$('#rs').click();
  else if(/^[123]$/.test(e.key))pick(['focus','short','long'][e.key-1]);
});
save();pick('focus');

try{const K=parent.getTimer();
if(K&&K.s){S={...DEF,...K.s};S.d={...DEF.d,...S.d};S.auto={...DEF.auto,...S.auto};S.al={...DEF.al,...S.al};T=K.t||T;
Object.entries(K.h||{}).forEach(([d,b])=>{const a=HS[d]||{s:0,n:0};HS[d]={s:Math.max(a.s,b.s),n:Math.max(a.n,b.n)}});left=S.d[mode]*60;save();left=S.d[mode]*60;save();left=S.d[mode]*60;save();renderSet()}
else if(K)sync()}catch(e){}
