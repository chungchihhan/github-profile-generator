"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { submitForm } from "@/lib/actions";
import {
  CheckCircle,
  Loader2,
  GitBranch,
  BarChart3,
  PenTool,
  Image as ImageIcon,
  Download,
  Copy,
  ArrowRight,
  Zap,
  Sparkles
} from "lucide-react";

interface GenerationResult {
  status: string;
  message: string;
  username?: string;
  repos?: string[];
  analysis?: string;
  imagePrompt?: string;
  repoCount?: number;
  totalRepos?: number;
  imageUrl?: string | null;
  needsImageGeneration?: boolean;
}

type WorkflowStage = "idle" | "fetching" | "analyzing" | "prompting" | "generating" | "complete";

interface StageConfig {
  id: WorkflowStage;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
}

const stages: StageConfig[] = [
  {
    id: "fetching",
    title: "FETCH://REPOS",
    description: "Scanning repository matrix",
    icon: GitBranch,
    color: "#00FF88",
  },
  {
    id: "analyzing",
    title: "ANALYZE://PROFILE",
    description: "Decoding developer DNA",
    icon: BarChart3,
    color: "#00D4FF",
  },
  {
    id: "prompting",
    title: "CRAFT://PROMPT",
    description: "Synthesizing visual blueprint",
    icon: PenTool,
    color: "#FF00FF",
  },
  {
    id: "generating",
    title: "RENDER://IMAGE",
    description: "Materializing digital identity",
    icon: Sparkles,
    color: "#FFD700",
  },
];

