import { createClient } from '@supabase/supabase-js';
import jsPDF from 'jspdf';

const supabaseUrl = 'https://lmgqwgjdzrmufadfxezs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtZ3F3Z2pkenJtdWZhZGZ4ZXpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMTY0NTIsImV4cCI6MjA5Mjg5MjQ1Mn0.blobh-NlDrT4uggvs-sg6pc8GB5KNk_eC2ooT_p03PU';

const supabase = createClient(supabaseUrl, supabaseKey);

function getLevelLabel(value) {
  const labels = { 1: 'Hide me', 2: 'Reluctant', 3: 'Open', 4: 'Comfortable', 5: 'Natural' };
  return labels[value] || '';
}

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
    pdf.setFontSize(9);

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
      pdf.setFontSize(8);

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
    { label: 'Social Links', value: data.social_links },
  ]);

  addSection('Goals & Vision', [
    { label: 'What do you want the content / ads to do?', value: data.content_purpose },
    { label: 'Top 1–3 goals for the next 30–90 days', value: data.goals_30_90 },
    { label: 'If we crushed this project, what would success look like?', value: data.success_picture },
  ]);

  addSection('Your Offer', [
    { label: 'Your main offer(s) + starting price', value: data.offers },
    { label: 'Ideal customer — who do you want to attract?', value: data.ideal_customer },
    { label: 'Your biggest differentiator vs competitors', value: data.differentiator },
  ]);

  addSection('Brand & Positioning', [
    { label: 'Describe your brand in 3–5 words', value: data.brand_words },
    { label: 'Brands / pages you love (links) — and why', value: data.inspiration },
    { label: 'Primary brand color(s)', value: data.brand_colors_hex },
    { label: 'Visual style preference', value: Array.isArray(data.visual_style) ? data.visual_style.join(', ') : data.visual_style },
    { label: 'Logo & brand assets', value: data.brand_assets_link },
  ]);

  addSection('Content & Filming', [
    { label: 'Topics you want us to make scripts about', value: data.script_topics },
    { label: 'Anything that\'s "off-limits" to film or say?', value: data.off_limits },
    { label: 'Content style + preferences', value: data.content_prefs },
    { label: 'On-camera comfort level', value: getLevelLabel(data.oncamera_level) },
    { label: 'Best filming days / times', value: data.filming_availability },
  ]);

  addSection('Working Together', [
    { label: 'Monthly ad budget range', value: data.ad_budget },
    { label: 'What does a great working relationship look like to you?', value: data.relationship },
    { label: 'Anything else we should know?', value: data.anything_else },
  ]);

  return pdf;
}

export default async function handler(req, res) {
  const method = req.method ? req.method.toUpperCase() : 'GET';

  if (method === 'GET') {
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

      const pdf = generatePDF(data);
      const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="submission-${data.id}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      return res.status(200).send(pdfBuffer);
    } catch (error) {
      console.error('[DOWNLOAD] Error:', error);
      return res.status(500).json({ error: 'Failed to generate PDF' });
    }
  }

  if (method === 'POST') {
    try {
      const data = req.body;
      if (!data.id) {
        return res.status(400).json({ error: 'Submission ID required in data' });
      }

      const pdf = generatePDF(data);
      const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="submission-${data.id}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      return res.status(200).send(pdfBuffer);
    } catch (error) {
      console.error('[DOWNLOAD] Error:', error);
      return res.status(500).json({ error: 'Failed to generate PDF' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
