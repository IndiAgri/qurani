const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data, headers: res.headers }));
    }).on('error', reject);
  });
}

async function run() {
  const pageRes = await fetchUrl('https://my-qurani-site.vercel.app/en/teachers');
  console.log('Teachers page length:', pageRes.data.length);
  
  // Extract all chunk urls
  const chunkRegex = /static\/chunks\/[^"']+\.js/g;
  const chunks = [...new Set(pageRes.data.match(chunkRegex) || [])];
  console.log('Found chunks:', chunks.length);
  
  // Find teacher page chunk
  const teacherChunk = chunks.find(c => c.includes('teachers/page') || c.includes('teachers'));
  console.log('Teacher chunk:', teacherChunk);
  
  if (teacherChunk) {
    const chunkContent = await fetchUrl(`https://my-qurani-site.vercel.app/_next/${teacherChunk}`);
    console.log('Teacher chunk downloaded, length:', chunkContent.data.length);
    require('fs').writeFileSync('scratch/live_teachers_chunk.js', chunkContent.data);
  }
}

run().catch(console.error);
