import { useState, useMemo } from "react";
import { X, AlertTriangle, Plus, Minus } from "lucide-react";
import { useTranslation } from "../i18n/provider";
import { connectionKey, type Connection, type ImportStrategy } from "../types";

interface ImportPreviewModalProps {
  currentConnections: Connection[];
  importedConnections: Connection[];
  onConfirm: (strategy: ImportStrategy) => void;
  onClose: () => void;
}

export function ImportPreviewModal({
  currentConnections,
  importedConnections,
  onConfirm,
  onClose,
}: ImportPreviewModalProps) {
  const { t } = useTranslation();
  const [strategy, setStrategy] = useState<ImportStrategy>("merge");

  const currentKeys = useMemo(
    () => new Set(currentConnections.map(connectionKey)),
    [currentConnections]
  );

  const analysis = useMemo(() => {
    const newItems = importedConnections.filter((c) => !currentKeys.has(connectionKey(c)));
    const duplicates = importedConnections.filter((c) => currentKeys.has(connectionKey(c)));
    return { newItems, duplicates };
  }, [importedConnections, currentKeys]);

  const summary = useMemo(() => {
    if (strategy === "replace") {
      return { added: 0, replaced: importedConnections.length, skipped: 0 };
    }
    const added = analysis.newItems.length;
    const skipped = analysis.duplicates.length;
    return { added, replaced: 0, skipped };
  }, [strategy, analysis, importedConnections]);

  const previewList = useMemo(() => {
    if (strategy === "replace") {
      return importedConnections.map((c) => ({
        ...c,
        status: currentKeys.has(connectionKey(c)) ? ("replaced" as const) : ("new" as const),
      }));
    }
    return importedConnections.map((c) => {
      const isDup = currentKeys.has(connectionKey(c));
      return {
        ...c,
        status: (isDup ? (strategy === "merge" ? "skipped" : "skipped") : "new") as "new" | "skipped",
      };
    });
  }, [strategy, importedConnections, currentKeys]);

  const statusColor = (s: string) => {
    if (s === "new") return "var(--accent-blue)";
    if (s === "replaced") return "var(--accent-red)";
    return "var(--text-secondary)";
  };

  const statusIcon = (s: string) => {
    if (s === "new") return <Plus size={10} />;
    if (s === "replaced") return <AlertTriangle size={10} />;
    return <Minus size={10} />;
  };

  const strategies: { value: ImportStrategy; label: string; desc: string }[] = [
    { value: "replace", label: t["import.replace"], desc: t["import.replaceDesc"] },
    { value: "merge", label: t["import.merge"], desc: t["import.mergeDesc"] },
    { value: "skip", label: t["import.skip"], desc: t["import.skipDesc"] },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="rounded-xl shadow-xl w-full max-w-lg border max-h-[85vh] flex flex-col"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderColor: "var(--border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-4 py-3 border-b shrink-0"
          style={{ borderColor: "var(--border)" }}
        >
          <h2
            className="text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {t["import.title"]}
          </h2>
          <button onClick={onClose} style={{ color: "var(--text-secondary)" }}>
            <X size={18} />
          </button>
        </div>

        <div className="px-4 py-3 space-y-4 overflow-y-auto flex-1">
          <div className="flex gap-4 text-xs" style={{ color: "var(--text-secondary)" }}>
            <span>{t["import.currentConnections"]}: <b style={{ color: "var(--text-primary)" }}>{currentConnections.length}</b></span>
            <span>{t["import.importedConnections"]}: <b style={{ color: "var(--text-primary)" }}>{importedConnections.length}</b></span>
            {analysis.duplicates.length > 0 && (
              <span style={{ color: "var(--accent-red)" }}>
                {t["import.duplicate"]}: {analysis.duplicates.length}
              </span>
            )}
          </div>

          <div>
            <span
              className="block text-xs font-medium mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              {t["import.strategy"]}
            </span>
            <div className="space-y-1.5">
              {strategies.map((s) => (
                <label
                  key={s.value}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors"
                  style={{
                    backgroundColor: strategy === s.value ? "var(--bg-tertiary)" : "transparent",
                    borderColor: strategy === s.value ? "var(--accent-blue)" : "var(--border)",
                  }}
                >
                  <input
                    type="radio"
                    name="import-strategy"
                    value={s.value}
                    checked={strategy === s.value}
                    onChange={() => setStrategy(s.value)}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                      {s.label}
                    </span>
                    <span className="text-xs block" style={{ color: "var(--text-secondary)" }}>
                      {s.desc}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <span
              className="block text-xs font-medium mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              {t["import.importedConnections"]}
            </span>
            <div
              className="max-h-48 overflow-y-auto rounded-lg border divide-y"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--bg-primary)",
              }}
            >
              {previewList.map((c) => (
                <div
                  key={connectionKey(c)}
                  className="flex items-center gap-2 px-3 py-2"
                >
                  <span
                    className="flex items-center justify-center w-4 h-4 rounded-full shrink-0"
                    style={{
                      backgroundColor: statusColor(c.status),
                      color: "var(--bg-primary)",
                    }}
                  >
                    {statusIcon(c.status)}
                  </span>
                  <span
                    className="text-xs flex-1 truncate"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {c.name}
                  </span>
                  <span
                    className="text-xs truncate"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {c.protocol}://{c.username}@{c.host}:{c.port}
                  </span>
                  <span
                    className="text-xs shrink-0"
                    style={{ color: statusColor(c.status) }}
                  >
                    {c.status === "new" && t["import.new"]}
                    {c.status === "replaced" && t["import.willBeReplaced"]}
                    {c.status === "skipped" && t["import.willBeSkipped"]}
                  </span>
                </div>
              ))}
              {previewList.length === 0 && (
                <div className="px-3 py-4 text-center text-xs" style={{ color: "var(--text-secondary)" }}>
                  {t["import.noChanges"]}
                </div>
              )}
            </div>
          </div>

          <div
            className="text-xs rounded-lg px-3 py-2"
            style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-secondary)" }}
          >
            {t["import.summary"]
              .replace("{{added}}", String(summary.added))
              .replace("{{replaced}}", String(summary.replaced))
              .replace("{{skipped}}", String(summary.skipped))}
          </div>
        </div>

        <div className="flex gap-2 px-4 py-3 border-t shrink-0" style={{ borderColor: "var(--border)" }}>
          <button
            onClick={onClose}
            className="flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-colors"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            {t["common.cancel"]}
          </button>
          <button
            onClick={() => onConfirm(strategy)}
            className="flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
            style={{
              backgroundColor: "var(--accent-blue)",
              color: "var(--bg-primary)",
            }}
          >
            {t["import.confirm"]} ({summary.added + summary.replaced})
          </button>
        </div>
      </div>
    </div>
  );
}
