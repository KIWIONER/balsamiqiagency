import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

console.log("Testing URL:", supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    try {
        console.log("Fetching from objetivos_agencia...");
        const { data, error } = await supabase.from('objetivos_agencia').select('*').limit(1);

        if (error) {
            console.error("Supabase Error:", error);
        } else {
            console.log("Success! Data:", data);
        }
    } catch (err) {
        console.error("Fetch Exception:", err);
    }
}

testConnection();
