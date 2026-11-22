/* Word Flip v1.2.1: word values and split-flap cards. */
(function(root){
  const numbers=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
  function number(n){return n<20?numbers[n]:['','','twenty','thirty','forty','fifty'][Math.floor(n/10)]+(n%10?'-'+numbers[n%10]:'');}
  function time(hour,minute,second,seconds=true){
    const parts=[{id:'hour',label:'Hour',value:number(hour%12||12)},{id:'minute',label:'Minute',value:minute===0?'o’clock':minute<10?'oh '+number(minute):number(minute)}];
    if(seconds)parts.push({id:'second',label:'Second',value:number(second)});
    return {parts,phrase:'It is '+parts[0].value+' '+parts[1].value+(seconds?' and '+parts[2].value+(second===1?' second':' seconds'):'')+'.'};
  }
  function create(container,seconds){
    const cards=new Map();
    for(const {id,label} of time(0,0,0,seconds).parts){
      const unit=document.createElement('div');unit.className='flip-unit';
      const title=document.createElement('div');title.className='flip-label';title.textContent=label;
      const card=document.createElement('div');card.className='flip-card';card.dataset.unit=id;
      const faces={};
      for(const [name,position]of [['top','top'],['bottom','bottom'],['outgoing','top'],['incoming','bottom']]){
        const half=document.createElement('div');half.className='flip-half '+position+' '+name;
        const word=document.createElement('span');word.className='flip-word';half.append(word);card.append(half);faces[name]=word;
      }
      unit.append(title,card);container.append(unit);cards.set(id,{card,faces,value:null,timer:null});
    }
    function update(result,animate=true){
      for(const part of result.parts){
        const state=cards.get(part.id);if(state.value===part.value)continue;
        clearTimeout(state.timer);state.card.classList.remove('turning');
        const old=state.value;state.value=part.value;
        state.faces.top.textContent=part.value;state.faces.outgoing.textContent=old??part.value;state.faces.incoming.textContent=part.value;
        if(animate&&old!==null&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
          state.faces.bottom.textContent=old;
          void state.card.offsetWidth;
          state.card.classList.add('turning');
          state.timer=setTimeout(()=>{state.faces.bottom.textContent=part.value;state.card.classList.remove('turning');},480);
        }else{state.faces.bottom.textContent=part.value;}
      }
    }
    return {update,destroy(){for(const state of cards.values())clearTimeout(state.timer);container.replaceChildren();}};
  }
  const api={time,create};if(typeof module!=='undefined')module.exports=api;else root.WordFlip=api;
})(globalThis);
