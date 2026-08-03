"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { coursesApi } from '@/lib/api';

interface Lesson {
  id: string;
  title: string;
  description: string;
  contentType: string;
  contentUrl: string;
  order: number;
}

interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
  schedule?: { day: string, time: string }[];
  room?: string;
}

export default function CourseContent() {
  const { id } = useParams() as { id: string };
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        setLoading(true);
        const data = await coursesApi.get(id);
        
        // Sort modules and lessons
        if (data.modules) {
          data.modules.sort((a: Module, b: Module) => a.order - b.order);
          data.modules.forEach((mod: Module) => {
            if (mod.lessons) {
              mod.lessons.sort((a: Lesson, b: Lesson) => a.order - b.order);
            }
          });
        }
        
        setCourse(data);
        
        // Expand first module and select first lesson by default
        if (data.modules && data.modules.length > 0) {
          setExpandedModules({ [data.modules[0].id]: true });
          if (data.modules[0].lessons && data.modules[0].lessons.length > 0) {
            setActiveLesson(data.modules[0].lessons[0]);
          }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    };
    loadCourseData();
  }, [id]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  if (loading) {
    return (
      <div className="flex flex-1 overflow-hidden relative h-[calc(100vh-64px)]">
        {/* Skeleton Sidebar */}
        <aside className="hidden lg:flex flex-col w-[300px] bg-neutral-bg border-r border-divider shrink-0 p-4">
          <div className="h-6 bg-surface-container-high rounded w-2/3 mb-8 animate-pulse"></div>
          <div className="space-y-4">
            <div className="h-10 bg-surface-container-high rounded w-full animate-pulse"></div>
            <div className="h-10 bg-surface-container-high rounded w-full animate-pulse"></div>
            <div className="h-10 bg-surface-container-high rounded w-full animate-pulse"></div>
          </div>
        </aside>
        {/* Skeleton Main Content */}
        <section className="flex-1 bg-surface p-6 md:p-10">
          <div className="max-w-4xl mx-auto">
             <div className="h-[300px] bg-surface-container-high rounded-xl mb-8 animate-pulse"></div>
             <div className="h-8 bg-surface-container-high rounded w-1/4 mb-4 animate-pulse"></div>
             <div className="h-12 bg-surface-container-high rounded w-2/3 mb-6 animate-pulse"></div>
             <div className="h-24 bg-surface-container-high rounded w-full animate-pulse"></div>
          </div>
        </section>
      </div>
    );
  }
  if (error || !course) return <div className="p-10 text-error">Error: {error}</div>;

  return (
    <div className="flex flex-1 overflow-hidden relative h-[calc(100vh-64px)]">
      {/* Left Panel: Navigator */}
      <aside className="hidden lg:flex flex-col w-[300px] bg-neutral-bg border-r border-divider shrink-0 overflow-y-auto custom-scrollbar sticky top-0">
        <div className="px-6 py-4 border-b border-divider/50 bg-neutral-bg/80 backdrop-blur sticky top-0 z-10">
          <h3 className="text-heading-on-light text-[16px] font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
            {course.title}
          </h3>
          {(course.schedule?.length || course.room) ? (
            <div className="mt-3 text-xs text-body-secondary space-y-1.5 border-t border-divider/50 pt-2">
              {course.room && <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">meeting_room</span> Room {course.room}</div>}
              {course.schedule?.map(s => (
                <div key={s.day} className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> {s.day} ({s.time.split('-')[0].trim()})</div>
              ))}
            </div>
          ) : null}
        </div>
        <div className="flex-1 pb-20">
          {course.modules && course.modules.length > 0 ? (
            course.modules.map((mod, index) => (
              <div key={mod.id} className="module-group">
                <div 
                  className="px-6 py-3 bg-white/50 border-b border-divider flex justify-between items-center cursor-pointer hover:bg-white/80 transition-colors"
                  onClick={() => toggleModule(mod.id)}
                >
                  <span className="font-medium text-sm text-on-surface">Module {index + 1}: {mod.title}</span>
                  <span className={`material-symbols-outlined text-icon-inactive text-sm transition-transform duration-200 ${expandedModules[mod.id] ? 'rotate-180' : ''}`}>
                    keyboard_arrow_down
                  </span>
                </div>
                
                {expandedModules[mod.id] && (
                  <div className="module-items bg-white/30">
                    {mod.lessons && mod.lessons.length > 0 ? (
                      mod.lessons.map((lesson, lIndex) => (
                        <div 
                          key={lesson.id} 
                          onClick={() => setActiveLesson(lesson)}
                          className={`px-8 py-3 text-sm flex items-center gap-3 border-l-4 cursor-pointer transition-colors ${
                            activeLesson?.id === lesson.id 
                              ? 'text-evergreen font-semibold bg-[#eff3e7] border-primary-container shadow-sm relative overflow-hidden' 
                              : 'text-on-surface hover:bg-white/50 border-transparent'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: activeLesson?.id === lesson.id ? "'FILL' 1" : "" }}>
                            {lesson.contentType === 'VIDEO' ? 'play_circle' : 'description'}
                          </span>
                          <span>{index + 1}.{lIndex + 1} {lesson.title}</span>
                        </div>
                      ))
                    ) : (
                      <div className="px-8 py-3 text-sm text-placeholder italic">No lessons in this module</div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
             <div className="p-6 text-sm text-placeholder italic">No modules found for this course.</div>
          )}
        </div>
      </aside>

      {/* Right Panel: Content Viewer */}
      <section className="flex-1 bg-surface p-6 md:p-10 overflow-y-auto">
        {activeLesson ? (
          <div className="max-w-4xl mx-auto pb-24">
            {/* Video Player / Content Container */}
            <div className="bg-surface rounded-xl border border-divider shadow-[0_4px_12px_rgba(19,42,19,0.08)] relative overflow-hidden mb-8 min-h-[300px] flex flex-col">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#90a955] to-[#4f772d] z-10"></div>
              
              {activeLesson.contentType === 'VIDEO' ? (
                <div className="aspect-video bg-evergreen relative overflow-hidden group">
                  {/* Video Mockup */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors cursor-pointer">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 hover:scale-110 transition-transform shadow-lg">
                      <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                    </div>
                  </div>
                  {activeLesson.contentUrl && (
                    <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur">
                      Source: {activeLesson.contentUrl}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 p-8 flex flex-col items-center justify-center text-center bg-slate-50 min-h-[400px]">
                  <span className="material-symbols-outlined text-6xl text-icon-inactive mb-4">description</span>
                  <h3 className="text-xl font-medium text-heading-on-light mb-2">Document Resource</h3>
                  {activeLesson.contentUrl ? (
                    <a href={activeLesson.contentUrl} target="_blank" rel="noreferrer" className="text-primary-container hover:underline font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px]">open_in_new</span> Open Document
                    </a>
                  ) : (
                    <p className="text-placeholder text-sm">No URL provided for this resource.</p>
                  )}
                </div>
              )}
            </div>

            {/* Lesson Details */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-2 py-1 bg-info-bg text-info text-xs font-semibold rounded uppercase tracking-wider">
                  {activeLesson.contentType}
                </span>
              </div>
              <h1 className="text-[32px] md:text-[40px] font-bold text-heading-on-light mb-4 leading-[1.2]">{activeLesson.title}</h1>
              <p className="text-[16px] text-[#444444] max-w-3xl leading-relaxed whitespace-pre-wrap">
                {activeLesson.description || "No description provided for this lesson."}
              </p>
            </div>
            
            {/* Action Area */}
            <div className="flex justify-center md:justify-start mb-16">
              <button className="bg-gradient-to-b from-[#3a6633] to-[#31572c] text-white px-8 h-[48px] rounded-xl font-semibold flex items-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all focus:ring-2 focus:ring-primary-container focus:ring-offset-2">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                Mark as Complete
              </button>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-placeholder text-lg flex-col gap-4">
             <span className="material-symbols-outlined text-4xl">ads_click</span>
             Select a lesson from the sidebar to begin learning
          </div>
        )}
      </section>
    </div>
  );
}
