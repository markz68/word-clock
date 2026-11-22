/* Circular Word Clock: radial word rings, selected words aligned at three o’clock. */
(function(root){
  const small=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
  function number(n){return n<20?small[n]:['','','twenty','thirty','forty','fifty'][Math.floor(n/10)]+(n%10?'-'+small[n%10]:'');}
  function definitions(seconds=true){
    const rings=[{id:'hour',radius:65,words:Array.from({length:12},(_,i)=>number(i+1))},{id:'minute',radius:195,words:Array.from({length:60},(_,i)=>i===0?'o’clock':i<10?'oh '+number(i):number(i))}];
    if(seconds)rings.push({id:'second',radius:365,words:Array.from({length:60},(_,i)=>i===0?'precisely':'and '+number(i)+(i===1?' second':' seconds'))});
    return rings;
  }
  function time(hour,minute,second,seconds=true){
    const indexes=[(hour%12||12)-1,minute,...(seconds?[second]:[])];
    const rings=definitions(seconds);
    return {indexes,phrase:rings.map((ring,i)=>ring.words[indexes[i]]).join(' ')};
  }
  function advance(previous,index,count){return previous===null?-index*360/count:previous-((index-((-Math.round(previous/(360/count)))%count+count)%count+count)%count)*360/count;}
  function create(container,seconds){
    const ns='http://www.w3.org/2000/svg';
    const make=(tag,attrs={})=>{const node=document.createElementNS(ns,tag);for(const [key,value]of Object.entries(attrs))node.setAttribute(key,value);return node;};
    const extent=seconds?560:340;
    const svg=make('svg',{viewBox:`${-extent} ${-extent} ${extent*2} ${extent*2}`,class:'circular-dial'});
    const track=make('line',{x1:40,y1:0,x2:extent-10,y2:0,class:'circular-track'});svg.append(track);
    const rings=definitions(seconds).map(def=>{
      const group=make('g',{class:'circular-ring','data-ring':def.id});
      const labels=def.words.map((word,i)=>{
        const spoke=make('g',{transform:`rotate(${i*360/def.words.length})`});
        const label=make('text',{x:def.radius,y:0,'dominant-baseline':'middle','data-index':i});label.textContent=word;spoke.append(label);group.append(spoke);return label;
      });
      svg.append(group);return {...def,group,labels,angle:null,index:null};
    });
    const caption=document.createElement('div');caption.className='circular-caption';
    container.append(svg,caption);
    return {
      update(result,animate=true){
        rings.forEach((ring,i)=>{
          const index=result.indexes[i];if(index===ring.index)return;
          const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
          ring.group.style.transition=animate&&!reduced?'transform 450ms cubic-bezier(.2,.65,.25,1)':'none';
          ring.angle=animate?advance(ring.angle,index,ring.words.length):-index*360/ring.words.length;
          ring.group.style.transform=`rotate(${ring.angle}deg)`;
          if(ring.index!==null)ring.labels[ring.index].classList.remove('lit');ring.labels[index].classList.add('lit');ring.index=index;
        });
        caption.textContent=result.phrase;
      },
      destroy(){container.replaceChildren();}
    };
  }
  const api={definitions,time,advance,create};if(typeof module!=='undefined')module.exports=api;else root.CircularClock=api;
})(globalThis);
