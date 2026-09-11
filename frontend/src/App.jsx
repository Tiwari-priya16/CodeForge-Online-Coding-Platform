import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from "./authSlice";
import { useEffect, useState } from "react";
import AdminPanel from "./components/AdminPanel";
import ProblemPage from "./pages/ProblemPage";
import Admin from "./pages/Admin";
import AdminVideo from "./components/AdminVideo";
import AdminDelete from "./components/AdminDelete";
import AdminUpload from "./components/AdminUpload";
import AdminUpdate from "./components/AdminUpdate";
import Profile from "./pages/Profile";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const [authTimeout, setAuthTimeout] = useState(false);

  useEffect(() => {
    dispatch(checkAuth());
    const timer = setTimeout(() => {
      setAuthTimeout(true);
    }, 2500); // 2.5s maximum spinner timeout
    return () => clearTimeout(timer);
  }, [dispatch]);

  if (loading && !authTimeout) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-emerald-400 gap-3">
        <span className="loading loading-spinner loading-lg"></span>
        <span className="text-xs font-mono text-slate-400">Authenticating...</span>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Homepage /> : <Navigate to="/login" />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <Signup />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />

        {/* Admin Routes */}
        <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <Admin /> : <Navigate to="/" />} />
        <Route path="/admin/create" element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
        <Route path="/admin/update" element={isAuthenticated && user?.role === 'admin' ? <AdminUpdate /> : <Navigate to="/" />} />
        <Route path="/admin/update/:id" element={isAuthenticated && user?.role === 'admin' ? <AdminUpdate /> : <Navigate to="/" />} />
        <Route path="/admin/delete" element={isAuthenticated && user?.role === 'admin' ? <AdminDelete /> : <Navigate to="/" />} />
        <Route path="/admin/video" element={isAuthenticated && user?.role === 'admin' ? <AdminVideo /> : <Navigate to="/" />} />
        <Route path="/admin/upload/:problemId" element={isAuthenticated && user?.role === 'admin' ? <AdminUpload /> : <Navigate to="/" />} />

        {/* Problem Solving Route */}
        <Route path="/problem/:problemId" element={<ProblemPage />} />
      </Routes>
    </>
  );
}

export default App;
