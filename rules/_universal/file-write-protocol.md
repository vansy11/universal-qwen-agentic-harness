# FILE WRITE PROTOCOL
Always read_file a target BEFORE write_file / edit_file (platform safety guard).
Missing file => read fails silently => proceed to write.