let input='';process.stdin.on('data',c=>input+=c);process.stdin.on('end',()=>{
 try{
  const p=JSON.parse(input);
  let prompt=p.prompt||'';
  
  const patterns=[
   /●︎ Background agent "[^"]+" failed\.\n?/gi,
   /x brave_web_search[\s\S]*?(?=\n\n|◆|●|$)/gi,
   /x tavily_search[\s\S]*?(?=\n\n|◆|●|$)/gi,
   /MCP tool '[^']+' reported[\s\S]*?(?=\n\n|$)/gi,
   /Blocked by auto mode policy:[\s\S]*?(?=\n\n|$)/gi,
   /Error: Brave API error:[\s\S]*?(?=\n\n|$)/gi,
   /SUBSCRIPTION_TOKEN_INVALID[\s\S]*?(?=\n\n|$)/gi,
   /●︎ Ran \d+ stop hooks[\s\S]*?(?=◆|●|$)/gi,
   /Tool "[^"]+" not found in registry[\s\S]*?(?=\n\n|$)/gi,
   /✓ Shell node -e "[\s\S]*?"[\s\S]*?(?=\n\n|✓|✗|$)/gi,
   /agent-[\w-]+-[\w]+\.jsonl/gi,
   /agent-[\w-]+-[\w]+\.meta\.json/gi,
   /... first \d+ lines hidden .../gi,
   /Press ctrl-s to show more lines/gi
  ];
  
  patterns.forEach(pat=>{prompt=prompt.replace(pat,'');});
  prompt=prompt.replace(/[─━]{10,}/g,'');
  prompt=prompt.replace(/\n{4,}/g,'\n\n');
  
  console.log(JSON.stringify({
   hookSpecificOutput:{hookEventName:'UserPromptSubmit',prompt:prompt.trim()}
  }));
 }catch(e){
  console.log(JSON.stringify({}));
 }
});