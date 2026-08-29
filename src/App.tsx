import React, { useState } from 'react';
import { GovHeader } from './components/common/GovHeader';
import { NavigationBar, ActiveTab } from './components/common/NavigationBar';
import { GovFooter } from './components/common/GovFooter';
import { CommandDashboard } from './components/dashboard/CommandDashboard';
import { MultiSourceFeeds } from './components/integration/MultiSourceFeeds';
import { JointBlockOptimizer } from './components/optimizer/JointBlockOptimizer';
import { CorridorGanttVisualizer } from './components/corridor/CorridorGanttVisualizer';
import { MultiHorizonPrograms } from './components/schedules/MultiHorizonPrograms';
import { JointSanctionCirculars } from './components/sanctions/JointSanctionCirculars';
import { TrackMachineRoster } from './components/machines/TrackMachineRoster';
import { AssetUptimeAnalytics } from './components/analytics/AssetUptimeAnalytics';

import {
  INITIAL_CORRIDORS,
  INITIAL_MAINTENANCE_DEMANDS,
  INITIAL_TRAIN_SCHEDULE,
  INITIAL_CORRIDOR_WINDOWS,
  INITIAL_OPTIMIZED_SCHEDULES,
  INITIAL_SYSTEM_KPIS,
  INITIAL_TRACK_MACHINES,
} from './data/mockData';

