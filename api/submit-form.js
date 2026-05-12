import fs from 'fs';
import path from 'path';

const dataDir = '/tmp/minex-submissions';

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
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
  }

  if (req.method === 'GET') {
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
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
