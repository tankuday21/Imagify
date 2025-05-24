# Image Converter & Compressor

A modern, client-side web application that allows users to convert images between various formats (JPG, PNG, WEBP, GIF) and compress them to reduce file size while maintaining quality. All processing happens locally in the browser, ensuring privacy and security.

![Application Screenshot](public/favicon.png)

## Features

- 🖼️ Convert images between JPG, PNG, WEBP, and GIF formats
- 🔄 Compress images with adjustable quality settings
- 📉 Reduce file sizes while maintaining visual quality
- 🔍 Before/after comparison with interactive slider
- 📊 View detailed statistics about compression results
- 📥 Drag and drop file upload
- 💽 Batch processing of multiple images
- 🔒 Client-side processing (no server uploads)
- 📱 Responsive design for all devices
- 🌐 Cross-browser compatibility

## Technologies Used

- React.js - UI framework
- Tailwind CSS - Styling
- Browser Image Compression - Image processing library
- JSZip - For batch downloads
- FileSaver.js - For downloading processed images
- React Dropzone - Drag and drop file upload

## Getting Started

### Prerequisites

- Node.js 14.0 or later
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/image-converter.git
   cd image-converter
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage Guide

1. **Upload Images**: Drag and drop images onto the upload area or click to browse. Supported formats include JPG, PNG, WEBP, and GIF.

2. **Choose Conversion Options**:
   - Select the target format (JPG, PNG, WEBP, GIF)
   - Adjust compression quality using the slider
   - Higher quality values preserve more details but result in larger files

3. **Process Images**: Click the "Process Images" button to convert and compress your images.

4. **View Results**:
   - See the processed images with before/after comparisons
   - View detailed information about file size savings
   - Download individual images or all processed images at once

## Privacy

This application processes all images entirely within your browser. Your images are never uploaded to any server, ensuring complete privacy and security. This also means:

- No internet connection is required after the initial page load
- Processing speed depends on your device's capabilities
- There are no file size limitations beyond your browser's memory constraints

## Browser Compatibility

The application works best in modern browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge

Some features may have limited functionality in older browsers.

## Deployment

For deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [browser-image-compression](https://github.com/Donaldcwl/browser-image-compression) - The core image compression library
- [React Dropzone](https://react-dropzone.js.org/) - For the file upload functionality
- [FileSaver.js](https://github.com/eligrey/FileSaver.js/) - For the download functionality
- [Tailwind CSS](https://tailwindcss.com/) - For the styling framework
- [React Icons](https://react-icons.github.io/react-icons/) - For the icons used throughout the application