const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'src/data/it-questions.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log("--- CONTENT AUDIT ---");
console.log("Total Questions:", data.questions.length);

const missingCompact = [];
const rawFormatting = [];
const done = [];

data.questions.forEach(q => {
    const hasCompact = !!q.compactContent;
    // Simple heuristic for "processed" answer: contains standard markdown headers or lists
    const isFormatted = q.answer && (q.answer.includes('###') || q.answer.includes('- **'));

    if (hasCompact && isFormatted) {
        done.push(q.id);
    } else {
        if (!hasCompact) missingCompact.push(q.id);
        if (!isFormatted) rawFormatting.push(q.id);
    }
});

console.log(`\nDONE (Formatted + Compact): ${done.length} questions`);
console.log(`Q IDs: ${done.join(', ')}`);

console.log(`\nMISSING COMPACT CONTENT: ${missingCompact.length} questions`);
console.log(`Q IDs: ${missingCompact.join(', ')}`);

console.log(`\nPOTENTIALLY RAW/UNFORMATTED: ${rawFormatting.length} questions`);
console.log(`Q IDs: ${rawFormatting.join(', ')}`);

console.log("\n--- EXAM BREAKDOWN (Missing Compact) ---");
const missingByExam = {};
missingCompact.forEach(id => {
    const q = data.questions.find(x => x.id === id);
    if (!missingByExam[q.exam]) missingByExam[q.exam] = [];
    missingByExam[q.exam].push(`${q.id}: ${q.question}`);
});

Object.keys(missingByExam).forEach(exam => {
    console.log(`\n[${exam}]`);
    missingByExam[exam].forEach(item => console.log(` - ${item}`));
});
