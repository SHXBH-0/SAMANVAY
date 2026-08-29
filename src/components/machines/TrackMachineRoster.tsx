import React, { useState } from 'react';
import {
  Truck,
  Fuel,
  MapPin,
  User,
  Zap,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { TrackMachineAsset, CorridorSection } from '../../types';

interface TrackMachineRosterProps {
  machines: TrackMachineAsset[];
  corridors: CorridorSection[];
  onUpdateMachineStatus?: (machineId: string, newStatus: TrackMachineAsset['status'], location: string) => void;
}

export const TrackMachineRoster: React.FC<TrackMachineRosterProps> = ({
  machines,
  corridors,
  onUpdateMachineStatus,
}) => {
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');
  const [selectedDivisionFilter, setSelectedDivisionFilter] = useState<string>('ALL');
  const [selectedMachine, setSelectedMachine] = useState<TrackMachineAsset | null>(machines[0] || null);
  const [showDeployModal, setShowDeployModal] = useState<boolean>(false);
  const [targetCorridor, setTargetCorridor] = useState<string>(corridors[0]?.id || 'SEC-01');
  const [targetKm, setTargetKm] = useState<string>('Km 18/20 (UP Main)');
  const [deployNote, setDeployNote] = useState<string>('Assigned for nighttime joint tamping block');

  const filteredMachines = machines.filter((m) => {
    const matchType = selectedTypeFilter === 'ALL' || m.machineType === selectedTypeFilter;
    const matchDiv = selectedDivisionFilter === 'ALL' || m.divisionAssigned === selectedDivisionFilter;
    return matchType && matchDiv;
  });

  const handleConfirmDeployment = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMachine && onUpdateMachineStatus) {
      const selectedCorr = corridors.find((c) => c.id === targetCorridor);
      const locString = `${targetKm} - ${selectedCorr?.code || 'Corridor'}`;
      onUpdateMachineStatus(selectedMachine.id, 'DEPLOYED', locString);
      setSelectedMachine({
        ...selectedMachine,
        status: 'DEPLOYED',
        currentLocationKm: locString,
      });
    }
    setShowDeployModal(false);
  };

  const handleReleaseMachine = (machineId: string) => {
    if (onUpdateMachineStatus && selectedMachine) {
      onUpdateMachineStatus(machineId, 'AVAILABLE', `${selectedMachine.homeDepot} (Stabled)`);
      setSelectedMachine({
        ...selectedMachine,
        status: 'AVAILABLE',
        currentLocationKm: `${selectedMachine.homeDepot} (Stabled)`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-600" />
              Heavy Track Machine Fleet Management & Deployment Roster
            </h2>
            <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded border border-amber-300">
              IR Track Machine Directorate
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Real-time tracking of mechanized equipment (CSM Tampers, UNIMAT, BCM Ballast Cleaners, DETC Tower Wagons, and PQRS Relaying Units).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-600 font-bold">Division:</span>
            <select
              value={selectedDivisionFilter}
              onChange={(e) => setSelectedDivisionFilter(e.target.value)}
              className="bg-white border border-slate-300 rounded-md px-2.5 py-1.5 font-bold text-xs outline-none cursor-pointer"
            >
              <option value="ALL">All Divisions</option>
              <option value="DLI">Delhi (DLI)</option>
              <option value="PRYJ">Prayagraj (PRYJ)</option>
              <option value="HWH">Howrah (HWH)</option>
              <option value="MMCT">Mumbai (MMCT)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Machine Type Filter Chips */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setSelectedTypeFilter('ALL')}
          className={`px-3.5 py-1.5 rounded-md transition cursor-pointer ${
            selectedTypeFilter === 'ALL'
              ? 'bg-[#0D1E32] text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All Fleet ({machines.length})
        </button>
        <button
          onClick={() => setSelectedTypeFilter('TAMPING')}
          className={`px-3.5 py-1.5 rounded-md transition cursor-pointer ${
            selectedTypeFilter === 'TAMPING'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-blue-50 text-blue-900 border border-blue-200'
          }`}
        >
          Tampers (CSM / UNIMAT) ({machines.filter((m) => m.machineType === 'TAMPING').length})
        </button>
        <button
          onClick={() => setSelectedTypeFilter('BALLAST_CLEANING')}
          className={`px-3.5 py-1.5 rounded-md transition cursor-pointer ${
            selectedTypeFilter === 'BALLAST_CLEANING'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
          }`}
        >
          Ballast Cleaners (BCM) ({machines.filter((m) => m.machineType === 'BALLAST_CLEANING').length})
        </button>
        <button
          onClick={() => setSelectedTypeFilter('OHE_TOWER_WAGON')}
          className={`px-3.5 py-1.5 rounded-md transition cursor-pointer ${
            selectedTypeFilter === 'OHE_TOWER_WAGON'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-amber-50 text-amber-900 border border-amber-300'
          }`}
        >
          OHE Tower Wagons (DETC) ({machines.filter((m) => m.machineType === 'OHE_TOWER_WAGON').length})
        </button>
        <button
          onClick={() => setSelectedTypeFilter('TRACK_RELAYING')}
          className={`px-3.5 py-1.5 rounded-md transition cursor-pointer ${
            selectedTypeFilter === 'TRACK_RELAYING'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-purple-50 text-purple-900 border border-purple-200'
          }`}
        >
          Track Relaying (PQRS) ({machines.filter((m) => m.machineType === 'TRACK_RELAYING').length})
        </button>
      </div>

      {/* Machine Fleet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMachines.map((m) => (
          <div
            key={m.id}
            onClick={() => setSelectedMachine(m)}
            className={`border rounded-lg p-4 bg-white shadow-sm cursor-pointer transition hover:border-blue-500 relative ${
              selectedMachine?.id === m.id ? 'border-2 border-blue-600 ring-2 ring-blue-100' : 'border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                {m.machineCode}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  m.status === 'AVAILABLE'
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : m.status === 'DEPLOYED'
                    ? 'bg-blue-100 text-blue-900 border-blue-300'
                    : 'bg-amber-100 text-amber-900 border-amber-300'
                }`}
              >
                {m.status.replace('_', ' ')}
              </span>
            </div>

            <h3 className="text-xs font-bold text-slate-900">{m.machineName}</h3>

            <div className="mt-3 space-y-1.5 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Base: <strong className="text-slate-800">{m.homeDepot}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Output: <strong className="text-emerald-700 font-bold">{m.productivityPerHr}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>In-Charge: <strong className="text-slate-800">{m.operatorInCharge}</strong></span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1 text-slate-700 font-bold">
                <Fuel className="w-3.5 h-3.5 text-amber-600" />
                <span>Fuel: {m.fuelFuelLevelPct}%</span>
              </div>
              <span className="font-mono text-slate-500">POH Due: {m.nextScheduledPOH}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Machine Detail & Live Action Panel */}
      {selectedMachine && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-mono text-slate-500">
                  {selectedMachine.machineCode}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    selectedMachine.status === 'AVAILABLE'
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : selectedMachine.status === 'DEPLOYED'
                      ? 'bg-blue-100 text-blue-900 border-blue-300'
                      : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}
                >
                  {selectedMachine.status}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                {selectedMachine.machineName} — Operational Dossier & Live Control
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {selectedMachine.status === 'AVAILABLE' ? (
                <button
                  onClick={() => setShowDeployModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-md transition cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  <Truck className="w-3.5 h-3.5" />
                  Deploy Machine to Block
                </button>
              ) : (
                <button
                  onClick={() => handleReleaseMachine(selectedMachine.id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-md transition cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Release / Return to Depot
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
              <span className="text-slate-500 font-semibold">Current Track Pos:</span>
              <div className="font-bold text-slate-900 mt-1">{selectedMachine.currentLocationKm}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
              <span className="text-slate-500 font-semibold">Rated Machine Output:</span>
              <div className="font-bold text-emerald-800 mt-1">{selectedMachine.productivityPerHr}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
              <span className="text-slate-500 font-semibold">Last POH Workshop:</span>
              <div className="font-mono font-bold text-slate-900 mt-1">{selectedMachine.lastPOHDate}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
              <span className="text-slate-500 font-semibold">Maintenance Health:</span>
              <div className="font-bold text-blue-700 mt-1">100% Fitness Certified</div>
            </div>
          </div>
        </div>
      )}

      {/* Deployment Modal */}
      {showDeployModal && selectedMachine && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-300 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-slate-500">
                  {selectedMachine.machineCode}
                </span>
                <h3 className="text-base font-bold text-[#0D1E32]">
                  Deploy Machine to Joint Block Section
                </h3>
              </div>
              <button
                onClick={() => setShowDeployModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmDeployment} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Corridor Section</label>
                <select
                  value={targetCorridor}
                  onChange={(e) => setTargetCorridor(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-2 text-xs font-semibold"
                >
                  {corridors.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} ({c.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kilometer Span & Track</label>
                <input
                  type="text"
                  value={targetKm}
                  onChange={(e) => setTargetKm(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-2 text-xs font-mono"
                  placeholder="e.g. Km 14/10 to 17/00 (DN Main)"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Operational Instructions & Safety Note</label>
                <textarea
                  rows={2}
                  value={deployNote}
                  onChange={(e) => setDeployNote(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-2 text-xs"
                  placeholder="Enter block deployment particulars..."
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowDeployModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold cursor-pointer"
                >
                  Confirm Machine Deployment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
