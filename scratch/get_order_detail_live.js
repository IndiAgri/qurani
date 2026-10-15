const https = require('https');
const fs = require('fs');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function main() {
  const res = await fetchUrl('https://my-qurani-site.vercel.app/id/orders/ORD-1789973730003');
  console.log('Status:', res.statusCode, 'Length:', res.data.length);
  const chunks = [...new Set(res.data.match(/static\/chunks\/[^"']+\.js/g) || [])];
  console.log('Chunks:', chunks);
  const orderDetailChunk = chunks.find(c => c.includes('orders') && c.includes('%5Bid%5D'));
  console.log('Order detail chunk:', orderDetailChunk);
  if (orderDetailChunk) {
    const chunkData = await fetchUrl('https://my-qurani-site.vercel.app/_next/' + orderDetailChunk);
    fs.writeFileSync('scratch/live_order_detail_chunk.js', chunkData.data);
    console.log('Saved live_order_detail_chunk.js, length:', chunkData.data.length);
  }
}
main();
