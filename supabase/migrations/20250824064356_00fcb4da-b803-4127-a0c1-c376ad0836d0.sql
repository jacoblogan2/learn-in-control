-- Clean up duplicate parent emails, keeping only the first occurrence
WITH duplicates AS (
    SELECT id, 
           ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at) as rn
    FROM public.parents 
    WHERE email IS NOT NULL
)
DELETE FROM public.parents 
WHERE id IN (
    SELECT id FROM duplicates WHERE rn > 1
);

-- Now add the unique constraints
ALTER TABLE public.parents ADD CONSTRAINT parents_email_key UNIQUE (email);

-- Ensure students table has unique constraint on admission_number
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'students_admission_number_key'
    ) THEN
        ALTER TABLE public.students ADD CONSTRAINT students_admission_number_key UNIQUE (admission_number);
    END IF;
END $$;

-- Ensure teachers table has unique constraint on employee_id  
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'teachers_employee_id_key'
    ) THEN
        ALTER TABLE public.teachers ADD CONSTRAINT teachers_employee_id_key UNIQUE (employee_id);
    END IF;
END $$;