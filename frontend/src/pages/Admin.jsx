import React from 'react';
import { Plus, Edit, Trash2, Video } from 'lucide-react';
import { NavLink } from 'react-router';
import Navbar from '../components/Navbar';

function Admin() {
  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Add a new coding problem to the platform',
      icon: Plus,
      color: 'btn-success',
      bgColor: 'bg-emerald-500/10 text-emerald-400',
      route: '/admin/create'
    },
    {
      id: 'update',
      title: 'Update Problem',
      description: 'Edit existing problems and their details',
      icon: Edit,
      color: 'btn-warning',
      bgColor: 'bg-amber-500/10 text-amber-400',
      route: '/admin/update'
    },
    {
      id: 'delete',
      title: 'Delete Problem',
      description: 'Remove problems from the platform',
      icon: Trash2,
      color: 'btn-error',
      bgColor: 'bg-rose-500/10 text-rose-400',
      route: '/admin/delete'
    },
    {
      id: 'video',
      title: 'Video Solutions',
      description: 'Attach YouTube video editorials or Cloudinary MP4s',
      icon: Video,
      color: 'btn-info',
      bgColor: 'bg-sky-500/10 text-sky-400',
      route: '/admin/video'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar title="Admin Dashboard" />

      <div className="container mx-auto px-4 py-10 max-w-6xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-white tracking-tight">
            CodeForge Admin Panel
          </h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Manage coding problems, update templates, testcases, and video editorials
          </p>
        </div>

        {/* Admin Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <div
                key={option.id}
                className="card bg-slate-900 border border-slate-800 shadow-xl hover:border-slate-700 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="card-body items-center text-center p-6 space-y-3">
                  <div className={`${option.bgColor} p-4 rounded-2xl shadow-inner`}>
                    <IconComponent size={28} />
                  </div>
                  
                  <h2 className="card-title text-base font-bold text-white">
                    {option.title}
                  </h2>
                  
                  <p className="text-slate-400 text-xs leading-relaxed min-h-[36px]">
                    {option.description}
                  </p>
                  
                  <div className="card-actions w-full pt-2">
                    <NavLink 
                      to={option.route}
                      className={`btn ${option.color} btn-sm w-full font-bold rounded-xl shadow-md`}
                    >
                      {option.title}
                    </NavLink>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Admin;
