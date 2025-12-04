import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

// 1. Initialize Supabase Client
// Uses your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from Vercel envs
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

    // The payload contains data Vapi uses to manage the session (e.g., routing)
    const payload = {
        // 'sub' (subject) is commonly used for the user ID
        sub: userId, 
        // Custom claims to pass useful context to Vapi
        chatId: chatId, 
        ast: assistantId // Assistant ID
    };

    // Sign the token: use HS256 algorithm and set it to expire relatively soon (e.g., 5 min)
    const token = jwt.sign(payload, vapiSecretKey, { algorithm: 'HS256', expiresIn: '5m' });
    
    return token;
};


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Get required data from the frontend request
  const { userId, personaId, vapiAssistantId } = req.body;

  if (!userId || !personaId || !vapiAssistantId) {
    return res.status(400).json({ error: 'Missing userId, personaId, or vapiAssistantId in request body.' });
  }

  let chatId;

  try {
    // 3. FIND/CREATE CHAT_ID LOGIC

    // A. CHECK: Try to find an existing chat session for this user/persona combination
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
        .select('id'); // Retrieve the newly created ID

      if (insertError) throw insertError;

      chatId = newChat[0].id;
    }

    // 4. Generate the Vapi JWT Token
    const vapiJWT = createVapiJWT(vapiAssistantId, userId, chatId);

    // 5. SUCCESS: Send the required data back to the frontend for the direct Vapi connection
    res.status(200).json({ 
      chatId: chatId, 
      vapiJWT: vapiJWT 
    });

  } catch (error) {
    console.error('Session creation failed:', error.message);
    // Be careful not to expose sensitive error details to the client
    res.status(500).json({ error: 'Internal server error while starting session.' });
  }
}