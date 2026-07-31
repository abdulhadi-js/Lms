"use client";

import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { Upload, FileText, X, AlertCircle, CheckCircle, Download } from 'lucide-react';
import { usersApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BulkImportModal({ isOpen, onClose, onSuccess }: BulkImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewRows, setPreviewRows] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{ success?: boolean; count?: number; errors?: string[] } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    if (!selectedFile.name.endsWith('.csv')) {
      toast.error('Please upload a valid .csv file');
      return;
    }

    setFile(selectedFile);
    setResults(null);

    // Parse for preview
    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.meta.fields) {
          setHeaders(results.meta.fields);
        }
        setPreviewRows(results.data.slice(0, 5));
      }
    });
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsLoading(true);
    setResults(null);
    try {
      const res = await usersApi.bulkImport(file);
      setResults(res);
      if (res.errors && res.errors.length === 0) {
        toast.success(`Successfully imported ${res.count} users!`);
        onSuccess();
      } else if (res.count && res.count > 0) {
        toast.success(`Imported ${res.count} users, but with some errors.`);
        onSuccess();
      } else {
        toast.error('Import failed due to errors.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to import CSV');
      setResults({ success: false, errors: [err.message || 'Unknown error occurred'] });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTemplate = () => {
    const template = "role,firstName,lastName,email,phone,campusCode,sectionCode,fatherName,fatherPhone,motherName,basicSalary,qualifications,experience\nSTUDENT,John,Doe,john@example.com,123456789,CAMPUS_MAIN,SEC-A,James Doe,987654321,Jane Doe,,,\nTEACHER,Sarah,Smith,sarah@example.com,555555555,CAMPUS_MAIN,,,,,,50000,Masters,5 years";
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "educore_users_template.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setPreviewRows([]);
    setHeaders([]);
    setResults(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-surface rounded-xl shadow-2xl border border-divider w-full max-w-3xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-divider">
          <div>
            <h2 className="text-xl font-bold text-on-surface">Bulk Import Users</h2>
            <p className="text-sm text-on-surface-variant mt-1">Upload a CSV to quickly add students and staff.</p>
          </div>
          <button onClick={onClose} className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {!file && (
            <div className="space-y-6">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-primary/30 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 hover:border-primary transition-all text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-on-surface text-lg mb-2">Click or drag CSV file to upload</h3>
                <p className="text-on-surface-variant text-sm mb-6 max-w-sm">
                  Must include headers like role, firstName, email, campusCode.
                </p>
                <input 
                  type="file" 
                  accept=".csv" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
              </div>

              <div className="flex items-center justify-between bg-surface-container-lowest p-4 rounded-lg border border-divider">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <h4 className="font-medium text-sm text-on-surface">Need help getting started?</h4>
                    <p className="text-xs text-on-surface-variant">Download our standard CSV template</p>
                  </div>
                </div>
                <button 
                  onClick={downloadTemplate}
                  className="flex items-center gap-2 text-sm font-medium text-primary hover:underline px-3 py-1.5"
                >
                  <Download className="w-4 h-4" /> Download Template
                </button>
              </div>
            </div>
          )}

          {file && !results && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-primary-container/30 border border-primary/20 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-surface rounded shadow-sm">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-on-surface">{file.name}</h4>
                    <p className="text-xs text-on-surface-variant">{(file.size / 1024).toFixed(1)} KB • {headers.length} columns detected</p>
                  </div>
                </div>
                <button onClick={reset} className="text-sm text-error hover:underline px-3 py-1 font-medium">Remove</button>
              </div>

              {previewRows.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-on-surface mb-3 flex items-center gap-2">
                    Data Preview <span className="text-xs font-normal text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">First 5 rows</span>
                  </h4>
                  <div className="overflow-x-auto border border-divider rounded-lg">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-surface-container-low text-xs uppercase text-on-surface-variant">
                        <tr>
                          {headers.slice(0, 6).map((h, i) => (
                            <th key={i} className="px-4 py-3 font-medium">{h}</th>
                          ))}
                          {headers.length > 6 && <th className="px-4 py-3 font-medium">...</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {previewRows.map((row, idx) => (
                          <tr key={idx} className="border-b border-divider last:border-0 hover:bg-surface-container-lowest">
                            {headers.slice(0, 6).map((h, i) => (
                              <td key={i} className="px-4 py-3 text-on-surface truncate max-w-[120px]">{row[h]}</td>
                            ))}
                            {headers.length > 6 && <td className="px-4 py-3 text-on-surface-variant">...</td>}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {results && (
            <div className="space-y-6">
              <div className={`p-6 rounded-xl flex flex-col items-center justify-center text-center ${results.errors && results.errors.length > 0 ? 'bg-error/10 border border-error/20' : 'bg-success/10 border border-success/20'}`}>
                {results.errors && results.errors.length > 0 ? (
                  <AlertCircle className="w-12 h-12 text-error mb-3" />
                ) : (
                  <CheckCircle className="w-12 h-12 text-success mb-3" />
                )}
                <h3 className="text-xl font-bold text-on-surface mb-1">
                  {results.errors && results.errors.length > 0 && results.count === 0 
                    ? 'Import Failed' 
                    : `Imported ${results.count} users`}
                </h3>
                {results.errors && results.errors.length > 0 && (
                  <p className="text-error font-medium text-sm mt-2">Encountered {results.errors.length} errors during import.</p>
                )}
              </div>

              {results.errors && results.errors.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-on-surface mb-3 flex items-center gap-2">Error Log</h4>
                  <div className="bg-surface-container-lowest border border-divider rounded-lg p-4 max-h-48 overflow-y-auto">
                    <ul className="space-y-2">
                      {results.errors.map((err, idx) => (
                        <li key={idx} className="text-sm text-error flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-error mt-1.5 shrink-0" />
                          <span>{err}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-divider bg-surface-container-lowest flex justify-end gap-3">
          {results ? (
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Close
            </button>
          ) : (
            <>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="px-5 py-2.5 rounded-lg font-medium text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!file || isLoading}
                className="px-5 py-2.5 rounded-lg font-medium bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Start Import
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
