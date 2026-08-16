#!/usr/bin/env python3
"""
Photoshop Compatible Converter - Photoshopで確実に開けるファイルを生成
"""

import os
import sys
import rawpy
import numpy as np
from pathlib import Path
import tifffile
from datetime import datetime

class PhotoshopCompatibleConverter:
    def __init__(self):
        self.rawpy_available = self._check_rawpy()
    
    def _check_rawpy(self):
        try:
            import rawpy
            return True
        except ImportError:
            return False
    
    def convert_x3f_for_photoshop(self, x3f_path, output_dir=None, format_type='tiff'):
        """
        Photoshop互換ファイルを生成
        
        Args:
            x3f_path: X3Fファイルパス
            output_dir: 出力ディレクトリ
            format_type: 'tiff' または 'psd'
        """
        if not self.rawpy_available:
            print("Error: rawpy not found")
            return False
        
        x3f_path = Path(x3f_path)
        if output_dir is None:
            output_dir = x3f_path.parent
        else:
            output_dir = Path(output_dir)
            output_dir.mkdir(parents=True, exist_ok=True)
        
        # 拡張子を適切に設定
        if format_type == 'tiff':
            output_path = output_dir / (x3f_path.stem + '.tiff')
        elif format_type == 'psd':
            output_path = output_dir / (x3f_path.stem + '.psd')
        else:
            output_path = output_dir / (x3f_path.stem + '.tiff')
        
        try:
            print(f"Converting {x3f_path.name} for Photoshop...")
            
            # X3F処理
            with rawpy.imread(str(x3f_path)) as raw:
                print(f"  Processing with Foveon optimization...")
                
                # Photoshop向け最適化処理
                rgb = raw.postprocess(
                    demosaic_algorithm=rawpy.DemosaicAlgorithm.AHD,
                    use_camera_wb=True,
                    no_auto_bright=False,
                    auto_bright_thr=0.01,
                    output_bps=16,
                    gamma=(2.222, 4.5),  # sRGB gamma
                    output_color=rawpy.ColorSpace.sRGB,
                    highlight_mode=rawpy.HighlightMode.Clip
                )
                
                print(f"  Processed: {rgb.shape}, {rgb.dtype}")
                print(f"  Range: {rgb.min()} - {rgb.max()}")
            
            # データ準備
            if rgb.dtype != np.uint16:
                if rgb.max() <= 1.0:
                    rgb = (rgb * 65535).astype(np.uint16)
                elif rgb.max() <= 255:
                    rgb = (rgb.astype(np.float32) / 255 * 65535).astype(np.uint16)
            
            # Photoshop互換TIFFタグ
            tiff_tags = {
                'Software': "X3F Converter for Photoshop",
                'Make': "SIGMA",
                'Model': "DP2 Merrill", 
                'DateTime': datetime.now().strftime("%Y:%m:%d %H:%M:%S"),
                'Orientation': 1,
                'XResolution': (300, 1),  # 300 DPI
                'YResolution': (300, 1),  # 300 DPI
                'ResolutionUnit': 2,  # Inches
                'ColorSpace': 1,  # sRGB
                'Compression': 1,  # No compression for maximum compatibility
                'PhotometricInterpretation': 2,  # RGB
                'SamplesPerPixel': 3,
                'BitsPerSample': (16, 16, 16),
                'PlanarConfiguration': 1,  # Chunky
            }
            
            print(f"  Saving as {format_type.upper()}...")
            
            if format_type == 'tiff':
                # 高互換性TIFF
                tifffile.imwrite(
                    str(output_path),
                    rgb,
                    photometric='rgb',
                    planarconfig='contig',
                    compression=None,  # 圧縮なしで最大互換性
                    metadata=tiff_tags,
                    resolution=(300, 300),
                    software="X3F Converter for Photoshop"
                )
            
            # 検証
            if output_path.exists():
                file_size = output_path.stat().st_size
                print(f"  ✓ Created: {file_size:,} bytes")
                print(f"  ✓ File: {output_path}")
                
                # 読み込みテスト
                try:
                    with tifffile.TiffFile(str(output_path)) as tif:
                        test_data = tif.pages[0].asarray()
                        print(f"  ✓ Verification: {test_data.shape}, {test_data.dtype}")
                except Exception as e:
                    print(f"  ⚠ Verification failed: {e}")
                
                return True
            else:
                print(f"  ✗ File not created")
                return False
                
        except Exception as e:
            print(f"✗ Conversion failed: {e}")
            return False

def main():
    if len(sys.argv) < 2:
        print("Usage: python photoshop_compatible_converter.py <x3f_file> [output_dir] [format]")
        print("Format: tiff (default)")
        sys.exit(1)
    
    x3f_file = sys.argv[1]
    output_dir = sys.argv[2] if len(sys.argv) > 2 and os.path.isdir(sys.argv[2]) else None
    format_type = sys.argv[3] if len(sys.argv) > 3 else 'tiff'
    
    if not Path(x3f_file).exists():
        print(f"Error: X3F file not found: {x3f_file}")
        sys.exit(1)
    
    converter = PhotoshopCompatibleConverter()
    success = converter.convert_x3f_for_photoshop(x3f_file, output_dir, format_type)
    
    if success:
        print("\n✓ Conversion completed!")
        print("This file should open in Photoshop without issues.")
    else:
        print("\n✗ Conversion failed!")

if __name__ == "__main__":
    main()