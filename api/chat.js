import { GoogleGenAI } from '@google/genai';

// Initialize the Google Gen AI SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  // 1. Add a GET handler for easy browser testing
  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: "Service Active", 
      message: "The AI API is reachable. Please use POST for chat queries." 
    });
  }

  // 2. Handle the POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userMessage } = req.body;

    if (!userMessage) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Call Gemini 3 Flash
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: "You are a professional AI assistant on Bob's portfolio. Be concise."
      }
    });

    const reply = response.text || "I'm here to help!";
    return res.status(200).json({ reply: reply });

  } catch (error) {
    console.error("CRITICAL AI Error:", error);
    // Ensure we ALWAYS return JSON
    return res.status(500).json({ 
      error: "Internal Server Error", 
      details: error.message,
      note: "Check if GEMINI_API_KEY is set in Vercel environment variables."
    });
  }
}
