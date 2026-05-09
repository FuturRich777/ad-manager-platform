import { Resend } from 'resend';
import PDFDocument from 'pdfkit';

const resend = new Resend(process.env.RESEND_API_KEY);

async function generatePDF(data) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const chunks = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header
    doc.fontSize(24).text('Client Intake Form', { align: 'center' });
    doc.fontSize(10).text(`Minex Media · Submitted ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown();

    const sections = [
      {
        title: '01 — About You',
        fields: [
          ['Full Name', data.full_name],
          ['Business Name', data.business_name],
          ['Email', data.email],
          ['Phone', data.phone],
          ['Website', data.website],
          ['Service Area', data.service_area],
          ['Social Links', data.social_links],
        ]
      },
      {
        title: '02 — Goals & Vision',
        fields: [
          ['Content/Ads Purpose', data.content_purpose],
          ['Top 1-3 Goals (30-90 days)', data.goals_30_90],
          ['Success Picture', data.success_picture],
        ]
      },
      {
        title: '03 — Your Offer',
        fields: [
          ['Main Offers + Price', data.offers],
          ['Ideal Customer', data.ideal_customer],
          ['Biggest Differentiator', data.differentiator],
        ]
      },
      {
        title: '04 — Brand & Positioning',
        fields: [
          ['Brand Words', data.brand_words],
          ['Inspiration', data.inspiration],
          ['Brand Colors', data.brand_colors_hex || data.brand_color_1],
          ['Visual Style', data.visual_style],
          ['Brand Assets Link', data.brand_assets_link],
        ]
      },
      {
        title: '05 — Content & Filming',
        fields: [
          ['Script Topics', data.script_topics],
          ['Off-Limits', data.off_limits],
          ['Content Preferences', data.content_prefs],
          ['On-Camera Comfort Level', data.oncamera_level],
          ['Filming Availability', data.filming_availability],
        ]
      },
      {
        title: '06 — Working Together',
        fields: [
          ['Ad Budget', data.ad_budget],
          ['Great Working Relationship', data.relationship],
          ['Anything Else', data.anything_else],
        ]
      }
    ];

    sections.forEach((section, idx) => {
      if (idx > 0) doc.moveDown(0.5);
      doc.fontSize(14).font('Helvetica-Bold').text(section.title);
      doc.moveDown(0.3);
      doc.fontSize(11).font('Helvetica');

      section.fields.forEach(([label, value]) => {
        doc.font('Helvetica-Bold').fontSize(10).text(`${label}:`, { continued: true });
        doc.font('Helvetica').text(` ${value || ''}`, { lineBreak: true });
      });
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

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'olivier@minexai.ca',
      subject: `New Client Intake: ${full_name || 'Unknown'} - ${business_name || 'Unknown'}`,
      html: `<h2>New Client Intake Submission</h2><p>See attached PDF for the complete filled form.</p>`,
      attachments: [
        {
          filename: `client-intake_${Date.now()}.pdf`,
          content: pdfBuffer,
        }
      ]
    });

    return res.status(200).json({ success: true, message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: error.message || 'Failed to submit form' });
  }
}
