import { GoogleGenerativeAI } from "@google/generative-ai";

// IMPORTANT: Replace with your actual API key
const API_KEY = "AIzaSyB_Qup-5lxAEMcYwoXKmzioFKzgMoob9cY";

const genAI = new GoogleGenerativeAI(API_KEY);

export async function analyzeResumeWithAI(resumeText) {
  if (!API_KEY || API_KEY === "YOUR_API_KEY") {
    throw new Error(
      "API key is not configured. Please add your key to src/api/apiAI.js"
    );
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Analyze the following resume and provide feedback on the following aspects:
      1.  **Formatting:** Assess the overall layout, readability, and consistency.
      2.  **Skill Gaps:** Identify any missing skills that are commonly required for the roles mentioned.
      3.  **Suggestions for Improvement:** Offer actionable advice to enhance the resume's quality and impact.

      **Resume Content:**
      ${resumeText}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    return text;
  } catch (error) {
    console.error("Error analyzing resume with AI:", error);
    throw new Error("Failed to analyze resume. Please try again later.");
  }
}
