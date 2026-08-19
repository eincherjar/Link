import { useState } from "react";
import { ChevronRight, ChevronDown, Terminal, Monitor } from "lucide-react";
import type { Connection, Group } from "../types";

function PlayerPlay({ size = 24, style }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d="M7 4v16l13 -8l-13 -8" />
    </svg>
  );
}

function Pencil({ size = 24, style }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
      <path d="M13.5 6.5l4 4" />
    </svg>
  );
}

function Trash({ size = 24, style }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d="M4 7l16 0" />
      <path d="M10 11l0 6" />
      <path d="M14 11l0 6" />
      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
    </svg>
  );
}

function Star({ size = 24, filled = false, style }: { size?: number; filled?: boolean; style?: React.CSSProperties }) {
  if (filled) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={style}>
        <path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245" />
    </svg>
  );
}

interface GroupSectionProps {
  group: Group;
  connections: Connection[];
  defaultExpanded?: boolean;
  editable?: boolean;
  onConnect: (conn: Connection) => void;
  onEdit: (conn: Connection) => void;
  onDelete: (conn: Connection) => void;
  onEditGroup: (group: Group) => void;
  onDeleteGroup: (group: Group) => void;
  onToggleFavorite: (conn: Connection) => void;
}

export function GroupSection({
  group,
  connections,
  defaultExpanded = true,
  editable = true,
  onConnect,
  onEdit,
  onDelete,
  onEditGroup,
  onDeleteGroup,
  onToggleFavorite,
}: GroupSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoveredGroup, setHoveredGroup] = useState(false);

  return (
    <div className="mb-2">
      <div
        className="flex items-center gap-2.5 w-full px-3 py-2 rounded transition-colors"
        style={{ backgroundColor: "var(--bg-tertiary)" }}
        onMouseEnter={() => setHoveredGroup(true)}
        onMouseLeave={() => setHoveredGroup(false)}
      >
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2.5 flex-1 min-w-0 text-left"
        >
          {expanded ? (
            <ChevronDown size={14} style={{ color: "var(--text-secondary)" }} />
          ) : (
            <ChevronRight size={14} style={{ color: "var(--text-secondary)" }} />
          )}

          <div
            className="w-1 h-4 rounded-full"
            style={{ backgroundColor: group.color }}
          />

          <span
            className="text-sm font-semibold truncate"
            style={{ color: "var(--text-primary)" }}
          >
            {group.name}
          </span>
        </button>

        <span className="flex-1" />

        {hoveredGroup && editable && (
          <>
            <button
              onClick={() => onEditGroup(group)}
              className="p-1 rounded transition-colors hover:bg-[var(--bg-secondary)] shrink-0"
              style={{ color: "var(--text-secondary)" }}
              title="Edytuj grupę"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => onDeleteGroup(group)}
              className="p-1 rounded transition-colors hover:bg-[var(--bg-secondary)] shrink-0"
              style={{ color: "var(--accent-red)" }}
              title="Usuń grupę"
            >
              <Trash size={14} />
            </button>
          </>
        )}

        <span
          className="text-xs font-medium shrink-0"
          style={{ color: "var(--text-primary)" }}
        >
          {connections.length}
        </span>
      </div>

      {expanded && (
        <div className="ml-6 mt-0.5 space-y-0.5">
          {connections.map((conn) => (
            <div
              key={conn.id}
              className="flex items-center gap-3 w-full px-3 py-2 rounded transition-colors"
              style={{
                backgroundColor:
                  hoveredId === conn.id ? "var(--bg-primary)" : "transparent",
              }}
              onMouseEnter={() => setHoveredId(conn.id)}
              onMouseLeave={() => setHoveredId(null)}
              onDoubleClick={() => onConnect(conn)}
            >
              {conn.protocol === "SSH" ? (
                <Terminal
                  size={14}
                  style={{ color: "var(--accent)", flexShrink: 0 }}
                />
              ) : (
                <Monitor
                  size={14}
                  style={{ color: "var(--accent-blue)", flexShrink: 0 }}
                />
              )}

              <span
                className="text-sm font-medium truncate"
                style={{ color: "var(--text-primary)" }}
              >
                {conn.name}
              </span>

              <span
                className="text-xs truncate flex-1"
                style={{ color: "var(--text-secondary)" }}
              >
                {conn.username}@{conn.host}:{conn.port}
              </span>

              {(conn.favorite || hoveredId === conn.id) && (
                <div className="flex items-center gap-0.5 shrink-0">
                  {hoveredId === conn.id && (
                    <>
                      <button
                        onClick={() => onConnect(conn)}
                        className="p-1 rounded transition-colors hover:bg-[var(--bg-tertiary)]"
                        style={{ color: "var(--accent)" }}
                        title="Połącz"
                      >
                        <PlayerPlay size={14} />
                      </button>
                      <button
                        onClick={() => onEdit(conn)}
                        className="p-1 rounded transition-colors hover:bg-[var(--bg-tertiary)]"
                        style={{ color: "var(--text-secondary)" }}
                        title="Edytuj"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(conn)}
                        className="p-1 rounded transition-colors hover:bg-[var(--bg-tertiary)]"
                        style={{ color: "var(--accent-red)" }}
                        title="Usuń"
                      >
                        <Trash size={14} />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => onToggleFavorite(conn)}
                    className="p-1 rounded transition-colors hover:bg-[var(--bg-tertiary)]"
                    style={{ color: conn.favorite ? "var(--accent)" : "var(--text-secondary)" }}
                    title={conn.favorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
                  >
                    <Star size={14} filled={conn.favorite} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
