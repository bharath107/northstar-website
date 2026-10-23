// Supabase connection. Find these in Supabase: Project Settings > API Keys.
// The publishable key is designed to be public. It is safe ONLY because Row Level Security
// in supabase-setup.sql allows the public to insert rows and nothing else.
// NEVER put a "secret" or "service_role" key here.

window.SITE_CONFIG = {
  SUPABASE_URL: "https://ychnziwyyolawxpicars.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_BH-BwhyDs8wVsPsCc6E_Cw_QZXSglC4",
  TABLE: "consultation_requests"
};
