import React from 'react';
import { PenTool, Sparkles, Send } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface JournalEntryProps {
  text: string;
  setText: (text: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

const JournalEntry: React.FC<JournalEntryProps> = ({ text, setText, onSubmit, loading }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-lg">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg">
          <PenTool className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">What's on your mind?</h2>
          <p className="text-sm text-gray-600">Share your thoughts and let AI provide insights</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write about your day, your feelings, your thoughts... Let it all out."
            className="w-full h-40 p-6 bg-gray-50/50 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-900 leading-relaxed"
            disabled={loading}
          />
          {text.length > 0 && (
            <div className="absolute bottom-4 right-4 text-xs text-gray-400">
              {text.length} characters
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>AI will analyze your mood and create a summary</span>
          </div>
          
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Entry</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JournalEntry;