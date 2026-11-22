/* Word Clock v1.0.0: pure time-to-word conversion, shared by the app and tests. */
(function(root){
  const small=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
  const tens=['twenty','thirty','forty','fifty'];
  function numberKeys(n,prefix){return n<20?[prefix+n]:[prefix+(Math.floor(n/10)*10),...(n%10?[prefix+n%10]:[])];}
  function vocabulary(showSeconds=true){
    const tokens=[];
    const add=(id,text)=>tokens.push({id,text});
    for(let h=1;h<=12;h++)add('h'+h,small[h][0].toUpperCase()+small[h].slice(1));
    add('oclock','o’clock');add('oh','oh');
    function numbers(p){tens.forEach((t,i)=>add(p+(i+2)*10,t));for(let n=10;n<20;n++)add(p+n,small[n]);for(let n=1;n<=9;n++)add(p+n,small[n]);}
    numbers('m');
    if(showSeconds){add('and','and');add('precisely','precisely');numbers('s');add('second','second');add('seconds','seconds');}
    return tokens;
  }
  function activeKeys(hour,minute,second,showSeconds=true){
    const keys=['h'+(hour%12||12)];
    if(minute===0)keys.push('oclock');else{if(minute<10)keys.push('oh');keys.push(...numberKeys(minute,'m'));}
    if(showSeconds){if(second===0)keys.push('precisely');else keys.push('and',...numberKeys(second,'s'),second===1?'second':'seconds');}
    return keys;
  }
  const api={vocabulary,activeKeys};
  if(typeof module!=='undefined')module.exports=api;else root.WordClock=api;
})(globalThis);
