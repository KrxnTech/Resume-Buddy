/**
 * Robust JSON extraction and repair utility for LLM responses.
 * Handles markdown fences, reasoning tags, trailing commas, unescaped characters,
 * and truncated JSON structures.
 */
export function extractAndParseJSON(rawText) {
    if (!rawText || typeof rawText !== "string") {
        throw new Error("Empty or non-string response from AI");
    }

    // 1. Strip reasoning/thinking tags (e.g. from models that output <think>...</think>)
    let cleaned = rawText.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

    // 2. Strip markdown code block fences (```json ... ``` or ``` ... ```)
    cleaned = cleaned.replace(/```(?:json)?\s*([\s\S]*?)\s*```/gi, "$1").trim();

    // 3. Find the first '{' indicating start of JSON object
    const startIdx = cleaned.indexOf("{");
    if (startIdx === -1) {
        throw new Error("No JSON object found in response");
    }

    cleaned = cleaned.slice(startIdx).trim();

    // 4. Try standard JSON.parse directly
    try {
        return JSON.parse(cleaned);
    } catch (e1) {
        // Find last matching '}'
        const lastIdx = cleaned.lastIndexOf("}");
        if (lastIdx !== -1) {
            const potentialSub = cleaned.slice(0, lastIdx + 1);
            try {
                return JSON.parse(potentialSub);
            } catch (e2) {
                // Keep going to repair
            }
        }
    }

    // 5. Attempt auto-repair on the JSON string
    return repairJSON(cleaned);
}

/**
 * Repairs broken / truncated JSON by cleaning syntax and closing unclosed structures.
 */
export function repairJSON(jsonStr) {
    let text = jsonStr.trim();

    // Remove any trailing markdown fences if any remain
    text = text.replace(/```.*$/s, "").trim();

    // Remove trailing commas before closing braces or brackets: , } -> } and , ] -> ]
    text = text.replace(/,\s*([}\]])/g, "$1");

    // Try parsing after trailing comma cleanup
    try {
        return JSON.parse(text);
    } catch (e) {
        // Proceed to structural repair
    }

    // Structural repair: scan string to track open quotes, braces, brackets
    let inString = false;
    let isEscaped = false;
    const stack = [];
    let cleanChars = [];

    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if (char === "\\" && inString) {
            isEscaped = !isEscaped;
            cleanChars.push(char);
            continue;
        }

        if (char === '"' && !isEscaped) {
            inString = !inString;
            cleanChars.push(char);
        } else if (!inString) {
            if (char === "{" || char === "[") {
                stack.push(char);
                cleanChars.push(char);
            } else if (char === "}" || char === "]") {
                if (stack.length > 0) {
                    const top = stack[stack.length - 1];
                    if ((char === "}" && top === "{") || (char === "]" && top === "[")) {
                        stack.pop();
                    }
                }
                cleanChars.push(char);
            } else {
                cleanChars.push(char);
            }
        } else {
            // Inside string: replace raw newlines/tabs that break JSON
            if (char === "\n") {
                cleanChars.push("\\n");
            } else if (char === "\r") {
                // omit \r
            } else if (char === "\t") {
                cleanChars.push("\\t");
            } else {
                cleanChars.push(char);
            }
        }

        isEscaped = false;
    }

    let repaired = cleanChars.join("");

    // If truncated inside a string, close the string
    if (inString) {
        repaired += '"';
    }

    // Clean any dangling partial key-value or trailing comma at the end
    repaired = repaired.replace(/,\s*$/, "");
    repaired = repaired.replace(/:\s*"?$/, ': ""');
    repaired = repaired.replace(/,\s*([}\]])/g, "$1");

    // Close any unclosed braces/brackets in reverse order
    while (stack.length > 0) {
        const openChar = stack.pop();
        if (openChar === "{") {
            repaired += "}";
        } else if (openChar === "[") {
            repaired += "]";
        }
    }

    // Final clean of trailing commas before closing symbols
    repaired = repaired.replace(/,\s*([}\]])/g, "$1");

    try {
        return JSON.parse(repaired);
    } catch (finalErr) {
        console.error("JSON Repair failed. Raw snippet:", repaired.slice(-200));
        throw new Error(`Failed to parse AI JSON response: ${finalErr.message}`);
    }
}
