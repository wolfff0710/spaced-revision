const V="rev-v22";
const SHELL=["./","index.html","styles.css","app.js","timer.html","timer.css","timer.js","manifest.webmanifest","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=="GET"||u.hostname.endsWith("supabase.co")||u.protocol.indexOf("http")!==0)return;
  e.respondWith((async()=>{
    const c=await caches.open(V),cached=await c.match(r,{ignoreSearch:true});
    const net=fetch(r).then(res=>{if(res.ok||res.type==="opaque")c.put(r,res.clone());return res});
    if(!cached)return net.catch(()=>r.mode==="navigate"?c.match("index.html"):Response.error());
    return Promise.race([net,new Promise(s=>setTimeout(()=>s(cached),4000))]).catch(()=>cached);
  })());
});
