import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Play, CheckCircle, XCircle, Lightbulb, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const ChallengeEditor = ({ challenge, onClose, onComplete, isCompleted }) => {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const handleRun = () => {
    const trimmedCode = code.trim().toLowerCase();
    const trimmedSolution = challenge.solution.trim().toLowerCase();
    
    const isCorrect = trimmedCode === trimmedSolution;
    
    setResult({
      correct: isCorrect,
      message: isCorrect 
        ? '🎉 Excellent! Your solution is correct!' 
        : '❌ Not quite right. Try again or check the hint!',
      output: isCorrect ? challenge.expectedOutput : 'Please review your code and try again.'
    });

    if (isCorrect) {
      setTimeout(() => {
        onComplete(challenge.points);
        toast({
          title: "🏆 Challenge Completed!",
          description: `You earned ${challenge.points} points!`,
        });
      }, 1500);
    }
  };

  const handleReset = () => {
    setCode('');
    setResult(null);
    setShowHint(false);
    setShowSolution(false);
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
        className="bg-slate-900 rounded-2xl border border-purple-500/30 max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
      >
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{challenge.title}</h2>
            <p className="text-purple-100 text-sm">{challenge.difficulty} • {challenge.points} points</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-4">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/30">
              <h3 className="text-lg font-semibold text-white mb-2">Scenario</h3>
              <p className="text-purple-200 text-sm leading-relaxed">{challenge.scenario}</p>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4 border border-blue-500/30">
              <h3 className="text-lg font-semibold text-white mb-2">Task</h3>
              <p className="text-blue-200 text-sm leading-relaxed">{challenge.task}</p>
            </div>

            {challenge.sampleData && (
              <div className="bg-slate-800/50 rounded-lg p-4 border border-green-500/30">
                <h3 className="text-lg font-semibold text-white mb-2">Sample Data</h3>
                <pre className="text-green-400 text-xs overflow-x-auto">{challenge.sampleData}</pre>
              </div>
            )}

            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/30"
              >
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-400 mb-1">Hint</h3>
                    <p className="text-yellow-200 text-sm">{challenge.hint}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {showSolution && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30"
              >
                <h3 className="text-lg font-semibold text-purple-400 mb-2">Solution</h3>
                <pre className="text-purple-200 text-sm overflow-x-auto bg-slate-800 p-3 rounded">
                  <code>{challenge.solution}</code>
                </pre>
                <p className="text-purple-200 text-sm mt-3">{challenge.explanation}</p>
              </motion.div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={() => setShowHint(!showHint)}
                variant="outline"
                size="sm"
                className="bg-slate-800 border-yellow-500/30 text-yellow-400 hover:bg-slate-700"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </Button>
              <Button
                onClick={() => setShowSolution(!showSolution)}
                variant="outline"
                size="sm"
                className="bg-slate-800 border-purple-500/30 text-purple-400 hover:bg-slate-700"
              >
                {showSolution ? 'Hide Solution' : 'Show Solution'}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-800/50 rounded-lg border border-purple-500/30 overflow-hidden">
              <div className="bg-slate-800 px-4 py-2 border-b border-purple-500/30 flex items-center justify-between">
                <span className="text-purple-300 text-sm font-semibold">Code Editor</span>
                <Button
                  onClick={handleReset}
                  variant="ghost"
                  size="sm"
                  className="text-purple-300 hover:bg-slate-700"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={`Write your ${challenge.type.toUpperCase()} ${challenge.type === 'sql' ? 'query' : 'formula'} here...`}
                className="w-full h-64 bg-slate-900 text-green-400 p-4 font-mono text-sm focus:outline-none resize-none"
                spellCheck="false"
              />
            </div>

            <Button
              onClick={handleRun}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-none"
            >
              <Play className="w-4 h-4 mr-2" />
              Run Code
            </Button>

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-lg p-4 border ${
                  result.correct
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  {result.correct ? (
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-2 ${
                      result.correct ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {result.message}
                    </h3>
                    <div className="bg-slate-800 rounded p-3">
                      <pre className="text-purple-200 text-sm whitespace-pre-wrap">
                        {result.output}
                      </pre>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChallengeEditor;