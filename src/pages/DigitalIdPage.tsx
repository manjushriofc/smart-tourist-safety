import React, { useState, useEffect } from 'react';
import {
  IdCard,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Lock,
  Key,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  FileCheck2,
  FileX2,
} from 'lucide-react';
import { useSafetySimulation } from '../context/SafetySimulationContext';
import { StatusBadge } from '../components/ui/StatusBadge';
import { api } from '../services/api';
import { DigitalIdVerificationResult } from '../types';

export const DigitalIdPage: React.FC = () => {
  const { primaryTourist } = useSafetySimulation();

  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<DigitalIdVerificationResult | null>(null);

  // Editable / Tamperable state
  const [bloodGroup, setBloodGroup] = useState(primaryTourist.digitalId.bloodGroup);
  const [nationality, setNationality] = useState(primaryTourist.nationality);
  const [idNumber, setIdNumber] = useState(primaryTourist.digitalId.idNumber);
  const [emergencyPhone, setEmergencyPhone] = useState(primaryTourist.digitalId.emergencyContactPhone);
  const [isTampered, setIsTampered] = useState(false);

  // Cryptographic signature from server
  const [storedSignature, setStoredSignature] = useState(
    primaryTourist.digitalId.cryptographicSignature || '0xb9edbb1abe78500c8aeb12ec1c3c37bc1482ec93c999b1b77188fe837bc54eca'
  );

  // Initial verification on mount
  useEffect(() => {
    runVerification();
  }, []);

  const runVerification = async () => {
    setIsVerifying(true);
    try {
      const payload = {
        touristId: primaryTourist.id,
        name: primaryTourist.name,
        nationality,
        digitalId: {
          idNumber,
          bloodGroup,
          issuer: primaryTourist.digitalId.issuer,
          issueDate: primaryTourist.digitalId.issueDate,
          expiryDate: primaryTourist.digitalId.expiryDate,
          emergencyContactName: primaryTourist.digitalId.emergencyContactName,
          emergencyContactPhone: emergencyPhone,
          travelInsurancePolicy: primaryTourist.digitalId.travelInsurancePolicy,
        },
      };

      const res = await api.verifyDigitalId(payload, storedSignature);
      if (res.success && res.data) {
        setVerificationResult(res.data);
      }
    } catch (err) {
      console.error('Verification error:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  const simulateTampering = () => {
    setBloodGroup('AB+ (FORGED)');
    setIdNumber('IN-DL-FORGED-0000');
    setIsTampered(true);
    setTimeout(() => {
      // Trigger automatic verification of tampered fields
      api.verifyDigitalId(
        {
          touristId: primaryTourist.id,
          name: primaryTourist.name,
          nationality,
          digitalId: {
            idNumber: 'IN-DL-FORGED-0000',
            bloodGroup: 'AB+ (FORGED)',
            issuer: primaryTourist.digitalId.issuer,
            issueDate: primaryTourist.digitalId.issueDate,
            expiryDate: primaryTourist.digitalId.expiryDate,
            emergencyContactName: primaryTourist.digitalId.emergencyContactName,
            emergencyContactPhone: emergencyPhone,
            travelInsurancePolicy: primaryTourist.digitalId.travelInsurancePolicy,
          },
        },
        storedSignature
      ).then(res => {
        if (res.success && res.data) {
          setVerificationResult(res.data);
        }
      });
    }, 100);
  };

  const restoreBaseline = () => {
    setBloodGroup(primaryTourist.digitalId.bloodGroup);
    setNationality(primaryTourist.nationality);
    setIdNumber(primaryTourist.digitalId.idNumber);
    setEmergencyPhone(primaryTourist.digitalId.emergencyContactPhone);
    setIsTampered(false);

    // Re-verify genuine baseline
    setTimeout(() => {
      runVerification();
    }, 100);
  };

  const handleCopySignature = () => {
    navigator.clipboard.writeText(storedSignature);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isValid = verificationResult?.status === 'VALID';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60">
              Cryptographic Identity Infrastructure
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Deterministic SHA-256 Signature Verification
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            DIGITAL TOURIST ID & VERIFICATION
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Verifiable digital pass with immutable SHA-256 identity hashing and anti-tampering validation.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isTampered ? (
            <button
              onClick={restoreBaseline}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-xs"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Restore Authentic Record</span>
            </button>
          ) : (
            <button
              onClick={simulateTampering}
              className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-xs"
            >
              <ShieldAlert className="h-4 w-4" />
              <span>Simulate Field Tampering</span>
            </button>
          )}

          <button
            onClick={runVerification}
            disabled={isVerifying}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs disabled:opacity-50"
          >
            <Key className="h-4 w-4" />
            <span>{isVerifying ? 'Verifying...' : 'Re-Verify SHA-256'}</span>
          </button>
        </div>
      </div>

      {/* Verification Status Banner */}
      {verificationResult && (
        <div
          className={`p-5 rounded-2xl border shadow-sm transition-all duration-300 ${
            isValid
              ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
              : 'bg-rose-50/90 border-rose-300 text-rose-950'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                  isValid ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                }`}
              >
                {isValid ? <FileCheck2 className="h-6 w-6" /> : <FileX2 className="h-6 w-6" />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      isValid ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                    }`}
                  >
                    STATUS: {verificationResult.status}
                  </span>
                  <span className="text-xs font-mono opacity-75">Algorithm: SHA-256</span>
                </div>
                <h3 className="font-extrabold text-base tracking-tight">
                  {isValid ? '✓ DIGITAL ID INTEGRITY VERIFIED' : '✗ DIGITAL ID INTEGRITY FAILED (TAMPERED)'}
                </h3>
                <p className="text-xs leading-relaxed opacity-90">{verificationResult.message}</p>
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-[10px] uppercase font-bold opacity-60 block font-mono">Verification Mode</span>
              <span className="font-mono text-xs font-bold">Canonical SHA-256</span>
            </div>
          </div>
        </div>
      )}

      {/* The Physical / Digital Pass Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white rounded-3xl p-8 border border-slate-700/80 shadow-2xl relative overflow-hidden space-y-6">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top bar of pass */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400">
              <IdCard className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-blue-400 uppercase font-bold block">
                Republic of India • National Safety Framework
              </span>
              <h2 className="text-xl font-black tracking-tight text-white">
                SMART TOURIST VERIFIABLE ID
              </h2>
            </div>
          </div>

          <div className="text-right">
            <span
              className={`text-xs font-mono font-black px-3 py-1 rounded-full uppercase border ${
                isValid
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-400/40'
              }`}
            >
              {isValid ? 'VALID PASS' : 'TAMPERED / INVALID'}
            </span>
          </div>
        </div>

        {/* Identity Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {/* Avatar and Primary */}
          <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/10 text-center space-y-2">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-3xl font-black flex items-center justify-center shadow-lg border-2 border-white/20">
              AS
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">{primaryTourist.name}</h3>
              <p className="text-xs text-blue-300 font-mono">{primaryTourist.id}</p>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
              <ShieldCheck className="h-3 w-3" />
              KYC VERIFIED
            </span>
          </div>

          {/* Core Fields */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase block font-sans">Document ID No.</span>
              <span className={`font-bold text-white block ${isTampered ? 'text-rose-300 line-through' : ''}`}>
                {idNumber}
              </span>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase block font-sans">Nationality</span>
              <span className="font-bold text-white block">{nationality}</span>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase block font-sans">Blood Group</span>
              <span className={`font-bold block ${isTampered ? 'text-rose-400 font-black' : 'text-emerald-300'}`}>
                {bloodGroup} {isTampered && '⚠ FORGED'}
              </span>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase block font-sans">Emergency Contact</span>
              <span className="font-bold text-white block truncate">{primaryTourist.digitalId.emergencyContactName}</span>
              <span className="text-slate-400 text-[10px] block">{emergencyPhone}</span>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase block font-sans">Issuance Date</span>
              <span className="font-bold text-white block">{primaryTourist.digitalId.issueDate}</span>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase block font-sans">Expiry Validity</span>
              <span className="font-bold text-white block">{primaryTourist.digitalId.expiryDate}</span>
            </div>
          </div>
        </div>

        {/* Cryptographic SHA-256 Hash Signature Section */}
        <div className="p-4 bg-black/40 rounded-2xl border border-white/10 space-y-2 relative z-10">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-blue-300 flex items-center gap-1.5">
              <Lock className="h-4 w-4" />
              <span>SHA-256 Cryptographic Signature</span>
            </span>
            <button
              onClick={handleCopySignature}
              className="text-[11px] font-mono text-slate-300 hover:text-white flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded transition"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              <span>{copied ? 'Copied' : 'Copy Hash'}</span>
            </button>
          </div>

          <div className="p-3 bg-black/60 rounded-xl border border-white/5 font-mono text-xs text-emerald-400 break-all leading-relaxed">
            {storedSignature}
          </div>

          {verificationResult?.computedHash && (
            <div className="text-[11px] font-mono text-slate-400 pt-1 flex items-center justify-between">
              <span>Computed Hash: <strong className={isValid ? 'text-emerald-400' : 'text-rose-400'}>{verificationResult.computedHash}</strong></span>
              <span className={isValid ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {isValid ? 'MATCH ✓' : 'MISMATCH ✗'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
