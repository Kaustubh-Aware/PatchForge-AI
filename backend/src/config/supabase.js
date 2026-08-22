const { createClient } = require("@supabase/supabase-js");

const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn("⚠ Supabase URL or Key missing from environment variables.");
}

const supabase = createClient(
    supabaseUrl || "https://placeholder.supabase.co",
    supabaseKey || "placeholder_key",
    {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    }
);

module.exports = {
    supabase,
    supabaseUrl,
};
