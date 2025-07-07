-- Comprehensive Database Cleanup and Schema Updates

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

-- 2. Reset sequences for better ID generation
-- Note: Using UUID so no sequences to reset

-- 3. Add missing foreign key relationships for better data integrity

-- Add parent_id column to students table for primary parent relationship
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS primary_parent_id UUID REFERENCES public.parents(id);

-- Add student_id column to payments for direct relationship
-- (payments table already has student_id, but let's ensure it's properly set up)

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_primary_parent_id ON public.students(primary_parent_id);
CREATE INDEX IF NOT EXISTS idx_payments_student_id ON public.payments(student_id);
CREATE INDEX IF NOT EXISTS idx_student_parents_student_id ON public.student_parents(student_id);
CREATE INDEX IF NOT EXISTS idx_student_parents_parent_id ON public.student_parents(parent_id);
CREATE INDEX IF NOT EXISTS idx_teachers_employee_id ON public.teachers(employee_id);
CREATE INDEX IF NOT EXISTS idx_students_admission_number ON public.students(admission_number);

-- 5. Add constraints for data integrity
ALTER TABLE public.students 
ADD CONSTRAINT IF NOT EXISTS unique_admission_number UNIQUE (admission_number);

ALTER TABLE public.teachers 
ADD CONSTRAINT IF NOT EXISTS unique_employee_id UNIQUE (employee_id);

-- 6. Update RLS policies to ensure proper access control
-- Update students RLS to include parent access
DROP POLICY IF EXISTS "Students can view their own profile, admins and lecturers can v" ON public.students;
DROP POLICY IF EXISTS "Admins can manage students" ON public.students;

CREATE POLICY "Students and parents can view student profiles, admins and lecturers can view all"
ON public.students
FOR SELECT
USING (
  linked_user_id = auth.uid() OR 
  primary_parent_id IN (
    SELECT id FROM public.parents WHERE linked_user_id = auth.uid()
  ) OR
  id IN (
    SELECT student_id FROM public.student_parents 
    WHERE parent_id IN (
      SELECT id FROM public.parents WHERE linked_user_id = auth.uid()
    )
  ) OR
  get_user_role(auth.uid()) = ANY (ARRAY['admin'::user_role, 'lecturer'::user_role])
);

CREATE POLICY "Admins can manage students"
ON public.students
FOR ALL
USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- Update parents RLS to allow viewing their student's data
DROP POLICY IF EXISTS "Parents can view their own profile, admins can view all" ON public.parents;
DROP POLICY IF EXISTS "Admins can manage parents" ON public.parents;

CREATE POLICY "Parents can view their own profile, admins can view all"
ON public.parents
FOR SELECT
USING (
  linked_user_id = auth.uid() OR 
  get_user_role(auth.uid()) = 'admin'::user_role
);

CREATE POLICY "Admins can manage parents"
ON public.parents
FOR ALL
USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- 7. Create function to automatically link parent when student is created
CREATE OR REPLACE FUNCTION public.create_parent_student_relationship()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- If a primary_parent_id is set, also add to student_parents junction table
  IF NEW.primary_parent_id IS NOT NULL THEN
    INSERT INTO public.student_parents (student_id, parent_id, relationship_type)
    VALUES (NEW.id, NEW.primary_parent_id, 'primary')
    ON CONFLICT (student_id, parent_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for the function
DROP TRIGGER IF EXISTS create_parent_student_relationship_trigger ON public.students;
CREATE TRIGGER create_parent_student_relationship_trigger
  AFTER INSERT OR UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.create_parent_student_relationship();

-- 8. Add updated_at triggers for all tables
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all relevant tables
DROP TRIGGER IF EXISTS update_students_updated_at ON public.students;
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_parents_updated_at ON public.parents;
CREATE TRIGGER update_parents_updated_at
  BEFORE UPDATE ON public.parents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_teachers_updated_at ON public.teachers;
CREATE TRIGGER update_teachers_updated_at
  BEFORE UPDATE ON public.teachers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_accounts_updated_at ON public.accounts;
CREATE TRIGGER update_accounts_updated_at
  BEFORE UPDATE ON public.accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();