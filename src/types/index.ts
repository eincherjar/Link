export type Protocol = "SSH" | "RDP";

export interface Connection {
  id: string;
  name: string;
  protocol: Protocol;
  host: string;
  port: number;
  username: string;
  password?: string;
  authType: "password" | "key";
  keyPath?: string;
  groupId: string | null;
  lastConnected: string | null;
  favorite: boolean;
}

export interface Group {
  id: string;
  name: string;
  color: string;
}

export interface Session {
  id: string;
  connectionId: string;
  startedAt: string;
  endedAt: string | null;
  status: "active" | "closed" | "error";
}

export interface ThemeConfig {
  id: string;
  name: string;
  builtIn?: boolean;
  colors: {
    bgPrimary: string;
    bgSecondary: string;
    bgTertiary: string;
    accent: string;
    accentBlue: string;
    accentPurple: string;
    accentRed: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
  };
}

export type Theme = "dark" | "light";
