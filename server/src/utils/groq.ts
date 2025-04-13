import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateSummary(content: string): Promise<string> {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that generates concise summaries of notes.",
        },
        {
          role: "user",
          content: `Please provide a brief summary of this note: ${content}`,
        },
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 150,
    });

    return completion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error generating summary:", error);
    return "";
  }
}
