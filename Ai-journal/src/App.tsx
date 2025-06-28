import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Brain, PenTool, Sparkles, Calendar, Clock, Heart, Smile, Frown, Meh } from 'lucide-react';
import JournalEntry from './components/JournalEntry';
import EntryCard from './components/EntryCard';
import LoadingSpinner from './components/LoadingSpinner';

interface Entry {
  _id: string;
  text: string;
  summary: string;
  mood: string;
  createdAt: string;
}

// Use environment variable with fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Sample entries for demonstration
const sampleEntries: Entry[] = [
  {
    _id: 'sample-1',
    text: "I just finished my first novel draft! It feels surreal. After months of late nights and countless revisions, I finally typed 'The End.' I can't believe I actually did it.",
    summary: "Celebrated completing their first novel draft after months of dedicated work and late nights.",
    mood: "Joyful",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
  },
  {
    _id: 'sample-2',
    text: "Job interview tomorrow and I feel like an imposter. What if they realize I don't know as much as my resume suggests? I've been preparing for weeks but the anxiety is overwhelming.",
    summary: "Experiencing pre-interview anxiety and imposter syndrome despite thorough preparation.",
    mood: "Nervous",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() // 8 hours ago
  },
  {
    _id: 'sample-3',
    text: "I've been thinking a lot about my purpose lately. What am I actually meant to do? Sometimes I feel like I'm just drifting through life without a clear direction.",
    summary: "Deep reflection on life purpose and feeling uncertain about their direction in life.",
    mood: "Reflective",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    _id: 'sample-4',
    text: "Had the best coffee date with an old friend today. So much laughter and nostalgia. We talked for hours about our dreams and how much we've both grown. It reminded me how important these connections are.",
    summary: "Enjoyed a meaningful reunion with an old friend, filled with laughter and deep conversation.",
    mood: "Content",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
  },
  {
    _id: 'sample-5',
    text: "I spent hours working on a presentation and someone else took the credit in the meeting. I'm furious but don't know how to address it professionally without seeming petty.",
    summary: "Feeling angry about a colleague taking credit for their work and struggling with how to respond appropriately.",
    mood: "Frustrated",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
  },
  {
    _id: 'sample-6',
    text: "Did yoga by candlelight tonight. My body feels light and my mind is quiet. Sometimes the simplest moments bring the most peace. I should do this more often.",
    summary: "Found peace and tranquility through a candlelit yoga session, appreciating simple moments of calm.",
    mood: "Peaceful",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() // 4 days ago
  }
];

function App() {
  const [text, setText] = useState('');
  const [entries, setEntries] = useState<Entry[]>(sampleEntries);
  const [loading, setLoading] = useState(false);
  const [fetchingEntries, setFetchingEntries] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = async () => {
    try {
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/api/entries`);
      // Merge real entries with sample entries, prioritizing real entries
      const realEntries = response.data || [];
      const allEntries = [...realEntries, ...sampleEntries];
      // Remove duplicates and sort by date
      const uniqueEntries = allEntries.filter((entry, index, self) => 
        index === self.findIndex(e => e._id === entry._id)
      );
      setEntries(uniqueEntries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error('Failed to fetch entries:', error);
      // If API fails, just use sample entries
      setEntries(sampleEntries);
    } finally {
      setFetchingEntries(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/entry`, { text });
      setEntries([response.data, ...entries]);
      setText('');
    } catch (error) {
      console.error('Failed to submit entry:', error);
      setError('Unable to submit entry. Please check your connection and ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const getMoodStats = () => {
    const moodCounts = entries.reduce((acc, entry) => {
      const mood = entry.mood.toLowerCase();
      
      // Positive moods
      if (mood.includes('happy') || mood.includes('joy') || mood.includes('excited') || 
          mood.includes('content') || mood.includes('peaceful') || mood.includes('joyful') ||
          mood.includes('elated') || mood.includes('cheerful') || mood.includes('optimistic')) {
        acc.positive++;
      } 
      // Negative/challenging moods (including nervous, worried, anxious)
      else if (mood.includes('sad') || mood.includes('angry') || mood.includes('frustrated') || 
               mood.includes('nervous') || mood.includes('worried') || mood.includes('anxious') ||
               mood.includes('lonely') || mood.includes('depressed') || mood.includes('upset') ||
               mood.includes('stressed') || mood.includes('overwhelmed') || mood.includes('fearful') ||
               mood.includes('irritated') || mood.includes('annoyed') || mood.includes('disappointed')) {
        acc.negative++;
      } 
      // Neutral moods
      else {
        acc.neutral++;
      }
      return acc;
    }, { positive: 0, negative: 0, neutral: 0 });

    return moodCounts;
  };

  const moodStats = getMoodStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  AI Journal
                </h1>
                <p className="text-sm text-gray-600">Your intelligent daily companion</p>
              </div>
            </div>
            
            {entries.length > 0 && (
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{entries.length} entries</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            <p className="text-red-600 text-xs mt-2">
              Current API URL: {API_BASE_URL}
            </p>
          </div>
        )}

        {/* Mood Stats */}
        {entries.length > 0 && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Smile className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{moodStats.positive}</p>
                  <p className="text-sm text-gray-600">Positive entries</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Meh className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{moodStats.neutral}</p>
                  <p className="text-sm text-gray-600">Neutral entries</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Frown className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{moodStats.negative}</p>
                  <p className="text-sm text-gray-600">Challenging entries</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Journal Entry Form */}
        <div className="mb-12">
          <JournalEntry
            text={text}
            setText={setText}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </div>

        {/* Entries Timeline */}
        <div className="space-y-6">
          {fetchingEntries ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-16">
              <div className="p-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <PenTool className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Your Journey</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Write your first journal entry above and let AI help you understand your thoughts and emotions.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg">
                  <Clock className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Your Journal Timeline</h2>
              </div>
              
              {entries.map((entry, index) => (
                <EntryCard key={entry._id} entry={entry} isLatest={index === 0 && !entry._id.startsWith('sample')} />
              ))}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;