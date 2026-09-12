import { useState, useEffect, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router';
import Navbar from '../components/Navbar';
import axiosClient from '../utils/axiosClient';
import { logoutUser, checkAuth } from '../authSlice';
import { CheckCircle2, Award, LogOut, Code2, ShieldAlert, Camera, Loader2, Edit3, Key, Mail, Github, Linkedin, Target, Activity } from 'lucide-react';

function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [allProblems, setAllProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [userStats, setUserStats] = useState({ totalSubmissions: 0, acceptedSubmissions: 0, accuracy: 0 });
  const [loading, setLoading] = useState(true);
  const [uploadingImg, setUploadingImg] = useState(false);

  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    bio: user?.bio || '',
    githubUrl: user?.githubUrl || '',
    linkedinUrl: user?.linkedinUrl || '',
    newPassword: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setEditForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        bio: user.bio || '',
        githubUrl: user.githubUrl || '',
        linkedinUrl: user.linkedinUrl || '',
        newPassword: ''
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [probsRes, solvedRes, statsRes] = await Promise.all([
          axiosClient.get('/problem/getAllProblem'),
          axiosClient.get('/problem/problemSolvedByUser').catch(() => ({ data: [] })),
          axiosClient.get('/problem/userStats').catch(() => ({ data: { accuracy: 0, totalSubmissions: 0, acceptedSubmissions: 0 } }))
        ]);
        setAllProblems(probsRes.data || []);
        setSolvedProblems(solvedRes.data || []);
        setUserStats(statsRes.data || { accuracy: 0, totalSubmissions: 0, acceptedSubmissions: 0 });
      } catch (err) {
        console.error('Error fetching profile stats:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  // Avatar Upload Handler
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB.');
      return;
    }

    setUploadingImg(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Image = reader.result;

        await axiosClient.post('/user/update-avatar', {
          profilePic: base64Image
        });

        dispatch(checkAuth());
        setUploadingImg(false);
      };
    } catch (err) {
      console.error('Failed to upload profile picture:', err);
      alert('Failed to update profile picture. Please try again.');
      setUploadingImg(false);
    }
  };

  // Profile Update Submit Handler
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      await axiosClient.post('/user/update-profile', editForm);
      await dispatch(checkAuth());
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile: ' + (err.response?.data || err.message));
    } finally {
      setSavingProfile(false);
    }
  };

  // Solved List (0ms sync from Redux user state + background fetch)
  const displaySolved = useMemo(() => {
    if (solvedProblems.length > 0) return solvedProblems;
    if (Array.isArray(user?.problemSolved) && allProblems.length > 0) {
      const ids = new Set(user.problemSolved.map(p => String(typeof p === 'object' ? p._id || p : p)));
      return allProblems.filter(p => ids.has(String(p._id)));
    }
    return [];
  }, [solvedProblems, user, allProblems]);

  // Dynamic Counts based on actual DB problems
  const totalQuestions = allProblems.length;

  const totalEasy = allProblems.filter((p) => p.difficulty?.toLowerCase() === 'easy').length;
  const totalMedium = allProblems.filter((p) => p.difficulty?.toLowerCase() === 'medium').length;
  const totalHard = allProblems.filter((p) => p.difficulty?.toLowerCase() === 'hard').length;

  const easySolved = displaySolved.filter((p) => p.difficulty?.toLowerCase() === 'easy').length;
  const mediumSolved = displaySolved.filter((p) => p.difficulty?.toLowerCase() === 'medium').length;
  const hardSolved = displaySolved.filter((p) => p.difficulty?.toLowerCase() === 'hard').length;

  const solvedCount = displaySolved.length || easySolved + mediumSolved + hardSolved;

  const initial = user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U';
  const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User';
  const userHandle = user?.username ? `@${user.username}` : `@${user?.emailId?.split('@')[0] || 'user'}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 select-none">
      <Navbar title="User Profile" />

      <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-6xl">
        {/* Hidden File Input for Avatar Upload */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />

        {/* LeetCode Style Top Section Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: User Profile Card */}
          <div className="card bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-4">
              {/* Clickable Large Avatar Circle with Sleek Edit Button Overlay */}
              <div className="relative group shrink-0">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-emerald-500/80 shadow-lg flex items-center justify-center bg-slate-800 text-slate-200">
                  {user?.profilePic ? (
                    <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-extrabold">{initial}</span>
                  )}
                </div>

                {/* Hover Camera/Edit Badge Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-full shadow-md transition-transform hover:scale-110 cursor-pointer"
                  title="Edit Avatar / Change Photo"
                >
                  {uploadingImg ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : user?.profilePic ? (
                    <Edit3 size={13} />
                  ) : (
                    <Camera size={13} />
                  )}
                </button>
              </div>

              {/* Basic Details */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-white">{fullName}</h1>
                  <span className={`badge ${user?.role === 'admin' ? 'badge-warning' : 'badge-neutral'} uppercase font-bold text-[10px]`}>
                    {user?.role}
                  </span>
                </div>
                <div className="text-xs font-semibold text-emerald-400 font-mono">{userHandle}</div>
                <p className="text-xs text-slate-400 italic leading-relaxed">{user?.bio || 'Beginner with learning mindset...'}</p>
              </div>
            </div>

            {/* Email & Badges Row */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2 text-slate-400">
                <Mail size={13} className="text-slate-500" />
                <span className="truncate">{user?.emailId}</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 font-mono text-xs">
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  <span className="text-slate-200 font-bold">{solvedCount} Solved</span>
                </div>
                <div
                  className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 font-mono text-xs"
                  title={`Accepted Submissions: ${userStats.acceptedSubmissions} / Total Attempts: ${userStats.totalSubmissions}`}
                >
                  <Activity size={13} className="text-amber-400" />
                  <span className="text-slate-200 font-bold">{userStats.accuracy}% Accuracy</span>
                  <span className="text-slate-500 text-[10px]">({userStats.acceptedSubmissions}/{userStats.totalSubmissions})</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn btn-xs bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 gap-1 rounded-lg font-bold"
              >
                <Edit3 size={12} /> Edit Profile
              </button>
              {user?.role === 'admin' && (
                <NavLink to="/admin" className="btn btn-xs btn-warning gap-1 rounded-lg">
                  <ShieldAlert size={12} /> Admin
                </NavLink>
              )}
              <button onClick={handleLogout} className="btn btn-xs btn-outline btn-error gap-1 rounded-lg">
                <LogOut size={12} /> Logout
              </button>
            </div>
          </div>

          {/* Right Column: LeetCode Style Problem Progress Grid */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Total Solved Metric Card */}
            <div className="card bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5">
                  <Target size={14} className="text-emerald-400" /> Total Solved Progress
                </h3>
                <span className="text-xs font-mono text-slate-400">Total: {totalQuestions}</span>
              </div>

              {loading ? (
                <div className="py-6 flex justify-center text-emerald-400">
                  <span className="loading loading-spinner loading-md"></span>
                </div>
              ) : (
                <>
                  <div className="py-4 flex items-baseline gap-3">
                    <span className="text-5xl font-black text-emerald-400 tracking-tight">{solvedCount}</span>
                    <span className="text-slate-400 text-base font-bold font-mono">/ {totalQuestions} Solved</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-400">
                      <span>Overall Progress</span>
                      <span className="text-emerald-400 font-mono">{totalQuestions > 0 ? Math.round((solvedCount / totalQuestions) * 100) : 0}%</span>
                    </div>
                    <progress className="progress progress-emerald w-full" value={solvedCount} max={totalQuestions || 1}></progress>
                  </div>
                </>
              )}
            </div>

            {/* Easy Progress Card */}
            <div className="card bg-slate-900 border border-slate-800 p-5 space-y-3 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="badge bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold text-xs uppercase px-2 py-0.5">
                  Easy
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">{easySolved} / {totalEasy}</span>
              </div>
              <div className="text-3xl font-extrabold text-emerald-400 font-mono">{easySolved}</div>
              <progress className="progress progress-success w-full" value={easySolved} max={totalEasy || 1}></progress>
            </div>

            {/* Medium Progress Card */}
            <div className="card bg-slate-900 border border-slate-800 p-5 space-y-3 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="badge bg-amber-950 text-amber-400 border border-amber-800 font-bold text-xs uppercase px-2 py-0.5">
                  Medium
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">{mediumSolved} / {totalMedium}</span>
              </div>
              <div className="text-3xl font-extrabold text-amber-400 font-mono">{mediumSolved}</div>
              <progress className="progress progress-warning w-full" value={mediumSolved} max={totalMedium || 1}></progress>
            </div>

            {/* Hard Progress Card */}
            <div className="card bg-slate-900 border border-slate-800 p-5 space-y-3 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="badge bg-rose-950 text-rose-400 border border-rose-800 font-bold text-xs uppercase px-2 py-0.5">
                  Hard
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">{hardSolved} / {totalHard}</span>
              </div>
              <div className="text-3xl font-extrabold text-rose-400 font-mono">{hardSolved}</div>
              <progress className="progress progress-error w-full" value={hardSolved} max={totalHard || 1}></progress>
            </div>
          </div>
        </div>

        {/* Edit Profile Form Panel */}
        {isEditing && (
          <div className="card bg-slate-900 border border-emerald-500/40 p-6 shadow-2xl rounded-2xl">
            <h2 className="text-base font-bold mb-4 flex items-center gap-2 border-b border-slate-800 pb-3 text-emerald-400">
              <Edit3 size={16} /> Edit Profile & Account Settings
            </h2>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label font-bold text-slate-300">First Name</label>
                  <input
                    type="text"
                    className="input input-sm bg-slate-950 border border-slate-800 text-slate-100 rounded-lg"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label font-bold text-slate-300">Last Name</label>
                  <input
                    type="text"
                    className="input input-sm bg-slate-950 border border-slate-800 text-slate-100 rounded-lg"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label font-bold text-slate-300">Username</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">@</span>
                    <input
                      type="text"
                      className="input input-sm bg-slate-950 border border-slate-800 text-slate-100 pl-7 w-full rounded-lg"
                      value={editForm.username}
                      onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label font-bold text-slate-300">New Password (Optional)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500"><Key size={13} /></span>
                    <input
                      type="password"
                      placeholder="•••••••• (leave empty to keep current)"
                      className="input input-sm bg-slate-950 border border-slate-800 text-slate-100 pl-8 w-full rounded-lg"
                      value={editForm.newPassword}
                      onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="form-control">
                <label className="label font-bold text-slate-300">Bio / Headline</label>
                <textarea
                  className="textarea bg-slate-950 border border-slate-800 text-slate-100 textarea-sm w-full rounded-lg"
                  rows={2}
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsEditing(false)} className="btn btn-xs btn-ghost text-slate-400">
                  Cancel
                </button>
                <button type="submit" className={`btn btn-xs btn-primary gap-1 font-bold ${savingProfile ? 'loading' : ''}`} disabled={savingProfile}>
                  {savingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* LeetCode Style Solved Problems Table */}
        <div className="card bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold flex items-center gap-2 text-white">
              <CheckCircle2 size={18} className="text-emerald-400" /> Solved Problems ({solvedCount})
            </h2>
            <NavLink to="/" className="btn btn-xs btn-ghost text-emerald-400 font-bold hover:bg-emerald-950/40">
              View All Problems →
            </NavLink>
          </div>

          {loading && displaySolved.length === 0 ? (
            <div className="flex justify-center p-8">
              <span className="loading loading-spinner loading-md text-emerald-400"></span>
            </div>
          ) : displaySolved.length === 0 ? (
            <div className="alert bg-slate-950 border border-slate-800 text-slate-400 text-xs shadow-sm">
              <span>You haven't solved any problems yet. Choose a problem from the <NavLink to="/" className="text-emerald-400 underline font-bold">Problems List</NavLink> to start practicing!</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th>#</th>
                    <th>Problem Title</th>
                    <th>Difficulty</th>
                    <th>Category</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {displaySolved.map((p, idx) => (
                    <tr key={p._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="font-mono text-slate-500">{idx + 1}</td>
                      <td>
                        <NavLink to={`/problem/${p._id}`} className="font-bold text-slate-100 hover:text-emerald-400 transition-colors">
                          {p.title}
                        </NavLink>
                      </td>
                      <td>
                        <span className={`badge badge-sm font-bold uppercase text-[10px] ${
                          p.difficulty?.toLowerCase() === 'easy'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : p.difficulty?.toLowerCase() === 'medium'
                              ? 'bg-amber-950 text-amber-400 border border-amber-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}>
                          {p.difficulty}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-slate-950 text-slate-400 border border-slate-800 badge-sm font-mono text-[10px]">{p.tags}</span>
                      </td>
                      <td>
                        <NavLink to={`/problem/${p._id}`} className="btn btn-xs bg-slate-800 hover:bg-emerald-950 hover:text-emerald-400 text-slate-200 border border-slate-700 gap-1 rounded-lg font-bold">
                          <Code2 size={12} /> Solve
                        </NavLink>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
