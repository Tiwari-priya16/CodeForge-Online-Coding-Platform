import { useParams, NavLink } from 'react-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import axiosClient from '../utils/axiosClient';
import Navbar from './Navbar';
import { Link2, Upload, Youtube, CheckCircle2, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';

function AdminUpload() {
  const { problemId } = useParams();

  const [activeTab, setActiveTab] = useState('link'); // 'link' | 'file'
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    clearErrors
  } = useForm({
    defaultValues: {
      videoUrl: '',
      duration: '10:00'
    }
  });

  const selectedFile = watch('videoFile')?.[0];

  const parseDurationToSeconds = (input) => {
    if (!input) return 600;
    const str = String(input).trim();
    if (/^\d+$/.test(str)) return Number(str);
    const parts = str.split(':').map(Number);
    if (parts.length === 2) return (parts[0] || 0) * 60 + (parts[1] || 0);
    if (parts.length === 3) return (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
    return 600;
  };

  const onSubmit = async (data) => {
    setUploading(true);
    setUploadProgress(0);
    setServerError('');
    setUploadedVideo(null);
    clearErrors();

    try {
      if (activeTab === 'link') {
        const durationSecs = parseDurationToSeconds(data.duration);
        const metadataResponse = await axiosClient.post('/video/save', {
          problemId: problemId,
          secureUrl: data.videoUrl.trim(),
          duration: durationSecs
        });

        setUploadedVideo(metadataResponse.data.videoSolution);
        reset();
      } else {
        const file = data.videoFile[0];

        const signatureResponse = await axiosClient.get(`/video/create/${problemId}`);
        const { signature, timestamp, public_id, api_key, cloud_name, upload_url } = signatureResponse.data;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('signature', signature);
        formData.append('timestamp', timestamp);
        formData.append('public_id', public_id);
        formData.append('api_key', api_key);

        const uploadResponse = await axios.post(upload_url, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        });

        const cloudinaryResult = uploadResponse.data;

        const metadataResponse = await axiosClient.post('/video/save', {
          problemId: problemId,
          cloudinaryPublicId: cloudinaryResult.public_id,
          secureUrl: cloudinaryResult.secure_url,
          duration: cloudinaryResult.duration
        });

        setUploadedVideo(metadataResponse.data.videoSolution);
        reset();
      }
    } catch (err) {
      console.error('Upload error:', err);
      setServerError(err.response?.data?.error || err.message || 'Failed to save video. Please check inputs and try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar title="Attach Video" />

      <div className="container mx-auto p-4 md:p-6 space-y-4 max-w-xl select-none">
        <NavLink to="/admin/video" className="btn btn-xs btn-ghost gap-1 text-slate-400 hover:text-slate-100">
          <ArrowLeft size={13} /> Back to Video Management
        </NavLink>

        <div className="card bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl overflow-hidden">
          <div className="card-body p-6 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="card-title text-lg font-extrabold text-white flex items-center gap-2">
                <Youtube className="text-rose-500" size={22} /> Attach Video Editorial
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Attach a YouTube video link or upload an MP4 file for Problem ID: <code className="bg-slate-950 text-emerald-400 px-1.5 py-0.5 rounded border border-slate-800 font-mono text-[11px]">{problemId}</code>
              </p>
            </div>

            {/* Mode Switch Tabs */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold gap-1">
              <button
                type="button"
                onClick={() => { setActiveTab('link'); setServerError(''); setUploadedVideo(null); }}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${activeTab === 'link' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <Link2 size={14} /> Paste YouTube / Video Link
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('file'); setServerError(''); setUploadedVideo(null); }}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${activeTab === 'file' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <Upload size={14} /> Upload File from Computer
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs pt-1">
              {/* OPTION A: YouTube / Video URL Input */}
              {activeTab === 'link' && (
                <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="form-control w-full space-y-1">
                    <label className="label font-bold text-slate-200">
                      <span>YouTube / Video Solution URL</span>
                    </label>
                    <input
                      type="url"
                      placeholder="e.g. https://www.youtube.com/watch?v=... or https://youtu.be/..."
                      {...register('videoUrl', {
                        required: activeTab === 'link' ? 'Please enter a valid video link' : false
                      })}
                      className={`input input-sm bg-slate-900 border border-slate-800 text-slate-100 rounded-lg w-full ${errors.videoUrl ? 'input-error' : ''}`}
                      disabled={uploading}
                    />
                    {errors.videoUrl && (
                      <span className="text-[11px] text-rose-400">{errors.videoUrl.message}</span>
                    )}
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Supports <code>youtube.com/watch?v=...</code>, <code>youtu.be/...</code>, <code>youtube.com/embed/...</code>, or direct MP4 links.
                    </p>
                  </div>

                  <div className="form-control w-full space-y-1">
                    <label className="label font-bold text-slate-200">
                      <span>Optional Video Duration (MM:SS or HH:MM:SS)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 15:30 or 1:10:00 (optional)"
                      {...register('duration')}
                      className="input input-sm bg-slate-900 border border-slate-800 text-slate-100 rounded-lg w-full font-mono text-xs"
                      disabled={uploading}
                    />
                  </div>
                </div>
              )}

              {/* OPTION B: File Input */}
              {activeTab === 'file' && (
                <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="form-control w-full space-y-1">
                    <label className="label font-bold text-slate-200">
                      <span>Select Video File (MP4, WEBM)</span>
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      {...register('videoFile', {
                        required: activeTab === 'file' ? 'Please select a video file' : false
                      })}
                      className={`file-input file-input-sm file-input-bordered bg-slate-900 border-slate-800 text-slate-200 w-full ${errors.videoFile ? 'file-input-error' : ''}`}
                      disabled={uploading}
                    />
                    {errors.videoFile && (
                      <span className="text-[11px] text-rose-400">{errors.videoFile.message}</span>
                    )}
                  </div>

                  {selectedFile && (
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-0.5 text-slate-300">
                      <p className="font-bold text-slate-100 truncate">{selectedFile.name}</p>
                      <p className="text-slate-500 text-[11px]">Size: {formatFileSize(selectedFile.size)}</p>
                    </div>
                  )}

                  {uploading && (
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[11px] font-bold text-slate-400">
                        <span>Uploading to Cloudinary...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <progress className="progress progress-emerald w-full" value={uploadProgress} max="100"></progress>
                    </div>
                  )}
                </div>
            )}

              {/* Error Banner */}
              {serverError && (
                <div className="alert bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2 rounded-xl">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{serverError}</span>
                </div>
              )}

              {/* Success Banner */}
              {uploadedVideo && (
                <div className="alert bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 rounded-xl">
                  <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
                  <div>
                    <h3 className="font-bold text-white">Video Editorial Saved Successfully!</h3>
                    <p className="text-[11px] text-emerald-400">Duration: {formatDuration(uploadedVideo.duration)}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={uploading}
                  className="btn btn-sm btn-primary gap-1.5 font-bold rounded-lg shadow-md"
                >
                  {uploading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                  {uploading ? 'Processing...' : 'Save Video Editorial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminUpload;
