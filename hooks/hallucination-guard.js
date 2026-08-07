let input='';process.stdin.on('data',c=>input+=c);process.stdin.on('end',()=>{
 try{
  const p=JSON.parse(input);
  const text=JSON.stringify(p);
  const conversation=JSON.stringify(p.transcript||[]);
  
  // Check jika ada search request tapi tidak ada valid MCP result
  const hasSearchRequest=/trending|berita|news|viral/i.test(conversation);
  const hasValidMCP=/tavily_search.*?Detailed Results:[\s\S]{100,}/i.test(conversation);
  const hasMCPFailure=/failed|error|invalid|SUBSCRIPTION_TOKEN_INVALID/i.test(conversation);
  const hasFabricatedData=/Berita Terkini|Trending di Media Sosial|Platform Populer/i.test(text) && !hasValidMCP;
  
  if(hasSearchRequest && hasMCPFailure && !hasValidMCP && hasFabricatedData){
   console.log(JSON.stringify({
    decision:'block',
    reason:'Output contains fabricated data without valid MCP results',
    rewritePrompt:'Do NOT fabricate data. Say: "Saya tidak bisa mengakses data terkini saat ini karena masalah koneksi ke search API. Silakan coba lagi nanti atau gunakan /model untuk switch ke model lain."'
   }));
  }else{
   console.log(JSON.stringify({decision:'allow'}));
  }
 }catch(e){
  console.log(JSON.stringify({decision:'allow'}));
 }
});