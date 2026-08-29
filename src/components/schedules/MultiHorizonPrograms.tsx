import React, { useState } from 'react';
import {
  CalendarDays,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  FileCheck2,
  Filter,
  Plus,
  Play,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import {
  OptimizedBlockSchedule,
  HorizonType,
  BlockStatus,
  CorridorSection,
} from '../../types';
import { BlockStatusPill, DeptBadge } from '../common/StatusPill';

interface MultiHorizonProgramsProps {
  schedules: OptimizedBlockSchedule[];
  corridors: CorridorSection[];
  onSelectSchedule: (scheduleId: string) => void;
  onUpdateScheduleStatus: (scheduleId: string, newStatus: BlockStatus) => void;
  onNavigateToOptimizer: () => void;
}

export const MultiHorizonPrograms: React.FC<MultiHorizonProgramsProps> = ({
  schedules,
  corridors,
  onSelectSchedule,
  onUpdateScheduleStatus,
  onNavigateToOptimizer,
}) => {
  const [activeHorizon, setActiveHorizon] = useState<HorizonType>('DAILY');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');

  const filteredSchedules = schedules.filter((s) => {
    const matchHorizon = s.horizon === activeHorizon;
    const matchStatus =
      selectedStatusFilter === 'ALL' || s.status === selectedStatusFilter;
    return matchHorizon && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Horizon Selection Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#0A2540] uppercase tracking-wide flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-blue-700" />
              Multi-Horizon Block Scheduling & Rolling Program
            </h2>
            <span className="text-xs bg-blue-100 text-blue-900 px-2 py-0.5 rounded font-bold border border-blue-300">
              Short & Long Term Horizons
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Standardized multi-tier planning: Daily emergency/critical execution (24-48h), Weekly rolling program (7-day), and 30-day Mega Corridor windows.
          </p>
        </div>

        <button
          onClick={onNavigateToOptimizer}
          className="bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-xs font-semibold px-3 py-2 rounded flex items-center gap-1.5 transition cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          Generate New Horizon Program
        </button>
      </div>

      {/* Horizon Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Daily Horizon */}
        <button
          onClick={() => setActiveHorizon('DAILY')}
          className={`p-4 rounded-lg border text-left transition cursor-pointer ${
            activeHorizon === 'DAILY'
              ? 'bg-[#0A2540] text-white border-[#0A2540] shadow-md'
              : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${activeHorizon === 'DAILY' ? 'text-amber-400' : 'text-slate-500'}`}>
              Operational (24-48 Hours)
            </span>
            <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${activeHorizon === 'DAILY' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'}`}>
              {schedules.filter((s) => s.horizon === 'DAILY').length} Blocks
            </span>
          </div>
          <div className="text-sm font-bold mt-1">Daily Tactical Block Execution</div>
          <p className={`text-xs mt-1 leading-relaxed ${activeHorizon === 'DAILY' ? 'text-slate-300' : 'text-slate-600'}`}>
            Immediate defect rectification, high-speed PSR aversion, night non-peak possession, and real-time controller handover.
          </p>
        </button>

        {/* Weekly Horizon */}
        <button
          onClick={() => setActiveHorizon('WEEKLY')}
          className={`p-4 rounded-lg border text-left transition cursor-pointer ${
            activeHorizon === 'WEEKLY'
              ? 'bg-[#0A2540] text-white border-[#0A2540] shadow-md'
              : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${activeHorizon === 'WEEKLY' ? 'text-amber-400' : 'text-slate-500'}`}>
              Tactical (7-Day Rolling)
            </span>
            <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${activeHorizon === 'WEEKLY' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'}`}>
              {schedules.filter((s) => s.horizon === 'WEEKLY').length} Blocks
            </span>
          </div>
          <div className="text-sm font-bold mt-1">Weekly Rolling Program</div>
          <p className={`text-xs mt-1 leading-relaxed ${activeHorizon === 'WEEKLY' ? 'text-slate-300' : 'text-slate-600'}`}>
            Divisional joint committee review, scheduled tamping runs (CSM/UNIMAT), S&T relay overhaul, and OHE tower wagon rosters.
          </p>
        </button>

        {/* Monthly Horizon */}
        <button
          onClick={() => setActiveHorizon('MONTHLY')}
          className={`p-4 rounded-lg border text-left transition cursor-pointer ${
            activeHorizon === 'MONTHLY'
              ? 'bg-[#0A2540] text-white border-[#0A2540] shadow-md'
              : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wider ${activeHorizon === 'MONTHLY' ? 'text-amber-400' : 'text-slate-500'}`}>
              Strategic (30-Day Master)
            </span>
            <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${activeHorizon === 'MONTHLY' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'}`}>
              {schedules.filter((s) => s.horizon === 'MONTHLY').length} Blocks
            </span>
          </div>
          <div className="text-sm font-bold mt-1">Monthly Mega Corridor Program</div>
          <p className={`text-xs mt-1 leading-relaxed ${activeHorizon === 'MONTHLY' ? 'text-slate-300' : 'text-slate-600'}`}>
            Heavy track renewal trains (PQRS, TRT), ballast cleaning (BCM), major yard remodeling & pre-notified traffic modifications.
          </p>
        </button>
      </div>

      {/* Filter and Schedule List */}
      <div className="bg-white border border-slate-200 rounded shadow-xs">
        <div className="p-3 border-b border-slate-200 bg-[#F8FAFC] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {activeHorizon} Horizon Program Ledger ({filteredSchedules.length} Blocks)
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Status Filter:</span>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2 py-1 outline-none text-xs font-semibold"
            >
              <option value="ALL">All Statuses</option>
              <option value="RECOMMENDED">Recommended</option>
              <option value="SANCTIONED">Sanctioned</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-slate-200">
          {filteredSchedules.map((s) => (
            <div key={s.id} className="p-4 hover:bg-slate-50 transition space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                    {s.blockSanctionCode}
                  </span>
                  <span className="font-bold text-xs text-[#0A2540]">{s.sectionName}</span>
                  <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                    {s.line} (Km {s.startKm} - {s.endKm})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-800">
                    {s.date} • {s.startTime} - {s.endTime} ({s.totalDurationMins}m)
                  </span>
                  <BlockStatusPill status={s.status} />
                </div>
              </div>

              {/* Department breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-2 bg-blue-50/50 rounded border border-blue-200">
                  <div className="font-bold text-blue-900 text-[11px]">
                    Lead Work ({s.leadDepartment})
                  </div>
                  <div className="text-slate-800 mt-1 font-medium">{s.primaryWork}</div>
                  <div className="text-[10px] text-blue-800 font-mono mt-1">
                    Machinery: {s.primaryMachinery}
                  </div>
                </div>

                {s.shadowDepartments.map((sh, idx) => (
                  <div key={idx} className="p-2 bg-amber-50/50 rounded border border-amber-200">
                    <div className="font-bold text-amber-900 text-[11px]">
                      Shadow Work ({sh.department})
                    </div>
                    <div className="text-slate-800 mt-1">{sh.workDescription}</div>
                    <div className="text-[10px] text-amber-800 font-mono mt-1">
                      Resource: {sh.machineryOrStaff}
                    </div>
                  </div>
                ))}
              </div>

              {/* Status Action Buttons */}
              <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 text-xs gap-2">
                <div className="flex items-center gap-3 text-slate-600">
                  <span className="text-emerald-700 font-semibold">
                    ⚡ {s.downtimeSavedMins}m Downtime Saved
                  </span>
                  <span>
                    Detention: <strong>{s.punctualityImpactMin}m</strong>
                  </span>
                  <span className="text-[11px] italic text-slate-500">
                    {s.trainRegulationsSummary}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectSchedule(s.id)}
                    className="text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 px-2.5 py-1.5 rounded border border-blue-200 cursor-pointer"
                  >
                    View Sanction Document →
                  </button>

                  {s.status === 'RECOMMENDED' && (
                    <button
                      onClick={() => onUpdateScheduleStatus(s.id, 'SANCTIONED')}
                      className="text-xs font-bold text-emerald-800 hover:bg-emerald-100 bg-emerald-50 px-2.5 py-1.5 rounded border border-emerald-300 cursor-pointer flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Approve Sanction
                    </button>
                  )}

                  {s.status === 'SANCTIONED' && (
                    <button
                      onClick={() => onUpdateScheduleStatus(s.id, 'IN_PROGRESS')}
                      className="text-xs font-bold text-purple-800 hover:bg-purple-100 bg-purple-50 px-2.5 py-1.5 rounded border border-purple-300 cursor-pointer flex items-center gap-1"
                    >
                      <Play className="w-3.5 h-3.5" />
                      Grant Line Possession
                    </button>
                  )}

                  {s.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => onUpdateScheduleStatus(s.id, 'COMPLETED')}
                      className="text-xs font-bold text-slate-800 hover:bg-slate-200 bg-slate-100 px-2.5 py-1.5 rounded border border-slate-300 cursor-pointer flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Complete & Clear Line
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
