/*
  # AI Entry Analysis Function
  
  Analyzes journal entries for mood detection and summary generation.
  Uses the provided AI API key for content analysis.
*/

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface AnalysisRequest {
  content: string;
  title: string;
}

interface AnalysisResponse {
  mood: 'positive' | 'neutral' | 'negative';
  mood_score: number;
  summary: string;
  tags: string[];
}

// Mock AI analysis function (replace with actual AI service)
function analyzeContent(content: string, title: string): AnalysisResponse {
  // Simple keyword-based mood detection for demo
  const positiveKeywords = ['happy', 'joy', 'excited', 'grateful', 'amazing', 'wonderful', 'great', 'love', 'excellent', 'fantastic'];
  const negativeKeywords = ['sad', 'angry', 'frustrated', 'terrible', 'awful', 'hate', 'disappointed', 'worried', 'stressed', 'anxious'];
  
  const text = (content + ' ' + title).toLowerCase();
  const words = text.split(/\s+/);
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  words.forEach(word => {
    if (positiveKeywords.some(keyword => word.includes(keyword))) positiveCount++;
    if (negativeKeywords.some(keyword => word.includes(keyword))) negativeCount++;
  });
  
  let mood: 'positive' | 'neutral' | 'negative' = 'neutral';
  let mood_score = 0.5;
  
  if (positiveCount > negativeCount) {
    mood = 'positive';
    mood_score = Math.min(0.5 + (positiveCount * 0.1), 1.0);
  } else if (negativeCount > positiveCount) {
    mood = 'negative';
    mood_score = Math.max(0.5 - (negativeCount * 0.1), 0.0);
  }
  
  // Generate simple summary (first 100 characters + "...")
  const summary = content.length > 100 
    ? content.substring(0, 100) + "..."
    : content;
  
  // Extract simple tags based on common themes
  const tags: string[] = [];
  if (text.includes('work') || text.includes('job')) tags.push('work');
  if (text.includes('family') || text.includes('parent')) tags.push('family');
  if (text.includes('friend') || text.includes('social')) tags.push('relationships');
  if (text.includes('health') || text.includes('exercise')) tags.push('health');
  if (text.includes('travel') || text.includes('vacation')) tags.push('travel');
  
  return { mood, mood_score, summary, tags };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { content, title }: AnalysisRequest = await req.json();
    
    if (!content || !title) {
      return new Response(
        JSON.stringify({ error: "Content and title are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const analysis = analyzeContent(content, title);

    return new Response(
      JSON.stringify(analysis),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Analysis error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to analyze entry" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});