import { createClient } from '@supabase/supabase-js';
/// <reference types="vite/client" />
// Replace with your actual values from Supabase Settings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vpewjmkebkpaidjngovh.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwZXdqbWtlYmtwYWlkam5nb3ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNzk2MjksImV4cCI6MjA4Njk1NTYyOX0.U9u3iQo-_X24Oet2LVQV0LEOqPmS497vaXrQHIwSZWI';

export const supabase = createClient(supabaseUrl, supabaseKey);
