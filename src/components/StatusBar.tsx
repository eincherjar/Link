import type { Connection } from "../types";
import { Terminal, Monitor, Wifi } from "lucide-react";

interface StatusBarProps {
  activeConnection: Connection | null;
}

export function StatusBar({ activeConnection }: StatusBarProps) {
  return (
    <div
      className="flex items-center justify-between px-4 py-2 shrink-0 text-xs"
      style={{
        backgroundColor: "var(--bg-secondary)",
        color: "var(--text-secondary)",
      }}
    >
      <div className="flex items-center gap-3">
        {activeConnection ? (
          <>
            <div className="flex items-center gap-1.5">
              <Wifi size={12} style={{ color: "var(--accent)" }} />
              <span
                className="font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                {activeConnection.name}
              </span>
            </div>
            <span>
              {activeConnection.protocol === "SSH" ? (
                <Terminal size={12} />
              ) : (
                <Monitor size={12} />
              )}{" "}
              {activeConnection.username}@{activeConnection.host}:
              {activeConnection.port}
            </span>
          </>
        ) : (
          <span>Brak aktywnego połączenia</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <span>Link v0.1.0</span>
      </div>
    </div>
  );
}
