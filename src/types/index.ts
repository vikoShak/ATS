export interface User {
  id: string;
  username: string;
  isAuthenticated: boolean;
}

// Aligning Applicant interface with Supabase Database types for consistency
export interface Applicant {
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
  // Additional fields from joins or derived data for UI
  requirement?: string;
  customer?: string;
  recruiter?: string;
  aging_days?: number;
  margin?: number;
  l1_interview_date?: string;
  l2_interview_date?: string;
  l3_interview_date?: string;
  confirmed_date?: string;
  joined_date?: string;
  submitted_date?: string;
}

export interface Requirement {
  id: string;
  title: string;
  requirement_number?: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  terms?: 'Hybrid' | 'Remote' | 'On-Site';
  status: 'Open' | 'Closed' | 'On Hold';
  customer_name?: string;
  poc_name?: string;
  open_date?: string;
  tat_date?: string;
  number_of_submissions?: number;
  key_skills?: string;
  tagged_candidates?: string[];
  postedDate: string;
  deadline: string;
  description: string;
  submitted_by?: string;
  open_rates?: number;
  visa_requested?: string;
}

export interface Report {
  id: string;
  type: string;
  generatedDate: string;
  data: any;
}

export interface Timesheet {
  id: string;
  employeeName: string;
  date: string;
  hoursWorked: number;
  project: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  applicant_id: string; // Added
}
