import { useState } from 'react';
import { supabase, Database } from '../lib/supabase'; // Import supabase client for real storage operations

type ApplicantRow = Database['public']['Tables']['applicants']['Row'];

// Empty arrays for fresh start - all mock data removed
const mockApplicants: (ApplicantRow & { applications?: any[] })[] = [];

const mockRequirements = [];

const mockTimesheets = [];

const mockActivities = [];

const mockDepartments = [
  { id: '1', name: 'Engineering', description: 'Software development and technical roles', created_at: '2024-01-01T00:00:00Z' },
  { id: '2', name: 'Product', description: 'Product management and strategy', created_at: '2024-01-01T00:00:00Z' },
  { id: '3', name: 'Design', description: 'UI/UX and graphic design', created_at: '2024-01-01T00:00:00Z' },
  { id: '4', name: 'Marketing', description: 'Marketing and brand management', created_at: '2024-01-01T00:00:00Z' },
  { id: '5', name: 'Sales', description: 'Sales and business development', created_at: '2024-01-01T00:00:00Z' },
  { id: '6', name: 'Analytics', description: 'Data analysis and business intelligence', created_at: '2024-01-01T00:00:00Z' }
];

// Custom hook for data operations
export const useSupabase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAsync = async <T>(operation: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
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
    bulkCreateApplicants,
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