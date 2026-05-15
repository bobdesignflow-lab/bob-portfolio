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
          STRICT BREVITY RULE: You are a professional chat assistant for Bob. 
          NEVER exceed 2-3 short sentences. 
          STRICTLY PROHIBITED from sending long paragraphs or lists. 
          Speak like a real person in a fast chat. 
          Ask only ONE simple question at a time to keep the client engaged.
          Refer to the creator as 'Bob'. No pricing.
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
