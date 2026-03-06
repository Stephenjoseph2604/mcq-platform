import React, { useState, useEffect } from 'react';
import { Star, Play, Bookmark, Clock, Tag, BookOpen, AlertCircle } from 'lucide-react';
import DotGrid from '../../components/DotGrid'; 
import FloatingParticles from '../../components/FloatingParticles';

const dummyProblems = [
  {
    id: 1,
    title: "Two Sum",
    level: "Easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    time: "15 mins",
    tags: [{ name: "Array" }, { name: "Hash Table" }],
    solved: false
  },
  {
    id: 2,
    title: "Longest Substring Without Repeating Characters",
    level: "Medium",
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    time: "30 mins",
    tags: [{ name: "Hash Table" }, { name: "String" }, { name: "Sliding Window" }],
    solved: true
  },
  {
    id: 3,
    title: "Container With Most Water",
    level: "Medium",
    description: "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).",
    time: "25 mins",
    tags: [{ name: "Array" }, { name: "Two Pointers" }],
    solved: false
  },
  {
    id: 4,
    title: "3Sum",
    level: "Medium",
    description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
    time: "35 mins",
    tags: [{ name: "Array" }, { name: "Two Pointers" }],
    solved: false
  },
  {
    id: 5,
    title: "Trapping Rain Water",
    level: "Hard",
    description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    time: "45 mins",
    tags: [{ name: "Array" }, { name: "Two Pointers" }, { name: "Dynamic Programming" }, { name: "Stack" }],
    solved: false
  },
  {
    id: 6,
    title: "Median of Two Sorted Arrays",
    level: "Hard",
    description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
    time: "50 mins",
    tags: [{ name: "Array" }, { name: "Binary Search" }, { name: "Divide and Conquer" }],
    solved: false
  }
];

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedProblems, setSavedProblems] = useState(new Set());

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProblems(dummyProblems);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSolveProblem = (problemId) => {
    console.log(`Solve problem ${problemId}`);
    // Your solve function here
  };

  const handleSaveProblem = (problemId) => {
    setSavedProblems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(problemId)) {
        newSet.delete(problemId);
      } else {
        newSet.add(problemId);
      }
      return newSet;
    });
    console.log(`Toggle save for problem ${problemId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <DotGrid />
        <FloatingParticles />
        <div className="max-w-7xl mx-auto relative z-10 flex justify-center items-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--color-primary)] mx-auto mb-8" />
            <p className="text-xl text-[var(--color-text-muted)]">Loading problems...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <DotGrid />
      <FloatingParticles />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[var(--color-text)] via-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent mb-4">
            Program Problems
          </h1>
          <p className="text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed">
            Solve coding challenges to improve your problem-solving skills and track your progress
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-[var(--color-card)]/80 border border-[var(--color-primary)]/30 backdrop-blur-sm rounded-2xl p-6 flex items-center gap-4">
              <AlertCircle className="h-6 w-6 text-[var(--color-primary)] flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-[var(--color-text)] mb-1">Error</h3>
                <p className="text-[var(--color-text-muted)]">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* No Problems */}
        {problems.length === 0 && !loading && !error && (
          <div className="text-center py-24">
            <BookOpen className="h-24 w-24 text-[var(--color-muted)] mx-auto mb-8 opacity-50" />
            <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4">
              No problems available
            </h2>
            <p className="text-xl text-[var(--color-text-muted)] max-w-md mx-auto">
              Check back later for new problems
            </p>
          </div>
        )}

        {/* Problems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {problems.map((problem) => (
            <div
              key={problem.id}
              className="group bg-[var(--color-card)]/50 relative border border-[var(--color-muted)]/50 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden hover:border-[var(--color-primary)]/30"
            >
              {/* Decorative Blob */}
              <div className="h-15 w-15 blur-lg rounded-full bg-[var(--color-primary)]/30 absolute -top-5 -right-5" />

              {/* Save Button - Top Right */}
              <button
                onClick={() => handleSaveProblem(problem.id)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-[var(--color-primary)]/20 hover:bg-[var(--color-primary)]/40 border border-[var(--color-primary)]/30 transition-all duration-200 opacity-0 group-hover:opacity-100 group-hover:scale-105"
              >
                <Bookmark 
                  className={`h-5 w-5 transition-colors duration-200 ${savedProblems.has(problem.id) ? 'fill-[var(--color-primary)] text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'}`} 
                />
              </button>

              {/* Problem Card Content */}
              <div className="space-y-6">
                {/* Title & Level */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="text-2xl font-bold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors duration-300 leading-tight flex-1 pr-4">
                      {problem.title}
                    </h3>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                      problem.level === 'Easy' ? 'bg-[var(--color-success)]/20 text-[var(--color-success)] border border-[var(--color-success)]/30' :
                      problem.level === 'Medium' ? 'bg-warning/20 text-warning border border-warning/30' :
                      'bg-[var(--color-danger)]/20 text-[var(--color-danger)] border border-[var(--color-danger)]/30'
                    }`}>
                      {problem.level}
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-6 text-sm text-[var(--color-text-muted)] mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{problem.time}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {problem.tags.slice(0, 4).map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 text-[var(--color-primary)] text-xs font-medium rounded-lg hover:bg-[var(--color-primary)]/25 transition-colors duration-200 flex items-center gap-1"
                    >
                      <Tag className="h-3 w-3 inline -ml-1 mr-1 align-middle flex-shrink-0" />
                      {tag.name}
                    </span>
                  ))}
                </div>

                {/* Solve Button */}
                <button
                  onClick={() => handleSolveProblem(problem.id)}
                  className="w-full h-14 bg-gradient-to-r from-[var(--color-primary)]/80 to-[var(--color-bg)]/20 text-[var(--color-text)] rounded-4xl font-semibold text-lg shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 active:scale-90 transition-all duration-200 border border-[var(--color-primary)]/30"
                >
                  <span className="flex items-center gap-3">
                    Solve Problem
                    <Play className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  </span>
                </button>
              </div>

              {/* Subtle card glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Problems;
