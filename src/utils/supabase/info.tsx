const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!projectId || !publicAnonKey) {
  throw new Error('Supabase configuration is missing. Did you forget to set VITE_SUPABASE_PROJECT_ID and VITE_SUPABASE_ANON_KEY?');
}

export { projectId, publicAnonKey };
