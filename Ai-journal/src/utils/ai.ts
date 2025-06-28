
export const analyzeMood = async (content: string, apiKey: string): Promise<{
  mood: string;
  moodScore: number;
  summary: string;
  keywords: string[];
}> => {
  if (!apiKey) {
    throw new Error('Google Gemini API key is required');
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a journaling assistant that analyzes diary entries. Analyze the mood and provide insights. Respond with a JSON object containing:
            - mood: string (one of: happy, sad, anxious, calm, excited, frustrated, content, reflective, grateful, stressed)
            - moodScore: number (0-100, where 0 is very negative and 100 is very positive)
            - summary: string (2-3 sentence summary of the entry)
            - keywords: array of 3-5 relevant keywords from the entry

            Please analyze this journal entry: "${content}"

            Respond only with the JSON object, no additional text.`
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 300,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const analysisText = data.candidates[0].content.parts[0].text;
    
    // Clean up the response and parse JSON
    const cleanedText = analysisText.replace(/```json\n?|\n?```/g, '').trim();
    const analysis = JSON.parse(cleanedText);
    
    return analysis;
  } catch (error) {
    console.error('Error analyzing mood:', error);
    throw error;
  }
};

export const getMoodColor = (mood: string): string => {
  const moodColors: Record<string, string> = {
    happy: '#10B981',
    sad: '#6B7280',
    anxious: '#F59E0B',
    calm: '#3B82F6',
    excited: '#EC4899',
    frustrated: '#EF4444',
    content: '#8B5CF6',
    reflective: '#6366F1',
    grateful: '#059669',
    stressed: '#DC2626',
  };
  
  return moodColors[mood.toLowerCase()] || '#6B7280';
};

export const getMoodEmoji = (mood: string): string => {
  const moodEmojis: Record<string, string> = {
    happy: '😊',
    sad: '😢',
    anxious: '😰',
    calm: '😌',
    excited: '🤩',
    frustrated: '😤',
    content: '😊',
    reflective: '🤔',
    grateful: '🙏',
    stressed: '😖',
  };
  
  return moodEmojis[mood.toLowerCase()] || '😐';
};
