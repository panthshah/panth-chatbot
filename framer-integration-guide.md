# 🎨 Integrating Your Chatbot with Framer

## 🚀 **Quick Start Options**

### **Option A: Code Component (Best)**
*Requires: Framer Pro*

1. **Deploy your chatbot** to Vercel first
2. **In Framer**: Add → Code Component → Name it "ChatBot"
3. **Copy code** from `FramerChatbot.tsx`
4. **Configure** in Framer's property panel:
   - API Endpoint: `https://your-app.vercel.app/api/chat`
   - Button Color: Match your brand
   - Welcome Message: Customize greeting

### **Option B: Embed Component (Universal)**
*Works with: Any Framer plan*

1. **Deploy your chatbot** to Vercel first
2. **In Framer**: Add → Embed
3. **Copy code** from `framer-embed-code.html`
4. **Replace** `YOUR_DEPLOYED_URL_HERE` with your chatbot URL
5. **Paste** into embed component

### **Option C: Simple iframe (Basic)**
*Quick but less integrated*

1. Deploy your chatbot
2. In Framer: Add → Embed
3. Use this code:
```html
<iframe 
  src="https://your-chatbot.vercel.app" 
  width="400" 
  height="600"
  style="border: none; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.15);"
></iframe>
```

---

## 🎯 **Step-by-Step: Option A (Code Component)**

### 1. **Deploy First**
```bash
# In your chatbot directory
git init
git add .
git commit -m "Chatbot ready for Framer"

# Push to GitHub then deploy on Vercel
```

### 2. **In Framer**
1. Open your Framer project
2. Click **"+"** → **"Code Component"**
3. Name: **"PanthChatbot"**
4. Paste the **entire** `FramerChatbot.tsx` content
5. Save the component

### 3. **Configure Properties**
In Framer's right panel, you'll see:
- **API Endpoint**: Set to your deployed URL + `/api/chat`
- **Button Color**: Match your portfolio colors
- **Header Gradient**: Customize the chat header
- **Welcome Message**: Personalize the greeting

### 4. **Add to Page**
- Drag the component onto your page
- Position anywhere (the chat button will float)
- Publish your site!

---

## 🎯 **Step-by-Step: Option B (Embed)**

### 1. **Deploy Your Chatbot**
- Deploy to Vercel/Netlify/Vercel
- Get your live URL (e.g., `https://panth-chatbot.vercel.app`)

### 2. **In Framer**
1. Add **Embed** component to your page
2. Copy code from `framer-embed-code.html`
3. Replace `YOUR_DEPLOYED_URL_HERE` with your actual URL
4. Paste into the embed component
5. Publish!

---

## ✨ **Customization Tips**

### **Match Your Brand Colors**
```typescript
// In Code Component
buttonColor: "#YOUR_BRAND_COLOR"
headerGradient: "linear-gradient(135deg, #COLOR1 0%, #COLOR2 100%)"
```

### **Position Adjustment**
```css
/* Move button position */
bottom: 20px;  /* Distance from bottom */
right: 20px;   /* Distance from right */
```

### **Mobile Optimization**
The chatbot is fully responsive and works great on mobile!

---

## 🔥 **Pro Tips**

1. **Test Locally First**: Make sure your chatbot works at `localhost:3000` before deploying
2. **CORS**: If you get CORS errors, your deployment should fix this
3. **Performance**: The iframe approach loads faster but Code Component is more integrated
4. **Analytics**: Add tracking to see chatbot usage in your Framer analytics

---

## 🚨 **Troubleshooting**

### **"API not found" error**
- ✅ Check your deployed URL is correct
- ✅ Ensure `/api/chat` endpoint exists
- ✅ Verify OpenAI API key is set in deployment

### **Button not showing**
- ✅ Check z-index conflicts in Framer
- ✅ Make sure embed component has space
- ✅ Verify the code pasted correctly

### **Chat not responding**
- ✅ Check browser console for errors
- ✅ Test the API endpoint directly
- ✅ Confirm OpenAI billing is active

---

## 🎊 **You're Done!**

Your visitors can now:
- Click the floating chat button
- Ask about your FounderMatch project
- Learn about your design experience
- Get redirected to your portfolio

**Perfect for lead generation and showcasing your skills!** 🚀 