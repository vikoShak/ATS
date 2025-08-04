import { useState } from 'react';
import { supabase, Database } from '../lib/supabase'; // Import supabase client for real storage operations

type ApplicantRow = Database['public']['Tables']['applicants']['Row'];

// Mock data for demo purposes
const mockApplicants: (ApplicantRow & { applications?: any[] })[] = [
  {
    id: '1',
    full_name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1-555-0123',
    location: 'New York, NY',
    visa_status: 'USC',
    visa_validity: '2025-12-31',
    skills: 'JavaScript, React, Node.js',
    comments: 'Experienced developer with strong frontend skills',
    status: 'Applied',
    applied_date: '2024-01-15',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    resume_url: null,
    supporting_documents_urls: [],
    source: 'LinkedIn',
    taxTerm: 'Corp-to-Corp',
    payRate: 75,
    submissionRate: 85,
    applications: [{
      id: '1',
      requirement_id: '1',
      status: 'Applied',
      requirements: {
        title: 'Senior Software Engineer',
        department_id: '1',
        departments: { name: 'Engineering' }
      }
    }]
  },
  {
    id: '2',
    full_name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1-555-0124',
    location: 'San Francisco, CA',
    visa_status: 'H1B Holder',
    visa_validity: '2025-06-30',
    skills: 'Python, Django, PostgreSQL',
    comments: 'Backend specialist with database expertise',
    status: 'Screening',
    applied_date: '2024-01-14',
    created_at: '2024-01-14T09:30:00Z',
    updated_at: '2024-01-14T09:30:00Z',
    resume_url: null,
    supporting_documents_urls: [],
    source: 'Monster',
    taxTerm: 'W-2',
    payRate: 80,
    submissionRate: 95,
    applications: [{
      id: '2',
      requirement_id: '2',
      status: 'Screening',
      requirements: {
        title: 'Product Manager',
        department_id: '2',
        departments: { name: 'Product' }
      }
    }]
  },
  {
    id: '3',
    full_name: 'Mike Davis',
    email: 'mike.davis@email.com',
    phone: '+1-555-0125',
    location: 'Chicago, IL',
    visa_status: 'Green Card',
    visa_validity: null,
    skills: 'UI/UX Design, Figma, Adobe Creative Suite',
    comments: 'Creative designer with strong portfolio',
    status: 'Interview',
    applied_date: '2024-01-13',
    created_at: '2024-01-13T14:15:00Z',
    updated_at: '2024-01-13T14:15:00Z',
    resume_url: null,
    supporting_documents_urls: [],
    source: 'Dice',
    taxTerm: '1099',
    payRate: 65,
    submissionRate: 75,
    applications: [{
      id: '3',
      requirement_id: '3',
      status: 'Interview',
      requirements: {
        title: 'UX Designer',
        department_id: '3',
        departments: { name: 'Design' }
      }
    }]
  },
  {
    id: '6',
    cn_number: 'CN-002',
    full_name: 'Alex Thompson',
    email: 'alex.thompson@email.com',
    phone: '+1-555-0128',
    location: 'Seattle, WA',
    visa_status: 'Green Card',
    visa_validity: null,
    skills: 'Java, Spring Boot, Microservices',
    comments: 'Senior backend developer with cloud experience',
    status: 'Joined',
    applied_date: '2024-01-20',
    created_at: '2024-01-20T11:00:00Z',
    updated_at: '2024-01-20T11:00:00Z',
    source: 'LinkedIn',
    taxTerm: 'W-2',
    payRate: 85,
    submissionRate: 95,
    resume_url: null,
    supporting_documents_urls: [],
    applications: [{
      id: '6',
      requirement_id: '1',
      status: 'Joined',
      requirements: {
        title: 'Senior Backend Developer',
        department_id: '1',
        departments: { name: 'Engineering' }
      }
    }]
  }
];

