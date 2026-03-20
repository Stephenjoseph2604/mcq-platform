import React from "react";
import { AlertTriangle, Eye, ArrowLeft, Monitor, X } from "lucide-react";

/**
 * AntiCheatWarning
 *
 * Full-screen blurred overlay shown on each violation.
 * On the final warning (remainingWarnings === 0) it locks the overlay
 * and shows the auto-submit message.
 */
const AntiCheatWarning = ({
  violations,
  remainingWarnings,
  violationType,
  onDismiss,
  maxViolations = 3,
}) => {
  const isFinal = remainingWarnings === 0;

  const typeConfig = {
    tab: {
      icon: Eye,
      title: "Tab Switch Detected",
      description: "You switched to another tab or application.",
    },
    minimize: {
      icon: Monitor,
      title: "Window Minimized",
      description: "You minimized the quiz window.",
    },
    back: {
      icon: ArrowLeft,
      title: "Navigation Attempt Detected",
      description: "You attempted to leave the quiz using the back button.",
    },
  };

  const config = typeConfig[violationType] || typeConfig.tab;
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Blurred backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-[var(--color-card)]/90 backdrop-blur-2xl border border-[var(--color-muted)]/40 rounded-3xl p-8 shadow-2xl">
        {/* Decorative glows */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[var(--color-primary)]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center border-2 ${
              isFinal
                ? "bg-red-500/20 border-red-500/40"
                : "bg-yellow-500/20 border-yellow-500/40"
            }`}
          >
            <AlertTriangle
              className={`w-10 h-10 ${isFinal ? "text-red-400" : "text-yellow-400"}`}
            />
          </div>
        </div>

        {/* Violation badge */}
        <div className="flex justify-center mb-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${
              isFinal
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
            }`}
          >
            WARNING {violations} / {maxViolations}
          </span>
        </div>

        {/* Title */}
        <h2
          className={`text-2xl font-bold text-center mb-2 ${
            isFinal ? "text-red-400" : "text-[var(--color-text)]"
          }`}
        >
          {isFinal ? "Quiz Auto-Submitting..." : config.title}
        </h2>

        {/* Description */}
        <p className="text-[var(--color-text-muted)] text-center text-sm leading-relaxed mb-6">
          {isFinal ? (
            <>
              You have reached the maximum number of violations.
              <br />
              <span className="text-red-400 font-semibold">
                Your quiz is being submitted automatically.
              </span>
            </>
          ) : (
            <>
              {config.description}
              <br />
              <span className="text-yellow-400 font-semibold">
                {remainingWarnings} warning
                {remainingWarnings !== 1 ? "s" : ""} remaining before
                auto-submit.
              </span>
            </>
          )}
        </p>

        {/* Violation dots */}
        <div className="flex justify-center gap-3 mb-6">
          {Array.from({ length: maxViolations }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i < violations
                  ? isFinal
                    ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.7)]"
                    : "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.7)]"
                  : "bg-[var(--color-muted)]/30 border border-[var(--color-muted)]/50"
              }`}
            />
          ))}
        </div>

        {/* Action */}
        {!isFinal && (
          <button
            onClick={onDismiss}
            className="w-full h-12 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:opacity-90 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            I Understand, Continue Quiz
          </button>
        )}

        {isFinal && (
          <div className="w-full h-12 bg-red-500/20 border border-red-500/30 text-red-400 font-semibold rounded-xl flex items-center justify-center gap-2 text-sm">
            <span className="animate-pulse">● </span> Submitting your answers…
          </div>
        )}
      </div>
    </div>
  );
};

export default AntiCheatWarning;