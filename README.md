# 🤖 Panth's Portfolio AI Chatbot

A beautiful, cost-optimized AI chatbot component that can be embedded into any portfolio website. Visitors can ask questions about you and get instant AI-powered responses based on your portfolio data.

## ✨ Features

- 🎨 **Beautiful Floating Design** - Elegant chat button and sliding sidebar
- 💰 **Cost Optimized** - Stay within budget with smart limits and short responses
- 📱 **Mobile Responsive** - Works perfectly on all devices
- ⚡ **Easy Integration** - Drop-in component for any React/Next.js site
- 🔧 **Customizable** - Easy to modify colors, content, and behavior

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up OpenAI API Key
Create a `.env.local` file:
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Run the Project
```bash
npm run dev
```

Visit `http://localhost:3000` to see it in action!

## 💰 Cost Optimization (Stay Within $10 Budget)

The chatbot is optimized to minimize OpenAI API costs:

- ✅ **Max 150 tokens per response** (~$0.0002 per message)
- ✅ **Short, focused responses** under 100 words
- ✅ **Lower temperature (0.3)** for consistent, efficient responses
- ✅ **Simple system prompt** to reduce input tokens

**Estimated Usage:**
- ~5,000 messages with your $10 budget
- Average cost: $0.002 per conversation
- Monitor usage at [OpenAI Usage Dashboard](https://platform.openai.com/usage)

## 🔧 Integration into Your Portfolio

### Option 1: Copy the Component
1. Copy `app/components/FloatingChat.tsx` to your project
2. Copy `app/api/chat/route.js` for the API endpoint
3. Add to your page:
```tsx
import FloatingChat from './components/FloatingChat';

export default function YourPortfolio() {
  return (
    <div>
      {/* Your portfolio content */}
      <FloatingChat />
    </div>
  );
}
```

### Option 2: Iframe Embed (External Sites)
Deploy this project and embed as iframe:
```html
<iframe 
  src="https://your-deployed-chatbot.vercel.app/embed" 
  style="position: fixed; bottom: 20px; right: 20px; width: 400px; height: 600px; border: none; z-index: 1000;"
></iframe>
```

## 📝 Customize Your Portfolio Data

Edit the system prompt in `app/api/chat/route.js`:

```javascript
content: \`You are an AI assistant representing [YOUR NAME]'s portfolio.

[YOUR NAME] - PORTFOLIO DATA:
• [Your profession and passion]
• Skilled in [your skills]
• Experience in [your experience areas]
• [Your unique strengths]
• [Contact information or call-to-action]

INSTRUCTIONS:
- Keep responses under 100 words to minimize costs
- Be helpful and professional
- Focus on [your specialties]
- Encourage users to contact [you] for more details\`
```

## 🎨 Customization

### Change Colors
In `app/components/FloatingChat.tsx`, update the color classes:
```tsx
// Button color
className="bg-blue-600 hover:bg-blue-700"  // Change blue to your brand color

// Header gradient
className="bg-gradient-to-r from-blue-600 to-indigo-600"  // Your brand gradient
```

### Modify Behavior
- **Auto-open chat**: Set `useState(true)` for `isOpen`
- **Change position**: Modify `bottom-6 right-6` classes
- **Resize panel**: Change `w-96` (384px width)

## 📊 Monitoring & Analytics

Track your chatbot performance:

1. **OpenAI Usage**: [platform.openai.com/usage](https://platform.openai.com/usage)
2. **Add analytics** to the `sendMessage` function:
```javascript
// Track usage
analytics.track('chatbot_message', {
  message_length: message.length,
  response_length: data.reply.length
});
```

## 🔒 Security & Rate Limiting

For production use, add rate limiting:

```javascript
// In your API route
const rateLimiter = new Map();

export async function POST(req) {
  const ip = req.ip || 'anonymous';
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 5;

  // Simple rate limiting logic
  if (rateLimiter.has(ip)) {
    const { count, timestamp } = rateLimiter.get(ip);
    if (now - timestamp < windowMs && count >= maxRequests) {
      return new Response('Rate limit exceeded', { status: 429 });
    }
  }
  
  // Continue with chat logic...
}
```

## 🚀 Deployment

### Deploy to Vercel
1. Push to GitHub
2. Connect to Vercel
3. Add your `OPENAI_API_KEY` in Vercel environment variables
4. Deploy!

### Deploy to Netlify
1. Build the project: `npm run build`
2. Deploy the `out` folder to Netlify
3. Add environment variables in Netlify settings

## 📞 Support

Questions about setup or customization? Feel free to ask!

---

**Built with ❤️ for portfolio websites everywhere!** 