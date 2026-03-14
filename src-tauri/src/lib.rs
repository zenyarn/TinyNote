use dirs::{config_dir, home_dir};
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Path, PathBuf};
use std::time::UNIX_EPOCH;

const APP_DIRECTORY_NAME: &str = "TinyNote";
const WELCOME_NOTE_FILENAME: &str = "Welcome.md";
const DEFAULT_NOTE_BASENAME: &str = "Untitled";
const SETTINGS_FILENAME: &str = "settings.json";

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct NoteInfo {
    title: String,
    last_edit_time: u128,
}

#[derive(Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct AppSettings {
    workspace_dir: Option<String>,
}

fn default_root_dir() -> Result<PathBuf, String> {
    let home = home_dir().ok_or_else(|| "home directory not found".to_string())?;

    Ok(home.join(APP_DIRECTORY_NAME))
}

fn settings_dir() -> Result<PathBuf, String> {
    let config = config_dir().ok_or_else(|| "config directory not found".to_string())?;
    let dir = config.join(APP_DIRECTORY_NAME);

    fs::create_dir_all(&dir).map_err(|err| err.to_string())?;

    Ok(dir)
}

fn settings_path() -> Result<PathBuf, String> {
    Ok(settings_dir()?.join(SETTINGS_FILENAME))
}

fn read_settings() -> Result<AppSettings, String> {
    let path = settings_path()?;

    if !path.exists() {
        return Ok(AppSettings::default());
    }

    let content = fs::read_to_string(path).map_err(|err| err.to_string())?;

    serde_json::from_str(&content).map_err(|err| err.to_string())
}

fn write_settings(settings: &AppSettings) -> Result<(), String> {
    let path = settings_path()?;
    let content = serde_json::to_string_pretty(settings).map_err(|err| err.to_string())?;

    fs::write(path, content).map_err(|err| err.to_string())
}

fn current_root_dir() -> Result<(PathBuf, bool), String> {
    let settings = read_settings()?;

    if let Some(workspace_dir) = settings.workspace_dir {
        return Ok((PathBuf::from(workspace_dir), false));
    }

    Ok((default_root_dir()?, true))
}

fn note_path(title: &str) -> Result<PathBuf, String> {
    Ok(current_root_dir()?.0.join(format!("{}.md", title)))
}

fn file_last_edit_time(path: &Path) -> Result<u128, String> {
    let modified = fs::metadata(path)
        .map_err(|err| err.to_string())?
        .modified()
        .map_err(|err| err.to_string())?;

    Ok(modified
        .duration_since(UNIX_EPOCH)
        .map_err(|err| err.to_string())?
        .as_millis())
}

fn ensure_root_dir() -> Result<PathBuf, String> {
    let dir = current_root_dir()?.0;

    fs::create_dir_all(&dir).map_err(|err| err.to_string())?;

    Ok(dir)
}

fn ensure_welcome_note(dir: &Path) -> Result<(), String> {
    let has_markdown = fs::read_dir(dir)
        .map_err(|err| err.to_string())?
        .filter_map(Result::ok)
        .any(|entry| {
            entry
                .path()
                .extension()
                .and_then(|ext| ext.to_str())
                .map(|ext| ext == "md")
                .unwrap_or(false)
        });

    if has_markdown {
      return Ok(());
    }

    let welcome_path = dir.join(WELCOME_NOTE_FILENAME);
    let welcome_content = include_str!("../resources/welcome_note.md");

    fs::write(welcome_path, welcome_content).map_err(|err| err.to_string())
}

fn note_infos_from_dir(dir: &Path) -> Result<Vec<NoteInfo>, String> {
    let mut notes = Vec::new();

    for entry in fs::read_dir(dir).map_err(|err| err.to_string())? {
        let entry = entry.map_err(|err| err.to_string())?;
        let path = entry.path();

        if path.extension().and_then(|ext| ext.to_str()) != Some("md") {
            continue;
        }

        let title = path
            .file_stem()
            .and_then(|stem| stem.to_str())
            .ok_or_else(|| "invalid note filename".to_string())?
            .to_string();

        notes.push(NoteInfo {
            title,
            last_edit_time: file_last_edit_time(&path)?,
        });
    }

    Ok(notes)
}

