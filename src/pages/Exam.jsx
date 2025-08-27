import React, { useState, useEffect, useRef } from "react";

const ExamPage = () => {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [questionCount, setQuestionCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [examCompleted, setExamCompleted] = useState(false);
  const [badge, setBadge] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const timerRef = useRef(null);

  // Configuration constants
  const timeForDifficulty = { easy: 60, medium: 45, hard: 30 };
  const questionLimits = { min: 3, max: 15 };
  const badges = {
    perfect: { 
      name: "Perfect Score", 
      color: "bg-gradient-to-r from-yellow-400 to-yellow-600", 
      text: "text-yellow-100",
      border: "border-yellow-500",
      gif: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExamR4ODhqZTY3Z2dlM3YzbW1ycG9rcmZhbm9sdHQxaW1udXlnbnFucCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/zb1IbMHM5Y1gy6bWRM/giphy.gif"
    },
    excellent: { 
      name: "Excellent", 
      color: "bg-gradient-to-r from-green-500 to-green-700", 
      text: "text-green-100",
      border: "border-green-500",
      gif: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmRpb2N4OXYxMndmNW13M2poaWFka2NmaXM5dnc4dHNheTZxNmJ4eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kUFlw7XaGE36w/giphy.gif"
    },
    good: { 
      name: "Good", 
      color: "bg-gradient-to-r from-blue-500 to-blue-700", 
      text: "text-blue-100",
      border: "border-blue-500",
      gif: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcW5pMWR1a3JjeXlncWw0bjVyNDhia21iNTRiNTl0MXpoNnFieXlnYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/tIeCLkB8geYtW/giphy.gif"
    },
    average: { 
      name: "Average", 
      color: "bg-gradient-to-r from-purple-500 to-purple-700", 
      text: "text-purple-100",
      border: "border-purple-500",
      gif: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGIwbWlyNGgyNnplODNkbHNtdGRoMzA3b2wxbWxjc2IycmlwN3I2YSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/iSyDSFVyEnsWD43q4n/giphy.gif"
    },
    poor: { 
      name: "Needs Improvement", 
      color: "bg-gradient-to-r from-red-500 to-red-700", 
      text: "text-red-100",
      border: "border-red-500",
      gif: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZjNrYXg5Mnd5ZmZsYnRnYjRkNXFlY3FyMDM2cGpocWpqOHBmdXd1NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/UeVNmXsALFcTdAwiZN/giphy.gif"
    }
  };

  useEffect(() => {
    if (!questions.length) return;

    setTimeLeft(timeForDifficulty[difficulty]);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleNextQuestion();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentQIndex, questions, difficulty]);

  const calculateBadge = (percentage) => {
    if (percentage === 100) return badges.perfect;
    if (percentage >= 80) return badges.excellent;
    if (percentage >= 60) return badges.good;
    if (percentage >= 40) return badges.average;
    return badges.poor;
  };

  const handleGenerateQuestions = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic.");
      return;
    }
    
    if (questionCount < questionLimits.min || questionCount > questionLimits.max) {
      setError(`Please select between ${questionLimits.min} and ${questionLimits.max} questions.`);
      return;
    }

    setError("");
    setLoading(true);
    setQuestions([]);
    setCurrentQIndex(0);
    setScore(0);
    setSelectedOption(null);
    setExamCompleted(false);
    setBadge(null);
    setUserAnswers([]);
    setShowResults(false);

    const prompt = `Generate ${questionCount} ${difficulty} multiple-choice questions about "${topic}". 
    Format each question as:
    Q: [question text]
    A: [option]
    B: [option]
    C: [option]
    D: [option]
    Answer: [correct letter]`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDp8kMlV3WQDt7yPzhtdTEBUV7OcpO6umc`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to fetch questions");
      }

      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 
                      data?.contents?.[0]?.parts?.[0]?.text || 
                      data?.parts?.[0]?.text;

      if (typeof rawText !== "string") {
        throw new Error("Unexpected response format");
      }

      // Parse MCQ questions
      const questionBlocks = rawText.split('Q:').slice(1);
      const parsedQuestions = questionBlocks.map(block => {
        const lines = block.split('\n').filter(line => line.trim());
        const questionText = lines[0].trim();
        
        const options = {};
        let correctAnswer = '';
        
        lines.slice(1).forEach(line => {
          if (line.startsWith('A:')) options.A = line.replace('A:', '').trim();
          else if (line.startsWith('B:')) options.B = line.replace('B:', '').trim();
          else if (line.startsWith('C:')) options.C = line.replace('C:', '').trim();
          else if (line.startsWith('D:')) options.D = line.replace('D:', '').trim();
          else if (line.startsWith('Answer:')) correctAnswer = line.replace('Answer:', '').trim();
        });

        return {
          question: questionText,
          options,
          correctAnswer
        };
      });

      if (parsedQuestions.length === 0) throw new Error("No questions found");

      setQuestions(parsedQuestions);
      setLoading(false);
      setTimeLeft(timeForDifficulty[difficulty]);
    } catch (err) {
      setLoading(false);
      setError(err.message || "Something went wrong");
    }
  };

  const handleNextQuestion = () => {
    // Save user's answer
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQIndex] = selectedOption;
    setUserAnswers(newUserAnswers);

    // Check if answer is correct
    if (selectedOption === questions[currentQIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }

    // Move to next question or finish exam
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setTimeLeft(timeForDifficulty[difficulty]);
    } else {
      finishExam();
    }
  };

  const finishExam = () => {
    clearInterval(timerRef.current);
    const percentage = Math.round((score / questions.length) * 100);
    setBadge(calculateBadge(percentage));
    setExamCompleted(true);
  };

  const restartExam = () => {
    setQuestions([]);
    setExamCompleted(false);
    setBadge(null);
    setUserAnswers([]);
    setShowResults(false);
  };

  const retryExam = () => {
    setCurrentQIndex(0);
    setScore(0);
    setSelectedOption(null);
    setExamCompleted(false);
    setUserAnswers([]);
    setTimeLeft(timeForDifficulty[difficulty]);
  };

  const toggleResults = () => {
    setShowResults(!showResults);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen font-sans bg-gray-900 text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full filter blur-3xl opacity-20 animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-60 h-60 bg-indigo-600 rounded-full filter blur-3xl opacity-20 animate-pulse-slow" style={{animationDelay: '4s'}}></div>
      </div>
      
      {/* Main content */}
      <main className="relative z-10 flex-grow max-w-3xl mx-auto p-6 w-full min-h-screen flex flex-col justify-center">
        {!questions.length && !examCompleted && (
          <div className="backdrop-blur-lg bg-gray-800/70 p-8 rounded-2xl shadow-2xl border border-gray-700/50">
            <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Generate your MCQ Exam
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block font-medium mb-2 text-gray-300">Topic</label>
                <input
                  type="text"
                  className="w-full rounded-xl bg-gray-700/50 border border-gray-600/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-gray-400 backdrop-blur-sm"
                  placeholder="E.g. Python, World History, Biology"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-medium mb-2 text-gray-300">Difficulty</label>
                  <select
                    className="w-full rounded-xl bg-gray-700/50 border border-gray-600/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white backdrop-blur-sm"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-2 text-gray-300">
                    Number of Questions ({questionLimits.min}-{questionLimits.max})
                  </label>
                  <input
                    type="number"
                    min={questionLimits.min}
                    max={questionLimits.max}
                    className="w-full rounded-xl bg-gray-700/50 border border-gray-600/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white backdrop-blur-sm"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Math.max(questionLimits.min, 
                      Math.min(questionLimits.max, parseInt(e.target.value) || questionLimits.min)))}
                  />
                </div>
              </div>

              <button
                onClick={handleGenerateQuestions}
                disabled={loading}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] ${
                  loading 
                    ? "bg-gray-600/50 text-gray-400 cursor-not-allowed" 
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Questions...
                  </div>
                ) : "Generate Exam"}
              </button>

              {error && (
                <div className="mt-4 p-3 bg-red-900/30 border border-red-700/50 rounded-xl text-red-200 backdrop-blur-sm">
                  <p className="text-center font-semibold">{error}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {questions.length > 0 && !examCompleted && (
          <div className="backdrop-blur-lg bg-gray-800/70 p-8 rounded-2xl shadow-2xl border border-gray-700/50">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-semibold text-gray-300">
                Question {currentQIndex + 1} of {questions.length}
              </h3>
              <div className={`px-4 py-2 rounded-full font-bold backdrop-blur-sm ${
                timeLeft <= 10 
                  ? 'bg-red-500/20 text-red-200 border border-red-500/30 animate-pulse' 
                  : 'bg-blue-500/20 text-blue-200 border border-blue-500/30'
              }`}>
                ⏱️ {formatTime(timeLeft)}
              </div>
            </div>

            <div className="mb-8">
              <p className="text-xl font-medium mb-6 text-white bg-gray-700/30 p-4 rounded-xl border border-gray-600/30 backdrop-blur-sm">
                {questions[currentQIndex].question}
              </p>
              
              <div className="space-y-4">
                {['A', 'B', 'C', 'D'].map(option => (
                  questions[currentQIndex].options[option] && (
                    <div 
                      key={option}
                      className={`p-4 border rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] backdrop-blur-sm ${
                        selectedOption === option 
                          ? 'border-blue-500/50 bg-blue-600/20 text-white shadow-md' 
                          : 'border-gray-600/30 bg-gray-700/30 hover:bg-gray-700/50 text-gray-200'
                      }`}
                      onClick={() => setSelectedOption(option)}
                    >
                      <span className="font-medium mr-3 bg-gray-600/50 px-2 py-1 rounded-md">{option}:</span>
                      {questions[currentQIndex].options[option]}
                    </div>
                  )
                ))}
              </div>
            </div>

            <button
              onClick={handleNextQuestion}
              disabled={!selectedOption}
              className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] ${
                !selectedOption 
                  ? 'bg-gray-600/30 text-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white shadow-lg'
              }`}
            >
              {currentQIndex + 1 === questions.length ? 'Finish Exam' : 'Next Question'}
            </button>
          </div>
        )}

        {examCompleted && (
          <div className="backdrop-blur-lg bg-gray-800/70 p-8 rounded-2xl shadow-2xl border border-gray-700/50">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Exam Completed!
              </h2>
              
              {badge && (
                <div className="flex flex-col items-center mb-8">
                  <div className={`inline-block ${badge.color} ${badge.text} px-6 py-3 rounded-full font-bold mb-6 border ${badge.border} shadow-lg`}>
                    {badge.name}
                  </div>
                  <div className="w-60 h-60 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl mb-6">
                    <img 
                      src={badge.gif} 
                      alt="Result GIF" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              <p className="text-xl mb-3 text-gray-300">
                Your score: <span className="font-bold text-white">{score}</span> out of <span className="font-bold text-white">{questions.length}</span>
              </p>
              <p className="text-lg mb-8 text-gray-400">
                ({Math.round((score / questions.length) * 100)}%)
              </p>
            </div>

            <button
              onClick={toggleResults}
              className="w-full mb-8 bg-gray-700/50 hover:bg-gray-700/70 text-gray-200 font-semibold py-3 px-6 rounded-xl border border-gray-600/30 transition-all duration-300 transform hover:scale-[1.02] backdrop-blur-sm"
            >
              {showResults ? 'Hide Detailed Results' : 'Show Detailed Results'}
            </button>

            {showResults && (
              <div className="mb-8 space-y-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {questions.map((q, index) => {
                  const userAnswer = userAnswers[index];
                  const isCorrect = userAnswer === q.correctAnswer;
                  
                  return (
                    <div key={index} className={`p-5 rounded-xl border backdrop-blur-sm ${
                      isCorrect 
                        ? 'border-green-500/30 bg-green-900/20' 
                        : 'border-red-500/30 bg-red-900/20'
                    }`}>
                      <p className="font-semibold mb-4 text-white">
                        <span className="text-gray-400">Question {index + 1}:</span> {q.question}
                      </p>
                      
                      <div className="space-y-3">
                        {['A', 'B', 'C', 'D'].map(option => (
                          q.options[option] && (
                            <div 
                              key={option}
                              className={`p-3 rounded-lg border ${
                                option === q.correctAnswer 
                                  ? 'bg-green-900/30 border-green-600/30'
                                  : option === userAnswer && !isCorrect
                                    ? 'bg-red-900/30 border-red-600/30'
                                    : 'bg-gray-700/30 border-gray-600/30'
                              }`}
                            >
                              <span className="font-medium mr-2 bg-gray-600/50 px-2 py-1 rounded-md">{option}:</span>
                              {q.options[option]}
                              {option === q.correctAnswer && (
                                <span className="ml-3 text-green-400 font-semibold text-sm">✓ Correct Answer</span>
                              )}
                              {option === userAnswer && !isCorrect && (
                                <span className="ml-3 text-red-400 font-semibold text-sm">✗ Your Answer</span>
                              )}
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <button
                onClick={restartExam}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
              >
                Create New Exam
              </button>
              <button
                onClick={retryExam}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
              >
                Retry This Exam
              </button>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(75, 85, 99, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.7);
        }
      `}</style>
    </div>
  );
};

export default ExamPage;