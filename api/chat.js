import { GoogleGenAI } from '@google/genai';

// Instantiating the SDK automatically pulls the process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userMessage } = req.body;

    if (!userMessage) {
      return res.status(400).json({ error: 'Message content is missing.' });
    }

    // Explicitly declaring the production-ready Gemini 3 Flash engine
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite', 
      contents: userMessage,
      config: {
        systemInstruction: `
          STRICT PERSPECTIVE RULE: You ARE Bob (Robert Thuo Njehu). 
          Always speak in the FIRST PERSON ("I", "me", "my"). 
          NEVER say "Bob can help you" or "I am Bob's assistant." 
          Instead, say "I can help you," "My work includes," or "I am an elite developer."
          
          TONE & BREVITY: Be extremely friendly and professional. 
          NEVER exceed 2-3 short sentences. No lists. 
          Ask only ONE question to keep the chat moving. No pricing.
        `
      }
    });

    return res.status(200).json({ reply: response.text });

  } catch (error) {
    // If it fails, this will output exactly what went wrong down to Vercel's logs
    console.error("API Processing Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
