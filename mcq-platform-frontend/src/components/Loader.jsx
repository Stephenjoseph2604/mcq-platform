import React from "react";
import { Loader2, Sparkles } from "lucide-react";

const Loader = ({ message = "Loading...", size = "lg", className = "" }) => {
  return (
    <div className="fixed inset-0 z-1 flex items-center justify-center bg-[var(--color-bg)] p-8">
      <div className=" flex flex-col items-center justify-center space-y-6 p-8 text-center bg-[var(--color-bg)]">
        {/* Animated Loader Container */}
        <div className="relative">
          {/* Main Spinner + Effects */}
          <div className="relative">
            <Loader2
              className={`h-12 w-12 ${size === "lg" ? "h-16 w-16" : "h-10 w-10"} animate-spin text-[var(--color-primary)] mx-auto`}
            />
            {/* Orbit Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-[var(--color-secondary)]/30 animate-ping opacity-75" />
            {/* Pulse Glow */}
            <div className="absolute inset-0 bg-[var(--color-primary)]/20 rounded-full blur-xl animate-pulse opacity-60" />
          </div>

          {/* Sparkle Effects */}
          <div className="absolute -top-2 -right-2">
            <Sparkles className="h-4 w-4 text-[var(--color-secondary)] animate-pulse" />
          </div>
          <div className="absolute -bottom-2 -left-2">
            <Sparkles className="h-3 w-3 text-[var(--color-primary)] animate-ping" />
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <p
            className={`text-2xl ${size === "lg" ? "text-3xl md:text-4xl" : "text-xl"} font-bold bg-gradient-to-r from-[var(--color-text)] via-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent`}
          >
            {message}
          </p>
          <p className="text-sm text-[var(--color-text-muted)] opacity-75">
            Please wait while we prepare your content
          </p>
        </div>

        {/* Dots Animation */}
        <div className="flex space-x-1">
          <div
            className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-bounce"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="w-2 h-2 bg-[var(--color-secondary)] rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          />
          <div
            className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Loader;
