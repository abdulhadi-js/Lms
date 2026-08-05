"use client";

import React, { useState, useEffect } from 'react';
import { FileText, Plus, CheckCircle, Clock, MoreHorizontal, Trash, Edit, X } from 'lucide-react';
import { assignmentsApi, coursesApi } from '@/lib/api';
import RichTextEditor from '@/components/RichTextEditor';
import Link from 'next/link';

export default function TeacherAssignments() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [maxMarks, setMaxMarks] = useState('');
  const [weightPercent, setWeightPercent] = useState('');
  
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [assignmentsData, coursesData] = await Promise.all([
        assignmentsApi.list(),
        coursesApi.list()
      ]);
      setAssignments(assignmentsData);
      setCourses(coursesData);
    } catch (err) {
      console.error('Failed to load assignments', err);
    } finally {
      setLoading(false);
    }
  }

  const openCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setCourseId(courses.length > 0 ? courses[0].id : '');
    setDueDate('');
    setMaxMarks('100');
    setWeightPercent('10');
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (assignment: any) => {
    setEditingId(assignment.id);
    setTitle(assignment.title);
    setDescription(assignment.description || '');
    setCourseId(assignment.courseId || (assignment.course?.id) || '');
    setDueDate(assignment.dueDate ? new Date(assignment.dueDate).toISOString().split('T')[0] : '');
    setMaxMarks(assignment.maxMarks?.toString() || '100');
    setWeightPercent(assignment.weightPercent?.toString() || '10');
    setError('');
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!title || !courseId || !dueDate) {
      setError('Title, Course, and Due Date are required.');
      return;
    }

    try {
      const payload: any = {
        title,
        description,
        dueDate: new Date(dueDate).toISOString(),
        maxMarks: parseFloat(maxMarks),
        weightPercent: parseFloat(weightPercent),
      };

      if (editingId) {
        await assignmentsApi.update(editingId, payload);
      } else {
        payload.courseId = courseId;
        await assignmentsApi.create(courseId, payload);
      }
      
      closeModal();
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to save assignment');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;
    try {
      await assignmentsApi.remove(id);
      loadData();
    } catch (err) {
      console.error('Failed to delete assignment', err);
      alert('Failed to delete assignment');
    }
  };

  // Metrics
  const activeCount = assignments.filter(a => new Date(a.dueDate) > new Date()).length;
  const gradingCount = assignments.filter(a => new Date(a.dueDate) <= new Date()).length;

  return (
    <div className="p-8 max-w-[1280px] mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-heading-on-light mb-2">Assignment Management</h1>
          <p className="text-body-secondary">Create, track, and grade student assignments.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity" 
          style={{ background: 'linear-gradient(180deg, #3a6633 0%, #31572c 100%)' }}
        >
          <Plus className="w-5 h-5" />
          <span>Create Assignment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { title: 'Active Assignments', value: activeCount },
          { title: 'Needs Grading (Past Due)', value: gradingCount },
          { title: 'Total Created', value: assignments.length }
        ].map((stat, i) => (
          <div key={i} className="bg-surface rounded-[12px] border border-divider p-5 relative overflow-hidden" style={{ boxShadow: '0 4px 12px rgba(19, 42, 19, 0.08)' }}>
            <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, #90a955 0%, #ecf39e 100%)' }}></div>
            <p className="text-sm font-bold text-body-secondary mb-2">{stat.title}</p>
            <h3 className="text-3xl font-bold text-heading-on-light">{loading ? '-' : stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-surface rounded-[12px] border border-divider overflow-hidden" style={{ boxShadow: '0 4px 12px rgba(19, 42, 19, 0.08)' }}>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-body-secondary">Loading assignments...</div>
          ) : assignments.length === 0 ? (
            <div className="p-8 text-center text-body-secondary">No assignments created yet.</div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="md:hidden p-4 space-y-4 bg-surface">
                {assignments.map((assignment) => {
                  const isPastDue = new Date(assignment.dueDate) <= new Date();
                  return (
                    <div key={assignment.id} className="bg-surface p-4 rounded-xl border border-divider shadow-sm relative">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-bold text-heading-on-light flex items-center gap-2">
                            <FileText className="w-4 h-4 text-secondary" />
                            {assignment.title}
                          </div>
                          <div className="text-xs text-body-secondary mt-1">{assignment.course?.title || 'Unknown Course'}</div>
                        </div>
                        <div className="flex gap-2">
                          <Link 
                            href={`/teacher/assignments/${assignment.id}`}
                            className="p-1.5 text-body-secondary hover:text-primary hover:bg-primary/10 rounded transition-colors flex items-center gap-1"
                            title="View Submissions"
                          >
                            <span className="text-xs font-semibold mr-1">View</span>
                          </Link>
                          <button 
                            onClick={() => openEditModal(assignment)}
                            className="p-1.5 text-body-secondary hover:text-info hover:bg-info/10 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(assignment.id)}
                            className="p-1.5 text-body-secondary hover:text-error hover:bg-error-bg rounded transition-colors"
                            title="Delete"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-xs text-body-secondary mb-3 line-clamp-2">{assignment.description}</div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm pt-3 border-t border-divider">
                        <div className="text-body-secondary flex items-center gap-1"><Clock className="w-4 h-4" /> Due:</div>
                        <div className={`text-right font-medium ${isPastDue ? 'text-error' : 'text-primary'}`}>
                          {new Date(assignment.dueDate).toLocaleDateString()}
                        </div>
                        
                        <div className="text-body-secondary">Marks:</div>
                        <div className="text-right">{assignment.maxMarks} ({assignment.weightPercent}%)</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table View */}
              <table className="hidden md:table w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary text-white text-sm">
                <th className="p-4 font-semibold">Assignment Details</th>
                <th className="p-4 font-semibold">Course</th>
                <th className="p-4 font-semibold">Due Date</th>
                <th className="p-4 font-semibold">Max Marks / Weight</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-on-surface">
                {assignments.map((assignment, index) => {
                  const isPastDue = new Date(assignment.dueDate) <= new Date();
                  
                  return (
                  <tr key={assignment.id} className={`border-b border-divider hover:bg-surface-container transition-colors ${index % 2 === 0 ? 'bg-surface' : 'bg-surface-container-lowest'}`}>
                    <td className="p-4">
                      <div className="font-bold text-heading-on-light flex items-center gap-2">
                        <FileText className="w-4 h-4 text-secondary" />
                        {assignment.title}
                      </div>
                      <div className="text-xs text-body-secondary mt-1 line-clamp-1">{assignment.description}</div>
                    </td>
                    <td className="p-4 text-sm text-body-secondary">{assignment.course?.title || 'Unknown Course'}</td>
                    <td className="p-4 text-sm font-medium flex items-center gap-1">
                      <Clock className="w-4 h-4 text-primary" /> 
                      <span className={isPastDue ? 'text-error' : 'text-primary'}>
                        {new Date(assignment.dueDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-medium text-body-secondary">{assignment.maxMarks} marks ({assignment.weightPercent}%)</span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/teacher/assignments/${assignment.id}`}
                          className="px-3 py-1.5 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors border border-primary/20"
                          title="View Submissions"
                        >
                          View Submissions
                        </Link>
                        <button 
                          onClick={() => openEditModal(assignment)}
                          className="p-1.5 text-body-secondary hover:text-info transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(assignment.id)}
                          className="p-1.5 text-body-secondary hover:text-error transition-colors"
                          title="Delete"
                        >
                          <Trash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
            </>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-divider bg-surface-container-low">
              <h2 className="text-xl font-bold text-heading-on-light">
                {editingId ? 'Edit Assignment' : 'Create Assignment'}
              </h2>
              <button onClick={closeModal} className="text-body-secondary hover:text-error transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
              {error && (
                <div className="mb-4 p-3 bg-error-bg text-error rounded-lg border border-error/20 text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                {!editingId && (
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-1">Course *</label>
                    <select
                      value={courseId}
                      onChange={(e) => setCourseId(e.target.value)}
                      className="w-full p-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                      disabled={courses.length === 0}
                    >
                      {courses.length === 0 ? (
                        <option value="">No courses available</option>
                      ) : (
                        courses.map(c => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))
                      )}
                    </select>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Description</label>
                  <div className="prose-container">
                    <RichTextEditor value={description} onChange={setDescription} />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1">Due Date *</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-1">Max Marks</label>
                    <input
                      type="number"
                      value={maxMarks}
                      onChange={(e) => setMaxMarks(e.target.value)}
                      className="w-full p-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      min="0"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-1">Weight (%)</label>
                    <input
                      type="number"
                      value={weightPercent}
                      onChange={(e) => setWeightPercent(e.target.value)}
                      className="w-full p-2 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-on-surface border border-divider rounded-lg hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  {editingId ? 'Save Changes' : 'Create Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
