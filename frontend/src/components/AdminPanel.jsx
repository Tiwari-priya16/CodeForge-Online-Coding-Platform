import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate, NavLink } from 'react-router';
import Navbar from './Navbar';
import { PlusCircle, ArrowLeft, Save, Code2, Trash2 } from 'lucide-react';

const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['C', 'C++', 'Java', 'JavaScript', 'Python']),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).length(5, 'All five languages required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C', 'C++', 'Java', 'JavaScript', 'Python']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(5, 'All five languages required')
});

function AdminPanel() {
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      startCode: [
        { language: 'C', initialCode: '' },
        { language: 'C++', initialCode: '' },
        { language: 'Java', initialCode: '' },
        { language: 'JavaScript', initialCode: '' },
        { language: 'Python', initialCode: '' }
      ],
      referenceSolution: [
        { language: 'C', completeCode: '' },
        { language: 'C++', completeCode: '' },
        { language: 'Java', completeCode: '' },
        { language: 'JavaScript', completeCode: '' },
        { language: 'Python', completeCode: '' }
      ]
    }
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({
    control,
    name: 'visibleTestCases'
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({
    control,
    name: 'hiddenTestCases'
  });

  const onSubmit = async (data) => {
    try {
      await axiosClient.post('/problem/create', data);
      alert('Problem created successfully!');
      navigate('/');
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar title="Create Problem" />

      <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-5xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <NavLink to="/admin" className="btn btn-xs btn-ghost gap-1 text-slate-400 hover:text-white">
            <ArrowLeft size={13} /> Back to Admin Panel
          </NavLink>
          <h1 className="text-xl font-bold flex items-center gap-2 text-emerald-400">
            <PlusCircle size={20} /> Create New Problem
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-xs">
          {/* Basic Information */}
          <div className="card bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">Basic Information</h2>

            <div className="form-control space-y-1">
              <label className="label font-bold text-slate-300">Title</label>
              <input
                {...register('title')}
                placeholder="e.g. Two Sum"
                className={`input input-sm bg-slate-950 border border-slate-800 text-slate-100 rounded-lg ${errors.title && 'input-error'}`}
              />
              {errors.title && <span className="text-rose-400">{errors.title.message}</span>}
            </div>

            <div className="form-control space-y-1">
              <label className="label font-bold text-slate-300">Description (Markdown Supported)</label>
              <textarea
                {...register('description')}
                placeholder="Problem description..."
                rows={6}
                className={`textarea bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs rounded-lg ${errors.description && 'textarea-error'}`}
              />
              {errors.description && <span className="text-rose-400">{errors.description.message}</span>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control space-y-1">
                <label className="label font-bold text-slate-300">Difficulty</label>
                <select
                  {...register('difficulty')}
                  className="select select-sm bg-slate-950 border border-slate-800 text-slate-100 rounded-lg"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="form-control space-y-1">
                <label className="label font-bold text-slate-300">Tag / Category</label>
                <select
                  {...register('tags')}
                  className="select select-sm bg-slate-950 border border-slate-800 text-slate-100 rounded-lg"
                >
                  <option value="array">Array</option>
                  <option value="linkedList">Linked List</option>
                  <option value="graph">Graph</option>
                  <option value="dp">DP</option>
                </select>
              </div>
            </div>
          </div>

          {/* Test Cases */}
          <div className="card bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-6">
            <h2 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">Test Cases</h2>
            
            {/* Visible Test Cases */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-emerald-400">Visible Example Cases</span>
                <button
                  type="button"
                  onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                  className="btn btn-xs btn-outline btn-success gap-1"
                >
                  <PlusCircle size={12} /> Add Case
                </button>
              </div>

              {visibleFields.map((field, index) => (
                <div key={field.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-slate-400 font-mono text-[11px]">
                    <span>Case {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeVisible(index)}
                      className="btn btn-xs btn-ghost text-rose-400"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>

                  <input
                    {...register(`visibleTestCases.${index}.input`)}
                    placeholder="Input (e.g. nums = [2,7,11,15], target = 9)"
                    className="input input-sm bg-slate-900 border border-slate-800 text-slate-100 font-mono w-full rounded-lg"
                  />

                  <input
                    {...register(`visibleTestCases.${index}.output`)}
                    placeholder="Expected Output (e.g. [0,1])"
                    className="input input-sm bg-slate-900 border border-slate-800 text-slate-100 font-mono w-full rounded-lg"
                  />

                  <textarea
                    {...register(`visibleTestCases.${index}.explanation`)}
                    placeholder="Explanation"
                    rows={2}
                    className="textarea textarea-sm bg-slate-900 border border-slate-800 text-slate-100 w-full rounded-lg"
                  />
                </div>
              ))}
            </div>

            {/* Hidden Test Cases */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <div className="flex justify-between items-center">
                <span className="font-bold text-amber-400">Hidden Evaluation Cases</span>
                <button
                  type="button"
                  onClick={() => appendHidden({ input: '', output: '' })}
                  className="btn btn-xs btn-outline btn-warning gap-1"
                >
                  <PlusCircle size={12} /> Add Hidden Case
                </button>
              </div>

              {hiddenFields.map((field, index) => (
                <div key={field.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-slate-400 font-mono text-[11px]">
                    <span>Hidden Case {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeHidden(index)}
                      className="btn btn-xs btn-ghost text-rose-400"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>

                  <input
                    {...register(`hiddenTestCases.${index}.input`)}
                    placeholder="Input"
                    className="input input-sm bg-slate-900 border border-slate-800 text-slate-100 font-mono w-full rounded-lg"
                  />

                  <input
                    {...register(`hiddenTestCases.${index}.output`)}
                    placeholder="Output"
                    className="input input-sm bg-slate-900 border border-slate-800 text-slate-100 font-mono w-full rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Code Templates */}
          <div className="card bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-6">
            <h2 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">Code Templates</h2>

            <div className="space-y-6">
              {['C', 'C++', 'Java', 'JavaScript', 'Python'].map((lang, index) => (
                <div key={lang} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <h3 className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <Code2 size={14} /> {lang} Templates
                  </h3>

                  <div className="form-control space-y-1">
                    <label className="label text-slate-400 font-semibold">Starter Code</label>
                    <textarea
                      {...register(`startCode.${index}.initialCode`)}
                      rows={4}
                      className="textarea bg-slate-900 border border-slate-800 text-slate-100 font-mono text-xs w-full rounded-lg"
                    />
                  </div>

                  <div className="form-control space-y-1">
                    <label className="label text-slate-400 font-semibold">Reference Solution</label>
                    <textarea
                      {...register(`referenceSolution.${index}.completeCode`)}
                      rows={6}
                      className="textarea bg-slate-900 border border-slate-800 text-slate-100 font-mono text-xs w-full rounded-lg"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-emerald bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold w-full gap-2 shadow-lg">
            <Save size={16} /> Save New Problem
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminPanel;
