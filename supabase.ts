import { AuthSessionMissingError, createClient, JwtPayload } from '@supabase/supabase-js'
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


//--------------------------------------------Authentication Functions--------------------------------------------------//
/**
 * Verifies a JWT token and returns the decoded user information.
 * 
 * @param token - The JWT token to verify.
 * @returns the decoded user information from the JWT token.
 * @throws Will throw an error if the JWT secret is not defined or if the token is invalid.
 */
async function verifyToken(token: string): Promise<JwtPayload> {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET ?? assert.fail('NEXT_PUBLIC_SUPABASE_JWT_SECRET is not defined'), { algorithms: ['HS256'] }) as JwtPayload;

    //console.log('current tiem:', Math.floor(Date.now() / 1000));
    //assert(decodedData.exp > Math.floor(Date.now() / 1000), 'Token has expired');
    return decodedData;
}

/**
 * Decodes a JWT token without verifying its signature or that its expired (in string format).
 * 
 * @param token - The JWT token to decode.
 * @returns the payload of the JWT token as a string.
 */
async function decodeToken(token: string): Promise<string> {
    const decodedData = jwt.decode(token, { complete: true })?? assert.fail('Failed to decode token');

    return decodedData.payload as string;
}

async function signInAndGetToken(email: string, password: string): Promise<[string, string]> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Login error:', error.message)
    throw error
  }

  const accessToken = data.session.access_token
  const refreshToken = data.session.refresh_token

  console.log('✅ Access Token:', accessToken)
  console.log('🔁 Refresh Token:', refreshToken)

  return [accessToken, refreshToken]
}

/**
 * Signs out the user from both the client and server side.
 * 
 * @param session 
 */
async function signOut(token: string, scope?: 'global' | 'local' | 'others'): Promise<void> {
  //const { error } = await supabase.auth.signOut();
  const { error: revokeError } = await supabase.auth.admin.signOut(token, scope);

  if (revokeError) {
    if (revokeError instanceof AuthSessionMissingError) {
      console.error('Unauthorized: Invalid token or session expired');
    } else {
      console.error('Server-side sign out error:', revokeError.message);
      throw revokeError;
    };
  }
  //if (error) {
    //console.error('Sign out error:', error.message)
    //throw error
  //}

  console.log('✅ Successfully signed out')
}

/**
 * 
 */
async function useRefreshToken(refreshToken: string): Promise<[string, string]> {
  const { data, error } = await supabase.auth.refreshSession({refresh_token: refreshToken});

  if (error) {
    console.error('Refresh token error:', error.message);
    throw error;
  }

  if (!data.session) {
    throw new Error('No session data returned from refreshSession');
  }

  const accessToken = data.session.access_token;
  const newRefreshToken = data.session.refresh_token;

  console.log('✅ New Access Token:', accessToken);
  console.log('🔁 New Refresh Token:', newRefreshToken);

  return [accessToken, newRefreshToken];
}

//--------------------------------------------Main Function--------------------------------------------------//
async function main(): Promise<void> {
}

main()