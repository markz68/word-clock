const assert=require('node:assert/strict');
const flip=require('../flip.js');
const small=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
function decode(word){const direct=small.indexOf(word);if(direct>=0)return direct;const [tens,ones]=word.split('-');return {twenty:20,thirty:30,forty:40,fifty:50}[tens]+(ones?small.indexOf(ones):0);}
for(let h=0;h<24;h++)for(let m=0;m<60;m++)for(let s=0;s<60;s++)for(const seconds of [false,true]){
  const result=flip.time(h,m,s,seconds);
  assert.equal(result.parts.length,seconds?3:2);
  assert.equal(decode(result.parts[0].value),h%12||12);
  assert.equal(result.parts[1].value==='o’clock'?0:decode(result.parts[1].value.replace('oh ','')),m);
  assert.equal(result.parts[1].value.startsWith('oh '),m>0&&m<10);
  if(seconds){assert.equal(decode(result.parts[2].value),s);assert(result.phrase.endsWith(s===1?' second.':' seconds.'));}
  else assert(!result.phrase.includes('second'));
}

// Exercise actual renderer changes, including interrupted animations and cleanup.
class Element{
  constructor(){this.children=[];this.dataset={};this.textContent='';this.classes=new Set();this.classList={add:n=>this.classes.add(n),remove:n=>this.classes.delete(n)};}
  append(...nodes){this.children.push(...nodes);}
  replaceChildren(...nodes){this.children=nodes;}
}
global.document={createElement:()=>new Element()};
let reduced=false;
global.matchMedia=()=>({matches:reduced});
const timers=new Map();let timerId=0;
global.setTimeout=fn=>{timers.set(++timerId,fn);return timerId;};
global.clearTimeout=id=>timers.delete(id);
function finish(){const callbacks=[...timers.values()];timers.clear();callbacks.forEach(fn=>fn());}
const container=new Element(),renderer=flip.create(container,true);
const cards=container.children.map(unit=>unit.children[1]);
renderer.update(flip.time(11,59,59),false);
assert(cards.every(card=>!card.classes.has('turning')));
renderer.update(flip.time(12,0,0));
assert(cards.every(card=>card.classes.has('turning')));
finish();assert(cards.every(card=>!card.classes.has('turning')));
assert.equal(cards[0].children[1].children[0].textContent,'twelve');
renderer.update(flip.time(12,0,1));
assert(!cards[0].classes.has('turning'));assert(!cards[1].classes.has('turning'));assert(cards[2].classes.has('turning'));
renderer.update(flip.time(12,0,2));finish();
assert.equal(cards[2].children[1].children[0].textContent,'two');
reduced=true;renderer.update(flip.time(12,0,3));assert(!cards[2].classes.has('turning'));assert.equal(cards[2].children[1].children[0].textContent,'three');
renderer.destroy();assert.equal(container.children.length,0);assert.equal(timers.size,0);
const twoPanels=flip.create(container,false);assert.equal(container.children.length,2);twoPanels.destroy();
console.log('Word Flip: all 172,800 time/settings combinations and renderer transitions passed.');
