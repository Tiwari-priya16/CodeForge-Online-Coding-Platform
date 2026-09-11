import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import Navbar from './Navbar';
import { NavLink } from 'react-router';
import { ArrowLeft, Video, Upload, Trash2, AlertCircle } from 'lucide-react';

const AdminVideo = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblem');
      setProblems(data);
    } catch (err) {
      setError('Failed to fetch problems list');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async (id) => {
    if (!window.confirm('Are you sure you want to delete the video solution for this problem?')) return;
    
    try {
      await axiosClient.delete(`/video/delete/${id}`);
      alert('Video solution deleted successfully!');
    } catch (err) {
      alert('Error deleting video: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar title="Manage Videos" />

      <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-5xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <NavLink to="/admin" className="btn btn-xs btn-ghost gap-1 text-slate-400 hover:text-white">
            <ArrowLeft size={13} /> Back to Admin Panel
          </NavLink>
          <h1 className="text-xl font-bold flex items-center gap-2 text-sky-400">
            <Video size={20} /> Manage Video Editorials
          </h1>
        </div>

        {error && (
          <div className="alert bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2 rounded-xl">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center p-12">
            <span className="loading loading-spinner loading-lg text-sky-400"></span>
          </div>
        ) : (
          <div className="card bg-slate-900 border border-slate-800 shadow-xl overflow-hidden rounded-2xl">
            <div className="overflow-x-auto">
              <table className="table w-full text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="w-12">#</th>
                    <th>Problem Title</th>
                    <th>Difficulty</th>
                    <th>Category</th>
                    <th className="text-right">Video Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {problems.map((problem, index) => (
                    <tr key={problem._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="font-mono text-slate-500">{index + 1}</td>
                      <td className="font-bold text-slate-100">{problem.title}</td>
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
                      <td>
                        <span className="badge bg-slate-950 text-slate-400 border border-slate-800 badge-sm font-mono text-[10px]">{problem.tags}</span>
                      </td>
                      <td className="text-right">
                        <div className="flex justify-end gap-2">
                          <NavLink
                            to={`/admin/upload/${problem._id}`}
                            className="btn btn-xs bg-sky-600 hover:bg-sky-500 text-white font-bold gap-1 rounded-lg border-0"
                          >
                            <Upload size={12} /> Attach Video
                          </NavLink>
                          <button
                            onClick={() => handleDeleteVideo(problem._id)}
                            className="btn btn-xs btn-outline btn-error gap-1 font-bold rounded-lg"
                          >
                            <Trash2 size={12} /> Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVideo;
