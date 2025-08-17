-- First, disable RLS temporarily to allow us to fix things
ALTER TABLE public.groups DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS groups_select_member ON public.groups;
DROP POLICY IF EXISTS groups_delete_admin ON public.groups;
DROP POLICY IF EXISTS groups_update_admin ON public.groups;
DROP POLICY IF EXISTS groups_insert_creator ON public.groups;
DROP POLICY IF EXISTS group_members_select_in_group ON public.group_members;
DROP POLICY IF EXISTS group_members_delete_admin ON public.group_members;
DROP POLICY IF EXISTS group_members_update_admin ON public.group_members;
DROP POLICY IF EXISTS group_members_insert_self_or_admin ON public.group_members;

-- Create a view to help with group membership checks
CREATE OR REPLACE VIEW public.user_group_access AS
SELECT DISTINCT
    g.id AS group_id,
    CASE
        WHEN g.creator_id = auth.uid() THEN true
        ELSE false
    END AS is_creator,
    CASE
        WHEN gm.role = 'admin' THEN true
        ELSE false
    END AS is_admin,
    CASE
        WHEN gm.user_id IS NOT NULL THEN true
        ELSE false
    END AS is_member
FROM
    public.groups g
LEFT JOIN
    public.group_members gm ON g.id = gm.group_id AND gm.user_id = auth.uid();

-- Create new policies with simpler logic
-- GROUPS TABLE POLICIES

-- 1. SELECT: Allow if user is creator or member
CREATE POLICY groups_select_member ON public.groups
    FOR SELECT
    TO public
    USING (
        creator_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM public.group_members 
            WHERE group_id = groups.id AND user_id = auth.uid()
        )
    );

-- 2. INSERT: Allow if creator_id is the current user
CREATE POLICY groups_insert_creator ON public.groups
    FOR INSERT
    TO public
    WITH CHECK (
        creator_id = auth.uid()
    );

-- 3. UPDATE: Allow if user is creator or admin
CREATE POLICY groups_update_admin ON public.groups
    FOR UPDATE
    TO public
    USING (
        creator_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM public.group_members 
            WHERE group_id = groups.id AND user_id = auth.uid() AND role = 'admin'
        )
    );

-- 4. DELETE: Allow if user is creator or admin
CREATE POLICY groups_delete_admin ON public.groups
    FOR DELETE
    TO public
    USING (
        creator_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM public.group_members 
            WHERE group_id = groups.id AND user_id = auth.uid() AND role = 'admin'
        )
    );

-- GROUP_MEMBERS TABLE POLICIES

-- 1. SELECT: Allow if user is group creator or a member of the same group
CREATE POLICY group_members_select_in_group ON public.group_members
    FOR SELECT
    TO public
    USING (
        EXISTS (
            SELECT 1 FROM public.groups
            WHERE id = group_members.group_id AND creator_id = auth.uid()
        ) OR
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.group_members gm
            WHERE gm.group_id = group_members.group_id AND gm.user_id = auth.uid()
        )
    );

-- 2. INSERT: Allow if adding self or user is admin
CREATE POLICY group_members_insert_self_or_admin ON public.group_members
    FOR INSERT
    TO public
    WITH CHECK (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.groups
            WHERE id = group_members.group_id AND creator_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM public.group_members
            WHERE group_id = group_members.group_id AND user_id = auth.uid() AND role = 'admin'
        )
    );

-- 3. UPDATE: Allow if user is admin
CREATE POLICY group_members_update_admin ON public.group_members
    FOR UPDATE
    TO public
    USING (
        EXISTS (
            SELECT 1 FROM public.groups
            WHERE id = group_members.group_id AND creator_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM public.group_members
            WHERE group_id = group_members.group_id AND user_id = auth.uid() AND role = 'admin'
        )
    );

-- 4. DELETE: Allow if user is admin
CREATE POLICY group_members_delete_admin ON public.group_members
    FOR DELETE
    TO public
    USING (
        EXISTS (
            SELECT 1 FROM public.groups
            WHERE id = group_members.group_id AND creator_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM public.group_members
            WHERE group_id = group_members.group_id AND user_id = auth.uid() AND role = 'admin'
        )
    );

-- Re-enable RLS
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
