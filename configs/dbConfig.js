import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

let res = dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;