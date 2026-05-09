import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { full_name, business_name, email, phone, website, service_area, social_links, content_purpose, goals_30_90, success_picture, offers, ideal_customer, differentiator, brand_words, inspiration, brand_color_1, brand_color_2, brand_color_3, brand_colors_hex, visual_style, brand_assets_link, script_topics, off_limits, content_prefs, oncamera_level, filming_availability, ad_budget, relationship, anything_else } = req.body;

  try {
    const emailContent = `
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5; padding: 20px;">
  <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <h2 style="color: #13161A; border-bottom: 2px solid #1F4D3F; padding-bottom: 10px;">New Client Intake Submission</h2>

    <div style="margin: 20px 0;">
      <h3 style="color: #1F4D3F; margin-top: 20px;">01 — About You</h3>
      <p><strong>Full Name:</strong> ${full_name || 'N/A'}</p>
      <p><strong>Business Name:</strong> ${business_name || 'N/A'}</p>
      <p><strong>Email:</strong> ${email || 'N/A'}</p>
      <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
      <p><strong>Website:</strong> ${website || 'N/A'}</p>
      <p><strong>Service Area:</strong> ${service_area || 'N/A'}</p>
      <p><strong>Social Links:</strong> ${social_links || 'N/A'}</p>
    </div>

    <div style="margin: 20px 0;">
      <h3 style="color: #1F4D3F; margin-top: 20px;">02 — Goals & Vision</h3>
      <p><strong>Content/Ads Purpose:</strong> ${content_purpose || 'N/A'}</p>
      <p><strong>Top 1-3 Goals (30-90 days):</strong> ${goals_30_90 || 'N/A'}</p>
      <p><strong>Success Picture:</strong> ${success_picture || 'N/A'}</p>
    </div>

    <div style="margin: 20px 0;">
      <h3 style="color: #1F4D3F; margin-top: 20px;">03 — Your Offer</h3>
      <p><strong>Main Offers + Price:</strong> ${offers || 'N/A'}</p>
      <p><strong>Ideal Customer:</strong> ${ideal_customer || 'N/A'}</p>
      <p><strong>Biggest Differentiator:</strong> ${differentiator || 'N/A'}</p>
    </div>

    <div style="margin: 20px 0;">
      <h3 style="color: #1F4D3F; margin-top: 20px;">04 — Brand & Positioning</h3>
      <p><strong>Brand Words:</strong> ${brand_words || 'N/A'}</p>
      <p><strong>Inspiration:</strong> ${inspiration || 'N/A'}</p>
      <p><strong>Brand Colors:</strong> ${brand_colors_hex || brand_color_1 + ', ' + brand_color_2 + ', ' + brand_color_3 || 'N/A'}</p>
      <p><strong>Visual Style:</strong> ${visual_style || 'N/A'}</p>
      <p><strong>Brand Assets Link:</strong> ${brand_assets_link || 'N/A'}</p>
    </div>

    <div style="margin: 20px 0;">
      <h3 style="color: #1F4D3F; margin-top: 20px;">05 — Content & Filming</h3>
      <p><strong>Script Topics:</strong> ${script_topics || 'N/A'}</p>
      <p><strong>Off-Limits:</strong> ${off_limits || 'N/A'}</p>
      <p><strong>Content Preferences:</strong> ${content_prefs || 'N/A'}</p>
      <p><strong>On-Camera Comfort Level:</strong> ${oncamera_level || 'N/A'}</p>
      <p><strong>Filming Availability:</strong> ${filming_availability || 'N/A'}</p>
    </div>

    <div style="margin: 20px 0;">
      <h3 style="color: #1F4D3F; margin-top: 20px;">06 — Working Together</h3>
      <p><strong>Ad Budget:</strong> ${ad_budget || 'N/A'}</p>
      <p><strong>Great Working Relationship:</strong> ${relationship || 'N/A'}</p>
      <p><strong>Anything Else:</strong> ${anything_else || 'N/A'}</p>
    </div>

    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
      <p>Submitted from your intake form at ${new Date().toLocaleString()}</p>
    </div>
  </div>
</body>
</html>
    `;

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'olivier@minexai.ca',
      subject: `New Client Intake: ${full_name || 'Unknown'} - ${business_name || 'Unknown'}`,
      html: emailContent,
    });

    return res.status(200).json({ success: true, message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: error.message || 'Failed to submit form' });
  }
}
