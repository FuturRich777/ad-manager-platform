import { Resend } from 'resend';
import puppeteer from 'puppeteer';

const resend = new Resend(process.env.RESEND_API_KEY);

async function generatePDFFromHTML(data) {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.createPage();

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #F2EEE5; color: #13161A; padding: 40px 20px; }
    .container { max-width: 880px; margin: 0 auto; background: white; padding: 40px; }
    .header { border-bottom: 1px solid #13161933; padding-bottom: 20px; margin-bottom: 40px; }
    .header h1 { font-size: 32px; margin-bottom: 10px; }
    .header p { color: #6E7480; font-size: 14px; }
    .section { margin-bottom: 40px; }
    .section h2 { font-size: 18px; color: #1F4D3F; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #1F4D3F; }
    .field { margin-bottom: 20px; }
    .field label { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.16em; color: #6E7480; margin-bottom: 8px; }
    .field-value { font-size: 16px; padding: 10px; background: #FBF8F1; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Client Intake Form</h1>
      <p>Submitted: ${new Date().toLocaleString()}</p>
    </div>

    <div class="section">
      <h2>01 — About You</h2>
      <div class="field"><label>Full Name</label><div class="field-value">${data.full_name || ''}</div></div>
      <div class="field"><label>Business Name</label><div class="field-value">${data.business_name || ''}</div></div>
      <div class="field"><label>Email</label><div class="field-value">${data.email || ''}</div></div>
      <div class="field"><label>Phone</label><div class="field-value">${data.phone || ''}</div></div>
      <div class="field"><label>Website</label><div class="field-value">${data.website || ''}</div></div>
      <div class="field"><label>Service Area</label><div class="field-value">${data.service_area || ''}</div></div>
      <div class="field"><label>Social Links</label><div class="field-value">${data.social_links || ''}</div></div>
    </div>

    <div class="section">
      <h2>02 — Goals & Vision</h2>
      <div class="field"><label>Content/Ads Purpose</label><div class="field-value">${data.content_purpose || ''}</div></div>
      <div class="field"><label>Top 1-3 Goals (30-90 days)</label><div class="field-value">${data.goals_30_90 || ''}</div></div>
      <div class="field"><label>Success Picture</label><div class="field-value">${data.success_picture || ''}</div></div>
    </div>

    <div class="section">
      <h2>03 — Your Offer</h2>
      <div class="field"><label>Main Offers + Price</label><div class="field-value">${data.offers || ''}</div></div>
      <div class="field"><label>Ideal Customer</label><div class="field-value">${data.ideal_customer || ''}</div></div>
      <div class="field"><label>Biggest Differentiator</label><div class="field-value">${data.differentiator || ''}</div></div>
    </div>

    <div class="section">
      <h2>04 — Brand & Positioning</h2>
      <div class="field"><label>Brand Words</label><div class="field-value">${data.brand_words || ''}</div></div>
      <div class="field"><label>Inspiration</label><div class="field-value">${data.inspiration || ''}</div></div>
      <div class="field"><label>Brand Colors</label><div class="field-value">${data.brand_colors_hex || data.brand_color_1 || ''}</div></div>
      <div class="field"><label>Visual Style</label><div class="field-value">${data.visual_style || ''}</div></div>
      <div class="field"><label>Brand Assets Link</label><div class="field-value">${data.brand_assets_link || ''}</div></div>
    </div>

    <div class="section">
      <h2>05 — Content & Filming</h2>
      <div class="field"><label>Script Topics</label><div class="field-value">${data.script_topics || ''}</div></div>
      <div class="field"><label>Off-Limits</label><div class="field-value">${data.off_limits || ''}</div></div>
      <div class="field"><label>Content Preferences</label><div class="field-value">${data.content_prefs || ''}</div></div>
      <div class="field"><label>On-Camera Comfort Level</label><div class="field-value">${data.oncamera_level || ''}</div></div>
      <div class="field"><label>Filming Availability</label><div class="field-value">${data.filming_availability || ''}</div></div>
    </div>

    <div class="section">
      <h2>06 — Working Together</h2>
      <div class="field"><label>Ad Budget</label><div class="field-value">${data.ad_budget || ''}</div></div>
      <div class="field"><label>Great Working Relationship</label><div class="field-value">${data.relationship || ''}</div></div>
      <div class="field"><label>Anything Else</label><div class="field-value">${data.anything_else || ''}</div></div>
    </div>
  </div>
</body>
</html>
    `;

    await page.setContent(html);
    const pdf = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();
    return pdf;
  } catch (error) {
    if (browser) await browser.close();
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { full_name, business_name } = req.body;

  try {
    const pdfBuffer = await generatePDFFromHTML(req.body);

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
