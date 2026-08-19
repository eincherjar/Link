import { useState } from "react";
import { X } from "lucide-react";
import type { Group } from "../types";

interface GroupModalProps {
  mode: "add" | "edit";
  group?: Group;
  onSave: (group: Omit<Group, "id"> & { id?: string }) => void;
  onClose: () => void;
}

const colorOptions = [
  { value: "#F37C7C", label: "Czerwony" },
  { value: "#5DA6EA", label: "Niebieski" },
  { value: "#9DD99A", label: "Zielony" },
  { value: "#B9A0F8", label: "Fioletowy" },
  { value: "#E8C547", label: "Zolty" },
  { value: "#F0A060", label: "Pomaranczowy" },
];

export function GroupModal({ mode, group, onSave, onClose }: GroupModalProps) {
  const [name, setName] = useState(group?.name ?? "");
  const [color, setColor] = useState(group?.color ?? colorOptions[0].value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: group?.id, name, color });
  };

  const inputStyle = {
    backgroundColor: "var(--bg-tertiary)",
    borderColor: "var(--border)",
    color: "var(--text-primary)",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="rounded-xl shadow-xl w-full max-w-sm border"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderColor: "var(--border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <h2
            className="text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {mode === "add" ? "Nowa grupa" : "Edytuj grupe"}
          </h2>
          <button onClick={onClose} style={{ color: "var(--text-secondary)" }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-4 py-4 space-y-3">
          <div>
            <label
              className="block text-xs font-medium mb-1"
              style={{ color: "var(--text-secondary)" }}
            >
              Nazwa
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full h-8 px-2.5 rounded-lg text-xs border outline-none focus:ring-1"
              style={inputStyle}
            />
          </div>

          <div>
            <label
              className="block text-xs font-medium mb-1"
              style={{ color: "var(--text-secondary)" }}
            >
              Kolor
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {colorOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setColor(opt.value)}
                  className="w-9 h-9 rounded-full border-2 transition-transform shrink-0"
                  style={{
                    backgroundColor: opt.value,
                    borderColor:
                      color === opt.value
                        ? "var(--text-primary)"
                        : "transparent",
                    transform: color === opt.value ? "scale(1.15)" : "scale(1)",
                  }}
                  title={opt.label}
                />
              ))}
              <label
                className="w-9 h-9 rounded-full border-2 transition-transform cursor-pointer shrink-0 overflow-hidden relative"
                style={{
                  borderColor:
                    !colorOptions.some((o) => o.value === color)
                      ? "var(--text-primary)"
                      : "transparent",
                  transform: !colorOptions.some((o) => o.value === color) ? "scale(1.15)" : "scale(1)",
                }}
                title="Własny kolor"
              >
                {!colorOptions.some((o) => o.value === color) ? (
                  <div
                    className="absolute inset-0"
                    style={{ backgroundColor: color }}
                  />
                ) : (
                  <>
                    <div
                      className="absolute inset-0"
                      style={{
                        background: "conic-gradient(from 0deg, #F37C7C, #F0A060, #E8C547, #9DD99A, #5DA6EA, #B9A0F8, #F37C7C)",
                      }}
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: "radial-gradient(circle, transparent 20%, rgba(255,255,255,0.35) 60%, rgba(255,255,255,0.5) 100%)",
                      }}
                    />
                  </>
                )}
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </label>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-colors"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-secondary)",
              }}
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              style={{
                backgroundColor: "var(--accent-blue)",
                color: "var(--bg-primary)",
              }}
            >
              {mode === "add" ? "Dodaj" : "Zapisz"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
