-- Ensure parents table has unique constraint on email (if not already exists)
DO $$ 
BEGIN
    -- Check if constraint exists, if not add it
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'parents_email_key'
    ) THEN
        ALTER TABLE public.parents ADD CONSTRAINT parents_email_key UNIQUE (email);
    END IF;
END $$;

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