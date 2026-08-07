const {execSync}=require('child_process'),fs=require('fs'),path=require('path');
const QH=path.resolve(__dirname,'..');
const cases=JSON.parse(fs.readFileSync(QH+'/evals/cases.json','utf8'));
let pass=0;
for(const cs of cases){
  try{
    const out=execSync(`node "${QH}/hooks/prompt-router.js"`,{input:JSON.stringify({prompt:cs.prompt}),timeout:15000}).toString();
    const ok=out.includes(cs.expect);
    if(ok)pass++;
    console.log((ok?'PASS':'FAIL')+' | '+cs.prompt+' -> '+cs.expect);
  }catch(e){console.log('FAIL | '+cs.prompt+' (error)');}
}
console.log(`\nRouting precision: ${pass}/${cases.length} (${Math.round(pass/cases.length*100)}%)`);