import { NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../authSlice';
import { Flame, User, LogOut, ShieldAlert, Code2, ChevronRight, CheckCircle2, Trophy, Sparkles } from 'lucide-react';

function Navbar({ title }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const initial = user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U';
  const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Developer';
  const userHandle = user?.username ? `@${user.username}` : `@${user?.emailId?.split('@')[0] || 'user'}`;
  const solvedCount = user?.problemSolved?.length || 0;

  return (
    <nav className="navbar bg-slate-900 border-b border-slate-800 px-4 md:px-6 min-h-14 shadow-xl flex justify-between items-center z-[999] text-slate-100 select-none relative">
      {/* Left: Logo & Primary Navigation Links */}
      <div className="flex items-center gap-3">
        {/* CodeForge Logo */}
        <NavLink to="/" className="btn btn-ghost text-base font-black tracking-tight text-white gap-2 px-2 hover:bg-slate-800/80 rounded-xl transition-all">
          <div className="p-1.5 bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 rounded-lg text-white shadow-md shadow-amber-500/20">
            <Flame size={18} className="animate-pulse" />
          </div>
          <span className="bg-gradient-to-r from-white via-slate-100 to-amber-400 bg-clip-text text-transparent font-black text-lg">
            CodeForge
          </span>
        </NavLink>

        {/* Current Context Breadcrumb Badge */}
        {title && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 pl-1 border-l border-slate-800">
            <ChevronRight size={13} className="text-slate-600" />
            <span className="font-bold text-slate-200 bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800 text-[11px] truncate max-w-[200px]">
              {title}
            </span>
          </div>
        )}

        {/* Primary Nav Links */}
        <div className="hidden md:flex items-center gap-1 ml-4 text-xs font-bold">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `btn btn-xs gap-1.5 rounded-lg px-3 transition-all ${
                isActive
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 font-extrabold shadow-sm'
                  : 'btn-ghost text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`
            }
          >
            <Code2 size={13} /> Problems
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `btn btn-xs gap-1.5 rounded-lg px-3 transition-all ${
                isActive
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 font-extrabold shadow-sm'
                  : 'btn-ghost text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`
            }
          >
            <User size={13} /> Profile
          </NavLink>

          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `btn btn-xs gap-1.5 rounded-lg px-3 transition-all ${
                  isActive
                    ? 'bg-amber-950/80 text-amber-400 border border-amber-800/80 font-extrabold shadow-sm'
                    : 'btn-ghost text-amber-400/80 hover:text-amber-300 hover:bg-amber-950/40'
                }`
              }
            >
              <ShieldAlert size={13} /> Admin Panel
            </NavLink>
          )}
        </div>
      </div>

      {/* Center: Real Daily Practice Streak & Solved Pill */}
      <NavLink
        to="/profile"
        className="hidden lg:flex items-center gap-2 bg-slate-950 hover:bg-slate-800/80 px-3 py-1 rounded-xl border border-slate-800 text-xs shadow-inner cursor-pointer transition-colors"
        title="View your daily solving streak and profile"
      >
        <Flame size={14} className="text-amber-400 animate-bounce shrink-0" />
        <span className="font-bold text-slate-300 text-[11px]">Daily Streak</span>
        <span className="badge bg-amber-500/10 text-amber-400 border-amber-800/60 badge-xs font-mono font-bold px-1.5">
          {solvedCount > 0 ? `${solvedCount} Solved` : 'Active Goal'}
        </span>
      </NavLink>

      {/* Right: User Profile & Dropdown */}
      <div className="flex items-center gap-3">
        {user ? (
          <div className="dropdown dropdown-end relative z-[1000]">
            <div
              tabIndex={0}
              role="button"
              className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-800/80 transition-colors cursor-pointer group"
            >
              {/* Desktop Name Label */}
              <div className="hidden md:flex flex-col text-right leading-tight">
                <span className="font-bold text-xs text-slate-100 group-hover:text-emerald-400 transition-colors">
                  {fullName}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{userHandle}</span>
              </div>

              {/* Avatar Circle */}
              <div className="w-8 h-8 rounded-full overflow-hidden border border-emerald-500/80 shadow-md shrink-0 flex items-center justify-center bg-slate-800">
                {user.profilePic ? (
                  <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 text-slate-100 flex items-center justify-center font-extrabold text-xs leading-none">
                    <span className="translate-y-[0.5px]">{initial}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Dropdown Menu */}
            <ul
              tabIndex={0}
              className="mt-2 p-2 shadow-2xl menu menu-sm dropdown-content bg-slate-900 border border-slate-800 rounded-2xl w-60 z-[1000] space-y-1 text-slate-200 right-0"
            >
              <li className="px-3 py-2.5 border-b border-slate-800 bg-slate-950/60 rounded-xl mb-1">
                <div className="font-bold text-xs text-slate-100">{fullName}</div>
                <div className="text-[10px] text-slate-400 truncate font-mono">{user.emailId}</div>
                {user.role === 'admin' && (
                  <span className="badge badge-xs bg-amber-950 text-amber-400 border border-amber-800 uppercase text-[9px] mt-1 font-bold">
                    Admin Access
                  </span>
                )}
              </li>

              <li>
                <NavLink to="/profile" className="gap-2 text-xs font-bold hover:bg-slate-800 rounded-lg">
                  <User size={14} className="text-emerald-400" /> My Profile
                </NavLink>
              </li>

              <li>
                <NavLink to="/" end className="gap-2 text-xs font-bold hover:bg-slate-800 rounded-lg">
                  <Code2 size={14} className="text-sky-400" /> Problems List
                </NavLink>
              </li>

              {user.role === 'admin' && (
                <li>
                  <NavLink to="/admin" className="gap-2 text-xs font-bold hover:bg-slate-800 rounded-lg">
                    <ShieldAlert size={14} className="text-amber-400" /> Admin Dashboard
                  </NavLink>
                </li>
              )}

              <li className="border-t border-slate-800 pt-1">
                <button onClick={handleLogout} className="gap-2 text-xs text-rose-400 font-bold hover:bg-slate-800 rounded-lg">
                  <LogOut size={14} /> Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <NavLink to="/login" className="btn btn-xs btn-ghost text-slate-300 hover:text-white">
              Login
            </NavLink>
            <NavLink to="/signup" className="btn btn-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold border-0 rounded-lg shadow-md">
              Sign Up
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
