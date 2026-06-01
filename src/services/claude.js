import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

const SYSTEM_PROMPT = `You are a content analyzer. Given the text of a web page, analyze it and return a JSON object with these fields:
- title: a concise title (string, keep original language)
- summary: a 2-3 sentence summary in Chinese, no more than 80 characters (string)
- category: one of "tech", "business", "science", "health", "education", "entertainment", "other" (string)
- tags: an array of 3-5 relevant keyword tags (array of strings)

Return ONLY valid JSON, no other text.`;

export async function analyzeContent(text) {
  const truncated = text.slice(0, 100000);

  const response = await openai.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: truncated },
    ],
  });

  const jsonText = response.choices[0].message.content.trim();
  const start = jsonText.indexOf('{');
  const end = jsonText.lastIndexOf('}');
  if (start === -1 || end === -1) {
    throw new Error('Could not parse JSON from DeepSeek response');
  }

  return JSON.parse(jsonText.slice(start, end + 1));
}
