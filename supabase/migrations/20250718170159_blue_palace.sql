/*
  # Add CN Number field to applicants table

  1. Changes
    - Add cn_number column to applicants table (optional text field)
    - Update existing records to have empty cn_number by default

  2. Security
    - Maintain existing RLS policies
*/

-- Add CN Number field to applicants table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'applicants' AND column_name = 'cn_number'
  ) THEN
    ALTER TABLE applicants ADD COLUMN cn_number text DEFAULT '';
  END IF;
END $$;
