// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://iqiawsbnlnekcfneovry.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxaWF3c2JubG5la2NmbmVvdnJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NjE3NDksImV4cCI6MjA2MTQzNzc0OX0.ta9PZUSvA2EfwEZjGpzjyRzy-OQXYSeId8j76TlEAhk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);