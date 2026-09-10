// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn extract_pdf_text(file_path: String) -> Result<String, String> {
    // pdf_extract reads the file and pulls the text layer
    match pdf_extract::extract_text(&file_path) {
        Ok(text) => Ok(text),
        Err(e) => Err(format!("Failed to read PDF: {}", e)),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, extract_pdf_text])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
