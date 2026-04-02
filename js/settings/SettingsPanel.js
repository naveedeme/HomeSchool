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

  function joinLocalizedText(enText, urText, language) {
    if (language === "ur") return urText;
    if (language === "bilingual") return `${enText} / ${urText}`;
    return enText;
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
        placeholder: provider.id === "openai" ? "sk-..." : provider.id === "anthropic" ? "sk-ant-..." : provider.id === "gemini" ? "AIza..." : "ollama_...",
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

  function SettingsGroup({ title, language, children }) {
    return React.createElement("div", {
      className: "settings-group-card",
      style: language === "ur"
        ? { direction: "rtl", textAlign: "right" }
        : null,
    },
      React.createElement("div", { className: "settings-group-title" }, renderLocalizedText(title, language)),
      React.createElement("div", { className: "settings-group-body" }, ...children));
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
      onResetReviewSystem,
      onClearStudyCollections,
      onResetPlanningData,
      onToggleTTS,
      ttsEnabled,
      audioMuted,
      onAudioMutedChange,
      autoPlayNext,
      onAutoPlayNextChange,
      wordMeaningPriority,
      onWordMeaningPriorityChange,
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
      fontSizeMode,
      onFontSizeModeChange,
      reducedMotion,
      onReducedMotionChange,
      highContrast,
      onHighContrastChange,
      focusMode,
      onFocusModeChange,
      readingMode,
      onReadingModeChange,
      keyboardShortcutsEnabled,
      onKeyboardShortcutsEnabledChange,
      navPosition,
      onNavPositionChange,
      navAutoHide,
      onNavAutoHideChange,
      navBarAutoHide,
      onNavBarAutoHideChange,
      transitionMode,
      onTransitionModeChange,
      dailyReviewCap,
      onDailyReviewCapChange,
      reviewSrsSettings,
      onReviewSrsSettingChange,
      daySectionSettings,
      onDaySectionChange,
      studyGoals,
      onStudyGoalChange,
      focusTimerSettings,
      onFocusTimerSettingChange,
      reminderSettings,
      onReminderSettingsChange,
      backupReminderSettings,
      onBackupReminderSettingChange,
      backupStatusLabel,
      classScheduleSettings,
      onClassScheduleChange,
      timeTrackingData,
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
    const classDurationMinutes = Math.max(0, ((Number((classScheduleSettings?.endTime || "13:00").split(":")[0]) || 0) * 60 + (Number((classScheduleSettings?.endTime || "13:00").split(":")[1]) || 0)) - ((Number((classScheduleSettings?.startTime || "08:00").split(":")[0]) || 0) * 60 + (Number((classScheduleSettings?.startTime || "08:00").split(":")[1]) || 0)));
    const latestTimeEntry = Array.isArray(timeTrackingData?.history) ? timeTrackingData.history[0] : null;
    const latestMinutesSpent = Math.round((latestTimeEntry?.msSpent || 0) / 60000);

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

    const adminChildren = [
      React.createElement("div", { key: "backup-controls", style: { padding: "12px 14px", borderRadius: 12, background: "var(--bg-elevated)", border: "1px solid var(--border)", marginBottom: 10 } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 10 } },
          React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.backupReminderEnabled || "Backup Reminder", language)),
          React.createElement("select", {
            value: backupReminderSettings?.enabled ? "on" : "off",
            onChange: (event) => onBackupReminderSettingChange("enabled", event.target.value === "on"),
            style: selectStyle,
          },
            React.createElement("option", { value: "on" }, renderLocalizedText(ui.enabled || "On", language)),
            React.createElement("option", { value: "off" }, renderLocalizedText(ui.disabled || "Off", language)))),
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 10 } },
          React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.backupReminderInterval || "Backup Interval", language)),
          React.createElement("select", {
            value: String(backupReminderSettings?.intervalDays || 14),
            onChange: (event) => onBackupReminderSettingChange("intervalDays", Number(event.target.value) || 14),
            style: selectStyle,
          },
            React.createElement("option", { value: "7" }, renderLocalizedText(ui.backupInterval7 || "Every 7 days", language)),
            React.createElement("option", { value: "14" }, renderLocalizedText(ui.backupInterval14 || "Every 14 days", language)),
            React.createElement("option", { value: "30" }, renderLocalizedText(ui.backupInterval30 || "Every 30 days", language)))),
        React.createElement("div", { style: { color: "var(--text-secondary)", fontSize: 12, lineHeight: 1.5 } }, renderLocalizedText(backupStatusLabel || (ui.backupReminderOff || "Backup reminders are off."), language)),
        React.createElement("div", { style: { marginTop: 6, color: "var(--text-muted)", fontSize: 12, lineHeight: 1.5 } }, renderLocalizedText(ui.backupReminderNotice || "Export a fresh backup to keep your latest progress safe.", language))),
      React.createElement("div", { key: "selective-reset", style: { padding: "12px 14px", borderRadius: 12, background: "var(--bg-elevated)", border: "1px solid var(--border)" } },
        React.createElement("div", { style: { color: "var(--text-primary)", fontSize: 13, fontWeight: 700, marginBottom: 6 } }, renderLocalizedText(ui.selectiveReset || "Selective Reset", language)),
        React.createElement("div", { style: { color: "var(--text-muted)", fontSize: 12, lineHeight: 1.5, marginBottom: 10 } }, renderLocalizedText(ui.selectiveResetHelp || "Clear only the part you want without wiping the whole app.", language)),
        actionButton(renderLocalizedText(ui.resetReviewSystem || "Reset Review System", language), onResetReviewSystem, "#EF4444", { key: "reset-review" }),
        actionButton(renderLocalizedText(ui.clearStudyCollections || "Clear Favorites, Notes & Lists", language), onClearStudyCollections, "#F97316", { key: "clear-study" }),
        actionButton(renderLocalizedText(ui.resetPlanningData || "Reset Time & Reminders", language), onResetPlanningData, "#8B5CF6", { key: "reset-planning", marginBottom: 0 })),
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
      React.createElement("div", { key: "nav-autohide", className: "settings-item", style: { display: "block" } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 } },
          React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.navAutoHide || "Auto-hide Navigation", language)),
          React.createElement("select", { value: navAutoHide ? "on" : "off", onChange: (event) => onNavAutoHideChange(event.target.value === "on"), style: selectStyle },
            React.createElement("option", { value: "off" }, renderLocalizedText(ui.disabled || "Off", language)),
            React.createElement("option", { value: "on" }, renderLocalizedText(ui.enabled || "On", language))))),
      React.createElement("div", { key: "nav-bar-autohide", className: "settings-item", style: { display: "block" } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 } },
          React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.navBarAutoHide || "Auto-hide Navigation Bar", language)),
          React.createElement("select", { value: navBarAutoHide ? "on" : "off", onChange: (event) => onNavBarAutoHideChange(event.target.value === "on"), style: selectStyle },
            React.createElement("option", { value: "off" }, renderLocalizedText(ui.disabled || "Off", language)),
            React.createElement("option", { value: "on" }, renderLocalizedText(ui.enabled || "On", language))))),
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
    aiChildren.push(React.createElement("div", {
      key: "meaning-priority",
      style: {
        padding: "12px 14px",
        borderRadius: 12,
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        marginBottom: 10,
      },
    },
      React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 8, flexWrap: "wrap" } },
        React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.meaningLookupPriority || (language === "ur" ? "معنی تلاش کی ترجیح" : "Meaning Lookup Priority"), language)),
        React.createElement("select", {
          value: wordMeaningPriority || "local-first",
          onChange: (event) => onWordMeaningPriorityChange(event.target.value),
          style: selectStyle,
        },
          React.createElement("option", { value: "local-first" }, renderLocalizedText(ui.meaningPriorityLocalFirst || (language === "ur" ? "پہلے مقامی" : "Local first"), language)),
          React.createElement("option", { value: "ai-first" }, renderLocalizedText(ui.meaningPriorityAiFirst || (language === "ur" ? "پہلے اے آئی" : "AI first"), language)))),
      React.createElement("div", { style: { color: "var(--text-muted)", fontSize: 12, lineHeight: 1.6, fontFamily: language === "ur" ? "var(--font-ur)" : "var(--font)", direction: language === "ur" ? "rtl" : "ltr", textAlign: language === "ur" ? "right" : "left" } },
        renderLocalizedText(ui.meaningLookupPriorityHelp || (language === "ur" ? "منتخب کریں کہ لفظوں کے معنی پہلے مقامی ذخیرہ الفاظ سے لیے جائیں یا دستیاب ہونے پر پہلے اے آئی سے پوچھا جائے۔" : "Choose whether word meanings should prefer local vocabulary first or try AI first when available."), language)))),
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
      React.createElement("div", { key: "audio-mute", className: "settings-item" },
        React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.muteAudio || (language === "ur" ? "آواز بند کریں" : "Mute Audio"), language)),
        React.createElement("button", { className: "grade-btn active", style: { width: 120 }, onClick: () => onAudioMutedChange(!audioMuted) }, renderLocalizedText(audioMuted ? (ui.enabled || "Enabled") : (ui.disabled || "Disabled"), language))),
      React.createElement("div", { key: "autoplay-next", className: "settings-item", style: { display: "block" } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 10 } },
          React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.autoPlayNext || (language === "ur" ? "اگلا خودکار سنائیں" : "Auto-Play Next"), language)),
          React.createElement("button", { className: "grade-btn active", style: { width: 120 }, onClick: () => onAutoPlayNextChange(!autoPlayNext) }, renderLocalizedText(autoPlayNext ? (ui.enabled || "Enabled") : (ui.disabled || "Disabled"), language))),
        React.createElement("div", { style: { marginTop: 8, color: "var(--text-muted)", fontSize: 12, lineHeight: 1.6 } }, renderLocalizedText(ui.autoPlayNextHelp || (language === "ur" ? "نیا پریکٹس کارڈ کھلتے ہی اگلا پرامپٹ خودکار طور پر سنائیں۔" : "Automatically play the next prompt when a new practice card opens."), language))),
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

    const accessibilityChildren = [
      React.createElement("div", { key: "font-size", className: "settings-item", style: { display: "block" } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 } },
          React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.fontSize || (language === "ur" ? "فونٹ سائز" : "Font Size"), language)),
          React.createElement("select", { value: fontSizeMode || "normal", onChange: (event) => onFontSizeModeChange(event.target.value), style: selectStyle },
            React.createElement("option", { value: "small" }, renderLocalizedText(language === "ur" ? "چھوٹا" : "Small", language)),
            React.createElement("option", { value: "normal" }, renderLocalizedText(language === "ur" ? "معمول" : "Normal", language)),
            React.createElement("option", { value: "large" }, renderLocalizedText(language === "ur" ? "بڑا" : "Large", language)),
            React.createElement("option", { value: "xlarge" }, renderLocalizedText(language === "ur" ? "بہت بڑا" : "Extra Large", language))))),
      React.createElement("div", { key: "reduced-motion", className: "settings-item" },
        React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.reducedMotion || (language === "ur" ? "کم حرکت" : "Reduced Motion"), language)),
        React.createElement("button", { className: "grade-btn active", style: { width: 120 }, onClick: () => onReducedMotionChange(!reducedMotion) }, renderLocalizedText(reducedMotion ? (ui.enabled || "Enabled") : (ui.disabled || "Disabled"), language))),
      React.createElement("div", { key: "high-contrast", className: "settings-item" },
        React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.highContrast || (language === "ur" ? "ہائی کنٹراسٹ" : "High Contrast"), language)),
        React.createElement("button", { className: "grade-btn active", style: { width: 120 }, onClick: () => onHighContrastChange(!highContrast) }, renderLocalizedText(highContrast ? (ui.enabled || "Enabled") : (ui.disabled || "Disabled"), language))),
      React.createElement("div", { key: "focus-mode", className: "settings-item", style: { display: "block" } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 10 } },
          React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.focusMode || (language === "ur" ? "فوکس موڈ" : "Focus Mode"), language)),
          React.createElement("button", { className: "grade-btn active", style: { width: 120 }, onClick: () => onFocusModeChange(!focusMode) }, renderLocalizedText(focusMode ? (ui.enabled || "Enabled") : (ui.disabled || "Disabled"), language))),
        React.createElement("div", { style: { marginTop: 8, color: "var(--text-muted)", fontSize: 12, lineHeight: 1.6 } }, renderLocalizedText(ui.focusModeHelp || (language === "ur" ? "ہوم اسکرین کی اضافی توجہ بٹانے والی چیزیں چھپا کر اصل مطالعہ سامنے رکھیں۔" : "Hide extra dashboard distractions so the main study path stays front and center."), language))),
      React.createElement("div", { key: "reading-mode", className: "settings-item", style: { display: "block" } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 10 } },
          React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.readingMode || (language === "ur" ? "ریڈنگ موڈ" : "Reading Mode"), language)),
          React.createElement("button", { className: "grade-btn active", style: { width: 120 }, onClick: () => onReadingModeChange(!readingMode) }, renderLocalizedText(readingMode ? (ui.enabled || "Enabled") : (ui.disabled || "Disabled"), language))),
        React.createElement("div", { style: { marginTop: 8, color: "var(--text-muted)", fontSize: 12, lineHeight: 1.6 } }, renderLocalizedText(ui.readingModeHelp || (language === "ur" ? "اسباق اور مطالعہ والی سطحوں کو زیادہ کھلا، پُرسکون اور آسان پڑھائی والا انداز دیں۔" : "Give lessons and reading surfaces a calmer, roomier layout with easier text flow."), language))),
      React.createElement("div", { key: "keyboard-shortcuts", className: "settings-item", style: { display: "block" } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 10 } },
          React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.keyboardShortcuts || (language === "ur" ? "کی بورڈ شارٹ کٹس" : "Keyboard Shortcuts"), language)),
          React.createElement("button", { className: "grade-btn active", style: { width: 120 }, onClick: () => onKeyboardShortcutsEnabledChange(!keyboardShortcutsEnabled) }, renderLocalizedText(keyboardShortcutsEnabled ? (ui.enabled || "Enabled") : (ui.disabled || "Disabled"), language))),
        React.createElement("div", { style: { marginTop: 8, color: "var(--text-muted)", fontSize: 12 } }, renderLocalizedText(ui.keyboardShortcutHelp || (language === "ur" ? "Alt + 1 تا 7 سے اہم ٹیبز کھولیں۔" : "Use Alt + 1 through 7 to jump to the main tabs."), language))),
    ];

    const srsChildren = [
      React.createElement("div", {
        key: "srs-help",
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
      }, renderLocalizedText(ui.srsSettingsHelp || (language === "ur" ? "یہ کنٹرول آئندہ ریویوز کے وقفے، مہارت کی حد، اور دوبارہ سیکھنے کے وقت کو بدلتے ہیں۔" : "These controls change future review spacing, mastery threshold, and relearn timing."), language)),
      React.createElement("div", { key: "srs-threshold", className: "settings-item", style: { display: "block" } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 10 } },
          React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.masteryThreshold || (language === "ur" ? "مہارت حد" : "Mastery Threshold"), language)),
          React.createElement("span", { className: "si-value" }, `Box ${reviewSrsSettings?.masteryThreshold || 5}`)),
        React.createElement("input", { type: "range", min: 3, max: 7, step: 1, value: reviewSrsSettings?.masteryThreshold || 5, onChange: (event) => onReviewSrsSettingChange("masteryThreshold", event.target.value), style: { width: "100%" } })),
      React.createElement("div", { key: "srs-scale", className: "settings-item", style: { display: "block" } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 10 } },
          React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.intervalScale || (language === "ur" ? "وقفہ پیمانہ" : "Interval Scale"), language)),
          React.createElement("span", { className: "si-value" }, `${Number(reviewSrsSettings?.intervalScale || 1).toFixed(2)}x`)),
        React.createElement("input", { type: "range", min: 0.5, max: 2.5, step: 0.05, value: Number(reviewSrsSettings?.intervalScale || 1), onChange: (event) => onReviewSrsSettingChange("intervalScale", event.target.value), style: { width: "100%" } })),
      React.createElement("div", { key: "srs-again", className: "settings-item", style: { display: "block" } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 10 } },
          React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.relearnDelay || (language === "ur" ? "دوبارہ سیکھنے کی تاخیر" : "Again Delay"), language)),
          React.createElement("span", { className: "si-value" }, renderLocalizedText(language === "ur" ? `${reviewSrsSettings?.againMinutes || 10} منٹ` : `${reviewSrsSettings?.againMinutes || 10} min`, language))),
        React.createElement("input", { type: "range", min: 5, max: 180, step: 5, value: reviewSrsSettings?.againMinutes || 10, onChange: (event) => onReviewSrsSettingChange("againMinutes", event.target.value), style: { width: "100%" } })),
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

    const timeChildren = [
      React.createElement("div", {
        key: "time-help",
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
      }, renderLocalizedText(ui.timeTrackingHelp || (language === "ur" ? "کلاس وقت، مطالعہ وقت، تاخیر، اور انعامات کو ایک ہی شیڈول سے ٹریک کریں۔" : "Track class timing, study minutes, lateness, and incentives from one schedule."), language)),
      React.createElement("div", { key: "class-track-enabled", className: "settings-item" },
        React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.classTracking || "Class Tracking", language)),
        React.createElement("button", { className: "grade-btn active", style: { width: 120 }, onClick: () => onClassScheduleChange("enabled", !classScheduleSettings?.enabled) }, renderLocalizedText(classScheduleSettings?.enabled ? (ui.enabled || "Enabled") : (ui.disabled || "Disabled"), language))),
      React.createElement("div", { key: "class-start", className: "settings-item", style: { display: "block" } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 10 } },
          React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.classStartTime || "Class Start Time", language)),
          React.createElement("input", {
            type: "time",
            value: classScheduleSettings?.startTime || "08:00",
            onChange: (event) => onClassScheduleChange("startTime", event.target.value || "08:00"),
            style: {
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--bg-elevated)",
              color: "var(--text-primary)",
              fontFamily: "var(--font)",
            },
          }))),
      React.createElement("div", { key: "class-end", className: "settings-item", style: { display: "block" } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 10 } },
          React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.classEndTime || "Class End Time", language)),
          React.createElement("input", {
            type: "time",
            value: classScheduleSettings?.endTime || "13:00",
            onChange: (event) => onClassScheduleChange("endTime", event.target.value || "13:00"),
            style: {
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--bg-elevated)",
              color: "var(--text-primary)",
              fontFamily: "var(--font)",
            },
          }))),
      React.createElement("div", { key: "class-summary", className: "settings-item", style: { display: "block" } },
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 10 } },
          React.createElement("div", { className: "notification-history-item", style: { marginBottom: 0 } },
            React.createElement("div", { className: "notification-history-top" },
              React.createElement("strong", null, renderLocalizedText(ui.classDuration || "Class Duration", language))),
            React.createElement("p", null, renderLocalizedText(language === "ur" ? `${classDurationMinutes} منٹ` : `${classDurationMinutes} min`, language))),
          React.createElement("div", { className: "notification-history-item", style: { marginBottom: 0 } },
            React.createElement("div", { className: "notification-history-top" },
              React.createElement("strong", null, renderLocalizedText(ui.timeSpentToday || "Time Spent Today", language))),
            React.createElement("p", null, renderLocalizedText(language === "ur" ? `${latestMinutesSpent} منٹ` : `${latestMinutesSpent} min`, language))),
          React.createElement("div", { className: "notification-history-item", style: { marginBottom: 0 } },
            React.createElement("div", { className: "notification-history-top" },
              React.createElement("strong", null, renderLocalizedText(ui.totalLateTime || "Total Late Time", language))),
            React.createElement("p", null, renderLocalizedText(language === "ur" ? `${timeTrackingData?.totalLateMinutes || 0} منٹ` : `${timeTrackingData?.totalLateMinutes || 0} min`, language))))),
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
    children.push(React.createElement(DisclosureSection, {
      key: "settings-app",
      title: joinLocalizedText("App, Navigation & Accessibility", "ایپ، نیویگیشن اور رسائی", language),
      language,
      transitionMode,
    },
      React.createElement(SettingsGroup, {
        key: "settings-group-experience",
        title: joinLocalizedText("App Status & Navigation", "ایپ حالت اور نیویگیشن", language),
        language,
      }, ...experienceChildren),
      React.createElement(SettingsGroup, {
        key: "settings-group-preferences",
        title: joinLocalizedText("Audio, Language & Display", "آڈیو، زبان اور دکھائی", language),
        language,
      }, ...preferencesChildren),
      React.createElement(SettingsGroup, {
        key: "settings-group-accessibility",
        title: joinLocalizedText("Comfort & Accessibility", "آسانی اور رسائی", language),
        language,
      }, ...accessibilityChildren),
    ));
    children.push(React.createElement(DisclosureSection, {
      key: "settings-ai",
      title: joinLocalizedText("AI Tutor", "اے آئی استاد", language),
      language,
      transitionMode,
    },
      React.createElement(SettingsGroup, {
        key: "settings-group-ai",
        title: joinLocalizedText("Connections & Meaning Lookup", "کنکشن اور معنی تلاش", language),
        language,
      }, ...aiChildren),
    ));
    children.push(React.createElement(DisclosureSection, {
      key: "settings-learning",
      title: joinLocalizedText("Learning & Review", "سیکھنا اور ریویو", language),
      language,
      transitionMode,
    },
      React.createElement(SettingsGroup, {
        key: "settings-group-pacing",
        title: joinLocalizedText("Day-Based English Pacing", "دنوں پر مبنی انگریزی رفتار", language),
        language,
      }, ...pacingChildren),
      React.createElement(SettingsGroup, {
        key: "settings-group-srs",
        title: joinLocalizedText("Review SRS Controls", "ریویو ایس آر ایس کنٹرول", language),
        language,
      }, ...srsChildren),
    ));
    children.push(React.createElement(DisclosureSection, {
      key: "settings-planning-time",
      title: joinLocalizedText("Planning, Time & Reminders", "منصوبہ بندی، وقت اور یاد دہانیاں", language),
      language,
      transitionMode,
    },
      React.createElement(SettingsGroup, {
        key: "settings-group-planning",
        title: joinLocalizedText("Goals & Study Planning", "اہداف اور مطالعہ منصوبہ بندی", language),
        language,
      }, ...planningChildren),
      React.createElement(SettingsGroup, {
        key: "settings-group-time",
        title: joinLocalizedText("Class Time Tracking", "کلاس وقت کی نگرانی", language),
        language,
      }, ...timeChildren),
      React.createElement(SettingsGroup, {
        key: "settings-group-notifications",
        title: joinLocalizedText("Notification History", "نوٹیفکیشن ہسٹری", language),
        language,
      }, ...notificationChildren),
    ));
    children.push(React.createElement(DisclosureSection, {
      key: "settings-data-backup",
      title: joinLocalizedText("Data, Backup & Reset", "ڈیٹا، بیک اپ اور ری سیٹ", language),
      language,
      transitionMode,
    },
      React.createElement(SettingsGroup, {
        key: "settings-group-data",
        title: joinLocalizedText("Updates & Progress Files", "اپ ڈیٹس اور پروگریس فائلیں", language),
        language,
      }, ...dataChildren),
      React.createElement(SettingsGroup, {
        key: "settings-group-user",
        title: joinLocalizedText("Storage & Reset", "اسٹوریج اور ری سیٹ", language),
        language,
      }, ...userDataChildren),
      React.createElement(SettingsGroup, {
        key: "settings-group-admin",
        title: joinLocalizedText("Backup & Admin Tools", "بیک اپ اور ایڈمن اوزار", language),
        language,
      }, ...adminChildren),
    ));

    return React.createElement("div", null, ...children);
  }

  window.HomeSchoolSettings = {
    SettingsPanel,
  };
})();
