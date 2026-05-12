import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    // Try multiple possible paths
    const possiblePaths = [
      path.join(process.cwd(), 'public', 'admin.html'),
      path.join(process.cwd(), '..', 'public', 'admin.html'),
      '/var/task/public/admin.html',
      './public/admin.html'
    ];

    let html = null;
    for (const filePath of possiblePaths) {
      try {
        if (fs.existsSync(filePath)) {
          html = fs.readFileSync(filePath, 'utf-8');
          console.log(`Found admin.html at: ${filePath}`);
          break;
        }
      } catch (e) {
        // Continue to next path
      }
    }

    if (!html) {
      console.error('Could not find admin.html in any path');
      console.error('process.cwd():', process.cwd());
      console.log('Directory contents:', fs.readdirSync(process.cwd()));
      return res.status(404).json({ error: 'Admin dashboard not found', cwd: process.cwd() });
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error serving admin:', error);
    res.status(500).json({ error: error.message });
  }
}
