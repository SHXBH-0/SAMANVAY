export type Department = 'ENGG' | 'SNT' | 'TRD' | 'OPT';

export type SourceSystem = 'TMS' | 'SMMS' | 'TDMS' | 'COA' | 'BDMS';

export type DefectSeverity = 'EMERGENCY' | 'CRITICAL' | 'OVERDUE' | 'ROUTINE';

export type BlockStatus = 'RECOMMENDED' | 'SANCTIONED' | 'UNDER_REVIEW' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type HorizonType = 'DAILY' | 'WEEKLY' | 'MONTHLY';

export type TrackLine = 'UP MAIN' | 'DN MAIN' | '3RD LINE' | '4TH LINE' | 'LOOP LINE' | 'YARD';

export interface CorridorSection {
  id: string;
  code: string;
  name: string;
  zone: string;
  division: string;
  fromStation: string;
  toStation: string;
  startKm: number;
  endKm: number;
  totalLengthKm: number;
  tracks: TrackLine[];
  speedLimitKmph: number;
  dailyTrainDensity: number; // Trains per 24 hours
  electrification: '25kV AC' | 'NON-ELECTRIFIED';
  signalingType: 'AUTOMATIC BLOCK' | 'ABSOLUTE BLOCK' | 'KAVACH ENABLED';
}

export interface TrackMachineAsset {
  id: string;
  machineCode: string;
  machineName: string;
  machineType: 'TAMPING' | 'BALLAST_CLEANING' | 'TRACK_RELAYING' | 'OHE_TOWER_WAGON' | 'USFD_FLAW_DETECTOR' | 'SHOULDER_CLEANER';
  divisionAssigned: string;
  homeDepot: string;
  status: 'AVAILABLE' | 'DEPLOYED' | 'MAINTENANCE_POH' | 'IN_TRANSIT';
  productivityPerHr: string; // e.g. "1.8 Km / Hour"
  currentLocationKm: string;
  operatorInCharge: string;
  lastPOHDate: string;
  nextScheduledPOH: string;
  fuelFuelLevelPct: number;
}

export interface MaintenanceDemand {
  id: string;
  requisitionNo: string;
  sourceSystem: SourceSystem;
  department: Department;
  sectionId: string;
  sectionCode: string;
  line: TrackLine;
  startKm: string;
  endKm: string;
  assetType: string;
  assetId: string;
  defectDescription: string;
  severity: DefectSeverity;
  daysOverdue: number;
  speedRestrictionRisk: string; // e.g. "SR 30 Kmph if not attended in 48h"
  requiredDurationMins: number;
  minDurationMins: number;
  requiresPowerDisconnection: boolean; // TRD isolation
  requiresTrafficBlock: boolean; // Train stoppage
  requiresSignalDisconnection: boolean; // S&T disconnection
  machineryRequired?: string;
  manpowerGangSize: number;
  estimatedDowntimeCost: string;
  criticalityScore: number; // 0-100 computed algorithmically
  status: 'PENDING_PLANNING' | 'OPTIMIZED' | 'SANCTIONED' | 'EXECUTED';
  preferredTimeWindow?: 'NIGHT_NON_PEAK' | 'DAY_CORRIDOR' | 'ANY';
  dateReported: string;
}

export interface TrainSlot {
  trainNumber: string;
  trainName: string;
  trainType: 'VANDE_BHARAT' | 'RAJDHANI_SHATABDI' | 'MAIL_EXPRESS' | 'SUBURBAN' | 'GOODS_CONTAINER' | 'GOODS_COAL';
  sectionId: string;
  line: TrackLine;
  scheduledArrival: string; // HH:MM
  scheduledDeparture: string; // HH:MM
  isCriticalPassenger: boolean;
  canBeRegulated: boolean;
  maxAllowableRegulationMins: number;
}

export interface CorridorAvailabilityWindow {
  id: string;
  sectionId: string;
  sectionCode: string;
  line: TrackLine;
  date: string;
  windowStart: string; // HH:MM
  windowEnd: string; // HH:MM
  availableDurationMins: number;
  trafficIntensity: 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  trainDensityScore: number;
  conflictingTrains: string[];
  isRecommendedSlot: boolean;
  recommendedFor: ('ENGG' | 'SNT' | 'TRD')[];
}

export interface ShadowDepartmentWork {
  department: Department;
  sourceSystem: SourceSystem;
  demandId: string;
  assetType: string;
  workDescription: string;
  machineryOrStaff: string;
  durationMins: number;
  speedRestrictionAvoided: string;
}

export interface OptimizedBlockSchedule {
  id: string;
  blockSanctionCode: string;
  horizon: HorizonType;
  date: string;
  startTime: string; // e.g. "01:30"
  endTime: string;   // e.g. "05:00"
  totalDurationMins: number;
  sectionId: string;
  sectionCode: string;
  sectionName: string;
  line: TrackLine;
  startKm: string;
  endKm: string;
  
  // Primary work that initiated the block
  leadDepartment: Department;
  primaryDemandId: string;
  primaryWork: string;
  primaryMachinery: string;
  
  // Multi-department Shadowing
  isJointIntegratedBlock: boolean;
  shadowDepartments: ShadowDepartmentWork[];
  
  // Operational impacts
  downtimeSavedMins: number; // Duration saved by clustering
  punctualityImpactMin: number; // Total train detention minutes
  affectedTrainsCount: number;
  trainRegulationsSummary: string;
  
  // AI / Decision Algorithm Metrics
  optimizationScore: number; // e.g. 96.4%
  synergyGainPercentage: number; // e.g. 64%
  riskMitigationIndex: 'HIGH' | 'MAXIMUM' | 'MODERATE';
  
  // Regulatory & Sanction Status
  status: BlockStatus;
  sanctionedBy?: string;
  sanctionTimestamp?: string;
  disconnectionNoticeNo?: string;
  safetyCautionOrder?: string;
  remarks: string;
}

export interface OptimizationWeights {
  defectSeverityWeight: number; // e.g. 35%
  overdueUrgencyWeight: number; // e.g. 25%
  trainTrafficMinimizationWeight: number; // e.g. 20%
  multiDeptSynergyWeight: number; // e.g. 15%
  machineUtilizationWeight: number; // e.g. 5%
}

export interface SystemKPIs {
  totalDemandsIngested: number;
  tmsCount: number;
  smmsCount: number;
  tdmsCount: number;
  integratedBlocksPlanned: number;
  averageDowntimeSavedMins: number;
  assetAvailabilityPercentage: number;
  speedRestrictionsAverted: number;
  shadowUtilizationRate: number;
  punctualityRetentionIndex: number;
}
