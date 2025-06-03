# X3F to TIFF Converter for Photoshop

A professional X3F to TIFF converter specifically optimized for Sigma DP2 Merrill camera files, with full Photoshop and Lightroom compatibility.

## Features

✅ **Photoshop & Lightroom Compatible**
- Direct TIFF output that opens seamlessly in Adobe software
- No external dependencies required for end users
- Universal format support across all photo editing software

✅ **Foveon Sensor Optimization**
- AHD demosaic algorithm optimized for X3F files
- sRGB gamma curve (2.222, 4.5) for accurate color reproduction
- Auto brightness with optimal threshold for Sigma sensors
- Designed specifically for Sigma DP2 Merrill

✅ **Professional Features**
- Full EXIF metadata preservation
- 16-bit color depth (65,536 levels per channel)
- High resolution output with no quality loss
- Batch processing with drag & drop interface

✅ **Easy Distribution**
- Self-contained application
- No Adobe software dependencies
- Works on any computer
- Perfect for sharing and archiving

## Requirements

- Python 3.8 or higher
- Virtual environment (recommended)

## Installation

1. Clone this repository:
```bash
git clone https://github.com/nobphotographr/X3F-to-DNG-Converter.git
cd X3F-to-DNG-Converter
```

2. Create and activate virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### GUI Mode (Recommended)
```bash
python x3f_converter_rawpy.py
```

Features:
- Drag & drop X3F files
- Batch processing
- Output directory selection
- Real-time progress monitoring

### Command Line Mode
```bash
python x3f_converter_rawpy.py file1.x3f file2.x3f [output_directory]
```

## Technical Details

### Processing Pipeline
1. **X3F File Reading**: Uses LibRaw (rawpy) for native X3F support
2. **Foveon Processing**: Optimized demosaic algorithm for 3-layer sensor
3. **Color Space**: sRGB conversion with proper gamma correction
4. **Output**: 16-bit TIFF with full EXIF metadata

### Supported Formats
- **Input**: X3F files from Sigma DP2 Merrill
- **Output**: 16-bit TIFF (Photoshop compatible)

## Development

This converter was developed specifically for Sigma DP2 Merrill X3F files with focus on:
- Maximum Photoshop compatibility
- Professional image quality
- Easy distribution without external dependencies

## License

MIT License - see LICENSE file for details

## Contributing

Contributions welcome! Please feel free to submit pull requests or open issues.

## Author

Created for professional X3F workflow optimization.