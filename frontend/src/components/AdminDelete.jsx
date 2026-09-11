import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
import Navbar from './Navbar';
import { NavLink } from 'react-router';
import { ArrowLeft, Trash2, AlertCircle } from 'lucide-react';

const AdminDelete = () => {
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
      setError('Failed to fetch problems');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this problem permanently?')) return;
    
    try {
      await axiosClient.delete(`/problem/delete/${id}`);
      setProblems(problems.filter(problem => problem._id !== id));
      alert('Problem deleted successfully');
    } catch (err) {
      setError('Failed to delete problem');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar title="Delete Problem" />

      <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-5xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <NavLink to="/admin" className="btn btn-xs btn-ghost gap-1 text-slate-400 hover:text-white">
            <ArrowLeft size={13} /> Back to Admin Panel
          </NavLink>
          <h1 className="text-xl font-bold flex items-center gap-2 text-rose-400">
            <Trash2 size={20} /> Delete Problems
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
            <span className="loading loading-spinner loading-lg text-rose-500"></span>
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
                    <th className="text-right">Action</th>
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
                        <button
                          onClick={() => handleDelete(problem._id)}
                          className="btn btn-xs btn-error gap-1 font-bold rounded-lg"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
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

export default AdminDelete;
