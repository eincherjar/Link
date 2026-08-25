use serde::{Deserialize, Serialize};
use std::fs;
use std::os::windows::process::CommandExt;
use std::sync::atomic::{AtomicBool, Ordering};
use tauri::Manager;
use tauri::menu::{MenuBuilder, MenuItemBuilder};
use tauri::tray::{MouseButton, MouseButtonState, TrayIconEvent, TrayIconBuilder};
use tauri::image::Image;
use tauri::include_image;

const TRAY_ICON: Image<'_> = include_image!("icons/32x32.png");

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Connection {
    pub id: String,
    pub name: String,
    pub protocol: String,
    pub host: String,
    pub port: u16,
    pub username: String,
    pub password: Option<String>,
    pub auth_type: String,
    pub key_path: Option<String>,
    pub group_id: Option<String>,
    pub last_connected: Option<String>,
    pub favorite: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Group {
    pub id: String,
    pub name: String,
    pub color: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Session {
    pub id: String,
    pub connection_id: String,
    pub started_at: String,
    pub ended_at: Option<String>,
    pub status: String,
}

struct AppState {
    close_to_tray: AtomicBool,
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! Welcome to Link.", name)
}

#[tauri::command]
fn set_close_to_tray(state: tauri::State<AppState>, value: bool) {
    state.close_to_tray.store(value, Ordering::SeqCst);
}

#[tauri::command]
fn connect_rdp(host: String, port: u16, username: String, password: String) -> Result<(), String> {
    std::thread::spawn(move || {
        let target = format!("TERMSRV/{}:{}", host, port);

        let _ = std::process::Command::new("cmdkey")
            .args([&format!("/delete:{}", target)])
            .stdout(std::process::Stdio::piped())
            .stderr(std::process::Stdio::piped())
            .creation_flags(0x08000000)
            .spawn()
            .and_then(|mut c| c.wait());

        let _ = std::process::Command::new("cmdkey")
            .args([&target, &format!("/user:{}", username), &format!("/pass:{}", password)])
            .stdout(std::process::Stdio::piped())
            .stderr(std::process::Stdio::piped())
            .creation_flags(0x08000000)
            .spawn()
            .and_then(|mut c| c.wait());

        let address = format!("{}:{}", host, port);
        let _ = std::process::Command::new("mstsc.exe")
            .args([&format!("/v:{}", address)])
            .spawn();

        std::thread::sleep(std::time::Duration::from_secs(10));
        let _ = std::process::Command::new("cmdkey")
            .args([&format!("/delete:{}", target)])
            .stdout(std::process::Stdio::piped())
            .stderr(std::process::Stdio::piped())
            .creation_flags(0x08000000)
            .spawn()
            .and_then(|mut c| c.wait());
    });

    Ok(())
}

#[tauri::command]
fn connect_ssh(host: String, port: u16, username: String, key_path: Option<String>) -> Result<(), String> {
    let mut ssh_args: Vec<&str> = vec![];
    let key_path_str;
    if let Some(ref kp) = key_path {
        if !kp.is_empty() {
            key_path_str = kp.clone();
            ssh_args.push("-i");
            ssh_args.push(&key_path_str);
        }
    }

    let port_str = port.to_string();
    let target = format!("{}@{}", username, host);
    ssh_args.push("-p");
    ssh_args.push(&port_str);
    ssh_args.push(&target);

    std::process::Command::new("cmd")
        .args(["/c", "start", "cmd", "/k", "ssh"])
        .args(&ssh_args)
        .spawn()
        .map_err(|e| format!("Nie udało się uruchomić SSH: {}", e))?;

    Ok(())
}

#[tauri::command]
fn export_data(path: String, data: String) -> Result<(), String> {
    fs::write(&path, data).map_err(|e| e.to_string())
}

#[tauri::command]
fn import_data(path: String) -> Result<String, String> {
    fs::read_to_string(&path).map_err(|e| e.to_string())
}

#[tauri::command]
fn save_app_data(app: tauri::AppHandle, data: String) -> Result<(), String> {
    let dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Nie udało się uzyskać katalogu danych: {}", e))?;
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    fs::write(dir.join("link.json"), data).map_err(|e| e.to_string())
}

#[tauri::command]
fn load_app_data(app: tauri::AppHandle) -> Result<String, String> {
    let dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Nie udało się uzyskać katalogu danych: {}", e))?;
    let path = dir.join("link.json");
    if path.exists() {
        fs::read_to_string(path).map_err(|e| e.to_string())
    } else {
        Ok("".to_string())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            Some(vec!["--minimized"]),
        ))
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .manage(AppState {
            close_to_tray: AtomicBool::new(true),
        })
        .setup(|app| {
            let show = MenuItemBuilder::with_id("show", "Pokaż okno")
                .build(app)?;
            let quit = MenuItemBuilder::with_id("quit", "Zamknij")
                .build(app)?;
            let menu = MenuBuilder::new(app)
                .item(&show)
                .item(&quit)
                .build()?;

            let _tray = TrayIconBuilder::new()
                .icon(TRAY_ICON.clone())
                .menu(&menu)
                .tooltip("Link - SSH/RDP Manager")
                .on_menu_event(move |app, event| {
                    match event.id.as_ref() {
                        "show" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                        "quit" => {
                            app.exit(0);
                        }
                        _ => {}
                    }
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                })
                .build(app)?;

            if let Some(window) = app.get_webview_window("main") {
                let icon = include_image!("icons/128x128.png");
                let _ = window.set_icon(icon);
            }

            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                let state = window.state::<AppState>();
                if state.close_to_tray.load(Ordering::SeqCst) {
                    let _ = window.hide();
                    api.prevent_close();
                }
            }
        })
        .invoke_handler(tauri::generate_handler![greet, set_close_to_tray, export_data, import_data, save_app_data, load_app_data, connect_rdp, connect_ssh])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
