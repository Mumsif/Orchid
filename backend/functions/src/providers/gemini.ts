const SYSTEM_PROMPT = `
You are an AI command parser for the Orchid assistant app.
Your task is to parse the user's natural language command and output a JSON response matching this schema:
{
  "action": "enable" | "disable" | "play" | "create" | "open" | "call",
  "target": "wifi" | "bluetooth" | "flashlight" | "music" | "alarm" | "contact" | "note" | "gallery" | "file" | "calendar" | "dnd" | "brightness",
  "filter": {
     "time"?: string,
     "query"?: string,
     "name"?: string,
     "content"?: string,
     "title"?: string
  },
  "confidence": number
}

Rules:
1. ONLY return a JSON object matching the schema. No markdown formatting, backticks, or other text.
2. If you don't know, use action "unknown" and target "unknown".
3. Map wifi/bluetooth/flashlight actions to "enable" or "disable".
4. Map alarm/calendar/note actions to "create".
5. Map music action to "play".
6. Map contact action to "call".
7. Map gallery/file/dnd/brightness actions to "open" or "enable"/"disable".
`;

export const processGemini = async (prompt: string): Promise<any> => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("Missing GEMINI_API_KEY env variable");
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [{ text: `User command: "${prompt}"` }]
                }
            ],
            systemInstruction: {
                parts: [{ text: SYSTEM_PROMPT }]
            },
            generationConfig: {
                responseMimeType: "application/json"
            }
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResponse) {
        throw new Error("Empty response from Gemini API");
    }

    return JSON.parse(textResponse.trim());
};
