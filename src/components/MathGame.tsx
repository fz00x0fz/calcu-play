import React, { useState, useEffect } from 'react';
import { Star, Heart, Trophy } from 'lucide-react';

interface Problem {
  num1: number;
  num2: number;
  operator: '+' | '-';
  answer: number;
}

export default function MathGame() {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [userAnswer, setUserAnswer] = useState('');
  const [problem, setProblem] = useState<Problem | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const generateProblem = () => {
    const operators: ('+' | '-')[] = ['+', '-'];
    const operator = operators[Math.floor(Math.random() * 2)];
    let num1 = Math.floor(Math.random() * 10) + 1;
    let num2 = Math.floor(Math.random() * 10) + 1;
    
    // Ensure no negative results for subtraction
    if (operator === '-' && num2 > num1) {
      [num1, num2] = [num2, num1];
    }

    const answer = operator === '+' ? num1 + num2 : num1 - num2;
    setProblem({ num1, num2, operator, answer });
    setUserAnswer('');
    setFeedback('');
    setIsCorrect(null);
  };

  useEffect(() => {
    generateProblem();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem) return;

    const isAnswerCorrect = parseInt(userAnswer) === problem.answer;
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      setScore(score + 1);
      setFeedback('太棒了! 答对了! 🎉');
      setTimeout(generateProblem, 1500);
    } else {
      setLives(lives - 1);
      setFeedback('再试一次吧! 💪');
      if (lives <= 1) {
        setFeedback(`游戏结束! 你的得分是 ${score} 分`);
      }
    }
  };

  if (lives === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 p-8">
        <Trophy className="w-16 h-16 text-yellow-500" />
        <h2 className="text-3xl font-bold text-purple-600">游戏结束!</h2>
        <p className="text-2xl">你的最终得分: {score}</p>
        <button
          onClick={() => {
            setLives(3);
            setScore(0);
            generateProblem();
          }}
          className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
        >
          再玩一次
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Star className="w-6 h-6 text-yellow-400 mr-2" />
            <span className="text-xl font-bold">得分: {score}</span>
          </div>
          <div className="flex">
            {[...Array(lives)].map((_, i) => (
              <Heart key={i} className="w-6 h-6 text-red-500 ml-1" fill="currentColor" />
            ))}
          </div>
        </div>

        {problem && (
          <div className="text-center">
            <div className="text-4xl font-bold mb-8 text-gray-700">
              {problem.num1} {problem.operator} {problem.num2} = ?
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className={`w-32 text-center text-3xl p-3 border-4 rounded-xl outline-none ${
                  isCorrect === null
                    ? 'border-blue-300'
                    : isCorrect
                    ? 'border-green-500'
                    : 'border-red-500'
                }`}
                placeholder="?"
                autoFocus
              />

              <div className="h-8">
                {feedback && (
                  <p className={`text-xl ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                    {feedback}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-500 text-white rounded-full text-xl font-semibold hover:bg-purple-600 transition-colors"
              >
                确认答案
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}