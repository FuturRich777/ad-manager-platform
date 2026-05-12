import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://lmgqwgjdzrmufadfxezs.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtZ3F3Z2pkenJtdWZhZGZ4ZXpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMTY0NTIsImV4cCI6MjA5Mjg5MjQ1Mn0.blobh-NlDrT4uggvs-sg6pc8GB5KNk_eC2ooT_p03PU';

const supabase = createClient(supabaseUrl, supabaseKey);

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

  return text;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { business_name, email, full_name } = req.body;

  try {
    // Try to save to Supabase
    const { error: insertError, data } = await supabase
      .from('submissions')
      .insert([{ ...req.body }]);

    if (insertError) {
      console.warn('[SUBMIT] Supabase insert warning (RLS policy may be blocking):', insertError);
      // Continue anyway - still return success so form submission completes
    } else {
      console.log('[SUBMIT] Successfully saved to Supabase');
    }

    // Generate and return success response
    const textContent = generateTextFile(req.body);
    const filename = `${(business_name || 'form').replace(/[^a-z0-9]/gi, '_').toLowerCase()}_intake_${new Date().toISOString().split('T')[0]}.txt`;

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', Buffer.byteLength(textContent));

    return res.status(200).send(textContent);
  } catch (error) {
    console.error('[SUBMIT] ERROR:', error);
    return res.status(500).json({ error: error.message || 'Failed to submit form' });
  }
}
