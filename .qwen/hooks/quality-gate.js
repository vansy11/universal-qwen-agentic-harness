let input = '';
process.stdin.on('data', (chunk) => input += chunk);
process.stdin.on('end', () => {
    try {
        const payload = JSON.parse(input);
        
        // Ubah seluruh payload menjadi string agar kita bisa mencari kata di mana pun ia berada
        const text = JSON.stringify(payload);
        
        // Daftar kata "AI Slop" yang dilarang
        const slopPhrases = ['Here is', "Here's", 'Certainly!', "I'd be happy to", 'I would be happy to', 'In conclusion', 'As an AI'];
        
        let needsHumanize = false;
        for (let phrase of slopPhrases) {
            if (text.includes(phrase)) { 
                needsHumanize = true; 
                break; 
            }
        }
        
        // Jika terdeteksi Slop, tolak dan suruh rapihkan
        const response = needsHumanize ?
            { decision: "block", reason: "AI-slop detected. Please rewrite your entire previous response to sound more human, direct, and professional. Remove filler phrases like 'Here is' or 'I would be happy to'." } :
            { decision: "allow" };
            
        console.log(JSON.stringify(response));
    } catch(e) {
        // Jika error parsing, biarkan lanjut agar tidak menggantung sesi
        console.log(JSON.stringify({ decision: "allow" }));
    }
});