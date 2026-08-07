let input='';process.stdin.on('data',c=>input+=c);process.stdin.on('end',()=>{
 try{
  const p=JSON.parse(input);
  let text=p.message||p.content||'';

  // Strip raw JSON tool call dumps
  text=text.replace(/\{[\s\S]*?"name":\s*"(agent|tavily_search|brave_web_search|web_search)"[\s\S]*?\}/gi, '');
  
  // 1. Strip TUI artifacts (symbols + tool calls logs)
  text=text.replace(/^[✓✗●︎◆︎►▸▶]\s+.+$/gm,'');
  text=text.replace(/✓ Agent [^\n]+\n?/gi,'');
  text=text.replace(/✓ Shell [^\n]+\n?/gi,'');
  text=text.replace(/✓ Read [^\n]+\n?/gi,'');
  text=text.replace(/✓ WebFetch [^\n]+\n?/gi,'');
  text=text.replace(/✓ ListAgents[^\n]+\n?/gi,'');
  text=text.replace(/✓ web_search[^\n]+\n?/gi,'');
  text=text.replace(/x brave_web_search[\s\S]*?(?=\n\n|✓|✗|●|◆|$)/gi,'');
  text=text.replace(/x tavily_search[\s\S]*?(?=\n\n|✓|✗|●|◆|$)/gi,'');
  text=text.replace(/●︎ Ran \d+ stop hooks[\s\S]*?(?=◆|●|$)/gi,'');
  text=text.replace(/●︎ Background agent "[^"]+" failed\.\n?/gi,'');
  text=text.replace(/Tool "[^"]+" not found[\s\S]*?(?=\n\n|✓|✗|$)/gi,'');
  
  // 2. Strip raw MCP JSON dumps aggressively
  text=text.replace(/\{[\s\S]*?"search_results"[\s\S]*?\}/gi,'');
  text=text.replace(/"Detailed Results":[\s\S]*?(?=◆|●|$)/gi,'');
  text=text.replace(/"excerpts":\s*\[[\s\S]*?\]/gi,'');
  
  // 3. Strip duplicate blocks (Keep ONLY the last ◆︎ block)
  const blocks = text.split(/(?=◆︎)/);
  if (blocks.length > 1) {
      text = blocks[blocks.length - 1];
  }
  
  // 4. Strip thinking + meta tags
  text=text.replace(/<thinking>[\s\S]*?<\/thinking>/gi,'');
  text=text.replace(/<think>[\s\S]*?<\/think>/gi,'');
  
  // 5. Strip AI slop
  ['Certainly!','Here is','I hope this helps','Dengan senang hati',
   'Berikut adalah','Tentu saja','Semoga membantu','Silakan tunggu sebentar',
   'Mohon tunggu sebentar','Saya akan memberikan hasilnya'].forEach(s=>{
   text=text.replace(new RegExp(s+'\\s*','gi'),'');
  });
  
  // 6. Strip excessive separators + line breaks
  text=text.replace(/[─━]{10,}/g,'');
  text=text.replace(/\n{4,}/g,'\n\n');
  text=text.replace(/Press ctrl-s to show more lines/gi,'');
  
  // 7. Final cleanup
  text=text.replace(/^\s*\n/gm,'').replace(/\n\s*$/g,'\n').trim();
  
  console.log(JSON.stringify({
   hookSpecificOutput:{hookEventName:'MessageDisplay',message:text}
  }));
 }catch(e){
  console.log(JSON.stringify({}));
 }
});