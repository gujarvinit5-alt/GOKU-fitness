import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, FileSpreadsheet, CheckCircle, PlayCircle, Lock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ModuleViewer from '@/components/ModuleViewer';
import { modules } from '@/data/modules';

const LearningModules = ({ progress, onModuleComplete }) => {
  const [selectedModule, setSelectedModule] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'sql', label: 'SQL', icon: Database },
    { id: 'excel', label: 'Excel', icon: FileSpreadsheet }
  ];

  const filteredModules = activeCategory === 'all' 
    ? modules 
    : modules.filter(m => m.type === activeCategory);

  const isModuleUnlocked = (moduleId) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module.prerequisite) return true;
    return progress.completedModules.includes(module.prerequisite);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => {
          const Icon = cat.icon;
          return (
            <Button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              variant={activeCategory === cat.id ? 'default' : 'outline'}
              className={`${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-none'
                  : 'bg-slate-800/50 border-purple-500/30 text-purple-200 hover:bg-slate-700'
              }`}
            >
              {Icon && <Icon className="w-4 h-4 mr-2" />}
              {cat.label}
            </Button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module, index) => {
          const Icon = module.type === 'sql' ? Database : FileSpreadsheet;
          const isCompleted = progress.completedModules.includes(module.id);
          const isUnlocked = isModuleUnlocked(module.id);

          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-slate-800/50 backdrop-blur-sm rounded-xl border ${
                isUnlocked ? 'border-purple-500/30' : 'border-slate-700/50'
              } overflow-hidden group hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 ${
                !isUnlocked && 'opacity-60'
              }`}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-pink-600"></div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    module.type === 'sql' 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'bg-green-500/20 text-green-400'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {isCompleted && (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  )}
                  {!isUnlocked && (
                    <Lock className="w-6 h-6 text-slate-500" />
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{module.title}</h3>
                <p className="text-purple-200 text-sm mb-4 line-clamp-2">{module.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full">
                    {module.difficulty}
                  </span>
                  <Button
                    onClick={() => isUnlocked && setSelectedModule(module)}
                    disabled={!isUnlocked}
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-none"
                  >
                    {isCompleted ? 'Review' : 'Start'}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedModule && (
          <ModuleViewer
            module={selectedModule}
            onClose={() => setSelectedModule(null)}
            onComplete={() => {
              onModuleComplete(selectedModule.id);
              setSelectedModule(null);
            }}
            isCompleted={progress.completedModules.includes(selectedModule.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LearningModules;