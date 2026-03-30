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
      };
    }

    async applyUpdate(dataLoader, newVersion) {
      await this.db.refreshData(dataLoader, newVersion);
      return {
        applied: true,
        version: newVersion,
      };
    }
  }

  window.DataVersionManager = DataVersionManager;
})();
