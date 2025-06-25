# MindJournal - AI-Powered Daily Journal App

A beautiful, production-ready journaling application with AI-powered mood analysis and entry summarization. Built with React, TypeScript, Supabase, and Tailwind CSS.

## Features

✨ **AI-Powered Analysis**
- Automatic mood detection (positive, neutral, negative)
- Smart entry summarization
- Intelligent tag extraction
- Mood scoring and confidence levels

📝 **Rich Journaling Experience**
- Clean, distraction-free writing interface
- Real-time character counting
- Auto-save functionality
- Beautiful timeline view

📊 **Insights & Analytics**
- Mood statistics and trends
- Entry search and filtering
- Tag-based organization
- Historical journey view

🔒 **Secure & Private**
- User authentication with Supabase Auth
- Row-level security for all data
- Secure API calls through edge functions
- Privacy-focused design

🎨 **Beautiful Design**
- Modern, production-ready UI
- Responsive design for all devices
- Smooth animations and transitions
- Calming color palette optimized for journaling

## Sample Journal Entry & AI Analysis

### Sample Entry
**Title:** "A Wonderful Day at the Park"

**Content:**
"Today was absolutely amazing! I spent the afternoon at the local park with my family. The weather was perfect - sunny but not too hot. We had a picnic under the old oak tree and played frisbee for hours. My daughter learned how to ride her bike without training wheels, and seeing her face light up with joy was priceless. I feel so grateful for these simple moments that bring such happiness. Life is beautiful when you take time to appreciate the little things."

### AI Analysis Results
- **Mood:** Positive
- **Mood Score:** 0.89 (high confidence)
- **AI Summary:** "A joyful day spent with family at the park, featuring a picnic, games, and a daughter's bicycle milestone. The entry emphasizes gratitude and appreciation for simple, meaningful moments."
- **Extracted Tags:** ["family", "outdoors", "milestones", "gratitude"]

## Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Backend:** Supabase (Database, Auth, Edge Functions)
- **AI Integration:** Custom analysis through Supabase Edge Functions
- **Icons:** Lucide React
- **Build Tool:** Vite
- **Deployment:** Ready for Netlify, Vercel, or other platforms

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- AI API key (provided)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/ai-journal-app.git
cd ai-journal-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Fill in your Supabase credentials in `.env`:
```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_AI_API_KEY=AIzaSyDt1fYpUqVze55TU-fobM749v239a4DEWM
```

4. Set up Supabase:
   - Create a new Supabase project
   - Run the migration file in your Supabase SQL editor
   - Deploy the edge function for AI analysis

5. Start the development server:
```bash
npm run dev
```

## Database Schema

The application uses a single `journal_entries` table with the following structure:

```sql
journal_entries (
  id: uuid (primary key)
  user_id: uuid (foreign key to auth.users)
  title: text
  content: text
  mood: text (positive, neutral, negative)
  mood_score: numeric (0.0 to 1.0)
  ai_summary: text
  tags: text[]
  created_at: timestamptz
  updated_at: timestamptz
)
```

## AI Analysis Features

The AI analysis system provides:
- **Mood Detection:** Analyzes text sentiment and assigns positive, neutral, or negative mood
- **Mood Scoring:** Provides confidence score from 0.0 to 1.0
- **Smart Summarization:** Generates concise summaries of longer entries
- **Tag Extraction:** Identifies key themes and topics automatically

## Security Features

- Row Level Security (RLS) enabled on all tables
- User authentication required for all operations
- Secure API endpoints with proper authorization
- Environment variable protection for sensitive keys
- Input validation and sanitization

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy with build command: `npm run build`
4. Build directory: `dist`

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts to deploy

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Open an issue on GitHub
- Check the documentation
- Review the code comments for implementation details

---

**MindJournal** - Transform your thoughts into insights with AI-powered journaling. ✨