// Streaming component for repo list
function StreamingRepoList({ repos, speed = 50 }: { repos: string[]; speed?: number }) {
  const [visibleRepos, setVisibleRepos] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setVisibleRepos([]);
    setCurrentIndex(0);

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev < repos.length) {
          setVisibleRepos(repos.slice(0, prev + 1));
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [repos, speed]);

  return (
    <div className="space-y-1 font-mono text-xs">
      {visibleRepos.map((repo, idx) => (
        <motion.div
          key={`${repo}-${idx}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-2 text-green-400/90 hover:text-green-300 transition-colors"
        >
          <span className="text-green-500/50">$</span>
          <span className="flex-1">{repo}</span>
          <span className="text-green-500/30 text-[10px]">
            [{String(idx + 1).padStart(3, '0')}]
          </span>
        </motion.div>
      ))}
      {currentIndex < repos.length && (
        <div className="text-green-400/50 animate-pulse">
          <span className="inline-block animate-bounce">▊</span>
        </div>
      )}
    </div>
  );
}

// Streaming markdown
function StreamingMarkdown({ content, speed = 8, onComplete }: {
  content: string;
  speed?: number;
  onComplete?: () => void;
}) {
  const [displayedContent, setDisplayedContent] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDisplayedContent("");
    setIsComplete(false);
    let index = 0;

    const interval = setInterval(() => {
      if (index < content.length) {
        const chunkSize = 5;
        const nextChunk = content.slice(index, Math.min(index + chunkSize, content.length));
        setDisplayedContent(prev => prev + nextChunk);
        index += chunkSize;

        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      } else {
        clearInterval(interval);
        setIsComplete(true);
        if (onComplete) {
          setTimeout(onComplete, 500);
        }
      }
    }, speed);

    return () => clearInterval(interval);
  }, [content, speed, onComplete]);

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto custom-scrollbar pr-2">
      <div className="prose prose-invert prose-sm max-w-none prose-headings:font-mono prose-headings:text-cyan-400 prose-p:text-gray-300 prose-strong:text-white prose-li:text-gray-300 prose-code:text-green-400 prose-code:bg-black/50 prose-code:px-1 prose-code:rounded">
        <ReactMarkdown>
          {displayedContent}
        </ReactMarkdown>
      </div>
      {!isComplete && (
        <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse ml-1" />
      )}
    </div>
  );
}

export default function ImageGenerator() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentStage, setCurrentStage] = useState<WorkflowStage>("idle");
  const [completedStages, setCompletedStages] = useState<Set<WorkflowStage>>(new Set());
  const [copied, setCopied] = useState(false);
  const [glitchEffect, setGlitchEffect] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status !== "loading") {
      setCheckingAuth(false);
    }
  }, [status, router]);

  const handleSubmit = async () => {
    if (!session?.user?.name || !session?.accessToken) {
      alert("Session expired. Please log in again.");
      router.push("/login");
      return;
    }

    setIsLoading(true);
    setResult(null);
    setCurrentStage("fetching");
    setCompletedStages(new Set());
    setGlitchEffect(true);
    setTimeout(() => setGlitchEffect(false), 500);

    try {
      const response = await submitForm(
        JSON.stringify({
          username: session.user.name,
          accessToken: session.accessToken
        })
      );

      if (response.status === "error") {
        alert(response.message);
        setCurrentStage("idle");
      } else {
        setResult(response as GenerationResult);

        // Progress through stages
        setTimeout(() => {
          setCompletedStages(prev => new Set(prev).add("fetching"));
          setCurrentStage("analyzing");
        }, 2000);
      }
    } catch (error) {
      console.error("Error generating profile:", error);
      alert("An error occurred while generating your profile");
      setCurrentStage("idle");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalysisComplete = () => {
    setCompletedStages(prev => new Set(prev).add("analyzing"));
    setCurrentStage("prompting");
  };

  const handlePromptComplete = () => {
    setCompletedStages(prev => new Set(prev).add("prompting"));
    setCurrentStage("generating");

    setTimeout(() => {
      setCompletedStages(prev => new Set(prev).add("generating"));
      setCurrentStage("complete");
    }, 3000);
  };

  const handleCopyPrompt = () => {
    if (result?.imagePrompt) {
      navigator.clipboard.writeText(result.imagePrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStageStatus = (stageId: WorkflowStage) => {
    if (completedStages.has(stageId)) return "completed";
    if (currentStage === stageId) return "active";
    return "pending";
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <p className="text-xl text-green-400 font-mono animate-pulse">
          INITIALIZING_SYSTEM...
        </p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <p className="text-red-400 font-mono">SESSION_EXPIRED::REDIRECT_TO_LOGIN</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white overflow-hidden relative">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_40%,transparent_100%)]" />

      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-px bg-gradient-to-r from-transparent via-green-400/20 to-transparent animate-scan" />
      </div>

      {/* Glitch overlay */}
      {glitchEffect && (
        <div className="absolute inset-0 pointer-events-none animate-glitch">
          <div className="h-full w-full bg-red-500/10 mix-blend-screen" />
        </div>
      )}

      <AnimatePresence mode="wait">
        {currentStage === "idle" ? (
          /* Initial Welcome Screen */
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen relative z-10 p-8"
          >
            <div className="max-w-4xl mx-auto h-full flex flex-col">
              {/* GitHub Bot Avatar in top-left */}
              <div className="flex items-start gap-4 mb-8">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="relative"
                >
                  {/* GitHub Icon Container */}
                  <div className="w-16 h-16 rounded-full bg-black/50 border-2 border-green-400 shadow-[0_0_20px_rgba(0,255,136,0.5)] flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-10 h-10 fill-green-400"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  {/* Online indicator */}
                  <motion.div
                    className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-black"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>

                {/* Chat Bubble */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex-1 relative"
                >
                  <div className="bg-black/50 backdrop-blur-sm border border-green-400/30 rounded-lg p-4 relative">
                    {/* Chat bubble arrow */}
                    <div className="absolute left-[-8px] top-6 w-0 h-0
                                  border-t-[8px] border-t-transparent
                                  border-r-[8px] border-r-green-400/30
                                  border-b-[8px] border-b-transparent" />

                    <div className="font-mono text-xs text-green-400/60 mb-2">GitHub_Assistant</div>
                    <h2 className="text-2xl font-bold mb-3">
                      Hello, <span className="text-green-400">{session.user?.name}</span>! 👋
                    </h2>
                    <p className="text-gray-300 mb-2">
                      I've analyzed your GitHub activity and I'm ready to create a unique visual representation of your coding journey.
                    </p>
                    <p className="text-sm text-gray-400">
                      Your repositories tell a story - let me help you visualize it in a beautiful way.
                    </p>
                  </div>

                  {/* Typing indicator */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-3 flex items-center gap-2 text-xs text-gray-500 font-mono"
                  >
                    <span className="flex gap-1">
                      <motion.span
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 bg-green-400/50 rounded-full"
                      />
                      <motion.span
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-green-400/50 rounded-full"
                      />
                      <motion.span
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 bg-green-400/50 rounded-full"
                      />
                    </span>
                    <span>Ready to begin...</span>
                  </motion.div>
                </motion.div>
              </div>

              {/* Centered Generate Button */}
              <div className="flex-1 flex items-center justify-center">
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-12 py-4 bg-gradient-to-r from-green-400 to-cyan-400 text-black
                           font-mono font-bold text-lg rounded-lg
                           hover:shadow-[0_0_40px_rgba(0,255,136,0.6)]
                           transition-all duration-300 transform
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center gap-3">
                    <Zap size={20} />
                    {isLoading ? "INITIALIZING..." : "START GENERATION"}
                    <Zap size={20} />
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Two Column Progress Layout */
          <motion.div
            key="progress"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-screen flex relative z-10"
          >
            {/* Left Panel - Progress */}
            <div className="w-[420px] border-r border-green-400/20 p-8 bg-black/30 backdrop-blur-sm overflow-y-auto custom-scrollbar">
              <div className="space-y-6">
                <div className="mb-8">
                  <h3 className="font-mono text-xs text-green-400/60 mb-2">PROGRESS_TRACKER</h3>
                  <div className="h-1 bg-black/50 rounded-full overflow-hidden border border-green-400/20">
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-400 to-cyan-400"
                      initial={{ width: "0%" }}
                      animate={{
                        width:
                          currentStage === "fetching" ? "20%" :
                          currentStage === "analyzing" ? "40%" :
                          currentStage === "prompting" ? "60%" :
                          currentStage === "generating" ? "80%" :
                          currentStage === "complete" ? "100%" : "0%"
                      }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                  </div>
                </div>

                {stages.map((stage, idx) => {
                  const status = getStageStatus(stage.id);
                  const Icon = stage.icon;

                  return (
                    <motion.div
                      key={stage.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative"
                    >
                      {/* Connection line */}
                      {idx < stages.length - 1 && (
                        <div
                          className="absolute left-6 top-12 w-px h-24"
                          style={{
                            background: status === "completed"
                              ? `linear-gradient(to bottom, ${stage.color}, transparent)`
                              : "rgba(0,255,136,0.1)"
                          }}
                        />
                      )}

                      <div className={`
                        flex items-start gap-4 p-4 rounded-none border
                        transition-all duration-300
                        ${status === "active"
                          ? `border-green-400/50 bg-black/50 shadow-[0_0_20px_rgba(0,255,136,0.3)]`
                          : status === "completed"
                          ? "border-green-400/40 bg-green-400/5"
                          : "border-gray-800 bg-black/20 opacity-50"}
                      `}>
                        {/* Icon */}
                        <div
                          className={`
                            w-12 h-12 flex items-center justify-center
                            border ${status === "active" ? "animate-pulse" : ""}
                          `}
                          style={{
                            borderColor: status === "active" ? stage.color :
                                       status === "completed" ? "#00FF88" : "#333",
                            backgroundColor: status === "active" ? `${stage.color}20` :
                                          status === "completed" ? "rgba(0,255,136,0.1)" : "transparent"
                          }}
                        >
                          {status === "completed" ? (
                            <CheckCircle size={20} className="text-green-400" />
                          ) : status === "active" ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                              <Icon size={20} style={{ color: stage.color }} />
                            </motion.div>
                          ) : (
                            <Icon size={20} className="text-gray-600" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h3 className={`font-mono text-sm font-bold mb-1 ${
                            status === "active" ? "text-white" :
                            status === "completed" ? "text-green-400" : "text-gray-500"
                          }`}>
                            {stage.title}
                          </h3>
                          <p className="font-mono text-xs text-gray-400">
                            {stage.description}
                          </p>
                          {status === "active" && (
                            <div className="mt-2 font-mono text-[10px]" style={{ color: stage.color }}>
                              <span className="animate-pulse">PROCESSING...</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Reset button when complete */}
                {currentStage === "complete" && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setCurrentStage("idle");
                      setResult(null);
                      setCompletedStages(new Set());
                    }}
                    className="w-full mt-8 px-6 py-3 bg-black/50 backdrop-blur border border-green-400 text-green-400
                             font-mono text-sm font-bold hover:bg-green-400 hover:text-black
                             transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <ArrowRight size={16} />
                    GENERATE_AGAIN
                  </motion.button>
                )}
              </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="flex-1 p-8 overflow-hidden">
              <div className="h-full border border-green-400/20 bg-black/40 backdrop-blur-sm overflow-hidden flex flex-col">
                {/* Preview Header */}
                <div className="px-6 py-4 border-b border-green-400/20 bg-black/50 flex items-center justify-between">
                  <h3 className="font-mono text-sm font-bold text-green-400">
                    OUTPUT://
                    {currentStage === "fetching" && "REPOSITORY_SCAN"}
                    {currentStage === "analyzing" && "PROFILE_ANALYSIS"}
                    {currentStage === "prompting" && "PROMPT_SYNTHESIS"}
                    {currentStage === "generating" && "IMAGE_RENDERING"}
                    {currentStage === "complete" && "GENERATION_COMPLETE"}
                  </h3>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                </div>

                {/* Preview Content */}
                <div className="flex-1 p-6 overflow-hidden">
                  <AnimatePresence mode="wait">
                    {/* Fetching Stage - Show Repos */}
                    {currentStage === "fetching" && result?.repos && (
                      <motion.div
                        key="repos"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-full overflow-y-auto custom-scrollbar"
                      >
                        <div className="font-mono text-xs text-green-400/60 mb-4">
                          REPOSITORIES_FOUND: {result.totalRepos} | ORIGINAL: {result.repoCount}
                        </div>
                        <StreamingRepoList repos={result.repos} />
                      </motion.div>
                    )}

                    {/* Analyzing Stage */}
                    {currentStage === "analyzing" && result?.analysis && (
                      <motion.div
                        key="analysis"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-full"
                      >
                        <StreamingMarkdown
                          content={result.analysis}
                          speed={5}
                          onComplete={handleAnalysisComplete}
                        />
                      </motion.div>
                    )}

                    {/* Prompting Stage */}
                    {currentStage === "prompting" && result?.imagePrompt && (
                      <motion.div
                        key="prompt"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-full flex flex-col"
                      >
                        <div className="flex-1 overflow-hidden">
                          <StreamingMarkdown
                            content={result.imagePrompt}
                            speed={3}
                            onComplete={handlePromptComplete}
                          />
                        </div>
                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleCopyPrompt}
                          className="mt-4 px-4 py-2 bg-black/50 backdrop-blur border border-cyan-400 text-cyan-400
                                   font-mono text-xs hover:bg-cyan-400 hover:text-black
                                   transition-all duration-200 flex items-center gap-2"
                        >
                          <Copy size={14} />
                          {copied ? "COPIED_TO_CLIPBOARD" : "COPY_PROMPT"}
                        </motion.button>
                      </motion.div>
                    )}

                    {/* Generating Stage */}
                    {currentStage === "generating" && (
                      <motion.div
                        key="generating"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-full flex items-center justify-center"
                      >
                        <div className="text-center">
                          <div className="relative w-32 h-32 mx-auto mb-6">
                            <motion.div
                              className="absolute inset-0 border-2 border-yellow-400"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />
                            <motion.div
                              className="absolute inset-2 border-2 border-cyan-400"
                              animate={{ rotate: -360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />
                            <motion.div
                              className="absolute inset-4 border-2 border-magenta-400"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Sparkles className="text-white" size={32} />
                            </div>
                          </div>
                          <p className="font-mono text-sm text-white/60">
                            RENDERING_DIGITAL_IDENTITY...
                          </p>
                          <div className="mt-2 font-mono text-xs text-yellow-400 animate-pulse">
                            [████████████████░░░░] 80%
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Complete Stage */}
                    {currentStage === "complete" && (
                      <motion.div
                        key="complete"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-full flex flex-col"
                      >
                        {result?.imageUrl ? (
                          <>
                            <div className="flex-1 flex items-center justify-center p-4">
                              <img
                                src={result.imageUrl}
                                alt="Generated GitHub profile"
                                className="max-w-full max-h-full object-contain shadow-2xl border border-green-400/20"
                              />
                            </div>
                            <div className="flex gap-2 justify-center pb-4">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-2 bg-black/50 backdrop-blur border border-green-400 text-green-400
                                         font-mono text-xs hover:bg-green-400 hover:text-black
                                         transition-all duration-200 flex items-center gap-2"
                              >
                                <Download size={14} />
                                DOWNLOAD_IMAGE
                              </motion.button>
                            </div>
                          </>
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <div className="text-center px-8">
                              <ImageIcon className="mx-auto mb-4 text-green-400/30" size={48} />
                              <p className="font-mono text-sm text-green-400/60">
                                GENERATION_COMPLETE::PROMPT_READY
                              </p>
                              <p className="font-mono text-xs text-gray-500 mt-2">
                                Use generated prompt with external image service
                              </p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}