import { createClient, JwtPayload } from '@supabase/supabase-js'
import { Database } from './databasetypes'
import assert from 'assert'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import { decode } from 'punycode';

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

/**
 * Verifies a JWT token and returns the decoded user information.
 * 
 * @param token - The JWT token to verify.
 * @returns the decoded user information from the JWT token.
 * @throws Will throw an error if the JWT secret is not defined or if the token is invalid.
 */
async function verifyToken(token: string): Promise<string> {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET ?? assert.fail('NEXT_PUBLIC_SUPABASE_JWT_SECRET is not defined'), { algorithms: ['HS256'] }) as JwtPayload;

    assert(decodedData.exp > Math.floor(Date.now() / 1000), 'Token has expired');
    return decodeToken(token);
}

/**
 * Decodes a JWT token without verifying its signature or that its expired.
 * 
 * @param token - The JWT token to decode.
 * @returns the payload of the JWT token as a string.
 */
async function decodeToken(token: string): Promise<string> {
    const decodedData = jwt.decode(token, { complete: true })?? assert.fail('Failed to decode token');

    return decodedData.payload as string;
}

async function signInAndGetToken(email: string, password: string): Promise<string> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Login error:', error.message)
    return "error"
  }

  const accessToken = data.session.access_token
  const refreshToken = data.session.refresh_token

  console.log('✅ Access Token:', accessToken)
  console.log('🔁 Refresh Token:', refreshToken)

  return accessToken
}

async function main(): Promise<void> {
    //const token = await signInAndGetToken('muktharamesh21@gmail.com', 'AthenaWarrior0212*')
    const token = 'eyJhbGciOiJIUzI1NiIsImtpZCI6IncxQ0o4N1ZWbHdFWDE5Nk8iLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3ZqZGpybXVob2p3cHJ1Z3BwdWZkLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJhNWE5ODk4Yi05ZmNjLTQ5NmQtODg0ZS03YmQ1YmZlYzM5YzQiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQ4MjQxODM0LCJpYXQiOjE3NDgyMzgyMzQsImVtYWlsIjoibXVrdGhhcmFtZXNoMjFAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbF92ZXJpZmllZCI6dHJ1ZX0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3NDgyMzgyMzR9XSwic2Vzc2lvbl9pZCI6IjkwZDZhMjVlLTZmMzUtNDAzNy05OWZlLTkzMTg3MzNmNGI4MCIsImlzX2Fub255bW91cyI6ZmFsc2V9.KBcxya02Nohf8sIMbpRoaaZ8z9IJTrzJ5ovFnz8-c4g'
    console.log(await verifyToken(token));
    console.log(jwt.decode(token, { complete: true }))
}

main()