import {
    Search,
    X,
} from "lucide-react";

function DeviceImacPlus({ size = 24 }: { size?: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.5 17h-8.5a1 1 0 0 1 -1 -1v-12a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v8.5" />
            <path d="M3 13h13.5" />
            <path d="M8 21h4.5" />
            <path d="M10 17l-.5 4" />
            <path d="M16 19h6" />
            <path d="M19 16v6" />
        </svg>
    );
}

function FolderPlus({ size = 24 }: { size?: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19h-7a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v3.5" />
            <path d="M16 19h6" />
            <path d="M19 16v6" />
        </svg>
    );
}

function Settings({ size = 24 }: { size?: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065" />
            <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
        </svg>
    );
}

interface TopBarProps {
    searchQuery: string;
    onSearchChange: (q: string) => void;
    onAddConnection: () => void;
    onAddGroup: () => void;
    onOpenSettings: () => void;
}

export function TopBar({
    searchQuery,
    onSearchChange,
    onAddConnection,
    onAddGroup,
    onOpenSettings,
}: TopBarProps) {
    return (
        <div
            className="shrink-0"
            style={{
                backgroundColor: "var(--bg-secondary)",
            }}
        >
            <div className="mx-4 py-2.5">
                <div className="flex items-center gap-2 flex-wrap">

                    <div
                        className="flex-1 min-w-0 flex items-center gap-1.5 px-2 py-1 rounded-lg"
                        style={{ backgroundColor: "var(--bg-tertiary)" }}
                    >
                        <input
                            id="search-input"
                            type="text"
                            placeholder="Szukaj..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="bg-transparent border-none outline-none text-xs min-w-0 flex-1 placeholder-opacity-50"
                            style={{ color: "var(--text-primary)" }}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => onSearchChange("")}
                                className="shrink-0 p-0.5 rounded transition-colors hover:bg-[var(--bg-secondary)]"
                                style={{ color: "var(--text-secondary)" }}
                            >
                                <X size={12} />
                            </button>
                        )}
                        <Search size={12} className="shrink-0" style={{ color: "var(--text-secondary)" }} />
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                        <button
                            onClick={onAddConnection}
                            className="p-1.5 rounded transition-colors hover:bg-[var(--bg-tertiary)]"
                            style={{ color: "var(--accent)" }}
                            title="Dodaj połączenie"
                        >
                            <DeviceImacPlus size={18} />
                        </button>

                        <button
                            onClick={onAddGroup}
                            className="p-1.5 rounded transition-colors hover:bg-[var(--bg-tertiary)]"
                            style={{ color: "var(--accent-blue)" }}
                            title="Dodaj grupę"
                        >
                            <FolderPlus size={18} />
                        </button>
                    </div>

                    <div
                        className="w-px h-4 shrink-0"
                        style={{ backgroundColor: "var(--border)" }}
                    />

                    <button
                        onClick={onOpenSettings}
                        className="p-1.5 rounded transition-colors hover:bg-[var(--bg-tertiary)] shrink-0"
                        style={{ color: "var(--text-secondary)" }}
                        title="Ustawienia"
                    >
                        <Settings size={18} />
                    </button>

                </div>
            </div>
        </div>
    );
}
