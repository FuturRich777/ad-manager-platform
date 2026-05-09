import { Resend } from 'resend';

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

function generateFormHTML(data) {
  return `<html>
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #F2EEE5;
      color: #13161A;
      padding: 40px 20px;
      line-height: 1.55;
    }
    .container {
      max-width: 880px;
      margin: 0 auto;
      background: white;
      padding: 48px 40px;
      border-radius: 2px;
    }
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(19,22,25,0.2);
      padding-bottom: 18px;
      margin-bottom: 56px;
    }
    .brand {
      font-family: "JetBrains Mono", monospace;
      font-size: 12px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }
    .brand-mark {
      display: inline-block;
      background: #13161A;
      color: #F2EEE5;
      width: 22px;
      height: 22px;
      text-align: center;
      line-height: 22px;
      font-weight: 500;
      margin-right: 8px;
    }
    .meta {
      font-family: "JetBrains Mono", monospace;
      font-size: 11px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #6E7480;
    }
    h1 {
      font-family: "Fraunces", serif;
      font-size: 42px;
      font-weight: 400;
      margin-bottom: 32px;
      line-height: 1.1;
    }
    section {
      margin-bottom: 48px;
      padding-bottom: 32px;
      border-bottom: 1px solid rgba(19,22,25,0.2);
    }
    section:last-child {
      border-bottom: none;
    }
    .section-title {
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #13161A;
      margin-bottom: 24px;
      font-family: "JetBrains Mono", monospace;
    }
    .field {
      margin-bottom: 20px;
    }
    .field-label {
      font-weight: 600;
      font-size: 13px;
      color: #13161A;
      margin-bottom: 6px;
    }
    .field-value {
      font-size: 14px;
      color: #3A3F46;
      line-height: 1.6;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    .accent {
      color: #1F4D3F;
      font-weight: 500;
    }
    footer {
      margin-top: 48px;
      padding-top: 24px;
      border-top: 1px solid rgba(19,22,25,0.2);
      font-size: 12px;
      color: #6E7480;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="brand"><span class="brand-mark">M</span> MINEX MEDIA</div>
      <div class="meta">Client Intake · Submitted</div>
    </header>

    <h1>Client Intake Form</h1>

    <section>
      <div class="section-title">01 — About You</div>
      <div class="field">
        <div class="field-label">Full Name</div>
        <div class="field-value">${escapeHtml(data.full_name)}</div>
      </div>
      <div class="field">
        <div class="field-label">Business Name</div>
        <div class="field-value">${escapeHtml(data.business_name)}</div>
      </div>
      <div class="field">
        <div class="field-label">Email</div>
        <div class="field-value">${escapeHtml(data.email)}</div>
      </div>
      <div class="field">
        <div class="field-label">Phone</div>
        <div class="field-value">${escapeHtml(data.phone)}</div>
      </div>
      <div class="field">
        <div class="field-label">Website</div>
        <div class="field-value">${escapeHtml(data.website)}</div>
      </div>
      <div class="field">
        <div class="field-label">Service Area</div>
        <div class="field-value">${escapeHtml(data.service_area)}</div>
      </div>
      <div class="field">
        <div class="field-label">Social Links</div>
        <div class="field-value">${escapeHtml(data.social_links)}</div>
      </div>
    </section>

    <section>
      <div class="section-title">02 — Goals & Vision</div>
      <div class="field">
        <div class="field-label">Content/Ads Purpose</div>
        <div class="field-value">${escapeHtml(data.content_purpose)}</div>
      </div>
      <div class="field">
        <div class="field-label">Top 1-3 Goals (30-90 days)</div>
        <div class="field-value">${escapeHtml(data.goals_30_90)}</div>
      </div>
      <div class="field">
        <div class="field-label">Success Picture</div>
        <div class="field-value">${escapeHtml(data.success_picture)}</div>
      </div>
    </section>

    <section>
      <div class="section-title">03 — Your Offer</div>
      <div class="field">
        <div class="field-label">Main Offers + Price</div>
        <div class="field-value">${escapeHtml(data.offers)}</div>
      </div>
      <div class="field">
        <div class="field-label">Ideal Customer</div>
        <div class="field-value">${escapeHtml(data.ideal_customer)}</div>
      </div>
      <div class="field">
        <div class="field-label">Biggest Differentiator</div>
        <div class="field-value">${escapeHtml(data.differentiator)}</div>
      </div>
    </section>

    <section>
      <div class="section-title">04 — Brand & Positioning</div>
      <div class="field">
        <div class="field-label">Brand Words</div>
        <div class="field-value">${escapeHtml(data.brand_words)}</div>
      </div>
      <div class="field">
        <div class="field-label">Inspiration</div>
        <div class="field-value">${escapeHtml(data.inspiration)}</div>
      </div>
      <div class="field">
        <div class="field-label">Brand Colors</div>
        <div class="field-value"><span class="accent">${escapeHtml(data.brand_colors_hex || data.brand_color_1)}</span></div>
      </div>
      <div class="field">
        <div class="field-label">Visual Style</div>
        <div class="field-value">${escapeHtml(data.visual_style)}</div>
      </div>
      <div class="field">
        <div class="field-label">Brand Assets Link</div>
        <div class="field-value">${escapeHtml(data.brand_assets_link)}</div>
      </div>
    </section>

    <section>
      <div class="section-title">05 — Content & Filming</div>
      <div class="field">
        <div class="field-label">Script Topics</div>
        <div class="field-value">${escapeHtml(data.script_topics)}</div>
      </div>
      <div class="field">
        <div class="field-label">Off-Limits</div>
        <div class="field-value">${escapeHtml(data.off_limits)}</div>
      </div>
      <div class="field">
        <div class="field-label">Content Preferences</div>
        <div class="field-value">${escapeHtml(data.content_prefs)}</div>
      </div>
      <div class="field">
        <div class="field-label">On-Camera Comfort Level</div>
        <div class="field-value">${escapeHtml(data.oncamera_level)}</div>
      </div>
      <div class="field">
        <div class="field-label">Filming Availability</div>
        <div class="field-value">${escapeHtml(data.filming_availability)}</div>
      </div>
    </section>

    <section>
      <div class="section-title">06 — Working Together</div>
      <div class="field">
        <div class="field-label">Ad Budget</div>
        <div class="field-value">${escapeHtml(data.ad_budget)}</div>
      </div>
      <div class="field">
        <div class="field-label">Great Working Relationship</div>
        <div class="field-value">${escapeHtml(data.relationship)}</div>
      </div>
      <div class="field">
        <div class="field-label">Anything Else</div>
        <div class="field-value">${escapeHtml(data.anything_else)}</div>
      </div>
    </section>

    <footer>
      Submitted ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()} · Minex Media Client Intake
    </footer>
  </div>
</body>
</html>`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { full_name, business_name } = req.body;

  try {
    const formHtml = generateFormHTML(req.body);

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'olivier@minexai.ca',
      subject: `New Client Intake: ${full_name || 'Unknown'} - ${business_name || 'Unknown'}`,
      html: formHtml,
    });

    return res.status(200).json({ success: true, message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: error.message || 'Failed to submit form' });
  }
}
