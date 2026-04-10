// api/send-email.js
// Vercel Serverless Function — Azumi RH

export default async function handler(req, res) {

  const allowedOrigins = [
    'https://diagnostico.azumirh.com.br',
    'https://tools.azumirh.com.br',
    'https://azumirh.github.io',
    'http://localhost:3000'
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { subject, text } = req.body;

  if (!subject || !text) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Azumi RH <onboarding@resend.dev>',
        to: ['patricia@azumirh.com.br'],
        subject: subject,
        text: text,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('Resend error:', err);
      return res.status(500).json({ error: 'Falha ao enviar e-mail' });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Erro interno:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
