import { useEffect, useRef, useState, useCallback } from "react";

/**
 * useAntiCheat
 *
 * Detects:
 *  - Tab switching / window blur (visibilitychange + window blur)
 *  - Window minimize (visibilitychange hidden)
 *  - Browser back button (popstate)
 *
 * On each violation: shows a warning overlay.
 * On 3rd violation: calls onForceSubmit() automatically.
 *
 * @param {Object}   options
 * @param {Function} options.onForceSubmit  - called when violations reach maxViolations
 * @param {number}   [options.maxViolations=3] - how many strikes before auto-submit
 * @param {boolean}  [options.enabled=true]    - disable during loading/submitted states
 */


const useAntiCheat = ({ onForceSubmit, maxViolations = 3, enabled = true }) => {
  const [violations, setViolations] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [violationType, setViolationType] = useState("");
  const violationsRef = useRef(0);
  const enabledRef = useRef(enabled);
  const lastViolationTime = useRef(0); // ← guard against double-firing

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  const triggerViolation = useCallback(
    (type) => {
      if (!enabledRef.current) return;

      // If another violation fired within the last 500ms, ignore it
      // This prevents visibilitychange + blur both counting for one tab switch
      const now = Date.now();
      if (now - lastViolationTime.current < 500) return;
      lastViolationTime.current = now;

      violationsRef.current += 1;
      const count = violationsRef.current;

      setViolations(count);
      setViolationType(type);
      setShowWarning(true);

      if (count >= maxViolations) {
        setTimeout(() => {
          onForceSubmit();
        }, 1500);
      }
    },
    [maxViolations, onForceSubmit],
  );

  // Tab switch / Window minimize
  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        triggerViolation("tab");
      }
    };

    const handleWindowBlur = () => {
      if (document.visibilityState === "visible") {
        triggerViolation("tab");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [enabled, triggerViolation]);

  // Browser back button
  useEffect(() => {
    if (!enabled) return;

    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      triggerViolation("back");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [enabled, triggerViolation]);

  const dismissWarning = useCallback(() => {
    if (violationsRef.current < maxViolations) {
      setShowWarning(false);
    }
  }, [maxViolations]);

  return {
    violations,
    showWarning,
    violationType,
    dismissWarning,
    remainingWarnings: Math.max(0, maxViolations - violations),
  };
};

export default useAntiCheat;