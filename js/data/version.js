(() => {
  "use strict";

  const DATA_VERSION = 3;

  const DATA_MANIFEST = {
    math: { grades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    science: { grades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    english: { grades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    social: { grades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    urdu: { grades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  };

  const DATA_CHANGELOG = [
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
