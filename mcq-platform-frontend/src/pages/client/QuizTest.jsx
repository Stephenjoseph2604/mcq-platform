// components/QuizTest.jsx - Complete quiz with question panel + same theme
import React, { useState, useEffect, useCallback } from "react";
import {
  Clock,
  BookOpen,
  Tag,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Flag,
  Send,
  X,
  Book,
  Play,
} from "lucide-react";

const quizData = {
  attemptId: 3,
  questions: [
    {
      id: 1,
      question_text: "What is JVM?",
      option_a: "Java Virtual Machine",
      option_b: "Java Variable Model",
      option_c: "Joint Virtual Method",
      option_d: "None of the above",
    },
    {
      id: 3,
      question_text: "Choose the correct sentence.",
      option_a: "She don't like coffee.",
      option_b: "She doesn't like coffee.",
      option_c: "She didn't likes coffee.",
      option_d: "She not like coffee.",
    },
    {
      id: 5,
      question_text: "Choose the correct article: ___ honest man.",
      option_a: "A",
      option_b: "An",
      option_c: "The",
      option_d: "No article",
    },
    {
      id: 7,
      question_text: "Choose the correct sentence in indirect speech.",
      option_a: "He said that he is busy.",
      option_b: "He said that he was busy.",
      option_c: "He says that he was busy.",
      option_d: "He said that I am busy.",
    },
    {
      id: 10,
      question_text: "Find the correct spelling.",
      option_a: "Definately",
      option_b: "Definitly",
      option_c: "Definitely",
      option_d: "Definetely",
    },
    {
      id: 11,
      question_text:
        "Choose the correct conjunction: I was tired ___ I continued working.",
      option_a: "because",
      option_b: "but",
      option_c: "so",
      option_d: "and",
    },
    {
      id: 15,
      question_text: "Which language is used for Android app development?",
      option_a: "Python",
      option_b: "Swift",
      option_c: "Java",
      option_d: "Ruby",
    },
    {
      id: 18,
      question_text: "Which keyword is used to inherit a class in Java?",
      option_a: "this",
      option_b: "extends",
      option_c: "implements",
      option_d: "super",
    },
    {
      id: 20,
      question_text: "What does HTML stand for?",
      option_a: "High Text Machine Language",
      option_b: "Hyper Text Markup Language",
      option_c: "Hyper Transfer Markup Language",
      option_d: "Home Tool Markup Language",
    },
    {
      id: 21,
      question_text: "Which protocol is used to send emails?",
      option_a: "FTP",
      option_b: "HTTP",
      option_c: "SMTP",
      option_d: "SNMP",
    },
    {
      id: 23,
      question_text: "What is 20% of 250?",
      option_a: "40",
      option_b: "45",
      option_c: "50",
      option_d: "60",
    },
    {
      id: 26,
      question_text:
        "If the cost price is 200 and selling price is 240, find the profit percentage.",
      option_a: "10%",
      option_b: "15%",
      option_c: "20%",
      option_d: "25%",
    },
    {
      id: 28,
      question_text:
        "A can do a job in 10 days. B can do it in 20 days. How long together?",
      option_a: "6.67 days",
      option_b: "7 days",
      option_c: "8 days",
      option_d: "10 days",
    },
    {
      id: 29,
      question_text: "What is the square root of 144?",
      option_a: "10",
      option_b: "11",
      option_c: "12",
      option_d: "13",
    },
    {
      id: 30,
      question_text: "Simple interest on 1000 at 10% for 2 years is:",
      option_a: "100",
      option_b: "150",
      option_c: "200",
      option_d: "250",
    },
    {
      id: 33,
      question_text: "Find the next number in the series: 2, 4, 8, 16, ?",
      option_a: "18",
      option_b: "24",
      option_c: "32",
      option_d: "64",
    },
    {
      id: 35,
      question_text: "If all cats are animals and some animals are wild, then:",
      option_a: "All cats are wild",
      option_b: "Some cats may be wild",
      option_c: "No cats are wild",
      option_d: "All animals are cats",
    },
    {
      id: 38,
      question_text: "Which number is missing: 3, 6, 9, ?, 15",
      option_a: "10",
      option_b: "11",
      option_c: "12",
      option_d: "13",
    },
    {
      id: 40,
      question_text: "If yesterday was Monday, what day is tomorrow?",
      option_a: "Tuesday",
      option_b: "Wednesday",
      option_c: "Thursday",
      option_d: "Friday",
    },
    {
      id: 42,
      question_text: "Which is the mirror image of 'b'?",
      option_a: "d",
      option_b: "p",
      option_c: "q",
      option_d: "b",
    },
  ],
};

