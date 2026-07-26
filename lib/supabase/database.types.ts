export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = 'owner' | 'admin' | 'manager' | 'agent' | 'client';
export type LeadStatus = 'new' | 'qualified' | 'meeting' | 'proposal' | 'won' | 'lost';
export type ActivityType = 'lead_created' | 'lead_updated' | 'lead_deleted' | 'note_created' | 'status_changed' | 'login';
export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface Database {
  public: {
    Tables: {
      users: {
        Row: { id: string; email: string; role: UserRole; is_active: boolean; created_at: string; updated_at: string };
        Insert: { id: string; email: string; role?: UserRole; is_active?: boolean; created_at?: string; updated_at?: string };
        Update: { id?: string; email?: string; role?: UserRole; is_active?: boolean; created_at?: string; updated_at?: string };
        Relationships: [];
      };
      profiles: {
        Row: { id: string; full_name: string | null; phone: string | null; avatar_url: string | null; created_at: string; updated_at: string };
        Insert: { id: string; full_name?: string | null; phone?: string | null; avatar_url?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: string; full_name?: string | null; phone?: string | null; avatar_url?: string | null; created_at?: string; updated_at?: string };
        Relationships: [];
      };
      leads: {
        Row: { id: string; owner_id: string; name: string; phone: string; business_name: string; email: string; status: LeadStatus; created_at: string; updated_at: string };
        Insert: { id?: string; owner_id: string; name: string; phone: string; business_name: string; email: string; status?: LeadStatus; created_at?: string; updated_at?: string };
        Update: { id?: string; owner_id?: string; name?: string; phone?: string; business_name?: string; email?: string; status?: LeadStatus; created_at?: string; updated_at?: string };
        Relationships: [];
      };
      lead_notes: {
        Row: { id: string; lead_id: string; author_id: string; body: string; created_at: string; updated_at: string };
        Insert: { id?: string; lead_id: string; author_id: string; body: string; created_at?: string; updated_at?: string };
        Update: { id?: string; lead_id?: string; author_id?: string; body?: string; created_at?: string; updated_at?: string };
        Relationships: [];
      };
      activities: {
        Row: { id: string; actor_id: string | null; lead_id: string | null; type: ActivityType; description: string; metadata: Json; created_at: string };
        Insert: { id?: string; actor_id?: string | null; lead_id?: string | null; type: ActivityType; description: string; metadata?: Json; created_at?: string };
        Update: { id?: string; actor_id?: string | null; lead_id?: string | null; type?: ActivityType; description?: string; metadata?: Json; created_at?: string };
        Relationships: [];
      };
      settings: {
        Row: { id: string; user_id: string; key: string; value: Json; created_at: string; updated_at: string };
        Insert: { id?: string; user_id: string; key: string; value?: Json; created_at?: string; updated_at?: string };
        Update: { id?: string; user_id?: string; key?: string; value?: Json; created_at?: string; updated_at?: string };
        Relationships: [];
      };
      notifications: {
        Row: { id: string; user_id: string; type: NotificationType; title: string; message: string; read_at: string | null; created_at: string };
        Insert: { id?: string; user_id: string; type?: NotificationType; title: string; message: string; read_at?: string | null; created_at?: string };
        Update: { id?: string; user_id?: string; type?: NotificationType; title?: string; message?: string; read_at?: string | null; created_at?: string };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      lead_status: LeadStatus;
      activity_type: ActivityType;
      notification_type: NotificationType;
    };
    CompositeTypes: Record<string, never>;
  };
}
