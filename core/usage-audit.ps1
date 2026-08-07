$proj = "C:\Users\vansy\.qwen\projects"
$agents = (Get-ChildItem "C:\Users\vansy\.qwen\agents\*.md").BaseName
$subFiles = Get-ChildItem $proj -Recurse -Filter "agent-*.jsonl" -ErrorAction SilentlyContinue
$metaFiles = Get-ChildItem $proj -Recurse -Filter "agent-*.meta.json" -ErrorAction SilentlyContinue
$modelIds = @('kimi-k2.7-code','qwen3.7-max','qwen3.8-max-preview','qwen3.7-plus','qwen3.6-flash','deepseek-v4-pro','gemini-3.5-flash')

Write-Output "=== AGENTS ==="
$unused = @()
foreach ($a in $agents) {
    $inv = @($subFiles | Where-Object { $_.Name -like "agent-$a-*" }).Count
    if ($inv -gt 0) {
        $model = "?"
        $meta = $metaFiles | Where-Object { $_.Name -like "agent-$a-*" } | Select-Object -First 1
        if ($meta) { $c = Get-Content $meta.FullName -Raw; foreach ($m in $modelIds) { if ($c.Contains($m)) { $model = $m; break } } }
        Write-Output "USED ${inv}x | $a | model: $model"
    } else { $unused += $a }
}
Write-Output "UNUSED_COUNT: $($unused.Count)"
Write-Output "UNUSED_LIST: $($unused -join ', ')"

Write-Output "=== MCP ==="
$chats = Get-ChildItem $proj -Recurse -Filter "*.jsonl" -ErrorAction SilentlyContinue
foreach ($m in @('tavily','exa','brave-search','web-research','fetch','github','filesystem','memory','playwright','context7','magic','sequential-thinking','firecrawl')) {
    $hit = @($chats | Select-String -Pattern ("mcp__" + [regex]::Escape($m) + "__") -List -ErrorAction SilentlyContinue).Count
    Write-Output "$m : $hit sessions"
}