const mockRequirements = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    requirement_number: 'REQ-001',
    customer_name: 'Acme Corp',
    department_id: '1',
    location: 'San Francisco, CA',
    type: 'Full-time',
    status: 'Open',
    posted_date: '2024-01-10',
    deadline: '2024-02-10',
    description: 'We are looking for a senior software engineer to join our team...',
    created_at: '2024-01-10T08:00:00Z',
    updated_at: '2024-01-10T08:00:00Z',
    departments: { name: 'Engineering' },
    applications: []
  },
  {
    id: '2',
    title: 'Product Manager',
    requirement_number: 'REQ-002',
    customer_name: 'Globex Inc.',
    department_id: '2',
    location: 'New York, NY',
    type: 'Full-time',
    status: 'Open',
    posted_date: '2024-01-12',
    deadline: '2024-02-15',
    description: 'Seeking an experienced product manager to lead our product initiatives...',
    created_at: '2024-01-12T09:00:00Z',
    updated_at: '2024-01-12T09:00:00Z',
    departments: { name: 'Product' },
    applications: []
  },
  {
    id: '3',
    title: 'UX Designer',
    requirement_number: 'REQ-003',
    customer_name: 'Initech',
    department_id: '3',
    location: 'Chicago, IL',
    type: 'Full-time',
    status: 'Open',
    posted_date: '2024-01-13',
    deadline: '2024-02-20',
    description: 'Creative designer with strong portfolio...',
    created_at: '2024-01-13T14:15:00Z',
    updated_at: '2024-01-13T14:15:00Z',
    departments: { name: 'Design' },
    applications: []
  }
];

const mockTimesheets = [
  {
    id: '1',
    employee_name: 'John Smith',
    date: '2024-01-15',
    hours_worked: 8.5,
    project: 'Project Alpha',
    status: 'Pending',
    created_at: '2024-01-15T17:00:00Z',
    updated_at: '2024-01-15T17:00:00Z'
  },
  {
    id: '2',
    employee_name: 'Sarah Johnson',
    date: '2024-01-15',
    hours_worked: 7.0,
    project: 'Project Beta',
    status: 'Approved',
    created_at: '2024-01-15T17:30:00Z',
    updated_at: '2024-01-15T17:30:00Z'
  }
];

const mockActivities = [
  {
    id: '1',
    action: 'New application received',
    entity_type: 'applicant',
    entity_id: '1',
    details: { name: 'John Smith' },
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    action: 'Application status updated',
    entity_type: 'applicant',
    entity_id: '2',
    details: { name: 'Sarah Johnson', status: 'Screening' },
    created_at: '2024-01-14T15:30:00Z'
  },
  {
    id: '3',
    action: 'New job posted',
    entity_type: 'requirement',
    entity_id: '1',
    details: { title: 'Senior Software Engineer' },
    created_at: '2024-01-10T08:00:00Z'
  }
];

const mockDepartments = [
  { id: '1', name: 'Engineering', description: 'Software development and technical roles', created_at: '2024-01-01T00:00:00Z' },
  { id: '2', name: 'Product', description: 'Product management and strategy', created_at: '2024-01-01T00:00:00Z' },
  { id: '3', name: 'Design', description: 'UI/UX and graphic design', created_at: '2024-01-01T00:00:00Z' },
  { id: '4', name: 'Marketing', description: 'Marketing and brand management', created_at: '2024-01-01T00:00:00Z' }
];

