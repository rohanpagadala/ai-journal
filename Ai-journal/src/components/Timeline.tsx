
import { JournalEntry as JournalEntryType } from '@/types/journal';
import { JournalEntry } from './JournalEntry';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus } from 'lucide-react';
import { format, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns';

interface TimelineProps {
  entries: JournalEntryType[];
  onEdit: (entry: JournalEntryType) => void;
  onNewEntry: () => void;
}

export const Timeline = ({ entries, onEdit, onNewEntry }: TimelineProps) => {
  const groupedEntries = entries.reduce((groups, entry) => {
    let groupKey: string;
    
    if (isToday(entry.date)) {
      groupKey = 'Today';
    } else if (isYesterday(entry.date)) {
      groupKey = 'Yesterday';
    } else if (isThisWeek(entry.date)) {
      groupKey = 'This Week';
    } else if (isThisMonth(entry.date)) {
      groupKey = 'This Month';
    } else {
      groupKey = format(entry.date, 'MMMM yyyy');
    }
    
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(entry);
    return groups;
  }, {} as Record<string, JournalEntryType[]>);

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No entries yet</h3>
        <p className="text-gray-500 mb-6">Start your journaling journey by writing your first entry.</p>
        <Button onClick={onNewEntry} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Write First Entry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedEntries).map(([period, periodEntries]) => (
        <div key={period}>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 sticky top-0 bg-white/90 backdrop-blur-sm py-2 z-10">
            {period}
          </h2>
          <div className="space-y-4">
            {periodEntries
              .sort((a, b) => b.date.getTime() - a.date.getTime())
              .map((entry) => (
                <JournalEntry key={entry.id} entry={entry} onEdit={onEdit} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};
