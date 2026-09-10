const { GoogleGenAI } = require("@google/genai");

const solveDoubt = async (req, res) => {
  try {
    const {
      messages,
      title,
      description,
      testCases,
      startCode
    } = req.body;

    if (!process.env.GEMINI_KEY) {
      return res.status(500).json({ message: "GEMINI_KEY is missing in environment variables" });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_KEY
    });

    // Temporarily suppress internal SDK warning for thoughtSignature
    const originalWarn = console.warn;
    console.warn = function (...args) {
      if (args[0] && typeof args[0] === "string" && args[0].includes("thoughtSignature")) {
        return;
      }
      originalWarn.apply(console, args);
    };

    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: messages || [],
        config: {
          systemInstruction: `
You are an expert, friendly, and highly pedagogical Data Structures and Algorithms (DSA) Socratic Coach named CodeForge Tutor.
Your goal is to help students learn and build problem-solving intuition for the specific problem they are currently viewing.

## CURRENT PROBLEM CONTEXT:
- **Title**: ${title || 'DSA Problem'}
- **Description**: ${description || ''}
- **Test Cases**: ${JSON.stringify(testCases || [])}
- **Start Code**: ${JSON.stringify(startCode || [])}

## CRITICAL RESPONSE RULES:
1. **NO META-QUESTIONS OR DELAYS**: If the user asks for a "hint", "help", or "how to solve", DO NOT ask "Would you like a hint?" or "How would you like to proceed?". IMMEDIATELY provide the hint/guidance!
2. **SOCRATIC PROGRESSIVE HINTING**:
   - **Hint 1 (Intuition)**: Explain the key pattern or core observation (e.g., "Think about tracking the minimum value seen so far...").
   - **Guiding Question**: End with one thought-provoking question to nudge the student to the next step.
   - Do NOT dump the full final code immediately unless the user explicitly commands: "give me the complete solution" or "show code".
3. **LANGUAGE ADAPTABILITY**: Match the user's language and tone seamlessly (English, Hinglish, Hindi, etc.).
4. **FORMATTING**: Use clean Markdown formatting with bold text, bullet points, and code snippets when appropriate.
5. **STRICT DSA SCOPE**: Only answer questions regarding this current DSA problem. Politely decline non-DSA or unrelated topics.
`
        }
      });
    } finally {
      console.warn = originalWarn; // Restore original console.warn
    }

    return res.status(200).json({
      message: response.text
    });

  } catch (err) {
    console.error("Gemini Error:", err);
    return res.status(500).json({
      message: "AI Tutor service temporarily unavailable",
      error: err.message
    });
  }
};

module.exports = solveDoubt;
