import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    const logoPath = path.join(process.cwd(), 'public', 'logo.png');
    const logoBuffer = fs.readFileSync(logoPath);

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.setHeader('Content-Length', logoBuffer.length);

    return res.status(200).send(logoBuffer);
  } catch (error) {
    console.error('Error serving logo:', error);
    return res.status(404).send('Logo not found');
  }
}
