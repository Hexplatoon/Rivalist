
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useNavigate } from 'react-router-dom';

const problemTags = [
  'implementation', 'math', 'greedy', 'dp', 
  'data structures', 'strings', 'binary search', 'graphs',
  'trees', 'number theory', 'combinatorics', 'geometry'
];

const CodeforcesSettings = () => {
  const navigate = useNavigate();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [ratingRange, setRatingRange] = useState([800, 1600]);
  const [numQuestions, setNumQuestions] = useState(1);
  
  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };
  
  const handleStartMatchmaking = () => {
    navigate('/battle/codeforces/matchmaking', { 
      state: { 
        mode: 'random',
        settings: {
          tags: selectedTags,
          minRating: ratingRange[0],
          maxRating: ratingRange[1],
          numQuestions
        }
      } 
    });
  };
  
  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Codeforces Duel Settings</h2>
        <p className="text-muted-foreground mb-6">
          Customize your matchmaking preferences for a fair battle
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Problem Tags</Label>
          <div className="flex flex-wrap gap-2">
            {problemTags.map(tag => (
              <Button
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                size="sm"
                onClick={() => handleTagSelect(tag)}
                className="capitalize"
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Problem Rating Range</Label>
          <div className="pt-6 px-2">
            <Slider
              defaultValue={[800, 1600]}
              min={800}
              max={3500}
              step={100}
              onValueChange={setRatingRange}
            />
            <div className="flex justify-between mt-2">
              <span className="text-sm text-muted-foreground">Min: {ratingRange[0]}</span>
              <span className="text-sm text-muted-foreground">Max: {ratingRange[1]}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="numQuestions">Number of Questions</Label>
          <Select 
            defaultValue="1"
            onValueChange={(value) => setNumQuestions(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select number of questions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Question</SelectItem>
              <SelectItem value="2">2 Questions</SelectItem>
              <SelectItem value="3">3 Questions</SelectItem>
              <SelectItem value="5">5 Questions</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button 
        className="w-full mt-8" 
        onClick={handleStartMatchmaking}
        disabled={selectedTags.length === 0}
      >
        Start Matchmaking
      </Button>
    </div>
  );
};

export default CodeforcesSettings;
