import { createClient } from "@supabase/supabase-js";

let browserClient: ReturnType<typeof createClient> | null = null;

function getPublicSupabaseConfig() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

export function getBrowserSupabaseClient() {
  if (browserClient) {
    return browserClient;
  }

  const config = getPublicSupabaseConfig();
  if (!config) {
    return null;
  }

  browserClient = createClient(config.url, config.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return browserClient;
}

export function hasSupabaseBrowserConfig() {
  return Boolean(getPublicSupabaseConfig());
}
