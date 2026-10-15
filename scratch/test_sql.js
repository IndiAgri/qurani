const https = require('https');

const serviceRole = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxscHVqdmd1aGx3eWhka29ibGFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODM2ODMyNSwiZXhwIjoyMDgzOTQ0MzI1fQ.1EezVF-xclHALht_vwigF3IKdkdN_GYNl6QahO3ciDw";

function testSql() {
  const data = JSON.stringify({ query: 'SELECT tablename FROM pg_tables WHERE schemaname = \'public\';' });
  const req = https.request('https://llpujvguhlwyhdkoblab.supabase.co/pg/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${serviceRole}`
    }
  }, (res) => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => console.log('PG Query result:', res.statusCode, body));
  });
  req.on('error', console.error);
  req.write(data);
  req.end();
}

testSql();
