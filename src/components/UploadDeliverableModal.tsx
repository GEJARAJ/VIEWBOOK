'use client';

import React, { useState } from 'react';
import { useEscrow } from '@/context/EscrowContext';
import { DeliverableFile } from '@/types/escrow';
import { generateSha256 } from '@/lib/utils';
import {
  Upload,
  X,
  ShieldCheck,
  FileCode,
  FileImage,
  FileText,
  Sparkles,
  Fingerprint,
} from 'lucide-react';

export const UploadDeliverableModal: React.FC = () => {
  const { uploadModal, closeUploadModal, submitDeliverable } = useEscrow();

  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState<'code' | 'image' | 'document'>('code');
  const [fileSize, setFileSize] = useState('1.2 MB');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [isWatermarkingConfirmed, setIsWatermarkingConfirmed] = useState(true);

  if (!uploadModal) return null;

  const loadPreset = (preset: 'code' | 'image' | 'document') => {
    if (preset === 'code') {
      setFileType('code');
      setFileName('auth-rate-limiter.service.ts');
      setFileSize('280 KB');
      setCodeSnippet(`import { Redis } from 'ioredis';

// ViewBook Encrypted Auth Rate Limiter
export class TokenBucketLimiter {
  private redis: Redis;
  private maxTokens: number = 100;
  private refillRatePerSec: number = 10;

  constructor(redisClient: Redis) {
    this.redis = redisClient;
  }

  async acquireToken(userKey: string): Promise<boolean> {
    const current = await this.redis.incr(userKey);
    return current <= this.maxTokens;
  }
}`);
    } else if (preset === 'image') {
      setFileType('image');
      setFileName('mission-control-ui-mockup.png');
      setFileSize('3.4 MB');
      setPreviewUrl('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80');
    } else {
      setFileType('document');
      setFileName('system-security-audit-v2.pdf');
      setFileSize('5.1 MB');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) return;

    const hash = generateSha256(fileName + Date.now().toString());

    const newDeliverable: DeliverableFile = {
      id: `DEL-${Math.floor(1000 + Math.random() * 9000)}`,
      name: fileName,
      size: fileSize,
      type: fileType,
      codeSnippet: fileType === 'code' ? codeSnippet : undefined,
      previewUrl:
        fileType === 'image'
          ? previewUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
          : undefined,
      sha256Hash: hash,
      uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
    };

    submitDeliverable(uploadModal.contractId, uploadModal.milestoneId, newDeliverable);
    closeUploadModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Deposit Deliverable into ViewBook Vault
              </h3>
              <p className="text-xs text-slate-400">
                Milestone: {uploadModal.milestoneId}
              </p>
            </div>
          </div>
          <button
            onClick={closeUploadModal}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Quick Presets */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Fast Demo Presets:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => loadPreset('code')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition"
              >
                <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                <span>Backend Code</span>
              </button>
              <button
                type="button"
                onClick={() => loadPreset('image')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition"
              >
                <FileImage className="w-3.5 h-3.5 text-emerald-400" />
                <span>UI Mockup</span>
              </button>
              <button
                type="button"
                onClick={() => loadPreset('document')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition"
              >
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                <span>Security PDF</span>
              </button>
            </div>
          </div>

          {/* File Name & Size */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-medium text-slate-300">File Name</label>
              <input
                type="text"
                required
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="e.g. system_architecture.ts"
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">File Size</label>
              <input
                type="text"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          {/* Deliverable Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Deliverable Format</label>
            <div className="grid grid-cols-3 gap-2">
              {(['code', 'image', 'document'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFileType(t)}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium capitalize border transition ${
                    fileType === t
                      ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {t === 'code' && <FileCode className="w-3.5 h-3.5" />}
                  {t === 'image' && <FileImage className="w-3.5 h-3.5" />}
                  {t === 'document' && <FileText className="w-3.5 h-3.5" />}
                  <span>{t}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Inputs */}
          {fileType === 'code' && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Source Code Snippet</label>
              <textarea
                rows={5}
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                placeholder="// Enter code here..."
                className="w-full p-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>
          )}

          {fileType === 'image' && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Image URL</label>
              <input
                type="text"
                value={previewUrl}
                onChange={(e) => setPreviewUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          )}

          {/* Forensic Protection Notice */}
          <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-900/40 flex items-start gap-2.5">
            <Fingerprint className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-[11px] text-cyan-200 leading-relaxed">
              <strong>Theft-Proof Protocol:</strong> Upon submission, ViewBook generates an immutable
              SHA-256 checksum and applies a dynamic forensic watermark. Raw download is gated until
              the client releases the escrow funds.
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="confirmWatermark"
              checked={isWatermarkingConfirmed}
              onChange={(e) => setIsWatermarkingConfirmed(e.target.checked)}
              className="rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-0"
            />
            <label htmlFor="confirmWatermark" className="text-xs text-slate-300 cursor-pointer">
              Apply dynamic forensic watermark and gate raw download
            </label>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={closeUploadModal}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!fileName.trim() || !isWatermarkingConfirmed}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-slate-950 transition shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Deposit to Vault</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};