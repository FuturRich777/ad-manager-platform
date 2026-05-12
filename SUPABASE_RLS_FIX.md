# Fix Supabase RLS Policy for Form Submissions

The form submission endpoint can't save data to Supabase because the `submissions` table has Row-Level Security (RLS) enabled, which blocks anonymous API access.

## Steps to Fix

1. **Go to Supabase Dashboard**: https://app.supabase.com
2. **Select your project** (lmgqwgjdzrmufadfxezs)
3. **Navigate to** SQL Editor (left sidebar)
4. **Run this SQL command**:

```sql
-- Enable anonymous inserts on submissions table
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert
CREATE POLICY "allow_anonymous_insert"
  ON public.submissions
  FOR INSERT
  WITH CHECK (true);

-- Verify the policy was created
-- Go to Authentication > Policies to see the policy listed
```

OR, if you prefer to disable RLS completely for this table:

```sql
-- Disable RLS on submissions table (less secure, but simpler)
ALTER TABLE public.submissions DISABLE ROW LEVEL SECURITY;
```

## After Running the SQL

Once you run the SQL command:
1. The form submission endpoint will be able to insert data
2. User submissions will automatically appear in the admin dashboard
3. Test by filling out the form at `https://onboarding.minexmedia.ca/`

## Why This Happened

The `submissions` table was created with RLS enabled, but without an INSERT policy for anonymous users. This is a security feature, but it prevents the form from saving data unless we explicitly allow it.

## Need Help?

If you need to access the Supabase dashboard, log in at: https://app.supabase.com
