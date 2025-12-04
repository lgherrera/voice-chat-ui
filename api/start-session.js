import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

// 1. Initialize Supabase Client
// Uses your specific environment variables from keys.png
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// 2. Helper function to create the Vapi JWT
const createVapiJWT = (assistantId, userId, chatId) => {
    // Uses the VAPI_PRIVATE_KEY from Vercel envs to sign the token
    const vapiSecretKey = process.env.VAPI_PRIVATE_KEY;

    if (!vapiSecretKey) {
        throw new Error("VAPI_PRIVATE_KEY environment variable is not set.");
    }

    // --- CRITICAL CHANGE: Placing chatId inside a 'custom' object ---
    const payload = {
        // Standard Claims
        sub: userId, 
        ast: assistantId, 
        
        // Vapi passes the 'custom' object to the webhook metadata
        custom: {
            chatId: chatId 
        }
    };

    // Sign the token: use HS256 algorithm and set it to expire in 5 min
    const token = jwt.sign(payload, vapiSecretKey, { algorithm: 'HS256', expiresIn: '5m' });
    
    return token;
};


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Get required data from the frontend request
  // Note: We expect 'vapiAssistantId' to be sent from the frontend. 
  // If you prefer to use the env var as a fallback, you can modify this line.
  const { userId, personaId, vapiAssistantId } = req.body;

  if (!userId || !personaId || !vapiAssistantId) {
    return res.status(400).json({ error: 'Missing userId, personaId, or vapiAssistantId in request body.' });
  }

  let chatId;

  try {
    // 3. FIND/CREATE CHAT_ID LOGIC

    // A. CHECK: Try to find an existing chat session
    const { data: existingChat, error: selectError } = await supabase
      .from('chats')
      .select('id')
      .eq('user_id', userId)
      .eq('persona_id', personaId)
      .limit(1);

    if (selectError) throw selectError;

    if (existingChat && existingChat.length > 0) {
      // Chat already exists, use its ID
      chatId = existingChat[0].id;
    } else {
      // B. CREATE: No chat exists, insert a new one
      const { data: newChat, error: insertError } = await supabase
        .from('chats')
        .insert({ user_id: userId, persona_id: personaId })
        .select('id');

      if (insertError) throw insertError;

      chatId = newChat[0].id;
    }

    // 4. Generate the Vapi JWT Token with the embedded chatId
    const vapiJWT = createVapiJWT(vapiAssistantId, userId, chatId);

    // 5. SUCCESS: Return the chatId (for DB) and JWT (for Vapi)
    res.status(200).json({ 
      chatId: chatId, 
      vapiJWT: vapiJWT 
    });

  } catch (error) {
    console.error('Session creation failed:', error.message);
    res.status(500).json({ error: 'Internal server error while starting session.' });
  }
}