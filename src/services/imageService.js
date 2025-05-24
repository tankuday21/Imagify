import imageCompression from 'browser-image-compression';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

/**
 * Supported image formats for conversion
 * @type {Array}
 */
const SUPPORTED_FORMATS = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'bmp', 'tiff', 'ico', 'svg'];

/**
 * Browser compatibility detection for modern formats
 */
const checkFormatSupport = async () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;

  const support = {
    webp: false,
    avif: false
  };

  try {
    // Check WebP support
    support.webp = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;

    // Check AVIF support
    support.avif = canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
  } catch (error) {
    console.warn('Format support detection failed:', error);
  }

  return support;
};

/**
 * Image format configuration
 * @type {Object}
 */
const FORMAT_CONFIG = {
  jpg: {
    // JPG format settings
    useInitialQuality: true,
    compressionOptions: {
      alwaysKeepResolution: true // Don't resize JPG based on quality
    }
  },
  jpeg: {
    // JPEG is identical to JPG in functionality
    useInitialQuality: true,
    compressionOptions: {
      alwaysKeepResolution: true // Don't resize JPEG based on quality
    }
  },
  png: {
    needsTransparencyCheck: true,
    compressionOptions: {
      alwaysKeepResolution: true
    }
  },
  webp: {
    useInitialQuality: true,
    compressionOptions: {
      alwaysKeepResolution: true // Don't resize WebP based on quality
    }
  },
  gif: {
    compressionOptions: {
      preserveAnimation: true,
      alwaysKeepResolution: true // Don't resize GIF based on quality
    }
  },
  bmp: {
    compressionOptions: {
      alwaysKeepResolution: true,
      useCanvas: true // Use canvas for BMP conversion
    }
  },
  tiff: {
    compressionOptions: {
      alwaysKeepResolution: true,
      useCanvas: true // Use canvas for TIFF conversion
    }
  }
};

/**
 * Validate if a format is supported for conversion
 * @param {string} format - The format to validate
 * @returns {boolean} True if format is supported
 */
export const isFormatSupported = (format) => {
  return SUPPORTED_FORMATS.includes(format.toLowerCase());
};

/**
 * Get list of supported formats
 * @returns {Array} Array of supported format strings
 */
export const getSupportedFormats = () => {
  return [...SUPPORTED_FORMATS];
};

/**
 * Create ICO format with multiple sizes
 * @param {HTMLCanvasElement} canvas - Source canvas
 * @param {number} quality - Quality setting
 * @returns {Promise<Blob>} ICO blob
 */
const createICOFormat = async (canvas, quality) => {
  const sizes = [16, 32, 48];
  const images = [];

  for (const size of sizes) {
    const iconCanvas = document.createElement('canvas');
    iconCanvas.width = size;
    iconCanvas.height = size;
    const iconCtx = iconCanvas.getContext('2d');

    // Draw scaled image
    iconCtx.drawImage(canvas, 0, 0, size, size);

    // Convert to PNG data for ICO
    const pngData = iconCanvas.toDataURL('image/png', quality / 100);
    images.push({
      size,
      data: pngData
    });
  }

  // For now, return the 32x32 version as PNG (browsers don't support ICO creation)
  const iconCanvas = document.createElement('canvas');
  iconCanvas.width = 32;
  iconCanvas.height = 32;
  const iconCtx = iconCanvas.getContext('2d');
  iconCtx.drawImage(canvas, 0, 0, 32, 32);

  return new Promise(resolve => {
    iconCanvas.toBlob(resolve, 'image/png', quality / 100);
  });
};

/**
 * Create SVG format wrapper
 * @param {HTMLCanvasElement} canvas - Source canvas
 * @param {number} quality - Quality setting
 * @returns {Promise<Blob>} SVG blob
 */
const createSVGFormat = async (canvas, quality) => {
  const dataURL = canvas.toDataURL('image/png', quality / 100);
  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}">
  <title>Converted Image</title>
  <image x="0" y="0" width="${canvas.width}" height="${canvas.height}"
         xlink:href="${dataURL}" />
