use wasm_bindgen::prelude::*;
use x3f_core::{ProcessOptions, Reader};

fn js_error(context: &str, error: impl std::fmt::Display) -> JsValue {
    JsValue::from_str(&format!("{context}: {error}"))
}

/// Convert one Sigma X3F byte stream into a Linear DNG byte stream.
#[wasm_bindgen]
pub fn convert_x3f_to_dng(input: &[u8], compress: bool, denoise: bool) -> Result<Vec<u8>, JsValue> {
    console_error_panic_hook::set_once();

    let mut reader =
        Reader::from_bytes(input).map_err(|error| js_error("X3Fを読み込めません", error))?;
    reader
        .load_camf()
        .map_err(|error| js_error("カメラ情報を読み込めません", error))?;
    reader
        .load_property_list()
        .map_err(|error| js_error("撮影情報を読み込めません", error))?;
    reader
        .load_raw()
        .map_err(|error| js_error("Foveon RAWデータを展開できません", error))?;

    let mut options = ProcessOptions::default();
    options.compress = compress;
    options.denoise_intensity = if denoise { 10 } else { 0 };
    options.dng_highlight_recovery = false;
    options.opcodes_dir = None;

    reader
        .dump_dng_to_vec(&options)
        .map_err(|error| js_error("DNGを書き出せません", error))
}
