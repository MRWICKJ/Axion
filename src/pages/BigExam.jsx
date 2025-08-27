import React, { useState, useEffect, useRef } from "react";

const BigQuestionExam = () => {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [questionCount, setQuestionCount] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [examCompleted, setExamCompleted] = useState(false);
  const [badge, setBadge] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [verifyingAnswer, setVerifyingAnswer] = useState(false);
  const [feedback, setFeedback] = useState("");
  const timerRef = useRef(null);

  // Configuration constants
  const timeForDifficulty = { easy: 300, medium: 240, hard: 180 };
  const questionLimits = { min: 1, max: 10 };
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
      gif: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmRpb2N4OXYxMndmNW13M2poaWFka2NmaXM5dnc4dHNheTZxNmJ4eSZlcD12MV9pbnRlcm5hbF9naF9naWZfYnlfaWQmY3Q9Zw/kUFlw7XaGE36w/giphy.gif"
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
      gif: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGIwbWlyNGgyNnplODNkbHNtdGRoMzA3b2wxbWljc2IycmlwN3I2YSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/iSyDSFVyEnsWD43q4n/giphy.gif"
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
          handleSubmitAnswer();
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

  const callGeminiAPI = async (prompt) => {
    const API_KEY = "AIzaSyDp8kMlV3WQDt7yPzhtdTEBUV7OcpO6umc";
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
    
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to fetch from Gemini API");
      }

      return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("Failed to get response from AI service");
    }
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
    setUserAnswer("");
    setExamCompleted(false);
    setBadge(null);
    setUserAnswers([]);
    setShowResults(false);
    setFeedback("");

    const prompt = `Generate ${questionCount} ${difficulty} open-ended questions about "${topic}". 
    The questions should require thoughtful answers and cannot be answered with just yes/no or single words.
    Format the response as a simple list with each question on a new line starting with "Q: ".
    
    Example:
    Q: What are the main causes of climate change?
    Q: How does photosynthesis work in plants?
    Q: Explain the theory of relativity in simple terms.`;

    try {
      const response = await callGeminiAPI(prompt);
      
      // Parse questions from the response
      const questionLines = response.split('\n')
        .filter(line => line.trim().startsWith('Q:') || line.trim().startsWith('Question:'))
        .map(line => line.replace(/^(Q:|Question:)\s*/i, '').trim())
        .filter(line => line.length > 0);
      
      if (questionLines.length === 0) {
        throw new Error("No questions were generated. Please try again with a different topic.");
      }
      
      const generatedQuestions = questionLines.slice(0, questionCount).map(question => ({ question }));
      
      setQuestions(generatedQuestions);
      setLoading(false);
      setTimeLeft(timeForDifficulty[difficulty]);
    } catch (err) {
      setLoading(false);
      setError(err.message || "Something went wrong while generating questions");
    }
  };

  const verifyAnswerWithAI = async (question, answer) => {
    const prompt = `Evaluate the following answer to the question. Provide a JSON response with:
    - score: a number between 0 and 10 representing the quality of the answer
    - isCorrect: boolean indicating if the answer is fundamentally correct
    - explanation: a brief explanation of the evaluation (2-3 sentences)
    
    Question: "${question}"
    Answer: "${answer}"
    
    Response format must be valid JSON:
    {
      "score": 8,
      "isCorrect": true,
      "explanation": "Your answer demonstrates good understanding but could use more specific examples."
    }`;

    try {
      const response = await callGeminiAPI(prompt);
      
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const evaluation = JSON.parse(jsonMatch[0]);
        return {
          score: evaluation.score || 0,
          isCorrect: evaluation.isCorrect || false,
          explanation: evaluation.explanation || "No explanation provided."
        };
      }
      
      // Fallback if JSON parsing fails
      return {
        score: 6,
        isCorrect: true,
        explanation: "AI evaluation completed. " + response.substring(0, 150) + "..."
      };
    } catch (error) {
      console.error("Evaluation error:", error);
      return {
        score: 5,
        isCorrect: false,
        explanation: "Unable to evaluate answer due to technical issues. Please try again."
      };
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      setError("Please provide an answer before submitting.");
      return;
    }
    
    setVerifyingAnswer(true);
    setError("");
    
    // Verify answer with AI
    const verification = await verifyAnswerWithAI(
      questions[currentQIndex].question, 
      userAnswer
    );
    
    // Save user's answer with verification results
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQIndex] = {
      answer: userAnswer,
      score: verification.score,
      isCorrect: verification.isCorrect,
      explanation: verification.explanation
    };
    setUserAnswers(newUserAnswers);

    // Update score if correct (using a threshold)
    if (verification.isCorrect) {
      setScore(prev => prev + 1);
      setFeedback("Correct! " + verification.explanation);
    } else {
      setFeedback("Your answer needs improvement. " + verification.explanation);
    }

    setVerifyingAnswer(false);

    // Move to next question or finish exam
    if (currentQIndex + 1 < questions.length) {
      setTimeout(() => {
        setCurrentQIndex(prev => prev + 1);
        setUserAnswer("");
        setFeedback("");
        setTimeLeft(timeForDifficulty[difficulty]);
      }, 3000);
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
    setFeedback("");
  };

  const retryExam = () => {
    setCurrentQIndex(0);
    setScore(0);
    setUserAnswer("");
    setExamCompleted(false);
    setUserAnswers([]);
    setTimeLeft(timeForDifficulty[difficulty]);
    setFeedback("");
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
    <div className="min-h-screen font-sans bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full filter blur-3xl opacity-20 animate-pulse-slow" style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* Main content */}
      <main className="relative z-10 flex-grow max-w-4xl mx-auto p-6 w-full min-h-screen flex flex-col justify-center">
        {!questions.length && !examCompleted && (
          <div className="backdrop-blur-lg bg-gray-800/70 p-8 rounded-2xl shadow-2xl border border-gray-700/50">
            <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Big Question Exam Generator
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block font-medium mb-2 text-gray-300">Topic</label>
                <input
                  type="text"
                  className="w-full rounded-xl bg-gray-700/50 border border-gray-600/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-gray-400 backdrop-blur-sm"
                  placeholder="E.g. Climate Change, Psychology, Computer Science"
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
                    Generating Questions with AI...
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
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-500/30 mr-3">
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </span>
                <h3 className="text-xl font-semibold text-gray-300">
                  Question {currentQIndex + 1} of {questions.length}
                </h3>
              </div>
              <div className={`px-4 py-2 rounded-full font-bold backdrop-blur-sm ${
                timeLeft <= 30 
                  ? 'bg-red-500/20 text-red-200 border border-red-500/30 animate-pulse' 
                  : 'bg-blue-500/20 text-blue-200 border border-blue-500/30'
              }`}>
                ⏱️ {formatTime(timeLeft)}
              </div>
            </div>

            <div className="mb-8">
              <div className="text-2xl font-medium mb-6 text-white bg-gray-700/30 p-6 rounded-2xl border border-gray-600/30 backdrop-blur-sm shadow-inner min-h-[120px] flex items-center">
                {questions[currentQIndex].question}
              </div>
              
              <div className="mb-6">
                <label className="block font-medium mb-3 text-gray-300 text-lg">Your Answer</label>
                <textarea
                  className="w-full h-48 rounded-xl bg-gray-700/50 border border-gray-600/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-gray-400 backdrop-blur-sm resize-none"
                  placeholder="Type your answer here..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                />
              </div>
            </div>

            {feedback && (
              <div className={`p-4 mb-6 rounded-xl border backdrop-blur-sm ${
                feedback.includes("Correct") 
                  ? 'border-green-500/30 bg-green-900/20 text-green-200' 
                  : 'border-yellow-500/30 bg-yellow-900/20 text-yellow-200'
              }`}>
                <p className="font-medium">{feedback}</p>
              </div>
            )}

            <button
              onClick={handleSubmitAnswer}
              disabled={!userAnswer.trim() || verifyingAnswer}
              className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] ${
                !userAnswer.trim() || verifyingAnswer
                  ? 'bg-gray-600/30 text-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white shadow-lg'
              }`}
            >
              {verifyingAnswer ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  AI is evaluating your answer...
                </div>
              ) : currentQIndex + 1 === questions.length ? 'Finish Exam' : 'Submit Answer'}
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-900/30 border border-red-700/50 rounded-xl text-red-200 backdrop-blur-sm">
                <p className="text-center font-semibold">{error}</p>
              </div>
            )}
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
                  const isCorrect = userAnswer?.isCorrect;
                  
                  return (
                    <div key={index} className={`p-5 rounded-2xl border backdrop-blur-sm ${
                      isCorrect 
                        ? 'border-green-500/30 bg-green-900/20' 
                        : 'border-red-500/30 bg-red-900/20'
                    }`}>
                      <p className="font-semibold mb-4 text-white">
                        <span className="text-gray-400">Question {index + 1}:</span> {q.question}
                      </p>
                      
                      <div className="mb-4">
                        <p className="font-medium text-gray-300 mb-2">Your Answer:</p>
                        <div className="p-3 rounded-lg bg-gray-700/30 border border-gray-600/30">
                          {userAnswer?.answer || "No answer provided"}
                        </div>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-blue-900/20 border border-blue-700/30">
                        <p className="text-blue-300 text-sm font-medium">AI Feedback:</p>
                        <p className="text-blue-200">{userAnswer?.explanation || "No feedback available"}</p>
                        <p className="text-blue-300 text-sm mt-2">Score: {userAnswer?.score || 0}/10</p>
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

export default BigQuestionExam;