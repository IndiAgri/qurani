const { createClient } = require('@supabase/supabase-js');

const url = "https://llpujvguhlwyhdkoblab.supabase.co";
const serviceRole = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxscHVqdmd1aGx3eWhka29ibGFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODM2ODMyNSwiZXhwIjoyMDgzOTQ0MzI1fQ.1EezVF-xclHALht_vwigF3IKdkdN_GYNl6QahO3ciDw";

const supabase = createClient(url, serviceRole);

async function checkRest() {
  // Test if any tables exist in public schema
  const res = await supabase.from('recitation_sessions').select('id').limit(1);
  console.log('recitation_sessions:', res.error ? res.error.message : 'OK');
}

checkRest();
