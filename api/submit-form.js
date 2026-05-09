import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

const resend = new Resend(process.env.RESEND_API_KEY);

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

  const { full_name, business_name } = req.body;

  try {
    const formPath = path.join(process.cwd(), 'public', 'index.html');
    let formHTML;

    try {
      formHTML = fs.readFileSync(formPath, 'utf-8');
    } catch {
      formHTML = fs.readFileSync(path.join(process.cwd(), 'minex-intake-form-email.html'), 'utf-8');
    }

    const filledFormHTML = prefillFormHTML(formHTML, req.body);

    // Encode form data as base64 for the download link
    const dataStr = JSON.stringify(req.body);
    const encodedData = Buffer.from(dataStr).toString('base64');
    const downloadLink = `https://awesome-goldberg-cf206d.vercel.app/api/get-form?data=${encodedData}`;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #13161A; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { border-bottom: 2px solid #1F4D3F; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { margin: 0; font-size: 20px; }
    .header p { margin: 5px 0 0 0; color: #6E7480; font-size: 13px; }
    .form-section { margin: 30px 0; }
    .section-title { font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #1F4D3F; margin: 20px 0 15px 0; }
    .field { margin-bottom: 12px; }
    .field-label { font-weight: 600; font-size: 12px; color: #13161A; margin-bottom: 4px; }
    .field-value { font-size: 14px; color: #3A3F46; }
    .download-box { background: #F2EEE5; padding: 20px; border-radius: 6px; margin: 30px 0; }
    .download-link {
      display: inline-block;
      background: #1F4D3F;
      color: #F2EEE5;
      padding: 12px 24px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 500;
      margin-top: 10px;
    }
    .download-link:hover { background: #13161A; }
    .footer { border-top: 1px solid #E0E0E0; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #6E7480; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Client Intake Submission</h1>
      <p>${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
    </div>

    <div class="form-section">
      <div class="section-title">01 — About You</div>
      ${req.body.full_name ? `<div class="field"><div class="field-label">Full Name</div><div class="field-value">${escapeHtml(req.body.full_name)}</div></div>` : ''}
      ${req.body.business_name ? `<div class="field"><div class="field-label">Business Name</div><div class="field-value">${escapeHtml(req.body.business_name)}</div></div>` : ''}
      ${req.body.email ? `<div class="field"><div class="field-label">Email</div><div class="field-value">${escapeHtml(req.body.email)}</div></div>` : ''}
      ${req.body.phone ? `<div class="field"><div class="field-label">Phone</div><div class="field-value">${escapeHtml(req.body.phone)}</div></div>` : ''}
      ${req.body.website ? `<div class="field"><div class="field-label">Website</div><div class="field-value">${escapeHtml(req.body.website)}</div></div>` : ''}
      ${req.body.service_area ? `<div class="field"><div class="field-label">Service Area</div><div class="field-value">${escapeHtml(req.body.service_area)}</div></div>` : ''}
      ${req.body.social_links ? `<div class="field"><div class="field-label">Social Links</div><div class="field-value">${escapeHtml(req.body.social_links)}</div></div>` : ''}
    </div>

    <div class="form-section">
      <div class="section-title">02 — Goals & Vision</div>
      ${req.body.content_purpose ? `<div class="field"><div class="field-label">Content/Ads Purpose</div><div class="field-value">${escapeHtml(req.body.content_purpose)}</div></div>` : ''}
      ${req.body.goals_30_90 ? `<div class="field"><div class="field-label">Top 1-3 Goals (30-90 days)</div><div class="field-value">${escapeHtml(req.body.goals_30_90)}</div></div>` : ''}
      ${req.body.success_picture ? `<div class="field"><div class="field-label">Success Picture</div><div class="field-value">${escapeHtml(req.body.success_picture)}</div></div>` : ''}
    </div>

    <div class="form-section">
      <div class="section-title">03 — Your Offer</div>
      ${req.body.offers ? `<div class="field"><div class="field-label">Main Offers + Price</div><div class="field-value">${escapeHtml(req.body.offers)}</div></div>` : ''}
      ${req.body.ideal_customer ? `<div class="field"><div class="field-label">Ideal Customer</div><div class="field-value">${escapeHtml(req.body.ideal_customer)}</div></div>` : ''}
      ${req.body.differentiator ? `<div class="field"><div class="field-label">Biggest Differentiator</div><div class="field-value">${escapeHtml(req.body.differentiator)}</div></div>` : ''}
    </div>

    <div class="download-box">
      <strong>Download the complete filled form:</strong>
      <br>
      <a href="${downloadLink}" class="download-link">Download Form HTML</a>
      <p style="margin: 10px 0 0 0; font-size: 12px; color: #6E7480;">You can open this file in any browser or save it for your records.</p>
    </div>

    <div class="footer">
      <p>This form submission is from your client intake system.</p>
    </div>
  </div>
</body>
</html>`;

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'olivier@minexai.ca',
      subject: `New Client Intake: ${full_name || 'Unknown'} - ${business_name || 'Unknown'}`,
      html: emailHtml,
    });

    return res.status(200).json({ success: true, message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: error.message || 'Failed to submit form' });
  }
}
