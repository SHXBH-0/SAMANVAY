import React, { useState } from 'react';
import {
  Database,
  PlusCircle,
  Search,
  Train,
  Download,
  CalendarCheck,
} from 'lucide-react';
import {
  MaintenanceDemand,
  Department,
  SourceSystem,
  DefectSeverity,
  TrackLine,
  CorridorSection,
  TrainSlot,
} from '../../types';
import { DeptBadge, SeverityPill, SourceSystemBadge } from '../common/StatusPill';
import { calculateDemandCriticality } from '../../utils/optimizer';
import { exportDemandsToCSV } from '../../utils/exportUtils';

interface MultiSourceFeedsProps {
  demands: MaintenanceDemand[];
  corridors: CorridorSection[];
  trainSchedule: TrainSlot[];
  initialSourceFilter?: string;
  onAddDemand: (demand: MaintenanceDemand) => void;
  onRunOptimization: () => void;
}

export const MultiSourceFeeds: React.FC<MultiSourceFeedsProps> = ({
  demands,
  corridors,
  trainSchedule,
  initialSourceFilter,
  onAddDemand,
  onRunOptimization,
}) => {
  const [selectedSource, setSelectedSource] = useState<string>(initialSourceFilter || 'ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedSection, setSelectedSection] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedDemandDetail, setSelectedDemandDetail] = useState<MaintenanceDemand | null>(null);

  React.useEffect(() => {
    if (initialSourceFilter) {
      setSelectedSource(initialSourceFilter);
    }
  }, [initialSourceFilter]);

  // Form State
  const [formSource, setFormSource] = useState<SourceSystem>('TMS');
  const [formDept, setFormDept] = useState<Department>('ENGG');
  const [formSection, setFormSection] = useState<string>('SEC-01');
  const [formLine, setFormLine] = useState<TrackLine>('UP MAIN');
  const [formStartKm, setFormStartKm] = useState<string>('14/20');
  const [formEndKm, setFormEndKm] = useState<string>('16/50');
  const [formAssetType, setFormAssetType] = useState<string>('Ultrasonic Flaw Detection (USFD)');
  const [formDefect, setFormDefect] = useState<string>('Severe gauge face wear detected on high leg of curve with multiple gauge corner cracking.');
  const [formSeverity, setFormSeverity] = useState<DefectSeverity>('CRITICAL');
  const [formOverdueDays, setFormOverdueDays] = useState<number>(8);
  const [formDurationMins, setFormDurationMins] = useState<number>(180);
  const [formMachinery, setFormMachinery] = useState<string>('CSM Tamping Machine');
  const [formPSR, setFormPSR] = useState<string>('Imposition of PSR 45 kmph if unattended');
  const [formPowerCut, setFormPowerCut] = useState<boolean>(false);
  const [formTrafficBlock, setFormTrafficBlock] = useState<boolean>(true);
  const [formSignalDisc, setFormSignalDisc] = useState<boolean>(false);

  const handleSourceChange = (src: SourceSystem) => {
    setFormSource(src);
    if (src === 'TMS') {
      setFormDept('ENGG');
      setFormAssetType('Track Sleepers & Rails (60kg UIC)');
      setFormMachinery('CSM Track Tamping Machine');
      setFormPowerCut(false);
      setFormSignalDisc(false);
    } else if (src === 'SMMS') {
      setFormDept('SNT');
      setFormAssetType('Axle Counter & Point Machine');
      setFormMachinery('S&T Telemetry Test Rig');
      setFormPowerCut(false);
      setFormSignalDisc(true);
    } else if (src === 'TDMS') {
      setFormDept('TRD');
      setFormAssetType('25kV AC OHE Catenary Wire');
      setFormMachinery('8-Wheeler DETC Tower Wagon');
      setFormPowerCut(true);
      setFormSignalDisc(false);
    }
  };

  const handleCreateRequisition = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCorridor = corridors.find((c) => c.id === formSection);
    const prefix = formSource;
    const serial = Math.floor(100 + Math.random() * 900);
    const reqNo = `${prefix}/NR/DLI/2026/08/W-${serial}`;

    const newDemand: MaintenanceDemand = {
      id: `DEM-${prefix}-${Date.now().toString().slice(-4)}`,
      requisitionNo: reqNo,
      sourceSystem: formSource,
      department: formDept,
      sectionId: formSection,
      sectionCode: selectedCorridor?.code || 'NDLS-GZB',
      line: formLine,
      startKm: formStartKm,
      endKm: formEndKm,
      assetType: formAssetType,
      assetId: `AST-${formDept}-${serial}`,
      defectDescription: formDefect,
      severity: formSeverity,
      daysOverdue: Number(formOverdueDays),
      speedRestrictionRisk: formPSR,
      requiredDurationMins: Number(formDurationMins),
      minDurationMins: Math.round(Number(formDurationMins) * 0.8),
      requiresPowerDisconnection: formPowerCut,
      requiresTrafficBlock: formTrafficBlock,
      requiresSignalDisconnection: formSignalDisc,
      machineryRequired: formMachinery,
      manpowerGangSize: 15,
      estimatedDowntimeCost: '₹2,50,000 / week',
      criticalityScore: 0,
      status: 'PENDING_PLANNING',
      preferredTimeWindow: 'NIGHT_NON_PEAK',
      dateReported: new Date().toISOString().slice(0, 10),
    };

    newDemand.criticalityScore = calculateDemandCriticality(newDemand);
    onAddDemand(newDemand);
    setShowAddModal(false);
  };

  const filteredDemands = demands.filter((d) => {
    const matchSource = selectedSource === 'ALL' || d.sourceSystem === selectedSource;
    const matchSeverity = selectedSeverity === 'ALL' || d.severity === selectedSeverity;
    const matchSection = selectedSection === 'ALL' || d.sectionId === selectedSection;
    const matchSearch =
      searchQuery === '' ||
      d.requisitionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.defectDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.assetType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.sectionCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSource && matchSeverity && matchSection && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Info and Actions */}
      <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              Multi-Department Maintenance Requisitions Ledger
            </h2>
            <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded border border-blue-200">
              {demands.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Aggregated defect logs and periodic maintenance demands from <strong className="text-blue-700">TMS</strong> (Track), <strong className="text-emerald-700">SMMS</strong> (Signalling), and <strong className="text-amber-700">TDMS</strong> (OHE/Traction).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => exportDemandsToCSV(filteredDemands)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-semibold px-3 py-2 rounded-md flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            Export CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-md flex items-center gap-1.5 transition cursor-pointer shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-amber-300" />
            File New Requisition
          </button>
          <button
            onClick={onRunOptimization}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-md flex items-center gap-1.5 transition cursor-pointer shadow-sm"
          >
            <CalendarCheck className="w-4 h-4" />
            Plan Joint Corridor Blocks
          </button>
        </div>
      </div>

      {/* Connected Source Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setSelectedSource('ALL')}
          className={`px-3.5 py-2 text-xs font-bold rounded-md transition cursor-pointer ${
            selectedSource === 'ALL'
              ? 'bg-[#0D1E32] text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All Sources ({demands.length})
        </button>
        <button
          onClick={() => setSelectedSource('TMS')}
          className={`px-3.5 py-2 text-xs font-bold rounded-md transition cursor-pointer ${
            selectedSource === 'TMS'
              ? 'bg-blue-700 text-white shadow-sm'
              : 'bg-blue-50 text-blue-900 hover:bg-blue-100 border border-blue-200'
          }`}
        >
          TMS (Track / Civil) ({demands.filter((d) => d.sourceSystem === 'TMS').length})
        </button>
        <button
          onClick={() => setSelectedSource('SMMS')}
          className={`px-3.5 py-2 text-xs font-bold rounded-md transition cursor-pointer ${
            selectedSource === 'SMMS'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
          }`}
        >
          SMMS (Signals & Telecom) ({demands.filter((d) => d.sourceSystem === 'SMMS').length})
        </button>
        <button
          onClick={() => setSelectedSource('TDMS')}
          className={`px-3.5 py-2 text-xs font-bold rounded-md transition cursor-pointer ${
            selectedSource === 'TDMS'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-amber-50 text-amber-950 hover:bg-amber-100 border border-amber-300'
          }`}
        >
          TDMS (Traction OHE) ({demands.filter((d) => d.sourceSystem === 'TDMS').length})
        </button>
        <button
          onClick={() => setSelectedSource('COA')}
          className={`px-3.5 py-2 text-xs font-bold rounded-md transition cursor-pointer ${
            selectedSource === 'COA'
              ? 'bg-indigo-700 text-white shadow-sm'
              : 'bg-indigo-50 text-indigo-900 hover:bg-indigo-100 border border-indigo-200'
          }`}
        >
          COA Corridor Train Timetable ({trainSchedule.length} Paths)
        </button>
      </div>

      {/* Table view */}
      {selectedSource === 'COA' ? (
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Train className="w-4 h-4 text-indigo-700" />
              Control Office Application (COA) - Real-Time Train Density & Goods Forecast
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Live Timetable Feed • Central Traffic Control
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full railway-table text-left">
              <thead>
                <tr>
                  <th>Train No. & Name</th>
                  <th>Type & Priority</th>
                  <th>Section & Line</th>
                  <th>Scheduled Slot (IST)</th>
                  <th>Regulation Tolerance</th>
                  <th>Criticality Flag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {trainSchedule.map((t) => (
                  <tr key={t.trainNumber} className="hover:bg-indigo-50/20">
                    <td>
                      <div className="font-mono text-xs font-bold text-slate-900">
                        {t.trainNumber}
                      </div>
                      <div className="text-xs text-slate-700 font-semibold">{t.trainName}</div>
                    </td>
                    <td>
                      <span className="inline-block bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-300">
                        {t.trainType.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <div className="font-semibold text-xs text-slate-800">
                        {corridors.find((c) => c.id === t.sectionId)?.code || t.sectionId}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">{t.line}</div>
                    </td>
                    <td>
                      <span className="font-mono text-xs font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {t.scheduledArrival} - {t.scheduledDeparture}
                      </span>
                    </td>
                    <td>
                      {t.canBeRegulated ? (
                        <span className="text-xs text-emerald-700 font-semibold">
                          Up to {t.maxAllowableRegulationMins} mins regulation allowed
                        </span>
                      ) : (
                        <span className="text-xs text-red-700 font-bold">
                          Zero Regulation (Strict Path)
                        </span>
                      )}
                    </td>
                    <td>
                      {t.isCriticalPassenger ? (
                        <span className="bg-red-100 text-red-900 border border-red-200 text-[10px] font-bold px-2 py-0.5 rounded">
                          HIGH-SPEED PASSENGER
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-700 border border-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded">
                          FREIGHT CORRIDOR
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
          {/* Filter Bar */}
          <div className="p-3 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 rounded-t-lg">
            <div className="flex items-center space-x-2 flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search requisition no, asset type, defect description, km marker..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-blue-600"
              />
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-slate-500 font-medium">Severity:</span>
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="bg-white border border-slate-300 rounded px-2 py-1 outline-none text-xs font-semibold"
                >
                  <option value="ALL">All Severities</option>
                  <option value="EMERGENCY">Emergency</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="OVERDUE">Overdue</option>
                  <option value="ROUTINE">Routine</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-slate-500 font-medium">Corridor:</span>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="bg-white border border-slate-300 rounded px-2 py-1 outline-none text-xs font-semibold"
                >
                  <option value="ALL">All Sections</option>
                  {corridors.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} ({c.name.split(' ')[0]})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full railway-table text-left">
              <thead>
                <tr>
                  <th>Requisition No.</th>
                  <th>Department & Asset</th>
                  <th>Location & Line</th>
                  <th>Defect Description</th>
                  <th>Severity & Overdue</th>
                  <th>Required Window</th>
                  <th>Required Disconnections</th>
                  <th>Priority Score</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDemands.map((d) => (
                  <tr key={d.id} className="hover:bg-blue-50/25 transition-colors">
                    <td>
                      <div className="font-mono text-xs font-bold text-slate-800">
                        {d.requisitionNo}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1">
                        <SourceSystemBadge source={d.sourceSystem} />
                        <span className="text-[10px] text-slate-500 font-mono">
                          {d.dateReported}
                        </span>
                      </div>
                    </td>
                    <td>
                      <DeptBadge dept={d.department} />
                      <div className="text-[11px] font-bold text-slate-800 mt-1">
                        {d.assetType}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">{d.assetId}</div>
                    </td>
                    <td>
                      <div className="font-bold text-xs text-slate-900">{d.sectionCode}</div>
                      <div className="text-[11px] font-mono text-slate-600">
                        {d.line} (Km {d.startKm} - {d.endKm})
                      </div>
                    </td>
                    <td>
                      <div className="text-xs text-slate-800 max-w-[240px] leading-relaxed">
                        {d.defectDescription}
                      </div>
                      {d.machineryRequired && (
                        <div className="text-[10px] font-semibold text-blue-800 mt-1 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 inline-block">
                          Machine: {d.machineryRequired}
                        </div>
                      )}
                    </td>
                    <td>
                      <SeverityPill severity={d.severity} />
                      <div className="text-[10px] font-bold text-red-700 mt-0.5">
                        {d.daysOverdue} Days Overdue
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{d.speedRestrictionRisk}</div>
                    </td>
                    <td>
                      <div className="font-mono text-xs font-bold text-slate-900">
                        {d.requiredDurationMins} Mins
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Min: {d.minDurationMins}m
                      </div>
                    </td>
                    <td>
                      <div className="space-y-0.5 text-[10px]">
                        {d.requiresTrafficBlock && (
                          <div className="text-red-700 font-semibold">• Traffic Block</div>
                        )}
                        {d.requiresPowerDisconnection && (
                          <div className="text-amber-800 font-semibold">• 25kV OHE Cut</div>
                        )}
                        {d.requiresSignalDisconnection && (
                          <div className="text-emerald-800 font-semibold">• S&T Disconnection</div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <div className="font-mono font-extrabold text-sm text-blue-900">
                          {d.criticalityScore}
                        </div>
                        <span className="text-[10px] text-slate-500">/ 100</span>
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
                        onClick={() => setSelectedDemandDetail(d)}
                        className="text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded border border-blue-200 cursor-pointer"
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
      )}

      {/* Modal */}
      {selectedDemandDetail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-300 max-w-xl w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-bold font-mono text-slate-500">
                  {selectedDemandDetail.requisitionNo}
                </span>
                <h3 className="text-base font-bold text-[#0D1E32]">
                  Requisition & Asset Inspection Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedDemandDetail(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="text-slate-500">Source System:</span>
                <div className="font-bold text-slate-900 mt-0.5">
                  <SourceSystemBadge source={selectedDemandDetail.sourceSystem} />
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="text-slate-500">Department:</span>
                <div className="font-bold text-slate-900 mt-0.5">
                  <DeptBadge dept={selectedDemandDetail.department} />
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="text-slate-500">Corridor / Line:</span>
                <div className="font-bold text-slate-900 mt-0.5">
                  {selectedDemandDetail.sectionCode} ({selectedDemandDetail.line})
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="text-slate-500">Kilometer Marker:</span>
                <div className="font-mono font-bold text-slate-900 mt-0.5">
                  Km {selectedDemandDetail.startKm} to {selectedDemandDetail.endKm}
                </div>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-bold text-slate-700">Defect Description:</span>
              <p className="p-2.5 bg-slate-50 rounded border border-slate-200 text-slate-800 leading-relaxed">
                {selectedDemandDetail.defectDescription}
              </p>
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-bold text-red-700">Speed Restriction Risk:</span>
              <p className="p-2.5 bg-red-50 text-red-900 rounded border border-red-200 font-semibold">
                {selectedDemandDetail.speedRestrictionRisk}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <div className="text-xs text-slate-600">
                Priority Score: <strong className="text-blue-900">{selectedDemandDetail.criticalityScore}/100</strong>
              </div>
              <button
                onClick={() => setSelectedDemandDetail(null)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg border border-slate-300 max-w-2xl w-full p-6 shadow-xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0D1E32]">
                  File Maintenance Block Requisition / Defect Entry
                </h3>
                <p className="text-xs text-slate-500">
                  Record field defect entries from TMS (Track), SMMS (Signals), or TDMS (TRD Electrical)
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRequisition} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Source System</label>
                  <select
                    value={formSource}
                    onChange={(e) => handleSourceChange(e.target.value as SourceSystem)}
                    className="w-full bg-white border border-slate-300 rounded p-2 text-xs font-semibold"
                  >
                    <option value="TMS">TMS (Track Management System)</option>
                    <option value="SMMS">SMMS (Signalling Management)</option>
                    <option value="TDMS">TDMS (Traction Distribution)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Corridor Section</label>
                  <select
                    value={formSection}
                    onChange={(e) => setFormSection(e.target.value)}
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
                  <label className="block font-semibold text-slate-700 mb-1">Track Line</label>
                  <select
                    value={formLine}
                    onChange={(e) => setFormLine(e.target.value as TrackLine)}
                    className="w-full bg-white border border-slate-300 rounded p-2 text-xs font-semibold"
                  >
                    <option value="UP MAIN">UP MAIN</option>
                    <option value="DN MAIN">DN MAIN</option>
                    <option value="3RD LINE">3RD LINE</option>
                    <option value="4TH LINE">4TH LINE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Km</label>
                  <input
                    type="text"
                    value={formStartKm}
                    onChange={(e) => setFormStartKm(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded p-2 text-xs font-mono"
                    placeholder="e.g. 12/10"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Km</label>
                  <input
                    type="text"
                    value={formEndKm}
                    onChange={(e) => setFormEndKm(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded p-2 text-xs font-mono"
                    placeholder="e.g. 15/20"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Severity</label>
                  <select
                    value={formSeverity}
                    onChange={(e) => setFormSeverity(e.target.value as DefectSeverity)}
                    className="w-full bg-white border border-slate-300 rounded p-2 text-xs font-semibold"
                  >
                    <option value="EMERGENCY">EMERGENCY</option>
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="OVERDUE">OVERDUE</option>
                    <option value="ROUTINE">ROUTINE</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Overdue (Days)</label>
                  <input
                    type="number"
                    value={formOverdueDays}
                    onChange={(e) => setFormOverdueDays(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded p-2 text-xs font-mono"
                    min="0"
                    max="180"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Asset Specification</label>
                <input
                  type="text"
                  value={formAssetType}
                  onChange={(e) => setFormAssetType(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-2 text-xs"
                  placeholder="e.g. 60kg Rail, Point Machine, OHE Contact Wire"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Defect / Work Description</label>
                <textarea
                  rows={2}
                  value={formDefect}
                  onChange={(e) => setFormDefect(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-2 text-xs"
                  placeholder="Provide technical defect details and machinery required..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Required Block Window (Minutes)</label>
                  <input
                    type="number"
                    value={formDurationMins}
                    onChange={(e) => setFormDurationMins(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded p-2 text-xs font-mono"
                    step="15"
                    min="30"
                    max="600"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Track Machine / Rig</label>
                  <input
                    type="text"
                    value={formMachinery}
                    onChange={(e) => setFormMachinery(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded p-2 text-xs"
                    placeholder="e.g. CSM Tamping, Tower Wagon, Axle Test Kit"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Speed Restriction Risk</label>
                <input
                  type="text"
                  value={formPSR}
                  onChange={(e) => setFormPSR(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-2 text-xs"
                  placeholder="e.g. Imposition of PSR 30 kmph or signal failure"
                  required
                />
              </div>

              <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-2">
                <span className="font-bold text-slate-700">Required Joint Disconnections:</span>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formTrafficBlock}
                      onChange={(e) => setFormTrafficBlock(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span className="font-semibold text-slate-800">Traffic Block (Train Stoppage)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formPowerCut}
                      onChange={(e) => setFormPowerCut(e.target.checked)}
                      className="rounded text-amber-600"
                    />
                    <span className="font-semibold text-amber-900">25kV OHE Cut (TRD)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formSignalDisc}
                      onChange={(e) => setFormSignalDisc(e.target.checked)}
                      className="rounded text-emerald-600"
                    />
                    <span className="font-semibold text-emerald-900">S&T Disconnection</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-xs cursor-pointer"
                >
                  Save & Ingest Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
