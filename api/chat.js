import { GoogleGenerativeAI } from '@google/genai';

// Initialize the Google Gen AI SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export default async function handler(req, res) {
  // GET handler for debugging
  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: "Service Active", 
      has_key: !!process.env.GEMINI_API_KEY 
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userMessage } = req.body;
    if (!userMessage) return res.status(400).json({ error: 'Message is required' });

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured in Vercel environment variables.");
    }

    // Official Stable Pattern
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "You are a professional AI assistant on Bob's portfolio. Be extremely concise (1-2 lines). Never give prices; instead, provide clickable links for WhatsApp or calling if relevant."
    });

    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ reply: text });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    return res.status(500).json({ 
      error: "AI Connection Failed", 
      details: error.message 
    });
  }
}
