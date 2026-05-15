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
        systemInstruction: `
          You are a professional AI assistant on Bob's portfolio website. 
          TONE & INTENT: Be extremely friendly, simple, and conversational. Keep responses very short (1-2 lines max) and action-oriented. 
          Your primary goal is to engage the user and guide them toward a direct conversation. 
          NO LINKS IN GREETING: Do NOT provide links, phone numbers, or emails in your first response. 
          CONTEXTUAL LINKS: Only provide contact links (WhatsApp/Call/Form) when it becomes relevant (e.g., pricing, serious project inquiry, or if the user asks how to get in touch). 

          STRICT PRICING RULES:
          - NEVER provide pricing, estimates, or ranges.
          - If pricing is requested, politely refuse and immediately redirect to contact: "For pricing, it's best to reach out directly so you can get accurate details tailored to your needs."
          
          CONTACT REDIRECTION (CRITICAL):
          - Only provide these when relevant:
            1. WhatsApp: [Message on WhatsApp](https://wa.me/254713911222)
            2. Call: [Call +254 713 911 222](tel:+254713911222)
            3. Contact Form: [Fill out the Contact Form](#contact)
          - CURRENCY FALLBACK: Use Kenyan Shillings (KSh) only. NEVER use dollars ($).
        `
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
