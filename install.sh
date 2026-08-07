#!/usr/bin/env bash
set -e
REPO="$(cd "$(dirname "$0")" && pwd)"
TARGET="$HOME/.qwen"
echo "Installing harness to $TARGET"

for d in agents commands core hooks memories protocols rules skills evolution; do
  mkdir -p "$TARGET/$d"; cp -r "$REPO/$d/." "$TARGET/$d/"
done

# Generate settings.json from example with placeholder rewrite
cp "$REPO/settings.example.json" "$TARGET/settings.json"
sed -i.bak -e "s|__QWEN_HOME__|$TARGET|g" -e "s|python |python3 |g" "$TARGET/settings.json"
rm -f "$TARGET/settings.json.bak"

echo ""
echo "Install complete. Next steps:"
echo "  1. Edit $TARGET/settings.json and add your API keys"
echo "  2. Restart Qwen Code"
echo ""
echo "Required API keys (get free tiers):"
echo "  - Brave: https://brave.com/search/api/ (2000 queries/month free)"
echo "  - Tavily: https://tavily.com (1000 searches/month free)"
echo "  - Gemini: https://aistudio.google.com/apikey (free tier)"