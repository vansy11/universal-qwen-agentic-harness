const QWEN_HOME = require('path').resolve(__dirname, '..').replace(/\\/g, '/');
let input = '';
process.stdin.on('data', c => input += c);
process.stdin.on('end', () => {
    try {
        const payload = JSON.parse(input);
        if (payload.prompt) { payload.prompt = payload.prompt.replace(/\s+/g, ' ').trim(); }
        console.log(JSON.stringify({}));
    } catch(e) { console.log(JSON.stringify({})); }
});