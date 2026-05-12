import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import jsPDF from 'jspdf';

const supabaseUrl = 'https://lmgqwgjdzrmufadfxezs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtZ3F3Z2pkenJtdWZhZGZ4ZXpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMTY0NTIsImV4cCI6MjA5Mjg5MjQ1Mn0.blobh-NlDrT4uggvs-sg6pc8GB5KNk_eC2ooT_p03PU';

const supabase = createClient(supabaseUrl, supabaseKey);
const resend = new Resend(process.env.RESEND_API_KEY);

function generatePDF(data) {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let yPos = margin;
  const lineHeight = 6;

  pdf.setFillColor(31, 77, 63);
  pdf.rect(0, 0, pageWidth, 28, 'F');
  pdf.setTextColor(242, 238, 229);
  pdf.setFontSize(18);
  pdf.text(`Submission #${data.id}`, margin, 12);
  pdf.setFontSize(9);
  pdf.text(`Submitted on ${new Date(data.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, margin, 22);

  yPos = 35;

  const addSection = (title, fields) => {
    if (yPos > pageHeight - 25) {
      pdf.addPage();
      yPos = margin;
    }
    pdf.setTextColor(19, 22, 26);
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.text(title, margin, yPos);
    yPos += 8;
    pdf.setFont(undefined, 'normal');

    fields.forEach(({ label, value }) => {
      if (yPos > pageHeight - 12) {
        pdf.addPage();
        yPos = margin;
      }
      pdf.setTextColor(58, 63, 70);
      pdf.setFontSize(8);
      pdf.setFont(undefined, 'bold');
      pdf.text(label + ':', margin, yPos);
      yPos += 4;
      pdf.setTextColor(110, 116, 128);
      pdf.setFont(undefined, 'normal');
      const displayValue = value || '(not provided)';
      const wrappedText = pdf.splitTextToSize(String(displayValue), contentWidth - 5);
      pdf.text(wrappedText, margin + 2, yPos);
      yPos += wrappedText.length * lineHeight + 2;
    });
    yPos += 3;
  };

  addSection('About You', [
    { label: 'Full Name', value: data.full_name },
    { label: 'Business Name', value: data.business_name },
    { label: 'Email', value: data.email },
    { label: 'Phone', value: data.phone },
    { label: 'Website', value: data.website },
    { label: 'Service Area', value: data.service_area },
  ]);

  addSection('Goals & Vision', [
    { label: 'Content Purpose', value: data.content_purpose },
    { label: 'Goals (30-90 days)', value: data.goals_30_90 },
    { label: 'Success Picture', value: data.success_picture },
  ]);

  addSection('Your Offer', [
    { label: 'Main Offers', value: data.offers },
    { label: 'Ideal Customer', value: data.ideal_customer },
    { label: 'Differentiator', value: data.differentiator },
  ]);

  addSection('Brand & Positioning', [
    { label: 'Brand Words', value: data.brand_words },
    { label: 'Brand Colors', value: data.brand_colors_hex },
    { label: 'Visual Style', value: Array.isArray(data.visual_style) ? data.visual_style.join(', ') : data.visual_style },
  ]);

  addSection('Content & Filming', [
    { label: 'Script Topics', value: data.script_topics },
    { label: 'Off Limits', value: data.off_limits },
    { label: 'Content Prefs', value: data.content_prefs },
    { label: 'On-Camera Level', value: ['Hide me', 'Reluctant', 'Open', 'Comfortable', 'Natural'][data.oncamera_level - 1] },
    { label: 'Filming Availability', value: data.filming_availability },
  ]);

  addSection('Working Together', [
    { label: 'Ad Budget', value: data.ad_budget },
    { label: 'Working Relationship', value: data.relationship },
    { label: 'Anything Else', value: data.anything_else },
  ]);

  return pdf.output('arraybuffer');
}

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
    .header { background: #1F4D3F; color: #F2EEE5; padding: 20px; text-align: center; }
    .header h2 { margin: 0; }
    .content { padding: 20px; max-width: 600px; margin: 0 auto; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; }
    a { color: #1F4D3F; text-decoration: none; }
    .button { display: inline-block; padding: 12px 24px; background: #1F4D3F; color: #F2EEE5; border-radius: 6px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <h2>New Onboarding Submission #${submissionId}</h2>
    <p>From: ${clientData.full_name || 'Client'}</p>
  </div>

  <div class="content">
    <p>A new client has submitted their onboarding form.</p>

    <p><strong>Client Details:</strong></p>
    <ul>
      <li><strong>Name:</strong> ${clientData.full_name || 'N/A'}</li>
      <li><strong>Business:</strong> ${clientData.business_name || 'N/A'}</li>
      <li><strong>Email:</strong> ${clientData.email || 'N/A'}</li>
      <li><strong>Phone:</strong> ${clientData.phone || 'N/A'}</li>
    </ul>

    <p><strong>📎 The PDF with the completed form is attached to this email.</strong></p>

    <p style="text-align: center;">
      <a href="https://onboarding.minexmedia.ca/api/view-submission?id=${submissionId}" class="button">
        View Form Online
      </a>
    </p>
  </div>

  <div class="footer">
    <p>Submission #${submissionId} • ${new Date().toLocaleDateString()}</p>
  </div>
</body>
</html>
      `;

      if (process.env.RESEND_API_KEY) {
        try {
          const { data: submissionData } = await supabase
            .from('submissions')
            .select('*')
            .eq('id', submissionId)
            .single();

          if (submissionData) {
            const pdfBuffer = generatePDF(submissionData);
            const pdfBase64 = Buffer.from(pdfBuffer).toString('base64');

            await resend.emails.send({
              from: 'noreply@minexmedia.ca',
              to: 'olivier@minexai.ca',
              subject: `New Onboarding Submission #${submissionId} - ${clientData.full_name || 'Client'}`,
              html: emailHtml,
              attachments: [
                {
                  filename: `submission-${submissionId}.pdf`,
                  content: pdfBase64,
                },
              ],
            });
            console.log('[EMAIL] Sent to olivier@minexai.ca with PDF attachment');
          }
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
