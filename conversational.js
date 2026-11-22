/* Conversational Word Clock: calm, minute-based casual and exact phrases. */
(function(root){
  const small=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
  function number(n){return n<20?small[n]:'twenty'+(n%10?'-'+small[n%10]:'');}
  function time(hour,minute,wording='casual'){
    // A five-minute mark is exact; the next minute is just after it.
    // From two minutes after, look ahead to the next mark: 2:27 is nearly 2:30.
    const casual=wording==='casual',target=casual?Math.floor((minute+3)/5)*5:minute;
    const offset=minute-target,qualifier=casual&&offset!==0?(offset>0?'just after':'nearly'):'';
    const h=(hour+(target>30?1:0))%12||12;
    let lines;
    if(target===0||target===60){lines=[small[h],'o’clock'];}
    else{
      const n=target>30?60-target:target,relation=target>30?'to':'past';
      if(n===15)lines=['quarter '+relation,small[h]];
      else if(n===30)lines=['half past',small[h]];
      else if(casual)lines=[number(n)+' '+relation,small[h]];
      else lines=[number(n),(n===1?'minute ':'minutes ')+relation,small[h]];
    }
    if(qualifier)lines.unshift(qualifier);
    return {lines,phrase:lines.join(' '),offset,referenceMinute:target};
  }
  const api={time};if(typeof module!=='undefined')module.exports=api;else root.ConversationalClock=api;
})(globalThis);
