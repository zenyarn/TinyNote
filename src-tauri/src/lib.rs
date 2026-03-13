use dirs::home_dir;
use serde::Serialize;
use std::fs;
use std::path::{Path, PathBuf};
use std::time::UNIX_EPOCH;

const APP_DIRECTORY_NAME: &str = "NoteMark";
const WELCOME_NOTE_FILENAME: &str = "Welcome.md";
const DEFAULT_NOTE_BASENAME: &str = "Untitled";

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct NoteInfo {
    title: String,
    last_edit_time: u128,
}

fn root_dir() -> Result<PathBuf, String> {
    let home = home_dir().ok_or_else(|| "home directory not found".to_string())?;

    Ok(home.join(APP_DIRECTORY_NAME))
}

fn note_path(title: &str) -> Result<PathBuf, String> {
    Ok(root_dir()?.join(format!("{}.md", title)))
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
    let dir = root_dir()?;

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
    let dir = ensure_root_dir()?;

    ensure_welcome_note(&dir)?;

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
fn create_note() -> Result<Option<String>, String> {
    let dir = ensure_root_dir()?;
    let title = next_untitled_name(&dir)?;
    let path = dir.join(format!("{}.md", title));

    fs::write(path, "").map_err(|err| err.to_string())?;

    Ok(Some(title))
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
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_notes,
            read_note,
            write_note,
            create_note,
            delete_note
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
