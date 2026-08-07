let input='';process.stdin.on('data',c=>input+=c);process.stdin.on('end',()=>{
 try{
  const p=JSON.parse(input);
  const text=p.message||p.content||'';
  
  // Detect if the parent is trying to echo or introduce the sub-agent's result
  const isParentEcho = /Here is the result from|The sub-agent has completed|Based on the sub-agent|I have delegated the task|The agent has returned/i.test(text);
  const isShortFiller = text.trim().length < 50 && /Waiting|Processing|Delegating|Stand by/i.test(text);
  
  if(isParentEcho || isShortFiller){
   // Suppress the parent's unnecessary output
   console.log(JSON.stringify({
    hookSpecificOutput:{hookEventName:'MessageDisplay',message:''}
   }));
  }else{
   console.log(JSON.stringify({}));
  }
 }catch(e){
  console.log(JSON.stringify({}));
 }
});