const QuizTest = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questionStatus, setQuestionStatus] = useState({});
  const [showSubmit, setShowSubmit] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const questions = quizData.questions;
  const totalQuestions = questions.length;

  // Update question status when answer changes
  useEffect(() => {
    const status = {};
    questions.forEach((q) => {
      const qid = q.id;
      if (answers[qid]) {
        status[qid] = "answered";
      } else if (questionStatus[qid] === "review") {
        status[qid] = "review";
      }
    });
    setQuestionStatus(status);
  }, [answers, questionStatus, questions]);

  const handleOptionSelect = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const markReviewLater = () => {
    setQuestionStatus((prev) => ({
      ...prev,
      [questions[currentQuestionIndex].id]: "review",
    }));
    goNext();
  };

  const goNext = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setShowSubmit(true);
    }
  }, [currentQuestionIndex, totalQuestions]);

  const goReviewQuestion = useCallback(
    (questionId) => {
      const index = questions.findIndex((q) => q.id === questionId);
      setCurrentQuestionIndex(index);
      setShowSubmit(false);
    },
    [questions],
  );

  const handleSubmit = () => {
    const submitData = {
      attempt_id: quizData.attemptId,
      answers: Object.entries(answers).map(([questionId, selectedOption]) => ({
        questionId: parseInt(questionId),
        selectedOption,
      })),
    };
    console.log("SUBMIT JSON:", JSON.stringify(submitData, null, 2));
    setIsSubmitted(true);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const selectedOption = answers[currentQuestion?.id];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[var(--color-surface)] pt-20 flex items-center justify-center px-4">
        <div className="text-center bg-[var(--color-card)] border border-[var(--color-muted)]/50 rounded-2xl p-12 shadow-2xl max-w-md w-full max-h-[80vh] overflow-auto">
          <div className="w-24 h-24 bg-green-500/20 border-4 border-green-500/30 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-text)] mb-4">
            Quiz Submitted!
          </h1>
          <p className="text-[var(--color-text-muted)] mb-8">
            Check your console for submitted answers.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface)] pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Dot Grid Background */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-muted) 1px, transparent 0),
                           radial-gradient(circle at 25px 25px, var(--color-muted) 1px, transparent 0)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8 h-screen lg:h-[80vh] items-stretch">
        {/* Left: Question Area - RELATIVE HEIGHTS, PERFECT FIT */}
        <div className="flex-1 lg:max-w-5xl">
          <div className="bg-[var(--color-card)] border border-[var(--color-muted)]/50 rounded-2xl p-4 lg:p-6 shadow-xl h-full flex flex-col">
            {/* Header - 12% */}
            <div className="flex-shrink-0 pb-4 lg:pb-6 h-[12%] min-h-[64px] lg:min-h-[80px] max-h-[80px]">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between h-full gap-3 lg:gap-0">
                <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
                  <div className="w-9 h-9 lg:w-10 lg:h-10 bg-[var(--color-primary)]/20 border-2 border-[var(--color-primary)]/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Book className="h-4 w-4 lg:h-5 lg:w-5 text-[var(--color-primary)]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg lg:text-xl xl:text-2xl font-bold text-[var(--color-text)] leading-tight truncate">
                      {currentQuestionIndex + 1}
                    </p>
                    <p className="text-xs lg:text-sm text-[var(--color-text-muted)]">
                      of {totalQuestions}
                    </p>
                  </div>
                </div>
                <div className="text-xs lg:text-sm text-[var(--color-text-muted)] text-right flex-shrink-0 whitespace-nowrap">
                  <Clock className="h-3.5 w-3.5 lg:h-4 lg:w-4 inline mr-1" />
                  <span className="font-mono">14:30</span>
                </div>
              </div>
            </div>

            {/* Question Text - 18% with scroll */}
            <div className="flex-shrink-0 h-[18%] min-h-[72px] lg:min-h-[88px] max-h-[100px] lg:max-h-[120px] mb-3 lg:mb-5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300/50 scrollbar-track-transparent pr-1">
              <h2 className="text-base lg:text-lg xl:text-xl font-bold text-[var(--color-text)] leading-relaxed px-1 -mt-1">
                {currentQuestion.question_text}
              </h2>
            </div>

            {/* Options - 60% FIXED 4 options */}
            <div className="flex-1 h-[60%] min-h-[200px] lg:min-h-[280px] mb-3 lg:mb-6 space-y-1.5 lg:space-y-2.5 flex flex-col max-h-[60%] overflow-hidden">
              {[
                { key: "a", label: "A", value: currentQuestion.option_a },
                { key: "b", label: "B", value: currentQuestion.option_b },
                { key: "c", label: "C", value: currentQuestion.option_c },
                { key: "d", label: "D", value: currentQuestion.option_d },
              ].map(({ key, label, value }, index) => (
                <label
                  key={key}
                  className="flex items-start p-2.5 lg:p-3.5 border border-[var(--color-muted)]/30 rounded-lg lg:rounded-xl hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-primary)]/5 cursor-pointer transition-all duration-200 group flex-1 h-[25%] min-h-[44px] lg:min-h-[60px] max-h-[25%]"
                >
                  <input
                    type="radio"
                    name={`question_${currentQuestion.id}`}
                    value={label}
                    checked={selectedOption === label}
                    onChange={() =>
                      handleOptionSelect(currentQuestion.id, label)
                    }
                    className="w-4 h-4 lg:w-5 lg:h-5 mt-0.5 lg:mt-1 text-[var(--color-primary)] bg-white border-2 border-[var(--color-muted)]/50 focus:ring-[var(--color-primary)] focus:ring-2 rounded-full group-hover:border-[var(--color-primary)]/70 transition-all duration-200 mr-2.5 lg:mr-3 flex-shrink-0"
                  />
                  <span className="text-sm lg:text-base font-medium text-[var(--color-text)] group-hover:text-[var(--color-primary)] leading-relaxed flex-1 min-w-0 truncate pt-0.5">
                    {label}. {value}
                  </span>
                </label>
              ))}
            </div>

            {/* Buttons - 10% */}
            <div className="flex-shrink-0 h-[10%] min-h-[56px] lg:min-h-[64px] pt-2 lg:pt-4 border-t border-[var(--color-muted)]/30">
              <div className="flex gap-2 lg:gap-3 h-full px-1 -mx-0.5">
                <button
                  onClick={markReviewLater}
                  className="flex-1 h-11 lg:h-12 px-3 lg:px-4 py-1.5 bg-[var(--color-secondary)]/10 hover:bg-[var(--color-secondary)]/20 text-[var(--color-secondary)] border border-[var(--color-secondary)]/20 font-medium rounded-lg lg:rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 text-xs lg:text-sm hover:scale-[1.02] flex-shrink-0"
                >
                  <Flag className="h-3.5 w-3.5 lg:h-4 lg:w-4 flex-shrink-0" />
                  Mark & Next
                </button>
                <button
                  onClick={showSubmit ? handleSubmit : goNext}
                  disabled={
                    !selectedOption &&
                    questionStatus[currentQuestion?.id] !== "review"
                  }
                  className="flex-1 h-11 lg:h-12 px-3 lg:px-4 py-1.5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-semibold rounded-lg lg:rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 flex items-center justify-center gap-1.5 text-xs lg:text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex-shrink-0"
                >
                  {showSubmit ? (
                    <>
                      <Send className="h-3.5 w-3.5 lg:h-4 lg:w-4 flex-shrink-0" />
                      Submit
                    </>
                  ) : (
                    <>
                      <ChevronRight className="h-3.5 w-3.5 lg:h-4 lg:w-4 flex-shrink-0" />
                      Next
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Compact Question Status Panel - 4 Column Grid */}
        <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 h-fit lg:h-full">
          <div className="bg-[var(--color-card)] border border-[var(--color-muted)]/50 rounded-2xl p-4 lg:p-6 shadow-xl max-h-[70vh] lg:h-full flex flex-col gap-3 lg:gap-4 sticky top-4 lg:top-8">
            <div className="text-center mb-4 lg:mb-6">
              <h3 className="text-base lg:text-lg font-bold text-[var(--color-text)] mb-1">
                Questions
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                {totalQuestions} total
              </p>
            </div>

            {/* 4 Column Compact Question Grid */}
            <div className="grid grid-cols-4 gap-1 lg:gap-2 flex-1 min-h-0 overflow-y-auto pr-1 -mr-1 max-h-64 lg:max-h-none">
              {questions.map((q) => {
                const status = questionStatus[q.id];
                const isCurrent = q.id === currentQuestion.id;

                return (
                  <button
                    key={q.id}
                    onClick={() => goReviewQuestion(q.id)}
                    className={`aspect-square text-[10px] lg:text-xs font-bold flex items-center justify-center rounded-lg transition-all duration-200 p-1 lg:p-2 hover:scale-105 active:scale-95 ${
                      isCurrent
                        ? "bg-[var(--color-primary)] text-white shadow-md ring-2 ring-[var(--color-primary)]/40 border border-[var(--color-primary)]"
                        : status === "answered"
                          ? "bg-green-400/20 text-green-700 border border-green-400/40 hover:bg-green-400/30"
                          : status === "review"
                            ? "bg-yellow-400/20 text-yellow-700 border-2 border-yellow-400/50 hover:bg-yellow-400/40 animate-pulse"
                            : "bg-gray-100/50 text-gray-600 border border-gray-200/50 hover:bg-gray-200/50"
                    }`}
                    title={`Question ${q.id}`}
                  >
                    {q.id}
                  </button>
                );
              })}
            </div>

            {/* Compact Dynamic Summary */}
            <div className="text-xs space-y-1.5 pt-3 lg:pt-4 border-t border-[var(--color-muted)]/30 mt-auto px-1">
              <div className="flex justify-between items-center py-1">
                <span className="text-[var(--color-text-muted)] truncate">
                  Answered:
                </span>
                <span className="font-semibold text-green-600 px-1.5 py-0.5 bg-green-400/10 rounded-md text-[11px] lg:text-sm min-w-[24px] text-center">
                  {Object.keys(answers).length}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[var(--color-text-muted)] truncate">
                  Review:
                </span>
                <span className="font-semibold text-yellow-600 px-1.5 py-0.5 bg-yellow-400/10 rounded-md text-[11px] lg:text-sm min-w-[24px] text-center">
                  {
                    Object.values(questionStatus).filter((s) => s === "review")
                      .length
                  }
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[var(--color-text-muted)] truncate">
                  Remaining:
                </span>
                <span className="font-semibold text-[var(--color-text)] px-1.5 py-0.5 bg-gray-100/50 rounded-md text-[11px] lg:text-sm min-w-[24px] text-center">
                  {totalQuestions -
                    Object.keys(answers).length -
                    Object.values(questionStatus).filter((s) => s === "review")
                      .length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTest;
