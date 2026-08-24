-- Auth and club bootstrap

-- Auth users receive a matching profile without granting anonymous table writes.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Creating a club and assigning its first administrator must be atomic. Direct
-- club inserts remain blocked by RLS so users cannot grant themselves access to
-- an existing club.
CREATE OR REPLACE FUNCTION public.create_club_with_admin(
  p_name TEXT,
  p_country_code TEXT,
  p_city TEXT DEFAULT NULL
)
RETURNS public.clubs
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  current_user_id UUID := auth.uid();
  selected_country_id UUID;
  new_club public.clubs;
BEGIN
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication is required';
  END IF;

  IF NULLIF(BTRIM(p_name), '') IS NULL THEN
    RAISE EXCEPTION 'Club name is required';
  END IF;

  SELECT id
    INTO selected_country_id
    FROM public.countries
   WHERE code = UPPER(BTRIM(p_country_code));

  IF selected_country_id IS NULL THEN
    RAISE EXCEPTION 'Unknown country code: %', p_country_code;
  END IF;

  INSERT INTO public.clubs (name, country_id, city, is_public)
  VALUES (BTRIM(p_name), selected_country_id, NULLIF(BTRIM(p_city), ''), true)
  RETURNING * INTO new_club;

  INSERT INTO public.user_roles (user_id, club_id, role)
  VALUES (current_user_id, new_club.id, 'club_admin');

  RETURN new_club;
END;
$$;

REVOKE ALL ON FUNCTION public.create_club_with_admin(TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_club_with_admin(TEXT, TEXT, TEXT) TO authenticated;
