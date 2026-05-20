// Agent A — Linguist: Natural Language Intent Extraction
// Supports English, Urdu, and Roman Urdu input

import { delay } from './tools.js';

// Problem Keyword Dictionary
const PROBLEM_MAP = [
  // Electrical
  { keywords: ["bijli nahi", "light nahi", "current nahi", "bijli gai", "short circuit",
               "plug kaam nahi", "switch kaam nahi", "wiring", "meter issue", "electricity problem"],
    category: "Electrician" },
  // Plumbing
  { keywords: ["paani nahi", "pipe leak", "nal se paani", "drain band", "washroom leak",
               "toilet overflow", "paani ka pressure", "paani tapak", "leakage"],
    category: "Plumber" },
  // AC / Cooling
  { keywords: ["ac thanda nahi", "ac band", "cooling nahi", "ac gas", "ac filter",
               "heat pump", "ac awaz", "ac leak", "ac kharab"],
    category: "AC Technician" },
  // Roof / Structural
  { keywords: ["chhat se paani", "roof leak", "seepage", "deewar se paani",
               "namee", "wall crack", "floor crack", "plastering"],
    category: "Mason" },
  // Carpentry / Doors
  { keywords: ["darwaza band nahi", "lock toot", "almari toot", "drawer stuck",
               "khirki", "hinge", "wood repair", "darwaza kharab"],
    category: "Carpenter" },
  // Paint
  { keywords: ["paint ukhad", "paint peeling", "wall paint", "rang lagana",
               "polish", "paint karna", "painting chahiye"],
    category: "Painter" },
  // Cleaning
  { keywords: ["safai", "clean karna", "ganda", "jhadu", "dust",
               "cockroach", "pest", "deep clean", "saaf karna"],
    category: "Cleaner" },
  // Tailoring
  { keywords: ["kapray silna", "darzi chahiye", "suit silna", "alteration",
               "kapray tight", "stitch", "silai"],
    category: "Tailor" },
  // Tutoring
  { keywords: ["tutor chahiye", "padhai mein help", "math", "science teacher",
               "english teacher", "home tutor", "teacher chahiye", "tuition"],
    category: "Tutor" },
  // Beautician
  { keywords: ["facial", "beauty", "makeup", "mehndi", "waxing",
               "threading", "salon", "hair styling", "beautician"],
    category: "Beautician" },
];

// Direct Service Keyword Map
const DIRECT_SERVICE_MAP = {
  "electrician": "Electrician",
  "bijli wala": "Electrician",
  "plumber": "Plumber",
  "nal wala": "Plumber",
  "ac technician": "AC Technician",
  "ac wala": "AC Technician",
  "painter": "Painter",
  "rang wala": "Painter",
  "carpenter": "Carpenter",
  "barhai": "Carpenter",
  "beautician": "Beautician",
  "tutor": "Tutor",
  "teacher": "Tutor",
  "cleaner": "Cleaner",
  "safai wala": "Cleaner",
  "mason": "Mason",
  "raj mistry": "Mason",
  "tailor": "Tailor",
  "darzi": "Tailor",
};

