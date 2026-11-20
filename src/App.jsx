import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Upload,
  Trophy,
  Users,
  Timer,
  FileText,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Download,
  Award,
  Layers,
  ClipboardCopy,
  Check,
  Database,
  TrendingUp,
  Star,
  PlusCircle,
  Trash2,
  Home,
  Calendar,
  Flag,
  FolderUp,
  SlidersHorizontal,
  ArrowRight,
  UserCheck,
  Link2,
  Building2,
  UserPlus,
  Cloud,
  CloudOff
} from 'lucide-react';

// ============================================================================
// FIREBASE INITIALIZATION (Anonymous Auth + Firestore Sync)
// ============================================================================

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9wvEBlxlufBiktja5vjaXH0rxceCuPyg",
  authDomain: "swimming-records.firebaseapp.com",
  projectId: "swimming-records",
  storageBucket: "swimming-records.firebasestorage.app",
  messagingSenderId: "645635780769",
  appId: "1:645635780769:web:f9b5bb16397b3a0ec980e0",
  measurementId: "G-TY22D1ZJWM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export { signInAnonymously, onAuthStateChanged };

// ============================================================================
// SAMPLE SDIF / CL2 DATA (Gettysburg v Carnegie Mellon - 07Nov2026)
// ============================================================================
const SAMPLE_CL2_DATA = `A01V3      01                                       HY-TEK, Ltd    MM8 8.0Gq   20261108     1104431400
B11Gettysburg v Carnegie Mellon                    Gettysburg PA                      2026110720261107     10410Y     25107105514
C11AMGC   Gettysburg College                        Gettysburg                          Gettysburg          PA17325     USA                                   UN57
C11AMCMU  Carnegie Mellon University                Carnegie Mellon                     Pittsburgh          PA15213     USA                                   UN54
D01AMGC   Berry, Ava                   5334901598438FAva            0815200719F 1F  100010536368 10:49.00Y  10:43.55Y  10:43.55Y   1  1   9.00                      12        N
G01AMGC   Berry, Ava                  101F1 10001   30.40C   1:02.93C   1:35.75C   2:08.53C   2:41.22C   3:13.86C   3:46.34C   4:18.88C   4:51.23C   5:23.41C   16
G01AMGC   Berry, Ava                  101F1 10001 5:55.58C   6:27.71C   6:59.89C   7:32.04C   8:04.22C   8:36.43C   9:08.45C   9:40.42C  10:12.28C  10:43.55C   84
D01AMCMU  Mrosko, Maria                4887022192214BMaria          0210200620F 1F  100010536368 10:45.20Y  10:46.12Y  10:46.12Y   2  1   4.00                      14        N
D01AMGC   Miller, Kathleen             5112098433124AKate           0422200818F 1F  100010536368 10:55.10Y  10:51.80Y  10:51.80Y   3  1   3.00                      16        N
D01AMGC   McKenzie, Delanie            5123409811234CLanie          0614200620F 1F   10040536368    59.80Y     58.42Y     58.42Y   1  1   9.00                      22        N
G01AMGC   McKenzie, Delanie           104F1  1004   28.15C     58.42C                                                                                                  28
D01AMCMU  Chen, Sarah                  51109283110B49Sarah          0901200719F 1F   10040536368    59.10Y     58.95Y     58.95Y   2  1   4.00                      30
D01AMCMU  Chen, Zoe                    5199018299124DZoe            1119200620F 1F   10030536368  1:07.80Y   1:07.34Y   1:07.34Y   1  1   9.00                      42
D01AMGC   Pyott, Olivia                5188234188124EOlivia         0303200521F 1F   10030536368  1:08.10Y   1:07.91Y   1:07.91Y   2  1   4.00                      44
D01AMGC   Schundler, Charles           5177341277124FJackson        0725200620M 1M   20020536368  1:54.20Y   1:52.14Y   1:52.14Y   1  1   9.00                      52
D01AMCMU  Morford, Brayden             51664523833B48Brayden        0112200521M 1M   20020536368  1:53.10Y   1:52.88Y   1:52.88Y   2  1   4.00                      54
E01AMCMU  A 4001F  40050536368  3:59.00Y   3:57.64Y   3:57.64Y   1  1  11.00                                                                                           60
F01AMCMU  AChen, Sarah                 51109283110B49Sarah          0901200719F  1             51109283110B49Sarah                                                       62
F01AMCMU  AChen, Zoe                   5199018299124DZoe            1119200620F  2             5199018299124DZoe                                                         64
F01AMCMU  AGil, Audrey                 515512340DA44FAudrey         0820200719F  3             515512340DA44FAudrey                                                      66
F01AMCMU  AZaniolo, Anna               51813519EEBF40Anna           0506200521F  4             51813519EEBF40Anna                                                        68
E01AMGC   A 4001F  40050536368  4:00.50Y   3:59.10Y   3:59.10Y   2  1   4.00                                                                                           70
F01AMGC   AMcKenzie, Delanie           5123409811234CLanie          0614200620F  1             5123409811234CLanie                                                       72
F01AMGC   APyott, Olivia               5188234188124EOlivia         0303200521F  2             5188234188124EOlivia                                                      74
F01AMGC   ABerry, Ava                  5334901598438FAva            0815200719F  3             5334901598438FAva                                                         76
F01AMGC   AMiller, Kathleen            5112098433124AKate           0422200818F  4             5112098433124AKate                                                        78
Z01                                                                                                                                                                   99`;

const SAMPLE_GOOGLE_SHEET_CSV = `Name\tClass\tEvent\tMin\tSec\tDate\tLocation\tCompetition\tPlace\tTime\tEvent\tSeconds
Ava Berry\tFr.\t1000 Free\t10\t46.20\t2026-10-24\tGettysburg PA\tGettysburg Invitational\t1\t10:46.20\tWomen 1000 Freestyle\t646.20
Kathleen Miller\tFr.\t1000 Free\t10\t52.10\t2026-10-24\tGettysburg PA\tGettysburg Invitational\t2\t10:52.10\tWomen 1000 Freestyle\t652.10
Delanie McKenzie\tJr.\t100 Back\t0\t58.15\t2026-02-20\tLancaster PA\tCentennial Conference Championships\t2\t58.15\tWomen 100 Backstroke\t58.15
Olivia Pyott\tSr.\t100 Breast\t1\t06.95\t2026-02-21\tLancaster PA\tCentennial Conference Championships\t1\t1:06.95\tWomen 100 Breaststroke\t66.95
Charles Schundler\tJr.\t200 Free\t1\t53.40\t2026-10-24\tGettysburg PA\tGettysburg Invitational\t1\t1:53.40\tMen 200 Freestyle\t113.40`;

// ============================================================================
// PARSING & NORMALIZATION UTILITIES
// ============================================================================
const STROKE_MAP = {
  '1': 'Freestyle',
  '2': 'Backstroke',
  '3': 'Breaststroke',
  '4': 'Butterfly',
  '5': 'Individual Medley',
  '6': 'Freestyle',
  '7': 'Medley',
};

const CANONICAL_EVENTS = [
  'Women 50 Freestyle',
  'Women 100 Freestyle',
  'Women 200 Freestyle',
  'Women 500 Freestyle',
  'Women 1000 Freestyle',
  'Women 1650 Freestyle',
  'Women 100 Backstroke',
  'Women 200 Backstroke',
  'Women 100 Breaststroke',
  'Women 200 Breaststroke',
  'Women 100 Butterfly',
  'Women 200 Butterfly',
  'Women 200 Individual Medley',
  'Women 400 Individual Medley',
  'Men 50 Freestyle',
  'Men 100 Freestyle',
  'Men 200 Freestyle',
  'Men 500 Freestyle',
  'Men 1000 Freestyle',
  'Men 1650 Freestyle',
  'Men 100 Backstroke',
  'Men 200 Backstroke',
  'Men 100 Breaststroke',
  'Men 200 Breaststroke',
  'Men 100 Butterfly',
  'Men 200 Butterfly',
  'Men 200 Individual Medley',
  'Men 400 Individual Medley',
];

function sliceCol(line, start1Based, end1Based) {
  return (line || '').slice(start1Based - 1, end1Based).trim();
}

function formatSdifDate(raw) {
  if (!raw || raw.length < 8) return raw || '';
  const m = raw.slice(0, 2);
  const d = raw.slice(2, 4);
  const y = raw.slice(4, 8);
  if (/^\d{8}$/.test(raw)) {
    // Detect YYYYMMDD vs MMDDYYYY
    if (raw.startsWith('20') || raw.startsWith('19')) {
      return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
    }
    return `${y}-${m}-${d}`;
  }
  return raw;
}

