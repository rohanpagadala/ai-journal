
import { useState, useEffect } from 'react';
import { JournalEntry } from '@/types/journal';
import { WriteEntry } from '@/components/WriteEntry';
import { Timeline } from '@/components/Timeline';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { saveEntries, loadEntries, saveApiKey, loadApiKey, clearApiKey } from '@/utils/storage';
import { PenTool, BookOpen, Settings, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [activeTab, setActiveTab] = useState('write');
  const { toast } = useToast();

  useEffect(() => {
    const loadedEntries = loadEntries();
    const loadedApiKey = loadApiKey();
    setEntries(loadedEntries);
    setApiKey(loadedApiKey);
  }, []);

  const handleSaveEntry = (entryData: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    
    if (editingEntry) {
      // Update existing entry
      const updatedEntries = entries.map(entry =>
        entry.id === editingEntry.id
          ? {
              ...entry,
              ...entryData,
              updatedAt: now,
            }
          : entry
      );
      setEntries(updatedEntries);
      saveEntries(updatedEntries);
      setEditingEntry(null);
      toast({
        title: "Entry updated!",
        description: "Your journal entry has been successfully updated.",
      });
    } else {
      // Create new entry
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        ...entryData,
        createdAt: now,
        updatedAt: now,
      };
      const updatedEntries = [newEntry, ...entries];
      setEntries(updatedEntries);
      saveEntries(updatedEntries);
      toast({
        title: "Entry saved!",
        description: "Your journal entry has been successfully saved.",
      });
    }
    
    // Switch to timeline after saving
    setActiveTab('timeline');
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setActiveTab('write');
  };

  const handleCancelEdit = () => {
    setEditingEntry(null);
  };

  const handleSaveApiKey = (newApiKey: string) => {
    setApiKey(newApiKey);
    saveApiKey(newApiKey);
    toast({
      title: "API key saved!",
      description: "You can now use AI analysis for your journal entries.",
    });
  };

  const handleClearApiKey = () => {
    setApiKey(null);
    clearApiKey();
    toast({
      title: "API key removed",
      description: "AI analysis has been disabled.",
    });
  };

  const handleNewEntry = () => {
    setEditingEntry(null);
    setActiveTab('write');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Daily Journal
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Capture your thoughts, analyze your mood, and track your journey with AI-powered insights.
          </p>
        </div>

        {/* Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="grid w-auto grid-cols-2 bg-white shadow-sm">
              <TabsTrigger value="write" className="flex items-center gap-2">
                <PenTool className="h-4 w-4" />
                Write
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Timeline ({entries.length})
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowApiKeyModal(true)}
                className="flex items-center gap-2"
              >
                <Key className="h-4 w-4" />
                {apiKey ? 'Update' : 'Add'} API Key
              </Button>
              {apiKey && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearApiKey}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              )}
            </div>
          </div>

          <TabsContent value="write" className="mt-0">
            <WriteEntry
              entry={editingEntry}
              onSave={handleSaveEntry}
              onCancel={editingEntry ? handleCancelEdit : undefined}
              apiKey={apiKey}
              onRequestApiKey={() => setShowApiKeyModal(true)}
            />
          </TabsContent>

          <TabsContent value="timeline" className="mt-0">
            <Timeline
              entries={entries}
              onEdit={handleEditEntry}
              onNewEntry={handleNewEntry}
            />
          </TabsContent>
        </Tabs>

        {/* API Key Modal */}
        <ApiKeyModal
          isOpen={showApiKeyModal}
          onClose={() => setShowApiKeyModal(false)}
          onSave={handleSaveApiKey}
          currentApiKey={apiKey || undefined}
        />
      </div>
    </div>
  );
};

export default Index;
