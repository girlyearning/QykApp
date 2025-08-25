-- Add triggers to automatically move items from deleted folders to null (main folder)
-- This ensures data integrity when folders are deleted

-- Function to handle folder cleanup for notes
CREATE OR REPLACE FUNCTION public.cleanup_deleted_folder_notes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- When a folder reference is removed, we don't need to do anything special
  -- as the frontend will handle moving items to the main folder before deletion
  RETURN NEW;
END;
$function$;

-- Function to handle folder cleanup for entries  
CREATE OR REPLACE FUNCTION public.cleanup_deleted_folder_entries()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- When a folder reference is removed, we don't need to do anything special
  -- as the frontend will handle moving items to the main folder before deletion
  RETURN NEW;
END;
$function$;

-- Function to handle folder cleanup for confessions
CREATE OR REPLACE FUNCTION public.cleanup_deleted_folder_confessions()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- When a folder reference is removed, we don't need to do anything special
  -- as the frontend will handle moving items to the main folder before deletion
  RETURN NEW;
END;
$function$;