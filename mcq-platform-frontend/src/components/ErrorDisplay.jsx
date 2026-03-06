import React from "react";
import { AlertCircle, AlertTriangle, XCircle, CheckCircle, RotateCw } from "lucide-react";

const ErrorDisplay = ({ 
  message = "Something went wrong", 
  title = "Oops!", 
  onClose,
  onRetry,
  className = "",
  type = "error"
}) => {
  const getIcon = () => {
    switch (type) {
      case "success": return <CheckCircle className="w-12 h-12 text-[var(--color-success)]" />;
      case "warning": return <AlertTriangle className="w-12 h-12 text-[var(--color-warning)]" />;
      case "info": return <AlertCircle className="w-12 h-12 text-[var(--color-primary)]" />;
      default: return <XCircle className="w-12 h-12 text-[var(--color-danger)]" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case "success": 
        return {
          bg: "bg-[var(--color-success)]/10",
          border: "border-[var(--color-success)]/30",
          text: "text-[var(--color-success)]"
        };
      case "warning": 
        return {
          bg: "bg-[var(--color-warning)]/10", 
          border: "border-[var(--color-warning)]/30",
          text: "text-[var(--color-warning)]"
        };
      case "info": 
        return {
          bg: "bg-[var(--color-primary)]/10",
          border: "border-[var(--color-primary)]/30", 
          text: "text-[var(--color-primary)]"
        };
      default: 
        return {
          bg: "bg-[var(--color-danger)]/10",
          border: "border-[var(--color-danger)]/30",
          text: "text-[var(--color-danger)]"
        };
    }
  };

  const colors = getColors();

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}>
      <div className={`max-w-md w-full mx-4 bg-[var(--color-card)]/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border ${colors.border}`}>
        {/* Header with close button */}
        <div className="flex items-center justify-between mb-6">
          <div className={`w-20 h-20 ${colors.bg} rounded-2xl flex items-center justify-center mx-auto border-2 ${colors.border} shadow-lg`}>
            {getIcon()}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 hover:bg-[var(--color-muted)]/30 rounded-xl transition-all text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              <XCircle className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4">
            {title}
          </h2>
          <p className="text-[var(--color-text-muted)] leading-relaxed px-4">
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex-1 bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-[var(--color-text)] font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              Retry <RotateCw className="w-4 h-4" />
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="flex-1 bg-[var(--color-muted)]/20 hover:bg-[var(--color-muted)]/30 text-[var(--color-text-muted)] font-medium py-3 px-6 rounded-xl border border-[var(--color-muted)]/30 transition-all duration-200"
            >
              Close
            </button>
          )}
        </div>

        {/* Subtle accent line */}
        <div className="flex justify-center mt-6">
          <div className={`w-24 h-1 ${colors.bg} rounded-full animate-pulse opacity-60 mx-auto`}></div>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
