import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Users, Share2, Maximize, Loader2, Gamepad2 } from 'lucide-react';

const categoryColors = {
  action: "bg-red-500",
  puzzle: "bg-blue-500",
  adventure: "bg-green-500",
  arcade: "bg-yellow-500",
  sports: "bg-orange-500",
  racing: "bg-pink-500",
  strategy: "bg-purple-500"
};

export default function PlayGame() {
  const urlParams = new URLSearchParams(window.location.search);
  const gameId = urlParams.get('id');
  const queryClient = useQueryClient();

  const { data: game, isLoading } = useQuery({
    queryKey: ['game', gameId],
    queryFn: async () => {
      const games = await base44.entities.Game.filter({ id: gameId });
      return games[0];
    },
    enabled: !!gameId
  });

  const updatePlayCount = useMutation({
    mutationFn: () => base44.entities.Game.update(gameId, { 
      play_count: (game?.play_count || 0) + 1 
    }),
    onSuccess: () => queryClient.invalidateQueries(['game', gameId])
  });

  useEffect(() => {
    if (game && !updatePlayCount.isPending) {
      updatePlayCount.mutate();
    }
  }, [game?.id]);

  const handleShare = () => {
    navigator.share?.({
      title: game?.title,
      text: `Check out ${game?.title} on Baldenalden.org!`,
      url: window.location.href
    }).catch(() => {
      navigator.clipboard.writeText(window.location.href);
    });
  };

  const handleFullscreen = () => {
    const iframe = document.getElementById('game-frame');
    if (iframe?.requestFullscreen) {
      iframe.requestFullscreen();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="text-center py-20">
        <Gamepad2 className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
        <h2 className="text-2xl font-bold text-white mb-2">Game not found</h2>
        <p className="text-white/60 mb-4">This game doesn't exist or was removed.</p>
        <Link to={createPageUrl('Games')}>
          <Button className="bg-gradient-to-r from-pink-500 to-purple-600">
            Browse Games
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button & Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to={createPageUrl('Games')}>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">{game.title}</h1>
            <div className="flex items-center gap-3 mt-1">
              <Badge className={`${categoryColors[game.category] || 'bg-gray-500'} text-white`}>
                {game.category}
              </Badge>
              <span className="text-white/50 text-sm flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {game.play_count?.toLocaleString() || 0} plays
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="border-white/30 text-white hover:bg-white/10" onClick={handleShare}>
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className="border-white/30 text-white hover:bg-white/10" onClick={handleFullscreen}>
            <Maximize className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Game Frame */}
      <Card className="bg-black/50 border-white/20 overflow-hidden">
        {game.game_url ? (
          <iframe
            id="game-frame"
            src={game.game_url}
            className="w-full aspect-video"
            allowFullScreen
            allow="autoplay; fullscreen; gamepad"
          />
        ) : (
          <div className="w-full aspect-video flex items-center justify-center bg-gradient-to-br from-purple-900/50 to-blue-900/50">
            <div className="text-center">
              <Gamepad2 className="w-20 h-20 text-purple-400 mx-auto mb-4" />
              <p className="text-white/60">Game coming soon!</p>
            </div>
          </div>
        )}
      </Card>

      {/* Game Description */}
      {game.description && (
        <Card className="bg-white/5 border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-2">About this game</h3>
          <p className="text-white/70">{game.description}</p>
        </Card>
      )}
    </div>
  );
}