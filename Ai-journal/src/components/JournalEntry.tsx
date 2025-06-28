
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { JournalEntry as JournalEntryType } from '@/types/journal';
import { getMoodColor, getMoodEmoji } from '@/utils/ai';
import { Calendar, Edit } from 'lucide-react';
import { format } from 'date-fns';

interface JournalEntryProps {
  entry: JournalEntryType;
  onEdit: (entry: JournalEntryType) => void;
}

export const JournalEntry = ({ entry, onEdit }: JournalEntryProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const shouldTruncate = entry.content.length > 200;
  const displayContent = isExpanded ? entry.content : entry.content.slice(0, 200);

  return (
    <Card className="w-full hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {entry.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {format(entry.date, 'EEEE, MMMM d, yyyy')}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {entry.aiAnalysis && (
              <Badge 
                variant="secondary" 
                className="text-white border-none"
                style={{ 
                  backgroundColor: getMoodColor(entry.aiAnalysis.mood),
                }}
              >
                {getMoodEmoji(entry.aiAnalysis.mood)} {entry.aiAnalysis.mood}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(entry)}
              className="opacity-60 hover:opacity-100"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {displayContent}
              {shouldTruncate && !isExpanded && '...'}
            </p>
            {shouldTruncate && (
              <Button
                variant="link"
                className="p-0 h-auto font-normal"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 'Read less' : 'Read more'}
              </Button>
            )}
          </div>
          
          {entry.aiAnalysis && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">AI Summary</h4>
                <p className="text-sm text-gray-700">{entry.aiAnalysis.summary}</p>
              </div>
              
              {entry.aiAnalysis.keywords && entry.aiAnalysis.keywords.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Keywords</h4>
                  <div className="flex flex-wrap gap-1">
                    {entry.aiAnalysis.keywords.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
