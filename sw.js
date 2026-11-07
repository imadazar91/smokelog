const C='smokelog-v1';
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html'])).catch(()=>{}));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(r=>{
    const net=fetch(e.request).then(res=>{
      const cp=res.clone();
      caches.open(C).then(c=>c.put(e.request,cp));
      return res;
    }).catch(()=>r);
    return r||net;
  }));
});
