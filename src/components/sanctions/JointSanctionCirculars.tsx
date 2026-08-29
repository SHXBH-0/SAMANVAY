import React, { useState } from 'react';
import {
  FileCheck2,
  Printer,
  Download,
  FileText,
} from 'lucide-react';
import { OptimizedBlockSchedule } from '../../types';
import { BlockStatusPill } from '../common/StatusPill';
import { exportDisconnectionMemoText, exportSchedulesToCSV } from '../../utils/exportUtils';

interface JointSanctionCircularsProps {
  schedules: OptimizedBlockSchedule[];
  selectedScheduleId: string | null;
  onSelectSchedule: (id: string) => void;
  onApproveSanction: (id: string) => void;
}

export const JointSanctionCirculars: React.FC<JointSanctionCircularsProps> = ({
  schedules,
  selectedScheduleId,
  onSelectSchedule,
  onApproveSanction,
}) => {
  const activeSchedule =
    schedules.find((s) => s.id === selectedScheduleId) || schedules[0];

  const [signedDepts, setSignedDepts] = useState<{
    dom: boolean;
    den: boolean;
    dste: boolean;
    dee: boolean;
  }>({
    dom: activeSchedule?.status === 'SANCTIONED',
    den: true,
    dste: true,
    dee: true,
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExecuteFullSanction = () => {
    setSignedDepts({ dom: true, den: true, dste: true, dee: true });
    onApproveSanction(activeSchedule.id);
  };

  if (!activeSchedule) {
    return (
      <div className="bg-white p-8 rounded-sm border border-slate-200 text-center text-slate-500 text-xs">
        No active block schedule selected. Please run the Optimizer or select a program.
      </div>
    );
  }

  const isFullySanctioned =
    activeSchedule.status === 'SANCTIONED' ||
    (signedDepts.dom && signedDepts.den && signedDepts.dste && signedDepts.dee);

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="bg-white border border-slate-200 p-4 rounded-sm shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-slate-700" />
              Joint Sanctions, Disconnection Memos & Official Circulars
            </h2>
            <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-300">
              IR GR 15.06 Standard
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Standardized Government of India format for Joint Traffic Blocks, Power Disconnections, and S&T Memos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={activeSchedule.id}
            onChange={(e) => onSelectSchedule(e.target.value)}
            className="bg-white border border-slate-300 rounded-sm px-2.5 py-1.5 font-semibold text-slate-900 outline-none"
          >
            {schedules.map((s) => (
              <option key={s.id} value={s.id}>
                {s.blockSanctionCode} ({s.sectionCode})
              </option>
            ))}
          </select>

          <button
            onClick={() => exportDisconnectionMemoText(activeSchedule)}
            title="Download official T/351 Disconnection Memo text format"
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-medium px-3 py-1.5 rounded-sm flex items-center gap-1.5 transition cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-slate-600" />
            <span>Memo (T/351)</span>
          </button>

          <button
            onClick={() => exportSchedulesToCSV(schedules)}
            title="Export all joint block schedules to CSV"
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-medium px-3 py-1.5 rounded-sm flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="bg-[#0D1E32] hover:bg-slate-800 text-white font-medium px-3.5 py-1.5 rounded-sm flex items-center gap-1.5 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Circular</span>
          </button>
        </div>
      </div>

      {/* Official Government Sanction Document */}
      <div className="bg-white border border-slate-300 p-8 rounded-sm shadow-xs max-w-4xl mx-auto sanction-document">
        {/* Document Header */}
        <div className="text-center border-b border-slate-300 pb-4">
          <div className="text-xs font-bold tracking-widest text-slate-600 uppercase">
            GOVERNMENT OF INDIA (भारत सरकार) • MINISTRY OF RAILWAYS (रेल मंत्रालय)
          </div>
          <div className="text-sm font-bold text-slate-900 uppercase tracking-wide mt-1">
            OPERATIONS CONTROL & CORRIDOR MANAGEMENT OFFICE
          </div>
          <div className="text-base font-serif font-bold text-slate-900 uppercase mt-2 tracking-wide underline">
            SPECIAL JOINT CORRIDOR BLOCK & DISCONNECTION CIRCULAR
          </div>
          <div className="text-[11px] text-slate-500 italic mt-0.5">
            (Issued under Indian Railways General Rules Section 15.06 for Multi-Departmental Block Possession)
          </div>
        </div>

        {/* Circular Reference Metadata */}
        <div className="grid grid-cols-2 text-xs py-3 border-b border-slate-200 gap-2 font-sans">
          <div>
            <span className="text-slate-500">Circular Order: </span>
            <strong className="font-mono text-slate-900">{activeSchedule.blockSanctionCode}</strong>
          </div>
          <div className="text-right">
            <span className="text-slate-500">Date of Issue: </span>
            <strong className="font-mono text-slate-900">
              {new Date().toISOString().slice(0, 10)}
            </strong>
          </div>
          <div>
            <span className="text-slate-500">Target Section: </span>
            <strong className="text-slate-900">
              {activeSchedule.sectionName} ({activeSchedule.line})
            </strong>
          </div>
          <div className="text-right">
            <span className="text-slate-500">Kilometer Span: </span>
            <strong className="font-mono text-slate-900">
              Km {activeSchedule.startKm} to {activeSchedule.endKm}
            </strong>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="my-4 text-xs space-y-2 leading-relaxed text-slate-800">
          <p>
            <strong>1. SANCTION DETAILS:</strong> Sanction is hereby accorded for granting a{' '}
            <strong>Joint Multi-Departmental Integrated Traffic Block</strong> of{' '}
            <strong>{activeSchedule.totalDurationMins} Minutes</strong> from{' '}
            <strong>{activeSchedule.startTime} hrs</strong> to{' '}
            <strong>{activeSchedule.endTime} hrs</strong> on date{' '}
            <strong>{activeSchedule.date}</strong> on the <strong>{activeSchedule.line}</strong> in{' '}
            <strong>{activeSchedule.sectionCode}</strong> corridor.
          </p>
          <p>
            <strong>2. CONCURRENCE & SYNERGY:</strong> To maximize fixed infrastructure uptime, the
            following departmental works shall be executed simultaneously within this single track
            possession window:
          </p>
        </div>

        {/* Departmental Work Table */}
        <div className="my-4 border border-slate-300 overflow-hidden rounded-xs">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-300 font-semibold">
              <tr>
                <th className="p-2.5 border-r border-slate-200 text-left w-36">Department / Source</th>
                <th className="p-2.5 border-r border-slate-200 text-left">Detailed Work Description</th>
                <th className="p-2.5 border-r border-slate-200 text-left w-48">Machinery / Squad</th>
                <th className="p-2.5 text-left w-24">Window</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {/* Primary Lead */}
              <tr>
                <td className="p-2.5 border-r border-slate-200 font-semibold text-slate-900">
                  {activeSchedule.leadDepartment} (Lead)
                  <div className="text-[10px] text-slate-500 font-mono font-normal">
                    {activeSchedule.primaryDemandId}
                  </div>
                </td>
                <td className="p-2.5 border-r border-slate-200 font-medium">
                  {activeSchedule.primaryWork}
                </td>
                <td className="p-2.5 border-r border-slate-200 font-mono text-[11px]">
                  {activeSchedule.primaryMachinery}
                </td>
                <td className="p-2.5 font-mono font-semibold text-slate-900">
                  {activeSchedule.totalDurationMins} Mins
                </td>
              </tr>

              {/* Shadow Departments */}
              {activeSchedule.shadowDepartments.map((sh, idx) => (
                <tr key={idx} className="bg-slate-50/50">
                  <td className="p-2.5 border-r border-slate-200 font-semibold text-slate-700">
                    {sh.department} (Shadow)
                    <div className="text-[10px] text-slate-500 font-mono font-normal">
                      {sh.demandId}
                    </div>
                  </td>
                  <td className="p-2.5 border-r border-slate-200">{sh.workDescription}</td>
                  <td className="p-2.5 border-r border-slate-200 font-mono text-[11px]">
                    {sh.machineryOrStaff}
                  </td>
                  <td className="p-2.5 font-mono font-semibold text-slate-700">{sh.durationMins} Mins</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Operating Directives */}
        <div className="my-4 text-xs space-y-1.5 border-t border-slate-200 pt-3 text-slate-800">
          <p>
            <strong>3. TRAIN REGULATION & OPERATING PRECAUTIONS:</strong>
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-700 text-[11px]">
            <li>
              <strong>Regulation Summary: </strong> {activeSchedule.trainRegulationsSummary}
            </li>
            <li>
              <strong>Caution Order (T/409): </strong> {activeSchedule.safetyCautionOrder}
            </li>
            <li>
              <strong>Disconnection Authority: </strong> {activeSchedule.disconnectionNoticeNo}
            </li>
            <li>
              <strong>Site Protection (GR 15.09): </strong> Work site protected under Indian Railways General Rules.
            </li>
          </ul>
        </div>

        {/* Multi-Departmental Digital Signatures */}
        <div className="mt-8 pt-4 border-t border-slate-300 grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs">
          {/* DOM */}
          <div className="p-2.5 border border-slate-200 rounded-sm bg-slate-50/50 flex flex-col justify-between h-24">
            <div className="text-[10px] font-semibold text-slate-600 uppercase">Operating (Traffic)</div>
            {signedDepts.dom ? (
              <div className="text-emerald-800 font-mono text-[10px] my-auto">
                ✓ DIGITALLY SIGNED<br />Sr. DOM
              </div>
            ) : (
              <div className="text-slate-400 text-[10px] my-auto">Pending</div>
            )}
            <div className="text-[10px] text-slate-500">Sr. DOM / Traffic</div>
          </div>

          {/* DEN */}
          <div className="p-2.5 border border-slate-200 rounded-sm bg-slate-50/50 flex flex-col justify-between h-24">
            <div className="text-[10px] font-semibold text-slate-600 uppercase">Civil (Track)</div>
            {signedDepts.den ? (
              <div className="text-emerald-800 font-mono text-[10px] my-auto">
                ✓ DIGITALLY SIGNED<br />Sr. DEN
              </div>
            ) : (
              <div className="text-slate-400 text-[10px] my-auto">Pending</div>
            )}
            <div className="text-[10px] text-slate-500">Sr. DEN (P-Way)</div>
          </div>

          {/* DSTE */}
          <div className="p-2.5 border border-slate-200 rounded-sm bg-slate-50/50 flex flex-col justify-between h-24">
            <div className="text-[10px] font-semibold text-slate-600 uppercase">Signals (S&T)</div>
            {signedDepts.dste ? (
              <div className="text-emerald-800 font-mono text-[10px] my-auto">
                ✓ DIGITALLY SIGNED<br />Sr. DSTE
              </div>
            ) : (
              <div className="text-slate-400 text-[10px] my-auto">Pending</div>
            )}
            <div className="text-[10px] text-slate-500">Sr. DSTE (Signals)</div>
          </div>

          {/* DEE */}
          <div className="p-2.5 border border-slate-200 rounded-sm bg-slate-50/50 flex flex-col justify-between h-24">
            <div className="text-[10px] font-semibold text-slate-600 uppercase">Traction (TRD)</div>
            {signedDepts.dee ? (
              <div className="text-emerald-800 font-mono text-[10px] my-auto">
                ✓ DIGITALLY SIGNED<br />Sr. DEE
              </div>
            ) : (
              <div className="text-slate-400 text-[10px] my-auto">Pending</div>
            )}
            <div className="text-[10px] text-slate-500">Sr. DEE / Electrical</div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-[10px] text-slate-400 text-center border-t border-slate-100 pt-2">
          Official copy transmitted via SAMANVAY Intranet to Chief Controller, Station Masters, and Section Engineers.
        </div>
      </div>

      {/* Action Bar */}
      {!isFullySanctioned && (
        <div className="bg-slate-50 border border-slate-300 p-4 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto no-print">
          <div>
            <div className="text-xs font-bold text-slate-900">
              Joint Divisional Sign-Off Required
            </div>
            <p className="text-xs text-slate-600">
              Execute digital joint sign-off by Operating, Track, S&T, and TRD authorities to sanction this block.
            </p>
          </div>

          <button
            onClick={handleExecuteFullSanction}
            className="bg-[#0D1E32] hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-sm cursor-pointer whitespace-nowrap"
          >
            Execute Digital Joint Sanction
          </button>
        </div>
      )}
    </div>
  );
};
