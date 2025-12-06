-- Drop existing insert policy
DROP POLICY IF EXISTS "Anyone can create contact messages" ON public.contact_messages;

-- Create new policy that allows anonymous and authenticated users to insert
CREATE POLICY "Anyone can create contact messages" 
ON public.contact_messages 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);