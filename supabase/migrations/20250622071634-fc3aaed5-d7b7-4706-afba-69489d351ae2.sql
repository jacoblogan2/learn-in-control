
-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('admin', 'student', 'lecturer');

-- Create enum for payment methods
CREATE TYPE public.payment_method AS ENUM ('mtn_mobile_money', 'orange_money', 'bank_transfer', 'cash', 'credit_card');

-- Create enum for fee types
CREATE TYPE public.fee_type AS ENUM ('tuition_fee', 'registration_fee', 'lab_fee', 'library_fee', 'exam_fee');

-- Create enum for invoice status
CREATE TYPE public.invoice_status AS ENUM ('pending', 'paid', 'overdue', 'partial');

-- Create enum for notification types
CREATE TYPE public.notification_type AS ENUM ('message', 'invoice', 'grade', 'attendance', 'general');

-- Create profiles table to store additional user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  registration_number TEXT UNIQUE,
  phone TEXT,
  address TEXT,
  profile_photo_url TEXT,
  language_preference TEXT DEFAULT 'english',
  theme_preference TEXT DEFAULT 'default',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  credits INTEGER DEFAULT 3,
  lecturer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  academic_year TEXT NOT NULL,
  semester TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create enrollments table (student-course relationship)
CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  enrollment_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'active',
  final_grade DECIMAL(4,2),
  UNIQUE(student_id, course_id)
);

-- Create invoices table
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  academic_year TEXT NOT NULL,
  fee_type fee_type NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status invoice_status DEFAULT 'pending',
  due_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method payment_method NOT NULL,
  payment_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  reference_number TEXT,
  stripe_payment_intent_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create grades table
CREATE TABLE public.grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  assignment_name TEXT NOT NULL,
  score DECIMAL(5,2) NOT NULL,
  max_score DECIMAL(5,2) NOT NULL DEFAULT 100,
  grade_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  lecturer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create attendance table
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  class_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  notes TEXT,
  marked_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, course_id, class_date)
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type notification_type NOT NULL,
  is_read BOOLEAN DEFAULT false,
  related_id UUID, -- Can reference invoices, messages, etc.
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create installment_plans table
CREATE TABLE public.installment_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
  installment_number INTEGER NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  due_date TIMESTAMPTZ NOT NULL,
  status invoice_status DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.installment_plans ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE user_id = user_uuid;
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile and admins can view all" ON public.profiles
  FOR SELECT USING (
    user_id = auth.uid() OR 
    public.get_user_role(auth.uid()) = 'admin'
  );

CREATE POLICY "Users can update their own profile and admins can update all" ON public.profiles
  FOR UPDATE USING (
    user_id = auth.uid() OR 
    public.get_user_role(auth.uid()) = 'admin'
  );

CREATE POLICY "Allow profile creation" ON public.profiles
  FOR INSERT WITH CHECK (true);

-- RLS Policies for courses
CREATE POLICY "Everyone can view courses" ON public.courses
  FOR SELECT USING (true);

CREATE POLICY "Admins and lecturers can manage courses" ON public.courses
  FOR ALL USING (
    public.get_user_role(auth.uid()) IN ('admin', 'lecturer')
  );

-- RLS Policies for enrollments
CREATE POLICY "Students can view their enrollments, admins and lecturers can view all" ON public.enrollments
  FOR SELECT USING (
    (SELECT user_id FROM public.profiles WHERE id = student_id) = auth.uid() OR
    public.get_user_role(auth.uid()) IN ('admin', 'lecturer')
  );

CREATE POLICY "Admins can manage enrollments" ON public.enrollments
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for invoices
CREATE POLICY "Students can view their invoices, admins can view all" ON public.invoices
  FOR SELECT USING (
    (SELECT user_id FROM public.profiles WHERE id = student_id) = auth.uid() OR
    public.get_user_role(auth.uid()) = 'admin'
  );

CREATE POLICY "Admins can manage invoices" ON public.invoices
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for payments
CREATE POLICY "Students can view their payments, admins can view all" ON public.payments
  FOR SELECT USING (
    (SELECT user_id FROM public.profiles WHERE id = student_id) = auth.uid() OR
    public.get_user_role(auth.uid()) = 'admin'
  );

