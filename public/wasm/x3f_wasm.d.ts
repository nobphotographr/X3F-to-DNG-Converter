/* tslint:disable */
/* eslint-disable */

/**
 * Convert one Sigma X3F byte stream into a Linear DNG byte stream.
 */
export function convert_x3f_to_dng(input: Uint8Array, compress: boolean, denoise: boolean): Uint8Array;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly x3f_delete: (a: number) => number;
    readonly convert_x3f_to_dng: (a: number, b: number, c: number, d: number) => [number, number, number, number];
    readonly fmemopen: (a: number, b: number, c: number) => number;
    readonly x3f_new_from_file: (a: number) => number;
    readonly x3f_load_data: (a: number, b: number) => number;
    readonly x3f_get_raw: (a: number) => number;
    readonly x3f_get_digital_iso_gain: (a: number, b: number) => number;
    readonly x3f_get_bmt_to_xyz: (a: number, b: number, c: number) => number;
    readonly x3f_3x3_3x3_mul: (a: number, b: number, c: number) => void;
    readonly x3f_3x3_inverse: (a: number, b: number) => void;
    readonly x3f_get_camf_matrix: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => number;
    readonly x3f_get_gain: (a: number, b: number, c: number) => number;
    readonly x3f_get_camf_rect: (a: number, b: number, c: number, d: number, e: number) => number;
    readonly x3f_get_prop_entry: (a: number, b: number, c: number) => number;
    readonly x3f_get_wb: (a: number) => number;
    readonly x3f_get_image: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => number;
    readonly x3f_get_preview: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => number;
    readonly x3f_get_dng_shoulder_knee: () => number;
    readonly x3f_get_spatial_gain: (a: number, b: number, c: number) => number;
    readonly x3f_get_interp_merrill_type_spatial_gain: (a: number, b: number, c: number) => number;
    readonly x3f_get_classic_spatial_gain: (a: number, b: number, c: number) => number;
    readonly x3f_get_merrill_type_spatial_gain: (a: number, b: number, c: number) => number;
    readonly x3f_get_camf_property: (a: number, b: number, c: number, d: number) => number;
    readonly x3f_get_camf_matrix_var: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => number;
    readonly x3f_calc_spatial_gain: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => number;
    readonly x3f_cleanup_spatial_gain: (a: number, b: number) => void;
    readonly x3f_printf: (a: number, b: number, c: number) => void;
    readonly x3f_get_camf: (a: number) => number;
    readonly x3f_get_prop: (a: number) => number;
    readonly x3f_get_thumb_jpeg: (a: number) => number;
    readonly x3f_get_thumb_plain: (a: number) => number;
    readonly x3f_get_thumb_huffman: (a: number) => number;
    readonly fread: (a: number, b: number, c: number, d: number) => number;
    readonly x3f_err: (a: number) => number;
    readonly x3f_rust_huffman_decode: (a: number, b: number) => void;
    readonly x3f_rust_simple_decode: (a: number, b: number, c: number) => void;
    readonly x3f_load_image_block: (a: number, b: number) => number;
    readonly x3f_get_camf_text: (a: number, b: number, c: number) => number;
    readonly x3f_get_camf_float: (a: number, b: number, c: number) => number;
    readonly x3f_get_camf_float_vector: (a: number, b: number, c: number) => number;
    readonly x3f_get_camf_unsigned: (a: number, b: number, c: number) => number;
    readonly x3f_get_camf_signed: (a: number, b: number, c: number) => number;
    readonly x3f_get_camf_signed_vector: (a: number, b: number, c: number) => number;
    readonly x3f_get_camf_property_list: (a: number, b: number, c: number, d: number, e: number) => number;
    readonly x3f_get_camf_matrix_for_wb: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
    readonly x3f_get_max_raw: (a: number, b: number) => number;
    readonly x3f_image_area: (a: number, b: number) => number;
    readonly x3f_crop_area: (a: number, b: number, c: number) => number;
    readonly x3f_crop_area8: (a: number, b: number, c: number) => number;
    readonly x3f_crop_area_column: (a: number, b: number, c: number, d: number, e: number) => number;
    readonly x3f_image_area_qtop: (a: number, b: number) => number;
    readonly x3f_crop_area_camf: (a: number, b: number, c: number, d: number, e: number) => number;
    readonly x3f_crop_area8_camf: (a: number, b: number, c: number, d: number, e: number) => number;
    readonly x3f_3x3_diag: (a: number, b: number) => void;
    readonly x3f_3x3_ones: (a: number) => void;
    readonly x3f_sRGB_LUT: (a: number, b: number, c: number) => void;
    readonly x3f_3x1_print: (a: number, b: number) => void;
    readonly x3f_gamma_LUT: (a: number, b: number, c: number, d: number) => void;
    readonly x3f_3x1_invert: (a: number, b: number) => void;
    readonly x3f_LUT_lookup: (a: number, b: number, c: number) => number;
    readonly x3f_3x3_3x1_mul: (a: number, b: number, c: number) => void;
    readonly x3f_AdobeRGB_to_XYZ: (a: number) => void;
    readonly x3f_sRGB_to_XYZ: (a: number) => void;
    readonly x3f_XYZ_to_AdobeRGB: (a: number) => void;
    readonly x3f_XYZ_to_sRGB: (a: number) => void;
    readonly x3f_3x1_comp_mul: (a: number, b: number, c: number) => void;
    readonly x3f_3x3_identity: (a: number) => void;
    readonly x3f_ProPhotoRGB_to_XYZ: (a: number) => void;
    readonly x3f_XYZ_to_ProPhotoRGB: (a: number) => void;
    readonly x3f_CIERGB_to_XYZ: (a: number) => void;
    readonly x3f_cineon_log_LUT: (a: number, b: number, c: number, d: number) => void;
    readonly x3f_scalar_3x1_mul: (a: number, b: number, c: number) => void;
    readonly x3f_scalar_3x3_mul: (a: number, b: number, c: number) => void;
    readonly x3f_Bradford_D50_to_D65: (a: number) => void;
    readonly x3f_Bradford_D65_to_D50: (a: number) => void;
    readonly x3f_rust_true_decode: (a: number) => void;
    readonly get_conv: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => number;
    readonly x3f_get_raw_to_xyz: (a: number, b: number, c: number) => number;
    readonly x3f_set_cineon: (a: number) => void;
    readonly convert_data: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
    readonly get_highlight_params: (a: number, b: number) => void;
    readonly compute_chroma_prior: (a: number, b: number) => void;
    readonly chroma_lut_init_defaults: (a: number) => void;
    readonly chroma_lut_build_from_image: (a: number, b: number, c: number, d: number) => number;
    readonly chroma_lut_apply_pixel: (a: number, b: number, c: number) => number;
    readonly reconstruct_highlights: (a: number, b: number, c: number) => void;
    readonly repair_pix_apply_pixel: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => void;
    readonly run_denoising: (a: number, b: number) => number;
    readonly preprocess_data: (a: number, b: number, c: number, d: number) => number;
    readonly expand_quattro: (a: number, b: number, c: number) => number;
    readonly apply_highlight_clip_dng: (a: number, b: number, c: number, d: number) => void;
    readonly get_black_level: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
    readonly get_intermediate_bias: (a: number, b: number, c: number, d: number, e: number) => number;
    readonly get_max_intermediate: (a: number, b: number, c: number, d: number) => number;
    readonly interpolate_bad_pixels: (a: number, b: number, c: number) => void;
    readonly apply_wb_color_shading: (a: number, b: number, c: number) => number;
    readonly x3f_expand_quattro: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
    readonly chroma_lut_apply_pixel_bmt: (a: number, b: number, c: number) => number;
    readonly x3f_get_dng_highlight_scale: () => number;
    readonly x3f_set_dng_highlight_recovery: (a: number) => void;
    readonly build_sat_map: (a: number, b: number, c: number) => number;
    readonly repair_pix_init_defaults: (a: number) => void;
    readonly chroma_lut_apply_stats_print: (a: number, b: number) => void;
    readonly fclose: (a: number) => number;
    readonly fgetc: (a: number) => number;
    readonly fseek: (a: number, b: number, c: number) => number;
    readonly ftell: (a: number) => number;
    readonly x3f_dump_meta_data: (a: number, b: number) => number;
    readonly x3f_dump_raw_data_as_histogram: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => number;
    readonly x3f_get_dng_shoulder_ceiling: () => number;
    readonly x3f_print_meta: (a: number) => void;
    readonly x3f_3x3_print: (a: number, b: number) => void;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
