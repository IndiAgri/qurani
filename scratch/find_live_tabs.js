const fs = require('fs');
const content = fs.readFileSync('scratch/live_orders_page.js', 'utf8');
const idx = content.indexOf('label:"Semua"');
console.log('--- LIVE CODE ---');
console.log(content.substring(idx - 300, idx + 700));
