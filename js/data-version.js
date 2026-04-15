(() => {
  "use strict";

  class DataVersionManager {
    constructor(db) {
      this.db = db;
    }

    async checkForUpdates(loadedDataVersion, dataLoader = window.HomeSchoolData) {
      const metadata = await this.db.getStoredMetadata();
      const currentVersion = metadata?.version ?? null;
      const loadedFingerprints = this.db.buildSubjectFingerprints(dataLoader);
      const storedFingerprints = metadata?.fingerprints || {};
      const changedSubjects = Object.keys(loadedFingerprints).filter((subjectId) => {
        return loadedFingerprints[subjectId]?.hash !== storedFingerprints[subjectId]?.hash;
      });

      return {
        currentVersion,
        newVersion: loadedDataVersion,
        needsUpdate: currentVersion !== loadedDataVersion || changedSubjects.length > 0,
        changedSubjects,
        changes: changedSubjects.length > 0
          ? changedSubjects.map((subjectId) => `Updated ${subjectId} curriculum files`)
          : (window.HomeSchoolDataVersion?.DATA_CHANGELOG || []).find((entry) => entry.version === loadedDataVersion)?.changes || [],
      };
    }

    async applyUpdate(dataLoader, newVersion) {
      const result = await this.db.refreshData(dataLoader, newVersion);
      return {
        applied: true,
        version: newVersion,
        changedSubjects: result.changedSubjects || [],
        refreshed: result.refreshed,
      };
    }

    getVersionInfo() {
      return {
        currentSchema: "v3",
        currentVersion: window.HomeSchoolDataVersion?.DATA_VERSION || null,
        history: window.HomeSchoolDataVersion?.DATA_CHANGELOG || [],
      };
    }
  }

  window.DataVersionManager = DataVersionManager;
})();