const EXPLANATIONS = {
  "Electrician": {
    headline: "Possible Electrical Fault Detected",
    diagnosis: "Yeh masla aksar tripped circuit breaker, loose wiring, ya overloaded circuit ki wajah se hota hai. Kabhi kabhi WAPDA meter fault ya area-wide outage bhi ho sakta hai.",
    action: (area) => `Main ${area ? area + ' ke' : 'aapke'} qareeb best electricians dhundh raha hoon jo yeh diagnose aur fix kar sakein.`
  },
  "Plumber": {
    headline: "Plumbing Issue Identified",
    diagnosis: "Pipe leak ya paani band hone ki wajah pipe corrosion, joint failure, ya underground blockage ho sakti hai. Pressure issue bhi main valve se aa sakta hai.",
    action: (area) => `${area ? area + ' mein' : 'Aapke qareeb'} experienced plumbers dhundh raha hoon.`
  },
  "AC Technician": {
    headline: "AC Cooling Problem Detected",
    diagnosis: "AC ka thanda na karna aksar low refrigerant gas, choked air filter, ya compressor issue ki wajah se hota hai. Electrical fault ya dirty coil bhi cause ho sakti hai.",
    action: (area) => `${area ? area + ' ke' : 'Aapke'} qareeb AC technicians dhundh raha hoon jo yeh check karein.`
  },
  "Mason": {
    headline: "Structural / Seepage Issue Detected",
    diagnosis: "Chhat ya deewar se paani ki problem aksar roof waterproofing failure, cracked plaster, ya poor drainage ki wajah se hoti hai. Namee andar tak phail sakti hai.",
    action: (area) => `${area ? area + ' mein' : 'Aapke qareeb'} skilled masons dhundh raha hoon.`
  },
  "Carpenter": {
    headline: "Carpentry / Door Issue Detected",
    diagnosis: "Darwaza ya khirki ka theek se band na hona aksar hinge misalignment, wood swelling (barsaat mein), ya lock mechanism failure ki wajah se hota hai.",
    action: (area) => `${area ? area + ' ke' : 'Aapke'} qareeb carpenters dhundh raha hoon.`
  },
  "Painter": {
    headline: "Paint / Wall Finish Issue Detected",
    diagnosis: "Paint ka ukharna ya peeling aksar moisture, poor surface preparation, ya low-quality primer ki wajah se hota hai. Purani walls mein yeh aam masla hai.",
    action: (area) => `${area ? area + ' mein' : 'Aapke qareeb'} professional painters dhundh raha hoon.`
  },
  "Cleaner": {
    headline: "Cleaning & Hygiene Need Detected",
    diagnosis: "Ghar ki deep cleaning, pest control, ya regular safai ke liye trained cleaners zaroori hain. DIY cleaning aksar hidden areas miss kar deti hai.",
    action: (area) => `${area ? area + ' ke' : 'Aapke'} qareeb professional cleaners dhundh raha hoon.`
  },
  "Tailor": {
    headline: "Tailoring / Stitching Need Detected",
    diagnosis: "Kapray silwane ya alteration ke liye ek maahir darzi zaroori hai jo sahi measurements aur finishing de sake.",
    action: (area) => `${area ? area + ' mein' : 'Aapke qareeb'} experienced tailors dhundh raha hoon.`
  },
  "Tutor": {
    headline: "Home Tutoring Need Detected",
    diagnosis: "Ghar par tuition ke liye ek experienced teacher padhai ko simple aur effective bana sakta hai. Subject aur class level ke mutabiq tutor milna zaroori hai.",
    action: (area) => `${area ? area + ' ke' : 'Aapke'} qareeb qualified tutors dhundh raha hoon.`
  },
  "Beautician": {
    headline: "Beauty & Grooming Service Detected",
    diagnosis: "Ghar par beauty services ke liye ek professional beautician safe aur quality service deti hai. Mehndi, facial, aur threading ghar par bhi available hoti hai.",
    action: (area) => `${area ? area + ' mein' : 'Aapke qareeb'} professional beauticians dhundh raha hoon.`
  },
};

// Location keywords → sector mapping
const LOCATION_KEYWORDS = {
  'g-6': 'G-6', 'g6': 'G-6', 'g 6': 'G-6',
  'g-7': 'G-7', 'g7': 'G-7', 'g 7': 'G-7',
  'g-8': 'G-8', 'g8': 'G-8', 'g 8': 'G-8',
  'g-9': 'G-9', 'g9': 'G-9', 'g 9': 'G-9',
  'g-10': 'G-10', 'g10': 'G-10', 'g 10': 'G-10',
  'g-11': 'G-11', 'g11': 'G-11', 'g 11': 'G-11',
  'g-13': 'G-13', 'g13': 'G-13', 'g 13': 'G-13',
  'f-7': 'F-7', 'f7': 'F-7', 'f 7': 'F-7',
  'f-8': 'F-8', 'f8': 'F-8', 'f 8': 'F-8',
  'f-10': 'F-10', 'f10': 'F-10', 'f 10': 'F-10',
  'f-11': 'F-11', 'f11': 'F-11', 'f 11': 'F-11',
  'i-8': 'I-8', 'i8': 'I-8', 'i 8': 'I-8',
  'i-10': 'I-10', 'i10': 'I-10', 'i 10': 'I-10',
  'e-11': 'E-11', 'e11': 'E-11', 'e 11': 'E-11',
  'dha phase 1': 'DHA Phase 1', 'dha 1': 'DHA Phase 1',
  'dha phase 2': 'DHA Phase 2', 'dha 2': 'DHA Phase 2',
  'bahria town': 'Bahria Town', 'bahria': 'Bahria Town',
  'gulberg': 'Gulberg Islamabad', 'gulberg islamabad': 'Gulberg Islamabad',
  'rawalpindi saddar': 'Rawalpindi Saddar', 'saddar': 'Rawalpindi Saddar',
  'chaklala': 'Chaklala'
};

