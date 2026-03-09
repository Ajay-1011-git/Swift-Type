import { useState } from "react";
import { Trophy, Medal, Award, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
function Leaderboard() {
  const [selectedMode, setSelectedMode] = useState("30s");
  const modes = ["15s", "30s", "60s", "120s", "words"];
  const entries = [
    { rank: 1, user: { name: "SpeedDemon" }, wpm: 142, accuracy: 98.5, tests: 1248 },
    { rank: 2, user: { name: "TypeMaster" }, wpm: 138, accuracy: 97.8, tests: 892 },
    { rank: 3, user: { name: "QuickFingers" }, wpm: 135, accuracy: 99.1, tests: 2103 },
    { rank: 4, user: { name: "KeyboardNinja" }, wpm: 132, accuracy: 96.7, tests: 567 },
    { rank: 5, user: { name: "FastTyper" }, wpm: 128, accuracy: 98.2, tests: 1456 },
    { rank: 6, user: { name: "RapidKeys" }, wpm: 125, accuracy: 97.5, tests: 743 },
    { rank: 7, user: { name: "FlashType" }, wpm: 122, accuracy: 96.9, tests: 321 },
    { rank: 8, user: { name: "SwiftHands" }, wpm: 120, accuracy: 98.8, tests: 1987 },
    { rank: 9, user: { name: "ProTypist" }, wpm: 118, accuracy: 97.1, tests: 654 },
    { rank: 10, user: { name: "TypingPro" }, wpm: 115, accuracy: 96.4, tests: 892 }
  ];
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-[#e2b714]" />;
      case 2:
        return <Medal className="w-6 h-6 text-[#c0c0c0]" />;
      case 3:
        return <Medal className="w-6 h-6 text-[#cd7f32]" />;
      default:
        return null;
    }
  };
  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case 1:
        return "bg-[#e2b714] text-[#323437]";
      case 2:
        return "bg-[#c0c0c0] text-[#323437]";
      case 3:
        return "bg-[#cd7f32] text-[#323437]";
      default:
        return "bg-[#2c2e31] text-[#646669]";
    }
  };
  return <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-8 font-sans-swift animate-fade-in-up">
      {
    /* Header */
  }
      <div className="flex items-center gap-3 mb-8">
        <TrendingUp className="w-8 h-8 text-[#e2b714]" />
        <h1 className="text-4xl text-[#d1d0c5]">Leaderboard</h1>
      </div>

      {
    /* Mode Selector */
  }
      <div className="flex items-center gap-2 mb-8">
        {modes.map((mode) => <button
    key={mode}
    onClick={() => setSelectedMode(mode)}
    className={`px-4 py-2 rounded-lg transition-all duration-200 ${selectedMode === mode ? "bg-[#e2b714] text-[#323437]" : "bg-[#2c2e31] text-[#646669] hover:text-[#d1d0c5]"}`}
  >
            {mode}
          </button>)}
      </div>

      {
    /* Leaderboard Table */
  }
      <div className="bg-[#2c2e31] rounded-lg border border-[#646669] border-opacity-20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#646669] border-opacity-20 bg-[#323437]">
                <th className="text-left px-6 py-4 text-[#646669] text-sm font-medium w-20">
                  Rank
                </th>
                <th className="text-left px-6 py-4 text-[#646669] text-sm font-medium">
                  User
                </th>
                <th className="text-left px-6 py-4 text-[#646669] text-sm font-medium">
                  WPM
                </th>
                <th className="text-left px-6 py-4 text-[#646669] text-sm font-medium">
                  Accuracy
                </th>
                <th className="text-left px-6 py-4 text-[#646669] text-sm font-medium">
                  Tests
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => <tr
    key={entry.rank}
    className={`hover:bg-[#323437] transition-colors duration-150 ${index !== entries.length - 1 ? "border-b border-[#646669] border-opacity-10" : ""}`}
  >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {getRankIcon(entry.rank)}
                      <span
    className={`flex items-center justify-center w-8 h-8 rounded-full ${getRankBadgeColor(entry.rank)} font-bold text-sm`}
  >
                        {entry.rank}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border-2 border-[#646669]">
                        <AvatarImage src={entry.user.avatar} alt={entry.user.name} />
                        <AvatarFallback className="bg-[#323437] text-[#e2b714]">
                          {entry.user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[#d1d0c5] font-medium">
                        {entry.user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[#e2b714] font-mono-swift font-bold text-lg">
                      {entry.wpm}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[#d1d0c5] font-mono-swift">
                      {entry.accuracy}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[#646669] font-mono-swift">{entry.tests}</span>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>

      {
    /* Info Section */
  }
      <div className="mt-8 p-6 bg-[#2c2e31] rounded-lg border border-[#646669] border-opacity-20">
        <div className="flex items-start gap-3">
          <Award className="w-5 h-5 text-[#e2b714] mt-0.5" />
          <div className="space-y-2">
            <h3 className="text-[#d1d0c5] font-medium">How Rankings Work</h3>
            <p className="text-[#646669] text-sm leading-relaxed">
              Rankings are based on the highest WPM achieved in the selected test mode.
              Your best performance is recorded and compared with other users. Complete
              more tests to improve your ranking and climb the leaderboard!
            </p>
          </div>
        </div>
      </div>
    </div>;
}
export {
  Leaderboard as default
};
