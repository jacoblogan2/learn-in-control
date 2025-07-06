-- First, let's extend the user_role ENUM to include 'parent'
ALTER TYPE public.user_role ADD VALUE 'parent';

-- Let's also check if there are any invalid role values in the profiles table
-- and update the get_user_role function to handle null cases properly
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
RETURNS user_role
LANGUAGE sql
STABLE SECURITY DEFINER
AS $function$
  SELECT COALESCE(role, 'student'::user_role) FROM public.profiles WHERE user_id = user_uuid;
$function$;