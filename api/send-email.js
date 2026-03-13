// api/send-email.js
// Vercel Serverless Function — Azumi RH
// Recebe os dados do formulário e envia por e-mail via Resend

export default async function handler(req, res) {

  // Só aceita POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // Permite chamada do domínio do formulário
  res.setHeader('Access-Control-Allow-Origin', 'https://diagnostico.azumirh.com.br');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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
        from: 'Azumi RH <diagnostico@azumirh.com.br>',
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
