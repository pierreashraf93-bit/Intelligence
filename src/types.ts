export type Language = 'ar' | 'en';

export type ClearanceLevel = 'LEVEL 04' | 'LEVEL 05' | 'LEVEL 06' | 'LEVEL 07' | 'EYES ONLY' | 'BLACK OPS';

export type ThreatLevel = 'LOW' | 'ELEVATED' | 'HIGH' | 'CRITICAL' | 'RESTRICTED';

export type OperationStatus = 'ACTIVE' | 'STANDBY' | 'SURVEILLANCE' | 'INTERCEPTED' | 'LOCKED' | 'ARCHIVED';

export interface ClassifiedDocument {
  id: string;
  fileNumber: string; // e.g. "FILE // 0091-A"
  operationNameAr: string; // e.g. "عملية العنكبوت الصامت"
  operationNameEn: string;
  codename: string; // e.g. "SILENT SPIDER"
  threatLevel: ThreatLevel;
  clearance: ClearanceLevel;
  status: OperationStatus;
  progress: number; // 0 - 100
  lastUpdate: string;
  date: string;
  classificationAr: string; // "سري للغاية — حظر التداول"
  classificationEn: string; // "TOP SECRET // NOFORN"
  summaryAr: string;
  summaryEn: string;
  fullBriefingAr: string;
  redactedPhrases: string[];
  personnelInvolved: {
    roleAr: string;
    codename: string;
    status: string;
  }[];
  timelineEntries: {
    time: string;
    eventAr: string;
    status: string;
  }[];
  coordinates: string;
  sector: string;
  intelligenceNotes: string[];
  riskAssessment: string;
  isDecrypted: boolean;
  checksum: string;
}

export interface InterceptedMessage {
  id: string;
  time: string;
  source: string;
  channel: string;
  messageAr: string;
  messageEn?: string;
  status: 'DECRYPTED' | 'INTERCEPTED' | 'RECORDED' | 'FLAGGED' | 'ENCRYPTED';
  priority: 'ROUTINE' | 'ELEVATED' | 'URGENT' | 'FLASH';
  frequency: string;
}

export interface RadarTarget {
  id: string;
  callsign: string;
  type: 'air_asset' | 'recon_drone' | 'naval_unit' | 'ground_convoy' | 'signal_beacon' | 'unidentified';
  distanceKm: number;
  angleDeg: number;
  speedKnots: number;
  altitudeFt: number;
  threatLevel: ThreatLevel;
  status: 'TRACKING' | 'LOCKED' | 'SUSPECT' | 'LOST';
  bearing: string;
  transponderId: string;
  sector: string;
  notesAr: string;
}

export interface TacticalGridZone {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  x: number; // percentage on map
  y: number;
  radius: number;
  status: 'MONITORED' | 'ACTIVE' | 'UNKNOWN' | 'HIGH RISK' | 'OFFLINE';
  activeUnitsCount: number;
  signalStrength: number;
  lastPing: string;
  detailsAr: string;
}

export interface TacticalGridUnit {
  id: string;
  callsign: string;
  type: 'PATROL' | 'DRONE' | 'SURVEILLANCE_VAN' | 'OPERATIVE' | 'TARGET';
  x: number;
  y: number;
  targetX?: number;
  targetY?: number;
  speed: number;
  heading: number;
  status: 'PATROLLING' | 'TRACKING' | 'STATIONARY' | 'ALERT';
  zoneId: string;
  notesAr: string;
}

export interface PersonnelOperative {
  nameAr: string;
  nameEn: string;
  codename: string;
  idNumber: string;
  unitAr: string;
  unitEn: string;
  clearance: ClearanceLevel;
  statusAr: string;
  statusEn: string;
  specialtyAr: string;
  currentAssignmentAr: string;
  lastActivity: string;
  biometrics: {
    heartRate: number;
    spo2: number;
    stressIndex: string;
    locationSector: string;
    commSignal: string;
  };
}

export interface SystemHealthItem {
  id: string;
  nameEn: string;
  nameAr: string;
  status: 'ONLINE' | 'ACTIVE' | 'STABLE' | 'SYNCED' | 'SECURED';
  latencyMs: number;
  uptime: string;
  load: number;
}

export interface TimelineLogEntry {
  id: string;
  time: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  severity: 'NORMAL' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  sector: string;
}

export interface TerminalEntry {
  id: string;
  timestamp: string;
  type: 'input' | 'output' | 'error' | 'success' | 'warning' | 'classified' | 'ascii';
  text: string;
  category?: string;
}