CREATE POLICY "Students and admins can create payments" ON public.payments
  FOR INSERT WITH CHECK (
    (SELECT user_id FROM public.profiles WHERE id = student_id) = auth.uid() OR
    public.get_user_role(auth.uid()) = 'admin'
  );

-- RLS Policies for grades
CREATE POLICY "Students can view their grades, lecturers and admins can view relevant grades" ON public.grades
  FOR SELECT USING (
    (SELECT user_id FROM public.profiles WHERE id = student_id) = auth.uid() OR
    public.get_user_role(auth.uid()) IN ('admin', 'lecturer')
  );

CREATE POLICY "Lecturers and admins can manage grades" ON public.grades
  FOR ALL USING (
    public.get_user_role(auth.uid()) IN ('admin', 'lecturer')
  );

-- RLS Policies for attendance
CREATE POLICY "Students can view their attendance, lecturers and admins can view all" ON public.attendance
  FOR SELECT USING (
    (SELECT user_id FROM public.profiles WHERE id = student_id) = auth.uid() OR
    public.get_user_role(auth.uid()) IN ('admin', 'lecturer')
  );

CREATE POLICY "Lecturers and admins can manage attendance" ON public.attendance
  FOR ALL USING (
    public.get_user_role(auth.uid()) IN ('admin', 'lecturer')
  );

-- RLS Policies for messages
CREATE POLICY "Users can view messages they sent or received" ON public.messages
  FOR SELECT USING (
    (SELECT user_id FROM public.profiles WHERE id = sender_id) = auth.uid() OR
    (SELECT user_id FROM public.profiles WHERE id = receiver_id) = auth.uid() OR
    public.get_user_role(auth.uid()) = 'admin'
  );

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (
    (SELECT user_id FROM public.profiles WHERE id = sender_id) = auth.uid()
  );

CREATE POLICY "Users can update messages they sent" ON public.messages
  FOR UPDATE USING (
    (SELECT user_id FROM public.profiles WHERE id = sender_id) = auth.uid() OR
    (SELECT user_id FROM public.profiles WHERE id = receiver_id) = auth.uid()
  );

-- RLS Policies for notifications
CREATE POLICY "Users can view their notifications" ON public.notifications
  FOR SELECT USING (
    (SELECT user_id FROM public.profiles WHERE id = user_id) = auth.uid() OR
    public.get_user_role(auth.uid()) = 'admin'
  );

CREATE POLICY "System can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their notifications" ON public.notifications
  FOR UPDATE USING (
    (SELECT user_id FROM public.profiles WHERE id = user_id) = auth.uid()
  );

-- RLS Policies for installment_plans
CREATE POLICY "Students can view their installment plans, admins can view all" ON public.installment_plans
  FOR SELECT USING (
    (SELECT user_id FROM public.profiles WHERE id = (SELECT student_id FROM public.invoices WHERE id = invoice_id)) = auth.uid() OR
    public.get_user_role(auth.uid()) = 'admin'
  );

CREATE POLICY "Admins can manage installment plans" ON public.installment_plans
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'Name'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to generate registration numbers
CREATE OR REPLACE FUNCTION public.generate_registration_number()
RETURNS TEXT AS $$
DECLARE
  year_suffix TEXT;
  sequence_num INTEGER;
  reg_number TEXT;
BEGIN
  year_suffix := RIGHT(EXTRACT(YEAR FROM NOW())::TEXT, 2);
  
  SELECT COALESCE(MAX(CAST(RIGHT(registration_number, 4) AS INTEGER)), 0) + 1
  INTO sequence_num
  FROM public.profiles
  WHERE registration_number LIKE 'STU' || year_suffix || '%';
  
  reg_number := 'STU' || year_suffix || LPAD(sequence_num::TEXT, 4, '0');
  
  RETURN reg_number;
END;
$$ LANGUAGE plpgsql;

-- Update profiles table to auto-generate registration numbers for students
CREATE OR REPLACE FUNCTION public.set_registration_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'student' AND NEW.registration_number IS NULL THEN
    NEW.registration_number := public.generate_registration_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_registration_number_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_registration_number();
