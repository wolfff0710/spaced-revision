/* timer-ios.js - load after timer.js: glass sliding thumbs + touch spotlight */
(()=>{
  const mk=(bar,sel)=>{
    if(!bar)return;
    const th=document.createElement("span");th.className="gthumb";th.innerHTML="<i></i>";
    bar.insertBefore(th,bar.firstChild);bar.classList.add("gt");
    let placed=false,k="";
    const place=anim=>{
      const a=bar.querySelector(sel);
      if(!a||a.offsetParent===null){th.style.opacity=0;return}
      th.style.opacity=1;
      const x=a.offsetLeft,y=a.offsetTop,w=a.offsetWidth,h=a.offsetHeight,key=[x,y,w,h].join();
      if(key===k)return;k=key;
      const fast=!placed||!anim;
      if(fast)th.style.transition="none";
      th.style.width=w+"px";th.style.height=h+"px";th.style.transform="translate("+x+"px,"+y+"px)";
      if(fast){void th.offsetWidth;th.style.transition=""}
      else{const i=th.firstChild;i.classList.remove("jel");void i.offsetWidth;i.classList.add("jel")}
      placed=true;
    };
    new MutationObserver(r=>{if(r.some(m=>!th.contains(m.target)))place(true)}).observe(bar,{attributes:true,subtree:true,attributeFilter:["class"]});
    if(window.ResizeObserver)new ResizeObserver(()=>place(false)).observe(bar);
    addEventListener("resize",()=>place(false));
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>place(false));
    place(false);
  };
  mk(document.getElementById("tabs"),".tab.on");
  mk(document.getElementById("side"),".ic.on");
  const g=document.createElement("div");g.className="tglow";document.body.appendChild(g);
  let off=0,x=0,y=0,f=0;
  const paint=()=>{f=0;g.style.transform="translate("+x+"px,"+y+"px)"};
  const mv=e=>{if(e.pointerType==="mouse")return;x=e.clientX;y=e.clientY;clearTimeout(off);g.classList.add("on");if(!f)f=requestAnimationFrame(paint)};
  addEventListener("pointerdown",mv,{passive:true});
  addEventListener("pointermove",e=>{if(g.classList.contains("on"))mv(e)},{passive:true});
  const up=()=>{off=setTimeout(()=>g.classList.remove("on"),90)};
  addEventListener("pointerup",up,{passive:true});addEventListener("pointercancel",up,{passive:true});
})();
