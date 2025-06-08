import {createClient, SupabaseClient} from '@supabase/supabase-js'
import { QueryResult, QueryData, QueryError } from '@supabase/supabase-js'
import { Database, Tables, Enums } from '../databasetypes'
import {signInAndGetToken, signOut, getSupabaseClient, decodeToken, createUser, deleteAccount} from './auth'
import assert from 'assert'
import dotenv from 'dotenv';
import { get } from 'http'
import { create } from 'domain'

//allows us to use process.env to get environment variables
dotenv.config();


export async function changeUsername(newUsername: string, userId: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
    const { data, error } = await supabaseClient
        .from('usersettings') 
        .update({ username: newUsername }) 
        .eq('id', userId); 

    if (error) {
        console.error('Error changing username:', error.message);
        throw error;
    }
}

export async function changeFirstName(name: string, userId: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
  const { data, error } = await supabaseClient
      .from('usersettings') 
      .update({ first_name: name }) 
      .eq('id', userId); 

  if (error) {
      console.error('Error changing first name:', error.message);
      throw error;
  }
}

export async function changeLastName(name: string, userId: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
  const { data, error } = await supabaseClient
      .from('usersettings') 
      .update({ last_name: name }) 
      .eq('id', userId); 

  if (error) {
      console.error('Error changing last name:', error.message);
      throw error;
  }
}

export async function changeMiddleName(name: string, userId: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
  const { data, error } = await supabaseClient
      .from('usersettings') 
      .update({ middle_name: name }) 
      .eq('id', userId); 

  if (error) {
      console.error('Error changing middle name:', error.message);
      throw error;
  }
}

export async function changePublicOrPrivate(public_or_private: 'public' | 'private', userId: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
  const { data, error } = await supabaseClient
      .from('usersettings') 
      .update({ public_or_private: public_or_private }) 
      .eq('id', userId); 

  if (error) {
      console.error('Error changing public or private name:', error.message);
      throw error;
  }
}

export async function changeBio(newBio: string, userId: string, supabaseClient: SupabaseClient<Database>): Promise<void> {
  const { data, error } = await supabaseClient
      .from('usersettings') 
      .update({ bio: newBio }) 
      .eq('id', userId); 

  if (error) {
      console.error('Error changing bio:', error.message);
      throw error;
  }
}

export async function change_password(supabaseClient: SupabaseClient<Database>, newPassword: string): Promise<void> {
    // This function is not implemented yet, but it will handle password change
    // using the Supabase client.
    const { error } = await supabaseClient.auth.updateUser({
        password: newPassword,
    });

    if (error) {
        console.error('Error changing password:', error.message);
        throw error;
    }
    console.log('Password changed successfully');
}

export async function setProfilePic(supabaseClient: SupabaseClient<Database>, userId: string, profilePicUrl: string): Promise<void> {
    throw new Error('setProfilePic function is not implemented yet.');
}

export async function deleteProfilePic(supabaseClient: SupabaseClient<Database>, userId: string): Promise<void> {
    throw new Error('deleteProfilePic function is not implemented yet.');
}