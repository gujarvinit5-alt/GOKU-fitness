import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Target, TrendingUp, BookOpen, Code, Star, Zap } from 'lucide-react';

const ProgressDashboard = ({ progress }) => {
  const totalModules = 6;
  const totalChallenges = 10;
  const moduleProgress = (progress.completedModules.length / totalModules) * 100;
  const challengeProgress = (progress.completedChallenges.length / totalChallenges) * 100;

  const stats = [
    {
      label: 'Total Score',
      value: progress.totalScore,
      icon: Trophy,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/20',
      textColor: 'text-yellow-400'
    },
    {
      label: 'Modules Completed',
      value: `${progress.completedModules.length}/${totalModules}`,
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/20',
      textColor: 'text-blue-400'
    },
    {
      label: 'Challenges Solved',
      value: `${progress.completedChallenges.length}/${totalChallenges}`,
      icon: Code,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/20',
      textColor: 'text-green-400'
    },
    {
      label: 'Current Streak',
      value: progress.streak || 0,
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/20',
      textColor: 'text-purple-400'
    }
  ];

  const achievements = [
    {
      title: 'First Steps',
      description: 'Complete your first module',
      unlocked: progress.completedModules.length >= 1,
      icon: Star
    },
    {
      title: 'Challenge Accepted',
      description: 'Complete your first challenge',
      unlocked: progress.completedChallenges.length >= 1,
      icon: Target
    },
    {
      title: 'SQL Novice',
      description: 'Complete 3 SQL modules',
      unlocked: progress.completedModules.filter(m => m.includes('sql')).length >= 3,
      icon: Award
    },
    {
      title: 'Excel Expert',
      description: 'Complete 3 Excel modules',
      unlocked: progress.completedModules.filter(m => m.includes('excel')).length >= 3,
      icon: Award
    },
    {
      title: 'Problem Solver',
      description: 'Complete 5 challenges',
      unlocked: progress.completedChallenges.length >= 5,
      icon: TrendingUp
    },
    {
      title: 'Master Learner',
      description: 'Complete all modules',
      unlocked: progress.completedModules.length === totalModules,
      icon: Trophy
    }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/30 p-6 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-purple-200 text-sm">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/30 p-6"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-400" />
            Learning Progress
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-purple-200 text-sm">Modules</span>
                <span className="text-purple-200 text-sm">{Math.round(moduleProgress)}%</span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${moduleProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-purple-200 text-sm">Challenges</span>
                <span className="text-purple-200 text-sm">{Math.round(challengeProgress)}%</span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${challengeProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/30 p-6"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            Achievements
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border transition-all duration-300 ${
                    achievement.unlocked
                      ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30'
                      : 'bg-slate-800/30 border-slate-700/30 opacity-50'
                  }`}
                >
                  <Icon className={`w-8 h-8 mb-2 ${
                    achievement.unlocked ? 'text-yellow-400' : 'text-slate-600'
                  }`} />
                  <h3 className={`font-semibold text-sm mb-1 ${
                    achievement.unlocked ? 'text-white' : 'text-slate-500'
                  }`}>
                    {achievement.title}
                  </h3>
                  <p className={`text-xs ${
                    achievement.unlocked ? 'text-purple-200' : 'text-slate-600'
                  }`}>
                    {achievement.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-xl border border-purple-500/30 p-6"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Keep Learning!</h2>
        <p className="text-purple-200 mb-4">
          You're making great progress! Continue completing modules and challenges to unlock more achievements and boost your score.
        </p>
        <div className="flex gap-4">
          <div className="flex-1 bg-slate-800/50 rounded-lg p-4 border border-blue-500/30">
            <h3 className="text-blue-400 font-semibold mb-2">Next Goal</h3>
            <p className="text-purple-200 text-sm">
              {progress.completedModules.length < totalModules 
                ? `Complete ${totalModules - progress.completedModules.length} more modules`
                : `Solve ${totalChallenges - progress.completedChallenges.length} more challenges`}
            </p>
          </div>
          <div className="flex-1 bg-slate-800/50 rounded-lg p-4 border border-green-500/30">
            <h3 className="text-green-400 font-semibold mb-2">Total Progress</h3>
            <p className="text-purple-200 text-sm">
              {progress.completedModules.length + progress.completedChallenges.length} of {totalModules + totalChallenges} completed
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProgressDashboard;