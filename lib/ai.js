// lib/ai.js
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateFlashcard(topic, difficulty = 'medium') {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{
      role: "system",
      content: `You are an expert educator for UPSC/SSC exams. Create a flashcard for ${topic} at ${difficulty} level.`
    }],
    temperature: 0.7,
  });
  
  return completion.choices[0].message.content;
}