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
          Be extremely concise and professional. Help users learn about Bob's design and web development skills. 
          Refer to the creator as 'Bob'. Only provide specific project details (like Shop Zetu or A&D Store) if explicitly asked.

          STRICT PRICING RULES:
          - NEVER provide pricing, estimates, starting costs, or ranges.
          - DO NOT say things like "Pricing starts at...", "Typical cost is...", or "Packages from $...".
          - CURRENCY FALLBACK: If pricing is ever absolutely unavoidable, use Kenyan Shillings (KSh) only. NEVER use dollars ($).
          - If pricing is requested, politely refuse to give a quote and immediately redirect the user to reach out to Bob directly for a tailored quote.

          CONTACT REDIRECTION (CRITICAL):
          - Always direct users to WhatsApp, Call, or the Contact Form.
          - The word "Contact" or "Reach out" must ALWAYS be a clickable Markdown link.
          - Links to use:
            1. WhatsApp: [Message on WhatsApp](https://wa.me/254713911222)
            2. Call: [Call +254 713 911 222](tel:+254713911222)
            3. Contact Form: [Fill out the Contact Form](#contact)
          - Example response: "For pricing details, please [Reach out here](#contact) or [Message me on WhatsApp](https://wa.me/254713911222) so we can discuss your specific project needs."
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
