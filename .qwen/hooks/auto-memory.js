let input = '';
process.stdin.on('data', (chunk) => input += chunk);
process.stdin.on('end', () => {
    try {
        const payload = JSON.parse(input);
        
        // Hanya jalankan jika sesi memiliki percakapan yang cukup
        if (payload.transcript && payload.transcript.length > 4) {
            // Memicu instruksi ke AI untuk merangkum pelajaran
            const response = {
                hookSpecificOutput: {
                    hookEventName: "Stop",
                    additionalContext: "SYSTEM INSTRUCTION: Before ending this session, quickly analyze the conversation. Did you make any mistakes that the user corrected? Did you learn a new preference? If yes, write a 1-sentence summary to the memory file using the memory-curator agent. If no notable patterns were learned, do nothing."
                }
            };
            console.log(JSON.stringify(response));
        } else {
            console.log(JSON.stringify({ decision: "allow" }));
        }
    } catch(e) {
        console.log(JSON.stringify({ decision: "allow" }));
    }
});