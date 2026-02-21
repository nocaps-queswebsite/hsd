import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Gamepad2, Trophy, Zap, Star, ChevronRight, Sparkles, Cookie, Crosshair } from 'lucide-react';
import { Button } from '@/components/ui/button';

const games = [
  {
    id: 'reaction',
    title: 'Lightning Reflexes',
    description: 'Test your reaction speed!',
    icon: Zap,
    color: 'from-cyan-500 to-blue-600',
    bgGlow: 'bg-cyan-500/20'
  },
  {
    id: 'memory',
    title: 'Mind Maze',
    description: 'Challenge your memory',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-600',
    bgGlow: 'bg-purple-500/20'
  },
  {
    id: 'clicker',
    title: 'Tap Frenzy',
    description: 'How fast can you tap?',
    icon: Star,
    color: 'from-orange-500 to-red-600',
    bgGlow: 'bg-orange-500/20'
  },
  {
    id: 'snake',
    title: 'Snake',
    description: 'Classic snake game!',
    icon: Gamepad2,
    color: 'from-green-500 to-emerald-600',
    bgGlow: 'bg-green-500/20'
  },
  {
    id: 'cookie',
    title: 'Cookie Clicker',
    description: 'Click for cookies!',
    icon: Cookie,
    color: 'from-amber-500 to-orange-600',
    bgGlow: 'bg-amber-500/20'
  },
  {
    id: 'fps',
    title: 'Zombie Shooter',
    description: 'Defend the window!',
    icon: Crosshair,
    color: 'from-red-500 to-rose-600',
    bgGlow: 'bg-red-500/20'
  }
];

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [highScores, setHighScores] = useState({});

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const scores = {
      reaction: localStorage.getItem('reactionBest'),
      memory: localStorage.getItem('memoryHighScore'),
      tap10: localStorage.getItem('tapHighScores') ? JSON.parse(localStorage.getItem('tapHighScores'))[10] : null,
      tap50: localStorage.getItem('tapHighScores') ? JSON.parse(localStorage.getItem('tapHighScores'))[50] : null,
      tap100: localStorage.getItem('tapHighScores') ? JSON.parse(localStorage.getItem('tapHighScores'))[100] : null,
      snake: localStorage.getItem('snakeHighScore')
    };
    setHighScores(scores);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 rounded-full bg-purple-600/30 blur-3xl transition-all duration-1000"
          style={{ 
            left: mousePos.x - 192, 
            top: mousePos.y - 192,
            transform: 'translate(-50%, -50%)'
          }}
        />
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-cyan-600/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-orange-600/20 blur-3xl animate-pulse" />
      </div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="inline-block mb-6"
            >
              <div className="bg-gradient-to-r from-purple-500 via-cyan-500 to-orange-500 p-4 rounded-2xl">
                <Gamepad2 className="w-16 h-16 text-white" />
              </div>
            </motion.div>

            <h1 className="text-5xl sm:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-orange-400 bg-clip-text text-transparent">
                BALDENALDEN
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-slate-400 mb-10 max-w-2xl mx-auto">
              Epic games, endless fun. Jump in and start playing! 🎮
            </p>

            <Link to={createPageUrl('Games')}>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white px-8 py-6 text-lg rounded-2xl shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105"
              >
                <Gamepad2 className="mr-2 h-5 w-5" />
                Play Now
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 grid grid-cols-3 gap-4 max-w-lg mx-auto"
          >
            {[
              { label: 'Games', value: '6+', icon: Gamepad2 },
              { label: 'Fun Level', value: '100%', icon: Star },
              { label: 'High Scores', value: '∞', icon: Trophy }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-4 text-center"
              >
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </motion.div>
            ))}
            </motion.div>

            {/* High Scores Display */}
            {(highScores.reaction || highScores.memory || highScores.snake || highScores.tap10 || highScores.tap50 || highScores.tap100) && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-12 max-w-2xl mx-auto"
            >
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-bold text-white">Your High Scores</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {highScores.reaction && (
                    <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                      <Zap className="w-5 h-5 mx-auto mb-1 text-cyan-400" />
                      <p className="text-xs text-slate-400">Reflexes</p>
                      <p className="text-lg font-bold text-white">{highScores.reaction}ms</p>
                    </div>
                  )}
                  {highScores.memory && (
                    <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                      <Sparkles className="w-5 h-5 mx-auto mb-1 text-purple-400" />
                      <p className="text-xs text-slate-400">Mind Maze</p>
                      <p className="text-lg font-bold text-white">{highScores.memory}</p>
                    </div>
                  )}
                  {highScores.snake && (
                    <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                      <Gamepad2 className="w-5 h-5 mx-auto mb-1 text-green-400" />
                      <p className="text-xs text-slate-400">Snake</p>
                      <p className="text-lg font-bold text-white">{highScores.snake}</p>
                    </div>
                  )}
                  {highScores.tap10 && (
                    <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                      <Star className="w-5 h-5 mx-auto mb-1 text-orange-400" />
                      <p className="text-xs text-slate-400">Tap (10s)</p>
                      <p className="text-lg font-bold text-white">{highScores.tap10}</p>
                    </div>
                  )}
                  {highScores.tap50 && (
                    <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                      <Star className="w-5 h-5 mx-auto mb-1 text-orange-400" />
                      <p className="text-xs text-slate-400">Tap (50s)</p>
                      <p className="text-lg font-bold text-white">{highScores.tap50}</p>
                    </div>
                  )}
                  {highScores.tap100 && (
                    <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                      <Star className="w-5 h-5 mx-auto mb-1 text-orange-400" />
                      <p className="text-xs text-slate-400">Tap (100s)</p>
                      <p className="text-lg font-bold text-white">{highScores.tap100}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
            )}
        </div>

        {/* Featured Games */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold text-center mb-12"
          >
            <span className="text-slate-400">Featured</span>{' '}
            <span className="text-white">Games</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              >
                <Link to={createPageUrl('Games') + `?game=${game.id}`}>
                  <motion.div
                    whileHover={{ scale: 1.03, y: -8 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative group cursor-pointer"
                  >
                    <div className={`absolute inset-0 ${game.bgGlow} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <div className="relative bg-slate-900/80 backdrop-blur-sm border border-slate-800 group-hover:border-slate-700 rounded-3xl p-8 transition-all duration-300">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <game.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
                      <p className="text-slate-400">{game.description}</p>
                      <div className="mt-6 flex items-center text-sm text-cyan-400 group-hover:text-cyan-300">
                        Play now <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}