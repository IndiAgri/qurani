const { createClient } = require('@supabase/supabase-js');

const url = "https://llpujvguhlwyhdkoblab.supabase.co";
const serviceRole = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxscHVqdmd1aGx3eWhka29ibGFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODM2ODMyNSwiZXhwIjoyMDgzOTQ0MzI1fQ.1EezVF-xclHALht_vwigF3IKdkdN_GYNl6QahO3ciDw";

const supabase = createClient(url, serviceRole);

async function listTables() {
  const commonTables = [
    'users', 'profiles', 'orders', 'wallet', 'wallets', 'transactions', 
    'recitations', 'recitation_records', 'tickets', 'tickets_history',
    'courses', 'bookings', 'reviews', 'teacher_profiles', 'teacher_applications'
  ];

  for (const t of commonTables) {
    const { data, error } = await supabase.from(t).select('*').limit(1);
    if (!error) {
      console.log(`[EXIST] ${t} -> has rows:`, data ? data.length : 0);
    } else if (error.code !== 'PGRST205') {
      console.log(`[ERROR/EXIST?] ${t} ->`, error.message);
    }
  }
}

listTables();
