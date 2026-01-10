import { createClient } from '@supabase/supabase-js';
import config from '../config/index.js';
import logger from '../utils/logger.js';

/**
 * Supabase client singleton
 */
let supabaseClient = null;

/**
 * Get Supabase client instance
 */
export const getSupabase = () => {
  if (!supabaseClient) {
    supabaseClient = createClient(
      config.supabase.url,
      config.supabase.serviceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
    logger.info('Supabase client initialized');
  }
  return supabaseClient;
};

/**
 * User model - Database operations for users
 */
export const UserModel = {
  /**
   * Find user by email
   */
  async findByEmail(email) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Find user by ID
   */
  async findById(id) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Create new user
   */
  async create(userData) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update user
   */
  async update(id, updates) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete user
   */
  async delete(id) {
    const supabase = getSupabase();
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },
};

/**
 * Stream model - Database operations for streams
 */
export const StreamModel = {
  async findByUserId(userId, filters = {}) {
    const supabase = getSupabase();
    let query = supabase
      .from('streams')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async create(streamData) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('streams')
      .insert(streamData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateStatus(id, status) {
    const supabase = getSupabase();
    const updates = { status };

    if (status === 'live') {
      updates.started_at = new Date().toISOString();
    } else if (status === 'ended') {
      updates.ended_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('streams')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

/**
 * RtmpConfig model - Database operations for RTMP configurations
 */
export const RtmpConfigModel = {
  async findByUserId(userId) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('rtmp_configs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async findById(id, userId) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('rtmp_configs')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async create(configData) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('rtmp_configs')
      .insert(configData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, userId, updates) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('rtmp_configs')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id, userId) {
    const supabase = getSupabase();
    const { error } = await supabase
      .from('rtmp_configs')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  },
};

/**
 * Websource model - Database operations for websources
 */
export const WebsourceModel = {
  async findByUserId(userId) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('websources')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async findById(id, userId) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('websources')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async create(websourceData) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('websources')
      .insert(websourceData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id, userId, updates) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('websources')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id, userId) {
    const supabase = getSupabase();
    const { error } = await supabase
      .from('websources')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  },
};

export default {
  getSupabase,
  UserModel,
  StreamModel,
  RtmpConfigModel,
  WebsourceModel,
};
