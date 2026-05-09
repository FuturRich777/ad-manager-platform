import { Resend } from 'resend';
import puppeteer from 'puppeteer';

const resend = new Resend(process.env.RESEND_API_KEY);

async function generatePDFFromHTML(data) {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.createPage();

    const html = `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Client Intake — Minex Media</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root{
      --paper:#F2EEE5;
      --paper-2:#EAE5D9;
      --ink:#13161A;
      --ink-2:#3A3F46;
      --ink-3:#6E7480;
      --rule:#1316191A;
      --rule-2:#13161933;
      --accent:#1F4D3F;
      --accent-ink:#F2EEE5;
      --warn:#B5462A;
      --field-bg:#FBF8F1;
    }
    *{box-sizing:border-box}
    html,body{margin:0;padding:0}
    body{
      background:var(--paper);
      color:var(--ink);
      font-family:"Inter", system-ui, -apple-system, Segoe UI, sans-serif;
      font-size:16px;
      line-height:1.55;
      -webkit-font-smoothing:antialiased;
      text-rendering:optimizeLegibility;
    }
    .wrap{
      position:relative;
      z-index:1;
      max-width:880px;
      margin:0 auto;
      padding:48px 28px 96px;
    }
    header.top{
      display:flex; justify-content:space-between; align-items:center;
      border-bottom:1px solid var(--rule-2);
      padding-bottom:18px;
      margin-bottom:56px;
    }
    .brand{
      display:flex; align-items:center; gap:10px;
      font-family:"JetBrains Mono", monospace;
      font-size:12px;
      letter-spacing:.18em;
      text-transform:uppercase;
      color:var(--ink);
    }
    .brand-mark{
      width:22px; height:22px;
      background:var(--ink);
      color:var(--paper);
      display:inline-flex; align-items:center; justify-content:center;
      font-family:"Fraunces", serif;
      font-weight:500;
      font-size:14px;
      line-height:1;
    }
    .meta{
      font-family:"JetBrains Mono", monospace;
      font-size:11px;
      letter-spacing:.16em;
      text-transform:uppercase;
      color:var(--ink-3);
    }
    section.field-group{
      border-top:1px solid var(--rule-2);
      padding:48px 0 8px;
      display:grid;
      grid-template-columns:140px 1fr;
      gap:40px;
    }
    .sect-head .num{
      font-family:"JetBrains Mono", monospace;
      font-size:11px;
      letter-spacing:.18em;
      color:var(--ink-3);
      margin-bottom:8px;
    }
    .sect-head h2{
      font-family:"Fraunces", serif;
      font-weight:400;
      font-size:22px;
      line-height:1.15;
      margin:0;
      letter-spacing:-0.01em;
    }
    .sect-head .sub{
      margin-top:10px;
      font-size:13px;
      color:var(--ink-3);
      line-height:1.5;
    }
    .fields{ display:grid; gap:22px; }
    .field-value{
      width:100%;
      background:var(--field-bg);
      border:1px solid var(--rule-2);
      border-radius:6px;
      padding:13px 14px;
      font-family:"Inter", sans-serif;
      font-size:15px;
      color:var(--ink);
      line-height:1.4;
    }
    label.f{ display:block; }
    label.f .lab{
      display:flex; justify-content:space-between; align-items:baseline;
      font-family:"JetBrains Mono", monospace;
      font-size:11px;
      letter-spacing:.14em;
      text-transform:uppercase;
      color:var(--ink-2);
      margin-bottom:8px;
    }
    footer.bottom{
      margin-top:72px;
      padding-top:24px;
      border-top:1px solid var(--rule-2);
      display:flex; justify-content:space-between; align-items:center;
      font-family:"JetBrains Mono", monospace;
      font-size:10px;
      letter-spacing:.18em;
      text-transform:uppercase;
      color:var(--ink-3);
    }
  </style>
</head>
<body>
<div class="wrap">
  <header class="top">
    <div class="brand">
      <span class="brand-mark">M</span>
      Minex Media
    </div>
    <div class="meta">Client Intake · Submitted</div>
  </header>

  <section class="field-group">
    <div class="sect-head">
      <div class="num">01</div>
      <h2>About You</h2>
      <div class="sub">Who you are and how to reach you.</div>
    </div>
    <div class="fields">
      <label class="f"><span class="lab">Your full name</span><div class="field-value">${data.full_name || ''}</div></label>
      <label class="f"><span class="lab">Business name</span><div class="field-value">${data.business_name || ''}</div></label>
      <label class="f"><span class="lab">Email</span><div class="field-value">${data.email || ''}</div></label>
      <label class="f"><span class="lab">Phone</span><div class="field-value">${data.phone || ''}</div></label>
      <label class="f"><span class="lab">Website</span><div class="field-value">${data.website || ''}</div></label>
      <label class="f"><span class="lab">Service area</span><div class="field-value">${data.service_area || ''}</div></label>
      <label class="f"><span class="lab">Social links</span><div class="field-value">${data.social_links || ''}</div></label>
    </div>
  </section>

  <section class="field-group">
    <div class="sect-head">
      <div class="num">02</div>
      <h2>Goals & Vision</h2>
      <div class="sub">What we're aiming at — and what hitting the bullseye looks like.</div>
    </div>
    <div class="fields">
      <label class="f"><span class="lab">What do you want the content / ads to do?</span><div class="field-value">${data.content_purpose || ''}</div></label>
      <label class="f"><span class="lab">Top 1–3 goals for the next 30–90 days</span><div class="field-value">${data.goals_30_90 || ''}</div></label>
      <label class="f"><span class="lab">If we crushed this project, what would success look like?</span><div class="field-value">${data.success_picture || ''}</div></label>
    </div>
  </section>

  <section class="field-group">
    <div class="sect-head">
      <div class="num">03</div>
      <h2>Your Offer</h2>
      <div class="sub">What you sell, who you sell it to, and why you win.</div>
    </div>
    <div class="fields">
      <label class="f"><span class="lab">Your main offer(s) + starting price</span><div class="field-value">${data.offers || ''}</div></label>
      <label class="f"><span class="lab">Ideal customer — who do you want to attract?</span><div class="field-value">${data.ideal_customer || ''}</div></label>
      <label class="f"><span class="lab">Your biggest differentiator vs competitors</span><div class="field-value">${data.differentiator || ''}</div></label>
    </div>
  </section>

  <section class="field-group">
    <div class="sect-head">
      <div class="num">04</div>
      <h2>Brand & Positioning</h2>
      <div class="sub">The look, feel, and personality we'll build around.</div>
    </div>
    <div class="fields">
      <label class="f"><span class="lab">Describe your brand in 3–5 words</span><div class="field-value">${data.brand_words || ''}</div></label>
      <label class="f"><span class="lab">Brands / pages you love (links) — and why</span><div class="field-value">${data.inspiration || ''}</div></label>
      <label class="f"><span class="lab">Primary brand color(s)</span><div class="field-value">${data.brand_colors_hex || data.brand_color_1 || ''}</div></label>
      <label class="f"><span class="lab">Visual style preference</span><div class="field-value">${data.visual_style || ''}</div></label>
      <label class="f"><span class="lab">Logo & brand assets</span><div class="field-value">${data.brand_assets_link || ''}</div></label>
    </div>
  </section>

  <section class="field-group">
    <div class="sect-head">
      <div class="num">05</div>
      <h2>Content & Filming</h2>
      <div class="sub">What to make, how to make it, and what to steer clear of.</div>
    </div>
    <div class="fields">
      <label class="f"><span class="lab">Topics you want us to make scripts about</span><div class="field-value">${data.script_topics || ''}</div></label>
      <label class="f"><span class="lab">Anything that's "off-limits" to film or say?</span><div class="field-value">${data.off_limits || ''}</div></label>
      <label class="f"><span class="lab">Content style + preferences</span><div class="field-value">${data.content_prefs || ''}</div></label>
      <label class="f"><span class="lab">On-camera comfort level</span><div class="field-value">${data.oncamera_level || ''}</div></label>
      <label class="f"><span class="lab">Best filming days / times</span><div class="field-value">${data.filming_availability || ''}</div></label>
    </div>
  </section>

  <section class="field-group">
    <div class="sect-head">
      <div class="num">06</div>
      <h2>Working Together</h2>
      <div class="sub">Budget, working style, and anything else we should know.</div>
    </div>
    <div class="fields">
      <label class="f"><span class="lab">Monthly ad budget range</span><div class="field-value">${data.ad_budget || ''}</div></label>
      <label class="f"><span class="lab">What does a great working relationship look like to you?</span><div class="field-value">${data.relationship || ''}</div></label>
      <label class="f"><span class="lab">Anything else we should know?</span><div class="field-value">${data.anything_else || ''}</div></label>
    </div>
  </section>

  <footer class="bottom">
    <span>© Minex Media · Velocity Engineers</span>
    <span>Submitted ${new Date().toLocaleString()}</span>
  </footer>
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
