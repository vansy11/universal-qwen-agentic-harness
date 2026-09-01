// reflection.js — Stop hook
// Performs end-of-turn self-reflection and logs patterns for continuous improvement.
// Analyzes the transcript for:
// - Tool call efficiency (retries, redundant reads)
// - Error patterns (repeated failures, unhandled edge cases)
// - User corrections (signals that the AI got something wrong)
// - Domain coverage (which skills/agents were actually used)
// Writes findings to evolution/ for the improvement-tracker to process.

const fs = require("fs");
const path = require("path");

let input = "";
process.stdin.on("data", (c) => (input += c));
process.stdin.on("end", () => {
  try {
    const data = JSON.parse(input);
    const transcript = JSON.stringify(data.transcript || data);
    const qhRoot = path.resolve(__dirname, "..");
    const evoDir = path.join(qhRoot, "evolution");

    // Ensure evolution dir exists
    if (!fs.existsSync(evoDir)) fs.mkdirSync(evoDir, { recursive: true });

    const reflection = {
      ts: new Date().toISOString(),
      signals: {},
      score: 100,
    };

    // 1. Detect user corrections (strong signal of failure)
    const correctionPatterns = [
      /bukan,?\s*(salah|keliru)/i,
      /no,?\s*(that'?s?\s*)?(wrong|incorrect|not right)/i,
      /salah,?\s*(yang benar|seharusnya|mestinya)/i,
      /that'?s not (what|correct)/i,
      /wrong,?\s*(it'?s|should be)/i,
      /stop,?\s*(don'?t|tidak)/i,
      /revert,?\s*(changes|perubahan)/i,
    ];
    const corrections = correctionPatterns.filter((p) => p.test(transcript));
    reflection.signals.corrections = corrections.length;
    if (corrections.length > 0) reflection.score -= 20 * corrections.length;

    // 2. Detect tool call retries (inefficiency signal)
    const retryPattern =
      /"(read_file|write_file|edit_file|run_shell_command)".*?"(read_file|write_file|edit_file|run_shell_command)"/g;
    const retries = (transcript.match(retryPattern) || []).length;
    reflection.signals.retries = retries;
    if (retries > 3) reflection.score -= 5 * (retries - 3);

    // 3. Detect error loops (same error repeated)
    const errorPattern = /Error:|error:|FAIL|failed|ENOENT|EACCES/g;
    const errors = (transcript.match(errorPattern) || []).length;
    reflection.signals.errors = errors;
    if (errors > 5) reflection.score -= 10;

    // 4. Detect AI slop in output (quality signal)
    const slopPatterns = [
      "Certainly!",
      "Here is",
      "As an AI",
      "In conclusion",
      "Berikut adalah",
      "Tentu saja",
      "Dengan senang hati",
      "Great question",
      "Delve into",
      "Revolutionary",
    ];
    const foundSlop = slopPatterns.filter((s) => transcript.includes(s));
    reflection.signals.slop = foundSlop;
    if (foundSlop.length > 0) reflection.score -= 10 * foundSlop.length;

    // 5. Detect hallucination markers
    const hallucPatterns = [
      /studies show/i,
      /experts say/i,
      /research indicates/i,
    ];
    const foundHall = hallucPatterns.filter((r) => r.test(transcript));
    reflection.signals.hallucinations = foundHall.map((r) => r.source);
    if (foundHall.length > 0) reflection.score -= 15 * foundHall.length;

    // 6. Detect positive signals (user satisfaction)
    const positivePatterns = [
      /terima kasih/i,
      /thanks?/i,
      /perfect/i,
      /bagus/i,
      /mantap/i,
      /luar biasa/i,
      /great job/i,
      /exactly/i,
      /yes,?\s*(that'?s? (it|right|correct))/i,
    ];
    const positives = positivePatterns.filter((p) => p.test(transcript));
    reflection.signals.positives = positives.length;
    if (positives.length > 0)
      reflection.score = Math.min(100, reflection.score + 10);

    // Clamp score
    reflection.score = Math.max(0, Math.min(100, reflection.score));

    // Write reflection log
    const logPath = path.join(evoDir, "reflection-log.jsonl");
    fs.appendFileSync(logPath, JSON.stringify(reflection) + "\n", "utf8");

    // If score is critically low, flag for immediate attention
    if (reflection.score < 50) {
      const alertPath = path.join(evoDir, "critical-alerts.jsonl");
      fs.appendFileSync(
        alertPath,
        JSON.stringify({
          ts: reflection.ts,
          score: reflection.score,
          signals: reflection.signals,
        }) + "\n",
        "utf8",
      );
    }

    console.log(JSON.stringify({}));
  } catch (e) {
    console.log(JSON.stringify({}));
  }
});
