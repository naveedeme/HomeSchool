(() => {
  "use strict";

  const STORE_KEY = "homeschool_state";

  function loadState() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage write failures in static/offline mode.
    }
  }

  function downloadJson(filename, payload) {
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(anchor.href);
  }

  window.HomeSchoolUtils = {
    STORE_KEY,
    loadState,
    saveState,
    downloadJson,
  };
})();
