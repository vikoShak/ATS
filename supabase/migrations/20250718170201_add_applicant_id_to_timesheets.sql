/*
  # Add applicant_id to timesheets table

  1. Changes
    - Add `applicant_id` column to `timesheets` table, making it NOT NULL.
    - Establish a foreign key relationship to `applicants.id`.
    - Update RLS policies for `timesheets` to reflect the new column.
*/

-- Add applicant_id column
ALTER TABLE timesheets
ADD COLUMN applicant_id uuid NOT NULL REFERENCES applicants(id);

-- If you want to remove the employee_name column as it's now redundant, uncomment the line below:
-- ALTER TABLE timesheets DROP COLUMN employee_name;

-- No change needed for the existing broad RLS policy, as it already covers new columns.
