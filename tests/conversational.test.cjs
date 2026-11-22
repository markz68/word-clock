const assert=require('node:assert/strict');
const clock=require('../conversational.js');
const small=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
function number(word){return word.startsWith('twenty')?20+(word.includes('-')?small.indexOf(word.split('-')[1]):0):small.indexOf(word);}
function decode(phrase){
  phrase=phrase.replace(/^(nearly|just after) /,'');
  if(phrase.endsWith(' o’clock'))return number(phrase.replace(' o’clock',''))%12*60;
  const match=phrase.match(/^(.+?)(?: minutes?)? (past|to) (.+)$/);
  assert(match,phrase);
  const amount=match[1]==='quarter'?15:match[1]==='half'?30:number(match[1]);
  assert(amount>0&&amount<=30,phrase);
  return (number(match[3])%12*60+(match[2]==='past'?amount:-amount)+720)%720;
}
for(let h=0;h<24;h++)for(let m=0;m<60;m++)for(const style of ['casual','exact']){
  const result=clock.time(h,m,style),represented=decode(result.phrase),actual=h%12*60+m;
  const difference=((actual-represented+360)%720+720)%720-360;
  assert(result.lines.length>=2&&result.lines.length<=3);
  assert(result.lines.every(line=>line.length>0));
  assert(!result.phrase.includes('zero'));
  if(style==='exact'){
    assert.equal(difference,0,`${h}:${m} ${result.phrase}`);
    assert(!/^(nearly|just after)/.test(result.phrase));
  }else{
    assert(difference>=-3&&difference<=1,`${h}:${m} ${result.phrase}`);
    assert.equal(difference,result.offset);
    assert.equal(result.phrase.startsWith('nearly '),difference<0);
    assert.equal(result.phrase.startsWith('just after '),difference>0);
  }
}
assert.equal(clock.time(14,27).phrase,'nearly half past two');
assert.deepEqual(clock.time(14,27).lines,['nearly','half past','two']);
assert.equal(clock.time(14,23,'exact').phrase,'twenty-three minutes past two');
assert.equal(clock.time(14,1,'exact').phrase,'one minute past two');
assert.equal(clock.time(14,59,'exact').phrase,'one minute to three');
assert.equal(clock.time(23,59).phrase,'nearly twelve o’clock');
assert.equal(clock.time(0,0).phrase,'twelve o’clock');
assert.equal(clock.time(12,0,'exact').phrase,'twelve o’clock');
console.log('Conversational: all 2,880 daily minute/wording combinations passed, including noon, midnight, and hour boundaries.');
