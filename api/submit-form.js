import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function generateTextFile(data) {
  let text = 'CLIENT INTAKE FORM SUBMISSION\n';
  text += '='.repeat(50) + '\n\n';

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
      text += `${label}:\n${value}\n\n`;
    }
  }

  return Buffer.from(text, 'utf-8');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { full_name, business_name } = req.body;

  try {
    const textBuffer = generateTextFile(req.body);
    const filename = `${(business_name || 'form').replace(/[^a-z0-9]/gi, '_').toLowerCase()}_intake_${new Date().toISOString().split('T')[0]}.txt`;

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'olivier@minexai.ca',
      subject: `New Client Intake: ${full_name || 'Unknown'} - ${business_name || 'Unknown'}`,
      html: `<h2>New Client Intake Submission</h2><p>Your form data is attached as a text file.</p>`,
      attachments: [{
        filename: filename,
        content: textBuffer.toString('base64'),
      }],
    });

    return res.status(200).json({ success: true, message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to submit form' });
  }
}
