import {createClient} from '@supabase/supabase-js'
import { QueryResult, QueryData, QueryError } from '@supabase/supabase-js'
import { Database, Tables, Enums } from './databasetypes'
import assert from 'assert'
import dotenv from 'dotenv';

//allows us to use process.env to get environment variables
dotenv.config();

// Create a single supabase client for interacting with your database
const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? assert.fail('NEXT_PUBLIC_SUPABASE_URL is not defined'),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? assert.fail('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined'), {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        }
      })

//helper functions to interact with the database

async function addRecord(table: keyof Database['public']['Tables'], record: any): Promise<void> {
    const { data, error } = await supabase.from(table).insert(record);
    if (error) {
        throw new Error(`Error adding record to ${table}: ${error.message}`);
    }
    console.log(`Record added to ${table}:`, data);
}

//--------------------------------------------Main Function--------------------------------------------------//
async function main(): Promise<void> {
}

main()