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
    const svg=make('svg',{class:'circular-dial'});
    const track=make('line',{x1:40,y1:0,x2:600,y2:0,class:'circular-track'});svg.append(track);
    const rings=definitions(seconds).map(def=>{
      const group=make('g',{class:'circular-ring','data-ring':def.id});
      const labels=def.words.map((word,i)=>{
        const spoke=make('g',{transform:`rotate(${i*360/def.words.length})`});
        const label=make('text',{x:def.radius,y:0,'dominant-baseline':'middle','data-index':i});label.textContent=word;spoke.append(label);group.append(spoke);return label;
      });
      svg.append(group);return {...def,group,labels,angle:null,index:null};
    });
    // Keep the bright words stationary while the dim rings rotate behind them.
    const focus=make('g',{class:'circular-focus'});
    const focused=rings.map(ring=>{const label=make('text',{x:ring.radius,y:0,'dominant-baseline':'middle','data-focus':ring.id});focus.append(label);return label;});
    svg.append(focus);container.append(svg);
    const length=node=>Math.ceil(node.getComputedTextLength()*1.04);
    const maxima=rings.map(ring=>Math.max(...ring.labels.map(length))*1.15);
    const heights=rings.map(ring=>Math.max(...ring.labels.map(node=>node.getBBox().height)));
    let viewport={width:800,height:500},contentWidth=600,framed=false;
    function frame(){
      // Crop the left and outer portions of the circles. The whole phrase stays
      // inside the viewport, with enough room for the longest seconds value.
      const width=Math.max(contentWidth,viewport.width/2.5);
      const height=width*viewport.height/viewport.width;
      svg.setAttribute('viewBox',`65 ${-height/2} ${width} ${height}`);
    }
    return {
      resize(width,height){viewport={width:Math.max(1,width),height:Math.max(1,height)};frame();},
      update(result,animate=true){
        rings.forEach((ring,i)=>{
          const index=result.indexes[i];if(index===ring.index)return;
          const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
          ring.group.style.transition=animate&&!reduced?'transform 450ms cubic-bezier(.2,.65,.25,1)':'none';
          ring.angle=animate?advance(ring.angle,index,ring.words.length):-index*360/ring.words.length;
          ring.group.style.transform=`rotate(${ring.angle}deg)`;
          if(ring.index!==null)ring.labels[ring.index].classList.remove('lit');ring.labels[index].classList.add('lit');ring.index=index;
        });
        focused.forEach((label,i)=>{label.textContent=rings[i].words[result.indexes[i]];});
        // Reserve an entire radial band for every ring's longest word, not
        // just the current value. Also leave vertical room between spokes.
        // Fixed spacing prevents short values such as "ten" collapsing a band.
        if(!framed){
          framed=true;let radius=110;
          rings.forEach((ring,i)=>{
            radius=Math.max(radius,(heights[i]+6)/(2*Math.sin(Math.PI/ring.words.length)));
            ring.labels.forEach(label=>label.setAttribute('x',radius));focused[i].setAttribute('x',radius);
            radius+=maxima[i]+16;
          });
          contentWidth=radius-65+24;frame();
        }
      },
      destroy(){container.replaceChildren();}
    };
  }
  const api={definitions,time,advance,create};if(typeof module!=='undefined')module.exports=api;else root.CircularClock=api;
})(globalThis);
