import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'olivier@minexai.ca',
      subject: 'Test Email from Minex Media',
      html: `
        <h1>Test Email</h1>
        <p>This is a test email from your form submission system.</p>
        <p>If you're seeing this, the email service is working correctly!</p>
        <p>Sent at: ${new Date().toISOString()}</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: 'Test email sent successfully',
      result
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    return res.status(500).json({
      error: error.message || 'Failed to send test email',
      details: error
    });
  }
}
