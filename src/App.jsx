import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Upload,
  Trophy,
  Users,
  Timer,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Search,
  CheckCircle2,
  AlertCircle,
  Download,
  Award,
  ClipboardCopy,
  Check,
  Database,
  Star,
  Trash2,
  Home,
  Calendar,
  FolderUp,
  SlidersHorizontal,
  ArrowRight,
  Link2,
  Building2,
  UserPlus,
  Cloud,
  CloudOff,
  FileText,
  MapPin,
  X,
  Play,
  Layers,
  TrendingUp,
  Zap,
  ArrowUpDown,
  ChevronRight
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  onSnapshot,
  writeBatch,
  deleteDoc,
  getDocs
} from 'firebase/firestore';

// ============================================================================
// FIREBASE INITIALIZATION (Anonymous Auth + Firestore Sync)
// ============================================================================
const firebaseConfig = {
  apiKey: 'AIzaSyC9wvEBlxlufBiktja5vjaXH0rxceCuPyg',
  authDomain: 'swimming-records.firebaseapp.com',
  projectId: 'swimming-records',
  storageBucket: 'swimming-records.firebasestorage.app',
  messagingSenderId: '645635780769',
  appId: '1:645635780769:web:f9b5bb16397b3a0ec980e0',
  measurementId: 'G-TY22D1ZJWM',
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// ============================================================================
// SAMPLE SDIF / CL2 DATA (Gettysburg v Carnegie Mellon - 07Nov2026)
// ============================================================================
const SAMPLE_CL2_DATA = `A03V3      02Meet Results                  Hy-Tek, Ltd         WMM 8.0Gh Hy-Tek, Ltd         866-456-511111072026                                    MM40    N52
B13        Gettysburg v Carnegie Mellon                                              Gettysburg          PA17325     USA 1107202611072026   0        Y 000   N05
C13AM      AMCMU Carnegie Mellon University                    5000 Forbes Ave                                                 PA          USA               N03
D03AM  SO  Chen, Andrew                CA5865516725A   1030200620MM  501 14 UNOV11072026                              22.44Y     1 8     7       7  01      NN09
D3CA58655167254EAndrew                                                                                                                                       N61
D03AM  SO  Chen, Andrew                CA5865516725A   1030200620MM 1001 16 UNOV11072026                              48.76Y     1 2     4  2.   4  0100    NN49
G03AM          Chen, Andrew                CA58655167251 2  50C   23.70   48.76                                                                F             N05
D03AM  FR  Chen, Sarah Y               CA09F5D4110BA   1226200718FF 1002  7 UNOV11072026                              58.53Y     1 4     1  9.   1  0200    NN39
D3CA09F5D4110B49Sarah                                                                                                                                        N21
G03AM          Chen, Sarah Y               CA09F5D4110B1 2  50C   28.81   58.53                                                                F             N05
D03AM  FR  Chen, Sarah Y               CA09F5D4110BA   1226200718FF 2002 17 UNOV11072026                            2:08.77Y     1 4     1  9.   1  0200    NN69
G03AM          Chen, Sarah Y               CA09F5D4110B1 4  50C   30.37 1:03.16 1:35.86 2:08.77                                                F             N76
E03AM      AAMCMU   F 4007  1 UNOV  011072026                            3:57.64Y     1 4     1 11.                                            1N   0500X    N64
F03AM  FR      AMCMU AChen, Sarah Y               CA09F5D4110B   1226200718F  1             CA09F5D4110B49Sarah                                              N99
G03AM          Chen, Sarah Y               CA09F5D4110B1 8  50C   28.53   58.96                                                                F             N15
F03AM  FR      AMCMU AChen, Ziyu                  E9C81A13B32C   0718200818F  2             E9C81A13B32C49Zoe                                                N88
G03AM          Chen, Ziyu                  E9C81A13B32C1 8  50C 1:30.15 2:05.95                                                                F             N05
F03AM  SO      AMCMU AGil, Audrey L               6055FC4F0DA4   0911200719F  3             6055FC4F0DA44FAudrey                                             N60
G03AM          Gil, Audrey L               6055FC4F0DA41 8  50C 2:31.92 3:03.11                                                                F             N55
F03AM  SR      AMCMU AZaniolo, Anna G             51813519EEBF   0506200521F  4             51813519EEBF40Anna                                               N20
G03AM          Zaniolo, Anna G             51813519EEBF1 8  50C 3:28.78 3:57.64                                                                F             N46
C13MA      MAGETTGettysburg College            Gettysburg      Greg Brown            300 N Washington St   Gettysburg          PA17325     USA               N93
D03MA  SR  Berry, Ava                              A   1230200418FF10001  3 UNOV11072026                           10:43.55Y     1 5     1  9.   1  0100    NN57
D3                                                                                                                                                           N67
G03MA          Berry, Ava                              120  50C   28.93 1:00.36 1:32.36 2:04.44 2:36.83 3:09.20 3:41.73 4:14.28 4:46.73 5:19.09F             N98
G03MA          Berry, Ava                              220  50C 5:51.62 6:24.32 6:57.17 7:30.00 8:02.61 8:35.36 9:07.89 9:40.4610:12.4610:43.55F             N49
D03MA  SR  McKenzie, Delanie                       A   0304200518FF 1002  7 UNOV11072026                              58.90Y     1 5     2  4.   2  0200    NN59
D3              Lanie                                                                                                                                        N39
G03MA          McKenzie, Delanie                       1 2  50C   28.89   58.90                                                                F             N35
D03MA  SO  Winston, Toby                           A   0615200718MM 1001 16 UNOV11072026                              46.57Y     1 5     1  9.   1  0100    NN88
D3                                                                                                                                                           N67
G03MA          Winston, Toby                           1 2  50C   22.55   46.57                                                                F             N34
E03MA      AMAGETT  F 4007  1 UNOV  011072026                            3:59.68Y     1 5     2  4.                                            2N   0500X    N84
F03MA  SR      MAGETTAMcKenzie, Delanie                          0304200518F  1                           Lanie                                              N58
G03MA          McKenzie, Delanie                       1 8  50C   28.82   58.96                                                                F             N35
F03MA          MAGETTADolan, Reilly                                      FRF  2                                                                              N54
G03MA          Dolan, Reilly                           1 8  50C 1:30.54 2:06.07                                                                F             N44
F03MA  SO      MAGETTAPuckett, Morgan                            1118200717F  3                                                                              N46
G03MA          Puckett, Morgan                         1 8  50C 2:33.19 3:05.97                                                                F             N45
F03MA  SR      MAGETTAReck, Delaney                              0401200518F  4                                                                              N45
G03MA          Reck, Delaney                           1 8  50C 3:31.16 3:59.68                                                                F             N44
Z03Meet Res02Successful Build on 11/7/2026   1  1   2   2   165    85   29   116   266                                                                       N59`;

const SAMPLE_GOOGLE_SHEET_CSV = `Name\tClass\tEvent\tMin\tSec\tDate\tLocation\tCompetition\tPlace\tTime\tEvent\tSeconds
Ava Berry\tFr.\t1000 Free\t10\t46.20\t2026-10-24\tGettysburg PA\tGettysburg Invitational\t1\t10:46.20\tWomen 1000 Freestyle\t646.20
Kathleen Miller\tFr.\t1000 Free\t10\t52.10\t2026-10-24\tGettysburg PA\tGettysburg Invitational\t2\t10:52.10\tWomen 1000 Freestyle\t652.10
Delanie McKenzie\tJr.\t100 Back\t0\t58.15\t2026-02-20\tLancaster PA\tCentennial Conference Championships\t2\t58.15\tWomen 100 Backstroke\t58.15
Olivia Pyott\tSr.\t100 Breast\t1\t06.95\t2026-02-21\tLancaster PA\tCentennial Conference Championships\t1\t1:06.95\tWomen 100 Breaststroke\t66.95
Charles Schundler\tJr.\t200 Free\t1\t53.40\t2026-10-24\tGettysburg PA\tGettysburg Invitational\t1\t1:53.40\tMen 200 Freestyle\t113.40`;

const SAMPLE_RELAY_SHEET_CSV = `Names\tEvent\tMin\tSec\tDate\tLocation\tCompetition\tPlace\tTime\tEvent\tSeconds
Delanie McKenzie, Reilly Dolan, Morgan Puckett, Delaney Reck\t400 Medley Relay\t3\t59.68\t2026-11-07\tGettysburg PA\tGettysburg v Carnegie Mellon\t2\t3:59.68\tWomen 400 Medley Relay\t239.68
Delaney Reck, Delanie McKenzie, Kathleen Miller, Maya Peitler\t200 Free Relay\t1\t38.76\t2026-11-07\tGettysburg PA\tGettysburg v Carnegie Mellon\t1\t1:38.76\tWomen 200 Freestyle Relay\t98.76
Toby Winston, Ryan Burek, Edward Kim, Raphael Rudatsikira\t200 Free Relay\t1\t26.53\t2026-11-07\tGettysburg PA\tGettysburg v Carnegie Mellon\t1\t1:26.53\tMen 200 Freestyle Relay\t86.53`;

// ============================================================================
// PARSING & NORMALIZATION UTILITIES
// ============================================================================
const STROKE_MAP = {
  '1': 'Freestyle',
  '2': 'Backstroke',
  '3': 'Breaststroke',
  '4': 'Butterfly',
  '5': 'Individual Medley',
  '6': 'Freestyle Relay',
  '7': 'Medley Relay',
};

const IND_STROKE_MAP = {
  '1': 'Freestyle',
  '2': 'Backstroke',
  '3': 'Breaststroke',
  '4': 'Butterfly',
  '5': 'Individual Medley',
  '6': 'Diving',
};

const COURSE_MAP = {
  Y: 'SCY (Yards)',
  S: 'SCM (Short Course Meters)',
  L: 'LCM (Long Course Meters)',
  '1': 'SCM',
  '2': 'SCY',
  '3': 'LCM',
};

const GENDER_MAP = {
  M: 'Men',
  F: 'Women',
  X: 'Mixed',
};

const CANONICAL_EVENTS = [
  'Women 50 Freestyle',
  'Women 100 Freestyle',
  'Women 200 Freestyle',
  'Women 500 Freestyle',
  'Women 1000 Freestyle',
  'Women 1650 Freestyle',
  'Women 50 Backstroke',
  'Women 100 Backstroke',
  'Women 200 Backstroke',
  'Women 50 Breaststroke',
  'Women 100 Breaststroke',
  'Women 200 Breaststroke',
  'Women 50 Butterfly',
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
  'Men 50 Backstroke',
  'Men 100 Backstroke',
  'Men 200 Backstroke',
  'Men 50 Breaststroke',
  'Men 100 Breaststroke',
  'Men 200 Breaststroke',
  'Men 50 Butterfly',
  'Men 100 Butterfly',
  'Men 200 Butterfly',
  'Men 200 Individual Medley',
  'Men 400 Individual Medley',
  'Women 200 Freestyle Relay',
  'Women 400 Freestyle Relay',
  'Women 800 Freestyle Relay',
  'Women 200 Medley Relay',
  'Women 400 Medley Relay',
  'Men 200 Freestyle Relay',
  'Men 400 Freestyle Relay',
  'Men 800 Freestyle Relay',
  'Men 200 Medley Relay',
  'Men 400 Medley Relay',
];

const DEFAULT_MASTER_EVENTS = CANONICAL_EVENTS.map((evName, idx) => ({
  id: `ev-default-${idx + 1}`,
  canonicalName: evName,
  eventKey: evName.toLowerCase(),
  gender: evName.startsWith('Men') ? 'Men' : 'Women',
  isRelay: evName.toLowerCase().includes('relay'),
  aliases: [],
}));

// Sort athletes alphabetically by Last Name, then First Name
function compareByLastName(aName, bName) {
  const splitParts = (full) => {
    const clean = String(full || '').trim();
    if (!clean) return { last: '', first: '' };
    if (clean.includes(',')) {
      const [last, first] = clean.split(',').map((s) => s.trim());
      return { last: last.toLowerCase(), first: (first || '').toLowerCase() };
    }
    const parts = clean.split(/\s+/);
    const last = parts.length > 1 ? parts[parts.length - 1] : parts[0];
    const first = parts.length > 1 ? parts.slice(0, -1).join(' ') : '';
    return { last: last.toLowerCase(), first: first.toLowerCase() };
  };
  const a = splitParts(aName);
  const b = splitParts(bName);
  const lastCmp = a.last.localeCompare(b.last);
  return lastCmp !== 0 ? lastCmp : a.first.localeCompare(b.first);
}

// Normalize competition strings for resilient matching across slight punctuation/case differences
function normalizeCompKey(raw) {
  return String(raw || '')
    .toLowerCase()
    .replace(/['’.,-]/g, ' ')
    .replace(/\b(the|at|vs\.?|versus)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Normalize date strings into YYYY-MM-DD when possible
function normalizeDateIso(raw) {
  const d = parseFlexibleDate(raw);
  if (!d) return String(raw || '').trim();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatDisplayDateMDY(raw) {
  const clean = String(raw || '').trim();
  if (!clean) return '—';
  const d = parseFlexibleDate(clean);
  if (!d) return clean;
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

function sliceCol(line, start1Based, end1Based) {
  if (!line || line.length < start1Based) return '';
  return line.slice(start1Based - 1, end1Based).trim();
}

function formatDateSDIF(raw) {
  if (!raw || raw.length !== 8) return raw || '';
  const mm = parseInt(raw.slice(0, 2), 10);
  const dd = parseInt(raw.slice(2, 4), 10);
  const yyyy = raw.slice(4, 8);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  if (mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31) {
    return `${months[mm - 1]} ${dd}, ${yyyy}`;
  }
  return raw;
}

function formatSwimmerDisplay(rawName, preferredFirst) {
  if (!rawName) return 'Unknown Swimmer';
  const parts = rawName.split(',');
  if (parts.length < 2) return preferredFirst ? `${preferredFirst} ${rawName}` : rawName;
  const lastName = parts[0].trim();
  const firstPart = parts[1].trim();
  const displayFirst = preferredFirst && preferredFirst.trim() ? preferredFirst.trim() : firstPart;
  return `${displayFirst} ${lastName}`;
}

function formatSdifDate(raw) {
  if (!raw || raw.length < 8) return raw || '';
  const m = raw.slice(0, 2);
  const d = raw.slice(2, 4);
  const y = raw.slice(4, 8);
  if (/^\d{8}$/.test(raw)) {
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
  return new Date(yr, 7, 1);
}

// Extract all legal flat-start opening splits (e.g., 50 Back off 100 Back, 100 Free off 200 Free, 1000 Free off 1650 Free)
function extractLegalOpeningSplits(totalDistance, gender, stroke, eventLabel, splits, splitInterval = 50, splitType = 'C') {
  if (!Array.isArray(splits) || splits.length === 0) return [];
  const validByStroke = {
    Freestyle: [50, 100, 200, 500, 1000],
    Backstroke: [50, 100],
    Breaststroke: [50, 100],
    Butterfly: [50, 100],
    'Individual Medley': [],
  };
  const targets = validByStroke[stroke] || [];
  if (targets.length === 0) return [];

  const interval = splitInterval && splitInterval > 0 ? splitInterval : 50;
  let runningSec = 0;
  const legal = [];

  splits.forEach((rawVal, idx) => {
    const valStr = typeof rawVal === 'object' ? rawVal.cumulative : rawVal;
    const valSec = timeToSeconds(valStr);
    if (valSec === null) return;
    if (splitType === 'I') {
      runningSec += valSec;
    } else {
      runningSec = valSec;
    }
    const distAtSplit = (idx + 1) * interval;
    if (distAtSplit < totalDistance && targets.includes(distAtSplit) && runningSec > 0) {
      const cumFormatted = splitType === 'I' ? secondsToTime(runningSec) : String(valStr).trim();
      legal.push({
        splitDistance: distAtSplit,
        eventLabel: `${gender} ${distAtSplit} ${stroke}`,
        eventKey: normalizeEventKey(`${gender} ${distAtSplit} ${stroke}`),
        time: cumFormatted,
        seconds: runningSec,
        context: `${distAtSplit} Split in ${eventLabel}`,
      });
    }
  });
  return legal;
}

// ============================================================================
// CORE FIXED-WIDTH HY-TEK SDIF (.CL2 / .SD3) PARSER (EXACT ORIGINAL ENGINE)
// ============================================================================
function parseSDIFContent(content) {
  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) {
    throw new Error('The uploaded file is empty.');
  }

  const validPrefixes = ['A0', 'B1', 'B2', 'C1', 'C2', 'D0', 'D1', 'D2', 'D3', 'E0', 'F0', 'G0', 'Z0'];
  const hasValidHeader = lines.some((l) => validPrefixes.includes(l.slice(0, 2)));
  if (!hasValidHeader) {
    throw new Error(
      'Invalid file format. No standard SDIF/CL2 record identifiers (A0, B1, C1, D0, E0) were found.'
    );
  }

  const meetInfo = {
    name: 'Swim Meet Results',
    city: '',
    state: '',
    startDate: '',
    endDate: '',
    isoDate: '',
    endIsoDate: '',
    software: '',
  };

  const teamsMap = new Map();
  const individualResults = [];
  const relayResults = [];

  let currentTeamContext = null;
  let lastRecordType = null;
  let lastD0 = null;
  let lastE0 = null;
  let lastF0 = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const recType = line.slice(0, 2);

    if (recType === 'A0') {
      meetInfo.software = sliceCol(line, 44, 63) || sliceCol(line, 64, 73);
    } else if (recType === 'B1') {
      meetInfo.name = sliceCol(line, 12, 41) || 'Unnamed Swim Meet';
      meetInfo.city = sliceCol(line, 86, 105);
      meetInfo.state = sliceCol(line, 106, 107);
      const rawStartDate = sliceCol(line, 122, 129);
      const rawEndDate = sliceCol(line, 130, 137);
      meetInfo.startDate = formatDateSDIF(rawStartDate);
      meetInfo.endDate = formatDateSDIF(rawEndDate);
      meetInfo.isoDate = formatSdifDate(rawStartDate);
      meetInfo.endIsoDate = formatSdifDate(rawEndDate);
    } else if (recType === 'C1') {
      const code = sliceCol(line, 12, 17);
      const name = sliceCol(line, 18, 47) || code;
      const city = sliceCol(line, 110, 129);
      const state = sliceCol(line, 130, 131);
      if (code) {
        currentTeamContext = code;
        if (!teamsMap.has(code)) {
          teamsMap.set(code, {
            code,
            name,
            city,
            state,
            swimmers: new Map(),
          });
        }
      }
    } else if (recType === 'D0') {
      const rawTeamSlice = sliceCol(line, 4, 9);
      let teamCode = currentTeamContext || rawTeamSlice || 'UNAT';
      if (!currentTeamContext && rawTeamSlice) {
        for (const [registeredCode] of teamsMap.entries()) {
          if (registeredCode === rawTeamSlice || registeredCode.startsWith(rawTeamSlice)) {
            teamCode = registeredCode;
            break;
          }
        }
      }
      
      const classYear = sliceCol(line, 8, 9);
      const swimmerName = sliceCol(line, 12, 39);
      // Exact 1-based SDIF D0 column layout:
      // Cols 56-63: Birthdate (MMDDYYYY)
      // Cols 64-65: Age / Class ('20', 'FR', etc.)
      // Col 66: Swimmer Sex ('M' / 'F')
      // Col 67: Event Sex ('M' / 'F' / 'X')
      // Cols 68-71: Event Distance ('  50', ' 100', '1000')
      // Col 72: Stroke Code ('1'..'5')
      // Cols 73-76: Event Number ('  3', '  4', ' 14')
      const altClassYear = sliceCol(line, 64, 65);
      const resolvedClass = ['FR', 'SO', 'JR', 'SR', 'GR'].includes(classYear)
        ? classYear
        : ['FR', 'SO', 'JR', 'SR', 'GR'].includes(altClassYear)
        ? altClassYear
        : '';
      const genderCode = sliceCol(line, 67, 67) || sliceCol(line, 66, 66);
      const distance = sliceCol(line, 68, 71);
      const strokeCode = sliceCol(line, 72, 72);
      const eventNumber = sliceCol(line, 73, 76);
      const rawSwimDate = sliceCol(line, 87, 94);
      const swimIsoDate =
        /^\d{8}$/.test(rawSwimDate) && rawSwimDate !== '00000000'
          ? formatSdifDate(rawSwimDate)
          : '';
      // Verified 1-based Hy-Tek WMM 8.0 SDIF D0 Time Columns:
      // Cols 99-106: Seed Time | Cols 108-115: Prelim Time | Cols 126-133: Finals Time
      const seedTimeRaw = sliceCol(line, 99, 106);
      const prelimTimeRaw = sliceCol(line, 108, 115);
      const finalsTimeRaw = sliceCol(line, 126, 133);
      const courseCode =
        (finalsTimeRaw || prelimTimeRaw || seedTimeRaw).slice(-1) || sliceCol(line, 133, 134);

      const isDiving = strokeCode === '6' || /H$/i.test(distance);
      const isExhibition =
        sliceCol(line, 155, 162).toUpperCase().includes('X') ||
        (parseInt(eventNumber, 10) || 0) >= 100;
      const isTimeTrial = (parseInt(eventNumber, 10) || 0) >= 100;

      // Fixed-width 1-based Hy-Tek WMM 8.0 Heat / Lane / Place / Points (supports 10-lane pools without spaces):
      // Col 135: Prelim Heat | Cols 136-137: Prelim Lane
      // Col 139: Finals Heat | Cols 140-141: Finals Lane
      // Cols 142-144: Prelim Place | Cols 145-147: Finals Place | Cols 148-153: Points
      const parseIntField = (s) => {
        const clean = String(s || '').replace(/\./g, '').trim();
        return /^\d+$/.test(clean) ? parseInt(clean, 10) : 0;
      };

      const pHeatNum = parseIntField(sliceCol(line, 135, 135));
      const pLaneNum = parseIntField(sliceCol(line, 136, 137));
      const fHeatNum = parseIntField(sliceCol(line, 139, 139));
      const fLaneNum = parseIntField(sliceCol(line, 140, 141));
      const pPlaceNum = parseIntField(sliceCol(line, 142, 144));
      const fPlaceNum = parseIntField(sliceCol(line, 145, 147));
      const ptsRaw = sliceCol(line, 148, 153);
      const ptsVal = parseFloat(ptsRaw);
      const points = !Number.isNaN(ptsVal) && ptsVal > 0 ? ptsVal : 0;

      const prelimHeat = pHeatNum > 0 ? String(pHeatNum) : '';
      const prelimLane = pLaneNum > 0 ? String(pLaneNum) : '';
      const finalsHeat = fHeatNum > 0 ? String(fHeatNum) : '';
      const finalsLane = fLaneNum > 0 ? String(fLaneNum) : '';
      const prelimPlace = pPlaceNum > 0 ? pPlaceNum : null;
      const finalsPlace = fPlaceNum > 0 ? fPlaceNum : null;

      const place = finalsTimeRaw ? finalsPlace : prelimPlace;
      const heat = finalsTimeRaw ? finalsHeat || prelimHeat : prelimHeat || finalsHeat;
      const lane = finalsTimeRaw ? finalsLane || prelimLane : prelimLane || finalsLane;

      const strokeName = IND_STROKE_MAP[strokeCode] || STROKE_MAP[strokeCode] || `Stroke ${strokeCode}`;
      const genderLabel = GENDER_MAP[genderCode] || genderCode || 'Open';
      const distDisplay = isDiving
        ? distance.toUpperCase() === '1H'
          ? '1M'
          : distance.toUpperCase() === '3H'
          ? '3M'
          : distance
        : distance;
      const eventLabel = isDiving
        ? `${genderLabel} ${distDisplay} Diving${isTimeTrial ? ' (Time Trial)' : ''}`
        : `${genderLabel} ${distDisplay} ${strokeName}${isTimeTrial ? ' (Time Trial)' : ''}`;

      const parseScoreOrTime = (raw) => {
        if (!raw) return null;
        if (isDiving) {
          const clean = raw.replace(/[A-Z]+$/i, '').trim();
          const v = parseFloat(clean);
          return Number.isNaN(v) ? null : v;
        }
        return timeToSeconds(raw);
      };

      const parsedFinalSec = parseScoreOrTime(finalsTimeRaw);
      const parsedPrelimSec = parseScoreOrTime(prelimTimeRaw);
      const parsedSeedSec = parseScoreOrTime(seedTimeRaw);

      // Primary display/ranking time: Finals if swam, otherwise Prelims
      const primaryTimeStr = finalsTimeRaw || prelimTimeRaw || 'NT';
      const primarySec =
        parsedFinalSec !== null
          ? parsedFinalSec
          : parsedPrelimSec !== null
          ? parsedPrelimSec
          : Infinity;
      const primaryRound = finalsTimeRaw
        ? 'Finals'
        : prelimTimeRaw
        ? 'Prelims'
        : 'Finals';

      const record = {
        id: `ind-${i}-${swimmerName}-${eventNumber}`,
        type: 'individual',
        teamCode,
        teamName: teamsMap.get(teamCode)?.name || teamCode,
        swimmerName,
        preferredFirst: '',
        classYear: resolvedClass,
        genderCode,
        genderLabel,
        distance: parseInt(distance, 10) || distDisplay,
        strokeCode,
        strokeName,
        isDiving,
        isExhibition,
        isTimeTrial,
        eventNumber: parseInt(eventNumber, 10) || eventNumber,
        eventLabel,
        swimDate: swimIsoDate || meetInfo.isoDate || '',
        seedTime: seedTimeRaw || '',
        seedSeconds: parsedSeedSec === null ? Infinity : parsedSeedSec,
        prelimTime: prelimTimeRaw || '',
        prelimSeconds: parsedPrelimSec === null ? Infinity : parsedPrelimSec,
        prelimPlace,
        prelimHeat,
        prelimLane,
        finalsOnlyTime: finalsTimeRaw || '',
        finalsOnlySeconds: parsedFinalSec === null ? Infinity : parsedFinalSec,
        finalsHeat,
        finalsLane,
        finalsTime: primaryTimeStr,
        timeSeconds: primarySec,
        primaryRound,
        course: isDiving ? 'Diving' : COURSE_MAP[courseCode] || courseCode || 'SCY',
        heat,
        lane,
        place: place || null,
        points,
        splitInterval: 50,
        splitType: 'C',
        splitPages: [],
        splits: [],
        prelimSplitPages: [],
        prelimSplits: [],
        finalsSplitPages: [],
        finalsSplits: [],
      };

      individualResults.push(record);
      lastD0 = record;
      lastRecordType = 'D0';

      if (!teamsMap.has(teamCode)) {
        teamsMap.set(teamCode, {
          code: teamCode,
          name: teamCode,
          city: '',
          state: '',
          swimmers: new Map(),
        });
      }
      const roster = teamsMap.get(teamCode).swimmers;
      if (!roster.has(swimmerName)) {
        roster.set(swimmerName, {
          name: swimmerName,
          preferredFirst: '',
          gender: genderLabel,
          classYear: record.classYear,
          events: [],
        });
      }
      roster.get(swimmerName).events.push(`${distDisplay} ${strokeName} (${primaryTimeStr})`);
    } else if (recType === 'D3') {
      // Cols 17-31 hold Preferred First Name directly after the 14-char swimmer ID/checksum (cols 3-16)
      const prefFirst = sliceCol(line, 17, 31).trim();
      if (prefFirst && lastD0) {
        lastD0.preferredFirst = prefFirst;
        const roster = teamsMap.get(lastD0.teamCode)?.swimmers;
        if (roster && roster.has(lastD0.swimmerName)) {
          roster.get(lastD0.swimmerName).preferredFirst = prefFirst;
        }
      }
    } else if (recType === 'E0') {
      const relayLetter = sliceCol(line, 12, 12) || 'A';
      const teamCode = sliceCol(line, 13, 18) || currentTeamContext || 'UNAT';
      const genderCode = sliceCol(line, 21, 21);
      const distance = sliceCol(line, 23, 25);
      const strokeCode = sliceCol(line, 26, 26);
      const eventNumber = sliceCol(line, 27, 30);
      const seedTimeRaw = sliceCol(line, 59, 67);
      const finalsTimeRaw = sliceCol(line, 72, 80);
      const courseCode = sliceCol(line, 81, 81);

      const tailTokens = line.slice(81, 115).trim().split(/\s+/);
      const heat = tailTokens[0] || '';
      const lane = tailTokens[1] || '';
      const placeRaw = (tailTokens[2] || '').replace(/\./g, '');
      const place = /^\d+$/.test(placeRaw) ? parseInt(placeRaw, 10) : null;
      const pointsToken = tailTokens[3] || '';
      const points = /^\d+\.$/.test(pointsToken) ? parseFloat(pointsToken) : 0;

      const strokeName = STROKE_MAP[strokeCode] || 'Relay';
      const genderLabel = GENDER_MAP[genderCode] || genderCode || 'Mixed';
      const eventLabel = `${genderLabel} ${distance} ${strokeName}`;
      const parsedSec = timeToSeconds(finalsTimeRaw);
      const parsedSeedSec = timeToSeconds(seedTimeRaw);

      const relayObj = {
        id: `rel-${i}-${teamCode}-${relayLetter}-${eventNumber}`,
        type: 'relay',
        relayLetter,
        teamCode,
        teamName: teamsMap.get(teamCode)?.name || teamCode,
        relayTitle: `${teamsMap.get(teamCode)?.name || teamCode} "${relayLetter}"`,
        genderCode,
        genderLabel,
        distance: parseInt(distance, 10) || distance,
        strokeCode,
        strokeName,
        eventNumber: parseInt(eventNumber, 10) || eventNumber,
        eventLabel,
        seedTime: seedTimeRaw || '',
        seedSeconds: parsedSeedSec === null ? Infinity : parsedSeedSec,
        finalsTime: finalsTimeRaw || 'NT',
        timeSeconds: parsedSec === null ? Infinity : parsedSec,
        course: COURSE_MAP[courseCode] || courseCode || 'SCY',
        heat,
        lane,
        place,
        points,
        splitInterval: 50,
        splitType: 'C',
        splitPages: [],
        legs: [],
        splits: [],
      };

      relayResults.push(relayObj);
      lastE0 = relayObj;
      lastRecordType = 'E0';
    } else if (recType === 'F0') {
      const swimmerName = sliceCol(line, 23, 50);
      const legOrderRaw = sliceCol(line, 77, 77);
      const classYear = sliceCol(line, 8, 9);
      const altClassYear = sliceCol(line, 72, 73);
      const resolvedLegClass = ['FR', 'SO', 'JR', 'SR', 'GR'].includes(classYear)
        ? classYear
        : ['FR', 'SO', 'JR', 'SR', 'GR'].includes(altClassYear)
        ? altClassYear
        : '';
      // Cols 87-100 hold the 14-char swimmer ID/checksum; cols 101-115 hold Preferred First Name
      const rawPrefFirst = sliceCol(line, 101, 115).trim();
      const prefFirst =
        rawPrefFirst && !/^[0-9A-F]{4,}/i.test(rawPrefFirst) ? rawPrefFirst : '';

      const parsedLegOrder = /^[1-4]$/.test(legOrderRaw)
        ? parseInt(legOrderRaw, 10)
        : lastE0
        ? lastE0.legs.length + 1
        : 1;

      const legObj = {
        legOrder: parsedLegOrder,
        swimmerName,
        preferredFirst: prefFirst,
        classYear: resolvedLegClass,
        splitInterval: 50,
        splitType: 'C',
        splitPages: [],
        splits: [],
      };

      if (lastE0) {
        lastE0.legs.push(legObj);
        lastE0.legs.sort((a, b) => a.legOrder - b.legOrder);

        const tCode = lastE0.teamCode;
        if (teamsMap.has(tCode) && swimmerName) {
          const roster = teamsMap.get(tCode).swimmers;
          if (!roster.has(swimmerName)) {
            roster.set(swimmerName, {
              name: swimmerName,
              preferredFirst: prefFirst,
              gender: lastE0.genderLabel,
              classYear: legObj.classYear,
              events: [`${lastE0.distance} ${lastE0.strokeName} (Relay Leg ${legObj.legOrder})`],
            });
          }
        }
      }
      lastF0 = legObj;
      lastRecordType = 'F0';
    } else if (recType === 'G0') {
      const seqRaw = line.slice(55, 56).trim();
      const seqNum = /^\d+$/.test(seqRaw) ? parseInt(seqRaw, 10) : 1;
      const intervalRaw = line.slice(58, 62).trim();
      const splitInterval = /^\d+$/.test(intervalRaw) ? parseInt(intervalRaw, 10) : 50;
      const splitType = line.slice(62, 63).trim() || 'C';
      // Col 143 holds 'P' (Prelims) or 'F' (Finals) on G0 split lines
      const roundFlag = line.slice(142, 144).trim().toUpperCase();

      const parsedSplits = [];
      for (let s = 0; s < 10; s++) {
        const startIdx = 63 + s * 8;
        const endIdx = 63 + (s + 1) * 8;
        if (line.length <= startIdx) break;
        const chunk = line.slice(startIdx, endIdx).trim();
        if (chunk && /[\d:.]/.test(chunk)) {
          parsedSplits.push(chunk);
        }
      }

      if (parsedSplits.length > 0) {
        const attachSplits = (target) => {
          if (!target) return;
          target.splitInterval = splitInterval;
          target.splitType = splitType;
          if (target.type === 'individual') {
            if (roundFlag === 'P') {
              target.prelimSplitPages.push({ seq: seqNum, splits: parsedSplits });
              target.prelimSplitPages.sort((a, b) => a.seq - b.seq);
              target.prelimSplits = target.prelimSplitPages.flatMap((p) => p.splits);
            } else {
              target.finalsSplitPages.push({ seq: seqNum, splits: parsedSplits });
              target.finalsSplitPages.sort((a, b) => a.seq - b.seq);
              target.finalsSplits = target.finalsSplitPages.flatMap((p) => p.splits);
            }
            target.splits =
              target.finalsSplits.length > 0 ? target.finalsSplits : target.prelimSplits;
          } else {
            target.splitPages.push({ seq: seqNum, splits: parsedSplits });
            target.splitPages.sort((a, b) => a.seq - b.seq);
            target.splits = target.splitPages.flatMap((p) => p.splits);
          }
        };

        if (lastRecordType === 'D0' && lastD0) {
          attachSplits(lastD0);
        } else if (lastRecordType === 'F0' && lastF0 && lastE0) {
          attachSplits(lastF0);
          lastE0.legs.sort((a, b) => a.legOrder - b.legOrder);
          lastE0.splitInterval = splitInterval;
          lastE0.splitType = splitType;
          lastE0.splits = lastE0.legs.flatMap((leg) => leg.splits);
        } else if (lastRecordType === 'E0' && lastE0) {
          attachSplits(lastE0);
        }
      }
    }
  }

  // Propagate preferredFirst and classYear across all individual & relay appearances of the same swimmer
  const preferredBySwimmerKey = new Map();
  const classBySwimmerKey = new Map();
  teamsMap.forEach((team, tCode) => {
    team.swimmers.forEach((sw, sName) => {
      if (sw.preferredFirst) {
        preferredBySwimmerKey.set(`${tCode}|${sName}`, sw.preferredFirst);
      }
      if (sw.classYear) {
        classBySwimmerKey.set(`${tCode}|${sName}`, sw.classYear);
      }
    });
  });

  individualResults.forEach((rec) => {
    if (!rec.preferredFirst) {
      rec.preferredFirst = preferredBySwimmerKey.get(`${rec.teamCode}|${rec.swimmerName}`) || '';
    }
    if (!rec.classYear) {
      rec.classYear = classBySwimmerKey.get(`${rec.teamCode}|${rec.swimmerName}`) || '';
    }
  });

  relayResults.forEach((rel) => {
    rel.legs.forEach((leg) => {
      if (!leg.preferredFirst) {
        leg.preferredFirst = preferredBySwimmerKey.get(`${rel.teamCode}|${leg.swimmerName}`) || '';
      }
      if (!leg.classYear) {
        leg.classYear = classBySwimmerKey.get(`${rel.teamCode}|${leg.swimmerName}`) || '';
      }
    });
  });

  const teams = Array.from(teamsMap.values()).map((t) => ({
    ...t,
    swimmerList: Array.from(t.swimmers.values()).sort((a, b) => a.name.localeCompare(b.name)),
  }));

  const teamScoresMap = new Map();
  teams.forEach((t) => {
    teamScoresMap.set(t.code, {
      code: t.code,
      name: t.name,
      womenPoints: 0,
      menPoints: 0,
      totalPoints: 0,
    });
  });

  const addScore = (teamCode, genderLabel, pts) => {
    if (!pts || pts <= 0) return;
    if (!teamScoresMap.has(teamCode)) {
      teamScoresMap.set(teamCode, {
        code: teamCode,
        name: teamCode,
        womenPoints: 0,
        menPoints: 0,
        totalPoints: 0,
      });
    }
    const entry = teamScoresMap.get(teamCode);
    if (genderLabel === 'Women') entry.womenPoints += pts;
    else if (genderLabel === 'Men') entry.menPoints += pts;
    entry.totalPoints += pts;
  };

  individualResults.forEach((r) => addScore(r.teamCode, r.genderLabel, r.points));
  relayResults.forEach((r) => addScore(r.teamCode, r.genderLabel, r.points));

  const teamScores = Array.from(teamScoresMap.values()).sort(
    (a, b) => b.totalPoints - a.totalPoints
  );

  const totalUniqueSwimmers = teams.reduce((acc, t) => acc + t.swimmerList.length, 0);

  return {
    meetInfo,
    teams,
    teamScores,
    individualResults,
    relayResults,
    stats: {
      totalTeams: teams.length,
      totalSwimmers: totalUniqueSwimmers,
      totalIndividualSwims: individualResults.length,
      totalRelays: relayResults.length,
      totalSwims: individualResults.length + relayResults.length,
    },
  };
}

function calculateSplitBreakdown(rawSplits, totalDistance, splitInterval = 50, splitType = 'C') {
  if (!rawSplits || rawSplits.length === 0) return { rows: [], stats: null };

  const interval =
    splitInterval && splitInterval > 0
      ? splitInterval
      : totalDistance && rawSplits.length > 0
      ? Math.round(totalDistance / rawSplits.length)
      : 50;

  let prevCumSeconds = 0;
  const rows = rawSplits.map((splitStr, idx) => {
    const valSec = timeToSeconds(splitStr) ?? Infinity;
    let cumSec = Infinity;
    let lapSec = Infinity;

    if (splitType === 'I') {
      lapSec = valSec;
      cumSec = isFinite(valSec) ? prevCumSeconds + valSec : Infinity;
    } else {
      cumSec = valSec;
      lapSec = isFinite(cumSec) ? cumSec - prevCumSeconds : Infinity;
    }

    if (isFinite(cumSec)) {
      prevCumSeconds = cumSec;
    }

    return {
      index: idx + 1,
      distance: (idx + 1) * interval,
      distanceLabel: `${(idx + 1) * interval}y`,
      cumulative: splitType === 'I' ? secondsToTime(cumSec) : splitStr,
      cumulativeSec: cumSec,
      lap: isFinite(lapSec) && lapSec > 0 ? secondsToTime(lapSec) : splitStr,
      lapSec: isFinite(lapSec) && lapSec > 0 ? lapSec : Infinity,
    };
  });

  const validLaps = rows.filter((r) => isFinite(r.lapSec) && r.lapSec > 0);
  if (validLaps.length === 0) {
    return { rows, stats: null };
  }

  const allLapSecs = validLaps.map((r) => r.lapSec);
  const minLap = Math.min(...allLapSecs);
  const maxLap = Math.max(...allLapSecs);
  const avgLap = allLapSecs.reduce((acc, v) => acc + v, 0) / allLapSecs.length;

  let halfDiff = null;
  if (rows.length >= 2 && rows.length % 2 === 0) {
    const mid = rows.length / 2;
    const firstHalfSec = rows[mid - 1].cumulativeSec;
    const totalSec = rows[rows.length - 1].cumulativeSec;
    if (isFinite(firstHalfSec) && isFinite(totalSec)) {
      const secondHalfSec = totalSec - firstHalfSec;
      halfDiff = secondHalfSec - firstHalfSec;
    }
  }

  return {
    rows: rows.map((r) => ({
      ...r,
      isFastest: validLaps.length > 1 && Math.abs(r.lapSec - minLap) < 0.005,
      isSlowest: validLaps.length > 1 && Math.abs(r.lapSec - maxLap) < 0.005,
    })),
    stats: {
      interval,
      minLap,
      maxLap,
      avgLap: secondsToTime(avgLap),
      avgLapSec: avgLap,
      halfDiff,
    },
  };
}

function calculateRelayLegBreakdown(relay) {
  let prevCumulativeSec = 0;
  const interval = relay.splitInterval || 50;

  return relay.legs.map((leg) => {
    const legSubSplits = [];
    const legStartSec = prevCumulativeSec;

    if (leg.splits && leg.splits.length > 0) {
      leg.splits.forEach((cumStr, sIdx) => {
        const cumSec = timeToSeconds(cumStr) ?? Infinity;
        const subLapSec = isFinite(cumSec) ? cumSec - prevCumulativeSec : Infinity;
        if (isFinite(cumSec)) {
          prevCumulativeSec = cumSec;
        }
        legSubSplits.push({
          subIndex: sIdx + 1,
          subDistance: `${(sIdx + 1) * interval}y`,
          cumulative: cumStr,
          lap: isFinite(subLapSec) && subLapSec > 0 ? secondsToTime(subLapSec) : '-',
        });
      });
    }

    const legEndSec = prevCumulativeSec;
    const totalLegSec = legEndSec > legStartSec ? legEndSec - legStartSec : Infinity;
    const endCumulativeStr =
      leg.splits && leg.splits.length > 0 ? leg.splits[leg.splits.length - 1] : '-';

    return {
      ...leg,
      subSplits: legSubSplits,
      legTotalTime: isFinite(totalLegSec) ? secondsToTime(totalLegSec) : '-',
      endCumulativeTime: endCumulativeStr,
    };
  });
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
      return;
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
    const rawCompetition = cols[7] || '';
    const placeRaw = (cols[8] || '').trim().toUpperCase();
    const timeCol = cols[9] || '';
    const longEvent = cols[10] || shortEvent;
    const totalSecondsCol = parseFloat(cols[11]);

    // Extract round markers like "(SF)", "(P)", "(Prelims)", or "(Time Trial)" from Competition string
    let round = 'Finals';
    let competition = rawCompetition;
    if (/\((sf|p|prelim|prelims|preliminary)\)/i.test(rawCompetition)) {
      round = 'Prelims';
      competition = rawCompetition
        .replace(/\((sf|p|prelim|prelims|preliminary)\)/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
    } else if (/\((tt|time\s*trial)\)/i.test(rawCompetition)) {
      round = 'Time Trial';
      competition = rawCompetition
        .replace(/\((tt|time\s*trial)\)/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
    }

    let seconds = !Number.isNaN(totalSecondsCol) ? totalSecondsCol : timeToSeconds(timeCol);
    if ((seconds === null || Number.isNaN(seconds)) && !Number.isNaN(secVal)) {
      seconds = (!Number.isNaN(minVal) ? minVal * 60 : 0) + secVal;
    }
    if (seconds === null || Number.isNaN(seconds) || seconds <= 0) return;

    const fallbackGender = genderLookupMap[swimmerKey] || '';
    const rawEventInput = longEvent || shortEvent;
    const eventKey = normalizeEventKey(rawEventInput, fallbackGender);

    // 'OFFICIAL' = standard individual swim (counts for Records, Top-10, & Full-Distance PB/SB)
    // 'RELAY_LEADOFF' = R (flat-start 1st leg—counts as Official for Records, Top-10, & Full-Distance PB/SB)
    // 'INTERMEDIATE_SPLIT' = S (flat-start intermediate split—counts as Official for Records/Top-10, noted with 'S', tracked separately for Split PB/SB)
    let swimType = 'OFFICIAL';
    if (placeRaw === 'R' || placeRaw === 'RS' || placeRaw === 'LR') {
      swimType = 'RELAY_LEADOFF';
    } else if (placeRaw === 'S' || placeRaw === 'SP') {
      swimType = 'INTERMEDIATE_SPLIT';
    }

    rows.push({
      id: `hist-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
      swimmerName,
      swimmerKey,
      classYear,
      rawEventInput,
      eventKey,
      eventLabel: eventKey ? toTitleEventLabel(eventKey) : rawEventInput,
      time: timeCol || secondsToTime(seconds),
      seconds,
      date: normalizeDateIso(dateStr),
      dateObj: parseFlexibleDate(dateStr),
      location,
      competition,
      round,
      place: placeRaw === 'LR' ? 'R' : placeRaw,
      swimType,
      isOfficial: true,
      splitContext: swimType === 'INTERMEDIATE_SPLIT' ? 'Intermediate Distance Split' : '',
      source: 'sheet_import',
    });
  });

  return rows;
}

// ============================================================================
// GOOGLE SHEET 11-COLUMN HISTORICAL RELAY PARSER
// Columns: Names | Event | Min | Sec | Date | Location | Competition | Place | Time | Event | Seconds
// ============================================================================
function parseGoogleSheetRelayHistory(rawText, genderLookupMap = {}) {
  const lines = String(rawText || '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return [];

  const delimiter = lines[0].includes('\t') ? '\t' : ',';
  const rows = [];

  const parseCsvLine = (line) => {
    if (delimiter === '\t') {
      return line.split('\t').map((c) => c.trim().replace(/^"|"$/g, ''));
    }
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  };

  lines.forEach((line, idx) => {
    const cols = parseCsvLine(line);
    if (idx === 0 && (cols[0] || '').toLowerCase() === 'names') return;

    const rawNamesCol = cols[0] || '';
    if (!rawNamesCol) return;

    const legNames = rawNamesCol
      .split(',')
      .map((n) => n.replace(/\([^)]*\)/g, '').trim())
      .filter(Boolean);
    if (legNames.length === 0) return;

    const shortEvent = cols[1] || '';
    const minVal = parseFloat(cols[2]);
    const secVal = parseFloat(cols[3]);
    const dateStr = cols[4] || '';
    const location = cols[5] || '';
    const rawCompetition = cols[6] || '';
    const placeRaw = (cols[7] || '').trim().toUpperCase();
    const timeCol = cols[8] || '';
    const longEvent = cols[9] || shortEvent;
    const totalSecondsCol = parseFloat(cols[10]);

    let round = 'Finals';
    let competition = rawCompetition;
    if (/\((sf|p|prelim|prelims|preliminary)\)/i.test(rawCompetition)) {
      round = 'Prelims';
      competition = rawCompetition
        .replace(/\((sf|p|prelim|prelims|preliminary)\)/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
    } else if (/\((tt|time\s*trial)\)/i.test(rawCompetition)) {
      round = 'Time Trial';
      competition = rawCompetition
        .replace(/\((tt|time\s*trial)\)/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
    }

    let seconds = !Number.isNaN(totalSecondsCol) ? totalSecondsCol : timeToSeconds(timeCol);
    if ((seconds === null || Number.isNaN(seconds)) && !Number.isNaN(secVal)) {
      seconds = (!Number.isNaN(minVal) ? minVal * 60 : 0) + secVal;
    }
    if (seconds === null || Number.isNaN(seconds) || seconds <= 0) return;

    let inferredGender = '';
    for (const leg of legNames) {
      const g = genderLookupMap[normalizeSwimmerKey(leg)];
      if (g) {
        inferredGender = g;
        break;
      }
    }

    const rawEventInput = longEvent || shortEvent;
    let eventKey = normalizeEventKey(rawEventInput, inferredGender);
    if (eventKey && !eventKey.endsWith('relay')) {
      eventKey = `${eventKey} relay`;
    }

    const displayLineup = legNames.join(', ');

    rows.push({
      id: `hist-rel-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
      swimmerName: displayLineup,
      swimmerKey: normalizeSwimmerKey(displayLineup),
      relayLegs: legNames,
      classYear: '',
      rawEventInput,
      eventKey,
      eventLabel: eventKey ? toTitleEventLabel(eventKey) : rawEventInput,
      time: timeCol || secondsToTime(seconds),
      seconds,
      date: normalizeDateIso(dateStr),
      dateObj: parseFlexibleDate(dateStr),
      location,
      competition,
      round,
      place: placeRaw,
      swimType: 'RELAY_TEAM',
      isOfficial: true,
      splitContext: '',
      source: 'relay_sheet_import',
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
  const [historySubTab, setHistorySubTab] = useState('import'); // 'import' | 'roster' | 'competitions' | 'events' | 'database'
  const [includeSplitsOnCommit, setIncludeSplitsOnCommit] = useState(false);

  // Active Meet State
  const [parsedData, setParsedData] = useState(null);
  const [meetErrorMsg, setMeetErrorMsg] = useState('');
  const [isDraggingMeet, setIsDraggingMeet] = useState(false);
  const [meetSubTab, setMeetSubTab] = useState('individual'); // 'individual' | 'relays' | 'roster'
  const [selectedTeam, setSelectedTeam] = useState(() => {
    try {
      return localStorage.getItem('swimmeet_primary_team_v1') || 'ALL';
    } catch {
      return 'ALL';
    }
  });
  const [selectedEventFilter, setSelectedEventFilter] = useState('ALL');
  const [genderFilter, setGenderFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'eventNumber', direction: 'asc' });
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [copiedRecap, setCopiedRecap] = useState(false);

  // Historical Database, Master Roster, Master Competitions, & Master Events State
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

  const [masterEvents, setMasterEvents] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('swimmeet_master_events_v1') || 'null');
      return Array.isArray(saved) && saved.length > 0 ? saved : DEFAULT_MASTER_EVENTS;
    } catch {
      return DEFAULT_MASTER_EVENTS;
    }
  });

  // Staging & Importer State
  const [sheetImportMode, setSheetImportMode] = useState('auto'); // 'auto' | 'individual' | 'relay'
  const [pasteSheetText, setPasteSheetText] = useState('');
  const [stagedHistoryRows, setStagedHistoryRows] = useState([]);
  const [reconcileSelections, setReconcileSelections] = useState({});
  const [benchmarkStatusMsg, setBenchmarkStatusMsg] = useState('');
  const [meetReconcileSelections, setMeetReconcileSelections] = useState({});
  const [meetClassOverrides, setMeetClassOverrides] = useState({});
  const [meetDateOverrides, setMeetDateOverrides] = useState({});
  const [dayRangeStartEvent, setDayRangeStartEvent] = useState('');
  const [dayRangeEndEvent, setDayRangeEndEvent] = useState('');
  const [dayRangeTargetDate, setDayRangeTargetDate] = useState('');
  const [excludedMeetCommitIds, setExcludedMeetCommitIds] = useState(new Set());

  // Master List Quick-Add & Bulk Form State
  const [newAthleteName, setNewAthleteName] = useState('');
  const [newAthleteGender, setNewAthleteGender] = useState('Women');
  const [newAthleteActive, setNewAthleteActive] = useState(true);
  const [rosterSearchQuery, setRosterSearchQuery] = useState('');
  const [rosterFilterGender, setRosterFilterGender] = useState('ALL');
  const [rosterFilterActive, setRosterFilterActive] = useState('ALL');
  const [editingRosterId, setEditingRosterId] = useState(null);
  const [editRosterDraft, setEditRosterDraft] = useState({
    canonicalName: '',
    gender: 'Women',
    isActive: true,
    aliasesText: '',
    propagateToDb: true,
  });
  const [bulkRosterText, setBulkRosterText] = useState('');
  const [newCompName, setNewCompName] = useState('');
  const [newCompDate, setNewCompDate] = useState('');
  const [newCompLocation, setNewCompLocation] = useState('');
  const [bulkCompText, setBulkCompText] = useState('');
  const [newEventName, setNewEventName] = useState('');
  const [newEventAlias, setNewEventAlias] = useState('');

  // Committed Database Filter, Sort, Pagination & Bulk Delete State
  const [dbSearchName, setDbSearchName] = useState('');
  const [dbFilterEvent, setDbFilterEvent] = useState('ALL');
  const [dbFilterCompetition, setDbFilterCompetition] = useState('ALL');
  const [dbFilterDate, setDbFilterDate] = useState('');
  const [dbFilterType, setDbFilterType] = useState('ALL');
  const [dbSortConfig, setDbSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [dbPage, setDbPage] = useState(1);
  const [dbPageSize, setDbPageSize] = useState(100);
  const [selectedDbIds, setSelectedDbIds] = useState(new Set());
  const [pendingDbDeleteIds, setPendingDbDeleteIds] = useState(null);
  const [editingDbRowId, setEditingDbRowId] = useState(null);
  const [editDbDraft, setEditDbDraft] = useState({
    swimmerName: '',
    classYear: '',
    eventLabel: '',
    time: '',
    competition: '',
    date: '',
  });
  const [qualStandards, setQualStandards] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('swimmeet_qual_standards_v1') || 'null');
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });
  const [newStdLabel, setNewStdLabel] = useState('NCAA B');
  const [newStdEventKey, setNewStdEventKey] = useState('women 50 freestyle');
  const [newStdTime, setNewStdTime] = useState('');
  const [newStdType, setNewStdType] = useState('STANDARD'); // 'STANDARD' | 'POOL_RECORD'
  const [newStdHolder, setNewStdHolder] = useState('');
  const [newStdDate, setNewStdDate] = useState('');
  const [editingStdId, setEditingStdId] = useState(null);
  const [editStdDraft, setEditStdDraft] = useState({
    type: 'STANDARD',
    label: '',
    eventKey: 'women 50 freestyle',
    time: '',
    holder: '',
    date: '',
  });

  // Section 2 (Records & Top-10), Section 3 (In-Meet Tools), & Profile Modal State
  const [recordBookSubTab, setRecordBookSubTab] = useState('top10'); // 'top10' | 'wins'
  const [recordBookGender, setRecordBookGender] = useState('Women');
  const [recordBookEventKey, setRecordBookEventKey] = useState('women 50 freestyle');
  const [eventWinsActiveOnly, setEventWinsActiveOnly] = useState(false);
  const [winsCompetitionFilter, setWinsCompetitionFilter] = useState('ALL');
  const [winsActiveOnly, setWinsActiveOnly] = useState(false);
  const [expandedWinAthlete, setExpandedWinAthlete] = useState(null);

  const [inMeetSubTab, setInMeetSubTab] = useState('heatsheet'); // 'heatsheet' | 'roster' | 'relayopt' | 'standards'
  const [inMeetSearch, setInMeetSearch] = useState('');
  const [inMeetGenderFilter, setInMeetGenderFilter] = useState('ALL');
  const [inMeetTargetEventKey, setInMeetTargetEventKey] = useState('women 50 freestyle');
  const [teamColors, setTeamColors] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('swimmeet_team_colors_v1') || '{}');
    } catch {
      return {};
    }
  });
  const [selectedHeatEventLabel, setSelectedHeatEventLabel] = useState('');
  const [selectedHeatNum, setSelectedHeatNum] = useState('ALL');
  const [broadcastGraphicTheme, setBroadcastGraphicTheme] = useState('slate');
  const [selectedPngHeaderMarks, setSelectedPngHeaderMarks] = useState(new Set(['PROGRAM_RECORD']));
  const [isExportingAllGraphics, setIsExportingAllGraphics] = useState(false);

  const [relayOptEventKey, setRelayOptEventKey] = useState('women 200 medley relay');
  const [relayOptBasis, setRelayOptBasis] = useState('PB'); // 'PB' | 'SB'
  const [relayOptExchangeDelta, setRelayOptExchangeDelta] = useState(-0.45);
  const [relayOptManualA, setRelayOptManualA] = useState(['', '', '', '']);
  const [relayOptManualB, setRelayOptManualB] = useState(['', '', '', '']);
  const [relayOptExcludedKeys, setRelayOptExcludedKeys] = useState(new Set());

  // Swimcloud Opponent Scout State (Firestore `opponent_scouts` + local cache)
  const [opponentScouts, setOpponentScouts] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('swimmeet_opponent_scouts_v1') || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });
  const [selectedScoutId, setSelectedScoutId] = useState('');
  const [newScoutTeamName, setNewScoutTeamName] = useState('');
  const [newScoutSwimcloudInput, setNewScoutSwimcloudInput] = useState('');
  const [newScoutColor, setNewScoutColor] = useState('#e11d48');
  const [scoutGenderView, setScoutGenderView] = useState('Women'); // 'Women' | 'Men'
  const [scoutPasteText, setScoutPasteText] = useState('');
  const [scoutPasteEventHint, setScoutPasteEventHint] = useState('');
  const [scoutOurBasis, setScoutOurBasis] = useState('SB'); // 'SB' | 'PB'
  const [scoutFormatPreset, setScoutFormatPreset] = useState('200MR_200IM_200FR');
  const [scoutCustomEvents, setScoutCustomEvents] = useState([
    '200 Medley Relay',
    '1000 Freestyle',
    '200 Freestyle',
    '100 Backstroke',
    '100 Breaststroke',
    '200 Butterfly',
    '50 Freestyle',
    '100 Freestyle',
    '200 Backstroke',
    '200 Breaststroke',
    '500 Freestyle',
    '100 Butterfly',
    '200 Individual Medley',
    '200 Freestyle Relay',
  ]);
  const [scoutCustomEventToAdd, setScoutCustomEventToAdd] = useState('400 Individual Medley');

  // Virtual Dual-Meet Score Simulator State
  const [simTimeBasis, setSimTimeBasis] = useState('AUTO'); // 'AUTO' | 'SEED' | 'FINALS'
  const [simScoringFormat, setSimScoringFormat] = useState('DUAL_9'); // 'DUAL_9' (9-4-3-2-1 / 11-4-2) | 'DUAL_6' (6-4-3-2-1 / 8-4-2)
  const [simGenderView, setSimGenderView] = useState('ALL'); // 'ALL' | 'Women' | 'Men'
  const [simCustomOrders, setSimCustomOrders] = useState({}); // { [eventKey]: string[] of entry ids }
  const [simScratchedIds, setSimScratchedIds] = useState(new Set());

  const [profileSwimmerName, setProfileSwimmerName] = useState(null);
  const [profileChartEventKey, setProfileChartEventKey] = useState('');

  // File Input Refs
  const fileInputRef = useRef(null);
  const historyCsvInputRef = useRef(null);
  const awayLogoInputRef = useRef(null);
  const homeLogoInputRef = useRef(null);

  // Optional Meet Logos for Standalone Web Recap (.HTML) Export (Session-only, not saved to DB)
  const [awayLogoDataUrl, setAwayLogoDataUrl] = useState('');
  const [homeLogoDataUrl, setHomeLogoDataUrl] = useState('');

  // Saved Meet Repository ("Load Past Meet") State
  const [savedMeets, setSavedMeets] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('swimmeet_saved_meets_v1') || '[]');
    } catch {
      return [];
    }
  });
  const [selectedSavedMeetId, setSelectedSavedMeetId] = useState('');

  // Firebase Cloud Sync State
  const [cloudUser, setCloudUser] = useState(null);
  const [cloudSyncStatus, setCloudSyncStatus] = useState('connecting');
  const [cloudErrorMsg, setCloudErrorMsg] = useState('');

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCloudUser(user);
        setCloudErrorMsg('');
      } else {
        signInAnonymously(auth).catch((err) => {
          setCloudSyncStatus('offline');
          setCloudErrorMsg(err?.code || err?.message || 'auth-failed');
        });
      }
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!cloudUser) return;

    const unsubPerf = onSnapshot(
      collection(db, 'performances'),
      (snap) => {
        const rows = snap.docs.map((d) => {
          const data = d.data();
          return { ...data, id: d.id, dateObj: parseFlexibleDate(data.date) };
        });
        setHistoricalRecords(rows);
        try {
          localStorage.setItem('swimmeet_historical_records_v1', JSON.stringify(rows));
        } catch {}
        setCloudSyncStatus('synced');
        setCloudErrorMsg('');
      },
      (err) => {
        setCloudSyncStatus('offline');
        setCloudErrorMsg(err?.code || err?.message || 'firestore-error');
      }
    );

    const unsubRoster = onSnapshot(collection(db, 'master_roster'), (snap) => {
      const rows = snap.docs.map((d) => ({ ...d.data(), id: d.id }));
      setMasterRoster(rows);
      try {
        localStorage.setItem('swimmeet_master_roster_v1', JSON.stringify(rows));
      } catch {}
    });

    const unsubComps = onSnapshot(collection(db, 'master_competitions'), (snap) => {
      const rows = snap.docs.map((d) => ({ ...d.data(), id: d.id }));
      setMasterCompetitions(rows);
      try {
        localStorage.setItem('swimmeet_master_competitions_v1', JSON.stringify(rows));
      } catch {}
    });

    const unsubEvents = onSnapshot(collection(db, 'master_events'), (snap) => {
      if (!snap.empty) {
        const cloudRows = snap.docs.map((d) => ({ ...d.data(), id: d.id }));
        const mergedMap = new Map(DEFAULT_MASTER_EVENTS.map((ev) => [ev.eventKey, ev]));
        cloudRows.forEach((ev) => {
          mergedMap.set(ev.eventKey || ev.id, ev);
        });
        const mergedList = Array.from(mergedMap.values());
        setMasterEvents(mergedList);
        try {
          localStorage.setItem('swimmeet_master_events_v1', JSON.stringify(mergedList));
        } catch {}
      }
    });

    const unsubSavedMeets = onSnapshot(collection(db, 'saved_meets'), (snap) => {
      const rows = snap.docs
        .map((d) => ({ ...d.data(), id: d.id }))
        .sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')));
      setSavedMeets(rows);
      try {
        localStorage.setItem('swimmeet_saved_meets_v1', JSON.stringify(rows));
      } catch {}
    });

    const unsubStandards = onSnapshot(collection(db, 'qual_standards'), (snap) => {
      if (!snap.empty) {
        const rows = snap.docs.map((d) => ({ ...d.data(), id: d.id }));
        setQualStandards(rows);
        try {
          localStorage.setItem('swimmeet_qual_standards_v1', JSON.stringify(rows));
        } catch {}
      } else {
        try {
          const cached = JSON.parse(localStorage.getItem('swimmeet_qual_standards_v1') || '[]');
          if (Array.isArray(cached) && cached.length > 0) {
            syncCollectionToCloud('qual_standards', cached, false);
          }
        } catch {}
      }
    });

    const unsubScouts = onSnapshot(collection(db, 'opponent_scouts'), (snap) => {
      const rows = snap.docs
        .map((d) => ({ ...d.data(), id: d.id }))
        .sort((a, b) => String(a.teamName || '').localeCompare(String(b.teamName || '')));
      setOpponentScouts(rows);
      try {
        localStorage.setItem('swimmeet_opponent_scouts_v1', JSON.stringify(rows));
      } catch {}
    });

    return () => {
      unsubPerf();
      unsubRoster();
      unsubComps();
      unsubEvents();
      unsubSavedMeets();
      unsubStandards();
      unsubScouts();
    };
  }, [cloudUser]);

  const syncCollectionToCloud = async (colName, items, replaceAll = false) => {
    if (!cloudUser) return;
    try {
      if (replaceAll) {
        const existingSnap = await getDocs(collection(db, colName));
        const delDocs = existingSnap.docs;
        for (let i = 0; i < delDocs.length; i += 400) {
          const batch = writeBatch(db);
          delDocs.slice(i, i + 400).forEach((d) => batch.delete(d.ref));
          await batch.commit();
        }
      }
      for (let i = 0; i < items.length; i += 400) {
        const batch = writeBatch(db);
        items.slice(i, i + 400).forEach((item) => {
          const { dateObj, ...serializable } = item;
          const docId = String(item.id || `${colName}-${Date.now()}-${Math.random()}`);
          batch.set(doc(db, colName, docId), { ...serializable, id: docId });
        });
        await batch.commit();
      }
      setCloudSyncStatus('synced');
      setCloudErrorMsg('');
    } catch (err) {
      setCloudSyncStatus('offline');
      setCloudErrorMsg(err?.code || err?.message || 'sync-failed');
    }
  };

  const handleDeleteDbRecords = async (idsToDelete) => {
    const idSet = new Set(idsToDelete);
    const next = historicalRecords.filter((r) => !idSet.has(r.id));
    setHistoricalRecords(next);
    setSelectedDbIds((prev) => {
      const updatedSel = new Set(prev);
      idsToDelete.forEach((id) => updatedSel.delete(id));
      return updatedSel;
    });
    setPendingDbDeleteIds(null);
    try {
      localStorage.setItem('swimmeet_historical_records_v1', JSON.stringify(next));
    } catch {}

    if (cloudUser) {
      try {
        for (let i = 0; i < idsToDelete.length; i += 400) {
          const batch = writeBatch(db);
          idsToDelete.slice(i, i + 400).forEach((id) => {
            batch.delete(doc(db, 'performances', String(id)));
          });
          await batch.commit();
        }
      } catch (err) {
        setCloudSyncStatus('offline');
        setCloudErrorMsg(err?.code || err?.message || 'delete-failed');
      }
    }

    setBenchmarkStatusMsg(
      `Deleted ${idsToDelete.length} record${idsToDelete.length === 1 ? '' : 's'} from database.`
    );
  };

  // Save inline edits to a Master Roster athlete (and optionally propagate name changes to Committed DB)
  const handleSaveMasterRosterEdit = (ath) => {
    const cleanName = String(editRosterDraft.canonicalName || '').trim();
    if (!cleanName) return;

    const parsedAliases = Array.from(
      new Set(
        String(editRosterDraft.aliasesText || '')
          .split(/[;,]/)
          .map((a) => a.trim())
          .filter((a) => a && normalizeSwimmerKey(a) !== normalizeSwimmerKey(cleanName))
      )
    );

    const updatedAth = {
      ...ath,
      canonicalName: cleanName,
      gender: editRosterDraft.gender,
      isActive: Boolean(editRosterDraft.isActive),
      aliases: parsedAliases,
    };

    const nextRoster = masterRoster.map((item) => (item.id === ath.id ? updatedAth : item));
    updateMasterRoster(nextRoster, [updatedAth]);

    let updatedDbCount = 0;
    if (editRosterDraft.propagateToDb) {
      const matchKeys = new Set(
        [ath.canonicalName, cleanName, ...(ath.aliases || []), ...parsedAliases]
          .map((n) => normalizeSwimmerKey(n))
          .filter(Boolean)
      );
      const changedDbRows = [];
      const nextHist = historicalRecords.map((r) => {
        if (matchKeys.has(r.swimmerKey) && r.swimmerName !== cleanName) {
          const updatedRow = {
            ...r,
            swimmerName: cleanName,
            swimmerKey: normalizeSwimmerKey(cleanName),
          };
          changedDbRows.push(updatedRow);
          return updatedRow;
        }
        return r;
      });

      if (changedDbRows.length > 0) {
        updatedDbCount = changedDbRows.length;
        updateHistoricalRecords(nextHist, changedDbRows, false);
      }
    }

    setEditingRosterId(null);
    setBenchmarkStatusMsg(
      `Updated Master Roster entry for "${cleanName}"${
        updatedDbCount > 0 ? ` and updated ${updatedDbCount} matching DB record(s).` : '.'
      }`
    );
  };

  // Save inline edits to a single Committed DB record
  const handleSaveDbRecordEdit = (rec) => {
    const cleanName = String(editDbDraft.swimmerName || '').trim();
    const cleanEvent = String(editDbDraft.eventLabel || '').trim();
    const cleanTime = String(editDbDraft.time || '').trim();
    const parsedSec = timeToSeconds(cleanTime);
    if (!cleanName || !cleanEvent || parsedSec === null || parsedSec <= 0) {
      setBenchmarkStatusMsg(
        'Please enter a valid Athlete Name, Event, and Time (e.g., 58.90 or 1:54.32).'
      );
      return;
    }

    const genderHint =
      swimmerGenderLookup[normalizeSwimmerKey(cleanName)] ||
      (cleanEvent.toLowerCase().startsWith('men') ? 'Men' : 'Women');
    const resolvedEv = resolveMasterEvent(cleanEvent, genderHint);
    const nextEvKey = resolvedEv
      ? resolvedEv.eventKey
      : normalizeEventKey(cleanEvent, genderHint) || rec.eventKey;
    const nextEvLabel = resolvedEv ? resolvedEv.canonicalName : cleanEvent;
    const nextDate = normalizeDateIso(editDbDraft.date);

    const updatedRec = {
      ...rec,
      swimmerName: cleanName,
      swimmerKey: normalizeSwimmerKey(cleanName),
      classYear: normalizeClass(editDbDraft.classYear),
      eventKey: nextEvKey,
      eventLabel: nextEvLabel,
      time: cleanTime,
      seconds: parsedSec,
      competition: String(editDbDraft.competition || '').trim(),
      date: nextDate,
      dateObj: parseFlexibleDate(nextDate),
    };

    const nextHist = historicalRecords.map((item) => (item.id === rec.id ? updatedRec : item));
    updateHistoricalRecords(nextHist, [updatedRec], false);
    setEditingDbRowId(null);
    setBenchmarkStatusMsg(`Saved changes to ${cleanName} — ${nextEvLabel} (${cleanTime}).`);
  };

  // Master List Lookups (must be defined before useMemo hooks that invoke them)
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

  const resolveMasterCompetition = (rawComp, rawDate = '') => {
    const key = normalizeCompKey(rawComp);
    const dateKey = normalizeDateIso(rawDate);
    if (!key) return null;

    const nameMatches = (c) =>
      normalizeCompKey(c.canonicalName) === key ||
      (c.aliases || []).some((al) => normalizeCompKey(al) === key);

    // 1. Require BOTH Competition Name/Alias AND Date to match when a date is present
    if (dateKey) {
      const exactDated = masterCompetitions.find(
        (c) => normalizeDateIso(c.date) === dateKey && nameMatches(c)
      );
      if (exactDated) return exactDated;
    }

    // 2. Fallback only to Master Competitions explicitly configured with blank ("Any Date")
    const undated = masterCompetitions.find(
      (c) => !normalizeDateIso(c.date) && nameMatches(c)
    );
    if (undated) return undated;

    return null;
  };

  const resolveMasterEvent = (rawEvent, fallbackGender = '') => {
    const rawTrim = String(rawEvent || '').trim();
    if (!rawTrim) return null;
    const rawLower = rawTrim.toLowerCase();
    const normKey = normalizeEventKey(rawTrim, fallbackGender);

    const explicitMatch = masterEvents.find(
      (ev) =>
        ev.canonicalName.toLowerCase() === rawLower ||
        (ev.aliases || []).some((al) => al.trim().toLowerCase() === rawLower)
    );
    if (explicitMatch) return explicitMatch;

    if (normKey && (normKey.startsWith('women ') || normKey.startsWith('men '))) {
      const keyMatch = masterEvents.find((ev) => ev.eventKey === normKey);
      if (keyMatch) return keyMatch;
    }

    return null;
  };

  // Build staged rows & unmatched Master List items for the loaded .cl2 meet (Section 5)
  const meetCommitPreview = useMemo(() => {
    if (!parsedData || !selectedTeam || selectedTeam === 'ALL') {
      return {
        rows: [],
        meetDays: [],
        unmatchedCompetition: null,
        unmatchedAthletes: [],
        unmatchedEvents: [],
      };
    }

    const targetCode = selectedTeam;
    const meetComp = parsedData.meetInfo.name || 'Imported Meet';
    const meetLoc = [parsedData.meetInfo.city, parsedData.meetInfo.state]
      .filter(Boolean)
      .join(', ');
    const defaultMeetDate = normalizeDateIso(
      parsedData.meetInfo.isoDate || parsedData.meetInfo.startDate || ''
    );

    // Collect distinct dates across the meet (B1 range + D0 swim dates)
    const distinctDatesSet = new Set();
    const startObj = parseFlexibleDate(parsedData.meetInfo.isoDate || parsedData.meetInfo.startDate);
    const endObj = parseFlexibleDate(parsedData.meetInfo.endIsoDate || parsedData.meetInfo.endDate);
    if (startObj && endObj && endObj >= startObj) {
      const cur = new Date(startObj.getFullYear(), startObj.getMonth(), startObj.getDate());
      const last = new Date(endObj.getFullYear(), endObj.getMonth(), endObj.getDate());
      let guard = 0;
      while (cur <= last && guard < 14) {
        const y = cur.getFullYear();
        const m = String(cur.getMonth() + 1).padStart(2, '0');
        const d = String(cur.getDate()).padStart(2, '0');
        distinctDatesSet.add(`${y}-${m}-${d}`);
        cur.setDate(cur.getDate() + 1);
        guard++;
      }
    }
    parsedData.individualResults.forEach((entry) => {
      if (entry.swimDate) distinctDatesSet.add(normalizeDateIso(entry.swimDate));
    });
    if (defaultMeetDate) distinctDatesSet.add(defaultMeetDate);
    const meetDays = Array.from(distinctDatesSet).sort((a, b) => a.localeCompare(b));

    const matchedComp = resolveMasterCompetition(meetComp, defaultMeetDate);
    const finalComp = matchedComp ? matchedComp.canonicalName : meetComp;
    const finalLoc = matchedComp?.defaultLocation || meetLoc;

    const resolveRowDate = (rowId, eventNum, naturalDate) => {
      if (meetDateOverrides[`row:${rowId}`]) return meetDateOverrides[`row:${rowId}`];
      if (eventNum !== undefined && eventNum !== null && meetDateOverrides[`ev:${eventNum}`]) {
        return meetDateOverrides[`ev:${eventNum}`];
      }
      return naturalDate || (matchedComp?.date ? normalizeDateIso(matchedComp.date) : defaultMeetDate);
    };

    const existingHashes = new Set(
      historicalRecords.map(
        (r) =>
          `${r.swimmerKey}|${r.eventKey}|${r.seconds.toFixed(2)}|${r.date}|${r.round || 'Finals'}|${r.place}`
      )
    );

    const unmatchedAthletesMap = new Map();
    const unmatchedEventsMap = new Map();
    const rows = [];

    const registerSwimmerAndEvent = (displaySwimmer, genderLabel, eventLabel) => {
      const cleanEventLabel = String(eventLabel || '')
        .replace(/\s*\(Time Trial\)\s*/gi, '')
        .trim();
      const resolvedAth = resolveMasterAthlete(displaySwimmer);
      const finalName = resolvedAth ? resolvedAth.canonicalName : displaySwimmer;
      if (!resolvedAth) {
        const aKey = normalizeSwimmerKey(displaySwimmer);
        if (!unmatchedAthletesMap.has(aKey)) {
          unmatchedAthletesMap.set(aKey, {
            rawName: displaySwimmer,
            inferredGender: genderLabel === 'Men' ? 'Men' : 'Women',
            count: 1,
          });
        } else {
          unmatchedAthletesMap.get(aKey).count += 1;
        }
      }

      const resolvedEv = resolveMasterEvent(cleanEventLabel, genderLabel);
      const evKey = normalizeEventKey(cleanEventLabel, genderLabel);
      const finalEvKey = resolvedEv ? resolvedEv.eventKey : evKey;
      const finalEvLabel = resolvedEv ? resolvedEv.canonicalName : cleanEventLabel;
      if (!resolvedEv && cleanEventLabel) {
        const eKey = `${cleanEventLabel.toLowerCase()}|${genderLabel}`;
        if (!unmatchedEventsMap.has(eKey)) {
          unmatchedEventsMap.set(eKey, {
            rawEvent: cleanEventLabel,
            genderHint: genderLabel,
            count: 1,
          });
        } else {
          unmatchedEventsMap.get(eKey).count += 1;
        }
      }

      return { finalName, finalEvKey, finalEvLabel };
    };

    // 1. Individual swims (stage both Finals and Prelims separately when swam)
    parsedData.individualResults.forEach((entry) => {
      if (entry.teamCode !== targetCode) return;

      const displaySwimmer = formatSwimmerDisplay(entry.swimmerName, entry.preferredFirst);
      const { finalName, finalEvKey, finalEvLabel } = registerSwimmerAndEvent(
        displaySwimmer,
        entry.genderLabel,
        entry.eventLabel
      );
      const swKey = normalizeSwimmerKey(finalName);
      const effectiveClass =
        meetClassOverrides[swKey] !== undefined
          ? meetClassOverrides[swKey]
          : normalizeClass(entry.classYear);

      const stageIndividualRound = (roundLabel, timeStr, placeNum, splitsArr, suffix) => {
        if (!timeStr || timeStr === 'NT' || timeStr === 'DQ' || timeStr === 'SCR' || timeStr === 'NS')
          return;
        const sec = entry.isDiving
          ? parseFloat(String(timeStr).replace(/[A-Z]+$/i, '').trim())
          : timeToSeconds(timeStr);
        if (sec === null || Number.isNaN(sec)) return;

        const rowId = `cl2-ind-${entry.id}-${suffix}`;
        const rowDate = resolveRowDate(
          rowId,
          entry.eventNumber,
          normalizeDateIso(entry.swimDate) || defaultMeetDate
        );
        const placeStr = placeNum ? String(placeNum) : '';
        const effectiveRound = entry.isTimeTrial ? 'Time Trial' : roundLabel;
        const hash = `${swKey}|${finalEvKey}|${sec.toFixed(2)}|${rowDate}|${effectiveRound}|${placeStr}`;
        const isDuplicate = existingHashes.has(hash);
        const defaultIncluded = !isDuplicate && !entry.isExhibition && !entry.isTimeTrial;

        rows.push({
          id: rowId,
          eventNumber: entry.eventNumber,
          swimmerName: finalName,
          swimmerKey: swKey,
          classYear: effectiveClass,
          eventKey: finalEvKey,
          eventLabel: finalEvLabel,
          time: timeStr,
          seconds: sec,
          date: rowDate,
          dateObj: parseFlexibleDate(rowDate),
          location: finalLoc,
          competition: finalComp,
          round: effectiveRound,
          place: placeStr,
          swimType: 'OFFICIAL',
          isOfficial: !entry.isExhibition && !entry.isTimeTrial,
          splitContext: entry.isTimeTrial
            ? 'Time Trial'
            : entry.isExhibition
            ? 'Exhibition'
            : roundLabel === 'Prelims'
            ? 'Prelims'
            : '',
          source: 'cl2_meet',
          isDuplicate,
          selected: defaultIncluded && !excludedMeetCommitIds.has(rowId),
        });

        // Optional legal opening splits for this round
        if (!entry.isDiving && includeSplitsOnCommit && splitsArr && splitsArr.length > 0) {
          const legalSplits = extractLegalOpeningSplits(
            Number(entry.distance) || 0,
            entry.genderLabel,
            entry.strokeName,
            finalEvLabel,
            splitsArr,
            entry.splitInterval,
            entry.splitType
          );
          legalSplits.forEach((spItem, sIdx) => {
            const spResolved = registerSwimmerAndEvent(
              displaySwimmer,
              entry.genderLabel,
              spItem.eventLabel
            );
            if (!spResolved.finalEvKey) return;
            const sRowId = `cl2-sp-${entry.id}-${suffix}-${sIdx}`;
            const spDate = resolveRowDate(
              sRowId,
              entry.eventNumber,
              normalizeDateIso(entry.swimDate) || defaultMeetDate
            );
            const sHash = `${swKey}|${spResolved.finalEvKey}|${spItem.seconds.toFixed(2)}|${spDate}|${effectiveRound}|S`;
            const sDup = existingHashes.has(sHash);
            rows.push({
              id: sRowId,
              eventNumber: entry.eventNumber,
              swimmerName: finalName,
              swimmerKey: swKey,
              classYear: effectiveClass,
              eventKey: spResolved.finalEvKey,
              eventLabel: spResolved.finalEvLabel,
              time: spItem.time,
              seconds: spItem.seconds,
              date: spDate,
              dateObj: parseFlexibleDate(spDate),
              location: finalLoc,
              competition: finalComp,
              round: effectiveRound,
              place: 'S',
              swimType: 'INTERMEDIATE_SPLIT',
              isOfficial: true,
              splitContext: `${spItem.context}${roundLabel === 'Prelims' ? ' (Prelims)' : ''}`,
              source: 'cl2_split',
              isDuplicate: sDup,
              selected: !sDup && !entry.isExhibition && !excludedMeetCommitIds.has(sRowId),
            });
          });
        }
      };

      if (entry.finalsOnlyTime && entry.prelimTime) {
        stageIndividualRound(
          'Finals',
          entry.finalsOnlyTime,
          entry.place,
          entry.finalsSplits.length > 0 ? entry.finalsSplits : entry.splits,
          'F'
        );
        stageIndividualRound(
          'Prelims',
          entry.prelimTime,
          entry.prelimPlace,
          entry.prelimSplits,
          'P'
        );
      } else if (entry.finalsOnlyTime) {
        stageIndividualRound(
          'Finals',
          entry.finalsOnlyTime,
          entry.place,
          entry.finalsSplits.length > 0 ? entry.finalsSplits : entry.splits,
          'F'
        );
      } else if (entry.prelimTime) {
        stageIndividualRound(
          'Prelims',
          entry.prelimTime,
          entry.prelimPlace ?? entry.place,
          entry.prelimSplits.length > 0 ? entry.prelimSplits : entry.splits,
          'P'
        );
      }
    });

    // 2. Relay Lead-Offs (R) & Relay Team Wins
    parsedData.relayResults.forEach((entry) => {
      if (entry.teamCode !== targetCode) return;
      if (!entry.legs || entry.legs.length === 0) return;

      const legDist = Math.round((Number(entry.distance) || 0) / 4);
      const legStroke = String(entry.strokeName || '').includes('Medley')
        ? 'Backstroke'
        : 'Freestyle';
      const legEvLabel = `${entry.genderLabel} ${legDist} ${legStroke}`;
      const legBreakdown = calculateRelayLegBreakdown(entry);

      const leadOffLeg = legBreakdown.find((l) => l.legOrder === 1);
      if (leadOffLeg && leadOffLeg.swimmerName && leadOffLeg.legTotalTime !== '-') {
        const splitSec = timeToSeconds(leadOffLeg.legTotalTime);
        if (splitSec !== null) {
          const displayLead = formatSwimmerDisplay(
            leadOffLeg.swimmerName,
            leadOffLeg.preferredFirst
          );
          const { finalName, finalEvKey, finalEvLabel } = registerSwimmerAndEvent(
            displayLead,
            entry.genderLabel,
            legEvLabel
          );
          const swKey = normalizeSwimmerKey(finalName);
          const effectiveClass =
            meetClassOverrides[swKey] !== undefined
              ? meetClassOverrides[swKey]
              : normalizeClass(leadOffLeg.classYear);
const rRowId = `cl2-lo-${entry.id}`;
          const rDate = resolveRowDate(rRowId, entry.eventNumber, defaultMeetDate);
          const hash = `${swKey}|${finalEvKey}|${splitSec.toFixed(2)}|${rDate}|Finals|R`;
          const isDuplicate = existingHashes.has(hash);
          rows.push({
            id: rRowId,
            eventNumber: entry.eventNumber,
            swimmerName: finalName,
            swimmerKey: swKey,
            classYear: effectiveClass,
            eventKey: finalEvKey,
            eventLabel: finalEvLabel,
            time: leadOffLeg.legTotalTime,
            seconds: splitSec,
            date: rDate,
            dateObj: parseFlexibleDate(rDate),
            location: finalLoc,
            competition: finalComp,
            round: 'Finals',
            place: 'R',
            swimType: 'RELAY_LEADOFF',
            isOfficial: true,
            splitContext: `Lead-Off (${entry.eventLabel})`,
            source: 'cl2_leadoff',
            isDuplicate,
            selected: !isDuplicate && !excludedMeetCommitIds.has(rRowId),
          });
        }
      }

      if (Number(entry.place) === 1) {
        const relaySec = timeToSeconds(entry.finalsTime);
        if (relaySec !== null) {
          legBreakdown.forEach((leg) => {
            if (!leg.swimmerName) return;
            const displaySwimmer = formatSwimmerDisplay(leg.swimmerName, leg.preferredFirst);
            const { finalName, finalEvKey, finalEvLabel } = registerSwimmerAndEvent(
              displaySwimmer,
              entry.genderLabel,
              entry.eventLabel
            );
            const swKey = normalizeSwimmerKey(finalName);
            const effectiveClass =
              meetClassOverrides[swKey] !== undefined
                ? meetClassOverrides[swKey]
                : normalizeClass(leg.classYear);
            const wRowId = `cl2-rw-${entry.id}-leg${leg.legOrder}`;
            const wDate = resolveRowDate(wRowId, entry.eventNumber, defaultMeetDate);
            const winHash = `${swKey}|${finalEvKey}|${relaySec.toFixed(2)}|${wDate}|Finals|1`;
            const isDuplicate = existingHashes.has(winHash);
            rows.push({
              id: wRowId,
              eventNumber: entry.eventNumber,
              swimmerName: finalName,
              swimmerKey: swKey,
              classYear: effectiveClass,
              eventKey: finalEvKey,
              eventLabel: finalEvLabel,
              time: entry.finalsTime,
              seconds: relaySec,
              date: wDate,
              dateObj: parseFlexibleDate(wDate),
              location: finalLoc,
              competition: finalComp,
              round: 'Finals',
              place: '1',
              swimType: 'RELAY_WIN',
              isOfficial: false,
              splitContext: `Leg ${leg.legOrder}${
                leg.legTotalTime !== '-' ? ` (${leg.legTotalTime})` : ''
              }`,
              source: 'cl2_relay_win',
              isDuplicate,
              selected: !isDuplicate && !excludedMeetCommitIds.has(wRowId),
            });
          });
        }
      }
    });

    return {
      rows,
      meetDays,
      matchedComp,
      unmatchedCompetition: !matchedComp
        ? {
            rawName: meetComp,
            sampleDate: defaultMeetDate,
            sampleLocation: meetLoc,
          }
        : null,
      unmatchedAthletes: Array.from(unmatchedAthletesMap.values()),
      unmatchedEvents: Array.from(unmatchedEventsMap.values()),
    };
  }, [
    parsedData,
    selectedTeam,
    historicalRecords,
    masterRoster,
    masterCompetitions,
    masterEvents,
    includeSplitsOnCommit,
    meetClassOverrides,
    meetDateOverrides,
    excludedMeetCommitIds,
  ]);

  // Apply Master List reconciliations directly for the active .cl2 meet
  const handleApplyMeetReconciliations = () => {
    let nextRoster = [...masterRoster];
    let nextComps = [...masterCompetitions];
    let nextEvents = [...masterEvents];
    const changedRoster = [];
    const changedComps = [];
    const changedEvents = [];

    if (meetCommitPreview.unmatchedCompetition) {
      const item = meetCommitPreview.unmatchedCompetition;
      const selKey = `comp:${normalizeCompKey(item.rawName)}|${item.sampleDate}`;
      const choice = meetReconcileSelections[selKey] || '__NEW__';
      if (choice === '__NEW__') {
        const created = {
          id: `comp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          canonicalName: item.rawName,
          date: item.sampleDate,
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
            date: normalizeDateIso(c.date) || item.sampleDate,
            aliases: Array.from(new Set([...(c.aliases || []), item.rawName])),
          };
          changedComps.push(updated);
          return updated;
        });
      }
    }

    meetCommitPreview.unmatchedAthletes.forEach((item) => {
      const selKey = `ath:${normalizeSwimmerKey(item.rawName)}`;
      const choice = meetReconcileSelections[selKey] || '__NEW__';
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

    meetCommitPreview.unmatchedEvents.forEach((item) => {
      const selKey = `ev:${item.rawEvent.toLowerCase()}|${item.genderHint}`;
      const choice = meetReconcileSelections[selKey] || '__NEW__';
      if (choice === '__NEW__') {
        const evKey = normalizeEventKey(item.rawEvent, item.genderHint) || item.rawEvent.toLowerCase();
        const created = {
          id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          canonicalName: item.rawEvent,
          eventKey: evKey,
          gender: item.genderHint === 'Men' ? 'Men' : 'Women',
          isRelay: item.rawEvent.toLowerCase().includes('relay'),
          aliases: [],
        };
        nextEvents.push(created);
        changedEvents.push(created);
      } else {
        nextEvents = nextEvents.map((ev) => {
          if (ev.id !== choice) return ev;
          const updated = {
            ...ev,
            aliases: Array.from(new Set([...(ev.aliases || []), item.rawEvent])),
          };
          changedEvents.push(updated);
          return updated;
        });
      }
    });

    if (changedRoster.length > 0) updateMasterRoster(nextRoster, changedRoster);
    if (changedComps.length > 0) updateMasterCompetitions(nextComps, changedComps);
    if (changedEvents.length > 0) updateMasterEvents(nextEvents, changedEvents);
    setMeetReconcileSelections({});
    setBenchmarkStatusMsg(
      'Reconciled meet competition, athletes, and events into Master Lists.'
    );
  };

  // Commit current loaded meet performances to database using verified staged rows
  const handleCommitCurrentMeet = () => {
    if (!parsedData) return;

    if (!selectedTeam || selectedTeam === 'ALL') {
      setBenchmarkStatusMsg(
        'Select a specific Primary Program Focus (e.g., Gettysburg College) before committing so opponent times are not imported.'
      );
      return;
    }

    const targetCode = selectedTeam;
    const targetTeamObj = parsedData.teams.find((t) => t.code === targetCode);
    const targetName = targetTeamObj?.name || targetCode;
    const meetComp = parsedData.meetInfo.name || 'Imported Meet';

    const chosenEntries = meetCommitPreview.rows
      .filter((r) => r.selected)
      .map(({ isDuplicate, selected, ...cleanRow }, idx) => ({
        ...cleanRow,
        id: `meet-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
      }));

    if (chosenEntries.length === 0) {
      setBenchmarkStatusMsg(
        `No new ${targetName} performances selected to commit (all eligible times are already in the database or unchecked).`
      );
      return;
    }

    const updated = [...historicalRecords, ...chosenEntries];
    updateHistoricalRecords(updated, chosenEntries, false);
    setBenchmarkStatusMsg(
      `Committed ${chosenEntries.length} verified ${targetName} performances from "${meetComp}" to database (${updated.length} total records).`
    );
  };

  const updateHistoricalRecords = (next, changedItems = null, replaceAll = false) => {
    setHistoricalRecords(next);
    try {
      localStorage.setItem('swimmeet_historical_records_v1', JSON.stringify(next));
    } catch {}
    if (cloudUser) {
      if (replaceAll) {
        syncCollectionToCloud('performances', next, true);
      } else if (changedItems && changedItems.length > 0) {
        syncCollectionToCloud('performances', changedItems, false);
      }
    }
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

  const updateMasterEvents = (next, changedItems = null, deletedId = null) => {
    setMasterEvents(next);
    try {
      localStorage.setItem('swimmeet_master_events_v1', JSON.stringify(next));
    } catch {}
    if (cloudUser) {
      if (deletedId) {
        deleteDoc(doc(db, 'master_events', deletedId)).catch(() => {});
      } else {
        // Sync the full masterEvents list so Firestore never holds only a single newly-added item
        syncCollectionToCloud('master_events', next, false);
      }
    }
  };

  // Bulk Roster Importer
  const handleBulkImportRoster = () => {
    const lines = bulkRosterText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) return;

    const delimiter = lines[0].includes('\t') ? '\t' : ',';
    let nextRoster = [...masterRoster];
    const changed = [];
    let addedCount = 0;

    lines.forEach((line, idx) => {
      const cols = line.split(delimiter).map((c) => c.trim().replace(/^"|"$/g, ''));
      if (idx === 0 && (cols[0] || '').toLowerCase() === 'name') return;
      const rawName = cols[0] || '';
      if (!rawName) return;

      const canonicalName = formatSwimmerDisplayName(rawName);
      const genderRaw = (cols[1] || '').toLowerCase();
      const gender = genderRaw.startsWith('m') ? 'Men' : 'Women';
      const activeRaw = (cols[2] || 'yes').toLowerCase();
      const isActive = !['no', 'false', '0', 'alumni', 'inactive'].includes(activeRaw);
      const aliases = cols[3]
        ? cols[3]
            .split(/[;|]/)
            .map((a) => a.trim())
            .filter(Boolean)
        : [];

      const existingIdx = nextRoster.findIndex(
        (a) => normalizeSwimmerKey(a.canonicalName) === normalizeSwimmerKey(canonicalName)
      );
      if (existingIdx >= 0) {
        const updated = {
          ...nextRoster[existingIdx],
          gender,
          isActive,
          aliases: Array.from(new Set([...(nextRoster[existingIdx].aliases || []), ...aliases])),
        };
        nextRoster[existingIdx] = updated;
        changed.push(updated);
      } else {
        const created = {
          id: `ath-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
          canonicalName,
          gender,
          isActive,
          aliases,
        };
        nextRoster.push(created);
        changed.push(created);
        addedCount++;
      }
    });

    updateMasterRoster(nextRoster, changed);
    setBulkRosterText('');
    setBenchmarkStatusMsg(
      `Imported ${addedCount} new athletes (${changed.length} total processed) into Master Roster.`
    );
  };

  // Bulk Competitions Importer
  const handleBulkImportCompetitions = () => {
    const lines = bulkCompText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) return;

    const delimiter = lines[0].includes('\t') ? '\t' : ',';
    let nextComps = [...masterCompetitions];
    const changed = [];
    let addedCount = 0;

    lines.forEach((line, idx) => {
      const cols = line.split(delimiter).map((c) => c.trim().replace(/^"|"$/g, ''));
      if (idx === 0 && (cols[0] || '').toLowerCase().includes('competition')) return;
      const canonicalName = cols[0] || '';
      if (!canonicalName) return;

      const date = normalizeDateIso(cols[1] || '');
      const defaultLocation = cols[2] || '';
      const aliases = cols[3]
        ? cols[3]
            .split(/[;|]/)
            .map((a) => a.trim())
            .filter(Boolean)
        : [];

      const existingIdx = nextComps.findIndex(
        (c) =>
          normalizeCompKey(c.canonicalName) === normalizeCompKey(canonicalName) &&
          normalizeDateIso(c.date) === date
      );
      if (existingIdx >= 0) {
        const updated = {
          ...nextComps[existingIdx],
          defaultLocation: defaultLocation || nextComps[existingIdx].defaultLocation,
          aliases: Array.from(new Set([...(nextComps[existingIdx].aliases || []), ...aliases])),
        };
        nextComps[existingIdx] = updated;
        changed.push(updated);
      } else {
        const created = {
          id: `comp-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
          canonicalName,
          date,
          defaultLocation,
          aliases,
        };
        nextComps.push(created);
        changed.push(created);
        addedCount++;
      }
    });

    updateMasterCompetitions(nextComps, changed);
    setBulkCompText('');
    setBenchmarkStatusMsg(
      `Imported ${addedCount} new competitions (${changed.length} total processed) into Master Competitions.`
    );
  };

  // Sync missing athletes & competitions from already-committed database rows
  const handleSyncMasterListsFromDatabase = () => {
    let nextRoster = [...masterRoster];
    let nextComps = [...masterCompetitions];
    const changedRoster = [];
    const changedComps = [];

    historicalRecords.forEach((r) => {
      const athExists = nextRoster.some(
        (a) =>
          normalizeSwimmerKey(a.canonicalName) === r.swimmerKey ||
          (a.aliases || []).some((al) => normalizeSwimmerKey(al) === r.swimmerKey)
      );
      if (!athExists && r.swimmerName) {
        const created = {
          id: `ath-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          canonicalName: r.swimmerName,
          gender: r.eventKey?.startsWith('men') ? 'Men' : 'Women',
          isActive: true,
          aliases: [],
        };
        nextRoster.push(created);
        changedRoster.push(created);
      }

      if (r.competition) {
        const cKey = normalizeCompKey(r.competition);
        const dKey = normalizeDateIso(r.date);
        const compExists = nextComps.some(
          (c) =>
            normalizeDateIso(c.date) === dKey &&
            (normalizeCompKey(c.canonicalName) === cKey ||
              (c.aliases || []).some((al) => normalizeCompKey(al) === cKey))
        );
        if (!compExists) {
          const created = {
            id: `comp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            canonicalName: r.competition,
            date: dKey,
            defaultLocation: r.location || '',
            aliases: [],
          };
          nextComps.push(created);
          changedComps.push(created);
        }
      }
    });

    if (changedRoster.length > 0) updateMasterRoster(nextRoster, changedRoster);
    if (changedComps.length > 0) updateMasterCompetitions(nextComps, changedComps);
    setBenchmarkStatusMsg(
      `Synced ${changedRoster.length} new athletes and ${changedComps.length} new competitions from Committed DB.`
    );
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
      parsedData.individualResults.forEach((entry) => {
        map[normalizeSwimmerKey(formatSwimmerDisplay(entry.swimmerName, entry.preferredFirst))] =
          entry.genderLabel;
      });
      parsedData.relayResults.forEach((rel) => {
        (rel.legs || []).forEach((leg) => {
          map[normalizeSwimmerKey(formatSwimmerDisplay(leg.swimmerName, leg.preferredFirst))] =
            rel.genderLabel;
        });
      });
    }
    return map;
  }, [masterRoster, parsedData]);

  // Stage Google Sheet rows for inspection & reconciliation before committing
  const handleStageHistoryText = (rawText, forcedMode = sheetImportMode) => {
    const firstNonEmpty =
      String(rawText || '')
        .split(/\r?\n/)
        .map((l) => l.trim())
        .find(Boolean) || '';
    const delim = firstNonEmpty.includes('\t') ? '\t' : ',';
    const firstCols = firstNonEmpty.split(delim).map((c) => c.trim().replace(/^"|"$/g, ''));

    const isRelaySheet =
      forcedMode === 'relay' ||
      (forcedMode === 'auto' &&
        ((firstCols[0] || '').toLowerCase() === 'names' ||
          (firstCols.length === 11 && (firstCols[0] || '').includes(','))));

    const parsed = isRelaySheet
      ? parseGoogleSheetRelayHistory(rawText, swimmerGenderLookup)
      : parseGoogleSheetHistory(rawText, swimmerGenderLookup);

    if (parsed.length === 0) {
      setBenchmarkStatusMsg(
        isRelaySheet
          ? 'No valid relay rows found. Ensure 11 columns follow: Names, Event, Min, Sec, Date, Location, Competition, Place, Time, Event, Seconds.'
          : 'No valid rows found. Ensure 12 columns follow: Name, Class, Event, Min, Sec, Date, Location, Competition, Place, Time, Event, Seconds.'
      );
      return;
    }

    const existingHashes = new Set(
      historicalRecords.map(
        (r) =>
          `${r.swimmerKey}|${r.eventKey}|${r.seconds.toFixed(2)}|${r.date}|${r.round || 'Finals'}|${r.place}`
      )
    );

    const staged = parsed.map((row) => {
      if (row.swimType === 'RELAY_TEAM' && Array.isArray(row.relayLegs)) {
        const resolvedLegs = row.relayLegs.map((legName) => {
          const m = resolveMasterAthlete(legName);
          return m ? m.canonicalName : legName;
        });
        const firstMatchedAth = row.relayLegs
          .map((legName) => resolveMasterAthlete(legName))
          .find(Boolean);
        const inferredGender =
          firstMatchedAth?.gender ||
          row.relayLegs.map((n) => swimmerGenderLookup[normalizeSwimmerKey(n)]).find(Boolean) ||
          '';

        const matchedComp = resolveMasterCompetition(row.competition, row.date);
        const resolvedComp = matchedComp ? matchedComp.canonicalName : row.competition;
        const resolvedDate = matchedComp?.date ? normalizeDateIso(matchedComp.date) : row.date;
        const resolvedLocation = matchedComp?.defaultLocation || row.location || '';

        const matchedEv = resolveMasterEvent(row.rawEventInput, inferredGender);
        let resolvedEventKey = matchedEv ? matchedEv.eventKey : row.eventKey;
        if (resolvedEventKey && !resolvedEventKey.endsWith('relay')) {
          resolvedEventKey = `${resolvedEventKey} relay`;
        }
        const resolvedEventLabel = matchedEv
          ? matchedEv.canonicalName
          : resolvedEventKey
          ? toTitleEventLabel(resolvedEventKey)
          : row.eventLabel;

        const resolvedLineup = resolvedLegs.join(', ');
        const resolvedKey = normalizeSwimmerKey(resolvedLineup);
        const hash = `${resolvedKey}|${resolvedEventKey}|${row.seconds.toFixed(2)}|${resolvedDate}|${row.round || 'Finals'}|${row.place}`;
        const isDuplicate = existingHashes.has(hash);

        return {
          ...row,
          relayLegs: resolvedLegs,
          swimmerName: resolvedLineup,
          swimmerKey: resolvedKey,
          competition: resolvedComp,
          date: resolvedDate,
          dateObj: parseFlexibleDate(resolvedDate),
          location: resolvedLocation,
          eventKey: resolvedEventKey,
          eventLabel: resolvedEventLabel,
          isEventMatched: Boolean(matchedEv),
          isDuplicate,
          selected: !isDuplicate,
        };
      }

      const matchedAth = resolveMasterAthlete(row.swimmerName);
      const resolvedName = matchedAth ? matchedAth.canonicalName : row.swimmerName;
      const inferredGender = matchedAth?.gender || swimmerGenderLookup[row.swimmerKey] || '';

      const matchedComp = resolveMasterCompetition(row.competition, row.date);
      const resolvedComp = matchedComp ? matchedComp.canonicalName : row.competition;
      const resolvedDate = matchedComp?.date ? normalizeDateIso(matchedComp.date) : row.date;
      const resolvedLocation = matchedComp?.defaultLocation || row.location || '';

      const matchedEv = resolveMasterEvent(row.rawEventInput, inferredGender);
      const resolvedEventKey = matchedEv ? matchedEv.eventKey : row.eventKey;
      const resolvedEventLabel = matchedEv ? matchedEv.canonicalName : row.eventLabel;

      const hash = `${normalizeSwimmerKey(resolvedName)}|${resolvedEventKey}|${row.seconds.toFixed(2)}|${resolvedDate}|${row.round || 'Finals'}|${row.place}`;
      const isDuplicate = existingHashes.has(hash);
      return {
        ...row,
        swimmerName: resolvedName,
        swimmerKey: normalizeSwimmerKey(resolvedName),
        competition: resolvedComp,
        date: resolvedDate,
        dateObj: parseFlexibleDate(resolvedDate),
        location: resolvedLocation,
        eventKey: resolvedEventKey,
        eventLabel: resolvedEventLabel,
        isEventMatched: Boolean(matchedEv),
        isDuplicate,
        selected: !isDuplicate,
      };
    });

    setStagedHistoryRows(staged);
    setReconcileSelections({});
    const dupCount = staged.filter((r) => r.isDuplicate).length;
    setBenchmarkStatusMsg(
      `Staged ${staged.length} ${isRelaySheet ? 'relay ' : ''}rows (${staged.length - dupCount} new, ${dupCount} already in database). Review or reconcile below before committing.`
    );
  };

  // Unmatched athletes, competitions, and events in current staging table
  const stagingUnmatched = useMemo(() => {
    const athletes = new Map();
    const competitions = new Map();
    const events = new Map();

    stagedHistoryRows.forEach((row) => {
      const namesToCheck =
        row.swimType === 'RELAY_TEAM' && Array.isArray(row.relayLegs)
          ? row.relayLegs
          : [row.swimmerName];

      namesToCheck.forEach((rawCandidate) => {
        const matchedAth = resolveMasterAthlete(rawCandidate);
        if (!matchedAth) {
          const key = normalizeSwimmerKey(rawCandidate);
          if (!athletes.has(key)) {
            athletes.set(key, {
              rawName: rawCandidate,
              inferredGender: row.eventKey.startsWith('men') ? 'Men' : 'Women',
              count: 1,
            });
          } else {
            athletes.get(key).count += 1;
          }
        }
      });

      if (row.competition && !resolveMasterCompetition(row.competition, row.date)) {
        const cKey = `${normalizeCompKey(row.competition)}|${normalizeDateIso(row.date)}`;
        if (!competitions.has(cKey)) {
          competitions.set(cKey, {
            rawName: row.competition.trim(),
            sampleDate: normalizeDateIso(row.date),
            sampleLocation: row.location || '',
            count: 1,
          });
        } else {
          competitions.get(cKey).count += 1;
        }
      }
      const firstLegAth =
        row.swimType === 'RELAY_TEAM' && Array.isArray(row.relayLegs)
          ? row.relayLegs.map((n) => resolveMasterAthlete(n)).find(Boolean)
          : resolveMasterAthlete(row.swimmerName);
      const genderHint = firstLegAth?.gender || swimmerGenderLookup[row.swimmerKey] || '';
      if (!resolveMasterEvent(row.rawEventInput || row.eventLabel, genderHint)) {
        const eKey = `${(row.rawEventInput || row.eventLabel).trim().toLowerCase()}|${genderHint}`;
        if (!events.has(eKey)) {
          events.set(eKey, {
            rawEvent: (row.rawEventInput || row.eventLabel).trim(),
            genderHint,
            count: 1,
          });
        } else {
          events.get(eKey).count += 1;
        }
      }
    });
    return {
      athletes: Array.from(athletes.values()),
      competitions: Array.from(competitions.values()),
      events: Array.from(events.values()),
    };
  }, [stagedHistoryRows, masterRoster, masterCompetitions, masterEvents, swimmerGenderLookup]);

  // Apply all pending athlete, competition, & event reconciliations
  const handleApplyReconciliations = () => {
    let nextRoster = [...masterRoster];
    let nextComps = [...masterCompetitions];
    let nextEvents = [...masterEvents];
    const changedRoster = [];
    const changedComps = [];
    const changedEvents = [];

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
      const selKey = `comp:${normalizeCompKey(item.rawName)}|${item.sampleDate}`;
      const choice = reconcileSelections[selKey] || '__NEW__';
      if (choice === '__NEW__') {
        const created = {
          id: `comp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          canonicalName: item.rawName,
          date: item.sampleDate,
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
            // Adopt the incoming date only if the target Master Competition had no date set
            date: normalizeDateIso(c.date) || item.sampleDate,
            aliases: Array.from(new Set([...(c.aliases || []), item.rawName])),
          };
          changedComps.push(updated);
          return updated;
        });
      }
    });

    stagingUnmatched.events.forEach((item) => {
      const selKey = `ev:${item.rawEvent.toLowerCase()}|${item.genderHint}`;
      const choice = reconcileSelections[selKey];
      if (!choice) return;
      nextEvents = nextEvents.map((ev) => {
        if (ev.id !== choice) return ev;
        const updated = {
          ...ev,
          aliases: Array.from(new Set([...(ev.aliases || []), item.rawEvent])),
        };
        changedEvents.push(updated);
        return updated;
      });
    });

    updateMasterRoster(nextRoster, changedRoster);
    updateMasterCompetitions(nextComps, changedComps);
    if (changedEvents.length > 0) {
      updateMasterEvents(nextEvents, changedEvents);
    }

    const updatedStaged = stagedHistoryRows.map((row) => {
      const resolveSingleAth = (name) => {
        const k = normalizeSwimmerKey(name);
        return nextRoster.find(
          (a) =>
            normalizeSwimmerKey(a.canonicalName) === k ||
            (a.aliases || []).some((al) => normalizeSwimmerKey(al) === k)
        );
      };

      const isRelayRow = row.swimType === 'RELAY_TEAM' && Array.isArray(row.relayLegs);
      const resolvedLegs = isRelayRow
        ? row.relayLegs.map((legName) => {
            const m = resolveSingleAth(legName);
            return m ? m.canonicalName : legName;
          })
        : null;

      const key = normalizeSwimmerKey(row.swimmerName);
      const ath = isRelayRow
        ? row.relayLegs.map((n) => resolveSingleAth(n)).find(Boolean)
        : resolveSingleAth(row.swimmerName);
      const resolvedName = isRelayRow
        ? resolvedLegs.join(', ')
        : ath
        ? ath.canonicalName
        : row.swimmerName;
      const genderHint = ath?.gender || swimmerGenderLookup[key] || '';

      const cKey = normalizeCompKey(row.competition);
      const dKey = normalizeDateIso(row.date);
      const compNameMatches = (c) =>
        normalizeCompKey(c.canonicalName) === cKey ||
        (c.aliases || []).some((al) => normalizeCompKey(al) === cKey);

      const comp =
        (dKey
          ? nextComps.find((c) => normalizeDateIso(c.date) === dKey && compNameMatches(c))
          : null) ||
        nextComps.find((c) => !normalizeDateIso(c.date) && compNameMatches(c)) ||
        null;

      const rawEvStr = (row.rawEventInput || row.eventLabel || '').trim();
      const normEvKey = normalizeEventKey(rawEvStr, genderHint);
      const evMatch =
        nextEvents.find(
          (ev) =>
            ev.canonicalName.toLowerCase() === rawEvStr.toLowerCase() ||
            (ev.aliases || []).some((al) => al.trim().toLowerCase() === rawEvStr.toLowerCase())
        ) ||
        (normEvKey && (normEvKey.startsWith('women ') || normEvKey.startsWith('men '))
          ? nextEvents.find((ev) => ev.eventKey === normEvKey)
          : null);

      const resolvedComp = comp ? comp.canonicalName : row.competition;
      const resolvedDate = comp?.date ? normalizeDateIso(comp.date) : row.date;
      const resolvedLocation = comp?.defaultLocation || row.location || '';
      const resolvedEventKey = evMatch ? evMatch.eventKey : normEvKey || row.eventKey;
      const resolvedEventLabel = evMatch
        ? evMatch.canonicalName
        : resolvedEventKey
        ? toTitleEventLabel(resolvedEventKey)
        : row.eventLabel;

      const isDuplicate = historicalRecords.some(
        (hr) =>
          hr.swimmerKey === normalizeSwimmerKey(resolvedName) &&
          hr.eventKey === resolvedEventKey &&
          hr.seconds.toFixed(2) === row.seconds.toFixed(2) &&
          hr.date === resolvedDate &&
          (hr.round || 'Finals') === (row.round || 'Finals') &&
          hr.place === row.place
      );

      return {
        ...row,
        ...(isRelayRow ? { relayLegs: resolvedLegs } : {}),
        swimmerName: resolvedName,
        swimmerKey: normalizeSwimmerKey(resolvedName),
        competition: resolvedComp,
        date: resolvedDate,
        dateObj: parseFlexibleDate(resolvedDate),
        location: resolvedLocation,
        eventKey: resolvedEventKey,
        eventLabel: resolvedEventLabel,
        isEventMatched: Boolean(evMatch),
        isDuplicate,
        selected: !isDuplicate,
      };
    });

    setStagedHistoryRows(updatedStaged);
    setReconcileSelections({});
    setBenchmarkStatusMsg('Reconciled Master List matches and updated staged preview.');
  };

  // Commit staged rows into database (Relay rows also generate 4 individual RELAY_WIN records when Place === '1' in Finals)
  const handleCommitStagedRows = (mode = 'append') => {
    const chosen = [];

    stagedHistoryRows
      .filter((r) => r.selected)
      .forEach(({ isDuplicate, selected, isEventMatched, rawEventInput, ...cleanRow }) => {
        chosen.push(cleanRow);

        if (
          cleanRow.swimType === 'RELAY_TEAM' &&
          Array.isArray(cleanRow.relayLegs) &&
          String(cleanRow.place || '').trim() === '1' &&
          String(cleanRow.round || 'Finals').toLowerCase() === 'finals'
        ) {
          cleanRow.relayLegs.forEach((legName, legIdx) => {
            const legKey = normalizeSwimmerKey(legName);
            if (!legKey) return;
            chosen.push({
              ...cleanRow,
              id: `${cleanRow.id}-win-leg${legIdx + 1}`,
              swimmerName: legName,
              swimmerKey: legKey,
              swimType: 'RELAY_WIN',
              isOfficial: false,
              splitContext: `Leg ${legIdx + 1}`,
            });
          });
        }
      });

    if (chosen.length === 0) {
      setBenchmarkStatusMsg('No rows selected in staging table to commit.');
      return;
    }

    const next = mode === 'replace' ? chosen : [...historicalRecords, ...chosen];
    updateHistoricalRecords(next, chosen, mode === 'replace');
    setBenchmarkStatusMsg(
      `Committed ${chosen.length} verified records (${next.length} total in database).`
    );
    setStagedHistoryRows([]);
    setPasteSheetText('');
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

  // Persist a parsed .cl2 / .sd3 meet into the Saved Meet Repository ("Load Past Meet")
  const saveMeetToRepository = async (rawText, parsedObj) => {
    if (!rawText || !parsedObj) return;
    const meetName = (parsedObj.meetInfo?.name || 'Swim Meet').trim();
    const meetDate = parsedObj.meetInfo?.isoDate || parsedObj.meetInfo?.startDate || '';
    const slugBase = `${meetName}_${meetDate}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '');
    const meetId = slugBase || `meet_${Date.now()}`;

    const entry = {
      id: meetId,
      name: meetName,
      startDate: parsedObj.meetInfo?.startDate || '',
      isoDate: meetDate,
      city: parsedObj.meetInfo?.city || '',
      state: parsedObj.meetInfo?.state || '',
      teamsLabel: (parsedObj.teams || []).map((t) => t.name).join(' vs. '),
      swimCount: parsedObj.stats?.totalSwims || 0,
      updatedAt: new Date().toISOString(),
      rawCl2: rawText,
    };

    setSelectedSavedMeetId(meetId);
    setSavedMeets((prev) => {
      const filtered = prev.filter((m) => m.id !== meetId);
      const next = [entry, ...filtered];
      try {
        localStorage.setItem('swimmeet_saved_meets_v1', JSON.stringify(next));
      } catch {}
      return next;
    });

    if (cloudUser) {
      try {
        await setDoc(doc(db, 'saved_meets', meetId), entry);
      } catch {}
    }
  };

  const handleLoadSavedMeet = (meetId) => {
    setSelectedSavedMeetId(meetId);
    if (!meetId) return;
    const found = savedMeets.find((m) => m.id === meetId);
    if (!found || !found.rawCl2) {
      setMeetErrorMsg('Saved meet file content could not be found.');
      return;
    }
    handleProcessMeetText(found.rawCl2, { autoSave: false, preserveId: meetId });
    setBenchmarkStatusMsg(
      `Loaded saved meet "${found.name}"${found.startDate ? ` (${found.startDate})` : ''}.`
    );
  };

  const handleDeleteSavedMeet = async (meetId) => {
    if (!meetId) return;
    setSavedMeets((prev) => {
      const next = prev.filter((m) => m.id !== meetId);
      try {
        localStorage.setItem('swimmeet_saved_meets_v1', JSON.stringify(next));
      } catch {}
      return next;
    });
    if (selectedSavedMeetId === meetId) setSelectedSavedMeetId('');
    if (cloudUser) {
      try {
        await deleteDoc(doc(db, 'saved_meets', meetId));
      } catch {}
    }
    setBenchmarkStatusMsg('Removed meet from Saved Meet Repository.');
  };

  // Process uploaded or sample CL2/SD3 text
  const handleProcessMeetText = (rawText, options = {}) => {
    const { autoSave = true, preserveId = null } = options;
    try {
      setMeetErrorMsg('');
      const parsed = parseSDIFContent(rawText);
      setParsedData(parsed);
      if (preserveId) setSelectedSavedMeetId(preserveId);
      setSelectedEventFilter('ALL');
      setGenderFilter('ALL');
      setSearchQuery('');
      setExpandedRows(new Set());
      setMeetSubTab('individual');
      setMeetReconcileSelections({});
      setMeetClassOverrides({});
      setMeetDateOverrides({});
      setDayRangeStartEvent('');
      setDayRangeEndEvent('');
      setDayRangeTargetDate(parsed.meetInfo.isoDate || '');
      setExcludedMeetCommitIds(new Set());
      setSimCustomOrders({});
      setSimScratchedIds(new Set());

      // Assign default distinct hex colors to any teams not yet configured
      const palette = [
        '#0284c7',
        '#d97706',
        '#059669',
        '#7c3aed',
        '#e11d48',
        '#0d9488',
        '#4f46e5',
        '#ca8a04',
      ];
      setTeamColors((prev) => {
        const next = { ...prev };
        parsed.teams.forEach((t, idx) => {
          if (!next[t.code]) {
            next[t.code] = t.name.toLowerCase().includes('gettysburg')
              ? '#0284c7'
              : palette[idx % palette.length];
          }
        });
        try {
          localStorage.setItem('swimmeet_team_colors_v1', JSON.stringify(next));
        } catch {}
        return next;
      });

      const firstEv = parsed.individualResults[0]?.eventLabel || '';
      setSelectedHeatEventLabel(firstEv);
      setSelectedHeatNum('ALL');

      if (parsed.teams.length > 0) {
        const gettysburgTeam = parsed.teams.find((t) =>
          t.name.toLowerCase().includes('gettysburg')
        );
        const chosen = gettysburgTeam
          ? gettysburgTeam.code
          : parsed.teams.some((t) => t.code === selectedTeam)
          ? selectedTeam
          : 'ALL';
        setSelectedTeam(chosen);
        try {
          localStorage.setItem('swimmeet_primary_team_v1', chosen);
        } catch {}
      }

      if (autoSave) {
        saveMeetToRepository(rawText, parsed);
      }
    } catch (err) {
      setMeetErrorMsg(err.message || 'Failed to parse SDIF/CL2 file.');
    }
  };

  const handleFileUpload = (fileOrEvent) => {
    const file = fileOrEvent?.target ? fileOrEvent.target.files?.[0] : fileOrEvent;
    if (!file) return;
    const validExt = /\.(cl2|sd3|txt)$/i;
    if (!validExt.test(file.name)) {
      setMeetErrorMsg('Please upload a valid .cl2, .sd3, or .txt Hy-Tek results file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      handleProcessMeetText(ev.target.result);
    };
    reader.onerror = () => {
      setMeetErrorMsg('Error reading the selected file.');
    };
    reader.readAsText(file);
  };

  const handleLogoFileSelect = (fileOrEvent, side) => {
    const file = fileOrEvent?.target ? fileOrEvent.target.files?.[0] : fileOrEvent;
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setBenchmarkStatusMsg('Please select a valid image file (PNG, JPG, SVG, or WebP) for the logo.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = String(ev.target?.result || '');
      if (side === 'away') setAwayLogoDataUrl(dataUrl);
      else setHomeLogoDataUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const toggleRow = (id) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getTeamHexColor = (teamCode, teamName = '') => {
    if (teamColors[teamCode]) return teamColors[teamCode];
    if (String(teamName).toLowerCase().includes('gettysburg')) return '#0284c7';
    return '#64748b';
  };

  const handleSetTeamHexColor = (teamCode, hex) => {
    setTeamColors((prev) => {
      const next = { ...prev, [teamCode]: hex };
      try {
        localStorage.setItem('swimmeet_team_colors_v1', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const updateQualStandardsList = async (nextList, changedItem = null, deletedId = null) => {
    setQualStandards(nextList);
    try {
      localStorage.setItem('swimmeet_qual_standards_v1', JSON.stringify(nextList));
    } catch {}
    if (cloudUser) {
      try {
        if (deletedId) {
          await deleteDoc(doc(db, 'qual_standards', String(deletedId)));
        } else if (changedItem) {
          await setDoc(doc(db, 'qual_standards', String(changedItem.id)), changedItem);
        }
      } catch (err) {
        setCloudSyncStatus('offline');
        setCloudErrorMsg(err?.code || err?.message || 'standards-sync-failed');
      }
    }
  };

  // Extract numeric Swimcloud team ID from a team URL, iframe embed code, or raw numeric ID
  const extractSwimcloudTeamId = (rawInput) => {
    const str = String(rawInput || '').trim();
    if (!str) return '';
    if (/^\d+$/.test(str)) return str;
    const paramMatch = str.match(/[?&]team=(\d+)/i);
    if (paramMatch) return paramMatch[1];
    const pathMatch = str.match(/swimcloud\.com\/team\/(\d+)/i);
    if (pathMatch) return pathMatch[1];
    return '';
  };

  const persistOpponentScout = async (scoutObj) => {
    setOpponentScouts((prev) => {
      const filtered = prev.filter((s) => s.id !== scoutObj.id);
      const next = [...filtered, scoutObj].sort((a, b) =>
        String(a.teamName || '').localeCompare(String(b.teamName || ''))
      );
      try {
        localStorage.setItem('swimmeet_opponent_scouts_v1', JSON.stringify(next));
      } catch {}
      return next;
    });
    if (cloudUser) {
      try {
        await setDoc(doc(db, 'opponent_scouts', String(scoutObj.id)), scoutObj);
      } catch {}
    }
  };

  const handleDeleteOpponentScout = async (scoutId) => {
    if (!scoutId) return;
    setOpponentScouts((prev) => {
      const next = prev.filter((s) => s.id !== scoutId);
      try {
        localStorage.setItem('swimmeet_opponent_scouts_v1', JSON.stringify(next));
      } catch {}
      return next;
    });
    if (selectedScoutId === scoutId) setSelectedScoutId('');
    if (cloudUser) {
      try {
        await deleteDoc(doc(db, 'opponent_scouts', String(scoutId)));
      } catch {}
    }
    setBenchmarkStatusMsg('Deleted opponent scouting profile.');
  };

  // Parse pasted lines copied from Swimcloud Team Times iframe or Top Times page
  const parseSwimcloudPastedTimes = (rawText, genderLabel, fallbackEventKey = '') => {
    const lines = String(rawText || '')
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) return [];

    let currentEventKey = fallbackEventKey || '';
    const parsedEntries = [];

    const detectEventHeader = (line) => {
      const clean = line.replace(/\s+/g, ' ').trim();
      if (clean.length > 65) return '';
      if (/\d{1,2}:\d{2}\.\d{2}/.test(clean)) return '';
      const evKey = normalizeEventKey(clean, genderLabel);
      if (
        evKey &&
        (evKey.startsWith('women ') || evKey.startsWith('men ')) &&
        /\b(50|100|200|400|500|800|1000|1650)\b/.test(evKey)
      ) {
        return evKey;
      }
      return '';
    };

    lines.forEach((line, idx) => {
      // Check if line is an event section header (e.g., "50 Y Free" or "Women 100 Backstroke")
      const headerEv = detectEventHeader(line);
      if (headerEv && !/\b\d{2}\.\d{2}\b/.test(line)) {
        currentEventKey = headerEv;
        return;
      }

      const cols = line.includes('\t')
        ? line.split('\t').map((c) => c.trim()).filter(Boolean)
        : line.split(/\s{2,}/).map((c) => c.trim()).filter(Boolean);

      // Find swimming time token (e.g., 21.45, 48.92, 1:42.18, 10:15.44)
      const timeRegex = /^(?:(\d{1,2}):)?(\d{2}\.\d{2})[A-Z*]?$/;
      let timeStr = '';
      let timeColIdx = -1;

      for (let c = 0; c < cols.length; c++) {
        const m = cols[c].match(timeRegex);
        if (m) {
          timeStr = m[0].replace(/[A-Z*]+$/i, '');
          timeColIdx = c;
          break;
        }
      }

      if (!timeStr) {
        const inlineMatch = line.match(/\b(?:(\d{1,2}):)?(\d{2}\.\d{2})\b/);
        if (inlineMatch) {
          timeStr = inlineMatch[0];
        }
      }

      const sec = timeToSeconds(timeStr);
      if (sec === null || sec <= 15) return;

      // Also check if an event name is inline on the same row
      let rowEventKey = currentEventKey;
      for (const col of cols) {
        const inlineEv = detectEventHeader(col);
        if (inlineEv) {
          rowEventKey = inlineEv;
          break;
        }
      }
      if (!rowEventKey) return;

      // Extract athlete name & optional class year from columns before the time
      let rawName = '';
      let classYr = '';
      const candidateCols = timeColIdx > 0 ? cols.slice(0, timeColIdx) : cols;
      for (const token of candidateCols) {
        if (/^\d+$/.test(token)) continue; // rank number
        if (/^(FR|SO|JR|SR|GR|FRESHMAN|SOPHOMORE|JUNIOR|SENIOR)$/i.test(token)) {
          classYr = normalizeClass(token);
          continue;
        }
        if (detectEventHeader(token)) continue;
        if (/[a-zA-Z]{2,}/.test(token) && !rawName) {
          rawName = token;
        }
      }

      // If single-line fallback without tabs, strip rank, time, date, and class year
      if (!rawName) {
        const stripped = line
          .replace(/^\d+\s+/, '')
          .replace(timeStr, '')
          .replace(/\b(FR|SO|JR|SR|GR)\b/g, '')
          .replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s+\d{4}\b/gi, '')
          .replace(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g, '')
          .trim();
        if (/[a-zA-Z]{2,}/.test(stripped)) {
          rawName = stripped;
        }
      }

      if (!rawName) return;
      const formattedName = formatSwimmerDisplayName(rawName);
      const isRelay = rowEventKey.endsWith('relay');

      parsedEntries.push({
        id: `sc-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
        swimmerName: isRelay ? `${formattedName} Relay` : formattedName,
        swimmerKey: normalizeSwimmerKey(formattedName),
        classYear: classYr,
        gender: genderLabel,
        eventKey: rowEventKey,
        eventLabel: toTitleEventLabel(rowEventKey),
        time: timeStr,
        seconds: sec,
        isRelay,
      });
    });

    return parsedEntries;
  };

  // Resolve the active dual-meet event order for Swimcloud Opponent Scout (8 standard presets + Custom)
  const getScoutDualEvents = () => {
    const presetSpecs = {
      '200MR_200IM_200FR': { mr: '200 Medley Relay', im: '200 Individual Medley', fr: '200 Freestyle Relay' },
      '200MR_200IM_400FR': { mr: '200 Medley Relay', im: '200 Individual Medley', fr: '400 Freestyle Relay' },
      '200MR_400IM_200FR': { mr: '200 Medley Relay', im: '400 Individual Medley', fr: '200 Freestyle Relay' },
      '200MR_400IM_400FR': { mr: '200 Medley Relay', im: '400 Individual Medley', fr: '400 Freestyle Relay' },
      '400MR_200IM_200FR': { mr: '400 Medley Relay', im: '200 Individual Medley', fr: '200 Freestyle Relay' },
      '400MR_200IM_400FR': { mr: '400 Medley Relay', im: '200 Individual Medley', fr: '400 Freestyle Relay' },
      '400MR_400IM_200FR': { mr: '400 Medley Relay', im: '400 Individual Medley', fr: '200 Freestyle Relay' },
      '400MR_400IM_400FR': { mr: '400 Medley Relay', im: '400 Individual Medley', fr: '400 Freestyle Relay' },
    };

    if (scoutFormatPreset === 'CUSTOM') {
      return scoutCustomEvents.length > 0
        ? scoutCustomEvents
        : ['200 Medley Relay', '200 Freestyle Relay'];
    }

    const chosen = presetSpecs[scoutFormatPreset] || presetSpecs['200MR_200IM_200FR'];
    return [
      chosen.mr,
      '1000 Freestyle',
      '200 Freestyle',
      '100 Backstroke',
      '100 Breaststroke',
      '200 Butterfly',
      '50 Freestyle',
      '100 Freestyle',
      '200 Backstroke',
      '200 Breaststroke',
      '500 Freestyle',
      '100 Butterfly',
      chosen.im,
      chosen.fr,
    ];
  };

  // Load Head-to-Head Gettysburg vs. Scouted Opponent Dual Meet into the Score Simulator
  const handleLoadScoutIntoSimulator = (scoutObj) => {
    if (!scoutObj) return;
    const seasonStart = getCurrentSeasonStart();
    const dualEvents = getScoutDualEvents();

    const ourCode = 'MAGETT';
    const ourName = 'Gettysburg College';
    const oppCode =
      scoutObj.teamName
        .toUpperCase()
        .replace(/[^A-Z]/g, '')
        .slice(0, 6) || 'OPPON';
    const oppName = scoutObj.teamName;

    const activeRoster = masterRoster.filter((a) => a.isActive);
    const individualResults = [];
    const relayResults = [];
    let evNum = 1;

    ['Women', 'Men'].forEach((gender) => {
      dualEvents.forEach((baseEv) => {
        const fullEvLabel = `${gender} ${baseEv}`;
        const evKey = fullEvLabel.toLowerCase();
        const isRelay = baseEv.toLowerCase().includes('relay');

        // 1. Gettysburg best marks (up to top 4 per event)
        if (!isRelay) {
          const ourBestMap = new Map();
          activeRoster
            .filter((a) => a.gender === gender)
            .forEach((ath) => {
              const swKey = normalizeSwimmerKey(ath.canonicalName);
              const pool = historicalRecords.filter((r) => {
                if (r.isOfficial === false || r.eventKey !== evKey) return false;
                const m = resolveMasterAthlete(r.swimmerName);
                const k = normalizeSwimmerKey(m ? m.canonicalName : r.swimmerName);
                if (k !== swKey) return false;
                if (scoutOurBasis === 'SB') {
                  return Boolean(r.dateObj && r.dateObj >= seasonStart);
                }
                return true;
              });
              if (pool.length > 0) {
                const best = pool.reduce((b, c) => (c.seconds < b.seconds ? c : b));
                ourBestMap.set(swKey, { ath, rec: best });
              }
            });

          Array.from(ourBestMap.values())
            .sort((a, b) => a.rec.seconds - b.rec.seconds)
            .slice(0, 4)
            .forEach(({ ath, rec }, idx) => {
              individualResults.push({
                id: `sim-our-${evNum}-${idx}-${ath.id}`,
                type: 'individual',
                teamCode: ourCode,
                teamName: ourName,
                swimmerName: ath.canonicalName,
                preferredFirst: '',
                classYear: rec.classYear || '',
                genderCode: gender === 'Women' ? 'F' : 'M',
                genderLabel: gender,
                distance: parseInt(baseEv, 10) || 100,
                strokeName: baseEv.replace(/^\d+\s+/, ''),
                eventNumber: evNum,
                eventLabel: fullEvLabel,
                seedTime: rec.time,
                seedSeconds: rec.seconds,
                finalsTime: 'NT',
                timeSeconds: Infinity,
                course: 'SCY (Yards)',
                heat: '1',
                lane: String((idx + 1) * 2),
                place: null,
                points: 0,
                splits: [],
              });
            });
        } else {
          // Top 2 Gettysburg historical relays for this event
          const ourRelays = historicalRecords
            .filter((r) => r.isOfficial !== false && r.eventKey === evKey)
            .sort((a, b) => a.seconds - b.seconds)
            .slice(0, 2);
          ourRelays.forEach((relRec, idx) => {
            const letter = idx === 0 ? 'A' : 'B';
            relayResults.push({
              id: `sim-our-rel-${evNum}-${idx}`,
              type: 'relay',
              relayLetter: letter,
              teamCode: ourCode,
              teamName: ourName,
              relayTitle: `${ourName} "${letter}"`,
              genderCode: gender === 'Women' ? 'F' : 'M',
              genderLabel: gender,
              distance: parseInt(baseEv, 10) || 200,
              strokeName: baseEv.replace(/^\d+\s+/, ''),
              eventNumber: evNum,
              eventLabel: fullEvLabel,
              seedTime: relRec.time,
              seedSeconds: relRec.seconds,
              finalsTime: 'NT',
              timeSeconds: Infinity,
              course: 'SCY (Yards)',
              heat: '1',
              lane: idx === 0 ? '4' : '2',
              place: null,
              points: 0,
              legs: [],
              splits: [],
            });
          });
        }

        // 2. Scouted Opponent entries for this event
        const oppEntries = (scoutObj.entries || [])
          .filter((e) => e.eventKey === evKey)
          .sort((a, b) => a.seconds - b.seconds)
          .slice(0, isRelay ? 2 : 4);

        oppEntries.forEach((opp, idx) => {
          if (isRelay) {
            const letter = idx === 0 ? 'A' : 'B';
            relayResults.push({
              id: `sim-opp-rel-${evNum}-${idx}-${opp.id}`,
              type: 'relay',
              relayLetter: letter,
              teamCode: oppCode,
              teamName: oppName,
              relayTitle: `${oppName} "${letter}"`,
              genderCode: gender === 'Women' ? 'F' : 'M',
              genderLabel: gender,
              distance: parseInt(baseEv, 10) || 200,
              strokeName: baseEv.replace(/^\d+\s+/, ''),
              eventNumber: evNum,
              eventLabel: fullEvLabel,
              seedTime: opp.time,
              seedSeconds: opp.seconds,
              finalsTime: 'NT',
              timeSeconds: Infinity,
              course: 'SCY (Yards)',
              heat: '1',
              lane: idx === 0 ? '3' : '5',
              place: null,
              points: 0,
              legs: [],
              splits: [],
            });
          } else {
            individualResults.push({
              id: `sim-opp-${evNum}-${idx}-${opp.id}`,
              type: 'individual',
              teamCode: oppCode,
              teamName: oppName,
              swimmerName: opp.swimmerName,
              preferredFirst: '',
              classYear: opp.classYear || '',
              genderCode: gender === 'Women' ? 'F' : 'M',
              genderLabel: gender,
              distance: parseInt(baseEv, 10) || 100,
              strokeName: baseEv.replace(/^\d+\s+/, ''),
              eventNumber: evNum,
              eventLabel: fullEvLabel,
              seedTime: opp.time,
              seedSeconds: opp.seconds,
              finalsTime: 'NT',
              timeSeconds: Infinity,
              course: 'SCY (Yards)',
              heat: '1',
              lane: String(idx * 2 + 1),
              place: null,
              points: 0,
              splits: [],
            });
          }
        });

        evNum += 1;
      });
    });

    handleSetTeamHexColor(ourCode, '#0284c7');
    handleSetTeamHexColor(oppCode, scoutObj.color || '#e11d48');

    setParsedData({
      meetInfo: {
        name: `Projected Dual: Gettysburg vs. ${oppName}`,
        city: 'Gettysburg',
        state: 'PA',
        startDate: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        isoDate: new Date().toISOString().slice(0, 10),
        software: 'Swimcloud Opponent Scout Projection',
      },
      teams: [
        { code: ourCode, name: ourName, city: 'Gettysburg', state: 'PA', swimmerList: [] },
        { code: oppCode, name: oppName, city: '', state: '', swimmerList: [] },
      ],
      teamScores: [],
      individualResults,
      relayResults,
      stats: {
        totalTeams: 2,
        totalSwimmers: new Set(individualResults.map((r) => r.swimmerName)).size,
        totalIndividualSwims: individualResults.length,
        totalRelays: relayResults.length,
        totalSwims: individualResults.length + relayResults.length,
      },
    });
    setSimTimeBasis('SEED');
    setSimCustomOrders({});
    setSimScratchedIds(new Set());
    setInMeetSubTab('scoresim');
    setBenchmarkStatusMsg(
      `Loaded projected dual meet (Gettysburg ${scoutOurBasis} vs. ${oppName} Swimcloud times) into Score Simulator.`
    );
  };

  const handleSaveQualStandardEdit = (stdId) => {
    const cleanLbl = String(editStdDraft.label || '').trim();
    const secVal = timeToSeconds(editStdDraft.time);
    if (!cleanLbl || secVal === null || secVal <= 0) {
      setBenchmarkStatusMsg('Please enter a valid Badge Label and Time (e.g., 23.15 or 1:52.40).');
      return;
    }

    let updatedItem = null;
    const updatedList = qualStandards.map((item) => {
      if (item.id !== stdId) return item;
      updatedItem = {
        ...item,
        type: editStdDraft.type,
        label: cleanLbl,
        eventKey: editStdDraft.eventKey,
        eventLabel: toTitleEventLabel(editStdDraft.eventKey),
        time: String(editStdDraft.time).trim(),
        seconds: secVal,
        holder: String(editStdDraft.holder || '').trim(),
        date: normalizeDateIso(editStdDraft.date || ''),
      };
      return updatedItem;
    });
    updateQualStandardsList(updatedList, updatedItem);
    setEditingStdId(null);
    setBenchmarkStatusMsg(`Updated "${cleanLbl}" (${toTitleEventLabel(editStdDraft.eventKey)}: ${String(editStdDraft.time).trim()}).`);
  };
  
  const evaluateStandardsForSwim = (eventLabel, timeStr) => {
    const sec = timeToSeconds(timeStr);
    const evKey = normalizeEventKey(eventLabel);
    if (sec === null || !evKey || qualStandards.length === 0) return [];
    return qualStandards.filter((std) => {
      if (std.eventKey !== evKey) return false;
      const cutSec = timeToSeconds(std.time);
      return cutSec !== null && sec <= cutSec + 0.005;
    });
  };

  // Deterministic palette for freeform standard/record badge labels
  const getStandardBadgeStyle = (label = '') => {
    const palettes = [
      'bg-emerald-100 text-emerald-900 border border-emerald-300',
      'bg-violet-100 text-violet-900 border border-violet-300',
      'bg-rose-100 text-rose-900 border border-rose-300',
      'bg-sky-100 text-sky-900 border border-sky-300',
      'bg-teal-100 text-teal-900 border border-teal-300',
      'bg-fuchsia-100 text-fuchsia-900 border border-fuchsia-300',
      'bg-orange-100 text-orange-900 border border-orange-300',
      'bg-lime-100 text-lime-900 border border-lime-300',
    ];
    const clean = String(label || '').trim().toLowerCase();
    if (!clean) return palettes[0];
    let hash = 0;
    for (let i = 0; i < clean.length; i++) {
      hash = (hash * 31 + clean.charCodeAt(i)) >>> 0;
    }
    return palettes[hash % palettes.length];
  };

  // Render a 1920x1080 Broadcast Heat Graphic PNG for any Event + Heat
  const renderBroadcastHeatGraphicPng = (
    eventObj,
    heatLabel,
    laneEntriesMap,
    themeMode = 'slate',
    headerMarkKeys = null
  ) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const roundRectPath = (x, y, w, h, r) => {
      const radius = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + w, y, x + w, y + h, radius);
      ctx.arcTo(x + w, y + h, x, y + h, radius);
      ctx.arcTo(x, y + h, x, y, radius);
      ctx.arcTo(x, y, x + w, y, radius);
      ctx.closePath();
    };

    ctx.clearRect(0, 0, 1920, 1080);

    if (themeMode === 'slate') {
      const bgGrad = ctx.createLinearGradient(0, 0, 1920, 1080);
      bgGrad.addColorStop(0, '#090d16');
      bgGrad.addColorStop(0.55, '#0f172a');
      bgGrad.addColorStop(1, '#082f49');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1920, 1080);

      // Subtle top accent bar
      const topBarGrad = ctx.createLinearGradient(0, 0, 1920, 0);
      topBarGrad.addColorStop(0, '#0284c7');
      topBarGrad.addColorStop(0.5, '#38bdf8');
      topBarGrad.addColorStop(1, '#f59e0b');
      ctx.fillStyle = topBarGrad;
      ctx.fillRect(0, 0, 1920, 8);
    }

    const marginX = 76;
    const contentW = 1920 - marginX * 2;

    // Header Card
    roundRectPath(marginX, 36, contentW, 134, 18);
    ctx.fillStyle = themeMode === 'transparent' ? 'rgba(15, 23, 42, 0.94)' : 'rgba(15, 23, 42, 0.88)';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.stroke();

    // Event Pill
    roundRectPath(marginX + 28, 60, 168, 42, 10);
    ctx.fillStyle = '#0284c7';
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 22px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`EVENT ${eventObj.num}`, marginX + 28 + 84, 81);

    // Meet Name Subtitle
    ctx.textAlign = 'left';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 20px system-ui, -apple-system, sans-serif';
    const meetTitle = (parsedData?.meetInfo?.name || 'SWIM MEET').toUpperCase();
    ctx.fillText(meetTitle, marginX + 214, 81);

    // Event Name + Heat Title
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 42px system-ui, -apple-system, sans-serif';
    const heatDisplay =
      heatLabel && heatLabel !== 'ALL' ? ` — HEAT ${heatLabel}` : '';
    ctx.fillText(`${eventObj.label.toUpperCase()}${heatDisplay}`, marginX + 28, 134);

    // Right side Checked Standards / Records Reference Pills
    const activeEvKey = normalizeEventKey(eventObj.label);
    const officialEvPool = historicalRecords.filter(
      (r) => r.isOfficial !== false && r.eventKey === activeEvKey
    );
    const bestBySw = new Map();
    officialEvPool.forEach((r) => {
      if (!bestBySw.has(r.swimmerKey) || r.seconds < bestBySw.get(r.swimmerKey).seconds) {
        bestBySw.set(r.swimmerKey, r);
      }
    });
    const sortedEvBests = Array.from(bestBySw.values()).sort((a, b) => a.seconds - b.seconds);
    const schoolRec = sortedEvBests[0] || null;
    const freshmanRec =
      !eventObj.isRelay
        ? officialEvPool
            .filter((r) => normalizeClass(r.classYear) === 'FR')
            .sort((a, b) => a.seconds - b.seconds)[0] || null
        : null;
    const eventStandards = qualStandards.filter((s) => s.eventKey === activeEvKey);

    const activeMarkSet =
      headerMarkKeys instanceof Set ? headerMarkKeys : selectedPngHeaderMarks;

    const headerMarkItems = [];
    if (activeMarkSet.has('PROGRAM_RECORD') && schoolRec) {
      headerMarkItems.push({
        label: 'PROGRAM RECORD',
        value: `${schoolRec.time}  (${schoolRec.swimmerName})`,
        accent: '#fbbf24',
      });
    }
    if (activeMarkSet.has('FRESHMAN_RECORD') && freshmanRec) {
      headerMarkItems.push({
        label: 'FRESHMAN RECORD',
        value: `${freshmanRec.time}  (${freshmanRec.swimmerName})`,
        accent: '#f59e0b',
      });
    }
    eventStandards.forEach((std) => {
      const markKey = `STD_${std.id}`;
      if (activeMarkSet.has(markKey)) {
        const holderPart = std.holder ? `  (${std.holder})` : '';
        headerMarkItems.push({
          label: String(std.label || 'STANDARD').toUpperCase(),
          value: `${std.time}${holderPart}`,
          accent: '#38bdf8',
        });
      }
    });

    if (headerMarkItems.length > 0) {
      ctx.textAlign = 'right';
      const maxShown = Math.min(headerMarkItems.length, 3);
      const lineStep = maxShown === 1 ? 36 : maxShown === 2 ? 48 : 38;
      const startLineY = maxShown === 1 ? 94 : maxShown === 2 ? 78 : 66;

      headerMarkItems.slice(0, maxShown).forEach((item, idx) => {
        const yPos = startLineY + idx * lineStep;
        ctx.fillStyle = item.accent;
        ctx.font = '800 15px system-ui, -apple-system, sans-serif';
        ctx.fillText(item.label, marginX + contentW - 32, yPos - 11);
        ctx.fillStyle = '#ffffff';
        ctx.font = '800 21px ui-monospace, SFMono-Regular, Menlo, monospace';
        ctx.fillText(item.value, marginX + contentW - 32, yPos + 10);
      });
    }

    // All-Time Rank Lookup for Callout Pills
    const rankBySwimmer = new Map();
    sortedEvBests.forEach((rec, idx) => {
      if (idx < 10) rankBySwimmer.set(rec.swimmerKey, idx + 1);
    });

    // Lanes 1 to 8 Rows
    const startY = 192;
    const rowH = 96;
    const rowGap = 11;

    for (let laneNum = 1; laneNum <= 8; laneNum++) {
      const y = startY + (laneNum - 1) * (rowH + rowGap);
      const entry = laneEntriesMap.get(laneNum);

      roundRectPath(marginX, y, contentW, rowH, 14);
      ctx.fillStyle = entry
        ? themeMode === 'transparent'
          ? 'rgba(15, 23, 42, 0.90)'
          : 'rgba(30, 41, 59, 0.88)'
        : themeMode === 'transparent'
        ? 'rgba(15, 23, 42, 0.55)'
        : 'rgba(15, 23, 42, 0.50)';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = entry ? 'rgba(148, 163, 184, 0.25)' : 'rgba(148, 163, 184, 0.12)';
      ctx.stroke();

      const teamHex = entry ? getTeamHexColor(entry.teamCode, entry.teamName) : '#334155';

      // Left Team Color Lane Block
      ctx.save();
      roundRectPath(marginX, y, 104, rowH, 14);
      ctx.clip();
      ctx.fillStyle = teamHex;
      ctx.fillRect(marginX, y, 104, rowH);
      ctx.restore();

      // Right Team Color End Accent Bar
      if (entry) {
        ctx.save();
        roundRectPath(marginX + contentW - 16, y, 16, rowH, 8);
        ctx.clip();
        ctx.fillStyle = teamHex;
        ctx.fillRect(marginX + contentW - 16, y, 16, rowH);
        ctx.restore();
      }

      // Lane Number
      ctx.fillStyle = entry ? '#ffffff' : '#64748b';
      ctx.font = '900 44px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(laneNum), marginX + 52, y + rowH / 2 + 2);

      if (!entry) {
        ctx.textAlign = 'left';
        ctx.fillStyle = '#64748b';
        ctx.font = 'italic 600 24px system-ui, -apple-system, sans-serif';
        ctx.fillText('OPEN LANE', marginX + 136, y + rowH / 2);
        continue;
      }

      const isRelay = Boolean(eventObj.isRelay);
      const resolvedLegs = isRelay
        ? (entry.legs || []).map((l) => {
            const disp = formatSwimmerDisplay(l.swimmerName, l.preferredFirst);
            const m = resolveMasterAthlete(disp);
            return m ? m.canonicalName : disp;
          })
        : [];

      const displaySw = isRelay
        ? entry.relayTitle || `${entry.teamName} "${entry.relayLetter || 'A'}"`
        : formatSwimmerDisplay(entry.swimmerName, entry.preferredFirst);
      const resolvedAth = !isRelay ? resolveMasterAthlete(displaySw) : null;
      const canonicalName = resolvedAth ? resolvedAth.canonicalName : displaySw;
      const swKey = isRelay
        ? normalizeSwimmerKey(resolvedLegs.join(', '))
        : normalizeSwimmerKey(canonicalName);

      // Swimmer / Relay Title
      ctx.textAlign = 'left';
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 32px system-ui, -apple-system, sans-serif';
      const titleLine =
        !isRelay && entry.classYear ? `${canonicalName}  (${entry.classYear})` : canonicalName;
      ctx.fillText(titleLine, marginX + 134, y + 36);

      // Team Name + Relay Lineup Subtitle
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '600 20px system-ui, -apple-system, sans-serif';
      const subLine =
        isRelay && resolvedLegs.length > 0
          ? `${entry.teamName}  •  ${resolvedLegs.join(' • ')}`
          : entry.teamName;
      ctx.fillText(subLine, marginX + 134, y + 70);

      // Rank / Standard Callout Pill (if applicable)
      const rankNum = rankBySwimmer.get(swKey);
      const swHist = officialEvPool.filter((r) => r.swimmerKey === swKey);
      const pbRec =
        swHist.length > 0
          ? swHist.reduce((best, cur) => (cur.seconds < best.seconds ? cur : best))
          : null;

      let rightPillOffset = 0;
      if (rankNum) {
        const badgeText = rankNum === 1 ? 'SCHOOL RECORD' : `#${rankNum} ALL-TIME`;
        const badgeW = rankNum === 1 ? 215 : 185;
        const badgeX = marginX + contentW - 260 - badgeW;
        roundRectPath(badgeX, y + 26, badgeW, 44, 10);
        ctx.fillStyle = rankNum === 1 ? '#f59e0b' : 'rgba(245, 158, 11, 0.22)';
        ctx.fill();
        ctx.fillStyle = rankNum === 1 ? '#0f172a' : '#fcd34d';
        ctx.font = '800 18px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(badgeText, badgeX + badgeW / 2, y + 48);
        rightPillOffset = badgeW + 24;
      }

      // Seed Time & PB on Right
      const seedDisplay =
        entry.seedTime && entry.seedTime !== 'NT'
          ? entry.seedTime
          : entry.finalsTime && entry.finalsTime !== 'NT'
          ? entry.finalsTime
          : 'NT';

      ctx.textAlign = 'right';
      ctx.fillStyle = '#94a3b8';
      ctx.font = '700 16px system-ui, -apple-system, sans-serif';
      ctx.fillText(
        entry.seedTime && entry.seedTime !== 'NT' ? 'SEED TIME' : 'ENTRY TIME',
        marginX + contentW - 36,
        y + 28
      );

      ctx.fillStyle = '#38bdf8';
      ctx.font = '900 32px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillText(seedDisplay, marginX + contentW - 36, y + 60);

      if (pbRec && !rightPillOffset) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '700 17px ui-monospace, SFMono-Regular, Menlo, monospace';
        ctx.fillText(`PB ${pbRec.time}`, marginX + contentW - 235, y + 50);
      }
    }

    return canvas.toDataURL('image/png');
  };

  const triggerPngDownload = (dataUrl, filename) => {
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportAllMeetGraphics = async () => {
    if (!parsedData || isExportingAllGraphics) return;
    setIsExportingAllGraphics(true);

    try {
      const eventOptionMap = new Map();
      parsedData.individualResults.forEach((r) => {
        if (!eventOptionMap.has(r.eventLabel)) {
          eventOptionMap.set(r.eventLabel, {
            label: r.eventLabel,
            num: r.eventNumber,
            isRelay: false,
          });
        }
      });
      parsedData.relayResults.forEach((r) => {
        if (!eventOptionMap.has(r.eventLabel)) {
          eventOptionMap.set(r.eventLabel, {
            label: r.eventLabel,
            num: r.eventNumber,
            isRelay: true,
          });
        }
      });

      const orderedEvents = Array.from(eventOptionMap.values()).sort((a, b) => a.num - b.num);
      let exportedCount = 0;

      for (const evObj of orderedEvents) {
        const evSwims = evObj.isRelay
          ? parsedData.relayResults.filter((r) => r.eventLabel === evObj.label)
          : parsedData.individualResults.filter((r) => r.eventLabel === evObj.label);

        const heats = Array.from(new Set(evSwims.map((r) => r.heat).filter(Boolean))).sort(
          (a, b) => Number(a) - Number(b)
        );
        const heatTargets = heats.length > 0 ? heats : ['1'];

        for (const hNum of heatTargets) {
          const subset =
            heats.length > 0
              ? evSwims.filter((r) => String(r.heat) === String(hNum))
              : evSwims;
          const lMap = new Map();
          subset.forEach((sw) => {
            const ln = parseInt(sw.lane, 10);
            if (ln >= 1 && ln <= 8 && !lMap.has(ln)) {
              lMap.set(ln, sw);
            }
          });
          if (lMap.size === 0) continue;

          const safeEv = evObj.label.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '');
          const evPad = String(evObj.num).padStart(2, '0');
          const fileName = `Ev${evPad}_${safeEv}_Heat${hNum}.png`;
          const url = renderBroadcastHeatGraphicPng(
            evObj,
            hNum,
            lMap,
            broadcastGraphicTheme,
            selectedPngHeaderMarks
          );
          triggerPngDownload(url, fileName);
          exportedCount++;
          await new Promise((res) => setTimeout(res, 160));
        }
      }

      setBenchmarkStatusMsg(
        `Exported ${exportedCount} full-screen broadcast heat graphic PNGs (1920×1080).`
      );
    } finally {
      setIsExportingAllGraphics(false);
    }
  };

  // Benchmark Evaluation Engine (Dual Full-Distance vs Split PB/SB, All-Time Top-10, Freshman Record)
  const benchmarkIndex = useMemo(() => {
    const officialRows = historicalRecords.filter((r) => r.isOfficial !== false);
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

    const isSplitRow = (r) =>
      r.swimType === 'INTERMEDIATE_SPLIT' || String(r.place || '').toUpperCase() === 'S';

    const evaluateSwim = (
      swimmerName,
      eventLabel,
      timeStr,
      classYear = '',
      asIntermediateSplit = false
    ) => {
      const sec = timeToSeconds(timeStr);
      const evKey = normalizeEventKey(eventLabel);
      const resolvedAth = resolveMasterAthlete(swimmerName);
      const swKey = normalizeSwimmerKey(resolvedAth ? resolvedAth.canonicalName : swimmerName);

      if (sec === null || !evKey || officialRows.length === 0) return [];

      const tags = [];
      const eventPool = byEvent[evKey] || [];
      const swimmerPool = bySwimmerEvent[`${swKey}|${evKey}`] || [];

      const fullDistPool = swimmerPool.filter((r) => !isSplitRow(r));
      const splitPool = swimmerPool.filter((r) => isSplitRow(r));

      const targetPool = asIntermediateSplit ? splitPool : fullDistPool;
      const prefix = asIntermediateSplit ? 'Split ' : '';

      if (targetPool.length > 0) {
        const bestPast = Math.min(...targetPool.map((r) => r.seconds));
        if (sec < bestPast - 0.005) {
          tags.push({ type: 'PB', label: `${prefix}PB (-${(bestPast - sec).toFixed(2)}s)` });
        } else {
          const seasonPast = targetPool.filter((r) => r.dateObj && r.dateObj >= seasonStart);
          if (seasonPast.length > 0) {
            const bestSeason = Math.min(...seasonPast.map((r) => r.seconds));
            if (sec < bestSeason - 0.005) {
              tags.push({ type: 'SB', label: `${prefix}SB (-${(bestSeason - sec).toFixed(2)}s)` });
            }
          }
        }
      }

      // All-Time Top 10 (includes full-distance, R lead-offs, and S intermediate splits)
      const athleteBestMap = new Map();
      eventPool.forEach((r) => {
        const currentBest = athleteBestMap.get(r.swimmerKey);
        if (currentBest === undefined || Number(r.seconds) < currentBest) {
          athleteBestMap.set(r.swimmerKey, Number(r.seconds));
        }
      });

      const prevSortedTop10 = Array.from(athleteBestMap.entries())
        .filter(([, bestSec]) => Number.isFinite(bestSec) && bestSec > 0)
        .sort((a, b) => a[1] - b[1]);
      const prevRankIdx = prevSortedTop10.findIndex(([k]) => k === swKey);

      const existingBestForSwimmer = athleteBestMap.get(swKey);
      const effectiveBestForSwimmer =
        existingBestForSwimmer === undefined ? sec : Math.min(existingBestForSwimmer, sec);
      athleteBestMap.set(swKey, effectiveBestForSwimmer);

      const sortedTop10 = Array.from(athleteBestMap.entries())
        .filter(([, bestSec]) => Number.isFinite(bestSec) && bestSec > 0)
        .sort((a, b) => a[1] - b[1]);

      const rankIdx = sortedTop10.findIndex(([k]) => k === swKey);
      const improvedRank =
        rankIdx >= 0 &&
        rankIdx < 10 &&
        (prevRankIdx === -1 ||
          rankIdx < prevRankIdx ||
          (rankIdx === 0 && sec < (prevSortedTop10[0]?.[1] ?? Infinity) - 0.005));

      if (improvedRank) {
        const isRecordHolder =
          rankIdx === 0 ||
          (sortedTop10[0] && sec <= sortedTop10[0][1] + 0.005);
        tags.push({
          type: 'TOP10',
          label: isRecordHolder ? 'School Record (#1)' : `All-Time #${rankIdx + 1}`,
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
      (r) => r.isOfficial !== false && r.eventKey === recordBookEventKey
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

    // Event-Specific Career Wins Leaders (1st place in Finals for this event)
    const activeSet = new Set(
      masterRoster
        .filter((a) => a.isActive)
        .map((a) => normalizeSwimmerKey(a.canonicalName))
    );
    const eventWinnersMap = new Map();
    historicalRecords.forEach((r) => {
      if (r.eventKey !== recordBookEventKey) return;
      if (String(r.place || '').trim() !== '1') return;
      const roundClean = String(r.round || 'Finals').toLowerCase();
      if (roundClean === 'prelims' || roundClean === 'time trial') return;

      const athRecord = resolveMasterAthlete(r.swimmerName);
      const canonicalName = athRecord ? athRecord.canonicalName : r.swimmerName;
      const swKey = normalizeSwimmerKey(canonicalName);
      if (eventWinsActiveOnly && !activeSet.has(swKey)) return;

      if (!eventWinnersMap.has(swKey)) {
        eventWinnersMap.set(swKey, {
          swimmerKey: swKey,
          swimmerName: canonicalName,
          isActive: activeSet.has(swKey),
          wins: 0,
          bestTime: r.time,
          bestSeconds: r.seconds,
          meets: [],
        });
      }
      const item = eventWinnersMap.get(swKey);
      item.wins += 1;
      if (r.seconds < item.bestSeconds) {
        item.bestSeconds = r.seconds;
        item.bestTime = r.time;
      }
      item.meets.push(
        `${r.competition || 'Meet'}${r.date ? ` (${r.date.slice(0, 4)})` : ''}`
      );
    });

    const eventWinLeaders = Array.from(eventWinnersMap.values())
      .sort(
        (a, b) =>
          b.wins - a.wins ||
          a.bestSeconds - b.bestSeconds ||
          compareByLastName(a.swimmerName, b.swimmerName)
      )
      .slice(0, 10);

    return {
      top10,
      freshmanRecord: freshmanRows[0] || null,
      totalMatchedCount: officialRows.length,
      eventWinLeaders,
    };
  }, [historicalRecords, recordBookEventKey, masterRoster, eventWinsActiveOnly]);

  // Distinct recurring competition names for the All-Time Wins dropdown
  const recurringCompetitionsList = useMemo(() => {
    const names = new Set();
    masterCompetitions.forEach((c) => {
      if (c.canonicalName) names.add(c.canonicalName.trim());
    });
    historicalRecords.forEach((r) => {
      if (r.competition && String(r.place || '').trim() === '1') {
        names.add(r.competition.trim());
      }
    });
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [masterCompetitions, historicalRecords]);

  // Distinct options & filtered/sorted/paginated view for Committed Database
  const dbFilterOptions = useMemo(() => {
    const eventsSet = new Set();
    const compsSet = new Set();
    historicalRecords.forEach((r) => {
      if (r.eventLabel) eventsSet.add(r.eventLabel.trim());
      if (r.competition) compsSet.add(r.competition.trim());
    });
    return {
      events: Array.from(eventsSet).sort((a, b) => a.localeCompare(b)),
      competitions: Array.from(compsSet).sort((a, b) => a.localeCompare(b)),
    };
  }, [historicalRecords]);

  const filteredSortedDbRecords = useMemo(() => {
    const qName = dbSearchName.trim().toLowerCase();
    const qDate = dbFilterDate.trim().toLowerCase();

    const getRecordCategory = (r) => {
      const placeUp = String(r.place || '').toUpperCase();
      if (r.swimType === 'RELAY_LEADOFF' || placeUp === 'R' || placeUp === 'LR') {
        return 'RELAY_LEADOFF';
      }
      if (r.swimType === 'INTERMEDIATE_SPLIT' || placeUp === 'S') {
        return 'INTERMEDIATE_SPLIT';
      }
      if (r.swimType === 'RELAY_WIN' || String(r.eventLabel || '').toLowerCase().includes('relay')) {
        return 'RELAY_WIN';
      }
      return 'OFFICIAL';
    };

    const filtered = historicalRecords.filter((r) => {
      if (qName && !String(r.swimmerName || '').toLowerCase().includes(qName)) return false;
      if (dbFilterEvent !== 'ALL' && (r.eventLabel || '').trim() !== dbFilterEvent) return false;
      if (dbFilterCompetition !== 'ALL' && (r.competition || '').trim() !== dbFilterCompetition) {
        return false;
      }
      if (qDate && !String(r.date || '').toLowerCase().includes(qDate)) return false;
      if (dbFilterType !== 'ALL' && getRecordCategory(r) !== dbFilterType) return false;
      return true;
    });

    const dir = dbSortConfig.direction === 'asc' ? 1 : -1;
    return filtered.slice().sort((a, b) => {
      switch (dbSortConfig.key) {
        case 'swimmerName':
          return compareByLastName(a.swimmerName, b.swimmerName) * dir;
        case 'eventLabel':
          return String(a.eventLabel || '').localeCompare(String(b.eventLabel || '')) * dir;
        case 'time':
          return ((a.seconds ?? Infinity) - (b.seconds ?? Infinity)) * dir;
        case 'competition':
          return String(a.competition || '').localeCompare(String(b.competition || '')) * dir;
        case 'type':
          return getRecordCategory(a).localeCompare(getRecordCategory(b)) * dir;
        case 'date':
        default: {
          const cmp = String(a.date || '').localeCompare(String(b.date || ''));
          if (cmp !== 0) return cmp * dir;
          return compareByLastName(a.swimmerName, b.swimmerName);
        }
      }
    });
  }, [
    historicalRecords,
    dbSearchName,
    dbFilterEvent,
    dbFilterCompetition,
    dbFilterDate,
    dbFilterType,
    dbSortConfig,
  ]);

  const dbTotalPages = Math.max(1, Math.ceil(filteredSortedDbRecords.length / dbPageSize));
  const safeDbPage = Math.min(dbPage, dbTotalPages);
  const paginatedDbRecords = useMemo(() => {
    const start = (safeDbPage - 1) * dbPageSize;
    return filteredSortedDbRecords.slice(start, start + dbPageSize);
  }, [filteredSortedDbRecords, safeDbPage, dbPageSize]);

  const handleDbSort = (key) => {
    setDbSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
    setDbPage(1);
  };

  // All-Time Career Wins Leaderboard (Individual + Relay Finals Wins, optional Competition filter)
  const allTimeWinsLeaderboard = useMemo(() => {
    const activeSet = new Set(
      masterRoster
        .filter((a) => a.isActive)
        .map((a) => normalizeSwimmerKey(a.canonicalName))
    );

    const targetCompKey =
      winsCompetitionFilter !== 'ALL' ? normalizeCompKey(winsCompetitionFilter) : '';

    const athleteMap = new Map();

    historicalRecords.forEach((r) => {
      // Only count 1st-place finishes outside of Prelims / Time Trials
      const placeClean = String(r.place || '').trim();
      const roundClean = String(r.round || 'Finals').toLowerCase();
      if (placeClean !== '1') return;
      if (roundClean === 'prelims' || roundClean === 'time trial') return;

      // Filter by specific recurring competition/meet if chosen
      if (targetCompKey) {
        const rowCompKey = normalizeCompKey(r.competition);
        if (rowCompKey !== targetCompKey) return;
      }

      // Filter by selected gender
      const evLower = String(r.eventKey || r.eventLabel || '').toLowerCase();
      const athRecord = resolveMasterAthlete(r.swimmerName);
      const gender =
        athRecord?.gender ||
        (evLower.startsWith('men') ? 'Men' : evLower.startsWith('women') ? 'Women' : '');
      if (gender !== recordBookGender) return;

      const canonicalName = athRecord ? athRecord.canonicalName : r.swimmerName;
      const swKey = normalizeSwimmerKey(canonicalName);
      if (winsActiveOnly && !activeSet.has(swKey)) return;

      const isRelayWin =
        r.swimType === 'RELAY_WIN' || evLower.includes('relay');

      if (!athleteMap.has(swKey)) {
        athleteMap.set(swKey, {
          swimmerKey: swKey,
          swimmerName: canonicalName,
          isActive: activeSet.has(swKey),
          indWins: 0,
          relWins: 0,
          totalWins: 0,
          winLog: [],
        });
      }

      const entry = athleteMap.get(swKey);
      if (isRelayWin) {
        entry.relWins += 1;
      } else {
        entry.indWins += 1;
      }
      entry.totalWins += 1;
      entry.winLog.push({
        id: r.id,
        eventLabel: r.eventLabel,
        time: r.time,
        competition: r.competition,
        date: r.date,
        isRelay: isRelayWin,
        splitContext: r.splitContext || '',
      });
    });

    return Array.from(athleteMap.values())
      .map((ath) => ({
        ...ath,
        winLog: ath.winLog.sort((a, b) => (b.date || '').localeCompare(a.date || '')),
      }))
      .sort(
        (a, b) =>
          b.totalWins - a.totalWins ||
          b.indWins - a.indWins ||
          compareByLastName(a.swimmerName, b.swimmerName)
      );
  }, [
    historicalRecords,
    masterRoster,
    recordBookGender,
    winsActiveOnly,
    winsCompetitionFilter,
  ]);

  // Post-Meet Win Summary & Multi-Win Athletes
  const winSummary = useMemo(() => {
    if (!parsedData) return { totalWins: 0, athletes: [] };
    const athleteMap = {};
    let totalWins = 0;

    parsedData.individualResults.forEach((r) => {
      if (Number(r.place) !== 1) return;
      if (selectedTeam !== 'ALL' && r.teamCode !== selectedTeam) return;
      totalWins++;
      const name = formatSwimmerDisplay(r.swimmerName, r.preferredFirst);
      if (!athleteMap[name]) {
        athleteMap[name] = {
          name,
          teamName: r.teamName,
          indWins: 0,
          relWins: 0,
          events: [],
        };
      }
      athleteMap[name].indWins += 1;
      athleteMap[name].events.push(`${r.eventLabel} (${r.finalsTime})`);
    });

    parsedData.relayResults.forEach((rel) => {
      if (Number(rel.place) !== 1) return;
      if (selectedTeam !== 'ALL' && rel.teamCode !== selectedTeam) return;
      totalWins++;
      (rel.legs || []).forEach((leg) => {
        const name = formatSwimmerDisplay(leg.swimmerName, leg.preferredFirst);
        if (!athleteMap[name]) {
          athleteMap[name] = {
            name,
            teamName: rel.teamName,
            indWins: 0,
            relWins: 0,
            events: [],
          };
        }
        athleteMap[name].relWins += 1;
        athleteMap[name].events.push(
          `${rel.eventLabel} — Leg ${leg.legOrder} (${rel.finalsTime})`
        );
      });
    });

    const athletes = Object.values(athleteMap).sort(
      (a, b) => b.indWins + b.relWins - (a.indWins + a.relWins)
    );

    return { totalWins, athletes };
  }, [parsedData, selectedTeam]);

  // Available Events Dropdown Options for Section 4
  const availableMeetEvents = useMemo(() => {
    if (!parsedData) return [];
    const list =
      meetSubTab === 'relays' ? parsedData.relayResults : parsedData.individualResults;
    const map = new Map();
    list.forEach((item) => {
      if (!map.has(item.eventLabel)) {
        map.set(item.eventLabel, Number(item.eventNumber) || 999);
      }
    });
    return Array.from(map.entries())
      .sort((a, b) => a[1] - b[1])
      .map(([label, num]) => ({ label, num }));
  }, [parsedData, meetSubTab]);
  
  // Filtered & Sorted Individual Results for Section 4
  const filteredMeetIndividuals = useMemo(() => {
    if (!parsedData) return [];
    return parsedData.individualResults
      .filter((row) => {
        if (selectedTeam !== 'ALL' && row.teamCode !== selectedTeam) return false;
        if (genderFilter !== 'ALL' && row.genderLabel !== genderFilter) return false;
        if (selectedEventFilter !== 'ALL' && row.eventLabel !== selectedEventFilter) return false;
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const fullText =
            `${row.swimmerName} ${row.preferredFirst} ${row.teamName} ${row.eventLabel}`.toLowerCase();
          if (!fullText.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const dir = sortConfig.direction === 'asc' ? 1 : -1;
        switch (sortConfig.key) {
          case 'eventNumber':
            if (a.eventNumber !== b.eventNumber) return (a.eventNumber - b.eventNumber) * dir;
            return a.timeSeconds - b.timeSeconds;
          case 'swimmerName':
            return a.swimmerName.localeCompare(b.swimmerName) * dir;
          case 'teamName':
            return a.teamName.localeCompare(b.teamName) * dir;
          case 'time':
            return (a.timeSeconds - b.timeSeconds) * dir;
          case 'place': {
            const pA = a.place ?? 9999;
            const pB = b.place ?? 9999;
            return (pA - pB) * dir;
          }
          default:
            return 0;
        }
      });
  }, [parsedData, selectedTeam, genderFilter, selectedEventFilter, searchQuery, sortConfig]);

  const groupedIndividualEvents = useMemo(() => {
    const groupsMap = new Map();
    filteredMeetIndividuals.forEach((row) => {
      const key = `${row.eventNumber}-${row.eventLabel}`;
      if (!groupsMap.has(key)) {
        groupsMap.set(key, {
          key,
          eventNumber: row.eventNumber,
          eventLabel: row.eventLabel,
          course: row.course,
          swims: [],
        });
      }
      groupsMap.get(key).swims.push(row);
    });

    const groups = Array.from(groupsMap.values());
    groups.sort((a, b) => {
      const dir = sortConfig.key === 'eventNumber' && sortConfig.direction === 'desc' ? -1 : 1;
      return (a.eventNumber - b.eventNumber) * dir;
    });

    groups.forEach((group) => {
      group.swims.sort((a, b) => {
        const dir = sortConfig.direction === 'asc' ? 1 : -1;
        if (sortConfig.key === 'swimmerName') return a.swimmerName.localeCompare(b.swimmerName) * dir;
        if (sortConfig.key === 'teamName') return a.teamName.localeCompare(b.teamName) * dir;
        if (sortConfig.key === 'time') return (a.timeSeconds - b.timeSeconds) * dir;
        if (sortConfig.key === 'place') {
          const pA = a.place ?? 9999;
          const pB = b.place ?? 9999;
          return (pA - pB) * dir;
        }
        // Default: Finalists (with finalsOnlyTime) ranked by Finals Place ahead of Prelims-only swimmers ranked by Prelim Place
        const hasFinalsA = Boolean(a.finalsOnlyTime);
        const hasFinalsB = Boolean(b.finalsOnlyTime);
        if (hasFinalsA !== hasFinalsB) return hasFinalsA ? -1 : 1;
        const pA = a.place ?? a.prelimPlace ?? 9999;
        const pB = b.place ?? b.prelimPlace ?? 9999;
        if (pA !== pB) return pA - pB;
        if (a.isDiving) return (b.timeSeconds || 0) - (a.timeSeconds || 0);
        return a.timeSeconds - b.timeSeconds;
      });

      const validTimes = group.swims.map((r) => r.timeSeconds).filter((t) => isFinite(t));
      group.fastestTimeSec =
        validTimes.length > 0
          ? group.swims[0]?.isDiving
            ? Math.max(...validTimes)
            : Math.min(...validTimes)
          : Infinity;
    });

    return groups;
  }, [filteredMeetIndividuals, sortConfig]);

  const toggleAllIndividualsInEvent = (swimsInEvent) => {
    const expandableIds = swimsInEvent
      .filter((r) => r.splits && r.splits.length > 0)
      .map((r) => r.id);
    if (expandableIds.length === 0) return;
    const allExpanded = expandableIds.every((id) => expandedRows.has(id));
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (allExpanded) expandableIds.forEach((id) => next.delete(id));
      else expandableIds.forEach((id) => next.add(id));
      return next;
    });
  };

  // Filtered & Grouped Relays for Section 4
  const filteredMeetRelays = useMemo(() => {
    if (!parsedData) return [];
    return parsedData.relayResults.filter((row) => {
      if (selectedTeam !== 'ALL' && row.teamCode !== selectedTeam) return false;
      if (genderFilter !== 'ALL' && row.genderLabel !== genderFilter) return false;
      if (selectedEventFilter !== 'ALL' && row.eventLabel !== selectedEventFilter) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const legsText = row.legs.map((l) => `${l.swimmerName} ${l.preferredFirst}`).join(' ');
        const fullText = `${row.relayTitle} ${row.teamName} ${row.eventLabel} ${legsText}`.toLowerCase();
        if (!fullText.includes(q)) return false;
      }
      return true;
    });
  }, [parsedData, selectedTeam, genderFilter, selectedEventFilter, searchQuery]);

  const groupedRelayEvents = useMemo(() => {
    const groupsMap = new Map();
    filteredMeetRelays.forEach((relay) => {
      const key = `${relay.eventNumber}-${relay.eventLabel}`;
      if (!groupsMap.has(key)) {
        groupsMap.set(key, {
          key,
          eventNumber: relay.eventNumber,
          eventLabel: relay.eventLabel,
          course: relay.course,
          relays: [],
        });
      }
      groupsMap.get(key).relays.push(relay);
    });

    const groups = Array.from(groupsMap.values());
    groups.sort((a, b) => {
      const dir = sortConfig.key === 'eventNumber' && sortConfig.direction === 'desc' ? -1 : 1;
      return (a.eventNumber - b.eventNumber) * dir;
    });

    groups.forEach((group) => {
      group.relays.sort((a, b) => {
        if (sortConfig.key === 'swimmerName') {
          const dir = sortConfig.direction === 'asc' ? 1 : -1;
          return a.relayTitle.localeCompare(b.relayTitle) * dir;
        }
        if (sortConfig.key === 'time') {
          const dir = sortConfig.direction === 'asc' ? 1 : -1;
          return (a.timeSeconds - b.timeSeconds) * dir;
        }
        if (sortConfig.key === 'place') {
          const dir = sortConfig.direction === 'asc' ? 1 : -1;
          const pA = a.place ?? 9999;
          const pB = b.place ?? 9999;
          return (pA - pB) * dir;
        }
        const pA = a.place ?? 9999;
        const pB = b.place ?? 9999;
        if (pA !== pB) return pA - pB;
        return a.timeSeconds - b.timeSeconds;
      });

      const validTimes = group.relays.map((r) => r.timeSeconds).filter((t) => isFinite(t));
      group.fastestTimeSec = validTimes.length > 0 ? Math.min(...validTimes) : Infinity;
    });

    return groups;
  }, [filteredMeetRelays, sortConfig]);

  const toggleAllRelaysInEvent = (relaysInEvent) => {
    const expandableIds = relaysInEvent
      .filter((r) => r.legs.length > 0 || r.splits.length > 0)
      .map((r) => r.id);
    if (expandableIds.length === 0) return;
    const allExpanded = expandableIds.every((id) => expandedRows.has(id));
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (allExpanded) expandableIds.forEach((id) => next.delete(id));
      else expandableIds.forEach((id) => next.add(id));
      return next;
    });
  };

  // Filtered Team Roster for Section 4
  const filteredMeetTeams = useMemo(() => {
    if (!parsedData) return [];
    return parsedData.teams
      .filter((t) => selectedTeam === 'ALL' || t.code === selectedTeam)
      .map((team) => ({
        ...team,
        swimmerList: team.swimmerList.filter((s) => {
          if (genderFilter !== 'ALL' && s.gender !== genderFilter) return false;
          if (searchQuery.trim() !== '') {
            const q = searchQuery.toLowerCase();
            if (!`${s.name} ${s.preferredFirst}`.toLowerCase().includes(q)) return false;
          }
          return true;
        }),
      }));
  }, [parsedData, selectedTeam, genderFilter, searchQuery]);

  // CSV Export of Parsed Meet Results
  const handleExportMeetCSV = () => {
    if (!parsedData) return;
    const headers = [
      'Result Type',
      'Event #',
      'Event',
      'Gender',
      'Team Name',
      'Swimmer / Relay',
      'Class',
      'Finals Time',
      'Course',
      'Heat',
      'Lane',
      'Place',
      'Cumulative Splits',
      'Relay Swimmers',
    ];
    const rows = [];
    parsedData.individualResults.forEach((r) => {
      rows.push([
        'Individual',
        r.eventNumber,
        r.eventLabel,
        r.genderLabel,
        r.teamName,
        formatSwimmerDisplay(r.swimmerName, r.preferredFirst),
        r.classYear,
        r.finalsTime,
        r.course,
        r.heat,
        r.lane,
        r.place ?? '',
        r.splits.join(' | '),
        '',
      ]);
    });
    parsedData.relayResults.forEach((r) => {
      const legsText = r.legs
        .map((l) => `${l.legOrder}. ${formatSwimmerDisplay(l.swimmerName, l.preferredFirst)}`)
        .join(' ; ');
      rows.push([
        'Relay',
        r.eventNumber,
        r.eventLabel,
        r.genderLabel,
        r.teamName,
        r.relayTitle,
        '',
        r.finalsTime,
        r.course,
        r.heat,
        r.lane,
        r.place ?? '',
        r.splits.join(' | '),
        legsText,
      ]);
    });

    const csvString = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\r\n');

    const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeMeetName = (parsedData.meetInfo.name || 'swim_meet')
      .replace(/[^a-z0-9]+/gi, '_')
      .replace(/^_|_$/g, '')
      .toLowerCase();
    link.href = url;
    link.setAttribute('download', `${safeMeetName}_parsed_results.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // Self-Contained Single-Page Interactive Web Recap (.HTML) Export
  const handleExportWebRecapHtml = () => {
    if (!parsedData) return;

    const escapeHtml = (val) =>
      String(val ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    const meetTitle = parsedData.meetInfo.name || 'Swim Meet Results';
    const meetDate = parsedData.meetInfo.startDate || '';
    const meetLoc = [parsedData.meetInfo.city, parsedData.meetInfo.state].filter(Boolean).join(', ');

    // Build chronological event list (Individual + Relay)
    const eventMap = new Map();
    parsedData.individualResults.forEach((r) => {
      const k = `${r.eventNumber}|${r.eventLabel}`;
      if (!eventMap.has(k)) {
        eventMap.set(k, {
          key: k,
          eventNumber: Number(r.eventNumber) || 999,
          eventLabel: r.eventLabel,
          genderLabel: r.genderLabel,
          course: r.course,
          isRelay: false,
          entries: [],
        });
      }
      eventMap.get(k).entries.push(r);
    });
    parsedData.relayResults.forEach((r) => {
      const k = `${r.eventNumber}|${r.eventLabel}`;
      if (!eventMap.has(k)) {
        eventMap.set(k, {
          key: k,
          eventNumber: Number(r.eventNumber) || 999,
          eventLabel: r.eventLabel,
          genderLabel: r.genderLabel,
          course: r.course,
          isRelay: true,
          entries: [],
        });
      }
      eventMap.get(k).entries.push(r);
    });

    const orderedEvents = Array.from(eventMap.values()).sort(
      (a, b) => a.eventNumber - b.eventNumber
    );

    // Team Scoreboards HTML
    const womenScores = [...(parsedData.teamScores || [])].sort(
      (a, b) => b.womenPoints - a.womenPoints
    );
    const menScores = [...(parsedData.teamScores || [])].sort(
      (a, b) => b.menPoints - a.menPoints
    );

    const renderScoreList = (list, key) =>
      list
        .map((t, idx) => {
          const hex = getTeamHexColor(t.code, t.name);
          const pts = t[key] || 0;
          return `<div class="score-row ${idx === 0 && pts > 0 ? 'leader' : ''}">
            <div class="score-team">
              <span class="team-dot" style="background:${escapeHtml(hex)}"></span>
              <span>${escapeHtml(t.name)}</span>
            </div>
            <span class="score-pts">${escapeHtml(pts)}</span>
          </div>`;
        })
        .join('');

    // Per-Team Event Winners Cards (Color-Outlined with Color-Coordinated Win Count Badges)
    const teamWinnersData = parsedData.teams.map((t) => {
      const hex = getTeamHexColor(t.code, t.name);
      const athMap = new Map();
      let teamTotalWins = 0;

      parsedData.individualResults.forEach((r) => {
        if (r.teamCode !== t.code || Number(r.place) !== 1) return;
        teamTotalWins += 1;
        const name = formatSwimmerDisplay(r.swimmerName, r.preferredFirst);
        if (!athMap.has(name)) {
          athMap.set(name, { name, indWins: 0, relWins: 0, entries: [] });
        }
        const rec = athMap.get(name);
        rec.indWins += 1;
        rec.entries.push({
          text: `${r.eventLabel} (${r.finalsTime})`,
          gender: r.genderLabel || '',
          isRelay: false,
        });
      });

      parsedData.relayResults.forEach((rel) => {
        if (rel.teamCode !== t.code || Number(rel.place) !== 1) return;
        teamTotalWins += 1;
        (rel.legs || []).forEach((leg) => {
          const name = formatSwimmerDisplay(leg.swimmerName, leg.preferredFirst);
          if (!athMap.has(name)) {
            athMap.set(name, { name, indWins: 0, relWins: 0, entries: [] });
          }
          const rec = athMap.get(name);
          rec.relWins += 1;
          rec.entries.push({
            text: `${rel.eventLabel} — Leg ${leg.legOrder} (${rel.finalsTime})`,
            gender: rel.genderLabel || '',
            isRelay: true,
          });
        });
      });

      const athletes = Array.from(athMap.values()).sort(
        (a, b) => b.indWins + b.relWins - (a.indWins + a.relWins)
      );

      return {
        code: t.code,
        name: t.name,
        hex,
        teamTotalWins,
        athletes,
      };
    });

    const winsHtml =
      teamWinnersData.some((tw) => tw.teamTotalWins > 0)
        ? `<section id="eventWinnersSection" class="card">
            <div class="card-head">
              <h2>Event Winners</h2>
              <div class="team-win-pills">
                ${teamWinnersData
                  .map(
                    (tw) => `<span class="pill team-win-pill" data-team="${escapeHtml(
                      tw.code
                    )}" style="background:${escapeHtml(tw.hex)}18;color:${escapeHtml(
                      tw.hex
                    )};border:1px solid ${escapeHtml(tw.hex)}55">
                      <span class="team-dot" style="background:${escapeHtml(
                        tw.hex
                      )}"></span>
                      ${escapeHtml(tw.name)} • ${tw.teamTotalWins} Win${
                      tw.teamTotalWins === 1 ? '' : 's'
                    }
                    </span>`
                  )
                  .join('')}
              </div>
            </div>
            <div class="team-winners-grid">
              ${teamWinnersData
                .map((tw) => {
                  const athletesHtml =
                    tw.athletes.length === 0
                      ? '<p class="muted" style="margin:6px 0 0;">No 1st-place finishes recorded.</p>'
                      : `<div class="wins-grid inner-wins-grid">
                          ${tw.athletes
                            .map((ath) => {
                              const total = ath.indWins + ath.relWins;
                              return `<div class="win-card" data-athlete="${escapeHtml(
                                ath.name.toLowerCase()
                              )}">
                                <div class="win-top">
                                  <div class="win-name">${escapeHtml(ath.name)}</div>
                                  <div class="win-badge" style="background:${escapeHtml(
                                    tw.hex
                                  )}18;color:${escapeHtml(
                                tw.hex
                              )};border:1px solid ${escapeHtml(tw.hex)}44">${total} Win${
                                total > 1 ? 's' : ''
                              } (${ath.indWins}I / ${ath.relWins}R)</div>
                                </div>
                                <ul class="win-events">
                                  ${ath.entries
                                    .map(
                                      (ev) =>
                                        `<li data-gender="${escapeHtml(ev.gender)}">${escapeHtml(
                                          ev.text
                                        )}</li>`
                                    )
                                    .join('')}
                                </ul>
                              </div>`;
                            })
                            .join('')}
                        </div>`;

                  return `<div class="team-win-box" data-team="${escapeHtml(
                    tw.code
                  )}" style="border:2px solid ${escapeHtml(tw.hex)}">
                    <div class="team-win-box-head" style="background:${escapeHtml(
                      tw.hex
                    )}10;border-bottom:1px solid ${escapeHtml(tw.hex)}33">
                      <div class="score-team">
                        <span class="team-dot" style="background:${escapeHtml(tw.hex)}"></span>
                        <strong>${escapeHtml(tw.name)}</strong>
                      </div>
                      <span class="pill" style="background:${escapeHtml(
                        tw.hex
                      )};color:#ffffff">${tw.teamTotalWins} Win${
                    tw.teamTotalWins === 1 ? '' : 's'
                  }</span>
                    </div>
                    <div class="team-win-box-body">${athletesHtml}</div>
                  </div>`;
                })
                .join('')}
            </div>
          </section>`
        : '';

    // Event Cards HTML
    const eventsHtml = orderedEvents
      .map((evGrp) => {
        const sortedEntries = [...evGrp.entries].sort((a, b) => {
          if (!evGrp.isRelay) {
            const hasFinA = Boolean(a.finalsOnlyTime);
            const hasFinB = Boolean(b.finalsOnlyTime);
            if (hasFinA !== hasFinB) return hasFinA ? -1 : 1;
          }
          const pA = a.place ?? a.prelimPlace ?? 9999;
          const pB = b.place ?? b.prelimPlace ?? 9999;
          if (pA !== pB) return pA - pB;
          if (a.isDiving) return (b.timeSeconds ?? 0) - (a.timeSeconds ?? 0);
          return (a.timeSeconds ?? Infinity) - (b.timeSeconds ?? Infinity);
        });
        const validTimes = sortedEntries
          .map((e) => e.timeSeconds)
          .filter((t) => Number.isFinite(t));
        const fastestSec =
          validTimes.length > 0
            ? sortedEntries[0]?.isDiving
              ? Math.max(...validTimes)
              : Math.min(...validTimes)
            : Infinity;

        const rowsHtml = sortedEntries
          .map((row) => {
            const teamHex = getTeamHexColor(row.teamCode, row.teamName);
            const behindSec =
              Number.isFinite(row.timeSeconds) && Number.isFinite(fastestSec)
                ? row.isDiving
                  ? fastestSec - row.timeSeconds
                  : row.timeSeconds - fastestSec
                : Infinity;
            const behindLabel = Number.isFinite(behindSec)
              ? behindSec < 0.005
                ? '<span class="tag-winner">Winner</span>'
                : row.isDiving
                ? `-${behindSec.toFixed(2)}`
                : `+${behindSec.toFixed(2)}s`
              : '—';

            const isPrimary =
              selectedTeam !== 'ALL'
                ? row.teamCode === selectedTeam
                : String(row.teamName || '').toLowerCase().includes('gettysburg');

            if (evGrp.isRelay) {
              const legsBreakdown = calculateRelayLegBreakdown(row);
              const hasDetails = legsBreakdown.length > 0;
              const detailId = `det-${escapeHtml(row.id)}`;
              const legsSummary = legsBreakdown
                .map(
                  (l) =>
                    `${l.legOrder}) ${formatSwimmerDisplay(l.swimmerName, l.preferredFirst)}`
                )
                .join(' • ');

              const legRowsHtml = legsBreakdown
                .map(
                  (leg) => `<tr>
                    <td><strong>Leg ${leg.legOrder}</strong></td>
                    <td>${escapeHtml(
                      formatSwimmerDisplay(leg.swimmerName, leg.preferredFirst)
                    )}</td>
                    <td>${escapeHtml(leg.classYear || '—')}</td>
                    <td class="mono">${
                      leg.subSplits.length > 0
                        ? leg.subSplits
                            .map((s) => `${escapeHtml(s.subDistance)}: <strong>${escapeHtml(s.lap)}</strong>`)
                            .join(' &nbsp;|&nbsp; ')
                        : '—'
                    }</td>
                    <td class="mono right"><strong>${escapeHtml(leg.legTotalTime)}</strong></td>
                    <td class="mono right">${escapeHtml(leg.endCumulativeTime)}</td>
                  </tr>`
                )
                .join('');

              return `<tr class="res-row ${hasDetails ? 'clickable' : ''}" data-team="${escapeHtml(
                row.teamCode
              )}" style="border-left:4px solid ${escapeHtml(teamHex)}" ${
                hasDetails ? `onclick="toggleSplitRow('${detailId}', this)"` : ''
              }>
                <td class="center">${
                  row.place ? `<span class="place-badge p-${row.place}">${row.place}</span>` : '—'
                }</td>
                <td>
                  <div class="sw-name">${escapeHtml(row.relayTitle)}</div>
                  <div class="sw-sub">${escapeHtml(legsSummary || 'Relay Squad')}</div>
                </td>
                <td>${escapeHtml(row.teamName)}</td>
                <td class="mono right"><strong>${escapeHtml(row.finalsTime)}</strong></td>
                <td class="mono right">${behindLabel}</td>
                <td class="mono center">${row.points > 0 ? row.points : '—'}</td>
                <td class="right">${
                  hasDetails
                    ? `<button type="button" class="split-btn">Legs (${legsBreakdown.length}) ▾</button>`
                    : '<span class="muted">—</span>'
                }</td>
              </tr>
              ${
                hasDetails
                  ? `<tr id="${detailId}" class="split-drawer hidden">
                      <td colspan="7">
                        <div class="drawer-box">
                          <div class="drawer-title">Relay Leg Breakdown — ${escapeHtml(
                            row.relayTitle
                          )}</div>
                          <table class="sub-table">
                            <thead>
                              <tr>
                                <th>Leg</th>
                                <th>Swimmer</th>
                                <th>Class</th>
                                <th>Sub-Splits</th>
                                <th class="right">Leg Time</th>
                                <th class="right">Cumulative</th>
                              </tr>
                            </thead>
                            <tbody>${legRowsHtml}</tbody>
                          </table>
                        </div>
                      </td>
                    </tr>`
                  : ''
              }`;
            }

            // Individual Swim Row
            const dispName = formatSwimmerDisplay(row.swimmerName, row.preferredFirst);
            const tags =
              isPrimary && !row.isDiving
                ? benchmarkIndex.evaluateSwim(dispName, row.eventLabel, row.finalsTime, row.classYear)
                : [];
            const hitStds = !row.isDiving
              ? evaluateStandardsForSwim(row.eventLabel, row.finalsTime)
              : [];
            const isPrelimOnly = !row.finalsOnlyTime && Boolean(row.prelimTime);
            const badgesHtml = [
              ...(isPrelimOnly
                ? ['<span class="badge badge-std">Prelims</span>']
                : []),
              ...tags.map((t) => `<span class="badge badge-rec">${escapeHtml(t.label)}</span>`),
              ...hitStds.map((s) => `<span class="badge badge-std">${escapeHtml(s.label)}</span>`),
            ].join('');

            const hasSplits = row.splits && row.splits.length > 0;
            const detailId = `det-${escapeHtml(row.id)}`;
            let drawerHtml = '';

            if (hasSplits) {
              const analysis = calculateSplitBreakdown(
                row.splits,
                row.distance,
                row.splitInterval,
                row.splitType
              );
              const { minLap, maxLap } = analysis.stats || { minLap: 0, maxLap: 1 };
              const range = Math.max(maxLap - minLap, 0.5);
              const barsHtml =
                analysis.stats && analysis.rows.length > 1
                  ? `<div class="pacing-wrap">
                      <div class="pacing-label">Lap Pacing Comparison (shorter bar = faster lap • Avg: <strong>${escapeHtml(
                        analysis.stats.avgLap
                      )}</strong>)</div>
                      <div class="pacing-bars">
                        ${analysis.rows
                          .map((s) => {
                            const hPct = Number.isFinite(s.lapSec)
                              ? Math.round(32 + ((s.lapSec - minLap) / range) * 68)
                              : 50;
                            const cls = s.isFastest
                              ? 'bar-fast'
                              : s.isSlowest
                              ? 'bar-slow'
                              : 'bar-mid';
                            return `<div class="bar-col" title="${escapeHtml(
                              s.distanceLabel
                            )}: Lap ${escapeHtml(s.lap)} (Cum ${escapeHtml(s.cumulative)})">
                              <div class="bar-track"><div class="bar-fill ${cls}" style="height:${hPct}%"></div></div>
                              <span>${s.distance}</span>
                            </div>`;
                          })
                          .join('')}
                      </div>
                    </div>`
                  : '';

              const splitTableRows = analysis.rows
                .map(
                  (s) => `<tr class="${s.isFastest ? 'row-fast' : s.isSlowest ? 'row-slow' : ''}">
                    <td><strong>${escapeHtml(s.distanceLabel)}</strong></td>
                    <td class="mono right"><strong>${escapeHtml(s.cumulative)}</strong></td>
                    <td class="mono right cyan"><strong>${escapeHtml(s.lap)}</strong></td>
                    <td class="right">${
                      s.isFastest
                        ? '<span class="badge badge-fast">Fastest Lap</span>'
                        : s.isSlowest
                        ? '<span class="badge badge-slow">Slowest Lap</span>'
                        : '—'
                    }</td>
                  </tr>`
                )
                .join('');

              drawerHtml = `<tr id="${detailId}" class="split-drawer hidden">
                <td colspan="7">
                  <div class="drawer-box">
                    <div class="drawer-title">Split Breakdown (${
                      analysis.stats?.interval || 50
                    }y Intervals) — ${escapeHtml(dispName)}</div>
                    ${barsHtml}
                    <table class="sub-table">
                      <thead>
                        <tr>
                          <th>Distance</th>
                          <th class="right">Cumulative</th>
                          <th class="right">Lap Split</th>
                          <th class="right">Pace Note</th>
                        </tr>
                      </thead>
                      <tbody>${splitTableRows}</tbody>
                    </table>
                  </div>
                </td>
              </tr>`;
            }

            return `<tr class="res-row ${hasSplits ? 'clickable' : ''}" data-team="${escapeHtml(
              row.teamCode
            )}" style="border-left:4px solid ${escapeHtml(teamHex)}" ${
              hasSplits ? `onclick="toggleSplitRow('${detailId}', this)"` : ''
            }>
              <td class="center">${
                row.place ? `<span class="place-badge p-${row.place}">${row.place}</span>` : '—'
              }</td>
              <td>
                <div class="sw-name">${escapeHtml(dispName)} ${badgesHtml}</div>
                <div class="sw-sub">${row.classYear ? `Class: ${escapeHtml(row.classYear)} • ` : ''}${
              row.heat ? `Heat ${escapeHtml(row.heat)}` : ''
            }${row.heat && row.lane ? ' • ' : ''}${
              row.lane ? `Lane ${escapeHtml(row.lane)}` : ''
            }${
              row.prelimTime && row.finalsOnlyTime
                ? ` • Prelims: ${escapeHtml(row.prelimTime)}${
                    row.prelimPlace ? ` (#${row.prelimPlace})` : ''
                  }`
                : ''
            }</div>
              </td>
              <td>${escapeHtml(row.teamName)}</td>
              <td class="mono right"><strong>${escapeHtml(row.finalsTime)}</strong></td>
              <td class="mono right">${behindLabel}</td>
              <td class="mono center">${row.points > 0 ? row.points : '—'}</td>
              <td class="right">${
                hasSplits
                  ? `<button type="button" class="split-btn">Splits (${row.splits.length}) ▾</button>`
                  : '<span class="muted">—</span>'
              }</td>
            </tr>${drawerHtml}`;
          })
          .join('');

        return `<section class="card event-card" data-gender="${escapeHtml(evGrp.genderLabel)}">
          <div class="event-head">
            <div class="event-title-wrap">
              <span class="ev-num">Event #${evGrp.eventNumber}</span>
              <div>
                <h3>${escapeHtml(evGrp.eventLabel)}</h3>
                <p>${sortedEntries.length} ${
          evGrp.isRelay ? 'Relay Entries' : 'Swimmers'
        } • ${escapeHtml(evGrp.course)}</p>
              </div>
            </div>
            <button type="button" class="expand-ev-btn" onclick="toggleEventSplits(this)">Toggle Event Splits</button>
          </div>
          <div class="table-wrap">
            <table class="main-table">
              <thead>
                <tr>
                  <th class="center" style="width:64px">Place</th>
                  <th>${evGrp.isRelay ? 'Relay Squad' : 'Swimmer'}</th>
                  <th>Team</th>
                  <th class="right">Finals Time</th>
                  <th class="right">Behind</th>
                  <th class="center" style="width:60px">Pts</th>
                  <th class="right" style="width:115px">Details</th>
                </tr>
              </thead>
              <tbody>${rowsHtml}</tbody>
            </table>
          </div>
        </section>`;
      })
      .join('');

    const teamOptionsHtml = parsedData.teams
      .map((t) => `<option value="${escapeHtml(t.code)}">${escapeHtml(t.name)}</option>`)
      .join('');

    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(meetTitle)} — Meet Results &amp; Splits</title>
  <style>
    :root {
      --bg: #f8fafc;
      --card: #ffffff;
      --ink: #0f172a;
      --muted: #64748b;
      --border: #e2e8f0;
      --navy: #0f172a;
      --cyan: #0284c7;
      --cyan-soft: #e0f2fe;
      --emerald: #059669;
      --amber: #d97706;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: var(--bg);
      color: var(--ink);
      line-height: 1.45;
    }
    .container { max-width: 1120px; margin: 0 auto; padding: 20px 16px 48px; }
    .hero {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #083344 100%);
      color: #fff;
      border-radius: 18px;
      padding: 24px 28px;
      display: grid;
      grid-template-columns: minmax(76px, auto) 1fr minmax(76px, auto);
      align-items: center;
      gap: 20px;
      box-shadow: 0 10px 25px -10px rgba(15, 23, 42, 0.35);
    }
    .hero-center { text-align: center; }
    .hero h1 { margin: 0; font-size: 1.55rem; font-weight: 800; letter-spacing: -0.02em; }
    .hero-meta { margin-top: 6px; font-size: 0.85rem; color: #cbd5e1; display: flex; flex-wrap: wrap; justify-content: center; gap: 14px; }
    .logo-slot { display: flex; align-items: center; }
    .logo-slot.left { justify-content: flex-start; }
    .logo-slot.right { justify-content: flex-end; }
    .logo-box {
      width: 78px;
      height: 78px;
      border-radius: 16px;
      background: #ffffff;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 20px -4px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.25);
    }
    .logo-box img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      display: block;
    }
    @media (max-width: 640px) {
      .hero { grid-template-columns: 1fr; text-align: center; }
      .logo-slot.left, .logo-slot.right { justify-content: center; }
    }
    .scores-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin-top: 18px; }
    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 16px;
      overflow: hidden;
      margin-top: 18px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
    }
    .score-card { padding: 16px 18px; margin-top: 0; }
    .score-card h2 { margin: 0 0 10px; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; color: #475569; }
    .score-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 8px 12px; border-radius: 10px; border: 1px solid #f1f5f9;
      background: #f8fafc; margin-bottom: 6px; font-size: 0.88rem;
    }
    .score-row.leader { background: #fff; border-color: #fde68a; font-weight: 700; }
    .score-team { display: flex; align-items: center; gap: 8px; }
    .team-dot { width: 10px; height: 10px; border-radius: 999px; display: inline-block; }
    .score-pts { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-weight: 800; font-size: 1rem; }
    .toolbar {
      background: #fff; border: 1px solid var(--border); border-radius: 14px;
      padding: 12px 16px; margin-top: 18px; display: flex; flex-wrap: wrap; gap: 10px; align-items: center; justify-content: space-between;
    }
    .toolbar-left { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; flex: 1; }
    .toolbar input, .toolbar select {
      padding: 8px 12px; border-radius: 9px; border: 1px solid var(--border); font-size: 0.82rem; background: #f8fafc; color: var(--ink);
    }
    .toolbar input { min-width: 220px; flex: 1; max-width: 320px; }
    .btn {
      padding: 8px 12px; border-radius: 9px; border: 1px solid var(--border); background: #fff;
      font-size: 0.78rem; font-weight: 700; cursor: pointer; color: var(--ink);
    }
    .btn:hover { background: #f1f5f9; }
    .card-head {
      padding: 14px 18px; border-bottom: 1px solid var(--border); display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 8px;
    }
    .card-head h2 { margin: 0; font-size: 0.98rem; font-weight: 800; }
    .pill { font-size: 0.75rem; font-weight: 700; padding: 3px 10px; border-radius: 999px; background: var(--cyan-soft); color: #075985; display: inline-flex; align-items: center; gap: 6px; }
    .team-win-pills { display: flex; flex-wrap: wrap; gap: 6px; }
    .team-winners-grid { padding: 14px 18px; display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 14px; }
    .team-win-box { border-radius: 14px; background: #ffffff; overflow: hidden; }
    .team-win-box-head { padding: 10px 14px; display: flex; justify-content: space-between; align-items: center; gap: 8px; font-size: 0.9rem; }
    .team-win-box-body { padding: 12px 14px; }
    .wins-grid { padding: 14px 18px; display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px; }
    .inner-wins-grid { padding: 0; grid-template-columns: 1fr; gap: 10px; }
    .win-card { border: 1px solid var(--border); border-radius: 12px; padding: 10px 12px; background: #f8fafc; }
    .win-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
    .win-name { font-weight: 800; font-size: 0.88rem; }
    .win-team { font-size: 0.72rem; color: var(--muted); }
    .win-badge { font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 8px; white-space: nowrap; }
    .win-events { margin: 6px 0 0; padding-left: 16px; font-size: 0.78rem; color: #334155; }
    .event-head {
      background: var(--navy); color: #fff; padding: 12px 18px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 10px;
    }
    .event-title-wrap { display: flex; align-items: center; gap: 12px; }
    .ev-num {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.75rem; font-weight: 800;
      padding: 4px 10px; border-radius: 8px; background: rgba(6, 182, 212, 0.2); color: #67e8f9; border: 1px solid rgba(34, 211, 238, 0.3);
    }
    .event-head h3 { margin: 0; font-size: 0.98rem; font-weight: 800; }
    .event-head p { margin: 2px 0 0; font-size: 0.74rem; color: #94a3b8; }
    .expand-ev-btn {
      background: #1e293b; color: #67e8f9; border: 1px solid #334155; border-radius: 8px;
      padding: 6px 10px; font-size: 0.74rem; font-weight: 700; cursor: pointer;
    }
    .table-wrap { overflow-x: auto; }
    .main-table { width: 100%; border-collapse: collapse; font-size: 0.84rem; text-align: left; }
    .main-table th {
      background: #f8fafc; color: #475569; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em;
      padding: 10px 12px; border-bottom: 1px solid var(--border);
    }
    .main-table td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
    .res-row.clickable { cursor: pointer; }
    .res-row.clickable:hover { background: #f0f9ff; }
    .sw-name { font-weight: 700; color: var(--ink); display: flex; flex-wrap: wrap; align-items: center; gap: 5px; }
    .sw-sub { font-size: 0.72rem; color: var(--muted); margin-top: 2px; }
    .mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-variant-numeric: tabular-nums; }
    .right { text-align: right; }
    .center { text-align: center; }
    .muted { color: #94a3b8; font-size: 0.75rem; }
    .cyan { color: #0369a1; }
    .place-badge {
      display: inline-flex; align-items: center; justify-content: center; width: 25px; height: 25px;
      border-radius: 999px; font-size: 0.74rem; font-weight: 800; background: #f1f5f9; color: #475569;
    }
    .place-badge.p-1 { background: #fef3c7; color: #92400e; border: 1px solid #fcd34d; }
    .place-badge.p-2 { background: #e2e8f0; color: #1e293b; border: 1px solid #cbd5e1; }
    .place-badge.p-3 { background: #ffedd5; color: #9a3412; border: 1px solid #fdba74; }
    .tag-winner {
      display: inline-block; padding: 2px 7px; border-radius: 6px; background: #ecfdf5; color: #047857;
      font-family: inherit; font-weight: 700; font-size: 0.72rem; border: 1px solid #a7f3d0;
    }
    .badge { display: inline-block; padding: 1px 6px; border-radius: 5px; font-size: 0.66rem; font-weight: 800; }
    .badge-rec { background: #fef3c7; color: #78350f; border: 1px solid #fde68a; }
    .badge-std { background: #ede9fe; color: #5b21b6; border: 1px solid #ddd6fe; }
    .badge-fast { background: #d1fae5; color: #065f46; }
    .badge-slow { background: #fef3c7; color: #92400e; }
    .split-btn {
      background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; border-radius: 999px;
      padding: 3px 10px; font-size: 0.72rem; font-weight: 700; cursor: pointer;
    }
    .hidden { display: none; }
    .split-drawer td { background: #f8fafc; padding: 12px 18px; }
    .drawer-box { background: #fff; border: 1px solid #bae6fd; border-radius: 12px; padding: 12px 14px; }
    .drawer-title { font-size: 0.74rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em; color: #075985; margin-bottom: 10px; }
    .sub-table { width: 100%; border-collapse: collapse; font-size: 0.78rem; }
    .sub-table th { background: #f8fafc; padding: 6px 10px; border-bottom: 1px solid var(--border); font-size: 0.68rem; text-transform: uppercase; color: #475569; }
    .sub-table td { padding: 6px 10px; border-bottom: 1px solid #f1f5f9; }
    .row-fast td { background: #ecfdf5; }
    .row-slow td { background: #fffbeb; }
    .pacing-wrap { background: #f8fafc; border: 1px solid var(--border); border-radius: 10px; padding: 10px 12px; margin-bottom: 10px; }
    .pacing-label { font-size: 0.72rem; color: #475569; margin-bottom: 8px; }
    .pacing-bars { display: flex; align-items: flex-end; gap: 6px; height: 64px; }
    .bar-col { flex: 1; min-width: 18px; display: flex; flex-direction: column; align-items: center; gap: 3px; font-size: 0.62rem; color: #64748b; font-family: ui-monospace, monospace; }
    .bar-track { width: 100%; height: 46px; display: flex; align-items: flex-end; justify-content: center; }
    .bar-fill { width: 100%; max-width: 24px; border-radius: 4px 4px 0 0; }
    .bar-fast { background: #10b981; }
    .bar-slow { background: #f59e0b; }
    .bar-mid { background: #0ea5e9; }
    .footer { text-align: center; font-size: 0.75rem; color: var(--muted); margin-top: 28px; }
    @media print {
      .toolbar, .expand-ev-btn, .split-btn { display: none !important; }
      .split-drawer.hidden { display: table-row !important; }
      body { background: #fff; }
      .card { box-shadow: none; break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header class="hero">
      <div class="logo-slot left">
        ${
          awayLogoDataUrl
            ? `<div class="logo-box"><img src="${awayLogoDataUrl}" alt="Away Team Logo" /></div>`
            : ''
        }
      </div>
      <div class="hero-center">
        <h1>${escapeHtml(meetTitle)}</h1>
        <div class="hero-meta">
          ${meetDate ? `<span>📅 ${escapeHtml(meetDate)}</span>` : ''}
          ${meetLoc ? `<span>📍 ${escapeHtml(meetLoc)}</span>` : ''}
          ${parsedData.meetInfo.software ? `<span>⏱️ ${escapeHtml(parsedData.meetInfo.software)}</span>` : ''}
        </div>
      </div>
      <div class="logo-slot right">
        ${
          homeLogoDataUrl
            ? `<div class="logo-box"><img src="${homeLogoDataUrl}" alt="Home Team Logo" /></div>`
            : ''
        }
      </div>
    </header>

    ${
      parsedData.teamScores && parsedData.teamScores.length > 0
        ? `<div class="scores-grid">
            <div class="card score-card"><h2>🏆 Women's Team Scores</h2>${renderScoreList(womenScores, 'womenPoints')}</div>
            <div class="card score-card"><h2>🏆 Men's Team Scores</h2>${renderScoreList(menScores, 'menPoints')}</div>
          </div>`
        : ''
    }

    <div class="toolbar">
      <div class="toolbar-left">
        <input type="text" id="searchBox" placeholder="Search swimmer, relay, or team..." oninput="applyFilters()" />
        <select id="teamFilter" onchange="applyFilters()">
          <option value="ALL">All Teams (${parsedData.teams.length})</option>
          ${teamOptionsHtml}
        </select>
        <select id="genderFilter" onchange="applyFilters()">
          <option value="ALL">All Events (Women &amp; Men)</option>
          <option value="Women">Women Only</option>
          <option value="Men">Men Only</option>
        </select>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button type="button" class="btn" onclick="toggleAllSplits(true)">Expand All Splits</button>
        <button type="button" class="btn" onclick="toggleAllSplits(false)">Collapse All Splits</button>
      </div>
    </div>

    ${winsHtml}

    ${eventsHtml}

    <div class="footer">Generated by Swim Meet Command Center • Standalone Interactive Meet Recap</div>
  </div>

  <script>
    function toggleSplitRow(id) {
      var el = document.getElementById(id);
      if (el) el.classList.toggle('hidden');
    }
    function toggleEventSplits(btn) {
      var card = btn.closest('.event-card');
      if (!card) return;
      var drawers = card.querySelectorAll('.split-drawer');
      if (!drawers.length) return;
      var anyClosed = Array.prototype.some.call(drawers, function(d) { return d.classList.contains('hidden'); });
      drawers.forEach(function(d) {
        if (anyClosed) d.classList.remove('hidden');
        else d.classList.add('hidden');
      });
    }
    function toggleAllSplits(expand) {
      document.querySelectorAll('.split-drawer').forEach(function(d) {
        if (expand) d.classList.remove('hidden');
        else d.classList.add('hidden');
      });
    }
    function applyFilters() {
      var q = (document.getElementById('searchBox').value || '').toLowerCase().trim();
      var team = document.getElementById('teamFilter').value;
      var gender = document.getElementById('genderFilter').value;

      // Filter Event Winners team boxes & entries
      var winnersSection = document.getElementById('eventWinnersSection');
      if (winnersSection) {
        var visibleBoxes = 0;
        winnersSection.querySelectorAll('.team-win-pill').forEach(function(pill) {
          var pTeam = pill.getAttribute('data-team') || '';
          pill.style.display = (team === 'ALL' || pTeam === team) ? '' : 'none';
        });
        winnersSection.querySelectorAll('.team-win-box').forEach(function(box) {
          var bTeam = box.getAttribute('data-team') || '';
          var teamOk = (team === 'ALL' || bTeam === team);
          var visibleAthletes = 0;

          box.querySelectorAll('.win-card').forEach(function(wCard) {
            var athName = wCard.getAttribute('data-athlete') || '';
            var visibleItems = 0;
            wCard.querySelectorAll('.win-events li').forEach(function(li) {
              var evG = li.getAttribute('data-gender') || '';
              var gOk = (gender === 'ALL' || evG === gender);
              var qOk = (!q || athName.indexOf(q) !== -1 || li.textContent.toLowerCase().indexOf(q) !== -1);
              var showLi = gOk && qOk;
              li.style.display = showLi ? '' : 'none';
              if (showLi) visibleItems++;
            });
            wCard.style.display = visibleItems > 0 ? '' : 'none';
            if (visibleItems > 0) visibleAthletes++;
          });

          var showBox = teamOk && (visibleAthletes > 0 || (!q && gender === 'ALL'));
          box.style.display = showBox ? '' : 'none';
          if (showBox) visibleBoxes++;
        });
        winnersSection.style.display = visibleBoxes > 0 ? '' : 'none';
      }

      // Filter Event Cards
      document.querySelectorAll('.event-card').forEach(function(card) {
        var evGender = card.getAttribute('data-gender') || '';
        var genderOk = (gender === 'ALL' || evGender === gender);
        var visibleCount = 0;

        card.querySelectorAll('.res-row').forEach(function(row) {
          var rTeam = row.getAttribute('data-team') || '';
          var teamOk = (team === 'ALL' || rTeam === team);
          var textOk = (!q || row.textContent.toLowerCase().indexOf(q) !== -1);
          var show = genderOk && teamOk && textOk;
          row.style.display = show ? '' : 'none';
          var next = row.nextElementSibling;
          if (next && next.classList.contains('split-drawer') && !show) {
            next.classList.add('hidden');
          }
          if (show) visibleCount++;
        });

        card.style.display = (genderOk && visibleCount > 0) ? '' : 'none';
      });
    }
  </script>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeMeetName = (parsedData.meetInfo.name || 'swim_meet')
      .replace(/[^a-z0-9]+/gi, '_')
      .replace(/^_|_$/g, '')
      .toLowerCase();
    link.href = url;
    link.setAttribute('download', `${safeMeetName}_web_recap.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setBenchmarkStatusMsg(`Exported standalone interactive web recap (${safeMeetName}_web_recap.html).`);
  };

  // SID Post-Meet Recap Generator
  const generatedRecapText = useMemo(() => {
    if (!parsedData) return '';
    const scoreLine = parsedData.teamScores
      .map(
        (t) =>
          `${t.name}: Women ${t.womenPoints}, Men ${t.menPoints} (Total ${t.totalPoints})`
      )
      .join(' | ');

    const lines = [
      `${parsedData.meetInfo.name.toUpperCase()} — POST-MEET RECAP`,
      `Date: ${parsedData.meetInfo.startDate || 'TBD'} | Location: ${
        [parsedData.meetInfo.city, parsedData.meetInfo.state].filter(Boolean).join(', ') || 'Pool'
      }`,
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

  // Open Career Profile Modal for any swimmer name
  const openSwimmerProfile = (rawName, preferredEventKey = '') => {
    if (!rawName) return;
    const resolved = resolveMasterAthlete(rawName);
    const canonical = resolved ? resolved.canonicalName : rawName.trim();
    setProfileSwimmerName(canonical);
    setProfileChartEventKey(preferredEventKey || '');
  };

  // Computed Career Profile Data for the selected swimmer
  const activeSwimmerProfile = useMemo(() => {
    if (!profileSwimmerName) return null;
    const resolvedAth = resolveMasterAthlete(profileSwimmerName);
    const canonicalName = resolvedAth ? resolvedAth.canonicalName : profileSwimmerName;
    const swKey = normalizeSwimmerKey(canonicalName);

    const allRows = historicalRecords.filter((r) => {
      const m = resolveMasterAthlete(r.swimmerName);
      const k = normalizeSwimmerKey(m ? m.canonicalName : r.swimmerName);
      return k === swKey;
    });

    const officialRows = allRows.filter((r) => r.isOfficial !== false);
    const isSplitRow = (r) =>
      r.swimType === 'INTERMEDIATE_SPLIT' || String(r.place || '').toUpperCase() === 'S';

    // Career Finals Wins (Individual + Relay)
    let indWins = 0;
    let relWins = 0;
    allRows.forEach((r) => {
      if (String(r.place || '').trim() !== '1') return;
      const rnd = String(r.round || 'Finals').toLowerCase();
      if (rnd === 'prelims' || rnd === 'time trial') return;
      const isRel =
        r.swimType === 'RELAY_WIN' ||
        String(r.eventKey || r.eventLabel || '').toLowerCase().includes('relay');
      if (isRel) relWins += 1;
      else indWins += 1;
    });

    // Event Bests (Full-Distance PB, Season Best, Split Best, & Current All-Time Top-10 Rank)
    const seasonStart = getCurrentSeasonStart();
    const eventMap = new Map();

    officialRows.forEach((r) => {
      if (!r.eventKey) return;
      if (!eventMap.has(r.eventKey)) {
        eventMap.set(r.eventKey, {
          eventKey: r.eventKey,
          eventLabel: r.eventLabel || toTitleEventLabel(r.eventKey),
          fullPb: null,
          fullSb: null,
          splitPb: null,
          swims: [],
        });
      }
      const evEntry = eventMap.get(r.eventKey);
      evEntry.swims.push(r);

      if (isSplitRow(r)) {
        if (!evEntry.splitPb || r.seconds < evEntry.splitPb.seconds) {
          evEntry.splitPb = r;
        }
      } else {
        if (!evEntry.fullPb || r.seconds < evEntry.fullPb.seconds) {
          evEntry.fullPb = r;
        }
        if (r.dateObj && r.dateObj >= seasonStart) {
          if (!evEntry.fullSb || r.seconds < evEntry.fullSb.seconds) {
            evEntry.fullSb = r;
          }
        }
      }
    });

    const eventSummaries = Array.from(eventMap.values())
      .map((ev) => {
        const pool = benchmarkIndex.byEvent[ev.eventKey] || [];
        const bestByAth = new Map();
        pool.forEach((rec) => {
          if (!bestByAth.has(rec.swimmerKey) || rec.seconds < bestByAth.get(rec.swimmerKey)) {
            bestByAth.set(rec.swimmerKey, rec.seconds);
          }
        });
        const sortedBests = Array.from(bestByAth.entries()).sort((a, b) => a[1] - b[1]);
        const rankIdx = sortedBests.findIndex(([k]) => k === swKey);
        const allTimeRank = rankIdx >= 0 && rankIdx < 10 ? rankIdx + 1 : null;

        ev.swims.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
        return {
          ...ev,
          allTimeRank,
        };
      })
      .sort((a, b) => a.eventLabel.localeCompare(b.eventLabel));

    const chronologicalLog = [...allRows].sort((a, b) =>
      (b.date || '').localeCompare(a.date || '')
    );

    const activeMeetSwims = parsedData
      ? parsedData.individualResults.filter((entry) => {
          const disp = formatSwimmerDisplay(entry.swimmerName, entry.preferredFirst);
          const m = resolveMasterAthlete(disp);
          return normalizeSwimmerKey(m ? m.canonicalName : disp) === swKey;
        })
      : [];

    const selectedEvObj =
      eventSummaries.find((e) => e.eventKey === profileChartEventKey) ||
      eventSummaries.find((e) => e.swims.filter((s) => !isSplitRow(s)).length >= 2) ||
      eventSummaries[0] ||
      null;

    return {
      canonicalName,
      gender: resolvedAth?.gender || (allRows[0]?.eventKey?.startsWith('men') ? 'Men' : 'Women'),
      isActive: resolvedAth ? Boolean(resolvedAth.isActive) : null,
      aliases: resolvedAth?.aliases || [],
      indWins,
      relWins,
      totalWins: indWins + relWins,
      totalLoggedSwims: allRows.length,
      eventSummaries,
      chronologicalLog,
      activeMeetSwims,
      selectedEvObj,
    };
  }, [profileSwimmerName, profileChartEventKey, historicalRecords, masterRoster, parsedData, benchmarkIndex]);

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
            <button
              onClick={() => {
                if (cloudSyncStatus === 'synced') {
                  if (masterRoster.length > 0) syncCollectionToCloud('master_roster', masterRoster, false);
                  if (masterCompetitions.length > 0)
                    syncCollectionToCloud('master_competitions', masterCompetitions, false);
                  if (masterEvents.length > 0)
                    syncCollectionToCloud('master_events', masterEvents, false);
                  if (historicalRecords.length > 0)
                    syncCollectionToCloud('performances', historicalRecords, false);
                  setBenchmarkStatusMsg('Synced local Master Lists and Database to Firestore.');
                } else {
                  setBenchmarkStatusMsg(
                    `Firebase status (${cloudSyncStatus}): ${
                      cloudErrorMsg || 'Check Firebase Anonymous Auth & Firestore Rules.'
                    }`
                  );
                }
              }}
              title={
                cloudSyncStatus === 'synced'
                  ? 'Connected to swimming-records Firestore (Click to force push local data)'
                  : `Firebase issue: ${cloudErrorMsg || 'Not connected'}`
              }
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition ${
                cloudSyncStatus === 'synced'
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
                  : cloudSyncStatus === 'connecting'
                  ? 'bg-slate-800 text-slate-300 border-slate-700'
                  : 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25'
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
                  <span>
                    Local Cache
                    {cloudErrorMsg ? ` (${cloudErrorMsg.replace('auth/', '').replace('firestore/', '')})` : ''}
                  </span>
                </>
              )}
            </button>

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
                {
                  id: 'history',
                  label: '1. Historical & Master Lists',
                  icon: Database,
                  activeClass: 'bg-cyan-600 text-white shadow-sm',
                },
                {
                  id: 'records',
                  label: '2. Records & Top-10',
                  icon: Trophy,
                  activeClass: 'bg-amber-500 text-slate-950 shadow-sm',
                },
                {
                  id: 'inmeet',
                  label: '3. In-Meet Tools',
                  icon: Sparkles,
                  activeClass: 'bg-indigo-600 text-white shadow-sm',
                },
                {
                  id: 'import',
                  label: '4. Import Meet Results',
                  icon: FolderUp,
                  activeClass: 'bg-blue-600 text-white shadow-sm',
                },
                {
                  id: 'postmeet',
                  label: '5. Post-Meet Tools',
                  icon: Award,
                  activeClass: 'bg-emerald-600 text-white shadow-sm',
                },
              ].map((nav) => {
                const Icon = nav.icon;
                const active = activeSection === nav.id;
                return (
                  <button
                    key={nav.id}
                    onClick={() => setActiveSection(nav.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                      active
                        ? nav.activeClass
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
                      {parsedData ? parsedData.stats.totalSwims : 0}
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                      Meet Swims
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
                    Mass-import your Master Roster, Competitions & Events, stage Google Sheet rows,
                    reconcile aliases, and sync directly to Firestore.
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
                    Quick-reference broadcaster lookup for active swimmers, full-distance bests,
                    intermediate split bests, and Top-10 targets on deck.
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
                  <span>{parsedData ? parsedData.meetInfo.name : 'Upload .CL2 / .SD3 File'}</span>
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
        {/* SECTION 1: HISTORICAL & MASTER LISTS                                 */}
        {/* ==================================================================== */}
        {activeSection === 'history' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 sm:px-6 py-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold">
                    Historical Benchmarks & Master Reference Lists
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Import Google Sheet history, reconcile athlete/competition/event aliases, and
                    manage canonical master lists.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 bg-slate-800 p-1 rounded-xl text-xs font-bold">
                  {[
                    { id: 'import', label: 'Import & Reconcile' },
                    { id: 'roster', label: `Master Roster (${masterRoster.length})` },
                    { id: 'competitions', label: `Competitions (${masterCompetitions.length})` },
                    { id: 'events', label: `Events (${masterEvents.length})` },
                    { id: 'database', label: `Committed DB (${historicalRecords.length})` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setHistorySubTab(tab.id)}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                        historySubTab === tab.id
                          ? 'bg-cyan-600 text-white shadow-sm'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* SUB-TAB A: GOOGLE SHEET IMPORT & RECONCILIATION */}
              {historySubTab === 'import' && (
                <div className="p-5 sm:p-6 space-y-6">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Paste Google Sheet Rows (TSV / CSV)
                        </label>
                        <div className="flex bg-slate-100 p-0.5 rounded-lg text-[11px] font-bold">
                          {[
                            { id: 'auto', label: 'Auto-Detect' },
                            { id: 'individual', label: 'Individual (12-Col)' },
                            { id: 'relay', label: 'Relays (11-Col)' },
                          ].map((m) => (
                            <button
                              key={m.id}
                              onClick={() => setSheetImportMode(m.id)}
                              className={`px-2 py-1 rounded-md transition cursor-pointer ${
                                sheetImportMode === m.id
                                  ? 'bg-white text-slate-900 shadow-xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              {m.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          ref={historyCsvInputRef}
                          type="file"
                          accept=".csv,.tsv,.txt"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (!f) return;
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              const txt = String(ev.target?.result || '');
                              setPasteSheetText(txt);
                              handleStageHistoryText(txt);
                            };
                            reader.readAsText(f);
                            e.target.value = '';
                          }}
                        />
                        <button
                          onClick={() => historyCsvInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                        >
                          Upload CSV/TSV File
                        </button>
                        <button
                          onClick={() => {
                            setSheetImportMode('individual');
                            setPasteSheetText(SAMPLE_GOOGLE_SHEET_CSV);
                            handleStageHistoryText(SAMPLE_GOOGLE_SHEET_CSV, 'individual');
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 cursor-pointer"
                        >
                          Sample Individual
                        </button>
                        <button
                          onClick={() => {
                            setSheetImportMode('relay');
                            setPasteSheetText(SAMPLE_RELAY_SHEET_CSV);
                            handleStageHistoryText(SAMPLE_RELAY_SHEET_CSV, 'relay');
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 cursor-pointer"
                        >
                          Sample Relays
                        </button>
                      </div>
                    </div>

                    <textarea
                      rows={5}
                      value={pasteSheetText}
                      onChange={(e) => setPasteSheetText(e.target.value)}
                      placeholder={
                        sheetImportMode === 'relay'
                          ? `Names\tEvent\tMin\tSec\tDate\tLocation\tCompetition\tPlace\tTime\tEvent\tSeconds\nDelanie McKenzie, Reilly Dolan, Morgan Puckett, Delaney Reck\t400 Medley Relay\t3\t59.68\t2026-11-07\tGettysburg PA\tGettysburg v Carnegie Mellon\t2\t3:59.68\tWomen 400 Medley Relay\t239.68`
                          : `Name\tClass\tEvent\tMin\tSec\tDate\tLocation\tCompetition\tPlace\tTime\tEvent\tSeconds\nAva Berry\tFr.\t1000 Free\t10\t46.20\t2026-10-24\tGettysburg PA\tGettysburg Invitational\t1\t10:46.20\tWomen 1000 Freestyle\t646.20`
                      }
                      className="w-full p-3 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleStageHistoryText(pasteSheetText)}
                        disabled={!pasteSheetText.trim()}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white transition cursor-pointer"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        Stage & Reconcile Rows
                      </button>
                      {stagedHistoryRows.length > 0 && (
                        <button
                          onClick={() => setStagedHistoryRows([])}
                          className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                          Clear Staging
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Unmatched Master List Reconciliation Panel */}
                  {(stagingUnmatched.athletes.length > 0 ||
                    stagingUnmatched.competitions.length > 0 ||
                    stagingUnmatched.events.length > 0) && (
                    <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 sm:p-5 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-extrabold text-amber-950 flex items-center gap-1.5">
                            <Link2 className="w-4 h-4 text-amber-700" />
                            Master List Reconciliation ({stagingUnmatched.athletes.length} Athletes,{' '}
                            {stagingUnmatched.competitions.length} Competitions,{' '}
                            {stagingUnmatched.events.length} Events)
                          </h3>
                          <p className="text-xs text-amber-800 mt-0.5">
                            Map incoming names to existing Master List records as aliases or add them
                            as new canonical entries.
                          </p>
                        </div>
                        <button
                          onClick={handleApplyReconciliations}
                          className="px-4 py-2 rounded-xl text-xs font-extrabold bg-amber-600 hover:bg-amber-500 text-white shadow-sm transition cursor-pointer"
                        >
                          Apply Reconciliations
                        </button>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {stagingUnmatched.athletes.length > 0 && (
                          <div className="bg-white rounded-xl border border-amber-200 p-3.5 space-y-2.5">
                            <div className="text-xs font-bold uppercase text-slate-600">
                              Unmatched Athletes
                            </div>
                            {stagingUnmatched.athletes.map((item) => {
                              const selKey = `ath:${normalizeSwimmerKey(item.rawName)}`;
                              return (
                                <div key={selKey} className="space-y-1 text-xs">
                                  <div className="font-bold text-slate-900">
                                    {item.rawName}{' '}
                                    <span className="text-slate-400 font-normal">
                                      ({item.count} rows)
                                    </span>
                                  </div>
                                  <select
                                    value={reconcileSelections[selKey] || '__NEW__'}
                                    onChange={(e) =>
                                      setReconcileSelections((prev) => ({
                                        ...prev,
                                        [selKey]: e.target.value,
                                      }))
                                    }
                                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                                  >
                                    <option value="__NEW__">
                                      + Add &quot;{item.rawName}&quot; as New ({item.inferredGender})
                                    </option>
                                    {masterRoster
                                      .slice()
                                      .sort((a, b) =>
                                        compareByLastName(a.canonicalName, b.canonicalName)
                                      )
                                      .map((ath) => (
                                        <option key={ath.id} value={ath.id}>
                                          Alias → {ath.canonicalName} ({ath.gender})
                                        </option>
                                      ))}
                                  </select>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {stagingUnmatched.competitions.length > 0 && (
                          <div className="bg-white rounded-xl border border-amber-200 p-3.5 space-y-2.5">
                            <div className="text-xs font-bold uppercase text-slate-600">
                              Unmatched Competitions (Name + Date)
                            </div>
                            {stagingUnmatched.competitions.map((item) => {
                              const selKey = `comp:${normalizeCompKey(item.rawName)}|${item.sampleDate}`;
                              return (
                                <div key={selKey} className="space-y-1 text-xs">
                                  <div className="font-bold text-slate-900">
                                    {item.rawName}{' '}
                                    <span className="font-mono text-cyan-700">
                                      [{item.sampleDate || 'No Date'}]
                                    </span>
                                  </div>
                                  <select
                                    value={reconcileSelections[selKey] || '__NEW__'}
                                    onChange={(e) =>
                                      setReconcileSelections((prev) => ({
                                        ...prev,
                                        [selKey]: e.target.value,
                                      }))
                                    }
                                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                                  >
                                    <option value="__NEW__">
                                      + Add &quot;{item.rawName}&quot; ({item.sampleDate || 'Any Date'})
                                    </option>
                                    {masterCompetitions.map((c) => (
                                      <option key={c.id} value={c.id}>
                                        Alias → {c.canonicalName} ({c.date || 'Any Date'})
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {stagingUnmatched.events.length > 0 && (
                          <div className="bg-white rounded-xl border border-amber-200 p-3.5 space-y-2.5">
                            <div className="text-xs font-bold uppercase text-slate-600">
                              Unmatched Events
                            </div>
                            {stagingUnmatched.events.map((item) => {
                              const selKey = `ev:${item.rawEvent.toLowerCase()}|${item.genderHint}`;
                              return (
                                <div key={selKey} className="space-y-1 text-xs">
                                  <div className="font-bold text-slate-900">
                                    {item.rawEvent}{' '}
                                    {item.genderHint ? `(${item.genderHint})` : ''}
                                  </div>
                                  <select
                                    value={reconcileSelections[selKey] || ''}
                                    onChange={(e) =>
                                      setReconcileSelections((prev) => ({
                                        ...prev,
                                        [selKey]: e.target.value,
                                      }))
                                    }
                                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                                  >
                                    <option value="">-- Select Canonical Event --</option>
                                    {masterEvents.map((ev) => (
                                      <option key={ev.id} value={ev.id}>
                                        {ev.canonicalName}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Staged Preview Table */}
                  {stagedHistoryRows.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="text-xs font-bold text-slate-700">
                          Staged Rows ({stagedHistoryRows.filter((r) => r.selected).length} of{' '}
                          {stagedHistoryRows.length} selected)
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleCommitStagedRows('append')}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition cursor-pointer"
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

                      <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-[420px]">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px] sticky top-0">
                            <tr>
                              <th className="py-2.5 px-3 w-10">
                                <input
                                  type="checkbox"
                                  checked={
                                    stagedHistoryRows.length > 0 &&
                                    stagedHistoryRows.every((r) => r.selected)
                                  }
                                  onChange={(e) =>
                                    setStagedHistoryRows((prev) =>
                                      prev.map((r) => ({ ...r, selected: e.target.checked }))
                                    )
                                  }
                                />
                              </th>
                              <th className="py-2.5 px-3">Athlete</th>
                              <th className="py-2.5 px-3">Event</th>
                              <th className="py-2.5 px-3">Time</th>
                              <th className="py-2.5 px-3">Competition</th>
                              <th className="py-2.5 px-3">Date</th>
                              <th className="py-2.5 px-3">Classification</th>
                              <th className="py-2.5 px-3">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {stagedHistoryRows.map((row) => (
                              <tr
                                key={row.id}
                                className={row.isDuplicate ? 'bg-slate-50/70 text-slate-400' : ''}
                              >
                                <td className="py-2 px-3">
                                  <input
                                    type="checkbox"
                                    checked={row.selected}
                                    onChange={(e) =>
                                      setStagedHistoryRows((prev) =>
                                        prev.map((item) =>
                                          item.id === row.id
                                            ? { ...item, selected: e.target.checked }
                                            : item
                                        )
                                      )
                                    }
                                  />
                                </td>
                                <td className="py-2 px-3 font-semibold text-slate-800">
                                  <div>{row.swimmerName}</div>
                                  {row.classYear && (
                                    <span className="text-[10px] text-slate-500 font-normal">
                                      Class: {row.classYear}
                                    </span>
                                  )}
                                </td>
                                <td className="py-2 px-3">{row.eventLabel}</td>
                                <td className="py-2 px-3 font-mono font-bold">
                                  {row.time}
                                  {row.place && (
                                    <span className="ml-1.5 px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600">
                                      #{row.place}
                                    </span>
                                  )}
                                </td>
                                <td className="py-2 px-3">
                                  {row.competition || '—'}
                                  {row.round === 'Prelims' && (
                                    <span className="ml-1.5 px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                                      Prelims (SF)
                                    </span>
                                  )}
                                  {row.round === 'Time Trial' && (
                                    <span className="ml-1.5 px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-bold">
                                      Time Trial (TT)
                                    </span>
                                  )}
                                </td>
                                <td className="py-2 px-3 font-mono text-[11px]">{row.date || '—'}</td>
                                <td className="py-2 px-3">
                                  {row.swimType === 'RELAY_TEAM' ? (
                                    <span className="px-2 py-1 rounded bg-purple-100 text-purple-800 text-[11px] font-bold">
                                      Relay Lineup (4 Legs)
                                    </span>
                                  ) : (
                                    <select
                                      value={row.swimType}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setStagedHistoryRows((prev) =>
                                          prev.map((item) =>
                                            item.id === row.id
                                              ? {
                                                  ...item,
                                                  swimType: val,
                                                  place:
                                                    val === 'RELAY_LEADOFF'
                                                      ? 'R'
                                                      : val === 'INTERMEDIATE_SPLIT'
                                                      ? 'S'
                                                      : item.place === 'R' || item.place === 'S'
                                                      ? ''
                                                      : item.place,
                                                }
                                              : item
                                          )
                                        );
                                      }}
                                      className="px-2 py-1 bg-white border border-slate-200 rounded text-[11px]"
                                    >
                                      <option value="OFFICIAL">Official Individual</option>
                                      <option value="RELAY_LEADOFF">Relay Lead-Off (R)</option>
                                      <option value="INTERMEDIATE_SPLIT">
                                        Intermediate Split (S)
                                      </option>
                                    </select>
                                  )}
                                </td>
                                <td className="py-2 px-3">
                                  {row.isDuplicate ? (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600">
                                      Already in DB
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                      Ready
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

              {/* SUB-TAB B: MASTER ROSTER */}
              {historySubTab === 'roster' && (
                <div className="p-5 sm:p-6 space-y-5">
                  <div className="bg-cyan-50/50 p-4 rounded-xl border border-cyan-200/80 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-cyan-900 flex items-center gap-1.5">
                        <UserPlus className="w-4 h-4 text-cyan-700" />
                        Mass Roster Importer
                      </label>
                      <span className="text-[11px] text-cyan-800 font-medium">
                        Columns:{' '}
                        <code className="bg-white px-1 rounded">
                          Name, Gender, Active (Yes/No), Aliases (semicolon-separated)
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

                  {/* Master Roster Table (Sorted by Last Name) */}
                  {masterRoster.length === 0 ? (
                    <div className="text-center py-10 text-sm text-slate-500 border border-dashed border-slate-200 rounded-xl">
                      No athletes in the Master Roster yet. Use the Mass Roster Importer above or
                      sync from your database.
                    </div>
                  ) : (
                    (() => {
                      const filteredRoster = masterRoster
                        .filter((ath) => {
                          if (rosterFilterGender !== 'ALL' && ath.gender !== rosterFilterGender) {
                            return false;
                          }
                          if (rosterFilterActive === 'ACTIVE' && !ath.isActive) return false;
                          if (rosterFilterActive === 'INACTIVE' && ath.isActive) return false;
                          if (rosterSearchQuery.trim() !== '') {
                            const q = rosterSearchQuery.toLowerCase();
                            const hay = `${ath.canonicalName} ${(ath.aliases || []).join(' ')}`.toLowerCase();
                            if (!hay.includes(q)) return false;
                          }
                          return true;
                        })
                        .sort((a, b) => compareByLastName(a.canonicalName, b.canonicalName));

                      return (
                        <div className="space-y-3">
                          {/* Roster Filter Bar */}
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-2.5 flex-1">
                              <div className="relative flex-1 min-w-[180px] max-w-xs">
                                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                  type="text"
                                  value={rosterSearchQuery}
                                  onChange={(e) => setRosterSearchQuery(e.target.value)}
                                  placeholder="Search name or alias..."
                                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                              </div>

                              {/* Gender Filter */}
                              <div className="flex bg-slate-200/70 p-0.5 rounded-lg text-xs font-bold">
                                {[
                                  { id: 'ALL', label: 'All Genders' },
                                  { id: 'Women', label: 'Women' },
                                  { id: 'Men', label: 'Men' },
                                ].map((opt) => (
                                  <button
                                    key={opt.id}
                                    onClick={() => setRosterFilterGender(opt.id)}
                                    className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                                      rosterFilterGender === opt.id
                                        ? 'bg-white text-slate-900 shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>

                              {/* Active Status Filter */}
                              <div className="flex bg-slate-200/70 p-0.5 rounded-lg text-xs font-bold">
                                {[
                                  { id: 'ALL', label: 'All Status' },
                                  { id: 'ACTIVE', label: 'Active' },
                                  { id: 'INACTIVE', label: 'Inactive' },
                                ].map((opt) => (
                                  <button
                                    key={opt.id}
                                    onClick={() => setRosterFilterActive(opt.id)}
                                    className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                                      rosterFilterActive === opt.id
                                        ? 'bg-white text-slate-900 shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-slate-600 shrink-0">
                              <span>
                                Showing <strong>{filteredRoster.length}</strong> of{' '}
                                <strong>{masterRoster.length}</strong>
                              </span>
                              {(rosterSearchQuery ||
                                rosterFilterGender !== 'ALL' ||
                                rosterFilterActive !== 'ALL') && (
                                <button
                                  onClick={() => {
                                    setRosterSearchQuery('');
                                    setRosterFilterGender('ALL');
                                    setRosterFilterActive('ALL');
                                  }}
                                  className="font-bold text-cyan-700 hover:underline cursor-pointer"
                                >
                                  Reset
                                </button>
                              )}
                            </div>
                          </div>

                          {filteredRoster.length === 0 ? (
                            <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl">
                              No athletes match the selected roster filters.
                            </div>
                          ) : (
                            <div className="overflow-x-auto border border-slate-200 rounded-xl">
                              <table className="w-full text-left text-xs">
                                <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px]">
                                  <tr>
                                    <th className="py-2.5 px-4">Canonical Name</th>
                                    <th className="py-2.5 px-4">Gender</th>
                                    <th className="py-2.5 px-4 text-center">Status</th>
                                    <th className="py-2.5 px-4">Saved Aliases</th>
                                    <th className="py-2.5 px-4 text-center">Actions</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {filteredRoster.map((ath) => {
                                    const isEditingAth = editingRosterId === ath.id;
                                    if (isEditingAth) {
                                      return (
                                        <tr key={ath.id} className="bg-cyan-50/70">
                                          <td className="py-2.5 px-4">
                                            <input
                                              type="text"
                                              value={editRosterDraft.canonicalName}
                                              onChange={(e) =>
                                                setEditRosterDraft((prev) => ({
                                                  ...prev,
                                                  canonicalName: e.target.value,
                                                }))
                                              }
                                              className="w-full px-2.5 py-1.5 text-xs font-bold bg-white border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                            />
                                            <label className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-medium text-cyan-900 cursor-pointer">
                                              <input
                                                type="checkbox"
                                                checked={editRosterDraft.propagateToDb}
                                                onChange={(e) =>
                                                  setEditRosterDraft((prev) => ({
                                                    ...prev,
                                                    propagateToDb: e.target.checked,
                                                  }))
                                                }
                                                className="rounded text-cyan-600"
                                              />
                                              Update matching DB rows
                                            </label>
                                          </td>
                                          <td className="py-2.5 px-4 align-top">
                                            <select
                                              value={editRosterDraft.gender}
                                              onChange={(e) =>
                                                setEditRosterDraft((prev) => ({
                                                  ...prev,
                                                  gender: e.target.value,
                                                }))
                                              }
                                              className="px-2 py-1.5 text-xs bg-white border border-cyan-300 rounded-lg"
                                            >
                                              <option value="Women">Women</option>
                                              <option value="Men">Men</option>
                                            </select>
                                          </td>
                                          <td className="py-2.5 px-4 text-center align-top">
                                            <label className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-white border border-cyan-300 px-2 py-1 rounded-lg cursor-pointer">
                                              <input
                                                type="checkbox"
                                                checked={editRosterDraft.isActive}
                                                onChange={(e) =>
                                                  setEditRosterDraft((prev) => ({
                                                    ...prev,
                                                    isActive: e.target.checked,
                                                  }))
                                                }
                                                className="rounded text-cyan-600"
                                              />
                                              Active
                                            </label>
                                          </td>
                                          <td className="py-2.5 px-4 align-top">
                                            <input
                                              type="text"
                                              value={editRosterDraft.aliasesText}
                                              onChange={(e) =>
                                                setEditRosterDraft((prev) => ({
                                                  ...prev,
                                                  aliasesText: e.target.value,
                                                }))
                                              }
                                              placeholder="Semicolon or comma separated aliases..."
                                              className="w-full px-2.5 py-1.5 text-xs bg-white border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                            />
                                          </td>
                                          <td className="py-2.5 px-4 text-center align-top">
                                            <div className="inline-flex items-center gap-1">
                                              <button
                                                type="button"
                                                onClick={() => handleSaveMasterRosterEdit(ath)}
                                                className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                                              >
                                                Save
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => setEditingRosterId(null)}
                                                className="px-2 py-1 rounded-lg text-[11px] font-semibold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                                              >
                                                Cancel
                                              </button>
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    }

                                    return (
                                      <tr key={ath.id} className="hover:bg-slate-50">
                                        <td className="py-2.5 px-4 font-bold text-slate-900">
                                          {ath.canonicalName}
                                        </td>
                                        <td className="py-2.5 px-4 text-slate-600">{ath.gender}</td>
                                        <td className="py-2.5 px-4 text-center">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const updatedItem = { ...ath, isActive: !ath.isActive };
                                              updateMasterRoster(
                                                masterRoster.map((item) =>
                                                  item.id === ath.id ? updatedItem : item
                                                ),
                                                [updatedItem]
                                              );
                                            }}
                                            title="Click to toggle Active / Inactive status"
                                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition cursor-pointer ${
                                              ath.isActive
                                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                                            }`}
                                          >
                                            {ath.isActive ? 'Active' : 'Inactive'}
                                          </button>
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
                                          <div className="inline-flex items-center gap-1.5">
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setEditingRosterId(ath.id);
                                                setEditRosterDraft({
                                                  canonicalName: ath.canonicalName || '',
                                                  gender: ath.gender || 'Women',
                                                  isActive: Boolean(ath.isActive),
                                                  aliasesText: (ath.aliases || []).join('; '),
                                                  propagateToDb: true,
                                                });
                                              }}
                                              className="px-2 py-1 rounded text-[11px] font-bold text-cyan-700 hover:bg-cyan-50 border border-cyan-200 cursor-pointer"
                                            >
                                              Edit
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                updateMasterRoster(
                                                  masterRoster.filter((item) => item.id !== ath.id),
                                                  null,
                                                  ath.id
                                                )
                                              }
                                              title="Remove athlete from Master Roster"
                                              className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      );
                    })()
                  )}
                </div>
              )}

              {/* SUB-TAB C: MASTER COMPETITIONS */}
              {historySubTab === 'competitions' && (
                <div className="p-5 sm:p-6 space-y-5">
                  <div className="bg-cyan-50/50 p-4 rounded-xl border border-cyan-200/80 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-cyan-900 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-cyan-700" />
                        Mass Competitions Importer (Each Competition + Date is a Unique Meet)
                      </label>
                      <span className="text-[11px] text-cyan-800 font-medium">
                        Columns:{' '}
                        <code className="bg-white px-1 rounded">
                          Competition Name, Date (YYYY-MM-DD), Location, Aliases
                        </code>
                      </span>
                    </div>
                    <textarea
                      rows={4}
                      value={bulkCompText}
                      onChange={(e) => setBulkCompText(e.target.value)}
                      placeholder={`Competition Name, Date, Location, Aliases\nGettysburg Invitational, 2026-10-24, Gettysburg PA, Gettysburg Invite\nCentennial Conference Championships, 2026-02-20, Lancaster PA, CC Championships`}
                      className="w-full p-3 text-xs font-mono bg-white border border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <button
                      onClick={handleBulkImportCompetitions}
                      disabled={!bulkCompText.trim()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white transition cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Mass Import Competitions
                    </button>
                  </div>

                  {/* Single Competition Quick-Add */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 items-end">
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                        Competition Name
                      </label>
                      <input
                        type="text"
                        value={newCompName}
                        onChange={(e) => setNewCompName(e.target.value)}
                        placeholder="e.g., Centennial Conference Championships"
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                        Meet Date
                      </label>
                      <input
                        type="date"
                        value={newCompDate}
                        onChange={(e) => setNewCompDate(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCompLocation}
                        onChange={(e) => setNewCompLocation(e.target.value)}
                        placeholder="Location (e.g., Lancaster PA)"
                        className="flex-1 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
                      />
                      <button
                        onClick={() => {
                          if (!newCompName.trim()) return;
                          const created = {
                            id: `comp-${Date.now()}`,
                            canonicalName: newCompName.trim(),
                            date: normalizeDateIso(newCompDate),
                            defaultLocation: newCompLocation.trim(),
                            aliases: [],
                          };
                          updateMasterCompetitions([...masterCompetitions, created], [created]);
                          setNewCompName('');
                          setNewCompDate('');
                          setNewCompLocation('');
                        }}
                        className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {masterCompetitions.length === 0 ? (
                    <div className="text-center py-10 text-sm text-slate-500 border border-dashed border-slate-200 rounded-xl">
                      No competitions in Master Competitions yet.
                    </div>
                  ) : (
                    <div className="overflow-x-auto border border-slate-200 rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px]">
                          <tr>
                            <th className="py-2.5 px-4">Canonical Competition</th>
                            <th className="py-2.5 px-4">Date</th>
                            <th className="py-2.5 px-4">Default Location</th>
                            <th className="py-2.5 px-4">Saved Aliases</th>
                            <th className="py-2.5 px-4 text-center">Remove</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {masterCompetitions
                            .slice()
                            .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
                            .map((comp) => (
                              <tr key={comp.id} className="hover:bg-slate-50">
                                <td className="py-2.5 px-4 font-bold text-slate-900">
                                  {comp.canonicalName}
                                </td>
                                <td className="py-2.5 px-4 font-mono text-slate-600">
                                  {comp.date || 'Any Date'}
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

              {/* SUB-TAB C2: MASTER EVENTS */}
              {historySubTab === 'events' && (
                <div className="p-5 sm:p-6 space-y-5">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-end gap-3">
                    <div className="flex-1">
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                        Canonical Event Name
                      </label>
                      <input
                        type="text"
                        value={newEventName}
                        onChange={(e) => setNewEventName(e.target.value)}
                        placeholder="e.g., Women 100 Freestyle"
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                        Optional Alias (e.g., W 100 Free)
                      </label>
                      <input
                        type="text"
                        value={newEventAlias}
                        onChange={(e) => setNewEventAlias(e.target.value)}
                        placeholder="e.g., W 100 Free"
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const cleanName = newEventName.trim();
                        if (!cleanName) return;
                        const evKey = normalizeEventKey(cleanName) || cleanName.toLowerCase();
                        const existing = masterEvents.find(
                          (ev) => ev.canonicalName.toLowerCase() === cleanName.toLowerCase()
                        );
                        if (existing) {
                          if (newEventAlias.trim()) {
                            const updated = {
                              ...existing,
                              aliases: Array.from(
                                new Set([...(existing.aliases || []), newEventAlias.trim()])
                              ),
                            };
                            updateMasterEvents(
                              masterEvents.map((e) => (e.id === existing.id ? updated : e)),
                              [updated]
                            );
                          }
                        } else {
                          const created = {
                            id: `ev-${Date.now()}`,
                            canonicalName: cleanName,
                            eventKey: evKey,
                            gender: cleanName.toLowerCase().startsWith('men') ? 'Men' : 'Women',
                            isRelay: cleanName.toLowerCase().includes('relay'),
                            aliases: newEventAlias.trim() ? [newEventAlias.trim()] : [],
                          };
                          updateMasterEvents([...masterEvents, created], [created]);
                        }
                        setNewEventName('');
                        setNewEventAlias('');
                      }}
                      className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition cursor-pointer"
                    >
                      Save Event / Alias
                    </button>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="py-2.5 px-4">Canonical Event</th>
                          <th className="py-2.5 px-4">Gender</th>
                          <th className="py-2.5 px-4">Type</th>
                          <th className="py-2.5 px-4">Saved Aliases</th>
                          <th className="py-2.5 px-4 text-center">Remove</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {masterEvents.map((ev) => (
                          <tr key={ev.id} className="hover:bg-slate-50">
                            <td className="py-2.5 px-4 font-bold text-slate-900">
                              {ev.canonicalName}
                            </td>
                            <td className="py-2.5 px-4 text-slate-600">{ev.gender}</td>
                            <td className="py-2.5 px-4 text-slate-600">
                              {ev.isRelay ? 'Relay' : 'Individual'}
                            </td>
                            <td className="py-2.5 px-4 text-slate-500">
                              {(ev.aliases || []).length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {ev.aliases.map((al) => (
                                    <span
                                      key={al}
                                      className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]"
                                    >
                                      {al}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-slate-400 italic">Auto-normalized</span>
                              )}
                            </td>
                            <td className="py-2.5 px-4 text-center">
                              <button
                                onClick={() =>
                                  updateMasterEvents(
                                    masterEvents.filter((item) => item.id !== ev.id),
                                    null,
                                    ev.id
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
                </div>
              )}

              {/* SUB-TAB D: COMMITTED DATABASE */}
              {historySubTab === 'database' && (
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs font-bold text-slate-700">
                      {filteredSortedDbRecords.length === historicalRecords.length
                        ? `${historicalRecords.length} total committed records`
                        : `Showing ${filteredSortedDbRecords.length} matching records (of ${historicalRecords.length} total)`}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
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

                  {/* Multi-Field Filter Bar */}
                  {historicalRecords.length > 0 && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={dbSearchName}
                            onChange={(e) => {
                              setDbSearchName(e.target.value);
                              setDbPage(1);
                            }}
                            placeholder="Filter by athlete name..."
                            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          />
                        </div>

                        <select
                          value={dbFilterEvent}
                          onChange={(e) => {
                            setDbFilterEvent(e.target.value);
                            setDbPage(1);
                          }}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                          <option value="ALL">All Events ({dbFilterOptions.events.length})</option>
                          {dbFilterOptions.events.map((ev) => (
                            <option key={ev} value={ev}>
                              {ev}
                            </option>
                          ))}
                        </select>

                        <select
                          value={dbFilterCompetition}
                          onChange={(e) => {
                            setDbFilterCompetition(e.target.value);
                            setDbPage(1);
                          }}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                          <option value="ALL">
                            All Competitions ({dbFilterOptions.competitions.length})
                          </option>
                          {dbFilterOptions.competitions.map((comp) => (
                            <option key={comp} value={comp}>
                              {comp}
                            </option>
                          ))}
                        </select>

                        <input
                          type="text"
                          value={dbFilterDate}
                          onChange={(e) => {
                            setDbFilterDate(e.target.value);
                            setDbPage(1);
                          }}
                          placeholder="Filter date (e.g., 2026 or 2026-02)"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />

                        <select
                          value={dbFilterType}
                          onChange={(e) => {
                            setDbFilterType(e.target.value);
                            setDbPage(1);
                          }}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                          <option value="ALL">All Record Types</option>
                          <option value="OFFICIAL">Official Individual</option>
                          <option value="RELAY_LEADOFF">Relay Lead-Off (R)</option>
                          <option value="INTERMEDIATE_SPLIT">Intermediate Split (S)</option>
                          <option value="RELAY_WIN">Relay Win</option>
                        </select>
                      </div>

                      {(dbSearchName ||
                        dbFilterEvent !== 'ALL' ||
                        dbFilterCompetition !== 'ALL' ||
                        dbFilterDate ||
                        dbFilterType !== 'ALL') && (
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <button
                            onClick={() =>
                              setPendingDbDeleteIds(filteredSortedDbRecords.map((r) => r.id))
                            }
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete All {filteredSortedDbRecords.length} Filtered Records
                          </button>
                          <button
                            onClick={() => {
                              setDbSearchName('');
                              setDbFilterEvent('ALL');
                              setDbFilterCompetition('ALL');
                              setDbFilterDate('');
                              setDbFilterType('ALL');
                              setDbPage(1);
                            }}
                            className="text-[11px] font-bold text-cyan-700 hover:underline cursor-pointer"
                          >
                            Reset All Filters
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Selected Rows Action Bar */}
                  {selectedDbIds.size > 0 && (
                    <div className="bg-slate-900 text-white px-4 py-2.5 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-cyan-300">
                          {selectedDbIds.size} record{selectedDbIds.size === 1 ? '' : 's'} selected
                        </span>
                        <button
                          onClick={() => setSelectedDbIds(new Set())}
                          className="text-slate-300 hover:text-white underline cursor-pointer"
                        >
                          Clear selection
                        </button>
                      </div>
                      <button
                        onClick={() => setPendingDbDeleteIds(Array.from(selectedDbIds))}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold bg-red-600 hover:bg-red-500 text-white transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete Selected ({selectedDbIds.size})
                      </button>
                    </div>
                  )}

                  {/* Inline Two-Step Delete Confirmation Banner */}
                  {pendingDbDeleteIds && pendingDbDeleteIds.length > 0 && (
                    <div className="bg-red-50 border border-red-300 text-red-950 px-4 py-3 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                        <span>
                          Permanently delete{' '}
                          <strong>
                            {pendingDbDeleteIds.length} database record
                            {pendingDbDeleteIds.length === 1 ? '' : 's'}
                          </strong>{' '}
                          from local storage and Firestore?
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPendingDbDeleteIds(null)}
                          className="px-3 py-1.5 rounded-lg font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDeleteDbRecords(pendingDbDeleteIds)}
                          className="px-3.5 py-1.5 rounded-lg font-extrabold bg-red-600 hover:bg-red-500 text-white cursor-pointer"
                        >
                          Yes, Delete Permanently
                        </button>
                      </div>
                    </div>
                  )}

                  {historicalRecords.length === 0 ? (
                    <div className="text-center py-12 text-sm text-slate-500 border border-dashed border-slate-200 rounded-xl">
                      No historical performances committed yet. Import rows from Google Sheets in
                      the first tab or commit a `.cl2` meet in Post-Meet Tools.
                    </div>
                  ) : filteredSortedDbRecords.length === 0 ? (
                    <div className="text-center py-10 text-sm text-slate-500 border border-dashed border-slate-200 rounded-xl">
                      No database records match your active filters.
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-[540px]">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px] sticky top-0 z-10">
                            <tr>
                              <th className="py-2.5 px-3 w-9">
                                <input
                                  type="checkbox"
                                  checked={
                                    paginatedDbRecords.length > 0 &&
                                    paginatedDbRecords.every((r) => selectedDbIds.has(r.id))
                                  }
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    setSelectedDbIds((prev) => {
                                      const next = new Set(prev);
                                      paginatedDbRecords.forEach((r) => {
                                        if (checked) next.add(r.id);
                                        else next.delete(r.id);
                                      });
                                      return next;
                                    });
                                  }}
                                  title="Select all rows on this page"
                                  className="rounded text-cyan-600 cursor-pointer"
                                />
                              </th>
                              <th
                                onClick={() => handleDbSort('swimmerName')}
                                className="py-2.5 px-3 cursor-pointer hover:text-slate-900 select-none"
                              >
                                <div className="inline-flex items-center gap-1">
                                  <span>Athlete</span>
                                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                                </div>
                              </th>
                              <th className="py-2.5 px-3">Class</th>
                              <th
                                onClick={() => handleDbSort('eventLabel')}
                                className="py-2.5 px-3 cursor-pointer hover:text-slate-900 select-none"
                              >
                                <div className="inline-flex items-center gap-1">
                                  <span>Event</span>
                                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                                </div>
                              </th>
                              <th
                                onClick={() => handleDbSort('time')}
                                className="py-2.5 px-3 cursor-pointer hover:text-slate-900 select-none"
                              >
                                <div className="inline-flex items-center gap-1">
                                  <span>Time</span>
                                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                                </div>
                              </th>
                              <th
                                onClick={() => handleDbSort('competition')}
                                className="py-2.5 px-3 cursor-pointer hover:text-slate-900 select-none"
                              >
                                <div className="inline-flex items-center gap-1">
                                  <span>Competition</span>
                                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                                </div>
                              </th>
                              <th
                                onClick={() => handleDbSort('date')}
                                className="py-2.5 px-3 cursor-pointer hover:text-slate-900 select-none"
                              >
                                <div className="inline-flex items-center gap-1">
                                  <span>Date</span>
                                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                                </div>
                              </th>
                              <th
                                onClick={() => handleDbSort('type')}
                                className="py-2.5 px-3 cursor-pointer hover:text-slate-900 select-none"
                              >
                                <div className="inline-flex items-center gap-1">
                                  <span>Type</span>
                                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                                </div>
                              </th>
                              <th className="py-2.5 px-3 text-center w-24">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {paginatedDbRecords.map((r) => {
                              const isChecked = selectedDbIds.has(r.id);
                              const isEditingRow = editingDbRowId === r.id;

                              if (isEditingRow) {
                                return (
                                  <tr key={r.id} className="bg-cyan-50/75">
                                    <td className="py-2 px-3">
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={(e) => {
                                          const checked = e.target.checked;
                                          setSelectedDbIds((prev) => {
                                            const next = new Set(prev);
                                            if (checked) next.add(r.id);
                                            else next.delete(r.id);
                                            return next;
                                          });
                                        }}
                                        className="rounded text-cyan-600 cursor-pointer"
                                      />
                                    </td>
                                    <td className="py-2 px-3">
                                      <input
                                        type="text"
                                        list="master-roster-datalist"
                                        value={editDbDraft.swimmerName}
                                        onChange={(e) =>
                                          setEditDbDraft((prev) => ({
                                            ...prev,
                                            swimmerName: e.target.value,
                                          }))
                                        }
                                        className="w-full min-w-[140px] px-2 py-1 text-xs font-bold bg-white border border-cyan-300 rounded"
                                      />
                                    </td>
                                    <td className="py-2 px-3">
                                      <select
                                        value={editDbDraft.classYear}
                                        onChange={(e) =>
                                          setEditDbDraft((prev) => ({
                                            ...prev,
                                            classYear: e.target.value,
                                          }))
                                        }
                                        className="px-1.5 py-1 text-xs bg-white border border-cyan-300 rounded"
                                      >
                                        <option value="">—</option>
                                        <option value="FR">FR</option>
                                        <option value="SO">SO</option>
                                        <option value="JR">JR</option>
                                        <option value="SR">SR</option>
                                        <option value="GR">GR</option>
                                      </select>
                                    </td>
                                    <td className="py-2 px-3">
                                      <select
                                        value={editDbDraft.eventLabel}
                                        onChange={(e) =>
                                          setEditDbDraft((prev) => ({
                                            ...prev,
                                            eventLabel: e.target.value,
                                          }))
                                        }
                                        className="w-full min-w-[165px] px-2 py-1 text-xs bg-white border border-cyan-300 rounded"
                                      >
                                        {!CANONICAL_EVENTS.includes(editDbDraft.eventLabel) &&
                                          editDbDraft.eventLabel && (
                                            <option value={editDbDraft.eventLabel}>
                                              {editDbDraft.eventLabel}
                                            </option>
                                          )}
                                        {CANONICAL_EVENTS.map((ev) => (
                                          <option key={ev} value={ev}>
                                            {ev}
                                          </option>
                                        ))}
                                      </select>
                                    </td>
                                    <td className="py-2 px-3">
                                      <input
                                        type="text"
                                        value={editDbDraft.time}
                                        onChange={(e) =>
                                          setEditDbDraft((prev) => ({
                                            ...prev,
                                            time: e.target.value,
                                          }))
                                        }
                                        className="w-24 px-2 py-1 text-xs font-mono font-bold bg-white border border-cyan-300 rounded"
                                      />
                                    </td>
                                    <td className="py-2 px-3">
                                      <input
                                        type="text"
                                        value={editDbDraft.competition}
                                        onChange={(e) =>
                                          setEditDbDraft((prev) => ({
                                            ...prev,
                                            competition: e.target.value,
                                          }))
                                        }
                                        className="w-full min-w-[140px] px-2 py-1 text-xs bg-white border border-cyan-300 rounded"
                                      />
                                    </td>
                                    <td className="py-2 px-3">
                                      <input
                                        type="date"
                                        value={editDbDraft.date}
                                        onChange={(e) =>
                                          setEditDbDraft((prev) => ({
                                            ...prev,
                                            date: e.target.value,
                                          }))
                                        }
                                        className="px-2 py-1 text-xs font-mono bg-white border border-cyan-300 rounded"
                                      />
                                    </td>
                                    <td className="py-2 px-3 text-slate-500 text-[11px]">
                                      {r.swimType || 'OFFICIAL'}
                                    </td>
                                    <td className="py-2 px-3 text-center">
                                      <div className="inline-flex items-center gap-1">
                                        <button
                                          type="button"
                                          onClick={() => handleSaveDbRecordEdit(r)}
                                          className="px-2 py-1 rounded text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                                        >
                                          Save
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setEditingDbRowId(null)}
                                          className="px-1.5 py-1 rounded text-[11px] font-semibold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              }

                              return (
                                <tr
                                  key={r.id}
                                  className={
                                    isChecked ? 'bg-cyan-50/60' : 'hover:bg-slate-50'
                                  }
                                >
                                  <td className="py-2 px-3">
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={(e) => {
                                        const checked = e.target.checked;
                                        setSelectedDbIds((prev) => {
                                          const next = new Set(prev);
                                          if (checked) next.add(r.id);
                                          else next.delete(r.id);
                                          return next;
                                        });
                                      }}
                                      className="rounded text-cyan-600 cursor-pointer"
                                    />
                                  </td>
                                  <td className="py-2 px-3 font-bold text-slate-900">
                                    <button
                                      type="button"
                                      onClick={() => openSwimmerProfile(r.swimmerName, r.eventKey)}
                                      className="text-left hover:text-cyan-700 hover:underline cursor-pointer"
                                    >
                                      {r.swimmerName}
                                    </button>
                                  </td>
                                  <td className="py-2 px-3">{r.classYear || '—'}</td>
                                  <td className="py-2 px-3">{r.eventLabel}</td>
                                  <td className="py-2 px-3 font-mono font-bold text-cyan-800">
                                    {r.time}
                                  </td>
                                  <td className="py-2 px-3 text-slate-600">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      <span>{r.competition || '—'}</span>
                                      {r.round === 'Prelims' && (
                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                                          Prelims (SF)
                                        </span>
                                      )}
                                      {r.round === 'Time Trial' && (
                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                                          Time Trial (TT)
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-2 px-3 font-mono text-slate-500">
                                    {r.date || '—'}
                                  </td>
                                  <td className="py-2 px-3">
                                    {r.swimType === 'RELAY_LEADOFF' ||
                                    r.place === 'R' ||
                                    r.place === 'LR' ? (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800">
                                        Relay Lead-Off (R)
                                      </span>
                                    ) : r.swimType === 'INTERMEDIATE_SPLIT' || r.place === 'S' ? (
                                      <span
                                        title={r.splitContext || 'Intermediate Distance Split'}
                                        className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900"
                                      >
                                        Split (S){r.splitContext ? ` • ${r.splitContext}` : ''}
                                      </span>
                                    ) : r.swimType === 'RELAY_WIN' ? (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                                        Relay Win{r.splitContext ? ` • ${r.splitContext}` : ''}
                                      </span>
                                    ) : (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                        Official
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-2 px-3 text-center">
                                    <div className="inline-flex items-center gap-1">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEditingDbRowId(r.id);
                                          setEditDbDraft({
                                            swimmerName: r.swimmerName || '',
                                            classYear: r.classYear || '',
                                            eventLabel: r.eventLabel || '',
                                            time: r.time || '',
                                            competition: r.competition || '',
                                            date: normalizeDateIso(r.date || ''),
                                          });
                                        }}
                                        className="px-2 py-1 rounded text-[11px] font-bold text-cyan-700 hover:bg-cyan-50 border border-cyan-200 cursor-pointer"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteDbRecords([r.id])}
                                        title="Delete this record"
                                        className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      <datalist id="master-roster-datalist">
                        {masterRoster
                          .slice()
                          .sort((a, b) => compareByLastName(a.canonicalName, b.canonicalName))
                          .map((ath) => (
                            <option key={ath.id} value={ath.canonicalName} />
                          ))}
                      </datalist>

                      {/* Pagination Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <span>
                            Showing{' '}
                            <strong>
                              {(safeDbPage - 1) * dbPageSize + 1}–
                              {Math.min(safeDbPage * dbPageSize, filteredSortedDbRecords.length)}
                            </strong>{' '}
                            of <strong>{filteredSortedDbRecords.length}</strong> records
                          </span>
                          <select
                            value={dbPageSize}
                            onChange={(e) => {
                              setDbPageSize(Number(e.target.value));
                              setDbPage(1);
                            }}
                            className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                          >
                            <option value={50}>50 / page</option>
                            <option value={100}>100 / page</option>
                            <option value={250}>250 / page</option>
                            <option value={500}>500 / page</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setDbPage(1)}
                            disabled={safeDbPage <= 1}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 font-semibold cursor-pointer"
                          >
                            First
                          </button>
                          <button
                            onClick={() => setDbPage((p) => Math.max(1, p - 1))}
                            disabled={safeDbPage <= 1}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 font-semibold cursor-pointer"
                          >
                            Prev
                          </button>
                          <span className="px-3 py-1.5 font-bold text-slate-800">
                            Page {safeDbPage} of {dbTotalPages}
                          </span>
                          <button
                            onClick={() => setDbPage((p) => Math.min(dbTotalPages, p + 1))}
                            disabled={safeDbPage >= dbTotalPages}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 font-semibold cursor-pointer"
                          >
                            Next
                          </button>
                          <button
                            onClick={() => setDbPage(dbTotalPages)}
                            disabled={safeDbPage >= dbTotalPages}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 font-semibold cursor-pointer"
                          >
                            Last
                          </button>
                        </div>
                      </div>
                    </>
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
                    {recordBookSubTab === 'top10'
                      ? 'Program All-Time Top-10 & Freshman Record Book'
                      : `All-Time Career Wins Leaderboard (${recordBookGender})`}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {recordBookSubTab === 'top10'
                      ? `Ranked exclusively from official individual swims, relay lead-offs (R), & intermediate splits (S) (${recordBookData.totalMatchedCount} official marks matched for this event).`
                      : 'Ranked by 1st-place Finals victories across Individual and Relay events (Prelims/SF excluded).'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* View Toggle: Event Top-10 vs All-Time Wins */}
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => setRecordBookSubTab('top10')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        recordBookSubTab === 'top10'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600'
                      }`}
                    >
                      Event Top-10
                    </button>
                    <button
                      onClick={() => setRecordBookSubTab('wins')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        recordBookSubTab === 'wins'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600'
                      }`}
                    >
                      All-Time Wins
                    </button>
                  </div>

                  {/* Gender Toggle */}
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

                  {recordBookSubTab === 'top10' ? (
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
                  ) : (
                    <>
                      <select
                        value={winsCompetitionFilter}
                        onChange={(e) => setWinsCompetitionFilter(e.target.value)}
                        className="px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 max-w-[240px]"
                      >
                        <option value="ALL">All Competitions (Career Total)</option>
                        {recurringCompetitionsList.map((compName) => (
                          <option key={compName} value={compName}>
                            {compName}
                          </option>
                        ))}
                      </select>
                      <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 border border-slate-200 text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={winsActiveOnly}
                          onChange={(e) => setWinsActiveOnly(e.target.checked)}
                          className="rounded text-cyan-600"
                        />
                        Active Roster Only
                      </label>
                    </>
                  )}
                </div>
              </div>

              {recordBookSubTab === 'top10' ? (
                <>
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
                        {formatDisplayDateMDY(recordBookData.freshmanRecord.date)}
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
                        <thead className="bg-slate-900 text-white font-bold uppercase text-[10px]">
                          <tr>
                            <th className="py-3 px-4 w-16">Rank</th>
                            <th className="py-3 px-4">Athlete</th>
                            <th className="py-3 px-4">Class</th>
                            <th className="py-3 px-4">Time</th>
                            <th className="py-3 px-4">Competition</th>
                            <th className="py-3 px-4">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {recordBookData.top10.map((row, idx) => (
                            <tr key={row.id} className={idx === 0 ? 'bg-amber-50/40' : 'hover:bg-slate-50'}>
                              <td className="py-3 px-4 font-black text-slate-900">#{idx + 1}</td>
                              <td className="py-3 px-4 font-bold text-slate-900">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => openSwimmerProfile(row.swimmerName, recordBookEventKey)}
                                    className="text-left hover:text-cyan-700 hover:underline cursor-pointer"
                                  >
                                    {row.swimmerName}
                                  </button>
                                  {(row.swimType === 'RELAY_LEADOFF' ||
                                    row.place === 'R' ||
                                    row.place === 'LR') && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-cyan-800">
                                      R
                                    </span>
                                  )}
                                  {(row.swimType === 'INTERMEDIATE_SPLIT' || row.place === 'S') && (
                                    <span
                                      title={row.splitContext || 'Intermediate Distance Split'}
                                      className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900"
                                    >
                                      S{row.splitContext ? ` (${row.splitContext})` : ''}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-slate-600">{row.classYear || '—'}</td>
                              <td className="py-3 px-4 font-mono font-extrabold text-cyan-800">
                                {row.time}
                              </td>
                              <td className="py-3 px-4 text-slate-600">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span>{row.competition || '—'}</span>
                                  {row.round === 'Prelims' && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                                      Prelims (SF)
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-slate-500">
                                {formatDisplayDateMDY(row.date)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Event-Specific Career Wins Leaders (Top 10 below the All-Time Top-10 Times) */}
                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-cyan-600" />
                          Most Career Wins — {toTitleEventLabel(recordBookEventKey)}
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          Top 10 swimmers with the most 1st-place Finals victories in this event.
                        </p>
                      </div>
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-50 border border-slate-200 text-slate-700 cursor-pointer self-start sm:self-auto">
                        <input
                          type="checkbox"
                          checked={eventWinsActiveOnly}
                          onChange={(e) => setEventWinsActiveOnly(e.target.checked)}
                          className="rounded text-cyan-600"
                        />
                        Active Roster Only
                      </label>
                    </div>

                    {recordBookData.eventWinLeaders.length === 0 ? (
                      <div className="text-center py-6 text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl">
                        No 1st-place Finals victories recorded for{' '}
                        {toTitleEventLabel(recordBookEventKey)}
                        {eventWinsActiveOnly ? ' among active swimmers' : ''} yet.
                      </div>
                    ) : (
                      <div className="overflow-x-auto border border-slate-200 rounded-xl">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                            <tr>
                              <th className="py-2.5 px-4 w-16">Rank</th>
                              <th className="py-2.5 px-4">Athlete</th>
                              <th className="py-2.5 px-4 text-center">Event Wins</th>
                              <th className="py-2.5 px-4">Best Winning Time</th>
                              <th className="py-2.5 px-4">Victories</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {recordBookData.eventWinLeaders.map((ath, idx) => (
                              <tr key={ath.swimmerKey} className="hover:bg-slate-50">
                                <td className="py-2.5 px-4 font-black text-slate-900">
                                  #{idx + 1}
                                </td>
                                <td className="py-2.5 px-4 font-bold text-slate-900">
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => openSwimmerProfile(ath.swimmerName, recordBookEventKey)}
                                      className="text-left hover:text-cyan-700 hover:underline cursor-pointer"
                                    >
                                      {ath.swimmerName}
                                    </button>
                                    {ath.isActive && (
                                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                        Active
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-2.5 px-4 text-center font-black text-cyan-800">
                                  {ath.wins}
                                </td>
                                <td className="py-2.5 px-4 font-mono font-bold text-slate-700">
                                  {ath.bestTime}
                                </td>
                                <td className="py-2.5 px-4 text-slate-500">
                                  {ath.meets.slice(0, 4).join(', ')}
                                  {ath.meets.length > 4 ? ` +${ath.meets.length - 4} more` : ''}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* ALL-TIME CAREER WINS LEADERBOARD */
                <div className="space-y-4">
                  {/* Summary Stat Strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                      <div className="text-[11px] font-bold uppercase text-slate-500">
                        Total Event Winners ({recordBookGender})
                      </div>
                      <div className="text-xl font-black text-slate-900 mt-0.5">
                        {allTimeWinsLeaderboard.length}
                      </div>
                    </div>
                    <div className="bg-cyan-50/70 border border-cyan-200 rounded-xl p-3.5">
                      <div className="text-[11px] font-bold uppercase text-cyan-800">
                        Total Individual Wins Recorded
                      </div>
                      <div className="text-xl font-black text-cyan-900 mt-0.5">
                        {allTimeWinsLeaderboard.reduce((acc, a) => acc + a.indWins, 0)}
                      </div>
                    </div>
                    <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5">
                      <div className="text-[11px] font-bold uppercase text-amber-800">
                        All-Time Wins Leader
                      </div>
                      <div className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5 truncate">
                        {allTimeWinsLeaderboard[0]
                          ? `${allTimeWinsLeaderboard[0].swimmerName} (${allTimeWinsLeaderboard[0].totalWins})`
                          : '—'}
                      </div>
                    </div>
                  </div>

                  {allTimeWinsLeaderboard.length === 0 ? (
                    <div className="text-center py-10 text-sm text-slate-500 border border-dashed border-slate-200 rounded-xl">
                      No 1st-place Finals victories recorded for {recordBookGender} yet.
                    </div>
                  ) : (
                    <div className="overflow-x-auto border border-slate-200 rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-900 text-white font-bold uppercase text-[10px]">
                          <tr>
                            <th className="py-3 px-4 w-16">Rank</th>
                            <th className="py-3 px-4">Athlete</th>
                            <th className="py-3 px-4 text-center">Total Wins</th>
                            <th className="py-3 px-4 text-center">Individual</th>
                            <th className="py-3 px-4 text-center">Relay</th>
                            <th className="py-3 px-4 text-right">Win Log</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {allTimeWinsLeaderboard.map((ath, idx) => {
                            const isOpen = expandedWinAthlete === ath.swimmerKey;
                            return (
                              <React.Fragment key={ath.swimmerKey}>
                                <tr
                                  className={
                                    idx === 0 ? 'bg-amber-50/40' : 'hover:bg-slate-50'
                                  }
                                >
                                  <td className="py-3 px-4 font-black text-slate-900">
                                    #{idx + 1}
                                  </td>
                                  <td className="py-3 px-4 font-bold text-slate-900">
                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => openSwimmerProfile(ath.swimmerName)}
                                        className="text-left hover:text-cyan-700 hover:underline cursor-pointer"
                                      >
                                        {ath.swimmerName}
                                      </button>
                                      {ath.isActive && (
                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                          Active
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-center font-black text-sm text-cyan-800">
                                    {ath.totalWins}
                                  </td>
                                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">
                                    {ath.indWins}
                                  </td>
                                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">
                                    {ath.relWins}
                                  </td>
                                  <td className="py-3 px-4 text-right">
                                    <button
                                      onClick={() =>
                                        setExpandedWinAthlete(isOpen ? null : ath.swimmerKey)
                                      }
                                      className="inline-flex items-center gap-1 text-xs font-bold text-cyan-700 hover:underline cursor-pointer"
                                    >
                                      {isOpen ? 'Hide' : 'View'} ({ath.winLog.length})
                                      {isOpen ? (
                                        <ChevronUp className="w-3.5 h-3.5" />
                                      ) : (
                                        <ChevronDown className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                  </td>
                                </tr>
                                {isOpen && (
                                  <tr className="bg-slate-50">
                                    <td colSpan={6} className="px-4 py-3">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {ath.winLog.map((w) => (
                                          <div
                                            key={w.id}
                                            className="bg-white border border-slate-200 rounded-lg px-3 py-2 flex items-center justify-between gap-2 text-[11px]"
                                          >
                                            <div>
                                              <div className="font-bold text-slate-900">
                                                {w.eventLabel}
                                                {w.splitContext ? ` (${w.splitContext})` : ''}
                                              </div>
                                              <div className="text-slate-500">
                                                {w.competition || 'Meet'} •{' '}
                                                {formatDisplayDateMDY(w.date)}
                                              </div>
                                            </div>
                                            <span className="font-mono font-extrabold text-cyan-800 shrink-0">
                                              {w.time}
                                            </span>
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
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* SECTION 3: IN-MEET BROADCASTER & DECK TOOLS                          */}
        {/* ==================================================================== */}
        {activeSection === 'inmeet' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 sm:px-6 py-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    In-Meet Deck &amp; Broadcaster Console
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Heat lane sheets (Lanes 1–8) with team color bars, active roster bests, and
                    qualifying standards / pool records.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 bg-slate-800 p-1 rounded-xl text-xs font-bold">
                  {[
                    { id: 'heatsheet', label: 'Heat Sheet (Lanes 1–8)' },
                    { id: 'scoresim', label: 'Score Simulator' },
                    { id: 'scout', label: `Opponent Scout (${opponentScouts.length})` },
                    { id: 'roster', label: `Active Roster (${masterRoster.filter((a) => a.isActive).length})` },
                    { id: 'relayopt', label: 'Relay Optimizer' },
                    { id: 'standards', label: `Standards & Pool Recs (${qualStandards.length})` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setInMeetSubTab(tab.id)}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                        inMeetSubTab === tab.id
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* SUB-TAB 1: HEAT SHEET (LANES 1-8) + TEAM HEX COLOR SETUP */}
              {inMeetSubTab === 'heatsheet' && (
                <div className="p-5 sm:p-6 space-y-5">
                  {!parsedData ? (
                    <div className="text-center py-10 space-y-3 border border-dashed border-slate-200 rounded-xl">
                      <p className="text-sm text-slate-600">
                        Import a `.cl2` meet or pre-meet/psych file in{' '}
                        <strong>Section 4 (Import Meet Results)</strong> or load the sample meet to
                        view lane-by-lane heat sheets.
                      </p>
                      <button
                        type="button"
                        onClick={() => handleProcessMeetText(SAMPLE_CL2_DATA)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
                      >
                        Load Sample Meet
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Team Hex Color Bar (Pre-Meet / Multi-Team Setup) */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                            Team Color Coding (Lane End-Bars)
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Pick a color or enter a hex code per team
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {parsedData.teams.map((t) => {
                            const hex = getTeamHexColor(t.code, t.name);
                            return (
                              <div
                                key={t.code}
                                className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs"
                              >
                                <input
                                  type="color"
                                  value={hex.startsWith('#') && hex.length === 7 ? hex : '#0284c7'}
                                  onChange={(e) => handleSetTeamHexColor(t.code, e.target.value)}
                                  className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent p-0"
                                />
                                <span className="font-bold text-slate-800">{t.name}</span>
                                <input
                                  type="text"
                                  value={hex}
                                  onChange={(e) => handleSetTeamHexColor(t.code, e.target.value)}
                                  maxLength={7}
                                  className="w-16 font-mono text-[11px] px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {(() => {
                        const eventOptionMap = new Map();
                        parsedData.individualResults.forEach((r) => {
                          if (!eventOptionMap.has(r.eventLabel)) {
                            eventOptionMap.set(r.eventLabel, {
                              label: r.eventLabel,
                              num: r.eventNumber,
                              isRelay: false,
                            });
                          }
                        });
                        parsedData.relayResults.forEach((r) => {
                          if (!eventOptionMap.has(r.eventLabel)) {
                            eventOptionMap.set(r.eventLabel, {
                              label: r.eventLabel,
                              num: r.eventNumber,
                              isRelay: true,
                            });
                          }
                        });
                        const eventOptions = Array.from(eventOptionMap.values()).sort(
                          (a, b) => a.num - b.num
                        );
                        const activeEventObj =
                          eventOptions.find((e) => e.label === selectedHeatEventLabel) ||
                          eventOptions[0] ||
                          null;
                        const activeEventLabel = activeEventObj?.label || '';
                        const isRelayEvent = Boolean(activeEventObj?.isRelay);

                        const eventSwims = isRelayEvent
                          ? parsedData.relayResults.filter((r) => r.eventLabel === activeEventLabel)
                          : parsedData.individualResults.filter(
                              (r) => r.eventLabel === activeEventLabel
                            );
                        const availableHeats = Array.from(
                          new Set(eventSwims.map((r) => r.heat).filter(Boolean))
                        ).sort((a, b) => Number(a) - Number(b));

                        const effectiveHeat =
                          selectedHeatNum !== 'ALL' && availableHeats.includes(selectedHeatNum)
                            ? selectedHeatNum
                            : availableHeats[0] || 'ALL';

                        const heatSwims =
                          effectiveHeat === 'ALL'
                            ? eventSwims
                            : eventSwims.filter((r) => String(r.heat) === String(effectiveHeat));

                        const laneMap = new Map();
                        heatSwims.forEach((r) => {
                          const ln = parseInt(r.lane, 10);
                          if (ln >= 1 && ln <= 8 && !laneMap.has(ln)) {
                            laneMap.set(ln, r);
                          }
                        });

                        // Pre-compute All-Time Top 10 for the active event + Reference Benchmarks
                        const activeEvKey = normalizeEventKey(activeEventLabel);
                        const officialEvPool = historicalRecords.filter(
                          (r) => r.isOfficial !== false && r.eventKey === activeEvKey
                        );
                        const allTimeRankBySwimmer = new Map();
                        const bestBySw = new Map();
                        officialEvPool.forEach((r) => {
                          if (
                            !bestBySw.has(r.swimmerKey) ||
                            r.seconds < bestBySw.get(r.swimmerKey).seconds
                          ) {
                            bestBySw.set(r.swimmerKey, r);
                          }
                        });
                        Array.from(bestBySw.entries())
                          .sort((a, b) => a[1].seconds - b[1].seconds)
                          .forEach(([k], idx) => {
                            if (idx < 10) allTimeRankBySwimmer.set(k, idx + 1);
                          });

                        const sortedEvBests = Array.from(bestBySw.values()).sort(
                          (a, b) => a.seconds - b.seconds
                        );
                        const schoolRecordMark = sortedEvBests[0] || null;
                        const tenthMark = sortedEvBests[9] || null;
                        const freshmanRecordMark = isRelayEvent
                          ? null
                          : officialEvPool
                              .filter((r) => normalizeClass(r.classYear) === 'FR')
                              .sort((a, b) => a.seconds - b.seconds)[0] || null;
                        const matchingStandards = qualStandards.filter(
                          (s) => s.eventKey === activeEvKey
                        );

                        return (
                          <div className="space-y-4">
                            {/* Event & Heat Selector + Broadcast Graphics Export */}
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                              <div className="flex flex-wrap items-center gap-3">
                                <select
                                  value={activeEventLabel}
                                  onChange={(e) => {
                                    setSelectedHeatEventLabel(e.target.value);
                                    setSelectedHeatNum('ALL');
                                  }}
                                  className="px-3 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                  {eventOptions.map((ev) => (
                                    <option key={ev.label} value={ev.label}>
                                      #{ev.num} — {ev.label}
                                    </option>
                                  ))}
                                </select>

                                {availableHeats.length > 0 && (
                                  <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl">
                                    {availableHeats.map((h) => (
                                      <button
                                        key={h}
                                        type="button"
                                        onClick={() => setSelectedHeatNum(h)}
                                        className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                                          String(effectiveHeat) === String(h)
                                            ? 'bg-white text-indigo-700 shadow-xs'
                                            : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                      >
                                        Heat {h}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Broadcast 1920x1080 PNG Graphics Export Controls */}
                              <div className="flex flex-wrap items-center gap-2 bg-slate-900 text-white px-3 py-2 rounded-xl">
                                <div className="flex bg-slate-800 p-0.5 rounded-lg text-[11px] font-bold">
                                  <button
                                    type="button"
                                    onClick={() => setBroadcastGraphicTheme('slate')}
                                    className={`px-2 py-1 rounded-md transition cursor-pointer ${
                                      broadcastGraphicTheme === 'slate'
                                        ? 'bg-cyan-600 text-white'
                                        : 'text-slate-300 hover:text-white'
                                    }`}
                                  >
                                    Full Slate
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setBroadcastGraphicTheme('transparent')}
                                    className={`px-2 py-1 rounded-md transition cursor-pointer ${
                                      broadcastGraphicTheme === 'transparent'
                                        ? 'bg-cyan-600 text-white'
                                        : 'text-slate-300 hover:text-white'
                                    }`}
                                  >
                                    Transparent Key
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  disabled={!activeEventObj}
                                  onClick={() => {
                                    if (!activeEventObj) return;
                                    const hVal = effectiveHeat === 'ALL' ? '1' : effectiveHeat;
                                    const safeEv = activeEventObj.label
                                      .replace(/[^a-z0-9]+/gi, '_')
                                      .replace(/^_|_$/g, '');
                                    const evPad = String(activeEventObj.num).padStart(2, '0');
                                    const dataUrl = renderBroadcastHeatGraphicPng(
                                      activeEventObj,
                                      hVal,
                                      laneMap,
                                      broadcastGraphicTheme,
                                      selectedPngHeaderMarks
                                    );
                                    triggerPngDownload(
                                      dataUrl,
                                      `Ev${evPad}_${safeEv}_Heat${hVal}.png`
                                    );
                                  }}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition cursor-pointer"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  <span>Export Heat PNG</span>
                                </button>

                                <button
                                  type="button"
                                  disabled={isExportingAllGraphics}
                                  onClick={handleExportAllMeetGraphics}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white transition cursor-pointer"
                                >
                                  <Layers className="w-3.5 h-3.5" />
                                  <span>
                                    {isExportingAllGraphics
                                      ? 'Exporting...'
                                      : 'Export All Heats (1080p)'}
                                  </span>
                                </button>
                              </div>
                            </div>

                            {/* Broadcast PNG Header Standards & Records Checkboxes */}
                            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600">
                                PNG Header Callouts:
                              </span>
                              {[
                                {
                                  key: 'PROGRAM_RECORD',
                                  label: schoolRecordMark
                                    ? `Program Record (${schoolRecordMark.time})`
                                    : 'Program Record',
                                  disabled: !schoolRecordMark,
                                },
                                ...(!isRelayEvent
                                  ? [
                                      {
                                        key: 'FRESHMAN_RECORD',
                                        label: freshmanRecordMark
                                          ? `Freshman Record (${freshmanRecordMark.time})`
                                          : 'Freshman Record',
                                        disabled: !freshmanRecordMark,
                                      },
                                    ]
                                  : []),
                                ...matchingStandards.map((std) => ({
                                  key: `STD_${std.id}`,
                                  label: `${std.label} (${std.time}${
                                    std.holder ? ` — ${std.holder}` : ''
                                  })`,
                                  disabled: false,
                                })),
                              ].map((chk) => {
                                const checked = selectedPngHeaderMarks.has(chk.key);
                                return (
                                  <label
                                    key={chk.key}
                                    className={`inline-flex items-center gap-1.5 font-semibold select-none ${
                                      chk.disabled
                                        ? 'text-slate-400 cursor-not-allowed'
                                        : 'text-slate-800 cursor-pointer'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      disabled={chk.disabled}
                                      checked={!chk.disabled && checked}
                                      onChange={(e) => {
                                        const isChecked = e.target.checked;
                                        setSelectedPngHeaderMarks((prev) => {
                                          const next = new Set(prev);
                                          if (isChecked) next.add(chk.key);
                                          else next.delete(chk.key);
                                          return next;
                                        });
                                      }}
                                      className="rounded text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span>{chk.label}</span>
                                  </label>
                                );
                              })}
                            </div>

                            {/* Event Benchmarks & Defined Standards/Records Strip */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
                                <div className="text-[10px] font-bold uppercase text-amber-800">
                                  #1 Program Record
                                </div>
                                <div className="font-extrabold text-slate-900 mt-0.5 truncate">
                                  {schoolRecordMark ? (
                                    <>
                                      <span className="font-mono text-amber-900">
                                        {schoolRecordMark.time}
                                      </span>{' '}
                                      — {schoolRecordMark.swimmerName}
                                    </>
                                  ) : (
                                    <span className="text-slate-500 font-normal">No mark in DB</span>
                                  )}
                                </div>
                              </div>

                              <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs">
                                <div className="text-[10px] font-bold uppercase text-indigo-800">
                                  #10 All-Time Cut
                                </div>
                                <div className="font-extrabold text-slate-900 mt-0.5 truncate">
                                  {tenthMark ? (
                                    <>
                                      <span className="font-mono text-indigo-900">
                                        {tenthMark.time}
                                      </span>{' '}
                                      — {tenthMark.swimmerName}
                                    </>
                                  ) : (
                                    <span className="text-slate-500 font-normal">
                                      {sortedEvBests.length > 0
                                        ? `Open spot (${sortedEvBests.length}/10 swimmers)`
                                        : 'No marks in DB'}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="p-3 rounded-xl bg-cyan-50/70 border border-cyan-200 text-xs">
                                <div className="text-[10px] font-bold uppercase text-cyan-800">
                                  {isRelayEvent ? 'Relay Format' : 'Freshman (FR) Record'}
                                </div>
                                <div className="font-extrabold text-slate-900 mt-0.5 truncate">
                                  {isRelayEvent ? (
                                    <span className="text-cyan-900">4-Leg Relay Event</span>
                                  ) : freshmanRecordMark ? (
                                    <>
                                      <span className="font-mono text-cyan-900">
                                        {freshmanRecordMark.time}
                                      </span>{' '}
                                      — {freshmanRecordMark.swimmerName}
                                    </>
                                  ) : (
                                    <span className="text-slate-500 font-normal">No FR mark</span>
                                  )}
                                </div>
                              </div>

                              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                                <div className="text-[10px] font-bold uppercase text-slate-600">
                                  Standards &amp; Pool Records
                                </div>
                                {matchingStandards.length === 0 ? (
                                  <div className="text-slate-500 mt-0.5">None defined for event</div>
                                ) : (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {matchingStandards.map((std) => (
                                      <span
                                        key={std.id}
                                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStandardBadgeStyle(
                                          std.label
                                        )}`}
                                      >
                                        {std.label}: <span className="font-mono">{std.time}</span>
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Lanes 1-8 Table */}
                            <div className="overflow-x-auto border border-slate-200 rounded-xl">
                              <table className="w-full text-left text-xs">
                                <thead className="bg-slate-900 text-white font-bold uppercase text-[10px]">
                                  <tr>
                                    <th className="py-2.5 px-3 w-16 text-center">Lane</th>
                                    <th className="py-2.5 px-3">
                                      {isRelayEvent ? 'Relay Squad / Lineup' : 'Swimmer / Team'}
                                    </th>
                                    <th className="py-2.5 px-3">Seed / PB / SB</th>
                                    <th className="py-2.5 px-3 text-center">Wins</th>
                                    <th className="py-2.5 px-3">Last Swim</th>
                                    <th className="py-2.5 px-3">Trajectory &amp; Form</th>
                                    <th className="py-2.5 px-3">All-Time &amp; Milestones</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {[1, 2, 3, 4, 5, 6, 7, 8].map((laneNum) => {
                                    const entry = laneMap.get(laneNum);
                                    if (!entry) {
                                      return (
                                        <tr key={laneNum} className="bg-slate-50/50 text-slate-400">
                                          <td className="py-3 px-3 text-center font-mono text-base font-black">
                                            {laneNum}
                                          </td>
                                          <td colSpan={6} className="py-3 px-3 italic">
                                            Open / Empty Lane
                                          </td>
                                        </tr>
                                      );
                                    }

                                    const teamHex = getTeamHexColor(
                                      entry.teamCode,
                                      entry.teamName
                                    );
                                    const isGettysburgEntry =
                                      String(entry.teamName || '')
                                        .toLowerCase()
                                        .includes('gettysburg') ||
                                      String(entry.teamCode || '')
                                        .toLowerCase()
                                        .includes('gett');

                                    const resolvedLegs = isRelayEvent
                                      ? (entry.legs || []).map((l) => {
                                          const disp = formatSwimmerDisplay(
                                            l.swimmerName,
                                            l.preferredFirst
                                          );
                                          const m = resolveMasterAthlete(disp);
                                          return {
                                            legOrder: l.legOrder,
                                            name: m ? m.canonicalName : disp,
                                            classYear: l.classYear,
                                          };
                                        })
                                      : [];

                                    const displaySw = isRelayEvent
                                      ? entry.relayTitle ||
                                        `${entry.teamName} "${entry.relayLetter || 'A'}"`
                                      : formatSwimmerDisplay(
                                          entry.swimmerName,
                                          entry.preferredFirst
                                        );
                                    const resolvedAth = !isRelayEvent
                                      ? resolveMasterAthlete(displaySw)
                                      : null;
                                    const canonicalName = resolvedAth
                                      ? resolvedAth.canonicalName
                                      : displaySw;
                                    const swKey = isRelayEvent
                                      ? normalizeSwimmerKey(
                                          resolvedLegs.map((l) => l.name).join(', ')
                                        )
                                      : normalizeSwimmerKey(canonicalName);
                                    const evKey = normalizeEventKey(entry.eventLabel);

                                    const swEventHistory = isRelayEvent
                                      ? isGettysburgEntry
                                        ? historicalRecords
                                            .filter(
                                              (r) =>
                                                r.isOfficial !== false &&
                                                r.eventKey === evKey &&
                                                r.swimType === 'RELAY_TEAM'
                                            )
                                            .sort((a, b) =>
                                              (b.date || '').localeCompare(a.date || '')
                                            )
                                        : []
                                      : historicalRecords
                                          .filter(
                                            (r) =>
                                              r.isOfficial !== false &&
                                              r.swimmerKey === swKey &&
                                              r.eventKey === evKey &&
                                              r.swimType !== 'INTERMEDIATE_SPLIT' &&
                                              String(r.place || '').toUpperCase() !== 'S'
                                          )
                                          .sort((a, b) =>
                                            (b.date || '').localeCompare(a.date || '')
                                          );

                                    const pbRec =
                                      swEventHistory.length > 0
                                        ? swEventHistory.reduce((best, cur) =>
                                            cur.seconds < best.seconds ? cur : best
                                          )
                                        : null;

                                    const seasonStart = getCurrentSeasonStart();
                                    const sbSwims = swEventHistory.filter(
                                      (r) => r.dateObj && r.dateObj >= seasonStart
                                    );
                                    const sbRec =
                                      sbSwims.length > 0
                                        ? sbSwims.reduce((best, cur) =>
                                            cur.seconds < best.seconds ? cur : best
                                          )
                                        : null;

                                    const eventWinsCount = isRelayEvent
                                      ? isGettysburgEntry
                                        ? historicalRecords.filter(
                                            (r) =>
                                              r.eventKey === evKey &&
                                              r.swimType === 'RELAY_TEAM' &&
                                              String(r.place || '').trim() === '1' &&
                                              String(r.round || 'Finals').toLowerCase() !==
                                                'prelims' &&
                                              String(r.round || 'Finals').toLowerCase() !==
                                                'time trial'
                                          ).length
                                        : 0
                                      : historicalRecords.filter(
                                          (r) =>
                                            r.eventKey === evKey &&
                                            normalizeSwimmerKey(
                                              resolveMasterAthlete(r.swimmerName)?.canonicalName ||
                                                r.swimmerName
                                            ) === swKey &&
                                            String(r.place || '').trim() === '1' &&
                                            String(r.round || 'Finals').toLowerCase() !==
                                              'prelims' &&
                                            String(r.round || 'Finals').toLowerCase() !==
                                              'time trial'
                                        ).length;

                                    const lastSwim = swEventHistory[0] || null;
                                    const seedSec = timeToSeconds(entry.seedTime);
                                    const finalsSec = timeToSeconds(entry.finalsTime);

                                    // 1. Trajectory & Form Signals
                                    const trajectoryNotes = [];
                                    if (seedSec !== null && pbRec) {
                                      const vsPb = seedSec - pbRec.seconds;
                                      if (Math.abs(vsPb) <= 0.02) {
                                        trajectoryNotes.push({
                                          text: 'Seeded at PB',
                                          tone: 'text-indigo-700 font-bold',
                                        });
                                      } else if (vsPb < -0.02) {
                                        trajectoryNotes.push({
                                          text: `Seeded ${Math.abs(vsPb).toFixed(2)}s faster than PB`,
                                          tone: 'text-emerald-700 font-bold',
                                        });
                                      } else {
                                        trajectoryNotes.push({
                                          text: `Seeded +${vsPb.toFixed(2)}s off PB`,
                                          tone: 'text-slate-600',
                                        });
                                      }
                                    } else if (seedSec !== null && sbRec) {
                                      const vsSb = seedSec - sbRec.seconds;
                                      trajectoryNotes.push({
                                        text:
                                          Math.abs(vsSb) <= 0.02
                                            ? 'Seeded at SB'
                                            : `Seeded ${vsSb > 0 ? '+' : ''}${vsSb.toFixed(2)}s vs SB`,
                                        tone: 'text-slate-600',
                                      });
                                    }

                                    if (swEventHistory.length >= 3) {
                                      const [s0, s1, s2] = swEventHistory;
                                      if (s0.seconds < s1.seconds && s1.seconds < s2.seconds) {
                                        const drop3 = s2.seconds - s0.seconds;
                                        trajectoryNotes.push({
                                          text: `Dropping (-${drop3.toFixed(2)}s over last 3)`,
                                          tone: 'text-emerald-700 font-bold',
                                        });
                                      }
                                    }
                                    if (
                                      lastSwim &&
                                      pbRec &&
                                      lastSwim.id === pbRec.id &&
                                      swEventHistory.length > 1
                                    ) {
                                      trajectoryNotes.push({
                                        text: 'Career-best form (PB last swim)',
                                        tone: 'text-emerald-700 font-semibold',
                                      });
                                    } else if (
                                      lastSwim &&
                                      sbRec &&
                                      lastSwim.id === sbRec.id &&
                                      sbSwims.length > 1
                                    ) {
                                      trajectoryNotes.push({
                                        text: 'Season-best form (SB last swim)',
                                        tone: 'text-cyan-700 font-semibold',
                                      });
                                    }

                                    if (finalsSec !== null && lastSwim) {
                                      const diff = finalsSec - lastSwim.seconds;
                                      trajectoryNotes.push({
                                        text:
                                          Math.abs(diff) <= 0.005
                                            ? 'Finals matched last mark'
                                            : `Finals ${diff < 0 ? '' : '+'}${diff.toFixed(2)}s vs last`,
                                        tone:
                                          diff < -0.005
                                            ? 'text-emerald-700 font-bold'
                                            : 'text-slate-500',
                                      });
                                    }

                                    // 2. All-Time Gap, Barrier Watch, Last Meet Momentum, & Cut Proximity
                                    const rankNum = isRelayEvent
                                      ? isGettysburgEntry
                                        ? allTimeRankBySwimmer.get(swKey)
                                        : undefined
                                      : allTimeRankBySwimmer.get(swKey);

                                    const milestoneBullets = [];
                                    const refSec =
                                      pbRec?.seconds ?? (seedSec !== null ? seedSec : null);

                                    if (rankNum && rankNum > 1 && sortedEvBests[rankNum - 2]) {
                                      const aheadRec = sortedEvBests[rankNum - 2];
                                      if (refSec !== null && refSec >= aheadRec.seconds) {
                                        const gap = refSec - aheadRec.seconds;
                                        milestoneBullets.push(
                                          `#${rankNum} All-Time (${gap.toFixed(2)}s shy of #${
                                            rankNum - 1
                                          })`
                                        );
                                      }
                                    } else if (
                                      !rankNum &&
                                      isGettysburgEntry &&
                                      tenthMark &&
                                      refSec !== null &&
                                      refSec > tenthMark.seconds &&
                                      refSec - tenthMark.seconds <= Math.max(2.5, tenthMark.seconds * 0.03)
                                    ) {
                                      milestoneBullets.push(
                                        `${(refSec - tenthMark.seconds).toFixed(2)}s outside Top-10 (#10: ${tenthMark.time})`
                                      );
                                    }

                                    if (pbRec && pbRec.seconds > 15) {
                                      const pbS = pbRec.seconds;
                                      let barrierTarget = null;
                                      if (pbS >= 60) {
                                        const wholeMin = Math.floor(pbS / 60) * 60;
                                        const tenSecStep = Math.floor(pbS / 10) * 10;
                                        const cand =
                                          pbS - wholeMin <= 2.5 ? wholeMin : tenSecStep;
                                        if (pbS > cand && pbS - cand <= 2.0) {
                                          barrierTarget = cand;
                                        }
                                      } else {
                                        const wholeSec = Math.floor(pbS);
                                        if (pbS > wholeSec && pbS - wholeSec <= 0.75) {
                                          barrierTarget = wholeSec;
                                        }
                                      }
                                      if (barrierTarget !== null) {
                                        milestoneBullets.push(
                                          `Chasing sub-${secondsToTime(barrierTarget)} (-${(
                                            pbS - barrierTarget
                                          ).toFixed(2)}s)`
                                        );
                                      }
                                    }

                                    if (!isRelayEvent && isGettysburgEntry) {
                                      const athAllRows = historicalRecords.filter(
                                        (r) =>
                                          normalizeSwimmerKey(
                                            resolveMasterAthlete(r.swimmerName)?.canonicalName ||
                                              r.swimmerName
                                          ) === swKey && r.date
                                      );
                                      if (athAllRows.length > 0) {
                                        const latestDate = athAllRows.reduce(
                                          (maxD, r) => (r.date > maxD ? r.date : maxD),
                                          ''
                                        );
                                        const winsLastMeet = athAllRows.filter(
                                          (r) =>
                                            r.date === latestDate &&
                                            String(r.place || '').trim() === '1' &&
                                            String(r.round || 'Finals').toLowerCase() !==
                                              'prelims' &&
                                            String(r.round || 'Finals').toLowerCase() !==
                                              'time trial'
                                        ).length;
                                        if (winsLastMeet >= 2) {
                                          milestoneBullets.push(
                                            `Won ${winsLastMeet} events last meet (${formatDisplayDateMDY(
                                              latestDate
                                            )})`
                                          );
                                        } else if (
                                          lastSwim &&
                                          String(lastSwim.place || '').trim() === '1'
                                        ) {
                                          milestoneBullets.push('Won this event last time out');
                                        }
                                      }
                                    }

                                    const hitStandards = evaluateStandardsForSwim(
                                      entry.eventLabel,
                                      entry.finalsTime
                                    );
                                    const seasonHitStandards = sbRec
                                      ? evaluateStandardsForSwim(entry.eventLabel, sbRec.time)
                                      : [];
                                    const combinedStandardsMap = new Map();
                                    [...hitStandards, ...seasonHitStandards].forEach((std) => {
                                      combinedStandardsMap.set(std.id, std);
                                    });
                                    const displayStandards = Array.from(
                                      combinedStandardsMap.values()
                                    );
                                    const achievedStdIds = new Set(
                                      displayStandards.map((s) => s.id)
                                    );

                                    if (refSec !== null) {
                                      matchingStandards.forEach((std) => {
                                        if (achievedStdIds.has(std.id)) return;
                                        const stdSec = timeToSeconds(std.time);
                                        if (
                                          stdSec !== null &&
                                          refSec > stdSec &&
                                          refSec - stdSec <= Math.max(1.5, stdSec * 0.025)
                                        ) {
                                          milestoneBullets.push(
                                            `${(refSec - stdSec).toFixed(2)}s from ${std.label} (${std.time})`
                                          );
                                        }
                                      });
                                    }

                                    return (
                                      <tr
                                        key={laneNum}
                                        className="hover:bg-slate-50/80 transition align-top"
                                      >
                                        <td
                                          style={{ backgroundColor: teamHex }}
                                          className="py-3 px-3 text-center font-mono text-xl sm:text-2xl font-black text-white select-none align-middle"
                                        >
                                          {laneNum}
                                        </td>
                                        <td className="py-3 px-3">
                                          <div className="font-bold text-slate-900">
                                            {isRelayEvent ? (
                                              canonicalName
                                            ) : (
                                              <button
                                                type="button"
                                                onClick={() => openSwimmerProfile(canonicalName, evKey)}
                                                className="text-left hover:text-indigo-700 hover:underline cursor-pointer"
                                              >
                                                {canonicalName}
                                              </button>
                                            )}
                                            {!isRelayEvent && entry.classYear
                                              ? ` (${entry.classYear})`
                                              : ''}
                                          </div>
                                          {isRelayEvent && resolvedLegs.length > 0 && (
                                            <div className="text-[11px] text-slate-700 mt-0.5 flex flex-wrap gap-x-1">
                                              {resolvedLegs.map((l, lIdx) => (
                                                <span key={l.legOrder}>
                                                  {l.legOrder}){' '}
                                                  <button
                                                    type="button"
                                                    onClick={() => openSwimmerProfile(l.name)}
                                                    className="hover:text-indigo-700 hover:underline font-medium cursor-pointer"
                                                  >
                                                    {l.name}
                                                  </button>
                                                  {l.classYear ? ` (${l.classYear})` : ''}
                                                  {lIdx < resolvedLegs.length - 1 ? ' •' : ''}
                                                </span>
                                              ))}
                                            </div>
                                          )}
                                          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                                            <span
                                              className="w-2 h-2 rounded-full inline-block"
                                              style={{ backgroundColor: teamHex }}
                                            />
                                            <span>{entry.teamName}</span>
                                            {entry.finalsTime && entry.finalsTime !== 'NT' && (
                                              <span className="font-mono font-bold text-slate-800 ml-1">
                                                • Final: {entry.finalsTime}
                                              </span>
                                            )}
                                          </div>
                                        </td>
                                        <td className="py-3 px-3 font-mono text-[11px] space-y-0.5">
                                          <div>
                                            Seed:{' '}
                                            <strong className="text-indigo-900">
                                              {entry.seedTime || 'NT'}
                                            </strong>
                                          </div>
                                          <div>
                                            PB:{' '}
                                            <strong className="text-slate-900">
                                              {pbRec ? pbRec.time : '—'}
                                            </strong>
                                          </div>
                                          <div className="text-slate-500">
                                            SB: {sbRec ? sbRec.time : '—'}
                                          </div>
                                        </td>
                                        <td className="py-3 px-3 text-center font-mono font-bold text-cyan-800">
                                          {eventWinsCount}
                                        </td>
                                        <td className="py-3 px-3 text-[11px]">
                                          {lastSwim ? (
                                            <div>
                                              <div>
                                                <span className="font-mono font-bold text-slate-800">
                                                  {lastSwim.time}
                                                </span>
                                                <span className="text-slate-500 ml-1">
                                                  ({formatDisplayDateMDY(lastSwim.date)})
                                                </span>
                                              </div>
                                              {lastSwim.competition && (
                                                <div className="text-[10px] text-slate-400 truncate max-w-[160px]">
                                                  {lastSwim.competition}
                                                </div>
                                              )}
                                            </div>
                                          ) : (
                                            <span className="text-slate-400">—</span>
                                          )}
                                        </td>
                                        <td className="py-3 px-3 text-[11px]">
                                          {trajectoryNotes.length > 0 ? (
                                            <div className="space-y-0.5">
                                              {trajectoryNotes.slice(0, 2).map((note, idx) => (
                                                <div key={idx} className={note.tone}>
                                                  {note.text}
                                                </div>
                                              ))}
                                            </div>
                                          ) : (
                                            <span className="text-slate-400">—</span>
                                          )}
                                        </td>
                                        <td className="py-3 px-3">
                                          <div className="flex flex-wrap gap-1">
                                            {rankNum && (
                                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                                                {rankNum === 1 ? '#1 Rec' : `#${rankNum} All-Time`}
                                              </span>
                                            )}
                                            {displayStandards.map((std) => (
                                              <span
                                                key={std.id}
                                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${getStandardBadgeStyle(
                                                  std.label
                                                )}`}
                                              >
                                                {std.label}
                                              </span>
                                            ))}
                                          </div>
                                          {milestoneBullets.length > 0 && (
                                            <ul className="mt-1 space-y-0.5 text-[11px] text-slate-700">
                                              {milestoneBullets.slice(0, 3).map((b, bIdx) => (
                                                <li key={bIdx} className="leading-snug">
                                                  • {b}
                                                </li>
                                              ))}
                                            </ul>
                                          )}
                                          {!rankNum &&
                                            displayStandards.length === 0 &&
                                            milestoneBullets.length === 0 && (
                                              <span className="text-slate-400 text-[11px]">—</span>
                                            )}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      })()}
                    </>
                  )}
                </div>
              )}

              {/* SUB-TAB 1B: DUAL-MEET VIRTUAL SCORE SIMULATOR */}
              {inMeetSubTab === 'scoresim' && (() => {
                if (!parsedData) {
                  return (
                    <div className="p-5 sm:p-6">
                      <div className="text-center py-10 space-y-3 border border-dashed border-slate-200 rounded-xl">
                        <p className="text-sm text-slate-600">
                          Load a pre-meet psych sheet or meet results `.cl2` file in{' '}
                          <strong>Section 4 (Import Meet Results)</strong> to simulate dual-meet
                          team scores and test &quot;What-If&quot; place flips.
                        </p>
                        <button
                          type="button"
                          onClick={() => handleProcessMeetText(SAMPLE_CL2_DATA)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
                        >
                          Load Sample Meet
                        </button>
                      </div>
                    </div>
                  );
                }

                const scoringConfig =
                  simScoringFormat === 'DUAL_6'
                    ? {
                        label: '6-Lane Dual (6-4-3-2-1 Ind / 8-4-2 Relay)',
                        indPts: [6, 4, 3, 2, 1],
                        relPts: [8, 4, 2],
                        maxIndPerTeam: 3,
                        maxRelPerTeam: 2,
                      }
                    : {
                        label: 'Standard Dual (9-4-3-2-1 Ind / 11-4-2 Relay)',
                        indPts: [9, 4, 3, 2, 1],
                        relPts: [11, 4, 2],
                        maxIndPerTeam: 3,
                        maxRelPerTeam: 2,
                      };

                const getEntryMetric = (item) => {
                  const sSec = Number.isFinite(item.seedSeconds)
                    ? item.seedSeconds
                    : timeToSeconds(item.seedTime);
                  const fSec = Number.isFinite(item.timeSeconds)
                    ? item.timeSeconds
                    : timeToSeconds(item.finalsTime);

                  if (simTimeBasis === 'SEED') {
                    return {
                      sec: sSec !== null && Number.isFinite(sSec) ? sSec : Infinity,
                      displayTime: item.seedTime && item.seedTime !== 'NT' ? item.seedTime : 'NT',
                      sourceTag: 'Seed',
                    };
                  }
                  if (simTimeBasis === 'FINALS') {
                    return {
                      sec: fSec !== null && Number.isFinite(fSec) ? fSec : Infinity,
                      displayTime:
                        item.finalsTime && item.finalsTime !== 'NT' ? item.finalsTime : 'NT',
                      sourceTag: 'Final',
                    };
                  }
                  // AUTO: prefer Seed Time when present (pre-meet psych sheet), fall back to Finals Time
                  if (sSec !== null && Number.isFinite(sSec)) {
                    return { sec: sSec, displayTime: item.seedTime, sourceTag: 'Seed' };
                  }
                  if (fSec !== null && Number.isFinite(fSec)) {
                    return { sec: fSec, displayTime: item.finalsTime, sourceTag: 'Final' };
                  }
                  return { sec: Infinity, displayTime: 'NT', sourceTag: '' };
                };

                // Group all events chronologically by eventNumber
                const eventGroupsMap = new Map();
                parsedData.individualResults.forEach((r) => {
                  const key = `${r.eventNumber}|${r.eventLabel}`;
                  if (!eventGroupsMap.has(key)) {
                    eventGroupsMap.set(key, {
                      key,
                      eventNumber: Number(r.eventNumber) || 999,
                      eventLabel: r.eventLabel,
                      genderLabel: r.genderLabel,
                      isRelay: false,
                      entries: [],
                    });
                  }
                  eventGroupsMap.get(key).entries.push(r);
                });
                parsedData.relayResults.forEach((r) => {
                  const key = `${r.eventNumber}|${r.eventLabel}`;
                  if (!eventGroupsMap.has(key)) {
                    eventGroupsMap.set(key, {
                      key,
                      eventNumber: Number(r.eventNumber) || 999,
                      eventLabel: r.eventLabel,
                      genderLabel: r.genderLabel,
                      isRelay: true,
                      entries: [],
                    });
                  }
                  eventGroupsMap.get(key).entries.push(r);
                });

                const allOrderedEvents = Array.from(eventGroupsMap.values()).sort(
                  (a, b) => a.eventNumber - b.eventNumber
                );

                // Compute projected scores across the ENTIRE meet (both Women & Men)
                const teamScoreTotals = new Map();
                parsedData.teams.forEach((t) => {
                  teamScoreTotals.set(t.code, {
                    code: t.code,
                    name: t.name,
                    womenPts: 0,
                    menPts: 0,
                    totalPts: 0,
                    eventWins: 0,
                  });
                });

                const evaluatedEvents = allOrderedEvents.map((evGrp) => {
                  const metricById = new Map();
                  evGrp.entries.forEach((entry) => {
                    metricById.set(entry.id, getEntryMetric(entry));
                  });

                  // Default natural order by selected time basis
                  const naturalSorted = [...evGrp.entries].sort((a, b) => {
                    const mA = metricById.get(a.id).sec;
                    const mB = metricById.get(b.id).sec;
                    if (mA !== mB) return mA - mB;
                    return (Number(a.lane) || 99) - (Number(b.lane) || 99);
                  });

                  const customOrderIds = simCustomOrders[evGrp.key];
                  let orderedEntries = naturalSorted;
                  if (Array.isArray(customOrderIds) && customOrderIds.length > 0) {
                    const rankMap = new Map(customOrderIds.map((id, idx) => [id, idx]));
                    orderedEntries = [...naturalSorted].sort((a, b) => {
                      const rA = rankMap.has(a.id) ? rankMap.get(a.id) : 9999;
                      const rB = rankMap.has(b.id) ? rankMap.get(b.id) : 9999;
                      if (rA !== rB) return rA - rB;
                      return metricById.get(a.id).sec - metricById.get(b.id).sec;
                    });
                  }

                  const ptsScale = evGrp.isRelay ? scoringConfig.relPts : scoringConfig.indPts;
                  const maxPerTeam = evGrp.isRelay
                    ? scoringConfig.maxRelPerTeam
                    : scoringConfig.maxIndPerTeam;

                  let scoringPlaceIdx = 0;
                  const teamScorerCounts = new Map();
                  const eventTeamPts = new Map();

                  const scoredRows = orderedEntries.map((entry, idx) => {
                    const metric = metricById.get(entry.id);
                    const isScratched = simScratchedIds.has(entry.id);
                    const hasValidMark =
                      !isScratched &&
                      (Number.isFinite(metric.sec) || Array.isArray(customOrderIds));

                    let awardedPts = 0;
                    let simPlace = null;
                    let isExhibitionCapped = false;

                    if (!isScratched && (Number.isFinite(metric.sec) || Array.isArray(customOrderIds))) {
                      simPlace = idx + 1;
                      const curTeamCount = teamScorerCounts.get(entry.teamCode) || 0;
                      if (curTeamCount >= maxPerTeam) {
                        isExhibitionCapped = true;
                      } else if (scoringPlaceIdx < ptsScale.length) {
                        awardedPts = ptsScale[scoringPlaceIdx];
                        scoringPlaceIdx += 1;
                        teamScorerCounts.set(entry.teamCode, curTeamCount + 1);
                      } else {
                        teamScorerCounts.set(entry.teamCode, curTeamCount + 1);
                      }
                    }

                    if (awardedPts > 0) {
                      eventTeamPts.set(
                        entry.teamCode,
                        (eventTeamPts.get(entry.teamCode) || 0) + awardedPts
                      );
                      if (!teamScoreTotals.has(entry.teamCode)) {
                        teamScoreTotals.set(entry.teamCode, {
                          code: entry.teamCode,
                          name: entry.teamName,
                          womenPts: 0,
                          menPts: 0,
                          totalPts: 0,
                          eventWins: 0,
                        });
                      }
                      const tRec = teamScoreTotals.get(entry.teamCode);
                      if (evGrp.genderLabel === 'Women') tRec.womenPts += awardedPts;
                      else if (evGrp.genderLabel === 'Men') tRec.menPts += awardedPts;
                      tRec.totalPts += awardedPts;
                      if (simPlace === 1) tRec.eventWins += 1;
                    }

                    return {
                      entry,
                      metric,
                      isScratched,
                      simPlace,
                      awardedPts,
                      isExhibitionCapped,
                    };
                  });

                  return {
                    ...evGrp,
                    hasOverride: Array.isArray(customOrderIds) && customOrderIds.length > 0,
                    scoredRows,
                    eventTeamPts,
                  };
                });

                const moveSimulatedEntry = (evGroup, rowIndex, delta) => {
                  const targetIdx = rowIndex + delta;
                  if (targetIdx < 0 || targetIdx >= evGroup.scoredRows.length) return;
                  const currentIds = evGroup.scoredRows.map((r) => r.entry.id);
                  const [moved] = currentIds.splice(rowIndex, 1);
                  currentIds.splice(targetIdx, 0, moved);
                  setSimCustomOrders((prev) => ({
                    ...prev,
                    [evGroup.key]: currentIds,
                  }));
                };

                const womenStandings = Array.from(teamScoreTotals.values()).sort(
                  (a, b) => b.womenPts - a.womenPts
                );
                const menStandings = Array.from(teamScoreTotals.values()).sort(
                  (a, b) => b.menPts - a.menPts
                );

                const visibleEvents = evaluatedEvents.filter(
                  (ev) => simGenderView === 'ALL' || ev.genderLabel === simGenderView
                );
                const overrideCount =
                  Object.keys(simCustomOrders).length + simScratchedIds.size;

                return (
                  <div className="p-5 sm:p-6 space-y-5">
                    {/* Simulator Controls Bar */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <div>
                          <span className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                            Time Basis
                          </span>
                          <div className="flex bg-slate-200/70 p-0.5 rounded-lg text-xs font-bold">
                            {[
                              { id: 'AUTO', label: 'Auto (Seed → Final)' },
                              { id: 'SEED', label: 'Seed Times' },
                              { id: 'FINALS', label: 'Finals Times' },
                            ].map((opt) => (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => {
                                  setSimTimeBasis(opt.id);
                                  setSimCustomOrders({});
                                }}
                                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                                  simTimeBasis === opt.id
                                    ? 'bg-white text-slate-900 shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                            Dual Scoring Rules
                          </span>
                          <select
                            value={simScoringFormat}
                            onChange={(e) => setSimScoringFormat(e.target.value)}
                            className="px-3 py-1.5 text-xs font-bold bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="DUAL_9">
                              9-4-3-2-1 Ind / 11-4-2 Relay (Max 3 Ind / 2 Rel)
                            </option>
                            <option value="DUAL_6">
                              6-4-3-2-1 Ind / 8-4-2 Relay (6-Lane Pool)
                            </option>
                          </select>
                        </div>

                        <div>
                          <span className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                            Filter Events
                          </span>
                          <div className="flex bg-slate-200/70 p-0.5 rounded-lg text-xs font-bold">
                            {['ALL', 'Women', 'Men'].map((g) => (
                              <button
                                key={g}
                                type="button"
                                onClick={() => setSimGenderView(g)}
                                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                                  simGenderView === g
                                    ? 'bg-white text-slate-900 shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                              >
                                {g === 'ALL' ? 'All' : g}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {overrideCount > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setSimCustomOrders({});
                            setSimScratchedIds(new Set());
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold bg-amber-600 hover:bg-amber-500 text-white shadow-xs transition cursor-pointer self-start lg:self-end"
                        >
                          Reset All &quot;What-If&quot; Flips ({overrideCount})
                        </button>
                      )}
                    </div>

                    {/* Live Projected Women's & Men's Scoreboards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Women's Projected Scoreboard */}
                      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                          <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                            <Trophy className="w-4 h-4 text-amber-400" />
                            Projected Women&apos;s Dual Score
                          </span>
                          {womenStandings.length >= 2 && (
                            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200">
                              Margin: {Math.abs(womenStandings[0].womenPts - womenStandings[1].womenPts)} pts
                            </span>
                          )}
                        </div>
                        <div className="space-y-2">
                          {womenStandings.map((t, idx) => {
                            const hex = getTeamHexColor(t.code, t.name);
                            return (
                              <div
                                key={`sim-w-${t.code}`}
                                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl ${
                                  idx === 0 && t.womenPts > 0
                                    ? 'bg-white/15 border border-cyan-400/40'
                                    : 'bg-white/5 border border-white/10'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span
                                    className="w-3 h-6 rounded-xs shrink-0"
                                    style={{ backgroundColor: hex }}
                                  />
                                  <span className="font-bold text-sm truncate">{t.name}</span>
                                </div>
                                <span className="font-mono text-xl font-black text-white tabular-nums">
                                  {t.womenPts}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Men's Projected Scoreboard */}
                      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                          <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                            <Trophy className="w-4 h-4 text-amber-400" />
                            Projected Men&apos;s Dual Score
                          </span>
                          {menStandings.length >= 2 && (
                            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200">
                              Margin: {Math.abs(menStandings[0].menPts - menStandings[1].menPts)} pts
                            </span>
                          )}
                        </div>
                        <div className="space-y-2">
                          {menStandings.map((t, idx) => {
                            const hex = getTeamHexColor(t.code, t.name);
                            return (
                              <div
                                key={`sim-m-${t.code}`}
                                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl ${
                                  idx === 0 && t.menPts > 0
                                    ? 'bg-white/15 border border-cyan-400/40'
                                    : 'bg-white/5 border border-white/10'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span
                                    className="w-3 h-6 rounded-xs shrink-0"
                                    style={{ backgroundColor: hex }}
                                  />
                                  <span className="font-bold text-sm truncate">{t.name}</span>
                                </div>
                                <span className="font-mono text-xl font-black text-white tabular-nums">
                                  {t.menPts}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Event-by-Event Interactive What-If Breakdown */}
                    <div className="space-y-4">
                      {visibleEvents.map((evGrp) => (
                        <div
                          key={evGrp.key}
                          className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs"
                        >
                          <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-mono text-[11px] font-bold">
                                #{evGrp.eventNumber}
                              </span>
                              <span className="font-extrabold text-xs sm:text-sm text-slate-900">
                                {evGrp.eventLabel}
                              </span>
                              {evGrp.hasOverride && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                  Custom Order Active
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              {parsedData.teams.map((t) => {
                                const pts = evGrp.eventTeamPts.get(t.code) || 0;
                                const hex = getTeamHexColor(t.code, t.name);
                                return (
                                  <span
                                    key={t.code}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-slate-200 font-mono text-[11px] font-bold text-slate-800"
                                  >
                                    <span
                                      className="w-2 h-2 rounded-full"
                                      style={{ backgroundColor: hex }}
                                    />
                                    <span>{t.code}:</span>
                                    <span className="text-indigo-700">+{pts}</span>
                                  </span>
                                );
                              })}
                              {evGrp.hasOverride && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSimCustomOrders((prev) => {
                                      const next = { ...prev };
                                      delete next[evGrp.key];
                                      return next;
                                    })
                                  }
                                  className="text-[11px] font-bold text-indigo-700 hover:underline ml-1 cursor-pointer"
                                >
                                  Reset Event
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-100">
                                <tr>
                                  <th className="py-2 px-3 w-16 text-center">Sim Place</th>
                                  <th className="py-2 px-3">
                                    {evGrp.isRelay ? 'Relay Squad' : 'Swimmer'}
                                  </th>
                                  <th className="py-2 px-3">Team</th>
                                  <th className="py-2 px-3 text-right">Time Basis</th>
                                  <th className="py-2 px-3 text-center w-20">Points</th>
                                  <th className="py-2 px-3 text-right w-36">What-If Controls</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {evGrp.scoredRows.map((rowObj, rIdx) => {
                                  const {
                                    entry,
                                    metric,
                                    isScratched,
                                    simPlace,
                                    awardedPts,
                                    isExhibitionCapped,
                                  } = rowObj;
                                  const teamHex = getTeamHexColor(entry.teamCode, entry.teamName);
                                  const labelName = evGrp.isRelay
                                    ? entry.relayTitle ||
                                      `${entry.teamName} "${entry.relayLetter || 'A'}"`
                                    : formatSwimmerDisplay(
                                        entry.swimmerName,
                                        entry.preferredFirst
                                      );

                                  return (
                                    <tr
                                      key={entry.id}
                                      style={{ boxShadow: `inset 4px 0 0 ${teamHex}` }}
                                      className={
                                        isScratched
                                          ? 'bg-slate-50 text-slate-400 line-through'
                                          : 'hover:bg-slate-50/70'
                                      }
                                    >
                                      <td className="py-2 px-3 text-center font-mono font-black text-slate-800">
                                        {simPlace ? `#${simPlace}` : '—'}
                                      </td>
                                      <td className="py-2 px-3 font-bold text-slate-900">
                                        {evGrp.isRelay ? (
                                          labelName
                                        ) : (
                                          <button
                                            type="button"
                                            onClick={() =>
                                              openSwimmerProfile(
                                                labelName,
                                                normalizeEventKey(evGrp.eventLabel)
                                              )
                                            }
                                            className="text-left hover:text-indigo-700 hover:underline cursor-pointer"
                                          >
                                            {labelName}
                                          </button>
                                        )}
                                        {!evGrp.isRelay && entry.classYear
                                          ? ` (${entry.classYear})`
                                          : ''}
                                      </td>
                                      <td className="py-2 px-3 text-slate-600">{entry.teamName}</td>
                                      <td className="py-2 px-3 text-right font-mono">
                                        <span className="font-bold text-slate-900">
                                          {metric.displayTime}
                                        </span>
                                        {metric.sourceTag && (
                                          <span className="ml-1 text-[10px] font-sans text-slate-400">
                                            ({metric.sourceTag})
                                          </span>
                                        )}
                                      </td>
                                      <td className="py-2 px-3 text-center font-mono">
                                        {awardedPts > 0 ? (
                                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-black">
                                            +{awardedPts}
                                          </span>
                                        ) : isExhibitionCapped ? (
                                          <span
                                            title="Max scoring entries per team reached"
                                            className="text-[10px] font-sans font-semibold text-slate-400"
                                          >
                                            Exh (0)
                                          </span>
                                        ) : (
                                          <span className="text-slate-400">0</span>
                                        )}
                                      </td>
                                      <td className="py-2 px-3 text-right">
                                        <div className="inline-flex items-center gap-1">
                                          <button
                                            type="button"
                                            disabled={rIdx === 0 || isScratched}
                                            onClick={() => moveSimulatedEntry(evGrp, rIdx, -1)}
                                            title="Move up 1 place"
                                            className="p-1 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 text-slate-700 cursor-pointer"
                                          >
                                            <ChevronUp className="w-3.5 h-3.5" />
                                          </button>
                                          <button
                                            type="button"
                                            disabled={
                                              rIdx === evGrp.scoredRows.length - 1 || isScratched
                                            }
                                            onClick={() => moveSimulatedEntry(evGrp, rIdx, 1)}
                                            title="Move down 1 place"
                                            className="p-1 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 text-slate-700 cursor-pointer"
                                          >
                                            <ChevronDown className="w-3.5 h-3.5" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setSimScratchedIds((prev) => {
                                                const next = new Set(prev);
                                                if (next.has(entry.id)) next.delete(entry.id);
                                                else next.add(entry.id);
                                                return next;
                                              });
                                            }}
                                            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition cursor-pointer ${
                                              isScratched
                                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                                : 'bg-white text-slate-500 border-slate-200 hover:text-red-600 hover:border-red-200'
                                            }`}
                                          >
                                            {isScratched ? 'Restore' : 'DQ / Scr'}
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* SUB-TAB 2: ACTIVE ROSTER OVERVIEW */}
              {inMeetSubTab === 'roster' && (() => {
                const activeAthletes = masterRoster
                  .filter((a) => a.isActive)
                  .filter((a) => {
                    if (inMeetGenderFilter !== 'ALL' && a.gender !== inMeetGenderFilter) return false;
                    if (inMeetSearch.trim() !== '') {
                      const q = inMeetSearch.toLowerCase();
                      const hay = `${a.canonicalName} ${(a.aliases || []).join(' ')}`.toLowerCase();
                      if (!hay.includes(q)) return false;
                    }
                    return true;
                  })
                  .sort((a, b) => compareByLastName(a.canonicalName, b.canonicalName));

                const targetPool = (benchmarkIndex.byEvent[inMeetTargetEventKey] || []).slice();
                const bestByTargetAth = new Map();
                targetPool.forEach((rec) => {
                  if (
                    !bestByTargetAth.has(rec.swimmerKey) ||
                    rec.seconds < bestByTargetAth.get(rec.swimmerKey).seconds
                  ) {
                    bestByTargetAth.set(rec.swimmerKey, rec);
                  }
                });
                const sortedTargetBests = Array.from(bestByTargetAth.values()).sort(
                  (a, b) => a.seconds - b.seconds
                );
                const targetRecord = sortedTargetBests[0] || null;
                const targetTop10Cut = sortedTargetBests[9] || null;
                const targetFrRecord =
                  targetPool
                    .filter((r) => normalizeClass(r.classYear) === 'FR')
                    .sort((a, b) => a.seconds - b.seconds)[0] || null;

                const seasonStart = getCurrentSeasonStart();

                return (
                  <div className="p-5 sm:p-6 space-y-5">
                    {/* Search, Gender Filter, & Target Event Cut Strip */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                        <div className="md:col-span-5 relative">
                          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={inMeetSearch}
                            onChange={(e) => setInMeetSearch(e.target.value)}
                            placeholder="Search active swimmer..."
                            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div className="md:col-span-3 flex bg-slate-200/70 p-0.5 rounded-lg text-xs font-bold">
                          {['ALL', 'Women', 'Men'].map((g) => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => {
                                setInMeetGenderFilter(g);
                                if (g === 'Men' && inMeetTargetEventKey.startsWith('women')) {
                                  setInMeetTargetEventKey('men 50 freestyle');
                                } else if (g === 'Women' && inMeetTargetEventKey.startsWith('men')) {
                                  setInMeetTargetEventKey('women 50 freestyle');
                                }
                              }}
                              className={`flex-1 py-1.5 rounded-md transition cursor-pointer ${
                                inMeetGenderFilter === g
                                  ? 'bg-white text-slate-900 shadow-xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              {g === 'ALL' ? 'All' : g}
                            </button>
                          ))}
                        </div>

                        <div className="md:col-span-4">
                          <select
                            value={inMeetTargetEventKey}
                            onChange={(e) => setInMeetTargetEventKey(e.target.value)}
                            className="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            {CANONICAL_EVENTS.filter((ev) => !ev.toLowerCase().includes('relay')).map(
                              (ev) => (
                                <option key={ev} value={ev.toLowerCase()}>
                                  Target Cuts: {ev}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                        <div className="bg-white border border-amber-200 rounded-lg px-3 py-2">
                          <span className="text-[10px] font-bold uppercase text-amber-800 block">
                            #1 Program Record
                          </span>
                          <span className="font-bold text-slate-900">
                            {targetRecord
                              ? `${targetRecord.time} — ${targetRecord.swimmerName}`
                              : 'No mark in DB'}
                          </span>
                        </div>
                        <div className="bg-white border border-indigo-200 rounded-lg px-3 py-2">
                          <span className="text-[10px] font-bold uppercase text-indigo-800 block">
                            #10 All-Time Cut
                          </span>
                          <span className="font-bold text-slate-900">
                            {targetTop10Cut
                              ? `${targetTop10Cut.time} — ${targetTop10Cut.swimmerName}`
                              : `Open spot (${sortedTargetBests.length}/10)`}
                          </span>
                        </div>
                        <div className="bg-white border border-cyan-200 rounded-lg px-3 py-2">
                          <span className="text-[10px] font-bold uppercase text-cyan-800 block">
                            Freshman (FR) Record
                          </span>
                          <span className="font-bold text-slate-900">
                            {targetFrRecord
                              ? `${targetFrRecord.time} — ${targetFrRecord.swimmerName}`
                              : 'No FR mark in DB'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {activeAthletes.length === 0 ? (
                      <div className="text-center py-10 text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl">
                        No active swimmers match the current filter. Manage active athletes in{' '}
                        <strong>Section 1 → Master Roster</strong>.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activeAthletes.map((ath) => {
                          const swKey = normalizeSwimmerKey(ath.canonicalName);
                          const athOfficial = historicalRecords.filter((r) => {
                            if (r.isOfficial === false) return false;
                            const m = resolveMasterAthlete(r.swimmerName);
                            return normalizeSwimmerKey(m ? m.canonicalName : r.swimmerName) === swKey;
                          });

                          const isSplit = (r) =>
                            r.swimType === 'INTERMEDIATE_SPLIT' ||
                            String(r.place || '').toUpperCase() === 'S';
                          const isLeadOff = (r) =>
                            r.swimType === 'RELAY_LEADOFF' ||
                            String(r.place || '').toUpperCase() === 'R' ||
                            String(r.place || '').toUpperCase() === 'LR';
                          const isPureOfficial = (r) => !isSplit(r) && !isLeadOff(r);

                          const evMap = new Map();
                          const ensureEv = (r) => {
                            if (!evMap.has(r.eventKey)) {
                              evMap.set(r.eventKey, {
                                eventKey: r.eventKey,
                                eventLabel: r.eventLabel || toTitleEventLabel(r.eventKey),
                                officialPb: null,
                                officialSb: null,
                                leadOffPb: null,
                                leadOffSb: null,
                                splitPb: null,
                                splitSb: null,
                              });
                            }
                            return evMap.get(r.eventKey);
                          };

                          athOfficial
                            .filter((r) => r.eventKey)
                            .forEach((r) => {
                              const entry = ensureEv(r);
                              const inSeason = Boolean(r.dateObj && r.dateObj >= seasonStart);
                              if (isSplit(r)) {
                                if (!entry.splitPb || r.seconds < entry.splitPb.seconds) {
                                  entry.splitPb = r;
                                }
                                if (inSeason && (!entry.splitSb || r.seconds < entry.splitSb.seconds)) {
                                  entry.splitSb = r;
                                }
                              } else if (isLeadOff(r)) {
                                if (!entry.leadOffPb || r.seconds < entry.leadOffPb.seconds) {
                                  entry.leadOffPb = r;
                                }
                                if (
                                  inSeason &&
                                  (!entry.leadOffSb || r.seconds < entry.leadOffSb.seconds)
                                ) {
                                  entry.leadOffSb = r;
                                }
                              } else if (isPureOfficial(r)) {
                                if (!entry.officialPb || r.seconds < entry.officialPb.seconds) {
                                  entry.officialPb = r;
                                }
                                if (
                                  inSeason &&
                                  (!entry.officialSb || r.seconds < entry.officialSb.seconds)
                                ) {
                                  entry.officialSb = r;
                                }
                              }
                            });

                          const topEvents = Array.from(evMap.values())
                            .map((ev) => {
                              const primaryCareer = ev.officialPb || ev.leadOffPb || ev.splitPb;
                              const primarySeason = ev.officialSb;
                              const fasterCareerLeadOff =
                                ev.leadOffPb &&
                                (!ev.officialPb ||
                                  ev.leadOffPb.seconds < ev.officialPb.seconds - 0.005)
                                  ? ev.leadOffPb
                                  : null;
                              const fasterSeasonLeadOff =
                                ev.leadOffSb &&
                                (!ev.officialSb ||
                                  ev.leadOffSb.seconds < ev.officialSb.seconds - 0.005)
                                  ? ev.leadOffSb
                                  : null;
                              const fasterCareerSplit =
                                ev.splitPb &&
                                (!ev.officialPb ||
                                  ev.splitPb.seconds < ev.officialPb.seconds - 0.005)
                                  ? ev.splitPb
                                  : null;
                              const fasterSeasonSplit =
                                ev.splitSb &&
                                (!ev.officialSb ||
                                  ev.splitSb.seconds < ev.officialSb.seconds - 0.005)
                                  ? ev.splitSb
                                  : null;

                              const careerMatchesSeason = Boolean(
                                primaryCareer &&
                                  primarySeason &&
                                  (primaryCareer.id === primarySeason.id ||
                                    (Math.abs(primaryCareer.seconds - primarySeason.seconds) <
                                      0.005 &&
                                      primaryCareer.date === primarySeason.date))
                              );

                              return {
                                ...ev,
                                primaryCareer,
                                primarySeason,
                                careerMatchesSeason,
                                fasterCareerLeadOff,
                                fasterSeasonLeadOff,
                                fasterCareerSplit,
                                fasterSeasonSplit,
                              };
                            })
                            .filter((ev) => ev.primaryCareer)
                            .slice(0, 6);

                          const meetSwims = parsedData
                            ? parsedData.individualResults.filter((entry) => {
                                const disp = formatSwimmerDisplay(
                                  entry.swimmerName,
                                  entry.preferredFirst
                                );
                                const m = resolveMasterAthlete(disp);
                                return (
                                  normalizeSwimmerKey(m ? m.canonicalName : disp) === swKey
                                );
                              })
                            : [];

                          return (
                            <div
                              key={ath.id}
                              className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:border-indigo-300 transition flex flex-col justify-between space-y-3"
                            >
                              <div className="space-y-2.5">
                                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                                  <div>
                                    <button
                                      type="button"
                                      onClick={() => openSwimmerProfile(ath.canonicalName)}
                                      className="font-extrabold text-sm text-slate-900 hover:text-indigo-700 hover:underline text-left cursor-pointer"
                                    >
                                      {ath.canonicalName}
                                    </button>
                                    <div className="text-[11px] text-slate-500">
                                      {ath.gender} • Active Roster
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => openSwimmerProfile(ath.canonicalName)}
                                    className="text-[11px] font-bold text-indigo-700 hover:underline shrink-0 cursor-pointer"
                                  >
                                    Profile →
                                  </button>
                                </div>

                                {topEvents.length === 0 ? (
                                  <div className="text-xs text-slate-400 italic py-2">
                                    No committed individual times in DB yet.
                                  </div>
                                ) : (
                                  <div className="overflow-x-auto border border-slate-100 rounded-lg">
                                    <table className="w-full text-left text-[11px]">
                                      <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[9px] border-b border-slate-100">
                                        <tr>
                                          <th className="py-1.5 px-2">Event</th>
                                          <th className="py-1.5 px-2">Season Best</th>
                                          <th className="py-1.5 px-2">Career Best</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-100">
                                        {topEvents.map((ev) => (
                                          <tr key={ev.eventKey} className="align-top">
                                            <td className="py-1.5 px-2 font-bold text-slate-800">
                                              {ev.eventLabel.replace(/^(Women|Men)\s+/i, '')}
                                            </td>
                                            <td className="py-1.5 px-2 font-mono">
                                              {ev.primarySeason ? (
                                                <div>
                                                  <div className="font-bold text-cyan-800">
                                                    {ev.primarySeason.time}
                                                  </div>
                                                  <div className="text-[9px] text-slate-400">
                                                    {formatDisplayDateMDY(ev.primarySeason.date)}
                                                  </div>
                                                </div>
                                              ) : (
                                                <span className="text-slate-400 font-bold">—</span>
                                              )}
                                              {ev.fasterSeasonLeadOff && (
                                                <div className="mt-0.5 text-[10px] font-bold text-purple-700">
                                                  {ev.fasterSeasonLeadOff.time} (R)
                                                  <span className="block text-[9px] font-normal text-purple-500">
                                                    {formatDisplayDateMDY(
                                                      ev.fasterSeasonLeadOff.date
                                                    )}
                                                  </span>
                                                </div>
                                              )}
                                              {ev.fasterSeasonSplit && (
                                                <div className="mt-0.5 text-[10px] font-bold text-amber-700">
                                                  {ev.fasterSeasonSplit.time} (S)
                                                  <span className="block text-[9px] font-normal text-amber-600">
                                                    {formatDisplayDateMDY(
                                                      ev.fasterSeasonSplit.date
                                                    )}
                                                  </span>
                                                </div>
                                              )}
                                            </td>
                                            <td className="py-1.5 px-2 font-mono">
                                              {ev.careerMatchesSeason ? (
                                                <span className="font-sans text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                                                  Same
                                                </span>
                                              ) : ev.primaryCareer ? (
                                                <div>
                                                  <div className="font-bold text-slate-900">
                                                    {ev.primaryCareer.time}
                                                    {isLeadOff(ev.primaryCareer) ? ' (R)' : ''}
                                                    {isSplit(ev.primaryCareer) ? ' (S)' : ''}
                                                  </div>
                                                  <div className="text-[9px] text-slate-400">
                                                    {formatDisplayDateMDY(ev.primaryCareer.date)}
                                                  </div>
                                                </div>
                                              ) : (
                                                <span className="text-slate-400">—</span>
                                              )}
                                              {ev.fasterCareerLeadOff &&
                                                ev.fasterCareerLeadOff.id !==
                                                  ev.primaryCareer?.id && (
                                                  <div className="mt-0.5 text-[10px] font-bold text-purple-700">
                                                    {ev.fasterCareerLeadOff.time} (R)
                                                    <span className="block text-[9px] font-normal text-purple-500">
                                                      {formatDisplayDateMDY(
                                                        ev.fasterCareerLeadOff.date
                                                      )}
                                                    </span>
                                                  </div>
                                                )}
                                              {ev.fasterCareerSplit &&
                                                ev.fasterCareerSplit.id !==
                                                  ev.primaryCareer?.id && (
                                                  <div className="mt-0.5 text-[10px] font-bold text-amber-700">
                                                    {ev.fasterCareerSplit.time} (S)
                                                    <span className="block text-[9px] font-normal text-amber-600">
                                                      {formatDisplayDateMDY(
                                                        ev.fasterCareerSplit.date
                                                      )}
                                                    </span>
                                                  </div>
                                                )}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>

                              {meetSwims.length > 0 && (
                                <div className="pt-2 border-t border-slate-100 space-y-1">
                                  <div className="text-[10px] font-bold uppercase text-indigo-700">
                                    Loaded Meet Swims
                                  </div>
                                  {meetSwims.map((ms) => (
                                    <div
                                      key={ms.id}
                                      className="flex items-center justify-between text-[11px] text-slate-700"
                                    >
                                      <span className="truncate">
                                        {ms.eventLabel.replace(/^(Women|Men)\s+/i, '')}
                                      </span>
                                      <span className="font-mono font-bold text-indigo-900">
                                        {ms.finalsTime !== 'NT'
                                          ? ms.finalsTime
                                          : ms.seedTime || 'NT'}
                                      </span>
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
                );
              })()}

              {/* SUB-TAB 2B: RELAY LINEUP OPTIMIZER & SPLIT FORECASTER */}
              {inMeetSubTab === 'relayopt' && (() => {
                const relayEventSpecs = {
                  'women 200 freestyle relay': {
                    gender: 'Women',
                    isMedley: false,
                    legs: [
                      { label: 'Leg 1 (Lead-Off Free)', eventKey: 'women 50 freestyle', isLeadOff: true },
                      { label: 'Leg 2 (Flying Free)', eventKey: 'women 50 freestyle', isLeadOff: false },
                      { label: 'Leg 3 (Flying Free)', eventKey: 'women 50 freestyle', isLeadOff: false },
                      { label: 'Leg 4 (Anchor Free)', eventKey: 'women 50 freestyle', isLeadOff: false },
                    ],
                  },
                  'women 400 freestyle relay': {
                    gender: 'Women',
                    isMedley: false,
                    legs: [
                      { label: 'Leg 1 (Lead-Off Free)', eventKey: 'women 100 freestyle', isLeadOff: true },
                      { label: 'Leg 2 (Flying Free)', eventKey: 'women 100 freestyle', isLeadOff: false },
                      { label: 'Leg 3 (Flying Free)', eventKey: 'women 100 freestyle', isLeadOff: false },
                      { label: 'Leg 4 (Anchor Free)', eventKey: 'women 100 freestyle', isLeadOff: false },
                    ],
                  },
                  'women 800 freestyle relay': {
                    gender: 'Women',
                    isMedley: false,
                    legs: [
                      { label: 'Leg 1 (Lead-Off Free)', eventKey: 'women 200 freestyle', isLeadOff: true },
                      { label: 'Leg 2 (Flying Free)', eventKey: 'women 200 freestyle', isLeadOff: false },
                      { label: 'Leg 3 (Flying Free)', eventKey: 'women 200 freestyle', isLeadOff: false },
                      { label: 'Leg 4 (Anchor Free)', eventKey: 'women 200 freestyle', isLeadOff: false },
                    ],
                  },
                  'women 200 medley relay': {
                    gender: 'Women',
                    isMedley: true,
                    legs: [
                      { label: 'Leg 1 (50 Back)', eventKey: 'women 50 backstroke', isLeadOff: true },
                      { label: 'Leg 2 (50 Breast)', eventKey: 'women 50 breaststroke', isLeadOff: false },
                      { label: 'Leg 3 (50 Fly)', eventKey: 'women 50 butterfly', isLeadOff: false },
                      { label: 'Leg 4 (50 Free)', eventKey: 'women 50 freestyle', isLeadOff: false },
                    ],
                  },
                  'women 400 medley relay': {
                    gender: 'Women',
                    isMedley: true,
                    legs: [
                      { label: 'Leg 1 (100 Back)', eventKey: 'women 100 backstroke', isLeadOff: true },
                      { label: 'Leg 2 (100 Breast)', eventKey: 'women 100 breaststroke', isLeadOff: false },
                      { label: 'Leg 3 (100 Fly)', eventKey: 'women 100 butterfly', isLeadOff: false },
                      { label: 'Leg 4 (100 Free)', eventKey: 'women 100 freestyle', isLeadOff: false },
                    ],
                  },
                  'men 200 freestyle relay': {
                    gender: 'Men',
                    isMedley: false,
                    legs: [
                      { label: 'Leg 1 (Lead-Off Free)', eventKey: 'men 50 freestyle', isLeadOff: true },
                      { label: 'Leg 2 (Flying Free)', eventKey: 'men 50 freestyle', isLeadOff: false },
                      { label: 'Leg 3 (Flying Free)', eventKey: 'men 50 freestyle', isLeadOff: false },
                      { label: 'Leg 4 (Anchor Free)', eventKey: 'men 50 freestyle', isLeadOff: false },
                    ],
                  },
                  'men 400 freestyle relay': {
                    gender: 'Men',
                    isMedley: false,
                    legs: [
                      { label: 'Leg 1 (Lead-Off Free)', eventKey: 'men 100 freestyle', isLeadOff: true },
                      { label: 'Leg 2 (Flying Free)', eventKey: 'men 100 freestyle', isLeadOff: false },
                      { label: 'Leg 3 (Flying Free)', eventKey: 'men 100 freestyle', isLeadOff: false },
                      { label: 'Leg 4 (Anchor Free)', eventKey: 'men 100 freestyle', isLeadOff: false },
                    ],
                  },
                  'men 800 freestyle relay': {
                    gender: 'Men',
                    isMedley: false,
                    legs: [
                      { label: 'Leg 1 (Lead-Off Free)', eventKey: 'men 200 freestyle', isLeadOff: true },
                      { label: 'Leg 2 (Flying Free)', eventKey: 'men 200 freestyle', isLeadOff: false },
                      { label: 'Leg 3 (Flying Free)', eventKey: 'men 200 freestyle', isLeadOff: false },
                      { label: 'Leg 4 (Anchor Free)', eventKey: 'men 200 freestyle', isLeadOff: false },
                    ],
                  },
                  'men 200 medley relay': {
                    gender: 'Men',
                    isMedley: true,
                    legs: [
                      { label: 'Leg 1 (50 Back)', eventKey: 'men 50 backstroke', isLeadOff: true },
                      { label: 'Leg 2 (50 Breast)', eventKey: 'men 50 breaststroke', isLeadOff: false },
                      { label: 'Leg 3 (50 Fly)', eventKey: 'men 50 butterfly', isLeadOff: false },
                      { label: 'Leg 4 (50 Free)', eventKey: 'men 50 freestyle', isLeadOff: false },
                    ],
                  },
                  'men 400 medley relay': {
                    gender: 'Men',
                    isMedley: true,
                    legs: [
                      { label: 'Leg 1 (100 Back)', eventKey: 'men 100 backstroke', isLeadOff: true },
                      { label: 'Leg 2 (100 Breast)', eventKey: 'men 100 breaststroke', isLeadOff: false },
                      { label: 'Leg 3 (100 Fly)', eventKey: 'men 100 butterfly', isLeadOff: false },
                      { label: 'Leg 4 (100 Free)', eventKey: 'men 100 freestyle', isLeadOff: false },
                    ],
                  },
                };

                const spec =
                  relayEventSpecs[relayOptEventKey] || relayEventSpecs['women 200 medley relay'];
                const seasonStart = getCurrentSeasonStart();

                const activeGenderRoster = masterRoster
                  .filter((a) => a.isActive && a.gender === spec.gender)
                  .sort((a, b) => compareByLastName(a.canonicalName, b.canonicalName));

                // Map each active swimmer's flat-start bests (PB or SB) across the needed leg events
                const neededEventKeys = Array.from(new Set(spec.legs.map((l) => l.eventKey)));
                const swimmerBestByEvent = new Map();

                activeGenderRoster.forEach((ath) => {
                  const swKey = normalizeSwimmerKey(ath.canonicalName);
                  const evMap = new Map();
                  neededEventKeys.forEach((evK) => {
                    const pool = historicalRecords.filter((r) => {
                      if (r.isOfficial === false || r.eventKey !== evK) return false;
                      const m = resolveMasterAthlete(r.swimmerName);
                      const rKey = normalizeSwimmerKey(m ? m.canonicalName : r.swimmerName);
                      if (rKey !== swKey) return false;
                      if (relayOptBasis === 'SB') {
                        return Boolean(r.dateObj && r.dateObj >= seasonStart);
                      }
                      return true;
                    });
                    if (pool.length > 0) {
                      const bestRec = pool.reduce((best, cur) =>
                        cur.seconds < best.seconds ? cur : best
                      );
                      evMap.set(evK, bestRec);
                    }
                  });
                  swimmerBestByEvent.set(swKey, {
                    swimmerKey: swKey,
                    canonicalName: ath.canonicalName,
                    evMap,
                  });
                });

                const availableSwimmers = activeGenderRoster
                  .map((ath) => swimmerBestByEvent.get(normalizeSwimmerKey(ath.canonicalName)))
                  .filter((item) => item && !relayOptExcludedKeys.has(item.swimmerKey));

                // Compute optimal 4-swimmer assignment (exact 4! permutation search across top 8 per stroke for Medley, or top 4 fastest for Free Relay)
                const solveBestRelayLineup = (candidatePool) => {
                  if (candidatePool.length < 4) return null;

                  if (!spec.isMedley) {
                    const evK = spec.legs[0].eventKey;
                    const ranked = candidatePool
                      .filter((c) => c.evMap.has(evK))
                      .sort((a, b) => a.evMap.get(evK).seconds - b.evMap.get(evK).seconds);
                    if (ranked.length < 4) return null;

                    // Put fastest flat-start swimmer on Lead-Off (or keep top 4 ordered)
                    const chosen = ranked.slice(0, 4);
                    return chosen.map((athObj, idx) => {
                      const rec = athObj.evMap.get(evK);
                      const projSec =
                        idx === 0 ? rec.seconds : Math.max(0.1, rec.seconds + relayOptExchangeDelta);
                      return {
                        legIdx: idx,
                        swimmerKey: athObj.swimmerKey,
                        swimmerName: athObj.canonicalName,
                        flatSec: rec.seconds,
                        flatTime: rec.time,
                        sourceLabel:
                          rec.swimType === 'INTERMEDIATE_SPLIT' || rec.place === 'S'
                            ? 'Split (S)'
                            : rec.swimType === 'RELAY_LEADOFF' || rec.place === 'R'
                            ? 'Lead-Off (R)'
                            : 'Official',
                        projSec,
                        projTime: secondsToTime(projSec),
                      };
                    });
                  }

                  // Medley Relay: take top 8 candidates per stroke and find minimum-sum 4-distinct-swimmer assignment
                  const legPools = spec.legs.map((leg) =>
                    candidatePool
                      .filter((c) => c.evMap.has(leg.eventKey))
                      .sort(
                        (a, b) =>
                          a.evMap.get(leg.eventKey).seconds - b.evMap.get(leg.eventKey).seconds
                      )
                      .slice(0, 8)
                  );
                  if (legPools.some((p) => p.length === 0)) return null;

                  let bestCombo = null;
                  let bestTotal = Infinity;

                  for (const s0 of legPools[0]) {
                    for (const s1 of legPools[1]) {
                      if (s1.swimmerKey === s0.swimmerKey) continue;
                      for (const s2 of legPools[2]) {
                        if (s2.swimmerKey === s0.swimmerKey || s2.swimmerKey === s1.swimmerKey)
                          continue;
                        for (const s3 of legPools[3]) {
                          if (
                            s3.swimmerKey === s0.swimmerKey ||
                            s3.swimmerKey === s1.swimmerKey ||
                            s3.swimmerKey === s2.swimmerKey
                          )
                            continue;

                          const combo = [s0, s1, s2, s3];
                          const total = combo.reduce((sum, athObj, idx) => {
                            const baseSec = athObj.evMap.get(spec.legs[idx].eventKey).seconds;
                            return (
                              sum +
                              (idx === 0
                                ? baseSec
                                : Math.max(0.1, baseSec + relayOptExchangeDelta))
                            );
                          }, 0);

                          if (total < bestTotal) {
                            bestTotal = total;
                            bestCombo = combo;
                          }
                        }
                      }
                    }
                  }

                  if (!bestCombo) return null;
                  return bestCombo.map((athObj, idx) => {
                    const rec = athObj.evMap.get(spec.legs[idx].eventKey);
                    const projSec =
                      idx === 0 ? rec.seconds : Math.max(0.1, rec.seconds + relayOptExchangeDelta);
                    return {
                      legIdx: idx,
                      swimmerKey: athObj.swimmerKey,
                      swimmerName: athObj.canonicalName,
                      flatSec: rec.seconds,
                      flatTime: rec.time,
                      sourceLabel:
                        rec.swimType === 'INTERMEDIATE_SPLIT' || rec.place === 'S'
                          ? 'Split (S)'
                          : rec.swimType === 'RELAY_LEADOFF' || rec.place === 'R'
                          ? 'Lead-Off (R)'
                          : 'Official',
                      projSec,
                      projTime: secondsToTime(projSec),
                    };
                  });
                };

                const autoLineupA = solveBestRelayLineup(availableSwimmers);
                const usedInA = new Set((autoLineupA || []).map((l) => l.swimmerKey));
                const autoLineupB = solveBestRelayLineup(
                  availableSwimmers.filter((s) => !usedInA.has(s.swimmerKey))
                );

                // Resolve effective lineup (applying any manual dropdown overrides)
                const buildEffectiveLineup = (autoLegs, manualKeys) => {
                  return spec.legs.map((leg, idx) => {
                    const chosenKey = manualKeys[idx] || autoLegs?.[idx]?.swimmerKey || '';
                    const athObj = chosenKey ? swimmerBestByEvent.get(chosenKey) : null;
                    const rec = athObj ? athObj.evMap.get(leg.eventKey) : null;
                    if (!athObj || !rec) {
                      return {
                        legIdx: idx,
                        swimmerKey: chosenKey,
                        swimmerName: athObj?.canonicalName || '',
                        flatSec: null,
                        flatTime: '—',
                        sourceLabel: '',
                        projSec: null,
                        projTime: '—',
                      };
                    }
                    const projSec =
                      idx === 0 ? rec.seconds : Math.max(0.1, rec.seconds + relayOptExchangeDelta);
                    return {
                      legIdx: idx,
                      swimmerKey: athObj.swimmerKey,
                      swimmerName: athObj.canonicalName,
                      flatSec: rec.seconds,
                      flatTime: rec.time,
                      sourceLabel:
                        rec.swimType === 'INTERMEDIATE_SPLIT' || rec.place === 'S'
                          ? 'Split (S)'
                          : rec.swimType === 'RELAY_LEADOFF' || rec.place === 'R'
                          ? 'Lead-Off (R)'
                          : 'Official',
                      projSec,
                      projTime: secondsToTime(projSec),
                    };
                  });
                };

                const effectiveA = buildEffectiveLineup(autoLineupA, relayOptManualA);
                const effectiveB = buildEffectiveLineup(autoLineupB, relayOptManualB);

                const calcRelayTotal = (legsArr) => {
                  if (legsArr.some((l) => l.projSec === null)) return null;
                  return legsArr.reduce((acc, l) => acc + l.projSec, 0);
                };

                const totalSecA = calcRelayTotal(effectiveA);
                const totalSecB = calcRelayTotal(effectiveB);

                // Program Record, #10 Cut, and Qualifying Standards for this Relay
                const relayHistRows = historicalRecords.filter(
                  (r) => r.isOfficial !== false && r.eventKey === relayOptEventKey
                );
                const sortedRelayHist = [...relayHistRows].sort((a, b) => a.seconds - b.seconds);
                const schoolRelayRec = sortedRelayHist[0] || null;
                const tenthRelayRec = sortedRelayHist[9] || null;
                const matchingRelayStds = qualStandards.filter(
                  (s) => s.eventKey === relayOptEventKey
                );

                const renderSquadCard = (squadTitle, accentClass, legsArr, totalSec, manualArr, setManualArr) => {
                  const hasManual = manualArr.some(Boolean);
                  const duplicateKeys = new Set();
                  const seen = new Set();
                  legsArr.forEach((l) => {
                    if (!l.swimmerKey) return;
                    if (seen.has(l.swimmerKey)) duplicateKeys.add(l.swimmerKey);
                    seen.add(l.swimmerKey);
                  });

                  const hitStds =
                    totalSec !== null
                      ? evaluateStandardsForSwim(
                          toTitleEventLabel(relayOptEventKey),
                          secondsToTime(totalSec)
                        )
                      : [];

                  return (
                    <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase ${accentClass}`}
                          >
                            {squadTitle}
                          </span>
                          {hasManual && (
                            <button
                              type="button"
                              onClick={() => setManualArr(['', '', '', ''])}
                              className="text-[11px] font-bold text-indigo-700 hover:underline cursor-pointer"
                            >
                              Reset to Optimal Auto-Pick
                            </button>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-bold uppercase text-slate-500">
                            Projected Relay Time ({relayOptBasis})
                          </div>
                          <div className="text-xl sm:text-2xl font-mono font-black text-slate-900">
                            {totalSec !== null ? secondsToTime(totalSec) : 'Incomplete'}
                          </div>
                        </div>
                      </div>

                      {duplicateKeys.size > 0 && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                          <span>Warning: Same swimmer is assigned to multiple legs in this relay.</span>
                        </div>
                      )}

                      {/* Benchmark Comparison Pills for Projected Time */}
                      {totalSec !== null && (
                        <div className="flex flex-wrap gap-1.5 text-[11px]">
                          {schoolRelayRec && (
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold ${
                                totalSec <= schoolRelayRec.seconds + 0.005
                                  ? 'bg-amber-200 text-amber-950'
                                  : 'bg-white border border-slate-200 text-slate-700'
                              }`}
                            >
                              {totalSec <= schoolRelayRec.seconds + 0.005
                                ? `Breaks School Record (${schoolRelayRec.time})!`
                                : `${(totalSec - schoolRelayRec.seconds).toFixed(2)}s off Record (${schoolRelayRec.time})`}
                            </span>
                          )}
                          {tenthRelayRec && (
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold ${
                                totalSec <= tenthRelayRec.seconds + 0.005
                                  ? 'bg-indigo-100 text-indigo-900'
                                  : 'bg-white border border-slate-200 text-slate-600'
                              }`}
                            >
                              {totalSec <= tenthRelayRec.seconds + 0.005
                                ? `Top-10 Pace (#10: ${tenthRelayRec.time})`
                                : `${(totalSec - tenthRelayRec.seconds).toFixed(2)}s off #10 (${tenthRelayRec.time})`}
                            </span>
                          )}
                          {hitStds.map((std) => (
                            <span
                              key={std.id}
                              className={`px-2 py-0.5 rounded-full font-bold ${getStandardBadgeStyle(
                                std.label
                              )}`}
                            >
                              Hits {std.label} ({std.time})
                            </span>
                          ))}
                        </div>
                      )}

                      {/* 4-Leg Lineup Rows */}
                      <div className="space-y-2">
                        {spec.legs.map((legSpec, idx) => {
                          const legData = legsArr[idx];
                          const candidatesForLeg = activeGenderRoster
                            .map((ath) => {
                              const k = normalizeSwimmerKey(ath.canonicalName);
                              const item = swimmerBestByEvent.get(k);
                              const rec = item?.evMap.get(legSpec.eventKey);
                              return {
                                swimmerKey: k,
                                canonicalName: ath.canonicalName,
                                rec,
                                excluded: relayOptExcludedKeys.has(k),
                              };
                            })
                            .filter((c) => c.rec)
                            .sort((a, b) => a.rec.seconds - b.rec.seconds);

                          return (
                            <div
                              key={idx}
                              className="bg-white border border-slate-200 rounded-xl p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="text-[10px] font-bold uppercase text-slate-500">
                                  {legSpec.label}
                                </div>
                                <select
                                  value={legData.swimmerKey}
                                  onChange={(e) => {
                                    const next = [...manualArr];
                                    next[idx] = e.target.value;
                                    setManualArr(next);
                                  }}
                                  className="mt-0.5 w-full px-2 py-1 text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                  <option value="">-- Select Swimmer --</option>
                                  {candidatesForLeg.map((c) => (
                                    <option key={c.swimmerKey} value={c.swimmerKey}>
                                      {c.canonicalName} — {c.rec.time}
                                      {c.excluded ? ' (Unavailable)' : ''}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="flex items-center gap-3 sm:text-right shrink-0 font-mono text-xs">
                                <div>
                                  <div className="text-[10px] font-sans text-slate-400">
                                    Flat {relayOptBasis}
                                    {legData.sourceLabel && legData.sourceLabel !== 'Official'
                                      ? ` (${legData.sourceLabel})`
                                      : ''}
                                  </div>
                                  <div className="font-semibold text-slate-700">
                                    {legData.flatTime}
                                  </div>
                                </div>
                                <div className="bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg">
                                  <div className="text-[10px] font-sans font-bold text-indigo-700">
                                    {idx === 0 ? 'Lead-Off' : `Relay (${relayOptExchangeDelta >= 0 ? '+' : ''}${relayOptExchangeDelta.toFixed(2)}s)`}
                                  </div>
                                  <div className="font-black text-indigo-950">
                                    {legData.projTime}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                };

                return (
                  <div className="p-5 sm:p-6 space-y-5">
                    {/* Controls Bar */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                      <div className="md:col-span-5">
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                          Relay Event
                        </label>
                        <select
                          value={relayOptEventKey}
                          onChange={(e) => {
                            setRelayOptEventKey(e.target.value);
                            setRelayOptManualA(['', '', '', '']);
                            setRelayOptManualB(['', '', '', '']);
                          }}
                          className="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          {Object.keys(relayEventSpecs).map((rk) => (
                            <option key={rk} value={rk}>
                              {toTitleEventLabel(rk)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-4">
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                          Split Forecast Basis
                        </label>
                        <div className="flex bg-slate-200/70 p-0.5 rounded-lg text-xs font-bold">
                          <button
                            type="button"
                            onClick={() => setRelayOptBasis('PB')}
                            className={`flex-1 py-1.5 rounded-md transition cursor-pointer ${
                              relayOptBasis === 'PB'
                                ? 'bg-white text-slate-900 shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Career PB
                          </button>
                          <button
                            type="button"
                            onClick={() => setRelayOptBasis('SB')}
                            className={`flex-1 py-1.5 rounded-md transition cursor-pointer ${
                              relayOptBasis === 'SB'
                                ? 'bg-white text-slate-900 shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Season Best (SB)
                          </button>
                        </div>
                      </div>

                      <div className="md:col-span-3">
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                          Flying Exchange Delta (Legs 2–4)
                        </label>
                        <select
                          value={relayOptExchangeDelta}
                          onChange={(e) => setRelayOptExchangeDelta(parseFloat(e.target.value))}
                          className="w-full px-3 py-2 text-xs font-mono font-bold bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value={0}>0.00s (Raw Flat-Start Sum)</option>
                          <option value={-0.3}>-0.30s (Conservative Exchange)</option>
                          <option value={-0.45}>-0.45s (Standard College Exchange)</option>
                          <option value={-0.6}>-0.60s (Aggressive Exchange)</option>
                        </select>
                      </div>
                    </div>

                    {/* Reference Benchmarks Strip */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
                        <div className="text-[10px] font-bold uppercase text-amber-800">
                          School Relay Record
                        </div>
                        <div className="font-extrabold text-slate-900 mt-0.5 truncate">
                          {schoolRelayRec ? (
                            <>
                              <span className="font-mono text-amber-900">
                                {schoolRelayRec.time}
                              </span>{' '}
                              ({formatDisplayDateMDY(schoolRelayRec.date)})
                            </>
                          ) : (
                            <span className="text-slate-500 font-normal">No relay record in DB</span>
                          )}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs">
                        <div className="text-[10px] font-bold uppercase text-indigo-800">
                          #10 All-Time Relay Cut
                        </div>
                        <div className="font-extrabold text-slate-900 mt-0.5 truncate">
                          {tenthRelayRec ? (
                            <span className="font-mono text-indigo-900">
                              {tenthRelayRec.time}
                            </span>
                          ) : (
                            <span className="text-slate-500 font-normal">
                              {sortedRelayHist.length > 0
                                ? `Open spot (${sortedRelayHist.length}/10 relays)`
                                : 'No relay marks in DB'}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <div className="text-[10px] font-bold uppercase text-slate-600">
                          Defined Relay Standards
                        </div>
                        {matchingRelayStds.length === 0 ? (
                          <div className="text-slate-500 mt-0.5">None set for this relay</div>
                        ) : (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {matchingRelayStds.map((std) => (
                              <span
                                key={std.id}
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStandardBadgeStyle(
                                  std.label
                                )}`}
                              >
                                {std.label}: <span className="font-mono">{std.time}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {activeGenderRoster.length === 0 ? (
                      <div className="text-center py-10 text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl">
                        Add active {spec.gender} swimmers in{' '}
                        <strong>Section 1 → Master Roster</strong> to generate optimal relay
                        lineups.
                      </div>
                    ) : (
                      <>
                        {/* A-Relay & B-Relay Side-by-Side Cards */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                          {renderSquadCard(
                            'Optimal A-Relay',
                            'bg-indigo-600 text-white',
                            effectiveA,
                            totalSecA,
                            relayOptManualA,
                            setRelayOptManualA
                          )}
                          {renderSquadCard(
                            'Optimal B-Relay',
                            'bg-slate-800 text-white',
                            effectiveB,
                            totalSecB,
                            relayOptManualB,
                            setRelayOptManualB
                          )}
                        </div>

                        {/* Swimmer Availability Toggles (Scratch / Rest Swimmers from Relay Pool) */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                              Active {spec.gender} Pool Availability (Click to Scratch / Rest from
                              Auto-Optimizer)
                            </span>
                            {relayOptExcludedKeys.size > 0 && (
                              <button
                                type="button"
                                onClick={() => setRelayOptExcludedKeys(new Set())}
                                className="text-[11px] font-bold text-indigo-700 hover:underline cursor-pointer"
                              >
                                Restore All ({relayOptExcludedKeys.size} scratched)
                              </button>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {activeGenderRoster.map((ath) => {
                              const k = normalizeSwimmerKey(ath.canonicalName);
                              const isExcluded = relayOptExcludedKeys.has(k);
                              return (
                                <button
                                  key={ath.id}
                                  type="button"
                                  onClick={() => {
                                    setRelayOptExcludedKeys((prev) => {
                                      const next = new Set(prev);
                                      if (next.has(k)) next.delete(k);
                                      else next.add(k);
                                      return next;
                                    });
                                  }}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                                    isExcluded
                                      ? 'bg-slate-200/70 text-slate-400 border-slate-300 line-through'
                                      : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-400'
                                  }`}
                                >
                                  {ath.canonicalName}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })()}

              {/* SUB-TAB 2C: SWIMCLOUD OPPONENT SCOUT */}
              {inMeetSubTab === 'scout' && (() => {
                const activeScout =
                  opponentScouts.find((s) => s.id === selectedScoutId) || opponentScouts[0] || null;
                const scGenderCode = scoutGenderView === 'Men' ? 'M' : 'F';
                const embedSrc = activeScout?.swimcloudTeamId
                  ? `https://www.swimcloud.com/times/iframe/?gender=${scGenderCode}&team=${activeScout.swimcloudTeamId}&hide_gender=1`
                  : '';

                const dualEventList = getScoutDualEvents();
                const allBaseEvents = Array.from(
                  new Set(CANONICAL_EVENTS.map((ev) => ev.replace(/^(Women|Men)\s+/i, '')))
                );

                const seasonStart = getCurrentSeasonStart();
                const activeOurRoster = masterRoster.filter(
                  (a) => a.isActive && a.gender === scoutGenderView
                );

                return (
                  <div className="p-5 sm:p-6 space-y-6">
                    {/* Top Bar: Select Saved Opponent OR Create New Opponent Profile */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-200 pb-3.5">
                        <div>
                          <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                            Swimcloud Opponent Scout &amp; Live Embed Viewer
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Paste a Swimcloud team URL (e.g.,{' '}
                            <code className="font-mono">swimcloud.com/team/111/</code>), team ID, or{' '}
                            <code className="font-mono">&lt;iframe&gt;</code> embed code to view their
                            live Swimcloud Top Times right here and build a head-to-head dual
                            scouting report.
                          </p>
                        </div>

                        {opponentScouts.length > 0 && (
                          <div className="flex flex-wrap items-center gap-2">
                            <select
                              value={activeScout?.id || ''}
                              onChange={(e) => setSelectedScoutId(e.target.value)}
                              className="px-3 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              {opponentScouts.map((sc) => (
                                <option key={sc.id} value={sc.id}>
                                  {sc.teamName} ({(sc.entries || []).length} scouted marks)
                                </option>
                              ))}
                            </select>
                            {activeScout && (
                              <button
                                type="button"
                                onClick={() => handleDeleteOpponentScout(activeScout.id)}
                                title="Delete selected opponent profile"
                                className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 bg-white border border-slate-200 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Add / Link Opponent Form */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                        <div className="md:col-span-4">
                          <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                            Opponent Team Name
                          </label>
                          <input
                            type="text"
                            value={newScoutTeamName}
                            onChange={(e) => setNewScoutTeamName(e.target.value)}
                            placeholder="e.g., Swarthmore College"
                            className="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div className="md:col-span-5">
                          <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                            Swimcloud Team URL, Team ID, or &lt;iframe&gt; Code
                          </label>
                          <input
                            type="text"
                            value={newScoutSwimcloudInput}
                            onChange={(e) => setNewScoutSwimcloudInput(e.target.value)}
                            placeholder='https://www.swimcloud.com/team/111/ or <iframe src="...">'
                            className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div className="md:col-span-3 flex items-center gap-2">
                          <input
                            type="color"
                            value={newScoutColor}
                            onChange={(e) => setNewScoutColor(e.target.value)}
                            title="Opponent Accent Color"
                            className="w-9 h-9 rounded-lg border border-slate-200 bg-white p-0.5 cursor-pointer shrink-0"
                          />
                          <button
                            type="button"
                            onClick={async () => {
                              const cleanName = newScoutTeamName.trim();
                              if (!cleanName) {
                                setBenchmarkStatusMsg('Enter an opponent team name first.');
                                return;
                              }
                              const scId = extractSwimcloudTeamId(newScoutSwimcloudInput);
                              const slug = cleanName
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, '_')
                                .replace(/^_|_$/g, '');
                              const scoutId = `scout_${slug || Date.now()}`;
                              const existing = opponentScouts.find((s) => s.id === scoutId);
                              const nextScout = {
                                id: scoutId,
                                teamName: cleanName,
                                swimcloudTeamId: scId || existing?.swimcloudTeamId || '',
                                color: newScoutColor,
                                entries: existing?.entries || [],
                                updatedAt: new Date().toISOString(),
                              };
                              await persistOpponentScout(nextScout);
                              setSelectedScoutId(scoutId);
                              setNewScoutTeamName('');
                              setNewScoutSwimcloudInput('');
                              setBenchmarkStatusMsg(
                                `Saved opponent "${cleanName}"${
                                  scId ? ` (Swimcloud Team #${scId})` : ''
                                }.`
                              );
                            }}
                            className="flex-1 px-3.5 py-2 rounded-lg text-xs font-extrabold bg-indigo-600 hover:bg-indigo-500 text-white transition cursor-pointer"
                          >
                            Save Opponent
                          </button>
                        </div>
                      </div>
                    </div>

                    {!activeScout ? (
                      <div className="text-center py-10 text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl">
                        Add an opponent above (with their Swimcloud URL, Team ID, or{' '}
                        <code className="font-mono">&lt;iframe&gt;</code> embed snippet) to load
                        their live Swimcloud top times and scout matchups.
                      </div>
                    ) : (
                      <>
                        {/* Gender Switcher + Meet Format Selector + Head-to-Head Controls */}
                        <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-2.5">
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-3.5 h-3.5 rounded-full"
                                  style={{ backgroundColor: activeScout.color || '#e11d48' }}
                                />
                                <span className="font-extrabold text-sm text-slate-900">
                                  {activeScout.teamName}
                                </span>
                              </div>

                              <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-bold">
                                {['Women', 'Men'].map((g) => (
                                  <button
                                    key={g}
                                    type="button"
                                    onClick={() => {
                                      setScoutGenderView(g);
                                      setScoutPasteEventHint('');
                                    }}
                                    className={`px-3 py-1 rounded-md transition cursor-pointer ${
                                      scoutGenderView === g
                                        ? 'bg-white text-slate-900 shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                  >
                                    {g}
                                  </button>
                                ))}
                              </div>

                              <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-bold">
                                {[
                                  { id: 'SB', label: 'Compare vs. Our SB' },
                                  { id: 'PB', label: 'Compare vs. Our PB' },
                                ].map((b) => (
                                  <button
                                    key={b.id}
                                    type="button"
                                    onClick={() => setScoutOurBasis(b.id)}
                                    className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                                      scoutOurBasis === b.id
                                        ? 'bg-white text-indigo-700 shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                  >
                                    {b.label}
                                  </button>
                                ))}
                              </div>

                              <select
                                value={scoutFormatPreset}
                                onChange={(e) => setScoutFormatPreset(e.target.value)}
                                title="Dual Meet Event Format"
                                className="px-2.5 py-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              >
                                <option value="200MR_200IM_200FR">Format: 200 MR / 200 IM / 200 FR</option>
                                <option value="200MR_200IM_400FR">Format: 200 MR / 200 IM / 400 FR</option>
                                <option value="200MR_400IM_200FR">Format: 200 MR / 400 IM / 200 FR</option>
                                <option value="200MR_400IM_400FR">Format: 200 MR / 400 IM / 400 FR</option>
                                <option value="400MR_200IM_200FR">Format: 400 MR / 200 IM / 200 FR</option>
                                <option value="400MR_200IM_400FR">Format: 400 MR / 200 IM / 400 FR</option>
                                <option value="400MR_400IM_200FR">Format: 400 MR / 400 IM / 200 FR</option>
                                <option value="400MR_400IM_400FR">Format: 400 MR / 400 IM / 400 FR</option>
                                <option value="CUSTOM">Format: Custom Event Lineup ({scoutCustomEvents.length})</option>
                              </select>
                            </div>

                            <button
                              type="button"
                              disabled={(activeScout.entries || []).length === 0}
                              onClick={() => handleLoadScoutIntoSimulator(activeScout)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white shadow-xs transition cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Load Dual Matchup into Score Simulator</span>
                            </button>
                          </div>

                          {/* Custom Event Order Builder when Format === 'CUSTOM' */}
                          {scoutFormatPreset === 'CUSTOM' && (
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5 text-xs">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600">
                                  Custom Meet Event Lineup ({scoutCustomEvents.length} Events — Both Genders)
                                </span>
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <select
                                    value={scoutCustomEventToAdd}
                                    onChange={(e) => setScoutCustomEventToAdd(e.target.value)}
                                    className="px-2.5 py-1 text-xs font-bold bg-white border border-slate-200 rounded-lg"
                                  >
                                    {allBaseEvents.map((ev) => (
                                      <option key={ev} value={ev}>
                                        {ev}
                                      </option>
                                    ))}
                                  </select>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setScoutCustomEvents((prev) => [...prev, scoutCustomEventToAdd])
                                    }
                                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
                                  >
                                    + Add Event
                                  </button>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-1.5">
                                {scoutCustomEvents.map((evName, idx) => (
                                  <div
                                    key={`${evName}-${idx}`}
                                    className="inline-flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-800"
                                  >
                                    <span className="font-mono text-slate-400">#{idx + 1}</span>
                                    <span>{evName}</span>
                                    <button
                                      type="button"
                                      disabled={idx === 0}
                                      onClick={() =>
                                        setScoutCustomEvents((prev) => {
                                          const next = [...prev];
                                          [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                                          return next;
                                        })
                                      }
                                      title="Move earlier"
                                      className="text-slate-400 hover:text-slate-800 disabled:opacity-30 px-0.5 cursor-pointer"
                                    >
                                      ↑
                                    </button>
                                    <button
                                      type="button"
                                      disabled={idx === scoutCustomEvents.length - 1}
                                      onClick={() =>
                                        setScoutCustomEvents((prev) => {
                                          const next = [...prev];
                                          [next[idx + 1], next[idx]] = [next[idx], next[idx + 1]];
                                          return next;
                                        })
                                      }
                                      title="Move later"
                                      className="text-slate-400 hover:text-slate-800 disabled:opacity-30 px-0.5 cursor-pointer"
                                    >
                                      ↓
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setScoutCustomEvents((prev) =>
                                          prev.filter((_, i) => i !== idx)
                                        )
                                      }
                                      title="Remove event"
                                      className="text-slate-400 hover:text-red-600 pl-0.5 cursor-pointer"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Live Swimcloud Embed + Copy-Paste Importer Split Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                          {/* Left: Live Swimcloud Team Times Iframe */}
                          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col">
                            <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between gap-2 text-xs">
                              <span className="font-bold">
                                Live Swimcloud Widget — {activeScout.teamName} ({scoutGenderView})
                              </span>
                              {activeScout.swimcloudTeamId ? (
                                <a
                                  href={`https://www.swimcloud.com/team/${activeScout.swimcloudTeamId}/times/?gender=${scGenderCode}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-cyan-300 hover:underline font-semibold"
                                >
                                  Open on Swimcloud ↗
                                </a>
                              ) : (
                                <span className="text-slate-400">No Swimcloud Team ID linked</span>
                              )}
                            </div>

                            {embedSrc ? (
                              <iframe
                                key={embedSrc}
                                src={embedSrc}
                                title={`Swimcloud ${activeScout.teamName} ${scoutGenderView} Times`}
                                className="w-full h-[460px] border-0 bg-white"
                              />
                            ) : (
                              <div className="p-8 text-center text-xs text-slate-500 space-y-2 my-auto">
                                <p>
                                  No Swimcloud Team ID was saved for{' '}
                                  <strong>{activeScout.teamName}</strong> yet.
                                </p>
                                <p>
                                  Re-save with their Swimcloud URL (e.g.{' '}
                                  <code className="font-mono">swimcloud.com/team/111/</code>) or
                                  paste times directly on the right.
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Right: Paste Copied Swimcloud Times to Save & Score */}
                          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                            <div className="space-y-2.5">
                              <div className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                                Import Copied Swimcloud Times ({scoutGenderView})
                              </div>
                              <p className="text-[11px] text-slate-500 leading-relaxed">
                                Highlight &amp; copy (<code className="font-mono">Ctrl+C</code>) the
                                times from the Swimcloud frame on the left (or any Swimcloud Top
                                Times page), choose the event if copying a single event table, and
                                paste below.
                              </p>

                              <div>
                                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                                  Default Event (if copied block has no event header)
                                </label>
                                <select
                                  value={scoutPasteEventHint}
                                  onChange={(e) => setScoutPasteEventHint(e.target.value)}
                                  className="w-full px-2.5 py-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg"
                                >
                                  <option value="">Auto-detect Event Headers from Paste</option>
                                  {CANONICAL_EVENTS.filter((ev) =>
                                    ev.startsWith(scoutGenderView)
                                  ).map((ev) => (
                                    <option key={ev} value={ev.toLowerCase()}>
                                      {ev}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <textarea
                                rows={10}
                                value={scoutPasteText}
                                onChange={(e) => setScoutPasteText(e.target.value)}
                                placeholder={`Paste copied Swimcloud rows here...\nExample:\n1\tSmith, John\tJR\t20.84\n2\tDoe, Alex\tSO\t21.19`}
                                className="w-full p-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                              <button
                                type="button"
                                disabled={!scoutPasteText.trim()}
                                onClick={async () => {
                                  const newEntries = parseSwimcloudPastedTimes(
                                    scoutPasteText,
                                    scoutGenderView,
                                    scoutPasteEventHint
                                  );
                                  if (newEntries.length === 0) {
                                    setBenchmarkStatusMsg(
                                      'Could not detect valid swimmer names and times. Try selecting a Default Event above and pasting the Swimcloud rows again.'
                                    );
                                    return;
                                  }
                                  const existing = activeScout.entries || [];
                                  const mergedMap = new Map(
                                    existing.map((e) => [`${e.swimmerKey}|${e.eventKey}`, e])
                                  );
                                  newEntries.forEach((ne) => {
                                    const k = `${ne.swimmerKey}|${ne.eventKey}`;
                                    if (!mergedMap.has(k) || ne.seconds < mergedMap.get(k).seconds) {
                                      mergedMap.set(k, ne);
                                    }
                                  });
                                  const updatedScout = {
                                    ...activeScout,
                                    entries: Array.from(mergedMap.values()),
                                    updatedAt: new Date().toISOString(),
                                  };
                                  await persistOpponentScout(updatedScout);
                                  setScoutPasteText('');
                                  setBenchmarkStatusMsg(
                                    `Imported ${newEntries.length} ${scoutGenderView} marks for ${activeScout.teamName} (${updatedScout.entries.length} total scouted times).`
                                  );
                                }}
                                className="flex-1 px-3.5 py-2 rounded-xl text-xs font-extrabold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition cursor-pointer"
                              >
                                Parse &amp; Save Times
                              </button>

                              {(activeScout.entries || []).some(
                                (e) => e.gender === scoutGenderView
                              ) && (
                                <button
                                  type="button"
                                  onClick={async () => {
                                    const remaining = (activeScout.entries || []).filter(
                                      (e) => e.gender !== scoutGenderView
                                    );
                                    await persistOpponentScout({
                                      ...activeScout,
                                      entries: remaining,
                                      updatedAt: new Date().toISOString(),
                                    });
                                    setBenchmarkStatusMsg(
                                      `Cleared ${scoutGenderView} scouted times for ${activeScout.teamName}.`
                                    );
                                  }}
                                  className="px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 cursor-pointer"
                                >
                                  Clear {scoutGenderView}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Head-to-Head Event Matchup Comparison Board */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-extrabold text-slate-900">
                              Head-to-Head Matchup Board: Gettysburg ({scoutOurBasis}) vs.{' '}
                              {activeScout.teamName} ({scoutGenderView})
                            </h4>
                            <span className="text-xs text-slate-500">
                              Top 3 per team ranked head-to-head
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {dualEventList.map((baseEv) => {
                              const fullEvLabel = `${scoutGenderView} ${baseEv}`;
                              const evKey = fullEvLabel.toLowerCase();
                              const isRelay = baseEv.toLowerCase().includes('relay');

                              const ourTop = [];
                              if (!isRelay) {
                                const bestByAth = new Map();
                                activeOurRoster.forEach((ath) => {
                                  const swKey = normalizeSwimmerKey(ath.canonicalName);
                                  const pool = historicalRecords.filter((r) => {
                                    if (r.isOfficial === false || r.eventKey !== evKey) return false;
                                    const m = resolveMasterAthlete(r.swimmerName);
                                    const k = normalizeSwimmerKey(
                                      m ? m.canonicalName : r.swimmerName
                                    );
                                    if (k !== swKey) return false;
                                    if (scoutOurBasis === 'SB') {
                                      return Boolean(r.dateObj && r.dateObj >= seasonStart);
                                    }
                                    return true;
                                  });
                                  if (pool.length > 0) {
                                    const best = pool.reduce((b, c) =>
                                      c.seconds < b.seconds ? c : b
                                    );
                                    bestByAth.set(swKey, {
                                      name: ath.canonicalName,
                                      time: best.time,
                                      seconds: best.seconds,
                                      team: 'Gettysburg',
                                      color: '#0284c7',
                                    });
                                  }
                                });
                                ourTop.push(
                                  ...Array.from(bestByAth.values())
                                    .sort((a, b) => a.seconds - b.seconds)
                                    .slice(0, 3)
                                );
                              } else {
                                historicalRecords
                                  .filter((r) => r.isOfficial !== false && r.eventKey === evKey)
                                  .sort((a, b) => a.seconds - b.seconds)
                                  .slice(0, 2)
                                  .forEach((rel, i) => {
                                    ourTop.push({
                                      name: `Gettysburg "${i === 0 ? 'A' : 'B'}"`,
                                      time: rel.time,
                                      seconds: rel.seconds,
                                      team: 'Gettysburg',
                                      color: '#0284c7',
                                    });
                                  });
                              }

                              const oppTop = (activeScout.entries || [])
                                .filter((e) => e.eventKey === evKey)
                                .sort((a, b) => a.seconds - b.seconds)
                                .slice(0, isRelay ? 2 : 3)
                                .map((e) => ({
                                  name: e.classYear ? `${e.swimmerName} (${e.classYear})` : e.swimmerName,
                                  time: e.time,
                                  seconds: e.seconds,
                                  team: activeScout.teamName,
                                  color: activeScout.color || '#e11d48',
                                }));

                              const combined = [...ourTop, ...oppTop].sort(
                                (a, b) => a.seconds - b.seconds
                              );
                              const isSwingRace =
                                combined.length >= 2 &&
                                Math.abs(combined[0].seconds - combined[1].seconds) <= 0.65 &&
                                combined[0].team !== combined[1].team;

                              return (
                                <div
                                  key={evKey}
                                  className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs"
                                >
                                  <div className="bg-slate-100 px-3.5 py-2 border-b border-slate-200 flex items-center justify-between gap-2">
                                    <span className="font-extrabold text-xs text-slate-900">
                                      {fullEvLabel}
                                    </span>
                                    {isSwingRace && (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                        Swing Race (≤0.65s)
                                      </span>
                                    )}
                                  </div>

                                  {combined.length === 0 ? (
                                    <div className="p-3.5 text-[11px] text-slate-400 italic">
                                      No marks recorded yet for this event.
                                    </div>
                                  ) : (
                                    <div className="divide-y divide-slate-100 text-xs">
                                      {combined.map((item, idx) => (
                                        <div
                                          key={`${item.team}-${item.name}-${idx}`}
                                          style={{ boxShadow: `inset 4px 0 0 ${item.color}` }}
                                          className="px-3.5 py-2 flex items-center justify-between gap-2"
                                        >
                                          <div className="min-w-0">
                                            <span className="font-mono font-bold text-slate-400 mr-2">
                                              #{idx + 1}
                                            </span>
                                            <span className="font-bold text-slate-900">
                                              {item.name}
                                            </span>
                                            <span className="text-[11px] text-slate-500 ml-1.5">
                                              ({item.team})
                                            </span>
                                          </div>
                                          <span className="font-mono font-extrabold text-slate-800 shrink-0">
                                            {item.time}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })()}

              {/* SUB-TAB 3: QUALIFYING STANDARDS & POOL RECORDS */}
              {inMeetSubTab === 'standards' && (
                <div className="p-5 sm:p-6 space-y-5">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                          Category
                        </label>
                        <select
                          value={newStdType}
                          onChange={(e) => setNewStdType(e.target.value)}
                          className="w-full px-2.5 py-2 text-xs font-bold bg-white border border-slate-200 rounded-lg"
                        >
                          <option value="STANDARD">Qualifying Cut</option>
                          <option value="POOL_RECORD">Pool Record</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                          Badge Label
                        </label>
                        <input
                          type="text"
                          value={newStdLabel}
                          onChange={(e) => setNewStdLabel(e.target.value)}
                          placeholder="e.g., Pool Record"
                          className="w-full px-2.5 py-2 text-xs font-bold bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div className="lg:col-span-2">
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                          Event
                        </label>
                        <select
                          value={newStdEventKey}
                          onChange={(e) => setNewStdEventKey(e.target.value)}
                          className="w-full px-2.5 py-2 text-xs font-bold bg-white border border-slate-200 rounded-lg"
                        >
                          {CANONICAL_EVENTS.map((ev) => (
                            <option key={ev} value={ev.toLowerCase()}>
                              {ev}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                          Record Holder
                        </label>
                        <input
                          type="text"
                          value={newStdHolder}
                          onChange={(e) => setNewStdHolder(e.target.value)}
                          placeholder="Optional (e.g., Jane Doe)"
                          className="w-full px-2.5 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                          Date
                        </label>
                        <input
                          type="date"
                          value={newStdDate}
                          onChange={(e) => setNewStdDate(e.target.value)}
                          className="w-full px-2.5 py-2 text-xs font-mono bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <input
                        type="text"
                        value={newStdTime}
                        onChange={(e) => setNewStdTime(e.target.value)}
                        placeholder="Time (e.g., 23.15)"
                        className="w-40 px-2.5 py-2 text-xs font-mono font-bold bg-white border border-slate-200 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const cleanLbl = newStdLabel.trim();
                          const secVal = timeToSeconds(newStdTime);
                          if (!cleanLbl || secVal === null) return;
                          const created = {
                            id: `std-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                            type: newStdType,
                            label: cleanLbl,
                            eventKey: newStdEventKey,
                            eventLabel: toTitleEventLabel(newStdEventKey),
                            time: newStdTime.trim(),
                            seconds: secVal,
                            holder: newStdHolder.trim(),
                            date: normalizeDateIso(newStdDate),
                          };
                          updateQualStandardsList([...qualStandards, created], created);
                          setNewStdTime('');
                          setNewStdHolder('');
                          setNewStdDate('');
                        }}
                        className="px-4 py-2 rounded-lg text-xs font-extrabold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer shrink-0"
                      >
                        Add Standard / Record
                      </button>
                    </div>
                  </div>

                  {qualStandards.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl">
                      Add qualifying standards (such as `NCAA B` or `Conference Cut`) or pool records
                      above to highlight matching swims on the Heat Sheet and in Section 4 results.
                    </div>
                  ) : (
                    <div className="overflow-x-auto border border-slate-200 rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px]">
                          <tr>
                            <th className="py-2.5 px-4">Type</th>
                            <th className="py-2.5 px-4">Badge</th>
                            <th className="py-2.5 px-4">Event</th>
                            <th className="py-2.5 px-4">Time</th>
                            <th className="py-2.5 px-4">Record Holder</th>
                            <th className="py-2.5 px-4">Date</th>
                            <th className="py-2.5 px-4 text-center w-32">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {qualStandards.map((std) => {
                            const isEditingStd = editingStdId === std.id;
                            if (isEditingStd) {
                              return (
                                <tr key={std.id} className="bg-indigo-50/70">
                                  <td className="py-2.5 px-4">
                                    <select
                                      value={editStdDraft.type}
                                      onChange={(e) =>
                                        setEditStdDraft((prev) => ({
                                          ...prev,
                                          type: e.target.value,
                                        }))
                                      }
                                      className="px-2 py-1.5 text-xs font-bold bg-white border border-indigo-300 rounded-lg"
                                    >
                                      <option value="STANDARD">Qualifying Cut</option>
                                      <option value="POOL_RECORD">Pool Record</option>
                                    </select>
                                  </td>
                                  <td className="py-2.5 px-4">
                                    <input
                                      type="text"
                                      value={editStdDraft.label}
                                      onChange={(e) =>
                                        setEditStdDraft((prev) => ({
                                          ...prev,
                                          label: e.target.value,
                                        }))
                                      }
                                      className="w-28 px-2.5 py-1.5 text-xs font-bold bg-white border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                  </td>
                                  <td className="py-2.5 px-4">
                                    <select
                                      value={editStdDraft.eventKey}
                                      onChange={(e) =>
                                        setEditStdDraft((prev) => ({
                                          ...prev,
                                          eventKey: e.target.value,
                                        }))
                                      }
                                      className="w-full min-w-[170px] px-2.5 py-1.5 text-xs font-bold bg-white border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                      {CANONICAL_EVENTS.map((ev) => (
                                        <option key={ev} value={ev.toLowerCase()}>
                                          {ev}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                  <td className="py-2.5 px-4">
                                    <input
                                      type="text"
                                      value={editStdDraft.time}
                                      onChange={(e) =>
                                        setEditStdDraft((prev) => ({
                                          ...prev,
                                          time: e.target.value,
                                        }))
                                      }
                                      className="w-24 px-2.5 py-1.5 text-xs font-mono font-bold bg-white border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                  </td>
                                  <td className="py-2.5 px-4">
                                    <input
                                      type="text"
                                      value={editStdDraft.holder}
                                      onChange={(e) =>
                                        setEditStdDraft((prev) => ({
                                          ...prev,
                                          holder: e.target.value,
                                        }))
                                      }
                                      placeholder="Holder name..."
                                      className="w-36 px-2.5 py-1.5 text-xs bg-white border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                  </td>
                                  <td className="py-2.5 px-4">
                                    <input
                                      type="date"
                                      value={editStdDraft.date}
                                      onChange={(e) =>
                                        setEditStdDraft((prev) => ({
                                          ...prev,
                                          date: e.target.value,
                                        }))
                                      }
                                      className="px-2 py-1.5 text-xs font-mono bg-white border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                  </td>
                                  <td className="py-2.5 px-4 text-center">
                                    <div className="inline-flex items-center gap-1">
                                      <button
                                        type="button"
                                        onClick={() => handleSaveQualStandardEdit(std.id)}
                                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                                      >
                                        Save
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setEditingStdId(null)}
                                        className="px-2 py-1 rounded-lg text-[11px] font-semibold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            }

                            return (
                              <tr key={std.id} className="hover:bg-slate-50">
                                <td className="py-2.5 px-4 text-slate-600">
                                  {std.type === 'POOL_RECORD' ? 'Pool Record' : 'Qualifying Cut'}
                                </td>
                                <td className="py-2.5 px-4">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStandardBadgeStyle(
                                      std.label
                                    )}`}
                                  >
                                    {std.label}
                                  </span>
                                </td>
                                <td className="py-2.5 px-4 font-bold text-slate-900">
                                  {std.eventLabel}
                                </td>
                                <td className="py-2.5 px-4 font-mono font-bold text-indigo-800">
                                  {std.time}
                                </td>
                                <td className="py-2.5 px-4 text-slate-700 font-medium">
                                  {std.holder || <span className="text-slate-400">—</span>}
                                </td>
                                <td className="py-2.5 px-4 font-mono text-slate-500">
                                  {std.date ? formatDisplayDateMDY(std.date) : '—'}
                                </td>
                                <td className="py-2.5 px-4 text-center">
                                  <div className="inline-flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingStdId(std.id);
                                        setEditStdDraft({
                                          type: std.type || 'STANDARD',
                                          label: std.label || '',
                                          eventKey: std.eventKey || 'women 50 freestyle',
                                          time: std.time || '',
                                          holder: std.holder || '',
                                          date: normalizeDateIso(std.date || ''),
                                        });
                                      }}
                                      className="px-2 py-1 rounded text-[11px] font-bold text-indigo-700 hover:bg-indigo-50 border border-indigo-200 cursor-pointer"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (editingStdId === std.id) setEditingStdId(null);
                                        updateQualStandardsList(
                                          qualStandards.filter((item) => item.id !== std.id),
                                          null,
                                          std.id
                                        );
                                      }}
                                      title="Delete standard or record"
                                      className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
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
        {/* SECTION 4: IMPORT MEET RESULTS (EXACT ORIGINAL PARSER & LAYOUT)      */}
        {/* ==================================================================== */}
        {activeSection === 'import' && (
          <div className="space-y-6">
            <input
              ref={fileInputRef}
              type="file"
              accept=".cl2,.sd3,.txt"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                e.target.value = '';
              }}
            />

            {/* Compact Command Center Upload & Quick-Load Bar */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingMeet(true);
              }}
              onDragLeave={() => setIsDraggingMeet(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingMeet(false);
                if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
              }}
              className={`bg-white rounded-2xl border-2 border-dashed p-4 sm:p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm ${
                isDraggingMeet
                  ? 'border-cyan-500 bg-cyan-50/70'
                  : 'border-slate-300 hover:border-cyan-400'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                    Hy-Tek Meet Results Importer (.CL2 / .SD3)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Drag &amp; drop a <code className="font-mono text-slate-700">.cl2</code> or{' '}
                    <code className="font-mono text-slate-700">.sd3</code> results file anywhere in
                    this box, or choose a file to parse below.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-cyan-400" />
                  Select .CL2 / .SD3 File
                </button>
                <button
                  onClick={() => handleProcessMeetText(SAMPLE_CL2_DATA, { autoSave: false })}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-sm transition cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Load Sample Meet
                </button>
              </div>
            </div>

            {/* Saved Meet Repository ("Load Past Meet") */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                    Saved Meet Repository ({savedMeets.length})
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Uploaded <code className="font-mono">.cl2</code> /{' '}
                    <code className="font-mono">.sd3</code> files auto-save here and sync across
                    browsers so you can load or refresh any meet anytime.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <select
                  value={selectedSavedMeetId}
                  onChange={(e) => handleLoadSavedMeet(e.target.value)}
                  disabled={savedMeets.length === 0}
                  className="px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[230px] max-w-xs"
                >
                  <option value="">
                    {savedMeets.length === 0
                      ? 'No saved meets yet'
                      : '-- Load Past / Saved Meet --'}
                  </option>
                  {savedMeets.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} {m.startDate ? `(${m.startDate})` : ''} — {m.swimCount} swims
                    </option>
                  ))}
                </select>

                {selectedSavedMeetId && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleLoadSavedMeet(selectedSavedMeetId)}
                      title="Reload latest version of this saved meet"
                      className="px-3 py-2 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 transition cursor-pointer"
                    >
                      Reload
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSavedMeet(selectedSavedMeetId)}
                      title="Delete this saved meet from repository"
                      className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Error Alert */}
            {meetErrorMsg && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start justify-between gap-3 text-red-800 shadow-sm">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold">Unable to Parse File</h3>
                    <p className="text-sm text-red-700 mt-0.5">{meetErrorMsg}</p>
                  </div>
                </div>
                <button
                  onClick={() => setMeetErrorMsg('')}
                  className="text-red-500 hover:text-red-700 p-1 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Parsed Meet Results View (Always visible below the compact upload bar) */}
            {!parsedData ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 px-6 py-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300">
                      Ready to Parse
                    </span>
                    <h3 className="text-lg font-bold tracking-tight mt-0.5">
                      No Meet File Loaded Yet
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Select a `.cl2` / `.sd3` file above or load the sample meet to populate team
                      scores, event results, splits, and relays here.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 shrink-0">
                    <div className="bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-center">
                      <div className="text-[11px] text-cyan-200 font-medium uppercase">Teams</div>
                      <div className="text-lg font-bold text-white">—</div>
                    </div>
                    <div className="bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-center">
                      <div className="text-[11px] text-cyan-200 font-medium uppercase">Swimmers</div>
                      <div className="text-lg font-bold text-white">—</div>
                    </div>
                    <div className="bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-center">
                      <div className="text-[11px] text-cyan-200 font-medium uppercase">Swims</div>
                      <div className="text-lg font-bold text-white">—</div>
                    </div>
                  </div>
                </div>
                <div className="p-8 text-center text-xs sm:text-sm text-slate-500">
                  Individual results, relay splits, and Women&apos;s / Men&apos;s team scoreboards
                  will populate right here as soon as a meet file is imported.
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Meet Summary Banner Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 px-6 py-5 text-white flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                        {parsedData.meetInfo.name}
                      </h2>
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-2 text-sm text-slate-300">
                        {parsedData.meetInfo.startDate && (
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-cyan-400" />
                            {parsedData.meetInfo.startDate}
                          </span>
                        )}
                        {(parsedData.meetInfo.city || parsedData.meetInfo.state) && (
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-cyan-400" />
                            {[parsedData.meetInfo.city, parsedData.meetInfo.state]
                              .filter(Boolean)
                              .join(', ')}
                          </span>
                        )}
                        {parsedData.meetInfo.software && (
                          <span className="inline-flex items-center gap-1.5 text-xs bg-white/10 px-2.5 py-0.5 rounded-full text-slate-200">
                            {parsedData.meetInfo.software}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-4">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm transition cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Import New .CL2</span>
                        </button>
                        <button
                          onClick={handleExportMeetCSV}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Export CSV</span>
                        </button>
                        <button
                          onClick={handleExportWebRecapHtml}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Export Web Recap (.HTML)</span>
                        </button>
                        <button
                          onClick={() => setActiveSection('postmeet')}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-cyan-200 border border-white/15 transition cursor-pointer"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Post-Meet Wins & Commit</span>
                        </button>
                      </div>
                    </div>

                    {/* KPI Stats Pills */}
                    <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0">
                      <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-center">
                        <div className="text-xs text-cyan-200 font-medium uppercase tracking-wider">
                          Teams
                        </div>
                        <div className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                          {parsedData.stats.totalTeams}
                        </div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-center">
                        <div className="text-xs text-cyan-200 font-medium uppercase tracking-wider">
                          Swimmers
                        </div>
                        <div className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                          {parsedData.stats.totalSwimmers}
                        </div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-center">
                        <div className="text-xs text-cyan-200 font-medium uppercase tracking-wider">
                          Total Swims
                        </div>
                        <div className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                          {parsedData.stats.totalSwims}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Women's & Men's Team Scoreboards */}
                  {parsedData.teamScores && parsedData.teamScores.length > 0 && (
                    <div className="px-4 sm:px-6 py-4 bg-white border-t border-slate-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Women's Team Score Card */}
                        {(() => {
                          const womenSorted = [...parsedData.teamScores].sort(
                            (a, b) => b.womenPoints - a.womenPoints
                          );
                          return (
                            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                              <div className="flex items-center justify-between mb-2.5">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                                  Women&apos;s Team Scores
                                </span>
                                {womenSorted.length === 2 && (
                                  <span className="text-xs font-mono font-bold text-cyan-800 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded-full">
                                    {womenSorted[0].womenPoints} – {womenSorted[1].womenPoints}
                                  </span>
                                )}
                              </div>
                              <div className="space-y-1.5">
                                {womenSorted.map((t, idx) => (
                                  <div
                                    key={`w-${t.code}`}
                                    onClick={() => {
                                      setSelectedTeam(t.code);
                                      try {
                                        localStorage.setItem('swimmeet_primary_team_v1', t.code);
                                      } catch {}
                                    }}
                                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer transition ${
                                      idx === 0 && t.womenPoints > 0
                                        ? 'bg-white border border-amber-200 shadow-2xs font-bold text-slate-900'
                                        : 'bg-white/70 border border-slate-200/70 text-slate-700 font-medium hover:bg-white'
                                    }`}
                                  >
                                    <span className="truncate pr-2">{t.name}</span>
                                    <span className="font-mono font-bold tabular-nums">
                                      {t.womenPoints}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}

                        {/* Men's Team Score Card */}
                        {(() => {
                          const menSorted = [...parsedData.teamScores].sort(
                            (a, b) => b.menPoints - a.menPoints
                          );
                          return (
                            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                              <div className="flex items-center justify-between mb-2.5">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                                  Men&apos;s Team Scores
                                </span>
                                {menSorted.length === 2 && (
                                  <span className="text-xs font-mono font-bold text-cyan-800 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded-full">
                                    {menSorted[0].menPoints} – {menSorted[1].menPoints}
                                  </span>
                                )}
                              </div>
                              <div className="space-y-1.5">
                                {menSorted.map((t, idx) => (
                                  <div
                                    key={`m-${t.code}`}
                                    onClick={() => {
                                      setSelectedTeam(t.code);
                                      try {
                                        localStorage.setItem('swimmeet_primary_team_v1', t.code);
                                      } catch {}
                                    }}
                                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer transition ${
                                      idx === 0 && t.menPoints > 0
                                        ? 'bg-white border border-amber-200 shadow-2xs font-bold text-slate-900'
                                        : 'bg-white/70 border border-slate-200/70 text-slate-700 font-medium hover:bg-white'
                                    }`}
                                  >
                                    <span className="truncate pr-2">{t.name}</span>
                                    <span className="font-mono font-bold tabular-nums">
                                      {t.menPoints}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {/* View Switcher Tabs */}
                  <div className="px-4 sm:px-6 bg-slate-50/80 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1 -mb-px overflow-x-auto">
                      <button
                        onClick={() => {
                          setMeetSubTab('individual');
                          setSelectedEventFilter('ALL');
                        }}
                        className={`px-4 py-3.5 text-sm font-semibold border-b-2 transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                          meetSubTab === 'individual'
                            ? 'border-cyan-600 text-cyan-700'
                            : 'border-transparent text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Timer className="w-4 h-4" />
                        Individual Results
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                          {parsedData.individualResults.length}
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setMeetSubTab('relays');
                          setSelectedEventFilter('ALL');
                        }}
                        className={`px-4 py-3.5 text-sm font-semibold border-b-2 transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                          meetSubTab === 'relays'
                            ? 'border-cyan-600 text-cyan-700'
                            : 'border-transparent text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Layers className="w-4 h-4" />
                        Relay Results
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                          {parsedData.relayResults.length}
                        </span>
                      </button>

                      <button
                        onClick={() => setMeetSubTab('roster')}
                        className={`px-4 py-3.5 text-sm font-semibold border-b-2 transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                          meetSubTab === 'roster'
                            ? 'border-cyan-600 text-cyan-700'
                            : 'border-transparent text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Users className="w-4 h-4" />
                        Team Roster
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                          {parsedData.stats.totalSwimmers}
                        </span>
                      </button>
                    </div>

                    <div className="py-2 text-xs text-slate-500 hidden md:block">
                      Tip: Click any row with splits or relay legs to inspect detailed breakdowns
                    </div>
                  </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
                    <div className="lg:col-span-4 relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search swimmer, team, or event..."
                        className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="lg:col-span-3">
                      <select
                        value={selectedTeam}
                        onChange={(e) => {
                          setSelectedTeam(e.target.value);
                          try {
                            localStorage.setItem('swimmeet_primary_team_v1', e.target.value);
                          } catch {}
                        }}
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white"
                      >
                        <option value="ALL">All Teams ({parsedData.teams.length})</option>
                        {parsedData.teams.map((t) => (
                          <option key={t.code} value={t.code}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {meetSubTab !== 'roster' ? (
                      <div className="lg:col-span-3">
                        <select
                          value={selectedEventFilter}
                          onChange={(e) => setSelectedEventFilter(e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white"
                        >
                          <option value="ALL">All Events ({availableMeetEvents.length})</option>
                          {availableMeetEvents.map((ev) => (
                            <option key={ev.label} value={ev.label}>
                              #{ev.num} — {ev.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="lg:col-span-3 hidden lg:block" />
                    )}

                    <div className="lg:col-span-2 flex bg-slate-100 p-1 rounded-lg border border-slate-200/80">
                      {['ALL', 'Men', 'Women'].map((g) => (
                        <button
                          key={g}
                          onClick={() => setGenderFilter(g)}
                          className={`flex-1 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                            genderFilter === g
                              ? 'bg-white text-slate-900 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {g === 'ALL' ? 'All' : g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* TAB 1: INDIVIDUAL RESULTS (GROUPED BY EVENT CARDS) */}
                {meetSubTab === 'individual' && (
                  <div className="space-y-6">
                    {groupedIndividualEvents.length === 0 ? (
                      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm py-12 text-center text-slate-500 text-sm">
                        No individual swim results match the current filter criteria.
                      </div>
                    ) : (
                      groupedIndividualEvents.map((eventGroup) => {
                        const expandableSwims = eventGroup.swims.filter(
                          (r) => r.splits && r.splits.length > 0
                        );
                        const allExpanded =
                          expandableSwims.length > 0 &&
                          expandableSwims.every((r) => expandedRows.has(r.id));

                        return (
                          <div
                            key={eventGroup.key}
                            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                          >
                            <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                                  Event #{eventGroup.eventNumber}
                                </span>
                                <div>
                                  <h3 className="text-base font-bold tracking-tight">
                                    {eventGroup.eventLabel}
                                  </h3>
                                  <p className="text-xs text-slate-400">
                                    {eventGroup.swims.length}{' '}
                                    {eventGroup.swims.length === 1 ? 'Swimmer' : 'Swimmers'} •{' '}
                                    {eventGroup.course}
                                  </p>
                                </div>
                              </div>

                              {expandableSwims.length > 0 && (
                                <button
                                  type="button"
                                  onClick={() => toggleAllIndividualsInEvent(eventGroup.swims)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition cursor-pointer"
                                >
                                  {allExpanded ? (
                                    <>
                                      <ChevronDown className="w-3.5 h-3.5" />
                                      <span>Collapse All Splits</span>
                                    </>
                                  ) : (
                                    <>
                                      <ChevronRight className="w-3.5 h-3.5" />
                                      <span>Expand All Splits</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>

                            <div className="overflow-x-auto">
                              <table className="w-full text-left border-collapse">
                                <thead>
                                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                                    <th className="py-3 pl-4 pr-2 w-10"></th>
                                    <th
                                      onClick={() => handleSort('place')}
                                      className="py-3 px-3 w-20 text-center cursor-pointer hover:text-slate-900 select-none"
                                    >
                                      <div className="flex items-center justify-center gap-1">
                                        <span>Place</span>
                                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                                      </div>
                                    </th>
                                    <th
                                      onClick={() => handleSort('swimmerName')}
                                      className="py-3 px-3 cursor-pointer hover:text-slate-900 select-none"
                                    >
                                      <div className="flex items-center gap-1">
                                        <span>Swimmer</span>
                                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                                      </div>
                                    </th>
                                    <th
                                      onClick={() => handleSort('teamName')}
                                      className="py-3 px-3 cursor-pointer hover:text-slate-900 select-none"
                                    >
                                      <div className="flex items-center gap-1">
                                        <span>Team</span>
                                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                                      </div>
                                    </th>
                                    <th
                                      onClick={() => handleSort('time')}
                                      className="py-3 px-3 text-right cursor-pointer hover:text-slate-900 select-none"
                                    >
                                      <div className="flex items-center justify-end gap-1">
                                        <span>Prelims</span>
                                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                                      </div>
                                    </th>
                                    <th
                                      onClick={() => handleSort('time')}
                                      className="py-3 px-3 text-right cursor-pointer hover:text-slate-900 select-none"
                                    >
                                      <div className="flex items-center justify-end gap-1">
                                        <span>Finals</span>
                                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                                      </div>
                                    </th>
                                    <th className="py-3 px-3 text-right w-28">Behind</th>
                                    <th className="py-3 px-3 text-center w-16">Pts</th>
                                    <th className="py-3 pl-3 pr-5 text-right w-28">Splits</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                  {eventGroup.swims.map((row) => {
                                    const hasFinalsSplits =
                                      row.finalsSplits && row.finalsSplits.length > 0;
                                    const hasPrelimSplits =
                                      row.prelimSplits && row.prelimSplits.length > 0;
                                    const hasSplits =
                                      hasFinalsSplits ||
                                      hasPrelimSplits ||
                                      (row.splits && row.splits.length > 0);
                                    const isExpanded = expandedRows.has(row.id);
                                    const primarySplitArr = hasFinalsSplits
                                      ? row.finalsSplits
                                      : hasPrelimSplits
                                      ? row.prelimSplits
                                      : row.splits;
                                    const splitAnalysis = isExpanded
                                      ? calculateSplitBreakdown(
                                          primarySplitArr,
                                          row.distance,
                                          row.splitInterval,
                                          row.splitType
                                        )
                                      : null;
                                    const prelimSplitAnalysis =
                                      isExpanded && hasFinalsSplits && hasPrelimSplits
                                        ? calculateSplitBreakdown(
                                            row.prelimSplits,
                                            row.distance,
                                            row.splitInterval,
                                            row.splitType
                                          )
                                        : null;
                                    const behindSec =
                                      isFinite(row.timeSeconds) &&
                                      isFinite(eventGroup.fastestTimeSec)
                                        ? row.isDiving
                                          ? eventGroup.fastestTimeSec - row.timeSeconds
                                          : row.timeSeconds - eventGroup.fastestTimeSec
                                        : Infinity;
                                    const displaySwimmer = formatSwimmerDisplay(
                                      row.swimmerName,
                                      row.preferredFirst
                                    );
                                    const isPrimaryProgramRow =
                                      selectedTeam !== 'ALL'
                                        ? row.teamCode === selectedTeam
                                        : String(row.teamName || '')
                                            .toLowerCase()
                                            .includes('gettysburg') ||
                                          String(row.teamCode || '')
                                            .toLowerCase()
                                            .includes('gett');
                                    const tags =
                                      isPrimaryProgramRow && !row.isDiving
                                        ? benchmarkIndex.evaluateSwim(
                                            displaySwimmer,
                                            row.eventLabel,
                                            row.finalsTime,
                                            row.classYear
                                          )
                                        : [];
                                    const hitStds = !row.isDiving
                                      ? evaluateStandardsForSwim(row.eventLabel, row.finalsTime)
                                      : [];
                                    const teamHex = getTeamHexColor(row.teamCode, row.teamName);
                                    const effectiveDisplayPlace =
                                      row.finalsOnlyTime ? row.place : row.prelimPlace ?? row.place;
                            
                                    return (
                                      <React.Fragment key={row.id}>
                                        <tr
                                          onClick={() => hasSplits && toggleRow(row.id)}
                                          style={{
                                            boxShadow: `inset 4px 0 0 ${teamHex}`,
                                          }}
                                          className={`transition ${
                                            hasSplits
                                              ? 'cursor-pointer hover:bg-cyan-50/40'
                                              : 'hover:bg-slate-50/70'
                                          } ${isExpanded ? 'bg-cyan-50/50' : ''}`}
                                        >
                                          <td className="py-3 pl-4 pr-2 text-slate-400">
                                            {hasSplits && (
                                              <button
                                                type="button"
                                                aria-label="Toggle splits"
                                                className="p-1 rounded hover:bg-slate-200/60 text-cyan-600"
                                              >
                                                {isExpanded ? (
                                                  <ChevronDown className="w-4 h-4" />
                                                ) : (
                                                  <ChevronRight className="w-4 h-4" />
                                                )}
                                              </button>
                                            )}
                                          </td>
                                          <td className="py-3 px-3 text-center">
                                            {effectiveDisplayPlace ? (
                                              <span
                                                className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                                                  effectiveDisplayPlace === 1
                                                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                                    : effectiveDisplayPlace === 2
                                                    ? 'bg-slate-200 text-slate-800 border border-slate-300'
                                                    : effectiveDisplayPlace === 3
                                                    ? 'bg-orange-100 text-orange-800 border border-orange-300'
                                                    : 'bg-slate-100 text-slate-600'
                                                }`}
                                              >
                                                {effectiveDisplayPlace}
                                              </span>
                                            ) : (
                                              <span className="text-slate-400 text-xs">—</span>
                                            )}
                                          </td>
                                          <td className="py-3 px-3">
                                            <div className="font-semibold text-slate-900 flex flex-wrap items-center gap-1.5">
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  openSwimmerProfile(
                                                    displaySwimmer,
                                                    normalizeEventKey(row.eventLabel)
                                                  );
                                                }}
                                                className="text-left hover:text-cyan-700 hover:underline cursor-pointer"
                                              >
                                                {displaySwimmer}
                                              </button>
                                              {row.isExhibition && (
                                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                                                  EXH
                                                </span>
                                              )}
                                              {tags.map((t, i) => (
                                                <span
                                                  key={i}
                                                  className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900"
                                                >
                                                  {t.label}
                                                </span>
                                              ))}
                                              {hitStds.map((s) => (
                                                <span
                                                  key={s.id}
                                                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${getStandardBadgeStyle(
                                                    s.label
                                                  )}`}
                                                >
                                                  {s.label}
                                                </span>
                                              ))}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                                              {row.classYear && <span>Class: {row.classYear}</span>}
                                              {row.prelimHeat && row.finalsHeat ? (
                                                <span className="font-mono text-slate-400">
                                                  Prelim H{row.prelimHeat}/L{row.prelimLane} • Final H
                                                  {row.finalsHeat}/L{row.finalsLane}
                                                </span>
                                              ) : (
                                                (row.heat || row.lane) && (
                                                  <span className="font-mono text-slate-400">
                                                    {row.heat ? `Heat ${row.heat}` : ''}
                                                    {row.heat && row.lane ? ' • ' : ''}
                                                    {row.lane ? `Lane ${row.lane}` : ''}
                                                  </span>
                                                )
                                              )}
                                            </div>
                                          </td>
                                          <td className="py-3 px-3">
                                            <div className="text-slate-700 font-medium">
                                              {row.teamName}
                                            </div>
                                          </td>
                                          <td className="py-3 px-3 text-right font-mono text-xs tabular-nums">
                                            {row.prelimTime ? (
                                              <div>
                                                <span className="font-semibold text-slate-700">
                                                  {row.prelimTime}
                                                </span>
                                                {row.prelimPlace && (
                                                  <span className="ml-1 text-[10px] text-slate-400">
                                                    (#{row.prelimPlace})
                                                  </span>
                                                )}
                                              </div>
                                            ) : (
                                              <span className="text-slate-300">—</span>
                                            )}
                                          </td>
                                          <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                                            {row.finalsOnlyTime ? (
                                              row.finalsOnlyTime
                                            ) : row.prelimTime ? (
                                              <span className="text-xs font-medium text-slate-400">
                                                Prelims Only
                                              </span>
                                            ) : (
                                              row.finalsTime
                                            )}
                                          </td>
                                          <td className="py-3 px-3 text-right font-mono text-xs tabular-nums">
                                            {isFinite(behindSec) ? (
                                              behindSec < 0.005 ? (
                                                <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/80">
                                                  Leader
                                                </span>
                                              ) : (
                                                <span className="text-slate-500">
                                                  {row.isDiving
                                                    ? `-${behindSec.toFixed(2)}`
                                                    : `+${behindSec.toFixed(2)}s`}
                                                </span>
                                              )
                                            ) : (
                                              <span className="text-slate-400">—</span>
                                            )}
                                          </td>
                                          <td className="py-3 px-3 text-center font-mono text-xs tabular-nums">
                                            {row.points > 0 ? (
                                              <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold">
                                                {row.points}
                                              </span>
                                            ) : (
                                              <span className="text-slate-300">—</span>
                                            )}
                                          </td>
                                          <td className="py-3 pl-3 pr-5 text-right">
                                            {hasSplits ? (
                                              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200/80">
                                                {hasFinalsSplits && hasPrelimSplits
                                                  ? `F (${row.finalsSplits.length}) / P (${row.prelimSplits.length})`
                                                  : `${primarySplitArr.length} splits`}
                                              </span>
                                            ) : (
                                              <span className="text-xs text-slate-400">
                                                No splits
                                              </span>
                                            )}
                                          </td>
                                        </tr>

                                        {/* Expanded Individual Split Breakdown Drawer */}
                                        {isExpanded && hasSplits && splitAnalysis && (
                                          <tr className="bg-slate-50/95 border-b border-slate-200">
                                            <td colSpan={9} className="px-4 sm:px-6 py-4">
                                              <div className="bg-white rounded-xl border border-cyan-200/90 p-4 sm:p-5 shadow-xs space-y-4">
                                                <div className="flex flex-wrap items-center justify-between gap-3">
                                                  <div className="text-xs font-bold uppercase tracking-wider text-cyan-800 flex items-center gap-1.5">
                                                    <Timer className="w-4 h-4 text-cyan-600" />
                                                    <span>
                                                      {hasFinalsSplits
                                                        ? 'Finals '
                                                        : hasPrelimSplits
                                                        ? 'Prelims '
                                                        : ''}
                                                      Split Breakdown (
                                                      {splitAnalysis.stats?.interval || 50}y
                                                      Intervals) — {displaySwimmer}
                                                    </span>
                                                  </div>

                                                  <div className="flex flex-wrap items-center gap-2 text-xs">
                                                    {splitAnalysis.stats && (
                                                      <>
                                                        <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-mono">
                                                          Avg Lap:{' '}
                                                          <strong>
                                                            {splitAnalysis.stats.avgLap}
                                                          </strong>
                                                        </span>
                                                        {splitAnalysis.stats.halfDiff !== null && (
                                                          <span
                                                            className={`px-2.5 py-1 rounded-md font-mono font-semibold ${
                                                              splitAnalysis.stats.halfDiff < 0
                                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                                                            }`}
                                                          >
                                                            {splitAnalysis.stats.halfDiff < 0
                                                              ? `Negative Split (${splitAnalysis.stats.halfDiff.toFixed(
                                                                  2
                                                                )}s)`
                                                              : `2nd Half +${splitAnalysis.stats.halfDiff.toFixed(
                                                                  2
                                                                )}s`}
                                                          </span>
                                                        )}
                                                      </>
                                                    )}
                                                    {(row.heat || row.lane) && (
                                                      <span className="text-slate-500 font-mono">
                                                        {row.heat ? `Heat ${row.heat}` : ''}{' '}
                                                        {row.lane ? `• Lane ${row.lane}` : ''}
                                                      </span>
                                                    )}
                                                  </div>
                                                </div>

                                                {/* Pacing Bar Visualization */}
                                                {splitAnalysis.stats &&
                                                  splitAnalysis.rows.length > 1 && (
                                                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/70">
                                                      <div className="text-[11px] font-semibold text-slate-500 mb-2 flex items-center justify-between">
                                                        <span className="flex items-center gap-1">
                                                          <TrendingUp className="w-3.5 h-3.5 text-cyan-600" />
                                                          Lap Pacing Comparison (Shorter bar =
                                                          faster lap)
                                                        </span>
                                                        <span className="flex items-center gap-3">
                                                          <span className="inline-flex items-center gap-1 text-emerald-700">
                                                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                                            Fastest
                                                          </span>
                                                          <span className="inline-flex items-center gap-1 text-amber-700">
                                                            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                                                            Slowest
                                                          </span>
                                                        </span>
                                                      </div>
                                                      <div className="flex items-end gap-1.5 h-16 pt-2">
                                                        {splitAnalysis.rows.map((s) => {
                                                          const { minLap, maxLap } =
                                                            splitAnalysis.stats;
                                                          const range = Math.max(
                                                            maxLap - minLap,
                                                            0.5
                                                          );
                                                          const norm = isFinite(s.lapSec)
                                                            ? 35 +
                                                              ((s.lapSec - minLap) / range) * 65
                                                            : 50;
                                                          return (
                                                            <div
                                                              key={s.index}
                                                              className="flex-1 flex flex-col items-center gap-1 min-w-[20px]"
                                                              title={`${s.distanceLabel}: Lap ${s.lap} (Cum ${s.cumulative})`}
                                                            >
                                                              <div className="w-full flex items-end justify-center h-11">
                                                                <div
                                                                  style={{
                                                                    height: `${Math.round(norm)}%`,
                                                                  }}
                                                                  className={`w-full max-w-[28px] rounded-t transition-all ${
                                                                    s.isFastest
                                                                      ? 'bg-emerald-500'
                                                                      : s.isSlowest
                                                                      ? 'bg-amber-400'
                                                                      : 'bg-cyan-500/80'
                                                                  }`}
                                                                />
                                                              </div>
                                                              <span className="text-[9px] font-mono text-slate-500">
                                                                {s.distance}
                                                              </span>
                                                            </div>
                                                          );
                                                        })}
                                                      </div>
                                                    </div>
                                                  )}

                                                {/* Structured Split Table */}
                                                <div className="overflow-x-auto rounded-lg border border-slate-200">
                                                  <table className="w-full text-left border-collapse text-xs">
                                                    <thead>
                                                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                                                        <th className="py-2 px-3">Distance</th>
                                                        <th className="py-2 px-3 text-right">
                                                          Cumulative Time
                                                        </th>
                                                        <th className="py-2 px-3 text-right">
                                                          {splitAnalysis.stats?.interval || 50}y Lap
                                                          Split
                                                        </th>
                                                        <th className="py-2 px-3 text-right">
                                                          Pace Note
                                                        </th>
                                                      </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
                                                      {splitAnalysis.rows.map((s) => (
                                                        <tr
                                                          key={s.index}
                                                          className={
                                                            s.isFastest
                                                              ? 'bg-emerald-50/40'
                                                              : s.isSlowest
                                                              ? 'bg-amber-50/30'
                                                              : 'hover:bg-slate-50/80'
                                                          }
                                                        >
                                                          <td className="py-2 px-3 font-sans font-semibold text-slate-700">
                                                            {s.distanceLabel}
                                                          </td>
                                                          <td className="py-2 px-3 text-right font-bold text-slate-900">
                                                            {s.cumulative}
                                                          </td>
                                                          <td className="py-2 px-3 text-right font-bold text-cyan-700">
                                                            {s.lap}
                                                          </td>
                                                          <td className="py-2 px-3 text-right font-sans">
                                                            {s.isFastest ? (
                                                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                                                                <Zap className="w-3 h-3" />
                                                                Fastest Lap
                                                              </span>
                                                            ) : s.isSlowest ? (
                                                              <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 text-amber-800">
                                                                Slowest Lap
                                                              </span>
                                                            ) : splitAnalysis.stats &&
                                                              isFinite(s.lapSec) ? (
                                                              <span className="text-[11px] text-slate-400">
                                                                {s.lapSec -
                                                                  splitAnalysis.stats.avgLapSec >=
                                                                0
                                                                  ? `+${(
                                                                      s.lapSec -
                                                                      splitAnalysis.stats.avgLapSec
                                                                    ).toFixed(2)}s vs avg`
                                                                  : `${(
                                                                      s.lapSec -
                                                                      splitAnalysis.stats.avgLapSec
                                                                    ).toFixed(2)}s vs avg`}
                                                              </span>
                                                            ) : (
                                                              '—'
                                                            )}
                                                          </td>
                                                        </tr>
                                                      ))}
                                                    </tbody>
                                                  </table>
                                                </div>

                                                {prelimSplitAnalysis && (
                                                  <div className="pt-3 border-t border-slate-200 space-y-2">
                                                    <div className="text-xs font-bold uppercase tracking-wider text-indigo-800 flex items-center justify-between">
                                                      <span>
                                                        Prelims Split Breakdown ({row.prelimTime})
                                                      </span>
                                                      {prelimSplitAnalysis.stats && (
                                                        <span className="font-mono text-slate-600 normal-case font-normal">
                                                          Avg Lap:{' '}
                                                          <strong>
                                                            {prelimSplitAnalysis.stats.avgLap}
                                                          </strong>
                                                        </span>
                                                      )}
                                                    </div>
                                                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                                                      <table className="w-full text-left border-collapse text-xs">
                                                        <thead>
                                                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                                                            <th className="py-1.5 px-3">Distance</th>
                                                            <th className="py-1.5 px-3 text-right">
                                                              Cumulative Time
                                                            </th>
                                                            <th className="py-1.5 px-3 text-right">
                                                              Lap Split
                                                            </th>
                                                          </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
                                                          {prelimSplitAnalysis.rows.map((s) => (
                                                            <tr key={`p-${s.index}`}>
                                                              <td className="py-1.5 px-3 font-sans font-semibold text-slate-700">
                                                                {s.distanceLabel}
                                                              </td>
                                                              <td className="py-1.5 px-3 text-right font-bold text-slate-900">
                                                                {s.cumulative}
                                                              </td>
                                                              <td className="py-1.5 px-3 text-right font-bold text-indigo-700">
                                                                {s.lap}
                                                              </td>
                                                            </tr>
                                                          ))}
                                                        </tbody>
                                                      </table>
                                                    </div>
                                                  </div>
                                                )}
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
                        );
                      })
                    )}
                  </div>
                )}

                {/* TAB 2: RELAY RESULTS (GROUPED BY EVENT CARDS) */}
                {meetSubTab === 'relays' && (
                  <div className="space-y-6">
                    {groupedRelayEvents.length === 0 ? (
                      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm py-12 text-center text-slate-500 text-sm">
                        No relay results match the current filter criteria.
                      </div>
                    ) : (
                      groupedRelayEvents.map((eventGroup) => {
                        const expandableRelays = eventGroup.relays.filter(
                          (r) => r.legs.length > 0 || r.splits.length > 0
                        );
                        const allExpanded =
                          expandableRelays.length > 0 &&
                          expandableRelays.every((r) => expandedRows.has(r.id));

                        return (
                          <div
                            key={eventGroup.key}
                            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                          >
                            <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                                  Event #{eventGroup.eventNumber}
                                </span>
                                <div>
                                  <h3 className="text-base font-bold tracking-tight">
                                    {eventGroup.eventLabel}
                                  </h3>
                                  <p className="text-xs text-slate-400">
                                    {eventGroup.relays.length}{' '}
                                    {eventGroup.relays.length === 1
                                      ? 'Relay Entry'
                                      : 'Relay Entries'}{' '}
                                    • {eventGroup.course}
                                  </p>
                                </div>
                              </div>

                              {expandableRelays.length > 0 && (
                                <button
                                  type="button"
                                  onClick={() => toggleAllRelaysInEvent(eventGroup.relays)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition cursor-pointer"
                                >
                                  {allExpanded ? (
                                    <>
                                      <ChevronDown className="w-3.5 h-3.5" />
                                      <span>Collapse All Splits</span>
                                    </>
                                  ) : (
                                    <>
                                      <ChevronRight className="w-3.5 h-3.5" />
                                      <span>Expand All Splits</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>

                            <div className="overflow-x-auto">
                              <table className="w-full text-left border-collapse">
                                <thead>
                                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                                    <th className="py-3 pl-4 pr-2 w-10"></th>
                                    <th
                                      onClick={() => handleSort('place')}
                                      className="py-3 px-3 w-20 text-center cursor-pointer hover:text-slate-900 select-none"
                                    >
                                      <div className="flex items-center justify-center gap-1">
                                        <span>Place</span>
                                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                                      </div>
                                    </th>
                                    <th
                                      onClick={() => handleSort('swimmerName')}
                                      className="py-3 px-3 cursor-pointer hover:text-slate-900 select-none"
                                    >
                                      <div className="flex items-center gap-1">
                                        <span>Relay Squad</span>
                                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                                      </div>
                                    </th>
                                    <th className="py-3 px-3">Swimmers (Legs 1–4)</th>
                                    <th
                                      onClick={() => handleSort('time')}
                                      className="py-3 px-3 text-right cursor-pointer hover:text-slate-900 select-none"
                                    >
                                      <div className="flex items-center justify-end gap-1">
                                        <span>Finals Time</span>
                                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                                      </div>
                                    </th>
                                    <th className="py-3 px-3 text-right w-28">Behind</th>
                                    <th className="py-3 pl-3 pr-5 text-center w-16">Pts</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                  {eventGroup.relays.map((relay) => {
                                    const hasDetails =
                                      relay.legs.length > 0 || relay.splits.length > 0;
                                    const isExpanded = expandedRows.has(relay.id);
                                    const legBreakdown = isExpanded
                                      ? calculateRelayLegBreakdown(relay)
                                      : [];
                                    const behindSec =
                                      isFinite(relay.timeSeconds) &&
                                      isFinite(eventGroup.fastestTimeSec)
                                        ? relay.timeSeconds - eventGroup.fastestTimeSec
                                        : Infinity;

                                    return (
                                      <React.Fragment key={relay.id}>
                                        <tr
                                          onClick={() => hasDetails && toggleRow(relay.id)}
                                          className={`transition ${
                                            hasDetails
                                              ? 'cursor-pointer hover:bg-cyan-50/40'
                                              : 'hover:bg-slate-50/70'
                                          } ${isExpanded ? 'bg-cyan-50/50' : ''}`}
                                        >
                                          <td className="py-3 pl-4 pr-2 text-slate-400">
                                            {hasDetails && (
                                              <button
                                                type="button"
                                                aria-label="Toggle relay legs"
                                                className="p-1 rounded hover:bg-slate-200/60 text-cyan-600"
                                              >
                                                {isExpanded ? (
                                                  <ChevronDown className="w-4 h-4" />
                                                ) : (
                                                  <ChevronRight className="w-4 h-4" />
                                                )}
                                              </button>
                                            )}
                                          </td>
                                          <td className="py-3 px-3 text-center">
                                            {relay.place ? (
                                              <span
                                                className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                                                  relay.place === 1
                                                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                                    : relay.place === 2
                                                    ? 'bg-slate-200 text-slate-800 border border-slate-300'
                                                    : relay.place === 3
                                                    ? 'bg-orange-100 text-orange-800 border border-orange-300'
                                                    : 'bg-slate-100 text-slate-600'
                                                }`}
                                              >
                                                {relay.place}
                                              </span>
                                            ) : (
                                              <span className="text-slate-400 text-xs">—</span>
                                            )}
                                          </td>
                                          <td className="py-3 px-3">
                                            <div className="font-semibold text-slate-900">
                                              {relay.relayTitle}
                                            </div>
                                            {(relay.heat || relay.lane) && (
                                              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                                                {relay.heat ? `Heat ${relay.heat}` : ''}
                                                {relay.heat && relay.lane ? ' • ' : ''}
                                                {relay.lane ? `Lane ${relay.lane}` : ''}
                                              </div>
                                            )}
                                          </td>
                                          <td className="py-3 px-3">
                                            <div className="text-xs text-slate-600 line-clamp-2">
                                              {relay.legs.length > 0
                                                ? relay.legs
                                                    .map(
                                                      (l) =>
                                                        `${l.legOrder}) ${formatSwimmerDisplay(
                                                          l.swimmerName,
                                                          l.preferredFirst
                                                        )}`
                                                    )
                                                    .join(' • ')
                                                : 'No leg roster recorded'}
                                            </div>
                                          </td>
                                          <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                                            {relay.finalsTime}
                                          </td>
                                          <td className="py-3 px-3 text-right font-mono text-xs tabular-nums">
                                            {isFinite(behindSec) ? (
                                              behindSec < 0.005 ? (
                                                <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/80">
                                                  Leader
                                                </span>
                                              ) : (
                                                <span className="text-slate-500">
                                                  +{behindSec.toFixed(2)}s
                                                </span>
                                              )
                                            ) : (
                                              <span className="text-slate-400">—</span>
                                            )}
                                          </td>
                                          <td className="py-3 pl-3 pr-5 text-center font-mono text-xs tabular-nums">
                                            {relay.points > 0 ? (
                                              <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold">
                                                {relay.points}
                                              </span>
                                            ) : (
                                              <span className="text-slate-300">—</span>
                                            )}
                                          </td>
                                        </tr>

                                        {/* Expanded Relay Legs & Splits */}
                                        {isExpanded && hasDetails && (
                                          <tr className="bg-slate-50/95 border-b border-slate-200">
                                            <td colSpan={7} className="px-4 sm:px-6 py-4">
                                              <div className="bg-white rounded-xl border border-cyan-200/90 p-4 sm:p-5 shadow-xs space-y-3">
                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                  <div className="text-xs font-bold uppercase tracking-wider text-cyan-800 flex items-center gap-1.5">
                                                    <Users className="w-4 h-4 text-cyan-600" />
                                                    <span>
                                                      Relay Leg Order & Splits — {relay.relayTitle}
                                                    </span>
                                                  </div>
                                                  {(relay.heat || relay.lane) && (
                                                    <div className="text-xs text-slate-500 font-mono">
                                                      {relay.heat ? `Heat ${relay.heat}` : ''}{' '}
                                                      {relay.lane ? `• Lane ${relay.lane}` : ''}
                                                    </div>
                                                  )}
                                                </div>

                                                <div className="overflow-x-auto rounded-lg border border-slate-200">
                                                  <table className="w-full text-left border-collapse text-xs">
                                                    <thead>
                                                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                                                        <th className="py-2.5 px-3 w-16">Leg</th>
                                                        <th className="py-2.5 px-3">Swimmer</th>
                                                        <th className="py-2.5 px-3 w-20">Class</th>
                                                        <th className="py-2.5 px-3">
                                                          Individual {relay.splitInterval || 50}y
                                                          Sub-Splits
                                                        </th>
                                                        <th className="py-2.5 px-3 text-right">
                                                          Leg Time
                                                        </th>
                                                        <th className="py-2.5 px-3 text-right">
                                                          Cumulative Relay
                                                        </th>
                                                      </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100">
                                                      {legBreakdown.map((leg) => (
                                                        <tr
                                                          key={`${relay.id}-leg-${leg.legOrder}`}
                                                          className="hover:bg-slate-50/80"
                                                        >
                                                          <td className="py-2.5 px-3">
                                                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold">
                                                              Leg {leg.legOrder}
                                                            </span>
                                                          </td>
                                                          <td className="py-2.5 px-3 font-semibold text-slate-900">
                                                            {formatSwimmerDisplay(
                                                              leg.swimmerName,
                                                              leg.preferredFirst
                                                            )}
                                                          </td>
                                                          <td className="py-2.5 px-3 text-slate-600">
                                                            {leg.classYear ? (
                                                              <span className="px-1.5 py-0.5 rounded bg-slate-100 font-medium">
                                                                {leg.classYear}
                                                              </span>
                                                            ) : (
                                                              '—'
                                                            )}
                                                          </td>
                                                          <td className="py-2.5 px-3 font-mono tabular-nums">
                                                            {leg.subSplits.length > 0 ? (
                                                              <div className="flex flex-wrap items-center gap-1.5">
                                                                {leg.subSplits.map((sub) => (
                                                                  <span
                                                                    key={sub.subIndex}
                                                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700"
                                                                  >
                                                                    <span className="text-[10px] text-slate-400">
                                                                      {sub.subDistance}:
                                                                    </span>
                                                                    <span className="font-semibold">
                                                                      {sub.lap}
                                                                    </span>
                                                                  </span>
                                                                ))}
                                                              </div>
                                                            ) : (
                                                              <span className="text-slate-400">—</span>
                                                            )}
                                                          </td>
                                                          <td className="py-2.5 px-3 text-right font-mono font-bold text-cyan-700 tabular-nums">
                                                            {leg.legTotalTime}
                                                          </td>
                                                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                                                            {leg.endCumulativeTime}
                                                          </td>
                                                        </tr>
                                                      ))}
                                                    </tbody>
                                                  </table>
                                                </div>
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
                        );
                      })
                    )}
                  </div>
                )}

                {/* TAB 3: TEAM ROSTER CARDS */}
                {meetSubTab === 'roster' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredMeetTeams.map((team) => (
                      <div
                        key={team.code}
                        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
                      >
                        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-base">{team.name}</h3>
                            {(team.city || team.state) && (
                              <p className="text-xs text-slate-400 mt-0.5">
                                {[team.city, team.state].filter(Boolean).join(', ')}
                              </p>
                            )}
                          </div>
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            {team.swimmerList.length} Athletes
                          </span>
                        </div>

                        <div className="divide-y divide-slate-100 max-h-[540px] overflow-y-auto">
                          {team.swimmerList.length === 0 ? (
                            <div className="p-8 text-center text-sm text-slate-500">
                              No swimmers match the selected filters.
                            </div>
                          ) : (
                            team.swimmerList.map((swimmer) => (
                              <div
                                key={swimmer.name}
                                className="px-5 py-3.5 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                              >
                                <div>
                                  <div className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                                    <span>
                                      {formatSwimmerDisplay(
                                        swimmer.name,
                                        swimmer.preferredFirst
                                      )}
                                    </span>
                                    {swimmer.classYear && (
                                      <span className="text-[11px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                                        {swimmer.classYear}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-slate-500 mt-0.5">
                                    {swimmer.gender}
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-1.5 sm:justify-end">
                                  {swimmer.events.map((ev, idx) => (
                                    <span
                                      key={idx}
                                      className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-800 border border-cyan-200/70"
                                    >
                                      {ev}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                        Commit Meet Performances to Master Database
                      </h3>
                      <p className="text-xs text-slate-500">
                        Imports only{' '}
                        <strong>
                          {parsedData.teams.find((t) => t.code === selectedTeam)?.name ||
                            selectedTeam}
                        </strong>{' '}
                        swims with extracted Class Year (`FR`/`SO`/`JR`/`SR`) and reconciles
                        competition, athletes, and events against your Master Lists.
                      </p>
                      <div className="pt-1 flex flex-wrap items-center gap-3">
                        <select
                          value={selectedTeam}
                          onChange={(e) => {
                            setSelectedTeam(e.target.value);
                            setExcludedMeetCommitIds(new Set());
                            try {
                              localStorage.setItem('swimmeet_primary_team_v1', e.target.value);
                            } catch {}
                          }}
                          className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
                        >
                          <option value="ALL">-- Select Primary Program Team --</option>
                          {parsedData.teams.map((t) => (
                            <option key={t.code} value={t.code}>
                              {t.name} ({t.code})
                            </option>
                          ))}
                        </select>

                        <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={includeSplitsOnCommit}
                            onChange={(e) => setIncludeSplitsOnCommit(e.target.checked)}
                            className="rounded text-cyan-600"
                          />
                          Also save legal opening splits (e.g., 50 Back off 100 Back, 1000 Free off
                          1650 Free as Place = S; Relay Lead-Offs &quot;R&quot; are always saved)
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={handleCommitCurrentMeet}
                      disabled={
                        !selectedTeam ||
                        selectedTeam === 'ALL' ||
                        meetCommitPreview.rows.filter((r) => r.selected).length === 0
                      }
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white shadow-sm transition cursor-pointer shrink-0"
                    >
                      <Database className="w-4 h-4" />
                      Commit{' '}
                      {meetCommitPreview.rows.filter((r) => r.selected).length > 0
                        ? `${meetCommitPreview.rows.filter((r) => r.selected).length} Selected `
                        : ''}
                      Swims
                    </button>
                  </div>

                  {/* Pre-Commit Master List Reconciliation Panel (Competition + Athletes + Events) */}
                  {selectedTeam &&
                    selectedTeam !== 'ALL' &&
                    (meetCommitPreview.unmatchedCompetition ||
                      meetCommitPreview.unmatchedAthletes.length > 0 ||
                      meetCommitPreview.unmatchedEvents.length > 0) && (
                      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <h4 className="text-sm font-extrabold text-amber-950 flex items-center gap-1.5">
                              <Link2 className="w-4 h-4 text-amber-700" />
                              Pre-Commit Master List Reconciliation (
                              {meetCommitPreview.unmatchedCompetition ? '1 Competition, ' : ''}
                              {meetCommitPreview.unmatchedAthletes.length} Athletes,{' '}
                              {meetCommitPreview.unmatchedEvents.length} Events)
                            </h4>
                            <p className="text-xs text-amber-800 mt-0.5">
                              Confirm matching to existing Master Lists or add new canonical entries
                              before committing to the database.
                            </p>
                          </div>
                          <button
                            onClick={handleApplyMeetReconciliations}
                            className="px-4 py-2 rounded-xl text-xs font-extrabold bg-amber-600 hover:bg-amber-500 text-white shadow-sm transition cursor-pointer"
                          >
                            Apply &amp; Sync Master Lists
                          </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                          {meetCommitPreview.unmatchedCompetition && (
                            <div className="bg-white rounded-xl border border-amber-200 p-3.5 space-y-2 text-xs">
                              <div className="font-bold uppercase text-slate-600">
                                Unmatched Meet (Name + Date)
                              </div>
                              <div className="font-bold text-slate-900">
                                {meetCommitPreview.unmatchedCompetition.rawName}{' '}
                                <span className="font-mono text-cyan-700">
                                  [{meetCommitPreview.unmatchedCompetition.sampleDate || 'No Date'}]
                                </span>
                              </div>
                              {(() => {
                                const item = meetCommitPreview.unmatchedCompetition;
                                const selKey = `comp:${normalizeCompKey(item.rawName)}|${item.sampleDate}`;
                                return (
                                  <select
                                    value={meetReconcileSelections[selKey] || '__NEW__'}
                                    onChange={(e) =>
                                      setMeetReconcileSelections((prev) => ({
                                        ...prev,
                                        [selKey]: e.target.value,
                                      }))
                                    }
                                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                                  >
                                    <option value="__NEW__">
                                      + Create New Meet &quot;{item.rawName}&quot; (
                                      {item.sampleDate || 'Any Date'})
                                    </option>
                                    {masterCompetitions.map((c) => (
                                      <option key={c.id} value={c.id}>
                                        Alias → {c.canonicalName} ({c.date || 'Any Date'})
                                      </option>
                                    ))}
                                  </select>
                                );
                              })()}
                            </div>
                          )}

                          {meetCommitPreview.unmatchedAthletes.length > 0 && (
                            <div className="bg-white rounded-xl border border-amber-200 p-3.5 space-y-2.5 max-h-56 overflow-y-auto">
                              <div className="text-xs font-bold uppercase text-slate-600">
                                Unmatched Athletes ({meetCommitPreview.unmatchedAthletes.length})
                              </div>
                              {meetCommitPreview.unmatchedAthletes.map((item) => {
                                const selKey = `ath:${normalizeSwimmerKey(item.rawName)}`;
                                return (
                                  <div key={selKey} className="space-y-1 text-xs">
                                    <div className="font-bold text-slate-900">
                                      {item.rawName}{' '}
                                      <span className="text-slate-400 font-normal">
                                        ({item.inferredGender})
                                      </span>
                                    </div>
                                    <select
                                      value={meetReconcileSelections[selKey] || '__NEW__'}
                                      onChange={(e) =>
                                        setMeetReconcileSelections((prev) => ({
                                          ...prev,
                                          [selKey]: e.target.value,
                                        }))
                                      }
                                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                                    >
                                      <option value="__NEW__">
                                        + Add &quot;{item.rawName}&quot; to Roster
                                      </option>
                                      {masterRoster
                                        .slice()
                                        .sort((a, b) =>
                                          compareByLastName(a.canonicalName, b.canonicalName)
                                        )
                                        .map((ath) => (
                                          <option key={ath.id} value={ath.id}>
                                            Alias → {ath.canonicalName} ({ath.gender})
                                          </option>
                                        ))}
                                    </select>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {meetCommitPreview.unmatchedEvents.length > 0 && (
                            <div className="bg-white rounded-xl border border-amber-200 p-3.5 space-y-2.5 max-h-56 overflow-y-auto">
                              <div className="text-xs font-bold uppercase text-slate-600">
                                Unmatched Events ({meetCommitPreview.unmatchedEvents.length})
                              </div>
                              {meetCommitPreview.unmatchedEvents.map((item) => {
                                const selKey = `ev:${item.rawEvent.toLowerCase()}|${item.genderHint}`;
                                return (
                                  <div key={selKey} className="space-y-1 text-xs">
                                    <div className="font-bold text-slate-900">{item.rawEvent}</div>
                                    <select
                                      value={meetReconcileSelections[selKey] || '__NEW__'}
                                      onChange={(e) =>
                                        setMeetReconcileSelections((prev) => ({
                                          ...prev,
                                          [selKey]: e.target.value,
                                        }))
                                      }
                                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                                    >
                                      <option value="__NEW__">
                                        + Create New Event &quot;{item.rawEvent}&quot;
                                      </option>
                                      {masterEvents.map((ev) => (
                                        <option key={ev.id} value={ev.id}>
                                          Alias → {ev.canonicalName}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  {/* Staged Pre-Commit Swims & Class Year Verification Table */}
                  {selectedTeam && selectedTeam !== 'ALL' && meetCommitPreview.rows.length > 0 && (
                    <div className="space-y-3">
                      {/* Multi-Day / Event-Range Date Mapper */}
                      {(meetCommitPreview.meetDays.length > 1 ||
                        Boolean(parsedData.meetInfo.endIsoDate)) && (
                        <div className="bg-cyan-50/70 border border-cyan-200 rounded-xl p-3.5 space-y-2.5 text-xs">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="font-bold text-cyan-950 flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-cyan-700" />
                              <span>
                                Multi-Day Meet Dates Detected (
                                {meetCommitPreview.meetDays
                                  .map((d, i) => `Day ${i + 1}: ${formatDisplayDateMDY(d)}`)
                                  .join(' • ')}
                                )
                              </span>
                            </div>
                            {Object.keys(meetDateOverrides).length > 0 && (
                              <button
                                onClick={() => setMeetDateOverrides({})}
                                className="text-[11px] font-bold text-cyan-800 hover:underline cursor-pointer"
                              >
                                Reset Date Overrides ({Object.keys(meetDateOverrides).length})
                              </button>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-slate-600 font-medium">
                              Assign Event # range (great for relays or overrides):
                            </span>
                            <input
                              type="number"
                              min="1"
                              value={dayRangeStartEvent}
                              onChange={(e) => setDayRangeStartEvent(e.target.value)}
                              placeholder="From Ev #"
                              className="w-24 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                            />
                            <span className="text-slate-400">to</span>
                            <input
                              type="number"
                              min="1"
                              value={dayRangeEndEvent}
                              onChange={(e) => setDayRangeEndEvent(e.target.value)}
                              placeholder="To Ev #"
                              className="w-24 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                            />
                            <select
                              value={dayRangeTargetDate}
                              onChange={(e) => setDayRangeTargetDate(e.target.value)}
                              className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                            >
                              {meetCommitPreview.meetDays.map((d, idx) => (
                                <option key={d} value={d}>
                                  Day {idx + 1} ({formatDisplayDateMDY(d)})
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => {
                                const startEv = parseInt(dayRangeStartEvent, 10);
                                const endEv = parseInt(dayRangeEndEvent, 10);
                                const targetD =
                                  dayRangeTargetDate || meetCommitPreview.meetDays[0] || '';
                                if (Number.isNaN(startEv) || Number.isNaN(endEv) || !targetD) {
                                  return;
                                }
                                const lo = Math.min(startEv, endEv);
                                const hi = Math.max(startEv, endEv);
                                setMeetDateOverrides((prev) => {
                                  const next = { ...prev };
                                  meetCommitPreview.rows.forEach((r) => {
                                    const num = parseInt(r.eventNumber, 10);
                                    if (!Number.isNaN(num) && num >= lo && num <= hi) {
                                      next[`ev:${num}`] = targetD;
                                    }
                                  });
                                  return next;
                                });
                              }}
                              className="px-3 py-1 rounded-lg text-xs font-bold bg-cyan-700 hover:bg-cyan-600 text-white transition cursor-pointer"
                            >
                              Apply to Range
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="font-bold text-slate-700">
                          Staged Swims Preview ({meetCommitPreview.rows.filter((r) => r.selected).length}{' '}
                          new selected,{' '}
                          {meetCommitPreview.rows.filter((r) => r.isDuplicate).length} already in
                          database)
                        </span>
                        <span className="text-slate-500">
                          Tip: Verify Class Year, Date, or exclude swims before committing
                        </span>
                      </div>

                      <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-80">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px] sticky top-0">
                            <tr>
                              <th className="py-2 px-3 w-9">Include</th>
                              <th className="py-2 px-3">Athlete</th>
                              <th className="py-2 px-3 w-24">Class Year</th>
                              <th className="py-2 px-3">Event</th>
                              <th className="py-2 px-3">Time</th>
                              <th className="py-2 px-3 w-36">Date</th>
                              <th className="py-2 px-3">Type</th>
                              <th className="py-2 px-3">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {meetCommitPreview.rows.map((row) => (
                              <tr
                                key={row.id}
                                className={row.isDuplicate ? 'bg-slate-50/70 text-slate-400' : ''}
                              >
                                <td className="py-2 px-3">
                                  <input
                                    type="checkbox"
                                    checked={row.selected}
                                    onChange={(e) => {
                                      const checked = e.target.checked;
                                      setExcludedMeetCommitIds((prev) => {
                                        const next = new Set(prev);
                                        if (checked) next.delete(row.id);
                                        else next.add(row.id);
                                        return next;
                                      });
                                    }}
                                    className="rounded text-cyan-600 cursor-pointer"
                                  />
                                </td>
                                <td className="py-2 px-3 font-bold text-slate-900">
                                  {row.swimmerName}
                                </td>
                                <td className="py-2 px-3">
                                  <select
                                    value={row.classYear || ''}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setMeetClassOverrides((prev) => ({
                                        ...prev,
                                        [row.swimmerKey]: val,
                                      }));
                                    }}
                                    className={`px-2 py-1 border rounded text-[11px] font-bold ${
                                      row.classYear
                                        ? 'bg-white border-slate-200 text-slate-800'
                                        : 'bg-amber-50 border-amber-300 text-amber-800'
                                    }`}
                                  >
                                    <option value="">—</option>
                                    <option value="FR">FR</option>
                                    <option value="SO">SO</option>
                                    <option value="JR">JR</option>
                                    <option value="SR">SR</option>
                                    <option value="GR">GR</option>
                                  </select>
                                </td>
                                <td className="py-2 px-3">
                                  {row.eventNumber ? `#${row.eventNumber} ` : ''}
                                  {row.eventLabel}
                                  {row.round === 'Prelims' && (
                                    <span className="ml-1.5 px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                                      Prelims
                                    </span>
                                  )}
                                  {row.round === 'Time Trial' && (
                                    <span className="ml-1.5 px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-bold">
                                      Time Trial
                                    </span>
                                  )}
                                </td>
                                <td className="py-2 px-3 font-mono font-bold text-cyan-800">
                                  {row.time}
                                  {row.place && (
                                    <span className="ml-1 text-[10px] text-slate-400 font-normal">
                                      (#{row.place})
                                    </span>
                                  )}
                                </td>
                                <td className="py-2 px-3">
                                  <input
                                    type="date"
                                    value={row.date || ''}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setMeetDateOverrides((prev) => ({
                                        ...prev,
                                        [`row:${row.id}`]: val,
                                      }));
                                    }}
                                    className="px-2 py-1 bg-white border border-slate-200 rounded text-[11px] font-mono text-slate-800"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  {row.swimType === 'RELAY_LEADOFF' ? (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800">
                                      Relay Lead-Off (R)
                                    </span>
                                  ) : row.swimType === 'INTERMEDIATE_SPLIT' ? (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                                      Split (S) • {row.splitContext}
                                    </span>
                                  ) : row.swimType === 'RELAY_WIN' ? (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                                      Relay Win • {row.splitContext}
                                    </span>
                                  ) : row.round === 'Prelims' ? (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                                      Official (Prelims)
                                    </span>
                                  ) : row.round === 'Time Trial' ? (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                                      Time Trial
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                      Official (Finals)
                                    </span>
                                  )}
                                </td>
                                <td className="py-2 px-3">
                                  {row.isDuplicate ? (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600">
                                      Already in DB
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                      Ready
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

                {/* Event Winners & Multi-Win Leaderboard */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="text-base font-extrabold text-slate-900">
                        Event Winners ({winSummary.totalWins} Wins)
                      </h3>
                      <span className="text-xs font-bold text-cyan-700">
                        {parsedData.teams.find((t) => t.code === selectedTeam)?.name ||
                          'All Teams'}
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

                    {/* Optional Away & Home Logos + Standalone Web Recap (.HTML) Export */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                          Web Recap Header Logos (Optional)
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Embedded directly in exported .HTML (not saved to DB)
                        </span>
                      </div>

                      <input
                        ref={awayLogoInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          handleLogoFileSelect(e, 'away');
                          e.target.value = '';
                        }}
                      />
                      <input
                        ref={homeLogoInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          handleLogoFileSelect(e, 'home');
                          e.target.value = '';
                        }}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {/* Away Logo Picker */}
                        <div className="flex items-center justify-between gap-2 bg-white border border-slate-200 rounded-lg px-2.5 py-2">
                          <div className="flex items-center gap-2 min-w-0">
                            {awayLogoDataUrl ? (
                              <img
                                src={awayLogoDataUrl}
                                alt="Away Logo Preview"
                                className="w-7 h-7 rounded-md object-contain bg-white border border-slate-200 p-0.5 shrink-0"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-md bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">
                                L
                              </div>
                            )}
                            <span className="text-xs font-bold text-slate-700 truncate">
                              {awayLogoDataUrl ? 'Away Logo Ready' : 'Away Logo (Left)'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => awayLogoInputRef.current?.click()}
                              className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition cursor-pointer"
                            >
                              {awayLogoDataUrl ? 'Change' : 'Add Away Logo'}
                            </button>
                            {awayLogoDataUrl && (
                              <button
                                type="button"
                                onClick={() => setAwayLogoDataUrl('')}
                                title="Remove Away Logo"
                                className="p-1 rounded text-slate-400 hover:text-red-600 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Home Logo Picker */}
                        <div className="flex items-center justify-between gap-2 bg-white border border-slate-200 rounded-lg px-2.5 py-2">
                          <div className="flex items-center gap-2 min-w-0">
                            {homeLogoDataUrl ? (
                              <img
                                src={homeLogoDataUrl}
                                alt="Home Logo Preview"
                                className="w-7 h-7 rounded-md object-contain bg-white border border-slate-200 p-0.5 shrink-0"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-md bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">
                                R
                              </div>
                            )}
                            <span className="text-xs font-bold text-slate-700 truncate">
                              {homeLogoDataUrl ? 'Home Logo Ready' : 'Home Logo (Right)'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => homeLogoInputRef.current?.click()}
                              className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition cursor-pointer"
                            >
                              {homeLogoDataUrl ? 'Change' : 'Add Home Logo'}
                            </button>
                            {homeLogoDataUrl && (
                              <button
                                type="button"
                                onClick={() => setHomeLogoDataUrl('')}
                                title="Remove Home Logo"
                                className="p-1 rounded text-slate-400 hover:text-red-600 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleExportWebRecapHtml}
                        className="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-extrabold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Export Web Recap (.HTML)
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

      {/* ==================================================================== */}
      {/* SWIMMER CAREER PROFILE MODAL                                         */}
      {/* ==================================================================== */}
      {activeSwimmerProfile && (
        <div
          onClick={() => setProfileSwimmerName(null)}
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 text-white px-5 sm:px-6 py-4 flex items-start justify-between gap-4 shrink-0">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight">
                    {activeSwimmerProfile.canonicalName}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-white/10 text-cyan-200 border border-white/15">
                    {activeSwimmerProfile.gender}
                  </span>
                  {activeSwimmerProfile.isActive !== null && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        activeSwimmerProfile.isActive
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {activeSwimmerProfile.isActive ? 'Active Roster' : 'Alumni / Inactive'}
                    </span>
                  )}
                </div>
                {activeSwimmerProfile.aliases.length > 0 && (
                  <p className="text-xs text-slate-400 mt-1">
                    Aliases: {activeSwimmerProfile.aliases.join(', ')}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setProfileSwimmerName(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition cursor-pointer"
                aria-label="Close swimmer career profile"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
              {/* Career Summary KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-cyan-50/70 border border-cyan-200 rounded-xl p-3.5">
                  <div className="text-[10px] font-bold uppercase text-cyan-800">
                    Career Finals Wins
                  </div>
                  <div className="text-2xl font-black text-cyan-950 mt-0.5">
                    {activeSwimmerProfile.totalWins}
                  </div>
                  <div className="text-[11px] text-cyan-800 font-medium">
                    {activeSwimmerProfile.indWins} Ind • {activeSwimmerProfile.relWins} Relay
                  </div>
                </div>

                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5">
                  <div className="text-[10px] font-bold uppercase text-amber-800">
                    All-Time Top-10 Events
                  </div>
                  <div className="text-2xl font-black text-amber-950 mt-0.5">
                    {activeSwimmerProfile.eventSummaries.filter((e) => e.allTimeRank !== null).length}
                  </div>
                  <div className="text-[11px] text-amber-800 font-medium">
                    {
                      activeSwimmerProfile.eventSummaries.filter((e) => e.allTimeRank === 1)
                        .length
                    }{' '}
                    School Record
                    {activeSwimmerProfile.eventSummaries.filter((e) => e.allTimeRank === 1)
                      .length === 1
                      ? ''
                      : 's'}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                  <div className="text-[10px] font-bold uppercase text-slate-500">
                    Events Swum
                  </div>
                  <div className="text-2xl font-black text-slate-900 mt-0.5">
                    {activeSwimmerProfile.eventSummaries.length}
                  </div>
                  <div className="text-[11px] text-slate-500">Official event distances</div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                  <div className="text-[10px] font-bold uppercase text-slate-500">
                    Database Marks
                  </div>
                  <div className="text-2xl font-black text-slate-900 mt-0.5">
                    {activeSwimmerProfile.totalLoggedSwims}
                  </div>
                  <div className="text-[11px] text-slate-500">Historical records</div>
                </div>
              </div>

              {/* Event Personal Bests, Season Bests & Top-10 Ranks */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  Career Personal Bests, Season Bests &amp; All-Time Rankings
                </h3>

                {activeSwimmerProfile.eventSummaries.length === 0 ? (
                  <div className="text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl p-6 text-center">
                    No official historical marks found in the committed database for this swimmer yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="py-2.5 px-3">Event</th>
                          <th className="py-2.5 px-3">Career PB</th>
                          <th className="py-2.5 px-3">Season Best</th>
                          <th className="py-2.5 px-3">Split Best (S)</th>
                          <th className="py-2.5 px-3">All-Time Rank</th>
                          <th className="py-2.5 px-3 text-right">Progression</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeSwimmerProfile.eventSummaries.map((ev) => {
                          const isSelectedChart =
                            activeSwimmerProfile.selectedEvObj?.eventKey === ev.eventKey;
                          return (
                            <tr
                              key={ev.eventKey}
                              onClick={() => setProfileChartEventKey(ev.eventKey)}
                              className={`cursor-pointer transition ${
                                isSelectedChart ? 'bg-cyan-50/70' : 'hover:bg-slate-50'
                              }`}
                            >
                              <td className="py-2.5 px-3 font-bold text-slate-900">
                                {ev.eventLabel}
                              </td>
                              <td className="py-2.5 px-3 font-mono font-extrabold text-cyan-800">
                                {ev.fullPb ? (
                                  <div>
                                    <span>{ev.fullPb.time}</span>
                                    <span className="text-[10px] text-slate-400 font-normal ml-1.5">
                                      ({formatDisplayDateMDY(ev.fullPb.date)})
                                    </span>
                                  </div>
                                ) : (
                                  '—'
                                )}
                              </td>
                              <td className="py-2.5 px-3 font-mono font-semibold text-slate-700">
                                {ev.fullSb ? ev.fullSb.time : '—'}
                              </td>
                              <td className="py-2.5 px-3 font-mono text-amber-800">
                                {ev.splitPb ? `${ev.splitPb.time} (S)` : '—'}
                              </td>
                              <td className="py-2.5 px-3">
                                {ev.allTimeRank ? (
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      ev.allTimeRank === 1
                                        ? 'bg-amber-200 text-amber-950'
                                        : 'bg-amber-100 text-amber-900'
                                    }`}
                                  >
                                    {ev.allTimeRank === 1
                                      ? '#1 School Record'
                                      : `#${ev.allTimeRank} All-Time`}
                                  </span>
                                ) : (
                                  <span className="text-slate-400">—</span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <span
                                  className={`text-[11px] font-bold ${
                                    isSelectedChart ? 'text-cyan-700' : 'text-slate-400'
                                  }`}
                                >
                                  {isSelectedChart ? 'Viewing Graph' : 'Graph →'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Time Progression SVG Chart for Selected Event */}
              {activeSwimmerProfile.selectedEvObj && (() => {
                const chartEv = activeSwimmerProfile.selectedEvObj;
                const chartSwims = chartEv.swims.filter(
                  (s) =>
                    s.swimType !== 'INTERMEDIATE_SPLIT' &&
                    String(s.place || '').toUpperCase() !== 'S' &&
                    Number.isFinite(s.seconds)
                );
                if (chartSwims.length === 0) return null;

                const times = chartSwims.map((s) => s.seconds);
                const minSec = Math.min(...times);
                const maxSec = Math.max(...times);
                const pad = Math.max((maxSec - minSec) * 0.15, 0.25);
                const lo = minSec - pad;
                const hi = maxSec + pad;

                const W = 680;
                const H = 180;
                const padL = 56;
                const padR = 24;
                const padT = 20;
                const padB = 34;
                const plotW = W - padL - padR;
                const plotH = H - padT - padB;

                const points = chartSwims.map((s, idx) => {
                  const x =
                    chartSwims.length === 1
                      ? padL + plotW / 2
                      : padL + (idx / (chartSwims.length - 1)) * plotW;
                  // Faster times (smaller seconds) sit higher on the chart
                  const norm = (s.seconds - lo) / (hi - lo);
                  const y = padT + norm * plotH;
                  return { x, y, swim: s };
                });

                const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

                return (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-cyan-600" />
                        <span>
                          Time Progression — {chartEv.eventLabel} ({chartSwims.length} swim
                          {chartSwims.length === 1 ? '' : 's'})
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        Higher points = faster marks
                      </span>
                    </div>

                    <div className="w-full overflow-x-auto">
                      <svg
                        viewBox={`0 0 ${W} ${H}`}
                        className="w-full h-44 bg-white rounded-xl border border-slate-200/80"
                      >
                        {/* Horizontal Reference Lines (Fastest & Slowest) */}
                        <line
                          x1={padL}
                          y1={padT + ((minSec - lo) / (hi - lo)) * plotH}
                          x2={W - padR}
                          y2={padT + ((minSec - lo) / (hi - lo)) * plotH}
                          stroke="#bae6fd"
                          strokeDasharray="4 4"
                        />
                        <text
                          x={padL - 6}
                          y={padT + ((minSec - lo) / (hi - lo)) * plotH + 3}
                          textAnchor="end"
                          className="fill-cyan-700 text-[9px] font-mono font-bold"
                        >
                          {secondsToTime(minSec)}
                        </text>

                        {maxSec > minSec + 0.01 && (
                          <>
                            <line
                              x1={padL}
                              y1={padT + ((maxSec - lo) / (hi - lo)) * plotH}
                              x2={W - padR}
                              y2={padT + ((maxSec - lo) / (hi - lo)) * plotH}
                              stroke="#e2e8f0"
                              strokeDasharray="4 4"
                            />
                            <text
                              x={padL - 6}
                              y={padT + ((maxSec - lo) / (hi - lo)) * plotH + 3}
                              textAnchor="end"
                              className="fill-slate-400 text-[9px] font-mono"
                            >
                              {secondsToTime(maxSec)}
                            </text>
                          </>
                        )}

                        {points.length > 1 && (
                          <polyline
                            fill="none"
                            stroke="#0284c7"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points={polylinePoints}
                          />
                        )}

                        {points.map((p, idx) => {
                          const isBest = Math.abs(p.swim.seconds - minSec) < 0.005;
                          return (
                            <g key={p.swim.id || idx}>
                              <circle
                                cx={p.x}
                                cy={p.y}
                                r={isBest ? 5.5 : 4}
                                fill={isBest ? '#f59e0b' : '#0284c7'}
                                stroke="#ffffff"
                                strokeWidth="1.5"
                              />
                              <text
                                x={p.x}
                                y={p.y - 8}
                                textAnchor="middle"
                                className={`text-[9px] font-mono font-bold ${
                                  isBest ? 'fill-amber-700' : 'fill-slate-700'
                                }`}
                              >
                                {p.swim.time}
                              </text>
                              <text
                                x={p.x}
                                y={H - 10}
                                textAnchor="middle"
                                className="fill-slate-400 text-[8.5px] font-mono"
                              >
                                {formatDisplayDateMDY(p.swim.date)}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  </div>
                );
              })()}

              {/* Full Chronological Swim Log */}
              {activeSwimmerProfile.chronologicalLog.length > 0 && (
                <div className="space-y-2.5">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                    Chronological Career Swim Log ({activeSwimmerProfile.chronologicalLog.length})
                  </h3>
                  <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-64">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px] sticky top-0">
                        <tr>
                          <th className="py-2 px-3">Date</th>
                          <th className="py-2 px-3">Event</th>
                          <th className="py-2 px-3">Time</th>
                          <th className="py-2 px-3">Place</th>
                          <th className="py-2 px-3">Competition</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeSwimmerProfile.chronologicalLog.map((r) => (
                          <tr key={r.id} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-mono text-slate-500">
                              {formatDisplayDateMDY(r.date)}
                            </td>
                            <td className="py-2 px-3 font-semibold text-slate-900">
                              {r.eventLabel}
                              {r.splitContext ? (
                                <span className="ml-1.5 text-[10px] text-slate-500 font-normal">
                                  ({r.splitContext})
                                </span>
                              ) : null}
                            </td>
                            <td className="py-2 px-3 font-mono font-bold text-cyan-800">
                              {r.time}
                            </td>
                            <td className="py-2 px-3 text-slate-600">{r.place || '—'}</td>
                            <td className="py-2 px-3 text-slate-600">{r.competition || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
