import { useState, useEffect } from "react";
import { X, Trash2, Download, Upload, Palette } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
import { enable, disable, isEnabled } from "@tauri-apps/plugin-autostart";
import { save, open } from "@tauri-apps/plugin-dialog";
import type { ThemeConfig, Connection, Group } from "../types";

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

const COLOR_FIELDS: { key: keyof ThemeConfig["colors"]; label: string }[] = [
  { key: "bgPrimary", label: "Tło główne" },
  { key: "bgSecondary", label: "Tło drugorzędne" },
  { key: "bgTertiary", label: "Tło trzeciorzędne" },
  { key: "accent", label: "Akcent" },
  { key: "accentBlue", label: "Akcent niebieski" },
  { key: "accentPurple", label: "Akcent fioletowy" },
  { key: "accentRed", label: "Akcent czerwony" },
  { key: "textPrimary", label: "Tekst główny" },
  { key: "textSecondary", label: "Tekst drugorzędny" },
  { key: "border", label: "Obramowanie" },
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
          title="Usuń motyw"
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
  const [name, setName] = useState(baseTheme.name + " (kopie)");
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
        placeholder="Nazwa motywu"
      />

      <div className="grid grid-cols-2 gap-2">
        {COLOR_FIELDS.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-2">
            <input
              type="color"
              value={colors[key]}
              onChange={(e) => setColor(key, e.target.value)}
              className="w-5 h-5 rounded-full shrink-0 cursor-pointer"
            />
            <div className="min-w-0">
              <span className="text-xs block truncate" style={{ color: "var(--text-secondary)" }}>
                {label}
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
          Zapisz
        </button>
        <button
          onClick={onCancel}
          className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
          style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-primary)" }}
        >
          Anuluj
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
  onClose,
  connections,
  groups,
  onImport,
}: SettingsModalProps) {
  const [autostart, setAutostart] = useState(false);
  const [startMinimized, setStartMinimized] = useState(
    () => localStorage.getItem("startMinimized") === "true",
  );
  const [showEditor, setShowEditor] = useState(false);
  const [editorBase, setEditorBase] = useState<ThemeConfig>(activeTheme);

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
            Ustawienia
          </h2>
          <button onClick={onClose} style={{ color: "var(--text-secondary)" }}>
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm" style={labelStyle}>Motyw</span>
              <button
                onClick={() => {
                  setEditorBase(activeTheme);
                  setShowEditor(true);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors"
                style={btnStyle}
              >
                <Palette size={12} /> Nowy
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
                {allThemes.map((t) => (
                  <ThemeCard
                    key={t.id}
                    theme={t}
                    active={t.id === activeThemeId}
                    onSelect={() => onSelectTheme(t.id)}
                    onDelete={
                      !t.builtIn
                        ? () => onDeleteCustomTheme(t.id)
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
            <span className="text-sm" style={labelStyle}>Uruchom z systemem</span>
            <Toggle checked={autostart} onChange={toggleAutostart} />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm" style={labelStyle}>Uruchom zminimalizowane</span>
            <Toggle checked={startMinimized} onChange={toggleStartMinimized} />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm" style={labelStyle}>Zamknij do tray</span>
            <Toggle checked={closeToTray} onChange={toggleCloseToTray} />
          </div>

          <div
            className="w-full h-px"
            style={{ backgroundColor: "var(--border)" }}
          />

          <div>
            <span className="text-xs font-medium block mb-2" style={{ color: "var(--text-secondary)" }}>
              Skróty klawiszowe
            </span>
            <div className="space-y-1.5">
              {[
                { keys: "Ctrl + F", label: "Szukaj" },
                { keys: "Ctrl + N", label: "Nowe połączenie" },
                { keys: "Ctrl + G", label: "Nowa grupa" },
                { keys: "Esc", label: "Zamknij okno" },
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
              Eksportuj dane
            </button>
            <button
              onClick={handleImport}
              className="flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              style={btnStyle}
            >
              Importuj dane
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleExportThemes}
              className="flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              style={btnStyle}
            >
              <Download size={12} /> Eksportuj motywy
            </button>
            <button
              onClick={handleImportThemes}
              className="flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              style={btnStyle}
            >
              <Upload size={12} /> Importuj motywy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
