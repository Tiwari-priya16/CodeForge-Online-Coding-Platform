import { useState, useEffect } from "react";
import axiosClient from "../utils/axiosClient";

const SubmissionHistory = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(
          `/problem/submittedProblem/${problemId}`,
        );
        // Sort newest first
        const sorted = (response.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setSubmissions(sorted);
        setError(null);
      } catch (err) {
        setError("Failed to fetch submission history");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [problemId]);

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case "accepted":
        return "badge-success text-success-content font-bold";
      case "wrong":
        return "badge-error text-error-content font-bold";
      case "error":
        return "badge-warning text-warning-content font-bold";
      case "pending":
        return "badge-info text-info-content font-bold";
      default:
        return "badge-neutral";
    }
  };

  const formatMemory = (memory) => {
    if (!memory) return '0 kB';
    if (memory < 1024) return `${memory} kB`;
    return `${(memory / 1024).toFixed(2)} MB`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <span className="loading loading-spinner loading-md text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-sm text-xs p-3 my-2">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.length === 0 ? (
        <div className="bg-base-200/60 border border-base-200 rounded-xl p-6 text-center text-xs text-base-content/60">
          No submission history found for this problem yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-base-200 bg-base-100 shadow-sm">
          <table className="table table-compact w-full text-xs">
            <thead className="bg-base-200/70 text-base-content/70">
              <tr>
                <th className="py-2.5">#</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5">Lang</th>
                <th className="py-2.5">Runtime</th>
                <th className="py-2.5">Memory</th>
                <th className="py-2.5">Test Cases</th>
                <th className="py-2.5">Submitted</th>
                <th className="py-2.5 text-right">Code</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-200">
              {submissions.map((sub, index) => (
                <tr key={sub._id || index} className="hover:bg-base-200/40 transition-colors">
                  <td className="font-mono text-base-content/60">{index + 1}</td>
                  <td>
                    <span className={`badge badge-xs uppercase text-[10px] px-2 py-1 ${getStatusBadge(sub.status)}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="font-mono font-semibold">{sub.language}</td>
                  <td className="font-mono">{sub.runtime || 0}s</td>
                  <td className="font-mono">{formatMemory(sub.memory)}</td>
                  <td className="font-mono font-bold text-primary">
                    {sub.testCasesPassed || 0} / {sub.testCasesTotal || 11}
                  </td>
                  <td className="text-base-content/70 text-[11px]">{formatDate(sub.createdAt)}</td>
                  <td className="text-right">
                    <button
                      className="btn btn-xs btn-ghost btn-outline text-primary border-primary/30 hover:bg-primary hover:text-white"
                      onClick={() => setSelectedSubmission(sub)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Code View Modal */}
      {selectedSubmission && (
        <div className="modal modal-open z-[250]">
          <div className="modal-box w-11/12 max-w-3xl bg-slate-900 border border-slate-800 text-slate-100 p-6 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className={`badge badge-sm font-bold uppercase ${getStatusBadge(selectedSubmission.status)}`}>
                  {selectedSubmission.status}
                </span>
                <span className="text-sm font-bold text-slate-300">
                  {selectedSubmission.language} Submission
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {formatDate(selectedSubmission.createdAt)}
              </span>
            </div>

            <div className="flex gap-4 mb-4 font-mono text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div>Runtime: <strong className="text-emerald-400">{selectedSubmission.runtime || 0}s</strong></div>
              <div>Memory: <strong className="text-emerald-400">{formatMemory(selectedSubmission.memory)}</strong></div>
              <div>Test Cases: <strong className="text-emerald-400">{selectedSubmission.testCasesPassed || 0} / {selectedSubmission.testCasesTotal || 11}</strong></div>
            </div>

            {selectedSubmission.errorMessage && (
              <div className="bg-red-950/80 border border-red-800/80 text-red-300 p-3 rounded-xl text-xs font-mono mb-4 whitespace-pre-wrap">
                {selectedSubmission.errorMessage}
              </div>
            )}

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto max-h-96">
              <pre><code>{selectedSubmission.code}</code></pre>
            </div>

            <div className="modal-action mt-4">
              <button
                className="btn btn-xs btn-neutral"
                onClick={() => setSelectedSubmission(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionHistory;
