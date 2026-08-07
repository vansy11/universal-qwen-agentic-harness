const fs=require('fs'),path=require('path');
const QH=path.resolve(__dirname,'..');
const base=['Here is','Certainly!','As an AI','In conclusion','Berikut adalah','Tentu saja','Dengan senang hati','Great question'];
const freq={};
try{
  fs.readFileSync(QH+'/evolution/violations.jsonl','utf8').trim().split('\n').forEach(l=>{
    try{const r=JSON.parse(l);(r.slop||[]).forEach(s=>freq[s]=(freq[s]||0)+1);}catch(e){}
  });
}catch(e){}
const learned=Object.keys(freq).filter(k=>freq[k]>=2 && !base.includes(k));
fs.writeFileSync(QH+'/evolution/learned-slop.json',JSON.stringify(learned),'utf8');
console.log('learned-slop updated:',learned.length);