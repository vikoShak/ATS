import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Create client with placeholder values if env vars are missing
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  }
});


// Database types
export interface Database {
  public: {
    Tables: {
      departments: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      requirements: {
        Row: {
          id: string;
          title: string;
          department_id: string | null;
          location: string;
          type: 'Full-time' | 'Part-time' | 'Contract';
          status: 'Open' | 'Closed' | 'On Hold';
          posted_date: string | null;
          deadline: string | null;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          department_id?: string | null;
          location: string;
          type: 'Full-time' | 'Part-time' | 'Contract';
          status?: 'Open' | 'Closed' | 'On Hold';
          posted_date?: string | null;
          deadline?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          department_id?: string | null;
          location?: string;
          type?: 'Full-time' | 'Part-time' | 'Contract';
          status?: 'Open' | 'Closed' | 'On Hold';
          posted_date?: string | null;
          deadline?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      applicants: {
        Row: {
          id: string;
          full_name: string;
          cn_number: string | null;
          email: string;
          phone: string;
          location: string;
          visa_status: string;
          visa_validity: string | null;
          skills: string;
          comments: string | null;
          status: 'Applied' | 'Screening' | 'Interview' | 'Hired' | 'Rejected';
          applied_date: string | null;
          created_at: string;
          updated_at: string;
          source: string | null;
          taxTerm: string | null;
          payRate: number | null;
          submissionRate: number | null;
          resume_url: string | null;
          supporting_documents_urls: string[] | null;
        };
        Insert: {
          id?: string;
          full_name: string;
          cn_number?: string | null;
          email: string;
          phone: string;
          location: string;
          visa_status: string;
          visa_validity?: string | null;
          skills: string;
          comments?: string | null;
          status?: 'Applied' | 'Screening' | 'Interview' | 'Hired' | 'Rejected';
          applied_date?: string | null;
          created_at?: string;
          updated_at?: string;
          source?: string | null;
          taxTerm?: string | null;
          payRate?: number | null;
          submissionRate?: number | null;
          resume_url?: string | null;
          supporting_documents_urls?: string[] | null;
        };
        Update: {
          id?: string;
          full_name?: string;
          cn_number?: string | null;
          email?: string;
          phone?: string;
          location?: string;
          visa_status?: string;
          visa_validity?: string | null;
          skills?: string;
          comments?: string | null;
          status?: 'Applied' | 'Screening' | 'Interview' | 'Hired' | 'Rejected';
          applied_date?: string | null;
          created_at?: string;
          updated_at?: string;
          source?: string | null;
          taxTerm?: string | null;
          payRate?: number | null;
          submissionRate?: number | null;
          resume_url?: string | null;
          supporting_documents_urls?: string[] | null;
        };
      };
      applications: {
        Row: {
          id: string;
          applicant_id: string | null;
          requirement_id: string | null;
          status: 'Applied' | 'Screening' | 'Interview' | 'Hired' | 'Rejected';
          applied_date: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          applicant_id?: string | null;
          requirement_id?: string | null;
          status?: 'Applied' | 'Screening' | 'Interview' | 'Hired' | 'Rejected';
          applied_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          applicant_id?: string | null;
          requirement_id?: string | null;
          status?: 'Applied' | 'Screening' | 'Interview' | 'Hired' | 'Rejected';
          applied_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      timesheets: {
        Row: {
          id: string;
          employee_name: string;
          date: string;
          hours_worked: number;
          project: string;
          status: 'Pending' | 'Approved' | 'Rejected';
          created_at: string;
          updated_at: string;
          applicant_id: string; // Added
        };
        Insert: {
          id?: string;
          employee_name: string;
          date: string;
          hours_worked: number;
          project: string;
          status?: 'Pending' | 'Approved' | 'Rejected';
          created_at?: string;
          updated_at?: string;
          applicant_id: string; // Added
        };
        Update: {
          id?: string;
          employee_name?: string;
          date?: string;
          hours_worked?: number;
          project?: string;
          status?: 'Pending' | 'Approved' | 'Rejected';
          created_at?: string;
          updated_at?: string;
          applicant_id?: string; // Added
        };
      };
      activities: {
        Row: {
          id: string;
          action: string;
          entity_type: string;
          entity_id: string | null;
          details: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          details?: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          action?: string;
          entity_type?: string;
          entity_id?: string | null;
          details?: any;
          created_at?: string;
        };
      };
    };
  };
}
