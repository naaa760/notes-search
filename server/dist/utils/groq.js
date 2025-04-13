"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSummary = generateSummary;
const groq_sdk_1 = require("groq-sdk");
const groq = new groq_sdk_1.Groq({
    apiKey: process.env.GROQ_API_KEY,
});
async function generateSummary(content) {
    var _a, _b;
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that generates concise summaries of notes.",
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
        return ((_b = (_a = completion.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) || "";
    }
    catch (error) {
        console.error("Error generating summary:", error);
        return "";
    }
}
