import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
  ChevronDown,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Cpu,
  BookOpen,
  Code2,
  Lightbulb,
  Lock,
  ChevronRight,
  Terminal,
  Settings2,
  PanelLeftClose,
  PanelLeftOpen,
  Zap,
  BarChart2,
  ListChecks,
  Bookmark,
  Share2,
  ThumbsUp,
} from "lucide-react";

const HEX = {
  primary: "#6b46c1",
  secondary: "#9f7aea",
  success: "#10b981",
  danger: "#ef4444",
  warning: "#f59e0b",
  border: "#1f1f2e",
};

const diffColor = (d) =>
  d === "Easy" ? HEX.success : d === "Medium" ? HEX.warning : HEX.danger;

const PROBLEM = {
  id: 1,
  title: "Two Sum",
  difficulty: "Easy",
  acceptance: "52.3%",
  likes: 58421,
  description: `Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.<br/><br/>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.<br/><br/>You can return the answer in any order.`,
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
    },
    {
      input: "nums = [3,2,4], target = 6",
      output: "[1,2]",
      explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
    },
    {
      input: "nums = [3,3], target = 6",
      output: "[0,1]",
      explanation: undefined,
    },
  ],
  constraints: [
    "2 ≤ nums.length ≤ 10⁴",
    "-10⁹ ≤ nums[i] ≤ 10⁹",
    "-10⁹ ≤ target ≤ 10⁹",
    "Only one valid answer exists.",
  ],
  tags: ["Array", "Hash Table"],
  hints: [
    "A really brute force way would be to search for all possible pairs of numbers but that would be too slow.",
    "Try to use a hash map to reduce lookup time from O(n) to O(1).",
  ],
};

const STARTER_CODE = `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
};`;

const LANGUAGES = ["JavaScript", "Python", "Java", "C++", "TypeScript"];
const LANG_MAP = {
  JavaScript: "javascript",
  Python: "python",
  Java: "java",
  "C++": "cpp",
  TypeScript: "typescript",
};

// ── Reusable atoms ────────────────────────────────────────────────────────────

function TagBadge({ children }) {
  return (
    <span
      className="inline-flex items-center text-xs font-mono rounded-md px-2 py-0.5"
      style={{
        background: "rgba(107,70,193,0.18)",
        border: "1px solid rgba(159,122,234,0.3)",
        color: HEX.secondary,
        padding: "2px 6px",
      }}
    >
      {children}
    </span>
  );
}

function IconBtn({ icon: Icon, onClick, title, active }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="flex items-center justify-center rounded-md border-0 cursor-pointer transition-all duration-150"
      style={{
        width: 30,
        height: 30,
        background: active
          ? "rgba(107,70,193,0.28)"
          : hov
            ? "rgba(107,70,193,0.14)"
            : "transparent",
        color: active || hov ? HEX.secondary : "#555",
        flexShrink: 0,
      }}
    >
      <Icon size={15} />
    </button>
  );
}

// ── HintCard ──────────────────────────────────────────────────────────────────

function HintCard({ index, text }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl mb-3 overflow-hidden"
      style={{
        background: "#0a0a0a",
        border: `1px solid ${open ? HEX.primary + "66" : HEX.border}`,
        transition: "border-color 0.2s",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold cursor-pointer border-0"
        style={{ background: "transparent", color: HEX.secondary }}
      >
        <span className="flex items-center gap-2">
          <Lightbulb size={14} />
          Hint {index}
        </span>
        <ChevronDown
          size={14}
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
            flexShrink: 0,
          }}
        />
      </button>
      {open && (
        <div
          className="px-4 pt-3 pb-4 text-sm leading-relaxed"
          style={{ color: "#aaa", borderTop: `1px solid ${HEX.border}` }}
        >
          {text}
        </div>
      )}
    </div>
  );
}

// ── LangSelector ──────────────────────────────────────────────────────────────

