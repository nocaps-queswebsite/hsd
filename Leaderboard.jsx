import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Trophy, Medal, Crown, Gamepad2, Loader2 } from 'lucide-react';

export default function Leaderboard() {
  const { data: games = [], isLoading } = useQuery({
    queryKey: ['games-leaderboard'],
    queryFn: () => base44.entities.Game.list('-play_count', 10)
  });

  const getRankIcon = (index) => {
    if (index === 0) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-300" />;
    if (index === 2) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="w-6 h-6 flex items-center justify-center text-white/50 font-bold">{index + 1}</span>;
  };

  const getRankBg = (index) => {
    if (index === 0) return "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30";
    if (index === 1) return "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30";
    if (index === 2) return "bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-600/30";
    return "bg-white/5 border-white/10";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl mb-4">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-black text-white mb-2">
          🏆 Most Played Games
        </h1>
        <p className="text-white/60">See what everyone's playing!</p>
      </div>

      {/* Leaderboard */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        </div>
      ) : games.length > 0 ? (
        <div className="max-w-2xl mx-auto space-y-3">
          {games.map((game, index) => (
            <Card 
              key={game.id} 
              className={`p-4 border ${getRankBg(index)} transition-transform hover:scale-[1.02]`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center">
                  {getRankIcon(index)}
                </div>
                <img 
                  src={game.thumbnail || `https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=100&h=100&fit=crop`}
                  alt={game.title}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white truncate">{game.title}</h3>
                  <p className="text-white/50 text-sm capitalize">{game.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                    {game.play_count?.toLocaleString() || 0}
                  </p>
                  <p className="text-white/40 text-xs">plays</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 max-w-md mx-auto">
          <Gamepad2 className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-white mb-2">No games yet!</h3>
          <p className="text-white/60">Be the first to play!</p>
        </div>
      )}
    </div>
  );
}