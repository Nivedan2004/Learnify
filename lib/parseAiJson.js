export function parseAiJson(text) {
  if (!text || typeof text !== "string") {
    throw new Error("Empty AI response");
  }

  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```(?:json|html)?\s*/i, "");
  cleaned = cleaned.replace(/```$/i, "").trim();

  const objectStart = cleaned.indexOf("{");
  const arrayStart = cleaned.indexOf("[");

  let start = -1;
  if (objectStart === -1) start = arrayStart;
  else if (arrayStart === -1) start = objectStart;
  else start = Math.min(objectStart, arrayStart);

  if (start === -1) {
    throw new Error("No JSON found in AI response");
  }

  const closer = cleaned[start] === "[" ? "]" : "}";
  const end = cleaned.lastIndexOf(closer);
  if (end === -1) {
    throw new Error("Invalid JSON in AI response");
  }

  return JSON.parse(cleaned.slice(start, end + 1));
}

export function stripAiFences(text = "") {
  return String(text)
    .replace(/```html/gi, "")
    .replace(/```/g, "")
    .replace(/\\n/g, "")
    .trim();
}
