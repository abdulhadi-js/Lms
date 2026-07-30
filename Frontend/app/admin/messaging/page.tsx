"use client";
import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Plus, Loader2, AlertCircle, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { messagingApi } from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function MessagingOutbox() {
  const [activeTab, setActiveTab] = useState<'OUTBOX' | 'TEMPLATES'>('OUTBOX');
  const [outbox, setOutbox] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Template Modal
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [templateForm, setTemplateForm] = useState({
    name: '',
    type: 'SMS',
    content: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [outboxData, templatesData] = await Promise.all([
        messagingApi.getOutbox(),
        messagingApi.getTemplates()
      ]);
      setOutbox(outboxData.data || outboxData || []);
      setTemplates(templatesData.data || templatesData || []);
    } catch (err: any) {
      toast.error('Failed to load messaging data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await messagingApi.createTemplate(templateForm);
      toast.success('Template saved successfully!');
      setIsTemplateModalOpen(false);
      setTemplateForm({ name: '', type: 'SMS', content: '' });
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save template');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-[32px] py-8 pb-24 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-heading-on-light">Messaging Automation</h2>
          <p className="text-sm text-body-secondary mt-1">Manage SMS & WhatsApp templates and monitor the auto-triggered outbox.</p>
        </div>
        {activeTab === 'TEMPLATES' && (
          <button 
            onClick={() => setIsTemplateModalOpen(true)}
            className="flex items-center gap-2 primary-gradient text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:shadow-md transition-shadow"
          >
            <Plus className="h-4 w-4" />
            New Template
          </button>
        )}
      </div>

      <div className="flex gap-4 border-b border-divider">
        <button
          onClick={() => setActiveTab('OUTBOX')}
          className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${
            activeTab === 'OUTBOX' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-body-secondary hover:text-on-surface'
          }`}
        >
          Message Outbox
        </button>
        <button
          onClick={() => setActiveTab('TEMPLATES')}
          className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${
            activeTab === 'TEMPLATES' 
              ? 'border-primary text-primary' 
              : 'border-transparent text-body-secondary hover:text-on-surface'
          }`}
        >
          Templates
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : activeTab === 'OUTBOX' ? (
        <div className="bg-surface rounded-xl border border-divider brand-shadow overflow-hidden">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-container-low text-body-secondary text-xs uppercase tracking-wider border-b border-divider">
                <th className="py-4 px-6 font-semibold">Recipient</th>
                <th className="py-4 px-6 font-semibold w-1/2">Message Content</th>
                <th className="py-4 px-6 font-semibold">Queued At</th>
                <th className="py-4 px-6 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {outbox.length === 0 ? (
                <tr><td colSpan={4} className="py-8 text-center text-body-secondary">Outbox is empty.</td></tr>
              ) : outbox.map((msg: any) => (
                <tr key={msg.id} className="border-b border-border-light even:bg-surface-container-low hover:bg-surface transition-colors">
                  <td className="py-4 px-6 font-medium text-on-surface">{msg.recipientPhone || msg.recipientEmail}</td>
                  <td className="py-4 px-6 text-body-secondary text-xs">{msg.content}</td>
                  <td className="py-4 px-6 text-body-secondary">{new Date(msg.createdAt).toLocaleString()}</td>
                  <td className="py-4 px-6">
                    {msg.status === 'PENDING' && <span className="inline-flex items-center text-warning bg-warning-bg px-2.5 py-1 rounded-full text-xs font-semibold"><Clock className="w-3 h-3 mr-1" /> Pending</span>}
                    {msg.status === 'SENT' && <span className="inline-flex items-center text-success bg-success-bg px-2.5 py-1 rounded-full text-xs font-semibold"><CheckCircle2 className="w-3 h-3 mr-1" /> Sent</span>}
                    {msg.status === 'FAILED' && <span className="inline-flex items-center text-error bg-error-bg px-2.5 py-1 rounded-full text-xs font-semibold"><XCircle className="w-3 h-3 mr-1" /> Failed</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.length === 0 ? (
            <div className="col-span-full py-12 text-center text-body-secondary border border-dashed border-divider rounded-xl">
              No templates created yet.
            </div>
          ) : templates.map((tpl: any) => (
            <div key={tpl.id} className="bg-surface rounded-xl border border-divider brand-shadow p-5 flex flex-col relative group">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-on-surface">{tpl.name}</h3>
                <span className={`px-2 py-1 rounded text-xs font-bold ${tpl.type === 'WHATSAPP' ? 'bg-success-bg text-success' : 'bg-primary-container text-primary-fixed'}`}>
                  {tpl.type}
                </span>
              </div>
              <div className="bg-surface-container-lowest border border-border-light rounded-lg p-3 text-sm text-body-secondary font-mono whitespace-pre-wrap flex-grow">
                {tpl.content}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Template Modal */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-divider flex justify-between items-center">
              <h3 className="text-xl font-bold text-heading-on-light flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" /> Create Template
              </h3>
              <button onClick={() => setIsTemplateModalOpen(false)} className="text-icon-inactive hover:text-error transition-colors">&times;</button>
            </div>
            
            <form onSubmit={handleSaveTemplate} className="p-6 space-y-4">
              <div className="bg-primary/10 text-primary-fixed border border-primary/20 rounded-lg p-3 text-sm flex gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>Use variables like <code>{`{{studentName}}`}</code>, <code>{`{{course}}`}</code>, or <code>{`{{date}}`}</code> to parameterize the message.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Template Name</label>
                <input 
                  type="text" required value={templateForm.name} onChange={e => setTemplateForm({...templateForm, name: e.target.value})}
                  placeholder="e.g. Absentee Alert"
                  className="w-full bg-white border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Channel</label>
                <select 
                  value={templateForm.type} onChange={e => setTemplateForm({...templateForm, type: e.target.value})}
                  className="w-full bg-white border border-border-light rounded-lg px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="SMS">SMS</option>
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="EMAIL">Email</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Message Content</label>
                <textarea 
                  required value={templateForm.content} onChange={e => setTemplateForm({...templateForm, content: e.target.value})}
                  placeholder="Dear Parent, {{studentName}} is absent from {{course}} today."
                  className="w-full bg-white border border-border-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[120px]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-divider">
                <button type="button" onClick={() => setIsTemplateModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-body-secondary hover:bg-surface-container rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
