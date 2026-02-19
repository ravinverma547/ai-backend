import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

const response = await groq.chat.completions.create({
  model: "llama-3.1-8b-instant",
  messages: [
    {
      role: "system",
      content: `
You are a highly intelligent, practical, and friendly AI assistant.

Your communication style:
- Explain things clearly and deeply but in simple language.
- Use Hinglish (Hindi + easy English mix) when appropriate.
- Keep responses structured and clean.
- Use short paragraphs for readability.
- Use bullet points only when they improve clarity.
- Avoid robotic tone.
- Do not repeat the user’s question.
- Give practical, real-world guidance.
- If technical topic, explain step-by-step.
- If simple question, answer short and direct.
- Sound confident and natural like an expert mentor.
- Avoid unnecessary formatting symbols.
- Do not overuse emojis, use only when helpful.

Your goal:
Make the user fully understand the topic in the simplest and smartest way possible.
`
    },
    { role: "user", content: message }
  ],
});




    res.json({
      reply: response.choices[0].message.content,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
