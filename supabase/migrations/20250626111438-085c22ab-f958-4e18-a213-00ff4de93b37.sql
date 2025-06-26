
-- First, let's update the user_role enum to include the new roles
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumtypid = 'user_role'::regtype AND enumlabel = 'lecturer') THEN
        ALTER TYPE user_role ADD VALUE 'lecturer';
    END IF;
END $$;

-- Create enum types for fee_type, invoice_status, payment_method, and notification_type
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fee_type') THEN
        CREATE TYPE fee_type AS ENUM ('tuition_fee', 'registration_fee', 'lab_fee', 'library_fee', 'exam_fee');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'invoice_status') THEN
        CREATE TYPE invoice_status AS ENUM ('pending', 'paid', 'overdue', 'partial');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method') THEN
        CREATE TYPE payment_method AS ENUM ('mtn_mobile_money', 'orange_money', 'bank_transfer', 'cash', 'credit_card');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
        CREATE TYPE notification_type AS ENUM ('message', 'invoice', 'grade', 'attendance', 'general');
    END IF;
END $$;

-- Create a courses table for class management
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  credits INTEGER DEFAULT 3,
  academic_year TEXT NOT NULL,
  semester TEXT NOT NULL,
  lecturer_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create enrollments table to link students to courses
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.profiles(id),
  course_id UUID NOT NULL REFERENCES public.courses(id),
  enrollment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'active',
  final_grade NUMERIC,
  UNIQUE(student_id, course_id)
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.profiles(id),
  course_id UUID NOT NULL REFERENCES public.courses(id),
  class_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  marked_by UUID REFERENCES public.profiles(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create grades table
CREATE TABLE IF NOT EXISTS public.grades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.profiles(id),
  course_id UUID NOT NULL REFERENCES public.courses(id),
  assignment_name TEXT NOT NULL,
  score NUMERIC NOT NULL,
  max_score NUMERIC NOT NULL DEFAULT 100,
  grade_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  lecturer_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invoices table for fee management
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.profiles(id),
  academic_year TEXT NOT NULL,
  fee_type fee_type NOT NULL,
  amount NUMERIC NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status invoice_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES public.invoices(id),
  student_id UUID NOT NULL REFERENCES public.profiles(id),
  amount NUMERIC NOT NULL,
  payment_method payment_method NOT NULL,
  payment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reference_number TEXT,
  stripe_payment_intent_id TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create installment_plans table
CREATE TABLE IF NOT EXISTS public.installment_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES public.invoices(id),
  installment_number INTEGER NOT NULL,
  amount NUMERIC NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status invoice_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table for communication
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES public.profiles(id),
  receiver_id UUID NOT NULL REFERENCES public.profiles(id),
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type notification_type NOT NULL,
  related_id UUID,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update profiles table to include additional fields
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'theme_preference') THEN
        ALTER TABLE public.profiles ADD COLUMN theme_preference TEXT DEFAULT 'default';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'language_preference') THEN
        ALTER TABLE public.profiles ADD COLUMN language_preference TEXT DEFAULT 'english';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'profile_photo_url') THEN
        ALTER TABLE public.profiles ADD COLUMN profile_photo_url TEXT;
    END IF;
END $$;

-- Update the registration number generation to work for students only
CREATE OR REPLACE FUNCTION public.set_registration_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'student' AND NEW.registration_number IS NULL THEN
    NEW.registration_number := public.generate_registration_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for setting registration numbers
DROP TRIGGER IF EXISTS set_registration_number_trigger ON public.profiles;
CREATE TRIGGER set_registration_number_trigger
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_registration_number();