</svg>`;

  return new Blob([svgContent], { type: 'image/svg+xml' });
};

/**
 * Handle AVIF with fallback
 * @param {HTMLCanvasElement} canvas - Source canvas
 * @param {number} quality - Quality setting
 * @returns {Promise<Blob>} AVIF or WebP blob
 */
const createAVIFWithFallback = async (canvas, quality) => {
  try {
    // Try AVIF first
    const avifBlob = await new Promise(resolve => {
      canvas.toBlob(resolve, 'image/avif', quality / 100);
    });

    if (avifBlob && avifBlob.size > 0) {
      return avifBlob;
    }
  } catch (error) {
    console.warn('AVIF not supported, falling back to WebP:', error);
  }

  // Fallback to WebP
  return new Promise(resolve => {
    canvas.toBlob(resolve, 'image/webp', quality / 100);
  });
};

/**
 * Size thresholds for preview generation
 * @type {Object}
 */
const SIZE_THRESHOLDS = {
  SMALL_IMAGE: 500000, // 500KB
  PREVIEW_SIZE: 0.1, // 100KB
  MAX_PREVIEW_DIMENSION: 800
};

/**
 * Convert and compress an image file
 * @param {File} file - The image file to convert
 * @param {Object} options - Conversion options
 * @param {string} options.format - Target format (jpg, png, webp, gif)
 * @param {number} options.quality - Compression quality (0-100)
 * @returns {Promise<Object>} The processed file and metadata
 */
export const processImage = async (file, options) => {
  console.log('imageService: Processing image:', file.name, 'with options:', options);

  // Validate format support
  if (!isFormatSupported(options.format)) {
    throw new Error(`Format "${options.format}" is not supported. Supported formats: ${SUPPORTED_FORMATS.join(', ')}`);
  }

  try {
    // Base compression options
    const compressionOptions = {
      maxSizeMB: 10, // Max file size
      useWebWorker: true,
      fileType: `image/${options.format}`,
      quality: options.quality / 100, // Convert quality scale (0-100) to compression lib scale (0-1)
      maxWidthOrHeight: 0, // Default to keeping original dimensions
    };

    // Apply format-specific options
    await applyFormatSpecificOptions(compressionOptions, options.format, file, options.quality);

    // Ensure quality is properly set for all formats
    compressionOptions.quality = options.quality / 100;

    // Apply resize options if provided
    if (options.resize) {
      compressionOptions.maxWidthOrHeight = options.resize.maintainAspectRatio
        ? Math.max(options.resize.width, options.resize.height)
        : undefined;

      if (!options.resize.maintainAspectRatio) {
        compressionOptions.width = options.resize.width;
        compressionOptions.height = options.resize.height;
      }
    }

    // Process in parallel where possible
    const [originalPreview, originalDimensions] = await Promise.all([
      createImagePreview(file),
      getImageDimensions(file)
    ]);

    // Special handling for BMP and TIFF formats
    let compressedFile;
    if (options.format === 'bmp' || options.format === 'tiff') {
      compressedFile = await convertUsingCanvas(
        file,
        options.format,
        options.quality,
        options.resize,
        options.filter,
        options.rotation,
        options.flip,
        options.watermark
      );
    } else if (options.format === 'jpg' || options.format === 'jpeg') {
      // For JPG/JPEG, ensure we're using proper quality settings
      // The browser-image-compression library works best with JPG/JPEG
      compressionOptions.initialQuality = options.quality / 100;
      compressionOptions.quality = options.quality / 100;

      // Standard compression for JPG/JPEG
      compressedFile = await imageCompression(file, compressionOptions);

      // Apply additional processing if needed
      if (options.filter || options.rotation || options.flip || options.watermark) {
        compressedFile = await applyAdvancedProcessing(
          compressedFile,
          options.filter,
          options.rotation,
          options.flip,
          options.watermark
        );
      }
    } else {
      // For other formats (PNG, WebP, AVIF, GIF)
      // Use canvas-based approach for better quality control
      compressedFile = await convertUsingCanvas(
        file,
        options.format,
        options.quality,
        options.resize,
        options.filter,
        options.rotation,
        options.flip,
        options.watermark
      );
    }

    // Create a preview of processed image
    const processedPreview = await createImagePreview(compressedFile);

    // Calculate compression rate
    const compressionRate = calculateCompressionRate(file.size, compressedFile.size);

    // Create the processed file with new extension and possibly rename
    let processedFile = createProcessedFile(file, compressedFile, options.format);

    // Apply batch rename if enabled
    if (options.batchRename) {
      processedFile = applyBatchRename(processedFile, options.batchRename.pattern);
    }

    const result = {
      originalFile: file,
      processedFile,
      originalSize: file.size,
      processedSize: processedFile.size,
      name: processedFile.name,
      originalPreview,
      processedPreview,
      originalDimensions,
      compressionRate,
      format: options.format,
      quality: options.quality
    };

    console.log('imageService: Processing complete for', file.name, 'result:', result);
    return result;
  } catch (error) {
    console.error('imageService: Error processing image:', file.name, error);
    throw error;
  }
};

/**
 * Apply format-specific compression options
 * @param {Object} compressionOptions - The compression options object to modify
 * @param {string} format - The target format
 * @param {File} file - The image file
 * @param {number} quality - The quality setting (0-100)
 * @returns {Promise<void>}
 */
const applyFormatSpecificOptions = async (compressionOptions, format, file, quality) => {
  const formatConfig = FORMAT_CONFIG[format];

  // Always apply quality setting for all formats
  compressionOptions.quality = quality / 100;

  // For JPG/JPEG, we don't want to resize based on quality
  if (format === 'jpg' || format === 'jpeg') {
    // Don't change dimensions based on quality for JPG/JPEG
    compressionOptions.maxWidthOrHeight = 0; // Keep original dimensions
    return;
  }

  if (!formatConfig) {
    // Default settings for formats not in FORMAT_CONFIG
    return;
  }

  // Special handling for BMP and TIFF formats
  if (format === 'bmp' || format === 'tiff') {
    // These formats need special handling with canvas
    compressionOptions.useCanvas = true;
    compressionOptions.canvasMaxWidthOrHeight = 4000; // Prevent oversized canvas
    compressionOptions.onProgress = () => {}; // Empty progress handler to prevent errors

    // For BMP, we need to ensure we're not using compression
    if (format === 'bmp') {
      compressionOptions.quality = 1.0; // No compression for BMP
    }

    // For TIFF, we need to ensure proper quality settings
    if (format === 'tiff') {
      compressionOptions.quality = Math.max(0.7, quality / 100); // Minimum quality for TIFF
    }

    Object.assign(compressionOptions, formatConfig.compressionOptions);
    return;
  }

  // Apply format-specific options for other formats
  if (formatConfig.needsTransparencyCheck && await hasTransparency(file)) {
    Object.assign(compressionOptions, formatConfig.compressionOptions);
  } else if (formatConfig.useInitialQuality) {
    compressionOptions.initialQuality = quality / 100;
  } else if (formatConfig.compressionOptions) {
    Object.assign(compressionOptions, formatConfig.compressionOptions);
  }
};

/**
 * Calculate compression rate as a percentage
 * @param {number} originalSize - Original file size in bytes
 * @param {number} compressedSize - Compressed file size in bytes
 * @returns {number} Compression rate as a percentage
 */
const calculateCompressionRate = (originalSize, compressedSize) => {
  return (1 - (compressedSize / originalSize)) * 100;
};

/**
 * Create a processed file with the new format extension
 * @param {File} originalFile - The original file
 * @param {Blob} compressedFile - The compressed file blob
 * @param {string} format - The target format
 * @returns {File} The processed file with new name and type
 */
const createProcessedFile = (originalFile, compressedFile, format) => {
  const lastDotIndex = originalFile.name.lastIndexOf('.');
  const fileName = lastDotIndex > 0
    ? originalFile.name.substring(0, lastDotIndex)
    : originalFile.name;

  // Handle special formats
  let mimeType = `image/${format}`;
  let extension = format;

  // Special handling for BMP and TIFF
  if (format === 'bmp') {
    // Some browsers need x-ms-bmp MIME type
    mimeType = 'image/bmp';
    extension = 'bmp';
  } else if (format === 'tiff') {
    // TIFF can be either tiff or tif
    mimeType = 'image/tiff';
    extension = 'tiff';
  }

  const newFileName = `${fileName}.${extension}`;

  // Handle JPEG extension specifically
  if (format === 'jpeg') {
    newFileName = `${fileName}.jpeg`;
    mimeType = 'image/jpeg';
  }

  // Create a new file with the proper MIME type
  return new File([compressedFile], newFileName, {
    type: mimeType
  });
};

/**
 * Check if an image has transparency
 * @param {File} file - The image file to check
 * @returns {Promise<boolean>} True if the image has transparency
 */
const hasTransparency = async (file) => {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      // Create a canvas and draw the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Get image data and check for transparent pixels
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Check alpha channel (every 4th byte)
        for (let i = 3; i < data.length; i += 4) {
          if (data[i] < 255) {
            URL.revokeObjectURL(objectUrl);
            resolve(true);
            return;
          }
        }
        resolve(false);
      } catch (e) {
        // If we can't analyze (e.g., CORS issues), assume no transparency
        console.error('Error analyzing transparency:', e);
        resolve(false);
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(false);
    };

    img.src = objectUrl;
  });
};

/**
 * Get dimensions of an image file
 * @param {File} file - The image file
 * @returns {Promise<Object>} Width and height of the image
 */
const getImageDimensions = (file) => {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
      URL.revokeObjectURL(objectUrl);
    };

    img.onerror = () => {
      resolve({ width: 0, height: 0 });
      URL.revokeObjectURL(objectUrl);
    };

    img.src = objectUrl;
  });
};

/**
 * Create a preview image URL for an image file
 * @param {File} file - The image file
 * @returns {Promise<string>} URL of the preview image
 */
const createImagePreview = async (file) => {
  try {
    // For small images, just return the file directly
    if (file.size < SIZE_THRESHOLDS.SMALL_IMAGE) {
      return URL.createObjectURL(file);
    }

    // For larger images, create a smaller preview
    const options = {
      maxSizeMB: SIZE_THRESHOLDS.PREVIEW_SIZE,
      maxWidthOrHeight: SIZE_THRESHOLDS.MAX_PREVIEW_DIMENSION,
      useWebWorker: true
    };

    const compressedFile = await imageCompression(file, options);
    return URL.createObjectURL(compressedFile);
  } catch (error) {
    console.error('Error creating preview:', error);
    return URL.createObjectURL(file);
  }
};

/**
 * Calculate optimal dimensions based on quality setting
 * @param {number} quality - Quality setting (0-100)
 * @returns {number} Optimal max dimension
 */
const getOptimalDimensions = (quality) => {
  // We're no longer using dimension reduction for quality
  // Always keep original dimensions
  return 0;
};

/**
 * Download a processed image file
 * @param {File} file - The processed file to download
 */
export const downloadImage = (file) => {
  if (!file) {
    console.error('No file provided for download');
    return;
  }

  saveAs(file, file.name);
};

/**
 * Download all processed images as a zip
 * @param {Array} files - Array of processed files
 */
export const downloadAllImages = async (files) => {
  if (!files || files.length === 0) {
    console.error('No files provided for download');
    return;
  }

  if (files.length === 1) {
    // If only one file, download directly
    downloadImage(files[0].processedFile);
    return;
  }

  try {
    // For multiple files, create a zip
    const zip = new JSZip();

    // Add each file to the zip
    files.forEach(file => {
      if (file && file.processedFile && file.name) {
        zip.file(file.name, file.processedFile);
      }
    });

    // Generate the zip file
    const content = await zip.generateAsync({ type: 'blob' });

    // Download the zip
    saveAs(content, 'converted-images.zip');
  } catch (error) {
    console.error('Error creating zip file:', error);
    throw error;
  }
};

/**
 * Compare original and processed images
 * @param {Object} result - Processed image result
 * @returns {Object|null} Comparison data or null if no result
 */
export const getComparisonData = (result) => {
  if (!result) return null;

  const sizeDiff = result.originalSize - result.processedSize;
  const percentReduction = ((sizeDiff / result.originalSize) * 100).toFixed(1);

  return {
    originalSize: formatFileSize(result.originalSize),
    processedSize: formatFileSize(result.processedSize),
    reduction: `${percentReduction}%`,
    isSmaller: sizeDiff > 0
  };
};

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Apply advanced image processing (filters, rotation, flip, watermark)
 * @param {Blob} file - The compressed file blob
 * @param {string} filter - Filter type to apply
 * @param {number} rotation - Rotation angle in degrees
 * @param {Object} flip - Flip settings
 * @param {Object} watermark - Watermark settings
 * @returns {Promise<Blob>} Processed file blob
 */
const applyAdvancedProcessing = async (file, filter, rotation, flip, watermark) => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        // Create a canvas for processing
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas dimensions
        let width = img.width;
        let height = img.height;

        // Handle rotation that changes dimensions
        if (rotation === 90 || rotation === 270) {
          canvas.width = height;
          canvas.height = width;
        } else {
          canvas.width = width;
          canvas.height = height;
        }

        // Apply rotation
        if (rotation) {
          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((rotation * Math.PI) / 180);

          if (rotation === 90 || rotation === 270) {
            ctx.drawImage(img, -height / 2, -width / 2);
          } else {
            ctx.drawImage(img, -width / 2, -height / 2);
          }

          ctx.restore();
        } else {
          // No rotation, just draw the image
          ctx.drawImage(img, 0, 0);
        }

        // Apply flip
        if (flip) {
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          tempCanvas.width = canvas.width;
          tempCanvas.height = canvas.height;

          // Copy current canvas to temp
          tempCtx.drawImage(canvas, 0, 0);

          // Clear original canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Flip horizontally
          if (flip.horizontal) {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
          }

          // Flip vertically
          if (flip.vertical) {
            ctx.translate(0, canvas.height);
            ctx.scale(1, -1);
          }

          // Draw back the image with transformations
          ctx.drawImage(tempCanvas, 0, 0);

          // Reset transformations
          ctx.setTransform(1, 0, 0, 1, 0, 0);
        }

        // Apply filters
        if (filter) {
          switch (filter) {
            case 'grayscale':
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const data = imageData.data;
              for (let i = 0; i < data.length; i += 4) {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = avg; // red
                data[i + 1] = avg; // green
                data[i + 2] = avg; // blue
              }
              ctx.putImageData(imageData, 0, 0);
              break;

            case 'sepia':
              const sepiaData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const sepiaPixels = sepiaData.data;
              for (let i = 0; i < sepiaPixels.length; i += 4) {
                const r = sepiaPixels[i];
                const g = sepiaPixels[i + 1];
                const b = sepiaPixels[i + 2];

                sepiaPixels[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
                sepiaPixels[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
                sepiaPixels[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
              }
              ctx.putImageData(sepiaData, 0, 0);
              break;

            case 'invert':
              const invertData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const invertPixels = invertData.data;
              for (let i = 0; i < invertPixels.length; i += 4) {
                invertPixels[i] = 255 - invertPixels[i]; // red
                invertPixels[i + 1] = 255 - invertPixels[i + 1]; // green
                invertPixels[i + 2] = 255 - invertPixels[i + 2]; // blue
              }
              ctx.putImageData(invertData, 0, 0);
              break;

            case 'blur':
              ctx.filter = 'blur(5px)';
              ctx.drawImage(canvas, 0, 0);
              ctx.filter = 'none';
              break;

            case 'sharpen':
              // Sharpen using a convolution filter
              const sharpenData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const tempSharpenCanvas = document.createElement('canvas');
              const tempSharpenCtx = tempSharpenCanvas.getContext('2d');
              tempSharpenCanvas.width = canvas.width;
              tempSharpenCanvas.height = canvas.height;
              tempSharpenCtx.putImageData(sharpenData, 0, 0);

              // Apply sharpen filter
              ctx.filter = 'contrast(1.5) brightness(1.1)';
              ctx.drawImage(tempSharpenCanvas, 0, 0);
              ctx.filter = 'none';
              break;
          }
        }

        // Apply watermark with enhanced properties
        if (watermark && watermark.text) {
          ctx.globalAlpha = watermark.opacity / 100;

          // Use enhanced watermark properties
          const fontSize = watermark.size || 16;
          const fontFamily = watermark.font || 'Arial';
          const textColor = watermark.color || '#ffffff';

          ctx.fillStyle = textColor;
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)'; // Semi-transparent black outline
          ctx.lineWidth = Math.max(1, fontSize / 16); // Scale outline with font size
          ctx.font = `${fontSize}px ${fontFamily}`;

          const textWidth = ctx.measureText(watermark.text).width;
          const textHeight = fontSize;
          let x = 10;
          let y = textHeight + 10;

          // Position the watermark
          switch (watermark.position) {
            case 'topLeft':
              x = 10;
              y = textHeight + 10;
              break;
            case 'topCenter':
              x = (canvas.width - textWidth) / 2;
              y = textHeight + 10;
              break;
            case 'topRight':
              x = canvas.width - textWidth - 10;
              y = textHeight + 10;
              break;
            case 'middleLeft':
              x = 10;
              y = canvas.height / 2;
              break;
            case 'middleCenter':
              x = (canvas.width - textWidth) / 2;
              y = canvas.height / 2;
              break;
            case 'middleRight':
              x = canvas.width - textWidth - 10;
              y = canvas.height / 2;
              break;
            case 'bottomLeft':
              x = 10;
              y = canvas.height - 10;
              break;
            case 'bottomCenter':
              x = (canvas.width - textWidth) / 2;
              y = canvas.height - 10;
              break;
            case 'bottomRight':
              x = canvas.width - textWidth - 10;
              y = canvas.height - 10;
              break;
          }

          // Draw the watermark text with outline for better visibility
          ctx.strokeText(watermark.text, x, y);
          ctx.fillText(watermark.text, x, y);

          // Reset opacity
          ctx.globalAlpha = 1.0;
        }

        // Convert canvas to blob
        canvas.toBlob((blob) => {
          URL.revokeObjectURL(objectUrl);
          resolve(blob);
        }, file.type);
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to load image for processing'));
      };

      img.src = objectUrl;
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Convert image using canvas for formats that need special handling (BMP, TIFF)
 * @param {File} file - The image file
 * @param {string} format - Target format
 * @param {number} quality - Quality setting (0-100)
 * @param {Object} resize - Resize settings
 * @param {string} filter - Filter to apply
 * @param {number} rotation - Rotation angle
 * @param {Object} flip - Flip settings
 * @param {Object} watermark - Watermark settings
 * @returns {Promise<Blob>} Converted file blob
 */
const convertUsingCanvas = async (file, format, quality, resize, filter, rotation, flip, watermark) => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        // Create a canvas for processing
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas dimensions
        let width = img.width;
        let height = img.height;

        // Apply resize if needed
        if (resize) {
          if (resize.maintainAspectRatio) {
            const maxDimension = Math.max(resize.width, resize.height);
            if (width > height) {
              // Landscape
              width = maxDimension;
              height = (img.height / img.width) * maxDimension;
            } else {
              // Portrait or square
              height = maxDimension;
              width = (img.width / img.height) * maxDimension;
            }
          } else {
            width = resize.width;
            height = resize.height;
          }
        }

        // Handle rotation that changes dimensions
        if (rotation === 90 || rotation === 270) {
          canvas.width = height;
          canvas.height = width;
        } else {
          canvas.width = width;
          canvas.height = height;
        }

        // Apply rotation
        if (rotation) {
          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((rotation * Math.PI) / 180);

          if (rotation === 90 || rotation === 270) {
            ctx.drawImage(img, -height / 2, -width / 2, height, width);
          } else {
            ctx.drawImage(img, -width / 2, -height / 2, width, height);
          }

          ctx.restore();
        } else {
          // No rotation, just draw the image
          ctx.drawImage(img, 0, 0, width, height);
        }

        // Apply flip
        if (flip) {
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          tempCanvas.width = canvas.width;
          tempCanvas.height = canvas.height;

          // Copy current canvas to temp
          tempCtx.drawImage(canvas, 0, 0);

          // Clear original canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Set up transformation
          ctx.save();

          // Flip horizontally
          if (flip.horizontal) {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
          }

          // Flip vertically
          if (flip.vertical) {
            ctx.translate(0, canvas.height);
            ctx.scale(1, -1);
          }

          // Draw back the image with transformations
          ctx.drawImage(tempCanvas, 0, 0);

          // Reset transformations
          ctx.restore();
        }

        // Apply filters
        if (filter) {
          switch (filter) {
            case 'grayscale':
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const data = imageData.data;
              for (let i = 0; i < data.length; i += 4) {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = avg; // red
                data[i + 1] = avg; // green
                data[i + 2] = avg; // blue
              }
              ctx.putImageData(imageData, 0, 0);
              break;

            case 'sepia':
              const sepiaData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const sepiaPixels = sepiaData.data;
              for (let i = 0; i < sepiaPixels.length; i += 4) {
                const r = sepiaPixels[i];
                const g = sepiaPixels[i + 1];
                const b = sepiaPixels[i + 2];

                sepiaPixels[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
                sepiaPixels[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
                sepiaPixels[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
              }
              ctx.putImageData(sepiaData, 0, 0);
              break;

            case 'invert':
              const invertData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const invertPixels = invertData.data;
              for (let i = 0; i < invertPixels.length; i += 4) {
                invertPixels[i] = 255 - invertPixels[i]; // red
                invertPixels[i + 1] = 255 - invertPixels[i + 1]; // green
                invertPixels[i + 2] = 255 - invertPixels[i + 2]; // blue
              }
              ctx.putImageData(invertData, 0, 0);
              break;

            case 'blur':
              // For BMP and TIFF, we'll use a manual blur algorithm
              const blurData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const blurPixels = blurData.data;
              const blurAmount = 5; // Blur radius

              // Simple box blur
              const tempBlurCanvas = document.createElement('canvas');
              const tempBlurCtx = tempBlurCanvas.getContext('2d');
              tempBlurCanvas.width = canvas.width;
              tempBlurCanvas.height = canvas.height;

              // Apply multiple passes for better blur
              tempBlurCtx.drawImage(canvas, 0, 0);
              for (let i = 0; i < 3; i++) {
                ctx.drawImage(tempBlurCanvas, -blurAmount, 0, canvas.width + blurAmount * 2, canvas.height);
                tempBlurCtx.drawImage(canvas, 0, 0);
                ctx.drawImage(tempBlurCanvas, 0, -blurAmount, canvas.width, canvas.height + blurAmount * 2);
                tempBlurCtx.drawImage(canvas, 0, 0);
              }
              break;

            case 'sharpen':
              // For BMP and TIFF, we'll use a contrast adjustment for sharpening
              const sharpenData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const sharpenPixels = sharpenData.data;

              // Increase contrast for a sharper look
              for (let i = 0; i < sharpenPixels.length; i += 4) {
                // Apply contrast adjustment
                for (let j = 0; j < 3; j++) {
                  const value = sharpenPixels[i + j];
                  sharpenPixels[i + j] = Math.max(0, Math.min(255, (value - 128) * 1.2 + 128));
                }
              }
              ctx.putImageData(sharpenData, 0, 0);
              break;
          }
        }

        // Apply watermark with enhanced properties
        if (watermark && watermark.text) {
          ctx.globalAlpha = watermark.opacity / 100;

          // Use enhanced watermark properties
          const fontSize = watermark.size || 16;
          const fontFamily = watermark.font || 'Arial';
          const textColor = watermark.color || '#ffffff';

          ctx.fillStyle = textColor;
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)'; // Semi-transparent black outline
          ctx.lineWidth = Math.max(1, fontSize / 16); // Scale outline with font size
          ctx.font = `${fontSize}px ${fontFamily}`;

          const textWidth = ctx.measureText(watermark.text).width;
          const textHeight = fontSize;
          let x = 10;
          let y = textHeight + 10;

          // Position the watermark
          switch (watermark.position) {
            case 'topLeft':
              x = 10;
              y = textHeight + 10;
              break;
            case 'topCenter':
              x = (canvas.width - textWidth) / 2;
              y = textHeight + 10;
              break;
            case 'topRight':
              x = canvas.width - textWidth - 10;
              y = textHeight + 10;
              break;
            case 'middleLeft':
              x = 10;
              y = canvas.height / 2;
              break;
            case 'middleCenter':
              x = (canvas.width - textWidth) / 2;
              y = canvas.height / 2;
              break;
            case 'middleRight':
              x = canvas.width - textWidth - 10;
              y = canvas.height / 2;
              break;
            case 'bottomLeft':
              x = 10;
              y = canvas.height - 10;
              break;
            case 'bottomCenter':
              x = (canvas.width - textWidth) / 2;
              y = canvas.height - 10;
              break;
            case 'bottomRight':
              x = canvas.width - textWidth - 10;
              y = canvas.height - 10;
              break;
          }

          // Draw the watermark text with outline for better visibility
          ctx.strokeText(watermark.text, x, y);
          ctx.fillText(watermark.text, x, y);

          // Reset opacity
          ctx.globalAlpha = 1.0;
        }

        // Convert canvas to blob with proper MIME type
        let mimeType;
        switch (format) {
          case 'bmp':
            mimeType = 'image/bmp';
            break;
          case 'tiff':
            mimeType = 'image/tiff';
            break;
          case 'png':
            mimeType = 'image/png';
            break;
          case 'webp':
            mimeType = 'image/webp';
            break;
          case 'gif':
            mimeType = 'image/gif';
            break;
          case 'avif':
            mimeType = 'image/avif';
            break;
          default:
            mimeType = `image/${format}`;
        }

        // Apply quality settings for all formats
        let outputQuality;

        if (format === 'bmp') {
          // For BMP, we'll use the quality setting to determine the bit depth
          // Lower quality = lower bit depth = smaller file size
          if (quality < 30) {
            // Use 1-bit depth for very low quality (black and white)
            const bwData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const bwPixels = bwData.data;
            for (let i = 0; i < bwPixels.length; i += 4) {
              const avg = (bwPixels[i] + bwPixels[i + 1] + bwPixels[i + 2]) / 3;
              const bw = avg > 128 ? 255 : 0;
              bwPixels[i] = bw;     // red
              bwPixels[i + 1] = bw; // green
              bwPixels[i + 2] = bw; // blue
            }
            ctx.putImageData(bwData, 0, 0);
          } else if (quality < 60) {
            // Use 8-bit indexed color for medium quality
            const indexedData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const indexedPixels = indexedData.data;
            for (let i = 0; i < indexedPixels.length; i += 4) {
              // Reduce color depth by rounding to nearest 32 value (8-bit color approximation)
              indexedPixels[i] = Math.round(indexedPixels[i] / 32) * 32;     // red
              indexedPixels[i + 1] = Math.round(indexedPixels[i + 1] / 32) * 32; // green
              indexedPixels[i + 2] = Math.round(indexedPixels[i + 2] / 32) * 32; // blue
            }
            ctx.putImageData(indexedData, 0, 0);
          } else if (quality < 80) {
            // Use 16-bit color for higher quality but still with some compression
            const indexedData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const indexedPixels = indexedData.data;
            for (let i = 0; i < indexedPixels.length; i += 4) {
              // Reduce color depth by rounding to nearest 16 value (16-bit color approximation)
              indexedPixels[i] = Math.round(indexedPixels[i] / 16) * 16;     // red
              indexedPixels[i + 1] = Math.round(indexedPixels[i + 1] / 16) * 16; // green
              indexedPixels[i + 2] = Math.round(indexedPixels[i + 2] / 16) * 16; // blue
            }
            ctx.putImageData(indexedData, 0, 0);
          }
          // Always use 1.0 quality for the actual blob creation to avoid JPEG-like compression
          outputQuality = 1.0;
        } else if (format === 'tiff') {
          // For TIFF, apply quality directly
          outputQuality = quality / 100;

          // For lower quality TIFF, also reduce color depth
          if (quality < 50) {
            const reducedData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const reducedPixels = reducedData.data;
            for (let i = 0; i < reducedPixels.length; i += 4) {
              // Reduce color depth for lower quality
              reducedPixels[i] = Math.round(reducedPixels[i] / 16) * 16;     // red
              reducedPixels[i + 1] = Math.round(reducedPixels[i + 1] / 16) * 16; // green
              reducedPixels[i + 2] = Math.round(reducedPixels[i + 2] / 16) * 16; // blue
            }
            ctx.putImageData(reducedData, 0, 0);
          }
        } else {
          // For other formats, use the standard quality conversion
          outputQuality = quality / 100;
        }

        // Handle special formats
        if (format === 'ico') {
          createICOFormat(canvas, quality).then(blob => {
            URL.revokeObjectURL(objectUrl);
            resolve(blob);
          }).catch(reject);
        } else if (format === 'svg') {
          createSVGFormat(canvas, quality).then(blob => {
            URL.revokeObjectURL(objectUrl);
            resolve(blob);
          }).catch(reject);
        } else if (format === 'avif') {
          createAVIFWithFallback(canvas, quality).then(blob => {
            URL.revokeObjectURL(objectUrl);
            resolve(blob);
          }).catch(reject);
        } else {
          canvas.toBlob((blob) => {
            URL.revokeObjectURL(objectUrl);
            resolve(blob);
          }, mimeType, outputQuality);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error(`Failed to load image for ${format} conversion`));
      };

      img.src = objectUrl;
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Apply batch rename to a file
 * @param {File} file - The file to rename
 * @param {string} pattern - Rename pattern
 * @returns {File} Renamed file
 */
const applyBatchRename = (file, pattern) => {
  if (!pattern) return file;

  // Get file extension
  const extension = file.name.split('.').pop();

  // Replace placeholders in pattern
  let newName = pattern;

  // Replace {index} with a random number
  if (newName.includes('{index}')) {
    newName = newName.replace('{index}', Math.floor(Math.random() * 10000));
  }

  // Replace {date} with current date
  if (newName.includes('{date}')) {
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    newName = newName.replace('{date}', formattedDate);
  }

  // Add extension
  newName = `${newName}.${extension}`;

  // Create new file with the new name
  return new File([file], newName, { type: file.type });
};