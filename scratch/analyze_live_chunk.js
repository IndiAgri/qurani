const fs = require('fs');
const content = fs.readFileSync('scratch/live_order_detail_chunk.js', 'utf8');

function findSnippet(str) {
  let pos = 0;
  while (true) {
    const idx = content.indexOf(str, pos);
    if (idx === -1) break;
    console.log(`--- FOUND ${str} at ${idx} ---`);
    console.log(content.substring(Math.max(0, idx - 200), Math.min(content.length, idx + 200)));
    pos = idx + str.length;
  }
}

findSnippet('"Nilai"');
findSnippet('"Pesan Lagi"');
findSnippet('"Chat Guru"');
findSnippet('"ID Pesanan"');
