import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function generateSummary(content: string): Promise<string> {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Generate a concise summary of this note in 2-3 sentences.",
        },
        {
          role: "user",
          content: content,
        },
      ],
      model: "mixtral-8x7b",
      temperature: 0.7,
      max_tokens: 150,
    });

    return completion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error generating summary:", error);
    return "";
  }
}
