-- Add missing RLS policies for tables that have RLS enabled but no policies

-- Countries: readable by all authenticated users
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view countries" ON countries
  FOR SELECT TO authenticated USING (true);

-- Regions: readable by all authenticated users
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view regions" ON regions
  FOR SELECT TO authenticated USING (true);

-- Events: readable by all authenticated, writable by coaches/admins
CREATE POLICY "Authenticated users can view events" ON events
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Coaches can manage events" ON events
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('club_admin', 'coach')
  ));

-- Meets: club members can view, coaches/admins can manage
CREATE POLICY "Club members can view meets" ON meets
  FOR SELECT TO authenticated
  USING (club_id IN (SELECT club_id FROM user_roles WHERE user_id = auth.uid()));
CREATE POLICY "Coaches can manage meets" ON meets
  FOR ALL TO authenticated
  USING (club_id IN (SELECT club_id FROM user_roles WHERE user_id = auth.uid() AND role IN ('club_admin', 'coach')));

-- Time trials: swimmers see own, coaches see club swimmers
CREATE POLICY "Swimmers can view own time trials" ON time_trials
  FOR SELECT TO authenticated
  USING (swimmer_id IN (SELECT id FROM swimmers WHERE user_id = auth.uid()));
CREATE POLICY "Coaches can view club time trials" ON time_trials
  FOR SELECT TO authenticated
  USING (swimmer_id IN (
    SELECT s.id FROM swimmers s WHERE s.club_id IN (
      SELECT club_id FROM user_roles WHERE user_id = auth.uid() AND role IN ('club_admin', 'coach')
    )
  ));
CREATE POLICY "Swimmers can insert own time trials" ON time_trials
  FOR INSERT TO authenticated
  WITH CHECK (swimmer_id IN (SELECT id FROM swimmers WHERE user_id = auth.uid()));
CREATE POLICY "Coaches can manage club time trials" ON time_trials
  FOR ALL TO authenticated
  USING (swimmer_id IN (
    SELECT s.id FROM swimmers s WHERE s.club_id IN (
      SELECT club_id FROM user_roles WHERE user_id = auth.uid() AND role IN ('club_admin', 'coach')
    )
  ));

-- Pace cards: same pattern as time trials
CREATE POLICY "Swimmers can view own pace cards" ON pace_cards
  FOR SELECT TO authenticated
  USING (swimmer_id IN (SELECT id FROM swimmers WHERE user_id = auth.uid()));
CREATE POLICY "Coaches can view club pace cards" ON pace_cards
  FOR SELECT TO authenticated
  USING (swimmer_id IN (
    SELECT s.id FROM swimmers s WHERE s.club_id IN (
      SELECT club_id FROM user_roles WHERE user_id = auth.uid() AND role IN ('club_admin', 'coach')
    )
  ));
CREATE POLICY "Swimmers can manage own pace cards" ON pace_cards
  FOR ALL TO authenticated
  USING (swimmer_id IN (SELECT id FROM swimmers WHERE user_id = auth.uid()));

-- Import templates: club-scoped
CREATE POLICY "Club members can view import templates" ON import_templates
  FOR SELECT TO authenticated
  USING (club_id IN (SELECT club_id FROM user_roles WHERE user_id = auth.uid()));
CREATE POLICY "Coaches can manage import templates" ON import_templates
  FOR ALL TO authenticated
  USING (club_id IN (SELECT club_id FROM user_roles WHERE user_id = auth.uid() AND role IN ('club_admin', 'coach')));
