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
  getComputedTextLength(){return (this.textContent||'').length*12;}
  getBBox(){return {height:24};}
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
const focused=container.children[0].children[4].children;
assert.equal(focused.map(node=>node.textContent).join(' '),'twelve o’clock precisely');
assert.equal(container.children.length,1,'No duplicate caption below the rings');
display.resize(360,640);
const viewbox=container.children[0].attributes.viewBox.split(' ').map(Number);
assert.equal(viewbox[0],65,'Left portion of the circles is cropped');
assert(Math.abs(viewbox[3]/viewbox[2]-640/360)<1e-9,'Frame follows the viewport aspect ratio');
const before=container.children[0].attributes.viewBox;
const radii=focused.map(node=>Number(node.attributes.x));
// Reproduce 2:09 -> 2:10, then inspect every minute. No short hour/minute
// may collapse the bands needed by longer, dimmed words on the same ring.
for(const minute of [9,10,...Array.from({length:60},(_,i)=>i)]){
  display.update(circle.time(2,minute,15));
  assert.deepEqual(focused.map(node=>Number(node.attributes.x)),radii,'Ring positions must not depend on the selected word');
  assert.equal(container.children[0].attributes.viewBox,before,'Minute changes do not change the zoom');
}
for(let i=0;i<3;i++){
  const labels=container.children[0].children[i+1].children.map(spoke=>spoke.children[0]);
  const radius=radii[i];
  assert(2*radius*Math.sin(Math.PI/labels.length)>=30-1e-9,'Adjacent spokes have enough text-height clearance');
  if(i<2)for(const label of labels){
    const outer=Math.hypot(radius+label.getComputedTextLength(),12);
    assert(outer<radii[i+1],'Dim words must remain inside their own radial band');
  }
}
display.update(circle.time(0,0,0));
for(let second=1;second<60;second++){
  display.update(circle.time(0,0,second));
  assert.equal(container.children[0].attributes.viewBox,before,'Seconds do not change zoom');
  const last=focused[2];assert(Number(last.attributes.x)+last.getComputedTextLength()<viewbox[0]+viewbox[2],'Longest second remains visible');
}
reduced=true;display.update(circle.time(0,0,1));assert.equal(second.style.transition,'none');
display.destroy();assert.equal(container.children.length,0);
console.log('Circular: all 172,800 time/settings combinations, ring rollovers, highlights, and reduced motion passed.');
