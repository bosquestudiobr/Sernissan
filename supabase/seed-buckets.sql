insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', false),
  ('logos', 'logos', false),
  ('rv-anexos', 'rv-anexos', false),
  ('uploads', 'uploads', false)
on conflict (id) do nothing;
