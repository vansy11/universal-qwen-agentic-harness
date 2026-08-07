---
description: Audit pemakaian agents, models, MCP, dan skills harness
---

Jalankan audit usage harness dengan perintah shell:
powershell -ExecutionPolicy Bypass -File "C:\Users\vansy\.qwen\core\usage-audit.ps1"

Kemudian sintesis hasilnya menjadi SATU tabel Markdown bersih dengan kolom:
Komponen | Status | Detail

Aturan tampilan:
- Agents terpakai: tampilkan nama + jumlah invokasi + model yang dipakai
- Agents unused: tampilkan hanya jumlah + daftar singkat (jangan per baris)
- MCP: tampilkan yang terpakai dengan jumlah sessions, tandai yang "never"
- Jangan dump output mentah script. Jangan thinking tags. Jangan emoji.
- Akhiri dengan 2-3 insight: agent paling aktif, MCP dominan, dan 1 rekomendasi prune.
- Tutup dengan --- lalu Sources: [usage-audit.ps1]