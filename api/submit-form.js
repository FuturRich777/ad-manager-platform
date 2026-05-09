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

  // Replace form field values - match input name attributes and fill with value
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

  // Pre-fill input and textarea fields
  for (const [fieldName, value] of Object.entries(fieldMap)) {
    if (value) {
      // For text inputs and textareas
      const escaped = escapeHtml(value);
      html = html.replace(
        new RegExp(`name="${fieldName}"([^>]*)>([^<]*)(</(input|textarea)>)`, 'g'),
        `name="${fieldName}"$1 value="${escaped}"><textarea name="${fieldName}">$2</textarea></textarea>`
      );
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

  // Disable form submission
  html = html.replace(/<form/g, '<form onsubmit="return false"');

  // Disable all inputs
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
    // Read the original form HTML from the public directory
    const formPath = path.join(process.cwd(), 'public', 'index.html');
    let formHTML;

    try {
      formHTML = fs.readFileSync(formPath, 'utf-8');
    } catch {
      // If not in public, try the root
      formHTML = fs.readFileSync(path.join(process.cwd(), 'minex-intake-form-email.html'), 'utf-8');
    }

    // Pre-fill the form with submitted data
    const filledFormHTML = prefillFormHTML(formHTML, req.body);

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'olivier@minexai.ca',
      subject: `New Client Intake: ${full_name || 'Unknown'} - ${business_name || 'Unknown'}`,
      html: filledFormHTML,
    });

    return res.status(200).json({ success: true, message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: error.message || 'Failed to submit form' });
  }
}
