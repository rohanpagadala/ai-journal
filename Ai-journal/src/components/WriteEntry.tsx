
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { JournalEntry } from '@/types/journal';
import { analyzeMood, getMoodColor, getMoodEmoji } from '@/utils/ai';
import { Sparkles, Save, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface WriteEntryProps {
  entry?: JournalEntry;
  onSave: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel?: () => void;
  apiKey: string | null;
  onRequestApiKey: () => void;
}

export const WriteEntry = ({ entry, onSave, onCancel, apiKey, onRequestApiKey }: WriteEntryProps) => {
  const [title, setTitle] = useState(entry?.title || '');
  const [content, setContent] = useState(entry?.content || '');
  const [date, setDate] = useState(entry?.date ? format(entry.date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'));
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(entry?.aiAnalysis || null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!content.trim()) {
      toast({
        title: "Nothing to analyze",
        description: "Please write some content before analyzing.",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey) {
      onRequestApiKey();
      return;
    }

    setIsAnalyzing(true);
    try {
      const analysis = await analyzeMood(content, apiKey);
      setAiAnalysis(analysis);
      toast({
        title: "Analysis complete!",
        description: `Detected mood: ${getMoodEmoji(analysis.mood)} ${analysis.mood}`,
      });
    } catch (error) {
      console.error('Error analyzing entry:', error);
      toast({
        title: "Analysis failed",
        description: "Could not analyze your entry. Please check your API key.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and content for your entry.",
        variant: "destructive",
      });
      return;
    }

    onSave({
      title: title.trim(),
      content: content.trim(),
      date: new Date(date),
      aiAnalysis,
    });

    // Reset form if not editing
    if (!entry) {
      setTitle('');
      setContent('');
      setAiAnalysis(null);
      setDate(format(new Date(), 'yyyy-MM-dd'));
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {entry ? 'Edit Entry' : 'New Journal Entry'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              placeholder="What's on your mind today?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-medium">
              Date
            </label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="content" className="text-sm font-medium">
            Content
          </label>
          <Textarea
            id="content"
            placeholder="Write about your day, thoughts, feelings, or anything that comes to mind..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px] resize-y"
          />
        </div>
        
        {aiAnalysis && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <h4 className="font-medium text-gray-900">AI Analysis</h4>
              <Badge 
                variant="secondary" 
                className="text-white border-none"
                style={{ 
                  backgroundColor: getMoodColor(aiAnalysis.mood),
                }}
              >
                {getMoodEmoji(aiAnalysis.mood)} {aiAnalysis.mood}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-700">{aiAnalysis.summary}</p>
            
            {aiAnalysis.keywords && aiAnalysis.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {aiAnalysis.keywords.map((keyword, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
        
        <div className="flex gap-2 justify-between">
          <Button
            variant="outline"
            onClick={handleAnalyze}
            disabled={!content.trim() || isAnalyzing}
            className="flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
          </Button>
          
          <div className="flex gap-2">
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {entry ? 'Update' : 'Save'} Entry
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
