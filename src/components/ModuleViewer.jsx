import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, ChevronRight, ChevronLeft, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const ModuleViewer = ({ module, onClose, onComplete, isCompleted }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const handleComplete = () => {
    onComplete();
    toast({
      title: "🎉 Module Completed!",
      description: `You've completed "${module.title}" and earned 10 points!`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 rounded-2xl border border-purple-500/30 max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
      >
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">{module.title}</h2>
              <p className="text-purple-100 text-sm">{module.type.toUpperCase()} Tutorial</p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="prose prose-invert max-w-none">
            {module.content[currentPage].type === 'text' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white mb-4">
                  {module.content[currentPage].title}
                </h3>
                <div className="text-purple-200 leading-relaxed whitespace-pre-line">
                  {module.content[currentPage].content}
                </div>
              </div>
            )}

            {module.content[currentPage].type === 'code' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white mb-4">
                  {module.content[currentPage].title}
                </h3>
                <p className="text-purple-200 mb-4">{module.content[currentPage].description}</p>
                <div className="bg-slate-800 rounded-lg p-4 border border-purple-500/30">
                  <pre className="text-green-400 text-sm overflow-x-auto">
                    <code>{module.content[currentPage].code}</code>
                  </pre>
                </div>
                {module.content[currentPage].explanation && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-4">
                    <p className="text-blue-200 text-sm">{module.content[currentPage].explanation}</p>
                  </div>
                )}
              </div>
            )}

            {module.content[currentPage].type === 'example' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white mb-4">
                  {module.content[currentPage].title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-800 rounded-lg p-4 border border-purple-500/30">
                    <h4 className="text-lg font-semibold text-purple-300 mb-2">Input</h4>
                    <pre className="text-green-400 text-sm">{module.content[currentPage].input}</pre>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-4 border border-green-500/30">
                    <h4 className="text-lg font-semibold text-green-300 mb-2">Output</h4>
                    <pre className="text-green-400 text-sm">{module.content[currentPage].output}</pre>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 mt-8">
            {module.content.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentPage
                    ? 'w-8 bg-gradient-to-r from-purple-600 to-pink-600'
                    : 'w-2 bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 p-6 border-t border-purple-500/30 flex items-center justify-between">
          <Button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            variant="outline"
            className="bg-slate-800 border-purple-500/30 text-purple-200 hover:bg-slate-700"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <span className="text-purple-200 text-sm">
            Page {currentPage + 1} of {module.content.length}
          </span>

          {currentPage < module.content.length - 1 ? (
            <Button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 border-none"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              className="bg-gradient-to-r from-green-600 to-emerald-600 border-none"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {isCompleted ? 'Reviewed' : 'Complete'}
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ModuleViewer;