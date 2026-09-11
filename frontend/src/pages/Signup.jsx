import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import { registerUser, clearError } from '../authSlice';
import { Mail, Lock, User, AtSign, Eye, EyeOff, Flame, Code2, Cpu, CheckCircle2, ArrowRight, AlertCircle, Loader2, Sparkles } from 'lucide-react';

const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().optional(),
  username: z.string().min(3, "Username must be at least 3 characters").optional(),
  emailId: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, submitting, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      setSignupSuccess(true);
      const timer = setTimeout(() => {
        navigate('/');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(clearError());
    setSignupSuccess(false);
    dispatch(registerUser(data));
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Ambient Background Gradient Glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Container */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 lg:p-12 shadow-2xl z-10">

        {/* Left Hero / Brand Feature Banner */}
        <div className="hidden lg:flex flex-col justify-between border-r border-slate-800/80 pr-8">
          <div>
            {/* Brand Logo */}
            <div className="flex items-center gap-2 mb-8">
              <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-red-600 rounded-xl shadow-lg shadow-amber-500/20 text-white">
                <Flame size={26} />
              </div>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-amber-400 bg-clip-text text-transparent">
                CodeForge
              </span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight leading-tight text-white mb-4">
              Join the CodeForge Developer Network.
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              Create your account to solve handcrafted DSA problems, track submission history, climb rankings, and get instant AI assistance.
            </p>

            {/* Feature Badges */}
            <div className="space-y-4 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-3 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                <Code2 className="text-amber-400 shrink-0" size={18} />
                <span>Curated DSA Problems (Arrays, Linked Lists, Graphs, DP)</span>
              </div>
              <div className="flex items-center gap-3 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                <Cpu className="text-purple-400 shrink-0" size={18} />
                <span>5 Languages IDE (C, C++, Java, JS, Python 3) with Judge0</span>
              </div>
              <div className="flex items-center gap-3 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                <Sparkles className="text-emerald-400 shrink-0" size={18} />
                <span>AI Doubt Solver, Video Editorials & Practice Analytics</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500 pt-6">
            © 2026 CodeForge Platform. All rights reserved.
          </div>
        </div>

        {/* Right Signup Form */}
        <div className="flex flex-col justify-center">
          {/* Mobile Brand Logo */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-6">
            <div className="p-2 bg-gradient-to-tr from-amber-500 to-red-600 rounded-xl text-white">
              <Flame size={22} />
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-white to-amber-400 bg-clip-text text-transparent">
              CodeForge
            </span>
          </div>

          <div className="text-center lg:text-left mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">Create Account</h2>
            <p className="text-slate-400 text-xs">Enter your details to register as a developer</p>
          </div>

          {/* Alert Banners */}
          {submitting && (
            <div className="alert bg-amber-950/80 border border-amber-800 text-amber-300 text-xs mb-4 p-3 rounded-xl flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-amber-400 shrink-0" />
              <span className="font-bold">Creating your account... Please wait</span>
            </div>
          )}

          {error && !submitting && (
            <div className="alert bg-rose-950/90 border border-rose-800 text-rose-200 text-xs mb-4 p-3 rounded-xl flex items-center gap-2">
              <AlertCircle size={16} className="text-rose-400 shrink-0" />
              <span className="font-bold">{error}</span>
            </div>
          )}

          {signupSuccess && (
            <div className="alert bg-emerald-950/90 border border-emerald-800 text-emerald-200 text-xs mb-4 p-3 rounded-xl flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
              <span className="font-bold">Successfully Registered! Redirecting...</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* Full Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="form-control">
                <label className="label text-xs font-semibold text-slate-300">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User size={15} />
                  </div>
                  <input
                    type="text"
                    placeholder="John"
                    className={`input input-bordered w-full pl-9 bg-slate-950/60 border-slate-800 text-xs focus:border-amber-500 focus:outline-none ${errors.firstName ? 'border-red-500' : ''}`}
                    {...register('firstName')}
                  />
                </div>
                {errors.firstName && (
                  <span className="text-red-400 text-[10px] mt-1">{errors.firstName.message}</span>
                )}
              </div>

              <div className="form-control">
                <label className="label text-xs font-semibold text-slate-300">Last Name</label>
                <input
                  type="text"
                  placeholder="Doe"
                  className="input input-bordered w-full bg-slate-950/60 border-slate-800 text-xs focus:border-amber-500 focus:outline-none"
                  {...register('lastName')}
                />
              </div>
            </div>

            {/* Username Field */}
            <div className="form-control">
              <label className="label text-xs font-semibold text-slate-300">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <AtSign size={15} />
                </div>
                <input
                  type="text"
                  placeholder="johndoe123"
                  className={`input input-bordered w-full pl-9 bg-slate-950/60 border-slate-800 text-xs focus:border-amber-500 focus:outline-none ${errors.username ? 'border-red-500' : ''}`}
                  {...register('username')}
                />
              </div>
              {errors.username && (
                <span className="text-red-400 text-[10px] mt-1">{errors.username.message}</span>
              )}
            </div>

            {/* Email Field */}
            <div className="form-control">
              <label className="label text-xs font-semibold text-slate-300">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail size={15} />
                </div>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className={`input input-bordered w-full pl-9 bg-slate-950/60 border-slate-800 text-xs focus:border-amber-500 focus:outline-none ${errors.emailId ? 'border-red-500' : ''}`}
                  {...register('emailId')}
                />
              </div>
              {errors.emailId && (
                <span className="text-red-400 text-[10px] mt-1">{errors.emailId.message}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="form-control">
              <label className="label text-xs font-semibold text-slate-300">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock size={15} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`input input-bordered w-full pl-9 pr-10 bg-slate-950/60 border-slate-800 text-xs focus:border-amber-500 focus:outline-none ${errors.password ? 'border-red-500' : ''}`}
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-400 text-[10px] mt-1">{errors.password.message}</span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white border-none font-bold text-xs shadow-lg shadow-amber-500/20 gap-2 mt-4 rounded-xl cursor-pointer"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Registering Account...
                </>
              ) : (
                <>Sign Up <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="text-center mt-6 text-xs text-slate-400">
            Already have an account?{' '}
            <NavLink to="/login" className="text-amber-400 font-bold hover:underline">
              Log in
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
