const https = require('https');
const fs = require('fs');

async function checkUrl(path) {
  return new Promise((resolve) => {
    https.get(`https://my-qurani-site.vercel.app${path}`, (res) => {
      resolve({ path, statusCode: res.statusCode, location: res.headers.location });
    }).on('error', (e) => resolve({ path, error: e.message }));
  });
}

async function main() {
  const paths = [
    '/',
    '/teachers',
    '/en/teachers',
    '/id/teachers',
    '/teachers/forms',
    '/teachers/register',
    '/teachers/registers',
    '/teachers/pending',
    '/orders',
    '/en/orders',
    '/wallet',
    '/en/wallet',
    '/recitation',
    '/en/recitation',
    '/marketplace',
    '/toko'
  ];

  for (const p of paths) {
    const res = await checkUrl(p);
    console.log(`${res.path} -> ${res.statusCode} ${res.location || ''}`);
  }
}

main();
