"use client";

import { useState, useEffect } from 'react';
import { PlayCircle, X } from 'lucide-react';

export function DemoVideoThumbnail() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Interactive Video Demo Thumbnail */}
      <div 
        onClick={() => setIsOpen(true)}
        className="w-full max-w-[550px] mb-10 group cursor-pointer relative rounded-xl overflow-hidden shadow-2xl border border-divider"
      >
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10"></div>
        <img src="/educore_dashboard_mockup.jpg" alt="EduCore Platform Demo" className="w-full h-auto object-cover opacity-90 blur-[1px] group-hover:blur-none group-hover:scale-105 transition-all duration-700" />
        
        {/* Play Button Overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(var(--primary),0.5)] group-hover:scale-110 transition-transform duration-300">
            <PlayCircle className="w-8 h-8 md:w-10 md:h-10 text-on-primary fill-on-primary/20" />
          </div>
        </div>

        {/* Tag */}
        <div className="absolute bottom-4 left-4 z-20 px-3 py-1 bg-surface/90 backdrop-blur-sm rounded-md shadow-sm border border-divider flex items-center gap-2">
          <div className="w-2 h-2 bg-error rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-on-surface">3-Minute Platform Overview</span>
        </div>
      </div>

      {/* Video Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fade-in-up">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer" 
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="relative w-full max-w-[1000px] bg-surface rounded-2xl overflow-hidden shadow-2xl border border-white/10 z-10 aspect-video flex items-center justify-center">
            
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Embedded Video Placeholder */}
            <div className="w-full h-full bg-surface-container-lowest flex flex-col items-center justify-center text-center p-6 relative">
              <div className="absolute inset-0 overflow-hidden opacity-30">
                <img src="/educore_dashboard_mockup.jpg" className="w-full h-full object-cover blur-md scale-105" alt="Background blur" />
              </div>
              <div className="relative z-10">
                <PlayCircle className="w-20 h-20 text-primary mx-auto mb-6 opacity-80" />
                <h3 className="text-2xl font-heading font-bold text-heading-on-light mb-2">EduCore ERP Overview</h3>
                <p className="text-body-secondary max-w-md mx-auto">
                  This interactive demo is currently in production. A live YouTube iframe embed would typically be placed here for prospective clients.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
