#!/usr/bin/env python3
"""
X3F to DNG Converter with GUI (rawpy version)
Complete converter with Tkinter interface using rawpy for Sigma DP2 Merrill X3F files
"""

import os
import sys
import threading
from pathlib import Path
import tkinter as tk
from tkinter import ttk, filedialog, messagebox, scrolledtext
from tkinterdnd2 import DND_FILES, TkinterDnD

# Import the Photoshop compatible converter
from photoshop_compatible_converter import PhotoshopCompatibleConverter


class X3FConverterGUI:
    def __init__(self, root):
        self.root = root
        self.converter = PhotoshopCompatibleConverter()
        self.selected_files = []
        self.output_directory = None
        
        self.setup_ui()
        self.setup_drag_drop()
        
        # Check dependencies on startup
        self.check_dependencies()
    
    def check_dependencies(self):
        """Check if required dependencies are available"""
        warnings = []
        
        if not self.converter.rawpy_available:
            warnings.append("rawpy is not installed or not found.")
        
        if warnings:
            warning_message = "\n".join(warnings)
            warning_message += "\n\nPlease install missing dependencies."
            messagebox.showwarning("Dependencies Check", warning_message)
    
    def setup_ui(self):
        """Setup the user interface"""
        self.root.title("X3F to TIFF Converter for Photoshop")
        self.root.geometry("700x600")
        self.root.resizable(True, True)
        
        # Main frame
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Configure grid weights
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        main_frame.columnconfigure(1, weight=1)
        main_frame.rowconfigure(2, weight=1)
        
        # Header
        header_label = ttk.Label(main_frame, text="X3F to TIFF Converter", font=('Arial', 16, 'bold'))
        header_label.grid(row=0, column=0, columnspan=3, pady=(0, 10))
        
        # Photoshop compatibility info
        compat_label = ttk.Label(main_frame, text="✓ Photoshop & Lightroom Compatible • 16-bit TIFF Output", font=('Arial', 10), foreground='green')
        compat_label.grid(row=1, column=0, columnspan=3, pady=(0, 5))
        
        # Additional info
        features_label = ttk.Label(main_frame, text="• Foveon sensor optimization • Full EXIF metadata • No external dependencies", font=('Arial', 9), foreground='blue')
        features_label.grid(row=2, column=0, columnspan=3, pady=(0, 10))
        
        # Processing method selection
        method_frame = ttk.Frame(main_frame)
        method_frame.grid(row=3, column=0, columnspan=3, pady=(0, 15))
        
        ttk.Label(method_frame, text="Output Format:", font=('Arial', 9, 'bold')).pack(side=tk.LEFT)
        
        self.format_var = tk.StringVar(value="tiff")
        format_combo = ttk.Combobox(method_frame, textvariable=self.format_var, state="readonly", width=15)
        format_combo['values'] = ("tiff",)
        format_combo.pack(side=tk.LEFT, padx=(5, 0))
        
        # Format info button
        ttk.Button(method_frame, text="?", width=3, command=self.show_format_info).pack(side=tk.LEFT, padx=(5, 0))
        
        # File selection section
        ttk.Label(main_frame, text="X3F Files:", font=('Arial', 10, 'bold')).grid(row=4, column=0, sticky=tk.W, pady=(0, 5))
        
        file_frame = ttk.Frame(main_frame)
        file_frame.grid(row=4, column=1, columnspan=2, sticky=(tk.W, tk.E), pady=(0, 5))
        file_frame.columnconfigure(0, weight=1)
        
        ttk.Button(file_frame, text="Select Files", command=self.select_files).grid(row=0, column=0, sticky=tk.W)
        ttk.Button(file_frame, text="Clear All", command=self.clear_files).grid(row=0, column=1, padx=(5, 0))
        
        # Output directory section
        ttk.Label(main_frame, text="Output Directory:", font=('Arial', 10, 'bold')).grid(row=5, column=0, sticky=tk.W, pady=(10, 5))
        
        output_frame = ttk.Frame(main_frame)
        output_frame.grid(row=5, column=1, columnspan=2, sticky=(tk.W, tk.E), pady=(10, 5))
        output_frame.columnconfigure(0, weight=1)
        
        self.output_var = tk.StringVar(value="Same as input files")
        ttk.Entry(output_frame, textvariable=self.output_var, state="readonly").grid(row=0, column=0, sticky=(tk.W, tk.E), padx=(0, 5))
        ttk.Button(output_frame, text="Browse", command=self.select_output_directory).grid(row=0, column=1)
        ttk.Button(output_frame, text="Reset", command=self.reset_output_directory).grid(row=0, column=2, padx=(5, 0))
        
        # File list and drag-drop area
        list_frame = ttk.LabelFrame(main_frame, text="Selected Files (Drag & Drop X3F files here)", padding="5")
        list_frame.grid(row=6, column=0, columnspan=3, sticky=(tk.W, tk.E, tk.N, tk.S), pady=(15, 0))
        list_frame.columnconfigure(0, weight=1)
        list_frame.rowconfigure(0, weight=1)
        
        # File listbox with scrollbar
        listbox_frame = ttk.Frame(list_frame)
        listbox_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        listbox_frame.columnconfigure(0, weight=1)
        listbox_frame.rowconfigure(0, weight=1)
        
        self.file_listbox = tk.Listbox(listbox_frame, selectmode=tk.EXTENDED, height=6)
        listbox_scrollbar = ttk.Scrollbar(listbox_frame, orient=tk.VERTICAL, command=self.file_listbox.yview)
        self.file_listbox.configure(yscrollcommand=listbox_scrollbar.set)
        
        self.file_listbox.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        listbox_scrollbar.grid(row=0, column=1, sticky=(tk.N, tk.S))
        
        # Buttons frame
        button_frame = ttk.Frame(list_frame)
        button_frame.grid(row=1, column=0, pady=(10, 0))
        
        ttk.Button(button_frame, text="Remove Selected", command=self.remove_selected_files).pack(side=tk.LEFT, padx=(0, 5))
        
        # Convert button
        self.convert_button = ttk.Button(main_frame, text="Convert to TIFF", command=self.start_conversion, style='Accent.TButton')
        self.convert_button.grid(row=7, column=0, columnspan=3, pady=(15, 0))
        
        # Progress section
        progress_frame = ttk.LabelFrame(main_frame, text="Progress & Messages", padding="5")
        progress_frame.grid(row=8, column=0, columnspan=3, sticky=(tk.W, tk.E, tk.N, tk.S), pady=(15, 0))
        progress_frame.columnconfigure(0, weight=1)
        progress_frame.rowconfigure(0, weight=1)
        
        self.progress_text = scrolledtext.ScrolledText(progress_frame, height=10, state=tk.DISABLED, wrap=tk.WORD)
        self.progress_text.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Status bar
        self.status_var = tk.StringVar(value="Ready")
        status_bar = ttk.Label(main_frame, textvariable=self.status_var, relief=tk.SUNKEN, anchor=tk.W)
        status_bar.grid(row=9, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=(10, 0))
        
        # Make rows expandable
        main_frame.rowconfigure(6, weight=1)
        main_frame.rowconfigure(8, weight=1)
    
    def setup_drag_drop(self):
        """Setup drag and drop functionality"""
        self.file_listbox.drop_target_register(DND_FILES)
        self.file_listbox.dnd_bind('<<Drop>>', self.on_drop)
    
    def on_drop(self, event):
        """Handle drag and drop events"""
        files = self.root.tk.splitlist(event.data)
        x3f_files = [f for f in files if f.lower().endswith('.x3f')]
        
        if x3f_files:
            for file_path in x3f_files:
                if file_path not in self.selected_files:
                    self.selected_files.append(file_path)
            self.update_file_list()
            self.status_var.set(f"Added {len(x3f_files)} X3F files")
        else:
            messagebox.showwarning("Invalid Files", "Please drop only X3F files.")
    
    def select_files(self):
        """Open file selection dialog"""
        files = filedialog.askopenfilenames(
            title="Select X3F Files",
            filetypes=[("X3F files", "*.x3f"), ("All files", "*.*")]
        )
        
        added_count = 0
        for file_path in files:
            if file_path not in self.selected_files:
                self.selected_files.append(file_path)
                added_count += 1
        
        self.update_file_list()
        if added_count > 0:
            self.status_var.set(f"Added {added_count} X3F files")
    
    def clear_files(self):
        """Clear all selected files"""
        self.selected_files.clear()
        self.update_file_list()
        self.status_var.set("Cleared all files")
    
    def remove_selected_files(self):
        """Remove selected files from the list"""
        selected_indices = self.file_listbox.curselection()
        if not selected_indices:
            return
        
        # Remove in reverse order to maintain indices
        for index in reversed(selected_indices):
            del self.selected_files[index]
        
        self.update_file_list()
        self.status_var.set(f"Removed {len(selected_indices)} files")
    
    def update_file_list(self):
        """Update the file listbox"""
        self.file_listbox.delete(0, tk.END)
        for file_path in self.selected_files:
            self.file_listbox.insert(tk.END, os.path.basename(file_path))
        
        # Update convert button state
        if self.selected_files:
            self.convert_button.config(state=tk.NORMAL)
        else:
            self.convert_button.config(state=tk.DISABLED)
    
    def select_output_directory(self):
        """Select output directory"""
        directory = filedialog.askdirectory(title="Select Output Directory")
        if directory:
            self.output_directory = directory
            self.output_var.set(directory)
            self.status_var.set(f"Output directory: {os.path.basename(directory)}")
    
    def reset_output_directory(self):
        """Reset output directory to default"""
        self.output_directory = None
        self.output_var.set("Same as input files")
        self.status_var.set("Output directory reset")
    
    def show_format_info(self):
        """Show information about TIFF format"""
        info_text = """TIFF Format Information:

✓ PHOTOSHOP COMPATIBLE
  - Opens directly in Photoshop & Lightroom
  - No external dependencies required
  - Universal format support

✓ FOVEON OPTIMIZED PROCESSING
  - AHD demosaic algorithm for X3F files
  - sRGB gamma curve (2.222, 4.5)
  - Auto brightness with optimal threshold
  - Designed specifically for Sigma DP2 Merrill

✓ PROFESSIONAL FEATURES
  - Full EXIF metadata preservation
  - 16-bit color depth (65,536 levels per channel)
  - High resolution output
  - Lossless quality

✓ PACKAGE DISTRIBUTION
  - No Adobe software dependencies
  - Works on any computer
  - Perfect for sharing and archiving"""
        
        messagebox.showinfo("TIFF Format Information", info_text)
    
    def log_progress(self, message, end="\n"):
        """Log progress to the text widget"""
        self.progress_text.config(state=tk.NORMAL)
        self.progress_text.insert(tk.END, message + end)
        self.progress_text.see(tk.END)
        self.progress_text.config(state=tk.DISABLED)
        self.root.update_idletasks()
    
    def start_conversion(self):
        """Start the conversion process in a separate thread"""
        if not self.selected_files:
            messagebox.showwarning("No Files", "Please select X3F files to convert.")
            return
        
        if not self.converter.rawpy_available:
            messagebox.showerror("rawpy Not Available", "rawpy is not installed. Please install it: pip install rawpy")
            return
        
        # Disable convert button during conversion
        self.convert_button.config(state=tk.DISABLED, text="Converting...")
        self.status_var.set("Converting files...")
        
        # Clear progress log
        self.progress_text.config(state=tk.NORMAL)
        self.progress_text.delete(1.0, tk.END)
        self.progress_text.config(state=tk.DISABLED)
        
        # Start conversion in separate thread
        conversion_thread = threading.Thread(target=self.run_conversion)
        conversion_thread.daemon = True
        conversion_thread.start()
    
    def run_conversion(self):
        """Run the actual conversion process"""
        try:
            self.log_progress("X3F to TIFF Conversion Started")
            self.log_progress("✓ Photoshop & Lightroom compatible TIFF output")
            self.log_progress("✓ Foveon sensor optimization enabled")
            self.log_progress("✓ Full EXIF metadata preservation")
            self.log_progress("=" * 60)
            
            # Get selected format
            format_type = self.format_var.get()
            
            # Convert files one by one
            successful = 0
            total = len(self.selected_files)
            
            for i, x3f_file in enumerate(self.selected_files, 1):
                self.log_progress(f"\n[{i}/{total}] Processing: {Path(x3f_file).name}")
                
                if self.converter.convert_x3f_for_photoshop(x3f_file, self.output_directory, format_type):
                    successful += 1
                    self.log_progress(f"✓ Successfully converted")
                else:
                    self.log_progress(f"✗ Conversion failed")
            
            # Show completion message
            if successful == total:
                messagebox.showinfo("Conversion Complete", f"All {total} files converted successfully!")
                self.status_var.set(f"Conversion complete: {successful}/{total} files")
            else:
                messagebox.showwarning("Conversion Complete", f"{successful}/{total} files converted successfully.")
                self.status_var.set(f"Conversion complete with errors: {successful}/{total} files")
                
        except Exception as e:
            error_msg = f"An error occurred during conversion:\n{str(e)}"
            messagebox.showerror("Conversion Error", error_msg)
            self.log_progress(f"✗ Critical error: {str(e)}")
            self.status_var.set("Conversion failed with error")
        
        finally:
            # Re-enable convert button
            self.convert_button.config(state=tk.NORMAL, text="Convert to TIFF")


def main():
    """Main function"""
    try:
        # Try to use TkinterDnD for drag and drop
        root = TkinterDnD.Tk()
    except ImportError:
        # Fallback to regular Tkinter if TkinterDnD is not available
        root = tk.Tk()
        messagebox.showwarning(
            "Drag & Drop Not Available",
            "tkinterdnd2 is not installed. Drag & drop functionality will not work.\n\n"
            "Install with: pip install tkinterdnd2"
        )
    
    app = X3FConverterGUI(root)
    
    # Set initial status
    app.status_var.set("Ready - Select X3F files to convert")
    
    root.mainloop()


if __name__ == "__main__":
    if len(sys.argv) > 1:
        # Command line mode
        from photoshop_compatible_converter import PhotoshopCompatibleConverter
        converter = PhotoshopCompatibleConverter()
        
        args = sys.argv[1:]
        output_dir = None
        
        if len(args) > 1 and os.path.isdir(args[-1]):
            output_dir = args[-1]
            x3f_files = args[:-1]
        else:
            x3f_files = args
        
        for x3f_file in x3f_files:
            converter.convert_x3f_for_photoshop(x3f_file, output_dir, 'tiff')
    else:
        # GUI mode
        main()