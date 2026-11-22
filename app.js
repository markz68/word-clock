'use strict';
const $=id=>document.getElementById(id);
const colors={white:'#ffffff',amber:'#ffc36b',mint:'#99e2bb',blue:'#9bcaff',rose:'#f4acc8'};
let preferences={seconds:true,color:'white',dim:43,awake:false};
try{const saved=JSON.parse(localStorage.getItem('word-clock.preferences'));if(saved){if(typeof saved.seconds==='boolean')preferences.seconds=saved.seconds;if(colors[saved.color])preferences.color=saved.color;if(Number.isFinite(saved.dim))preferences.dim=Math.min(65,Math.max(25,saved.dim));if(typeof saved.awake==='boolean')preferences.awake=saved.awake;}}catch{}
let nodes=new Map(),lastPhrase='',wakeLock=null,installPrompt=null,registration=null,fitFrame=0;
function status(message){$('status').textContent=message;}
function save(){try{localStorage.setItem('word-clock.preferences',JSON.stringify(preferences));}catch{status('Preferences could not be saved in this browser.');}}
function fit(){
  cancelAnimationFrame(fitFrame);fitFrame=requestAnimationFrame(()=>{
    const stage=$('stage'),words=$('words'),style=getComputedStyle(stage);
    const available=stage.clientHeight-parseFloat(style.paddingTop)-parseFloat(style.paddingBottom);
    let low=1,high=180;
    for(let i=0;i<13;i++){const mid=(low+high)/2;words.style.fontSize=mid+'px';if(words.getBoundingClientRect().height<=available&&words.scrollWidth<=words.clientWidth+1)low=mid;else high=mid;}
    words.style.fontSize=(Math.floor(low*10)/10)+'px';
  });
}
function tick(){
  const now=new Date(),keys=WordClock.activeKeys(now.getHours(),now.getMinutes(),now.getSeconds(),preferences.seconds),active=new Set(keys);
  const phrase=keys.join(',');if(phrase===lastPhrase)return;lastPhrase=phrase;
  for(const [key,node]of nodes)node.classList.toggle('lit',active.has(key));
  $('readable').textContent='It is '+keys.map(key=>nodes.get(key).textContent).join(' ')+'.';
}
function render(){
  document.documentElement.style.setProperty('--active',colors[preferences.color]);document.documentElement.style.setProperty('--dim',preferences.dim+'%');
  $('seconds').checked=preferences.seconds;$('color').value=preferences.color;$('dim').value=preferences.dim;$('awake').checked=preferences.awake;
  nodes=new Map();const fragment=document.createDocumentFragment();
  WordClock.vocabulary(preferences.seconds).forEach(({id,text},i)=>{if(i)fragment.append(' ');const span=document.createElement('span');span.textContent=text;span.dataset.word=id;nodes.set(id,span);fragment.append(span);});
  $('words').replaceChildren(fragment);lastPhrase='';tick();fit();
}
async function updateWakeLock(){
  if(!('wakeLock'in navigator)){$('awake').disabled=true;$('awake-help').textContent='Not supported by this browser';return;}
  if(!preferences.awake||document.visibilityState!=='visible'){if(wakeLock){await wakeLock.release();wakeLock=null;}return;}
  if(wakeLock)return;
  try{wakeLock=await navigator.wakeLock.request('screen');wakeLock.addEventListener('release',()=>{wakeLock=null;});$('awake-help').textContent='Screen stays awake while the clock is visible';}catch{$('awake-help').textContent='Unavailable right now. Your device may still sleep.';}
}
$('settings-open').addEventListener('click',()=>{$('settings').showModal();});
for(const key of ['seconds','color','dim'])$(key).addEventListener(key==='dim'?'input':'change',()=>{preferences[key]=key==='seconds'?$(key).checked:key==='dim'?Number($(key).value):$(key).value;save();render();});
$('awake').addEventListener('change',()=>{preferences.awake=$('awake').checked;save();updateWakeLock();});
if(!document.fullscreenEnabled){$('fullscreen').hidden=true;}
$('fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();$('settings').close();}catch{status('Fullscreen is unavailable in this browser.');}});
document.addEventListener('fullscreenchange',()=>{$('fullscreen').textContent=document.fullscreenElement?'Exit fullscreen':'Enter fullscreen';fit();});
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;$('install').hidden=false;});
$('install').addEventListener('click',async()=>{if(!installPrompt)return;await installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$('install').hidden=true;});
window.addEventListener('appinstalled',()=>{$('install').hidden=true;status('Word Clock is installed.');});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){tick();fit();}updateWakeLock();});
window.addEventListener('resize',fit);new ResizeObserver(fit).observe($('stage'));
function schedule(){tick();setTimeout(schedule,1000-Date.now()%1000+15);}
render();schedule();updateWakeLock();
if('serviceWorker'in navigator){
  window.addEventListener('load',async()=>{try{
    registration=await navigator.serviceWorker.register('./sw.js');
    const showUpdate=()=>{if(registration.waiting&&navigator.serviceWorker.controller){$('update').hidden=false;$('settings-open').title='Settings · Update available';}};
    showUpdate();registration.addEventListener('updatefound',()=>{const worker=registration.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed')showUpdate();});});
  }catch{status('Offline setup could not finish. Connect to the internet and reopen the clock to retry.');}});
  let refreshing=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(refreshing)return;refreshing=true;location.reload();});
  $('update').addEventListener('click',()=>registration?.waiting?.postMessage('ACTIVATE_UPDATE'));
}
