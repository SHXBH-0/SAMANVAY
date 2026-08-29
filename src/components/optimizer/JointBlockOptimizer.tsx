import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  CheckCircle2,
  ArrowRight,
  Zap,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import {
  MaintenanceDemand,
  CorridorAvailabilityWindow,
  OptimizedBlockSchedule,
  OptimizationWeights,
  HorizonType,
} from '../../types';
import { BlockStatusPill } from '../common/StatusPill';
import { DEFAULT_WEIGHTS } from '../../utils/optimizer';

interface JointBlockOptimizerProps {
  demands: MaintenanceDemand[];
  windows: CorridorAvailabilityWindow[];
  schedules: OptimizedBlockSchedule[];
  onRunOptimizationWithParams: (horizon: HorizonType, weights: OptimizationWeights) => void;
  onNavigateToSanctions: () => void;
}

export const JointBlockOptimizer: React.FC<JointBlockOptimizerProps> = ({
  demands,
  windows,
  schedules,
  onRunOptimizationWithParams,
  onNavigateToSanctions,
}) => {
  const [selectedHorizon, setSelectedHorizon] = useState<HorizonType>('DAILY');
  const [weights, setWeights] = useState<OptimizationWeights>(DEFAULT_WEIGHTS);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationStep, setOptimizationStep] = useState<number>(0);

  const handleStartOptimization = () => {
    setIsOptimizing(true);
    setOptimizationStep(1);

    setTimeout(() => {
      setOptimizationStep(2);
    }, 350);

    setTimeout(() => {
      setOptimizationStep(3);
    }, 700);

    setTimeout(() => {
      setOptimizationStep(4);
    }, 1050);

    setTimeout(() => {
      setIsOptimizing(false);
      setOptimizationStep(0);
      onRunOptimizationWithParams(selectedHorizon, weights);
    }, 1400);
  };

  const totalDowntimeSaved = schedules.reduce((a, b) => a + b.downtimeSavedMins, 0);
  const totalSeparateMins = schedules.reduce(
    (a, b) =>
      a +
      b.totalDurationMins +
      b.shadowDepartments.reduce((shAcc, sh) => shAcc + sh.durationMins, 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 p-4 rounded-sm shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Cpu className="w-5 h-5 text-slate-700" />
              Corridor Block Optimization & Joint Synchronization Engine
            </h2>
            <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-300">
              Operations Research / MCDA
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Solves multi-department block alignment by clustering overlapping demands from TMS, SMMS, and TDMS into synchronized corridor possession slots.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-sm border border-slate-200 text-xs">
            <button
              onClick={() => setSelectedHorizon('DAILY')}
              className={`px-3 py-1 font-medium rounded-sm cursor-pointer ${
                selectedHorizon === 'DAILY' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
              }`}
            >
              Daily (24-48h)
            </button>
            <button
              onClick={() => setSelectedHorizon('WEEKLY')}
              className={`px-3 py-1 font-medium rounded-sm cursor-pointer ${
                selectedHorizon === 'WEEKLY' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
              }`}
            >
              Weekly (7-Day)
            </button>
            <button
              onClick={() => setSelectedHorizon('MONTHLY')}
              className={`px-3 py-1 font-medium rounded-sm cursor-pointer ${
                selectedHorizon === 'MONTHLY' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
              }`}
            >
              Monthly (30-Day)
            </button>
          </div>

          <button
            disabled={isOptimizing}
            onClick={handleStartOptimization}
            className="bg-[#0D1E32] hover:bg-slate-800 text-white text-xs font-medium px-4 py-2 rounded-sm flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
          >
            {isOptimizing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Computing Schedules...
              </>
            ) : (
              <>
                <span>Run Optimization Model</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Optimization Step Progress */}
      {isOptimizing && (
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-sm text-xs space-y-3">
          <div className="flex items-center justify-between font-semibold text-slate-800">
            <span>Executing Multi-Criteria Matrix Optimization</span>
            <span className="font-mono text-slate-500">Step {optimizationStep} of 4</span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
            <div className={`p-2 rounded-sm font-medium ${optimizationStep >= 1 ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
              1. Ingest Requisitions
            </div>
            <div className={`p-2 rounded-sm font-medium ${optimizationStep >= 2 ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
              2. Score Criticality Matrix
            </div>
            <div className={`p-2 rounded-sm font-medium ${optimizationStep >= 3 ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
              3. Spatial Section Pairing
            </div>
            <div className={`p-2 rounded-sm font-medium ${optimizationStep >= 4 ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
              4. Timetable Interlock
            </div>
          </div>
        </div>
      )}

      {/* Before vs After Impact Comparison Panel */}
      <div className="bg-white border border-slate-200 rounded-sm shadow-xs p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-700" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Corridor Efficiency Analysis: Manual vs SAMANVAY Joint Allocation
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-sm border border-slate-200">
            Efficiency Gain: Over 60% Downtime Saved
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Box 1: Manual Separate Downtime */}
          <div className="bg-slate-50 border border-slate-200 rounded-sm p-4">
            <div className="text-xs font-semibold text-slate-600 uppercase">
              Independent / Manual Requisitions
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
              {totalSeparateMins} <span className="text-xs font-normal text-slate-500">Minutes</span>
            </div>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Total track possession required if Civil, S&T, and TRD take separate traffic disconnections.
            </p>
            <div className="mt-3 text-[11px] font-mono text-slate-600 bg-white p-2 rounded-sm border border-slate-200">
              Separate disconnections = recurring speed restrictions
            </div>
          </div>

          {/* Box 2: SAMANVAY Joint Synchronized Downtime */}
          <div className="bg-slate-50 border border-slate-200 rounded-sm p-4">
            <div className="text-xs font-semibold text-slate-600 uppercase">
              SAMANVAY Coordinated Schedule
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
              {schedules.reduce((a, b) => a + b.totalDurationMins, 0)}{' '}
              <span className="text-xs font-normal text-slate-500">Minutes</span>
            </div>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Consolidated <strong>Joint Traffic Block</strong> where S&T and OHE shadow the heavy track machine possession.
            </p>
            <div className="mt-3 text-[11px] font-mono text-slate-800 bg-white p-2 rounded-sm border border-slate-200 font-medium">
              Single possession = minimum train detention
            </div>
          </div>

          {/* Box 3: Net Operational Gain */}
          <div className="bg-[#0D1E32] text-white rounded-sm p-4 flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-amber-400 uppercase tracking-wide">
                Net Track Availability Gain
              </div>
              <div className="mt-2 text-3xl font-bold text-white tabular-nums">
                +{totalDowntimeSaved}{' '}
                <span className="text-xs font-normal text-slate-300">Mins Saved</span>
              </div>
              <p className="mt-1 text-xs text-slate-300">
                Restoring <strong>{(totalDowntimeSaved / 60).toFixed(1)} Hours</strong> of commercial path availability.
              </p>
            </div>
            <button
              onClick={onNavigateToSanctions}
              className="mt-3 bg-slate-100 hover:bg-white text-slate-900 font-semibold text-xs py-2 px-3 rounded-sm flex items-center justify-between cursor-pointer transition"
            >
              <span>Issue Joint Sanction Circular</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mathematical Weighting Parameters */}
      <div className="bg-white border border-slate-200 rounded-sm shadow-xs p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              MCDA Weighting Coefficients
            </h3>
          </div>
          <button
            onClick={() => setWeights(DEFAULT_WEIGHTS)}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Reset CRIS Defaults
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-sm border border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-slate-700">Defect Severity</span>
              <span className="font-mono font-bold text-slate-900">
                {(weights.defectSeverityWeight * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.6"
              step="0.05"
              value={weights.defectSeverityWeight}
              onChange={(e) =>
                setWeights({ ...weights, defectSeverityWeight: parseFloat(e.target.value) })
              }
              className="w-full cursor-pointer accent-slate-800"
            />
            <span className="text-[10px] text-slate-500">Track fracture & flashover</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-sm border border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-slate-700">Overdue Urgency</span>
              <span className="font-mono font-bold text-slate-900">
                {(weights.overdueUrgencyWeight * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.5"
              step="0.05"
              value={weights.overdueUrgencyWeight}
              onChange={(e) =>
                setWeights({ ...weights, overdueUrgencyWeight: parseFloat(e.target.value) })
              }
              className="w-full cursor-pointer accent-slate-800"
            />
            <span className="text-[10px] text-slate-500">Days overdue past cycle</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-sm border border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-slate-700">Traffic Impact</span>
              <span className="font-mono font-bold text-slate-900">
                {(weights.trainTrafficMinimizationWeight * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.5"
              step="0.05"
              value={weights.trainTrafficMinimizationWeight}
              onChange={(e) =>
                setWeights({
                  ...weights,
                  trainTrafficMinimizationWeight: parseFloat(e.target.value),
                })
              }
              className="w-full cursor-pointer accent-slate-800"
            />
            <span className="text-[10px] text-slate-500">Passenger path preservation</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-sm border border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-slate-700">Multi-Dept Synergy</span>
              <span className="font-mono font-bold text-slate-900">
                {(weights.multiDeptSynergyWeight * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.4"
              step="0.05"
              value={weights.multiDeptSynergyWeight}
              onChange={(e) =>
                setWeights({ ...weights, multiDeptSynergyWeight: parseFloat(e.target.value) })
              }
              className="w-full cursor-pointer accent-slate-800"
            />
            <span className="text-[10px] text-slate-500">Joint block alignment</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-sm border border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-slate-700">Machine Utilization</span>
              <span className="font-mono font-bold text-slate-900">
                {(weights.machineUtilizationWeight * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.3"
              step="0.05"
              value={weights.machineUtilizationWeight}
              onChange={(e) =>
                setWeights({ ...weights, machineUtilizationWeight: parseFloat(e.target.value) })
              }
              className="w-full cursor-pointer accent-slate-800"
            />
            <span className="text-[10px] text-slate-500">CSM & Tower Wagon output</span>
          </div>
        </div>
      </div>

      {/* Generated Optimized Joint Blocks Ledger */}
      <div className="bg-white border border-slate-200 rounded-sm shadow-xs">
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Optimized Program Schedule ({schedules.length} Joint Programs)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Horizon: {selectedHorizon}
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {schedules.map((s) => (
            <div key={s.id} className="p-4 hover:bg-slate-50/50 transition space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-medium text-slate-900 bg-slate-100 px-2 py-0.5 rounded-sm border border-slate-200">
                    {s.blockSanctionCode}
                  </span>
                  <span className="font-semibold text-xs text-slate-900">{s.sectionName}</span>
                  <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-sm border border-slate-200">
                    {s.line} (Km {s.startKm} - {s.endKm})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-slate-700 bg-slate-50 px-2 py-1 rounded-sm border border-slate-200">
                    {s.date} • {s.startTime} - {s.endTime} ({s.totalDurationMins}m)
                  </span>
                  <BlockStatusPill status={s.status} />
                </div>
              </div>

              {/* Department breakdown table */}
              <div className="border border-slate-200 rounded-sm overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 text-slate-600 text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="p-2 text-left w-32 font-semibold">Department</th>
                      <th className="p-2 text-left font-semibold">Scheduled Maintenance Task</th>
                      <th className="p-2 text-left w-48 font-semibold">Machine / Gang Deployed</th>
                      <th className="p-2 text-left w-24 font-semibold">Window</th>
                      <th className="p-2 text-left font-semibold">Operational Benefit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {/* Primary Lead */}
                    <tr className="bg-slate-50/40">
                      <td className="p-2 font-semibold text-slate-900">
                        {s.leadDepartment} (Lead)
                      </td>
                      <td className="p-2 font-medium">{s.primaryWork}</td>
                      <td className="p-2 font-mono text-[11px] text-slate-700">{s.primaryMachinery}</td>
                      <td className="p-2 font-mono font-semibold">{s.totalDurationMins}m</td>
                      <td className="p-2 text-slate-600">Core track line possession</td>
                    </tr>

                    {/* Shadowed departments */}
                    {s.shadowDepartments.map((sh, idx) => (
                      <tr key={idx}>
                        <td className="p-2 font-semibold text-slate-700">
                          {sh.department} (Shadow)
                        </td>
                        <td className="p-2 text-slate-700">{sh.workDescription}</td>
                        <td className="p-2 font-mono text-[11px] text-slate-600">{sh.machineryOrStaff}</td>
                        <td className="p-2 font-mono">{sh.durationMins}m</td>
                        <td className="p-2 text-slate-700 font-medium">{sh.speedRestrictionAvoided}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Card Footer: Metrics & Synergy */}
              <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-slate-900">
                    Downtime Saved: <strong>{s.downtimeSavedMins} Mins</strong>
                  </span>
                  <span>
                    Synergy Ratio: <strong>{s.synergyGainPercentage}%</strong>
                  </span>
                  <span>
                    Train Detention: <strong>{s.punctualityImpactMin}m ({s.affectedTrainsCount} Trains)</strong>
                  </span>
                </div>

                <div className="text-[11px] text-slate-500">
                  COA Protocol: {s.trainRegulationsSummary}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