function parseFlexibleDate(str) {
  if (!str) return null;
  const trimmed = String(str).trim();
  const iso = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (iso) {
    return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
  }
  const us = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
  if (us) {
    const yr = us[3].length === 2 ? 2000 + Number(us[3]) : Number(us[3]);
    return new Date(yr, Number(us[1]) - 1, Number(us[2]));
  }
  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function normalizeClass(raw) {
  if (!raw) return '';
  const cleaned = String(raw).replace(/\./g, '').trim().toUpperCase();
  if (cleaned === 'FRESHMAN' || cleaned === '1' || cleaned === 'FR') return 'FR';
  if (cleaned === 'SOPHOMORE' || cleaned === '2' || cleaned === 'SO') return 'SO';
  if (cleaned === 'JUNIOR' || cleaned === '3' || cleaned === 'JR') return 'JR';
  if (cleaned === 'SENIOR' || cleaned === '4' || cleaned === 'SR') return 'SR';
  if (cleaned === 'GRAD' || cleaned === '5' || cleaned === 'GR') return 'GR';
  return cleaned;
}

function normalizeSwimmerKey(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeEventKey(rawEvent, fallbackGender = '') {
  if (!rawEvent) return '';
  let s = String(rawEvent)
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/\byards?\b|\byd\b|\bscy\b|\blcm\b|\bscm\b/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  let gender = '';
  if (/\bwomen\b|\bwomens\b|\bfemale\b|\bgirls\b|^w\s|\sw$/.test(s)) {
    gender = 'women';
  } else if (/\bmen\b|\bmens\b|\bmale\b|\bboys\b|^m\s|\sm$/.test(s)) {
    gender = 'men';
  } else if (fallbackGender) {
    gender = fallbackGender.toLowerCase().startsWith('w') ? 'women' : 'men';
  }

  const distMatch = s.match(/\b(25|50|100|200|400|500|800|1000|1500|1650)\b/);
  const distance = distMatch ? distMatch[1] : '';

  let stroke = '';
  if (/\bindividual medley\b|\bim\b|\bi m\b/.test(s)) {
    stroke = 'individual medley';
  } else if (/\bfree\b|\bfreestyle\b|\bfr\b/.test(s)) {
    stroke = 'freestyle';
  } else if (/\bback\b|\bbackstroke\b|\bbk\b/.test(s)) {
    stroke = 'backstroke';
  } else if (/\bbreast\b|\bbreaststroke\b|\bbr\b/.test(s)) {
    stroke = 'breaststroke';
  } else if (/\bfly\b|\bbutterfly\b|\bfl\b/.test(s)) {
    stroke = 'butterfly';
  } else if (/\bmedley\b/.test(s)) {
    stroke = 'medley';
  }

  const isRelay = /\brelay\b/.test(s);
  if (!distance || !stroke) return s;
  return `${gender ? gender + ' ' : ''}${distance} ${stroke}${isRelay ? ' relay' : ''}`.trim();
}

function toTitleEventLabel(eventKey) {
  return String(eventKey || '')
    .split(' ')
    .map((w) => (w === 'im' ? 'IM' : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ');
}

function timeToSeconds(timeStr) {
  if (!timeStr) return null;
  const clean = String(timeStr).replace(/[A-Z]+$/i, '').trim();
  if (!clean || clean === 'NT' || clean === 'DQ' || clean === 'SCR' || clean === 'NS') return null;
  const parts = clean.split(':');
  if (parts.length === 1) {
    const val = parseFloat(parts[0]);
    return Number.isNaN(val) ? null : val;
  }
  if (parts.length === 2) {
    const mins = parseInt(parts[0], 10);
    const secs = parseFloat(parts[1]);
    if (Number.isNaN(mins) || Number.isNaN(secs)) return null;
    return mins * 60 + secs;
  }
  if (parts.length === 3) {
    const hrs = parseInt(parts[0], 10);
    const mins = parseInt(parts[1], 10);
    const secs = parseFloat(parts[2]);
    if (Number.isNaN(hrs) || Number.isNaN(mins) || Number.isNaN(secs)) return null;
    return hrs * 3600 + mins * 60 + secs;
  }
  return null;
}

function secondsToTime(sec) {
  if (sec === null || sec === undefined || Number.isNaN(sec)) return '';
  const mins = Math.floor(sec / 60);
  const rem = (sec - mins * 60).toFixed(2).padStart(5, '0');
  return mins > 0 ? `${mins}:${rem}` : parseFloat(rem).toFixed(2);
}

function formatSwimmerDisplayName(rawName, prefFirst) {
  if (!rawName) return 'Unknown Swimmer';
  const cleanPref = (prefFirst || '').replace(/[^a-zA-Z\s'-]/g, '').trim();
  if (rawName.includes(',')) {
    const [last, rest] = rawName.split(',').map((s) => s.trim());
    const first = cleanPref || (rest ? rest.split(/\s+/)[0] : '');
    return `${first} ${last}`.trim();
  }
  return rawName.trim();
}

function getCurrentSeasonStart() {
  const now = new Date();
  const yr = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1;
  return new Date(yr, 7, 1); // Aug 1
}

// ============================================================================
// SDIF / CL2 FILE PARSER
// ============================================================================
function parseSdifCl2(rawText) {
  const lines = rawText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const meet = {
    name: 'Swim Meet',
    location: '',
    startDate: '',
    endDate: '',
    course: 'SCY',
  };
  const teams = {};
  const eventsMap = {};
  let lastIndividualEntry = null;
  let lastRelayEntry = null;

  const ensureEvent = (genderCode, distance, strokeCode, isRelay) => {
    const gender = genderCode === 'F' ? 'Women' : genderCode === 'M' ? 'Men' : 'Mixed';
    const stroke = STROKE_MAP[strokeCode] || 'Freestyle';
    const key = `${gender}-${distance}-${stroke}-${isRelay ? 'R' : 'I'}`;
    if (!eventsMap[key]) {
      eventsMap[key] = {
        key,
        gender,
        distance: parseInt(distance, 10) || 0,
        stroke,
        type: isRelay ? 'Relay' : 'Individual',
        eventLabel: `${gender} ${distance} ${stroke}${isRelay ? ' Relay' : ''}`,
        entries: [],
      };
    }
    return eventsMap[key];
  };

  lines.forEach((line) => {
    const rec = line.slice(0, 2);

    if (rec === 'B1') {
      meet.name = sliceCol(line, 12, 41) || 'Swim Meet';
      meet.location = sliceCol(line, 42, 71) || '';
      meet.startDate = formatSdifDate(sliceCol(line, 72, 79));
      meet.endDate = formatSdifDate(sliceCol(line, 80, 87));
      const courseCode = sliceCol(line, 98, 98);
      meet.course = courseCode === 'L' ? 'LCM' : courseCode === 'S' ? 'SCM' : 'SCY';
    } else if (rec === 'C1') {
      const code = sliceCol(line, 4, 9);
      const fullName = sliceCol(line, 12, 41) || code;
      const shortName = sliceCol(line, 42, 57) || fullName;
      if (code) {
        teams[code] = {
          code,
          name: fullName,
          shortName,
          points: 0,
        };
      }
    } else if (rec === 'D0') {
      const teamCode = sliceCol(line, 4, 9);
      const rawName = sliceCol(line, 12, 39);
      const prefFirst = sliceCol(line, 56, 70);
      const genderCode = sliceCol(line, 79, 79);
      const classYear = sliceCol(line, 82, 83);
      const distance = sliceCol(line, 84, 87);
      const strokeCode = sliceCol(line, 88, 88);
      const seedTime = sliceCol(line, 96, 103);
      const finalsTime = sliceCol(line, 116, 123) || sliceCol(line, 106, 113);
      const placeStr = sliceCol(line, 126, 128);
      const pointsStr = sliceCol(line, 132, 137);
      const points = parseFloat(pointsStr) || 0;

      const swimmerName = formatSwimmerDisplayName(rawName, prefFirst);
      const ev = ensureEvent(genderCode, distance, strokeCode, false);
      const entry = {
        id: `ind-${ev.key}-${ev.entries.length}`,
        teamCode,
        teamName: teams[teamCode]?.name || teamCode,
        swimmerName,
        classYear: normalizeClass(classYear),
        seedTime: seedTime.replace(/[YLS]$/i, ''),
        finalsTime: finalsTime.replace(/[YLS]$/i, ''),
        place: placeStr ? String(parseInt(placeStr, 10) || placeStr) : '',
        points,
        splits: [],
      };
      ev.entries.push(entry);
      lastIndividualEntry = entry;
      if (teams[teamCode]) teams[teamCode].points += points;
    } else if (rec === 'D3') {
      // Optional D3 swimmer info line
      if (lastIndividualEntry) {
        const prefFirst = sliceCol(line, 17, 31);
        if (prefFirst) {
          const parts = lastIndividualEntry.swimmerName.split(' ');
          if (parts.length >= 2) {
            lastIndividualEntry.swimmerName = `${prefFirst} ${parts.slice(1).join(' ')}`;
          }
        }
      }
    } else if (rec === 'G0') {
      if (lastIndividualEntry) {
        const splitChunks = line.slice(44, 155);
        for (let i = 0; i + 10 <= splitChunks.length; i += 11) {
          const chunk = splitChunks.slice(i, i + 11).trim();
          const timeMatch = chunk.match(/(\d*:?\d+\.\d{2})/);
          if (timeMatch) {
            const cumStr = timeMatch[1];
            const cumSec = timeToSeconds(cumStr);
            const prevSec =
              lastIndividualEntry.splits.length > 0
                ? timeToSeconds(
                    lastIndividualEntry.splits[lastIndividualEntry.splits.length - 1].cumulative
                  )
                : 0;
            const lapSec = cumSec !== null && prevSec !== null ? cumSec - prevSec : null;
            lastIndividualEntry.splits.push({
              splitNumber: lastIndividualEntry.splits.length + 1,
              cumulative: cumStr,
              lap: lapSec !== null ? secondsToTime(lapSec) : '',
            });
          }
        }
      }
    } else if (rec === 'E0') {
      const teamCode = sliceCol(line, 4, 9);
      const relayLetter = sliceCol(line, 12, 12) || 'A';
      const genderCode = sliceCol(line, 17, 17);
      const distance = sliceCol(line, 18, 21);
      const strokeCode = sliceCol(line, 22, 22);
      const seedTime = sliceCol(line, 30, 37);
      const finalsTime = sliceCol(line, 50, 57) || sliceCol(line, 40, 47);
      const placeStr = sliceCol(line, 60, 62);
      const pointsStr = sliceCol(line, 66, 71);
      const points = parseFloat(pointsStr) || 0;

      const ev = ensureEvent(genderCode, distance, strokeCode, true);
      const entry = {
        id: `rel-${ev.key}-${ev.entries.length}`,
        teamCode,
        teamName: teams[teamCode]?.name || teamCode,
        relayLetter,
        seedTime: seedTime.replace(/[YLS]$/i, ''),
        finalsTime: finalsTime.replace(/[YLS]$/i, ''),
        place: placeStr ? String(parseInt(placeStr, 10) || placeStr) : '',
        points,
        legs: [],
      };
      ev.entries.push(entry);
      lastRelayEntry = entry;
      if (teams[teamCode]) teams[teamCode].points += points;
    } else if (rec === 'F0') {
      if (lastRelayEntry) {
        const rawName = sliceCol(line, 14, 41);
        const prefFirst = sliceCol(line, 107, 122);
        const legNum = parseInt(sliceCol(line, 76, 77), 10) || lastRelayEntry.legs.length + 1;
        const splitTime = sliceCol(line, 80, 87).replace(/[YLS]$/i, '');
        const swimmerName = formatSwimmerDisplayName(rawName, prefFirst);
        lastRelayEntry.legs.push({
          leg: legNum,
          name: swimmerName,
          split: splitTime,
          classYear: '',
        });
      }
    }
  });

  // Sort entries within each event by place / time
  const events = Object.values(eventsMap).map((ev) => {
    ev.entries.sort((a, b) => {
      const pa = parseInt(a.place, 10);
      const pb = parseInt(b.place, 10);
      if (!Number.isNaN(pa) && !Number.isNaN(pb)) return pa - pb;
      if (!Number.isNaN(pa)) return -1;
      if (!Number.isNaN(pb)) return 1;
      const sa = timeToSeconds(a.finalsTime) ?? 999999;
      const sb = timeToSeconds(b.finalsTime) ?? 999999;
      return sa - sb;
    });
    return ev;
  });

  return { meet, teams, events };
}

// ============================================================================
// GOOGLE SHEET 12-COLUMN HISTORY PARSER
// Columns: Name | Class | Event | Min | Sec | Date | Location | Competition | Place | Time | Event | Seconds
// ============================================================================
function parseGoogleSheetHistory(rawText, genderLookupMap = {}) {
  const lines = String(rawText || '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return [];

  const delimiter = lines[0].includes('\t') ? '\t' : ',';
  const rows = [];

  lines.forEach((line, idx) => {
    const cols = line.split(delimiter).map((c) => c.trim().replace(/^"|"$/g, ''));
    if (idx === 0 && (cols[0] || '').toLowerCase() === 'name') {
      return; // Skip header row
    }
    const swimmerName = cols[0] || '';
    if (!swimmerName) return;

    const swimmerKey = normalizeSwimmerKey(swimmerName);
    const classYear = normalizeClass(cols[1] || '');
    const shortEvent = cols[2] || '';
    const minVal = parseFloat(cols[3]);
    const secVal = parseFloat(cols[4]);
    const dateStr = cols[5] || '';
    const location = cols[6] || '';
    const competition = cols[7] || '';
    const placeRaw = (cols[8] || '').trim().toUpperCase();
    const timeCol = cols[9] || '';
    const longEvent = cols[10] || shortEvent;
    const totalSecondsCol = parseFloat(cols[11]);

    let seconds = !Number.isNaN(totalSecondsCol) ? totalSecondsCol : timeToSeconds(timeCol);
    if ((seconds === null || Number.isNaN(seconds)) && !Number.isNaN(secVal)) {
      seconds = (!Number.isNaN(minVal) ? minVal * 60 : 0) + secVal;
    }
    if (seconds === null || Number.isNaN(seconds) || seconds <= 0) return;

    const fallbackGender = genderLookupMap[swimmerKey] || '';
    const eventKey = normalizeEventKey(longEvent || shortEvent, fallbackGender);
    if (!eventKey) return;

    const isOfficial = placeRaw !== 'R' && placeRaw !== 'S';

    rows.push({
      id: `hist-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
      swimmerName,
      swimmerKey,
      classYear,
      eventKey,
      eventLabel: toTitleEventLabel(eventKey),
      time: timeCol || secondsToTime(seconds),
      seconds,
      date: dateStr,
      dateObj: parseFlexibleDate(dateStr),
      location,
      competition,
      place: placeRaw,
      isOfficial,
      source: 'sheet_import',
    });
  });

  return rows;
}

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================
export default function App() {
  // Primary Navigation ('home' | 'history' | 'records' | 'inmeet' | 'import' | 'postmeet')
  const [activeSection, setActiveSection] = useState('home');
  const [historySubTab, setHistorySubTab] = useState('import'); // 'import' | 'roster' | 'competitions' | 'database'

  // Active Meet State
  const [parsedData, setParsedData] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(() => {
    try {
      return localStorage.getItem('swimmeet_primary_team_v1') || 'AMGC';
    } catch {
      return 'AMGC';
    }
  });
  const [genderFilter, setGenderFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSplits, setExpandedSplits] = useState({});
  const [copiedRecap, setCopiedRecap] = useState(false);
  const [includeSplitsOnCommit, setIncludeSplitsOnCommit] = useState(false);

  // Historical Database, Master Roster, & Master Competitions State
  const [historicalRecords, setHistoricalRecords] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('swimmeet_historical_records_v1') || '[]');
      return saved.map((r) => ({ ...r, dateObj: parseFlexibleDate(r.date) }));
    } catch {
      return [];
    }
  });

  const [masterRoster, setMasterRoster] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('swimmeet_master_roster_v1') || '[]');
    } catch {
      return [];
    }
  });

  const [masterCompetitions, setMasterCompetitions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('swimmeet_master_competitions_v1') || '[]');
    } catch {
      return [];
    }
  });

  // Staging & Importer State
  const [pasteSheetText, setPasteSheetText] = useState('');
  const [stagedHistoryRows, setStagedHistoryRows] = useState([]);
  const [benchmarkStatusMsg, setBenchmarkStatusMsg] = useState('');

  // Master List Forms & Bulk Text State
  const [newAthleteName, setNewAthleteName] = useState('');
  const [newAthleteGender, setNewAthleteGender] = useState('Women');
  const [newAthleteActive, setNewAthleteActive] = useState(true);
  const [bulkRosterText, setBulkRosterText] = useState('');
  const [newCompName, setNewCompName] = useState('');
  const [newCompLocation, setNewCompLocation] = useState('');
  const [bulkCompText, setBulkCompText] = useState('');
  const [reconcileSelections, setReconcileSelections] = useState({});

  // Record Book Viewer State
  const [recordBookGender, setRecordBookGender] = useState('Women');
  const [recordBookEventKey, setRecordBookEventKey] = useState('women 1000 freestyle');

  // Anonymous Firebase Auth & Live Cloud Sync State
  const [cloudUser, setCloudUser] = useState(null);
  const [cloudSyncStatus, setCloudSyncStatus] = useState('connecting');

  const fileInputRef = useRef(null);
  const historyCsvInputRef = useRef(null);

  // 1. Silent Anonymous Authentication on Mount
  useEffect(() => {
    let isMounted = true;
    signInAnonymously(auth).catch(() => {
      if (isMounted) setCloudSyncStatus('offline');
    });

    const unsubAuth = onAuthStateChanged(auth, (u) => {
      if (!isMounted) return;
      setCloudUser(u);
      if (u) setCloudSyncStatus('synced');
    });

    return () => {
      isMounted = false;
      unsubAuth();
    };
  }, []);

  // 2. Real-time Firestore Listeners once Anonymous Auth is active
  useEffect(() => {
    if (!cloudUser) return;

    const unsubPerfs = onSnapshot(
      collection(db, 'performances'),
      (snap) => {
        if (!snap.empty) {
          const rows = snap.docs.map((d) => {
            const data = d.data();
            return {
              ...data,
              id: d.id,
              dateObj: parseFlexibleDate(data.date),
            };
          });
          setHistoricalRecords(rows);
          try {
            localStorage.setItem('swimmeet_historical_records_v1', JSON.stringify(rows));
          } catch {}
        }
        setCloudSyncStatus('synced');
      },
      () => {
        setCloudSyncStatus('offline');
      }
    );

    const unsubRoster = onSnapshot(
      collection(db, 'master_roster'),
      (snap) => {
        if (!snap.empty) {
          const rows = snap.docs.map((d) => ({ ...d.data(), id: d.id }));
          setMasterRoster(rows);
          try {
            localStorage.setItem('swimmeet_master_roster_v1', JSON.stringify(rows));
          } catch {}
        }
      },
      () => {}
    );

    const unsubComps = onSnapshot(
      collection(db, 'master_competitions'),
      (snap) => {
        if (!snap.empty) {
          const rows = snap.docs.map((d) => ({ ...d.data(), id: d.id }));
          setMasterCompetitions(rows);
          try {
            localStorage.setItem('swimmeet_master_competitions_v1', JSON.stringify(rows));
          } catch {}
        }
      },
      () => {}
    );

    return () => {
      unsubPerfs();
      unsubRoster();
      unsubComps();
    };
  }, [cloudUser]);

  // Helper to batch-sync an array of documents to Firestore
  const syncCollectionToCloud = async (colName, items, replaceAll = false) => {
    if (!cloudUser) return;
    try {
      if (replaceAll) {
        const existingSnap = await getDocs(collection(db, colName));
        const delDocs = existingSnap.docs;
        for (let i = 0; i < delDocs.length; i += 450) {
          const batch = writeBatch(db);
          delDocs.slice(i, i + 450).forEach((d) => batch.delete(d.ref));
          await batch.commit();
        }
      }
      for (let i = 0; i < items.length; i += 450) {
        const batch = writeBatch(db);
        items.slice(i, i + 450).forEach((item) => {
          const clean = { ...item };
          delete clean.dateObj;
          const safeId = String(clean.id || `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`).replace(
            /\//g,
            '_'
          );
          batch.set(doc(db, colName, safeId), clean);
        });
        await batch.commit();
      }
      setCloudSyncStatus('synced');
    } catch {
      setCloudSyncStatus('offline');
    }
  };

  // Master List Lookups & Helpers
  const resolveMasterAthlete = (rawName) => {
    const key = normalizeSwimmerKey(rawName);
    if (!key) return null;
    return (
      masterRoster.find(
        (ath) =>
          normalizeSwimmerKey(ath.canonicalName) === key ||
          (ath.aliases || []).some((al) => normalizeSwimmerKey(al) === key)
      ) || null
    );
  };

  const resolveMasterCompetition = (rawComp) => {
    const key = String(rawComp || '').trim().toLowerCase();
    if (!key) return null;
    return (
      masterCompetitions.find(
        (c) =>
          c.canonicalName.trim().toLowerCase() === key ||
          (c.aliases || []).some((al) => al.trim().toLowerCase() === key)
      ) || null
    );
  };

  const updateMasterRoster = (next, changedItems = null, deletedId = null) => {
    setMasterRoster(next);
    try {
      localStorage.setItem('swimmeet_master_roster_v1', JSON.stringify(next));
    } catch {}
    if (cloudUser) {
      if (deletedId) {
        deleteDoc(doc(db, 'master_roster', deletedId)).catch(() => {});
      } else if (changedItems && changedItems.length > 0) {
        syncCollectionToCloud('master_roster', changedItems, false);
      } else {
        syncCollectionToCloud('master_roster', next, false);
      }
    }
  };

  const updateMasterCompetitions = (next, changedItems = null, deletedId = null) => {
    setMasterCompetitions(next);
    try {
      localStorage.setItem('swimmeet_master_competitions_v1', JSON.stringify(next));
    } catch {}
    if (cloudUser) {
      if (deletedId) {
        deleteDoc(doc(db, 'master_competitions', deletedId)).catch(() => {});
      } else if (changedItems && changedItems.length > 0) {
        syncCollectionToCloud('master_competitions', changedItems, false);
      } else {
        syncCollectionToCloud('master_competitions', next, false);
      }
    }
  };

  // Bulk Roster Importer: accepts pasted lines or TSV/CSV ("Name, Gender, Active, Aliases")
  const handleBulkImportRoster = () => {
    const lines = bulkRosterText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) return;

    const delimiter = lines[0].includes('\t') ? '\t' : ',';
    const nextRoster = [...masterRoster];
    const addedOrUpdated = [];
    let addedCount = 0;
    let updatedCount = 0;

    lines.forEach((line, idx) => {
      const cols = line.split(delimiter).map((c) => c.trim().replace(/^"|"$/g, ''));
      const firstColLower = (cols[0] || '').toLowerCase();
      if (idx === 0 && (firstColLower === 'name' || firstColLower === 'athlete' || firstColLower === 'swimmer')) {
        return;
      }

      const rawName = cols[0] || '';
      if (!rawName) return;

      const formattedName = rawName.includes(',')
        ? rawName
            .split(',')
            .reverse()
            .map((p) => p.trim())
            .join(' ')
        : rawName;

      const genderRaw = (cols[1] || '').toLowerCase();
      const gender = genderRaw.startsWith('m') || genderRaw === 'boys' ? 'Men' : 'Women';

      const activeRaw = (cols[2] || '').toLowerCase();
      const isActive =
        activeRaw === ''
          ? true
          : !['no', 'false', '0', 'alumni', 'inactive', 'n'].includes(activeRaw);

      const extraAliases = cols
        .slice(3)
        .flatMap((c) => c.split(/[;|]/))
        .map((a) => a.trim())
        .filter(Boolean);

      const existingIdx = nextRoster.findIndex(
        (ath) =>
          normalizeSwimmerKey(ath.canonicalName) === normalizeSwimmerKey(formattedName) ||
          (ath.aliases || []).some(
            (al) => normalizeSwimmerKey(al) === normalizeSwimmerKey(formattedName)
          )
      );

      if (existingIdx >= 0) {
        const existing = nextRoster[existingIdx];
        const mergedAliases = Array.from(
          new Set([
            ...(existing.aliases || []),
            ...(formattedName !== existing.canonicalName ? [formattedName] : []),
            ...extraAliases,
          ])
        );
        const updatedItem = {
          ...existing,
          isActive,
          aliases: mergedAliases,
        };
        nextRoster[existingIdx] = updatedItem;
        addedOrUpdated.push(updatedItem);
        updatedCount++;
      } else {
        const createdItem = {
          id: `ath-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 5)}`,
          canonicalName: formattedName,
          gender,
          isActive,
          aliases: extraAliases,
        };
        nextRoster.push(createdItem);
        addedOrUpdated.push(createdItem);
        addedCount++;
      }
    });

    updateMasterRoster(nextRoster, addedOrUpdated);
    setBulkRosterText('');
    setBenchmarkStatusMsg(
      `Mass Roster Import complete: ${addedCount} added, ${updatedCount} updated (${nextRoster.length} total athletes).`
    );
  };

  // Bulk Competitions Importer: accepts pasted lines or TSV/CSV ("Competition Name, Location, Aliases")
  const handleBulkImportCompetitions = () => {
    const lines = bulkCompText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) return;

    const delimiter = lines[0].includes('\t') ? '\t' : ',';
    const nextComps = [...masterCompetitions];
    const addedOrUpdated = [];
    let addedCount = 0;
    let updatedCount = 0;

    lines.forEach((line, idx) => {
      const cols = line.split(delimiter).map((c) => c.trim().replace(/^"|"$/g, ''));
      const firstColLower = (cols[0] || '').toLowerCase();
      if (
        idx === 0 &&
        (firstColLower === 'competition' || firstColLower === 'meet' || firstColLower === 'name')
      ) {
        return;
      }

      const rawComp = cols[0] || '';
      if (!rawComp) return;
      const defaultLocation = cols[1] || '';
      const extraAliases = cols
        .slice(2)
        .flatMap((c) => c.split(/[;|]/))
        .map((a) => a.trim())
        .filter(Boolean);

      const existingIdx = nextComps.findIndex(
        (c) =>
          c.canonicalName.trim().toLowerCase() === rawComp.toLowerCase() ||
          (c.aliases || []).some((al) => al.trim().toLowerCase() === rawComp.toLowerCase())
      );

      if (existingIdx >= 0) {
        const existing = nextComps[existingIdx];
        const mergedAliases = Array.from(
          new Set([
            ...(existing.aliases || []),
            ...(rawComp !== existing.canonicalName ? [rawComp] : []),
            ...extraAliases,
          ])
        );
        const updatedItem = {
          ...existing,
          defaultLocation: defaultLocation || existing.defaultLocation,
          aliases: mergedAliases,
        };
        nextComps[existingIdx] = updatedItem;
        addedOrUpdated.push(updatedItem);
        updatedCount++;
      } else {
        const createdItem = {
          id: `comp-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 5)}`,
          canonicalName: rawComp,
          defaultLocation,
          aliases: extraAliases,
        };
        nextComps.push(createdItem);
        addedOrUpdated.push(createdItem);
        addedCount++;
      }
    });

    updateMasterCompetitions(nextComps, addedOrUpdated);
    setBulkCompText('');
    setBenchmarkStatusMsg(
      `Mass Competitions Import complete: ${addedCount} added, ${updatedCount} updated (${nextComps.length} total meets).`
    );
  };

  // Sync missing Master Roster & Competitions from existing database rows
  const handleSyncMasterListsFromDatabase = () => {
    const nextRoster = [...masterRoster];
    const nextComps = [...masterCompetitions];
    const newAthletes = [];
    const newComps = [];

    historicalRecords.forEach((r) => {
      if (r.swimmerName && !resolveMasterAthlete(r.swimmerName)) {
        const alreadyAdded = newAthletes.some(
          (a) => normalizeSwimmerKey(a.canonicalName) === normalizeSwimmerKey(r.swimmerName)
        );
        if (!alreadyAdded) {
          const gender = r.eventKey.startsWith('men') ? 'Men' : 'Women';
          const created = {
            id: `ath-${Date.now()}-${nextRoster.length + newAthletes.length}`,
            canonicalName: r.swimmerName,
            gender,
            isActive: true,
            aliases: [],
          };
          nextRoster.push(created);
          newAthletes.push(created);
        }
      }
      if (r.competition && !resolveMasterCompetition(r.competition)) {
        const alreadyAdded = newComps.some(
          (c) => c.canonicalName.toLowerCase() === r.competition.trim().toLowerCase()
        );
        if (!alreadyAdded) {
          const created = {
            id: `comp-${Date.now()}-${nextComps.length + newComps.length}`,
            canonicalName: r.competition.trim(),
            defaultLocation: r.location || '',
            aliases: [],
          };
          nextComps.push(created);
          newComps.push(created);
        }
      }
    });

    updateMasterRoster(nextRoster, newAthletes);
    updateMasterCompetitions(nextComps, newComps);
    setBenchmarkStatusMsg(
      `Synced Master Lists: +${newAthletes.length} athletes, +${newComps.length} competitions.`
    );
  };

  // Save historical benchmarks helper
  const updateHistoricalRecords = (records, newlyAddedItems = null, replaceAll = false) => {
    setHistoricalRecords(records);
    try {
      localStorage.setItem('swimmeet_historical_records_v1', JSON.stringify(records));
    } catch {}
    if (cloudUser) {
      if (replaceAll) {
        syncCollectionToCloud('performances', records, true);
      } else if (newlyAddedItems && newlyAddedItems.length > 0) {
        syncCollectionToCloud('performances', newlyAddedItems, false);
      } else {
        syncCollectionToCloud('performances', records, false);
      }
    }
  };

  // Gender lookup map built from Master Roster + Active Meet
  const swimmerGenderLookup = useMemo(() => {
    const map = {};
    masterRoster.forEach((ath) => {
      map[normalizeSwimmerKey(ath.canonicalName)] = ath.gender;
      (ath.aliases || []).forEach((al) => {
        map[normalizeSwimmerKey(al)] = ath.gender;
      });
    });
    if (parsedData) {
      parsedData.events.forEach((ev) => {
        ev.entries.forEach((entry) => {
          if (ev.type === 'Individual') {
            map[normalizeSwimmerKey(entry.swimmerName)] = ev.gender;
          } else {
            (entry.legs || []).forEach((leg) => {
              map[normalizeSwimmerKey(leg.name)] = ev.gender;
            });
          }
        });
      });
    }
    return map;
  }, [masterRoster, parsedData]);

  // Stage Google Sheet rows for inspection & reconciliation before committing
  const handleStageHistoryText = (rawText) => {
    const parsed = parseGoogleSheetHistory(rawText, swimmerGenderLookup);
    if (parsed.length === 0) {
      setBenchmarkStatusMsg(
        'No valid rows found. Ensure columns follow: Name, Class, Event, Min, Sec, Date, Location, Competition, Place, Time, Event, Seconds.'
      );
      return;
    }

    const existingHashes = new Set(
      historicalRecords.map(
        (r) =>
          `${r.swimmerKey}|${r.eventKey}|${r.seconds.toFixed(2)}|${r.date}|${r.place}`
      )
    );

    const staged = parsed.map((row) => {
      const matchedAth = resolveMasterAthlete(row.swimmerName);
      const matchedComp = resolveMasterCompetition(row.competition);
      const resolvedName = matchedAth ? matchedAth.canonicalName : row.swimmerName;
      const resolvedComp = matchedComp ? matchedComp.canonicalName : row.competition;
      const hash = `${normalizeSwimmerKey(resolvedName)}|${row.eventKey}|${row.seconds.toFixed(2)}|${row.date}|${row.place}`;
      const isDuplicate = existingHashes.has(hash);
      return {
        ...row,
        swimmerName: resolvedName,
        swimmerKey: normalizeSwimmerKey(resolvedName),
        competition: resolvedComp,
        location: row.location || matchedComp?.defaultLocation || '',
        isDuplicate,
        selected: !isDuplicate,
      };
    });

    setStagedHistoryRows(staged);
    setReconcileSelections({});
    const dupCount = staged.filter((r) => r.isDuplicate).length;
    setBenchmarkStatusMsg(
      `Staged ${staged.length} rows (${staged.length - dupCount} new, ${dupCount} already in database). Review or reconcile below before committing.`
    );
  };

  // Unmatched athletes and competitions in current staging table
  const stagingUnmatched = useMemo(() => {
    const athletes = new Map();
    const competitions = new Map();
    stagedHistoryRows.forEach((row) => {
      if (!resolveMasterAthlete(row.swimmerName)) {
        const key = normalizeSwimmerKey(row.swimmerName);
        if (!athletes.has(key)) {
          athletes.set(key, {
            rawName: row.swimmerName,
            inferredGender: row.eventKey.startsWith('men') ? 'Men' : 'Women',
            count: 1,
          });
        } else {
          athletes.get(key).count += 1;
        }
      }
      if (row.competition && !resolveMasterCompetition(row.competition)) {
        const cKey = row.competition.trim().toLowerCase();
        if (!competitions.has(cKey)) {
          competitions.set(cKey, {
            rawName: row.competition.trim(),
            sampleLocation: row.location || '',
            count: 1,
          });
        } else {
          competitions.get(cKey).count += 1;
        }
      }
    });
    return {
      athletes: Array.from(athletes.values()),
      competitions: Array.from(competitions.values()),
    };
  }, [stagedHistoryRows, masterRoster, masterCompetitions]);

  // Apply all pending athlete & competition reconciliations
  const handleApplyReconciliations = () => {
    let nextRoster = [...masterRoster];
    let nextComps = [...masterCompetitions];
    const changedRoster = [];
    const changedComps = [];

    stagingUnmatched.athletes.forEach((item) => {
      const selKey = `ath:${normalizeSwimmerKey(item.rawName)}`;
      const choice = reconcileSelections[selKey] || '__NEW__';
      if (choice === '__NEW__') {
        const created = {
          id: `ath-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          canonicalName: item.rawName,
          gender: item.inferredGender,
          isActive: true,
          aliases: [],
        };
        nextRoster.push(created);
        changedRoster.push(created);
      } else {
        nextRoster = nextRoster.map((ath) => {
          if (ath.id !== choice) return ath;
          const updated = {
            ...ath,
            aliases: Array.from(new Set([...(ath.aliases || []), item.rawName])),
          };
          changedRoster.push(updated);
          return updated;
        });
      }
    });

    stagingUnmatched.competitions.forEach((item) => {
      const selKey = `comp:${item.rawName.toLowerCase()}`;
      const choice = reconcileSelections[selKey] || '__NEW__';
      if (choice === '__NEW__') {
        const created = {
          id: `comp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          canonicalName: item.rawName,
          defaultLocation: item.sampleLocation,
          aliases: [],
        };
        nextComps.push(created);
        changedComps.push(created);
      } else {
        nextComps = nextComps.map((c) => {
          if (c.id !== choice) return c;
          const updated = {
            ...c,
            aliases: Array.from(new Set([...(c.aliases || []), item.rawName])),
          };
          changedComps.push(updated);
          return updated;
        });
      }
    });

    updateMasterRoster(nextRoster, changedRoster);
    updateMasterCompetitions(nextComps, changedComps);

    // Re-resolve staged rows using updated Master Lists
    const updatedStaged = stagedHistoryRows.map((row) => {
      const key = normalizeSwimmerKey(row.swimmerName);
      const ath = nextRoster.find(
        (a) =>
          normalizeSwimmerKey(a.canonicalName) === key ||
          (a.aliases || []).some((al) => normalizeSwimmerKey(al) === key)
      );
      const cKey = row.competition.trim().toLowerCase();
      const comp = nextComps.find(
        (c) =>
          c.canonicalName.trim().toLowerCase() === cKey ||
          (c.aliases || []).some((al) => al.trim().toLowerCase() === cKey)
      );
      return {
        ...row,
        swimmerName: ath ? ath.canonicalName : row.swimmerName,
        swimmerKey: ath ? normalizeSwimmerKey(ath.canonicalName) : row.swimmerKey,
        competition: comp ? comp.canonicalName : row.competition,
        location: row.location || comp?.defaultLocation || '',
      };
    });

    setStagedHistoryRows(updatedStaged);
    setReconcileSelections({});
    setBenchmarkStatusMsg('Reconciled unmatched athletes and competitions into Master Lists.');
  };

  // Commit staged rows into database
  const handleCommitStagedRows = (mode = 'append') => {
    const chosen = stagedHistoryRows
      .filter((r) => r.selected)
      .map(({ isDuplicate, selected, ...cleanRow }) => cleanRow);

    if (chosen.length === 0) {
      setBenchmarkStatusMsg('No rows selected in staging table to commit.');
      return;
    }

    const next = mode === 'replace' ? chosen : [...historicalRecords, ...chosen];
    updateHistoricalRecords(next, chosen, mode === 'replace');
    setBenchmarkStatusMsg(
      `Committed ${chosen.length} verified performances (${next.length} total in database).`
    );
    setStagedHistoryRows([]);
    setPasteSheetText('');
  };

  // Commit current loaded meet performances to database
  const handleCommitCurrentMeet = () => {
    if (!parsedData) return;

    if (!selectedTeam || selectedTeam === 'ALL') {
      setBenchmarkStatusMsg(
        'Select a specific Primary Program Focus (e.g., Gettysburg College) before committing a meet so opponent times are not imported.'
      );
      return;
    }

    const targetCode = selectedTeam;
    const targetName = parsedData.teams[targetCode]?.name || targetCode;
    const meetComp = parsedData.meet.name || 'Imported Meet';
    const meetLoc = parsedData.meet.location || '';
    const meetDate = parsedData.meet.startDate || '';

    const existingHashes = new Set(
      historicalRecords.map(
        (r) =>
          `${r.swimmerKey}|${r.eventKey}|${r.seconds.toFixed(2)}|${r.date}|${r.place}`
      )
    );

    const newEntries = [];

    parsedData.events.forEach((ev) => {
      const evKey = normalizeEventKey(ev.eventLabel);
      if (!evKey) return;

      if (ev.type === 'Individual') {
        ev.entries.forEach((entry) => {
          if (entry.teamCode !== targetCode) return;
          if (!entry.finalsTime || entry.finalsTime === 'NT' || entry.finalsTime === 'DQ' || entry.finalsTime === 'SCR') return;
          const sec = timeToSeconds(entry.finalsTime);
          if (sec === null) return;

          const resolvedAth = resolveMasterAthlete(entry.swimmerName);
          const resolvedComp = resolveMasterCompetition(meetComp);
          const finalName = resolvedAth ? resolvedAth.canonicalName : entry.swimmerName;
          const finalComp = resolvedComp ? resolvedComp.canonicalName : meetComp;

          const hash = `${normalizeSwimmerKey(finalName)}|${evKey}|${sec.toFixed(2)}|${meetDate}|${entry.place || ''}`;
          if (!existingHashes.has(hash)) {
            existingHashes.add(hash);
            newEntries.push({
              id: `meet-${Date.now()}-${newEntries.length}-${Math.random().toString(36).slice(2, 6)}`,
              swimmerName: finalName,
              swimmerKey: normalizeSwimmerKey(finalName),
              classYear: normalizeClass(entry.classYear),
              eventKey: evKey,
              eventLabel: ev.eventLabel,
              time: entry.finalsTime,
              seconds: sec,
              date: meetDate,
              dateObj: parseFlexibleDate(meetDate),
              location: meetLoc,
              competition: finalComp,
              place: entry.place || '',
              isOfficial: true,
              source: 'cl2_meet',
            });
          }

          if (includeSplitsOnCommit && ev.distance === 1650 && entry.splits && entry.splits.length >= 20) {
            const split1000 = entry.splits[19];
            const splitSec = timeToSeconds(split1000?.cumulative);
            const splitEvKey = normalizeEventKey(`${ev.gender} 1000 Freestyle`);
            if (splitSec !== null && splitEvKey) {
              const sHash = `${normalizeSwimmerKey(finalName)}|${splitEvKey}|${splitSec.toFixed(2)}|${meetDate}|S`;
              if (!existingHashes.has(sHash)) {
                existingHashes.add(sHash);
                newEntries.push({
                  id: `meet-split-${Date.now()}-${newEntries.length}-${Math.random().toString(36).slice(2, 6)}`,
                  swimmerName: finalName,
                  swimmerKey: normalizeSwimmerKey(finalName),
                  classYear: normalizeClass(entry.classYear),
                  eventKey: splitEvKey,
                  eventLabel: `${ev.gender} 1000 Freestyle`,
                  time: split1000.cumulative,
                  seconds: splitSec,
                  date: meetDate,
                  dateObj: parseFlexibleDate(meetDate),
                  location: meetLoc,
                  competition: finalComp,
                  place: 'S',
                  isOfficial: false,
                  source: 'cl2_split',
                });
              }
            }
          }
        });
      } else if (ev.type === 'Relay') {
        const legDist = Math.round(ev.distance / 4);
        const legStroke = ev.stroke === 'Medley' ? 'Backstroke' : 'Freestyle';
        const legEvLabel = `${ev.gender} ${legDist} ${legStroke}`;
        const legEvKey = normalizeEventKey(legEvLabel);

        ev.entries.forEach((entry) => {
          if (entry.teamCode !== targetCode) return;
          if (!entry.legs || entry.legs.length === 0) return;

          entry.legs.forEach((leg) => {
            if (!leg.name || !leg.split) return;
            const isLeadOff = leg.leg === 1;
            if (!isLeadOff && !includeSplitsOnCommit) return;

            const splitSec = timeToSeconds(leg.split);
            if (splitSec === null || !legEvKey) return;

            const resolvedAth = resolveMasterAthlete(leg.name);
            const resolvedComp = resolveMasterCompetition(meetComp);
            const finalName = resolvedAth ? resolvedAth.canonicalName : leg.name;
            const finalComp = resolvedComp ? resolvedComp.canonicalName : meetComp;
            const placeTag = isLeadOff ? '1' : 'R';

            const hash = `${normalizeSwimmerKey(finalName)}|${legEvKey}|${splitSec.toFixed(2)}|${meetDate}|${placeTag}`;
            if (!existingHashes.has(hash)) {
              existingHashes.add(hash);
              newEntries.push({
                id: `meet-relay-${Date.now()}-${newEntries.length}-${Math.random().toString(36).slice(2, 6)}`,
                swimmerName: finalName,
                swimmerKey: normalizeSwimmerKey(finalName),
                classYear: normalizeClass(leg.classYear),
                eventKey: legEvKey,
                eventLabel: legEvLabel,
                time: leg.split,
                seconds: splitSec,
                date: meetDate,
                dateObj: parseFlexibleDate(meetDate),
                location: meetLoc,
                competition: finalComp,
                place: placeTag,
                isOfficial: isLeadOff,
                source: isLeadOff ? 'cl2_leadoff' : 'cl2_relay_split',
              });
            }
          });
        });
      }
    });

    if (newEntries.length === 0) {
      setBenchmarkStatusMsg(
        `No new ${targetName} performances to commit (all eligible times are already in the database).`
      );
      return;
    }

    const updated = [...historicalRecords, ...newEntries];
    updateHistoricalRecords(updated, newEntries, false);
    setBenchmarkStatusMsg(
      `Committed ${newEntries.length} new ${targetName} performances from "${meetComp}" to database (${updated.length} total records).`
    );
  };

  // Export Master Database back in 12-column Google Sheet CSV format
  const handleExportMasterCsv = () => {
    const headers = [
      'Name',
      'Class',
      'Event',
      'Min',
      'Sec',
      'Date',
      'Location',
      'Competition',
      'Place',
      'Time',
      'Event',
      'Seconds',
    ];
    const rows = historicalRecords.map((r) => {
      const mins = Math.floor(r.seconds / 60);
      const remSec = (r.seconds - mins * 60).toFixed(2);
      const shortEv = r.eventLabel.replace(/^(Women|Men)\s+/i, '');
      return [
        `"${r.swimmerName}"`,
        r.classYear || '',
        `"${shortEv}"`,
        mins,
        remSec,
        r.date || '',
        `"${r.location || ''}"`,
        `"${r.competition || ''}"`,
        r.place || '',
        r.time || '',
        `"${r.eventLabel}"`,
        r.seconds.toFixed(2),
      ].join(',');
    });
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `program_swim_database_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Process uploaded or sample CL2/SD3 text
  const handleProcessMeetText = (rawText) => {
    const parsed = parseSdifCl2(rawText);
    setParsedData(parsed);

    const teamCodes = Object.keys(parsed.teams);
    if (teamCodes.length > 0) {
      const gettysburgCode = teamCodes.find((c) =>
        parsed.teams[c].name.toLowerCase().includes('gettysburg')
      );
      const chosen =
        gettysburgCode || (teamCodes.includes(selectedTeam) ? selectedTeam : teamCodes[0]);
      setSelectedTeam(chosen);
      try {
        localStorage.setItem('swimmeet_primary_team_v1', chosen);
      } catch {}
    }
    setActiveSection('import');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      handleProcessMeetText(ev.target.result);
    };
    reader.readAsText(file);
  };

  // Benchmark Evaluation Engine (PB, SB, All-Time Top-10, Freshman Record)
  const benchmarkIndex = useMemo(() => {
    const officialRows = historicalRecords.filter((r) => r.isOfficial);
    const seasonStart = getCurrentSeasonStart();

    const byEvent = {};
    const bySwimmerEvent = {};

    officialRows.forEach((r) => {
      if (!byEvent[r.eventKey]) byEvent[r.eventKey] = [];
      byEvent[r.eventKey].push(r);

      const seKey = `${r.swimmerKey}|${r.eventKey}`;
      if (!bySwimmerEvent[seKey]) bySwimmerEvent[seKey] = [];
      bySwimmerEvent[seKey].push(r);
    });

    Object.keys(byEvent).forEach((k) => {
      byEvent[k].sort((a, b) => a.seconds - b.seconds);
    });

    const evaluateSwim = (swimmerName, eventLabel, timeStr, classYear = '') => {
      const sec = timeToSeconds(timeStr);
      const evKey = normalizeEventKey(eventLabel);
      const resolvedAth = resolveMasterAthlete(swimmerName);
      const swKey = normalizeSwimmerKey(resolvedAth ? resolvedAth.canonicalName : swimmerName);

      if (sec === null || !evKey || officialRows.length === 0) return [];

      const tags = [];
      const eventPool = byEvent[evKey] || [];
      const swimmerPool = bySwimmerEvent[`${swKey}|${evKey}`] || [];

      // Personal Best (PB)
      if (swimmerPool.length > 0) {
        const bestPast = Math.min(...swimmerPool.map((r) => r.seconds));
        if (sec < bestPast - 0.005) {
          tags.push({ type: 'PB', label: `PB (-${(bestPast - sec).toFixed(2)}s)` });
        } else {
          // Season Best (SB)
          const seasonPast = swimmerPool.filter((r) => r.dateObj && r.dateObj >= seasonStart);
          if (seasonPast.length > 0) {
            const bestSeason = Math.min(...seasonPast.map((r) => r.seconds));
            if (sec < bestSeason - 0.005) {
              tags.push({ type: 'SB', label: `SB (-${(bestSeason - sec).toFixed(2)}s)` });
            }
          }
        }
      }

      // All-Time Top 10
      const athleteBestMap = new Map();
      eventPool.forEach((r) => {
        if (!athleteBestMap.has(r.swimmerKey) || r.seconds < athleteBestMap.get(r.swimmerKey)) {
          athleteBestMap.set(r.swimmerKey, r.seconds);
        }
      });
      if (!athleteBestMap.has(swKey) || sec < athleteBestMap.get(swKey)) {
        athleteBestMap.set(swKey, sec);
      }
      const sortedTop10 = Array.from(athleteBestMap.entries()).sort((a, b) => a[1] - b[1]);
      const rankIdx = sortedTop10.findIndex(([k]) => k === swKey);
      if (rankIdx >= 0 && rankIdx < 10) {
        tags.push({
          type: 'TOP10',
          label: rankIdx === 0 ? 'School Record (#1)' : `All-Time #${rankIdx + 1}`,
        });
      }

      // Freshman Record
      if (normalizeClass(classYear) === 'FR') {
        const frPast = eventPool.filter((r) => normalizeClass(r.classYear) === 'FR');
        const bestFr = frPast.length > 0 ? Math.min(...frPast.map((r) => r.seconds)) : null;
        if (bestFr === null || sec < bestFr - 0.005) {
          tags.push({ type: 'FR', label: 'FR Record' });
        }
      }

      return tags;
    };

    return { evaluateSwim, byEvent };
  }, [historicalRecords, masterRoster]);

  // Program Record Book & All-Time Top-10 Data
  const recordBookData = useMemo(() => {
    const officialRows = historicalRecords.filter(
      (r) => r.isOfficial && r.eventKey === recordBookEventKey
    );

    const bestPerSwimmer = new Map();
    officialRows.forEach((r) => {
      if (!bestPerSwimmer.has(r.swimmerKey) || r.seconds < bestPerSwimmer.get(r.swimmerKey).seconds) {
        bestPerSwimmer.set(r.swimmerKey, r);
      }
    });

    const top10 = Array.from(bestPerSwimmer.values())
      .sort((a, b) => a.seconds - b.seconds)
      .slice(0, 10);

    const freshmanRows = officialRows
      .filter((r) => normalizeClass(r.classYear) === 'FR')
      .sort((a, b) => a.seconds - b.seconds);

    return {
      top10,
      freshmanRecord: freshmanRows[0] || null,
      totalMatchedCount: officialRows.length,
    };
  }, [historicalRecords, recordBookEventKey]);

  // Post-Meet Win Summary & Multi-Win Athletes
  const winSummary = useMemo(() => {
    if (!parsedData) return { totalWins: 0, athletes: [] };
    const athleteMap = {};
    let totalWins = 0;

    parsedData.events.forEach((ev) => {
      const winner = ev.entries.find((e) => String(e.place) === '1');
      if (!winner) return;
      if (selectedTeam !== 'ALL' && winner.teamCode !== selectedTeam) return;

      totalWins++;
      if (ev.type === 'Individual') {
        const name = winner.swimmerName;
        if (!athleteMap[name]) {
          athleteMap[name] = {
            name,
            teamName: winner.teamName,
            indWins: 0,
            relWins: 0,
            events: [],
          };
        }
        athleteMap[name].indWins += 1;
        athleteMap[name].events.push(`${ev.eventLabel} (${winner.finalsTime})`);
      } else {
        (winner.legs || []).forEach((leg) => {
          const name = leg.name;
          if (!athleteMap[name]) {
            athleteMap[name] = {
              name,
              teamName: winner.teamName,
              indWins: 0,
              relWins: 0,
              events: [],
            };
          }
          athleteMap[name].relWins += 1;
          athleteMap[name].events.push(`${ev.eventLabel} — Leg ${leg.leg} (${winner.finalsTime})`);
        });
      }
    });

    const athletes = Object.values(athleteMap).sort(
      (a, b) => b.indWins + b.relWins - (a.indWins + a.relWins)
    );

    return { totalWins, athletes };
  }, [parsedData, selectedTeam]);

  // Filtered Events for Section 4 (Import Meet Results)
  const filteredEvents = useMemo(() => {
    if (!parsedData) return [];
    return parsedData.events.filter((ev) => {
      if (genderFilter !== 'ALL' && ev.gender.toUpperCase() !== genderFilter) return false;
      if (typeFilter !== 'ALL' && ev.type.toUpperCase() !== typeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchEv = ev.eventLabel.toLowerCase().includes(q);
        const matchEntry = ev.entries.some(
          (e) =>
            (e.swimmerName && e.swimmerName.toLowerCase().includes(q)) ||
            (e.legs && e.legs.some((l) => l.name.toLowerCase().includes(q)))
        );
        return matchEv || matchEntry;
      }
      return true;
    });
  }, [parsedData, genderFilter, typeFilter, searchQuery]);

  // SID Post-Meet Recap Generator
  const generatedRecapText = useMemo(() => {
    if (!parsedData) return '';
    const teamList = Object.values(parsedData.teams);
    const scoreLine = teamList
      .map((t) => `${t.name} ${t.points % 1 === 0 ? t.points : t.points.toFixed(1)}`)
      .join(', ');

    const lines = [
      `${parsedData.meet.name.toUpperCase()} — POST-MEET RECAP`,
      `Date: ${parsedData.meet.startDate || 'TBD'} | Location: ${parsedData.meet.location || 'Pool'}`,
      `Team Scores: ${scoreLine}`,
      '',
    ];

    if (winSummary.athletes.length > 0) {
      lines.push('EVENT WINNERS & MULTI-WIN LEADERS:');
      winSummary.athletes.forEach((a) => {
        const tot = a.indWins + a.relWins;
        lines.push(
          `• ${a.name} (${a.teamName}) — ${tot} Win${tot > 1 ? 's' : ''} (${a.indWins}I / ${a.relWins}R): ${a.events.join('; ')}`
        );
      });
    }

    return lines.join('\n');
  }, [parsedData, winSummary]);

  const handleCopyRecap = () => {
    navigator.clipboard.writeText(generatedRecapText).then(() => {
      setCopiedRecap(true);
      setTimeout(() => setCopiedRecap(false), 2000);
    });
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* TOP GLOBAL HEADER */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div
            onClick={() => setActiveSection('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Timer className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight leading-tight group-hover:text-cyan-300 transition">
                Swim Meet Command Center
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Program Records • Roster Reconciliation • SDIF/CL2 Analytics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Silent Cloud Sync Status Indicator */}
            <div
              title={
                cloudSyncStatus === 'synced'
                  ? 'Connected anonymously to swimming-records Firestore'
                  : cloudSyncStatus === 'connecting'
                  ? 'Connecting to Firebase...'
                  : 'Using local browser storage (check Firestore rules)'
              }
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border ${
                cloudSyncStatus === 'synced'
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : cloudSyncStatus === 'connecting'
                  ? 'bg-slate-800 text-slate-300 border-slate-700'
                  : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
              }`}
            >
              {cloudSyncStatus === 'synced' ? (
                <>
                  <Cloud className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Cloud Synced</span>
                </>
              ) : cloudSyncStatus === 'connecting' ? (
                <>
                  <Cloud className="w-3.5 h-3.5 animate-pulse" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <CloudOff className="w-3.5 h-3.5 text-amber-400" />
                  <span>Local Cache</span>
                </>
              )}
            </div>

            {activeSection !== 'home' && (
              <button
                onClick={() => setActiveSection('home')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
              >
                <Home className="w-4 h-4 text-cyan-400" />
                <span>Command Hub</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub-Navigation Bar when inside a section */}
        {activeSection !== 'home' && (
          <div className="bg-slate-950/70 border-t border-slate-800 overflow-x-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 py-1.5 text-xs font-semibold whitespace-nowrap">
              {[
                { id: 'history', label: '1. Historical & Master Lists', icon: Database },
                { id: 'records', label: '2. Records & Top-10', icon: Trophy },
                { id: 'inmeet', label: '3. In-Meet Tools', icon: Sparkles },
                { id: 'import', label: '4. Import Meet Results', icon: FolderUp },
                { id: 'postmeet', label: '5. Post-Meet Tools', icon: Award },
              ].map((nav) => {
                const Icon = nav.icon;
                const active = activeSection === nav.id;
                return (
                  <button
                    key={nav.id}
                    onClick={() => setActiveSection(nav.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                      active
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{nav.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT BODY */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Status Toast Banner */}
        {benchmarkStatusMsg && (
          <div className="mb-6 bg-cyan-50 border border-cyan-200 text-cyan-950 px-4 py-3 rounded-xl flex items-center justify-between gap-3 text-xs sm:text-sm shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
              <span className="font-medium">{benchmarkStatusMsg}</span>
            </div>
            <button
              onClick={() => setBenchmarkStatusMsg('')}
              className="text-cyan-700 hover:text-cyan-950 font-bold text-xs cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ==================================================================== */}
        {/* HOME: 5-PILLAR COMMAND CENTER HUB                                    */}
        {/* ==================================================================== */}
        {activeSection === 'home' && (
          <div className="space-y-8">
            {/* Hero Status Bar */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Gettysburg Swimming Operations Hub
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Program Record Book, Roster Reconciliation & Meet Analytics
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Manage your master athlete roster and historical database, explore live All-Time
                    Top-10 and Freshman records, or parse Hy-Tek SDIF/CL2 meet files into instant SID
                    recaps.
                  </p>
                </div>

                {/* Live Counters */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-center">
                    <div className="text-xl sm:text-2xl font-extrabold text-cyan-400">
                      {historicalRecords.length}
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                      DB Swims
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-center">
                    <div className="text-xl sm:text-2xl font-extrabold text-emerald-400">
                      {masterRoster.filter((a) => a.isActive).length}
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                      Active Roster
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-center">
                    <div className="text-xl sm:text-2xl font-extrabold text-amber-400">
                      {parsedData ? parsedData.events.length : 0}
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                      Meet Events
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 5-Pillar Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Pillar 1 */}
              <div
                onClick={() => setActiveSection('history')}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-cyan-500 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition">
                    <Database className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-cyan-700">
                    Section 1 • Master Data
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Import / Review Historical Data
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Mass-import your Master Roster & Competitions, stage Google Sheet rows, reconcile
                    athlete aliases, and sync directly to Firestore.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-cyan-700">
                  <span>{masterRoster.length} Athletes • {masterCompetitions.length} Meets</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </div>

              {/* Pillar 2 */}
              <div
                onClick={() => setActiveSection('records')}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-amber-500 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-700">
                    Section 2 • Program History
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    View Records & All-Time Lists
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Browse live Men’s and Women’s All-Time Top-10 leaderboards and Freshman Program
                    Records computed from official flat-start swims.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
                  <span>Open Record Book</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </div>

              {/* Pillar 3 */}
              <div
                onClick={() => setActiveSection('inmeet')}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-500 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                    Section 3 • Deck & Broadcast
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900">In-Meet Tools</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Quick-reference broadcaster lookup for active swimmers, seed times, personal
                    bests, and Top-10 threshold targets on deck.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-700">
                  <span>Launch Deck Console</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </div>

              {/* Pillar 4 */}
              <div
                onClick={() => setActiveSection('import')}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-500 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
                    <FolderUp className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-blue-700">
                    Section 4 • Hy-Tek Parser
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900">Import Meet Results</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Upload `.cl2` / `.sd3` meet results to inspect event tables, 50-yard splits,
                    relay legs, and automatic PB/SB/Top-10/FR badges.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700">
                  <span>{parsedData ? parsedData.meet.name : 'Upload .CL2 / .SD3 File'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </div>

              {/* Pillar 5 */}
              <div
                onClick={() => setActiveSection('postmeet')}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
                    <Award className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Section 5 • SID & Commit
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900">Post-Meet Tools</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    View multi-win swimmers (Individual + Relay), copy formatted SID recap notes,
                    and commit Gettysburg swims to your master database.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                  <span>Open Post-Meet Suite</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* SECTION 1: IMPORT / REVIEW HISTORICAL DATA & MASTER LISTS            */}
        {/* ==================================================================== */}
        {activeSection === 'history' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    Master Historical Database & Reference Lists
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Maintain canonical athlete names (with Active flags) and competitions so every
                    historical Sheet row and `.cl2` meet matches cleanly.
                  </p>
                </div>

                {/* Sub-tabs */}
                <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl">
                  {[
                    { id: 'import', label: 'Import & Reconcile' },
                    { id: 'roster', label: `Master Roster (${masterRoster.length})` },
                    {
                      id: 'competitions',
                      label: `Master Competitions (${masterCompetitions.length})`,
                    },
                    { id: 'database', label: `Committed DB (${historicalRecords.length})` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setHistorySubTab(tab.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        historySubTab === tab.id
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* SUB-TAB A: IMPORT & RECONCILE GOOGLE SHEET DATA */}
              {historySubTab === 'import' && (
                <div className="p-5 sm:p-6 space-y-6">
                  <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Paste 12-Column Google Sheet Rows (TSV or CSV)
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPasteSheetText(SAMPLE_GOOGLE_SHEET_CSV)}
                          className="text-xs font-semibold text-cyan-700 hover:text-cyan-900 underline cursor-pointer"
                        >
                          Load Sample Sheet Rows
                        </button>
                        <input
                          ref={historyCsvInputRef}
                          type="file"
                          accept=".csv,.tsv,.txt"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (!f) return;
                            const r = new FileReader();
                            r.onload = (ev) => {
                              setPasteSheetText(ev.target.result);
                              handleStageHistoryText(ev.target.result);
                            };
                            r.readAsText(f);
                          }}
                          className="hidden"
                        />
                        <button
                          onClick={() => historyCsvInputRef.current?.click()}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          Upload CSV/TSV
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500">
                      Expected column order:{' '}
                      <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-700">
                        Name | Class | Event | Min | Sec | Date | Location | Competition | Place | Time | Event | Seconds
                      </code>
                      . Rows with <code className="font-bold">Place = R</code> (relay split) or{' '}
                      <code className="font-bold">S</code> (distance split) are automatically marked
                      non-official.
                    </p>

                    <textarea
                      rows={5}
                      value={pasteSheetText}
                      onChange={(e) => setPasteSheetText(e.target.value)}
                      placeholder="Paste rows directly from Google Sheets here..."
                      className="w-full p-3 text-xs font-mono bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />

                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        onClick={() => handleStageHistoryText(pasteSheetText)}
                        disabled={!pasteSheetText.trim()}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white shadow-sm transition cursor-pointer"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        Stage & Validate Rows
                      </button>
                    </div>
                  </div>

                  {/* Reconciliation Prompt when Unmatched Athletes/Competitions appear */}
                  {(stagingUnmatched.athletes.length > 0 ||
                    stagingUnmatched.competitions.length > 0) && (
                    <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 sm:p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-extrabold text-amber-950 flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4 text-amber-600" />
                            Master List Reconciliation Needed ({stagingUnmatched.athletes.length}{' '}
                            Athletes, {stagingUnmatched.competitions.length} Competitions)
                          </h3>
                          <p className="text-xs text-amber-800 mt-0.5">
                            Map spelling/nickname variants as an Alias to an existing Master entry
                            (so future imports auto-match) or create a new Master entry.
                          </p>
                        </div>
                        <button
                          onClick={handleApplyReconciliations}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-sm transition cursor-pointer shrink-0"
                        >
                          <Link2 className="w-3.5 h-3.5" />
                          Apply All Reconciliations
                        </button>
                      </div>

                      {stagingUnmatched.athletes.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                            Unmatched Athletes
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                            {stagingUnmatched.athletes.map((item) => {
                              const selKey = `ath:${normalizeSwimmerKey(item.rawName)}`;
                              return (
                                <div
                                  key={selKey}
                                  className="bg-white p-3 rounded-lg border border-amber-200 flex items-center justify-between gap-2"
                                >
                                  <div>
                                    <div className="text-xs font-bold text-slate-900">
                                      {item.rawName}
                                    </div>
                                    <div className="text-[11px] text-slate-500">
                                      {item.inferredGender} • {item.count} staged row(s)
                                    </div>
                                  </div>
                                  <select
                                    value={reconcileSelections[selKey] || '__NEW__'}
                                    onChange={(e) =>
                                      setReconcileSelections((prev) => ({
                                        ...prev,
                                        [selKey]: e.target.value,
                                      }))
                                    }
                                    className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 max-w-[200px]"
                                  >
                                    <option value="__NEW__">+ Create New Master Athlete</option>
                                    {masterRoster.map((ath) => (
                                      <option key={ath.id} value={ath.id}>
                                        Alias → {ath.canonicalName}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {stagingUnmatched.competitions.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                            Unmatched Competitions
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                            {stagingUnmatched.competitions.map((item) => {
                              const selKey = `comp:${item.rawName.toLowerCase()}`;
                              return (
                                <div
                                  key={selKey}
                                  className="bg-white p-3 rounded-lg border border-amber-200 flex items-center justify-between gap-2"
                                >
                                  <div>
                                    <div className="text-xs font-bold text-slate-900">
                                      {item.rawName}
                                    </div>
                                    <div className="text-[11px] text-slate-500">
                                      {item.sampleLocation || 'No location'} • {item.count} row(s)
                                    </div>
                                  </div>
                                  <select
                                    value={reconcileSelections[selKey] || '__NEW__'}
                                    onChange={(e) =>
                                      setReconcileSelections((prev) => ({
                                        ...prev,
                                        [selKey]: e.target.value,
                                      }))
                                    }
                                    className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 max-w-[210px]"
                                  >
                                    <option value="__NEW__">+ Create New Competition</option>
                                    {masterCompetitions.map((c) => (
                                      <option key={c.id} value={c.id}>
                                        Alias → {c.canonicalName}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Staged Preview Table */}
                  {stagedHistoryRows.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="text-xs font-bold text-slate-700">
                          Staging Preview ({stagedHistoryRows.filter((r) => r.selected).length} of{' '}
                          {stagedHistoryRows.length} rows selected)
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => handleCommitStagedRows('append')}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Append Selected to Database
                          </button>
                          <button
                            onClick={() => handleCommitStagedRows('replace')}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer"
                          >
                            Replace Entire Database
                          </button>
                        </div>
                      </div>

                      <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-96">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px] sticky top-0">
                            <tr>
                              <th className="py-2.5 px-3">Keep</th>
                              <th className="py-2.5 px-3">Athlete</th>
                              <th className="py-2.5 px-3">Class</th>
                              <th className="py-2.5 px-3">Canonical Event</th>
                              <th className="py-2.5 px-3">Time</th>
                              <th className="py-2.5 px-3">Competition</th>
                              <th className="py-2.5 px-3">Date</th>
                              <th className="py-2.5 px-3">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {stagedHistoryRows.map((row, idx) => (
                              <tr
                                key={row.id}
                                className={row.isDuplicate ? 'bg-amber-50/50' : 'bg-white'}
                              >
                                <td className="py-2 px-3">
                                  <input
                                    type="checkbox"
                                    checked={row.selected}
                                    onChange={(e) => {
                                      const checked = e.target.checked;
                                      setStagedHistoryRows((prev) =>
                                        prev.map((item, i) =>
                                          i === idx ? { ...item, selected: checked } : item
                                        )
                                      );
                                    }}
                                    className="rounded text-cyan-600"
                                  />
                                </td>
                                <td className="py-2 px-3 font-bold text-slate-900">
                                  {row.swimmerName}
                                </td>
                                <td className="py-2 px-3">{row.classYear || '—'}</td>
                                <td className="py-2 px-3">{row.eventLabel}</td>
                                <td className="py-2 px-3 font-mono font-semibold">{row.time}</td>
                                <td className="py-2 px-3 text-slate-600">
                                  {row.competition || '—'}
                                </td>
                                <td className="py-2 px-3 text-slate-500">{row.date || '—'}</td>
                                <td className="py-2 px-3">
                                  {row.isDuplicate ? (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                      Duplicate
                                    </span>
                                  ) : !row.isOfficial ? (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                                      Split ({row.place})
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                      Official
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SUB-TAB B: MASTER ATHLETE ROSTER */}
              {historySubTab === 'roster' && (
                <div className="p-5 sm:p-6 space-y-5">
                  {/* Mass / Bulk Roster Paste Importer */}
                  <div className="bg-cyan-50/50 p-4 rounded-xl border border-cyan-200/80 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-cyan-900 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-cyan-700" />
                        Mass Roster Importer (Paste from Google Sheets or CSV)
                      </label>
                      <span className="text-[11px] text-cyan-800 font-medium">
                        Columns:{' '}
                        <code className="bg-white px-1 rounded">
                          Name, Gender (Women/Men), Active (Yes/No), Aliases
                        </code>
                      </span>
                    </div>
                    <textarea
                      rows={4}
                      value={bulkRosterText}
                      onChange={(e) => setBulkRosterText(e.target.value)}
                      placeholder={`Name, Gender, Active, Aliases\nKathleen Miller, Women, Yes, Kate Miller\nDelanie McKenzie, Women, Yes, Lanie McKenzie\nCharles Schundler, Men, No, Jackson Schundler`}
                      className="w-full p-3 text-xs font-mono bg-white border border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <button
                        onClick={handleBulkImportRoster}
                        disabled={!bulkRosterText.trim()}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white transition cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        Mass Import Athletes
                      </button>

                      {historicalRecords.length > 0 && (
                        <button
                          onClick={handleSyncMasterListsFromDatabase}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          Sync Missing from DB
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Single Athlete Quick-Add Bar */}
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 flex-1">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                          Quick-Add Single Athlete
                        </label>
                        <input
                          type="text"
                          value={newAthleteName}
                          onChange={(e) => setNewAthleteName(e.target.value)}
                          placeholder="e.g., Kathleen Miller"
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                          Gender
                        </label>
                        <select
                          value={newAthleteGender}
                          onChange={(e) => setNewAthleteGender(e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                          <option value="Women">Women</option>
                          <option value="Men">Men</option>
                        </select>
                      </div>
                      <div className="flex items-end gap-2">
                        <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-2.5 rounded-lg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newAthleteActive}
                            onChange={(e) => setNewAthleteActive(e.target.checked)}
                            className="rounded text-cyan-600 focus:ring-cyan-500"
                          />
                          Active
                        </label>
                        <button
                          onClick={() => {
                            if (!newAthleteName.trim()) return;
                            if (resolveMasterAthlete(newAthleteName)) {
                              setBenchmarkStatusMsg(
                                `"${newAthleteName.trim()}" already exists in the Master Roster.`
                              );
                              return;
                            }
                            const created = {
                              id: `ath-${Date.now()}`,
                              canonicalName: newAthleteName.trim(),
                              gender: newAthleteGender,
                              isActive: newAthleteActive,
                              aliases: [],
                            };
                            updateMasterRoster([...masterRoster, created], [created]);
                            setNewAthleteName('');
                          }}
                          className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Master Roster Table */}
                  {masterRoster.length === 0 ? (
                    <div className="text-center py-10 text-sm text-slate-500 border border-dashed border-slate-200 rounded-xl">
                      No athletes in the Master Roster yet. Use the Mass Roster Importer above or
                      sync from your database.
                    </div>
                  ) : (
                    <div className="overflow-x-auto border border-slate-200 rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px]">
                          <tr>
                            <th className="py-2.5 px-4">Canonical Name</th>
                            <th className="py-2.5 px-4">Gender</th>
                            <th className="py-2.5 px-4 text-center">Active</th>
                            <th className="py-2.5 px-4">Saved Aliases</th>
                            <th className="py-2.5 px-4 text-center">Remove</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {masterRoster
                            .slice()
                            .sort((a, b) => a.canonicalName.localeCompare(b.canonicalName))
                            .map((ath) => (
                              <tr key={ath.id} className="hover:bg-slate-50">
                                <td className="py-2.5 px-4 font-bold text-slate-900">
                                  {ath.canonicalName}
                                </td>
                                <td className="py-2.5 px-4 text-slate-600">{ath.gender}</td>
                                <td className="py-2.5 px-4 text-center">
                                  <input
                                    type="checkbox"
                                    checked={Boolean(ath.isActive)}
                                    onChange={(e) => {
                                      const checked = e.target.checked;
                                      const updatedItem = { ...ath, isActive: checked };
                                      updateMasterRoster(
                                        masterRoster.map((item) =>
                                          item.id === ath.id ? updatedItem : item
                                        ),
                                        [updatedItem]
                                      );
                                    }}
                                    className="rounded text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                                  />
                                </td>
                                <td className="py-2.5 px-4 text-slate-500">
                                  {(ath.aliases || []).length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                      {ath.aliases.map((al) => (
                                        <span
                                          key={al}
                                          className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]"
                                        >
                                          {al}
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-slate-400 italic">None</span>
                                  )}
                                </td>
                                <td className="py-2.5 px-4 text-center">
                                  <button
                                    onClick={() =>
                                      updateMasterRoster(
                                        masterRoster.filter((item) => item.id !== ath.id),
                                        null,
                                        ath.id
                                      )
                                    }
                                    className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* SUB-TAB C: MASTER COMPETITIONS */}
              {historySubTab === 'competitions' && (
                <div className="p-5 sm:p-6 space-y-5">
                  {/* Mass / Bulk Competitions Paste Importer */}
                  <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-200/80 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-indigo-950 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-indigo-700" />
                        Mass Competitions Importer (Paste from Google Sheets or CSV)
                      </label>
                      <span className="text-[11px] text-indigo-800 font-medium">
                        Columns:{' '}
                        <code className="bg-white px-1 rounded">
                          Competition Name, Location, Aliases
                        </code>
                      </span>
                    </div>
                    <textarea
                      rows={4}
                      value={bulkCompText}
                      onChange={(e) => setBulkCompText(e.target.value)}
                      placeholder={`Competition, Location, Aliases\nCentennial Conference Championships, Lancaster PA, CC Championships; Centennial Conf. Champs\nGettysburg Invitational, Gettysburg PA, Gettysburg Invite\nGettysburg vs Dickinson, Gettysburg PA, Dickinson Dual`}
                      className="w-full p-3 text-xs font-mono bg-white border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <button
                        onClick={handleBulkImportCompetitions}
                        disabled={!bulkCompText.trim()}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        Mass Import Competitions
                      </button>

                      {historicalRecords.length > 0 && (
                        <button
                          onClick={handleSyncMasterListsFromDatabase}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          Sync Missing from DB
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Single Competition Quick-Add Bar */}
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                          Quick-Add Single Competition
                        </label>
                        <input
                          type="text"
                          value={newCompName}
                          onChange={(e) => setNewCompName(e.target.value)}
                          placeholder="e.g., Centennial Conference Championships"
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                          Default Location
                        </label>
                        <input
                          type="text"
                          value={newCompLocation}
                          onChange={(e) => setNewCompLocation(e.target.value)}
                          placeholder="e.g., Lancaster PA"
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() => {
                            if (!newCompName.trim()) return;
                            if (resolveMasterCompetition(newCompName)) {
                              setBenchmarkStatusMsg(
                                `"${newCompName.trim()}" already exists in Master Competitions.`
                              );
                              return;
                            }
                            const created = {
                              id: `comp-${Date.now()}`,
                              canonicalName: newCompName.trim(),
                              defaultLocation: newCompLocation.trim(),
                              aliases: [],
                            };
                            updateMasterCompetitions([...masterCompetitions, created], [created]);
                            setNewCompName('');
                            setNewCompLocation('');
                          }}
                          className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer"
                        >
                          Add Competition
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Master Competitions Table */}
                  {masterCompetitions.length === 0 ? (
                    <div className="text-center py-10 text-sm text-slate-500 border border-dashed border-slate-200 rounded-xl">
                      No competitions in Master Competitions yet. Paste your meet schedule/history
                      above to populate.
                    </div>
                  ) : (
                    <div className="overflow-x-auto border border-slate-200 rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px]">
                          <tr>
                            <th className="py-2.5 px-4">Canonical Competition</th>
                            <th className="py-2.5 px-4">Default Location</th>
                            <th className="py-2.5 px-4">Saved Aliases</th>
                            <th className="py-2.5 px-4 text-center">Remove</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {masterCompetitions
                            .slice()
                            .sort((a, b) => a.canonicalName.localeCompare(b.canonicalName))
                            .map((comp) => (
                              <tr key={comp.id} className="hover:bg-slate-50">
                                <td className="py-2.5 px-4 font-bold text-slate-900">
                                  {comp.canonicalName}
                                </td>
                                <td className="py-2.5 px-4 text-slate-600">
                                  {comp.defaultLocation || '—'}
                                </td>
                                <td className="py-2.5 px-4 text-slate-500">
                                  {(comp.aliases || []).length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                      {comp.aliases.map((al) => (
                                        <span
                                          key={al}
                                          className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]"
                                        >
                                          {al}
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-slate-400 italic">None</span>
                                  )}
                                </td>
                                <td className="py-2.5 px-4 text-center">
                                  <button
                                    onClick={() =>
                                      updateMasterCompetitions(
                                        masterCompetitions.filter((item) => item.id !== comp.id),
                                        null,
                                        comp.id
                                      )
                                    }
                                    className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* SUB-TAB D: COMMITTED DATABASE */}
              {historySubTab === 'database' && (
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs font-bold text-slate-700">
                      Showing {Math.min(historicalRecords.length, 200)} of{' '}
                      {historicalRecords.length} committed records
                    </div>
                    <div className="flex items-center gap-2">
                      {historicalRecords.length > 0 && (
                        <>
                          <button
                            onClick={handleExportMasterCsv}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 text-cyan-400" />
                            Export Master CSV
                          </button>
                          <button
                            onClick={() => {
                              updateHistoricalRecords([], null, true);
                              setBenchmarkStatusMsg('Cleared historical benchmark database.');
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Clear Entire Database
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {historicalRecords.length === 0 ? (
                    <div className="text-center py-12 text-sm text-slate-500 border border-dashed border-slate-200 rounded-xl">
                      No historical performances committed yet. Import rows from Google Sheets in
                      the first tab or commit a `.cl2` meet in Post-Meet Tools.
                    </div>
                  ) : (
                    <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-[500px]">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px] sticky top-0">
                          <tr>
                            <th className="py-2.5 px-3">Athlete</th>
                            <th className="py-2.5 px-3">Class</th>
                            <th className="py-2.5 px-3">Event</th>
                            <th className="py-2.5 px-3">Time</th>
                            <th className="py-2.5 px-3">Competition</th>
                            <th className="py-2.5 px-3">Date</th>
                            <th className="py-2.5 px-3">Type</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {historicalRecords.slice(0, 200).map((r) => (
                            <tr key={r.id} className="hover:bg-slate-50">
                              <td className="py-2 px-3 font-bold text-slate-900">
                                {r.swimmerName}
                              </td>
                              <td className="py-2 px-3">{r.classYear || '—'}</td>
                              <td className="py-2 px-3">{r.eventLabel}</td>
                              <td className="py-2 px-3 font-mono font-bold text-cyan-800">
                                {r.time}
                              </td>
                              <td className="py-2 px-3 text-slate-600">{r.competition || '—'}</td>
                              <td className="py-2 px-3 text-slate-500">{r.date || '—'}</td>
                              <td className="py-2 px-3">
                                {r.isOfficial ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                    Official
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                                    Split ({r.place})
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* SECTION 2: PROGRAM RECORD BOOK & ALL-TIME TOP-10                     */}
        {/* ==================================================================== */}
        {activeSection === 'records' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    Program All-Time Top-10 & Freshman Record Book
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Ranked exclusively from official individual swims & flat-start relay lead-offs
                    ({recordBookData.totalMatchedCount} official marks matched for this event).
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    {['Women', 'Men'].map((g) => (
                      <button
                        key={g}
                        onClick={() => {
                          setRecordBookGender(g);
                          const firstEv = CANONICAL_EVENTS.find((e) => e.startsWith(g));
                          if (firstEv) setRecordBookEventKey(firstEv.toLowerCase());
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          recordBookGender === g
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-600'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>

                  <select
                    value={recordBookEventKey}
                    onChange={(e) => setRecordBookEventKey(e.target.value)}
                    className="px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    {CANONICAL_EVENTS.filter((e) => e.startsWith(recordBookGender)).map((ev) => (
                      <option key={ev} value={ev.toLowerCase()}>
                        {ev}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Freshman Record Spotlight Card */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                      Program Freshman Record ({toTitleEventLabel(recordBookEventKey)})
                    </div>
                    {recordBookData.freshmanRecord ? (
                      <div className="text-sm sm:text-base font-extrabold text-slate-900">
                        {recordBookData.freshmanRecord.swimmerName} —{' '}
                        <span className="font-mono text-amber-800">
                          {recordBookData.freshmanRecord.time}
                        </span>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-600">
                        No official Freshman (`FR`) mark recorded for this event yet.
                      </div>
                    )}
                  </div>
                </div>
                {recordBookData.freshmanRecord && (
                  <div className="text-xs text-amber-900 font-medium">
                    {recordBookData.freshmanRecord.competition} •{' '}
                    {recordBookData.freshmanRecord.date}
                  </div>
                )}
              </div>

              {/* Top-10 Table */}
              {recordBookData.top10.length === 0 ? (
                <div className="text-center py-10 text-sm text-slate-500 border border-dashed border-slate-200 rounded-xl">
                  No official marks in the database for {toTitleEventLabel(recordBookEventKey)} yet.
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-200 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="py-3 px-4 w-16">Rank</th>
                        <th className="py-3 px-4">Swimmer</th>
                        <th className="py-3 px-4">Class</th>
                        <th className="py-3 px-4">Time</th>
                        <th className="py-3 px-4">Competition</th>
                        <th className="py-3 px-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recordBookData.top10.map((row, idx) => (
                        <tr
                          key={row.id}
                          className={idx === 0 ? 'bg-amber-50/40 font-semibold' : 'hover:bg-slate-50'}
                        >
                          <td className="py-3 px-4 font-extrabold text-slate-900">
                            {idx === 0 ? '🏆 #1' : `#${idx + 1}`}
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900">{row.swimmerName}</td>
                          <td className="py-3 px-4 text-slate-600">{row.classYear || '—'}</td>
                          <td className="py-3 px-4 font-mono font-extrabold text-cyan-800">
                            {row.time}
                          </td>
                          <td className="py-3 px-4 text-slate-600">{row.competition || '—'}</td>
                          <td className="py-3 px-4 text-slate-500">{row.date || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* SECTION 3: IN-MEET BROADCASTER & DECK TOOLS                          */}
        {/* ==================================================================== */}
        {activeSection === 'inmeet' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  In-Meet Deck & Broadcaster Reference
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Active roster swimmers and their current Career Bests & #10 All-Time targets.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {masterRoster.filter((a) => a.isActive).length} Active Roster Athletes
              </span>
            </div>

            {masterRoster.filter((a) => a.isActive).length === 0 ? (
              <div className="text-center py-12 text-sm text-slate-500 border border-dashed border-slate-200 rounded-xl">
                Add active swimmers in <strong>Section 1 → Master Roster</strong> to populate your
                deck reference board.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {masterRoster
                  .filter((a) => a.isActive)
                  .sort((a, b) => a.canonicalName.localeCompare(b.canonicalName))
                  .map((ath) => {
                    const swKey = normalizeSwimmerKey(ath.canonicalName);
                    const swBestMap = new Map();
                    historicalRecords
                      .filter((r) => r.isOfficial && r.swimmerKey === swKey)
                      .forEach((r) => {
                        if (!swBestMap.has(r.eventKey) || r.seconds < swBestMap.get(r.eventKey).seconds) {
                          swBestMap.set(r.eventKey, r);
                        }
                      });
                    const bests = Array.from(swBestMap.values()).slice(0, 4);

                    return (
                      <div
                        key={ath.id}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-extrabold text-sm text-slate-900">
                            {ath.canonicalName}
                          </div>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                            {ath.gender}
                          </span>
                        </div>
                        {bests.length === 0 ? (
                          <div className="text-xs text-slate-400 italic">
                            No career marks recorded yet
                          </div>
                        ) : (
                          <div className="space-y-1">
                            {bests.map((b) => (
                              <div
                                key={b.id}
                                className="flex items-center justify-between text-xs bg-white px-2.5 py-1.5 rounded-lg border border-slate-100"
                              >
                                <span className="text-slate-600 truncate pr-2">
                                  {b.eventLabel.replace(/^(Women|Men)\s+/i, '')}
                                </span>
                                <span className="font-mono font-bold text-slate-900">{b.time}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* SECTION 4: IMPORT MEET RESULTS (.CL2 / .SD3)                         */}
        {/* ==================================================================== */}
        {activeSection === 'import' && (
          <div className="space-y-6">
            {/* Uploader & Sample Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  {parsedData ? parsedData.meet.name : 'Import Hy-Tek SDIF / CL2 Meet Results'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  {parsedData
                    ? `${parsedData.meet.location || 'Pool'} • ${parsedData.meet.startDate || ''} • ${parsedData.meet.course}`
                    : 'Upload a .cl2 or .sd3 results file or load the sample Gettysburg v Carnegie Mellon meet.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".cl2,.sd3,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm transition cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  Upload .CL2 / .SD3
                </button>
                <button
                  onClick={() => handleProcessMeetText(SAMPLE_CL2_DATA)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Load Sample Meet
                </button>
              </div>
            </div>

            {parsedData && (
              <>
                {/* Team Scoreboard & Primary Program Focus Selector */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.values(parsedData.teams).map((team) => (
                    <div
                      key={team.code}
                      onClick={() => {
                        setSelectedTeam(team.code);
                        try {
                          localStorage.setItem('swimmeet_primary_team_v1', team.code);
                        } catch {}
                      }}
                      className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                        selectedTeam === team.code
                          ? 'bg-slate-900 text-white border-cyan-500 shadow-md'
                          : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                          {selectedTeam === team.code ? '★ Primary Program Focus' : 'Competing Team'}
                        </div>
                        <div className="text-base font-extrabold mt-0.5">{team.name}</div>
                      </div>
                      <div className="text-2xl font-black text-cyan-400">
                        {team.points % 1 === 0 ? team.points : team.points.toFixed(1)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Filters Bar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {['ALL', 'WOMEN', 'MEN'].map((g) => (
                      <button
                        key={g}
                        onClick={() => setGenderFilter(g)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          genderFilter === g
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {g === 'ALL' ? 'All Genders' : g}
                      </button>
                    ))}
                    <span className="text-slate-300">|</span>
                    {['ALL', 'INDIVIDUAL', 'RELAY'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTypeFilter(t)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          typeFilter === t
                            ? 'bg-cyan-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {t === 'ALL' ? 'All Types' : t}
                      </button>
                    ))}
                  </div>

                  <div className="relative flex-1 min-w-[200px] max-w-xs">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter event or swimmer..."
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                {/* Event Result Cards */}
                <div className="space-y-4">
                  {filteredEvents.map((ev) => (
                    <div
                      key={ev.key}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                    >
                      <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
                        <div className="font-extrabold text-sm">{ev.eventLabel}</div>
                        <span className="text-[11px] text-slate-400 font-semibold">
                          {ev.entries.length} Entries
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                            <tr>
                              <th className="py-2.5 px-4 w-14">Place</th>
                              <th className="py-2.5 px-4">Swimmer / Relay</th>
                              <th className="py-2.5 px-4">Team</th>
                              <th className="py-2.5 px-4">Seed</th>
                              <th className="py-2.5 px-4">Finals</th>
                              <th className="py-2.5 px-4 text-right">Pts</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {ev.entries.map((entry) => {
                              const isPrimary = entry.teamCode === selectedTeam;
                              const tags =
                                ev.type === 'Individual' && isPrimary
                                  ? benchmarkIndex.evaluateSwim(
                                      entry.swimmerName,
                                      ev.eventLabel,
                                      entry.finalsTime,
                                      entry.classYear
                                    )
                                  : [];
                              const hasSplits = entry.splits && entry.splits.length > 0;
                              const isExpanded = Boolean(expandedSplits[entry.id]);

                              return (
                                <React.Fragment key={entry.id}>
                                  <tr
                                    className={
                                      isPrimary ? 'bg-cyan-50/30 font-medium' : 'hover:bg-slate-50'
                                    }
                                  >
                                    <td className="py-2.5 px-4 font-extrabold text-slate-900">
                                      {entry.place || '—'}
                                    </td>
                                    <td className="py-2.5 px-4">
                                      {ev.type === 'Individual' ? (
                                        <div className="flex flex-wrap items-center gap-1.5">
                                          <span className="font-bold text-slate-900">
                                            {entry.swimmerName}
                                          </span>
                                          {tags.map((t, i) => (
                                            <span
                                              key={i}
                                              className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900"
                                            >
                                              {t.label}
                                            </span>
                                          ))}
                                          {hasSplits && (
                                            <button
                                              onClick={() =>
                                                setExpandedSplits((prev) => ({
                                                  ...prev,
                                                  [entry.id]: !prev[entry.id],
                                                }))
                                              }
                                              className="inline-flex items-center gap-0.5 text-[10px] font-bold text-cyan-700 hover:underline cursor-pointer"
                                            >
                                              {isExpanded ? 'Hide Splits' : 'Splits'}
                                              {isExpanded ? (
                                                <ChevronUp className="w-3 h-3" />
                                              ) : (
                                                <ChevronDown className="w-3 h-3" />
                                              )}
                                            </button>
                                          )}
                                        </div>
                                      ) : (
                                        <div className="space-y-1">
                                          <div className="font-bold text-slate-900">
                                            Relay {entry.relayLetter}
                                          </div>
                                          {entry.legs && entry.legs.length > 0 && (
                                            <div className="text-[11px] text-slate-600 flex flex-wrap gap-x-3 gap-y-0.5">
                                              {entry.legs.map((l) => (
                                                <span key={l.leg}>
                                                  {l.leg}. {l.name}
                                                  {l.split ? ` (${l.split})` : ''}
                                                </span>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </td>
                                    <td className="py-2.5 px-4 text-slate-600">{entry.teamName}</td>
                                    <td className="py-2.5 px-4 font-mono text-slate-500">
                                      {entry.seedTime || '—'}
                                    </td>
                                    <td className="py-2.5 px-4 font-mono font-extrabold text-slate-900">
                                      {entry.finalsTime || '—'}
                                    </td>
                                    <td className="py-2.5 px-4 text-right font-bold text-slate-700">
                                      {entry.points > 0 ? entry.points : '—'}
                                    </td>
                                  </tr>

                                  {hasSplits && isExpanded && (
                                    <tr className="bg-slate-50">
                                      <td colSpan={6} className="px-4 py-3">
                                        <div className="flex flex-wrap gap-2">
                                          {entry.splits.map((sp) => (
                                            <div
                                              key={sp.splitNumber}
                                              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] font-mono"
                                            >
                                              <span className="text-slate-400 mr-1">
                                                #{sp.splitNumber}:
                                              </span>
                                              <span className="font-bold text-slate-900">
                                                {sp.cumulative}
                                              </span>
                                              {sp.lap && (
                                                <span className="text-cyan-700 ml-1">
                                                  ({sp.lap})
                                                </span>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* SECTION 5: POST-MEET TOOLS (WINS, SID RECAP & COMMIT TO DB)          */}
        {/* ==================================================================== */}
        {activeSection === 'postmeet' && (
          <div className="space-y-6">
            {!parsedData ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
                <p className="text-sm text-slate-600">
                  No active meet loaded yet. Upload a `.cl2` meet file or load the sample meet first.
                </p>
                <button
                  onClick={() => handleProcessMeetText(SAMPLE_CL2_DATA)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 text-white cursor-pointer"
                >
                  Load Sample Meet
                </button>
              </div>
            ) : (
              <>
                {/* One-Click Commit Meet to Database Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                      Commit Meet Performances to Master Database
                    </h3>
                    <p className="text-xs text-slate-500">
                      Imports only{' '}
                      <strong>{parsedData.teams[selectedTeam]?.name || selectedTeam}</strong>{' '}
                      swims and resolves athlete & competition names against your Master Lists.
                    </p>
                    <label className="inline-flex items-center gap-2 text-xs text-slate-700 pt-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeSplitsOnCommit}
                        onChange={(e) => setIncludeSplitsOnCommit(e.target.checked)}
                        className="rounded text-cyan-600"
                      />
                      Also save flying relay splits (Place = R) & 1000 splits inside 1650 (Place = S)
                    </label>
                  </div>

                  <button
                    onClick={handleCommitCurrentMeet}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition cursor-pointer shrink-0"
                  >
                    <Database className="w-4 h-4" />
                    Commit {parsedData.teams[selectedTeam]?.name || selectedTeam}
                  </button>
                </div>

                {/* Event Winners & Multi-Win Leaderboard */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="text-base font-extrabold text-slate-900">
                        Event Winners ({winSummary.totalWins} Wins)
                      </h3>
                      <span className="text-xs font-bold text-cyan-700">
                        {parsedData.teams[selectedTeam]?.name || 'All Teams'}
                      </span>
                    </div>

                    {winSummary.athletes.length === 0 ? (
                      <p className="text-xs text-slate-500">
                        No 1st-place finishes found for the selected team.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {winSummary.athletes.map((ath) => {
                          const total = ath.indWins + ath.relWins;
                          return (
                            <div
                              key={ath.name}
                              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-start justify-between gap-3"
                            >
                              <div>
                                <div className="font-extrabold text-sm text-slate-900">
                                  {ath.name}
                                </div>
                                <div className="text-[11px] text-slate-500 mb-1.5">
                                  ({ath.teamName})
                                </div>
                                <ul className="space-y-0.5 text-xs text-slate-700">
                                  {ath.events.map((evLine, i) => (
                                    <li key={i}>• {evLine}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="text-right shrink-0">
                                <div className="text-lg font-black text-cyan-700">{total}</div>
                                <div className="text-[11px] font-bold text-slate-500">
                                  Wins ({ath.indWins}I / {ath.relWins}R)
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Copyable SID Post-Meet Recap */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4 flex flex-col">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="text-base font-extrabold text-slate-900">
                        SID Post-Meet Recap Notes
                      </h3>
                      <button
                        onClick={handleCopyRecap}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition cursor-pointer"
                      >
                        {copiedRecap ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <ClipboardCopy className="w-3.5 h-3.5 text-cyan-400" />
                            Copy Recap
                          </>
                        )}
                      </button>
                    </div>
                    <textarea
                      readOnly
                      value={generatedRecapText}
                      rows={12}
                      className="w-full flex-1 p-3.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
