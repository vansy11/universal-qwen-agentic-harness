## Routing Philosophy (PERSISTENT)
User TIDAK boleh diminta menambahkan slash commands atau flags di prompt mereka.
Sistem harus auto-detect intent dari NATURAL LANGUAGE murni.

Rules:
- Slash commands (/audit, /eval, /trend) adalah BONUS opsional, bukan requirement
- User cukup ketik: "buatkan REST API login", "ringkas berita hari ini", "desain ERD toko"
- prompt-router auto-route berdasarkan keyword + semantik
- Tidak ada syntax khusus yang user harus pelajari

Anti-pattern (JANGAN):
- Meminta user ketik "/backend buatkan API..."
- Meminta user ketik "skill:backend-engineer, task:..."
- Membuat user menghafal daftar slash commands