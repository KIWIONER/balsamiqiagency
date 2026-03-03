import { createClient } from '@supabase/supabase-js';

async function test(url, key) {
    try {
        const supabase = createClient(url, key);
        const { data, error } = await supabase.from('objetivos_agencia').select('*').limit(1);
        console.log(`[RESULT] ${url}:`, { data, error });
    } catch (err) {
        console.log(`[FAILED] ${url} Error:`, err.message);
    }
}

const key = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc3MTk3Nj';

(async () => {
    await test('https://supabasekong-jo0oosc8c0k088gg0kowokco.195.201.118.14.sslip.io', key);
})();