import {
  MaintenanceDemand,
  OptimizedBlockSchedule,
  SystemKPIs,
  HorizonType,
  OptimizationWeights,
  BlockStatus,
  TrackMachineAsset,
} from './types';
import { runBlockOptimizer } from './utils/optimizer';
import { exportSchedulesToCSV } from './utils/exportUtils';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [activeDivision, setActiveDivision] = useState<string>('ALL');
  const [activeRole, setActiveRole] = useState<string>('SR_DOM');

  const [corridors] = useState(INITIAL_CORRIDORS);
  const [demands, setDemands] = useState<MaintenanceDemand[]>(INITIAL_MAINTENANCE_DEMANDS);
  const [trainSchedule] = useState(INITIAL_TRAIN_SCHEDULE);
  const [corridorWindows] = useState(INITIAL_CORRIDOR_WINDOWS);
  const [schedules, setSchedules] = useState<OptimizedBlockSchedule[]>(INITIAL_OPTIMIZED_SCHEDULES);
  const [machines, setMachines] = useState<TrackMachineAsset[]>(INITIAL_TRACK_MACHINES);
  const [kpis, setKpis] = useState<SystemKPIs>(INITIAL_SYSTEM_KPIS);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(schedules[0]?.id || null);

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Add new demand from TMS / SMMS / TDMS
  const handleAddDemand = (newDemand: MaintenanceDemand) => {
    setDemands((prev) => [newDemand, ...prev]);
    setKpis((prev) => ({
      ...prev,
      totalDemandsIngested: prev.totalDemandsIngested + 1,
      tmsCount: newDemand.sourceSystem === 'TMS' ? prev.tmsCount + 1 : prev.tmsCount,
      smmsCount: newDemand.sourceSystem === 'SMMS' ? prev.smmsCount + 1 : prev.smmsCount,
      tdmsCount: newDemand.sourceSystem === 'TDMS' ? prev.tdmsCount + 1 : prev.tdmsCount,
    }));
    showToast(`✓ Requisition ${newDemand.requisitionNo} successfully filed into SAMANVAY database.`);
  };

  // Run Optimizer with user weights
  const handleRunOptimization = (
    horizon: HorizonType = 'DAILY',
    weights?: OptimizationWeights
  ) => {
    const generated = runBlockOptimizer(demands, corridorWindows, horizon, weights);

    // Merge or set schedules
    setSchedules((prev) => {
      const otherHorizons = prev.filter((s) => s.horizon !== horizon);
      return [...generated, ...otherHorizons];
    });

    if (generated.length > 0) {
      setSelectedScheduleId(generated[0].id);
    }

    const downtimeSaved = generated.reduce((acc, g) => acc + g.downtimeSavedMins, 0);
    setKpis((prev) => ({
      ...prev,
      integratedBlocksPlanned: prev.integratedBlocksPlanned + generated.length,
      averageDowntimeSavedMins: Math.round(
        (prev.averageDowntimeSavedMins + downtimeSaved / (generated.length || 1)) / 2
      ),
      assetAvailabilityPercentage: Number(Math.min(99.2, prev.assetAvailabilityPercentage + 0.3).toFixed(1)),
    }));

    showToast(`✓ Optimization Complete: Generated ${generated.length} synchronized Joint Blocks for ${horizon} horizon.`);
  };

  // Update status (e.g. Recommended -> Sanctioned -> In Progress -> Completed)
  const handleUpdateScheduleStatus = (scheduleId: string, newStatus: BlockStatus) => {
    setSchedules((prev) =>
      prev.map((s) => {
        if (s.id === scheduleId) {
          return {
            ...s,
            status: newStatus,
            sanctionedBy:
              newStatus === 'SANCTIONED'
                ? 'Sr. DOM (Traffic) & Divisional Joint Authority'
                : s.sanctionedBy,
            sanctionTimestamp:
              newStatus === 'SANCTIONED'
                ? new Date().toISOString().replace('T', ' ').slice(0, 16) + ' hrs'
                : s.sanctionTimestamp,
          };
        }
        return s;
      })
    );

    showToast(`✓ Status for ${scheduleId} updated to ${newStatus}.`);
  };

  // Direct navigate to sanction inspector
  const handleSelectScheduleAndNavigate = (id: string) => {
    setSelectedScheduleId(id);
    setActiveTab('sanctions');
  };

  const [activeFeedFilter, setActiveFeedFilter] = useState<string>('ALL');
  const [activeCorridorId, setActiveCorridorId] = useState<string>('SEC-01');

  // Direct navigate to feeds with source filter
  const handleNavigateToFeedsWithFilter = (source: string) => {
    setActiveFeedFilter(source);
    setActiveTab('feeds');
  };

  // Direct navigate to corridor gantt visualizer
  const handleSelectCorridorAndNavigate = (corridorId: string) => {
    setActiveCorridorId(corridorId);
    setActiveTab('corridor');
  };

  const pendingSanctionsCount = schedules.filter(
    (s) => s.status === 'RECOMMENDED' || s.status === 'UNDER_REVIEW'
  ).length;

  const unassignedDemandsCount = demands.filter((d) => d.status === 'PENDING_PLANNING').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F9] text-slate-800">
      {/* Official Header */}
      <GovHeader
        activeDivision={activeDivision}
        onDivisionChange={setActiveDivision}
        activeRole={activeRole}
        onRoleChange={setActiveRole}
        onRefreshData={() => showToast('✓ Live data feeds synchronized from TMS, SMMS, TDMS, and COA servers.')}
      />

      {/* Main GovTech Tab Navigation */}
      <NavigationBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingSanctionsCount={pendingSanctionsCount}
        unassignedDemandsCount={unassignedDemandsCount}
        onExportAllData={() => {
          exportSchedulesToCSV(schedules);
          showToast('✓ Exporting Master Joint Block Schedule CSV.');
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A2540] text-white text-xs font-semibold px-4 py-3 rounded-lg shadow-xl border-2 border-amber-400 flex items-center gap-2 animate-bounce no-print">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <CommandDashboard
            kpis={kpis}
            demands={demands}
            schedules={schedules}
            corridors={corridors}
            onNavigateToOptimizer={() => setActiveTab('optimizer')}
            onNavigateToFeeds={() => {
              setActiveFeedFilter('ALL');
              setActiveTab('feeds');
            }}
            onNavigateToFeedsWithFilter={handleNavigateToFeedsWithFilter}
            onNavigateToSanctions={() => setActiveTab('sanctions')}
            onNavigateToAnalytics={() => setActiveTab('analytics')}
            onSelectSchedule={handleSelectScheduleAndNavigate}
            onSelectCorridor={handleSelectCorridorAndNavigate}
          />
        )}

        {activeTab === 'feeds' && (
          <MultiSourceFeeds
            demands={demands}
            corridors={corridors}
            trainSchedule={trainSchedule}
            initialSourceFilter={activeFeedFilter}
            onAddDemand={handleAddDemand}
            onRunOptimization={() => {
              setActiveTab('optimizer');
              handleRunOptimization('DAILY');
            }}
          />
        )}

        {activeTab === 'optimizer' && (
          <JointBlockOptimizer
            demands={demands}
            windows={corridorWindows}
            schedules={schedules}
            onRunOptimizationWithParams={(horizon, weights) =>
              handleRunOptimization(horizon, weights)
            }
            onNavigateToSanctions={() => setActiveTab('sanctions')}
          />
        )}

        {activeTab === 'corridor' && (
          <CorridorGanttVisualizer
            corridors={corridors}
            schedules={schedules}
            trainSchedule={trainSchedule}
            initialCorridorId={activeCorridorId}
            onSelectSchedule={handleSelectScheduleAndNavigate}
          />
        )}

        {activeTab === 'schedules' && (
          <MultiHorizonPrograms
            schedules={schedules}
            corridors={corridors}
            onSelectSchedule={handleSelectScheduleAndNavigate}
            onUpdateScheduleStatus={handleUpdateScheduleStatus}
            onNavigateToOptimizer={() => setActiveTab('optimizer')}
          />
        )}

        {activeTab === 'sanctions' && (
          <JointSanctionCirculars
            schedules={schedules}
            selectedScheduleId={selectedScheduleId}
            onSelectSchedule={(id) => setSelectedScheduleId(id)}
            onApproveSanction={(id) => handleUpdateScheduleStatus(id, 'SANCTIONED')}
          />
        )}

        {activeTab === 'machines' && (
          <TrackMachineRoster machines={machines} corridors={corridors} />
        )}

        {activeTab === 'analytics' && (
          <AssetUptimeAnalytics kpis={kpis} schedules={schedules} />
        )}
      </main>

      {/* Official Government Footer */}
      <GovFooter />
    </div>
  );
};

export default App;
