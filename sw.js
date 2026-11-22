const CACHE='word-clock-v1.2.2';
const ENTRY='./index.html?v=1.2.2';
const ASSETS=[ENTRY,'./styles.css?v=1.2.2','./clock.js?v=1.2.2','./grid.js?v=1.2.2','./flip.js?v=1.2.2','./app.js?v=1.2.2','./manifest.webmanifest','./icon.svg','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-512.png'];
self.addEventListener('install',event=>event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);await cache.addAll(ASSETS);
  const page=await cache.match(ENTRY);
  if(!page||(await page.text()).indexOf('v1.2.2')===-1)throw new Error('Release page is not available yet');
})()));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('word-clock-')&&key!==CACHE).map(key=>caches.delete(key))))));
self.addEventListener('message',event=>{if(event.data==='ACTIVATE_UPDATE')self.skipWaiting();});
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.pathname.startsWith(new URL(self.registration.scope).pathname))return;
  event.respondWith(caches.open(CACHE).then(async cache=>{
    if(event.request.mode==='navigate')return await cache.match(ENTRY)||fetch(event.request);
    return await cache.match(event.request)||fetch(event.request);
  }));
});
