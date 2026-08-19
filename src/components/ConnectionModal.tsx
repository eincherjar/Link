import { useState, useEffect } from "react";
import { X, Terminal, Monitor, Eye, EyeOff } from "lucide-react";
import { CustomSelect } from "./CustomSelect";
import type { Connection, Group, Protocol } from "../types";

interface ConnectionModalProps {
  mode: "add" | "edit";
  connection?: Connection;
  groups: Group[];
  onSave: (conn: Omit<Connection, "id"> & { id?: string }) => void;
  onClose: () => void;
}

export function ConnectionModal({
  mode,
  connection,
  groups,
  onSave,
  onClose,
}: ConnectionModalProps) {
  const [host, setHost] = useState(connection?.host ?? "");
  const [port, setPort] = useState(connection?.port?.toString() ?? "22");
  const [name, setName] = useState(connection?.name ?? "");
  const [nameEdited, setNameEdited] = useState(mode === "edit");
  const [protocol, setProtocol] = useState<Protocol>(
    connection?.protocol ?? "SSH",
  );
  const [username, setUsername] = useState(connection?.username ?? "");
  const [password, setPassword] = useState(connection?.password ?? "");
  const [showPassword, setShowPassword] = useState(false);
  const [authType, setAuthType] = useState<"password" | "key">(
    connection?.authType ?? "password",
  );
  const [keyPath, setKeyPath] = useState(connection?.keyPath ?? "");
  const [groupId, setGroupId] = useState(connection?.groupId ?? "");

  useEffect(() => {
    if (!nameEdited && host) {
      setName(host.split(":")[0].replace(/[^a-zA-Z0-9._-]/g, "-"));
    } else if (!nameEdited && !host) {
      setName("");
    }
  }, [host, nameEdited]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: connection?.id,
      name,
      protocol,
      host,
      port: parseInt(port, 10),
      username,
      password,
      authType,
      keyPath: authType === "key" ? keyPath : undefined,
      groupId: groupId || null,
      lastConnected: connection?.lastConnected ?? null,
      favorite: connection?.favorite ?? false,
    });
  };

  const fieldStyle = {
    backgroundColor: "var(--bg-tertiary)",
    borderColor: "var(--border)",
    color: "var(--text-primary)",
  };

  const fieldClasses =
    "w-full h-8 px-2.5 rounded-lg text-xs border outline-none focus:ring-1";

  const isSSH = protocol === "SSH";

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
            {mode === "add" ? "Nowe połączenie" : "Edytuj połączenie"}
          </h2>
          <button onClick={onClose} style={{ color: "var(--text-secondary)" }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-4 py-4 space-y-3">
          <div className="flex gap-3">
            <div className="flex-[2]">
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Host
              </label>
              <input
                type="text"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                required
                placeholder="192.168.1.100"
                className={fieldClasses}
                style={fieldStyle}
              />
            </div>
            <div className="w-24">
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Port
              </label>
              <input
                type="number"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                required
                className={fieldClasses}
                style={fieldStyle}
              />
            </div>
          </div>

          <div>
            <label
              className="block text-xs font-medium mb-1.5"
              style={{ color: "var(--text-secondary)" }}
            >
              Nazwa
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameEdited(true);
              }}
              required
              className={fieldClasses}
              style={fieldStyle}
            />
          </div>

          <div className="flex gap-3">
            <div className="flex items-end gap-2 shrink-0">
              {(["SSH", "RDP"] as Protocol[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setProtocol(p);
                    setPort(p === "SSH" ? "22" : "3389");
                    if (p === "RDP") setAuthType("password");
                  }}
                  className="flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-medium border transition-colors shrink-0"
                  style={{
                    backgroundColor:
                      protocol === p ? "var(--accent)" : "var(--bg-tertiary)",
                    borderColor: "var(--border)",
                    color:
                      protocol === p
                        ? "var(--bg-primary)"
                        : "var(--text-secondary)",
                  }}
                >
                  {p === "SSH" ? (
                    <Terminal size={13} />
                  ) : (
                    <Monitor size={13} />
                  )}
                  {p}
                </button>
              ))}
            </div>
            <div className="flex-1">
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Grupa
              </label>
              <CustomSelect
                value={groupId}
                onChange={setGroupId}
                options={[
                  { value: "", label: "Brak" },
                  ...groups.map((g) => ({ value: g.id, label: g.name })),
                ]}
                style={fieldStyle}
              />
            </div>
          </div>

          <div>
            <label
              className="block text-xs font-medium mb-1.5"
              style={{ color: "var(--text-secondary)" }}
            >
              Użytkownik
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={fieldClasses}
              style={fieldStyle}
            />
          </div>

          {isSSH ? (
            <div className="flex gap-3 items-end">
              <div className="w-36 shrink-0">
                <label
                  className="block text-xs font-medium mb-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Typ auth
                </label>
                <CustomSelect
                  value={authType}
                  onChange={(v) => setAuthType(v as "password" | "key")}
                  options={[
                    { value: "password", label: "Hasło" },
                    { value: "key", label: "Klucz SSH" },
                  ]}
                  style={fieldStyle}
                />
              </div>
              <div className="flex-1">
                <label
                  className="block text-xs font-medium mb-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {authType === "password" ? "Hasło" : "Ścieżka do klucza"}
                </label>
                <div className="relative">
                  <input
                    key={authType}
                    type={authType === "password" && showPassword ? "text" : authType === "password" ? "password" : "text"}
                    value={authType === "password" ? password : keyPath}
                    onChange={(e) =>
                      authType === "password"
                        ? setPassword(e.target.value)
                        : setKeyPath(e.target.value)
                    }
                    placeholder={authType === "key" ? "~/.ssh/id_rsa" : ""}
                    className={`${fieldClasses} ${authType === "password" ? "pr-9" : "font-mono"}`}
                    style={fieldStyle}
                  />
                  {authType === "password" && (
                    <button
                      type="button"
                      tabIndex={-1}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setShowPassword((s) => !s);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Hasło
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${fieldClasses} pr-9`}
                  style={fieldStyle}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setShowPassword((s) => !s);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-9 rounded-lg text-xs font-medium border transition-colors"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-secondary)",
              }}
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="flex-1 h-9 rounded-lg text-xs font-medium transition-colors"
              style={{
                backgroundColor: "var(--accent)",
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
