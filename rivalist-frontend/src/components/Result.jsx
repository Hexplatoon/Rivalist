import { useState, useEffect } from 'react';
import { Trophy, Frown, Home } from 'lucide-react';

export default function Result() {
  const [confetti, setConfetti] = useState([]);
  
  // Generate confetti pieces on component mount
  useEffect(() => {
    const newConfetti = [];
    for (let i = 0; i < 50; i++) {
      newConfetti.push({
        id: i,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        size: Math.floor(Math.random() * 10) + 5,
        color: ['bg-cyan-400', 'bg-emerald-400', 'bg-fuchsia-400', 'bg-amber-400', 'bg-sky-400'][
          Math.floor(Math.random() * 5)
        ],
      });
    }
    setConfetti(newConfetti);
  }, []);

  // Sample player data - you would normally get this from props or context
  const winner = {
    name: "Player 1",
    score: 120,
    avatar: "/api/placeholder/100/100" // Placeholder avatar
  };
  
  const loser = {
    name: "Player 2",
    score: 85,
    avatar: "/api/placeholder/100/100" // Placeholder avatar
  };

  return (
    <div className="relative min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden p-4">
        {/* Game Result Content */}
        <div className=" w-[600px] z-10 space-y-9 border-4 border-white rounded-4xl p-9  from-purple-400 to-cyan-400">
            {/* Header */}
            <div className="text-center">
            <h1 className="w-full text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2">Battle Over</h1>
            <div className="w-32 h-1 mx-auto bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"></div>
            </div>
            
            {/* Winner Card */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-purple-800 shadow-lg">
            <div className="flex items-center gap-4 mb-5 ml-3 mt-2">
                <div className="relative">
                <img 
                    src={winner.avatar} 
                    alt={winner.name} 
                    className="w-22 h-22 rounded-full object-cover border-2 border-purple-300"
                />
                <div className="absolute -bottom-2 -right-2 bg-yellow-500 rounded-full p-1 border-2 border-gray-900">
                    <Trophy size={18} className="text-gray-900" />
                </div>
                </div>
                <div className="flex-1">
                <div className="flex items-center justify-between">
                    <div>
                    <h2 className="text-2xl font-bold text-white">{winner.name}</h2>
                    <div className="inline-block bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full px-3 py-1 text-xs font-semibold text-white mt-1">
                        WINNER
                    </div>
                    </div>
                    <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                    {winner.score}
                    </div>
                </div>
                </div>
            </div>
            
            <div className="text-center py-2 text-gray-300 text-sm">
                Victory achieved with a {winner.score - loser.score} point lead!
            </div>
            </div>
            
            {/* Loser Card */}
            <div className="bg-gray-900 rounded-xl my-12 p-6 border border-gray-800">
            <div className="flex items-center gap-3">
                <div className="relative">
                <img 
                    src={loser.avatar} 
                    alt={loser.name} 
                    className="w-14 h-14 rounded-full object-cover grayscale opacity-80 border border-gray-700"
                />
                <div className="absolute -bottom-1 -right-1 bg-gray-700 rounded-full p-1">
                    <Frown size={12} className="text-gray-400" />
                </div>
                </div>
                <div className="flex-1">
                <div className="flex items-center justify-between">
                    <div>
                    <h3 className="text-lg font-medium text-gray-400">{loser.name}</h3>
                    <p className="text-xs text-gray-500">Better luck next time</p>
                    </div>
                    <div className="text-2xl font-bold text-gray-500">
                    {loser.score}
                    </div>
                </div>
                </div>
            </div>
            </div>
            
            {/* Action Button */}
            <div className="flex justify-center pt-2">
            <button className="flex items-center px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <Home className="mr-2" size={18} />
                Home
            </button>
            </div>
        </div>
    </div>
  );
}