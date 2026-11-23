"use client";

import { useEffect, useMemo, useState } from "react";

const APP_VERSION = "4.2-next-mongo";
const LANG_KEY = "our_coaching_lang";
const THEME_KEY = "our_coaching_theme";
const SESSION_KEY = "our_coaching_session_v42";
const OWNER_META_KEY = "our_coaching_owner_meta_v42";

const DEFAULT_OWNER_EMAIL = "abdullah.owner@ourcoaching.pk";
const DEFAULT_OWNER_PW = "abdullah";
const DEFAULT_OWNER_NAME = "Abdullah (Owner)";
const DEFAULT_ADMIN_EMAIL = "admin@ourcoaching.pk";
const DEFAULT_ADMIN_PW = "admin123";
const DEFAULT_ADMIN_NAME = "Principal (Admin)";
const OWNER_CONTACT_PHONE = "03213091550";

const DEFAULT_ORG = "OUR COACHING";
const DEFAULT_TAGLINE = "Smart Attendance, Fees & Batch Operations";
const DEFAULT_TRIAL_DAYS = 4;
const DEFAULT_LOCK_MSG =
  "This coaching portal is currently paused by the owner. Please contact the service provider.";
const DEFAULT_WA_TEMPLATE =
  "Assalam-o-Alaikum from {org}, {student} ({roll}) was marked ABSENT today on {date} in {subject} (Batch: {batch}). Please contact {org} for more details.";

const ACCENTS = {
  indigo: { label: "Indigo", pri: "#4f46e5", pri2: "#7c3aed", pbg: "rgba(79,70,229,.12)" },
  emerald: { label: "Emerald", pri: "#059669", pri2: "#0d9488", pbg: "rgba(5,150,105,.12)" },
  rose: { label: "Rose", pri: "#e11d48", pri2: "#db2777", pbg: "rgba(225,29,72,.12)" },
  amber: { label: "Amber", pri: "#d97706", pri2: "#ea580c", pbg: "rgba(217,119,6,.12)" },
  cyan: { label: "Cyan", pri: "#0284c7", pri2: "#2563eb", pbg: "rgba(2,132,199,.12)" },
  slate: { label: "Slate", pri: "#334155", pri2: "#0f172a", pbg: "rgba(51,65,85,.12)" },
};

const LANGS = {
  en: {
    dir: "ltr",
    label: "English",
    signIn: "Sign in",
    email: "Email",
    usernameLabel: "Your Username (who is logging in)",
    usernamePh: "Enter your name / username",
    password: "Password",
    language: "Language",
    dash: "Dashboard",
    mark: "Attendance",
    students: "Students",
    fees: "Fees",
    reports: "Reports",
    batches: "Batches",
    settings: "Settings",
    myAtt: "My attendance",
    editProf: "Edit profile",
    syncNow: "Sync now",
    themeBtn: "Dark / Light mode",
    logout: "Log out",
    alerts: "Alerts",
    searchStu: "Search students",
    markToday: "Mark today",
    feeDues: "Fee dues",
    todayAtt: "Today’s attendance",
    presentToday: "Present today",
    absentToday: "Absent today",
    lateArr: "Late arrivals",
    atRisk: "At-risk students",
    unpaidFees: "Unpaid fees",
    attTrend: "Attendance trend",
    batchComp: "Batch comparison (14 days)",
    lowAtt: "Low attendance",
    saveSettings: "Save settings",
  },
  ur: {
    dir: "rtl",
    label: "اردو",
    signIn: "لاگ ان کریں",
    email: "ای میل",
    usernameLabel: "آپ کا یوزر نیم (کون لاگ ان کر رہا ہے)",
    usernamePh: "اپنا نام یا یوزر نیم لکھیں",
    password: "پاس ورڈ",
    language: "زبان",
    dash: "ڈیش بورڈ",
    mark: "حاضری",
    students: "طلبہ",
    fees: "فیس",
    reports: "رپورٹس",
    batches: "بیچز",
    settings: "سیٹنگز",
    myAtt: "میری حاضری",
    editProf: "پروفائل تبدیل کریں",
    syncNow: "ابھی سنک کریں",
    themeBtn: "ڈارک / لائٹ موڈ",
    logout: "لاگ آؤٹ",
    alerts: "الرٹس",
    searchStu: "طلبہ تلاش کریں",
    markToday: "آج کی حاضری",
    feeDues: "باقی فیس",
    todayAtt: "آج کی حاضری",
    presentToday: "آج حاضر",
    absentToday: "آج غیر حاضر",
    lateArr: "تاخیر سے آنے والے",
    atRisk: "کم حاضری والے طلبہ",
    unpaidFees: "غیر ادا شدہ فیس",
    attTrend: "حاضری کا رجحان",
    batchComp: "بیچ موازنہ (14 دن)",
    lowAtt: "کم حاضری الرٹ",
    saveSettings: "سیٹنگز محفوظ کریں",
  },
  ro: {
    dir: "ltr",
    label: "Roman Urdu",
    signIn: "Sign in karein",
    email: "Email",
    usernameLabel: "Aap ka Username (kaun login kar raha hai)",
    usernamePh: "Apna naam / username likhein",
    password: "Password",
    language: "Zaban / Language",
    dash: "Dashboard",
    mark: "Attendance",
    students: "Students",
    fees: "Fees",
    reports: "Reports",
    batches: "Batches",
    settings: "Settings",
    myAtt: "Meri attendance",
    editProf: "Profile edit karein",
    syncNow: "Sync karein",
    themeBtn: "Dark / Light mode",
    logout: "Log out",
    alerts: "Alerts",
    searchStu: "Student search karein",
    markToday: "Aaj ki hazri",
    feeDues: "Fee dues",
    todayAtt: "Aaj ki attendance",
    presentToday: "Aaj hazir",
    absentToday: "Aaj ghair-hazir",
    lateArr: "Late arrivals",
    atRisk: "Kam attendance",
    unpaidFees: "Unpaid fees",
    attTrend: "Attendance trend",
    batchComp: "Batch comparison (14 din)",
    lowAtt: "Kam attendance alerts",
    saveSettings: "Settings save karein",
  },
};

const ST = { P: "Present", A: "Absent", L: "Late", V: "Leave" };

function defaultOwnerMeta() {
  return {
    ownerEmail: DEFAULT_OWNER_EMAIL,
    ownerPw: DEFAULT_OWNER_PW,
    ownerProfile: { name: DEFAULT_OWNER_NAME, photo: "" },
    adminEmail: DEFAULT_ADMIN_EMAIL,
    adminPw: DEFAULT_ADMIN_PW,
    adminName: DEFAULT_ADMIN_NAME,
    globalAppLocked: false,
    globalLockMsg: DEFAULT_LOCK_MSG,
    trialDays: DEFAULT_TRIAL_DAYS,
    trialIpLock: true,
    trialClaimedIps: {},
    trialAccounts: {},
    revokedTrials: {},
    loginLogs: [],
  };
}

function fmtDateShort(dateStr) {
  if (!dateStr) return "";
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function fmtRs(amount) {
  return `Rs. ${Number(amount || 0).toLocaleString("en-PK")}`;
}

function formatElapsed(sinceIso) {
  if (!sinceIso) return "–";
  const ms = Date.now() - new Date(sinceIso).getTime();
  if (!Number.isFinite(ms) || ms < 0) return "Just now";
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ${mins % 60}m ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ${hrs % 24}h ago`;
}

function trialDaysElapsed(claimedAt) {
  if (!claimedAt) return 0;
  const start = new Date(claimedAt).getTime();
  if (!start) return 0;
  return Math.max(0, Math.floor((Date.now() - start) / 86400000));
}

function waAbsentLink(phone, stuName, rollNo, batchName, dateStr, subject, orgName, tpl) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "";
  const intl = digits.startsWith("03") ? `92${digits.slice(1)}` : digits;
  const text = String(tpl || DEFAULT_WA_TEMPLATE)
    .replace(/\{org\}/g, orgName)
    .replace(/\{student\}/g, stuName)
    .replace(/\{roll\}/g, rollNo || "")
    .replace(/\{batch\}/g, batchName || "")
    .replace(/\{subject\}/g, subject || "Class")
    .replace(/\{date\}/g, fmtDateShort(dateStr));
  return `https://wa.me/${intl}?text=${encodeURIComponent(text)}`;
}

function waFeeLink(phone, stuName, batchName, amt, orgName) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "";
  const intl = digits.startsWith("03") ? `92${digits.slice(1)}` : digits;
  const text = `Assalam-o-Alaikum from ${orgName}, reminder that ${stuName} (${batchName}) has a fee of ${fmtRs(amt)} pending.`;
  return `https://wa.me/${intl}?text=${encodeURIComponent(text)}`;
}

