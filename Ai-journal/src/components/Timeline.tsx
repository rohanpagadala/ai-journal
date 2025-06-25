import React, { useState, useEffect } from 'react';
import { Calendar, Heart, Meh, Frown, Tag, Clock, Search, RefreshCw } from 'lucide-react';
import { supabase, JournalEntry } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function Timeline() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    if (!user) return;

    setLoading(true);
    setError('');
    try {
      console.log('Fetching entries for user:', user.id);
      const { data, error: fetchError } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Fetch error:', fetchError);
        throw fetchError;
      }
      
      console.log('Fetched entries:', data);
      setEntries(data || []);
    } catch (error: any) {
      console.error('Error fetching entries:', error);
      setError('Failed to load entries. Please try refreshing.');
    } finally {
      setLoading(false);
    }
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'positive':
        return <Heart className="w-5 h-5 text-green-500" />;
      case 'negative':
        return <Frown className="w-5 h-5 text-red-500" />;
      default:
        return <Meh className="w-5 h-5 text-amber-500" />;
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'positive':
        return 'bg-green-100 border-green-200';
      case 'negative':
        return 'bg-red-100 border-red-200';
      default:
        return 'bg-amber-100 border-amber-200';
    }
  };

  const getMoodScore = (score: number) => {
    return Math.round(score * 100);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMood = selectedMood === 'all' || entry.mood === selectedMood;
    return matchesSearch && matchesMood;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-900">Your Journey</h2>
          </div>
          <button
            onClick={fetchEntries}
            className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search your entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedMood}
            onChange={(e) => setSelectedMood(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Moods</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-gray-600">Positive</span>
            </div>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {entries.filter(e => e.mood === 'positive').length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center space-x-2">
              <Meh className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-medium text-gray-600">Neutral</span>
            </div>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {entries.filter(e => e.mood === 'neutral').length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center space-x-2">
              <Frown className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-gray-600">Negative</span>
            </div>
            <p className="text-2xl font-bold text-red-600 mt-1">
              {entries.filter(e => e.mood === 'negative').length}
            </p>
          </div>
        </div>
      </div>

      {filteredEntries.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {entries.length === 0 ? "No entries yet" : "No entries match your search"}
          </h3>
          <p className="text-gray-500">
            {entries.length === 0 
              ? "Start your journaling journey by writing your first entry!"
              : "Try adjusting your search terms or filters."
            }
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredEntries.map((entry) => (
            <article
              key={entry.id}
              className={`bg-white rounded-xl shadow-sm border-l-4 p-6 hover:shadow-md transition-all duration-200 ${getMoodColor(entry.mood)}`}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                  {entry.title}
                </h3>
                <div className="flex items-center space-x-3 ml-4">
                  <div className="flex items-center space-x-1">
                    {getMoodIcon(entry.mood)}
                    <span className="text-sm font-medium text-gray-600">
                      {getMoodScore(entry.mood_score)}%
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatTime(entry.created_at)}
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-4">
                {formatDate(entry.created_at)}
              </div>

              {entry.ai_summary && (
                <div className="bg-blue-50 rounded-lg p-4 mb-4 border-l-4 border-blue-200">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">AI Summary</h4>
                  <p className="text-blue-800 text-sm">{entry.ai_summary}</p>
                </div>
              )}

              <div className="prose prose-sm max-w-none text-gray-700 mb-4">
                <p className="whitespace-pre-wrap">{entry.content}</p>
              </div>

              {entry.tags && entry.tags.length > 0 && (
                <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}