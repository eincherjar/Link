export const pl: Record<string, string> = {
  // Common
  "common.cancel": "Anuluj",
  "common.save": "Zapisz",
  "common.add": "Dodaj",
  "common.delete": "Usuń",
  "common.name": "Nazwa",

  // TopBar
  "topbar.search": "Szukaj...",
  "topbar.addConnection": "Dodaj połączenie",
  "topbar.addGroup": "Dodaj grupę",
  "topbar.settings": "Ustawienia",

  // GroupSection
  "group.editGroup": "Edytuj grupę",
  "group.deleteGroup": "Usuń grupę",
  "group.connect": "Połącz",
  "group.edit": "Edytuj",
  "group.delete": "Usuń",
  "group.removeFavorite": "Usuń z ulubionych",
  "group.addFavorite": "Dodaj do ulubionych",
  "group.ungrouped": "Bez grupy",

  // ConnectionModal
  "connection.new": "Nowe połączenie",
  "connection.edit": "Edytuj połączenie",
  "connection.host": "Host",
  "connection.port": "Port",
  "connection.username": "Użytkownik",
  "connection.authType": "Typ auth",
  "connection.authPassword": "Hasło",
  "connection.authKey": "Klucz SSH",
  "connection.keyPath": "Ścieżka do klucza",
  "connection.group": "Grupa",
  "connection.noGroup": "Brak",

  // GroupModal
  "group.new": "Nowa grupa",
  "group.editTitle": "Edytuj grupę",
  "group.color": "Kolor",
  "group.customColor": "Własny kolor",
  "group.colorRed": "Czerwony",
  "group.colorBlue": "Niebieski",
  "group.colorGreen": "Zielony",
  "group.colorPurple": "Fioletowy",
  "group.colorYellow": "Żółty",
  "group.colorOrange": "Pomarańczowy",

  // Settings
  "settings.title": "Ustawienia",
  "settings.language": "Język",
  "settings.theme": "Motyw",
  "settings.newTheme": "Nowy",
  "settings.newLang": "+ Nowy",
  "settings.deleteTheme": "Usuń motyw",
  "settings.themeName": "Nazwa motywu",
  "settings.themeCopy": "(kopie)",
  "settings.autostart": "Uruchom z systemem",
  "settings.startMinimized": "Uruchom zminimalizowane",
  "settings.closeToTray": "Zamknij do tray",
  "settings.shortcuts": "Skróty klawiszowe",
  "settings.shortcutSearch": "Szukaj",
  "settings.shortcutNewConnection": "Nowe połączenie",
  "settings.shortcutNewGroup": "Nowa grupa",
  "settings.shortcutClose": "Zamknij okno",
  "settings.exportData": "Eksportuj dane",
  "settings.importData": "Importuj dane",
  "settings.exportThemes": "Eksportuj motywy",
  "settings.importThemes": "Importuj motywy",

  // Theme editor colors
  "theme.bgPrimary": "Tło główne",
  "theme.bgSecondary": "Tło drugorzędne",
  "theme.bgTertiary": "Tło trzeciorzędne",
  "theme.accent": "Akcent",
  "theme.accentBlue": "Akcent niebieski",
  "theme.accentPurple": "Akcent fioletowy",
  "theme.accentRed": "Akcent czerwony",
  "theme.textPrimary": "Tekst główny",
  "theme.textSecondary": "Tekst drugorzędny",
  "theme.border": "Obramowanie",

  // Theme names
  "theme.dark": "Ciemny",
  "theme.light": "Jasny",
  "theme.purple": "Fioletowy",
  "theme.ocean": "Ocean",
  "theme.sunset": "Zachód słońca",

  // Delete confirmations
  "confirm.deleteConnection": "Usuń połączenie",
  "confirm.deleteConnectionText": "Czy na pewno chcesz usunąć",
  "confirm.deleteGroup": "Usuń grupę",
  "confirm.deleteGroupText": 'Czy na pewno chcesz usunąć grupę',
  "confirm.deleteGroupHint": 'Połączenia w tej grupie zostaną przeniesione do "Bez grupy".',

  // Empty state
  "empty.noConnections": "Brak pasujących połączeń",

  // Import preview
  "import.title": "Podgląd importu",
  "import.currentConnections": "Aktualne połączenia",
  "import.importedConnections": "Importowane połączenia",
  "import.new": "Nowe",
  "import.duplicate": "Duplikat",
  "import.willBeReplaced": "Zostanie zastąpione",
  "import.willBeSkipped": "Zostanie pominięte",
  "import.noChanges": "Brak zmian",
  "import.strategy": "Strategia importu",
  "import.replace": "Zastąp wszystko",
  "import.replaceDesc": "Usunie aktualne dane i zastąpi je importowanymi",
  "import.merge": "Dodaj do istniejących",
  "import.mergeDesc": "Doda nowe, pomija istniejące duplikaty",
  "import.skip": "Pominij duplikaty",
  "import.skipDesc": "Dodaje tylko nowe, istniejące pozostają bez zmian",
  "import.confirm": "Importuj",
  "import.summary": "Dodano: {{added}}, Zastąpiono: {{replaced}}, Pominięto: {{skipped}}",

  // Clear all
  "settings.clearAll": "Wyczyść wszystko",
  "settings.clearAllConfirm": "Na pewno chcesz usunąć wszystkie połączenia i grupy? Tej operacji nie można cofnąć.",
  "settings.cleared": "Wszystkie dane zostały usunięte",

  // Language names
  "lang.pl": "Polski",
  "lang.en": "English",
} as const;
