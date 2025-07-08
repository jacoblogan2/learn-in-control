-- Fix infinite recursion in RLS policies by removing problematic policies and creating proper ones

-- Drop the problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Students and parents can view student profiles, admins and lect" ON public.students;
DROP POLICY IF EXISTS "Student-parent relationships viewable by related users and admi" ON public.student_parents;

-- Create a simple, non-recursive policy for students
CREATE POLICY "Students can view their own profile"
ON public.students
FOR SELECT
USING (linked_user_id = auth.uid());

CREATE POLICY "Admins and lecturers can view all students"
ON public.students
FOR SELECT
USING (get_user_role(auth.uid()) = ANY (ARRAY['admin'::user_role, 'lecturer'::user_role]));

-- Create a simple policy for student_parents relationships
CREATE POLICY "Admins can view all student-parent relationships"
ON public.student_parents
FOR SELECT
USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- Allow parents to view their relationships through a separate policy
CREATE POLICY "Parents can view their own relationships"
ON public.student_parents
FOR SELECT
USING (
  parent_id IN (
    SELECT id FROM public.parents WHERE linked_user_id = auth.uid()
  )
);