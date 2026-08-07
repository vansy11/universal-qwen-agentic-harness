$repo = $PSScriptRoot
$target = "$HOME\.qwen"
Write-Host "Installing harness to $target"

foreach ($d in @('agents','commands','core','hooks','memories','protocols','rules','skills','evolution')) {
    New-Item -ItemType Directory -Path "$target\$d" -Force | Out-Null
    Copy-Item "$repo\$d\*" "$target\$d\" -Recurse -Force
}

# Generate settings.json from example with placeholder rewrite
Copy-Item "$repo\settings.example.json" "$target\settings.json" -Force
$c = Get-Content "$target\settings.json" -Raw
$c = $c -replace '__QWEN_HOME__', ($target -replace '\\','/')
Set-Content "$target\settings.json" $c

Write-Host ""
Write-Host "Install complete. Next steps:" -ForegroundColor Green
Write-Host "  1. Edit $target\settings.json and add your API keys"
Write-Host "  2. Restart Qwen Code"
Write-Host ""
Write-Host "Required API keys (free tiers):" -ForegroundColor Yellow
Write-Host "  - Brave: https://brave.com/search/api/"
Write-Host "  - Tavily: https://tavily.com"
Write-Host "  - Gemini: https://aistudio.google.com/apikey"