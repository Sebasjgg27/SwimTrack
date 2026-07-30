import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(ms: number): string {
  if (!ms || ms === 0) return "--:--.--";
  
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const centiseconds = Math.floor((ms % 1000) / 10);
  
  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
  }
  return `${seconds}.${centiseconds.toString().padStart(2, "0")}`;
}

export function parseTime(timeStr: string): number {
  const parts = timeStr.split(/[:.]/);
  let ms = 0;
  
  if (parts.length === 3) {
    const minutes = parseInt(parts[0]) || 0;
    const seconds = parseInt(parts[1]) || 0;
    const centiseconds = parseInt(parts[2]) || 0;
    ms = (minutes * 60000) + (seconds * 1000) + (centiseconds * 10);
  } else if (parts.length === 2) {
    const seconds = parseInt(parts[0]) || 0;
    const centiseconds = parseInt(parts[1]) || 0;
    ms = (seconds * 1000) + (centiseconds * 10);
  } else {
    ms = parseInt(timeStr) || 0;
  }
  
  return ms;
}

export function calculateCSS(t400ms: number, t200ms: number): number {
  if (t400ms <= t200ms) return 0;
  const diff = t400ms - t200ms;
  return diff / 2000;
}

export interface ZonePaces {
  css: number;
  a1: { min: number; max: number };
  a2: { min: number; max: number };
  a3: { min: number; max: number };
  vo2: { min: number; max: number };
  tolerance: { min: number; max: number };
  allOut: number;
}

export function calculateZones(cssSecPer100: number): ZonePaces {
  return {
    css: cssSecPer100,
    a1: { min: cssSecPer100 + 20, max: cssSecPer100 + 30 },
    a2: { min: cssSecPer100 + 10, max: cssSecPer100 + 20 },
    a3: { min: cssSecPer100 - 5, max: cssSecPer100 + 5 },
    vo2: { min: cssSecPer100 - 10, max: cssSecPer100 - 5 },
    tolerance: { min: cssSecPer100 - 15, max: cssSecPer100 - 10 },
    allOut: cssSecPer100 - 15,
  };
}

export function formatPace(secPer100: number): string {
  const minutes = Math.floor(secPer100 / 60);
  const seconds = Math.floor(secPer100 % 60);
  const centiseconds = Math.floor((secPer100 % 1) * 100);
  
  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
  }
  return `${seconds}.${centiseconds.toString().padStart(2, "0")}`;
}

export const STROKES = [
  { value: "freestyle", label: "Freestyle", short: "FR" },
  { value: "backstroke", label: "Backstroke", short: "BK" },
  { value: "breaststroke", label: "Breaststroke", short: "BR" },
  { value: "butterfly", label: "Butterfly", short: "FL" },
  { value: "individual_medley", label: "Individual Medley", short: "IM" },
  { value: "relay", label: "Relay", short: "REL" },
];

export const POOL_TYPES = [
  { value: "SCM", label: "Short Course Meters (25m)" },
  { value: "SCY", label: "Short Course Yards (25y)" },
  { value: "LCM", label: "Long Course Meters (50m)" },
];

export const DISTANCES = [50, 100, 200, 400, 800, 1500];

export const AGE_GROUPS = [
  { value: "10-11", label: "10-11" },
  { value: "12-13", label: "12-13" },
  { value: "14-15", label: "14-15" },
  { value: "16-17", label: "16-17" },
  { value: "18+", label: "18 & Over" },
  { value: "masters-25", label: "Masters 25+" },
  { value: "masters-35", label: "Masters 35+" },
  { value: "masters-45", label: "Masters 45+" },
];

export function calculateAge(dateOfBirth: string, referenceDate: Date = new Date()): number {
  const birth = new Date(dateOfBirth);
  let age = referenceDate.getFullYear() - birth.getFullYear();
  const monthDiff = referenceDate.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

export function getAgeGroup(dateOfBirth: string): string {
  const age = calculateAge(dateOfBirth);
  
  if (age < 12) return "10-11";
  if (age < 14) return "12-13";
  if (age < 16) return "14-15";
  if (age < 18) return "16-17";
  if (age < 25) return "18+";
  if (age < 35) return "masters-25";
  if (age < 45) return "masters-35";
  return "masters-45";
}

const WORLD_AQUATICS_POINTS: Record<string, Record<number, number>> = {
  "50-free": { 1000: 21.78, 900: 22.67, 800: 23.68, 700: 24.87, 600: 26.28, 500: 28.00 },
  "100-free": { 1000: 47.58, 900: 49.17, 800: 51.05, 700: 53.25, 600: 55.85, 500: 58.95 },
  "200-free": { 1000: 104.94, 900: 108.14, 800: 111.84, 700: 116.14, 600: 121.22, 500: 127.38 },
  "400-free": { 1000: 214.87, 900: 221.23, 800: 228.53, 700: 236.94, 600: 246.75, 500: 258.38 },
  "800-free": { 1000: 453.12, 900: 466.38, 800: 481.20, 700: 497.97, 600: 517.15, 500: 539.45 },
  "1500-free": { 1000: 867.97, 900: 892.56, 800: 920.38, 700: 952.16, 600: 988.65, 500: 1031.75 },
};

export function calculatePoints(timeMs: number, event: string): number {
  const eventKey = event.toLowerCase().replace(/\s+/g, "-");
  const pointsTable = WORLD_AQUATICS_POINTS[eventKey];
  
  if (!pointsTable) return 0;
  
  const timeSec = timeMs / 1000;
  const sortedTimes = Object.entries(pointsTable).sort((a, b) => a[1] - b[1]);
  
  if (timeSec <= sortedTimes[0][1]) return 1000;
  
  let lower = sortedTimes[0];
  let upper = sortedTimes[sortedTimes.length - 1];
  
  for (let i = 0; i < sortedTimes.length - 1; i++) {
    if (timeSec >= sortedTimes[i][1] && timeSec < sortedTimes[i + 1][1]) {
      lower = sortedTimes[i];
      upper = sortedTimes[i + 1];
      break;
    }
  }
  
  if (timeSec >= upper[1]) return 500;
  
  const ratio = (upper[1] - timeSec) / (upper[1] - lower[1]);
  const pointsDiff = parseInt(upper[0]) - parseInt(lower[0]);
  
  return Math.round(parseInt(lower[0]) + ratio * pointsDiff);
}

const CONVERSION_FACTORS = {
  "SCY-to-SCM": 1.11,
  "SCM-to-SCY": 0.90,
  "SCM-to-LCM": 1.02,
  "LCM-to-SCM": 0.98,
  "SCY-to-LCM": 1.13,
  "LCM-to-SCY": 0.885,
};

export function convertTime(timeMs: number, fromPool: string, toPool: string): number {
  if (fromPool === toPool) return timeMs;
  
  const key = `${fromPool}-to-${toPool}`;
  const factor = CONVERSION_FACTORS[key as keyof typeof CONVERSION_FACTORS];
  
  if (!factor) return timeMs;
  return Math.round(timeMs * factor);
}