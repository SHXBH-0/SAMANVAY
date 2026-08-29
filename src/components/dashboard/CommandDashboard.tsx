import React, { useState } from 'react';
import {
  Clock,
  TrendingUp,
  Layers,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Server,
  Train,
  ShieldAlert,
  Zap,
  Radio,
  ExternalLink,
  ChevronRight,
  Info,
  CalendarCheck,
} from 'lucide-react';
import {
  MaintenanceDemand,
  OptimizedBlockSchedule,
  SystemKPIs,
  CorridorSection,
} from '../../types';
import { DeptBadge, SeverityPill, BlockStatusPill, SourceSystemBadge } from '../common/StatusPill';

interface CommandDashboardProps {
  kpis: SystemKPIs;
  demands: MaintenanceDemand[];
  schedules: OptimizedBlockSchedule[];
  corridors: CorridorSection[];
  onNavigateToOptimizer: () => void;
  onNavigateToFeeds: () => void;
  onNavigateToFeedsWithFilter?: (source: string) => void;
  onNavigateToSanctions: () => void;
  onNavigateToAnalytics?: () => void;
  onSelectSchedule: (scheduleId: string) => void;
  onSelectCorridor?: (corridorId: string) => void;
}

type DrilldownType = 'AVAILABILITY' | 'DOWNTIME' | 'SYNERGY' | 'PSR' | null;

