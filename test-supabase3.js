import { createClient } from '@supabase/supabase-js';

const url = 'http://supabasekong-jo0oosc8c0k088gg0kowokco.195.201.118.14.sslip.io';
const key = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc3MTk3Nj';

async function test() {
    console.log("Testing:", url);
    try {
        const supabase = createClient(url, key);
        const { data, error } = await supabase.from('objetivos_agencia').select('*').limit(1);
        console.log("[DATA]:", data);
        console.log("[ERROR]:", error);
    } catch (err) {
        console.log("[FATAL ERROR]:", err.message);
    }
}
test();
