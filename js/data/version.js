(() => {
  "use strict";

  const DATA_VERSION = 6;

  const DATA_MANIFEST = {
    math: { grades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    science: { grades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    english: { grades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    social: { grades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    urdu: { grades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  };

  const DATA_CHANGELOG = [
    {
      version: 6,
      date: "2026-03-31",
      changes: [
        "Moved English tenses into Grade 5 Reading Comprehension as a subsection.",
        "Added a new Grade 5 Urdu to English lesson with day-wise examples, exercises, quizzes, and pacing support.",
      ],
    },
    {
      version: 5,
      date: "2026-03-31",
      changes: [
        "Stopped review cards from showing unrelated fallback context when source day paragraphs do not match the current word.",
        "Clarified review due counts so they read as counts instead of looking like times.",
      ],
    },
    {
      version: 4,
      date: "2026-03-31",
      changes: [
        "Fixed spaced-repetition review examples so each word keeps its own aligned context sentence.",
        "Added theme mode preferences and review queue controls to settings.",
      ],
    },
    {
      version: 3,
      date: "2026-03-31",
      changes: [
        "Added subject-level fingerprint tracking for partial curriculum refreshes.",
        "Added configurable day-based pacing settings for English study sections.",
        "Expanded import validation and merge support for progress backups.",
      ],
    },
    {
      version: 2,
      date: "2026-03-31",
      changes: [
        "Split curriculum data into subject and grade files.",
        "Moved runtime logic into dedicated app, DB, utility, and settings modules.",
      ],
    },
    {
      version: 1,
      date: "2026-03-30",
      changes: [
        "Initial static curriculum bundle.",
      ],
    },
  ];

  window.HomeSchoolDataVersion = {
    DATA_VERSION,
    DATA_MANIFEST,
    DATA_CHANGELOG,
  };
})();
