export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, subject, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // 'onboarding@resend.dev' is their free tier testing address
        from: 'Portfolio Setup <onboarding@resend.dev>', 
        to: 'yashpree237915@gmail.com', // Must match your verified Resend account
        subject: `New Portfolio Message: ${subject || 'No Subject'}`,
        reply_to: email,
        html: `
          <h3>New Contact Form Submission</h3>
          <p><strong>From:</strong> ${name} (${email})</p>
          <hr />
          <p>${message.replace(/\n/g, '<br>')}</p>
        `
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to route email');
    }

    return res.status(200).json({ success: true, message: 'Message sent successfully.' });

  } catch (error) {
    console.error('Microservice Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
