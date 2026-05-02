(() => {
  "use strict";

  const englishLessons = window.HomeSchoolLessonModules?.english?.[5];
  const tensesData = window.HomeSchoolEnglishModules?.TENSES_DATA;
  if (!Array.isArray(englishLessons) || !englishLessons.length || !tensesData) return;

  const readingLessonIndex = englishLessons.findIndex((lesson) => (
    String(lesson?.key || "").trim() === "reading"
    || String(lesson?.title || "").trim().toLowerCase() === "reading comprehension"
  ));
  if (readingLessonIndex < 0) return;

  const TENSE_ORDER = [
    { main: "present", sub: "simple", title: "Present Simple Tense", family: "Present" },
    { main: "present", sub: "continuous", title: "Present Continuous Tense", family: "Present" },
    { main: "present", sub: "perfect", title: "Present Perfect Tense", family: "Present" },
    { main: "present", sub: "perfectContinuous", title: "Present Perfect Continuous Tense", family: "Present" },
    { main: "past", sub: "simple", title: "Past Simple Tense", family: "Past" },
    { main: "past", sub: "continuous", title: "Past Continuous Tense", family: "Past" },
    { main: "past", sub: "perfect", title: "Past Perfect Tense", family: "Past" },
    { main: "past", sub: "perfectContinuous", title: "Past Perfect Continuous Tense", family: "Past" },
    { main: "future", sub: "simple", title: "Future Simple Tense", family: "Future" },
    { main: "future", sub: "continuous", title: "Future Continuous Tense", family: "Future" },
    { main: "future", sub: "perfect", title: "Future Perfect Tense", family: "Future" },
    { main: "future", sub: "perfectContinuous", title: "Future Perfect Continuous Tense", family: "Future" },
  ];

  const flatTenses = TENSE_ORDER.map((entry) => ({
    ...entry,
    data: tensesData?.[entry.main]?.[entry.sub] || null,
  })).filter((entry) => entry.data);

  if (!flatTenses.length) return;

  const uniqueStrings = (values = []) => Array.from(new Set(
    values
      .map((value) => String(value || "").replace(/\s+/g, " ").trim())
      .filter(Boolean),
  ));

  const firstSentence = (paragraph = "") => {
    const sentences = String(paragraph || "").split(/(?<=[.!?])\s+/).map((entry) => entry.trim()).filter(Boolean);
    return sentences[0] || String(paragraph || "").trim();
  };

  const inferSignalWords = (main, sub) => {
    if (main === "present" && sub === "simple") return "every day / usually / always";
    if (main === "present" && sub === "continuous") return "now / right now / at the moment";
    if (main === "present" && sub === "perfect") return "already / just / yet";
    if (main === "present" && sub === "perfectContinuous") return "since / for";
    if (main === "past" && sub === "simple") return "yesterday / last / ago";
    if (main === "past" && sub === "continuous") return "while / when / at that time";
    if (main === "past" && sub === "perfect") return "before / by the time / already";
    if (main === "past" && sub === "perfectContinuous") return "since / for / before";
    if (main === "future" && sub === "simple") return "tomorrow / next / soon";
    if (main === "future" && sub === "continuous") return "this time tomorrow / at 7 PM";
    if (main === "future" && sub === "perfect") return "by / before / by the time";
    if (main === "future" && sub === "perfectContinuous") return "for / since / by next year";
    return "time markers";
  };

  const buildFormulaExercise = (title, data) => {
    const [lead = "", ...restParts] = String(data?.formula || "").split(" + ");
    const missingChunk = restParts.join(" + ").trim() || String(data?.formula || "").trim();
    return {
      q: "Fill in the blanks:",
      parts: uniqueStrings([
        `${title} formula: ${lead} + ___`,
        `${title} uses these signal words: ___`,
        `${title} is called ___ in Urdu.`,
      ]),
      ans: uniqueStrings([
        missingChunk,
        inferSignalWords(
          TENSE_ORDER.find((entry) => entry.title === title)?.main,
          TENSE_ORDER.find((entry) => entry.title === title)?.sub,
        ),
        String(data?.nameUr || "").trim(),
      ]),
    };
  };

  const buildTrueFalseExercise = (title, family, data, sampleTitle) => ({
    q: "True or False:",
    parts: uniqueStrings([
      `${title} belongs to the ${family} tense family.`,
      `${title} formula is ${data?.formula || ""}.`,
      `${sampleTitle} is one of the reading examples in ${title}.`,
    ]),
    ans: ["True", "True", "True"],
  });

  const buildMatchExercise = (title, data) => ({
    q: "Match the columns:",
    parts: uniqueStrings([
      `${title}`,
      "Urdu name",
      "Formula",
      "Signal words",
    ]),
    ans: uniqueStrings([
      String(data?.nameUr || "").trim(),
      String(data?.formula || "").trim(),
      inferSignalWords(
        TENSE_ORDER.find((entry) => entry.title === title)?.main,
        TENSE_ORDER.find((entry) => entry.title === title)?.sub,
      ),
      title,
    ]),
  });

  const buildQuiz = (currentIndex, title, family, data) => {
    const distractorPool = flatTenses.filter((_, index) => index !== currentIndex);
    const distractorTitles = distractorPool.slice(0, 3).map((entry) => entry.title);
    const distractorUrdu = distractorPool.slice(0, 3).map((entry) => String(entry?.data?.nameUr || "").trim()).filter(Boolean);
    const distractorFormulas = distractorPool.slice(0, 3).map((entry) => String(entry?.data?.formula || "").trim()).filter(Boolean);
    const distractorExamples = distractorPool.slice(0, 3).map((entry) => firstSentence(entry?.data?.items?.[0]?.para || "")).filter(Boolean);
    const sampleExample = firstSentence(data?.items?.[0]?.para || "");
    return [
      {
        q: `Which formula belongs to ${title}?`,
        a: uniqueStrings([String(data?.formula || "").trim(), ...distractorFormulas]).slice(0, 4),
        c: 0,
      },
      {
        q: `What is the Urdu name of ${title}?`,
        a: uniqueStrings([String(data?.nameUr || "").trim(), ...distractorUrdu]).slice(0, 4),
        c: 0,
      },
      {
        q: `${title} belongs to which tense family?`,
        a: uniqueStrings([family, "Present", "Past", "Future"]).slice(0, 4),
        c: 0,
      },
      {
        q: `Which reading example belongs to ${title}?`,
        a: uniqueStrings([sampleExample, ...distractorExamples]).slice(0, 4),
        c: 0,
      },
      {
        q: `Which tense heading matches this subsection?`,
        a: uniqueStrings([title, ...distractorTitles]).slice(0, 4),
        c: 0,
      },
    ];
  };

  const buildSubsection = (entry, index) => {
    const data = entry.data;
    const examples = uniqueStrings((Array.isArray(data?.items) ? data.items : []).map((item) => (
      `${String(item?.title || "").trim()}: ${String(item?.para || "").trim()}`
    )));
    return {
      t: entry.title,
      c: `${String(data?.nameUr || "").trim()}۔ Formula: ${String(data?.formula || "").trim()}. Read the examples, practice the exercises, and then take the quiz.`,
      examplesLabel: "Examples",
      examples,
      exercises: [
        buildFormulaExercise(entry.title, data),
        buildTrueFalseExercise(entry.title, entry.family, data, String(data?.items?.[0]?.title || "Example").trim()),
        buildMatchExercise(entry.title, data),
      ],
      quiz: buildQuiz(index, entry.title, entry.family, data),
    };
  };

  const readingLesson = englishLessons[readingLessonIndex];
  englishLessons[readingLessonIndex] = {
    ...readingLesson,
    title: "Tenses",
    content: "Build a strong foundation in all 12 English tenses through standard subsections with examples, exercises, and quizzes.",
    key: "tenses",
    hasMathSub: true,
    subs: flatTenses.map((entry, index) => buildSubsection(entry, index)),
  };
  delete englishLessons[readingLessonIndex].hasTenses;
})();
