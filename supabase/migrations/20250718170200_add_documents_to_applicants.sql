/*
  # Add Resume and Supporting Documents fields to applicants table

  1. Changes
    - Add resume_url column to applicants table (text field for single URL)
    - Add supporting_documents_urls column to applicants table (jsonb for array of URLs)

  2. Security
    - Maintain existing RLS policies for applicants table.
    - Ensure RLS policies are configured for the 'applicant-documents' storage bucket to allow inserts.
*/

-- Add resume_url field to applicants table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'applicants' AND column_name = 'resume_url'
  ) THEN
    ALTER TABLE applicants ADD COLUMN resume_url text;
  END IF;
END $$;

-- Add supporting_documents_urls field to applicants table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'applicants' AND column_name = 'supporting_documents_urls'
  ) THEN
    ALTER TABLE applicants ADD COLUMN supporting_documents_urls jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;
