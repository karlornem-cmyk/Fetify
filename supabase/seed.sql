-- Premiers prestataires du carnet (repris de la landing page).
-- Fiches sans compte associé : elles apparaissent dans l'annuaire en attendant
-- que les prestataires créent leur compte et reprennent leur fiche.
insert into public.providers
  (slug, name, trade, department, city, specialties, events, featured, published)
values
  ('axelle', 'Axelle', 'Pâtissier', '92 – Hauts-de-Seine', null,
   array['Cake design'], array['Mariage', 'Baptême & communion', 'Anniversaire'], true, true),
  ('eline', 'Eline', 'Pâtissier', '91 – Essonne', null,
   array['Mignardises antillaises'], array['Mariage', 'Baptême & communion', 'Anniversaire', 'Soirée entre proches'], false, true),
  ('camille', 'Camille', 'Bar à cocktails', '75 – Paris', null,
   array['Mixologie'], array['Mariage', 'Anniversaire', 'Soirée entre proches'], false, true),
  ('eline-wedding', 'Eline Wedding', 'Wedding planner', '91 – Essonne', null,
   array['Organisation'], array['Mariage'], true, true)
on conflict (slug) do nothing;
