import { createClient } from '@supabase/supabase-js';
import puppeteer from 'puppeteer';

const supabaseUrl = 'https://lmgqwgjdzrmufadfxezs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtZ3F3Z2pkenJtdWZhZGZ4ZXpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMTY0NTIsImV4cCI6MjA5Mjg5MjQ1Mn0.blobh-NlDrT4uggvs-sg6pc8GB5KNk_eC2ooT_p03PU';

const supabase = createClient(supabaseUrl, supabaseKey);

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getVisualStyleDisplay(value) {
  if (!value) return '';
  const styles = Array.isArray(value) ? value : [value];
  return styles.map(s => `<label><input type="checkbox" checked disabled><span class="pill">${escapeHtml(s)}</span></label>`).join('');
}

function getScaleDisplay(value) {
  const options = [1, 2, 3, 4, 5];
  const labels = { 1: 'Hide me', 2: 'Reluctant', 3: 'Open', 4: 'Comfortable', 5: 'Natural' };
  return options.map(num => {
    const checked = value == num ? 'checked' : '';
    return `<label><input type="radio" ${checked} disabled><span class="opt"><span class="num">${num}</span>${labels[num]}</span></label>`;
  }).join('');
}

function generateFormHTML(data) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Submission #${data.id} - MINEX MEDIA Onboarding</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
:root{--paper:#F2EEE5;--paper-2:#EAE5D9;--ink:#13161A;--ink-2:#3A3F46;--ink-3:#6E7480;--rule:#1316191A;--rule-2:#13161933;--accent:#1F4D3F;--accent-ink:#F2EEE5;--warn:#B5462A;--field-bg:#FBF8F1;}
*{box-sizing:border-box}html,body{margin:0;padding:0}body{background:var(--paper);color:var(--ink);font-family:"Inter",system-ui,-apple-system,Segoe UI,sans-serif;font-size:16px;line-height:1.55;}
.banner{background:linear-gradient(135deg,#1F4D3F 0%,#13161A 100%);color:#F2EEE5;padding:24px 28px;margin-bottom:24px;text-align:center;}
.banner h2{margin:0;font-family:'Fraunces',serif;font-size:32px;font-weight:400;}
.banner p{margin:8px 0 0 0;font-size:14px;opacity:0.9;}
.wrap{max-width:880px;margin:0 auto;padding:0 28px 96px;}
label.f{display:block;margin-bottom:16px;}label.f .lab{font-family:"JetBrains Mono",monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-2);margin-bottom:8px;display:block;}
input[type="text"],input[type="email"],input[type="tel"],input[type="url"],input[type="number"],select,textarea{width:100%;background:var(--field-bg);border:1px solid var(--rule-2);border-radius:6px;padding:13px 14px;font-family:"Inter",sans-serif;font-size:15px;color:var(--ink);line-height:1.4;}
textarea{min-height:110px;resize:vertical;line-height:1.55;}
input:disabled,textarea:disabled,select:disabled{background:#f0f0f0;cursor:not-allowed;color:var(--ink-2);}
.section{border-top:1px solid var(--rule-2);padding:48px 0 32px;}
.section h2{font-family:"Fraunces",serif;font-weight:400;font-size:22px;margin:0 0 32px;}
.row{display:grid;gap:22px;grid-template-columns:1fr 1fr;}
@media(max-width:560px){.row{grid-template-columns:1fr;}}
.checks{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;}.checks label{display:inline-block;}.checks .pill{display:inline-block;padding:9px 14px;border:1px solid var(--rule-2);border-radius:999px;background:var(--field-bg);font-size:13px;color:var(--ink-2);}.checks input:checked+.pill{background:var(--ink);color:var(--paper);border-color:var(--ink);}
.scale{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-top:8px;}.scale label{position:relative;cursor:pointer;text-align:center;}.scale input{position:absolute;opacity:0;pointer-events:none;}.scale .opt{display:block;padding:14px 6px 10px;background:var(--field-bg);border:1px solid var(--rule-2);border-radius:6px;font-size:13px;color:var(--ink-2);}.scale .opt .num{font-family:"Fraunces",serif;font-size:20px;color:var(--ink);margin-bottom:4px;}.scale input:checked+.opt{background:var(--ink);color:var(--paper-2);border-color:var(--ink);}.scale input:checked+.opt .num{color:var(--paper);}
@media print{body{background:white}@page{margin:0}}
</style>
</head>
<body>

<div class="banner">
  <h2>Submission #${data.id}</h2>
  <p>Submitted on ${new Date(data.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
</div>

<div class="wrap">
  <div class="section">
    <h2>About You</h2>
    <div class="row">
      <label class="f">
        <span class="lab">Your full name</span>
        <input type="text" value="${escapeHtml(data.full_name || '')}" disabled>
      </label>
      <label class="f">
        <span class="lab">Business name</span>
        <input type="text" value="${escapeHtml(data.business_name || '')}" disabled>
      </label>
    </div>
    <div class="row">
      <label class="f">
        <span class="lab">Email</span>
        <input type="email" value="${escapeHtml(data.email || '')}" disabled>
      </label>
      <label class="f">
        <span class="lab">Phone</span>
        <input type="tel" value="${escapeHtml(data.phone || '')}" disabled>
      </label>
    </div>
    <div class="row">
      <label class="f">
        <span class="lab">Website</span>
        <input type="url" value="${escapeHtml(data.website || '')}" disabled>
      </label>
      <label class="f">
        <span class="lab">Service area</span>
        <input type="text" value="${escapeHtml(data.service_area || '')}" disabled>
      </label>
    </div>
    <label class="f">
      <span class="lab">Social links</span>
      <textarea disabled>${escapeHtml(data.social_links || '')}</textarea>
    </label>
  </div>

  <div class="section">
    <h2>Goals &amp; Vision</h2>
    <label class="f">
      <span class="lab">What do you want the content / ads to do?</span>
      <textarea disabled>${escapeHtml(data.content_purpose || '')}</textarea>
    </label>
    <label class="f">
      <span class="lab">Top 1–3 goals for the next 30–90 days</span>
      <textarea disabled>${escapeHtml(data.goals_30_90 || '')}</textarea>
    </label>
    <label class="f">
      <span class="lab">If we crushed this project, what would success look like?</span>
      <textarea disabled>${escapeHtml(data.success_picture || '')}</textarea>
    </label>
  </div>

  <div class="section">
    <h2>Your Offer</h2>
    <label class="f">
      <span class="lab">Your main offer(s) + starting price</span>
      <textarea disabled>${escapeHtml(data.offers || '')}</textarea>
    </label>
    <label class="f">
      <span class="lab">Ideal customer — who do you want to attract?</span>
      <textarea disabled>${escapeHtml(data.ideal_customer || '')}</textarea>
    </label>
    <label class="f">
      <span class="lab">Your biggest differentiator vs competitors</span>
      <textarea disabled>${escapeHtml(data.differentiator || '')}</textarea>
    </label>
  </div>

  <div class="section">
    <h2>Brand &amp; Positioning</h2>
    <label class="f">
      <span class="lab">Describe your brand in 3–5 words</span>
      <input type="text" value="${escapeHtml(data.brand_words || '')}" disabled>
    </label>
    <label class="f">
      <span class="lab">Brands / pages you love (links) — and why</span>
      <textarea disabled>${escapeHtml(data.inspiration || '')}</textarea>
    </label>
    <label class="f">
      <span class="lab">Primary brand color(s)</span>
      <input type="text" value="${escapeHtml(data.brand_colors_hex || '')}" disabled>
    </label>
    <label class="f">
      <span class="lab">Visual style preference</span>
      <div class="checks">${getVisualStyleDisplay(data.visual_style)}</div>
    </label>
    <label class="f">
      <span class="lab">Logo &amp; brand assets</span>
      <input type="url" value="${escapeHtml(data.brand_assets_link || '')}" disabled>
    </label>
  </div>

  <div class="section">
    <h2>Content &amp; Filming</h2>
    <label class="f">
      <span class="lab">Topics you want us to make scripts about</span>
      <textarea disabled>${escapeHtml(data.script_topics || '')}</textarea>
    </label>
    <label class="f">
      <span class="lab">Anything that's "off-limits" to film or say?</span>
      <textarea disabled>${escapeHtml(data.off_limits || '')}</textarea>
    </label>
    <label class="f">
      <span class="lab">Content style + preferences</span>
      <textarea disabled>${escapeHtml(data.content_prefs || '')}</textarea>
    </label>
    <label class="f">
      <span class="lab">On-camera comfort level</span>
      <div class="scale">${getScaleDisplay(data.oncamera_level)}</div>
    </label>
    <label class="f">
      <span class="lab">Best filming days / times</span>
      <textarea disabled>${escapeHtml(data.filming_availability || '')}</textarea>
    </label>
  </div>

  <div class="section">
    <h2>Working Together</h2>
    <label class="f">
      <span class="lab">Monthly ad budget range</span>
      <input type="text" value="${escapeHtml(data.ad_budget || '')}" disabled>
    </label>
    <label class="f">
      <span class="lab">What does a great working relationship look like to you?</span>
      <textarea disabled>${escapeHtml(data.relationship || '')}</textarea>
    </label>
    <label class="f">
      <span class="lab">Anything else we should know?</span>
      <textarea disabled>${escapeHtml(data.anything_else || '')}</textarea>
    </label>
  </div>
</div>

</body>
</html>`;
}

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Submission ID required' });
  }

  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    const html = generateFormHTML(data);

    // Try to generate PDF with Puppeteer
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        printBackground: true,
      });

      if (browser) await browser.close();

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="submission-${data.id}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      return res.send(pdfBuffer);
    } catch (puppeteerError) {
      console.error('[PDF] Puppeteer error:', puppeteerError);
      if (browser) {
        try {
          await browser.close();
        } catch (e) {
          console.error('[PDF] Error closing browser:', e);
        }
      }
      // Fallback: return HTML instead of PDF
      console.log('[PDF] Falling back to HTML format');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="submission-${data.id}.html"`);
      return res.send(html);
    }
  } catch (error) {
    console.error('[DOWNLOAD] Error:', error);
    return res.status(500).json({ error: 'Failed to generate form' });
  }
}
