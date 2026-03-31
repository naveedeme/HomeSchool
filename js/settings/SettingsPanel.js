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
      React.createElement("span", { style: { direction: "ltr", unicodeBidi: "isolate" } }, enText),
      React.createElement("span", { style: { direction: "ltr", unicodeBidi: "isolate" } }, " / "),
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
      }, unitLabel, " ", React.createElement("span", {
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
      React.createElement("span", { style: { direction: "ltr", unicodeBidi: "isolate" } }, `${safeCount} ${enUnit}`),
      React.createElement("span", { style: { direction: "ltr", unicodeBidi: "isolate" } }, " / "),
      React.createElement("span", {
        style: {
          fontFamily: "var(--font-ur)",
          direction: "rtl",
          unicodeBidi: "isolate",
        },
      }, urUnit, " ", React.createElement("span", {
        style: {
          direction: "ltr",
          unicodeBidi: "isolate",
          fontFamily: "var(--font)",
        },
      }, String(safeCount))));
  }

  function renderStorageValue(storageLabel, language) {
    return renderLocalizedText(storageLabel, language);
  }

  function renderPacingControl(sectionKey, sectionConfig, labels, onDaySectionChange, language) {
    return React.createElement("div", {
      key: sectionKey,
      style: {
        padding: "12px 14px",
        borderRadius: 12,
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        marginBottom: 10,
      },
    },
    React.createElement("div", {
      style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 6 },
    },
    React.createElement("strong", { style: { color: "var(--text-primary)", fontSize: 14 } }, renderLocalizedText(sectionConfig.label, language)),
    React.createElement("span", { style: { color: "var(--text-muted)", fontSize: 12 } }, renderLocalizedCount(sectionConfig.itemsPerDay, sectionConfig.unitLabel, language))),
    React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" } },
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

  function renderAiProviderCard(provider, labels, language, onAiProviderDraftChange, onSaveAiProvider, onClearAiProvider) {
    return React.createElement("div", {
      key: provider.id,
      style: {
        padding: "14px 16px",
        borderRadius: 14,
        border: "1px solid var(--border)",
        background: "var(--bg-elevated)",
        marginBottom: 12,
      },
    },
    React.createElement("div", {
      style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 10 },
    },
    React.createElement("div", null,
      React.createElement("strong", { style: { color: "var(--text-primary)", fontSize: 14 } }, renderLocalizedText(provider.label, language)),
      React.createElement("div", { style: { color: "var(--text-secondary)", fontSize: 12, fontWeight: 700, marginTop: 4 } }, renderLocalizedText(provider.statusLabel, language))),
    provider.helpText ? React.createElement("span", {
      style: {
        display: "inline-block",
        maxWidth: 220,
        color: "var(--text-muted)",
        fontSize: 11,
        textAlign: language === "ur" ? "right" : "left",
        fontFamily: language === "ur" ? "var(--font-ur)" : "var(--font)",
      },
    }, provider.helpText) : null),
    React.createElement("div", { style: { marginBottom: 10 } },
      React.createElement("label", { className: "settings-input-label" }, renderLocalizedText(labels.aiApiKey || "API Key", language)),
      React.createElement("input", {
        className: "settings-text-input",
        type: "password",
        autoComplete: "off",
        spellCheck: false,
        value: provider.apiKey,
        onChange: (event) => onAiProviderDraftChange(provider.id, "apiKey", event.target.value),
        placeholder: provider.id === "openai" ? "sk-..." : provider.id === "anthropic" ? "sk-ant-..." : "ollama_...",
      })),
    React.createElement("div", { style: { marginBottom: 12 } },
      React.createElement("label", { className: "settings-input-label" }, renderLocalizedText(labels.aiDefaultModel || "Default Model", language)),
      React.createElement("select", {
        value: provider.model,
        onChange: (event) => onAiProviderDraftChange(provider.id, "model", event.target.value),
        style: {
          width: "100%",
          padding: "10px 12px",
          borderRadius: 10,
          border: "1px solid var(--border)",
          background: "var(--bg-elevated)",
          color: "var(--text-primary)",
          fontFamily: "var(--font)",
        },
      }, ...(Array.isArray(provider.modelOptions) ? provider.modelOptions : [provider.model]).map((modelName) => React.createElement("option", { key: modelName, value: modelName }, modelName)))),
    React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" } },
      React.createElement("button", {
        className: "ghost-cta",
        onClick: () => onSaveAiProvider(provider.id),
        disabled: provider.busy,
      }, provider.busy ? renderLocalizedText(language === "ur" ? "محفوظ ہو رہا ہے..." : "Saving...", language) : renderLocalizedText(labels.aiSaveConnection || "Save Connection", language)),
      React.createElement("button", {
        className: "study-tool-btn",
        onClick: () => onClearAiProvider(provider.id),
      }, renderLocalizedText(labels.aiClearConnection || "Clear Connection", language))));
  }

  function DisclosureSection({ title, language, children, transitionMode }) {
    const [open, setOpen] = React.useState(false);

    return React.createElement("div", {
      className: `settings-disclosure${open ? " open" : ""}`,
      "data-transition-mode": transitionMode || "fade",
    },
      React.createElement("button", {
        type: "button",
        className: "settings-disclosure-toggle",
        onClick: () => setOpen((value) => !value),
        "aria-expanded": open ? "true" : "false",
        style: language === "ur"
          ? { direction: "rtl", textAlign: "right", fontFamily: "var(--font-ur)" }
          : language === "bilingual"
            ? { textAlign: "left" }
            : null,
      },
        React.createElement("span", { className: "settings-disclosure-label" }, renderLocalizedText(title, language)),
        React.createElement("span", { className: "settings-disclosure-icon", "aria-hidden": "true" }, open ? "−" : "+")),
      React.createElement("div", { className: "settings-disclosure-body-wrap" },
        React.createElement("div", { className: "settings-disclosure-body-clip" },
          React.createElement("div", { className: "settings-disclosure-body" }, ...children))));
  }

  function getNoticeText(entry, key, language) {
    if (language === "ur") return entry?.[`${key}Ur`] || entry?.[`${key}En`] || "";
    if (language === "bilingual") return `${entry?.[`${key}En`] || ""} / ${entry?.[`${key}Ur`] || entry?.[`${key}En`] || ""}`;
    return entry?.[`${key}En`] || entry?.[`${key}Ur`] || "";
  }

  function SettingsPanel(props) {
    const {
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
      ttsRate,
      onTtsRateChange,
      englishVoiceOptions,
      urduVoiceOptions,
      ttsVoiceSelections,
      onTtsVoiceSelectionChange,
      language,
      onLanguageChange,
      themeMode,
      onThemeModeChange,
      navPosition,
      onNavPositionChange,
      transitionMode,
      onTransitionModeChange,
      dailyReviewCap,
      onDailyReviewCapChange,
      daySectionSettings,
      onDaySectionChange,
      studyGoals,
      onStudyGoalChange,
      focusTimerSettings,
      onFocusTimerSettingChange,
      reminderSettings,
      onReminderSettingsChange,
      onRequestNotificationPermission,
      notificationPermission,
      notificationHistory,
      onClearNotificationHistory,
      installStatusLabel,
      offlineStatusLabel,
      networkStatusLabel,
      canInstallApp,
      onInstallApp,
      canReloadApp,
      onReloadApp,
      aiProviders,
      onAiProviderDraftChange,
      onSaveAiProvider,
      onClearAiProvider,
      aiBrowserBlocked,
      labels,
    } = props;

    const ui = labels || {};
    const versionHistory = Array.isArray(versionInfo?.history) ? versionInfo.history : [];
    const notificationItems = Array.isArray(notificationHistory) ? notificationHistory : [];
    const selectStyle = {
      padding: "10px 12px",
      borderRadius: 10,
      border: "1px solid var(--border)",
      background: "var(--bg-elevated)",
      color: "var(--text-primary)",
      fontFamily: language === "ur" || language === "bilingual" ? "var(--font-ur)" : "var(--font)",
    };

    const children = [];

    const dataChildren = [
      React.createElement("div", { key: "version", className: "settings-item" },
        React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.dataVersion || "Data Version", language)),
        React.createElement("span", { className: "si-value" }, `v${currentVersion}${updateAvailable ? " • Update" : ""}`)),
      actionButton(renderLocalizedText(ui.checkUpdates || "Check Updates", language), onCheckUpdates, "#38BDF8", { key: "check" }),
      actionButton(renderLocalizedText(ui.refreshCurriculum || "Re-seed from Source", language), onRefreshData, "#F59E0B", { key: "refresh" }),
      actionButton(renderLocalizedText(ui.exportProgress || "Export Progress", language), onExportProgress, "#22C55E", { key: "export" }),
      React.createElement("label", {
        key: "import",
        style: {
          display: "block",
          width: "100%",
          padding: "12px",
          borderRadius: 10,
          border: "1px solid var(--border)",
          background: "var(--bg-elevated)",
          color: "var(--text-primary)",
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
    ];
    if (versionHistory.length > 0) {
      const versionHistoryEntries = versionHistory.slice(0, 2).map((entry) => React.createElement("div", {
        key: entry.version,
        style: { marginBottom: 8, color: "var(--text-secondary)", fontSize: 12 },
      },
      React.createElement("div", { style: { color: "var(--text-primary)", fontWeight: 700, marginBottom: 4 } }, `v${entry.version} • ${entry.date}`),
      React.createElement("div", null, (entry.changes || []).join(" • "))));

      dataChildren.push(React.createElement("div", {
        key: "history",
        style: {
          padding: "12px 14px",
          borderRadius: 12,
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          marginBottom: 8,
        },
      },
      React.createElement("div", { style: { color: "var(--text-primary)", fontSize: 13, fontWeight: 700, marginBottom: 6 } }, renderLocalizedText(ui.versionHistory || "Version History", language)),
      ...versionHistoryEntries));
    }

    const userDataChildren = [
      React.createElement("div", { key: "storage", className: "settings-item" },
        React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.storageUsage || "Storage", language)),
        React.createElement("span", { className: "si-value" }, renderStorageValue(storageLabel, language))),
      actionButton(renderLocalizedText(ui.resetProgress || "Reset Progress", language), onResetProgress, "#EF4444", { key: "reset" }),
      actionButton(renderLocalizedText(ui.fullReset || "Full Reset", language), onFullReset, "#DC2626", { key: "full-reset", marginBottom: 0 }),
    ];

    const experienceChildren = [
      React.createElement("div", { key: "install", className: "settings-item" },
        React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.installStatus || "Install Status", language)),
        React.createElement("span", { className: "si-value" }, renderLocalizedText(installStatusLabel || (ui.appInstallUnavailable || "Browser install not available"), language))),
      React.createElement("div", { key: "offline", className: "settings-item" },
        React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.offlineAccess || "Offline Access", language)),
        React.createElement("span", { className: "si-value" }, renderLocalizedText(offlineStatusLabel || (ui.offlineCaching || "Preparing offline cache"), language))),
      React.createElement("div", { key: "network", className: "settings-item" },
        React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.networkStatus || "Network", language)),
        React.createElement("span", { className: "si-value" }, renderLocalizedText(networkStatusLabel || (ui.online || "Online"), language))),
      React.createElement("div", { key: "nav-position", className: "settings-item", style: { display: "block" } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 } },
          React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.navPlacement || "Navigation Placement", language)),
          React.createElement("select", { value: navPosition || "bottom", onChange: (event) => onNavPositionChange(event.target.value), style: selectStyle },
            React.createElement("option", { value: "bottom" }, renderLocalizedText(ui.navBottom || "Bottom", language)),
            React.createElement("option", { value: "right" }, renderLocalizedText(ui.navRight || "Right", language)),
            React.createElement("option", { value: "left" }, renderLocalizedText(ui.navLeft || "Left", language)),
            React.createElement("option", { value: "top" }, renderLocalizedText(ui.navTop || "Top", language))))),
      React.createElement("div", { key: "transition-style", className: "settings-item", style: { display: "block" } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 } },
          React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.transitionStyle || "Transition Style", language)),
          React.createElement("select", { value: transitionMode || "fade", onChange: (event) => onTransitionModeChange(event.target.value), style: selectStyle },
            React.createElement("option", { value: "none" }, renderLocalizedText(ui.transitionNone || "None", language)),
            React.createElement("option", { value: "fade" }, renderLocalizedText(ui.transitionFade || "Fade", language)),
            React.createElement("option", { value: "slide" }, renderLocalizedText(ui.transitionSlide || "Slide", language)),
            React.createElement("option", { value: "zoom" }, renderLocalizedText(ui.transitionZoom || "Zoom", language))))),
    ];
    if (canInstallApp) experienceChildren.push(actionButton(renderLocalizedText(ui.installApp || "Install App", language), onInstallApp, "#6366F1", { key: "install-btn" }));
    if (canReloadApp) experienceChildren.push(actionButton(renderLocalizedText(ui.refreshToUpdate || "Refresh to Update", language), onReloadApp, "#0EA5E9", { key: "reload-btn" }));

    const aiChildren = [
      React.createElement("div", {
        key: "ai-help",
        style: {
          padding: "12px 14px",
          borderRadius: 12,
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          marginBottom: 10,
          color: "var(--text-secondary)",
          fontSize: 12,
          lineHeight: 1.5,
          fontFamily: language === "ur" ? "var(--font-ur)" : "var(--font)",
          direction: language === "ur" ? "rtl" : "ltr",
          textAlign: language === "ur" ? "right" : "left",
        },
      }, renderLocalizedText(ui.aiConnectionsHelp || "Keys stay only in this browser and are excluded from backup export. Browser API calls may still be blocked by a provider or by file mode.", language)),
    ];
    if (aiBrowserBlocked) {
      aiChildren.push(React.createElement("div", {
        key: "ai-warning",
        style: {
          padding: "10px 12px",
          borderRadius: 12,
          background: "rgba(245,158,11,0.12)",
          border: "1px solid rgba(245,158,11,0.25)",
          color: "var(--warning)",
          marginBottom: 10,
          fontSize: 12,
          fontWeight: 700,
          fontFamily: language === "ur" ? "var(--font-ur)" : "var(--font)",
        },
      }, renderLocalizedText(ui.aiBrowserBlocked || "Direct browser AI access works best on the published HTTPS site or localhost, not from file mode.", language)));
    }
    (Array.isArray(aiProviders) ? aiProviders : []).forEach((provider) => {
      aiChildren.push(renderAiProviderCard(provider, ui, language, onAiProviderDraftChange, onSaveAiProvider, onClearAiProvider));
    });

    const pacingChildren = [
      React.createElement("div", {
        key: "pacing-help",
        style: {
          padding: "12px 14px",
          borderRadius: 12,
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          marginBottom: 10,
          color: "var(--text-secondary)",
          fontSize: 12,
          lineHeight: 1.5,
        },
      }, renderLocalizedText(ui.dayBasedDescription || "Control how many words or sentences appear in each study day for every English subsection.", language)),
      ...Object.keys(daySectionSettings || {}).map((sectionKey) => renderPacingControl(sectionKey, daySectionSettings[sectionKey], ui, onDaySectionChange, language)),
    ];

    const preferencesChildren = [
      React.createElement("div", { key: "tts-toggle", className: "settings-item" },
        React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.textToSpeech || "Text to Speech", language)),
        React.createElement("button", { className: "grade-btn active", style: { width: 120 }, onClick: onToggleTTS }, renderLocalizedText(ttsEnabled ? (ui.enabled || "Enabled") : (ui.disabled || "Disabled"), language))),
      React.createElement("div", { key: "tts-speed", className: "settings-item", style: { display: "block" } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 10 } },
          React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.ttsSpeed || "Playback Speed", language)),
          React.createElement("span", { className: "si-value" }, `${Number(ttsRate || 0.85).toFixed(2)}x`)),
        React.createElement("input", { type: "range", min: 0.6, max: 1.3, step: 0.05, value: Number(ttsRate || 0.85), onChange: (event) => onTtsRateChange(Number(event.target.value) || 0.85), style: { width: "100%" } })),
      React.createElement("div", { key: "voice-en", className: "settings-item", style: { display: "block" } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 10 } },
          React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.englishVoice || "English Voice", language)),
          React.createElement("select", { value: ttsVoiceSelections?.en || "", onChange: (event) => onTtsVoiceSelectionChange("en", event.target.value), style: Object.assign({}, selectStyle, { minWidth: 220, fontFamily: "var(--font)" }) },
            React.createElement("option", { value: "" }, renderLocalizedText(ui.voiceAuto || "Auto", language)),
            ...(Array.isArray(englishVoiceOptions) ? englishVoiceOptions : []).map((voice) => React.createElement("option", { key: voice.voiceURI || voice.name, value: voice.voiceURI || voice.name }, `${voice.name} (${voice.lang})`)))),
        React.createElement("div", { style: { marginTop: 8, color: "var(--text-muted)", fontSize: 12 } }, renderLocalizedText(ui.voiceAutoHelp || "Auto chooses the best supported browser voice.", language))),
      React.createElement("div", { key: "voice-ur", className: "settings-item", style: { display: "block" } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 10 } },
          React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.urduVoice || "Urdu Voice", language)),
          React.createElement("select", { value: ttsVoiceSelections?.ur || "", onChange: (event) => onTtsVoiceSelectionChange("ur", event.target.value), style: Object.assign({}, selectStyle, { minWidth: 220 }) },
            React.createElement("option", { value: "" }, renderLocalizedText(ui.voiceAuto || "Auto", language)),
            ...(Array.isArray(urduVoiceOptions) ? urduVoiceOptions : []).map((voice) => React.createElement("option", { key: voice.voiceURI || voice.name, value: voice.voiceURI || voice.name }, `${voice.name} (${voice.lang})`)))),
        React.createElement("div", { style: { marginTop: 8, color: "var(--text-muted)", fontSize: 12, fontFamily: language === "ur" ? "var(--font-ur)" : "var(--font)" } }, renderLocalizedText(ui.urduVoiceHelp || "Choose the closest Urdu or Urdu-friendly browser voice.", language))),
      React.createElement("div", { key: "theme", className: "settings-item", style: { display: "block" } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 } },
          React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.themeMode || "Theme Mode", language)),
          React.createElement("select", { value: themeMode || "system", onChange: (event) => onThemeModeChange(event.target.value), style: selectStyle },
            React.createElement("option", { value: "system" }, renderLocalizedText(ui.themeSystem || "System", language)),
            React.createElement("option", { value: "dark" }, renderLocalizedText(ui.themeDark || "Dark", language)),
            React.createElement("option", { value: "light" }, renderLocalizedText(ui.themeLight || "Light", language))))),
      React.createElement("div", { key: "review-cap", className: "settings-item", style: { display: "block" } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 10 } },
          React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.dailyReviewCap || "Daily Review Cap", language)),
          React.createElement("span", { className: "si-value" }, dailyReviewCap)),
        React.createElement("input", { type: "range", min: 5, max: 50, step: 1, value: dailyReviewCap, onChange: (event) => onDailyReviewCapChange(Number(event.target.value) || dailyReviewCap), style: { width: "100%" } }),
        React.createElement("div", { style: { marginTop: 8, color: "var(--text-muted)", fontSize: 12 } }, renderLocalizedText(ui.dailyReviewCapHelp || "Limits how many review cards appear in one study session.", language))),
      React.createElement("div", { key: "language", className: "settings-item", style: { display: "block" } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 } },
          React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.interfaceLanguage || "Interface Language", language)),
          React.createElement("select", { value: language, onChange: (event) => onLanguageChange(event.target.value), style: selectStyle },
            React.createElement("option", { value: "en" }, ui.languageEnglish || "English"),
            React.createElement("option", { value: "ur" }, ui.languageUrdu || "اردو"),
            React.createElement("option", { value: "bilingual" }, renderLocalizedText(ui.languageBilingual || "Bilingual", "bilingual"))))),
    ];

    const planningChildren = [
      React.createElement("div", { key: "goal-daily", className: "settings-item", style: { display: "block" } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 10 } },
          React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.dailyGoal || "Daily Review Goal", language)),
          React.createElement("span", { className: "si-value" }, studyGoals?.dailyReviews || 20)),
        React.createElement("input", { type: "range", min: 5, max: 60, step: 1, value: studyGoals?.dailyReviews || 20, onChange: (event) => onStudyGoalChange("dailyReviews", event.target.value), style: { width: "100%" } })),
      React.createElement("div", { key: "goal-weekly", className: "settings-item", style: { display: "block" } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 10 } },
          React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.weeklyGoal || "Weekly Word Goal", language)),
          React.createElement("span", { className: "si-value" }, studyGoals?.weeklyWords || 40)),
        React.createElement("input", { type: "range", min: 10, max: 140, step: 5, value: studyGoals?.weeklyWords || 40, onChange: (event) => onStudyGoalChange("weeklyWords", event.target.value), style: { width: "100%" } })),
      React.createElement("div", { key: "focus-timer", className: "settings-item", style: { display: "block" } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 10 } },
          React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.focusTimer || "Focus Timer", language)),
          React.createElement("span", { className: "si-value" }, `${focusTimerSettings?.durationMinutes || 20} min`)),
        React.createElement("input", { type: "range", min: 5, max: 60, step: 5, value: focusTimerSettings?.durationMinutes || 20, onChange: (event) => onFocusTimerSettingChange(event.target.value), style: { width: "100%" } })),
      React.createElement("div", { key: "reminder", className: "settings-item", style: { display: "block" } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 10 } },
          React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.studyReminder || "Study Reminder", language)),
          React.createElement("button", { className: "grade-btn active", style: { width: 120 }, onClick: () => onReminderSettingsChange({ enabled: !reminderSettings?.enabled }) }, renderLocalizedText(reminderSettings?.enabled ? (ui.enabled || "Enabled") : (ui.disabled || "Disabled"), language))),
        React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 10 } },
          React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.reminderTime || "Reminder Time", language)),
          React.createElement("input", {
            type: "time",
            value: reminderSettings?.time || "18:00",
            onChange: (event) => onReminderSettingsChange({ time: event.target.value || "18:00" }),
            style: {
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--bg-elevated)",
              color: "var(--text-primary)",
              fontFamily: "var(--font)",
            },
          })),
        React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" } },
          React.createElement("button", { className: "ghost-cta", onClick: () => onReminderSettingsChange({ notifications: !reminderSettings?.notifications }) }, renderLocalizedText(reminderSettings?.notifications ? (ui.browserNotificationsOn || "Browser Notifications On") : (ui.browserNotificationsOff || "Browser Notifications Off"), language)),
          React.createElement("button", { className: "study-tool-btn", onClick: onRequestNotificationPermission }, renderLocalizedText(notificationPermission === "granted" ? (ui.notificationReady || "Permission Ready") : (ui.requestNotifications || "Request Permission"), language))),
        React.createElement("div", { style: { marginTop: 8, color: "var(--text-muted)", fontSize: 12 } }, renderLocalizedText(ui.reminderHelp || "Reminders work when the app is open, installed, or notifications are permitted by the browser.", language))),
    ];

    const notificationChildren = [
      React.createElement("div", {
        key: "notice-help",
        style: {
          padding: "12px 14px",
          borderRadius: 12,
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          marginBottom: 10,
          color: "var(--text-secondary)",
          fontSize: 12,
          lineHeight: 1.5,
        },
      }, renderLocalizedText(ui.notificationHistoryHint || "Study reminders and focus-session alerts will appear here after they trigger.", language)),
    ];
    if (notificationItems.length > 0) {
      notificationChildren.push(React.createElement("div", { key: "notice-list", className: "notification-history-list", style: { marginBottom: 10 } },
        ...notificationItems.map((entry) => React.createElement("div", { key: entry.id, className: "notification-history-item" },
          React.createElement("div", { className: "notification-history-top" },
            React.createElement("strong", null, renderLocalizedText(getNoticeText(entry, "title", language), language)),
            React.createElement("span", null, new Date(entry.createdAt || Date.now()).toLocaleString())),
          React.createElement("p", null, renderLocalizedText(getNoticeText(entry, "body", language), language))))));
      notificationChildren.push(actionButton(renderLocalizedText(ui.clearNotifications || "Clear History", language), onClearNotificationHistory, "#8B5CF6", { key: "clear-notices", marginBottom: 0 }));
    } else {
      notificationChildren.push(React.createElement("p", { key: "notice-empty", className: "empty-state" }, renderLocalizedText(ui.noNotificationsYet || "No notifications yet.", language)));
    }
    children.push(React.createElement(DisclosureSection, { key: "settings-data", title: ui.dataManagement || "Data Management", language, transitionMode }, ...dataChildren));
    children.push(React.createElement(DisclosureSection, { key: "settings-user", title: ui.userData || "User Data", language, transitionMode }, ...userDataChildren));
    children.push(React.createElement(DisclosureSection, { key: "settings-experience", title: ui.appExperience || "App Experience", language, transitionMode }, ...experienceChildren));
    children.push(React.createElement(DisclosureSection, { key: "settings-ai", title: ui.aiConnections || "AI Tutor Connections", language, transitionMode }, ...aiChildren));
    children.push(React.createElement(DisclosureSection, { key: "settings-pacing", title: ui.dayBasedSections || "Day-Based English Sections", language, transitionMode }, ...pacingChildren));
    children.push(React.createElement(DisclosureSection, { key: "settings-preferences", title: ui.preferences || "Preferences", language, transitionMode }, ...preferencesChildren));
    children.push(React.createElement(DisclosureSection, { key: "settings-planning", title: ui.studyPlanning || "Study Planning", language, transitionMode }, ...planningChildren));
    children.push(React.createElement(DisclosureSection, { key: "settings-notices", title: ui.notificationHistory || "Notification History", language, transitionMode }, ...notificationChildren));

    return React.createElement("div", null, ...children);
  }

  window.HomeSchoolSettings = {
    SettingsPanel,
  };
})();