-- Enable RLS on all tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.installment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user role (if it doesn't exist)
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE user_id = user_uuid;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Drop existing policies before creating new ones to avoid conflicts
DO $$ 
BEGIN
    -- Drop policies for courses
    DROP POLICY IF EXISTS "Anyone can view courses" ON public.courses;
    DROP POLICY IF EXISTS "Admins can manage courses" ON public.courses;
    DROP POLICY IF EXISTS "Lecturers can update their courses" ON public.courses;
    
    -- Drop policies for enrollments
    DROP POLICY IF EXISTS "Students can view their enrollments" ON public.enrollments;
    DROP POLICY IF EXISTS "Admins can manage enrollments" ON public.enrollments;
    
    -- Drop policies for attendance
    DROP POLICY IF EXISTS "Students can view their attendance" ON public.attendance;
    DROP POLICY IF EXISTS "Lecturers and admins can manage attendance" ON public.attendance;
    
    -- Drop policies for grades
    DROP POLICY IF EXISTS "Students can view their grades" ON public.grades;
    DROP POLICY IF EXISTS "Lecturers and admins can manage grades" ON public.grades;
    
    -- Drop policies for invoices
    DROP POLICY IF EXISTS "Students can view their invoices" ON public.invoices;
    DROP POLICY IF EXISTS "Admins can manage invoices" ON public.invoices;
    
    -- Drop policies for payments
    DROP POLICY IF EXISTS "Students can view their payments" ON public.payments;
    DROP POLICY IF EXISTS "Students can create payments" ON public.payments;
    DROP POLICY IF EXISTS "Admins can manage payments" ON public.payments;
    
    -- Drop policies for installment_plans
    DROP POLICY IF EXISTS "Students can view their installment plans" ON public.installment_plans;
    DROP POLICY IF EXISTS "Admins can manage installment plans" ON public.installment_plans;
    
    -- Drop policies for messages
    DROP POLICY IF EXISTS "Users can view their messages" ON public.messages;
    DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
    DROP POLICY IF EXISTS "Users can update their messages" ON public.messages;
    DROP POLICY IF EXISTS "Admins can manage all messages" ON public.messages;
    
    -- Drop policies for notifications
    DROP POLICY IF EXISTS "Users can view their notifications" ON public.notifications;
    DROP POLICY IF EXISTS "Admins can manage notifications" ON public.notifications;
    DROP POLICY IF EXISTS "Users can update their notifications" ON public.notifications;
END $$;

-- RLS Policies for courses
CREATE POLICY "Anyone can view courses" ON public.courses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage courses" ON public.courses FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin');
CREATE POLICY "Lecturers can update their courses" ON public.courses FOR UPDATE TO authenticated USING (lecturer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- RLS Policies for enrollments
CREATE POLICY "Students can view their enrollments" ON public.enrollments FOR SELECT TO authenticated USING (student_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR public.get_user_role(auth.uid()) IN ('admin', 'lecturer'));
CREATE POLICY "Admins can manage enrollments" ON public.enrollments FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for attendance
CREATE POLICY "Students can view their attendance" ON public.attendance FOR SELECT TO authenticated USING (student_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR public.get_user_role(auth.uid()) IN ('admin', 'lecturer'));
CREATE POLICY "Lecturers and admins can manage attendance" ON public.attendance FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) IN ('admin', 'lecturer'));

-- RLS Policies for grades
CREATE POLICY "Students can view their grades" ON public.grades FOR SELECT TO authenticated USING (student_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR public.get_user_role(auth.uid()) IN ('admin', 'lecturer'));
CREATE POLICY "Lecturers and admins can manage grades" ON public.grades FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) IN ('admin', 'lecturer'));

-- RLS Policies for invoices
CREATE POLICY "Students can view their invoices" ON public.invoices FOR SELECT TO authenticated USING (student_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR public.get_user_role(auth.uid()) = 'admin');
CREATE POLICY "Admins can manage invoices" ON public.invoices FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for payments
CREATE POLICY "Students can view their payments" ON public.payments FOR SELECT TO authenticated USING (student_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR public.get_user_role(auth.uid()) = 'admin');
CREATE POLICY "Students can create payments" ON public.payments FOR INSERT TO authenticated WITH CHECK (student_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR public.get_user_role(auth.uid()) = 'admin');
CREATE POLICY "Admins can manage payments" ON public.payments FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for installment_plans
CREATE POLICY "Students can view their installment plans" ON public.installment_plans FOR SELECT TO authenticated USING (
  invoice_id IN (SELECT id FROM public.invoices WHERE student_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())) 
  OR public.get_user_role(auth.uid()) = 'admin'
);
CREATE POLICY "Admins can manage installment plans" ON public.installment_plans FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for messages
CREATE POLICY "Users can view their messages" ON public.messages FOR SELECT TO authenticated USING (
  sender_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) 
  OR receiver_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  OR public.get_user_role(auth.uid()) = 'admin'
);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT TO authenticated WITH CHECK (
  sender_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Users can update their messages" ON public.messages FOR UPDATE TO authenticated USING (
  sender_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) 
  OR receiver_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage all messages" ON public.messages FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for notifications
CREATE POLICY "Users can view their notifications" ON public.notifications FOR SELECT TO authenticated USING (
  user_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  OR public.get_user_role(auth.uid()) = 'admin'
);
CREATE POLICY "Admins can manage notifications" ON public.notifications FOR ALL TO authenticated USING (public.get_user_role(auth.uid()) = 'admin');
CREATE POLICY "Users can update their notifications" ON public.notifications FOR UPDATE TO authenticated USING (
  user_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

-- Enable realtime for relevant tables
ALTER publication supabase_realtime ADD TABLE public.messages;
ALTER publication supabase_realtime ADD TABLE public.notifications;
