-- First, let's extend the user_role ENUM to include 'parent'
ALTER TYPE public.user_role ADD VALUE 'parent';

-- The profiles table has role as text, but we need to handle the type mismatch
-- Let's update the get_user_role function to cast properly
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
RETURNS user_role
LANGUAGE sql
STABLE SECURITY DEFINER
AS $function$
  SELECT COALESCE(role::user_role, 'student'::user_role) FROM public.profiles WHERE user_id = user_uuid;
$function$;