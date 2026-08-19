import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  small?: boolean;
}

export function CustomSelect({
  value,
  options,
  onChange,
  placeholder = "Wybierz",
  className = "",
  style,
  small = false,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full border outline-none text-left flex items-center justify-between ${
          small
            ? `h-7 px-2 text-xs ${open ? "rounded-t-lg" : "rounded"}`
            : `h-9 px-3 text-sm ${open ? "rounded-t-lg rounded-b-none" : "rounded-lg"}`
        }`}
        style={{
          ...style,
          backgroundColor: style?.backgroundColor ?? "var(--bg-tertiary)",
          borderColor: open ? "var(--accent)" : (style?.borderColor ?? "var(--border)"),
          color: selected ? (style?.color ?? "var(--text-primary)") : "var(--text-secondary)",
        }}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <ChevronDown
          size={small ? 12 : 14}
          className="shrink-0 ml-1"
          style={{
            color: "var(--text-secondary)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.15s",
          }}
        />
      </button>

      {open && (
        <div
          className={`absolute z-50 w-full shadow-lg overflow-hidden border-x border-b ${
            small ? "rounded-b-lg" : "rounded-b-xl"
          }`}
          style={{
            backgroundColor: "var(--bg-tertiary)",
            borderColor: "var(--accent)",
            top: "100%",
          }}
        >
          <div className="max-h-48 overflow-y-auto py-1">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full text-left transition-colors ${small ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm"}`}
                style={{
                  color:
                    opt.value === value
                      ? "var(--accent)"
                      : "var(--text-primary)",
                  backgroundColor:
                    opt.value === value
                      ? "var(--bg-secondary)"
                      : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (opt.value !== value) {
                    e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (opt.value !== value) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