function LangSelector({ lang, setLang }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" style={{ flexShrink: 0 }}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg text-xs font-mono cursor-pointer border-0 transition-colors duration-150"
        style={{
          background: "rgba(107,70,193,0.15)",
          border: "1px solid rgba(107,70,193,0.32)",
          color: HEX.secondary,
          padding: "5px 10px",
          height: 30,
        }}
      >
        <Code2 size={12} />
        <span>{lang}</span>
        <ChevronDown size={11} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute left-0 rounded-lg overflow-hidden z-50"
            style={{
              top: "calc(100% + 6px)",
              minWidth: 148,
              background: "#0f0f0f",
              border: `1px solid ${HEX.border}`,
              boxShadow: "0 12px 40px rgba(0,0,0,0.7)",
            }}
          >
            {LANGUAGES.map((l) => (
              <button
                key={l}
                onClick={() => {
                  setLang(l);
                  setOpen(false);
                }}
                className="block w-full text-left text-xs font-mono cursor-pointer border-0 transition-colors duration-100"
                style={{
                  padding: "9px 14px",
                  background:
                    l === lang ? "rgba(107,70,193,0.22)" : "transparent",
                  color: l === lang ? HEX.secondary : "#999",
                }}
                onMouseEnter={(e) => {
                  if (l !== lang)
                    e.currentTarget.style.background = "rgba(107,70,193,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    l === lang ? "rgba(107,70,193,0.22)" : "transparent";
                }}
              >
                {l}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── ProblemPanel ──────────────────────────────────────────────────────────────

function ProblemPanel() {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { id: "description", label: "Description", icon: BookOpen },
    { id: "hints", label: "Hints", icon: Lightbulb },
    { id: "solutions", label: "Solutions", icon: Zap },
  ];

  return (
    <div
      className="flex flex-col"
      style={{
        height: "100%",
        background: "#111",
        overflow: "hidden",
      }}
    >
      {/* ── Tab bar – fixed height, never shrinks ── */}
      <div
        className="flex items-stretch flex-shrink-0"
        style={{
          height: 42,
          background: "#0d0d0d",
          borderBottom: `1px solid ${HEX.border}`,
          padding: "0 16px", // Consistent horizontal padding
        }}
      >
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className="flex items-center gap-1.5 text-xs font-medium cursor-pointer border-0 whitespace-nowrap transition-colors duration-150"
            style={{
              background: "transparent",
              borderBottom:
                activeTab === id
                  ? `2px solid ${HEX.primary}`
                  : "2px solid transparent",
              color: activeTab === id ? "#fff" : "#555",
              padding: "8px 16px 6px 16px", // Consistent vertical rhythm
            }}
          >
            <Icon size={12} />
            {label}
          </button>
        ))}

        <div className="flex-1" />

        {/* Likes */}
        <button
          className="flex items-center gap-2 text-xs cursor-pointer border-0 px-2 py-2"
          style={{
            background: "transparent",
            color: "#666",
            borderRadius: "6px",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            e.currentTarget.style.color = "#aaa";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#666";
          }}
        >
          <ThumbsUp size={12} />
          {PROBLEM.likes.toLocaleString()}
        </button>
      </div>

      {/* ── Scrollable content ── */}
      <div
        className="flex-1 overflow-y-auto"
        style={{
          padding: "24px 24px 40px 24px", // More breathing room
          scrollbarWidth: "thin",
          scrollbarColor: `${HEX.primary}44 transparent`,
          minHeight: 0,
        }}
      >
        {/* ── DESCRIPTION ── */}
        {activeTab === "description" && (
          <div>
            {/* Title & Meta Section */}
            <div className="flex flex-col gap-2 space-y-4">
              {/* Title row - #ID + Title */}
              <div className="flex items-center gap-3">
                <span
                  className="text-xs  font-mono "
                  style={{
                    color: "#666",
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: "6px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    padding: "2px 3px",
                  }}
                >
                  #{PROBLEM.id}
                </span>
                <h1
                  className="text-2xl font-bold leading-tight flex-1 m-0"
                  style={{ color: "#fff" }}
                >
                  {PROBLEM.title}
                </h1>
              </div>

              {/* Meta row - Difficulty + Acceptance */}
              <div className="flex items-center gap-4 ">
                {/* Difficulty Badge */}
                <span
                  className="text-xs font-semibold px-3 py-1.5 shrink-0 rounded-lg"
                  style={{
                    color: diffColor(PROBLEM.difficulty),
                    background: diffColor(PROBLEM.difficulty) + "12",
                    border: `1px solid ${diffColor(PROBLEM.difficulty)}33`,
                    boxShadow: `0 1px 2px ${diffColor(PROBLEM.difficulty)}20`,
                    padding: "2px 6px",
                  }}
                >
                  {PROBLEM.difficulty}
                </span>

                {/* Acceptance Rate */}
                <div className="flex items-center gap-1.5 text-xs">
                  <BarChart2 size={12} style={{ color: "#888" }} />
                  <span style={{ color: "#bbb", fontWeight: 500 }}>
                    {PROBLEM.acceptance}%
                  </span>
                  <span style={{ color: "#888" }}>Acceptance</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {PROBLEM.tags.map((t) => (
                  <TagBadge key={t}>{t}</TagBadge>
                ))}
              </div>
            </div>

            {/* Full-width Divider */}
            <div
              style={{
                height: 1,
                background: HEX.border,
                marginLeft: -24,
                marginRight: -24,
                marginBottom: 36,
                marginTop: 20,
              }}
            />

            {/* Description text */}
            <div
              className="prob-desc text-sm leading-7 mb-8"
              style={{ color: "#ddd" }}
              dangerouslySetInnerHTML={{ __html: PROBLEM.description }}
            />

            {/* Examples */}
            <div className="mb-10">
              {PROBLEM.examples.map((ex, i) => (
                <div key={i} className="mb-8">
                  <p
                    className="text-sm font-semibold mb-4"
                    style={{ color: "#eee", marginBottom: 10, marginTop: 16 }}
                  >
                    Example {i + 1}:
                  </p>
                  <div
                    className="text-xs font-mono rounded-xl"
                    style={{
                      background: "#0a0a0a",
                      border: `1px solid ${HEX.border}`,
                      borderLeft: `4px solid ${HEX.primary}`,
                      padding: "20px 24px",
                      lineHeight: 1.75,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                    }}
                  >
                    <div className="mb-2">
                      <span style={{ color: HEX.secondary, fontWeight: 500 }}>
                        Input:
                      </span>
                      <span style={{ color: "#ddd", marginLeft: 8 }}>
                        {ex.input}
                      </span>
                    </div>
                    <div className="mb-3">
                      <span style={{ color: HEX.secondary, fontWeight: 500 }}>
                        Output:
                      </span>
                      <span style={{ color: "#ddd", marginLeft: 8 }}>
                        {ex.output}
                      </span>
                    </div>
                    {ex.explanation && (
                      <div>
                        <span style={{ color: HEX.secondary, fontWeight: 500 }}>
                          Explanation:
                        </span>
                        <span style={{ color: "#aaa", marginLeft: 8 }}>
                          {ex.explanation}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Constraints */}
            <div>
              <p
                className="text-sm font-semibold my-5"
                style={{ color: "#eee", marginBottom: 10, marginTop: 16 }}
              >
                Constraints:
              </p>
              <ul
                className="text-sm font-mono space-y-2"
                style={{
                  color: "#bbb",
                  paddingLeft: 20,
                  lineHeight: 1.7,
                }}
              >
                {PROBLEM.constraints.map((c, i) => (
                  <li
                    key={i}
                    className="ml-6 list-disc"
                    style={{ color: "#bbb" }}
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ── HINTS ── */}
        {activeTab === "hints" && (
          <div className="p-2">
            <p className="text-xs mb-8 opacity-75">
              Hints can help you approach the problem without giving away the
              answer.
            </p>
            <div className="space-y-4">
              {PROBLEM.hints.map((hint, i) => (
                <HintCard key={i} index={i + 1} text={hint} />
              ))}
            </div>
          </div>
        )}

        {/* ── SOLUTIONS ── */}
        {activeTab === "solutions" && (
          <div
            className="flex flex-col items-center justify-center gap-4 p-8"
            style={{ minHeight: 300 }}
          >
            <Lock size={48} color={HEX.primary} />
            <p
              className="text-lg font-medium text-center max-w-md"
              style={{ color: "#888" }}
            >
              Solutions are locked. Submit a correct solution first.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── OutputPanel ───────────────────────────────────────────────────────────────

function OutputPanel({ output, running, status }) {
  const [activeTab, setActiveTab] = useState("output");

  const testCases = [
    { id: 1, input: "nums = [2,7,11,15], target = 9", expected: "[0,1]" },
    { id: 2, input: "nums = [3,2,4], target = 6", expected: "[1,2]" },
    { id: 3, input: "nums = [3,3], target = 6", expected: "[0,1]" },
  ];

  return (
    <div
      className="flex flex-col"
      style={{
        height: "100%",
        background: "#0f0f0f",
        overflow: "hidden",
      }}
    >
      {/* Tab bar */}
      <div
        className="flex items-stretch flex-shrink-0"
        style={{
          height: 40,
          background: "#0d0d0d",
          borderBottom: `1px solid ${HEX.border}`,
          paddingLeft: 4,
        }}
      >
        {["output", "testcase"].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className="flex items-center gap-1.5 text-xs cursor-pointer border-0 whitespace-nowrap transition-colors duration-150"
            style={{
              background: "transparent",
              borderBottom:
                activeTab === t
                  ? `2px solid ${HEX.primary}`
                  : "2px solid transparent",
              color: activeTab === t ? "#fff" : "#555",
              padding: "0 12px",
            }}
          >
            {t === "output" ? (
              <>
                <Terminal size={12} />
                Console
              </>
            ) : (
              <>
                <ListChecks size={12} />
                Test Cases
              </>
            )}
          </button>
        ))}
      </div>

      {/* Scrollable body */}
      <div
        className="flex-1 overflow-y-auto"
        style={{
          padding: 16,
          minHeight: 0,
          scrollbarWidth: "thin",
          scrollbarColor: `${HEX.primary}44 transparent`,
        }}
      >
        {/* Console */}
        {activeTab === "output" && (
          <>
            {running && (
              <div
                className="flex items-center gap-2.5 text-xs font-mono"
                style={{ color: HEX.secondary }}
              >
                <span className="spinner" />
                Running…
              </div>
            )}

            {!running && !output && (
              <div className="text-xs font-mono" style={{ color: "#3a3a3a" }}>
                // Run your code to see output here
              </div>
            )}

            {!running && output && (
              <div>
                {status && (
                  <div
                    className="flex items-center gap-2.5 rounded-lg mb-4"
                    style={{
                      padding: "10px 14px",
                      background:
                        status === "accepted"
                          ? `${HEX.success}18`
                          : `${HEX.danger}18`,
                      border: `1px solid ${
                        status === "accepted"
                          ? HEX.success + "44"
                          : HEX.danger + "44"
                      }`,
                    }}
                  >
                    {status === "accepted" ? (
                      <CheckCircle2 size={15} color={HEX.success} />
                    ) : (
                      <XCircle size={15} color={HEX.danger} />
                    )}
                    <span
                      className="text-sm font-bold"
                      style={{
                        color: status === "accepted" ? HEX.success : HEX.danger,
                      }}
                    >
                      {status === "accepted" ? "Accepted" : "Wrong Answer"}
                    </span>
                    {status === "accepted" && (
                      <>
                        <span
                          className="ml-auto flex items-center gap-1 text-xs"
                          style={{ color: "#555" }}
                        >
                          <Clock size={11} /> 72ms
                        </span>
                        <span
                          className="flex items-center gap-1 text-xs"
                          style={{ color: "#555" }}
                        >
                          <Cpu size={11} /> 41.8 MB
                        </span>
                      </>
                    )}
                  </div>
                )}
                <pre
                  className="text-xs font-mono m-0 whitespace-pre-wrap break-words"
                  style={{ color: "#bbb", lineHeight: 1.9 }}
                >
                  {output}
                </pre>
              </div>
            )}
          </>
        )}

        {/* Test cases */}
        {activeTab === "testcase" && (
          <div>
            {testCases.map((tc) => (
              <div
                key={tc.id}
                className="mb-3 rounded-lg"
                style={{
                  background: "#0a0a0a",
                  border: `1px solid ${HEX.border}`,
                  padding: "12px 14px",
                }}
              >
                <div
                  className="text-xs font-semibold mb-2"
                  style={{ color: "#444" }}
                >
                  Case {tc.id}
                </div>
                <div
                  className="text-xs font-mono"
                  style={{ color: "#999", lineHeight: 1.9 }}
                >
                  <span style={{ color: HEX.secondary }}>Input:&nbsp;</span>
                  {tc.input}
                </div>
                <div
                  className="text-xs font-mono"
                  style={{ color: "#999", lineHeight: 1.9 }}
                >
                  <span style={{ color: HEX.secondary }}>Expected:&nbsp;</span>
                  {tc.expected}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────

export default function CodeEditorApp() {
  const [lang, setLang] = useState("JavaScript");
  const [code, setCode] = useState(STARTER_CODE);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState(null);
  const [leftCollapsed, setLeft] = useState(false);
  const [outputHeight, setOutH] = useState(210);
  const [isResizing, setIsResizing] = useState(false);
  const [fontSize, setFontSize] = useState(14);

  const startY = useRef(null);
  const startH = useRef(null);

  // Drag-to-resize output panel
  useEffect(() => {
    const onMove = (e) => {
      if (!isResizing) return;
      const dy = startY.current - e.clientY;
      const newH = Math.max(90, Math.min(520, startH.current + dy));
      setOutH(newH);
    };
    const onUp = () => setIsResizing(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isResizing]);

  const startResize = (e) => {
    setIsResizing(true);
    startY.current = e.clientY;
    startH.current = outputHeight;
    e.preventDefault();
  };

  const handleRun = () => {
    setRunning(true);
    setOutput("");
    setStatus(null);

    // Print code as object to console ✅
    console.log("=== CODE EXECUTION ===");
    console.dir(
      {
        language: lang,
        code: code,
        timestamp: new Date().toISOString(),
      },
      { depth: null },
    );
    console.log("======================");

    setTimeout(() => {
      setOutput(
        [
          "✅ Code logged to console!\n",
          `\n📝 Language: ${lang}`,
          `\n📜 Lines: ${code.split("\n").length}`,
          `\n⏰ Time: ${new Date().toLocaleTimeString()}`,
          `\n\n💡 Open DevTools (F12) → Console to see full code!`,
        ].join("\n"),
      );
      setStatus("accepted");
      setRunning(false);
    }, 1200);
  };

  const handleReset = () => {
    setCode(STARTER_CODE);
    setOutput("");
    setStatus(null);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        html, body, #root {
          height: 100%;
          background: #000;
        }

        ::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #6b46c144;
          border-radius: 99px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #9f7aea66;
        }

        .spinner {
          display: inline-block;
          flex-shrink: 0;
          width: 13px;
          height: 13px;
          border: 2px solid #6b46c130;
          border-top-color: #9f7aea;
          border-radius: 50%;
          animation: spin .7s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* inline code / em / strong inside dangerouslySetInnerHTML */
        .prob-desc code {
          background: rgba(107,70,193,0.18);
          color: #c8a8f0;
          padding: 1px 5px;
          border-radius: 4px;
          font-family: 'DM Mono', monospace;
          font-size: 0.82em;
        }
        .prob-desc strong {
          color: #e4e4ff;
        }
        .prob-desc em {
          color: #b8a8d0;
          font-style: italic;
        }

        /* Make sure the full-height layout works in every browser */
        .editor-root {
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow: hidden;
        }
        .editor-body {
          flex: 1;
          display: flex;
          overflow: hidden;
          min-height: 0;
        }
        .left-col {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          flex-shrink: 0;
          transition: width .25s cubic-bezier(.4,0,.2,1);
        }
        .right-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-width: 0;
        }
      `}</style>

      <div className="editor-root font-['DM_Sans'] bg-black">
        {/* ════════════ NAVBAR ════════════ */}
        <header style={{padding:'20px'}} className="h-12 bg-black/90 border-b border-border z-20 flex items-center shrink-0 gap-3 px-6">
          {/* Logo - PERFECT alignment fixed */}
          <div className="flex items-center gap-2 shrink-0 h-[22px]">
            <div className="flex items-center justify-center w-6.5 h-6.5 bg-gradient-to-r from-primary to-secondary rounded-md shrink-0">
              <Code2 size={13} className="text-white -mt-[1px]" />
            </div>
            <span className="font-bold text-sm tracking-tight text-white leading-none self-end">
              VoidCode
            </span>
          </div>

          {/* Divider */}
          <div className="w-px h-4.5 bg-border shrink-0" />

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-muted overflow-hidden min-w-0">
            <span className="whitespace-nowrap">Problem List</span>
            <ChevronRight size={12} className="shrink-0" />
            <span className="truncate text-secondary">{PROBLEM.title}</span>
          </div>

          <div className="flex-1" />

          {/* Right actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <IconBtn icon={Bookmark} title="Bookmark" />
            <IconBtn icon={Share2} title="Share" />
            <div className="flex items-center justify-center w-7.5 h-7.5 bg-gradient-to-r from-primary to-secondary rounded-full text-xs font-bold text-white cursor-pointer shrink-0">
              U
            </div>
          </div>
        </header>

        {/* ════════════ BODY ════════════ */}
        <div className="editor-body bg-[#050505]">
          {/* ── LEFT COLUMN ── */}
          <div
            className={`left-col transition-all duration-200 ${
              leftCollapsed
                ? "w-0 border-r-0"
                : "w-[clamp(280px,36%,460px)] border-r border-[rgb(var(--border))]"
            }`}
          >
            <ProblemPanel />
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="right-col">
            {/* Editor toolbar */}
            <div style={{padding:'10px'}} className="flex items-center  flex-shrink-0 gap-2 px-3 h-11 bg-[#080808] border-b border-[rgb(var(--border))]">
              {/* Toggle left panel */}
              <IconBtn
                icon={leftCollapsed ? PanelLeftOpen : PanelLeftClose}
                title={leftCollapsed ? "Show problem" : "Hide problem"}
                onClick={() => setLeft(!leftCollapsed)}
              />

              <div className="flex-shrink-0 w-[1px] h-[18px] bg-[rgb(var(--border))]" />

              <LangSelector lang={lang} setLang={setLang} />

              <div className="flex-1" />

              {/* Font size stepper */}
              <div className="flex items-center rounded-md flex-shrink-0 h-[28px] px-[6px] bg-white/3 border gap-1 border-[rgb(var(--border))]">
                <button
                  onClick={() => setFontSize((f) => Math.max(11, f - 1))}
                  className="border-0 cursor-pointer text-base leading-none flex items-center justify-center w-[18px] h-[18px] bg-transparent text-[#555]"
                >
                  −
                </button>
                <span className="text-xs font-mono text-center min-w-[20px] text-[#777]">
                  {fontSize}
                </span>
                <button
                  onClick={() => setFontSize((f) => Math.min(22, f + 1))}
                  className="border-0 cursor-pointer text-sm leading-none flex items-center justify-center w-[18px] h-[18px] bg-transparent text-[#555]"
                >
                  +
                </button>
              </div>

              <IconBtn
                icon={RotateCcw}
                title="Reset code"
                onClick={handleReset}
              />
              <IconBtn icon={Settings2} title="Settings" />

              {/* Run */}
              <button
                onClick={handleRun}
                disabled={running}
                className="flex items-center justify-center gap-1.5 text-white bg-primary px-2 text-xs font-semibold rounded-lg border-0 cursor-pointer flex-shrink-0 transition-all duration-150 h-8 w-20  disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--secondary))]"
                onMouseEnter={(e) => {
                  if (!running) {
                    e.currentTarget.style.opacity = ".82";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.transform = "none";
                }}
              >
                {running ? (
                  <span className="spinner" />
                ) : (
                  <Play size={12} fill="currentColor" />
                )}
                Run
              </button>

              {/* Submit */}
              <button
                disabled={running}
                className="flex items-center justify-center gap-1.5 text-xs font-semibold rounded-lg cursor-pointer flex-shrink-0 transition-colors duration-150 h-8 w-20 bg-success/10 disabled:opacity-40 disabled:cursor-not-allowed  border border-[rgba(var(--success),0.33)] text-success px-2"
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `rgba(var(--success),0.1)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <CheckCircle2 size={12} />
                Submit
              </button>
            </div>

            {/* Monaco Editor – fills remaining space */}
            <div className="flex-1 overflow-hidden min-h-0">
              <Editor
                height="100%"
                language={LANG_MAP[lang]}
                value={code}
                onChange={(v) => setCode(v || "")}
                theme="vs-dark"
                options={{
                  fontSize,
                  fontFamily: "'DM Mono', 'Fira Code', monospace",
                  fontLigatures: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  lineNumbers: "on",
                  renderLineHighlight: "line",
                  cursorBlinking: "smooth",
                  padding: { top: 14, bottom: 14 },
                  scrollbar: {
                    verticalScrollbarSize: 4,
                    horizontalScrollbarSize: 4,
                  },
                  bracketPairColorization: { enabled: true },
                  smoothScrolling: true,
                  wordWrap: "on",
                  overviewRulerLanes: 0,
                  folding: true,
                  tabSize: 4,
                  suggestOnTriggerCharacters: true,
                  quickSuggestions: {
                    other: true,
                    comments: false,
                    strings: false,
                  },
                }}
                beforeMount={(monaco) => {
                  monaco.editor.defineTheme("voidcode", {
                    base: "vs-dark",
                    inherit: true,
                    rules: [
                      {
                        token: "comment",
                        foreground: "404058",
                        fontStyle: "italic",
                      },
                      { token: "keyword", foreground: "9f7aea" },
                      { token: "string", foreground: "98d4a3" },
                      { token: "number", foreground: "e4c85a" },
                      { token: "function", foreground: "c8a8f0" },
                      { token: "variable", foreground: "dcdcff" },
                      { token: "type", foreground: "7dd3fc" },
                    ],
                    colors: {
                      "editor.background": "#0a0a12",
                      "editor.foreground": "#dcdcff",
                      "editor.lineHighlightBackground": "#6b46c10e",
                      "editor.selectionBackground": "#6b46c130",
                      "editorCursor.foreground": "#9f7aea",
                      "editorLineNumber.foreground": "#2e2e48",
                      "editorLineNumber.activeForeground": "#9f7aea",
                      "editor.inactiveSelectionBackground": "#6b46c11a",
                      "editorIndentGuide.background": "#1a1a2e",
                      "editorIndentGuide.activeBackground": "#6b46c150",
                    },
                  });
                  monaco.editor.setTheme("voidcode");
                }}
              />
            </div>

            {/* ── Drag resizer ── */}
            <div
              onMouseDown={startResize}
              className={`flex-shrink-0 flex items-center justify-center cursor-ns-resize h-1.5 transition-colors duration-150 border-t border-b border-[rgb(var(--border))] ${
                isResizing ? "bg-[rgba(var(--primary),0.33)]" : "bg-[#111]"
              }`}
            >
              <div
                className="rounded-full w-8 h-[2px] transition-colors duration-150"
                style={{
                  background: isResizing ? `rgb(var(--secondary))` : "#2a2a3a",
                }}
              />
            </div>

            {/* ── Output Panel ── */}
            <div
              className="flex-shrink-0 overflow-hidden"
              style={{ height: outputHeight }}
            >
              <OutputPanel output={output} running={running} status={status} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
