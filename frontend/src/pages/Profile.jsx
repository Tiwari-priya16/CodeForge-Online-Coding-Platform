import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router';
import Navbar from '../components/Navbar';
import axiosClient from '../utils/axiosClient';
import { logoutUser, checkAuth } from '../authSlice';
import { CheckCircle2, Award, LogOut, Code2, ShieldAlert, Camera, Loader2, Edit3, Key, AtSign, Mail, Github, Linkedin, Lock, User as UserIcon } from 'lucide-react';

function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [allProblems, setAllProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
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
        const [probsRes, solvedRes] = await Promise.all([
          axiosClient.get('/problem/getAllProblem'),
          axiosClient.get('/problem/problemSolvedByUser')
        ]);
        setAllProblems(probsRes.data || []);
        setSolvedProblems(solvedRes.data || []);
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

        // Re-check auth to sync updated user in Redux
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

  const totalQuestions = allProblems.length || 100;
  const solvedCount = solvedProblems.length;
  const percentage = Math.round((solvedCount / totalQuestions) * 100);

  // Breakdown by difficulty
  const easySolved = solvedProblems.filter((p) => p.difficulty?.toLowerCase() === 'easy').length;
  const mediumSolved = solvedProblems.filter((p) => p.difficulty?.toLowerCase() === 'medium').length;
  const hardSolved = solvedProblems.filter((p) => p.difficulty?.toLowerCase() === 'hard').length;

  const totalEasy = allProblems.filter((p) => p.difficulty?.toLowerCase() === 'easy').length || 50;
  const totalMedium = allProblems.filter((p) => p.difficulty?.toLowerCase() === 'medium').length || 30;
  const totalHard = allProblems.filter((p) => p.difficulty?.toLowerCase() === 'hard').length || 20;

  const initial = user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U';
  const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User';
  const userHandle = user?.username ? `@${user.username}` : `@${user?.emailId?.split('@')[0] || 'user'}`;

  return (
    <div className="min-h-screen bg-base-200">
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

        {/* User Info Header Card */}
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body flex-col md:flex-row items-center md:items-start gap-6 p-6">
            {/* Clickable Large Avatar Circle with Camera Overlay */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative group cursor-pointer w-28 h-28 rounded-full overflow-hidden shadow-xl border-2 border-primary flex items-center justify-center bg-primary text-primary-content shrink-0"
              title="Click to change profile picture"
            >
              {user?.profilePic ? (
                <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold">{initial}</span>
              )}

              {/* Hover / Loading Overlay */}
              <div className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white transition-opacity ${uploadingImg ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                {uploadingImg ? (
                  <Loader2 size={22} className="animate-spin" />
                ) : (
                  <>
                    <Camera size={20} />
                    <span className="text-[10px] font-bold mt-1 uppercase">Upload</span>
                  </>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <h1 className="text-3xl font-extrabold">{fullName}</h1>
                <span className="text-sm font-semibold text-primary font-mono">{userHandle}</span>
                <span className={`badge ${user?.role === 'admin' ? 'badge-warning' : 'badge-neutral'} uppercase font-bold text-xs`}>
                  {user?.role}
                </span>
              </div>

              <p className="text-base-content/80 text-xs italic">{user?.bio || 'DSA Enthusiast & Developer'}</p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 text-xs font-semibold text-base-content/80">
                <div className="flex items-center gap-1">
                  <Mail size={14} className="text-base-content/50" /> {user?.emailId}
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 size={14} className="text-success" /> {solvedCount} Solved
                </div>
                <div className="flex items-center gap-1">
                  <Award size={14} className="text-warning" /> {percentage}% Accuracy
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-end">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn btn-sm btn-outline btn-primary gap-1"
              >
                <Edit3 size={14} /> Edit Profile
              </button>
              {user?.role === 'admin' && (
                <NavLink to="/admin" className="btn btn-sm btn-warning gap-1">
                  <ShieldAlert size={14} /> Admin
                </NavLink>
              )}
              <button onClick={handleLogout} className="btn btn-sm btn-outline btn-error gap-1">
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Edit Profile Form Panel */}
        {isEditing && (
          <div className="card bg-base-100 shadow-xl border border-primary/30 p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-base-200 pb-2">
              <Edit3 size={18} className="text-primary" /> Edit Profile & Credentials
            </h2>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label font-bold text-base-content">First Name</label>
                  <input
                    type="text"
                    className="input input-bordered input-sm"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label font-bold text-base-content">Last Name</label>
                  <input
                    type="text"
                    className="input input-bordered input-sm"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label font-bold text-base-content">Username</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-base-content/50">@</span>
                    <input
                      type="text"
                      className="input input-bordered input-sm pl-7 w-full"
                      value={editForm.username}
                      onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label font-bold text-base-content">New Password (Optional)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-base-content/50"><Key size={13} /></span>
                    <input
                      type="password"
                      placeholder="•••••••• (leave empty to keep current)"
                      className="input input-bordered input-sm pl-8 w-full"
                      value={editForm.newPassword}
                      onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="form-control">
                <label className="label font-bold text-base-content">Bio / Headline</label>
                <textarea
                  className="textarea textarea-bordered textarea-sm w-full"
                  rows={2}
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsEditing(false)} className="btn btn-xs btn-ghost">
                  Cancel
                </button>
                <button type="submit" className={`btn btn-xs btn-primary gap-1 ${savingProfile ? 'loading' : ''}`} disabled={savingProfile}>
                  {savingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* LeetCode Style Problem Solving Progress Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Main Progress Overview Card */}
          <div className="card bg-base-100 shadow-lg border border-base-200 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xs uppercase tracking-wider font-bold text-base-content/60 mb-2">Total Solved</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-primary">{solvedCount}</span>
                <span className="text-base-content/60 text-sm font-semibold">/ {totalQuestions}</span>
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-xs font-bold text-base-content/70">
                <span>Progress</span>
                <span>{percentage}%</span>
              </div>
              <progress className="progress progress-primary w-full" value={solvedCount} max={totalQuestions}></progress>
            </div>
          </div>

          {/* Easy Stat Card */}
          <div className="card bg-base-100 shadow-lg border border-base-200 p-6 space-y-2">
            <div className="flex justify-between items-center">
              <span className="badge badge-success font-bold text-xs">Easy</span>
              <span className="text-xs font-mono font-bold text-base-content/70">{easySolved} / {totalEasy}</span>
            </div>
            <div className="text-2xl font-bold text-success">{easySolved}</div>
            <progress className="progress progress-success w-full" value={easySolved} max={totalEasy}></progress>
          </div>

          {/* Medium Stat Card */}
          <div className="card bg-base-100 shadow-lg border border-base-200 p-6 space-y-2">
            <div className="flex justify-between items-center">
              <span className="badge badge-warning font-bold text-xs">Medium</span>
              <span className="text-xs font-mono font-bold text-base-content/70">{mediumSolved} / {totalMedium}</span>
            </div>
            <div className="text-2xl font-bold text-warning">{mediumSolved}</div>
            <progress className="progress progress-warning w-full" value={mediumSolved} max={totalMedium}></progress>
          </div>

          {/* Hard Stat Card */}
          <div className="card bg-base-100 shadow-lg border border-base-200 p-6 space-y-2">
            <div className="flex justify-between items-center">
              <span className="badge badge-error font-bold text-xs">Hard</span>
              <span className="text-xs font-mono font-bold text-base-content/70">{hardSolved} / {totalHard}</span>
            </div>
            <div className="text-2xl font-bold text-error">{hardSolved}</div>
            <progress className="progress progress-error w-full" value={hardSolved} max={totalHard}></progress>
          </div>
        </div>

        {/* Solved Problems List */}
        <div className="card bg-base-100 shadow-xl border border-base-200 p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-base-200 pb-3">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CheckCircle2 size={20} className="text-success" /> Solved Problems ({solvedCount})
            </h2>
            <NavLink to="/" className="btn btn-xs btn-ghost text-primary font-bold">
              View All Problems →
            </NavLink>
          </div>

          {loading ? (
            <div className="flex justify-center p-8">
              <span className="loading loading-spinner loading-md text-primary"></span>
            </div>
          ) : solvedProblems.length === 0 ? (
            <div className="alert alert-info shadow-sm text-sm">
              <span>You haven't solved any problems yet. Pick a problem from the <NavLink to="/" className="underline font-bold">Problems List</NavLink> to start practicing!</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full text-sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Problem Title</th>
                    <th>Difficulty</th>
                    <th>Category</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {solvedProblems.map((p, idx) => (
                    <tr key={p._id}>
                      <td className="font-mono text-xs">{idx + 1}</td>
                      <td>
                        <NavLink to={`/problem/${p._id}`} className="font-bold hover:text-primary transition-colors">
                          {p.title}
                        </NavLink>
                      </td>
                      <td>
                        <span className={`badge badge-sm font-bold uppercase ${
                          p.difficulty?.toLowerCase() === 'easy'
                            ? 'badge-success'
                            : p.difficulty?.toLowerCase() === 'medium'
                              ? 'badge-warning'
                              : 'badge-error'
                        }`}>
                          {p.difficulty}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-neutral badge-sm font-mono">{p.tags}</span>
                      </td>
                      <td>
                        <NavLink to={`/problem/${p._id}`} className="btn btn-xs btn-outline btn-primary gap-1">
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
