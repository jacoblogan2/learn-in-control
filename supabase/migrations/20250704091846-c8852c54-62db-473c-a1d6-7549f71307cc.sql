-- Create students table
CREATE TABLE IF NOT EXISTS public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  linked_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  address TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
  admission_number TEXT UNIQUE,
  roll_number TEXT,
  class_name TEXT,
  section TEXT,
  religion TEXT,
  nationality TEXT,
  father_name TEXT,
  mother_name TEXT,
  father_occupation TEXT,
  mother_occupation TEXT,
  present_address TEXT,
  permanent_address TEXT,
  student_photo_url TEXT,
  parent_photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create teachers table
CREATE TABLE IF NOT EXISTS public.teachers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  linked_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  address TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
  employee_id TEXT UNIQUE,
  subject TEXT,
  class_assigned TEXT,
  section_assigned TEXT,
  religion TEXT,
  qualification TEXT,
  experience_years INTEGER DEFAULT 0,
  teacher_photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create parents table
CREATE TABLE IF NOT EXISTS public.parents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  linked_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
  occupation TEXT,
  relationship_to_student TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student_parent relationship table
CREATE TABLE IF NOT EXISTS public.student_parents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  parent_id UUID NOT NULL REFERENCES public.parents(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL CHECK (relationship_type IN ('father', 'mother', 'guardian')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, parent_id, relationship_type)
);

-- Create accounts table for system-level admin users
CREATE TABLE IF NOT EXISTS public.accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  linked_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  account_type TEXT NOT NULL CHECK (account_type IN ('admin', 'finance', 'accountant', 'registrar')),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  department TEXT,
  permissions TEXT[], -- Array of permission strings
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for students
CREATE POLICY "Students can view their own profile, admins and lecturers can view all"
ON public.students FOR SELECT
USING (
  (linked_user_id = auth.uid()) OR 
  (get_user_role(auth.uid()) = ANY (ARRAY['admin'::user_role, 'lecturer'::user_role]))
);

CREATE POLICY "Admins can manage students"
ON public.students FOR ALL
USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- Create RLS policies for teachers
CREATE POLICY "Teachers can view their own profile, admins can view all"
ON public.teachers FOR SELECT
USING (
  (linked_user_id = auth.uid()) OR 
  (get_user_role(auth.uid()) = 'admin'::user_role)
);

CREATE POLICY "Admins can manage teachers"
ON public.teachers FOR ALL
USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- Create RLS policies for parents
CREATE POLICY "Parents can view their own profile, admins can view all"
ON public.parents FOR SELECT
USING (
  (linked_user_id = auth.uid()) OR 
  (get_user_role(auth.uid()) = 'admin'::user_role)
);

CREATE POLICY "Admins can manage parents"
ON public.parents FOR ALL
USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- Create RLS policies for student_parents relationship
CREATE POLICY "Student-parent relationships viewable by related users and admins"
ON public.student_parents FOR SELECT
USING (
  (student_id IN (SELECT id FROM public.students WHERE linked_user_id = auth.uid())) OR
  (parent_id IN (SELECT id FROM public.parents WHERE linked_user_id = auth.uid())) OR
  (get_user_role(auth.uid()) = 'admin'::user_role)
);

CREATE POLICY "Admins can manage student-parent relationships"
ON public.student_parents FOR ALL
USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- Create RLS policies for accounts
CREATE POLICY "Users can view their own account, admins can view all"
ON public.accounts FOR SELECT
USING (
  (linked_user_id = auth.uid()) OR 
  (get_user_role(auth.uid()) = 'admin'::user_role)
);

CREATE POLICY "Admins can manage accounts"
ON public.accounts FOR ALL
USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teachers_updated_at
  BEFORE UPDATE ON public.teachers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_parents_updated_at
  BEFORE UPDATE ON public.parents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at
  BEFORE UPDATE ON public.accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_linked_user_id ON public.students(linked_user_id);
CREATE INDEX IF NOT EXISTS idx_students_admission_number ON public.students(admission_number);
CREATE INDEX IF NOT EXISTS idx_teachers_linked_user_id ON public.teachers(linked_user_id);
CREATE INDEX IF NOT EXISTS idx_teachers_employee_id ON public.teachers(employee_id);
CREATE INDEX IF NOT EXISTS idx_parents_linked_user_id ON public.parents(linked_user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_linked_user_id ON public.accounts(linked_user_id);
CREATE INDEX IF NOT EXISTS idx_student_parents_student_id ON public.student_parents(student_id);
CREATE INDEX IF NOT EXISTS idx_student_parents_parent_id ON public.student_parents(parent_id);