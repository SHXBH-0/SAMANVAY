import { MaintenanceDemand, OptimizedBlockSchedule } from '../types';

/**
 * Exports raw maintenance requisitions (TMS, SMMS, TDMS) to CSV.
 */
export function exportDemandsToCSV(demands: MaintenanceDemand[]) {
  const headers = [
    'Requisition No',
    'Source System',
    'Department',
    'Section Code',
    'Track Line',
    'Start Km',
    'End Km',
    'Asset Type',
    'Asset ID',
    'Defect Description',
    'Severity',
    'Days Overdue',
    'Required Duration (Mins)',
    'Speed Restriction Risk',
    'Machinery Required',
    'Gang Size',
    'Traffic Block Req',
    'Power Disconnection Req',
    'Signal Disconnection Req',
    'MCDA Criticality Score',
    'Status',
    'Date Reported'
  ];

  const rows = demands.map(d => [
    `"${d.requisitionNo}"`,
    `"${d.sourceSystem}"`,
    `"${d.department}"`,
    `"${d.sectionCode}"`,
    `"${d.line}"`,
    `"${d.startKm}"`,
    `"${d.endKm}"`,
    `"${d.assetType.replace(/"/g, '""')}"`,
    `"${d.assetId}"`,
    `"${d.defectDescription.replace(/"/g, '""')}"`,
    `"${d.severity}"`,
    d.daysOverdue,
    d.requiredDurationMins,
    `"${d.speedRestrictionRisk.replace(/"/g, '""')}"`,
    `"${(d.machineryRequired || '').replace(/"/g, '""')}"`,
    d.manpowerGangSize,
    d.requiresTrafficBlock ? 'YES' : 'NO',
    d.requiresPowerDisconnection ? 'YES' : 'NO',
    d.requiresSignalDisconnection ? 'YES' : 'NO',
    d.criticalityScore,
    `"${d.status}"`,
    `"${d.dateReported}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  downloadFile(csvContent, `SAMANVAY_Requisitions_Ledger_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Exports optimized block schedules to CSV with full multi-department breakdown.
 */
export function exportSchedulesToCSV(schedules: OptimizedBlockSchedule[]) {
  const headers = [
    'Block Sanction Code',
    'Horizon',
    'Date',
    'Start Time',
    'End Time',
    'Total Duration (Mins)',
    'Section Code',
    'Section Name',
    'Track Line',
    'Start Km',
    'End Km',
    'Lead Department',
    'Primary Work',
    'Primary Machinery',
    'Shadow Departments Count',
    'Shadow Works Summary',
    'Downtime Saved (Mins)',
    'Detention Impact (Mins)',
    'Affected Trains',
    'Optimization Score %',
    'Synergy Gain %',
    'Sanction Status',
    'Sanctioned By',
    'Sanction Timestamp',
    'Caution Order No',
    'Disconnection Notice No'
  ];

  const rows = schedules.map(s => {
    const shadowSummary = s.shadowDepartments.map(sh => `${sh.department}: ${sh.workDescription} (${sh.durationMins}m)`).join(' | ');
    return [
      `"${s.blockSanctionCode}"`,
      `"${s.horizon}"`,
      `"${s.date}"`,
      `"${s.startTime}"`,
      `"${s.endTime}"`,
      s.totalDurationMins,
      `"${s.sectionCode}"`,
      `"${s.sectionName.replace(/"/g, '""')}"`,
      `"${s.line}"`,
      `"${s.startKm}"`,
      `"${s.endKm}"`,
      `"${s.leadDepartment}"`,
      `"${s.primaryWork.replace(/"/g, '""')}"`,
      `"${s.primaryMachinery.replace(/"/g, '""')}"`,
      s.shadowDepartments.length,
      `"${shadowSummary.replace(/"/g, '""')}"`,
      s.downtimeSavedMins,
      s.punctualityImpactMin,
      s.affectedTrainsCount,
      s.optimizationScore,
      s.synergyGainPercentage,
      `"${s.status}"`,
      `"${(s.sanctionedBy || '').replace(/"/g, '""')}"`,
      `"${s.sanctionTimestamp || ''}"`,
      `"${(s.safetyCautionOrder || '').replace(/"/g, '""')}"`,
      `"${(s.disconnectionNoticeNo || '').replace(/"/g, '""')}"`
    ];
  });

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  downloadFile(csvContent, `SAMANVAY_Joint_Block_Program_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Exports official Disconnection Memo (T/351) text format.
 */
export function exportDisconnectionMemoText(schedule: OptimizedBlockSchedule) {
  const text = `================================================================================
INDIAN RAILWAYS | SPECIAL JOINT BLOCK & DISCONNECTION NOTICE (T/351 & T/409)
SAMANVAY AUTOMATIC BLOCK PLANNING SYSTEM - MINISTRY OF RAILWAYS (GOVT OF INDIA)
================================================================================

Sanction Order No : ${schedule.blockSanctionCode}
Date of Block     : ${schedule.date}
Block Time Window : ${schedule.startTime} hrs to ${schedule.endTime} hrs (${schedule.totalDurationMins} Minutes)
Corridor Section  : ${schedule.sectionName} (${schedule.sectionCode})
Track Line        : ${schedule.line} (Km ${schedule.startKm} to Km ${schedule.endKm})
Horizon Program   : ${schedule.horizon} HORIZON

--------------------------------------------------------------------------------
1. PRIMARY LEAD DEPARTMENT WORK (TRACK / CIVIL ENGINEERING - TMS)
--------------------------------------------------------------------------------
Lead Department   : ${schedule.leadDepartment}
Requisition ID    : ${schedule.primaryDemandId}
Work Description  : ${schedule.primaryWork}
Machinery Deployed: ${schedule.primaryMachinery}

--------------------------------------------------------------------------------
2. SYNCHRONIZED SHADOW DEPARTMENTAL WORKS (SMMS / TDMS)
--------------------------------------------------------------------------------
${schedule.shadowDepartments.map((sh, idx) => `[Shadow ${idx + 1}] Dept: ${sh.department} (Source: ${sh.sourceSystem})
  Work   : ${sh.workDescription}
  Asset  : ${sh.assetType}
  Staff  : ${sh.machineryOrStaff}
  Slot   : ${sh.durationMins} Mins
  Benefit: ${sh.speedRestrictionAvoided}
`).join('\n')}

--------------------------------------------------------------------------------
3. TRAIN REGULATION & CONTROL OFFICE (COA) DIRECTIVES
--------------------------------------------------------------------------------
Regulation Summary: ${schedule.trainRegulationsSummary}
Detention Impact  : ${schedule.punctualityImpactMin} Minutes | ${schedule.affectedTrainsCount} Trains
Downtime Saved    : ${schedule.downtimeSavedMins} Minutes saved via multi-department synergy (${schedule.synergyGainPercentage}% efficiency gain)

--------------------------------------------------------------------------------
4. OPERATING RULES & CAUTION ORDERS
--------------------------------------------------------------------------------
Caution Order Ref : ${schedule.safetyCautionOrder || 'T/409 Standard Track Protection'}
Disconnection Ref : ${schedule.disconnectionNoticeNo || 'T/351 (S&T) & PTW (TRD)'}
General Rules     : Work protected under Indian Railways General Rules GR 15.06 & 15.09.

--------------------------------------------------------------------------------
5. DIGITAL SIGN-OFF & SANCTION
--------------------------------------------------------------------------------
Sanction Status   : ${schedule.status}
Approved Authority: ${schedule.sanctionedBy || 'Divisional Operating Manager (Sr. DOM)'}
Timestamp         : ${schedule.sanctionTimestamp || 'Generated via SAMANVAY CRIS Engine'}

================================================================================
End of Official Railway Memo | CRIS System Generated Document
================================================================================`;

  downloadFile(text, `DISCONNECTION_MEMO_${schedule.blockSanctionCode.replace(/[\/\\]/g, '_')}.txt`, 'text/plain;charset=utf-8;');
}

function downloadFile(content: string, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
