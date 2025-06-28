import React from 'react';
import { Calendar, Brain, Heart, Sparkles } from 'lucide-react';

interface Entry {
  _id: string;
  text: string;
  summary: string;
  mood: string;
  createdAt: string;
}

interface EntryCardProps {
  entry: Entry;
  isLatest: boolean;
}

const EntryCard: React.FC<EntryCardProps> = ({ entry, isLatest }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const getMoodColor = (mood: string) => {
    const moodLower = mood.toLowerCase();
    
    // Positive moods - green
    if (moodLower.includes('happy') || moodLower.includes('joy') || moodLower.includes('excited') || 
        moodLower.includes('positive') || moodLower.includes('content') || moodLower.includes('peaceful') ||
        moodLower.includes('joyful') || moodLower.includes('elated') || moodLower.includes('cheerful') ||
        moodLower.includes('optimistic')) {
      return 'text-green-600 bg-green-50 border-green-200';
    } 
    // Negative/challenging moods - red (including nervous, worried, anxious)
    else if (moodLower.includes('sad') || moodLower.includes('angry') || moodLower.includes('frustrated') || 
             moodLower.includes('negative') || moodLower.includes('nervous') || moodLower.includes('worried') ||
             moodLower.includes('anxious') || moodLower.includes('lonely') || moodLower.includes('depressed') ||
             moodLower.includes('upset') || moodLower.includes('stressed') || moodLower.includes('overwhelmed') ||
             moodLower.includes('fearful') || moodLower.includes('irritated') || moodLower.includes('annoyed') ||
             moodLower.includes('disappointed')) {
      return 'text-red-600 bg-red-50 border-red-200';
    } 
    // Neutral moods - blue
    else {
      return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getMoodIcon = (mood: string) => {
    const moodLower = mood.toLowerCase();
    
    if (moodLower.includes('happy') || moodLower.includes('joy') || moodLower.includes('joyful')) {
      return '😊';
    } else if (moodLower.includes('excited') || moodLower.includes('energetic')) {
      return '🤩';
    } else if (moodLower.includes('content') || moodLower.includes('peaceful')) {
      return '😌';
    } else if (moodLower.includes('sad') || moodLower.includes('down')) {
      return '😔';
    } else if (moodLower.includes('angry') || moodLower.includes('frustrated')) {
      return '😤';
    } else if (moodLower.includes('nervous') || moodLower.includes('worried') || moodLower.includes('anxious')) {
      return '😰';
    } else if (moodLower.includes('stressed') || moodLower.includes('overwhelmed')) {
      return '😵';
    } else if (moodLower.includes('reflective') || moodLower.includes('thoughtful')) {
      return '🤔';
    } else {
      return '😐';
    }
  };

  return (
    <div className={`relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border shadow-lg transition-all duration-300 hover:shadow-xl ${
      isLatest ? 'border-indigo-200 ring-2 ring-indigo-100' : 'border-gray-200/50'
    }`}>
      {isLatest && (
        <div className="absolute -top-3 left-8">
          <div className="flex items-center space-x-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
            <Sparkles className="w-3 h-3" />
            <span>Latest</span>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(entry.createdAt)}</span>
        </div>
        
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-sm font-medium ${getMoodColor(entry.mood)}`}>
          <span className="text-base">{getMoodIcon(entry.mood)}</span>
          <span>{entry.mood}</span>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Entry</h3>
          <p className="text-gray-700 leading-relaxed bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            {entry.text}
          </p>
        </div>

        <div className="grid md:grid-cols-1 gap-4">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-4 h-4 text-indigo-600" />
              <h4 className="font-medium text-indigo-900">AI Summary</h4>
            </div>
            <p className="text-indigo-800 text-sm leading-relaxed">
              {entry.summary.replace('Summary:', '').trim()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntryCard;