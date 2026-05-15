import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { userMessage } = req.body;
    if (!userMessage) return res.status(400).json({ error: 'Message is required' });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Utilizing the latest Gemini 3 Flash engine
      contents: userMessage,
      config: {
        systemInstruction: `
          You are an elite AI Agent acting as a Senior Full-Stack Developer & Lead Designer representing Bob (Robert Thuo Njehu), a high-caliber technical professional based in Kenya. 
          Your goal is to showcase Bob's skills, provide immediate technical utility to visitors, and capture high-intent business leads/clients.

          ABOUT BOB (THE PROFESSIONAL):
          - Core Roles: Professional Graphic Designer, Web Developer, Video Editor, UI/UX Specialist, and ICT Technical Consultant.
          - Design Stack: Adobe Illustrator (expert vector generation, custom layouts), CapCut, and Shotcut (advanced multi-layer video editing, dynamic text overlays, precision trimming).
          - Engineering Stack: HTML5, CSS3, JavaScript, PHP, WordPress (custom themes/architecture), and advanced Search Engine Optimization (SEO).
          - Active Professional Brands:
            1. "The Code Hub" - Bob's official TikTok and content brand focused on the intersection of clean code and modern design aesthetics.
            2. Freelance: Top-tier independent consultant active on Upwork.
      config: {
        systemInstruction: "You are a professional AI assistant on Bob's portfolio website. Be extremely concise and professional. Help users learn about Bob's design and web development skills. Refer to the creator as 'Bob'. Only provide specific project details (like Shop Zetu or A&D Store) if explicitly asked by the user."
      }
    });

    return res.status(200).json({ reply: response.text });
  } catch (error) {
    console.error("AI Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
