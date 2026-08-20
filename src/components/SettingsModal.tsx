import { useState, useEffect } from "react";
import { X, Trash2, Download, Upload, Palette } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
import { enable, disable, isEnabled } from "@tauri-apps/plugin-autostart";
import { save, open } from "@tauri-apps/plugin-dialog";
import type { ThemeConfig, Connection, Group } from "../types";
import type { Language } from "../i18n/provider";
import { useTranslation } from "../i18n/provider";

interface SettingsModalProps {
  activeTheme: ThemeConfig;
  activeThemeId: string;
  allThemes: ThemeConfig[];
  customThemes: ThemeConfig[];
  onSelectTheme: (id: string) => void;
  onSaveCustomTheme: (theme: ThemeConfig) => void;
  onDeleteCustomTheme: (id: string) => void;
  closeToTray: boolean;
  onToggleCloseToTray: (val: boolean) => void;
  lang: Language;
  onLangChange: (lang: Language) => void;
  customTranslations: Record<string, string>;
  onCustomTranslationsChange: (custom: Record<string, string>) => void;
  onClose: () => void;
  connections: Connection[];
  groups: Group[];
  onImport: (connections: Connection[], groups: Group[]) => void;
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative w-9 h-5 rounded-full transition-colors shrink-0"
      style={{
        backgroundColor: checked ? "var(--accent)" : "var(--bg-tertiary)",
      }}
    >
      <div
        className="absolute top-0.5 w-4 h-4 rounded-full transition-transform"
        style={{
          backgroundColor: checked ? "var(--bg-primary)" : "var(--text-secondary)",
          transform: checked ? "translateX(18px)" : "translateX(2px)",
        }}
      />
    </button>
  );
}

const COLOR_FIELDS: { key: keyof ThemeConfig["colors"] }[] = [
  { key: "bgPrimary" },
  { key: "bgSecondary" },
  { key: "bgTertiary" },
  { key: "accent" },
  { key: "accentBlue" },
  { key: "accentPurple" },
  { key: "accentRed" },
  { key: "textPrimary" },
  { key: "textSecondary" },
  { key: "border" },
];

function ThemeCard({
  theme,
  active,
  onSelect,
  onDelete,
}: {
  theme: ThemeConfig;
  active: boolean;
  onSelect: () => void;
  onDelete?: () => void;
}) {
  const { t } = useTranslation();
  return (
    <button
      onClick={onSelect}
      className="relative rounded-lg p-2 text-left transition-all border"
      style={{
        borderColor: active ? "var(--accent)" : "var(--border)",
        backgroundColor: active ? "var(--bg-tertiary)" : "transparent",
      }}
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.accent }} />
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.accentBlue }} />
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.accentPurple }} />
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.accentRed }} />
      </div>
      <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
        {theme.name}
      </span>
      {onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="absolute top-1.5 right-1.5 p-0.5 rounded transition-colors hover:bg-[var(--bg-secondary)]"
          style={{ color: "var(--accent-red)" }}
          title={t["settings.deleteTheme"]}
        >
          <Trash2 size={10} />
        </button>
      )}
    </button>
  );
}

