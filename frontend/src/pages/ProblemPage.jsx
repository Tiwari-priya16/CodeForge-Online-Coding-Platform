import { useState, useEffect, useRef } from 'react';
import { useParams, NavLink } from 'react-router';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import Navbar from '../components/Navbar';
import axiosClient from "../utils/axiosClient";
import SubmissionHistory from "../components/SubmissionHistory";
import ChatAi from '../components/ChatAi';
import Editorial from '../components/Editorial';
import { GripVertical, GripHorizontal, Play, Pause, RotateCcw, Send, Code2, FileText, Video, History, BotMessageSquare, Eye, Lock, CheckCircle2, XCircle, Braces, RefreshCw, Maximize2, Minimize2, ChevronUp, ChevronDown, Loader2, Globe, AlertTriangle, PlusCircle } from 'lucide-react';

const langMap = {
  c: 'C',
  cpp: 'C++',
  java: 'Java',
  javascript: 'JavaScript',
  python: 'Python 3'
};

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');

  // Console Drawer & Judging States
  const [isConsoleExpanded, setIsConsoleExpanded] = useState(true);
  const [consoleHeight, setConsoleHeight] = useState(260); // Height in pixels
  const [isConsoleDragging, setIsConsoleDragging] = useState(false);
  const [activeConsoleTab, setActiveConsoleTab] = useState('testcase'); // 'testcase' | 'result'

  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset Code Modal State
  const [showResetModal, setShowResetModal] = useState(false);

  // Solution Reveal State & Language Selection
  const [solutionLang, setSolutionLang] = useState('JavaScript');
  const [isSolutionRevealed, setIsSolutionRevealed] = useState(false);

  // Selected Example Case index in Testcase tab
  const [selectedTestCaseIdx, setSelectedTestCaseIdx] = useState(0);

  // Left/Right Panel Resizer State
  const [leftWidth, setLeftWidth] = useState(48);
  const [isLeftDragging, setIsLeftDragging] = useState(false);

  // Practice Timer State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  const editorRef = useRef(null);
  let { problemId } = useParams();

  // Practice Timer Effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSecs) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResetTimer = () => {
    setTimerSeconds(0);
    setIsTimerRunning(true);
  };

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        setProblem(response.data);
        
        const initialCode = response.data.startCode.find(sc => sc.language === langMap[selectedLanguage] || sc.language === 'JavaScript')?.initialCode || '';
        setCode(initialCode);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching problem:', error);
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  // Update code when language changes
  useEffect(() => {
    if (problem) {
      const initialCode = problem.startCode.find(sc => sc.language === langMap[selectedLanguage] || (selectedLanguage === 'python' && sc.language === 'Python'))?.initialCode || '';
      setCode(initialCode);
    }
  }, [selectedLanguage, problem]);

  // Smooth Left/Right Panel Resizing Effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isLeftDragging) return;
      const newWidth = (e.clientX / window.innerWidth) * 100;
      if (newWidth >= 20 && newWidth <= 80) {
        setLeftWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsLeftDragging(false);
    };

    if (isLeftDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isLeftDragging]);

  // Smooth Bottom Console Resizing Effect
  useEffect(() => {
    const handleConsoleMouseMove = (e) => {
      if (!isConsoleDragging) return;
      const windowHeight = window.innerHeight;
      const newHeight = windowHeight - e.clientY;
      if (newHeight >= 100 && newHeight <= windowHeight - 150) {
        setConsoleHeight(newHeight);
      }
    };

    const handleConsoleMouseUp = () => {
      setIsConsoleDragging(false);
    };

    if (isConsoleDragging) {
      window.addEventListener('mousemove', handleConsoleMouseMove);
      window.addEventListener('mouseup', handleConsoleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleConsoleMouseMove);
      window.removeEventListener('mouseup', handleConsoleMouseUp);
    };
  }, [isConsoleDragging]);

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  // Format Code Helper
  const handleFormatCode = () => {
    if (editorRef.current) {
      try {
        editorRef.current.getAction('editor.action.formatDocument')?.run();
      } catch (e) {}
    }
    if (code) {
      const lines = code.split('\n');
      let indent = 0;
      const formatted = lines.map(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('}') || trimmed.startsWith(')')) indent = Math.max(0, indent - 1);
        const res = '    '.repeat(indent) + trimmed;
        if (trimmed.endsWith('{') || trimmed.endsWith('(')) indent++;
        return res;
      }).join('\n');
      setCode(formatted);
    }
  };

  // Confirm Reset Code Action
  const confirmResetCode = () => {
    if (problem) {
      const initialCode = problem.startCode.find(sc => sc.language === langMap[selectedLanguage] || (selectedLanguage === 'python' && sc.language === 'Python'))?.initialCode || '';
      setCode(initialCode);
    }
    setShowResetModal(false);
  };

  // Add Failed Test Case to Custom Example Cases List
  const handleAddToExampleCases = (failedInput, failedOutput) => {
    if (!problem || !failedInput) return;
    const newCase = {
      input: failedInput,
      output: failedOutput || '',
      explanation: 'Added from failed submission case.'
    };
    setProblem(prev => ({
      ...prev,
      visibleTestCases: [...(prev.visibleTestCases || []), newCase]
    }));
    setSelectedTestCaseIdx(problem.visibleTestCases.length);
    setActiveConsoleTab('testcase');
    alert('Failed test case added to Example Testcases list!');
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  // RUN CODE (Visible Test Cases Evaluation)
  const handleRun = async () => {
    setIsRunning(true);
    setRunResult(null);
    setIsConsoleExpanded(true);
    setActiveConsoleTab('result');

    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage
      });

      setRunResult(response.data);
    } catch (error) {
      console.error('Error running code:', error);
      setRunResult({
        success: false,
        error: 'Internal server error'
      });
    } finally {
      setIsRunning(false);
    }
  };

  // SUBMIT CODE (Hidden Test Cases Evaluation)
  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    setSubmitResult(null);
    setIsConsoleExpanded(true);
    setActiveConsoleTab('result');

    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        code: code,
        language: selectedLanguage
      });

      setSubmitResult(response.data);
    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmitResult({
        accepted: false,
        error: 'Evaluation Error / Server Error',
        passedTestCases: 0,
        totalTestCases: problem?.hiddenTestCases?.length || 11
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      case 'c': return 'c';
      case 'python': return 'python';
      default: return 'javascript';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'badge-success text-success-content';
      case 'medium': return 'badge-warning text-warning-content';
      case 'hard': return 'badge-error text-error-content';
      default: return 'badge-neutral';
    }
  };

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-300">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // Get solution code for selected solution language
  const activeSolution = problem?.referenceSolution?.find(
    s => s.language.toLowerCase() === solutionLang.toLowerCase()
  );

  return (
    <div className="h-screen flex flex-col bg-base-300 select-none overflow-hidden relative">
      {/* Fixed Top Navbar */}
      <Navbar title={problem?.title} />

      {/* Fullscreen Drag Overlay prevents Monaco Editor from capturing mouse events during resize */}
      {(isLeftDragging || isConsoleDragging) && (
        <div
          className={`fixed inset-0 z-[9999] bg-transparent ${isLeftDragging ? 'cursor-col-resize' : 'cursor-row-resize'}`}
          onMouseMove={(e) => {
            if (isLeftDragging) {
              const newWidth = (e.clientX / window.innerWidth) * 100;
              if (newWidth >= 20 && newWidth <= 80) setLeftWidth(newWidth);
            }
            if (isConsoleDragging) {
              const windowHeight = window.innerHeight;
              const newHeight = windowHeight - e.clientY;
              if (newHeight >= 100 && newHeight <= windowHeight - 150) setConsoleHeight(newHeight);
            }
          }}
          onMouseUp={() => {
            setIsLeftDragging(false);
            setIsConsoleDragging(false);
          }}
        />
      )}

      {/* Reset Code Confirmation Custom Modal */}
      {showResetModal && (
        <div className="modal modal-open z-[200]">
          <div className="modal-box bg-slate-900 border border-slate-800 text-slate-100 max-w-sm shadow-2xl rounded-2xl p-6">
            <div className="flex items-center gap-3 text-amber-400 mb-3">
              <AlertTriangle size={24} />
              <h3 className="font-bold text-base">Reset to Default Template?</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Are you sure you want to reset code for <strong className="text-white">{langMap[selectedLanguage]}</strong>? All your unsaved changes in the editor will be discarded.
            </p>
            <div className="modal-action flex justify-end gap-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="btn btn-xs btn-ghost text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmResetCode}
                className="btn btn-xs btn-warning gap-1 font-bold"
              >
                <RefreshCw size={12} /> Reset Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Split Body */}
      <div className="flex-1 flex overflow-hidden p-2 gap-1 relative">
        {/* Left Resizable Panel */}
        {!isFullscreen && (
          <div
            style={{ width: `${leftWidth}%` }}
            className="flex flex-col bg-base-100 rounded-xl border border-base-200 overflow-hidden shadow-sm"
          >
            {/* Left Tabs Header */}
            <div className="flex items-center bg-base-200/50 border-b border-base-200 px-2 pt-1 gap-1">
              <button
                className={`btn btn-xs btn-ghost gap-1.5 rounded-b-none ${activeLeftTab === 'description' ? 'btn-active bg-base-100 border-b-2 border-primary font-bold' : 'opacity-70'}`}
                onClick={() => setActiveLeftTab('description')}
              >
                <FileText size={13} /> Description
              </button>
              <button
                className={`btn btn-xs btn-ghost gap-1.5 rounded-b-none ${activeLeftTab === 'editorial' ? 'btn-active bg-base-100 border-b-2 border-primary font-bold' : 'opacity-70'}`}
                onClick={() => setActiveLeftTab('editorial')}
              >
                <Video size={13} /> Editorial
              </button>
              <button
                className={`btn btn-xs btn-ghost gap-1.5 rounded-b-none ${activeLeftTab === 'solutions' ? 'btn-active bg-base-100 border-b-2 border-primary font-bold' : 'opacity-70'}`}
                onClick={() => setActiveLeftTab('solutions')}
              >
                <Code2 size={13} /> Solutions
              </button>
              <button
                className={`btn btn-xs btn-ghost gap-1.5 rounded-b-none ${activeLeftTab === 'submissions' ? 'btn-active bg-base-100 border-b-2 border-primary font-bold' : 'opacity-70'}`}
                onClick={() => setActiveLeftTab('submissions')}
              >
                <History size={13} /> Submissions
              </button>
              <button
                className={`btn btn-xs btn-ghost gap-1.5 rounded-b-none ${activeLeftTab === 'chatAI' ? 'btn-active bg-base-100 border-b-2 border-primary font-bold' : 'opacity-70'}`}
                onClick={() => setActiveLeftTab('chatAI')}
              >
                <BotMessageSquare size={13} /> ChatAI
              </button>
            </div>

            {/* Left Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 select-text">
              {problem && (
                <>
                  {activeLeftTab === 'description' && (
                    <div>
                      {/* Title & Badges */}
                      <div className="flex items-center gap-3 mb-6">
                        <h1 className="text-2xl font-bold">{problem.title}</h1>
                        <div className={`badge ${getDifficultyColor(problem.difficulty)} uppercase text-xs font-bold px-2.5 py-1`}>
                          {problem.difficulty}
                        </div>
                        <div className="badge badge-neutral text-xs font-mono">{problem.tags}</div>
                      </div>

                      {/* Markdown Description */}
                      <div className="prose max-w-none text-base-content text-sm leading-relaxed space-y-3">
                        <ReactMarkdown
                          components={{
                            h3: ({ node, ...props }) => <h3 className="font-bold text-base text-base-content mt-5 mb-2 border-b border-base-200 pb-1" {...props} />,
                            strong: ({ node, ...props }) => <strong className="font-bold text-primary" {...props} />,
                            code: ({ node, ...props }) => <code className="bg-base-200 text-primary font-mono text-xs px-2 py-0.5 rounded border border-base-300 font-semibold" {...props} />,
                            p: ({ node, ...props }) => <p className="text-sm leading-relaxed text-base-content/90 mb-3" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-1 text-sm text-base-content/90 my-2" {...props} />
                          }}
                        >
                          {problem.description}
                        </ReactMarkdown>
                      </div>

                      {/* Examples Section */}
                      <div className="mt-8 space-y-4">
                        <h3 className="text-base font-bold border-b border-base-200 pb-2">Examples</h3>
                        {problem.visibleTestCases.map((example, index) => (
                          <div key={index} className="bg-base-200/60 p-4 rounded-xl border border-base-200 space-y-2 text-sm font-mono">
                            <div className="font-semibold text-primary">Example {index + 1}:</div>
                            <div><strong className="text-base-content/70">Input:</strong> <code className="bg-base-300 px-2 py-0.5 rounded text-xs text-base-content font-bold">{example.input}</code></div>
                            <div><strong className="text-base-content/70">Output:</strong> <code className="bg-base-300 px-2 py-0.5 rounded text-xs text-base-content font-bold">{example.output}</code></div>
                            <div><strong className="text-base-content/70">Explanation:</strong> <span className="text-base-content/80 font-sans text-xs">{example.explanation}</span></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeLeftTab === 'editorial' && (
                    <div>
                      <h2 className="text-xl font-bold mb-4">Editorial Video Solution</h2>
                      <Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration} />
                    </div>
                  )}

                  {/* Interactive Hidden/Blurred Official Solution Tab */}
                  {activeLeftTab === 'solutions' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-base-200 pb-3">
                        <h2 className="text-xl font-bold">Official Reference Solution</h2>

                        {/* Solution Language Selector */}
                        <div className="flex gap-1 bg-base-200 p-1 rounded-lg">
                          {['C', 'C++', 'Java', 'JavaScript', 'Python'].map((lang) => (
                            <button
                              key={lang}
                              className={`btn btn-xs ${solutionLang.toLowerCase() === lang.toLowerCase() ? 'btn-primary' : 'btn-ghost opacity-70'}`}
                              onClick={() => setSolutionLang(lang)}
                            >
                              {lang}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Code Container with Blur/Reveal Toggle */}
                      <div className="relative border border-base-200 rounded-xl overflow-hidden bg-base-300 min-h-[350px]">
                        {/* Code Content */}
                        <div className={`p-4 font-mono text-xs overflow-x-auto ${!isSolutionRevealed ? 'filter blur-md select-none pointer-events-none opacity-40' : ''}`}>
                          <pre>
                            <code>{activeSolution?.completeCode || `// Solution for ${solutionLang} is coming soon.`}</code>
                          </pre>
                        </div>

                        {/* Locked Overlay Box */}
                        {!isSolutionRevealed && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-base-100/60 backdrop-blur-sm p-6 text-center space-y-3">
                            <div className="p-3 bg-primary/10 rounded-full text-primary">
                              <Lock size={28} />
                            </div>
                            <h3 className="font-bold text-lg">Official Solution Locked</h3>
                            <p className="text-xs text-base-content/70 max-w-sm">
                              Try solving the problem yourself first! Click below to reveal the full official algorithm solution for <strong>{solutionLang}</strong>.
                            </p>
                            <button
                              onClick={() => setIsSolutionRevealed(true)}
                              className="btn btn-primary btn-sm gap-2 shadow-lg hover:scale-105 transition-transform"
                            >
                              <Eye size={16} /> See Solution
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeLeftTab === 'submissions' && (
                    <div>
                      <h2 className="text-xl font-bold mb-4">My Submissions</h2>
                      <SubmissionHistory problemId={problemId} />
                    </div>
                  )}

                  {activeLeftTab === 'chatAI' && (
                    <div>
                      <h2 className="text-xl font-bold mb-4">AI DSA Tutor</h2>
                      <ChatAi problem={problem} />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Drag Resizer / Separator Bar */}
        {!isFullscreen && (
          <div
            onMouseDown={(e) => { e.preventDefault(); setIsLeftDragging(true); }}
            className={`w-2.5 flex items-center justify-center cursor-col-resize hover:bg-primary/40 transition-colors group select-none rounded-full ${isLeftDragging ? 'bg-primary' : 'bg-transparent'}`}
          >
            <GripVertical size={14} className="text-base-content/30 group-hover:text-primary transition-colors" />
          </div>
        )}

        {/* Right Resizable Panel (Code Editor + Resizable Console Drawer) */}
        <div
          style={{ width: isFullscreen ? '100%' : `${100 - leftWidth}%` }}
          className="flex flex-col bg-base-100 rounded-xl border border-base-200 overflow-hidden shadow-sm relative"
        >
          {/* Editor Header Bar */}
          <div className="flex items-center justify-between bg-base-200/50 border-b border-base-200 px-3 py-1 gap-2">
            <div className="flex items-center gap-1">
              <span className="font-bold text-xs flex items-center gap-1 text-primary">
                <Code2 size={13} /> Code Editor
              </span>
            </div>

            {/* Action Bar & Custom Language Popover & Practice Timer */}
            <div className="flex items-center gap-2">
              {/* Sleek Practice Timer Positioned Right Next to Language Selector */}
              <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-lg text-emerald-400 font-mono text-xs shadow-inner cursor-pointer select-none">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="hover:text-amber-400 transition-colors p-0.5 cursor-pointer"
                  title={isTimerRunning ? "Pause Timer" : "Resume Timer"}
                >
                  {isTimerRunning ? <Pause size={12} className="text-amber-400" /> : <Play size={12} className="text-emerald-400" />}
                </button>
                <span onClick={() => setIsTimerRunning(!isTimerRunning)} className="font-bold tracking-wider px-0.5 cursor-pointer">{formatTimer(timerSeconds)}</span>
                <button
                  onClick={handleResetTimer}
                  className="hover:text-amber-400 transition-colors p-0.5 cursor-pointer"
                  title="Reset Timer"
                >
                  <RotateCcw size={12} className="text-slate-400 hover:text-slate-200" />
                </button>
              </div>

              {/* Code Format, Reset, Fullscreen Icons */}
              <div className="flex items-center gap-1 border-r border-base-300 pr-2">
                <button
                  onClick={handleFormatCode}
                  className="btn btn-xs btn-ghost p-1 text-base-content/70 hover:text-primary"
                  title="Format Code ({ })"
                >
                  <Braces size={13} />
                </button>
                <button
                  onClick={() => setShowResetModal(true)}
                  className="btn btn-xs btn-ghost p-1 text-base-content/70 hover:text-warning"
                  title="Reset to Default Starter Code"
                >
                  <RefreshCw size={13} />
                </button>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="btn btn-xs btn-ghost p-1 text-base-content/70 hover:text-primary"
                  title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                </button>
              </div>

              {/* Custom Dark Theme Language Selector Dropdown */}
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-xs bg-slate-900 border border-slate-800 text-slate-100 hover:bg-slate-800 font-bold gap-1.5 px-2.5 rounded-lg shadow-sm"
                >
                  <Globe size={13} className="text-emerald-400" />
                  <span>{langMap[selectedLanguage]}</span>
                  <ChevronDown size={12} className="opacity-60" />
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-1 shadow-2xl bg-slate-900 border border-slate-800 rounded-xl w-36 z-[100] mt-1 space-y-0.5 text-xs text-slate-200"
                >
                  {[
                    { id: 'c', label: 'C' },
                    { id: 'cpp', label: 'C++' },
                    { id: 'java', label: 'Java' },
                    { id: 'javascript', label: 'JavaScript' },
                    { id: 'python', label: 'Python 3' }
                  ].map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          setSelectedLanguage(item.id);
                          if (document.activeElement) document.activeElement.blur();
                        }}
                        className={`flex items-center justify-between py-1.5 px-2.5 rounded-lg transition-colors ${selectedLanguage === item.id ? 'bg-primary/20 text-primary font-bold' : 'hover:bg-slate-800/80 text-slate-300'}`}
                      >
                        <span>{item.label}</span>
                        {selectedLanguage === item.id && <span className="text-emerald-400 font-bold text-xs">✓</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-1 overflow-hidden pt-2">
            <Editor
              height="100%"
              language={getLanguageForMonaco(selectedLanguage)}
              value={code}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                insertSpaces: true,
                wordWrap: 'on',
                lineNumbers: 'on',
                glyphMargin: false,
                folding: true,
                lineDecorationsWidth: 10,
                lineNumbersMinChars: 3,
                renderLineHighlight: 'line',
                selectOnLineNumbers: true,
                roundedSelection: true,
                cursorStyle: 'line',
                mouseWheelZoom: true,
              }}
            />
          </div>

          {/* Smooth Vertical Drag Handle for Console Drawer */}
          {isConsoleExpanded && (
            <div
              onMouseDown={(e) => { e.preventDefault(); setIsConsoleDragging(true); }}
              className={`h-2.5 flex items-center justify-center cursor-row-resize hover:bg-primary/40 transition-colors group select-none border-t border-base-200 ${isConsoleDragging ? 'bg-primary' : 'bg-base-200/80'}`}
              title="Drag up/down to resize Console drawer"
            >
              <GripHorizontal size={14} className="text-base-content/30 group-hover:text-primary transition-colors" />
            </div>
          )}

          {/* Bottom Resizable Console / Testcase Drawer */}
          <div
            style={{ height: isConsoleExpanded ? `${consoleHeight}px` : '42px' }}
            className="bg-base-100 border-t border-base-200 flex flex-col transition-all duration-100 relative z-10 overflow-hidden shadow-inner"
          >
            {/* Console Drawer Header / Bar */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-base-200/70 border-b border-base-200 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsConsoleExpanded(!isConsoleExpanded)}
                  className="btn btn-xs btn-ghost gap-1 text-base-content/80 font-bold"
                >
                  Console {isConsoleExpanded ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
                </button>

                {isConsoleExpanded && (
                  <div className="flex gap-1 ml-2 border-l border-base-300 pl-2">
                    <button
                      className={`btn btn-xs ${activeConsoleTab === 'testcase' ? 'btn-neutral font-bold' : 'btn-ghost opacity-60'}`}
                      onClick={() => setActiveConsoleTab('testcase')}
                    >
                      Testcase
                    </button>
                    <button
                      className={`btn btn-xs ${activeConsoleTab === 'result' ? 'btn-neutral font-bold' : 'btn-ghost opacity-60'}`}
                      onClick={() => setActiveConsoleTab('result')}
                    >
                      Test Result
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons (Run & Submit) in Bottom Right */}
              <div className="flex items-center gap-2">
                <button
                  className={`btn btn-xs btn-outline btn-success gap-1.5 ${isRunning ? 'btn-disabled' : ''}`}
                  onClick={handleRun}
                  disabled={isRunning || isSubmitting}
                >
                  {isRunning ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
                  {isRunning ? 'Running...' : 'Run'}
                </button>
                <button
                  className={`btn btn-xs btn-primary gap-1.5 ${isSubmitting ? 'btn-disabled' : ''}`}
                  onClick={handleSubmitCode}
                  disabled={isRunning || isSubmitting}
                >
                  {isSubmitting ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>

            {/* Console Drawer Expanded Content Area */}
            {isConsoleExpanded && (
              <div className="flex-1 overflow-y-auto p-4 text-xs select-text">
                {/* 1. TESTCASE TAB (Example Testcases) */}
                {activeConsoleTab === 'testcase' && (
                  <div className="space-y-3">
                    {/* Case Tabs */}
                    <div className="flex gap-2 border-b border-base-200 pb-2">
                      {problem?.visibleTestCases?.map((_, idx) => (
                        <button
                          key={idx}
                          className={`btn btn-xs ${selectedTestCaseIdx === idx ? 'btn-primary' : 'btn-ghost opacity-60'}`}
                          onClick={() => setSelectedTestCaseIdx(idx)}
                        >
                          Case {idx + 1}
                        </button>
                      ))}
                    </div>

                    {/* Selected Case Content */}
                    {problem?.visibleTestCases?.[selectedTestCaseIdx] && (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <div className="font-semibold text-base-content/70">Input:</div>
                          <div className="bg-base-200 p-2.5 rounded-lg font-mono text-xs border border-base-300">
                            {problem.visibleTestCases[selectedTestCaseIdx].input}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="font-semibold text-base-content/70">Expected Output:</div>
                          <div className="bg-base-200 p-2.5 rounded-lg font-mono text-xs border border-base-300">
                            {problem.visibleTestCases[selectedTestCaseIdx].output}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. TEST RESULT TAB (Judging & Execution Output) */}
                {activeConsoleTab === 'result' && (
                  <div>
                    {/* Judging / Running Loading Spinner */}
                    {(isRunning || isSubmitting) && (
                      <div className="flex flex-col items-center justify-center p-8 space-y-3">
                        <Loader2 size={32} className="animate-spin text-primary" />
                        <span className="font-bold text-sm tracking-wide text-primary">
                          {isSubmitting ? 'Judging & Evaluating Hidden Testcases...' : 'Running Code on Example Testcases...'}
                        </span>
                      </div>
                    )}

                    {/* Run Results View */}
                    {!isRunning && !isSubmitting && runResult && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-base-200 pb-2">
                          <div className="flex items-center gap-2">
                            {runResult.success ? (
                              <span className="text-success font-extrabold text-base flex items-center gap-1">
                                <CheckCircle2 size={18} /> Accepted
                              </span>
                            ) : (
                              <span className="text-error font-extrabold text-base flex items-center gap-1">
                                <XCircle size={18} /> Wrong Answer / Error
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs font-mono text-base-content/70">
                            <span>Runtime: <strong>{runResult.runtime}s</strong></span>
                            <span>Memory: <strong>{runResult.memory} KB</strong></span>
                          </div>
                        </div>

                        {/* Per Testcase Results */}
                        <div className="flex gap-2">
                          {runResult.testCases?.map((tc, idx) => (
                            <button
                              key={idx}
                              className={`btn btn-xs gap-1 ${selectedTestCaseIdx === idx ? 'btn-neutral' : 'btn-ghost opacity-60'}`}
                              onClick={() => setSelectedTestCaseIdx(idx)}
                            >
                              {tc.status_id === 3 ? (
                                <span className="text-success">✓</span>
                              ) : (
                                <span className="text-error">✗</span>
                              )}
                              Case {idx + 1}
                            </button>
                          ))}
                        </div>

                        {runResult.testCases?.[selectedTestCaseIdx] && (
                          <div className="space-y-3">
                            <div className="bg-base-200 p-3 rounded-xl border border-base-300 space-y-2 font-mono text-xs">
                              <div><span className="text-base-content/60 font-sans font-bold">Input:</span> {runResult.testCases[selectedTestCaseIdx].stdin}</div>
                              <div><span className="text-base-content/60 font-sans font-bold">Expected Output:</span> {runResult.testCases[selectedTestCaseIdx].expected_output}</div>
                              <div><span className="text-base-content/60 font-sans font-bold">Actual Output:</span> <span className={runResult.testCases[selectedTestCaseIdx].status_id === 3 ? 'text-success font-bold' : 'text-error font-bold'}>{runResult.testCases[selectedTestCaseIdx].stdout || 'No output'}</span></div>
                            </div>

                            {/* Formatted Compiler / Execution Error Box */}
                            {(runResult.testCases[selectedTestCaseIdx].stderr || runResult.testCases[selectedTestCaseIdx].compile_output) && (
                              <div className="space-y-1.5 pt-1">
                                <div className="text-xs font-bold text-error flex items-center gap-1">
                                  <AlertTriangle size={14} /> Compiler / Runtime Log:
                                </div>
                                <div className="bg-slate-950 text-red-400 font-mono text-xs p-3 rounded-xl border border-red-900/60 leading-relaxed whitespace-pre-wrap overflow-x-auto shadow-md">
                                  {runResult.testCases[selectedTestCaseIdx].stderr || runResult.testCases[selectedTestCaseIdx].compile_output}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Submit Results View */}
                    {!isRunning && !isSubmitting && submitResult && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-base-200 pb-2">
                          <div className="flex items-center gap-2">
                            {submitResult.accepted ? (
                              <span className="text-success font-extrabold text-lg flex items-center gap-1.5">
                                <CheckCircle2 size={22} /> Accepted
                              </span>
                            ) : (
                              <span className="text-error font-extrabold text-lg flex items-center gap-1.5">
                                <XCircle size={22} /> {submitResult.error || 'Wrong Answer'}
                              </span>
                            )}
                          </div>

                          <div className="badge badge-neutral text-xs font-mono">
                            Passed: {submitResult.passedTestCases} / {submitResult.totalTestCases}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-base-200 p-3 rounded-xl border border-base-300">
                          <div><span className="text-base-content/60 font-sans">Runtime:</span> <strong>{submitResult.runtime}s</strong></div>
                          <div><span className="text-base-content/60 font-sans">Memory:</span> <strong>{submitResult.memory} KB</strong></div>
                        </div>

                        {/* Failed Testcase Display & Add to Example Cases Option */}
                        {!submitResult.accepted && submitResult.failedTestCase && (
                          <div className="bg-base-200 p-3.5 rounded-xl border border-error/30 space-y-3 mt-3">
                            <div className="flex items-center justify-between border-b border-base-300 pb-2">
                              <span className="font-bold text-xs text-error flex items-center gap-1">
                                <XCircle size={14} /> Failed Test Case Details:
                              </span>
                              <button
                                onClick={() => handleAddToExampleCases(submitResult.failedTestCase.input, submitResult.failedTestCase.output)}
                                className="btn btn-xs btn-outline btn-primary gap-1 font-bold"
                              >
                                <PlusCircle size={13} /> Add to Example Cases
                              </button>
                            </div>

                            <div className="font-mono text-xs space-y-1.5">
                              <div><span className="text-base-content/60 font-sans font-semibold">Input:</span> {submitResult.failedTestCase.input}</div>
                              <div><span className="text-base-content/60 font-sans font-semibold">Expected Output:</span> {submitResult.failedTestCase.output}</div>
                              <div><span className="text-base-content/60 font-sans font-semibold">Actual Output:</span> <span className="text-error font-bold">{submitResult.failedTestCase.actualOutput || 'No output'}</span></div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {!isRunning && !isSubmitting && !runResult && !submitResult && (
                      <div className="text-base-content/50 italic py-4">
                        Click "Run" to test example test cases or "Submit" to evaluate your solution.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
