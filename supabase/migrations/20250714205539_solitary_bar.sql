/*
  # RecruitIQ ATS Database Schema

  1. New Tables
    - `departments`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `created_at` (timestamp)
    
    - `requirements`
      - `id` (uuid, primary key)
      - `title` (text)
      - `department_id` (uuid, foreign key)
      - `location` (text)
      - `type` (text - Full-time, Part-time, Contract)
      - `status` (text - Open, Closed, On Hold)
      - `posted_date` (date)
      - `deadline` (date)
      - `description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `applicants`
      - `id` (uuid, primary key)
      - `full_name` (text)
      - `email` (text, unique)
      - `phone` (text)
      - `location` (text)
      - `visa_status` (text)
      - `visa_validity` (date)
      - `skills` (text)
      - `comments` (text)
      - `status` (text - Applied, Screening, Interview, Hired, Rejected)
      - `applied_date` (date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `applications`
      - `id` (uuid, primary key)
      - `applicant_id` (uuid, foreign key)
      - `requirement_id` (uuid, foreign key)
      - `status` (text)
      - `applied_date` (date)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `timesheets`
      - `id` (uuid, primary key)
      - `employee_name` (text)
      - `date` (date)
      - `hours_worked` (decimal)
      - `project` (text)
      - `status` (text - Pending, Approved, Rejected)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `activities`
      - `id` (uuid, primary key)
      - `action` (text)
      - `entity_type` (text)
      - `entity_id` (uuid)
      - `details` (jsonb)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage data
    
  3. Relationships
    - Requirements belong to departments
    - Applications link applicants to requirements
    - Activities track all system changes
*/

-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create requirements table
CREATE TABLE IF NOT EXISTS requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  department_id uuid REFERENCES departments(id),
  location text NOT NULL,
  type text NOT NULL CHECK (type IN ('Full-time', 'Part-time', 'Contract')),
  status text NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Closed', 'On Hold')),
  posted_date date DEFAULT CURRENT_DATE,
  deadline date,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create applicants table
CREATE TABLE IF NOT EXISTS applicants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  location text NOT NULL,
  visa_status text NOT NULL,
  visa_validity date,
  skills text NOT NULL,
  comments text,
  status text NOT NULL DEFAULT 'Applied' CHECK (status IN ('Applied', 'Screening', 'Interview', 'Hired', 'Rejected')),
  applied_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create applications table (junction table)
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id uuid REFERENCES applicants(id) ON DELETE CASCADE,
  requirement_id uuid REFERENCES requirements(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'Applied' CHECK (status IN ('Applied', 'Screening', 'Interview', 'Hired', 'Rejected')),
  applied_date date DEFAULT CURRENT_DATE,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(applicant_id, requirement_id)
);

-- Create timesheets table
CREATE TABLE IF NOT EXISTS timesheets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_name text NOT NULL,
  date date NOT NULL,
  hours_worked decimal(4,2) NOT NULL,
  project text NOT NULL,
  status text NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create activities table for tracking system changes
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE timesheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON departments
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users" ON requirements
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users" ON applicants
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users" ON applications
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users" ON timesheets
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users" ON activities
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Insert sample departments
INSERT INTO departments (name, description) VALUES
  ('Engineering', 'Software development and technical roles'),
  ('Product', 'Product management and strategy'),
  ('Design', 'UI/UX and graphic design'),
  ('Marketing', 'Marketing and brand management'),
  ('Sales', 'Sales and business development'),
  ('Analytics', 'Data analysis and business intelligence')
ON CONFLICT DO NOTHING;

-- Insert sample requirements
INSERT INTO requirements (title, department_id, location, type, status, posted_date, deadline, description) VALUES
  ('Senior Software Engineer', (SELECT id FROM departments WHERE name = 'Engineering'), 'San Francisco, CA', 'Full-time', 'Open', '2024-01-10', '2024-02-10', 'We are looking for a senior software engineer to join our team...'),
  ('Product Manager', (SELECT id FROM departments WHERE name = 'Product'), 'New York, NY', 'Full-time', 'Open', '2024-01-12', '2024-02-15', 'Seeking an experienced product manager to lead our product initiatives...'),
  ('UX Designer', (SELECT id FROM departments WHERE name = 'Design'), 'Remote', 'Contract', 'Closed', '2024-01-05', '2024-01-25', 'Looking for a creative UX designer to enhance user experience...'),
  ('Data Analyst', (SELECT id FROM departments WHERE name = 'Analytics'), 'Chicago, IL', 'Full-time', 'On Hold', '2024-01-08', '2024-02-08', 'We need a data analyst to help us make data-driven decisions...'),
  ('Marketing Specialist', (SELECT id FROM departments WHERE name = 'Marketing'), 'Los Angeles, CA', 'Part-time', 'Open', '2024-01-14', '2024-02-20', 'Join our marketing team to drive brand awareness and growth...')
ON CONFLICT DO NOTHING;

-- Insert sample timesheets
INSERT INTO timesheets (employee_name, date, hours_worked, project, status) VALUES
  ('John Smith', '2024-01-15', 8.5, 'Project Alpha', 'Approved'),
  ('Sarah Johnson', '2024-01-15', 7.0, 'Project Beta', 'Pending'),
  ('Mike Davis', '2024-01-14', 8.0, 'Project Gamma', 'Approved'),
  ('Emma Wilson', '2024-01-14', 6.5, 'Project Alpha', 'Rejected'),
  ('David Chen', '2024-01-13', 9.0, 'Project Delta', 'Pending'),
  ('Lisa Garcia', '2024-01-13', 7.5, 'Project Beta', 'Approved')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_requirements_department ON requirements(department_id);
CREATE INDEX IF NOT EXISTS idx_requirements_status ON requirements(status);
CREATE INDEX IF NOT EXISTS idx_applicants_email ON applicants(email);
CREATE INDEX IF NOT EXISTS idx_applicants_status ON applicants(status);
CREATE INDEX IF NOT EXISTS idx_applications_applicant ON applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_applications_requirement ON applications(requirement_id);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_requirements_updated_at BEFORE UPDATE ON requirements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applicants_updated_at BEFORE UPDATE ON applicants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_timesheets_updated_at BEFORE UPDATE ON timesheets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
