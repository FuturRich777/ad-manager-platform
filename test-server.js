import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dataDir = '/tmp/minex-submissions';

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

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
app.post('/api/submit-form', (req, res) => {
  try {
    const data = {
      ...req.body,
      id: Date.now(),
      created_at: new Date().toISOString(),
    };

    const filePath = path.join(dataDir, `${data.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    console.log('[SUBMIT] Saved submission:', data.id);
    return res.status(200).json({ success: true, id: data.id });
  } catch (error) {
    console.error('[SUBMIT] Error:', error);
    return res.status(500).json({ error: 'Failed to save submission' });
  }
});

// API: Get all submissions
app.get('/api/submit-form', (req, res) => {
  try {
    const files = fs.readdirSync(dataDir);
    const submissions = files
      .filter(f => f.endsWith('.json'))
      .map(f => JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf8')))
      .sort((a, b) => b.id - a.id);

    return res.status(200).json(submissions);
  } catch (error) {
    console.error('[GET] Error:', error);
    return res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`\n✅ Form server running at http://localhost:${PORT}`);
  console.log(`📝 Form: http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/submissions\n`);
});
