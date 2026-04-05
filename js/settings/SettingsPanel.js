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

  const CONTENT_ROLE_PREVIEW_ORDER = ["student", "parent", "teacher", "editor", "admin"];
  const CONTENT_PERMISSION_KEYS = [
    "importChapters",
    "importSubjects",
    "exportContent",
    "chooseContentSource",
    "assignContent",
    "manageStudentLinks",
    "savePublishedLocally",
    "publishContent",
    "unpublishContent",
    "deleteLocalContent",
    "manageContentAccess",
  ];

  function normalizeContentPreviewRole(role) {
    const safeRole = String(role || "").trim().toLowerCase();
    return CONTENT_ROLE_PREVIEW_ORDER.includes(safeRole) ? safeRole : "student";
  }

  function getContentPreviewCapabilities(role) {
    const safeRole = normalizeContentPreviewRole(role);
    const matrix = {
      student: {
        importChapters: false,
        importSubjects: false,
        exportContent: false,
        chooseContentSource: false,
        assignContent: false,
        manageStudentLinks: false,
        savePublishedLocally: false,
        publishContent: false,
        unpublishContent: false,
        deleteLocalContent: false,
        manageContentAccess: false,
      },
      parent: {
        importChapters: false,
        importSubjects: false,
        exportContent: false,
        chooseContentSource: false,
        assignContent: false,
        manageStudentLinks: false,
        savePublishedLocally: false,
        publishContent: false,
        unpublishContent: false,
        deleteLocalContent: false,
        manageContentAccess: false,
      },
      teacher: {
        importChapters: true,
        importSubjects: false,
        exportContent: true,
        chooseContentSource: true,
        assignContent: true,
        manageStudentLinks: true,
        savePublishedLocally: true,
        publishContent: false,
        unpublishContent: false,
        deleteLocalContent: true,
        manageContentAccess: false,
      },
      editor: {
        importChapters: true,
        importSubjects: true,
        exportContent: true,
        chooseContentSource: true,
        assignContent: true,
        manageStudentLinks: true,
        savePublishedLocally: true,
        publishContent: true,
        unpublishContent: true,
        deleteLocalContent: true,
        manageContentAccess: false,
      },
      admin: {
        importChapters: true,
        importSubjects: true,
        exportContent: true,
        chooseContentSource: true,
        assignContent: true,
        manageStudentLinks: true,
        savePublishedLocally: true,
        publishContent: true,
        unpublishContent: true,
        deleteLocalContent: true,
        manageContentAccess: true,
      },
    };
    return matrix[safeRole] || matrix.student;
  }

  function normalizeContentPreviewOverride(raw) {
    const safe = {};
    CONTENT_PERMISSION_KEYS.forEach((key) => {
      if (raw && Object.prototype.hasOwnProperty.call(raw, key)) safe[key] = Boolean(raw[key]);
    });
    return safe;
  }

  function normalizeContentPreviewMatrix(raw) {
    return CONTENT_ROLE_PREVIEW_ORDER.reduce((acc, role) => {
      const merged = { ...getContentPreviewCapabilities(role), ...normalizeContentPreviewOverride(raw?.[role]) };
      if (role === "admin") merged.manageContentAccess = true;
      acc[role] = merged;
      return acc;
    }, {});
  }

  function getEffectiveContentPreviewCapabilities(role, matrix, override) {
    const safeRole = normalizeContentPreviewRole(role);
    const safeMatrix = normalizeContentPreviewMatrix(matrix || {});
    const merged = {
      ...(safeMatrix[safeRole] || safeMatrix.student),
      ...normalizeContentPreviewOverride(override),
    };
    if (safeRole === "admin") merged.manageContentAccess = true;
    return merged;
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
        placeholder: provider.keyPlaceholder || "",
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

  function DisclosureSection({ title, language, children, transitionMode, defaultOpen }) {
    const [open, setOpen] = React.useState(Boolean(defaultOpen));
    const childList = React.Children.toArray(children);

    React.useEffect(() => {
      if (defaultOpen) setOpen(true);
    }, [defaultOpen]);

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
          React.createElement("div", { className: "settings-disclosure-body" }, ...childList))));
  }

  function SettingsGroup({ title, language, children }) {
    const childList = React.Children.toArray(children);
    return React.createElement("div", {
      className: "settings-group-card",
      style: language === "ur"
        ? { direction: "rtl", textAlign: "right" }
        : null,
    },
      React.createElement("div", { className: "settings-group-title" }, renderLocalizedText(title, language)),
      React.createElement("div", { className: "settings-group-body" }, ...childList));
  }

  function normalizeSettingsSearchValue(value) {
    return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function matchesSettingsSearch(query, ...values) {
    if (!query) return true;
    const flattenedValues = values.reduce((all, value) => {
      if (Array.isArray(value)) return all.concat(value);
      all.push(value);
      return all;
    }, []);
    const haystack = flattenedValues
      .map((value) => normalizeSettingsSearchValue(value))
      .filter(Boolean)
      .join(" ");
    return haystack.includes(query);
  }

  function renderDictionaryConflictCard(record, language, ui, onResolveDictionaryConflict) {
    return React.createElement("div", {
      key: record.id,
      style: {
        padding: "12px 14px",
        borderRadius: 12,
        border: "1px solid var(--border)",
        background: "var(--bg-panel)",
        marginBottom: 10,
      },
    },
    React.createElement("div", {
      style: {
        color: "var(--text-primary)",
        fontSize: 13,
        fontWeight: 700,
        marginBottom: 8,
      },
    }, record.word || record.normalizedWord),
    React.createElement("div", {
      style: {
        color: "var(--text-secondary)",
        fontSize: 12,
        lineHeight: 1.6,
        marginBottom: 6,
        fontFamily: "var(--font-ur)",
        direction: "rtl",
        textAlign: "right",
      },
    },
    React.createElement("strong", null, renderLocalizedText(ui.localMeaning || (language === "ur" ? "مقامی" : "Local"), language)),
    " : ",
    (record.localEntry?.meaningsUr || []).slice(0, 3).join("، ") || record.localEntry?.meaningUr || "—"),
    React.createElement("div", {
      style: {
        color: "var(--text-secondary)",
        fontSize: 12,
        lineHeight: 1.6,
        marginBottom: 10,
        fontFamily: "var(--font-ur)",
        direction: "rtl",
        textAlign: "right",
      },
    },
    React.createElement("strong", null, renderLocalizedText(ui.syncedMeaning || (language === "ur" ? "سنک شدہ" : "Synced"), language)),
    " : ",
    (record.remoteEntry?.meaningsUr || []).slice(0, 3).join("، ") || record.remoteEntry?.meaningUr || "—"),
    React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } },
      React.createElement("button", { type: "button", className: "ghost-cta", onClick: () => onResolveDictionaryConflict && onResolveDictionaryConflict(record.normalizedWord, "local") }, renderLocalizedText(ui.keepLocal || (language === "ur" ? "مقامی رکھیں" : "Keep Local"), language)),
      React.createElement("button", { type: "button", className: "ghost-cta", onClick: () => onResolveDictionaryConflict && onResolveDictionaryConflict(record.normalizedWord, "remote") }, renderLocalizedText(ui.keepSynced || (language === "ur" ? "سنک شدہ رکھیں" : "Keep Synced"), language)),
      React.createElement("button", { type: "button", className: "study-tool-btn", onClick: () => onResolveDictionaryConflict && onResolveDictionaryConflict(record.normalizedWord, "merge") }, renderLocalizedText(ui.mergeBoth || (language === "ur" ? "دونوں ضم کریں" : "Merge Both"), language))));
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
      dictionaryStats,
      supabaseDictionarySync,
      dictionarySyncConflicts,
      cloudSyncConflicts,
      supabaseAuthBusy,
      supabaseSyncBusy,
      supabaseSyncStatusLabel,
      supabaseSyncActivity,
      supabaseAccountStatusLabel,
      supabaseSyncUserEmail,
      supabaseAccountRoleLabel,
      activeProfileRoleLabel,
      supabaseAccountPassword,
      supabaseAccountUsername,
      supabasePendingEmail,
      supabasePasswordVisible,
      activeStudentProfileLabel,
      contentManagerRoleLabel,
      contentAccessState,
      contentAccessBusy,
      contentRoleTestMode,
      contentRoleDraftEmail,
      contentRoleDraftRole,
      versionInfo,
      onCheckUpdates,
      onRefreshData,
      onExportProgress,
      onImportProgress,
      onExportDictionary,
      onImportDictionary,
      onImportDictionaryFromUrl,
      onSupabaseDictionarySyncChange,
      onSupabaseAccountPasswordChange,
      onSupabaseAccountUsernameChange,
      onSupabasePendingEmailChange,
      onSupabaseSendMagicLink,
      onSupabasePasswordSignIn,
      onSupabaseCreateAccount,
      onSupabasePasswordReset,
      onSupabaseSaveUsername,
      onSupabaseChangeEmail,
      onSupabaseTogglePasswordVisibility,
      onSupabaseRefreshSession,
      onSupabaseTestConnection,
      onSupabaseSyncNow,
      onSupabaseCopySql,
      onSupabaseSignOut,
      onContentRoleDraftEmailChange,
      onContentRoleDraftRoleChange,
      onContentDefaultRoleChange,
      onContentRolePermissionToggle,
      onContentRoleAssignmentPermissionToggle,
      onContentRoleAssignmentOverrideClear,
      onContentRoleTestModeChange,
      onSaveContentRoleAssignment,
      onDeleteContentRoleAssignment,
      onResolveDictionaryConflict,
      onResolveCloudSyncConflict,
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
      autoMoveNext,
      onAutoMoveNextChange,
      wordMeaningPriority,
      onWordMeaningPriorityChange,
      ttsRate,
      onTtsRateChange,
      englishVoiceOptions,
      urduVoiceOptions,
      ttsVoiceSelections,
      onTtsVoiceSelectionChange,
      onPreviewTtsVoice,
      dictionaryImportUrl,
      onDictionaryImportUrlChange,
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
      practiceTimedSettings,
      onPracticeTimedSettingChange,
      quizTimingSettings,
      onQuizTimingSettingChange,
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
    const [settingsSearch, setSettingsSearch] = React.useState("");
    const [contentRolePreview, setContentRolePreview] = React.useState("student");
    const normalizedSettingsSearch = normalizeSettingsSearchValue(settingsSearch);
    const selectStyle = {
      padding: "10px 12px",
      borderRadius: 10,
      border: "1px solid var(--border)",
      background: "var(--bg-elevated)",
      color: "var(--text-primary)",
      fontFamily: language === "ur" || language === "bilingual" ? "var(--font-ur)" : "var(--font)",
    };
    const compactNumberInputStyle = {
      ...selectStyle,
      width: 96,
      textAlign: "center",
      fontWeight: 700,
    };
    const voiceFieldRowStyle = {
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexWrap: "wrap",
    };
    React.useEffect(() => {
      const nextRole = normalizeContentPreviewRole(contentAccessState?.currentRole || contentAccessState?.defaultRole || "student");
      setContentRolePreview(nextRole);
    }, [contentAccessState?.currentRole, contentAccessState?.defaultRole]);
    const voicePreviewButtonStyle = {
      width: 42,
      height: 42,
      borderRadius: 12,
      border: "1px solid var(--border)",
      background: "var(--bg-elevated)",
      color: "var(--accent)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      boxShadow: "var(--shadow-xs)",
      flex: "0 0 auto",
      fontSize: 14,
      fontWeight: 800,
      transition: "transform 0.2s ease, background 0.2s ease, border-color 0.2s ease",
    };
    const classDurationMinutes = Math.max(0, ((Number((classScheduleSettings?.endTime || "13:00").split(":")[0]) || 0) * 60 + (Number((classScheduleSettings?.endTime || "13:00").split(":")[1]) || 0)) - ((Number((classScheduleSettings?.startTime || "08:00").split(":")[0]) || 0) * 60 + (Number((classScheduleSettings?.startTime || "08:00").split(":")[1]) || 0)));
    const latestTimeEntry = Array.isArray(timeTrackingData?.history) ? timeTrackingData.history[0] : null;
    const latestMinutesSpent = Math.round((latestTimeEntry?.msSpent || 0) / 60000);
    const syncSummary = supabaseSyncActivity && typeof supabaseSyncActivity === "object" ? supabaseSyncActivity : {};
    const pendingCloudDatasets = Object.entries(syncSummary.pendingCloudDatasets || {}).filter(([, count]) => Number(count) > 0);
    const contentAssignments = Array.isArray(contentAccessState?.assignments) ? contentAccessState.assignments : [];
    const contentDefaultRole = String(contentAccessState?.defaultRole || "student").trim().toLowerCase() || "student";
    const contentCurrentRole = String(contentAccessState?.currentRole || "student").trim().toLowerCase() || "student";
    const contentRoleMatrix = normalizeContentPreviewMatrix(contentAccessState?.rolePermissions || {});
    const contentCurrentCapabilities = getEffectiveContentPreviewCapabilities(
      contentCurrentRole,
      contentRoleMatrix,
      contentAccessState?.currentPermissionsOverride || {},
    );
    const canManageContentAccess = Boolean(contentCurrentCapabilities.manageContentAccess);
    const previewRole = normalizeContentPreviewRole(contentRolePreview || contentCurrentRole || contentDefaultRole || "student");
    const previewCapabilities = contentRoleMatrix[previewRole] || contentRoleMatrix.student;
    const contentRoleOptions = [
      {
        id: "student",
        label: joinLocalizedText("Student", "طالب علم", language),
        capabilities: joinLocalizedText("View and use allowed content.", "اجازت یافتہ مواد دیکھ اور استعمال کر سکتا ہے۔", language),
      },
      {
        id: "parent",
        label: joinLocalizedText("Parent", "والدین", language),
        capabilities: joinLocalizedText("Parent-facing access based on admin permissions.", "ایڈمن کی مقررہ اجازتوں کے مطابق والدین کی رسائی۔", language),
      },
      {
        id: "teacher",
        label: joinLocalizedText("Teacher", "استاد", language),
        capabilities: joinLocalizedText("Teacher tools can be enabled or restricted by admin.", "استاد کے اوزار ایڈمن کے مطابق فعال یا محدود کیے جا سکتے ہیں۔", language),
      },
      {
        id: "editor",
        label: joinLocalizedText("Editor", "ایڈیٹر", language),
        capabilities: joinLocalizedText("Publishing and import tools based on admin matrix.", "اشاعت اور درآمد کے اوزار ایڈمن کی میٹرکس کے مطابق۔", language),
      },
      {
        id: "admin",
        label: joinLocalizedText("Admin", "ایڈمن", language),
        capabilities: joinLocalizedText("Can always manage content access and permission rules.", "مواد کی رسائی اور اجازت کے قواعد ہمیشہ سنبھال سکتا ہے۔", language),
      },
    ];
    const contentRolePreviewLabel = (contentRoleOptions.find((option) => option.id === normalizeContentPreviewRole(contentRoleTestMode?.role)) || contentRoleOptions[0]).label;
    const contentPermissionItems = [
      { key: "importChapters", label: joinLocalizedText("Import chapters", "ابواب درآمد", language) },
      { key: "importSubjects", label: joinLocalizedText("Import whole subjects", "پورے مضامین درآمد", language) },
      { key: "exportContent", label: joinLocalizedText("Export content", "مواد برآمد", language) },
      { key: "chooseContentSource", label: joinLocalizedText("Choose active chapter copy", "فعال باب کی کاپی منتخب کریں", language) },
      { key: "assignContent", label: joinLocalizedText("Assign chapters", "ابواب تفویض کریں", language) },
      { key: "manageStudentLinks", label: joinLocalizedText("Manage teacher-student links", "استاد اور طالب علم روابط سنبھالیں", language) },
      { key: "savePublishedLocally", label: joinLocalizedText("Save published locally", "شائع شدہ مقامی محفوظ", language) },
      { key: "publishContent", label: joinLocalizedText("Publish chapters", "ابواب شائع", language) },
      { key: "unpublishContent", label: joinLocalizedText("Unpublish own chapters", "اپنے ابواب غیر شائع", language) },
      { key: "deleteLocalContent", label: joinLocalizedText("Delete local drafts", "مقامی مسودے حذف", language) },
      { key: "manageContentAccess", label: joinLocalizedText("Manage content access", "مواد کی رسائی سنبھالنا", language) },
    ];
    const summarizeContentCapabilities = (capabilities) => {
      const enabledLabels = contentPermissionItems
        .filter((item) => Boolean(capabilities?.[item.key]))
        .slice(0, 3)
        .map((item) => item.label);
      if (!enabledLabels.length) {
        return renderLocalizedText(joinLocalizedText("No elevated content actions enabled.", "کوئی اضافی مواد والے اختیار فعال نہیں۔", language), language);
      }
      return renderLocalizedText(enabledLabels.join(" • "), language);
    };
    const contentAccessSummaryCard = React.createElement("div", {
      key: "content-access-summary",
      style: {
        padding: "12px 14px",
        borderRadius: 12,
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        marginBottom: 10,
      },
    },
    React.createElement("div", { style: { color: "var(--text-primary)", fontSize: 13, fontWeight: 700, marginBottom: 10 } }, renderLocalizedText(language === "ur" ? "Content Access & Publishing" : "Content Access & Publishing", language)),
    React.createElement("div", { className: "settings-item" },
      React.createElement("span", { className: "si-label" }, renderLocalizedText(language === "ur" ? "Your content role" : "Your content role", language)),
      React.createElement("span", { className: "si-value" }, renderLocalizedText(contentManagerRoleLabel || "Student", language))),
    React.createElement("div", { className: "settings-item" },
      React.createElement("span", { className: "si-label" }, renderLocalizedText(language === "ur" ? "Default new-user role" : "Default new-user role", language)),
      React.createElement("span", { className: "si-value" }, renderLocalizedText((contentRoleOptions.find((option) => option.id === contentDefaultRole) || contentRoleOptions[0]).label, language))),
    React.createElement("div", {
      className: "settings-compact-grid",
      style: {
        marginTop: 10,
        gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
        gap: 10,
      },
    },
    ...contentRoleOptions.map((option) => React.createElement("div", {
      key: `content-role-card-${option.id}`,
      className: "settings-compact-card",
      style: {
        height: 124,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        gap: 6,
        borderColor: option.id === contentCurrentRole ? "var(--accent)" : "var(--border)",
        boxShadow: option.id === contentCurrentRole ? "0 0 0 1px color-mix(in srgb, var(--accent) 35%, transparent)" : "none",
      },
    },
      React.createElement("div", { style: { color: "var(--text-primary)", fontSize: 13, fontWeight: 700, marginBottom: 6 } }, renderLocalizedText(option.label, language)),
      React.createElement("div", {
        style: {
          color: "var(--text-muted)",
          fontSize: 12,
          lineHeight: 1.6,
          fontFamily: language === "ur" ? "var(--font-ur)" : "var(--font)",
          direction: language === "ur" ? "rtl" : "ltr",
          textAlign: language === "ur" ? "right" : "left",
        },
      },
      React.createElement("div", { style: { marginBottom: 4 } }, renderLocalizedText(option.capabilities, language)),
      React.createElement("div", { style: { color: "var(--text-secondary)", fontSize: 11 } }, summarizeContentCapabilities(contentRoleMatrix[option.id])))))));
    const contentAccessPreviewItems = [
      { key: "importChapters", label: joinLocalizedText("Import chapters", "ابواب درآمد", language) },
      { key: "importSubjects", label: joinLocalizedText("Import whole subjects", "مکمل مضامین درآمد", language) },
      { key: "exportContent", label: joinLocalizedText("Export chapters and subjects", "ابواب اور مضامین برآمد", language) },
      { key: "chooseContentSource", label: joinLocalizedText("Choose active chapter copy", "فعال باب کی کاپی منتخب کریں", language) },
      { key: "assignContent", label: joinLocalizedText("Assign chapters by grade or student", "جماعت یا طالب علم کے لحاظ سے ابواب تفویض کریں", language) },
      { key: "manageStudentLinks", label: joinLocalizedText("Manage teacher-student links", "استاد اور طالب علم کے روابط سنبھالیں", language) },
      { key: "savePublishedLocally", label: joinLocalizedText("Save published copies locally", "شائع شدہ کاپیاں مقامی طور پر محفوظ", language) },
      { key: "publishContent", label: joinLocalizedText("Publish chapters", "ابواب شائع", language) },
      { key: "unpublishContent", label: joinLocalizedText("Unpublish own chapters", "اپنے ابواب غیر شائع", language) },
      { key: "deleteLocalContent", label: joinLocalizedText("Delete local drafts", "مقامی مسودے حذف", language) },
      { key: "manageContentAccess", label: joinLocalizedText("Manage content roles", "مواد کے کردار سنبھالنا", language) },
    ];
    const contentAccessPreviewCard = canManageContentAccess ? React.createElement("div", {
      key: "content-access-preview",
      style: {
        padding: "12px 14px",
        borderRadius: 12,
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        marginBottom: 10,
      },
    },
    React.createElement("div", { style: { color: "var(--text-primary)", fontSize: 13, fontWeight: 700, marginBottom: 10 } }, renderLocalizedText(language === "ur" ? "Admin Test Mode" : "Admin Test Mode", language)),
    React.createElement("div", {
      style: {
        color: "var(--text-muted)",
        fontSize: 12,
        lineHeight: 1.6,
        marginBottom: 10,
        fontFamily: language === "ur" ? "var(--font-ur)" : "var(--font)",
        direction: language === "ur" ? "rtl" : "ltr",
        textAlign: language === "ur" ? "right" : "left",
      },
    }, renderLocalizedText(language === "ur" ? "نیچے کردار منتخب کریں اور Test Mode شروع کریں۔ اس کے بعد پورا ایپ اسی کردار کی طرح برتاؤ کرے گا، مگر اصل اکاؤنٹ کی تفویض تبدیل نہیں ہوگی۔" : "Pick a role below and start Test Mode. The whole app will behave like that role until you stop testing, without changing the real assignment.", language)),
    React.createElement("div", { className: "settings-item" },
      React.createElement("span", { className: "si-label" }, renderLocalizedText(language === "ur" ? "Current test state" : "Current test state", language)),
      React.createElement("span", { className: "si-value" }, renderLocalizedText(contentRoleTestMode?.enabled ? joinLocalizedText(`Testing as ${contentRolePreviewLabel}`, `ٹیسٹ موڈ: ${contentRolePreviewLabel}`, language) : joinLocalizedText("Off", "بند", language), language))),
    React.createElement("div", {
      className: "settings-compact-grid",
      style: {
        gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
        gap: 10,
        marginBottom: 10,
      },
    },
    ...contentRoleOptions.map((option) => {
      const selected = option.id === previewRole;
      return React.createElement("button", {
        key: `content-preview-role-${option.id}`,
        type: "button",
        className: selected ? "study-tool-btn" : "ghost-cta",
        onClick: () => setContentRolePreview(option.id),
        style: {
          width: "100%",
          minHeight: 46,
          fontFamily: language === "ur" ? "var(--font-ur)" : "var(--font)",
        },
      }, renderLocalizedText(option.label, language));
    })),
    React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 } },
      React.createElement("button", {
        type: "button",
        className: "study-tool-btn",
        onClick: () => onContentRoleTestModeChange && onContentRoleTestModeChange(previewRole, true),
      }, renderLocalizedText(language === "ur" ? "Test Mode شروع کریں" : "Start Test Mode", language)),
      React.createElement("button", {
        type: "button",
        className: "ghost-cta",
        onClick: () => onContentRoleTestModeChange && onContentRoleTestModeChange(previewRole, false),
      }, renderLocalizedText(language === "ur" ? "Test Mode بند کریں" : "Stop Test Mode", language))),
    React.createElement("div", {
      className: "settings-compact-grid",
      style: {
        gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
        gap: 10,
      },
    },
    ...contentAccessPreviewItems.map((item) => {
      const allowed = Boolean(previewCapabilities[item.key]);
      return React.createElement("div", {
        key: `content-preview-capability-${item.key}`,
        className: "settings-compact-card",
        style: {
          minHeight: 72,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          gap: 8,
          borderColor: allowed ? "color-mix(in srgb, var(--success) 55%, var(--border))" : "color-mix(in srgb, var(--danger) 45%, var(--border))",
          background: allowed
            ? "color-mix(in srgb, var(--success) 12%, var(--bg-elevated))"
            : "color-mix(in srgb, var(--danger) 10%, var(--bg-elevated))",
        },
      },
      React.createElement("div", {
        style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        },
      },
      React.createElement("strong", {
        style: {
          color: "var(--text-primary)",
          fontSize: 13,
          fontFamily: language === "ur" ? "var(--font-ur)" : "var(--font)",
        },
      }, renderLocalizedText(item.label, language)),
      React.createElement("span", {
        className: "discovery-tag muted",
        style: {
          background: allowed ? "color-mix(in srgb, var(--success) 16%, transparent)" : "color-mix(in srgb, var(--danger) 16%, transparent)",
          color: allowed ? "var(--success)" : "var(--danger)",
          borderColor: allowed ? "color-mix(in srgb, var(--success) 35%, transparent)" : "color-mix(in srgb, var(--danger) 35%, transparent)",
        },
      }, renderLocalizedText(allowed ? (language === "ur" ? "اجازت" : "Allowed") : (language === "ur" ? "بلاک" : "Blocked"), language))),
      React.createElement("div", {
        style: {
          color: "var(--text-muted)",
          fontSize: 12,
          lineHeight: 1.5,
          fontFamily: language === "ur" ? "var(--font-ur)" : "var(--font)",
          direction: language === "ur" ? "rtl" : "ltr",
          textAlign: language === "ur" ? "right" : "left",
        },
      }, renderLocalizedText(allowed ? (language === "ur" ? "یہ اختیار اس کردار کے لیے دستیاب ہوگا۔" : "This action would be available for the selected role.") : (language === "ur" ? "یہ اختیار اس کردار کے لیے دستیاب نہیں ہوگا۔" : "This action would stay unavailable for the selected role."), language)));
    }))) : null;
    const contentAccessAdminCard = canManageContentAccess ? React.createElement("div", {
      key: "content-access-admin",
      style: {
        padding: "12px 14px",
        borderRadius: 12,
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        marginBottom: 10,
      },
    },
    React.createElement("div", { style: { color: "var(--text-primary)", fontSize: 13, fontWeight: 700, marginBottom: 10 } }, renderLocalizedText(language === "ur" ? "Admin Content Controls" : "Admin Content Controls", language)),
    React.createElement("div", { style: { marginBottom: 10 } },
      React.createElement("label", { className: "settings-input-label" }, renderLocalizedText(language === "ur" ? "Default role for new accounts" : "Default role for new accounts", language)),
      React.createElement("select", {
        value: contentDefaultRole,
        onChange: (event) => onContentDefaultRoleChange && onContentDefaultRoleChange(event.target.value),
        style: selectStyle,
        disabled: contentAccessBusy,
      }, ...contentRoleOptions.map((option) => React.createElement("option", { key: `default-content-role-${option.id}`, value: option.id }, renderLocalizedText(option.label, language))))),
    React.createElement("div", { style: { marginBottom: 10 } },
      React.createElement("label", { className: "settings-input-label" }, renderLocalizedText(language === "ur" ? "Assign a role by email" : "Assign a role by email", language)),
      React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" } },
        React.createElement("input", {
          className: "settings-text-input",
          type: "email",
          value: contentRoleDraftEmail || "",
          onChange: (event) => onContentRoleDraftEmailChange && onContentRoleDraftEmailChange(event.target.value),
          placeholder: language === "ur" ? "مثلاً editor@example.com" : "For example: editor@example.com",
          dir: "ltr",
          spellCheck: false,
          style: { flex: "1 1 240px", marginBottom: 0 },
        }),
        React.createElement("select", {
          value: contentRoleDraftRole || "student",
          onChange: (event) => onContentRoleDraftRoleChange && onContentRoleDraftRoleChange(event.target.value),
          style: { ...selectStyle, flex: "0 0 150px" },
          disabled: contentAccessBusy,
        }, ...contentRoleOptions.map((option) => React.createElement("option", { key: `draft-content-role-${option.id}`, value: option.id }, renderLocalizedText(option.label, language)))),
        React.createElement("button", {
          type: "button",
          className: "study-tool-btn",
          onClick: () => onSaveContentRoleAssignment && onSaveContentRoleAssignment(),
          disabled: contentAccessBusy,
        }, renderLocalizedText(contentAccessBusy ? (language === "ur" ? "محفوظ ہو رہا ہے..." : "Saving...") : (language === "ur" ? "کردار محفوظ کریں" : "Save Role"), language)))),
    React.createElement("div", {
      style: {
        color: "var(--text-muted)",
        fontSize: 12,
        lineHeight: 1.6,
        marginBottom: 10,
        fontFamily: language === "ur" ? "var(--font-ur)" : "var(--font)",
        direction: language === "ur" ? "rtl" : "ltr",
        textAlign: language === "ur" ? "right" : "left",
      },
    }, renderLocalizedText(language === "ur" ? "یہ کنٹرول طے کرتے ہیں کہ کون باب درآمد، مضمون درآمد، شائع، غیر شائع، یا مقامی مسودے حذف کر سکتا ہے۔" : "These controls decide who can import chapters, import subjects, publish, unpublish, or delete local drafts.", language)),
    React.createElement("div", {
      style: {
        color: "var(--text-primary)",
        fontSize: 13,
        fontWeight: 700,
        marginBottom: 10,
      },
    }, renderLocalizedText(language === "ur" ? "Role Permission Matrix" : "Role Permission Matrix", language)),
    React.createElement("div", {
      className: "settings-compact-grid",
      style: {
        gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
        gap: 10,
        marginBottom: 10,
      },
    },
    ...contentRoleOptions.map((option) => React.createElement("div", {
      key: `content-role-matrix-${option.id}`,
      className: "settings-compact-card",
      style: {
        minHeight: 220,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      },
    },
    React.createElement("strong", {
      style: {
        color: "var(--text-primary)",
        fontSize: 13,
        fontFamily: language === "ur" ? "var(--font-ur)" : "var(--font)",
      },
    }, renderLocalizedText(option.label, language)),
    React.createElement("div", {
      style: {
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
      },
    },
    ...contentPermissionItems.map((permission) => {
      const allowed = Boolean(contentRoleMatrix[option.id]?.[permission.key]);
      const locked = option.id === "admin" && permission.key === "manageContentAccess";
      return React.createElement("button", {
        key: `role-permission-${option.id}-${permission.key}`,
        type: "button",
        className: allowed ? "study-tool-btn" : "ghost-cta",
        onClick: () => !locked && onContentRolePermissionToggle && onContentRolePermissionToggle(option.id, permission.key, !allowed),
        disabled: contentAccessBusy || locked,
        style: {
          opacity: locked ? 0.72 : 1,
        },
      }, renderLocalizedText(permission.label, language));
    }))))),
    ...(contentAssignments.length
      ? contentAssignments.map((assignment) => React.createElement("div", {
        key: `content-assignment-${assignment.email}`,
        className: "settings-group-card",
        style: { marginBottom: 10 },
      },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 8 } },
          React.createElement("strong", { style: { color: "var(--text-primary)", direction: "ltr" } }, String(assignment.email || "")),
          React.createElement("span", { className: "discovery-tag muted" }, renderLocalizedText((contentRoleOptions.find((option) => option.id === String(assignment.role || "").trim().toLowerCase()) || contentRoleOptions[0]).label, language))),
        React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } },
          ...contentRoleOptions.map((option) => React.createElement("button", {
            key: `assignment-${assignment.email}-${option.id}`,
            type: "button",
            className: option.id === String(assignment.role || "").trim().toLowerCase() ? "study-tool-btn" : "ghost-cta",
            onClick: () => onSaveContentRoleAssignment && onSaveContentRoleAssignment(assignment.email, option.id),
            disabled: contentAccessBusy,
          }, renderLocalizedText(option.label, language))),
          React.createElement("button", {
            type: "button",
            className: "ghost-cta",
            onClick: () => onDeleteContentRoleAssignment && onDeleteContentRoleAssignment(assignment.email),
            disabled: contentAccessBusy,
          }, renderLocalizedText(language === "ur" ? "ہٹائیں" : "Remove", language))),
        React.createElement("div", {
          style: {
            color: "var(--text-secondary)",
            fontSize: 12,
            marginBottom: 8,
            fontFamily: language === "ur" ? "var(--font-ur)" : "var(--font)",
            direction: language === "ur" ? "rtl" : "ltr",
            textAlign: language === "ur" ? "right" : "left",
          },
        }, renderLocalizedText(language === "ur" ? "اس صارف کے لیے مخصوص اجازتیں" : "Per-user permission overrides", language)),
        React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 } },
          ...contentPermissionItems.map((permission) => {
            const baseValue = Boolean(contentRoleMatrix[normalizeContentPreviewRole(assignment.role)]?.[permission.key]);
            const overrideMap = normalizeContentPreviewOverride(assignment.permissions_override);
            const hasOverride = Object.prototype.hasOwnProperty.call(overrideMap, permission.key);
            const effectiveValue = hasOverride ? Boolean(overrideMap[permission.key]) : baseValue;
            const locked = normalizeContentPreviewRole(assignment.role) === "admin" && permission.key === "manageContentAccess";
            return React.createElement("button", {
              key: `assignment-override-${assignment.email}-${permission.key}`,
              type: "button",
              className: effectiveValue ? "study-tool-btn" : "ghost-cta",
              onClick: () => !locked && onContentRoleAssignmentPermissionToggle && onContentRoleAssignmentPermissionToggle(assignment.email, permission.key, !effectiveValue),
              disabled: contentAccessBusy || locked,
              style: {
                opacity: locked ? 0.72 : 1,
                boxShadow: hasOverride ? "0 0 0 1px color-mix(in srgb, var(--accent) 28%, transparent)" : "none",
              },
            }, renderLocalizedText(permission.label, language));
          })),
        React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } },
          React.createElement("button", {
            type: "button",
            className: "ghost-cta",
            onClick: () => onContentRoleAssignmentOverrideClear && onContentRoleAssignmentOverrideClear(assignment.email),
            disabled: contentAccessBusy,
          }, renderLocalizedText(language === "ur" ? "اووررائیڈ صاف کریں" : "Clear Overrides", language)))))
      : [React.createElement("div", {
        key: "content-assignment-empty",
        className: "empty-state",
        style: { marginTop: 8 },
      }, renderLocalizedText(language === "ur" ? "ابھی کوئی مخصوص موادی کردار تفویض نہیں کیا گیا۔" : "No explicit content role assignments yet.", language))])) : null;
    const contentAccessNoteCard = canManageContentAccess ? null : React.createElement("div", {
      key: "content-access-note",
      style: {
        marginBottom: 10,
        padding: "10px 12px",
        borderRadius: 10,
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        color: "var(--text-muted)",
        fontSize: 12,
        lineHeight: 1.6,
        fontFamily: language === "ur" ? "var(--font-ur)" : "var(--font)",
        direction: language === "ur" ? "rtl" : "ltr",
        textAlign: language === "ur" ? "right" : "left",
      },
    }, renderLocalizedText(language === "ur" ? "مواد درآمد اور اشاعت کے اختیارات صرف ایڈمن تبدیل کر سکتے ہیں۔ اگر آپ کو یہ اختیارات چاہییں تو ایڈمن سے Editor یا Admin رسائی مانگیں۔" : "Only admins can change content import and publishing rights. If you need these tools, ask an admin for Editor or Admin access.", language));

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

    const accountChildren = [
      React.createElement("div", {
        key: "account-help",
        style: {
          padding: "12px 14px",
          borderRadius: 12,
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          marginBottom: 10,
          color: "var(--text-secondary)",
          fontSize: 12,
          lineHeight: 1.6,
          fontFamily: language === "ur" ? "var(--font-ur)" : "var(--font)",
          direction: language === "ur" ? "rtl" : "ltr",
          textAlign: language === "ur" ? "right" : "left",
        },
      }, renderLocalizedText(language === "ur"
        ? "ہر طالب علم کے لیے ایک الگ کلاؤڈ اکاؤنٹ رکھیں تاکہ مختلف ڈیوائسز پر پروگریس، لغت، اور مستقبل کے سنک کیے گئے ریکارڈ واضح رہیں۔"
          : "Use one cloud account for your family or learner, then separate progress cleanly with student profiles inside the app.", language)),
      React.createElement("div", {
        key: "account-summary",
        style: {
          padding: "12px 14px",
          borderRadius: 12,
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          marginBottom: 10,
        },
      },
        React.createElement("div", { className: "settings-item" },
          React.createElement("span", { className: "si-label" }, renderLocalizedText(language === "ur" ? "Account Username" : "Account Username", language)),
          React.createElement("span", { className: "si-value", style: { direction: "ltr" } }, supabaseAccountUsername || "—")),
        React.createElement("div", { className: "settings-item" },
          React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.connectedUser || (language === "ur" ? "Connected User" : "Connected User"), language)),
          React.createElement("span", { className: "si-value", style: { maxWidth: 220, textAlign: language === "ur" ? "right" : "left", direction: "ltr" } }, supabaseSyncUserEmail || "—")),
        React.createElement("div", { className: "settings-item" },
          React.createElement("span", { className: "si-label" }, renderLocalizedText(language === "ur" ? "Active Student Profile" : "Active Student Profile", language)),
          React.createElement("span", { className: "si-value" }, renderLocalizedText(activeStudentProfileLabel || "—", language))),
        React.createElement("div", { className: "settings-item" },
          React.createElement("span", { className: "si-label" }, renderLocalizedText(language === "ur" ? "Cloud Role" : "Cloud Role", language)),
          React.createElement("span", { className: "si-value" }, renderLocalizedText(supabaseAccountRoleLabel || "Student", language))),
        React.createElement("div", { className: "settings-item" },
          React.createElement("span", { className: "si-label" }, renderLocalizedText(language === "ur" ? "Content Access Role" : "Content Access Role", language)),
          React.createElement("span", { className: "si-value" }, renderLocalizedText(contentManagerRoleLabel || "Student", language)))),
      contentAccessSummaryCard,
      contentAccessAdminCard,
      contentAccessPreviewCard,
      contentAccessNoteCard,
      React.createElement("div", { style: { marginBottom: 10 } },
        React.createElement("label", { className: "settings-input-label" }, renderLocalizedText(ui.supabaseUrl || (language === "ur" ? "Supabase URL" : "Supabase URL"), language)),
        React.createElement("input", {
          className: "settings-text-input",
          type: "url",
          value: supabaseDictionarySync?.url || "",
          onChange: (event) => onSupabaseDictionarySyncChange("url", event.target.value),
          placeholder: "https://your-project.supabase.co",
          dir: "ltr",
          spellCheck: false,
        })),
      React.createElement("div", { style: { marginBottom: 10 } },
        React.createElement("label", { className: "settings-input-label" }, renderLocalizedText(ui.supabaseAnonKey || (language === "ur" ? "Publishable Key" : "Publishable Key"), language)),
        React.createElement("input", {
          className: "settings-text-input",
          type: "password",
          value: supabaseDictionarySync?.anonKey || "",
          onChange: (event) => onSupabaseDictionarySyncChange("anonKey", event.target.value),
          placeholder: language === "ur" ? "اپنی publishable key درج کریں" : "Paste your publishable key",
          dir: "ltr",
          spellCheck: false,
        })),
      React.createElement("div", { style: { marginBottom: 10 } },
        React.createElement("label", { className: "settings-input-label" }, renderLocalizedText(language === "ur" ? "Account Username" : "Account Username", language)),
        React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center" } },
          React.createElement("input", {
            className: "settings-text-input",
            type: "text",
            value: supabaseAccountUsername || "",
            onChange: (event) => onSupabaseAccountUsernameChange(event.target.value),
            placeholder: language === "ur" ? "مثلاً ali-grade5" : "For example: ali-grade5",
            dir: "ltr",
            spellCheck: false,
            style: { marginBottom: 0 },
          }),
          React.createElement("button", {
            type: "button",
            className: "ghost-cta",
            onClick: onSupabaseSaveUsername,
            disabled: supabaseAuthBusy,
          }, renderLocalizedText(language === "ur" ? "Save" : "Save", language)))),
      React.createElement("div", { style: { marginBottom: 10 } },
        React.createElement("label", { className: "settings-input-label" }, renderLocalizedText(ui.syncEmail || (language === "ur" ? "Account Email" : "Account Email"), language)),
        React.createElement("input", {
          className: "settings-text-input",
          type: "email",
          value: supabasePendingEmail || supabaseDictionarySync?.authEmail || "",
          onChange: (event) => onSupabasePendingEmailChange(event.target.value),
          placeholder: language === "ur" ? "وہ ای میل درج کریں جس سے سائن اِن کرنا ہے" : "Enter the email you want to sign in with",
          dir: "ltr",
          spellCheck: false,
        })),
      React.createElement("div", { style: { marginBottom: 10 } },
        React.createElement("label", { className: "settings-input-label" }, renderLocalizedText(language === "ur" ? "Password" : "Password", language)),
        React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center" } },
          React.createElement("input", {
            className: "settings-text-input",
            type: supabasePasswordVisible ? "text" : "password",
            value: supabaseAccountPassword || "",
            onChange: (event) => onSupabaseAccountPasswordChange(event.target.value),
            placeholder: language === "ur" ? "پاس ورڈ درج کریں" : "Enter password",
            dir: "ltr",
            spellCheck: false,
            style: { marginBottom: 0 },
          }),
          React.createElement("button", {
            type: "button",
            className: "ghost-cta",
            onClick: onSupabaseTogglePasswordVisibility,
          }, renderLocalizedText(supabasePasswordVisible ? (language === "ur" ? "Hide" : "Hide") : (language === "ur" ? "Show" : "Show"), language)))),
      React.createElement("div", { className: "settings-item" },
        React.createElement("span", { className: "si-label" }, renderLocalizedText(language === "ur" ? "Account Status" : "Account Status", language)),
        React.createElement("span", { className: "si-value", style: { maxWidth: 240, textAlign: language === "ur" ? "right" : "left" } }, renderLocalizedText(supabaseAccountStatusLabel || "—", language))),
      React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 8 } },
        React.createElement("button", {
          type: "button",
          className: "ghost-cta",
          onClick: onSupabaseSendMagicLink,
          disabled: supabaseAuthBusy,
        }, renderLocalizedText(ui.sendMagicLink || (language === "ur" ? "Magic Link بھیجیں" : "Send Magic Link"), language)),
        React.createElement("button", {
          type: "button",
          className: "ghost-cta",
          onClick: onSupabasePasswordSignIn,
          disabled: supabaseAuthBusy,
        }, renderLocalizedText(language === "ur" ? "Password Sign In" : "Password Sign In", language)),
        React.createElement("button", {
          type: "button",
          className: "ghost-cta",
          onClick: onSupabaseCreateAccount,
          disabled: supabaseAuthBusy,
        }, renderLocalizedText(language === "ur" ? "Create Account" : "Create Account", language)),
        React.createElement("button", {
          type: "button",
          className: "ghost-cta",
          onClick: onSupabasePasswordReset,
          disabled: supabaseAuthBusy,
        }, renderLocalizedText(language === "ur" ? "Reset Password" : "Reset Password", language)),
        React.createElement("button", {
          type: "button",
          className: "ghost-cta",
          onClick: onSupabaseChangeEmail,
          disabled: supabaseAuthBusy,
        }, renderLocalizedText(language === "ur" ? "Change Email" : "Change Email", language)),
        React.createElement("button", {
          type: "button",
          className: "ghost-cta",
          onClick: onSupabaseRefreshSession,
          disabled: supabaseAuthBusy,
        }, renderLocalizedText(language === "ur" ? "Refresh Session" : "Refresh Session", language)),
        React.createElement("button", {
          type: "button",
          className: "study-tool-btn",
          onClick: onSupabaseSignOut,
          disabled: supabaseAuthBusy,
        }, renderLocalizedText(ui.signOut || (language === "ur" ? "سائن آؤٹ" : "Sign Out"), language))),
      React.createElement("div", {
        style: {
          color: "var(--text-muted)",
          fontSize: 12,
          lineHeight: 1.6,
          fontFamily: language === "ur" ? "var(--font-ur)" : "var(--font)",
          direction: language === "ur" ? "rtl" : "ltr",
          textAlign: language === "ur" ? "right" : "left",
        },
      }, renderLocalizedText(language === "ur"
        ? "Magic link ہلکی لاگ اِن کے لیے اچھا ہے۔ Password sign-in، reset، اور change email بہتر بازیافت دیتے ہیں۔ Account username آپ کی شناخت کو صرف ای میل سے بہتر بناتا ہے، جبکہ طالب علم پروفائل الگ الگ پروگریس رکھتے ہیں۔"
        : "Magic link is great for light sign-in. Password sign-in, reset, and change-email give better recovery. An account username gives you a cleaner identity than email alone, while student profiles keep progress separated on shared devices.", language)),
      React.createElement("div", {
        style: {
          marginTop: 8,
          padding: "10px 12px",
          borderRadius: 10,
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          color: "var(--text-muted)",
          fontSize: 12,
          lineHeight: 1.55,
          fontFamily: language === "ur" ? "var(--font-ur)" : "var(--font)",
          direction: language === "ur" ? "rtl" : "ltr",
          textAlign: language === "ur" ? "right" : "left",
        },
      }, renderLocalizedText(language === "ur"
        ? "Validation checklist: ایک ڈیوائس پر سیٹنگ بدلیں، ایک پسندیدہ یا نوٹ شامل کریں، ایک review مکمل کریں، پھر دونوں ڈیوائسز پر Sync Now چلائیں اور دیکھیں کہ فعال طالب علم پروفائل میں سب کچھ صحیح آتا ہے۔"
        : "Validation checklist: change a setting on one device, add a favorite or note, complete one review item, then run Sync Now on both devices and confirm everything lands under the active student profile.", language)),
      React.createElement("div", {
        key: "account-sync-scope",
        style: {
          marginTop: 8,
          padding: "10px 12px",
          borderRadius: 10,
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          color: "var(--text-muted)",
          fontSize: 12,
          lineHeight: 1.55,
          fontFamily: language === "ur" ? "var(--font-ur)" : "var(--font)",
          direction: language === "ur" ? "rtl" : "ltr",
          textAlign: language === "ur" ? "right" : "left",
        },
      },
      React.createElement("strong", { style: { color: "var(--text-primary)", display: "block", marginBottom: 6 } }, renderLocalizedText(language === "ur" ? "Cloud sync covers" : "Cloud sync covers", language)),
      renderLocalizedText(language === "ur"
        ? `فعال کردار: ${activeProfileRoleLabel || "طالب علم"}۔ اس وقت سنک میں لغت، پسندیدہ/نوٹس، اپنی فہرستیں، سبق/ریویو پیش رفت، اور منتخب ترجیحات شامل ہیں۔`
        : `Active role: ${activeProfileRoleLabel || "Student"}. Sync currently covers dictionary, favorites/notes, custom lists, lesson/review progress, and selected preferences.`, language)),
      ...(Array.isArray(cloudSyncConflicts) && cloudSyncConflicts.length > 0 ? [React.createElement("div", {
        key: "account-cloud-conflicts",
        style: {
          marginTop: 10,
          paddingTop: 10,
          borderTop: "1px solid var(--border)",
        },
      },
      React.createElement("div", {
        style: {
          color: "var(--text-primary)",
          fontSize: 13,
          fontWeight: 700,
          marginBottom: 8,
        },
      }, renderLocalizedText(language === "ur" ? "Cloud Sync Review" : "Cloud Sync Review", language)),
      React.createElement("div", {
        style: {
          color: "var(--text-muted)",
          fontSize: 12,
          lineHeight: 1.6,
          marginBottom: 10,
        },
      }, renderLocalizedText(language === "ur" ? "صرف وہی ڈیٹا یہاں دکھایا جاتا ہے جہاں مقامی اور سنک شدہ تبدیلیاں واقعی ٹکرا رہی ہوں۔" : "Only real overlaps are shown here, where local and synced copies changed in different ways.", language)),
      ...(cloudSyncConflicts || []).slice(-6).reverse().map((record) => React.createElement("div", {
        key: `cloud_conflict_${record.id}`,
        className: "settings-group-card",
        style: { marginTop: 10 },
      },
      React.createElement("div", { style: { color: "var(--text-primary)", fontSize: 13, fontWeight: 700, marginBottom: 6 } }, record.title || record.dataset || "Cloud row"),
      React.createElement("div", { style: { color: "var(--text-secondary)", fontSize: 12, lineHeight: 1.5, marginBottom: 8 } }, renderLocalizedText(language === "ur" ? "مناسب حل منتخب کریں: مقامی رکھیں، سنک شدہ رکھیں، یا دونوں ضم کریں۔" : "Choose the cleanest outcome: keep local, keep synced, or merge both.", language)),
      React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } },
        React.createElement("button", { type: "button", className: "ghost-cta", onClick: () => onResolveCloudSyncConflict && onResolveCloudSyncConflict(record.id, "local") }, renderLocalizedText(language === "ur" ? "لوکل رکھیں" : "Keep Local", language)),
        React.createElement("button", { type: "button", className: "ghost-cta", onClick: () => onResolveCloudSyncConflict && onResolveCloudSyncConflict(record.id, "remote") }, renderLocalizedText(language === "ur" ? "سنک شدہ رکھیں" : "Keep Synced", language)),
        React.createElement("button", { type: "button", className: "study-tool-btn", onClick: () => onResolveCloudSyncConflict && onResolveCloudSyncConflict(record.id, "merge") }, renderLocalizedText(language === "ur" ? "دونوں ضم کریں" : "Merge Both", language))))))] : []),
    ];

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
          value: wordMeaningPriority || "local-cache-ai",
          onChange: (event) => onWordMeaningPriorityChange(event.target.value),
          style: selectStyle,
        },
          React.createElement("option", { value: "local-cache-ai" }, renderLocalizedText(language === "ur" ? "مقامی → کیش → اے آئی" : "Local -> Cache -> AI", language)),
          React.createElement("option", { value: "cache-local-ai" }, renderLocalizedText(language === "ur" ? "کیش → مقامی → اے آئی" : "Cache -> Local -> AI", language)),
          React.createElement("option", { value: "ai-cache-local" }, renderLocalizedText(language === "ur" ? "اے آئی → کیش → مقامی" : "AI -> Cache -> Local", language)),
          React.createElement("option", { value: "ai-local-cache" }, renderLocalizedText(language === "ur" ? "اے آئی → مقامی → کیش" : "AI -> Local -> Cache", language)))),
      React.createElement("div", { style: { color: "var(--text-muted)", fontSize: 12, lineHeight: 1.6, fontFamily: language === "ur" ? "var(--font-ur)" : "var(--font)", direction: language === "ur" ? "rtl" : "ltr", textAlign: language === "ur" ? "right" : "left" } },
        renderLocalizedText(ui.meaningLookupPriorityHelp || (language === "ur" ? "منتخب کریں کہ معنی کس ترتیب سے تلاش ہوں۔ اے آئی مرحلہ صرف ایک منتخب یا محفوظ فراہم کنندہ استعمال کرے گا۔" : "Choose the meaning lookup order. The AI step uses only one selected or saved provider."), language)))),
    aiChildren.push(React.createElement("div", {
      key: "dictionary-hub",
      style: {
        padding: "12px 14px",
        borderRadius: 12,
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        marginBottom: 10,
      },
    },
      React.createElement("div", { style: { color: "var(--text-primary)", fontSize: 13, fontWeight: 700, marginBottom: 10 } }, renderLocalizedText(ui.localDictionary || (language === "ur" ? "مقامی لغت" : "Local Dictionary"), language)),
      React.createElement("div", { className: "settings-item" },
        React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.dictionaryTotal || (language === "ur" ? "کل اندراجات" : "Total Entries"), language)),
        React.createElement("span", { className: "si-value" }, String(Number(dictionaryStats?.total || 0)))),
      React.createElement("div", { className: "settings-item" },
        React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.dictionaryCurriculum || (language === "ur" ? "کریکولم سے" : "From Curriculum"), language)),
        React.createElement("span", { className: "si-value" }, String(Number(dictionaryStats?.curriculum || 0)))),
      React.createElement("div", { className: "settings-item" },
        React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.dictionaryLearned || (language === "ur" ? "محفوظ/سیکھے گئے" : "Saved / Learned"), language)),
        React.createElement("span", { className: "si-value" }, String(Number(dictionaryStats?.learned || 0)))),
      React.createElement("div", { className: "settings-item" },
        React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.dictionaryImported || (language === "ur" ? "درآمد شدہ" : "Imported"), language)),
        React.createElement("span", { className: "si-value" }, String(Number(dictionaryStats?.imported || 0)))),
      React.createElement("div", { className: "settings-item" },
        React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.dictionaryAiEnriched || (language === "ur" ? "اے آئی سے بہتر" : "AI Enriched"), language)),
        React.createElement("span", { className: "si-value" }, String(Number(dictionaryStats?.ai || 0)))),
      React.createElement("div", { className: "settings-item" },
        React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.dictionaryBilingual || (language === "ur" ? "دو لسانی اندراجات" : "Bilingual Entries"), language)),
        React.createElement("span", { className: "si-value" }, String(Number(dictionaryStats?.bilingual || 0)))),
      actionButton(renderLocalizedText(ui.exportDictionary || (language === "ur" ? "لغت برآمد کریں" : "Export Dictionary"), language), onExportDictionary, "#22C55E", { key: "dictionary-export" }),
      React.createElement("label", {
        key: "dictionary-import-file",
        style: {
          display: "block",
          width: "100%",
          padding: "12px",
          borderRadius: 10,
          border: "1px solid var(--border)",
          background: "var(--bg-panel)",
          color: "var(--text-primary)",
          fontFamily: language === "ur" ? "var(--font-ur)" : "'Baloo 2',sans-serif",
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
          marginBottom: 8,
          textAlign: "center",
        },
      }, renderLocalizedText(ui.importDictionary || (language === "ur" ? "فائل سے لغت درآمد کریں" : "Import Dictionary from File"), language),
      React.createElement("input", {
        type: "file",
        accept: ".json,application/json",
        style: { display: "none" },
        onChange: onImportDictionary,
      })),
      React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 } },
        React.createElement("input", {
          type: "url",
          value: dictionaryImportUrl || "",
          onChange: (event) => onDictionaryImportUrlChange(event.target.value),
          placeholder: language === "ur" ? "لغت کا لنک درج کریں" : "Paste dictionary link",
          style: {
            flex: "1 1 220px",
            minWidth: 220,
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "var(--bg-panel)",
            color: "var(--text-primary)",
            fontFamily: language === "ur" ? "var(--font-ur)" : "var(--font)",
            direction: "ltr",
          },
        }),
        React.createElement("button", {
          type: "button",
          className: "grade-btn active",
          style: { minWidth: 132, flex: "0 0 auto" },
          onClick: onImportDictionaryFromUrl,
        }, renderLocalizedText(ui.importDictionaryLink || (language === "ur" ? "لنک سے درآمد کریں" : "Import Link"), language))),
      React.createElement("div", {
        style: {
          color: "var(--text-muted)",
          fontSize: 12,
          lineHeight: 1.6,
          fontFamily: language === "ur" ? "var(--font-ur)" : "var(--font)",
          direction: language === "ur" ? "rtl" : "ltr",
          textAlign: language === "ur" ? "right" : "left",
        },
      }, renderLocalizedText(ui.dictionaryHelp || (language === "ur" ? "یہ لغت ہر نئے لفظ کے ساتھ بڑھتی رہتی ہے۔ کریکولم، درآمد شدہ فائلوں اور اے آئی سے بہتر شدہ معانی ایک ہی مقامی لغت میں ضم ہوتے ہیں۔" : "This dictionary keeps growing as students look up new words. Curriculum meanings, imported files, and AI-enriched results merge into one local dictionary."), language))));
    const dictionaryConflictChildren = Array.isArray(dictionarySyncConflicts) && dictionarySyncConflicts.length > 0
      ? [React.createElement("div", {
        key: "dictionary-conflicts-wrap",
        style: {
          marginTop: 12,
          paddingTop: 12,
          borderTop: "1px solid var(--border)",
        },
      },
      React.createElement("div", {
        style: {
          color: "var(--text-primary)",
          fontSize: 13,
          fontWeight: 700,
          marginBottom: 10,
        },
      }, renderLocalizedText(ui.dictionaryConflicts || (language === "ur" ? "Dictionary Conflicts" : "Dictionary Conflicts"), language)),
      React.createElement("div", {
        style: {
          color: "var(--text-muted)",
          fontSize: 12,
          lineHeight: 1.6,
          marginBottom: 10,
          fontFamily: language === "ur" ? "var(--font-ur)" : "var(--font)",
          direction: language === "ur" ? "rtl" : "ltr",
          textAlign: language === "ur" ? "right" : "left",
        },
      }, renderLocalizedText(ui.dictionaryConflictsHelp || (language === "ur" ? "اگر ایک ہی لفظ کو دو مختلف ڈیوائسز پر مختلف انداز میں بہتر کیا گیا ہو تو یہاں فیصلہ کریں۔" : "Review rare cases where the same word was enriched differently on two devices."), language)),
      ...dictionarySyncConflicts.slice(0, 8).map((record) => renderDictionaryConflictCard(record, language, ui, onResolveDictionaryConflict)))]
      : [];
    const accountSyncCard = React.createElement("div", {
      key: "dictionary-sync",
      style: {
        padding: "12px 14px",
        borderRadius: 12,
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        marginBottom: 10,
      },
    },
      React.createElement("div", { style: { color: "var(--text-primary)", fontSize: 13, fontWeight: 700, marginBottom: 10 } }, renderLocalizedText(ui.dictionarySync || (language === "ur" ? "Supabase Cloud Sync" : "Supabase Cloud Sync"), language)),
      React.createElement("div", { className: "settings-item" },
        React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.dictionarySyncEnabled || (language === "ur" ? "Cloud Sync" : "Cloud Sync"), language)),
        React.createElement("button", {
          className: "grade-btn active",
          style: { width: 120 },
          onClick: () => onSupabaseDictionarySyncChange("enabled", !supabaseDictionarySync?.enabled),
        }, renderLocalizedText((supabaseDictionarySync?.enabled ? (ui.enabled || "Enabled") : (ui.disabled || "Disabled")), language))),
      React.createElement("div", { className: "settings-item" },
        React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.autoSync || (language === "ur" ? "خودکار سنک" : "Auto Sync"), language)),
        React.createElement("button", {
          className: "grade-btn active",
          style: { width: 120 },
          onClick: () => onSupabaseDictionarySyncChange("autoSync", !(supabaseDictionarySync?.autoSync !== false)),
        }, renderLocalizedText(((supabaseDictionarySync?.autoSync !== false) ? (ui.enabled || "Enabled") : (ui.disabled || "Disabled")), language))),
      React.createElement("div", { className: "settings-item" },
        React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.realtimeSync || (language === "ur" ? "Realtime Sync" : "Realtime Sync"), language)),
        React.createElement("button", {
          className: "grade-btn active",
          style: { width: 120 },
          onClick: () => onSupabaseDictionarySyncChange("realtimeEnabled", !supabaseDictionarySync?.realtimeEnabled),
        }, renderLocalizedText((supabaseDictionarySync?.realtimeEnabled ? (ui.enabled || "Enabled") : (ui.disabled || "Disabled")), language))),
      React.createElement("div", { className: "settings-item" },
        React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.syncStatus || (language === "ur" ? "Sync Status" : "Sync Status"), language)),
        React.createElement("span", { className: "si-value", style: { maxWidth: 240, textAlign: language === "ur" ? "right" : "left" } }, renderLocalizedText(supabaseSyncStatusLabel || (language === "ur" ? "ابھی تک منسلک نہیں" : "Not connected yet"), language))),
      React.createElement("div", {
        style: {
          padding: "12px 14px",
          borderRadius: 12,
          border: "1px solid var(--border)",
          background: "var(--bg-elevated)",
          marginBottom: 10,
        },
      },
      React.createElement("div", { style: { color: "var(--text-primary)", fontSize: 13, fontWeight: 700, marginBottom: 8 } }, renderLocalizedText(language === "ur" ? "Sync Activity" : "Sync Activity", language)),
      React.createElement("div", { className: "settings-compact-grid", style: { gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 10 } },
        React.createElement("div", { className: "settings-compact-card", style: { minHeight: 86, display: "flex", flexDirection: "column", justifyContent: "flex-start", gap: 6 } },
          React.createElement("div", { style: { color: "var(--text-muted)", fontSize: 11, marginBottom: 4 } }, renderLocalizedText(language === "ur" ? "Pending local rows" : "Pending local rows", language)),
          React.createElement("strong", { style: { color: "var(--text-primary)", fontSize: 16 } }, `${Number(syncSummary.dictionaryPendingCount || 0) + Number(syncSummary.cloudPendingCount || 0)}`)),
        React.createElement("div", { className: "settings-compact-card", style: { minHeight: 86, display: "flex", flexDirection: "column", justifyContent: "flex-start", gap: 6 } },
          React.createElement("div", { style: { color: "var(--text-muted)", fontSize: 11, marginBottom: 4 } }, renderLocalizedText(language === "ur" ? "Last push" : "Last push", language)),
          React.createElement("strong", { style: { color: "var(--text-primary)", fontSize: 14 } }, (syncSummary.lastCloudPushAt || syncSummary.lastDictionaryPushAt) ? new Date(Math.max(Number(syncSummary.lastCloudPushAt) || 0, Number(syncSummary.lastDictionaryPushAt) || 0)).toLocaleString() : renderLocalizedText(language === "ur" ? "ابھی نہیں" : "Not yet", language))),
        React.createElement("div", { className: "settings-compact-card", style: { minHeight: 86, display: "flex", flexDirection: "column", justifyContent: "flex-start", gap: 6 } },
          React.createElement("div", { style: { color: "var(--text-muted)", fontSize: 11, marginBottom: 4 } }, renderLocalizedText(language === "ur" ? "Last pull" : "Last pull", language)),
          React.createElement("strong", { style: { color: "var(--text-primary)", fontSize: 14 } }, (syncSummary.lastCloudPullAt || syncSummary.lastDictionaryPullAt) ? new Date(Math.max(Number(syncSummary.lastCloudPullAt) || 0, Number(syncSummary.lastDictionaryPullAt) || 0)).toLocaleString() : renderLocalizedText(language === "ur" ? "ابھی نہیں" : "Not yet", language)))),
      pendingCloudDatasets.length ? React.createElement("div", { style: { marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" } },
        ...pendingCloudDatasets.slice(0, 6).map(([dataset, count]) => React.createElement("span", { key: `sync_dataset_${dataset}`, className: "discovery-tag muted" }, `${dataset} • ${count}`))) : null,
      syncSummary.lastErrorMessage ? React.createElement("div", { style: { marginTop: 10, color: "var(--danger)", fontSize: 12, lineHeight: 1.6 } }, renderLocalizedText(`${language === "ur" ? "آخری مسئلہ" : "Last issue"}: ${syncSummary.lastErrorMessage}`, language)) : null),
      React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 8 } },
        React.createElement("button", {
          type: "button",
          className: "ghost-cta",
          onClick: onSupabaseTestConnection,
          disabled: supabaseSyncBusy,
        }, renderLocalizedText(ui.testConnection || (language === "ur" ? "کنکشن ٹیسٹ" : "Test Connection"), language)),
        React.createElement("button", {
          type: "button",
          className: "ghost-cta",
          onClick: onSupabaseSyncNow,
          disabled: supabaseSyncBusy,
        }, renderLocalizedText(ui.syncNow || (language === "ur" ? "ابھی سنک کریں" : "Sync Now"), language)),
        React.createElement("button", {
          type: "button",
          className: "ghost-cta",
          onClick: onSupabaseCopySql,
        }, renderLocalizedText(ui.copySqlHelper || (language === "ur" ? "Setup SQL کاپی کریں" : "Copy Setup SQL"), language)),
        React.createElement("button", {
          type: "button",
          className: "study-tool-btn",
          onClick: onSupabaseRefreshSession,
          disabled: supabaseAuthBusy,
        }, renderLocalizedText(language === "ur" ? "Session دیکھیں" : "Refresh Session", language))),
      React.createElement("div", {
        style: {
          color: "var(--text-muted)",
          fontSize: 12,
          lineHeight: 1.6,
          fontFamily: language === "ur" ? "var(--font-ur)" : "var(--font)",
          direction: language === "ur" ? "rtl" : "ltr",
          textAlign: language === "ur" ? "right" : "left",
        },
      }, renderLocalizedText(ui.supabaseSyncHelp || (language === "ur"
        ? "یہ لغت، پسندیدہ/نوٹس/فہرستیں، ریویو پیش رفت، اور منتخب سیٹنگز کو sync کرتا ہے۔ اکاؤنٹ لاگ اِن اور بازیافت Account سیکشن میں سنبھالی جاتی ہے۔ Supabase میں dictionary_entries اور user_data_rows ٹیبل درکار ہوں گی۔"
        : "This syncs dictionary data, favorites/notes/lists, review progress, and selected preferences. Account sign-in and recovery live in the Account section. You will need both dictionary_entries and user_data_rows tables in Supabase."), language)),
      ...dictionaryConflictChildren);
    accountChildren.push(accountSyncCard);
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
      React.createElement("div", { key: "automove-next", className: "settings-item", style: { display: "block" } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 10 } },
          React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.autoMoveNext || (language === "ur" ? "اگلا خودکار بڑھائیں" : "Auto-Move Next"), language)),
          React.createElement("button", { className: "grade-btn active", style: { width: 120 }, onClick: () => onAutoMoveNextChange(!autoMoveNext) }, renderLocalizedText(autoMoveNext ? (ui.enabled || "Enabled") : (ui.disabled || "Disabled"), language))),
        React.createElement("div", { style: { marginTop: 8, color: "var(--text-muted)", fontSize: 12, lineHeight: 1.6 } }, renderLocalizedText(ui.autoMoveNextHelp || (language === "ur" ? "جواب جانچنے کے بعد خودکار طور پر اگلے پریکٹس کارڈ پر جائیں۔" : "Automatically move to the next practice card after an answer is checked."), language))),
      React.createElement("div", { key: "tts-speed", className: "settings-item", style: { display: "block" } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 10 } },
          React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.ttsSpeed || "Playback Speed", language)),
          React.createElement("span", { className: "si-value" }, `${Number(ttsRate || 0.85).toFixed(2)}x`)),
        React.createElement("input", { type: "range", min: 0.6, max: 1.3, step: 0.05, value: Number(ttsRate || 0.85), onChange: (event) => onTtsRateChange(Number(event.target.value) || 0.85), style: { width: "100%" } })),
      React.createElement("div", { key: "voice-en", className: "settings-item", style: { display: "block" } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 10 } },
          React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.englishVoice || "English Voice", language)),
          React.createElement("div", { style: voiceFieldRowStyle },
            React.createElement("select", { value: ttsVoiceSelections?.en || "", onChange: (event) => onTtsVoiceSelectionChange("en", event.target.value), style: Object.assign({}, selectStyle, { minWidth: 220, fontFamily: "var(--font)", flex: "1 1 220px" }) },
              React.createElement("option", { value: "" }, renderLocalizedText(ui.voiceAuto || "Auto", language)),
              ...(Array.isArray(englishVoiceOptions) ? englishVoiceOptions : []).map((voice) => React.createElement("option", { key: voice.voiceURI || voice.name, value: voice.voiceURI || voice.name }, `${voice.name} (${voice.lang})`))),
            React.createElement("button", {
              type: "button",
              onClick: () => onPreviewTtsVoice && onPreviewTtsVoice("en"),
              title: joinLocalizedText("Play selected English voice", "منتخب انگریزی آواز سنیں", language),
              style: voicePreviewButtonStyle,
            }, "▶"))),
        React.createElement("div", { style: { marginTop: 8, color: "var(--text-muted)", fontSize: 12 } }, renderLocalizedText(ui.voiceAutoHelp || "Auto chooses the best supported browser voice.", language))),
      React.createElement("div", { key: "voice-ur", className: "settings-item", style: { display: "block" } },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 10 } },
          React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.urduVoice || "Urdu Voice", language)),
          React.createElement("div", { style: voiceFieldRowStyle },
            React.createElement("select", { value: ttsVoiceSelections?.ur || "", onChange: (event) => onTtsVoiceSelectionChange("ur", event.target.value), style: Object.assign({}, selectStyle, { minWidth: 220, flex: "1 1 220px" }) },
              React.createElement("option", { value: "" }, renderLocalizedText(ui.voiceAuto || "Auto", language)),
              ...(Array.isArray(urduVoiceOptions) ? urduVoiceOptions : []).map((voice) => React.createElement("option", { key: voice.voiceURI || voice.name, value: voice.voiceURI || voice.name }, `${voice.name} (${voice.lang})`))),
            React.createElement("button", {
              type: "button",
              onClick: () => onPreviewTtsVoice && onPreviewTtsVoice("ur"),
              title: joinLocalizedText("Play selected Urdu voice", "منتخب اردو آواز سنیں", language),
              style: voicePreviewButtonStyle,
            }, "▶"))),
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

    const timingChildren = [
      React.createElement("div", {
        key: "timing-help",
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
      }, renderLocalizedText(
        ui.practiceTimingHelp || (language === "ur"
          ? "پریکٹس اور سبجیکٹ کوئز کے وقت یہاں سے سیٹ کریں۔ ہر موڈ اپنی الگ مدت استعمال کرے گا۔"
          : "Set Practice Lab and subject-quiz timings here. Each mode uses its own saved timing."),
        language,
      )),
      ...[
        ["timedchallenge", joinLocalizedText("Timed Challenge", "وقت والی چیلنج", language), 60],
        ["timedquiz", joinLocalizedText("Timed Quiz", "وقت والی کوئز", language), 30],
        ["timedtruefalse", joinLocalizedText("Timed True / False", "وقت والی درست / غلط", language), 30],
        ["timedmatching", joinLocalizedText("Timed Match Pairs", "وقت والی جوڑیاں", language), 30],
      ].map(([modeId, label, fallback]) => React.createElement("div", {
        key: `practice-timer-${modeId}`,
        className: "settings-item",
      },
        React.createElement("span", { className: "si-label" }, renderLocalizedText(label, language)),
        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" } },
          React.createElement("input", {
            type: "number",
            min: 10,
            max: 180,
            step: 5,
            value: Number(practiceTimedSettings?.[modeId] || fallback),
            onChange: (event) => onPracticeTimedSettingChange(modeId, event.target.value),
            style: compactNumberInputStyle,
          }),
          React.createElement("span", { className: "si-value" }, renderLocalizedText(language === "ur" ? "سیکنڈ" : "sec", language))))),
      React.createElement("div", {
        key: "quiz-question-seconds",
        className: "settings-item",
      },
        React.createElement("span", { className: "si-label" }, renderLocalizedText(joinLocalizedText("Subject quiz time per question", "سبجیکٹ کوئز میں فی سوال وقت", language), language)),
        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" } },
          React.createElement("input", {
            type: "number",
            min: 5,
            max: 90,
            step: 1,
            value: Number(quizTimingSettings?.questionSeconds || 15),
            onChange: (event) => onQuizTimingSettingChange("questionSeconds", event.target.value),
            style: compactNumberInputStyle,
          }),
          React.createElement("span", { className: "si-value" }, renderLocalizedText(language === "ur" ? "سیکنڈ" : "sec", language)))),
      React.createElement("div", {
        key: "quiz-reflection-seconds",
        className: "settings-item",
      },
        React.createElement("span", { className: "si-label" }, renderLocalizedText(joinLocalizedText("Subject quiz reflection pause", "سبجیکٹ کوئز میں توقف", language), language)),
        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" } },
          React.createElement("input", {
            type: "number",
            min: 1,
            max: 10,
            step: 1,
            value: Number(quizTimingSettings?.reflectionSeconds || 2),
            onChange: (event) => onQuizTimingSettingChange("reflectionSeconds", event.target.value),
            style: compactNumberInputStyle,
          }),
          React.createElement("span", { className: "si-value" }, renderLocalizedText(language === "ur" ? "سیکنڈ" : "sec", language)))),
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
    const sectionEntries = [
      {
        key: "settings-app",
        title: joinLocalizedText("App, Navigation & Accessibility", "ایپ، نیویگیشن اور رسائی", language),
        tags: ["app", "navigation", "display", "theme", "font", "language", "audio", "tts", "voice", "contrast", "focus", "reading", "keyboard", "transition", "offline", "install"],
        groups: [
          { key: "settings-group-experience", title: joinLocalizedText("App Status & Navigation", "ایپ حالت اور نیویگیشن", language), tags: ["status", "navigation", "install", "offline", "network"], children: experienceChildren },
          { key: "settings-group-preferences", title: joinLocalizedText("Audio, Language & Display", "آڈیو، زبان اور دکھائی", language), tags: ["audio", "language", "display", "voice", "tts", "theme", "font"], children: preferencesChildren },
          { key: "settings-group-accessibility", title: joinLocalizedText("Comfort & Accessibility", "آسانی اور رسائی", language), tags: ["motion", "contrast", "focus", "reading", "keyboard"], children: accessibilityChildren },
        ],
      },
      {
        key: "settings-account",
        title: joinLocalizedText("Account & Cloud Sign-In", "اکاؤنٹ اور کلاؤڈ سائن اِن", language),
        tags: ["account", "supabase", "cloud", "sign in", "email", "password", "username", "sync", "sql", "setup sql", "copy sql", "test connection", "published chapter", "published chapters", "content", "publish", "permissions", "content role", "editor", "admin", "teacher", "student", "chapter access"],
        groups: [
          { key: "settings-group-account", title: joinLocalizedText("Supabase Account Identity", "Supabase اکاؤنٹ شناخت", language), tags: ["login", "email", "password", "username", "role", "roles", "parent", "editor", "teacher", "admin", "test mode", "permissions", "override", "access preview", "mock role", "cloud", "sql", "setup", "copy sql", "test connection", "sync now", "published chapter", "content"], children: accountChildren },
        ],
      },
      {
        key: "settings-ai",
        title: joinLocalizedText("AI Tutor", "اے آئی استاد", language),
        tags: ["ai", "provider", "api", "gemini", "openai", "meaning", "dictionary"],
        groups: [
          { key: "settings-group-ai", title: joinLocalizedText("Connections & Meaning Lookup", "کنکشن اور معنی تلاش", language), tags: ["ai", "provider", "meaning", "lookup", "dictionary"], children: aiChildren },
        ],
      },
      {
        key: "settings-learning",
        title: joinLocalizedText("Learning & Review", "سیکھنا اور ریویو", language),
        tags: ["review", "learning", "practice", "quiz", "timer", "timing", "srs", "daily cap"],
        groups: [
          { key: "settings-group-pacing", title: joinLocalizedText("Day-Based English Pacing", "دنوں پر مبنی انگریزی رفتار", language), tags: ["day", "english", "pacing", "lesson"], children: pacingChildren },
          { key: "settings-group-srs", title: joinLocalizedText("Review SRS Controls", "ریویو ایس آر ایس کنٹرول", language), tags: ["srs", "review", "again", "mastery", "interval"], children: srsChildren },
          { key: "settings-group-timers", title: joinLocalizedText("Practice & Quiz Timers", "پریکٹس اور کوئز ٹائمر", language), tags: ["practice", "quiz", "timer", "timed challenge", "timed quiz", "reflection"], children: timingChildren },
        ],
      },
      {
        key: "settings-planning-time",
        title: joinLocalizedText("Planning, Time & Reminders", "منصوبہ بندی، وقت اور یاد دہانیاں", language),
        tags: ["planning", "goal", "focus", "reminder", "class", "time", "notification"],
        groups: [
          { key: "settings-group-planning", title: joinLocalizedText("Goals & Study Planning", "اہداف اور مطالعہ منصوبہ بندی", language), tags: ["goal", "study", "focus"], children: planningChildren },
          { key: "settings-group-time", title: joinLocalizedText("Class Time Tracking", "کلاس وقت کی نگرانی", language), tags: ["class", "time", "tracking", "attendance", "late"], children: timeChildren },
          { key: "settings-group-notifications", title: joinLocalizedText("Notification History", "نوٹیفکیشن ہسٹری", language), tags: ["notification", "history", "reminder"], children: notificationChildren },
        ],
      },
      {
        key: "settings-data-backup",
        title: joinLocalizedText("Data, Backup & Reset", "ڈیٹا، بیک اپ اور ری سیٹ", language),
        tags: ["data", "backup", "export", "import", "reset", "storage", "refresh"],
        groups: [
          { key: "settings-group-data", title: joinLocalizedText("Updates & Progress Files", "اپ ڈیٹس اور پروگریس فائلیں", language), tags: ["update", "progress", "export", "import"], children: dataChildren },
          { key: "settings-group-user", title: joinLocalizedText("Storage & Reset", "اسٹوریج اور ری سیٹ", language), tags: ["storage", "reset", "progress"], children: userDataChildren },
          { key: "settings-group-admin", title: joinLocalizedText("Backup & Admin Tools", "بیک اپ اور ایڈمن اوزار", language), tags: ["backup", "admin", "review reset", "clear"], children: adminChildren },
        ],
      },
    ];

    const filteredSections = sectionEntries
      .map((section) => {
        const sectionMatches = matchesSettingsSearch(normalizedSettingsSearch, section.title, section.tags);
        const groups = (section.groups || []).filter((group) => sectionMatches || matchesSettingsSearch(normalizedSettingsSearch, group.title, group.tags));
        return { ...section, groups };
      })
      .filter((section) => section.groups.length > 0);

    const children = [
      React.createElement("div", { key: "settings-search-shell", className: "settings-search-shell" },
        React.createElement("label", { className: "settings-input-label" }, renderLocalizedText(ui.settingsSearch || (language === "ur" ? "سیٹنگ تلاش کریں" : "Find a setting"), language)),
        React.createElement("input", {
          className: "settings-text-input",
          type: "search",
          value: settingsSearch,
          placeholder: renderLocalizedText(ui.settingsSearchPlaceholder || (language === "ur" ? "مثلاً آواز، ٹائمر، تھیم، سنک" : "For example: voice, timer, theme, sync"), language),
          onChange: (event) => setSettingsSearch(event.target.value),
          style: language === "ur" ? { fontFamily: "var(--font-ur)", direction: "rtl", textAlign: "right" } : null,
        }),
        React.createElement("div", { className: "settings-search-meta" },
          normalizedSettingsSearch
            ? renderLocalizedText(language === "ur" ? `${filteredSections.length} حصے ملے` : `${filteredSections.length} sections found`, language)
            : renderLocalizedText(ui.settingsSearchHint || (language === "ur" ? "الفاظ لکھ کر متعلقہ سیٹنگز فلٹر کریں۔" : "Type keywords to filter the settings sections."), language))),
      ...(filteredSections.length > 0
        ? filteredSections.map((section) => React.createElement(DisclosureSection, {
          key: section.key,
          title: section.title,
          language,
          transitionMode,
          defaultOpen: Boolean(normalizedSettingsSearch),
        },
        ...(section.groups || []).map((group) => React.createElement(SettingsGroup, {
          key: group.key,
          title: group.title,
          language,
        }, ...(group.children || [])))))
        : [React.createElement("div", {
          key: "settings-search-empty",
          className: "empty-state",
          style: {
            padding: "18px 16px",
            borderRadius: 14,
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
          },
        }, renderLocalizedText(ui.settingsSearchEmpty || (language === "ur" ? "اس تلاش کے مطابق کوئی سیٹنگ نہیں ملی۔" : "No settings matched that search."), language))]),
    ];

    return React.createElement("div", null, ...children);
  }

  window.HomeSchoolSettings = {
    SettingsPanel,
  };
})();
