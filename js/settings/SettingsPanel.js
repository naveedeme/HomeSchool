(() => {
  "use strict";

  function actionButton(text, onClick, accent, extraStyle) {
    return React.createElement("button", {
      style: Object.assign({
        width: "100%",
        padding: "12px",
        borderRadius: 10,
        border: `1px solid ${accent}55`,
        background: `${accent}1A`,
        color: accent,
        fontFamily: "var(--font)",
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
        marginBottom: 8,
      }, extraStyle || {}),
      onClick,
    }, text);
  }

  function sectionTitle(text) {
    return React.createElement("h3", { className: "section-title", style: { marginTop: 20 } }, text);
  }

  function renderLocalizedText(text, language) {
    if (typeof text !== "string") return text;
    if (language === "ur") {
      return React.createElement("span", {
        style: {
          fontFamily: "var(--font-ur)",
          direction: "rtl",
          unicodeBidi: "isolate",
        },
      }, text);
    }
    if (language !== "bilingual" || !text.includes(" / ")) return text;
    const [enText, ...rest] = text.split(" / ");
    const urText = rest.join(" / ");
    return React.createElement(React.Fragment, null,
      React.createElement("span", {
        style: {
          direction: "ltr",
          unicodeBidi: "isolate",
        },
      }, enText),
      React.createElement("span", {
        style: {
          direction: "ltr",
          unicodeBidi: "isolate",
        },
      }, " / "),
      React.createElement("span", {
        style: {
          fontFamily: "var(--font-ur)",
          direction: "rtl",
          unicodeBidi: "isolate",
        },
      }, urText));
  }

  function renderLocalizedCount(count, unitLabel, language) {
    const safeCount = Number.isFinite(Number(count)) ? Number(count) : count;
    if (language === "ur") {
      return React.createElement("span", {
        style: {
          fontFamily: "var(--font-ur)",
          direction: "rtl",
          unicodeBidi: "isolate",
        },
      },
      unitLabel,
      " ",
      React.createElement("span", {
        style: {
          direction: "ltr",
          unicodeBidi: "isolate",
          fontFamily: "var(--font)",
        },
      }, String(safeCount)));
    }
    if (language !== "bilingual" || typeof unitLabel !== "string" || !unitLabel.includes(" / ")) {
      return `${safeCount} ${unitLabel}`;
    }
    const [enUnit, ...rest] = unitLabel.split(" / ");
    const urUnit = rest.join(" / ");
    return React.createElement(React.Fragment, null,
      React.createElement("span", {
        style: {
          direction: "ltr",
          unicodeBidi: "isolate",
        },
      }, `${safeCount} ${enUnit}`),
      React.createElement("span", {
        style: {
          direction: "ltr",
          unicodeBidi: "isolate",
        },
      }, " / "),
      React.createElement("span", {
        style: {
          fontFamily: "var(--font-ur)",
          direction: "rtl",
          unicodeBidi: "isolate",
        },
      },
      urUnit,
      " ",
      React.createElement("span", {
        style: {
          direction: "ltr",
          unicodeBidi: "isolate",
          fontFamily: "var(--font)",
        },
      }, String(safeCount))));
  }

  function renderPacingControl(sectionKey, sectionConfig, labels, onDaySectionChange, language) {
    return React.createElement("div", {
      key: sectionKey,
      style: {
        padding: "12px 14px",
        borderRadius: 12,
        background: "rgba(15,23,42,0.55)",
        border: "1px solid rgba(148,163,184,0.16)",
        marginBottom: 10,
      },
    },
    React.createElement("div", {
      style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 6 },
    },
    React.createElement("strong", { style: { color: "var(--text-primary)", fontSize: 14 } }, renderLocalizedText(sectionConfig.label, language)),
    React.createElement("span", { style: { color: "var(--text-muted)", fontSize: 12 } }, renderLocalizedCount(sectionConfig.itemsPerDay, sectionConfig.unitLabel, language))),
    React.createElement("div", {
      style: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
    },
    React.createElement("span", { style: { color: "var(--text-secondary)", fontSize: 12 } }, renderLocalizedText(labels.perDay, language)),
    React.createElement("input", {
      type: "range",
      min: sectionConfig.min || 1,
      max: sectionConfig.max || 20,
      step: 1,
      value: sectionConfig.itemsPerDay,
      onChange: (event) => onDaySectionChange(sectionKey, Number(event.target.value) || sectionConfig.itemsPerDay),
      style: { flex: 1, minWidth: 140 },
    }),
    React.createElement("input", {
      type: "number",
      min: sectionConfig.min || 1,
      max: sectionConfig.max || 20,
      value: sectionConfig.itemsPerDay,
      onChange: (event) => onDaySectionChange(sectionKey, Number(event.target.value) || sectionConfig.itemsPerDay),
      style: {
        width: 76,
        padding: "8px 10px",
        borderRadius: 8,
        border: "1px solid var(--border)",
        background: "var(--bg-elevated)",
        color: "var(--text-primary)",
        fontFamily: "var(--font)",
      },
    })),
    React.createElement("div", { style: { marginTop: 6, color: "var(--text-muted)", fontSize: 12 } }, renderLocalizedText(sectionConfig.helpText || labels.pacingHelp, language)));
  }

  function SettingsPanel({
    currentVersion,
    updateAvailable,
    storageLabel,
    versionInfo,
    onCheckUpdates,
    onRefreshData,
    onExportProgress,
    onImportProgress,
    onResetProgress,
    onFullReset,
    onToggleTTS,
    ttsEnabled,
    language,
    onLanguageChange,
    daySectionSettings,
    onDaySectionChange,
    labels,
  }) {
    const ui = labels || {};
    const history = Array.isArray(versionInfo?.history) ? versionInfo.history : [];
    const versionHistoryBlock = history.length > 0 ? React.createElement("div", {
      style: {
        padding: "12px 14px",
        borderRadius: 12,
        background: "rgba(15,23,42,0.55)",
        border: "1px solid rgba(148,163,184,0.16)",
        marginBottom: 8,
      },
    },
    React.createElement("div", { style: { color: "#E2E8F0", fontSize: 13, fontWeight: 700, marginBottom: 6 } }, ui.versionHistory || "Version History"),
    ...history.slice(0, 2).map((entry) => React.createElement("div", {
      key: `${entry.version}`,
      style: { marginBottom: 8, color: "var(--text-secondary)", fontSize: 12 },
    },
    React.createElement("div", { style: { color: "#F8FAFC", fontWeight: 700, marginBottom: 4 } }, `v${entry.version} • ${entry.date}`),
    React.createElement("div", null, (entry.changes || []).join(" • "))))) : null;

    return React.createElement("div", null,
      sectionTitle(renderLocalizedText(ui.dataManagement || "Data Management", language)),
      React.createElement("div", { className: "settings-item" },
        React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.dataVersion || "Data Version", language)),
        React.createElement("span", { className: "si-value" }, `v${currentVersion}${updateAvailable ? " • Update" : ""}`)),
      actionButton(renderLocalizedText(ui.checkUpdates || "Check Updates", language), onCheckUpdates, "#38BDF8"),
      actionButton(renderLocalizedText(ui.refreshCurriculum || "Re-seed from Source", language), onRefreshData, "#F59E0B"),
      actionButton(renderLocalizedText(ui.exportProgress || "Export Progress", language), onExportProgress, "#22C55E"),
      React.createElement("label", {
        style: {
          display: "block",
          width: "100%",
          padding: "12px",
          borderRadius: 10,
          border: "1px solid rgba(168,85,247,0.3)",
          background: "rgba(168,85,247,0.1)",
          color: "#E9D5FF",
          fontFamily: "'Baloo 2',sans-serif",
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
          marginBottom: 8,
          textAlign: "center",
        },
      }, renderLocalizedText(ui.importProgress || "Import Progress", language),
      React.createElement("input", {
        type: "file",
        accept: ".json,application/json",
        style: { display: "none" },
        onChange: onImportProgress,
      })),
      versionHistoryBlock,

      sectionTitle(renderLocalizedText(ui.userData || "User Data", language)),
      React.createElement("div", { className: "settings-item" },
        React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.storageUsage || "Storage", language)),
        React.createElement("span", { className: "si-value" }, storageLabel)),
      actionButton(renderLocalizedText(ui.resetProgress || "Reset Progress", language), onResetProgress, "#EF4444", { marginBottom: 8 }),
      actionButton(renderLocalizedText(ui.fullReset || "Full Reset", language), onFullReset, "#DC2626", { marginBottom: 0 }),

      sectionTitle(renderLocalizedText(ui.dayBasedSections || "Day-Based English Sections", language)),
      React.createElement("div", {
        style: {
          padding: "12px 14px",
          borderRadius: 12,
          background: "rgba(15,23,42,0.55)",
          border: "1px solid rgba(148,163,184,0.16)",
          marginBottom: 10,
          color: "var(--text-secondary)",
          fontSize: 12,
          lineHeight: 1.5,
        },
      }, renderLocalizedText(ui.dayBasedDescription || "Control how many words or sentences appear in each study day for every English subsection.", language)),
      Object.keys(daySectionSettings || {}).map((sectionKey) => renderPacingControl(sectionKey, daySectionSettings[sectionKey], ui, onDaySectionChange, language)),

      sectionTitle(renderLocalizedText(ui.preferences || "Preferences", language)),
      React.createElement("div", { className: "settings-item" },
        React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.textToSpeech || "Text to Speech", language)),
        React.createElement("button", {
          className: "grade-btn active",
          style: { width: 120 },
          onClick: onToggleTTS,
        }, renderLocalizedText(ttsEnabled ? (ui.enabled || "Enabled") : (ui.disabled || "Disabled"), language))),
      React.createElement("div", { className: "settings-item", style: { display: "block" } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 } },
          React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.interfaceLanguage || "Interface Language", language)),
          React.createElement("select", {
            value: language,
            onChange: (event) => onLanguageChange(event.target.value),
            style: {
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--bg-elevated)",
              color: "var(--text-primary)",
              fontFamily: language === "ur" ? "var(--font-ur)" : "var(--font)",
            },
          },
          React.createElement("option", { value: "en" }, ui.languageEnglish || "English"),
          React.createElement("option", { value: "ur" }, ui.languageUrdu || "اردو"),
          React.createElement("option", { value: "bilingual" }, renderLocalizedText(ui.languageBilingual || "Bilingual", "bilingual"))))));
  }

  window.HomeSchoolSettings = {
    SettingsPanel,
  };
})();
