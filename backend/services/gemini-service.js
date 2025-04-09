const { GoogleGenerativeAI } = require("@google/generative-ai");

const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
    console.error("Error: GEMINI_API_KEY environment variable is not set.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const geminiService = {
    createEmailDraftPrompt: ({ lead, tone, userInstructions, language, template }) => {
        let prompt = `Draft a sales email to ${lead.name} at ${lead.company}, who is a ${lead.role} interested in ${lead.interests.join(', ')}.\n`;
        prompt += `Write in a ${tone || 'professional'} tone.\n`;
        prompt += `Language: ${language || 'en'}.\n`;
        if (userInstructions) {
            prompt += `Instructions: ${userInstructions}\n`;
        }
        if (template) {
            prompt += `Use the following template as a guide, output in plain text:\n${template.templateContent}\n`;
        } else {
            prompt += `Output the email in plain text.\n`;
        }
        prompt += "\nGenerate the email subject, body, and a call to action, all in plain text format. Do not use HTML or rich text formatting.";
        return prompt;
    },

    generateEmailDraftStream: async (prompt) => {
        try {
            const generationStream = await model.generateContentStream({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
            });
            return generationStream.stream;
        } catch (error) {
            console.error("Gemini API Error:", error);
            throw new Error("Error generating text from Gemini API");
        }
    }
};

module.exports = geminiService;