export const CommandDashboard: React.FC<CommandDashboardProps> = ({
  kpis,
  demands,
  schedules,
  corridors,
  onNavigateToOptimizer,
  onNavigateToFeeds,
  onNavigateToFeedsWithFilter,
  onNavigateToSanctions,
  onNavigateToAnalytics,
  onSelectSchedule,
  onSelectCorridor,
}) => {
  const [selectedDemandModal, setSelectedDemandModal] = useState<MaintenanceDemand | null>(null);
  const [activeDrilldown, setActiveDrilldown] = useState<DrilldownType>(null);

  const urgentDemands = demands
    .filter((d) => d.severity === 'EMERGENCY' || d.severity === 'CRITICAL')
    .sort((a, b) => b.criticalityScore - a.criticalityScore);

  const pendingSanctions = schedules.filter(
    (s) => s.status === 'RECOMMENDED' || s.status === 'UNDER_REVIEW'
  );

  const totalDowntimeHoursSaved = Math.round(
    schedules.reduce((acc, s) => acc + s.downtimeSavedMins, 0) / 60
  );

  const handleFeedClick = (source: string) => {
    if (onNavigateToFeedsWithFilter) {
      onNavigateToFeedsWithFilter(source);
    } else {
      onNavigateToFeeds();
    }
  };

  const handleCorridorClick = (corridorId: string) => {
    if (onSelectCorridor) {
      onSelectCorridor(corridorId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="bg-white border-l-4 border-blue-600 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-y border-r border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
            <Radio className="w-5 h-5 animate-pulse text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">
                Divisional Operations & Block Coordination Center
              </h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-300">
                LIVE FEED ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Coordinating Track (TMS), Signals (SMMS), and Traction (TDMS) with Control Office (COA) timetables.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={onNavigateToOptimizer}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-md transition cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            <CalendarCheck className="w-4 h-4 text-amber-300" />
            Plan Joint Corridor Blocks
          </button>
          <button
            onClick={onNavigateToSanctions}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3.5 py-2 rounded-md transition cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            <FileCheck className="w-4 h-4" />
            <span>Sanctions Review</span>
            <span className="bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {pendingSanctions.length}
            </span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards (Interactive with Modal Drilldowns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Asset Availability */}
        <div
          onClick={() => setActiveDrilldown('AVAILABILITY')}
          className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-emerald-500 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider group-hover:text-emerald-800">
              Asset Availability
            </span>
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-700 tabular-nums">
              {kpis.assetAvailabilityPercentage}%
            </span>
            <span className="text-xs font-semibold text-emerald-700 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +2.8%
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 flex items-center justify-between">
            <span>Composite infrastructure uptime</span>
            <span className="text-[10px] text-emerald-700 font-bold group-hover:underline">Drilldown →</span>
          </p>
          <div className="mt-3 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${kpis.assetAvailabilityPercentage}%` }}
            />
          </div>
        </div>

        {/* Card 2: Cumulative Downtime Saved */}
        <div
          onClick={() => setActiveDrilldown('DOWNTIME')}
          className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-blue-500 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider group-hover:text-blue-800">
              Downtime Saved
            </span>
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-md border border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-blue-700 tabular-nums">
              {totalDowntimeHoursSaved} <span className="text-sm font-semibold text-slate-500">Hours</span>
            </span>
            <span className="text-xs font-semibold text-blue-700">
              ({schedules.reduce((a, b) => a + b.downtimeSavedMins, 0)}m)
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 flex items-center justify-between">
            <span>Averted via joint shadow blocks</span>
            <span className="text-[10px] text-blue-700 font-bold group-hover:underline">Inspect →</span>
          </p>
          <div className="mt-3 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full w-4/5 transition-all duration-500" />
          </div>
        </div>

        {/* Card 3: Shadow Block Synergy */}
        <div
          onClick={() => setActiveDrilldown('SYNERGY')}
          className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-amber-500 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider group-hover:text-amber-800">
              Shadow Synergy
            </span>
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-md border border-amber-200 group-hover:bg-amber-600 group-hover:text-white transition">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600 tabular-nums">
              {kpis.shadowUtilizationRate}%
            </span>
            <span className="text-xs font-semibold text-amber-800">
              {kpis.integratedBlocksPlanned} Blocks
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 flex items-center justify-between">
            <span>Tri-department synchronization</span>
            <span className="text-[10px] text-amber-700 font-bold group-hover:underline">Details →</span>
          </p>
          <div className="mt-3 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${kpis.shadowUtilizationRate}%` }}
            />
          </div>
        </div>

        {/* Card 4: Speed Restrictions Averted */}
        <div
          onClick={() => setActiveDrilldown('PSR')}
          className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-purple-500 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider group-hover:text-purple-800">
              Speed Restrictions (PSR)
            </span>
            <span className="p-1.5 bg-purple-50 text-purple-600 rounded-md border border-purple-200 group-hover:bg-purple-600 group-hover:text-white transition">
              <ShieldAlert className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-purple-700 tabular-nums">
              {kpis.speedRestrictionsAverted}
            </span>
            <span className="text-xs font-semibold text-emerald-700">
              Averted
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 flex items-center justify-between">
            <span>Punctuality index at {kpis.punctualityRetentionIndex}%</span>
            <span className="text-[10px] text-purple-700 font-bold group-hover:underline">Audit →</span>
          </p>
          <div className="mt-3 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-purple-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${kpis.punctualityRetentionIndex}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Urgent Demands vs Connected Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Urgent Attention Demands Board */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Critical & Overdue Maintenance Ledger (TMS / SMMS / TDMS)
              </h3>
            </div>
            <button
              onClick={onNavigateToFeeds}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
            >
              View Full Feed ({demands.length}) <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full railway-table text-left">
              <thead>
                <tr>
                  <th>Requisition No.</th>
                  <th>Department & Asset</th>
                  <th>Section / Line</th>
                  <th>Severity & Overdue</th>
                  <th>Required Slot</th>
                  <th>Priority Score</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {urgentDemands.slice(0, 5).map((d) => (
                  <tr
                    key={d.id}
                    onClick={() => setSelectedDemandModal(d)}
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer"
                  >
                    <td>
                      <div className="font-mono text-xs font-bold text-slate-900">
                        {d.requisitionNo.split('/')[4] || d.requisitionNo}
                      </div>
                      <div className="mt-0.5">
                        <SourceSystemBadge source={d.sourceSystem} />
                      </div>
                    </td>
                    <td>
                      <DeptBadge dept={d.department} />
                      <div className="text-[11px] text-slate-700 font-semibold mt-1">
                        {d.assetType}
                      </div>
                    </td>
                    <td>
                      <div className="font-semibold text-xs text-slate-900">
                        {d.sectionCode}
                      </div>
                      <div className="text-[11px] font-mono text-slate-600">
                        {d.line} (Km {d.startKm} - {d.endKm})
                      </div>
                    </td>
                    <td>
                      <SeverityPill severity={d.severity} />
                      <div className="text-[11px] font-bold text-red-700 mt-0.5">
                        {d.daysOverdue} days overdue
                      </div>
                    </td>
                    <td>
                      <div className="font-mono text-xs font-bold text-slate-900 tabular-nums">
                        {d.requiredDurationMins} Mins
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {d.preferredTimeWindow === 'NIGHT_NON_PEAK' ? 'Night Non-Peak' : 'Day Corridor'}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <span className="font-mono font-bold text-xs text-blue-900">
                          {d.criticalityScore}
                        </span>
                        <span className="text-[10px] text-slate-400">/ 100</span>
                      </div>
                      <div className="w-16 bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            d.criticalityScore > 85
                              ? 'bg-red-600'
                              : d.criticalityScore > 70
                              ? 'bg-amber-500'
                              : 'bg-blue-600'
                          }`}
                          style={{ width: `${d.criticalityScore}%` }}
                        />
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDemandModal(d);
                        }}
                        className="text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded border border-blue-200 cursor-pointer shadow-2xs"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Live Data Ingestion & Section Summary */}
        <div className="space-y-6">
          {/* Live Ingestion Feeds */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <Server className="w-4 h-4 text-blue-600" />
                Live Ingestion Feeds
              </h3>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                Connected
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* TMS Feed */}
              <div
                onClick={() => handleFeedClick('TMS')}
                className="flex items-center justify-between p-2.5 rounded-md bg-blue-50/70 border border-blue-200 hover:bg-blue-100/80 hover:border-blue-400 transition cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  <div>
                    <div className="font-bold text-blue-950 flex items-center gap-1">
                      TMS Feed (Track / Civil)
                      <ChevronRight className="w-3 h-3 text-blue-600 opacity-0 group-hover:opacity-100 transition" />
                    </div>
                    <div className="text-[10px] text-blue-800">Track fractures, USFD, Ballast</div>
                  </div>
                </div>
                <span className="font-mono font-bold text-xs bg-white text-blue-700 px-2 py-0.5 rounded border border-blue-200 shadow-2xs">
                  {kpis.tmsCount} Req
                </span>
              </div>

              {/* SMMS Feed */}
              <div
                onClick={() => handleFeedClick('SMMS')}
                className="flex items-center justify-between p-2.5 rounded-md bg-emerald-50/70 border border-emerald-200 hover:bg-emerald-100/80 hover:border-emerald-400 transition cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <div>
                    <div className="font-bold text-emerald-950 flex items-center gap-1">
                      SMMS Feed (S&T Signals)
                      <ChevronRight className="w-3 h-3 text-emerald-600 opacity-0 group-hover:opacity-100 transition" />
                    </div>
                    <div className="text-[10px] text-emerald-800">Points, Axle counters, Kavach</div>
                  </div>
                </div>
                <span className="font-mono font-bold text-xs bg-white text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 shadow-2xs">
                  {kpis.smmsCount} Req
                </span>
              </div>

              {/* TDMS Feed */}
              <div
                onClick={() => handleFeedClick('TDMS')}
                className="flex items-center justify-between p-2.5 rounded-md bg-amber-50/70 border border-amber-200 hover:bg-amber-100/80 hover:border-amber-400 transition cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                  <div>
                    <div className="font-bold text-amber-950 flex items-center gap-1">
                      TDMS Feed (TRD Electrical)
                      <ChevronRight className="w-3 h-3 text-amber-600 opacity-0 group-hover:opacity-100 transition" />
                    </div>
                    <div className="text-[10px] text-amber-800">25kV OHE, Insulators, Catenary</div>
                  </div>
                </div>
                <span className="font-mono font-bold text-xs bg-white text-amber-800 px-2 py-0.5 rounded border border-amber-200 shadow-2xs">
                  {kpis.tdmsCount} Req
                </span>
              </div>

              {/* COA Feed */}
              <div
                onClick={() => handleFeedClick('COA')}
                className="flex items-center justify-between p-2.5 rounded-md bg-indigo-50/70 border border-indigo-200 hover:bg-indigo-100/80 hover:border-indigo-400 transition cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                  <div>
                    <div className="font-bold text-indigo-950 flex items-center gap-1">
                      COA & Timetable Feed
                      <ChevronRight className="w-3 h-3 text-indigo-600 opacity-0 group-hover:opacity-100 transition" />
                    </div>
                    <div className="text-[10px] text-indigo-800">Passenger & Goods forecast</div>
                  </div>
                </div>
                <span className="font-mono font-bold text-xs bg-white text-indigo-700 px-2 py-0.5 rounded border border-indigo-200 shadow-2xs">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* High Density Corridor Utilization List (Clickable!) */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Train className="w-4 h-4 text-slate-700" />
              High Density Corridor Utilization
            </h3>

            <div className="space-y-3">
              {corridors.slice(0, 4).map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleCorridorClick(c.id)}
                  className="border-b border-slate-100 pb-2 last:border-0 last:pb-0 p-2 rounded hover:bg-slate-50 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-900 group-hover:text-blue-700 flex items-center gap-1">
                      {c.code}
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition text-blue-600" />
                    </span>
                    <span className="text-blue-700 font-mono">{c.dailyTrainDensity} Trains/24h</span>
                  </div>
                  <div className="text-[11px] text-slate-600">{c.name}</div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-[10px] bg-slate-100 text-slate-700 font-medium px-1.5 py-0.5 rounded">
                      Max: {c.speedLimitKmph} Kmph
                    </span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 font-semibold px-1.5 py-0.5 rounded border border-emerald-200">
                      {c.signalingType}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active Joint Block Schedules Cards */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-lg">
          <div className="flex items-center space-x-2">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Active Joint Block Schedules
            </h3>
          </div>
          <button
            onClick={onNavigateToSanctions}
            className="text-xs font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
          >
            Review Sanctions & Generate Circulars →
          </button>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {schedules.slice(0, 2).map((s) => (
            <div
              key={s.id}
              onClick={() => onSelectSchedule(s.id)}
              className="border border-slate-200 hover:border-blue-500 rounded-lg p-4 bg-slate-50/40 hover:bg-white transition-all cursor-pointer relative shadow-xs hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {s.blockSanctionCode}
                </span>
                <BlockStatusPill status={s.status} />
              </div>

              <div className="mt-2 text-xs font-bold text-slate-900">
                {s.sectionName} ({s.line})
              </div>

              <div className="mt-1 flex items-center gap-3 text-xs text-slate-600">
                <span className="flex items-center gap-1 font-mono font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {s.startTime} - {s.endTime} ({s.totalDurationMins}m)
                </span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  ⚡ Saved {s.downtimeSavedMins}m downtime
                </span>
              </div>

              {/* Departmental tasks in this block */}
              <div className="mt-3 space-y-1.5 border-t border-slate-200 pt-2 text-xs">
                <div className="flex items-start gap-1.5">
                  <span className="font-bold text-blue-800 min-w-[55px]">Primary:</span>
                  <span className="text-slate-800">{s.primaryWork}</span>
                </div>
                {s.shadowDepartments.map((sh, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span className="font-bold text-amber-800 min-w-[55px]">
                      Shadow {sh.department}:
                    </span>
                    <span className="text-slate-700">{sh.workDescription}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-600 bg-white p-2 rounded-md border border-slate-200">
                <span>Coordination Score: <strong className="text-slate-900">{s.optimizationScore}%</strong></span>
                <span className="text-blue-700 font-bold flex items-center gap-1">
                  Inspect Sanction Document →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal 1: Defect Inspection Modal */}
      {selectedDemandModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-300 max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-slate-500">
                  {selectedDemandModal.requisitionNo}
                </span>
                <h3 className="text-base font-bold text-[#0D1E32]">
                  Requisition & Asset Inspection Dossier
                </h3>
              </div>
              <button
                onClick={() => setSelectedDemandModal(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="text-slate-500 font-medium">Source Feed:</span>
                <div className="font-bold text-slate-900 mt-0.5">
                  <SourceSystemBadge source={selectedDemandModal.sourceSystem} />
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="text-slate-500 font-medium">Department:</span>
                <div className="font-bold text-slate-900 mt-0.5">
                  <DeptBadge dept={selectedDemandModal.department} />
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="text-slate-500 font-medium">Corridor / Line:</span>
                <div className="font-bold text-slate-900 mt-0.5">
                  {selectedDemandModal.sectionCode} ({selectedDemandModal.line})
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="text-slate-500 font-medium">Kilometer Span:</span>
                <div className="font-mono font-bold text-slate-900 mt-0.5">
                  Km {selectedDemandModal.startKm} to {selectedDemandModal.endKm}
                </div>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-bold text-slate-700">Defect Description:</span>
              <p className="p-3 bg-slate-50 rounded border border-slate-200 text-slate-800 leading-relaxed font-medium">
                {selectedDemandModal.defectDescription}
              </p>
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-bold text-red-700">Speed Restriction Risk:</span>
              <p className="p-2.5 bg-red-50 text-red-900 rounded border border-red-200 font-semibold">
                {selectedDemandModal.speedRestrictionRisk}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded border border-slate-200">
              <div>
                <span className="text-slate-500">Duration Required:</span>
                <div className="font-mono font-bold text-slate-900 mt-0.5">
                  {selectedDemandModal.requiredDurationMins} Minutes (Min {selectedDemandModal.minDurationMins}m)
                </div>
              </div>
              <div>
                <span className="text-slate-500">Machinery Deployed:</span>
                <div className="font-bold text-slate-900 mt-0.5">
                  {selectedDemandModal.machineryRequired || 'Gang Manual Kit'}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <div className="text-xs text-slate-600">
                Priority Index: <strong className="text-blue-900 font-mono text-sm">{selectedDemandModal.criticalityScore}/100</strong>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedDemandModal(null)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedDemandModal(null);
                    onNavigateToOptimizer();
                  }}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold cursor-pointer"
                >
                  Plan Block in Optimizer →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: KPI Drilldowns */}
      {activeDrilldown && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-300 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-[#0D1E32] flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                {activeDrilldown === 'AVAILABILITY' && 'Asset Availability Index Audit'}
                {activeDrilldown === 'DOWNTIME' && 'Cumulative Downtime Savings Analysis'}
                {activeDrilldown === 'SYNERGY' && 'Shadow Block Synchronization Statistics'}
                {activeDrilldown === 'PSR' && 'Speed Restriction & Punctuality Ledger'}
              </h3>
              <button
                onClick={() => setActiveDrilldown(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {activeDrilldown === 'AVAILABILITY' && (
              <div className="space-y-3 text-xs">
                <p className="text-slate-700 leading-relaxed">
                  Composite infrastructure availability is currently measured across <strong>4 High-Density Corridors</strong> spanning 771 Route Kilometers.
                </p>
                <div className="grid grid-cols-2 gap-2 font-mono">
                  <div className="p-2.5 bg-emerald-50 rounded border border-emerald-200">
                    <span className="text-slate-500 text-[10px]">Track Availability:</span>
                    <div className="text-base font-bold text-emerald-800">98.8%</div>
                  </div>
                  <div className="p-2.5 bg-blue-50 rounded border border-blue-200">
                    <span className="text-slate-500 text-[10px]">OHE Electrification:</span>
                    <div className="text-base font-bold text-blue-800">99.4%</div>
                  </div>
                </div>
              </div>
            )}

            {activeDrilldown === 'DOWNTIME' && (
              <div className="space-y-3 text-xs">
                <p className="text-slate-700 leading-relaxed">
                  Consolidating independent requests into joint shadow blocks saved <strong>{totalDowntimeHoursSaved} Hours ({schedules.reduce((a, b) => a + b.downtimeSavedMins, 0)} Minutes)</strong> of traffic possession this cycle.
                </p>
                <div className="p-3 bg-blue-50 rounded border border-blue-200 text-blue-950 font-medium">
                  Restored capacity equals approximately <strong>28 additional freight paths</strong> across Northern and NCR trunk routes.
                </div>
              </div>
            )}

            {activeDrilldown === 'SYNERGY' && (
              <div className="space-y-3 text-xs">
                <p className="text-slate-700 leading-relaxed">
                  <strong>{kpis.shadowUtilizationRate}%</strong> of all heavy track machine possessions successfully integrated secondary S&T or OHE maintenance squads.
                </p>
                <div className="p-3 bg-amber-50 rounded border border-amber-300 text-amber-950 font-medium">
                  Zero instances of duplicate line closures reported in the last 30 operational days.
                </div>
              </div>
            )}

            {activeDrilldown === 'PSR' && (
              <div className="space-y-3 text-xs">
                <p className="text-slate-700 leading-relaxed">
                  <strong>{kpis.speedRestrictionsAverted} Speed Restrictions</strong> avoided by proactively tackling rail fractures and catenary sag within scheduled shadow windows.
                </p>
                <div className="p-3 bg-purple-50 rounded border border-purple-200 text-purple-950 font-medium">
                  160 kmph Vande Bharat and Rajdhani Express punctuality index retained at <strong>{kpis.punctualityRetentionIndex}%</strong>.
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setActiveDrilldown(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold cursor-pointer"
              >
                Dismiss
              </button>
              {onNavigateToAnalytics && (
                <button
                  onClick={() => {
                    setActiveDrilldown(null);
                    onNavigateToAnalytics();
                  }}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold cursor-pointer"
                >
                  Open Full Analytics Dashboard →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
