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
  const margin = 14;
  const contentWidth = pageWidth - 2 * margin;
  let yPos = margin;

  // Color scheme from form
  const colors = {
    darkGreen: [31, 77, 63],
    cream: [242, 238, 229],
    darkText: [19, 22, 26],
    mediumText: [58, 63, 70],
    lightText: [110, 116, 128],
    lightBg: [251, 248, 241],
    border: [211, 211, 211],
  };

  // Header banner
  pdf.setFillColor(...colors.darkGreen);
  pdf.rect(0, 0, pageWidth, 24, 'F');
  pdf.setTextColor(...colors.cream);
  pdf.setFontSize(20);
  pdf.setFont(undefined, 'bold');
  pdf.text('MINEX MEDIA Onboarding', margin, 10);
  pdf.setFontSize(9);
  pdf.setFont(undefined, 'normal');
  pdf.text(`Submission #${data.id}`, margin, 16);
  pdf.text(`${new Date(data.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, margin, 20);

  yPos = 32;

  const addFormField = (label, value, width = contentWidth) => {
    const boxHeight = 6;
    const labelHeight = 3;
    const spacing = 2;

    // Check page break
    if (yPos + labelHeight + boxHeight + spacing > pageHeight - 6) {
      pdf.addPage();
      yPos = margin;
    }

    // Label
    pdf.setFontSize(7);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(...colors.mediumText);
    pdf.text(label, margin + 1, yPos + 2);
    yPos += labelHeight + 1;

    // Input box
    pdf.setDrawColor(...colors.border);
    pdf.setLineWidth(0.3);
    pdf.rect(margin, yPos, width, boxHeight);

    // Field value
    pdf.setFontSize(9);
    pdf.setFont(undefined, 'normal');
    pdf.setTextColor(...colors.darkText);
    const displayValue = value ? String(value) : '';
    const wrappedText = pdf.splitTextToSize(displayValue, width - 2);
    pdf.text(wrappedText.slice(0, 1), margin + 1, yPos + 4);

    yPos += boxHeight + spacing;
  };

  const addSection = (title) => {
    if (yPos > pageHeight - 20) {
      pdf.addPage();
      yPos = margin;
    }
    // Section divider
    pdf.setDrawColor(...colors.border);
    pdf.setLineWidth(0.2);
    pdf.line(margin, yPos - 1, pageWidth - margin, yPos - 1);

    // Section title
    pdf.setFontSize(11);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(...colors.darkGreen);
    pdf.text(title, margin, yPos + 3);
    yPos += 6;
  };

  // About You
  addSection('About You');
  addFormField('Your full name', data.full_name, contentWidth / 2 - 1);
  addFormField('Business name', data.business_name, contentWidth / 2 - 1);
  addFormField('Email', data.email, contentWidth / 2 - 1);
  addFormField('Phone', data.phone, contentWidth / 2 - 1);
  addFormField('Website', data.website, contentWidth / 2 - 1);
  addFormField('Service area', data.service_area, contentWidth / 2 - 1);
  addFormField('Social links', data.social_links || '');

  // Goals & Vision
  addSection('Goals & Vision');
  addFormField('What do you want the content / ads to do?', data.content_purpose);
  addFormField('Top 1–3 goals for the next 30–90 days', data.goals_30_90);
  addFormField('If we crushed this project, what would success look like?', data.success_picture);

  // Your Offer
  addSection('Your Offer');
  addFormField('Your main offer(s) + starting price', data.offers);
  addFormField('Ideal customer — who do you want to attract?', data.ideal_customer);
  addFormField('Your biggest differentiator vs competitors', data.differentiator);

  // Brand & Positioning
  addSection('Brand & Positioning');
  addFormField('Describe your brand in 3–5 words', data.brand_words);
  addFormField('Brands / pages you love (links) — and why', data.inspiration);
  addFormField('Primary brand color(s)', data.brand_colors_hex);
  addFormField('Visual style preference', Array.isArray(data.visual_style) ? data.visual_style.join(', ') : (data.visual_style || ''));
  addFormField('Logo & brand assets', data.brand_assets_link);

  // Content & Filming
  addSection('Content & Filming');
  addFormField('Topics you want us to make scripts about', data.script_topics);
  addFormField('Anything that\'s "off-limits" to film or say?', data.off_limits);
  addFormField('Content style + preferences', data.content_prefs);
  const cameraLabels = ['', 'Hide me', 'Reluctant', 'Open', 'Comfortable', 'Natural'];
  addFormField('On-camera comfort level', cameraLabels[data.oncamera_level] || '');
  addFormField('Best filming days / times', data.filming_availability);

  // Working Together
  addSection('Working Together');
  addFormField('Monthly ad budget range', data.ad_budget);
  addFormField('What does a great working relationship look like to you?', data.relationship);
  addFormField('Anything else we should know?', data.anything_else);

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
            // Generate PDF directly
            try {
              const pdfBuffer = generatePDF(submissionData);
              const pdfBase64 = Buffer.from(pdfBuffer).toString('base64');

              await resend.emails.send({
                from: 'noreply@minexmedia.ca',
                to: 'olivier@minexai.ca',
                subject: `New Onboarding Submission #${submissionId} - ${clientData.full_name || 'Client'}`,
                html: emailHtml,
                attachments: [
                  {
                    filename: `onboarding-submission-${submissionId}.pdf`,
                    content: pdfBase64,
                    encoding: 'base64',
                  },
                ],
              });
              console.log('[EMAIL] Sent to olivier@minexai.ca with PDF attachment');
            } catch (pdfError) {
              console.error('[PDF] Error generating PDF:', pdfError);
              // Send without attachment if PDF fails
              await resend.emails.send({
                from: 'noreply@minexmedia.ca',
                to: 'olivier@minexai.ca',
                subject: `New Onboarding Submission #${submissionId} - ${clientData.full_name || 'Client'}`,
                html: emailHtml,
              });
              console.log('[EMAIL] Sent to olivier@minexai.ca (PDF generation failed)');
            }
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
