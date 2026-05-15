import { GoogleGenAI } from '@google/genai';

// Initialize the Google Gen AI SDK using your hidden environment variable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userMessage } = req.body;

    if (!userMessage) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Call the lightning-fast Gemini 1.5 Flash model
    // Note: 'gemini-1.5-flash' is the stable flagship flash model
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: "You are an AI assistant on Bob's portfolio website. Be professional, concise, and help users learn about Bob's design and web development skills. Refer to Bob Thuo Njehu as the creator."
      }
    });

    // Send Gemini's text response back to the frontend
    // The new SDK structure returns the text directly in some versions or via response property
    const reply = response.text || (response.candidates && response.candidates[0].content.parts[0].text);

    return res.status(200).json({ reply: reply || "I'm here to help! What would you like to know?" });

  } catch (error) {
    console.error("AI Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
