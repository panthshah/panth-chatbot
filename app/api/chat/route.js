// app/api/chat/route.js
export const runtime = 'edge';

export async function POST(req) {
  try {
    const body = await req.json();
    console.log('Request body:', body);

    const apiKey = process.env.OPENAI_API_KEY;
    console.log('API key exists:', !!apiKey);
    console.log('API key length:', apiKey?.length);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are an AI assistant representing Panth Shah's portfolio. Answer questions about Panth professionally and concisely.

PANTH SHAH - PORTFOLIO DATA:
• Engineer-turned-Product Designer with CS background from Northeastern University (2024)
• Led end-to-end design of FounderMatch at FounderWay.ai - co-founder matching platform that launched April 2024 with 200+ users in first month
• Built scalable design system with 300+ reusable components at FounderWay.ai
• Digital Experience Designer at Northeastern University ITS - improved Student Hub platform
• Conducted comprehensive accessibility audits across multiple platforms
• Tools: Figma, FigJam/Miro, Adobe CC, Framer, with front-end development skills
• Philosophy: Blends technical foundation with user-centric design, advocates for accessibility and inclusive design
• Showcased FounderMatch at Harvard Innovation Labs (Techstars '24) demo event

KEY PROJECTS:
• FounderMatch: MVP platform connecting startup founders with co-founders based on skills/vision alignment. Led UX research, designed matching algorithm UI, launched with strong user engagement
• Design System: Organized scattered UI components into coherent 300+ component system at FounderWay.ai
• Accessibility Audit: Comprehensive audit improving digital inclusion across university platforms
• Student Hub: Enhanced Northeastern's digital platform user experience

PERSONAL: Music lover, pickleball player, cooking enthusiast, photography hobbyist, night owl who "crafts with care and caffeine beyond 1 AM"

CONTACT: https://www.panthshah.work/

INSTRUCTIONS:
- Keep responses under 100 words to minimize costs
- Be helpful and professional  
- Provide specific project details when asked
- Encourage users to visit his portfolio for more details`
          },
          {
            role: "user",
            content: body.message
          }
        ],
        temperature: 0.3,
        max_tokens: 150,
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response statusText:', response.statusText);

    const data = await response.json();
    console.log('Response data:', data);
    
    // Check for API errors
    if (!response.ok) {
      console.error('OpenAI API Error:', data);
      return new Response(JSON.stringify({ 
        reply: "Sorry, I'm having trouble connecting to the AI service right now. Please try again later." 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // Check if choices exist
    if (!data.choices || data.choices.length === 0) {
      console.error('No choices in OpenAI response:', data);
      return new Response(JSON.stringify({ 
        reply: "Sorry, I couldn't generate a response. Please try again." 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    return new Response(JSON.stringify({ reply: data.choices[0].message.content }), {
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    console.error('API route error:', error);
    return new Response(JSON.stringify({ 
      reply: "Sorry, there was an unexpected error. Please try again." 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
