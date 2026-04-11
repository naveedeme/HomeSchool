(() => {
  // table-tutor/app.jsx
  var { useState, useEffect, useRef, useCallback, useMemo } = React;
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function formatTime(s) {
    const m = Math.floor(s / 60), sec = s % 60;
    return m > 0 ? `${m}:${sec.toString().padStart(2, "0")}` : `${sec}s`;
  }
  function getGrade(pct) {
    if (pct >= 90) return { letter: "A", cls: "grade-A", emoji: "\u{1F31F}" };
    if (pct >= 75) return { letter: "B", cls: "grade-B", emoji: "\u2728" };
    if (pct >= 60) return { letter: "C", cls: "grade-C", emoji: "\u{1F44D}" };
    return { letter: "D", cls: "grade-D", emoji: "\u{1F4AA}" };
  }
  var ALL_TABLES = Array.from({ length: 20 }, (_, i) => i + 1);
  var tts = {
    voices: [],
    loaded: false,
    load() {
      if (typeof speechSynthesis === "undefined") return;
      const set = () => {
        tts.voices = speechSynthesis.getVoices();
        tts.loaded = true;
      };
      speechSynthesis.onvoiceschanged = set;
      set();
    },
    speak(text, cfg) {
      if (!cfg.enabled || typeof speechSynthesis === "undefined") return;
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = cfg.speed || 1;
      u.pitch = 1.05;
      u.volume = 1;
      if (cfg.voice) {
        const v = tts.voices.find((x) => x.name === cfg.voice);
        if (v) u.voice = v;
      }
      speechSynthesis.speak(u);
    },
    cancel() {
      typeof speechSynthesis !== "undefined" && speechSynthesis.cancel();
    }
  };
  function initStars() {
    const c = document.getElementById("starsContainer");
    if (!c) return;
    for (let i = 0; i < 70; i++) {
      const s = document.createElement("div");
      s.className = "star";
      const sz = Math.random() * 2.5 + 0.5;
      Object.assign(s.style, {
        width: sz + "px",
        height: sz + "px",
        left: Math.random() * 100 + "%",
        top: Math.random() * 100 + "%",
        "--d": Math.random() * 4 + 2 + "s",
        animationDelay: Math.random() * 5 + "s",
        opacity: Math.random() * 0.5 + 0.1
      });
      c.appendChild(s);
    }
  }
  function App() {
    const [tab, setTab] = useState("learn");
    const [selTable, setSelTable] = useState(2);
    const [opMode, setOpMode] = useState("mult");
    const [mastery, setMastery] = useState(() => {
      try {
        return JSON.parse(localStorage.getItem("tt_mastery") || "{}");
      } catch (e) {
        return {};
      }
    });
    const [ttsCfg, setTtsCfg] = useState({ enabled: false, voice: "", speed: 1 });
    const [ttsVoices, setTtsVoices] = useState([]);
    useEffect(() => {
      initStars();
      tts.load();
      const interval = setInterval(() => {
        if (tts.voices.length) {
          setTtsVoices(tts.voices);
          clearInterval(interval);
        }
      }, 300);
      return () => clearInterval(interval);
    }, []);
    useEffect(() => {
      localStorage.setItem("tt_mastery", JSON.stringify(mastery));
    }, [mastery]);
    const markMastered = (key) => setMastery((m) => ({ ...m, [key]: (m[key] || 0) + 1 }));
    const tabs = [{ id: "learn", label: "\u{1F4D6} Learn" }, { id: "rhythm", label: "\u{1F941} Rhythm" }, { id: "test", label: "\u270F\uFE0F Test" }, { id: "progress", label: "\u{1F4CA} Progress" }];
    const englishVoices = ttsVoices.filter((v) => v.lang.startsWith("en"));
    return /* @__PURE__ */ React.createElement("div", { className: "app" }, /* @__PURE__ */ React.createElement("header", { className: "header" }, /* @__PURE__ */ React.createElement("div", { className: "logo" }, "Seedling Table Trainer"), /* @__PURE__ */ React.createElement("div", { className: "tagline" }, "Multiplication & Division Mastery \xB7 Tables 1\u201320")), /* @__PURE__ */ React.createElement("div", { className: "tts-bar" }, /* @__PURE__ */ React.createElement("span", { className: "tts-label" }, "\u{1F50A} VOICE:"), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: `tts-toggle${ttsCfg.enabled ? " on" : ""}`,
        onClick: () => setTtsCfg((c) => ({ ...c, enabled: !c.enabled }))
      },
      /* @__PURE__ */ React.createElement("span", { className: "dot" }),
      ttsCfg.enabled ? "On" : "Off"
    ), ttsCfg.enabled && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
      "select",
      {
        className: "tts-select",
        value: ttsCfg.voice,
        onChange: (e) => setTtsCfg((c) => ({ ...c, voice: e.target.value }))
      },
      /* @__PURE__ */ React.createElement("option", { value: "" }, "Default voice"),
      englishVoices.map((v) => /* @__PURE__ */ React.createElement("option", { key: v.name, value: v.name }, v.name))
    ), /* @__PURE__ */ React.createElement("div", { className: "tts-speed-row" }, "Speed:", /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "range",
        min: "0.5",
        max: "1.8",
        step: "0.1",
        value: ttsCfg.speed,
        className: "tts-range",
        onChange: (e) => setTtsCfg((c) => ({ ...c, speed: +e.target.value }))
      }
    ), /* @__PURE__ */ React.createElement("span", null, ttsCfg.speed, "\xD7")), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "op-btn",
        style: { padding: "4px 12px", fontSize: ".78rem" },
        onClick: () => tts.speak("7 times 8 equals 56", ttsCfg)
      },
      "Test"
    ))), /* @__PURE__ */ React.createElement("div", { className: "nav-tabs" }, tabs.map((t) => /* @__PURE__ */ React.createElement("button", { key: t.id, className: `nav-tab${tab === t.id ? " active" : ""}`, onClick: () => setTab(t.id) }, t.label))), /* @__PURE__ */ React.createElement("main", { className: "main" }, tab === "learn" && /* @__PURE__ */ React.createElement(LearnMode, { selTable, setSelTable, opMode, setOpMode, mastery, markMastered, ttsCfg }), tab === "rhythm" && /* @__PURE__ */ React.createElement(RhythmMode, { selTable, setSelTable, opMode, setOpMode, ttsCfg }), tab === "test" && /* @__PURE__ */ React.createElement(TestMode, { mastery, setMastery, ttsCfg }), tab === "progress" && /* @__PURE__ */ React.createElement(ProgressMode, { mastery })));
  }
  function LearnMode({ selTable, setSelTable, opMode, setOpMode, mastery, markMastered, ttsCfg }) {
    const [revealed, setRevealed] = useState({});
    const [selectorOpen, setSelectorOpen] = useState(false);
    const getFact = (a, b) => opMode === "mult" ? { eq: `${a} \xD7 ${b}`, ans: a * b, speech: `${a} times ${b} equals ${a * b}` } : { eq: `${a * b} \xF7 ${a}`, ans: b, speech: `${a * b} divided by ${a} equals ${b}` };
    const toggle = (key, a, b) => {
      const f = getFact(a, b);
      const nowRevealed = !revealed[key];
      setRevealed((r) => ({ ...r, [key]: nowRevealed }));
      markMastered(key);
      if (nowRevealed) tts.speak(f.speech, ttsCfg);
    };
    return /* @__PURE__ */ React.createElement("div", { className: "fade-in" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
      "button",
      {
        className: `table-selector-toggle${selectorOpen ? " open" : ""}`,
        onClick: () => setSelectorOpen((o) => !o)
      },
      /* @__PURE__ */ React.createElement("span", null, "\u{1F4CB} SELECT TABLE"),
      /* @__PURE__ */ React.createElement("span", { className: "tst-badge" }, /* @__PURE__ */ React.createElement("span", { className: "tst-num" }, "\xD7", selTable), /* @__PURE__ */ React.createElement("span", { className: "tst-arrow" }, "\u25BC"))
    ), /* @__PURE__ */ React.createElement("div", { className: `table-selector-body${selectorOpen ? " open" : ""}` }, /* @__PURE__ */ React.createElement("div", { className: "table-grid" }, ALL_TABLES.map((n) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: n,
        className: `table-btn${selTable === n ? " selected" : ""}`,
        onClick: () => {
          setSelTable(n);
          setRevealed({});
          setSelectorOpen(false);
        }
      },
      n
    ))))), /* @__PURE__ */ React.createElement("div", { className: "learn-header" }, /* @__PURE__ */ React.createElement("div", { className: "learn-title" }, "Table of ", selTable), /* @__PURE__ */ React.createElement("div", { className: "op-toggle" }, /* @__PURE__ */ React.createElement("button", { className: `op-btn${opMode === "mult" ? " active" : ""}`, onClick: () => setOpMode("mult") }, "\u2715 Multiply"), /* @__PURE__ */ React.createElement("button", { className: `op-btn${opMode === "div" ? " active" : ""}`, onClick: () => setOpMode("div") }, "\xF7 Divide"))), /* @__PURE__ */ React.createElement("div", { className: "facts-grid" }, Array.from({ length: 10 }, (_, i) => i + 1).map((i) => {
      const key = `${selTable}x${i}`;
      const { eq, ans } = getFact(selTable, i);
      const isMastered = (mastery[key] || 0) >= 3;
      return /* @__PURE__ */ React.createElement(
        "div",
        {
          key,
          className: `fact-card${isMastered ? " mastered" : ""}`,
          onClick: () => toggle(key, selTable, i),
          style: { animationDelay: `${i * 0.04}s` }
        },
        /* @__PURE__ */ React.createElement("div", { className: "fact-badge" }, "\u2713"),
        /* @__PURE__ */ React.createElement("div", { className: "fact-equation" }, eq, " ="),
        /* @__PURE__ */ React.createElement("div", { className: "fact-answer", style: { opacity: revealed[key] ? 1 : 0, filter: revealed[key] ? "none" : "blur(10px)", transition: "all .3s" } }, ans),
        !revealed[key] && /* @__PURE__ */ React.createElement("div", { style: { color: "var(--text2)", fontSize: ".73rem", marginTop: 3 } }, "tap to reveal")
      );
    })), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 14, padding: "11px 15px", background: "var(--surface2)", borderRadius: 11, color: "var(--text2)", fontSize: ".8rem", textAlign: "center" } }, "\u{1F4A1} Tap each card to reveal & hear the answer. Tap 3\xD7 to mark as mastered!"));
  }
  function RhythmMode({ selTable, setSelTable, opMode, setOpMode, ttsCfg }) {
    const [bpm, setBpm] = useState(60);
    const [running, setRunning] = useState(false);
    const [idx, setIdx] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [pulse, setPulse] = useState(false);
    const [beats, setBeats] = useState([false, false, false, false]);
    const [selectorOpen, setSelectorOpen] = useState(false);
    const interval = 6e4 / bpm;
    const timerRef = useRef(null);
    const beatRef = useRef(0);
    const idxRef = useRef(0);
    const getFact = useCallback((i) => {
      const n = i % 10 + 1;
      if (opMode === "mult") return { eq: `${selTable} \xD7 ${n}`, ans: `${selTable * n}`, speech: `${selTable} times ${n}` };
      return { eq: `${selTable * n} \xF7 ${selTable}`, ans: `${n}`, speech: `${selTable * n} divided by ${selTable}` };
    }, [selTable, opMode]);
    const tick = useCallback(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 150);
      const phase = beatRef.current % 3;
      if (phase === 0) {
        setShowAnswer(false);
        const f = getFact(idxRef.current);
        tts.speak(f.speech, ttsCfg);
      } else if (phase === 1) {
        setShowAnswer(true);
        const f = getFact(idxRef.current);
        tts.speak(f.ans, ttsCfg);
      } else {
        idxRef.current = (idxRef.current + 1) % 10;
        setIdx(idxRef.current);
        setShowAnswer(false);
      }
      setBeats((b) => {
        const nb = Array(4).fill(false);
        nb[beatRef.current % 4] = true;
        return nb;
      });
      beatRef.current++;
    }, [getFact, ttsCfg]);
    useEffect(() => {
      if (running) {
        beatRef.current = 0;
        timerRef.current = setInterval(tick, interval);
      } else clearInterval(timerRef.current);
      return () => clearInterval(timerRef.current);
    }, [running, interval, tick]);
    const { eq, ans } = getFact(idx);
    return /* @__PURE__ */ React.createElement("div", { className: "rhythm-container fade-in" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
      "button",
      {
        className: `table-selector-toggle${selectorOpen ? " open" : ""}`,
        onClick: () => setSelectorOpen((o) => !o)
      },
      /* @__PURE__ */ React.createElement("span", null, "\u{1F4CB} SELECT TABLE"),
      /* @__PURE__ */ React.createElement("span", { className: "tst-badge" }, /* @__PURE__ */ React.createElement("span", { className: "tst-num" }, "\xD7", selTable), /* @__PURE__ */ React.createElement("span", { className: "tst-arrow" }, "\u25BC"))
    ), /* @__PURE__ */ React.createElement("div", { className: `table-selector-body${selectorOpen ? " open" : ""}` }, /* @__PURE__ */ React.createElement("div", { className: "table-grid" }, ALL_TABLES.map((n) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: n,
        className: `table-btn${selTable === n ? " selected" : ""}`,
        onClick: () => {
          setSelTable(n);
          setRunning(false);
          setIdx(0);
          idxRef.current = 0;
          setSelectorOpen(false);
        }
      },
      n
    ))))), /* @__PURE__ */ React.createElement("div", { className: "rhythm-settings" }, /* @__PURE__ */ React.createElement("div", { className: "op-toggle" }, /* @__PURE__ */ React.createElement("button", { className: `op-btn${opMode === "mult" ? " active" : ""}`, onClick: () => setOpMode("mult") }, "\u2715 Multiply"), /* @__PURE__ */ React.createElement("button", { className: `op-btn${opMode === "div" ? " active" : ""}`, onClick: () => setOpMode("div") }, "\xF7 Divide")), /* @__PURE__ */ React.createElement("div", { className: "rhythm-bpm-display" }, "\u{1F941}", /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "range",
        min: "30",
        max: "120",
        value: bpm,
        className: "bpm-slider",
        onChange: (e) => {
          setBpm(+e.target.value);
          setRunning(false);
        }
      }
    ), /* @__PURE__ */ React.createElement("span", null, bpm, " BPM"))), /* @__PURE__ */ React.createElement("div", { className: "rhythm-display" }, /* @__PURE__ */ React.createElement("div", { className: `rhythm-fact${pulse ? " pulse" : ""}` }, eq, " ="), /* @__PURE__ */ React.createElement("div", { className: "rhythm-answer", style: { opacity: showAnswer ? 1 : 0, transition: "opacity .1s" } }, ans), /* @__PURE__ */ React.createElement("div", { className: "rhythm-progress-bar" }, /* @__PURE__ */ React.createElement("div", { className: "rhythm-progress-fill", style: { width: `${idx / 10 * 100}%` } })), /* @__PURE__ */ React.createElement("div", { className: "rhythm-counter" }, idx + 1, " / 10"), /* @__PURE__ */ React.createElement("div", { className: "beat-dots" }, beats.map((b, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: `beat-dot${b ? " active" : ""}` })))), /* @__PURE__ */ React.createElement("div", { className: "rhythm-controls" }, !running ? /* @__PURE__ */ React.createElement("button", { className: "btn-primary", onClick: () => {
      setRunning(true);
      setIdx(0);
      idxRef.current = 0;
      setShowAnswer(false);
    } }, "\u25B6 Start Rhythm") : /* @__PURE__ */ React.createElement("button", { className: "btn-primary", onClick: () => setRunning(false) }, "\u23F8 Pause"), /* @__PURE__ */ React.createElement("button", { className: "btn-secondary", onClick: () => {
      setRunning(false);
      setIdx(0);
      idxRef.current = 0;
      setShowAnswer(false);
    } }, "\u21BA Reset")), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 18, padding: "13px", background: "var(--surface)", borderRadius: 13, color: "var(--text2)", fontSize: ".8rem", textAlign: "center", border: "2px solid var(--border)" } }, "\u{1F941} Question \u2192 Answer \u2192 Next. Say the answer before it appears! Voice reads each fact when TTS is on."));
  }
  var TEST_TYPES = [
    { id: "classic", icon: "\u{1F522}", name: "Classic Fill-in", desc: "Type the answer \u2014 auto-submits when correct digits entered" },
    { id: "mcq", icon: "\u{1F3AF}", name: "Multiple Choice", desc: "Pick from 4 options \u2014 builds fast recognition" },
    { id: "missing", icon: "\u2753", name: "Missing Factor", desc: "Find the missing number: 3 \xD7 ? = 24" },
    { id: "blitz", icon: "\u26A1", name: "Speed Blitz", desc: "Race against a per-question countdown \u2014 pure speed!" }
  ];
  function buildQuestions(cfg) {
    const qs = [];
    const ops = cfg.op === "both" ? ["mult", "div"] : cfg.op === "mult" ? ["mult"] : ["div"];
    for (let i = 0; i < cfg.count; i++) {
      const t = cfg.tables[Math.floor(Math.random() * cfg.tables.length)];
      const n = Math.floor(Math.random() * 10) + 1;
      const op = ops[Math.floor(Math.random() * ops.length)];
      if (cfg.testType === "missing") {
        const side = Math.random() < 0.5 ? "left" : "right";
        const a = t, b = n, product = a * b;
        if (side === "left") qs.push({ display: `? \xD7 ${b} = ${product}`, ans: a, key: `${a}x${b}`, speech: `what times ${b} equals ${product}` });
        else qs.push({ display: `${a} \xD7 ? = ${product}`, ans: b, key: `${a}x${b}`, speech: `${a} times what equals ${product}` });
      } else if (op === "mult") {
        qs.push({ display: `${t} \xD7 ${n} = ?`, ans: t * n, key: `${t}x${n}`, speech: `${t} times ${n}` });
      } else {
        qs.push({ display: `${t * n} \xF7 ${t} = ?`, ans: n, key: `${t}x${n}`, speech: `${t * n} divided by ${t}` });
      }
    }
    return qs;
  }
  function makeMCQChoices(ans) {
    const s = /* @__PURE__ */ new Set([ans]);
    const offsets = shuffle([-3, -2, -1, 1, 2, 3, 4, 5, -4, 6, -5, 7, -6]).filter((o) => ans + o > 0);
    for (const o of offsets) {
      if (s.size === 4) break;
      s.add(ans + o);
    }
    while (s.size < 4) {
      let r = Math.max(1, ans + Math.floor(Math.random() * 10) - 5);
      s.add(r);
    }
    return shuffle([...s].slice(0, 4));
  }
  function digitCount(n) {
    return Math.abs(n).toString().length;
  }
  function TestMode({ mastery, setMastery, ttsCfg }) {
    const [phase, setPhase] = useState("config");
    const [config, setConfig] = useState({ tables: [2, 3, 4, 5], op: "both", count: 20, timed: true, duration: 120, testType: "classic" });
    const [questions, setQuestions] = useState([]);
    const [qIdx, setQIdx] = useState(0);
    const [answer, setAnswer] = useState("");
    const [results, setResults] = useState([]);
    const [elapsed, setElapsed] = useState(0);
    const [flashState, setFlashState] = useState("");
    const [floatState, setFloatState] = useState("");
    const [floatKey, setFloatKey] = useState(0);
    const [streak, setStreak] = useState(0);
    const [mcqChoices, setMcqChoices] = useState([]);
    const [mcqState, setMcqState] = useState(null);
    const [blitzTime, setBlitzTime] = useState(5);
    const [blitzLeft, setBlitzLeft] = useState(5);
    const timerRef = useRef(null);
    const blitzRef = useRef(null);
    const ansRef = useRef("");
    const toggleTable = (t) => setConfig((c) => {
      const ts = c.tables.includes(t) ? c.tables.filter((x) => x !== t) : [...c.tables, t];
      return { ...c, tables: ts.length ? ts : c.tables };
    });
    const toggleAll = () => setConfig((c) => ({ ...c, tables: c.tables.length === 20 ? [2] : ALL_TABLES.slice() }));
    const startTest = () => {
      const qs = buildQuestions(config);
      setQuestions(qs);
      setQIdx(0);
      setAnswer("");
      ansRef.current = "";
      setResults([]);
      setElapsed(0);
      setStreak(0);
      if (config.testType === "mcq") setMcqChoices(makeMCQChoices(qs[0].ans));
      setMcqState(null);
      setPhase("test");
      if (config.testType === "blitz") {
        setBlitzTime(5);
        setBlitzLeft(5);
      }
    };
    useEffect(() => {
      if (phase === "test" && questions.length && qIdx < questions.length) {
        const q2 = questions[qIdx];
        tts.speak(q2.speech || q2.display.replace("?", "blank"), ttsCfg);
      }
    }, [qIdx, phase, questions.length]);
    useEffect(() => {
      if (phase === "test" && config.timed && config.testType !== "blitz") {
        timerRef.current = setInterval(() => {
          setElapsed((e) => {
            if (e + 1 >= config.duration) {
              clearInterval(timerRef.current);
              setPhase("results");
              return e + 1;
            }
            return e + 1;
          });
        }, 1e3);
      }
      return () => clearInterval(timerRef.current);
    }, [phase, config.timed, config.testType]);
    useEffect(() => {
      if (phase !== "test" || config.testType !== "blitz") return;
      clearInterval(blitzRef.current);
      setBlitzLeft(blitzTime);
      blitzRef.current = setInterval(() => {
        setBlitzLeft((t) => {
          if (t <= 1) {
            clearInterval(blitzRef.current);
            submitAnswer("", true);
            return blitzTime;
          }
          return t - 1;
        });
      }, 1e3);
      return () => clearInterval(blitzRef.current);
    }, [qIdx, phase, config.testType]);
    const finishTest = useCallback(() => {
      clearInterval(timerRef.current);
      clearInterval(blitzRef.current);
      tts.cancel();
      setPhase("results");
    }, []);
    const submitAnswer = useCallback((overrideAns, forced = false) => {
      var _a;
      const q2 = questions[qIdx];
      if (!q2) return;
      const raw = overrideAns !== void 0 ? overrideAns : ansRef.current;
      const userAns = parseInt(raw, 10);
      const correct = !forced && userAns === q2.ans;
      const newResults = [...results, { ...q2, userAns: isNaN(userAns) ? null : userAns, correct }];
      setResults(newResults);
      setFlashState(correct ? "correct-flash" : "wrong-flash");
      setFloatState(correct ? "show-correct" : "show-wrong");
      setFloatKey((k) => k + 1);
      setTimeout(() => setFlashState(""), 400);
      setTimeout(() => setFloatState(""), 600);
      setStreak((s) => correct ? s + 1 : 0);
      if (correct) {
        setMastery((m) => ({ ...m, [q2.key]: (m[q2.key] || 0) + 1 }));
        tts.speak("Correct!", ttsCfg);
      } else if (!forced) tts.speak(`The answer is ${q2.ans}`, ttsCfg);
      setAnswer("");
      ansRef.current = "";
      if (qIdx + 1 >= questions.length) {
        setTimeout(() => finishTest(), 350);
      } else {
        setQIdx((i) => i + 1);
        if (config.testType === "mcq") {
          setMcqChoices(makeMCQChoices(((_a = questions[qIdx + 1]) == null ? void 0 : _a.ans) || 1));
          setMcqState(null);
        }
      }
    }, [qIdx, questions, results, finishTest, setMastery, ttsCfg, config.testType]);
    const handleDigit = useCallback((d) => {
      const q2 = questions[qIdx];
      if (!q2) return;
      const newAns = (ansRef.current + d).slice(0, 4);
      setAnswer(newAns);
      ansRef.current = newAns;
      const needed = digitCount(q2.ans);
      if (newAns.length >= needed) {
        setTimeout(() => submitAnswer(newAns), 120);
      }
    }, [qIdx, questions, submitAnswer]);
    const handleDel = useCallback(() => {
      const newAns = ansRef.current.slice(0, -1);
      setAnswer(newAns);
      ansRef.current = newAns;
    }, []);
    useEffect(() => {
      if (phase !== "test") return;
      const handler = (e) => {
        if (config.testType === "mcq") return;
        if (e.key >= "0" && e.key <= "9") handleDigit(e.key);
        else if (e.key === "Backspace") handleDel();
      };
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }, [phase, config.testType, handleDigit, handleDel]);
    if (phase === "config") return /* @__PURE__ */ React.createElement(TestConfig, { config, setConfig, toggleTable, toggleAll, startTest });
    if (phase === "results") return /* @__PURE__ */ React.createElement(TestResults, { results, elapsed, streak, onRetry: () => setPhase("config") });
    const q = questions[qIdx];
    const pct = config.timed && config.testType !== "blitz" ? elapsed / config.duration * 100 : qIdx / questions.length * 100;
    const timeLeft = config.duration - elapsed;
    const correctSoFar = results.filter((r) => r.correct).length;
    return /* @__PURE__ */ React.createElement("div", { className: "test-arena fade-in" }, /* @__PURE__ */ React.createElement("div", { key: floatKey, style: {
      position: "fixed",
      top: "45%",
      left: "50%",
      pointerEvents: "none",
      zIndex: 999,
      fontSize: "5rem",
      fontFamily: "'Baloo 2',cursive",
      fontWeight: 800,
      animation: floatState ? "floatUp .6s ease forwards" : "none",
      color: floatState === "show-correct" ? "var(--correct)" : "var(--wrong)",
      opacity: floatState ? 1 : 0
    } }, floatState === "show-correct" ? "\u2713" : "\u2717"), /* @__PURE__ */ React.createElement("div", { className: "test-progress-bar" }, /* @__PURE__ */ React.createElement("div", { className: "test-progress-fill", style: { width: pct + "%" } })), /* @__PURE__ */ React.createElement("div", { className: "test-meta" }, /* @__PURE__ */ React.createElement("div", { className: "meta-pill" }, "Q ", /* @__PURE__ */ React.createElement("span", null, qIdx + 1, "/", questions.length)), config.timed && config.testType !== "blitz" && /* @__PURE__ */ React.createElement("div", { className: "meta-pill timer-pill" }, "\u23F1 ", /* @__PURE__ */ React.createElement("span", null, formatTime(timeLeft))), /* @__PURE__ */ React.createElement("div", { className: "meta-pill score-pill" }, "\u2713 ", /* @__PURE__ */ React.createElement("span", null, correctSoFar)), streak >= 3 && /* @__PURE__ */ React.createElement("div", { className: "meta-pill streak-pill" }, "\u{1F525} ", /* @__PURE__ */ React.createElement("span", null, streak))), config.testType === "blitz" ? /* @__PURE__ */ React.createElement(
      BlitzQuestion,
      {
        q,
        flashState,
        blitzLeft,
        blitzTime,
        answer,
        onDigit: handleDigit,
        onDel: handleDel
      }
    ) : config.testType === "mcq" ? /* @__PURE__ */ React.createElement(MCQQuestion, { q, choices: mcqChoices, flashState, onChoose: (c) => {
      if (mcqState) return;
      const correct = c === q.ans;
      setMcqState({ chosen: c, correct });
      setFlashState(correct ? "correct-flash" : "wrong-flash");
      setFloatState(correct ? "show-correct" : "show-wrong");
      setFloatKey((k) => k + 1);
      setTimeout(() => setFlashState(""), 400);
      setTimeout(() => setFloatState(""), 600);
      setStreak((s) => correct ? s + 1 : 0);
      if (correct) {
        setMastery((m) => ({ ...m, [q.key]: (m[q.key] || 0) + 1 }));
        tts.speak("Correct!", ttsCfg);
      } else tts.speak(`The answer is ${q.ans}`, ttsCfg);
      const newResults = [...results, { ...q, userAns: c, correct }];
      setResults(newResults);
      setTimeout(() => {
        var _a;
        if (qIdx + 1 >= questions.length) {
          finishTest();
        } else {
          setQIdx((i) => i + 1);
          setMcqChoices(makeMCQChoices(((_a = questions[qIdx + 1]) == null ? void 0 : _a.ans) || 1));
          setMcqState(null);
        }
      }, 700);
    }, mcqState }) : /* @__PURE__ */ React.createElement(ClassicQuestion, { q, flashState, answer, onDigit: handleDigit, onDel: handleDel }));
  }
  function ClassicQuestion({ q, flashState, answer, onDigit, onDel }) {
    const needed = digitCount(q.ans);
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: `question-box ${flashState}` }, /* @__PURE__ */ React.createElement("div", { className: "question-text" }, q.display.replace("?", ""), " ", /* @__PURE__ */ React.createElement("span", { className: "blank" }, answer || "?")), /* @__PURE__ */ React.createElement("div", { className: "question-hint" }, "Type answer \u2014 auto-submits after ", needed, " digit", needed > 1 ? "s" : "")), /* @__PURE__ */ React.createElement("div", { className: "numpad" }, [7, 8, 9, 4, 5, 6, 1, 2, 3].map((n) => /* @__PURE__ */ React.createElement("button", { key: n, className: "numpad-btn", onClick: () => onDigit(String(n)) }, n)), /* @__PURE__ */ React.createElement("button", { className: "numpad-btn numpad-zero", onClick: () => onDigit("0") }, "0"), /* @__PURE__ */ React.createElement("button", { className: "numpad-btn numpad-del", onClick: onDel }, "\u232B")), /* @__PURE__ */ React.createElement("div", { className: "auto-indicator" }, /* @__PURE__ */ React.createElement("span", { className: "auto-dot" }), /* @__PURE__ */ React.createElement("span", null, "Auto-submits when answer is complete")));
  }
  function MCQQuestion({ q, choices, flashState, onChoose, mcqState }) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: `question-box ${flashState}` }, /* @__PURE__ */ React.createElement("div", { className: "question-text" }, q.display.replace("= ?", "= "), /* @__PURE__ */ React.createElement("span", { className: "blank" }, "?"))), /* @__PURE__ */ React.createElement("div", { className: "mcq-options" }, choices.map((c) => {
      let cls = "";
      if (mcqState) {
        if (c === q.ans) cls = "correct-choice";
        else if (c === mcqState.chosen && !mcqState.correct) cls = "wrong-choice";
      }
      return /* @__PURE__ */ React.createElement("button", { key: c, className: `mcq-btn ${cls}`, onClick: () => onChoose(c) }, c);
    })));
  }
  function BlitzQuestion({ q, flashState, blitzLeft, blitzTime, answer, onDigit, onDel }) {
    const pct = blitzLeft / blitzTime * 100;
    const color = pct > 50 ? "var(--correct)" : pct > 25 ? "var(--accent)" : "var(--wrong)";
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: `blitz-display ${flashState}` }, /* @__PURE__ */ React.createElement("div", { className: "blitz-fact" }, q.display.replace("?", answer || "?")), /* @__PURE__ */ React.createElement("div", { style: { color: "var(--text2)", fontSize: ".8rem", fontWeight: 700 } }, blitzLeft, "s"), /* @__PURE__ */ React.createElement("div", { className: "blitz-timer-bar" }, /* @__PURE__ */ React.createElement("div", { className: "blitz-timer-fill", style: { width: pct + "%", background: `linear-gradient(90deg,${color},var(--accent))` } }))), /* @__PURE__ */ React.createElement("div", { className: "numpad" }, [7, 8, 9, 4, 5, 6, 1, 2, 3].map((n) => /* @__PURE__ */ React.createElement("button", { key: n, className: "numpad-btn", onClick: () => onDigit(String(n)) }, n)), /* @__PURE__ */ React.createElement("button", { className: "numpad-btn numpad-zero", onClick: () => onDigit("0") }, "0"), /* @__PURE__ */ React.createElement("button", { className: "numpad-btn numpad-del", onClick: onDel }, "\u232B")), /* @__PURE__ */ React.createElement("div", { className: "auto-indicator" }, /* @__PURE__ */ React.createElement("span", { className: "auto-dot" }), /* @__PURE__ */ React.createElement("span", null, "Auto-submits \u2022 answer before time runs out!")));
  }
  function TestConfig({ config, setConfig, toggleTable, toggleAll, startTest }) {
    return /* @__PURE__ */ React.createElement("div", { className: "fade-in" }, /* @__PURE__ */ React.createElement("div", { className: "test-config" }, /* @__PURE__ */ React.createElement("h3", null, "\u2699\uFE0F Configure Your Test"), /* @__PURE__ */ React.createElement("div", { className: "config-row" }, /* @__PURE__ */ React.createElement("span", { className: "config-label" }, "Test Type:"), /* @__PURE__ */ React.createElement("div", { className: "test-types", style: { flex: 1, minWidth: 0 } }, TEST_TYPES.map((t) => /* @__PURE__ */ React.createElement(
      "div",
      {
        key: t.id,
        className: `test-type-card${config.testType === t.id ? " sel" : ""}`,
        onClick: () => setConfig((c) => ({ ...c, testType: t.id }))
      },
      /* @__PURE__ */ React.createElement("div", { className: "ttc-icon" }, t.icon),
      /* @__PURE__ */ React.createElement("div", { className: "ttc-name" }, t.name),
      /* @__PURE__ */ React.createElement("div", { className: "ttc-desc" }, t.desc)
    )))), /* @__PURE__ */ React.createElement("div", { className: "config-row" }, /* @__PURE__ */ React.createElement("span", { className: "config-label" }, "Tables:"), /* @__PURE__ */ React.createElement("div", { className: "tables-multiselect" }, /* @__PURE__ */ React.createElement("button", { className: `ts-chip ts-chip-all${config.tables.length === 20 ? " sel" : ""}`, onClick: toggleAll }, "All"), ALL_TABLES.map((t) => /* @__PURE__ */ React.createElement("button", { key: t, className: `ts-chip${config.tables.includes(t) ? " sel" : ""}`, onClick: () => toggleTable(t) }, t)))), config.testType !== "missing" && /* @__PURE__ */ React.createElement("div", { className: "config-row" }, /* @__PURE__ */ React.createElement("span", { className: "config-label" }, "Operation:"), /* @__PURE__ */ React.createElement("select", { className: "config-select", value: config.op, onChange: (e) => setConfig((c) => ({ ...c, op: e.target.value })) }, /* @__PURE__ */ React.createElement("option", { value: "both" }, "Both \xD7 \xF7"), /* @__PURE__ */ React.createElement("option", { value: "mult" }, "\xD7 Multiply only"), /* @__PURE__ */ React.createElement("option", { value: "div" }, "\xF7 Divide only"))), /* @__PURE__ */ React.createElement("div", { className: "config-row" }, /* @__PURE__ */ React.createElement("span", { className: "config-label" }, "Questions:"), /* @__PURE__ */ React.createElement("select", { className: "config-select", value: config.count, onChange: (e) => setConfig((c) => ({ ...c, count: +e.target.value })) }, [10, 15, 20, 30, 50].map((n) => /* @__PURE__ */ React.createElement("option", { key: n, value: n }, n)))), config.testType !== "blitz" && /* @__PURE__ */ React.createElement("div", { className: "config-row" }, /* @__PURE__ */ React.createElement("span", { className: "config-label" }, "Timed:"), /* @__PURE__ */ React.createElement("button", { className: `op-btn${config.timed ? " active" : ""}`, onClick: () => setConfig((c) => ({ ...c, timed: !c.timed })) }, config.timed ? "\u23F1 On" : "\u{1F550} Off"), config.timed && /* @__PURE__ */ React.createElement("select", { className: "config-select", value: config.duration, onChange: (e) => setConfig((c) => ({ ...c, duration: +e.target.value })) }, [60, 90, 120, 180, 300].map((s) => /* @__PURE__ */ React.createElement("option", { key: s, value: s }, formatTime(s)))))), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center" } }, /* @__PURE__ */ React.createElement("button", { className: "btn-primary", style: { fontSize: "1.05rem", padding: "13px 46px" }, onClick: startTest }, "\u{1F680} Start Test")));
  }
  function TestResults({ results, elapsed, streak, onRetry }) {
    const correct = results.filter((r) => r.correct).length;
    const pct = results.length ? Math.round(correct / results.length * 100) : 0;
    const grade = getGrade(pct);
    const missed = results.filter((r) => !r.correct);
    const maxStreak = results.reduce((acc, r, i) => {
      if (r.correct) return { ...acc, cur: acc.cur + 1, max: Math.max(acc.max, acc.cur + 1) };
      return { ...acc, cur: 0 };
    }, { cur: 0, max: 0 }).max;
    return /* @__PURE__ */ React.createElement("div", { className: "fade-in", style: { textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { className: "results-panel pop-in" }, /* @__PURE__ */ React.createElement("div", { className: `grade-badge ${grade.cls}` }, grade.letter), /* @__PURE__ */ React.createElement("div", { className: "results-score" }, pct, "%"), /* @__PURE__ */ React.createElement("div", { className: "results-label" }, grade.emoji, " ", pct >= 90 ? "Outstanding!" : pct >= 75 ? "Great job!" : pct >= 60 ? "Good effort!" : "Keep practising!"), /* @__PURE__ */ React.createElement("div", { className: "results-stats" }, /* @__PURE__ */ React.createElement("div", { className: "stat-box correct-stat" }, /* @__PURE__ */ React.createElement("div", { className: "stat-value" }, correct), /* @__PURE__ */ React.createElement("div", { className: "stat-desc" }, "Correct")), /* @__PURE__ */ React.createElement("div", { className: "stat-box wrong-stat" }, /* @__PURE__ */ React.createElement("div", { className: "stat-value" }, results.length - correct), /* @__PURE__ */ React.createElement("div", { className: "stat-desc" }, "Missed")), /* @__PURE__ */ React.createElement("div", { className: "stat-box time-stat" }, /* @__PURE__ */ React.createElement("div", { className: "stat-value" }, formatTime(elapsed)), /* @__PURE__ */ React.createElement("div", { className: "stat-desc" }, "Time")), maxStreak >= 3 && /* @__PURE__ */ React.createElement("div", { className: "stat-box streak-stat" }, /* @__PURE__ */ React.createElement("div", { className: "stat-value" }, "\u{1F525}", maxStreak), /* @__PURE__ */ React.createElement("div", { className: "stat-desc" }, "Best Streak"))), missed.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "missed-list" }, /* @__PURE__ */ React.createElement("div", { className: "missed-title" }, "Review these:"), missed.map((m, i) => /* @__PURE__ */ React.createElement("span", { key: i, className: "missed-item" }, m.display.replace("?", m.ans))))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 22, display: "flex", gap: 12, justifyContent: "center" } }, /* @__PURE__ */ React.createElement("button", { className: "btn-primary", onClick: onRetry }, "\u21BA Try Again")));
  }
  function ProgressMode({ mastery }) {
    const tableScores = ALL_TABLES.map((t) => {
      let done = 0;
      for (let i = 1; i <= 10; i++) {
        if ((mastery[`${t}x${i}`] || 0) >= 3) done++;
      }
      return { t, pct: Math.round(done / 10 * 100), done };
    });
    const overallPct = Math.round(tableScores.reduce((a, s) => a + s.pct, 0) / 20);
    const fullyMastered = tableScores.filter((s) => s.pct === 100).length;
    return /* @__PURE__ */ React.createElement("div", { className: "fade-in" }, /* @__PURE__ */ React.createElement("div", { style: { background: "var(--surface)", border: "2px solid var(--border)", borderRadius: 18, padding: 22, marginBottom: 18, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { color: "var(--text2)", fontSize: ".83rem", fontWeight: 700, marginBottom: 7 } }, "OVERALL MASTERY"), /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: "'Baloo 2',cursive",
      fontSize: "4rem",
      fontWeight: 800,
      background: "linear-gradient(135deg,var(--accent),var(--accent3))",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent"
    } }, overallPct, "%"), /* @__PURE__ */ React.createElement("div", { style: { color: "var(--text2)", fontSize: ".88rem", marginTop: 4 } }, fullyMastered, " of 20 tables fully mastered"), /* @__PURE__ */ React.createElement("div", { style: { margin: "11px auto 0", maxWidth: 300, height: 9, background: "var(--surface2)", borderRadius: 5, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { height: "100%", borderRadius: 5, width: overallPct + "%", background: "linear-gradient(90deg,var(--accent3),var(--accent))", transition: "width 1s ease" } }))), /* @__PURE__ */ React.createElement("div", { className: "mastery-section" }, /* @__PURE__ */ React.createElement("div", { className: "mastery-title" }, "MASTERY BY TABLE (3 correct taps = mastered)"), /* @__PURE__ */ React.createElement("div", { className: "mastery-bars" }, tableScores.map(({ t, pct, done }) => /* @__PURE__ */ React.createElement("div", { key: t, className: "mastery-row" }, /* @__PURE__ */ React.createElement("div", { className: "mastery-table-label" }, "\xD7", t), /* @__PURE__ */ React.createElement("div", { className: "mastery-bar-track" }, /* @__PURE__ */ React.createElement("div", { className: "mastery-bar-fill", style: { width: pct + "%" } })), /* @__PURE__ */ React.createElement("div", { className: "mastery-pct" }, pct, "%"))))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 14, textAlign: "center" } }, /* @__PURE__ */ React.createElement("button", { className: "btn-secondary", onClick: () => {
      if (confirm("Reset all mastery progress?")) {
        localStorage.removeItem("tt_mastery");
        location.reload();
      }
    } }, "\u{1F5D1} Reset Progress")));
  }
  ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
})();
