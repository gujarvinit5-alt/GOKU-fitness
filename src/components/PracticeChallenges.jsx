import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Database, FileSpreadsheet, Trophy, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChallengeEditor from '@/components/ChallengeEditor';
import { challenges } from '@/data/challenges';

const PracticeChallenges = ({ progress, onChallengeComplete }) => {
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced'];
  const types = ['all', 'sql', 'excel'];

  const filteredChallenges = challenges.filter(c => {
    const diffMatch = filterDifficulty === 'all' || c.difficulty === filterDifficulty;
    const typeMatch = filterType === 'all' || c.type === filterType;
    return diffMatch && typeMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-2">
          {types.map(type => (
            <Button
              key={type}
              onClick={() => setFilterType(type)}
              variant={filterType === type ? 'default' : 'outline'}
              size="sm"
              className={`${
                filterType === type
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-none'
                  : 'bg-slate-800/50 border-purple-500/30 text-purple-200'
              }`}
            >
              {type === 'sql' && <Database className="w-4 h-4 mr-1" />}
              {type === 'excel' && <FileSpreadsheet className="w-4 h-4 mr-1" />}
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          {difficulties.map(diff => (
            <Button
              key={diff}
              onClick={() => setFilterDifficulty(diff)}
              variant={filterDifficulty === diff ? 'default' : 'outline'}
              size="sm"
              className={`${
                filterDifficulty === diff
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-none'
                  : 'bg-slate-800/50 border-purple-500/30 text-purple-200'
              }`}
            >
              {diff}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredChallenges.map((challenge, index) => {
          const Icon = challenge.type === 'sql' ? Database : FileSpreadsheet;
          const isCompleted = progress.completedChallenges.includes(challenge.id);

          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/30 overflow-hidden hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      challenge.type === 'sql'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{challenge.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          challenge.difficulty === 'Beginner'
                            ? 'bg-green-500/20 text-green-400'
                            : challenge.difficulty === 'Intermediate'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {challenge.difficulty}
                        </span>
                        <div className="flex items-center gap-1">
                          {[...Array(3)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < challenge.stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  {isCompleted && (
                    <Trophy className="w-6 h-6 text-yellow-400" />
                  )}
                </div>

                <p className="text-purple-200 text-sm mb-4">{challenge.scenario}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-purple-300">
                    Points: +{challenge.points}
                  </span>
                  <Button
                    onClick={() => setSelectedChallenge(challenge)}
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-none"
                  >
                    {isCompleted ? 'Try Again' : 'Start Challenge'}
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedChallenge && (
          <ChallengeEditor
            challenge={selectedChallenge}
            onClose={() => setSelectedChallenge(null)}
            onComplete={(score) => {
              onChallengeComplete(selectedChallenge.id, score);
              setSelectedChallenge(null);
            }}
            isCompleted={progress.completedChallenges.includes(selectedChallenge.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PracticeChallenges;