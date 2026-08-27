# MEMORY FRESHNESS, AUTO-EVAL & SELF-IMPROVEMENT PROTOCOL

## 1. Role Memori: Otak & Latar Belakang (Context & Brain)

- **HANYA Pengetahuan Latar Belakang**: Memori (`.qwen/memories/` & `.qwen/projects/`) digunakan HANYA sebagai acuan preferensi, aturan, dan batasan konteks.
- **DILARANG Copy-Paste / Mengulang Memori**: Dilarang mengutip atau menyajikan kembali jawaban usang dari memori secara mentah seolah-olah itu adalah jawaban baru.
- **Fresh Synthesis Required**: Setiap pertanyaan/permintaan HARUS menghasilkan jawaban baru yang disintesis dari file asli, kode saat ini, atau data real-time terkini.

## 2. Auto-Eval (Self-Evaluation Gate)

Sebelum memberikan output ke pengguna, lakukan evaluasi kualitas internal:

1. **Freshness Verification**: Apakah jawaban ini menganalisis keadaan file/sistem saat ini dan bukan merely re-hashing data lama?
2. **Context Alignment**: Apakah jawaban sudah sesuai dengan preferensi di memori tanpa harus menceritakan ulang isi memori tersebut?
3. **Accuracy & Quality Check**: Apakah tidak ada informasi yang berpotensi halusinasi, slop, atau filler yang tidak perlu?

## 3. Auto Self-Improvement Loop

- **Belajar dari Koreksi & Konfirmasi**: Tangkap secara otomatis setiap koreksi (_correction_) maupun keberhasilan (_confirmation_) dari pengguna.
- **Pembaruan Otomatis**: Simpan pola perbaikan ke `evolution/improvement-queue.md` dan struktur memori via `auto-memory.js` secara silent tanpa mengganggu alur percakapan utama.
