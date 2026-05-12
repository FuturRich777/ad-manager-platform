import { Resend } from 'resend';
import { jsPDF } from 'jspdf';

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

function generatePDFBuffer(data) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;
  const lineHeight = 7;
  let yPosition = margin + 10;

  doc.setFontSize(16);
  doc.text('Client Intake Form', margin, yPosition);
  yPosition += 15;

  doc.setFontSize(10);

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

  for (const [label, value] of fields) {
    if (value) {
      doc.setFont(undefined, 'bold');
      doc.text(`${label}:`, margin, yPosition);
      yPosition += lineHeight;

      doc.setFont(undefined, 'normal');
      const text = String(value);
      const splitText = doc.splitTextToSize(text, pageWidth - 2 * margin);
      doc.text(splitText, margin, yPosition);
      yPosition += splitText.length * lineHeight + 2;

      if (yPosition > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yPosition = margin;
      }
    }
  }

  return Buffer.from(doc.output('arraybuffer'));
}


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { full_name, business_name } = req.body;

  try {
    const pdfBuffer = generatePDFBuffer(req.body);
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
