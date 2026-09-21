-- Run this in Supabase: Dashboard > SQL Editor > New query > paste > Run
-- (If you already ran this once, you don't need to run it again.)

create table if not exists profiles (
  id uuid primary key references auth.users(id) default auth.uid(),
  role text not null check (role in ('student', 'teacher', 'admin')),
  full_name text not null
);

create table if not exists accommodations (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id),
  category text,
  description text not null
);

create table if not exists issues (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id),
  category text not null,
  status text not null default 'Open' check (status in ('Open', 'In progress', 'Resolved')),
  created_at timestamptz not null default now()
);

create table if not exists teacher_students (
  teacher_id uuid not null references profiles(id),
  student_id uuid not null references profiles(id),
  primary key (teacher_id, student_id)
);

-- Weekly self-reported effectiveness (backs the heatmap)
create table if not exists accommodation_checkins (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id),
  class_name text not null,
  week_start date not null,
  rating int not null check (rating between 1 and 5)
);

-- Backs the visual calendar in Meeting Prep
create table if not exists meetings (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id),
  meeting_date date not null,
  status text not null default 'Scheduled'
);

-- Backs the "I missed that" tool
create table if not exists flags (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id),
  class_name text,
  snippet text,
  created_at timestamptz not null default now()
);

-- --- Row Level Security ---
alter table profiles enable row level security;
alter table accommodations enable row level security;
alter table issues enable row level security;
alter table teacher_students enable row level security;
alter table accommodation_checkins enable row level security;
alter table meetings enable row level security;
alter table flags enable row level security;

create policy "students see own profile" on profiles
  for select using (id = auth.uid());

create policy "students see own accommodations" on accommodations
  for select using (student_id = auth.uid());

create policy "teachers see assigned students accommodations" on accommodations
  for select using (
    exists (
      select 1 from teacher_students ts
      where ts.student_id = accommodations.student_id and ts.teacher_id = auth.uid()
    )
  );

create policy "students see own issues" on issues
  for select using (student_id = auth.uid());

create policy "students insert own issues" on issues
  for insert with check (student_id = auth.uid());

create policy "teachers see assigned students issues" on issues
  for select using (
    exists (
      select 1 from teacher_students ts
      where ts.student_id = issues.student_id and ts.teacher_id = auth.uid()
    )
  );

create policy "students manage own flags" on flags
  for all using (student_id = auth.uid()) with check (student_id = auth.uid());

-- NOTE: admin policies left for you to design once you decide how admin is verified
-- (likely a check against profiles.role = 'admin').
