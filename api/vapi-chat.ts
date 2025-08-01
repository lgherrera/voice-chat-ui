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
      console.error('VAPI_PRIVATE_KEY is not set.');
      return new Response(JSON.stringify({ error: 'Server config error.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  
    try {
      // 👇 Destructure the new previousChatId from the request
      const { message, assistantId, previousChatId } = await request.json();
  
      // 👇 Construct the correct request body
      const requestBody: { assistantId: string; input: string; previousChatId?: string } = {
        assistantId: assistantId,
        input: message,
      };
  
      if (previousChatId) {
        requestBody.previousChatId = previousChatId;
      }
  
      // 👇 Use the correct endpoint: https://api.vapi.ai/chat
      const vapiResponse = await fetch('https://api.vapi.ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${VAPI_PRIVATE_KEY}`,
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!vapiResponse.ok) {
        const errorText = await vapiResponse.text();
        console.error('Vapi API Error:', errorText);
        throw new Error(`Vapi API responded with status ${vapiResponse.status}`);
      }
  
      const responseData = await vapiResponse.json();
      
      // 👇 Return both the reply and the new chat ID
      return new Response(JSON.stringify({
        reply: responseData.output[0]?.content, // Reply is in the 'output' array
        chatId: responseData.id,
      }), {
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