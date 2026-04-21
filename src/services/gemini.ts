import { GoogleGenAI, Type } from "@google/genai";
import { ViralContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export async function generateViralHooks(topic: string): Promise<ViralContent> {
  const prompt = `You are a world-class viral content strategist. Generate viral content for the topic: "${topic}".
  
  Requirements:
  - 10 punchy, curiosity-driven hooks that stop the scroll.
  - 3 high-converting caption ideas.
  - 3 unique content angles to approach the video.
  
  Focus on psychological triggers: curiosity, fear of missing out, direct benefit, and emotional connection.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        required: ["hooks", "captions", "angles"],
        properties: {
          hooks: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "10 viral hook ideas",
          },
          captions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3 caption ideas",
          },
          angles: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3 content angles",
          },
        },
      },
    },
  });

  try {
    const data = JSON.parse(response.text);
    return data as ViralContent;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Invalid response format from AI");
  }
}
