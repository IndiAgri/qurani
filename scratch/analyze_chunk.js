const fs = require('fs');

const code = fs.readFileSync('scratch/live_teachers_chunk.js', 'utf8');

// Look for JSX / strings / state / actions
const strings = code.match(/"([^"\\]|\\.)*"/g) || [];
const uniqueStrings = [...new Set(strings.map(s => s.slice(1, -1)))]
  .filter(s => s.length > 3 && !s.startsWith('static/') && !s.includes('webpack'));

console.log('Total unique strings:', uniqueStrings.length);
console.log('Sample strings:');
console.log(uniqueStrings.filter(s => 
  s.includes('teacher') || 
  s.includes('guru') || 
  s.includes('filter') || 
  s.includes('order') || 
  s.includes('checkout') || 
  s.includes('cart') || 
  s.includes('daftar') || 
  s.includes('price') || 
  s.includes('harga') ||
  s.includes('category') ||
  s.includes('search') ||
  s.includes('rating') ||
  s.includes('book') ||
  s.includes('status')
).slice(0, 50));
