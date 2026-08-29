import React from 'react';
import { Department, DefectSeverity, BlockStatus, SourceSystem } from '../../types';

export const DeptBadge: React.FC<{ dept: Department }> = ({ dept }) => {
  switch (dept) {
    case 'ENGG':
      return (
        <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-semibold px-2 py-0.5 rounded">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          ENGG (Track/Civil)
        </span>
      );
    case 'SNT':
      return (
        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold px-2 py-0.5 rounded">
          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
          S&T (Signals/Telecom)
        </span>
      );
    case 'TRD':
      return (
        <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-300 text-[11px] font-semibold px-2 py-0.5 rounded">
          <span className="w-2 h-2 rounded-full bg-amber-600"></span>
          TRD (Electrical OHE)
        </span>
      );
    case 'OPT':
      return (
        <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-800 border border-purple-200 text-[11px] font-semibold px-2 py-0.5 rounded">
          <span className="w-2 h-2 rounded-full bg-purple-600"></span>
          OPT (Operating/Traffic)
        </span>
      );
  }
};

export const SourceSystemBadge: React.FC<{ source: SourceSystem }> = ({ source }) => {
  const map: Record<SourceSystem, { bg: string; text: string; border: string }> = {
    TMS: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
    SMMS: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' },
    TDMS: { bg: 'bg-amber-100', text: 'text-amber-900', border: 'border-amber-300' },
    COA: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300' },
    BDMS: { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300' },
  };
  const c = map[source] || map.BDMS;
  return (
    <span className={`inline-block font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border ${c.bg} ${c.text} ${c.border}`}>
      {source}
    </span>
  );
};

export const SeverityPill: React.FC<{ severity: DefectSeverity }> = ({ severity }) => {
  switch (severity) {
    case 'EMERGENCY':
      return (
        <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-800 border border-red-300 text-[11px] font-bold px-2 py-0.5 rounded">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
          Emergency
        </span>
      );
    case 'CRITICAL':
      return (
        <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold px-2 py-0.5 rounded">
          <span className="w-2 h-2 rounded-full bg-amber-600"></span>
          Critical
        </span>
      );
    case 'OVERDUE':
      return (
        <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-900 border border-orange-200 text-[11px] font-semibold px-2 py-0.5 rounded">
          <span className="w-2 h-2 rounded-full bg-orange-500"></span>
          Overdue
        </span>
      );
    case 'ROUTINE':
      return (
        <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 border border-slate-300 text-[11px] font-medium px-2 py-0.5 rounded">
          <span className="w-2 h-2 rounded-full bg-slate-400"></span>
          Routine
        </span>
      );
  }
};

export const BlockStatusPill: React.FC<{ status: BlockStatus }> = ({ status }) => {
  switch (status) {
    case 'SANCTIONED':
      return (
        <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded">
          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
          ✓ Sanctioned
        </span>
      );
    case 'RECOMMENDED':
      return (
        <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-900 border border-blue-300 text-[11px] font-bold px-2.5 py-0.5 rounded">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          ★ Recommended
        </span>
      );
    case 'UNDER_REVIEW':
      return (
        <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-semibold px-2.5 py-0.5 rounded">
          <span className="w-2 h-2 rounded-full bg-amber-600"></span>
          ⏳ Under Review
        </span>
      );
    case 'IN_PROGRESS':
      return (
        <span className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-900 border border-purple-300 text-[11px] font-bold px-2.5 py-0.5 rounded">
          <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
          ⚡ In Progress
        </span>
      );
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 border border-slate-300 text-[11px] font-medium px-2.5 py-0.5 rounded">
          ✔ Completed
        </span>
      );
    case 'CANCELLED':
      return (
        <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-800 border border-red-200 text-[11px] font-medium px-2.5 py-0.5 rounded">
          ✖ Cancelled
        </span>
      );
  }
};
