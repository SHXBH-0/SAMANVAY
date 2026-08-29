import React, { useState, useEffect } from 'react';
import {
  GanttChartSquare,
  Clock,
  Train,
  Zap,
} from 'lucide-react';
import {
  CorridorSection,
  OptimizedBlockSchedule,
  TrainSlot,
} from '../../types';
import { BlockStatusPill } from '../common/StatusPill';

interface CorridorGanttVisualizerProps {
  corridors: CorridorSection[];
  schedules: OptimizedBlockSchedule[];
  trainSchedule: TrainSlot[];
  initialCorridorId?: string;
  onSelectSchedule: (scheduleId: string) => void;
}

export const CorridorGanttVisualizer: React.FC<CorridorGanttVisualizerProps> = ({
  corridors,
  schedules,
  trainSchedule,
  initialCorridorId,
  onSelectSchedule,
}) => {
  const [selectedCorridorId, setSelectedCorridorId] = useState<string>(
    initialCorridorId || corridors[0]?.id || 'SEC-01'
  );
  const [selectedLineFilter, setSelectedLineFilter] = useState<string>('ALL');
  const [selectedBlockDetail, setSelectedBlockDetail] = useState<OptimizedBlockSchedule | null>(
    schedules[0] || null
  );

  useEffect(() => {
    if (initialCorridorId) {
      setSelectedCorridorId(initialCorridorId);
    }
  }, [initialCorridorId]);

  const activeCorridor =
    corridors.find((c) => c.id === selectedCorridorId) || corridors[0];

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const timeToPercentage = (timeStr: string): number => {
    const [h, m] = timeStr.split(':').map(Number);
    return ((h * 60 + m) / (24 * 60)) * 100;
  };

  const getDurationPercentage = (startStr: string, endStr: string): number => {
    const start = timeToPercentage(startStr);
    const end = timeToPercentage(endStr);
    return Math.max(2, end - start);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <GanttChartSquare className="w-5 h-5 text-indigo-600" />
              Corridor Block Possession & Train Traffic Visualizer
            </h2>
            <span className="text-xs bg-indigo-100 text-indigo-900 font-bold px-2 py-0.5 rounded border border-indigo-200">
              24-Hour Space-Time Timeline
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Visual inspection of track possessions, multi-department shadow tasks, and train timetable slot allocations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <label className="font-semibold text-slate-700">Corridor:</label>
            <select
              value={selectedCorridorId}
              onChange={(e) => setSelectedCorridorId(e.target.value)}
              className="bg-white border border-slate-300 rounded-md px-2.5 py-1.5 font-bold text-slate-900 outline-none cursor-pointer"
            >
              {corridors.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} ({c.name})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <label className="font-semibold text-slate-700">Line:</label>
            <select
              value={selectedLineFilter}
              onChange={(e) => setSelectedLineFilter(e.target.value)}
              className="bg-white border border-slate-300 rounded-md px-2.5 py-1.5 font-semibold text-slate-800 outline-none cursor-pointer"
            >
              <option value="ALL">All Tracks</option>
              {activeCorridor.tracks.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Corridor Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white border border-slate-200 p-3 rounded-lg shadow-sm">
        <div>
          <span className="text-slate-500">Route Section:</span>
          <div className="font-bold text-slate-900">
            {activeCorridor.fromStation} ➔ {activeCorridor.toStation}
          </div>
        </div>
        <div>
          <span className="text-slate-500">Length & Tracks:</span>
          <div className="font-bold text-slate-900">
            {activeCorridor.totalLengthKm} Km ({activeCorridor.tracks.join(', ')})
          </div>
        </div>
        <div>
          <span className="text-slate-500">Signaling / Speed:</span>
          <div className="font-bold text-blue-700">
            {activeCorridor.signalingType} • {activeCorridor.speedLimitKmph} Kmph
          </div>
        </div>
        <div>
          <span className="text-slate-500">Train Density:</span>
          <div className="font-mono font-bold text-slate-900">
            {activeCorridor.dailyTrainDensity} Trains / 24h
          </div>
        </div>
      </div>

      {/* Gantt Interactive Canvas */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4 overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Header Time Axis */}
          <div className="grid grid-cols-24 border-b border-slate-300 pb-2 text-[10px] font-mono text-slate-600 font-bold">
            {hours.map((h) => (
              <div key={h} className="text-left border-l border-slate-200 pl-1">
                {String(h).padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {/* Lines / Track Lanes */}
          <div className="space-y-4 py-4">
            {activeCorridor.tracks
              .filter((line) => selectedLineFilter === 'ALL' || line === selectedLineFilter)
              .map((line) => {
                const lineBlocks = schedules.filter(
                  (s) => s.sectionId === activeCorridor.id && s.line === line
                );
                const lineTrains = trainSchedule.filter(
                  (t) => t.sectionId === activeCorridor.id && t.line === line
                );

                return (
                  <div key={line} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-blue-700 rounded-xs"></span>
                        {line} (Km {activeCorridor.startKm} - {activeCorridor.endKm})
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono font-medium">
                        {lineBlocks.length} Blocks Scheduled • {lineTrains.length} Passenger/Freight Trains
                      </span>
                    </div>

                    {/* Timeline Track Ribbon */}
                    <div className="h-20 bg-slate-100 border border-slate-300 rounded-md relative overflow-hidden">
                      {/* Grid hour vertical guidelines */}
                      <div className="absolute inset-0 grid grid-cols-24 pointer-events-none">
                        {hours.map((h) => (
                          <div
                            key={h}
                            className={`border-r border-slate-200 h-full ${
                              h >= 1 && h <= 5 ? 'bg-emerald-50/50' : ''
                            }`}
                          />
                        ))}
                      </div>

                      {/* Scheduled Maintenance Blocks */}
                      {lineBlocks.map((blk) => {
                        const leftPct = timeToPercentage(blk.startTime);
                        const widthPct = getDurationPercentage(blk.startTime, blk.endTime);

                        return (
                          <div
                            key={blk.id}
                            onClick={() => setSelectedBlockDetail(blk)}
                            style={{
                              left: `${leftPct}%`,
                              width: `${widthPct}%`,
                            }}
                            className="absolute top-2 bottom-2 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 border-2 border-amber-400 rounded text-white p-1.5 shadow-md hover:brightness-110 cursor-pointer transition z-10 flex flex-col justify-between"
                          >
                            <div className="flex items-center justify-between gap-1 overflow-hidden">
                              <span className="font-mono text-[10px] font-bold truncate">
                                {blk.blockSanctionCode.split('/')[4] || blk.blockSanctionCode}
                              </span>
                              <span className="text-[9px] bg-amber-400 text-slate-950 font-bold px-1 rounded">
                                {blk.totalDurationMins}m
                              </span>
                            </div>

                            <div className="text-[9px] truncate font-medium text-slate-100">
                              {blk.leadDepartment} + {blk.shadowDepartments.map((s) => s.department).join('+')}
                            </div>

                            <div className="flex items-center gap-1 text-[8px] text-amber-200">
                              <Zap className="w-2.5 h-2.5 text-amber-400" />
                              <span>Saved {blk.downtimeSavedMins}m</span>
                            </div>
                          </div>
                        );
                      })}

                      {/* Train Paths Markers */}
                      {lineTrains.map((tr, idx) => {
                        const trainLeft = timeToPercentage(tr.scheduledArrival);
                        return (
                          <div
                            key={idx}
                            style={{ left: `${trainLeft}%` }}
                            title={`${tr.trainNumber} ${tr.trainName} (${tr.scheduledArrival})`}
                            className={`absolute top-0 bottom-0 w-1.5 cursor-pointer z-5 ${
                              tr.isCriticalPassenger
                                ? 'bg-red-500 hover:w-3'
                                : 'bg-slate-600 hover:w-3'
                            } transition-all`}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Timeline Legend */}
          <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-4">
            <div className="flex items-center gap-4 flex-wrap text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 bg-blue-800 border border-amber-400 rounded-xs"></div>
                <span>Joint Synchronized Block (Primary + Shadows)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-3.5 bg-red-500 rounded-xs"></div>
                <span className="text-red-700">Passenger High-Speed Path</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-3.5 bg-slate-600 rounded-xs"></div>
                <span>Goods / Freight Train</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 bg-emerald-100 border border-emerald-300 rounded-xs"></div>
                <span className="text-emerald-800">Ideal Non-Peak Window (01:00 - 05:00)</span>
              </div>
            </div>

            <span className="text-[11px] text-slate-500">
              Click any block to inspect details
            </span>
          </div>
        </div>
      </div>

      {/* Selected Block Inspection Card */}
      {selectedBlockDetail && (
        <div className="bg-white border-2 border-blue-200 rounded-lg shadow-sm p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  {selectedBlockDetail.blockSanctionCode} — Joint Possession Dossier
                </h3>
                <BlockStatusPill status={selectedBlockDetail.status} />
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Section: <strong>{selectedBlockDetail.sectionName}</strong> ({selectedBlockDetail.line}, Km {selectedBlockDetail.startKm} to {selectedBlockDetail.endKm})
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-mono text-xs font-bold text-slate-900">
                  {selectedBlockDetail.date} • {selectedBlockDetail.startTime} - {selectedBlockDetail.endTime}
                </div>
                <div className="text-[11px] text-emerald-700 font-bold">
                  ⚡ Saved {selectedBlockDetail.downtimeSavedMins} Minutes Downtime
                </div>
              </div>

              <button
                onClick={() => onSelectSchedule(selectedBlockDetail.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-md cursor-pointer transition shadow-sm"
              >
                Inspect Official Sanction Order →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Primary Track Task */}
            <div className="p-3.5 bg-blue-50/70 rounded-md border border-blue-200 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-950 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  Lead Work ({selectedBlockDetail.leadDepartment})
                </span>
                <span className="font-mono font-bold text-blue-900">
                  {selectedBlockDetail.totalDurationMins}m
                </span>
              </div>
              <p className="text-slate-800 leading-relaxed font-medium">
                {selectedBlockDetail.primaryWork}
              </p>
              <div className="text-[11px] text-blue-900 font-mono bg-white p-1 rounded border border-blue-200">
                Machinery: {selectedBlockDetail.primaryMachinery}
              </div>
            </div>

            {/* Shadow Work 1 */}
            {selectedBlockDetail.shadowDepartments[0] && (
              <div className="p-3.5 bg-amber-50/70 rounded-md border border-amber-300 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                    Shadow ({selectedBlockDetail.shadowDepartments[0].department})
                  </span>
                  <span className="font-mono font-bold text-amber-900">
                    {selectedBlockDetail.shadowDepartments[0].durationMins}m
                  </span>
                </div>
                <p className="text-slate-800 leading-relaxed font-medium">
                  {selectedBlockDetail.shadowDepartments[0].workDescription}
                </p>
                <div className="text-[11px] text-amber-900 font-mono bg-white p-1 rounded border border-amber-200">
                  Equipment: {selectedBlockDetail.shadowDepartments[0].machineryOrStaff}
                </div>
              </div>
            )}

            {/* Shadow Work 2 or Traffic note */}
            {selectedBlockDetail.shadowDepartments[1] ? (
              <div className="p-3.5 bg-emerald-50/70 rounded-md border border-emerald-300 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    Shadow ({selectedBlockDetail.shadowDepartments[1].department})
                  </span>
                  <span className="font-mono font-bold text-emerald-900">
                    {selectedBlockDetail.shadowDepartments[1].durationMins}m
                  </span>
                </div>
                <p className="text-slate-800 leading-relaxed font-medium">
                  {selectedBlockDetail.shadowDepartments[1].workDescription}
                </p>
                <div className="text-[11px] text-emerald-900 font-mono bg-white p-1 rounded border border-emerald-200">
                  Equipment: {selectedBlockDetail.shadowDepartments[1].machineryOrStaff}
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-slate-50 rounded-md border border-slate-200 text-xs flex flex-col justify-center text-slate-700">
                <span className="font-bold text-slate-900">Traffic Regulation:</span>
                <span className="mt-1 font-medium">
                  {selectedBlockDetail.trainRegulationsSummary}
                </span>
                <span className="text-[10px] text-emerald-800 font-bold mt-1">
                  ✓ Caution Order T/409 Pre-Configured
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
