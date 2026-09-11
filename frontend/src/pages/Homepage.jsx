import { useEffect, useState, useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import Navbar from '../components/Navbar';
import { CheckCircle2, Code2, Search, Flame, Shuffle, ChevronDown, XCircle } from 'lucide-react';

function Homepage() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    // 1. Instant Problem Fetch
    const fetchAllProblems = async () => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get('/problem/getAllProblem');
        setProblems(data || []);
      } catch (error) {
        console.error('Error fetching problems:', error);
      } finally {
        setLoading(false);
      }
    };

    // 2. Parallel Background Solved User Sync
    const fetchSolvedProblems = async () => {
      if (!user) return;
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        setSolvedProblems(data || []);
      } catch (error) {
        console.error('Error fetching solved list:', error);
      }
    };

    fetchAllProblems();
    fetchSolvedProblems();
  }, [user]);

  // Derived Solved IDs Set
  const solvedIds = useMemo(() => {
    const ids = new Set();
    solvedProblems.forEach(p => {
      if (p?._id) ids.add(String(p._id));
    });
    if (Array.isArray(user?.problemSolved)) {
      user.problemSolved.forEach(p => {
        const idStr = typeof p === 'object' ? p._id || p : String(p);
        if (idStr) ids.add(String(idStr));
      });
    }
    return ids;
  }, [user, solvedProblems]);

  // Filter Logic
  const filteredProblems = problems.filter(problem => {
    const titleMatch = problem.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       problem.tags?.toLowerCase().includes(searchQuery.toLowerCase());
    const difficultyMatch = selectedDifficulty === 'all' || problem.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase();
    const tagMatch = selectedTag === 'all' || problem.tags?.toLowerCase() === selectedTag.toLowerCase();
    const isSolved = solvedIds.has(String(problem._id));
    const statusMatch = selectedStatus === 'all' ||
                        (selectedStatus === 'solved' && isSolved) ||
                        (selectedStatus === 'unsolved' && !isSolved);

    return titleMatch && difficultyMatch && tagMatch && statusMatch;
  });

  // Handle Pick Random Unsolved Problem
  const handlePickRandom = () => {
    const unsolved = problems.filter(p => !solvedIds.has(String(p._id)));
    const pool = unsolved.length > 0 ? unsolved : problems;
    if (pool.length > 0) {
      const randomProb = pool[Math.floor(Math.random() * pool.length)];
      navigate(`/problem/${randomProb._id}`);
    }
  };

  // Mathematically Consistent Counts
  const totalCount = problems.length;

  const easyCount = problems.filter(p => p.difficulty?.toLowerCase() === 'easy').length;
  const mediumCount = problems.filter(p => p.difficulty?.toLowerCase() === 'medium').length;
  const hardCount = problems.filter(p => p.difficulty?.toLowerCase() === 'hard').length;

  const easySolved = problems.filter(p => p.difficulty?.toLowerCase() === 'easy' && solvedIds.has(String(p._id))).length;
  const mediumSolved = problems.filter(p => p.difficulty?.toLowerCase() === 'medium' && solvedIds.has(String(p._id))).length;
  const hardSolved = problems.filter(p => p.difficulty?.toLowerCase() === 'hard' && solvedIds.has(String(p._id))).length;

  const solvedCount = easySolved + mediumSolved + hardSolved;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 select-none">
      {/* Universal Top Navbar */}
      <Navbar />

      <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-6xl">
        {/* Top Progress & Quick Action Header Card */}
        <div className="card bg-slate-900 border border-slate-800 p-6 shadow-2xl rounded-2xl relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            {/* User Greeting & Streak */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-gradient-to-tr from-amber-500 to-red-600 rounded-lg text-white shadow-md">
                  <Flame size={18} />
                </span>
                <h1 className="text-2xl font-black tracking-tight text-white">
                  Welcome back, {user?.firstName || 'Developer'}!
                </h1>
              </div>
              <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
                Forge your DSA skills. Practice handcrafted problems, execute code across 5 languages, and get instant guidance from your AI Tutor.
              </p>
            </div>

            {/* Quick Metrics Bar & Random Pick Button */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 flex items-center gap-3 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px] font-sans">Solved</span>
                  <span className="font-extrabold text-emerald-400">{solvedCount} / {totalCount}</span>
                </div>
                <div className="h-6 w-px bg-slate-800"></div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-sans">Easy</span>
                  <span className="font-extrabold text-emerald-400">{easySolved}/{easyCount}</span>
                </div>
                <div className="h-6 w-px bg-slate-800"></div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-sans">Medium</span>
                  <span className="font-extrabold text-amber-400">{mediumSolved}/{mediumCount}</span>
                </div>
                <div className="h-6 w-px bg-slate-800"></div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-sans">Hard</span>
                  <span className="font-extrabold text-rose-400">{hardSolved}/{hardCount}</span>
                </div>
              </div>

              {/* Pick Random Button */}
              <button
                onClick={handlePickRandom}
                className="btn btn-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black border-0 gap-1.5 shadow-lg rounded-xl cursor-pointer"
                title="Pick a random unsolved problem"
              >
                <Shuffle size={14} /> Pick Random
              </button>
            </div>
          </div>
        </div>

        {/* Smart Search & Filter Control Bar */}
        <div className="card bg-slate-900 border border-slate-800 p-4 shadow-xl rounded-2xl space-y-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Live Search Box */}
            <div className="relative w-full md:w-80">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                <Search size={15} />
              </span>
              <input
                type="text"
                placeholder="Search problem title or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-sm bg-slate-950 border border-slate-800 text-slate-100 pl-9 pr-8 w-full rounded-xl text-xs focus:border-emerald-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-500 hover:text-slate-300"
                >
                  <XCircle size={14} />
                </button>
              )}
            </div>

            {/* Custom Dark Theme Popover Dropdowns */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs">
              {/* 1. Custom Difficulty Popover */}
              <div className="dropdown dropdown-bottom">
                <div tabIndex={0} role="button" className="btn btn-sm bg-slate-950 border border-slate-800 text-slate-200 hover:bg-slate-800 font-bold gap-1.5 px-3 rounded-xl text-xs">
                  <span>{selectedDifficulty === 'all' ? 'All Difficulties' : selectedDifficulty.toUpperCase()}</span>
                  <ChevronDown size={12} className="opacity-60" />
                </div>
                <ul tabIndex={0} className="dropdown-content menu p-1.5 shadow-2xl bg-slate-900 border border-slate-800 rounded-2xl w-44 z-[100] mt-1 text-xs text-slate-200 space-y-0.5">
                  {[
                    { id: 'all', label: 'All Difficulties' },
                    { id: 'easy', label: `Easy (${easyCount})` },
                    { id: 'medium', label: `Medium (${mediumCount})` },
                    { id: 'hard', label: `Hard (${hardCount})` }
                  ].map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          setSelectedDifficulty(item.id);
                          if (document.activeElement) document.activeElement.blur();
                        }}
                        className={`flex items-center justify-between py-1.5 px-2.5 rounded-xl transition-colors ${selectedDifficulty === item.id ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'hover:bg-slate-800 text-slate-300'}`}
                      >
                        <span>{item.label}</span>
                        {selectedDifficulty === item.id && <span className="text-emerald-400 font-bold">✓</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 2. Custom Category Tag Popover */}
              <div className="dropdown dropdown-bottom">
                <div tabIndex={0} role="button" className="btn btn-sm bg-slate-950 border border-slate-800 text-slate-200 hover:bg-slate-800 font-bold gap-1.5 px-3 rounded-xl text-xs">
                  <span>{selectedTag === 'all' ? 'All Category Tags' : selectedTag === 'linkedList' ? 'Linked List' : selectedTag.toUpperCase()}</span>
                  <ChevronDown size={12} className="opacity-60" />
                </div>
                <ul tabIndex={0} className="dropdown-content menu p-1.5 shadow-2xl bg-slate-900 border border-slate-800 rounded-2xl w-48 z-[100] mt-1 text-xs text-slate-200 space-y-0.5">
                  {[
                    { id: 'all', label: 'All Category Tags' },
                    { id: 'array', label: 'Array' },
                    { id: 'linkedList', label: 'Linked List' },
                    { id: 'graph', label: 'Graph' },
                    { id: 'dp', label: 'Dynamic Programming' }
                  ].map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          setSelectedTag(item.id);
                          if (document.activeElement) document.activeElement.blur();
                        }}
                        className={`flex items-center justify-between py-1.5 px-2.5 rounded-xl transition-colors ${selectedTag === item.id ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'hover:bg-slate-800 text-slate-300'}`}
                      >
                        <span>{item.label}</span>
                        {selectedTag === item.id && <span className="text-emerald-400 font-bold">✓</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. Custom Status Popover */}
              <div className="dropdown dropdown-bottom">
                <div tabIndex={0} role="button" className="btn btn-sm bg-slate-950 border border-slate-800 text-slate-200 hover:bg-slate-800 font-bold gap-1.5 px-3 rounded-xl text-xs">
                  <span>{selectedStatus === 'all' ? 'All Status' : selectedStatus === 'solved' ? 'Solved (✓)' : 'Unsolved'}</span>
                  <ChevronDown size={12} className="opacity-60" />
                </div>
                <ul tabIndex={0} className="dropdown-content menu p-1.5 shadow-2xl bg-slate-900 border border-slate-800 rounded-2xl w-40 z-[100] mt-1 text-xs text-slate-200 space-y-0.5">
                  {[
                    { id: 'all', label: 'All Status' },
                    { id: 'solved', label: 'Solved (✓)' },
                    { id: 'unsolved', label: 'Unsolved' }
                  ].map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          setSelectedStatus(item.id);
                          if (document.activeElement) document.activeElement.blur();
                        }}
                        className={`flex items-center justify-between py-1.5 px-2.5 rounded-xl transition-colors ${selectedStatus === item.id ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'hover:bg-slate-800 text-slate-300'}`}
                      >
                        <span>{item.label}</span>
                        {selectedStatus === item.id && <span className="text-emerald-400 font-bold">✓</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* LeetCode Style Problem Table */}
        <div className="card bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center p-16 text-emerald-400">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : filteredProblems.length === 0 ? (
            <div className="p-12 text-center space-y-2 text-slate-400 text-xs">
              <p className="font-bold text-slate-300">No problems match your current search / filters.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedDifficulty('all'); setSelectedTag('all'); setSelectedStatus('all'); }}
                className="btn btn-xs btn-ghost text-emerald-400 font-bold underline"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                    <th className="w-12 text-center">Status</th>
                    <th className="w-12">#</th>
                    <th>Problem Title</th>
                    <th className="w-28">Difficulty</th>
                    <th className="w-32">Category</th>
                    <th className="w-24 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredProblems.map((problem, index) => {
                    const isSolved = solvedIds.has(String(problem._id));

                    return (
                      <tr key={problem._id} className="hover:bg-slate-800/40 transition-colors">
                        {/* Status Column */}
                        <td className="text-center">
                          {isSolved ? (
                            <CheckCircle2 size={16} className="text-emerald-400 inline-block" title="Solved" />
                          ) : (
                            <span className="text-slate-700 text-sm font-bold">-</span>
                          )}
                        </td>

                        {/* Index Column */}
                        <td className="font-mono text-slate-500">{index + 1}</td>

                        {/* Problem Title */}
                        <td>
                          <NavLink
                            to={`/problem/${problem._id}`}
                            className="font-bold text-slate-100 hover:text-emerald-400 transition-colors flex items-center gap-2"
                          >
                            <span>{problem.title}</span>
                          </NavLink>
                        </td>

                        {/* Difficulty Badge */}
                        <td>
                          <span className={`badge badge-sm font-bold uppercase text-[10px] ${
                            problem.difficulty?.toLowerCase() === 'easy'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : problem.difficulty?.toLowerCase() === 'medium'
                                ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}>
                            {problem.difficulty}
                          </span>
                        </td>

                        {/* Tag Badge */}
                        <td>
                          <span className="badge bg-slate-950 text-slate-400 border border-slate-800 badge-sm font-mono text-[10px]">
                            {problem.tags}
                          </span>
                        </td>

                        {/* Solve Button */}
                        <td className="text-right">
                          <NavLink
                            to={`/problem/${problem._id}`}
                            className="btn btn-xs bg-slate-800 hover:bg-emerald-950 hover:text-emerald-400 text-slate-200 border border-slate-700 gap-1 rounded-lg font-bold"
                          >
                            <Code2 size={12} /> Solve
                          </NavLink>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Homepage;
