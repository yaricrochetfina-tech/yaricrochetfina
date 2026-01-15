-- Create rate_limits table for distributed rate limiting
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier text NOT NULL,
  action_type text NOT NULL,
  request_count integer NOT NULL DEFAULT 1,
  window_start timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create unique index for efficient lookup and upsert
CREATE UNIQUE INDEX IF NOT EXISTS idx_rate_limits_identifier_action 
ON public.rate_limits (identifier, action_type);

-- Create index for cleanup queries
CREATE INDEX IF NOT EXISTS idx_rate_limits_window_start 
ON public.rate_limits (window_start);

-- Enable RLS (only service_role should access this)
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- No public policies - only service_role can access this table

-- Create the check_rate_limit function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_identifier text,
  p_action_type text,
  p_max_requests integer,
  p_window_seconds integer
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_count integer;
  v_window_start timestamp with time zone;
  v_now timestamp with time zone := now();
  v_window_duration interval := (p_window_seconds || ' seconds')::interval;
BEGIN
  -- Clean up old entries (older than 1 hour) - do this occasionally
  IF random() < 0.01 THEN
    DELETE FROM public.rate_limits
    WHERE window_start < v_now - interval '1 hour';
  END IF;

  -- Try to get existing rate limit record
  SELECT request_count, window_start 
  INTO v_current_count, v_window_start
  FROM public.rate_limits
  WHERE identifier = p_identifier AND action_type = p_action_type
  FOR UPDATE;

  -- If no record exists or window has expired, create/reset
  IF v_current_count IS NULL OR v_window_start + v_window_duration < v_now THEN
    INSERT INTO public.rate_limits (identifier, action_type, request_count, window_start)
    VALUES (p_identifier, p_action_type, 1, v_now)
    ON CONFLICT (identifier, action_type) 
    DO UPDATE SET 
      request_count = 1,
      window_start = v_now;
    
    RETURN jsonb_build_object(
      'allowed', true,
      'remaining', p_max_requests - 1,
      'reset_at', extract(epoch from v_now + v_window_duration)::bigint
    );
  END IF;

  -- Check if rate limit exceeded
  IF v_current_count >= p_max_requests THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'remaining', 0,
      'reset_at', extract(epoch from v_window_start + v_window_duration)::bigint
    );
  END IF;

  -- Increment counter
  UPDATE public.rate_limits 
  SET request_count = request_count + 1
  WHERE identifier = p_identifier AND action_type = p_action_type;

  RETURN jsonb_build_object(
    'allowed', true,
    'remaining', p_max_requests - v_current_count - 1,
    'reset_at', extract(epoch from v_window_start + v_window_duration)::bigint
  );
END;
$$;

-- Revoke execute from public roles - only service_role should call this
REVOKE EXECUTE ON FUNCTION public.check_rate_limit(text, text, integer, integer) FROM public;
REVOKE EXECUTE ON FUNCTION public.check_rate_limit(text, text, integer, integer) FROM anon;
REVOKE EXECUTE ON FUNCTION public.check_rate_limit(text, text, integer, integer) FROM authenticated;