function waOwnerContactLink(reasonText = "") {
  const msg = encodeURIComponent(
    `Assalam-o-Alaikum, ${DEFAULT_ORG} subscription / trial ke liye contact kar raha hoon. ${reasonText}`
  );
  return `https://wa.me/92${OWNER_CONTACT_PHONE.replace(/^0/, "")}?text=${msg}`;
}

function resizeImageFile(file, cb, maxSide = 220) {
  if (!file || !file.type.startsWith("image/")) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      let w = img.width;
      let h = img.height;
      if (w > h && w > maxSide) {
        h = Math.round((h * maxSide) / w);
        w = maxSide;
      } else if (h >= w && h > maxSide) {
        w = Math.round((w * maxSide) / h);
        h = maxSide;
      }
      const cv = document.createElement("canvas");
      cv.width = w;
      cv.height = h;
      const ctx = cv.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);
      cb(cv.toDataURL("image/jpeg", 0.82));
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

export default function CoachingPortalPage() {
  const [today, setToday] = useState("");
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("dash");
  const [lang, setLang] = useState("en");
  const [theme, setTheme] = useState("light");
  const [accent, setAccent] = useState("indigo");

  // Institute & operational settings
  const [orgName, setOrgName] = useState(DEFAULT_ORG);
  const [tagline, setTagline] = useState(DEFAULT_TAGLINE);
  const [orgLogo, setOrgLogo] = useState("");
  const [ipLock, setIpLock] = useState(false);
  const [allowedIps, setAllowedIps] = useState("");
  const [clientIp, setClientIp] = useState("");
  const [waAuto, setWaAuto] = useState(true);
  const [waTemplate, setWaTemplate] = useState(DEFAULT_WA_TEMPLATE);

  // Owner & trial management state
  const [ownerMeta, setOwnerMeta] = useState(defaultOwnerMeta);
  const [trialAlertReason, setTrialAlertReason] = useState("");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Edit profile modal state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profNameDraft, setProfNameDraft] = useState("");
  const [profPhotoDraft, setProfPhotoDraft] = useState("");

  // Alerts modal state
  const [showAlertsModal, setShowAlertsModal] = useState(false);

  // Data from MongoDB APIs
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [attendanceDocs, setAttendanceDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncLabel, setSyncLabel] = useState("MongoDB synced");
  const [toastMsg, setToastMsg] = useState("");
  const [mobOpen, setMobOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [feeFilter, setFeeFilter] = useState("");

  const [showAddStudent, setShowAddStudent] = useState(false);
  const [stuForm, setStuForm] = useState({
    name: "",
    rollNo: "",
    phone: "",
    parentPhone: "",
    batchName: "Matric Science",
    feeAmount: "3500",
    feeStatus: "Pending",
  });

  const [showAddBatch, setShowAddBatch] = useState(false);
  const [batchForm, setBatchForm] = useState({
    name: "",
    timing: "16:00–17:30",
    monthlyFee: "3500",
    minAttendance: "75",
  });

  const [attDate, setAttDate] = useState("");
  const [attBatch, setAttBatch] = useState("Matric Science");
  const [attSubject, setAttSubject] = useState("General");
  const [attStatusMap, setAttStatusMap] = useState({});

  function showToast(msg) {
    setToastMsg(msg);
    window.clearTimeout(window.__toastTimer);
    window.__toastTimer = window.setTimeout(() => setToastMsg(""), 2600);
  }

  async function detectIp() {
    if (clientIp) return clientIp;
    try {
      const res = await fetch("https://api.ipify.org?format=json", { cache: "no-store" });
      const data = await res.json();
      const ip = String(data?.ip || "").trim();
      if (ip) {
        setClientIp(ip);
        return ip;
      }
    } catch {}
    return "";
  }

  function saveOwnerMeta(nextMeta) {
    const merged = { ...defaultOwnerMeta(), ...nextMeta };
    setOwnerMeta(merged);
    try {
      localStorage.setItem(OWNER_META_KEY, JSON.stringify(merged));
    } catch {}
  }

  function saveBrandConfig(patch = {}) {
    const next = {
      orgName,
      tagline,
      orgLogo,
      accent,
      ipLock,
      allowedIps,
      waAuto,
      waTemplate,
      ...patch,
    };
    try {
      localStorage.setItem("our_coaching_brand_v4", JSON.stringify(next));
    } catch {}
  }

  function getTrialStatus(email, ip) {
    const em = String(email || "").trim().toLowerCase();
    const rev = ownerMeta.revokedTrials || {};
    if (em && rev[`email:${em}`]) return "removed";
    if (ip && rev[`ip:${ip}`]) return "removed";
    if (ownerMeta.trialIpLock && ip) {
      const claim = ownerMeta.trialClaimedIps?.[ip];
      const limit = Number(ownerMeta.trialDays) || DEFAULT_TRIAL_DAYS;
      if (claim?.claimedAt && trialDaysElapsed(claim.claimedAt) >= limit) {
        return "expired";
      }
    }
    return "";
  }

  useEffect(() => {
    const nowIso = new Date().toLocaleDateString("en-CA");
    setToday(nowIso);
    setAttDate((prev) => prev || nowIso);

    try {
      const savedLang = localStorage.getItem(LANG_KEY);
      if (savedLang && LANGS[savedLang]) setLang(savedLang);

      const savedTheme = localStorage.getItem(THEME_KEY);
      if (savedTheme === "dark" || savedTheme === "light") setTheme(savedTheme);

      const savedOm = JSON.parse(localStorage.getItem(OWNER_META_KEY) || "null");
      if (savedOm) setOwnerMeta({ ...defaultOwnerMeta(), ...savedOm });

      const savedBrand = JSON.parse(localStorage.getItem("our_coaching_brand_v4") || "null");
      if (savedBrand) {
        if (savedBrand.orgName) setOrgName(savedBrand.orgName);
        if (savedBrand.tagline !== undefined) setTagline(savedBrand.tagline);
        if (savedBrand.orgLogo !== undefined) setOrgLogo(savedBrand.orgLogo);
        if (savedBrand.accent && ACCENTS[savedBrand.accent]) setAccent(savedBrand.accent);
        if (typeof savedBrand.ipLock === "boolean") setIpLock(savedBrand.ipLock);
        if (savedBrand.allowedIps !== undefined) setAllowedIps(savedBrand.allowedIps);
        if (typeof savedBrand.waAuto === "boolean") setWaAuto(savedBrand.waAuto);
        if (savedBrand.waTemplate) setWaTemplate(savedBrand.waTemplate);
      }

      const savedSess = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
      if (savedSess && savedSess.email) setUser(savedSess);
    } catch {}

    detectIp();
  }, []);

  useEffect(() => {
    const cfg = LANGS[lang] || LANGS.en;
    document.documentElement.lang = lang;
    document.documentElement.dir = cfg.dir;
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {}
  }, [lang]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    const pal = ACCENTS[accent] || ACCENTS.indigo;
    const root = document.documentElement.style;
    root.setProperty("--pri", pal.pri);
    root.setProperty("--pri2", pal.pri2);
    root.setProperty("--pbg", pal.pbg);
  }, [accent]);

  // Enforce Kill Switch or Trial Expiry on active session
  useEffect(() => {
    if (!user) return;
    if (ownerMeta.globalAppLocked && user.role !== "owner") {
      setUser(null);
      try {
        localStorage.removeItem(SESSION_KEY);
      } catch {}
      showToast("Portal paused by owner");
      return;
    }
    if (user.role === "admin") {
      const st = getTrialStatus(user.email, user.ip || clientIp);
      if (st) {
        setUser(null);
        try {
          localStorage.removeItem(SESSION_KEY);
        } catch {}
        setTrialAlertReason(
          st === "expired"
            ? `Aapka ${Number(ownerMeta.trialDays) || DEFAULT_TRIAL_DAYS}-day trial khatam ho gaya hai.`
            : "Aapka trial access remove/pause kar diya gaya hai."
        );
      }
    }
  }, [user, ownerMeta, clientIp]);

  const T = (key) => (LANGS[lang] && LANGS[lang][key]) || LANGS.en[key] || key;

  async function loadAll(silent = false) {
    if (!silent) setLoading(true);
    setSyncLabel("Syncing...");
    try {
      const [sRes, bRes, aRes] = await Promise.all([
        fetch("/api/students", { cache: "no-store" }),
        fetch("/api/batches", { cache: "no-store" }),
        fetch("/api/attendance", { cache: "no-store" }),
      ]);
      const [sJson, bJson, aJson] = await Promise.all([sRes.json(), bRes.json(), aRes.json()]);
      if (sJson.ok) setStudents(sJson.students || []);
      if (bJson.ok) {
        const list = bJson.batches || [];
        setBatches(list);
        if (list.length > 0) {
          setStuForm((prev) => ({ ...prev, batchName: prev.batchName || list[0].name }));
          setAttBatch((prev) => prev || list[0].name);
        }
      }
      if (aJson.ok) setAttendanceDocs(aJson.attendance || []);
      setSyncLabel("MongoDB synced");
    } catch {
      setSyncLabel("Sync error");
      if (!silent) showToast("MongoDB API load error");
    } finally {
      if (!silent) setLoading(false);
    }
  }

  useEffect(() => {
    loadAll(false);
  }, []);

  useEffect(() => {
    const doc = attendanceDocs.find((d) => d.date === attDate && d.batchName === attBatch);
    const nextMap = {};
    if (doc && Array.isArray(doc.records)) {
      doc.records.forEach((r) => {
        nextMap[r.studentId] = r.status || "P";
      });
    }
    setAttStatusMap(nextMap);
  }, [attDate, attBatch, attendanceDocs]);

  async function handleLogin(e) {
    e.preventDefault();
    const em = loginEmail.trim().toLowerCase();
    const pw = loginPassword;
    const uname = loginUsername.trim();
    const ip = await detectIp();

    const ownerEm = String(ownerMeta.ownerEmail || DEFAULT_OWNER_EMAIL).toLowerCase();
    const ownerPw = ownerMeta.ownerPw || DEFAULT_OWNER_PW;
    const adminEm = String(ownerMeta.adminEmail || DEFAULT_ADMIN_EMAIL).toLowerCase();
    const adminPw = ownerMeta.adminPw || DEFAULT_ADMIN_PW;

    // 1. Owner login
    if (em === ownerEm) {
      if (pw !== ownerPw) {
        showToast("Invalid owner password");
        return;
      }
      const sess = {
        email: ownerEm,
        role: "owner",
        name: ownerMeta.ownerProfile?.name || DEFAULT_OWNER_NAME,
        ip,
      };
      setUser(sess);
      setTab("dash");
      try {
        localStorage.setItem(SESSION_KEY, JSON.stringify(sess));
      } catch {}
      showToast(`Signed in as ${sess.name}`);
      return;
    }

    // Check global kill switch for non-owners
    if (ownerMeta.globalAppLocked) {
      setTrialAlertReason(ownerMeta.globalLockMsg || DEFAULT_LOCK_MSG);
      showToast("Portal paused by owner");
      return;
    }

    // 2. Trial Admin login (4-day trial + IP tracking)
    if (em === adminEm) {
      if (pw !== adminPw) {
        showToast("Invalid admin password");
        return;
      }
      const status = getTrialStatus(em, ip);
      if (status) {
        setTrialAlertReason(
          status === "expired"
            ? `Aapka ${Number(ownerMeta.trialDays) || DEFAULT_TRIAL_DAYS}-day trial khatam ho gaya hai.`
            : "Aapka trial access remove/pause kar diya gaya hai."
        );
        return;
      }
      const activeName = uname || ownerMeta.adminName || DEFAULT_ADMIN_NAME;
      const nowIso = new Date().toISOString();
      const nextClaimed = { ...(ownerMeta.trialClaimedIps || {}) };
      if (ownerMeta.trialIpLock && ip) {
        if (!nextClaimed[ip]) {
          nextClaimed[ip] = {
            email: em,
            username: activeName,
            claimedAt: nowIso,
          };
        } else if (uname) {
          nextClaimed[ip] = { ...nextClaimed[ip], username: uname };
        }
      }

      const accKey = `${em}|${ip || "local"}`;
      const prevAcc = ownerMeta.trialAccounts?.[accKey];
      const nextAccounts = {
        ...(ownerMeta.trialAccounts || {}),
        [accKey]: {
          email: em,
          username: activeName,
          role: "admin",
          ip: ip || "–",
          firstLoginAt: prevAcc?.firstLoginAt || nowIso,
          lastLoginAt: nowIso,
          loginCount: (Number(prevAcc?.loginCount) || 0) + 1,
        },
      };

      const nextLogs = (ownerMeta.loginLogs || [])
        .concat([{ email: em, username: activeName, role: "admin", ip: ip || "–", at: nowIso }])
        .slice(-60);

      saveOwnerMeta({
        ...ownerMeta,
        trialClaimedIps: nextClaimed,
        trialAccounts: nextAccounts,
        loginLogs: nextLogs,
      });

      const sess = { email: em, role: "admin", name: activeName, ip };
      setUser(sess);
      setTab("dash");
      try {
        localStorage.setItem(SESSION_KEY, JSON.stringify(sess));
      } catch {}
      showToast(`Welcome, ${activeName}`);
      return;
    }

    // 3. Student login (with Campus IP lock check)
    const matchedStudent = students.find(
      (s) => String(s.rollNo || "").trim().toLowerCase() === em || String(s.name || "").trim().toLowerCase() === em
    );
    if (matchedStudent && pw === "student123") {
      if (ipLock) {
        const allowList = String(allowedIps || "")
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean);
        if (allowList.length > 0 && (!ip || !allowList.includes(ip))) {
          showToast("Campus IP lock: Sirf coaching Wi-Fi/IP se login allowed hai");
          return;
        }
      }
      const sess = {
        email: em,
        role: "student",
        name: uname || matchedStudent.name,
        studentId: matchedStudent._id,
        ip,
      };
      setUser(sess);
      setTab("dash");
      try {
        localStorage.setItem(SESSION_KEY, JSON.stringify(sess));
      } catch {}
      showToast(`Welcome, ${sess.name}`);
      return;
    }

    showToast("Invalid credentials");
  }

  function handleLogout() {
    setUser(null);
    setTab("dash");
    setMobOpen(false);
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {}
    showToast("Logged out");
  }

  function openProfileModal() {
    if (!user) return;
    setProfNameDraft(user.name || "");
    setProfPhotoDraft(user.photo || "");
    setShowProfileModal(true);
  }

  function handleSaveProfile(e) {
    e.preventDefault();
    if (!user) return;
    const cleanName = profNameDraft.trim() || user.name;
    const updatedUser = { ...user, name: cleanName, photo: profPhotoDraft };
    setUser(updatedUser);
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
    } catch {}

    if (user.role === "owner") {
      saveOwnerMeta({
        ...ownerMeta,
        ownerProfile: { ...(ownerMeta.ownerProfile || {}), name: cleanName, photo: profPhotoDraft },
      });
    } else if (user.role === "admin") {
      saveOwnerMeta({ ...ownerMeta, adminName: cleanName });
    }
    setShowProfileModal(false);
    showToast("Profile updated");
  }

  async function handleCreateStudent(e) {
    e.preventDefault();
    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...stuForm,
        feeAmount: Number(stuForm.feeAmount) || 3500,
      }),
    });
    const json = await res.json();
    if (!json.ok) {
      showToast(json.error || "Failed to add student");
      return;
    }
    setStuForm({
      name: "",
      rollNo: "",
      phone: "",
      parentPhone: "",
      batchName: stuForm.batchName || "Matric Science",
      feeAmount: stuForm.feeAmount || "3500",
      feeStatus: "Pending",
    });
    setShowAddStudent(false);
    await loadAll(true);
    showToast("Student saved to MongoDB");
  }

  async function handleToggleFee(student) {
    const nextStatus = student.feeStatus === "Paid" ? "Pending" : "Paid";
    const res = await fetch(`/api/students/${student._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feeStatus: nextStatus }),
    });
    const json = await res.json();
    if (json.ok) {
      await loadAll(true);
      showToast(`${student.name} marked ${nextStatus}`);
    }
  }

  async function handleDeleteStudent(id) {
    const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.ok) {
      await loadAll(true);
      showToast("Student removed");
    }
  }

  async function handleCreateBatch(e) {
    e.preventDefault();
    const res = await fetch("/api/batches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: batchForm.name,
        timing: batchForm.timing,
        monthlyFee: Number(batchForm.monthlyFee) || 3500,
        minAttendance: Number(batchForm.minAttendance) || 75,
      }),
    });
    const json = await res.json();
    if (json.ok) {
      const createdName = batchForm.name;
      setBatchForm({ name: "", timing: "16:00–17:30", monthlyFee: "3500", minAttendance: "75" });
      setShowAddBatch(false);
      setAttBatch(createdName);
      setStuForm((prev) => ({ ...prev, batchName: createdName }));
      await loadAll(true);
      showToast("Batch saved to MongoDB");
    } else {
      showToast(json.error || "Failed to create batch");
    }
  }

  async function handleSaveAttendance() {
    const batchStudents = students.filter((s) => !attBatch || s.batchName === attBatch);
    const records = batchStudents.map((s) => ({
      studentId: s._id,
      studentName: s.name,
      status: attStatusMap[s._id] || "P",
    }));
    const res = await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: attDate || today,
        batchName: attBatch,
        records,
      }),
    });
    const json = await res.json();
    if (json.ok) {
      await loadAll(true);
      showToast(`Attendance saved (${attBatch} · ${attDate || today})`);
    } else {
      showToast(json.error || "Failed to save attendance");
    }
  }

  function handleSaveSettings() {
    saveBrandConfig({
      orgName,
      tagline,
      orgLogo,
      accent,
      ipLock,
      allowedIps,
      waAuto,
      waTemplate,
    });
    showToast("Settings saved");
  }

  function handleExtendTrial(ip, email) {
    const nextRevoked = { ...(ownerMeta.revokedTrials || {}) };
    if (email) delete nextRevoked[`email:${email.toLowerCase()}`];
    if (ip) delete nextRevoked[`ip:${ip}`];

    const nextClaimed = { ...(ownerMeta.trialClaimedIps || {}) };
    if (ip && nextClaimed[ip]) {
      const cur = new Date(nextClaimed[ip].claimedAt || Date.now()).getTime();
      nextClaimed[ip] = {
        ...nextClaimed[ip],
        claimedAt: new Date(cur + 7 * 86400000).toISOString(),
      };
    }

    const nextAcc = { ...(ownerMeta.trialAccounts || {}) };
    Object.keys(nextAcc).forEach((k) => {
      const a = nextAcc[k];
      if ((email && a.email === email) || (ip && a.ip === ip)) {
        const cur = new Date(a.firstLoginAt || Date.now()).getTime();
        nextAcc[k] = { ...a, firstLoginAt: new Date(cur + 7 * 86400000).toISOString() };
      }
    });

    saveOwnerMeta({
      ...ownerMeta,
      revokedTrials: nextRevoked,
      trialClaimedIps: nextClaimed,
      trialAccounts: nextAcc,
    });
    showToast("Trial extended by +7 days");
  }

  function handleRemoveTrial(ip, email) {
    const nextRevoked = { ...(ownerMeta.revokedTrials || {}) };
    if (email) nextRevoked[`email:${email.toLowerCase()}`] = new Date().toISOString();
    if (ip) nextRevoked[`ip:${ip}`] = new Date().toISOString();
    const nextClaimed = { ...(ownerMeta.trialClaimedIps || {}) };
    if (ip && nextClaimed[ip]) delete nextClaimed[ip];
    saveOwnerMeta({ ...ownerMeta, revokedTrials: nextRevoked, trialClaimedIps: nextClaimed });
    showToast("Trial access removed");
  }

  const batchNames = useMemo(() => {
    const set = new Set(batches.map((b) => b.name));
    students.forEach((s) => s.batchName && set.add(s.batchName));
    if (!set.size) set.add("Matric Science");
    return Array.from(set);
  }, [batches, students]);

  const studentAttendanceStats = useMemo(() => {
    const map = {};
    students.forEach((s) => {
      map[s._id] = { total: 0, presentLike: 0, absent: 0 };
    });
    attendanceDocs.forEach((doc) => {
      (doc.records || []).forEach((r) => {
        const st = map[r.studentId];
        if (!st) return;
        if (r.status !== "V") st.total += 1;
        if (r.status === "P" || r.status === "L") st.presentLike += 1;
        if (r.status === "A") st.absent += 1;
      });
    });
    return map;
  }, [students, attendanceDocs]);

  const todayCounts = useMemo(() => {
    const c = { P: 0, A: 0, L: 0, V: 0 };
    if (!today) return { ...c, pct: null };
    attendanceDocs
      .filter((d) => d.date === today)
      .forEach((d) => {
        (d.records || []).forEach((r) => {
          if (c[r.status] !== undefined) c[r.status] += 1;
        });
      });
    const denom = c.P + c.A + c.L;
    const pct = denom ? Math.round(((c.P + c.L) / denom) * 100) : null;
    return { ...c, pct };
  }, [attendanceDocs, today]);

  const alertItems = useMemo(() => {
    const list = [];
    students.forEach((s) => {
      const bObj = batches.find((b) => b.name === s.batchName);
      const th = Number(bObj?.minAttendance) || 75;
      const st = studentAttendanceStats[s._id] || { total: 0, presentLike: 0, absent: 0 };
      const pct = st.total > 0 ? Math.round((st.presentLike / st.total) * 100) : null;
      const reasons = [];
      if (pct !== null && pct < th) reasons.push(`Attendance ${pct}% (< ${th}%)`);
      if (st.absent >= 3) reasons.push(`${st.absent} absences`);
      if (s.feeStatus !== "Paid") reasons.push(`Fee due (${fmtRs(s.feeAmount)})`);
      if (reasons.length > 0) {
        list.push({ student: s, pct, th, absent: st.absent, reasons });
      }
    });
    return list;
  }, [students, batches, studentAttendanceStats]);

  const atRiskStudents = useMemo(
    () => alertItems.filter((x) => x.pct !== null && x.pct < x.th),
    [alertItems]
  );

  const paidStudents = students.filter((s) => s.feeStatus === "Paid");
  const pendingStudents = students.filter((s) => s.feeStatus !== "Paid");
  const collectedFee = paidStudents.reduce((sum, s) => sum + Number(s.feeAmount || 0), 0);
  const pendingFee = pendingStudents.reduce((sum, s) => sum + Number(s.feeAmount || 0), 0);

  const filteredStudents = students.filter((s) => {
    const q = search.trim().toLowerCase();
    const matchQ =
      !q ||
      String(s.name || "").toLowerCase().includes(q) ||
      String(s.rollNo || "").toLowerCase().includes(q) ||
      String(s.batchName || "").toLowerCase().includes(q);
    const matchB = !batchFilter || s.batchName === batchFilter;
    const matchF = !feeFilter || s.feeStatus === feeFilter;
    return matchQ && matchB && matchF;
  });

  const navItems = [
    ["dash", "dash"],
    ["mark", "mark"],
    ["students", "students"],
    ["fees", "fees"],
    ["reports", "reports"],
    ["batches", "batches"],
    ["settings", "settings"],
  ];

  const trendPoints = useMemo(() => {
    const byDate = {};
    attendanceDocs.forEach((doc) => {
      if (!byDate[doc.date]) byDate[doc.date] = { P: 0, A: 0, L: 0 };
      (doc.records || []).forEach((r) => {
        if (byDate[doc.date][r.status] !== undefined) byDate[doc.date][r.status] += 1;
      });
    });
    return Object.keys(byDate)
      .sort()
      .slice(-14)
      .map((d) => {
        const x = byDate[d];
        const n = x.P + x.A + x.L;
        return { date: d, pct: n ? Math.round(((x.P + x.L) / n) * 100) : 0 };
      });
  }, [attendanceDocs]);

  const svgPts = trendPoints.map((x, i) => [
    30 + i * (540 / Math.max(trendPoints.length - 1, 1)),
    140 - x.pct * 1.2,
  ]);

  const currentAttStudents = students.filter((s) => !attBatch || s.batchName === attBatch);
  const currentAttCounts = { P: 0, A: 0, L: 0, V: 0 };
  currentAttStudents.forEach((s) => {
    const st = attStatusMap[s._id] || "P";
    if (currentAttCounts[st] !== undefined) currentAttCounts[st] += 1;
  });

  const trialAccountsList = Object.values(ownerMeta.trialAccounts || {}).sort(
    (a, b) => new Date(b.firstLoginAt || 0) - new Date(a.firstLoginAt || 0)
  );
  const claimedIpsList = Object.entries(ownerMeta.trialClaimedIps || {});
  const trialLimitDays = Number(ownerMeta.trialDays) || DEFAULT_TRIAL_DAYS;
  const recentLoginLogs = (ownerMeta.loginLogs || []).slice(-15).reverse();

  return (
    <>
      <div id="bg-fx" aria-hidden="true">
        <div className="dot-field" />
        <div className="mesh-wave-1" />
        <div className="mesh-wave-2" />
        <div className="scan-ribbon" />
        <div className="geo-orbit" />
        <div className="glow-node gn1" />
        <div className="glow-node gn2" />
        <div className="glow-node gn3" />
      </div>

      {!user ? (
        <div
          style={{
            position: "relative",
            zIndex: 1,
            minHeight: "100dvh",
            display: "grid",
            placeItems: "center",
            padding: 16,
          }}
        >
          <form
            className="card"
            onSubmit={handleLogin}
            style={{ width: "100%", maxWidth: 440, display: "grid", gap: 12 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
              <div className="logo">
                {orgLogo ? (
                  <img
                    src={orgLogo}
                    alt={orgName}
                    style={{ width: 28, height: 28, borderRadius: 8, objectFit: "cover" }}
                  />
                ) : null}
                <span className="brand-txt">{orgName}</span>
              </div>
              <span className={`sync ${syncLabel === "Sync error" ? "err" : ""}`}>
                <i />
                {syncLabel}
              </span>
            </div>

            {ownerMeta.globalAppLocked ? (
              <div
                style={{
                  background: "var(--Ab)",
                  color: "var(--A)",
                  padding: 12,
                  borderRadius: 12,
                  fontWeight: 600,
                }}
              >
                {ownerMeta.globalLockMsg || DEFAULT_LOCK_MSG}
              </div>
            ) : null}

            {trialAlertReason ? (
              <div
                style={{
                  background: "var(--Ab)",
                  color: "var(--A)",
                  padding: 12,
                  borderRadius: 12,
                  display: "grid",
                  gap: 6,
                }}
              >
                <b>{trialAlertReason}</b>
                <span className="sm">
                  Subscription / renewal ke liye contact karein: <b>{OWNER_CONTACT_PHONE}</b>
                </span>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <a
                    className="b sm pri"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={waOwnerContactLink(trialAlertReason)}
                  >
                    WhatsApp {OWNER_CONTACT_PHONE}
                  </a>
                  <button type="button" className="b sm" onClick={() => setTrialAlertReason("")}>
                    Dismiss
                  </button>
                </div>
              </div>
            ) : null}

            <h2>{T("signIn")}</h2>

            <div className="fl">
              <label>
                {T("email")}
                <input
                  type="text"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@ourcoaching.pk"
                />
              </label>
              <label>
                {T("usernameLabel")}
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder={T("usernamePh")}
                />
              </label>
              <label>
                {T("password")}
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </label>
            </div>

            <button type="submit" className="b pri">
              {T("signIn")}
            </button>

            <div className="mut sm">
              Trial default: <b>{ownerMeta.adminEmail}</b> / <b>{ownerMeta.adminPw}</b> ({trialLimitDays} days
              trial) · Owner: <b>{ownerMeta.ownerEmail}</b>
            </div>
          </form>
        </div>
      ) : (
        <div className="shell" style={{ position: "relative", zIndex: 1 }}>
          <aside className="side">
            <div className="logo">
              {orgLogo ? (
                <img
                  src={orgLogo}
                  alt={orgName}
                  style={{ width: 28, height: 28, borderRadius: 8, objectFit: "cover" }}
                />
              ) : null}
              <span className="brand-txt">{orgName}</span>
            </div>
            {tagline ? <div className="tagline">{tagline}</div> : null}

            {navItems.map(([key, labelKey]) => (
              <button
                key={key}
                type="button"
                className={`nv ${tab === key ? "on" : ""}`}
                onClick={() => {
                  setTab(key);
                  setMobOpen(false);
                }}
              >
                {T(labelKey)}
              </button>
            ))}

            <div style={{ flex: 1 }} />
            <button type="button" className="nv" onClick={openProfileModal}>
              {T("editProf")}
            </button>
            <button type="button" className="nv" onClick={() => loadAll(false)}>
              {T("syncNow")}
            </button>
            <button
              type="button"
              className="nv"
              onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
            >
              {T("themeBtn")}
            </button>
            <button type="button" className="nv" onClick={handleLogout}>
              {T("logout")}
            </button>
            <div className="mut sm" style={{ padding: "6px 12px 0" }}>
              Version {APP_VERSION}
            </div>
          </aside>

          <div>
            <header className="top">
              <b className="mut sm">
                {today ? `${fmtDateShort(today)} · ` : ""}
                {students.length} Students
              </b>
              <span className={`sync ${syncLabel === "Sync error" ? "err" : ""}`}>
                <i />
                {syncLabel}
              </span>
              <div className="sp" />

              <button type="button" className="b sm" onClick={() => setShowAlertsModal(true)}>
                {T("alerts")} ({alertItems.length})
              </button>

              <button type="button" className="b sm" onClick={openProfileModal}>
                {user.name} · {user.role}
              </button>

              <select
                className="lang-sel"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                aria-label="Language"
              >
                {Object.entries(LANGS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>

              <button type="button" className="b sm" onClick={handleLogout}>
                {T("logout")}
              </button>

              <div className="mob-dots-wrap">
                <button
                  type="button"
                  className="b sm"
                  onClick={() => setMobOpen((prev) => !prev)}
                  aria-label="Menu"
                >
                  ⋮
                </button>
              </div>

              <input
                placeholder={T("searchStu")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label={T("searchStu")}
              />
            </header>

            {mobOpen ? (
              <div className="card" style={{ margin: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
                {navItems.map(([key, labelKey]) => (
                  <button
                    key={key}
                    type="button"
                    className={`b sm ${tab === key ? "pri" : ""}`}
                    onClick={() => {
                      setTab(key);
                      setMobOpen(false);
                    }}
                  >
                    {T(labelKey)}
                  </button>
                ))}
              </div>
            ) : null}

            <main>
              <div className="tab-anim">
                {loading ? (
                  <div className="card">Loading MongoDB Atlas records...</div>
                ) : tab === "dash" ? (
                  <>
                    <div className="ph">
                      <h1>
                        {orgName} — {T("dash")}
                      </h1>
                      <div className="bar" style={{ margin: 0, width: "auto" }}>
                        <button type="button" className="b sm" onClick={() => setTab("mark")}>
                          {T("markToday")}
                        </button>
                        <button type="button" className="b sm pri" onClick={() => setTab("fees")}>
                          {T("feeDues")} ({pendingStudents.length})
                        </button>
                      </div>
                    </div>

                    <div className="kp">
                      <div className="card tilt-3d">
                        <span className="mut">Total Students</span>
                        <b>{students.length}</b>
                      </div>
                      <div className="card tilt-3d">
                        <span className="mut">{T("todayAtt")}</span>
                        <b>{todayCounts.pct === null ? "–" : `${todayCounts.pct}%`}</b>
                      </div>
                      <div className="card tilt-3d">
                        <span className="mut">{T("presentToday")}</span>
                        <b className="ok">{todayCounts.P}</b>
                      </div>
                      <div className="card tilt-3d">
                        <span className="mut">{T("absentToday")}</span>
                        <b className="bad">{todayCounts.A}</b>
                      </div>
                      <div className="card tilt-3d">
                        <span className="mut">Collected Fee</span>
                        <b className="ok">{fmtRs(collectedFee)}</b>
                      </div>
                      <div className="card tilt-3d">
                        <span className="mut">{T("unpaidFees")}</span>
                        <b className={pendingFee > 0 ? "bad" : "ok"}>{fmtRs(pendingFee)}</b>
                      </div>
                    </div>

                    <div className="g2">
                      <div className="card tilt-3d">
                        <h2 style={{ marginBottom: 10 }}>{T("attTrend")}</h2>
                        {trendPoints.length ? (
                          <svg viewBox="0 0 600 170" width="100%" style={{ display: "block" }}>
                            {[50, 75, 100].map((v) => (
                              <g key={v}>
                                <line
                                  x1="30"
                                  x2="590"
                                  y1={140 - v * 1.2}
                                  y2={140 - v * 1.2}
                                  stroke="var(--line)"
                                />
                                <text x="0" y={144 - v * 1.2} fontSize="10" fill="var(--mut)">
                                  {v}
                                </text>
                              </g>
                            ))}
                            <polyline
                              fill="none"
                              stroke="var(--pri)"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              points={svgPts.map((p) => p.join(",")).join(" ")}
                            />
                            {svgPts.map((p, i) => (
                              <circle key={i} cx={p[0]} cy={p[1]} r="4" fill="var(--pri)" />
                            ))}
                          </svg>
                        ) : (
                          <div className="emp">No attendance recorded yet.</div>
                        )}
                      </div>

                      <div className="card tilt-3d">
                        <h2 style={{ marginBottom: 12 }}>{T("batchComp")}</h2>
                        {batchNames.map((bName) => {
                          const bStu = students.filter((s) => s.batchName === bName);
                          let tot = 0;
                          let pr = 0;
                          bStu.forEach((s) => {
                            const st = studentAttendanceStats[s._id];
                            if (st) {
                              tot += st.total;
                              pr += st.presentLike;
                            }
                          });
                          const pct = tot > 0 ? Math.round((pr / tot) * 100) : null;
                          const bObj = batches.find((b) => b.name === bName);
                          const th = Number(bObj?.minAttendance) || 75;
                          return (
                            <div key={bName} style={{ marginBottom: 12 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                <b>{bName}</b>
                                <span className={pct !== null && pct < th ? "bad" : "ok"}>
                                  {pct === null ? "n/a" : `${pct}%`}
                                </span>
                              </div>
                              <div className="mt">
                                <i className={pct !== null && pct < th ? "lo" : ""} style={{ width: `${pct || 0}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="card tilt-3d">
                      <h2 style={{ marginBottom: 10 }}>
                        {T("alerts")} &amp; {T("lowAtt")} ({alertItems.length})
                      </h2>
                      {alertItems.length ? (
                        <div className="tw">
                          <table>
                            <thead>
                              <tr>
                                <th>Student</th>
                                <th>Batch</th>
                                <th>Alert Reasons</th>
                                <th>Parent</th>
                              </tr>
                            </thead>
                            <tbody>
                              {alertItems.map(({ student, reasons }) => (
                                <tr key={student._id}>
                                  <td>
                                    <b>{student.name}</b>
                                  </td>
                                  <td>{student.batchName}</td>
                                  <td className="bad">
                                    <b>{reasons.join(" · ")}</b>
                                  </td>
                                  <td>
                                    {student.parentPhone ? (
                                      <a
                                        className="b sm"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href={waFeeLink(
                                          student.parentPhone,
                                          student.name,
                                          student.batchName,
                                          student.feeAmount,
                                          orgName
                                        )}
                                      >
                                        WhatsApp
                                      </a>
                                    ) : (
                                      <span className="mut sm">–</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="emp">No alerts right now.</div>
                      )}
                    </div>
                  </>
                ) : tab === "mark" ? (
                  <>
                    <div className="ph">
                      <h1>{T("mark")}</h1>
                      <span className="mut sm">
                        {attBatch} · {fmtDateShort(attDate)}
                      </span>
                    </div>

                    <div className="bar">
                      <select value={attBatch} onChange={(e) => setAttBatch(e.target.value)} aria-label="Batch">
                        {batchNames.map((bn) => (
                          <option key={bn} value={bn}>
                            {bn}
                          </option>
                        ))}
                      </select>
                      <input
                        value={attSubject}
                        onChange={(e) => setAttSubject(e.target.value)}
                        placeholder="Subject"
                        style={{ width: 160 }}
                      />
                      <input type="date" max={today} value={attDate} onChange={(e) => setAttDate(e.target.value)} />
                      <button type="button" className="b pri" onClick={handleSaveAttendance}>
                        Save Attendance
                      </button>
                    </div>

                    <div className="cnt">
                      <span style={{ background: "var(--line)" }}>Total {currentAttStudents.length}</span>
                      <span className="sP">Present {currentAttCounts.P}</span>
                      <span className="sA">Absent {currentAttCounts.A}</span>
                      <span className="sL">Late {currentAttCounts.L}</span>
                      <span className="sV">Leave {currentAttCounts.V}</span>
                    </div>

                    {currentAttStudents.length ? (
                      currentAttStudents.map((s) => {
                        const curCode = attStatusMap[s._id] || "P";
                        const waUrl =
                          curCode === "A" && waAuto && s.parentPhone
                            ? waAbsentLink(
                                s.parentPhone,
                                s.name,
                                s.rollNo,
                                s.batchName,
                                attDate,
                                attSubject,
                                orgName,
                                waTemplate
                              )
                            : "";
                        return (
                          <div key={s._id} className="row">
                            <div className="nm">
                              <b>{s.name}</b>
                              <span className="mut sm">
                                {s.rollNo || "No Roll"} · {s.batchName}
                                {s.parentPhone ? ` · Parent: ${s.parentPhone}` : ""}
                              </span>
                            </div>
                            {waUrl ? (
                              <a className="b sm" target="_blank" rel="noopener noreferrer" href={waUrl}>
                                WA Absent
                              </a>
                            ) : null}
                            <div className="seg">
                              {Object.keys(ST).map((code) => (
                                <button
                                  key={code}
                                  type="button"
                                  className={curCode === code ? `o${code}` : ""}
                                  onClick={() => setAttStatusMap((prev) => ({ ...prev, [s._id]: code }))}
                                  title={ST[code]}
                                >
                                  {code}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="emp">No students in this batch yet.</div>
                    )}
                  </>
                ) : tab === "students" ? (
                  <>
                    <div className="ph">
                      <h1>
                        {T("students")} <span className="mut sm">{filteredStudents.length}</span>
                      </h1>
                      <button type="button" className="b pri" onClick={() => setShowAddStudent(true)}>
                        Add Student
                      </button>
                    </div>

                    <div className="bar">
                      <input
                        placeholder="Search name or roll no."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <select value={batchFilter} onChange={(e) => setBatchFilter(e.target.value)} aria-label="Batch filter">
                        <option value="">All batches</option>
                        {batchNames.map((bn) => (
                          <option key={bn} value={bn}>
                            {bn}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="card tw" style={{ padding: 0 }}>
                      {filteredStudents.length ? (
                        <table>
                          <thead>
                            <tr>
                              <th>Roll</th>
                              <th>Name</th>
                              <th>Batch</th>
                              <th>Parent Phone</th>
                              <th>Fee</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredStudents.map((s) => (
                              <tr key={s._id}>
                                <td>{s.rollNo || "–"}</td>
                                <td>
                                  <b>{s.name}</b>
                                </td>
                                <td>{s.batchName}</td>
                                <td>{s.parentPhone || "–"}</td>
                                <td>{fmtRs(s.feeAmount)}</td>
                                <td>
                                  <span className={`bd ${s.feeStatus === "Paid" ? "sP" : "sA"}`}>{s.feeStatus}</span>
                                </td>
                                <td>
                                  <div style={{ display: "flex", gap: 6 }}>
                                    <button type="button" className="b sm" onClick={() => handleToggleFee(s)}>
                                      {s.feeStatus === "Paid" ? "Mark Pending" : "Mark Paid"}
                                    </button>
                                    <button type="button" className="b sm del" onClick={() => handleDeleteStudent(s._id)}>
                                      Remove
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="emp">No students added yet.</div>
                      )}
                    </div>
                  </>
                ) : tab === "fees" ? (
                  <>
                    <div className="ph">
                      <h1>{T("fees")}</h1>
                    </div>

                    <div className="kp">
                      <div className="card tilt-3d">
                        <span className="mut">Collected Fee</span>
                        <b className="ok">{fmtRs(collectedFee)}</b>
                      </div>
                      <div className="card tilt-3d">
                        <span className="mut">Pending Dues</span>
                        <b className="bad">{fmtRs(pendingFee)}</b>
                      </div>
                      <div className="card tilt-3d">
                        <span className="mut">Paid Students</span>
                        <b className="ok">{paidStudents.length}</b>
                      </div>
                      <div className="card tilt-3d">
                        <span className="mut">Unpaid Students</span>
                        <b className="bad">{pendingStudents.length}</b>
                      </div>
                    </div>

                    <div className="bar">
                      <select value={batchFilter} onChange={(e) => setBatchFilter(e.target.value)} aria-label="Batch">
                        <option value="">All batches</option>
                        {batchNames.map((bn) => (
                          <option key={bn} value={bn}>
                            {bn}
                          </option>
                        ))}
                      </select>
                      <select value={feeFilter} onChange={(e) => setFeeFilter(e.target.value)} aria-label="Status">
                        <option value="">All statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                      </select>
                    </div>

                    <div className="card tw" style={{ padding: 0 }}>
                      {filteredStudents.length ? (
                        <table>
                          <thead>
                            <tr>
                              <th>Roll</th>
                              <th>Student</th>
                              <th>Batch</th>
                              <th>Fee</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredStudents.map((s) => (
                              <tr key={s._id}>
                                <td>{s.rollNo || "–"}</td>
                                <td>
                                  <b>{s.name}</b>
                                </td>
                                <td>{s.batchName}</td>
                                <td>
                                  <b>{fmtRs(s.feeAmount)}</b>
                                </td>
                                <td>
                                  <span className={`bd ${s.feeStatus === "Paid" ? "sP" : "sA"}`}>{s.feeStatus}</span>
                                </td>
                                <td>
                                  <div style={{ display: "flex", gap: 6 }}>
                                    <button
                                      type="button"
                                      className={`b sm ${s.feeStatus === "Paid" ? "" : "pri"}`}
                                      onClick={() => handleToggleFee(s)}
                                    >
                                      {s.feeStatus === "Paid" ? "Mark Pending" : "Mark Paid"}
                                    </button>
                                    {s.feeStatus !== "Paid" && s.parentPhone ? (
                                      <a
                                        className="b sm"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href={waFeeLink(s.parentPhone, s.name, s.batchName, s.feeAmount, orgName)}
                                      >
                                        WA Reminder
                                      </a>
                                    ) : null}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="emp">No fee records match this filter.</div>
                      )}
                    </div>
                  </>
                ) : tab === "reports" ? (
                  <>
                    <div className="ph">
                      <h1>{T("reports")}</h1>
                    </div>
                    <div className="card tw" style={{ padding: 0 }}>
                      {attendanceDocs.length ? (
                        <table>
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Batch</th>
                              <th>Present</th>
                              <th>Absent</th>
                              <th>Late</th>
                              <th>Leave</th>
                            </tr>
                          </thead>
                          <tbody>
                            {attendanceDocs.map((doc) => {
                              const c = { P: 0, A: 0, L: 0, V: 0 };
                              (doc.records || []).forEach((r) => {
                                if (c[r.status] !== undefined) c[r.status] += 1;
                              });
                              return (
                                <tr key={doc._id || `${doc.date}-${doc.batchName}`}>
                                  <td>{fmtDateShort(doc.date)}</td>
                                  <td>
                                    <b>{doc.batchName}</b>
                                  </td>
                                  <td className="ok">{c.P}</td>
                                  <td className="bad">{c.A}</td>
                                  <td>{c.L}</td>
                                  <td>{c.V}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      ) : (
                        <div className="emp">No attendance reports available yet.</div>
                      )}
                    </div>
                  </>
                ) : tab === "batches" ? (
                  <>
                    <div className="ph">
                      <h1>{T("batches")}</h1>
                      <button type="button" className="b pri" onClick={() => setShowAddBatch(true)}>
                        New Batch
                      </button>
                    </div>
                    <div className="card tw" style={{ padding: 0 }}>
                      {batches.length ? (
                        <table>
                          <thead>
                            <tr>
                              <th>Batch</th>
                              <th>Timing</th>
                              <th>Monthly Fee</th>
                              <th>Min. Attendance</th>
                              <th>Students</th>
                            </tr>
                          </thead>
                          <tbody>
                            {batches.map((b) => (
                              <tr key={b._id}>
                                <td>
                                  <b>{b.name}</b>
                                </td>
                                <td>{b.timing || "–"}</td>
                                <td>{fmtRs(b.monthlyFee || 3500)}</td>
                                <td>{b.minAttendance || 75}%</td>
                                <td>{students.filter((s) => s.batchName === b.name).length}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="emp">No batches created yet.</div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="ph">
                      <h1>{T("settings")}</h1>
                      <span className="mut sm">
                        Role: <b>{user.role}</b>
                      </span>
                    </div>

                    {user.role === "owner" ? (
                      <div
                        className="card"
                        style={{
                          marginBottom: 14,
                          borderColor: "rgba(225,29,72,.35)",
                          display: "grid",
                          gap: 12,
                        }}
                      >
                        <h2 style={{ color: "var(--A)" }}>Owner Controls — Kill Switch &amp; Trial Management</h2>

                        <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
                          <input
                            type="checkbox"
                            checked={!!ownerMeta.globalAppLocked}
                            onChange={(e) => {
                              const next = { ...ownerMeta, globalAppLocked: e.target.checked };
                              saveOwnerMeta(next);
                              showToast(e.target.checked ? "Kill Switch ON: Portal paused" : "Kill Switch OFF");
                            }}
                          />
                          <span>Kill Switch (Pause portal if client/trial does not pay)</span>
                        </label>

                        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
                          <label className="fl">
                            Trial Auto-Expiry Days
                            <input
                              type="number"
                              min="1"
                              max="365"
                              value={trialLimitDays}
                              onChange={(e) =>
                                saveOwnerMeta({
                                  ...ownerMeta,
                                  trialDays: Math.max(1, Number(e.target.value) || DEFAULT_TRIAL_DAYS),
                                })
                              }
                            />
                          </label>
                          <label className="fl">
                            Pause Screen Message
                            <input
                              value={ownerMeta.globalLockMsg || ""}
                              onChange={(e) => saveOwnerMeta({ ...ownerMeta, globalLockMsg: e.target.value })}
                            />
                          </label>
                        </div>

                        <div>
                          <b className="sm">Trial Accounts ({trialAccountsList.length}):</b>
                          {trialAccountsList.length ? (
                            <div className="tw" style={{ marginTop: 6 }}>
                              <table>
                                <thead>
                                  <tr>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>IP</th>
                                    <th>Login Date</th>
                                    <th>Elapsed</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {trialAccountsList.map((acc, idx) => {
                                    const st = getTrialStatus(acc.email, acc.ip);
                                    return (
                                      <tr key={`${acc.email}-${acc.ip}-${idx}`}>
                                        <td>
                                          <b>{acc.username || "–"}</b>
                                        </td>
                                        <td>{acc.email}</td>
                                        <td>{acc.ip || "–"}</td>
                                        <td className="sm">
                                          {(acc.firstLoginAt || "").slice(0, 16).replace("T", " ") || "–"}
                                        </td>
                                        <td className="sm">{formatElapsed(acc.firstLoginAt)}</td>
                                        <td>
                                          <span
                                            className={`bd ${
                                              st === "removed" ? "sA" : st === "expired" ? "sL" : "sP"
                                            }`}
                                          >
                                            {st === "removed" ? "Removed" : st === "expired" ? "Expired" : "Active"}
                                          </span>
                                        </td>
                                        <td>
                                          <div style={{ display: "flex", gap: 6 }}>
                                            <button
                                              type="button"
                                              className="b sm"
                                              onClick={() => handleExtendTrial(acc.ip, acc.email)}
                                            >
                                              +7d
                                            </button>
                                            <button
                                              type="button"
                                              className="b sm del"
                                              onClick={() => handleRemoveTrial(acc.ip, acc.email)}
                                            >
                                              Remove
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="mut sm">No trial logins yet.</div>
                          )}
                        </div>

                        <div>
                          <b className="sm">Claimed Trial IPs ({claimedIpsList.length}):</b>
                          {claimedIpsList.length ? (
                            <div className="tw" style={{ marginTop: 6 }}>
                              <table>
                                <thead>
                                  <tr>
                                    <th>Username</th>
                                    <th>IP</th>
                                    <th>Days Used</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {claimedIpsList.map(([ip, info]) => (
                                    <tr key={ip}>
                                      <td>
                                        <b>{info?.username || "–"}</b>
                                      </td>
                                      <td>{ip}</td>
                                      <td>
                                        {trialDaysElapsed(info?.claimedAt)} / {trialLimitDays} days
                                      </td>
                                      <td>
                                        <button
                                          type="button"
                                          className="b sm del"
                                          onClick={() => handleRemoveTrial(ip, info?.email)}
                                        >
                                          Block IP
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : null}
                        </div>

                        <div>
                          <b className="sm">Recent Sign-In Logs ({recentLoginLogs.length}):</b>
                          {recentLoginLogs.length ? (
                            <div className="tw" style={{ marginTop: 6 }}>
                              <table>
                                <thead>
                                  <tr>
                                    <th>Time</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>IP</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {recentLoginLogs.map((lg, i) => (
                                    <tr key={i} className="sm">
                                      <td>{(lg.at || "").slice(0, 16).replace("T", " ")}</td>
                                      <td>
                                        <b>{lg.username || "–"}</b>
                                      </td>
                                      <td>{lg.email}</td>
                                      <td>{lg.role}</td>
                                      <td>{lg.ip || "–"}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ) : null}

                    <div className="g2">
                      <div className="card fl">
                        <h2>Institute Branding &amp; Theme</h2>
                        <label>
                          Coaching Logo
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) resizeImageFile(f, (url) => setOrgLogo(url));
                            }}
                          />
                        </label>
                        <label>
                          Institute Name
                          <input value={orgName} onChange={(e) => setOrgName(e.target.value)} />
                        </label>
                        <label>
                          Tagline
                          <input value={tagline} onChange={(e) => setTagline(e.target.value)} />
                        </label>
                        <div>
                          <span className="mut sm">Accent Color</span>
                          <div className="swatches">
                            {Object.entries(ACCENTS).map(([key, pal]) => (
                              <button
                                key={key}
                                type="button"
                                className={`sw ${accent === key ? "on" : ""}`}
                                style={{ background: pal.pri }}
                                onClick={() => setAccent(key)}
                                title={pal.label}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="card fl">
                        <h2>Campus IP Lock &amp; WhatsApp</h2>
                        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <input
                            type="checkbox"
                            checked={ipLock}
                            onChange={(e) => setIpLock(e.target.checked)}
                          />
                          <span>Enable Campus IP Lock (Students only on allowed IP)</span>
                        </label>
                        <label>
                          Allowed Coaching IP(s) (comma separated)
                          <input
                            value={allowedIps}
                            onChange={(e) => setAllowedIps(e.target.value)}
                            placeholder="e.g. 103.255.4.12"
                          />
                        </label>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                          <button
                            type="button"
                            className="b sm"
                            onClick={async () => {
                              const ip = await detectIp();
                              if (!ip) {
                                showToast("Could not detect IP");
                                return;
                              }
                              const cur = String(allowedIps || "")
                                .split(",")
                                .map((x) => x.trim())
                                .filter(Boolean);
                              if (!cur.includes(ip)) cur.push(ip);
                              setAllowedIps(cur.join(", "));
                              showToast(`IP added: ${ip}`);
                            }}
                          >
                            Use my current IP
                          </button>
                          <span className="mut sm">
                            {clientIp ? `Current IP: ${clientIp}` : "Detecting IP..."}
                          </span>
                        </div>

                        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <input
                            type="checkbox"
                            checked={waAuto}
                            onChange={(e) => setWaAuto(e.target.checked)}
                          />
                          <span>Show WhatsApp absent notification link</span>
                        </label>
                        <label>
                          WhatsApp Message Template
                          <textarea
                            rows={3}
                            value={waTemplate}
                            onChange={(e) => setWaTemplate(e.target.value)}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="bar">
                      <button type="button" className="b pri" onClick={handleSaveSettings}>
                        {T("saveSettings")}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </main>
          </div>
        </div>
      )}

      {showProfileModal && user ? (
        <div className="ov" onClick={(e) => e.target === e.currentTarget && setShowProfileModal(false)}>
          <form className="md" onSubmit={handleSaveProfile}>
            <h3>{T("editProf")}</h3>
            <div className="fl">
              <label>
                Display Name
                <input
                  required
                  value={profNameDraft}
                  onChange={(e) => setProfNameDraft(e.target.value)}
                />
              </label>
              <label>
                Profile Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) resizeImageFile(f, (url) => setProfPhotoDraft(url));
                  }}
                />
              </label>
              {profPhotoDraft ? (
                <img
                  src={profPhotoDraft}
                  alt="Preview"
                  style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover" }}
                />
              ) : null}
            </div>
            <div className="mf">
              <button type="button" className="b" onClick={() => setShowProfileModal(false)}>
                Cancel
              </button>
              <button type="submit" className="b pri">
                Save Profile
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {showAlertsModal ? (
        <div className="ov" onClick={(e) => e.target === e.currentTarget && setShowAlertsModal(false)}>
          <div className="md">
            <h3>{T("alerts")} ({alertItems.length})</h3>
            {alertItems.length ? (
              <div style={{ display: "grid", gap: 8 }}>
                {alertItems.map(({ student, reasons }) => (
                  <div
                    key={student._id}
                    style={{
                      padding: 10,
                      borderRadius: 12,
                      border: "1px solid var(--line)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <div>
                      <b>{student.name}</b> <span className="mut sm">({student.batchName})</span>
                      <div className="bad sm">{reasons.join(" · ")}</div>
                    </div>
                    {student.parentPhone ? (
                      <a
                        className="b sm"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={waFeeLink(
                          student.parentPhone,
                          student.name,
                          student.batchName,
                          student.feeAmount,
                          orgName
                        )}
                      >
                        WA
                      </a>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <div className="emp">No alerts right now.</div>
            )}
            <div className="mf">
              <button type="button" className="b pri" onClick={() => setShowAlertsModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showAddStudent ? (
        <div className="ov" onClick={(e) => e.target === e.currentTarget && setShowAddStudent(false)}>
          <form className="md" onSubmit={handleCreateStudent}>
            <h3>Add Student</h3>
            <div className="fl">
              <label>
                Full Name
                <input
                  required
                  value={stuForm.name}
                  onChange={(e) => setStuForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Ali Raza"
                />
              </label>
              <label>
                Roll No
                <input
                  value={stuForm.rollNo}
                  onChange={(e) => setStuForm((p) => ({ ...p, rollNo: e.target.value }))}
                  placeholder="R-101"
                />
              </label>
              <label>
                Batch Name
                <input
                  value={stuForm.batchName}
                  onChange={(e) => setStuForm((p) => ({ ...p, batchName: e.target.value }))}
                  placeholder="Matric Science"
                />
              </label>
              <label>
                Parent WhatsApp
                <input
                  value={stuForm.parentPhone}
                  onChange={(e) => setStuForm((p) => ({ ...p, parentPhone: e.target.value }))}
                  placeholder="03001234567"
                />
              </label>
              <label>
                Monthly Fee (PKR)
                <input
                  type="number"
                  required
                  value={stuForm.feeAmount}
                  onChange={(e) => setStuForm((p) => ({ ...p, feeAmount: e.target.value }))}
                />
              </label>
            </div>
            <div className="mf">
              <button type="button" className="b" onClick={() => setShowAddStudent(false)}>
                Cancel
              </button>
              <button type="submit" className="b pri">
                Save Student
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {showAddBatch ? (
        <div className="ov" onClick={(e) => e.target === e.currentTarget && setShowAddBatch(false)}>
          <form className="md" onSubmit={handleCreateBatch}>
            <h3>New Batch</h3>
            <div className="fl">
              <label>
                Batch Name
                <input
                  required
                  value={batchForm.name}
                  onChange={(e) => setBatchForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Matric Science"
                />
              </label>
              <label>
                Timing
                <input
                  value={batchForm.timing}
                  onChange={(e) => setBatchForm((p) => ({ ...p, timing: e.target.value }))}
                  placeholder="16:00–17:30"
                />
              </label>
              <label>
                Monthly Fee (PKR)
                <input
                  type="number"
                  value={batchForm.monthlyFee}
                  onChange={(e) => setBatchForm((p) => ({ ...p, monthlyFee: e.target.value }))}
                />
              </label>
              <label>
                Min. Attendance (%)
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={batchForm.minAttendance}
                  onChange={(e) => setBatchForm((p) => ({ ...p, minAttendance: e.target.value }))}
                />
              </label>
            </div>
            <div className="mf">
              <button type="button" className="b" onClick={() => setShowAddBatch(false)}>
                Cancel
              </button>
              <button type="submit" className="b pri">
                Create Batch
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {toastMsg ? (
        <div
          style={{
            position: "fixed",
            left: "50%",
            bottom: 24,
            transform: "translateX(-50%)",
            background: "var(--ink)",
            color: "var(--bg)",
            padding: "10px 18px",
            borderRadius: 999,
            fontWeight: 600,
            zIndex: 40,
          }}
        >
          {toastMsg}
        </div>
      ) : null}
    </>
  );
}