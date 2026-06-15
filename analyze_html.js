const fs = require('fs');
const html = fs.readFileSync('dresses-html.txt', 'utf-8');

const regex = /data:image\/png;base64,[^\s"']+/g;
let match;
let i = 0;
while ((match = regex.exec(html)) !== null) {
  const str = match[0];
  if (str.length > 1000) {
    console.log(`Match ${i}: length ${str.length}`);
    // find surrounding context
    const start = Math.max(0, match.index - 50);
    const end = Math.min(html.length, match.index + 100);
    console.log(`Context: ${html.substring(start, end)}\n`);
    i++;
  }
}
