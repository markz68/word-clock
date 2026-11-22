/* Letter Grid v1.1.0. Positions are fixed so the face never shifts as time changes. */
(function(root){
  const rows=['ITLISASTIME','ACQUARTERDC','TWENTYFIVEX','HALFBTENFTO','PASTERUNINE','ONESIXTHREE','FOURFIVETWO','EIGHTELEVEN','SEVENTWELVE','TENSEOCLOCK'];
  const words={it:[0,0,2],is:[0,3,2],quarter:[1,2,7],twenty:[2,0,6],five:[2,6,4],half:[3,0,4],ten:[3,5,3],to:[3,9,2],past:[4,0,4],h9:[4,7,4],h1:[5,0,3],h6:[5,3,3],h3:[5,6,5],h4:[6,0,4],h5:[6,4,4],h2:[6,8,3],h8:[7,0,5],h11:[7,5,6],h7:[8,0,5],h12:[8,5,6],h10:[9,0,3],oclock:[9,5,6]};
  const hours=['','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'];
  function time(hour,minute){
    const step=Math.floor(minute/5),dots=minute%5,h=(hour+(step>6?1:0))%12||12;
    const minuteWords=[[],['five'],['ten'],['quarter'],['twenty'],['twenty','five'],['half'],['twenty','five'],['twenty'],['quarter'],['ten'],['five']][step];
    const relation=step===0?[]:[step<=6?'past':'to'];
    const keys=['it','is',...minuteWords,...relation,'h'+h,...(step===0?['oclock']:[])];
    const cells=[];
    for(const key of keys){const [row,col,length]=words[key];for(let n=0;n<length;n++)cells.push(row*11+col+n);}
    const phrase='It is '+[...minuteWords,...relation,hours[h],...(step===0?['o’clock']:[])].join(' ')+(dots?' plus '+dots+' extra minute'+(dots===1?'':'s'):'')+'.';
    return {keys,cells,dots,phrase,hour:h,baseMinute:step*5};
  }
  const api={rows,words,time};
  if(typeof module!=='undefined')module.exports=api;else root.LetterGrid=api;
})(globalThis);
