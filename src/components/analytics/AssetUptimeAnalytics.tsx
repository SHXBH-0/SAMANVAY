import React from 'react';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Clock,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { SystemKPIs, OptimizedBlockSchedule } from '../../types';

interface AssetUptimeAnalyticsProps {
  kpis: SystemKPIs;
  schedules: OptimizedBlockSchedule[];
}

export const AssetUptimeAnalytics: React.FC<AssetUptimeAnalyticsProps> = ({
  kpis,
  schedules,
}) => {
  const totalDowntimeSaved = schedules.reduce((a, b) => a + b.downtimeSavedMins, 0);

  const divisionStats = [
    { name: 'Delhi (DLI / NR)', availability: 98.2, blocksPlanned: 18, savedMins: 420, punctuality: 97.5 },
    { name: 'Prayagraj (PRYJ / NCR)', availability: 97.6, blocksPlanned: 16, savedMins: 380, punctuality: 96.8 },
    { name: 'Moradabad (MB / NR)', availability: 96.9, blocksPlanned: 11, savedMins: 290, punctuality: 95.4 },
    { name: 'Lucknow (LKO / NR)', availability: 97.1, blocksPlanned: 9, savedMins: 210, punctuality: 96.2 },
  ];

  const machineProductivity = [
    { machine: 'CSM 09-32 Track Tamping Machine', targetKm: 45, actualKm: 42.8, efficiency: 95.1 },
    { machine: 'UNIMAT 08-4S Turnout Tamper', targetPoints: 24, actualPoints: 23, efficiency: 95.8 },
    { machine: 'BCM 80 High-Capacity Ballast Cleaner', targetKm: 18, actualKm: 16.5, efficiency: 91.6 },
    { machine: '8-Wheeler DETC OHE Tower Wagon', targetHours: 80, actualHours: 76.5, efficiency: 95.6 },
    { machine: 'Kavach Tele-Testing Rig (S&T)', targetKm: 120, actualKm: 118, efficiency: 98.3 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 p-4 rounded shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#0A2540] uppercase tracking-wide flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-700" />
              Fixed Infrastructure Asset Availability & Synergy Analytics
            </h2>
            <span className="text-xs bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold border border-emerald-300">
              Uptime Verification
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Data-driven performance evaluation tracking composite asset availability, downtime savings, machine productivity, and punctuality retention.
          </p>
        </div>
      </div>

      {/* Main KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Composite Uptime</span>
          <div className="mt-1 text-3xl font-extrabold text-slate-900">
            {kpis.assetAvailabilityPercentage}%
          </div>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">
            +3.4% improvement via SAMANVAY
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Total Downtime Averted</span>
          <div className="mt-1 text-3xl font-extrabold text-[#0A2540]">
            {(totalDowntimeSaved / 60).toFixed(1)} <span className="text-base font-medium">Hours</span>
          </div>
          <p className="text-[11px] text-blue-700 font-medium mt-1">
            {totalDowntimeSaved} Minutes of Track Restored
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Shadow Synergy Rate</span>
          <div className="mt-1 text-3xl font-extrabold text-amber-900">
            {kpis.shadowUtilizationRate}%
          </div>
          <p className="text-[11px] text-amber-800 font-medium mt-1">
            {kpis.integratedBlocksPlanned} Multi-Dept Possessions
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Punctuality Retention</span>
          <div className="mt-1 text-3xl font-extrabold text-purple-900">
            {kpis.punctualityRetentionIndex}%
          </div>
          <p className="text-[11px] text-purple-700 font-medium mt-1">
            Zero high-speed Shatabdi detentions
          </p>
        </div>
      </div>

      {/* Division Performance Matrix */}
      <div className="bg-white border border-slate-200 rounded shadow-xs p-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-600" />
          Divisional Block Coordination & Infrastructure Reliability
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full railway-table text-left text-xs">
            <thead>
              <tr>
                <th>Railway Division</th>
                <th>Asset Availability Index</th>
                <th>Joint Blocks Executed</th>
                <th>Track Downtime Saved</th>
                <th>Punctuality Preservation</th>
                <th>Audit Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {divisionStats.map((div) => (
                <tr key={div.name} className="hover:bg-slate-50">
                  <td className="font-bold text-slate-900">{div.name}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{div.availability}%</span>
                      <div className="w-20 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-full"
                          style={{ width: `${div.availability}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="font-mono font-semibold">{div.blocksPlanned} Programs</td>
                  <td className="font-mono font-bold text-emerald-800">+{div.savedMins} Mins</td>
                  <td className="font-mono font-semibold text-blue-900">{div.punctuality}%</td>
                  <td>
                    <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-300">
                      EXCELLENT
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Machine & Gang Deployment Efficiency */}
      <div className="bg-white border border-slate-200 rounded shadow-xs p-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-600" />
          Heavy Track Machine & Specialized Equipment Utilization
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full railway-table text-left text-xs">
            <thead>
              <tr>
                <th>Machine Asset</th>
                <th>Target Output per Block</th>
                <th>Actual Realized Output</th>
                <th>Operational Efficiency</th>
                <th>Machine Health Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {machineProductivity.map((m) => (
                <tr key={m.machine} className="hover:bg-slate-50">
                  <td className="font-bold text-slate-900">{m.machine}</td>
                  <td className="font-mono text-slate-600">
                    {m.targetKm ? `${m.targetKm} Km` : m.targetPoints ? `${m.targetPoints} Points` : `${m.targetHours} Hours`}
                  </td>
                  <td className="font-mono font-semibold text-slate-800">
                    {m.actualKm ? `${m.actualKm} Km` : m.actualPoints ? `${m.actualPoints} Points` : `${m.actualHours} Hours`}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-900">{m.efficiency}%</span>
                      <div className="w-20 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-700 h-full rounded-full"
                          style={{ width: `${m.efficiency}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="bg-blue-50 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200">
                      OPTIMAL RUNNING
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
