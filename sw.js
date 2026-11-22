const CACHE='word-clock-v1.0.0';
const ASSETS=['./','./index.html','./styles.css','./clock.js','./app.js','./manifest.webmanifest','./icon.svg','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('word-clock-')&&key!==CACHE).map(key=>caches.delete(key))))));
self.addEventListener('message',event=>{if(event.data==='ACTIVATE_UPDATE')self.skipWaiting();});
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.pathname.startsWith(new URL(self.registration.scope).pathname))return;
  event.respondWith(caches.open(CACHE).then(async cache=>{
    if(event.request.mode==='navigate'){try{return await fetch(event.request);}catch{return await cache.match('./index.html');}}
    return await cache.match(event.request)||fetch(event.request);
  }));
});
