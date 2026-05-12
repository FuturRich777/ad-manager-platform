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

// API: View single submission
app.get('/api/view-submission', async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'ID required' });
  try {
    const { data, error } = await supabase.from('submissions').select('*').eq('id', id).single();
    if (error || !data) return res.status(404).json({ error: 'Not found' });

    const escapeHtml = (text) => {
      if (!text) return '';
      return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    };

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Submission #${data.id}</title><style>body{font-family:system-ui;max-width:900px;margin:0 auto;padding:20px;background:#f5f5f5}.banner{background:#1F4D3F;color:#fff;padding:20px;border-radius:8px;margin-bottom:20px;text-align:center}label{display:block;margin-bottom:20px}label span{font-weight:600;display:block;margin-bottom:5px}input,textarea,select{width:100%;padding:10px;border:1px solid #ddd;border-radius:4px;font-family:inherit}textarea{resize:vertical;min-height:100px}input:disabled,textarea:disabled{background:#f0f0f0;cursor:not-allowed}.section{border-top:1px solid #ddd;padding:20px 0;margin:20px 0}</style></head><body><div class="banner"><h2>Submission #${data.id}</h2><p>Submitted: ${new Date(data.created_at).toLocaleString()}</p></div>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html + `<div style="max-width:900px;margin:0 auto"><div class="section"><h3>About You</h3><label><span>Full Name</span><input type="text" value="${escapeHtml(data.full_name)}" disabled></label><label><span>Business</span><input type="text" value="${escapeHtml(data.business_name)}" disabled></label><label><span>Email</span><input type="email" value="${escapeHtml(data.email)}" disabled></label><label><span>Phone</span><input type="text" value="${escapeHtml(data.phone)}" disabled></label></div></div></body></html>`);
  } catch (error) {
    console.error('[VIEW] Error:', error);
    res.status(500).json({ error: 'Error' });
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
