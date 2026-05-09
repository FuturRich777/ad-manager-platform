import { Resend } from 'resend';
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

const resend = new Resend(process.env.RESEND_API_KEY);

function generatePDF(data) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const chunks = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(24).text('Client Intake Form', { align: 'center' });
    doc.fontSize(10).text(`Submitted: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

    const sections = [
      { title: '01 — About You', fields: ['full_name', 'business_name', 'email', 'phone', 'website', 'service_area', 'social_links'] },
      { title: '02 — Goals & Vision', fields: ['content_purpose', 'goals_30_90', 'success_picture'] },
      { title: '03 — Your Offer', fields: ['offers', 'ideal_customer', 'differentiator'] },
      { title: '04 — Brand & Positioning', fields: ['brand_words', 'inspiration', 'brand_colors_hex', 'visual_style', 'brand_assets_link'] },
      { title: '05 — Content & Filming', fields: ['script_topics', 'off_limits', 'content_prefs', 'oncamera_level', 'filming_availability'] },
      { title: '06 — Working Together', fields: ['ad_budget', 'relationship', 'anything_else'] }
    ];

    const labels = {
      full_name: 'Full Name', business_name: 'Business Name', email: 'Email', phone: 'Phone',
      website: 'Website', service_area: 'Service Area', social_links: 'Social Links',
      content_purpose: 'Content/Ads Purpose', goals_30_90: 'Top 1-3 Goals (30-90 days)', success_picture: 'Success Picture',
      offers: 'Main Offers + Price', ideal_customer: 'Ideal Customer', differentiator: 'Biggest Differentiator',
      brand_words: 'Brand Words', inspiration: 'Inspiration', brand_colors_hex: 'Brand Colors', visual_style: 'Visual Style', brand_assets_link: 'Brand Assets Link',
      script_topics: 'Script Topics', off_limits: 'Off-Limits', content_prefs: 'Content Preferences', oncamera_level: 'On-Camera Comfort Level', filming_availability: 'Filming Availability',
      ad_budget: 'Ad Budget', relationship: 'Great Working Relationship', anything_else: 'Anything Else'
    };

    sections.forEach(section => {
      doc.fontSize(14).text(section.title, { underline: true });
      doc.fontSize(10);
      section.fields.forEach(field => {
        const value = data[field] || 'N/A';
        doc.text(`${labels[field]}: ${value}`);
      });
      doc.moveDown();
    });

    doc.end();
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { full_name, business_name, email, phone, website, service_area, social_links, content_purpose, goals_30_90, success_picture, offers, ideal_customer, differentiator, brand_words, inspiration, brand_color_1, brand_color_2, brand_color_3, brand_colors_hex, visual_style, brand_assets_link, script_topics, off_limits, content_prefs, oncamera_level, filming_availability, ad_budget, relationship, anything_else } = req.body;

  try {
    const pdfBuffer = await generatePDF(req.body);

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'olivier@minexai.ca',
      subject: `New Client Intake: ${full_name || 'Unknown'} - ${business_name || 'Unknown'}`,
      html: `<h2>New Client Intake Submission</h2><p>Please see attached PDF for complete form details.</p>`,
      attachments: [
        {
          filename: `intake_${Date.now()}.pdf`,
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