function ThemeEditor({
  baseTheme,
  onSave,
  onCancel,
}: {
  baseTheme: ThemeConfig;
  onSave: (theme: ThemeConfig) => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  const [name, setName] = useState(baseTheme.name + " " + t["settings.themeCopy"]);
  const [colors, setColors] = useState({ ...baseTheme.colors });

  const setColor = (key: keyof ThemeConfig["colors"], value: string) => {
    setColors((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const id = `custom-${Date.now()}`;
    onSave({
      id,
      name,
      colors,
    });
  };

  const themeColorLabels: Record<string, string> = {
    bgPrimary: t["theme.bgPrimary"],
    bgSecondary: t["theme.bgSecondary"],
    bgTertiary: t["theme.bgTertiary"],
    accent: t["theme.accent"],
    accentBlue: t["theme.accentBlue"],
    accentPurple: t["theme.accentPurple"],
    accentRed: t["theme.accentRed"],
    textPrimary: t["theme.textPrimary"],
    textSecondary: t["theme.textSecondary"],
    border: t["theme.border"],
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-3 py-1.5 rounded-lg text-xs border outline-none"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border)",
          color: "var(--text-primary)",
        }}
        placeholder={t["settings.themeName"]}
      />

      <div className="grid grid-cols-2 gap-2">
        {COLOR_FIELDS.map(({ key }) => (
          <div key={key} className="flex items-center gap-2">
            <input
              type="color"
              value={colors[key]}
              onChange={(e) => setColor(key, e.target.value)}
              className="w-5 h-5 rounded-full shrink-0 cursor-pointer"
            />
            <div className="min-w-0">
              <span className="text-xs block truncate" style={{ color: "var(--text-secondary)" }}>
                {themeColorLabels[key]}
              </span>
              <span className="text-xs font-mono block" style={{ color: "var(--text-secondary)" }}>
                {colors[key]}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={handleSave}
          className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
          style={{ backgroundColor: "var(--accent)", color: "var(--bg-primary)" }}
        >
          {t["common.save"]}
        </button>
        <button
          onClick={onCancel}
          className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
          style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-primary)" }}
        >
          {t["common.cancel"]}
        </button>
      </div>
    </div>
  );
}

export function SettingsModal({
  activeTheme,
  activeThemeId,
  allThemes,
  customThemes,
  onSelectTheme,
  onSaveCustomTheme,
  onDeleteCustomTheme,
  closeToTray,
  onToggleCloseToTray,
  lang,
  onLangChange,
  customTranslations,
  onCustomTranslationsChange,
  onClose,
  connections,
  groups,
  onImport,
}: SettingsModalProps) {
  const { t } = useTranslation();
  const [autostart, setAutostart] = useState(false);
  const [startMinimized, setStartMinimized] = useState(
    () => localStorage.getItem("startMinimized") === "true",
  );
  const [showEditor, setShowEditor] = useState(false);
  const [editorBase, setEditorBase] = useState<ThemeConfig>(activeTheme);
  const [showTranslations, setShowTranslations] = useState(false);

  useEffect(() => {
    isEnabled().then(setAutostart).catch(() => {});
  }, []);

  const toggleAutostart = async (val: boolean) => {
    if (val) {
      await enable();
    } else {
      await disable();
    }
    setAutostart(val);
  };

  const toggleStartMinimized = (val: boolean) => {
    setStartMinimized(val);
    localStorage.setItem("startMinimized", String(val));
  };

  const toggleCloseToTray = (val: boolean) => {
    onToggleCloseToTray(val);
  };

  const handleExport = async () => {
    const path = await save({
      defaultPath: "link-export.json",
      filters: [{ name: "JSON", extensions: ["json"] }],
    });
    if (path) {
      const data = JSON.stringify({ connections, groups }, null, 2);
      await invoke("export_data", { path, data });
    }
  };

  const handleImport = async () => {
    const selected = await open({
      multiple: false,
      filters: [{ name: "JSON", extensions: ["json"] }],
    });
    if (selected) {
      const contents: string = await invoke("import_data", { path: selected });
      const data = JSON.parse(contents);
      if (data.connections && data.groups) {
        onImport(data.connections, data.groups);
      }
    }
  };

  const handleExportThemes = async () => {
    const path = await save({
      defaultPath: "link-themes.json",
      filters: [{ name: "JSON", extensions: ["json"] }],
    });
    if (path) {
      const data = JSON.stringify(customThemes, null, 2);
      await invoke("export_data", { path, data });
    }
  };

  const handleImportThemes = async () => {
    const selected = await open({
      multiple: false,
      filters: [{ name: "JSON", extensions: ["json"] }],
    });
    if (selected) {
      const contents: string = await invoke("import_data", { path: selected });
      const data = JSON.parse(contents);
      if (Array.isArray(data)) {
        for (const t of data) {
          if (t.id && t.name && t.colors) {
            onSaveCustomTheme({ ...t, id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` });
          }
        }
      }
    }
  };

  const labelStyle = { color: "var(--text-primary)" };
  const btnStyle = {
    backgroundColor: "var(--bg-tertiary)",
    color: "var(--text-primary)",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="rounded-xl shadow-xl w-full max-w-md border max-h-[80vh] flex flex-col"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderColor: "var(--border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-6 py-4 border-b shrink-0"
          style={{ borderColor: "var(--border)" }}
        >
          <h2 className="text-sm font-semibold" style={labelStyle}>
            {t["settings.title"]}
          </h2>
          <button onClick={onClose} style={{ color: "var(--text-secondary)" }}>
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm" style={labelStyle}>{t["settings.language"]}</span>
              <select
                value={lang}
                onChange={(e) => onLangChange(e.target.value)}
                className="px-2 py-1 rounded-lg text-xs border outline-none"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
              >
                <option value="pl">{t["lang.pl"]}</option>
                <option value="en">{t["lang.en"]}</option>
              </select>
            </div>
          </div>

          <div
            className="w-full h-px"
            style={{ backgroundColor: "var(--border)" }}
          />

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm" style={labelStyle}>{t["settings.theme"]}</span>
              <button
                onClick={() => {
                  setEditorBase(activeTheme);
                  setShowEditor(true);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors"
                style={btnStyle}
              >
                <Palette size={12} /> {t["settings.newTheme"]}
              </button>
            </div>

            {showEditor ? (
              <ThemeEditor
                baseTheme={editorBase}
                onSave={(theme) => {
                  onSaveCustomTheme(theme);
                  onSelectTheme(theme.id);
                  setShowEditor(false);
                }}
                onCancel={() => setShowEditor(false)}
              />
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {allThemes.map((th) => (
                  <ThemeCard
                    key={th.id}
                    theme={th}
                    active={th.id === activeThemeId}
                    onSelect={() => onSelectTheme(th.id)}
                    onDelete={
                      !th.builtIn
                        ? () => onDeleteCustomTheme(th.id)
                        : undefined
                    }
                  />
                ))}
              </div>
            )}
          </div>

          <div
            className="w-full h-px"
            style={{ backgroundColor: "var(--border)" }}
          />

          <div className="flex items-center justify-between">
            <span className="text-sm" style={labelStyle}>{t["settings.autostart"]}</span>
            <Toggle checked={autostart} onChange={toggleAutostart} />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm" style={labelStyle}>{t["settings.startMinimized"]}</span>
            <Toggle checked={startMinimized} onChange={toggleStartMinimized} />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm" style={labelStyle}>{t["settings.closeToTray"]}</span>
            <Toggle checked={closeToTray} onChange={toggleCloseToTray} />
          </div>

          <div
            className="w-full h-px"
            style={{ backgroundColor: "var(--border)" }}
          />

          <div>
            <span className="text-xs font-medium block mb-2" style={{ color: "var(--text-secondary)" }}>
              {t["settings.shortcuts"]}
            </span>
            <div className="space-y-1.5">
              {[
                { keys: "Ctrl + F", label: t["settings.shortcutSearch"] },
                { keys: "Ctrl + N", label: t["settings.shortcutNewConnection"] },
                { keys: "Ctrl + G", label: t["settings.shortcutNewGroup"] },
                { keys: "Esc", label: t["settings.shortcutClose"] },
              ].map((s) => (
                <div key={s.keys} className="flex items-center justify-between">
                  <span className="text-xs" style={labelStyle}>{s.label}</span>
                  <kbd
                    className="px-1.5 py-0.5 rounded text-xs font-mono"
                    style={{
                      backgroundColor: "var(--bg-tertiary)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {s.keys}
                  </kbd>
                </div>
              ))}
            </div>
          </div>

          <div
            className="w-full h-px"
            style={{ backgroundColor: "var(--border)" }}
          />

          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              style={btnStyle}
            >
              {t["settings.exportData"]}
            </button>
            <button
              onClick={handleImport}
              className="flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              style={btnStyle}
            >
              {t["settings.importData"]}
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleExportThemes}
              className="flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              style={btnStyle}
            >
              <Download size={12} /> {t["settings.exportThemes"]}
            </button>
            <button
              onClick={handleImportThemes}
              className="flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              style={btnStyle}
            >
              <Upload size={12} /> {t["settings.importThemes"]}
            </button>
          </div>

          {lang !== "pl" && lang !== "en" && (
            <>
              <div className="w-full h-px" style={{ backgroundColor: "var(--border)" }} />
              <div>
                <button
                  onClick={() => setShowTranslations(!showTranslations)}
                  className="text-xs font-medium mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Tłumaczenia ({Object.keys(customTranslations).length} {lang})
                </button>
                {showTranslations && (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {Object.entries(t).map(([key, val]) => (
                      <div key={key} className="flex items-center gap-2">
                        <span className="text-xs shrink-0 w-32 truncate" style={{ color: "var(--text-secondary)" }}>
                          {key}
                        </span>
                        <input
                          type="text"
                          value={customTranslations[key] ?? ""}
                          onChange={(e) => {
                            const updated = { ...customTranslations, [key]: e.target.value };
                            if (!e.target.value) delete updated[key];
                            onCustomTranslationsChange(updated);
                          }}
                          className="flex-1 px-2 py-1 rounded text-xs border outline-none"
                          style={{
                            backgroundColor: "var(--bg-primary)",
                            borderColor: "var(--border)",
                            color: "var(--text-primary)",
                          }}
                          placeholder={String(val)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
