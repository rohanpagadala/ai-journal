const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// Mongoose schema & model
const journalSchema = new mongoose.Schema({
  text: String,
  summary: String,
  mood: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Journal = mongoose.model("Journal", journalSchema);

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Enhanced fallback analysis function
function generateFallbackAnalysis(text) {
  const textLower = text.toLowerCase();
  
  // Mood detection based on keywords
  let mood = "Reflective";
  
  // Positive moods
  if (textLower.includes('happy') || textLower.includes('joy') || textLower.includes('excited') || 
      textLower.includes('amazing') || textLower.includes('wonderful') || textLower.includes('great') ||
      textLower.includes('love') || textLower.includes('perfect') || textLower.includes('fantastic')) {
    mood = "Joyful";
  }
  // Angry/Frustrated moods
  else if (textLower.includes('angry') || textLower.includes('furious') || textLower.includes('mad') ||
           textLower.includes('frustrated') || textLower.includes('annoyed') || textLower.includes('irritated') ||
           textLower.includes('passive-aggressive') || textLower.includes('took credit') || 
           textLower.includes('exhausting') || textLower.includes('unfair')) {
    mood = "Frustrated";
  }
  // Nervous/Worried moods
  else if (textLower.includes('nervous') || textLower.includes('worried') || textLower.includes('anxious') ||
           textLower.includes('scared') || textLower.includes('afraid') || textLower.includes('imposter') ||
           textLower.includes('interview') || textLower.includes('overwhelmed') || textLower.includes('stress')) {
    mood = "Nervous";
  }
  // Sad/Lonely moods
  else if (textLower.includes('sad') || textLower.includes('lonely') || textLower.includes('depressed') ||
           textLower.includes('empty') || textLower.includes('hurt') || textLower.includes('crying') ||
           textLower.includes('invisible') || textLower.includes('nobody')) {
    mood = "Lonely";
  }
  // Peaceful/Content moods
  else if (textLower.includes('peaceful') || textLower.includes('calm') || textLower.includes('content') ||
           textLower.includes('relaxed') || textLower.includes('yoga') || textLower.includes('meditation') ||
           textLower.includes('quiet') || textLower.includes('serene')) {
    mood = "Peaceful";
  }
  // Inspired/Hopeful moods
  else if (textLower.includes('inspired') || textLower.includes('motivated') || textLower.includes('hopeful') ||
           textLower.includes('passionate') || textLower.includes('determined') || textLower.includes('goal')) {
    mood = "Inspired";
  }
  
  // Generate a more contextual summary
  let summary;
  const firstSentence = text.split('.')[0] || text.substring(0, 100);
  
  if (mood === "Frustrated") {
    summary = `Expressing frustration about a challenging situation involving ${firstSentence.toLowerCase()}`;
  } else if (mood === "Nervous") {
    summary = `Feeling anxious and nervous about upcoming challenges or self-doubt`;
  } else if (mood === "Joyful") {
    summary = `Sharing positive experiences and joyful moments from their day`;
  } else if (mood === "Lonely") {
    summary = `Processing feelings of loneliness and emotional isolation`;
  } else if (mood === "Peaceful") {
    summary = `Reflecting on moments of peace and tranquility in their life`;
  } else if (mood === "Inspired") {
    summary = `Feeling motivated and inspired by recent experiences or realizations`;
  } else {
    summary = `Deep reflection on personal thoughts and life experiences`;
  }
  
  return { summary, mood };
}

// POST /api/entry — Analyze and store a journal entry
app.post("/api/entry", async (req, res) => {
  const { text } = req.body;
  
  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: "Journal entry text is required" });
  }
  
  try {
    let summary, mood;

    // Try real OpenAI call first
    try {
      const aiRes = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a compassionate AI assistant that analyzes journal entries. 
            
            Analyze the user's journal entry and respond with EXACTLY this format:
            
            Summary: [A thoughtful 1-2 sentence summary of what the person wrote about]
            Mood: [One word mood like: Joyful, Frustrated, Nervous, Lonely, Peaceful, Inspired, Reflective, Content, Worried, Angry, Sad, Happy, Excited, Calm, Anxious, Stressed, Hopeful, Grateful, Confused, Determined]
            
            Be empathetic and accurate in your analysis. Choose the mood that best reflects the emotional tone of the entry.`,
          },
          {
            role: "user",
            content: text,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      });

      const content = aiRes.choices[0].message.content || "";
      
      // Parse the response
      const summaryMatch = content.match(/Summary:\s*(.+?)(?=\nMood:|$)/s);
      const moodMatch = content.match(/Mood:\s*(.+?)$/m);
      
      summary = summaryMatch ? summaryMatch[1].trim() : "Unable to generate summary";
      mood = moodMatch ? moodMatch[1].trim() : "Reflective";
      
      console.log("✅ OpenAI analysis successful");
      
    } catch (err) {
      console.warn("⚠️ OpenAI API failed, using enhanced fallback:", err.message);
      
      // Use enhanced fallback analysis
      const fallbackResult = generateFallbackAnalysis(text);
      summary = fallbackResult.summary;
      mood = fallbackResult.mood;
    }

    // Create and save the journal entry
    const entry = new Journal({ 
      text: text.trim(), 
      summary, 
      mood 
    });
    
    await entry.save();
    
    console.log(`📝 Entry saved with mood: ${mood}`);
    res.json(entry);
    
  } catch (err) {
    console.error("❌ Error in journal entry processing:", err);
    res.status(500).json({ error: "Failed to process journal entry" });
  }
});

// GET /api/entries — Get all journal entries
app.get("/api/entries", async (req, res) => {
  try {
    const entries = await Journal.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    console.error("❌ Error fetching entries:", err);
    res.status(500).json({ error: err.message });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "AI Journal API is running",
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);