async function run() {
  const res = await fetch('http://localhost:3000/en/orders');
  const html = await res.text();
  const re = /<button[^>]*class="([^"]*)"[^>]*>([\s\S]*?)<\/button>/g;
  let match;
  while ((match = re.exec(html)) !== null) {
    if (match[2].includes('Semua') || match[2].includes('Belum Bayar')) {
      console.log('--- BUTTON ---');
      console.log('Class:', match[1]);
      console.log('Content:', match[2].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
    }
  }
}
run();
