import express from 'express';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const supabaseUrl = 'https://lmgqwgjdzrmufadfxezs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtZ3F3Z2pkenJtdWZhZGZ4ZXpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMTY0NTIsImV4cCI6MjA5Mjg5MjQ1Mn0.blobh-NlDrT4uggvs-sg6pc8GB5KNk_eC2ooT_p03PU';

const supabase = createClient(supabaseUrl, supabaseKey);

// Serve form HTML
app.get('/', (req, res) => {
  const formPath = path.join(__dirname, 'public/index.html');
  res.sendFile(formPath);
});

// Serve submissions dashboard
app.get('/submissions', (req, res) => {
  const submissionsPath = path.join(__dirname, 'public/submissions.html');
  res.sendFile(submissionsPath);
});

// API: Submit form
app.post('/api/submit-form', async (req, res) => {
  try {
    const { error, data } = await supabase
      .from('submissions')
      .insert([{ ...req.body }]);

    if (error) {
      console.error('[SUBMIT] Error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('[SUBMIT] Saved to Supabase');
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('[SUBMIT] Error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// API: Get all submissions
app.get('/api/submit-form', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[GET] Error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data || []);
  } catch (error) {
    console.error('[GET] Error:', error);
    return res.status(500).json({ error: error.message });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`\n✅ Form server running at http://localhost:${PORT}`);
  console.log(`📝 Form: http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/submissions\n`);
});
