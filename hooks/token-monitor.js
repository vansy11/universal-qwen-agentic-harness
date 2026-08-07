let input='';process.stdin.on('data',c=>input+=c);process.stdin.on('end',()=>{
 try{
  const p=JSON.parse(input);
  const fs=require('fs');
  const path=require('path');
  
  // Get context info (simplified - actual implementation needs Qwen API)
  const logFile=path.join(__dirname,'../tmp/token-usage.json');
  let usage={sessions:0,totalTokens:0};
  try{usage=JSON.parse(fs.readFileSync(logFile,'utf8'));}catch(e){}
  
  usage.sessions++;
  usage.totalTokens+=JSON.stringify(p).length/4; // rough estimate
  usage.lastUpdate=new Date().toISOString();
  
  fs.writeFileSync(logFile,JSON.stringify(usage,null,2),'utf8');
  
  // Warn if high usage (simplified threshold)
  if(usage.totalTokens>800000){
   console.log(JSON.stringify({
    hookSpecificOutput:{
     hookEventName:'PostToolUse',
     message:'⚠ Context usage high (>80%). Consider /compact or start new session.'
    }
   }));
  }else{
   console.log(JSON.stringify({}));
  }
 }catch(e){
  console.log(JSON.stringify({}));
 }
});