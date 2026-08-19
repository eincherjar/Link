import { useState, useMemo, useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { TopBar } from "./components/TopBar";
import { GroupSection } from "./components/GroupSection";
import { ConnectionModal } from "./components/ConnectionModal";
import { GroupModal } from "./components/GroupModal";
import { SettingsModal } from "./components/SettingsModal";
import { useTheme } from "./hooks/useTheme";
import type { Connection, Group } from "./types";

export default function App() {
  const {
    activeTheme,
    activeThemeId,
    allThemes,
    customThemes,
    setTheme,
    saveCustomTheme,
    deleteCustomTheme,
  } = useTheme();

  const [loaded, setLoaded] = useState(false);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [closeToTray, setCloseToTray] = useState(
    () => localStorage.getItem("closeToTray") !== "false"
  );
  const loadedRef = useRef(false);

  useEffect(() => {
    getCurrentWebviewWindow().show();
    invoke<string>("load_app_data").then((raw) => {
      if (raw) {
        try {
          const data = JSON.parse(raw);
          if (data.connections) setConnections(data.connections);
          if (data.groups) setGroups(data.groups);
          if (data.themeId) {
            setTheme(data.themeId);
            localStorage.setItem("link-theme-id", data.themeId);
          }
          if (data.customThemes) {
            localStorage.setItem("link-custom-themes", JSON.stringify(data.customThemes));
          }
          if (typeof data.closeToTray === "boolean") {
            setCloseToTray(data.closeToTray);
            invoke("set_close_to_tray", { value: data.closeToTray });
          } else {
            invoke("set_close_to_tray", { value: true });
          }
        } catch {}
      } else {
        invoke("set_close_to_tray", { value: true });
      }
      setLoaded(true);
      loadedRef.current = true;
    }).catch(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!loadedRef.current) return;
    const data = JSON.stringify({ connections, groups, themeId: activeThemeId, customThemes, closeToTray });
    invoke("save_app_data", { data }).catch(console.error);
  }, [connections, groups, activeThemeId, customThemes, closeToTray]);
  const [searchQuery, setSearchQuery] = useState("");

  const [connModal, setConnModal] = useState<{
    open: boolean;
    mode: "add" | "edit";
    connection?: Connection;
  }>({ open: false, mode: "add" });

  const [groupModal, setGroupModal] = useState<{
    open: boolean;
    mode: "add" | "edit";
    group?: Group;
  }>({ open: false, mode: "add" });

  const [settingsOpen, setSettingsOpen] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    connection?: Connection;
  }>({ open: false });

  const [deleteGroupConfirm, setDeleteGroupConfirm] = useState<{
    open: boolean;
    group?: Group;
  }>({ open: false });

  const [connectingId, setConnectingId] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (settingsOpen) setSettingsOpen(false);
        else if (connModal.open) setConnModal({ open: false, mode: "add" });
        else if (groupModal.open) setGroupModal({ open: false, mode: "add" });
        else if (deleteConfirm.open) setDeleteConfirm({ open: false });
        else if (deleteGroupConfirm.open) setDeleteGroupConfirm({ open: false });
        return;
      }
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "f") {
          e.preventDefault();
          const input = document.querySelector<HTMLInputElement>("#search-input");
          input?.focus();
        } else if (e.key === "n") {
          e.preventDefault();
          setConnModal({ open: true, mode: "add" });
        } else if (e.key === "g") {
          e.preventDefault();
          setGroupModal({ open: true, mode: "add" });
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [settingsOpen, connModal.open, groupModal.open, deleteConfirm.open, deleteGroupConfirm.open]);

  const filteredConnections = useMemo(() => {
    return connections.filter((conn) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const groupName =
          groups.find((g) => g.id === conn.groupId)?.name.toLowerCase() ?? "";
        return (
          conn.name.toLowerCase().includes(q) ||
          conn.host.toLowerCase().includes(q) ||
          conn.username.toLowerCase().includes(q) ||
          conn.protocol.toLowerCase().includes(q) ||
          groupName.includes(q)
        );
      }
      return true;
    });
  }, [connections, searchQuery, groups]);

  const groupedConnections = useMemo(() => {
    const map = new Map<string, Connection[]>();
    for (const conn of filteredConnections) {
      const gid = conn.groupId ?? "__ungrouped";
      if (!map.has(gid)) map.set(gid, []);
      map.get(gid)!.push(conn);
    }
    for (const conns of map.values()) {
      conns.sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0));
    }
    return map;
  }, [filteredConnections]);

  const handleSaveConnection = (
    data: Omit<Connection, "id"> & { id?: string },
  ) => {
    if (data.id) {
      setConnections((prev) =>
        prev.map((c) => (c.id === data.id ? { ...c, ...data } : c)),
      );
    } else {
      const newConn: Connection = {
        ...data,
        id: `c${Date.now()}`,
      };
      setConnections((prev) => [...prev, newConn]);
    }
    setConnModal({ open: false, mode: "add" });
  };

  const handleSaveGroup = (data: Omit<Group, "id"> & { id?: string }) => {
    if (data.id) {
      setGroups((prev) =>
        prev.map((g) => (g.id === data.id ? { ...g, ...data } : g)),
      );
    } else {
      const newGroup: Group = { ...data, id: `g${Date.now()}` };
      setGroups((prev) => [...prev, newGroup]);
    }
    setGroupModal({ open: false, mode: "add" });
  };

  const handleDeleteConnection = () => {
    if (deleteConfirm.connection) {
      setConnections((prev) =>
        prev.filter((c) => c.id !== deleteConfirm.connection!.id),
      );
      setDeleteConfirm({ open: false });
    }
  };

  const handleDeleteGroup = () => {
    if (deleteGroupConfirm.group) {
      const groupId = deleteGroupConfirm.group.id;
      setConnections((prev) =>
        prev.map((c) => (c.groupId === groupId ? { ...c, groupId: null } : c)),
      );
      setGroups((prev) => prev.filter((g) => g.id !== groupId));
      setDeleteGroupConfirm({ open: false });
    }
  };

  const handleToggleFavorite = (conn: Connection) => {
    setConnections((prev) =>
      prev.map((c) => (c.id === conn.id ? { ...c, favorite: !c.favorite } : c)),
    );
  };

  const handleToggleCloseToTray = (val: boolean) => {
    setCloseToTray(val);
    localStorage.setItem("closeToTray", String(val));
    invoke("set_close_to_tray", { value: val });
  };

  const handleConnect = async (conn: Connection) => {
    setConnectingId(conn.id);
    try {
      if (conn.protocol === "RDP") {
        await invoke("connect_rdp", {
          host: conn.host,
          port: conn.port,
          username: conn.username,
          password: conn.password ?? "",
        });
      } else if (conn.protocol === "SSH") {
        await invoke("connect_ssh", {
          host: conn.host,
          port: conn.port,
          username: conn.username,
          keyPath: conn.keyPath ?? null,
        });
      }
      setConnections((prev) =>
        prev.map((c) =>
          c.id === conn.id
            ? { ...c, lastConnected: new Date().toISOString() }
            : c,
        ),
      );
    } catch (e) {
      console.error("Błąd połączenia:", e);
    } finally {
      setConnectingId(null);
    }
  };

  const ungrouped = groupedConnections.get("__ungrouped") ?? [];

  if (!loaded) return null;

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: "var(--bg-secondary)" }}>
      <TopBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddConnection={() => setConnModal({ open: true, mode: "add" })}
        onAddGroup={() => setGroupModal({ open: true, mode: "add" })}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <div
        className="flex-1 overflow-y-auto mx-4 my-3 pr-2"
        style={{ backgroundColor: "var(--bg-secondary)", scrollbarGutter: "stable" }}
      >
        {groups.map((group) => {
          const conns = groupedConnections.get(group.id);
          if (!conns || conns.length === 0) return null;
          return (
            <GroupSection
              key={group.id}
              group={group}
              connections={conns}
              defaultExpanded={true}
              connectingId={connectingId}
              onConnect={handleConnect}
              onEdit={(conn) =>
                setConnModal({ open: true, mode: "edit", connection: conn })
              }
              onDelete={(conn) =>
                setDeleteConfirm({ open: true, connection: conn })
              }
              onEditGroup={(g) =>
                setGroupModal({ open: true, mode: "edit", group: g })
              }
              onDeleteGroup={(g) =>
                setDeleteGroupConfirm({ open: true, group: g })
              }
              onToggleFavorite={handleToggleFavorite}
            />
          );
        })}

        {ungrouped.length > 0 && (
          <GroupSection
            group={{ id: "__ungrouped", name: "Bez grupy", color: "var(--text-secondary)" }}
            connections={ungrouped}
            defaultExpanded={true}
            editable={false}
            connectingId={connectingId}
            onConnect={handleConnect}
            onEdit={(conn) =>
              setConnModal({ open: true, mode: "edit", connection: conn })
            }
            onDelete={(conn) =>
              setDeleteConfirm({ open: true, connection: conn })
            }
            onEditGroup={() => {}}
            onDeleteGroup={() => {}}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {filteredConnections.length === 0 && (
          <div
            className="flex items-center justify-center h-40 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Brak pasujacych polaczen
          </div>
        )}
      </div>

      {connModal.open && (
        <ConnectionModal
          mode={connModal.mode}
          connection={connModal.connection}
          groups={groups}
          onSave={handleSaveConnection}
          onClose={() => setConnModal({ open: false, mode: "add" })}
        />
      )}

      {groupModal.open && (
        <GroupModal
          mode={groupModal.mode}
          group={groupModal.group}
          onSave={handleSaveGroup}
          onClose={() => setGroupModal({ open: false, mode: "add" })}
        />
      )}

      {settingsOpen && (
        <SettingsModal
          activeTheme={activeTheme}
          activeThemeId={activeThemeId}
          allThemes={allThemes}
          customThemes={customThemes}
          onSelectTheme={setTheme}
          onSaveCustomTheme={saveCustomTheme}
          onDeleteCustomTheme={deleteCustomTheme}
          closeToTray={closeToTray}
          onToggleCloseToTray={handleToggleCloseToTray}
          onClose={() => setSettingsOpen(false)}
          connections={connections}
          groups={groups}
          onImport={(newConns, newGroups) => {
            setConnections(newConns);
            setGroups(newGroups);
            setSettingsOpen(false);
          }}
        />
      )}

      {deleteConfirm.open && deleteConfirm.connection && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setDeleteConfirm({ open: false })}
        >
          <div
            className="rounded-lg p-6 w-80 shadow-xl"
            style={{ backgroundColor: "var(--bg-secondary)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className="text-sm font-semibold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Usuń połączenie
            </h3>
            <p
              className="text-xs mb-4"
              style={{ color: "var(--text-secondary)" }}
            >
              Czy na pewno chcesz usunąć <strong style={{ color: "var(--text-primary)" }}>{deleteConfirm.connection.name}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirm({ open: false })}
                className="px-3 py-1.5 rounded text-xs font-medium transition-colors"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  color: "var(--text-primary)",
                }}
              >
                Anuluj
              </button>
              <button
                onClick={handleDeleteConnection}
                className="px-3 py-1.5 rounded text-xs font-medium transition-colors"
                style={{
                  backgroundColor: "var(--accent-red)",
                  color: "#fff",
                }}
              >
                Usuń
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteGroupConfirm.open && deleteGroupConfirm.group && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setDeleteGroupConfirm({ open: false })}
        >
          <div
            className="rounded-lg p-6 w-80 shadow-xl"
            style={{ backgroundColor: "var(--bg-secondary)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className="text-sm font-semibold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Usuń grupę
            </h3>
            <p
              className="text-xs mb-4"
              style={{ color: "var(--text-secondary)" }}
            >
              Czy na pewno chcesz usunąć grupę <strong style={{ color: "var(--text-primary)" }}>{deleteGroupConfirm.group.name}</strong>? Połączenia w tej grupie zostaną przeniesione do "Bez grupy".
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteGroupConfirm({ open: false })}
                className="px-3 py-1.5 rounded text-xs font-medium transition-colors"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  color: "var(--text-primary)",
                }}
              >
                Anuluj
              </button>
              <button
                onClick={handleDeleteGroup}
                className="px-3 py-1.5 rounded text-xs font-medium transition-colors"
                style={{
                  backgroundColor: "var(--accent-red)",
                  color: "#fff",
                }}
              >
                Usuń
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
