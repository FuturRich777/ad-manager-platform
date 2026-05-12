import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

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
    'signature': data.signature,
    'representative_signature': data.representative_signature,
    'platform_logins': data.platform_logins,
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

function generatePDF(data) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const chunks = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(18).text('Client Intake Form', { underline: true }).moveDown();
    doc.fontSize(10);

    const fields = [
      ['Full Name', data.full_name],
      ['Business Name', data.business_name],
      ['Email', data.email],
      ['Phone', data.phone],
      ['Website', data.website],
      ['Service Area', data.service_area],
      ['Social Links', data.social_links],
      ['Content Purpose', data.content_purpose],
      ['30-90 Day Goals', data.goals_30_90],
      ['Success Picture', data.success_picture],
      ['Main Offers', data.offers],
      ['Ideal Customer', data.ideal_customer],
      ['Differentiator', data.differentiator],
      ['Brand Words', data.brand_words],
      ['Inspiration', data.inspiration],
      ['Brand Colors', data.brand_colors_hex],
      ['Visual Style', data.visual_style],
      ['Brand Assets', data.brand_assets_link],
      ['Script Topics', data.script_topics],
      ['Off Limits', data.off_limits],
      ['Content Prefs', data.content_prefs],
      ['On Camera Level', data.oncamera_level],
      ['Filming Availability', data.filming_availability],
      ['Ad Budget', data.ad_budget],
      ['Relationship', data.relationship],
      ['Anything Else', data.anything_else],
    ];

    fields.forEach(([label, value]) => {
      if (value) {
        doc.font('Helvetica-Bold').text(`${label}:`, { underline: true });
        doc.font('Helvetica').text(String(value), { width: 500 }).moveDown(0.5);
      }
    });

    doc.end();
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { full_name, business_name } = req.body;

  try {
    const pdfBuffer = await generatePDF(req.body);
    const filename = `${(business_name || 'form').replace(/[^a-z0-9]/gi, '_').toLowerCase()}_intake_${new Date().toISOString().split('T')[0]}.pdf`;

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'olivier@minexai.ca',
      subject: `New Client Intake: ${full_name || 'Unknown'} - ${business_name || 'Unknown'}`,
      html: `<h2>New Client Intake Submission</h2><p>A PDF of the completed form is attached below.</p>`,
      attachments: [{
        filename: filename,
        content: pdfBuffer.toString('base64'),
      }],
    });

    return res.status(200).json({ success: true, message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to submit form' });
  }
}
