import fs from 'fs';
import path from 'path';

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function prefillFormHTML(formHTML, data) {
  let html = formHTML;

  const fieldMap = {
    'full_name': data.full_name,
    'business_name': data.business_name,
    'email': data.email,
    'phone': data.phone,
    'website': data.website,
    'service_area': data.service_area,
    'social_links': data.social_links,
    'content_purpose': data.content_purpose,
    'goals_30_90': data.goals_30_90,
    'success_picture': data.success_picture,
    'offers': data.offers,
    'ideal_customer': data.ideal_customer,
    'differentiator': data.differentiator,
    'brand_words': data.brand_words,
    'inspiration': data.inspiration,
    'brand_colors_hex': data.brand_colors_hex,
    'brand_color_1': data.brand_color_1,
    'visual_style': data.visual_style,
    'brand_assets_link': data.brand_assets_link,
    'script_topics': data.script_topics,
    'off_limits': data.off_limits,
    'content_prefs': data.content_prefs,
    'oncamera_level': data.oncamera_level,
    'filming_availability': data.filming_availability,
    'ad_budget': data.ad_budget,
    'relationship': data.relationship,
    'anything_else': data.anything_else,
  };

  for (const [fieldName, value] of Object.entries(fieldMap)) {
    if (value) {
      const escaped = escapeHtml(value);
      html = html.replace(
        new RegExp(`name="${fieldName}"([^>]*)>`, 'g'),
        `name="${fieldName}"$1 value="${escaped}">`
      );
      html = html.replace(
        new RegExp(`<textarea name="${fieldName}"([^>]*)>([^<]*)`, 'g'),
        `<textarea name="${fieldName}"$1>${escaped}`
      );
    }
  }

  html = html.replace(/<form/g, '<form onsubmit="return false"');
  html = html.replace(/<input/g, '<input disabled');
  html = html.replace(/<textarea/g, '<textarea disabled');
  html = html.replace(/<select/g, '<select disabled');
  html = html.replace(/<button/g, '<button disabled');

  return html;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;
    const businessName = (data.business_name || 'form').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${businessName}_intake_${timestamp}.html`;

    const formPath = path.join(process.cwd(), 'public', 'index.html');
    let formHTML;

    try {
      formHTML = fs.readFileSync(formPath, 'utf-8');
    } catch {
      formHTML = fs.readFileSync(path.join(process.cwd(), 'minex-intake-form-email.html'), 'utf-8');
    }

    const filledFormHTML = prefillFormHTML(formHTML, data);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', Buffer.byteLength(filledFormHTML));

    return res.status(200).send(filledFormHTML);
  } catch (error) {
    console.error('Error generating download:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate download' });
  }
}
