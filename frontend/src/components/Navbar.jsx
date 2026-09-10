import { NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../authSlice';
import { Flame, User, LogOut, ShieldAlert, Code2 } from 'lucide-react';

function Navbar({ title }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const initial = user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U';

  return (
    <nav className="navbar bg-base-100 border-b border-base-200 px-4 min-h-14 shadow-sm flex justify-between items-center z-50">
      {/* Left: Brand / Title */}
      <div className="flex items-center gap-3">
        <NavLink to="/" className="btn btn-ghost text-lg font-black tracking-tight text-white gap-2 px-2">
          <div className="p-1.5 bg-gradient-to-tr from-amber-500 to-red-600 rounded-lg text-white shadow-md">
            <Flame size={18} />
          </div>
          <span className="bg-gradient-to-r from-white via-slate-200 to-amber-400 bg-clip-text text-transparent font-extrabold">
            CodeForge
          </span>
        </NavLink>

        {title && (
          <>
            <span className="text-base-content/30">|</span>
            <span className="font-semibold text-sm text-base-content">{title}</span>
          </>
        )}

        <div className="hidden md:flex items-center gap-1 ml-4 text-xs font-semibold">
          <NavLink to="/" className={({ isActive }) => `btn btn-xs ${isActive ? 'btn-neutral' : 'btn-ghost opacity-70'}`}>
            <Code2 size={13} /> Problems
          </NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => `btn btn-xs ${isActive ? 'btn-neutral' : 'btn-ghost opacity-70'}`}>
              <ShieldAlert size={13} /> Admin Panel
            </NavLink>
          )}
        </div>
      </div>

      {/* Right: User Profile Avatar Dropdown */}
      <div className="flex items-center gap-3">
        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              {user.profilePic ? (
                <div className="w-9 h-9 rounded-full overflow-hidden shadow-md">
                  <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="bg-primary text-primary-content rounded-full w-9 h-9 flex items-center justify-center font-bold text-sm shadow-md">
                  {initial}
                </div>
              )}
            </div>
            <ul
              tabIndex={0}
              className="mt-3 p-2 shadow-lg menu menu-sm dropdown-content bg-base-100 rounded-xl w-56 border border-base-200 z-[100] space-y-1"
            >
              <li className="px-3 py-2 border-b border-base-200">
                <div className="font-bold text-sm text-base-content">{user.firstName}</div>
                <div className="text-xs text-base-content/60 truncate">{user.emailId}</div>
                {user.role === 'admin' && (
                  <span className="badge badge-xs badge-warning uppercase text-[10px] mt-1 font-bold">Admin</span>
                )}
              </li>
              <li>
                <NavLink to="/profile" className="gap-2 font-medium">
                  <User size={15} /> My Profile
                </NavLink>
              </li>
              {user.role === 'admin' && (
                <li>
                  <NavLink to="/admin" className="gap-2 font-medium">
                    <ShieldAlert size={15} /> Admin Dashboard
                  </NavLink>
                </li>
              )}
              <li className="border-t border-base-200 pt-1">
                <button onClick={handleLogout} className="gap-2 text-error font-medium">
                  <LogOut size={15} /> Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
            <NavLink to="/login" className="btn btn-sm btn-ghost">Login</NavLink>
            <NavLink to="/signup" className="btn btn-sm btn-primary">Sign Up</NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
