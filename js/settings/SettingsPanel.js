(() => {
  (() => {
    "use strict";
    function SettingsPanel({
      currentVersion,
      updateAvailable,
      storageLabel,
      onCheckUpdates,
      onRefreshData,
      onExportProgress,
      onImportProgress,
      onResetProgress,
      onFullReset,
      onToggleTTS,
      ttsEnabled,
      language,
      onLanguageChange
    }) {
      return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "section-title", style: { marginTop: 20 } }, "Data Management"), /* @__PURE__ */ React.createElement("div", { className: "settings-item" }, /* @__PURE__ */ React.createElement("span", { className: "si-label" }, "\u{1F9FE} Data Version"), /* @__PURE__ */ React.createElement("span", { className: "si-value" }, "v", currentVersion, updateAvailable ? " \u2022 Update" : "")), /* @__PURE__ */ React.createElement("button", { style: { width: "100%", padding: "12px", borderRadius: 10, border: "1px solid rgba(56,189,248,0.3)", background: "rgba(56,189,248,0.1)", color: "#38BDF8", fontFamily: "'Baloo 2',sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 8 }, onClick: onCheckUpdates }, "\u{1F50E} Check Updates"), /* @__PURE__ */ React.createElement("button", { style: { width: "100%", padding: "12px", borderRadius: 10, border: "1px solid rgba(245,158,11,0.3)", background: "rgba(245,158,11,0.1)", color: "#F59E0B", fontFamily: "'Baloo 2',sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 8 }, onClick: onRefreshData }, "\u267B\uFE0F Re-seed from Source"), /* @__PURE__ */ React.createElement("button", { style: { width: "100%", padding: "12px", borderRadius: 10, border: "1px solid rgba(34,197,94,0.3)", background: "rgba(34,197,94,0.1)", color: "#22C55E", fontFamily: "'Baloo 2',sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 8 }, onClick: onExportProgress }, "\u{1F4BE} Export Progress"), /* @__PURE__ */ React.createElement("label", { style: { display: "block", width: "100%", padding: "12px", borderRadius: 10, border: "1px solid rgba(168,85,247,0.3)", background: "rgba(168,85,247,0.1)", color: "#E9D5FF", fontFamily: "'Baloo 2',sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 8, textAlign: "center" } }, "\u{1F4E5} Import Progress", /* @__PURE__ */ React.createElement("input", { type: "file", accept: ".json,application/json", style: { display: "none" }, onChange: onImportProgress })), /* @__PURE__ */ React.createElement("h3", { className: "section-title", style: { marginTop: 20 } }, "User Data"), /* @__PURE__ */ React.createElement("div", { className: "settings-item" }, /* @__PURE__ */ React.createElement("span", { className: "si-label" }, "\u{1F4BE} Storage"), /* @__PURE__ */ React.createElement("span", { className: "si-value" }, storageLabel)), /* @__PURE__ */ React.createElement("button", { className: "reset-btn", style: { marginTop: 0, marginBottom: 8 }, onClick: onResetProgress }, "\u{1F5D1}\uFE0F Reset Progress"), /* @__PURE__ */ React.createElement("button", { style: { width: "100%", padding: "12px", borderRadius: 10, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.1)", color: "#EF4444", fontFamily: "'Baloo 2',sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer" }, onClick: onFullReset }, "\u{1F4A5} Full Reset"), /* @__PURE__ */ React.createElement("h3", { className: "section-title", style: { marginTop: 20 } }, "Preferences"), /* @__PURE__ */ React.createElement("div", { className: "settings-item" }, /* @__PURE__ */ React.createElement("span", { className: "si-label" }, "\u{1F50A} Text to Speech"), /* @__PURE__ */ React.createElement("button", { className: "grade-btn active", style: { width: 120 }, onClick: onToggleTTS }, ttsEnabled ? "Enabled" : "Disabled")), /* @__PURE__ */ React.createElement("div", { className: "settings-item", style: { display: "block" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement("span", { className: "si-label" }, "\u{1F310} Interface Language"), /* @__PURE__ */ React.createElement("select", { value: language, onChange: (event) => onLanguageChange(event.target.value), style: { padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-elevated)", color: "var(--text-primary)", fontFamily: "var(--font)" } }, /* @__PURE__ */ React.createElement("option", { value: "en" }, "English"), /* @__PURE__ */ React.createElement("option", { value: "ur" }, "\u0627\u0631\u062F\u0648"), /* @__PURE__ */ React.createElement("option", { value: "bilingual" }, "Bilingual")))));
    }
    window.HomeSchoolSettings = {
      SettingsPanel
    };
  })();
})();
