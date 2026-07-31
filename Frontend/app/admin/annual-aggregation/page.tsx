"use client";
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function AnnualAggregation() {
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Annual aggregated results generated successfully!');
    }, 1500);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-heading-on-light">Annual Aggregated Results</h2>
          <p className="text-sm text-body-secondary mt-1">Generate class/section/session results.</p>
        </div>
      </div>

      <div className="bg-surface p-6 rounded-xl border border-divider shadow-sm">
        <p className="text-body-secondary mb-4">Click the button below to generate aggregated results for the current academic session.</p>
        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Annual Results'}
        </button>
      </div>
    </div>
  );
}
