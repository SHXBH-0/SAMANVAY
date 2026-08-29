import React, { useState, useEffect } from 'react';
import { Clock, Building2, UserCheck, RefreshCw } from 'lucide-react';

interface GovHeaderProps {
  activeDivision: string;
  onDivisionChange: (division: string) => void;
  activeRole: string;
  onRoleChange: (role: string) => void;
  onRefreshData?: () => void;
}

export const GovHeader: React.FC<GovHeaderProps> = ({
  activeDivision,
  onDivisionChange,
  activeRole,
  onRoleChange,
  onRefreshData
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setCurrentTime(new Intl.DateTimeFormat('en-IN', options).format(now) + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-slate-200 bg-white no-print">
      {/* Top subtle National Tricolor hairline */}
      <div className="h-1 w-full flex">
        <div className="w-1/3 bg-[#FF9933]" />
        <div className="w-1/3 bg-white" />
        <div className="w-1/3 bg-[#138808]" />
      </div>

      {/* Top Gov Metadata Ribbon */}
      <div className="bg-[#0D1E32] text-slate-300 text-[11px] px-4 lg:px-8 py-1.5 flex flex-wrap items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3 tracking-wide">
          <span className="font-semibold text-slate-100 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            GOVERNMENT OF INDIA • MINISTRY OF RAILWAYS (रेल मंत्रालय)
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-400 hidden sm:inline">Centre for Railway Information Systems (CRIS)</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px] tabular-nums">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{currentTime || 'Loading IST...'}</span>
          </div>

          <div className="flex items-center gap-2 border-l border-slate-700 pl-3">
            <span className="text-slate-400 text-[10px] uppercase font-mono">Standard GIGW 3.0</span>
          </div>
        </div>
      </div>

      {/* Main Official Header Branding */}
      <div className="px-4 lg:px-8 py-3.5 bg-white flex flex-wrap items-center justify-between gap-4">
        {/* Left: Indian Railways Crest & Portal Title */}
        <div className="flex items-center space-x-3.5">
          {/* Official Emblem Badge */}
          <div className="w-11 h-11 rounded bg-[#0D1E32] text-white flex items-center justify-center font-serif font-black text-lg border border-slate-300 shadow-xs flex-shrink-0">
            IR
          </div>

          <div>
            <div className="flex items-baseline gap-2.5">
              <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-[#0D1E32]">
                SAMANVAY
              </h1>
              <span className="text-sm font-serif text-slate-500">(समन्वय)</span>
              <span className="text-[11px] text-slate-500 font-mono hidden md:inline">
                | Integrated Automatic Block Planning System
              </span>
            </div>
            <p className="text-xs text-slate-600 font-normal">
              Unified Corridor Maintenance Scheduling & Decision Support for Civil, S&T, and TRD
            </p>
          </div>
        </div>

        {/* Right: Operational Controls */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Division Selector */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
            <label className="text-slate-500 mr-1.5 font-medium">Division:</label>
            <select
              value={activeDivision}
              onChange={(e) => onDivisionChange(e.target.value)}
              className="font-medium text-slate-900 bg-transparent outline-none cursor-pointer"
            >
              <option value="ALL">All Network Corridors</option>
              <option value="DLI">Delhi Division (DLI / NR)</option>
              <option value="PRYJ">Prayagraj Division (PRYJ / NCR)</option>
              <option value="HWH">Howrah Division (HWH / ER)</option>
              <option value="MMCT">Mumbai Division (MMCT / WR)</option>
            </select>
          </div>

          {/* Role Selector */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5">
            <UserCheck className="w-3.5 h-3.5 text-slate-600 mr-1.5" />
            <label className="text-slate-500 mr-1.5 font-medium">Authority:</label>
            <select
              value={activeRole}
              onChange={(e) => onRoleChange(e.target.value)}
              className="font-medium text-slate-900 bg-transparent outline-none cursor-pointer"
            >
              <option value="SR_DOM">Sr. DOM (Traffic Operating)</option>
              <option value="SR_DEN">Sr. DEN (Track / Civil)</option>
              <option value="SR_DSTE">Sr. DSTE (Signals & Telecom)</option>
              <option value="SR_DEE_TRD">Sr. DEE / TRD (Traction OHE)</option>
              <option value="CHIEF_CONTROLLER">Chief Train Controller (COA)</option>
            </select>
          </div>

          {/* Refresh Action */}
          {onRefreshData && (
            <button
              onClick={onRefreshData}
              title="Synchronize live feeds from TMS, SMMS, TDMS, and COA"
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium px-3 py-1.5 rounded transition cursor-pointer border border-slate-200"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Sync Feeds</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
