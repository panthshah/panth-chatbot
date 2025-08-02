# 🎨 Integrating Your Chatbot with Framer

## 🚀 **Quick Start: Code Component (RECOMMENDED)**
*Best for integrating just the chat component - no iframe needed!*

**Requirements:** Framer Pro

### **Step 1: Deploy Your Chatbot**
1. Deploy your Next.js app to Vercel/Netlify
2. Get your live URL (e.g., `https://panth-chatbot.vercel.app`)
3. Your API endpoint will be: `https://panth-chatbot.vercel.app/api/chat`

### **Step 2: Create Code Component in Framer**
1. **In Framer**: Click **"+"** → **"Code Component"**
2. **Name**: `PanthChatbot` (or any name you prefer)
3. **Copy** the entire content from `FramerChatbot.tsx`
4. **Paste** into the code component editor
5. **Save** the component

### **Step 3: Configure Properties**
In Framer's right panel, you'll see these customizable properties:
- **API Endpoint**: Set to `https://your-deployed-url.vercel.app/api/chat`
- **Button Color**: Match your brand colors (e.g., `#722ceb`)
- **Header Gradient**: Customize chat header styling
- **Welcome Message**: Personalize the greeting text

### **Step 4: Add to Your Page**
1. **Drag** the component onto any page in your Framer project
2. **Position** anywhere (the chat button will float over content)
3. **Publish** your site!

✅ **Done!** Your visitors will see a floating chat button that opens your AI assistant without any iframe loading.

---

## 🎯 **Alternative: Simple Iframe (Universal)**
*Works with any Framer plan - just paste and go!*

### **Step 1: Deploy Your Chatbot**
1. Deploy your Next.js app to Vercel/Netlify
2. Get your live URL (e.g., `https://panth-chatbot.vercel.app`)
3. Test the chat page at: `https://your-url.vercel.app/iframe-chat`

### **Step 2: Add to Framer**
1. **In Framer**: Add an **Embed** component to your page
2. **Paste this code** (replace with your URL):

```html
<iframe 
  src="https://your-deployed-url.vercel.app/iframe-chat"
  width="400" 
  height="600"
  style="border: none; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.15);"
></iframe>
```

3. **Replace** `your-deployed-url.vercel.app` with your actual domain
4. **Publish** your Framer site!

✅ **Clean & Simple!** Just the chat interface, no complex embed code needed.

---

## ✨ **Why Code Component is Better**

### **✅ Code Component Advantages:**
- **Just the chat**: No iframe, no full page loading
- **Native integration**: Feels part of your Framer site
- **Customizable**: Change colors, messages directly in Framer
- **Better performance**: Lighter weight, faster loading
- **SEO friendly**: No iframe blocking

### **⚠️ Simple iframe Limitations:**
- Fixed dimensions (400x600px)
- Less integrated feel
- No draggable functionality
- Requires Framer embed component space

---

## 🎨 **Customization Examples**

### **Match Your Brand Colors**
```typescript
// In Framer Property Panel:
Button Color: "#722ceb"          // Your purple
Header Gradient: "linear-gradient(135deg, #722ceb 0%, #5b21b6 100%)"
```

### **Custom Welcome Messages**
```
"Hey! I'm here to help you learn about Panth's work."
"Ask me about Panth's design process, projects, or experience!"
"Looking to hire a designer? Chat with me to learn about Panth!"
```

---

## 🔥 **Pro Tips**

1. **Test Locally First**: 
   - Ensure `localhost:3000` works before deploying
   - Test the iframe page at `localhost:3000/iframe-chat`
2. **API Key Setup**: Make sure your OpenAI API key is set in deployment environment variables
3. **Brand Matching**: Use your portfolio colors for seamless integration
4. **Mobile Responsive**: The chat component automatically works on mobile
5. **Analytics**: Track chat usage through Framer's analytics

---

## 🚨 **Troubleshooting**

### **"Cannot find module 'framer'" in VS Code**
✅ **Normal!** This error appears because the `FramerChatbot.tsx` file is meant for Framer, not your local Next.js project.

### **"API not found" error in Framer**
- ✅ Verify your deployed URL is correct and accessible
- ✅ Ensure `/api/chat` endpoint exists (test: `yoururl.com/api/chat`)
- ✅ Check OpenAI API key is set in deployment environment

### **Chat button not appearing**
- ✅ Make sure you're using the Code Component, not just pasting code
- ✅ Check that the component is added to the page
- ✅ Verify no z-index conflicts with other Framer elements

### **CORS errors**
- ✅ Should be resolved once deployed (CORS typically works in production)
- ✅ Ensure your deployment allows cross-origin requests

### **Chat not displaying in iframe (FIXED)**
- ✅ **Problem**: The main page's floating chat had positioning issues in iframes  
- ✅ **Solution**: Now uses dedicated `/iframe-chat` page optimized for iframe embedding
- ✅ Just use the simple iframe code pointing to `your-url.vercel.app/iframe-chat`

---

## 🎊 **You're Done!**

Your Framer site now has:
- **Floating chat button** that visitors can drag around
- **AI assistant** that knows all about Panth's work
- **Seamless integration** that feels native to your site
- **Mobile-friendly** experience

**Perfect for showcasing your portfolio and engaging visitors!** 🚀

---

## 📋 **Quick Checklist**

- [ ] Deploy Next.js app to Vercel/Netlify
- [ ] Copy API endpoint URL
- [ ] Create Code Component in Framer Pro
- [ ] Paste `FramerChatbot.tsx` content
- [ ] Configure API endpoint in properties
- [ ] Customize colors and messages
- [ ] Add component to page
- [ ] Test functionality
- [ ] Publish Framer site 