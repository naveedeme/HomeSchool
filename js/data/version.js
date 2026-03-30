(() => {
  "use strict";

  const DATA_VERSION = 2;

  const DATA_MANIFEST = {
    math: { grades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    science: { grades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    english: { grades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    social: { grades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    urdu: { grades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  };

  window.HomeSchoolDataVersion = {
    DATA_VERSION,
    DATA_MANIFEST,
  };
})();
