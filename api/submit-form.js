import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabaseUrl = 'https://lmgqwgjdzrmufadfxezs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtZ3F3Z2pkenJtdWZhZGZ4ZXpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMTY0NTIsImV4cCI6MjA5Mjg5MjQ1Mn0.blobh-NlDrT4uggvs-sg6pc8GB5KNk_eC2ooT_p03PU';

const supabase = createClient(supabaseUrl, supabaseKey);
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  const method = req.method ? req.method.toUpperCase() : 'GET';

  if (method === 'POST') {
    try {
      const { error, data } = await supabase
        .from('submissions')
        .insert([{ ...req.body }]);

      if (error) {
        console.error('[SUBMIT] Error:', error);
        return res.status(500).json({ error: error.message });
      }

      const submissionId = data?.[0]?.id;
      const clientData = req.body;

      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; }
    .header { background: #1F4D3F; color: #F2EEE5; padding: 20px; border-radius: 8px 8px 0 0; }
    .header h2 { margin: 0; }
    .section { border-top: 1px solid #ddd; padding: 20px 0; }
    .section h3 { color: #1F4D3F; margin-top: 0; }
    .field { margin-bottom: 15px; }
    .label { font-weight: 600; color: #555; font-size: 12px; text-transform: uppercase; }
    .value { color: #333; margin-top: 5px; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
    a { color: #1F4D3F; }
  </style>
</head>
<body>
  <div class="header">
    <h2>New Onboarding Form Submission #${submissionId}</h2>
    <p>Submitted on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
  </div>

  <div style="padding: 20px; max-width: 600px; margin: 0 auto;">
    <div class="section">
      <h3>About You</h3>
      <div class="field">
        <div class="label">Full Name</div>
        <div class="value">${clientData.full_name || 'N/A'}</div>
      </div>
      <div class="field">
        <div class="label">Business Name</div>
        <div class="value">${clientData.business_name || 'N/A'}</div>
      </div>
      <div class="field">
        <div class="label">Email</div>
        <div class="value">${clientData.email || 'N/A'}</div>
      </div>
      <div class="field">
        <div class="label">Phone</div>
        <div class="value">${clientData.phone || 'N/A'}</div>
      </div>
      <div class="field">
        <div class="label">Website</div>
        <div class="value">${clientData.website || 'N/A'}</div>
      </div>
      <div class="field">
        <div class="label">Service Area</div>
        <div class="value">${clientData.service_area || 'N/A'}</div>
      </div>
    </div>

    <div class="section">
      <h3>Goals & Vision</h3>
      <div class="field">
        <div class="label">Content Purpose</div>
        <div class="value">${clientData.content_purpose || 'N/A'}</div>
      </div>
      <div class="field">
        <div class="label">Goals (30-90 days)</div>
        <div class="value">${clientData.goals_30_90 || 'N/A'}</div>
      </div>
      <div class="field">
        <div class="label">Success Picture</div>
        <div class="value">${clientData.success_picture || 'N/A'}</div>
      </div>
    </div>

    <div class="section">
      <h3>Your Offer</h3>
      <div class="field">
        <div class="label">Main Offer(s) & Starting Price</div>
        <div class="value">${clientData.offers || 'N/A'}</div>
      </div>
      <div class="field">
        <div class="label">Ideal Customer</div>
        <div class="value">${clientData.ideal_customer || 'N/A'}</div>
      </div>
      <div class="field">
        <div class="label">Biggest Differentiator</div>
        <div class="value">${clientData.differentiator || 'N/A'}</div>
      </div>
    </div>

    <div class="section">
      <h3>Brand & Positioning</h3>
      <div class="field">
        <div class="label">Brand Words</div>
        <div class="value">${clientData.brand_words || 'N/A'}</div>
      </div>
      <div class="field">
        <div class="label">Brand Colors</div>
        <div class="value">${clientData.brand_colors_hex || 'N/A'}</div>
      </div>
      <div class="field">
        <div class="label">Visual Style</div>
        <div class="value">${Array.isArray(clientData.visual_style) ? clientData.visual_style.join(', ') : clientData.visual_style || 'N/A'}</div>
      </div>
    </div>

    <div class="section">
      <h3>Content & Filming</h3>
      <div class="field">
        <div class="label">Monthly Ad Budget</div>
        <div class="value">${clientData.ad_budget || 'N/A'}</div>
      </div>
      <div class="field">
        <div class="label">On-Camera Comfort Level</div>
        <div class="value">${['Hide me', 'Reluctant', 'Open', 'Comfortable', 'Natural'][clientData.oncamera_level - 1] || 'N/A'}</div>
      </div>
    </div>

    <div class="footer">
      <p><strong>View Full Submission:</strong></p>
      <p><a href="https://onboarding.minexmedia.ca/submissions?id=${submissionId}">Click here to view the complete submission with the visual form</a></p>
      <p>Or download the PDF: <a href="https://awesome-goldberg-cf206d.vercel.app/api/download-form?id=${submissionId}">Download Submission #${submissionId}</a></p>
    </div>
  </div>
</body>
</html>
      `;

      if (process.env.RESEND_API_KEY) {
        try {
          await resend.emails.send({
            from: 'noreply@minexmedia.ca',
            to: 'olivier@minexai.ca',
            subject: `New Onboarding Submission #${submissionId} - ${clientData.full_name || 'Client'}`,
            html: emailHtml,
          });
          console.log('[EMAIL] Sent to olivier@minexai.ca');
        } catch (emailError) {
          console.error('[EMAIL] Error:', emailError);
        }
      }

      console.log('[SUBMIT] Saved to Supabase:', data);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      console.error('[SUBMIT] Error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  if (method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[GET] Error:', error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(data || []);
    } catch (error) {
      console.error('[GET] Error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
