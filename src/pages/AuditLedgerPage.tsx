import React, { useState, useEffect } from 'react';
import {
  Link2,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  AlertOctagon,
  RefreshCw,
  Layers,
  Lock,
  ArrowDown,
  Clock,
  User,
  Info,
  Check,
  X,
  FileCode,
  Shield,
} from 'lucide-react';
import { api } from '../services/api';
import { LedgerBlock, ChainVerificationResult } from '../types';
import { StatusBadge } from '../components/ui/StatusBadge';

export const AuditLedgerPage: React.FC = () => {
  const [blocks, setBlocks] = useState<LedgerBlock[]>([]);
  const [verificationResult, setVerificationResult] = useState<ChainVerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchLedger();
  }, []);

  const fetchLedger = async () => {
    setIsLoading(true);
    try {
      const res = await api.getLedger();
      if (res.success && res.data) {
        setBlocks(res.data);
        if (res.verification) {
          setVerificationResult(res.verification);
        }
      }
    } catch (err) {
      console.error('Failed to fetch ledger:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyChain = async () => {
    setIsLoading(true);
    try {
      const res = await api.verifyLedger();
      if (res.success && res.data) {
        setVerificationResult(res.data);
        setActionMessage(res.data.message);
      }
    } catch (err) {
      console.error('Failed to verify ledger chain:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulateTamper = async () => {
    setIsLoading(true);
    try {
      const res = await api.tamperLedger(2);
      if (res.success && res.data) {
        setActionMessage(res.data.message);
        // Refresh blocks and verification result
        await fetchLedger();
      }
    } catch (err) {
      console.error('Failed to simulate tamper:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetLedger = async () => {
    setIsLoading(true);
    try {
      const res = await api.resetLedger();
      if (res.success && res.data) {
        setBlocks(res.data.chain);
        setVerificationResult(res.data.verificationResult);
        setActionMessage('Audit ledger successfully restored to verified baseline.');
      }
    } catch (err) {
      console.error('Failed to reset ledger:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const isChainValid = verificationResult?.valid ?? true;
  const brokenIndex = verificationResult?.brokenBlockIndex;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60">
              Cryptographic Integrity Repository
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Total Blocks: <strong>{blocks.length} records</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            TAMPER-EVIDENT AUDIT LEDGER
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Cryptographically linked immutable event log guaranteeing non-repudiation and tamper detection.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleVerifyChain}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs disabled:opacity-50"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>VERIFY ENTIRE CHAIN</span>
          </button>

          <button
            onClick={handleSimulateTamper}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition shadow-xs disabled:opacity-50"
          >
            <ShieldAlert className="h-4 w-4" />
            <span>SIMULATE TAMPERING</span>
          </button>

          <button
            onClick={handleResetLedger}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2.5 rounded-xl transition border border-slate-200 disabled:opacity-50"
          >
            <RefreshCw className="h-4 w-4" />
            <span>RESTORE CHAIN</span>
          </button>
        </div>
      </div>

      {/* Chain Verification Result Banner */}
      {verificationResult && (
        <div
          className={`p-6 rounded-2xl border shadow-sm transition-all duration-300 ${
            isChainValid
              ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 ring-1 ring-emerald-400/40'
              : 'bg-rose-50/90 border-rose-300 text-rose-950 ring-2 ring-rose-400'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                  isChainValid ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white animate-pulse'
                }`}
              >
                {isChainValid ? <CheckCircle2 className="h-8 w-8" /> : <AlertOctagon className="h-8 w-8" />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      isChainValid ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                    }`}
                  >
                    {isChainValid ? 'INTEGRITY SECURE' : 'TAMPERING DETECTED'}
                  </span>
                  <span className="text-xs font-mono opacity-80">
                    Chain Depth: {blocks.length} Blocks
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  {isChainValid ? '✓ CHAIN INTEGRITY VERIFIED' : '✗ CHAIN INTEGRITY FAILED'}
                </h2>
                <p className="text-xs sm:text-sm leading-relaxed opacity-90 font-medium">
                  {verificationResult.message}
                </p>
              </div>
            </div>

            {brokenIndex !== null && brokenIndex !== undefined && (
              <div className="text-right bg-white/70 p-3 rounded-xl border border-rose-200 shrink-0">
                <span className="text-[10px] uppercase font-bold text-rose-600 block font-mono">Broken Point</span>
                <span className="text-sm font-black text-rose-700 font-mono">Block #{brokenIndex}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Visual Chained Block List */}
      <div className="space-y-4">
        {blocks.map((block, idx) => {
          const isTamperedBlock = block.tampered || (brokenIndex !== null && brokenIndex === block.index);
          const isGenesis = block.index === 0;

          return (
            <React.Fragment key={block.index}>
              {/* Connector Chain Link (rendered between blocks) */}
              {idx > 0 && (
                <div className="flex items-center justify-center my-1">
                  <div
                    className={`flex items-center gap-2 px-4 py-1 rounded-full text-[10px] font-mono font-extrabold border ${
                      isTamperedBlock
                        ? 'bg-rose-100 text-rose-700 border-rose-300 animate-pulse'
                        : 'bg-blue-50 text-blue-700 border-blue-200/80'
                    }`}
                  >
                    <Link2 className="h-3.5 w-3.5" />
                    <span>
                      {isTamperedBlock
                        ? 'BROKEN CRYPTOGRAPHIC HASH LINKAGE'
                        : `PREVIOUS HASH LINK: ${blocks[idx - 1].hash.substring(0, 16)}...`}
                    </span>
                    <ArrowDown className="h-3.5 w-3.5" />
                  </div>
                </div>
              )}

              {/* Block Card */}
              <div
                className={`bg-white rounded-2xl border p-6 transition-all duration-200 shadow-xs relative overflow-hidden ${
                  isTamperedBlock
                    ? 'border-rose-400 ring-2 ring-rose-400 bg-rose-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Block Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-sm border shadow-xs ${
                        isTamperedBlock
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : 'bg-slate-900 text-white border-slate-800'
                      }`}
                    >
                      #{block.index}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm sm:text-base font-mono">
                          {block.type}
                        </span>
                        {isGenesis && (
                          <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                            GENESIS
                          </span>
                        )}
                        {isTamperedBlock && (
                          <span className="bg-rose-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded animate-pulse">
                            FORGED / CORRUPTED
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-mono mt-0.5 flex items-center gap-2">
                        <span>Subject: <strong>{block.touristId}</strong></span>
                        <span>•</span>
                        <span>{block.timestamp}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-bold font-mono px-3 py-1 rounded-full border ${
                        isTamperedBlock
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {isTamperedBlock ? 'INTEGRITY MISMATCH' : 'BLOCK VERIFIED'}
                    </span>
                  </div>
                </div>

                {/* Block Payload Data */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Left: Payload JSON / Properties */}
                  <div className="md:col-span-6 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">
                      Block Payload Data
                    </span>
                    <pre className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] font-mono text-slate-800 overflow-x-auto">
                      {JSON.stringify(block.data, null, 2)}
                    </pre>
                  </div>

                  {/* Right: Cryptographic Hashes */}
                  <div className="md:col-span-6 space-y-2 font-mono text-xs">
                    {/* Previous Hash */}
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">
                        Previous Block Hash
                      </span>
                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 text-[11px] break-all">
                        {block.previousHash}
                      </div>
                    </div>

                    {/* Data Hash */}
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">
                        Data Payload Hash (SHA-256)
                      </span>
                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-blue-700 text-[11px] break-all font-bold">
                        {block.dataHash}
                      </div>
                    </div>

                    {/* Block Hash */}
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">
                        Final Block Hash
                      </span>
                      <div
                        className={`p-2.5 rounded-lg border text-[11px] break-all font-bold ${
                          isTamperedBlock
                            ? 'bg-rose-50 border-rose-300 text-rose-700'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        }`}
                      >
                        {block.hash}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Compliance / Educational Note */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Tamper-Evident Chained Audit Ledger:</strong> Every incident, geofence breach, SOS activation, and digital ID creation event is immutably sealed with a deterministic SHA-256 cryptographic digest linked to the prior block's hash. Any modification to past entries breaks downstream cryptographic linkage and is instantaneously flagged during chain verification.
        </p>
      </div>
    </div>
  );
};