// Custom hook for mock data operations
export const useSupabase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAsync = async <T>(operation: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      // Removed setTimeout to fix TypeError: t._onTimeout is not a function
      // await new Promise(resolve => setTimeout(resolve, 500));
      const result = await operation();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Helper to simulate resume parsing from filename
  const _simulateResumeParsing = (file: File) => {
    const fileName = file.name.toLowerCase();
    let fullName = 'Unknown Applicant';
    let email = 'unknown@example.com';
    let phone = '+1-555-0000';

    // Attempt to extract name from filename (e.g., "John_Doe_Resume.pdf")
    const nameMatch = fileName.match(/^([a-z_]+)(_resume)?(\.pdf|\.doc|\.docx)?$/);
    if (nameMatch && nameMatch[1]) {
      fullName = nameMatch[1].replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      email = `${nameMatch[1].replace(/_/g, '.')}@example.com`;
      phone = `+1-555-${Math.floor(1000 + Math.random() * 9000)}`;
    } else {
      // Fallback for more complex names or if no clear pattern
      const parts = fileName.split('.')[0].split(/[-_ ]+/);
      if (parts.length > 1) {
        fullName = parts.slice(0, -1).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        email = `${parts[0].toLowerCase()}.${parts[1].toLowerCase()}@example.com`;
      } else {
        fullName = fileName.split('.')[0].replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        email = `${fileName.split('.')[0].toLowerCase().replace(/[^a-z0-9]/g, '')}@example.com`;
      }
    }

    return { full_name: fullName, email, phone };
  };

  // Applicants operations
  const getApplicants = () => handleAsync(async () => {
    return [...mockApplicants];
  });

  const createApplicant = async (applicantData: any, resumeFile: File | null, supportingDocumentFiles: File[], taggedRequirements: any[]) => {
    setLoading(true);
    setError(null);
    try {
      let resumeUrl: string | null = null;
      const supportingDocumentsUrls: string[] = [];

      // Real Supabase Storage upload (if VITE_SUPABASE_URL is set)
      if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
        // Ensure the 'applicant-documents' bucket exists in your Supabase project
        // and has appropriate RLS policies for inserts.
        if (resumeFile) {
          const { data, error: uploadError } = await supabase.storage
            .from('applicant-documents')
            .upload(`resumes/${Date.now()}-${resumeFile.name}`, resumeFile, {
              cacheControl: '3600',
              upsert: false,
            });
          if (uploadError) throw uploadError;
          resumeUrl = supabase.storage.from('applicant-documents').getPublicUrl(data.path).data.publicUrl;
        }

        for (const file of supportingDocumentFiles) {
          const { data, error: uploadError } = await supabase.storage
            .from('applicant-documents')
            .upload(`supporting/${Date.now()}-${file.name}`, file, {
              cacheControl: '3600',
              upsert: false,
            });
          if (uploadError) throw uploadError;
          supportingDocumentsUrls.push(supabase.storage.from('applicant-documents').getPublicUrl(data.path).data.publicUrl);
        }
      } else {
        // Mock upload for local development without Supabase env vars
        if (resumeFile) {
          resumeUrl = `https://mock-storage.com/resumes/${Date.now()}-${resumeFile.name}`;
        }
        for (const file of supportingDocumentFiles) {
          supportingDocumentsUrls.push(`https://mock-storage.com/supporting/${Date.now()}-${file.name}`);
        }
      }

      const newApplicantData = {
        ...applicantData,
        resume_url: resumeUrl,
        supporting_documents_urls: supportingDocumentsUrls,
      };

      // Insert applicant into mock data
      const newApplicant: ApplicantRow & { applications?: any[] } = {
        id: Date.now().toString(),
        ...newApplicantData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        applications: [] // Initialize applications array for mock
      };
      mockApplicants.push(newApplicant);

      // Create applications for tagged requirements
      if (taggedRequirements && taggedRequirements.length > 0) {
        for (const req of taggedRequirements) {
          const newApplication = {
            id: Date.now().toString() + Math.random().toString(36).substring(2, 9), // Unique ID
            applicant_id: newApplicant.id,
            requirement_id: req.id,
            status: 'Applied', // Default status for new application
            applied_date: newApplicant.applied_date,
            notes: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          // In a real scenario, you'd insert into 'applications' table here
          // For mock, we can just add it to the applicant's applications array
          newApplicant.applications?.push({
            ...newApplication,
            requirements: {
              title: req.title,
              department_id: req.department_id,
              departments: req.departments // Assuming departments is already joined in mock
            }
          });
        }
      }

      // Add to activities
      mockActivities.unshift({
        id: Date.now().toString(),
        action: 'New application received',
        entity_type: 'applicant',
        entity_id: newApplicant.id,
        details: { name: newApplicant.full_name, taggedRequirements: taggedRequirements.map((r: any) => r.title) },
        created_at: new Date().toISOString()
      });

      return newApplicant;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const bulkCreateApplicants = async (resumeFiles: File[]) => {
    setLoading(true);
    setError(null);
    const createdApplicants: (ApplicantRow & { applications?: any[] })[] = [];
    try {
      for (const file of resumeFiles) {
        const { full_name, email, phone } = _simulateResumeParsing(file);
        const applicantData = {
          full_name,
          email,
          phone,
          location: 'N/A', // Default for bulk upload
          visa_status: 'N/A', // Default for bulk upload
          skills: 'N/A', // Default for bulk upload
          comments: `Bulk uploaded resume: ${file.name}`,
          status: 'Applied',
          applied_date: new Date().toISOString().split('T')[0],
          source: 'Bulk Upload',
          taxTerm: 'N/A',
          payRate: 0,
          submissionRate: 0,
        };
        const newApplicant = await createApplicant(applicantData, file, [], []); // No supporting docs or tagged requirements for bulk
        if (newApplicant) {
          createdApplicants.push(newApplicant);
        }
      }
      return createdApplicants;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during bulk upload');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateApplicant = (id: string, updates: any) => handleAsync(async () => {
    const index = mockApplicants.findIndex(a => a.id === id);
    if (index !== -1) {
      mockApplicants[index] = { ...mockApplicants[index], ...updates, updated_at: new Date().toISOString() };
      
      // Add to activities
      mockActivities.unshift({
        id: Date.now().toString(),
        action: 'Applicant updated',
        entity_type: 'applicant',
        entity_id: id,
        details: { updates },
        created_at: new Date().toISOString()
      });
      
      return mockApplicants[index];
    }
    throw new Error('Applicant not found');
  });

  const deleteApplicant = (id: string) => handleAsync(async () => {
    const index = mockApplicants.findIndex(a => a.id === id);
    if (index !== -1) {
      mockApplicants.splice(index, 1);
      
      // Add to activities
      mockActivities.unshift({
        id: Date.now().toString(),
        action: 'Applicant deleted',
        entity_type: 'applicant',
        entity_id: id,
        details: {},
        created_at: new Date().toISOString()
      });
      
      return true;
    }
    throw new Error('Applicant not found');
  });

  // Requirements operations
  const getRequirements = () => handleAsync(async () => {
    return [...mockRequirements];
  });

  const createRequirement = (requirementData: any) => handleAsync(async () => {
    const newRequirement = {
      id: Date.now().toString(),
      ...requirementData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      departments: { name: requirementData.department || 'General' },
      applications: []
    };
    
    mockRequirements.push(newRequirement);
    
    // Add to activities
    mockActivities.unshift({
      id: Date.now().toString(),
      action: 'New job posted',
      entity_type: 'requirement',
      entity_id: newRequirement.id,
      details: { title: newRequirement.title },
      created_at: new Date().toISOString()
    });
    
    return newRequirement;
  });

  const updateRequirement = (id: string, updates: any) => handleAsync(async () => {
    const index = mockRequirements.findIndex(r => r.id === id);
    if (index !== -1) {
      mockRequirements[index] = { ...mockRequirements[index], ...updates, updated_at: new Date().toISOString() };
      
      // Add to activities
      mockActivities.unshift({
        id: Date.now().toString(),
        action: 'Job requirement updated',
        entity_type: 'requirement',
        entity_id: id,
        details: { updates },
        created_at: new Date().toISOString()
      });
      
      return mockRequirements[index];
    }
    throw new Error('Requirement not found');
  });

  const deleteRequirement = (id: string) => handleAsync(async () => {
    const index = mockRequirements.findIndex(r => r.id === id);
    if (index !== -1) {
      mockRequirements.splice(index, 1);
      
      // Add to activities
      mockActivities.unshift({
        id: Date.now().toString(),
        action: 'Job requirement deleted',
        entity_type: 'requirement',
        entity_id: id,
        details: {},
        created_at: new Date().toISOString()
      });
      
      return true;
    }
    throw new Error('Requirement not found');
  });

  // Applications operations
  const createApplication = (applicationData: any) => handleAsync(async () => {
    const newApplication = {
      id: Date.now().toString(),
      ...applicationData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return newApplication;
  });

  // Timesheets operations
  const getTimesheets = () => handleAsync(async () => {
    return [...mockTimesheets];
  });

  const updateTimesheetStatus = (id: string, status: string) => handleAsync(async () => {
    const index = mockTimesheets.findIndex(t => t.id === id);
    if (index !== -1) {
      mockTimesheets[index] = { ...mockTimesheets[index], status, updated_at: new Date().toISOString() };
      
      // Add to activities
      mockActivities.unshift({
        id: Date.now().toString(),
        action: `Timesheet ${status.toLowerCase()}`,
        entity_type: 'timesheet',
        entity_id: id,
        details: { status },
        created_at: new Date().toISOString()
      });
      
      return mockTimesheets[index];
    }
    throw new Error('Timesheet not found');
  });

  // Activities operations
  const getActivities = (limit = 10) => handleAsync(async () => {
    return mockActivities.slice(0, limit);
  });

  // Departments operations
  const getDepartments = () => handleAsync(async () => {
    return [...mockDepartments];
  });

  return {
    loading,
    error,
    // Applicants
    getApplicants,
    createApplicant,
    bulkCreateApplicants, // New bulk upload function
    updateApplicant,
    deleteApplicant,
    // Requirements
    getRequirements,
    createRequirement,
    updateRequirement,
    deleteRequirement,
    // Applications
    createApplication,
    // Timesheets
    getTimesheets,
    updateTimesheetStatus,
    // Activities
    getActivities,
    // Departments
    getDepartments,
  };
};
