import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'admin.html');
    const html = fs.readFileSync(filePath, 'utf-8');

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error serving admin:', error);
    res.status(500).json({ error: 'Failed to load admin dashboard' });
  }
}
