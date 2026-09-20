-- =====================================================================
-- Janjua Curtain House — seed data
-- Run AFTER schema.sql. Only contains information supplied by the owner.
-- =====================================================================

-- Site settings (single row)
insert into public.site_settings (id, business_name, tagline, phone, whatsapp, location)
values (1, 'Janjua Curtain House', 'Style | Comfort | Elegance', '+971547400549', '+971547400549', 'UAE')
on conflict (id) do nothing;

-- Services
insert into public.services (title, slug, description, category, icon, sort_order) values
  ('Custom Curtains',            'custom-curtains',            'Curtains designed around your windows, your interior and your fabric preference — measured, stitched and fitted to your space.', 'Curtains', 'Scissors', 1),
  ('Blackout Curtains',          'blackout-curtains',          'Light-blocking blackout curtains for bedrooms, living rooms and offices where privacy and darkness matter.',                     'Curtains', 'MoonStar', 2),
  ('Curtain Stitching',          'curtain-stitching',          'Precise in-house stitching with clean pleats, even hems and neat finishing on every panel we make.',                            'Curtains', 'Ruler',    3),
  ('Professional Curtain Fitting','professional-fitting',      'Rails, rods, brackets and panels installed by our team for a straight, clean and properly hanging finish.',                     'Fitting',  'Wrench',   4),
  ('Curtain Measurement',        'curtain-measurement',        'Free visit and guidance. We measure your windows accurately and advise on style, length and fullness.',                        'Fitting',  'Ruler',    5),
  ('Blinds',                     'blinds',                     'Roller, roman and modern blinds for homes and offices — measured and installed to fit the opening exactly.',                   'Blinds',   'Blinds',   6),
  ('Home Curtain Solutions',     'home-curtain-solutions',     'Complete curtain solutions for villas and apartments — living rooms, bedrooms, majlis and kitchens.',                          'Home',     'Home',     7),
  ('Office Curtain Solutions',   'office-curtain-solutions',   'Practical, professional window treatments for offices, clinics, salons and commercial spaces.',                                'Office',   'Building2',8)
on conflict (slug) do nothing;

-- Current promotion (from the flyer)
insert into public.promotions (title, description, discount, cta_label, is_active)
select '20% OFF All Curtains', 'Upgrade Your Home With Style & Comfort', 20, 'Claim Your Offer', true
where not exists (select 1 from public.promotions);
