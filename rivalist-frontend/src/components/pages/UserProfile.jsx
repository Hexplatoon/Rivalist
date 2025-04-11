import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const UserProfile = () => {
  const [selectedType, setSelectedType] = useState('all');

  const user = {
    name: 'John Doe',
    username: 'johndoe123',
    profilePhoto: '/api/placeholder/100/100',
    battleHistory: Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      opponent: `Opponent ${i + 1}`,
      type: ['Codeforces', 'CSS', 'Typing'][i % 3],
      result: i % 2 === 0 ? 'Win' : 'Loss',
      score: Math.floor(Math.random() * 100),
      date: `2025-03-${(30 - (i % 30)).toString().padStart(2, '0')}`,
    })),
  };

  const filteredHistory =
    selectedType === 'all'
      ? user.battleHistory
      : user.battleHistory.filter((b) => b.type === selectedType);

  const winCount = filteredHistory.filter((b) => b.result === 'Win').length;
  const lossCount = filteredHistory.filter((b) => b.result === 'Loss').length;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Profile Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <img
            src={user.profilePhoto}
            alt="Profile"
            className="w-24 h-24 rounded-full mr-4 border-2 border-green-500"
          />
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-400">@{user.username}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl text-gray-400">Total Battles</p>
          <p className="text-3xl font-bold text-green-400">{filteredHistory.length}</p>
          <div className="flex gap-4 mt-2 justify-end">
            <span className="bg-green-600 text-white px-3 py-1 rounded text-sm">
              Wins: {winCount}
            </span>
            <span className="bg-red-600 text-white px-3 py-1 rounded text-sm">
              Losses: {lossCount}
            </span>
          </div>
        </div>
      </div>

      {/* Battle History Section */}
      <div className="bg-gray-900 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Battle History</h3>
          <Select onValueChange={setSelectedType} defaultValue="all">
            <SelectTrigger className="w-[150px] text-white border-gray-700 bg-gray-800">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white border-gray-700">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Codeforces">Codeforces</SelectItem>
              <SelectItem value="CSS">CSS</SelectItem>
              <SelectItem value="Typing">Typing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <div className="max-h-[528px] overflow-y-auto custom-scroll">
            <table className="w-full table-fixed border-collapse">
              <thead className="bg-gray-800 sticky top-0">
                <tr>
                  <th className="w-[14%] px-21 py-3 text-left text-sm font-medium text-gray-300">Opponent</th>
                  <th className="w-[20%] px-38 py-3 text-left text-sm font-medium text-gray-300">Type</th>
                  <th className="w-[15%] px-28 py-3 text-left text-sm font-medium text-gray-300">Result</th>
                  <th className="w-[15%] px-28 py-3 text-left text-sm font-medium text-gray-300">Score</th>
                  <th className="w-[20%] px-38 py-3 text-left text-sm font-medium text-gray-300">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-400">
                      No battles found.
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((battle) => (
                    <tr key={battle.id} className="hover:bg-gray-800">
                      <td className="w-[30%] px-4 py-3 text-sm truncate">{battle.opponent}</td>
                      <td className="w-[20%] px-4 py-3 text-sm truncate">{battle.type}</td>
                      <td className="w-[15%] px-4 py-3 text-sm">
                        <span className={`inline-block px-2 py-1 rounded ${battle.result === 'Win' ? 'bg-green-600' : 'bg-red-600'}`}>
                          {battle.result}
                        </span>
                      </td>
                      <td className="w-[15%] px-4 py-3 text-sm">{battle.score}</td>
                      <td className="w-[20%] px-4 py-3 text-sm">{battle.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Scrollbar Styling */}
      <style jsx global>{`
        .custom-scroll::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 4px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #000000;
          border-radius: 4px;
          border: 2px solid #1f2937;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: #111827;
        }
      `}</style>
    </div>
  );
};

export default UserProfile;