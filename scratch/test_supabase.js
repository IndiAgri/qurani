const { createClient } = require('@supabase/supabase-js');

const url = "https://llpujvguhlwyhdkoblab.supabase.co";
const pubKey = "sb_publishable_-hqIXCmeBARVYxSZivbUBw_ADQ30EbD";
const serviceRole = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxscHVqdmd1aGx3eWhka29ibGFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODM2ODMyNSwiZXhwIjoyMDgzOTQ0MzI1fQ.1EezVF-xclHALht_vwigF3IKdkdN_GYNl6QahO3ciDw";

async function testConn() {
  console.log("Testing Service Role Client...");
  const adminClient = createClient(url, serviceRole);
  const { data: tables, error: adminErr } = await adminClient.from('teachers').select('id').limit(1);
  console.log("Admin query result:", { tables, adminErr });

  console.log("Testing Publishable/Anon Key...");
  const pubClient = createClient(url, pubKey);
  const { data: pubData, error: pubErr } = await pubClient.from('teachers').select('id').limit(1);
  console.log("Anon query result:", { pubData, pubErr });
}

testConn();
