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

  function renderStorageValue(storageLabel, language) {
    if (typeof storageLabel !== "string") return storageLabel;
    const parts = storageLabel.split(" • ");
    if (parts.length < 2) return renderLocalizedText(storageLabel, language);
    const quotaLabel = parts[0];
    const lessonLabel = parts.slice(1).join(" • ");

    const renderQuota = () => React.createElement("span", {
      style: {
        direction: "ltr",
        unicodeBidi: "isolate",
        fontFamily: "var(--font)",
      },
    }, quotaLabel);

    const renderUrduLessonLabel = (value) => {
      const match = String(value || "").match(/^(\d+)\s+(.+)$/);
      if (!match) {
        return React.createElement("span", {
          style: {
            fontFamily: "var(--font-ur)",
            direction: "rtl",
            unicodeBidi: "isolate",
          },
        }, value);
      }
      return React.createElement("span", {
        style: {
          display: "inline-flex",
          alignItems: "baseline",
          gap: 4,
          fontFamily: "var(--font-ur)",
          direction: "rtl",
          unicodeBidi: "isolate",
        },
      },
      match[2],
      React.createElement("span", {
        style: {
          direction: "ltr",
          unicodeBidi: "isolate",
          fontFamily: "var(--font)",
        },
      }, match[1]));
    };

    if (language === "ur") {
      return React.createElement("span", {
        style: {
          display: "inline-flex",
          flexWrap: "wrap",
          gap: 6,
          alignItems: "baseline",
          justifyContent: "flex-end",
        },
      },
      renderQuota(),
      React.createElement("span", { style: { color: "var(--text-muted)" } }, "•"),
      renderUrduLessonLabel(lessonLabel));
    }

    if (language === "bilingual" && lessonLabel.includes(" / ")) {
      const [enLesson, urLesson] = lessonLabel.split(" / ");
      return React.createElement("span", {
        style: {
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 4,
        },
      },
      React.createElement("span", {
        style: {
          direction: "ltr",
          unicodeBidi: "isolate",
          fontFamily: "var(--font)",
        },
      }, `${quotaLabel} • ${enLesson}`),
      renderUrduLessonLabel(urLesson));
    }

    return React.createElement("span", {
      style: {
        direction: "ltr",
        unicodeBidi: "isolate",
        fontFamily: "var(--font)",
      },
    }, storageLabel);
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

  function renderAiProviderCard(provider, labels, language, onAiProviderDraftChange, onSaveAiProvider, onClearAiProvider) {
    const statusColor = provider.statusLabel && /ready|تیار/i.test(provider.statusLabel)
      ? "var(--success)"
      : provider.statusLabel && /authorization|اجازت|blocked|روکا|quota|billing|کوٹہ|بلنگ|review|جائزہ/i.test(provider.statusLabel)
        ? "var(--warning)"
        : "var(--text-secondary)";
    const modelSelect = Array.isArray(provider.modelOptions) && provider.modelOptions.length > 0
      ? React.createElement("select", {
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
      }, provider.modelOptions.map((modelName) => React.createElement("option", { key: modelName, value: modelName }, modelName)))
      : React.createElement("input", {
        className: "settings-text-input",
        value: provider.model,
        onChange: (event) => onAiProviderDraftChange(provider.id, "model", event.target.value),
      });

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
      React.createElement("div", { style: { color: statusColor, fontSize: 12, fontWeight: 700, marginTop: 4 } }, renderLocalizedText(provider.statusLabel, language))),
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
      modelSelect),
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
    themeMode,
    onThemeModeChange,
    dailyReviewCap,
    onDailyReviewCapChange,
    daySectionSettings,
    onDaySectionChange,
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
  }) {
    const ui = labels || {};
    const history = Array.isArray(versionInfo?.history) ? versionInfo.history : [];
    const versionHistoryBlock = history.length > 0 ? React.createElement("div", {
      style: {
        padding: "12px 14px",
        borderRadius: 12,
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        marginBottom: 8,
      },
    },
    React.createElement("div", { style: { color: "var(--text-primary)", fontSize: 13, fontWeight: 700, marginBottom: 6 } }, renderLocalizedText(ui.versionHistory || "Version History", language)),
    ...history.slice(0, 2).map((entry) => React.createElement("div", {
      key: `${entry.version}`,
      style: { marginBottom: 8, color: "var(--text-secondary)", fontSize: 12 },
    },
    React.createElement("div", { style: { color: "var(--text-primary)", fontWeight: 700, marginBottom: 4 } }, `v${entry.version} • ${entry.date}`),
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
      versionHistoryBlock,

      sectionTitle(renderLocalizedText(ui.userData || "User Data", language)),
      React.createElement("div", { className: "settings-item" },
        React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.storageUsage || "Storage", language)),
        React.createElement("span", { className: "si-value" }, renderStorageValue(storageLabel, language))),
      actionButton(renderLocalizedText(ui.resetProgress || "Reset Progress", language), onResetProgress, "#EF4444", { marginBottom: 8 }),
      actionButton(renderLocalizedText(ui.fullReset || "Full Reset", language), onFullReset, "#DC2626", { marginBottom: 0 }),

      sectionTitle(renderLocalizedText(ui.appExperience || "App Experience", language)),
      React.createElement("div", { className: "settings-item" },
        React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.installStatus || "Install Status", language)),
        React.createElement("span", { className: "si-value" }, renderLocalizedText(installStatusLabel || (ui.appInstallUnavailable || "Browser install not available"), language))),
      React.createElement("div", { className: "settings-item" },
        React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.offlineAccess || "Offline Access", language)),
        React.createElement("span", { className: "si-value" }, renderLocalizedText(offlineStatusLabel || (ui.offlineCaching || "Preparing offline cache"), language))),
      React.createElement("div", { className: "settings-item" },
        React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.networkStatus || "Network", language)),
        React.createElement("span", { className: "si-value" }, renderLocalizedText(networkStatusLabel || (ui.online || "Online"), language))),
      canInstallApp ? actionButton(renderLocalizedText(ui.installApp || "Install App", language), onInstallApp, "#6366F1") : null,
      canReloadApp ? actionButton(renderLocalizedText(ui.refreshToUpdate || "Refresh to Update", language), onReloadApp, "#0EA5E9") : null,

      sectionTitle(renderLocalizedText(ui.aiConnections || "AI Tutor Connections", language)),
      React.createElement("div", {
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
      aiBrowserBlocked ? React.createElement("div", {
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
      }, renderLocalizedText(ui.aiBrowserBlocked || "Direct browser AI access works best on the published HTTPS site or localhost, not from file mode.", language)) : null,
      ...(Array.isArray(aiProviders) ? aiProviders : []).map((provider) => renderAiProviderCard(provider, ui, language, onAiProviderDraftChange, onSaveAiProvider, onClearAiProvider)),

      sectionTitle(renderLocalizedText(ui.dayBasedSections || "Day-Based English Sections", language)),
      React.createElement("div", {
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
          React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.themeMode || "Theme Mode", language)),
          React.createElement("select", {
            value: themeMode || "system",
            onChange: (event) => onThemeModeChange(event.target.value),
            style: {
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--bg-elevated)",
              color: "var(--text-primary)",
              fontFamily: language === "ur" || language === "bilingual" ? "var(--font-ur)" : "var(--font)",
            },
          },
          React.createElement("option", { value: "system" }, renderLocalizedText(ui.themeSystem || "System", language)),
          React.createElement("option", { value: "dark" }, renderLocalizedText(ui.themeDark || "Dark", language)),
          React.createElement("option", { value: "light" }, renderLocalizedText(ui.themeLight || "Light", language))))),
      React.createElement("div", { className: "settings-item", style: { display: "block" } },
        React.createElement("div", {
          style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 10 },
        },
        React.createElement("span", { className: "si-label" }, renderLocalizedText(ui.dailyReviewCap || "Daily Review Cap", language)),
        React.createElement("span", { className: "si-value" }, dailyReviewCap)),
        React.createElement("input", {
          type: "range",
          min: 5,
          max: 50,
          step: 1,
          value: dailyReviewCap,
          onChange: (event) => onDailyReviewCapChange(Number(event.target.value) || dailyReviewCap),
          style: { width: "100%" },
        }),
        React.createElement("div", {
          style: { marginTop: 8, color: "var(--text-muted)", fontSize: 12 },
        }, renderLocalizedText(ui.dailyReviewCapHelp || "Limits how many review cards appear in one study session.", language))),
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
