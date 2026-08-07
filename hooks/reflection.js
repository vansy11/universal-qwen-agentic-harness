let input='';process.stdin.on('data',c=>input+=c);process.stdin.on('end',()=>{
 try{
  const fs=require('fs'),path=require('path');
  const QH=path.resolve(__dirname,'..');
  const p=JSON.parse(input); const text=JSON.stringify(p.transcript||p);
  const slop=['Here is','Certainly!','As an AI','In conclusion','Berikut adalah','Tentu saja','Dengan senang hati','Great question'];
  const halluc=[/studies show/i,/experts say/i,/research indicates/i,/according to (a |the )?(study|report)/i];
  const foundSlop=slop.filter(s=>text.includes(s));
  const foundHall=halluc.filter(r=>r.test(text)).map(r=>r.source);
  const hasCitation=/https?:\/\/|Sources:/i.test(text);
  const rawDump=/Detailed Results:|"search_results":\s*\[/i.test(text);
  const rec={ts:new Date().toISOString(),slop:foundSlop,halluc:foundHall,citations:hasCitation,rawDump};
  fs.appendFileSync(QH+'/evolution/violations.jsonl',JSON.stringify(rec)+'\n','utf8');
  console.log(JSON.stringify({}));
 }catch(e){console.log(JSON.stringify({}));}
});