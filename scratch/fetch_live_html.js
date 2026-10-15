async function fetchLive() {
  const res = await fetch('https://my-qurani-site.vercel.app/id/orders');
  const html = await res.text();
  console.log('Live status:', res.status);
  const idx = html.indexOf('Semua');
  if (idx !== -1) {
    console.log('Snippet around Semua:');
    console.log(html.substring(Math.max(0, idx - 300), idx + 500));
  } else {
    console.log('Semua not found in SSR HTML (client rendered)');
  }
}
fetchLive();
