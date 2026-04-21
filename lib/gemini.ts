import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API || "");

export const getAIRecommendations = async (
  userHistory: string[], 
  productPool: { id: string; name: string; category: string }[]
) => {
  try {
    if (!process.env.GOOGLE_GEMINI_API) {
      console.warn("GOOGLE_GEMINI_API is not set");
      return [];
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are a shopping assistant for a premium marketplace called MitraSpace.
      A user has recently viewed these types of products: ${userHistory.join(", ")}.
      
      Below is a list of available products in our store:
      ${productPool.map(p => `ID: ${p.id}, Name: ${p.name}, Category: ${p.category}`).join("\n")}
      
      Task:
      Based on the user's recent activity, pick exactly 4 products from the list that they are most likely to be interested in.
      Rank them from most relevant to least.
      
      Constraint:
      Respond ONLY with a JSON array of strings containing the product IDs. No explanation, no markdown formatting.
      Example: ["id1", "id2", "id3", "id4"]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean potential markdown or whitespace
    const cleanText = text.replace(/```json|```/g, "").trim();
    const recommendedIds = JSON.parse(cleanText);

    return recommendedIds;
  } catch (error) {
    console.error("[GEMINI_AI_ERROR]", error);
    return [];
  }
};
