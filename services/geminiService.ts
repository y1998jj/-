import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Mock fallback in case API key is missing for the demo
const MOCK_INSIGHT = {
  title: "Modernist Concrete Cantilever",
  description: "This structure exemplifies contemporary minimalist architecture, utilizing reinforced concrete slabs to create dramatic cantilevers. The interplay of floor-to-ceiling glass and rigid stone textures dissolves the barrier between the interior living spaces and the external environment.",
  features: [
    "Floating geometric volumes",
    "Passive solar design via glass orientation",
    "Infinity edge pool integration",
    "Minimalist material palette"
  ]
};

export const getArchitecturalInsight = async (): Promise<any> => {
  if (!apiKey) {
    console.warn("No API Key provided, using mock data.");
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return MOCK_INSIGHT;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the architectural style of a modern luxury villa with the following characteristics: 
      - Two-story stacked cubic forms
      - Large glass facades with minimal framing
      - Concrete and white stone exterior
      - Large outdoor pool with ambient lighting
      - Evening setting
      
      Provide a JSON response with a title, a short description (max 50 words), and a list of 4 key architectural features.`,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("No text returned");
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return MOCK_INSIGHT;
  }
};
