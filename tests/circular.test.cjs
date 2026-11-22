const assert=require('node:assert/strict');
const circle=require('../circular.js');
const flip=require('../flip.js');
for(const seconds of [true,false]){
  const rings=circle.definitions(seconds);assert.equal(rings.length,seconds?3:2);
  assert.deepEqual(rings.map(r=>r.words.length),seconds?[12,60,60]:[12,60]);
  for(let h=0;h<24;h++)for(let m=0;m<60;m++)for(let s=0;s<60;s++){
    const time=circle.time(h,m,s,seconds),parts=flip.time(h,m,s,seconds).parts;
    const expected=parts[0].value+' '+parts[1].value+(seconds?(s===0?' precisely':' and '+parts[2].value+(s===1?' second':' seconds')):'');
    assert.equal(time.phrase,expected);
    assert.equal(time.indexes[0],(h%12||12)-1);
    assert.equal(time.indexes[1],m);if(seconds)assert.equal(time.indexes[2],s);
  }
}
for(const count of [12,60]){
  let angle=null;
  for(let index=0;index<count*4;index++){
    const next=circle.advance(angle,index%count,count);
    if(angle!==null)assert(Math.abs(next-angle+360/count)<1e-7,'Rollover should advance one step');
    assert(Math.abs(((index%count*360/count+next)%360+360)%360)<1e-7);
    angle=next;
  }
}
class Node{
  constructor(){this.children=[];this.style={};this.attributes={};this.classes=new Set();this.classList={add:n=>this.classes.add(n),remove:n=>this.classes.delete(n)};}
  setAttribute(k,v){this.attributes[k]=v;}
  append(...nodes){this.children.push(...nodes);}
  replaceChildren(...nodes){this.children=nodes;}
}
global.document={createElement:()=>new Node(),createElementNS:()=>new Node()};
let reduced=false;global.matchMedia=()=>({matches:reduced});
const container=new Node(),display=circle.create(container,true);
display.update(circle.time(23,59,59),false);
const second=container.children[0].children[3];assert.equal(second.style.transform,'rotate(-354deg)');
display.update(circle.time(0,0,0));assert.equal(second.style.transform,'rotate(-360deg)');
assert(second.children[0].children[0].classes.has('lit'));
assert(!second.children[59].children[0].classes.has('lit'));
assert.equal(container.children[1].textContent,'twelve o’clock precisely');
reduced=true;display.update(circle.time(0,0,1));assert.equal(second.style.transition,'none');
display.destroy();assert.equal(container.children.length,0);
console.log('Circular: all 172,800 time/settings combinations, ring rollovers, highlights, and reduced motion passed.');
