// api/vapi-chat.ts
export const config = {
    runtime: 'edge',
  };
  
  export default async function handler(request: Request) {
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  
    const VAPI_PRIVATE_KEY = process.env.VAPI_PRIVATE_KEY;
  
    if (!VAPI_PRIVATE_KEY) {
      console.error('VAPI_PRIVATE_KEY is not set in environment variables.');
      return new Response(JSON.stringify({ error: 'Server configuration error.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  
    try {
      const { message, assistantId } = await request.json();
  
      const vapiResponse = await fetch('https://api.vapi.ai/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${VAPI_PRIVATE_KEY}`,
        },
        body: JSON.stringify({
          assistantId: assistantId,
          message: { role: 'user', content: message },
        }),
      });
  
      if (!vapiResponse.ok) {
        const errorData = await vapiResponse.text();
        console.error('Vapi API Error:', errorData);
        throw new Error(`Vapi API responded with status ${vapiResponse.status}`);
      }
  
      const responseData = await vapiResponse.json();
      
      // Send the assistant's reply back to your React app
      return new Response(JSON.stringify({ reply: responseData.message.content }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
  
    } catch (error) {
      console.error('Error in vapi-chat handler:', error);
      return new Response(JSON.stringify({ error: 'Failed to process chat message.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }