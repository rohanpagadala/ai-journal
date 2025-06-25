import React, { useState } from 'react';
import { PenTool, Sparkles, Save, Loader, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface WriteEntryProps {
  onEntryCreated: () => void;
}

export function WriteEntry({ onEntryCreated }: WriteEntryProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const analyzeAndSave = async () => {
    if (!user || !title.trim() || !content.trim()) {
      setError('Please fill in both title and content');
      return;
    }

    setIsAnalyzing(true);
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      // Initialize with default values
      let analysis = {
        mood: 'neutral' as const,
        mood_score: 0.5,
        summary: content.length > 100 ? content.substring(0, 100) + "..." : content,
        tags: [] as string[],
      };

      // Try AI analysis first
      try {
        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-entry`;
        console.log('Calling AI analysis:', apiUrl);
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content, title }),
        });

        if (response.ok) {
          const aiAnalysis = await response.json();
          analysis = aiAnalysis;
          console.log('AI analysis successful:', analysis);
        } else {
          console.warn('AI analysis failed, using fallback analysis');
          // Fallback analysis
          analysis = performFallbackAnalysis(content, title);
        }
      } catch (aiError) {
        console.warn('AI analysis error, using fallback:', aiError);
        analysis = performFallbackAnalysis(content, title);
      }

      setIsAnalyzing(false);

      // Save to database
      console.log('Saving to database with analysis:', analysis);
      const { data, error: dbError } = await supabase.from('journal_entries').insert({
        user_id: user.id,
        title: title.trim(),
        content: content.trim(),
        mood: analysis.mood,
        mood_score: analysis.mood_score,
        ai_summary: analysis.summary,
        tags: analysis.tags,
      }).select();

      if (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
      }

      console.log('Entry saved successfully:', data);
      setSuccess('Entry saved successfully!');
      
      // Reset form after a short delay
      setTimeout(() => {
        setTitle('');
        setContent('');
        setSuccess('');
        onEntryCreated();
      }, 1500);

    } catch (error: any) {
      console.error('Error saving entry:', error);
      setError(error.message || 'Failed to save entry. Please try again.');
    } finally {
      setIsSaving(false);
      setIsAnalyzing(false);
    }
  };

  const performFallbackAnalysis = (content: string, title: string) => {
    const positiveKeywords = ['happy', 'joy', 'excited', 'grateful', 'amazing', 'wonderful', 'great', 'love', 'excellent', 'fantastic', 'peaceful', 'calm', 'grounded', 'clarity'];
    const negativeKeywords = ['sad', 'angry', 'frustrated', 'terrible', 'awful', 'hate', 'disappointed', 'worried', 'stressed', 'anxious', 'chaos', 'uncertain'];
    
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
      mood_score = Math.min(0.5 + (positiveCount * 0.15), 1.0);
    } else if (negativeCount > positiveCount) {
      mood = 'negative';
      mood_score = Math.max(0.5 - (negativeCount * 0.15), 0.0);
    }
    
    // Generate summary
    const summary = content.length > 100 
      ? content.substring(0, 100) + "..."
      : content;
    
    // Extract tags
    const tags: string[] = [];
    if (text.includes('work') || text.includes('job') || text.includes('deadline')) tags.push('work');
    if (text.includes('family') || text.includes('parent')) tags.push('family');
    if (text.includes('friend') || text.includes('social')) tags.push('relationships');
    if (text.includes('health') || text.includes('exercise') || text.includes('walk')) tags.push('health');
    if (text.includes('travel') || text.includes('vacation')) tags.push('travel');
    if (text.includes('music') || text.includes('art')) tags.push('creativity');
    if (text.includes('anxious') || text.includes('stress') || text.includes('worry')) tags.push('mental-health');
    if (text.includes('grateful') || text.includes('thankful')) tags.push('gratitude');
    
    return { mood, mood_score, summary, tags };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    analyzeAndSave();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-orange-500 px-6 py-4">
          <div className="flex items-center space-x-3 text-white">
            <PenTool className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Write New Entry</h2>
            {isAnalyzing && (
              <div className="flex items-center space-x-2 text-blue-100">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span className="text-sm">AI analyzing...</span>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mx-6 mt-4 bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
            <div className="flex items-center">
              <Save className="w-5 h-5 text-green-400 mr-2" />
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Entry Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's on your mind today?"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
              disabled={isSaving}
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Your Thoughts
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Express your thoughts, feelings, and experiences..."
              rows={12}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              required
              disabled={isSaving}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              {content.length} characters
            </div>
            <button
              type="submit"
              disabled={!title.trim() || !content.trim() || isSaving}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-orange-500 text-white rounded-lg hover:from-blue-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isSaving ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{isSaving ? 'Saving...' : 'Save Entry'}</span>
            </button>
          </div>
        </form>
      </div>

      {isAnalyzing && (
        <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
          <div className="flex items-center">
            <Sparkles className="w-5 h-5 text-blue-400 animate-pulse mr-2" />
            <p className="text-blue-700">
              AI is analyzing your entry for mood patterns and generating insights...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}