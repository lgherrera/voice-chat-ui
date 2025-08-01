// src/pages/api/vapi-chat.ts
// This code runs on the server (Vercel Edge Function) and is a secure backend.

import { type NextApiRequest, type NextApiResponse } from 'next';

// Define the expected request body structure
interface RequestBody {
  message: string;
  assistantId: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Securely get the secret key from environment variables
  const VAPI_SECRET_KEY = process.env.VAPI_SECRET_KEY;

  if (!VAPI_SECRET_KEY) {
    console.error('VAPI_SECRET_KEY is not set in environment variables.');
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  try {
    const { message, assistantId } = req.body as RequestBody;

    // This is the actual call from your secure backend to the Vapi API
    const vapiResponse = await fetch('https://api.vapi.ai/chat/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${VAPI_SECRET_KEY}`,
      },
      body: JSON.stringify({
        assistantId: assistantId,
        message: {
          role: 'user',
          content: message,
        },
      }),
    });

    if (!vapiResponse.ok) {
      const errorData = await vapiResponse.json();
      console.error('Vapi API Error:', errorData);
      throw new Error(`Vapi API responded with status ${vapiResponse.status}`);
    }

    const responseData = await vapiResponse.json();
    
    // Send the assistant's reply back to your React app
    // Assuming the reply is in responseData.message.content
    res.status(200).json({ reply: responseData.message.content });

  } catch (error) {
    console.error('Error in vapi-chat handler:', error);
    res.status(500).json({ error: 'Failed to process chat message.' });
  }
}