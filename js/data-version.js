(() => {
  "use strict";

  class DataVersionManager {
    constructor(db) {
      this.db = db;
    }

    async checkForUpdates(loadedDataVersion) {
      const currentVersion = await this.db.getStoredVersion();
      return {
        currentVersion,
        newVersion: loadedDataVersion,
        needsUpdate: currentVersion !== loadedDataVersion,
        changes: currentVersion === loadedDataVersion ? [] : ["Curriculum data files changed"],
      };
    }

    async applyUpdate(dataLoader, newVersion) {
      await this.db.refreshData(dataLoader, newVersion);
      return {
        applied: true,
        version: newVersion,
      };
    }

    getVersionInfo() {
      return {
        currentSchema: "v3",
        notes: [
          "Curriculum data is loaded from split subject and grade files.",
          "IndexedDB stores curriculum version metadata separately from user progress.",
        ],
      };
    }
  }

  window.DataVersionManager = DataVersionManager;
})();
