import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ status: "Service Active" });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userMessage } = req.body;
    if (!userMessage) return res.status(400).json({ error: 'Message is required' });

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Missing API Key" });
    }

    // Try gemini-1.5-flash-latest for best technical performance & stability
    const modelName = "gemini-1.5-flash-latest";
    const model = genAI.getGenerativeModel({ 
      model: modelName,
      systemInstruction: "You are a professional AI assistant on Bob's portfolio. Be extremely concise (1-2 lines). No pricing. Provide clickable links for WhatsApp or calling only when relevant."
    });

    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ reply: text });

  } catch (error) {
    console.error("AI ERROR:", error);
    return res.status(500).json({ 
      error: "AI Connection Failed", 
      details: error.message 
    });
  }
}
