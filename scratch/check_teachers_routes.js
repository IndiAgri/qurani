const https = require('https');

const routes = [
  '/en/teachers',
  '/en/teachers/1',
  '/en/teachers/registers',
  '/en/teachers/forms',
  '/en/teachers/pending',
  '/en/orders',
  '/en/wallet'
];

async function check() {
  for (const r of routes) {
    await new Promise((res) => {
      https.get(`https://my-qurani-site.vercel.app${r}`, (response) => {
        console.log(`${r} -> ${response.statusCode}`);
        res();
      }).on('error', (e) => {
        console.log(`${r} -> error: ${e.message}`);
        res();
      });
    });
  }
}

check();
