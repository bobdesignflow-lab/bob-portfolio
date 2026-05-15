import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Gen AI SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userMessage } = req.body;

    if (!userMessage) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Using Gemini 1.5 Flash (stable) or 2.0/2.5 as requested by user
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "You are an AI assistant on Bob's portfolio website. Be professional, concise, and help users learn about Bob's design and web development skills. Refer to Bob Thuo Njehu as the creator."
    });

    const result = await model.generateContent(userMessage);
    const responseText = result.response.text();

    return res.status(200).json({ reply: responseText });

  } catch (error) {
    console.error("AI Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
