-- supabase/migrations/20241216120000_create_app_schema.sql
-- MathTest Pro - Comprehensive Application Schema

-- Create custom types
CREATE TYPE public.user_role AS ENUM ('admin', 'teacher', 'student');
CREATE TYPE public.practice_status AS ENUM ('active', 'inactive', 'completed');
CREATE TYPE public.grade_level AS ENUM ('1ESO', '2ESO', '3ESO', '4ESO');

-- User profiles table (intermediary between auth.users and app tables)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'student'::public.user_role,
    alias TEXT UNIQUE, -- For students only
    grade_level public.grade_level,
    group_id UUID,
    total_points INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_access TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Groups table
CREATE TABLE public.groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    course public.grade_level NOT NULL,
    student_count INTEGER NOT NULL DEFAULT 0,
    teacher_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Practices table (formerly exams)
CREATE TABLE public.practices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    course public.grade_level NOT NULL,
    max_points INTEGER NOT NULL DEFAULT 100,
    attempts_allowed INTEGER NOT NULL DEFAULT 1,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    graded_duration BOOLEAN DEFAULT false,
    questions JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT false,
    start_date TIMESTAMPTZ,
    duration_days INTEGER DEFAULT 7,
    teacher_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Practice attempts table
CREATE TABLE public.practice_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    practice_id UUID REFERENCES public.practices(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    attempt_number INTEGER NOT NULL DEFAULT 1,
    score DECIMAL(5,2) DEFAULT 0,
    points_earned INTEGER DEFAULT 0,
    time_spent_minutes INTEGER DEFAULT 0,
    answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    status public.practice_status DEFAULT 'active'::public.practice_status,
    started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ
);

-- Add foreign key reference for groups in user_profiles
ALTER TABLE public.user_profiles 
ADD CONSTRAINT fk_user_profiles_group 
FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_group ON public.user_profiles(group_id);
CREATE INDEX idx_user_profiles_alias ON public.user_profiles(alias);
CREATE INDEX idx_groups_teacher ON public.groups(teacher_id);
CREATE INDEX idx_practices_teacher ON public.practices(teacher_id);
CREATE INDEX idx_practices_active ON public.practices(is_active);
CREATE INDEX idx_practice_attempts_practice ON public.practice_attempts(practice_id);
CREATE INDEX idx_practice_attempts_student ON public.practice_attempts(student_id);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_attempts ENABLE ROW LEVEL SECURITY;

-- Helper functions for RLS policies
CREATE OR REPLACE FUNCTION public.is_teacher()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'teacher'
);
$$;

CREATE OR REPLACE FUNCTION public.is_student()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'student'
);
$$;

CREATE OR REPLACE FUNCTION public.owns_group(group_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.groups g
    WHERE g.id = group_uuid AND g.teacher_id = auth.uid()
);
$$;

CREATE OR REPLACE FUNCTION public.owns_practice(practice_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.practices p
    WHERE p.id = practice_uuid AND p.teacher_id = auth.uid()
);
$$;

CREATE OR REPLACE FUNCTION public.can_access_practice_attempt(attempt_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.practice_attempts pa
    JOIN public.practices p ON pa.practice_id = p.id
    WHERE pa.id = attempt_uuid AND (
        pa.student_id = auth.uid() OR p.teacher_id = auth.uid()
    )
);
$$;

-- RLS Policies
-- User profiles policies
CREATE POLICY "users_own_profile" ON public.user_profiles
    FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "teachers_view_students" ON public.user_profiles
    FOR SELECT USING (public.is_teacher());

-- Groups policies
CREATE POLICY "teachers_manage_own_groups" ON public.groups
    FOR ALL USING (public.owns_group(id)) WITH CHECK (public.owns_group(id));

CREATE POLICY "students_view_own_group" ON public.groups
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles up
            WHERE up.id = auth.uid() AND up.group_id = id
        )
    );

-- Practices policies
CREATE POLICY "teachers_manage_own_practices" ON public.practices
    FOR ALL USING (public.owns_practice(id)) WITH CHECK (public.owns_practice(id));

CREATE POLICY "students_view_active_practices" ON public.practices
    FOR SELECT USING (
        is_active = true AND
        public.is_student() AND
        EXISTS (
            SELECT 1 FROM public.user_profiles up
            WHERE up.id = auth.uid() AND up.grade_level = course
        )
    );

-- Practice attempts policies
CREATE POLICY "practice_attempts_access" ON public.practice_attempts
    FOR ALL USING (public.can_access_practice_attempt(id))
    WITH CHECK (public.can_access_practice_attempt(id));

-- Trigger function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'student')::public.user_role
    );
    RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update function for practices updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE TRIGGER update_practices_updated_at
    BEFORE UPDATE ON public.practices
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Mock data generation
DO $$
DECLARE
    teacher_id UUID := gen_random_uuid();
    student1_id UUID := gen_random_uuid();
    student2_id UUID := gen_random_uuid();
    group1_id UUID := gen_random_uuid();
    practice1_id UUID := gen_random_uuid();
BEGIN
    -- Create auth users with complete field structure
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (teacher_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'profesor@mathtest.edu', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Prof. María González", "role": "teacher"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (student1_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'student1@mathtest.edu', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Ana García", "role": "student"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (student2_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'student2@mathtest.edu', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Carlos Rodríguez", "role": "student"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create groups
    INSERT INTO public.groups (id, name, course, student_count, teacher_id) VALUES
        (group1_id, 'Grupo Álgebra A', '2ESO'::public.grade_level, 2, teacher_id);

    -- Update user profiles for students with group assignment
    UPDATE public.user_profiles 
    SET group_id = group1_id, grade_level = '2ESO'::public.grade_level, alias = 'SilverFoxSky'
    WHERE id = student1_id;
    
    UPDATE public.user_profiles 
    SET group_id = group1_id, grade_level = '2ESO'::public.grade_level, alias = 'GreenDragonOcean'
    WHERE id = student2_id;

    -- Create sample practices
    INSERT INTO public.practices (id, title, description, course, max_points, attempts_allowed, duration_minutes, graded_duration, questions, is_active, start_date, duration_days, teacher_id)
    VALUES
        (practice1_id, 'Álgebra Básica - Ecuaciones', 'Práctica sobre resolución de ecuaciones lineales', '2ESO'::public.grade_level, 100, 2, 45, true, 
         '[{"id": 1, "question": "Resuelve: 2x + 5 = 13", "options": ["x = 3", "x = 4", "x = 5", "x = 6"], "correct": 1}]'::jsonb, 
         true, now(), 7, teacher_id);

    -- Create sample practice attempts
    INSERT INTO public.practice_attempts (practice_id, student_id, attempt_number, score, points_earned, time_spent_minutes, answers, status, completed_at)
    VALUES
        (practice1_id, student1_id, 1, 85.0, 85, 30, '{"1": 1}'::jsonb, 'completed'::public.practice_status, now() - interval '1 day');

    RAISE NOTICE 'MathTest Pro mock data created successfully!';
    RAISE NOTICE 'Teacher login: profesor@mathtest.edu / password123';
    RAISE NOTICE 'Student login: student1@mathtest.edu / password123';

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;