
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  ResponsiveContainer, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from 'recharts';
import { Keyboard, PenTool, Code, Trophy } from 'lucide-react';

// Mock data - replace with actual API calls
const battleHistory = [
  { id: 1, type: 'typing', opponent: 'SpeedTyper', result: 'win', date: '2023-10-15', rating: 78, opponentRating: 65 },
  { id: 2, type: 'css', opponent: 'DesignGuru', result: 'loss', date: '2023-10-14', rating: 62, opponentRating: 85 },
  { id: 3, type: 'codeforces', opponent: 'AlgoMaster', result: 'win', date: '2023-10-13', rating: 92, opponentRating: 87 },
  { id: 4, type: 'typing', opponent: 'KeyboardKing', result: 'loss', date: '2023-10-12', rating: 67, opponentRating: 72 },
  { id: 5, type: 'codeforces', opponent: 'ProblemSolver', result: 'win', date: '2023-10-11', rating: 88, opponentRating: 76 },
];

const ratingHistory = [
  { date: '10/05', typing: 1200, css: 1100, codeforces: 1050 },
  { date: '10/10', typing: 1220, css: 1090, codeforces: 1080 },
  { date: '10/15', typing: 1240, css: 1120, codeforces: 1120 },
  { date: '10/20', typing: 1230, css: 1150, codeforces: 1140 },
  { date: '10/25', typing: 1260, css: 1170, codeforces: 1180 },
];

const expByCategory = [
  { name: 'Typing', exp: 750, color: '#4361EE' },
  { name: 'CSS', exp: 580, color: '#9B5DE5' },
  { name: 'Codeforces', exp: 890, color: '#F72585' },
];

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Battles</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">32</div>
            <p className="text-xs text-muted-foreground mt-2">15 wins, 17 losses</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">1,203</div>
            <p className="text-xs text-green-500 mt-2">+45 this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Experience</CardTitle>
            <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 0L9.32 5.17L14.5 5.88L10.68 9.83L11.9 15L7.5 12.19L3.1 15L4.32 9.83L0.5 5.88L5.68 5.17L7.5 0Z" fill="currentColor"/>
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">2,220</div>
            <p className="text-xs text-green-500 mt-2">Level 7</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="stats" className="mb-8">
        <TabsList>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="history">Battle History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stats" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rating Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ratingHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="typing" 
                      stroke="#4361EE" 
                      name="Typing" 
                      strokeWidth={2} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="css" 
                      stroke="#9B5DE5" 
                      name="CSS" 
                      strokeWidth={2} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="codeforces" 
                      stroke="#F72585" 
                      name="Codeforces" 
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Experience by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={expByCategory}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar 
                      dataKey="exp" 
                      name="Experience Points" 
                      fill="#4361EE" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Recent Battles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {battleHistory.map(battle => (
                  <div key={battle.id} className="flex items-center p-3 bg-muted/20 rounded-lg">
                    <div className="mr-4">
                      {battle.type === 'typing' && <Keyboard className="h-5 w-5 text-blue-500" />}
                      {battle.type === 'css' && <PenTool className="h-5 w-5 text-purple-500" />}
                      {battle.type === 'codeforces' && <Code className="h-5 w-5 text-pink-500" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium capitalize">{battle.type} Battle</p>
                          <p className="text-xs text-muted-foreground">vs {battle.opponent}</p>
                        </div>
                        <div className="text-right">
                          <p className={battle.result === 'win' ? 'text-green-500 font-medium' : 'text-red-500 font-medium'}>
                            {battle.result === 'win' ? 'Victory' : 'Defeat'}
                          </p>
                          <p className="text-xs text-muted-foreground">{battle.date}</p>
                        </div>
                      </div>
                      <div className="flex justify-between mt-2 text-xs">
                        <span>Your score: {battle.rating}%</span>
                        <span>Opponent score: {battle.opponentRating}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
