-- Add missing database function for page view increment
CREATE OR REPLACE FUNCTION increment_page_views(session_id text)
RETURNS void AS $$
BEGIN
  UPDATE analytics_sessions 
  SET page_views = page_views + 1 
  WHERE id = session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;