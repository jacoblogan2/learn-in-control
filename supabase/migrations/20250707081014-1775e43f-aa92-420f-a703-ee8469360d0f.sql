-- Comprehensive Database Cleanup and Schema Updates (Fixed)

-- 1. Clean up all existing demo/mock data from all tables
DELETE FROM public.payments;
DELETE FROM public.installment_plans;
DELETE FROM public.invoices;
DELETE FROM public.student_parents;
DELETE FROM public.grades;
DELETE FROM public.enrollments;
DELETE FROM public.attendance;
DELETE FROM public.messages;
DELETE FROM public.notifications;
DELETE FROM public.students;
DELETE FROM public.parents;
DELETE FROM public.teachers;
DELETE FROM public.accounts;
DELETE FROM public.courses;

-- 2. Add parent_id column to students table for primary parent relationship
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS primary_parent_id UUID REFERENCES public.parents(id);

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_primary_parent_id ON public.students(primary_parent_id);
CREATE INDEX IF NOT EXISTS idx_payments_student_id ON public.payments(student_id);
CREATE INDEX IF NOT EXISTS idx_student_parents_student_id ON public.student_parents(student_id);
CREATE INDEX IF NOT EXISTS idx_student_parents_parent_id ON public.student_parents(parent_id);
CREATE INDEX IF NOT EXISTS idx_teachers_employee_id ON public.teachers(employee_id);
CREATE INDEX IF NOT EXISTS idx_students_admission_number ON public.students(admission_number);

-- 4. Add constraints for data integrity (using DO blocks to handle existing constraints)
DO $$
BEGIN
    -- Add unique constraint on admission_number if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'unique_admission_number' 
        AND conrelid = 'public.students'::regclass
    ) THEN
        ALTER TABLE public.students ADD CONSTRAINT unique_admission_number UNIQUE (admission_number);
    END IF;
    
    -- Add unique constraint on employee_id if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'unique_employee_id' 
        AND conrelid = 'public.teachers'::regclass
    ) THEN
        ALTER TABLE public.teachers ADD CONSTRAINT unique_employee_id UNIQUE (employee_id);
    END IF;
END
$$;