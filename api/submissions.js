import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default function handler(req, res) {
  try {
    const submissionsHtmlPath = path.join(__dirname, '../public/submissions.html');
    const html = fs.readFileSync(submissionsHtmlPath, 'utf8');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
  } catch (error) {
    console.error('[SUBMISSIONS] Error reading HTML:', error);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
}