fn next_untitled_name(dir: &Path) -> Result<String, String> {
    let default_path = dir.join(format!("{}.md", DEFAULT_NOTE_BASENAME));

    if !default_path.exists() {
        return Ok(DEFAULT_NOTE_BASENAME.to_string());
    }

    let mut index = 1;

    loop {
        let candidate = format!("{}{}", DEFAULT_NOTE_BASENAME, index);

        if !dir.join(format!("{}.md", candidate)).exists() {
            return Ok(candidate);
        }

        index += 1;
    }
}

#[tauri::command]
fn get_notes() -> Result<Vec<NoteInfo>, String> {
    let (dir, is_default_dir) = current_root_dir()?;

    fs::create_dir_all(&dir).map_err(|err| err.to_string())?;

    if is_default_dir {
        ensure_welcome_note(&dir)?;
    }

    note_infos_from_dir(&dir)
}

#[tauri::command]
fn read_note(title: String) -> Result<String, String> {
    let path = note_path(&title)?;

    fs::read_to_string(path).map_err(|err| err.to_string())
}

#[tauri::command]
fn write_note(title: String, content: String) -> Result<(), String> {
    let path = note_path(&title)?;

    fs::write(path, content).map_err(|err| err.to_string())
}

#[tauri::command]
fn create_note(title: Option<String>) -> Result<Option<String>, String> {
    let dir = ensure_root_dir()?;
    let title = match title {
        Some(title) if !title.trim().is_empty() => title,
        _ => next_untitled_name(&dir)?,
    };
    let path = dir.join(format!("{}.md", title));

    if path.exists() {
        return Err("a note with this title already exists".to_string());
    }

    fs::write(path, "").map_err(|err| err.to_string())?;

    Ok(Some(title))
}

#[tauri::command]
fn get_workspace_dir() -> Result<String, String> {
    Ok(current_root_dir()?.0.to_string_lossy().to_string())
}

#[tauri::command]
fn set_workspace_dir(path: String) -> Result<String, String> {
    let dir = PathBuf::from(path);

    if !dir.exists() {
        return Err("selected folder does not exist".to_string());
    }

    if !dir.is_dir() {
        return Err("selected path is not a folder".to_string());
    }

    let resolved_dir = fs::canonicalize(dir).map_err(|err| err.to_string())?;

    write_settings(&AppSettings {
        workspace_dir: Some(resolved_dir.to_string_lossy().to_string()),
    })?;

    Ok(resolved_dir.to_string_lossy().to_string())
}

#[tauri::command]
fn rename_note(title: String, new_title: String) -> Result<Option<String>, String> {
    let normalized_title = new_title.trim();

    if normalized_title.is_empty() {
        return Err("note title cannot be empty".to_string());
    }

    if normalized_title == title {
        return Ok(None);
    }

    let current_path = note_path(&title)?;

    if !current_path.exists() {
        return Err("note not found".to_string());
    }

    let next_path = note_path(normalized_title)?;

    if next_path.exists() {
        return Err("a note with this title already exists".to_string());
    }

    fs::rename(current_path, next_path).map_err(|err| err.to_string())?;

    Ok(Some(normalized_title.to_string()))
}

#[tauri::command]
fn delete_note(title: String) -> Result<bool, String> {
    let path = note_path(&title)?;

    if !path.exists() {
        return Ok(false);
    }

    fs::remove_file(path).map_err(|err| err.to_string())?;

    Ok(true)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_workspace_dir,
            get_notes,
            read_note,
            write_note,
            create_note,
            set_workspace_dir,
            rename_note,
            delete_note
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
