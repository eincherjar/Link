<div align="center">

# Link

**Menedżer połączeń SSH i RDP**

Zarządzaj swoimi połączeniami zdalnymi z jednego miejsca. Szybki, lekki, z豐富nymi motywami.

[![GitHub release](https://img.shields.io/badge/release-v0.1.0-green)](https://github.com/eincherjar/link/releases)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Windows-0078d4)](https://github.com/eincherjar/link/releases)

</div>

---

## Screenshots

<!-- Dodaj tutaj screeny aplikacji -->

| Ciemny motyw | Fioletowy motyw |
|:---:|:---:|
| ![Dark](screenshots/dark.png) | ![Purple](screenshots/purple.png) |

| Zarządzanie połączeniami | Edytor motywów | Nowe połączenie | Nowa grupa |
|:---:|:---:|
| ![Connections](screenshots/connections.png) | ![Theme Editor](screenshots/theme-editor.png) | ![Theme Editor](screenshots/new-connection.png) | ![Theme Editor](screenshots/new-group.png) |

---

## Funkcje

- **Połączenia SSH i RDP** — uruchamiaj bezpośrednio z aplikacji
- **Grupy** — organizuj połączenia z kolorowym sortowaniem
- **Motywy** — 5 wbudowanych + twórz własne z pełnym edytorem kolorów
- **System tray** — minimalizuj do tacki systemowej
- **Autostart** — uruchamiaj z systemem
- **Eksport/Import** — dziel się konfiguracją między urządzeniami
- **Wyszukiwanie** — po nazwie, hoście, userze, protokole, grupie
- **Skróty klawiszowe** — `Ctrl+F` szukaj, `Ctrl+N` nowe połączenie, `Ctrl+G` nowa grupa, `Esc` zamknij

---

## Instalacja

Pobierz najnowszą wersję z [Releases](https://github.com/eincherjar/link/releases):

| Format | Opis |
|--------|------|
| `Link_0.1.0_x64_en-US.msi` | Installer MSI (Windows Installer) |
| `Link_0.1.0_x64-setup.exe` | Installer NSIS |

---

## Budowanie ze źródeł

Wymagania:
- [Node.js](https://nodejs.org/) 18+
- [Rust](https://rustup.rs/)
- [Tauri Prerequisites](https://tauri.app/start/prerequisites/)

```bash
# Klonuj repo
git clone https://github.com/eincherjar/link.git
cd link

# Instaluj zależności
npm install

# Uruchom w trybie deweloperskim
npm run tauri dev

# Zbuduj produkcję
npm run tauri build
```

---

## Technologie

| Warstwa | Technologia |
|---------|-------------|
| Frontend | React 19, Vite 8, Tailwind CSS v4 |
| Backend | Tauri v2, Rust |
| Ikony | Lucide React + custom Tabler SVGs |
| Motywy | Dynamic CSS variables z edytorem w UI |

---

## Struktura projektu

```
link/
├── src/
│   ├── components/      # Komponenty UI
│   │   ├── TopBar.tsx           # Pasek narzędzi
│   │   ├── GroupSection.tsx     # Sekcja grup
│   │   ├── ConnectionModal.tsx  # Modal połączenia
│   │   ├── GroupModal.tsx       # Modal grupy
│   │   ├── SettingsModal.tsx    # Ustawienia + edytor motywów
│   │   ├── CustomSelect.tsx     # Niestandardowy select
│   │   └── StatusBar.tsx        # Pasek statusu
│   ├── hooks/
│   │   └── useTheme.ts          # Hook motywów
│   ├── types/
│   │   └── index.ts             # Typy TypeScript
│   ├── themes.ts                # Wbudowane motywy
│   ├── App.tsx                  # Główny komponent
│   └── index.css                # Style globalne
├── src-tauri/
│   ├── src/lib.rs               # Logika Rust (SSH, RDP, tray)
│   ├── icons/                   # Ikony aplikacji
│   └── tauri.conf.json          # Konfiguracja Tauri
└── package.json
```

---

## Licencja

MIT

---

<div align="center">

Zbudowane z ❤️ using [Tauri](https://tauri.app), [React](https://react.dev) i [Rust](https://www.rust-lang.org)

</div>