const TIME_KEYWORDS = {
  'kal': 'Tomorrow', 'tomorrow': 'Tomorrow', 'kal subah': 'Tomorrow morning',
  'subah': 'Morning', 'morning': 'Morning',
  'dopahar': 'Afternoon', 'afternoon': 'Afternoon',
  'shaam': 'Evening', 'evening': 'Evening',
  'abhi': 'Now', 'now': 'Now', 'urgent': 'Now', 'fori': 'Now',
  'aaj': 'Today', 'today': 'Today',
  'parso': 'Day after tomorrow',
};

// Detect language
function detectLanguage(text) {
  const urduChars = /[\u0600-\u06FF]/;
  if (urduChars.test(text)) return 'urdu';
  const romanUrduWords = ['mujhe', 'chahiye', 'wala', 'kal', 'subah', 'mein', 'ke', 'ka', 'ki', 'hai', 'hain', 'karo', 'karna', 'abhi', 'yahan', 'ghar', 'nahi', 'raha'];
  const lower = text.toLowerCase();
  const matchCount = romanUrduWords.filter(w => lower.includes(w)).length;
  if (matchCount >= 2) return 'roman_urdu';
  return 'english';
}

/**
 * Agent A: Linguist
 */
export async function linguistAgent(input, onEvent) {
  const lower = input.toLowerCase().trim();
  const language = detectLanguage(input);

  onEvent?.({ agent: 'linguist', type: 'PROCESSING_INPUT', message: `Analyzing input in ${language}...` });
  await delay(600);

  // Extract location
  let area = null;
  const sortedLocKeys = Object.keys(LOCATION_KEYWORDS).sort((a, b) => b.length - a.length);
  for (const keyword of sortedLocKeys) {
    if (lower.includes(keyword)) {
      area = LOCATION_KEYWORDS[keyword];
      break;
    }
  }

  // Extract time
  let time = null;
  const sortedTimeKeys = Object.keys(TIME_KEYWORDS).sort((a, b) => b.length - a.length);
  for (const keyword of sortedTimeKeys) {
    if (lower.includes(keyword)) {
      time = TIME_KEYWORDS[keyword];
      break;
    }
  }
  if (!time) time = 'Today';

  let query_type = 'unknown';
  let category = null;
  let explanation = null;
  let confidence = 0;

  // Check Direct Service Map first
  const sortedDirectKeys = Object.keys(DIRECT_SERVICE_MAP).sort((a, b) => b.length - a.length);
  for (const keyword of sortedDirectKeys) {
    if (lower.includes(keyword)) {
      category = DIRECT_SERVICE_MAP[keyword];
      query_type = 'direct';
      confidence = 0.95;
      break;
    }
  }

  // Check Problem Map if no direct match
  if (!category) {
    for (const prob of PROBLEM_MAP) {
      for (const keyword of prob.keywords) {
        if (lower.includes(keyword)) {
          category = prob.category;
          query_type = 'problem';
          confidence = 0.85;
          const expTemplate = EXPLANATIONS[category];
          explanation = {
            headline: expTemplate.headline,
            diagnosis: expTemplate.diagnosis,
            action: expTemplate.action(area)
          };
          break; // break keywords loop
        }
      }
      if (category) break; // break PROBLEM_MAP loop
    }
  }

  const result = {
    raw_query: input,
    query_type,
    category,
    area,
    time,
    language,
    confidence,
    explanation,
    service_type: category || 'Unknown', // Keep for backward compatibility in some places if needed, but we should use category
    location: area || 'Unknown', // Keep for backward compatibility
  };

  if (query_type === 'unknown') {
    onEvent?.({
      agent: 'linguist',
      type: 'QUERY_UNRECOGNIZED',
      message: `Could not determine intent for query`,
      data: result,
    });
  } else {
    onEvent?.({
      agent: 'linguist',
      type: 'INTENT_EXTRACTED',
      message: `Extracted intent: ${result.category} in ${result.area || 'any area'}`,
      data: result,
    });
  }

  await delay(400);

  return result;
}
