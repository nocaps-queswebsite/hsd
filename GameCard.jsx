import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Users } from 'lucide-react';

const categoryColors = {
  action: "bg-red-500",
  puzzle: "bg-blue-500",
  adventure: "bg-green-500",
  arcade: "bg-yellow-500",
  sports: "bg-orange-500",
  racing: "bg-pink-500",
  strategy: "bg-purple-500"
};

export default function GameCard({ game }) {
  return (
    <Link to={createPageUrl(`PlayGame?id=${game.id}`)}>
      <Card className="group overflow-hidden bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 cursor-pointer">
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={game.thumbnail || `https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=300&fit=crop`}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50">
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </div>
          </div>
          {game.featured && (
            <Badge className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold">
              ⭐ Featured
            </Badge>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-white text-lg truncate">{game.title}</h3>
            <Badge className={`${categoryColors[game.category] || 'bg-gray-500'} text-white text-xs shrink-0`}>
              {game.category}
            </Badge>
          </div>
          <p className="text-white/60 text-sm line-clamp-2 mb-3">{game.description}</p>
          <div className="flex items-center text-white/50 text-sm">
            <Users className="w-4 h-4 mr-1" />
            {game.play_count?.toLocaleString() || 0} plays
          </div>
        </div>
      </Card>
    </Link>
  );
}