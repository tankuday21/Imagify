import { useState, useEffect } from 'react';
import {
  FiSettings, FiImage, FiHelpCircle, FiRefreshCw, FiZap,
  FiMaximize2, FiType, FiRotateCw, FiSave, FiFilter,
  FiChevronDown, FiCheck, FiCopy, FiMove, FiSliders,
  FiLayers, FiCamera, FiMonitor, FiGlobe,
  FiPlay, FiSquare, FiPrinter
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Tooltip from './Tooltip';
import { useTheme } from '../context/ThemeContext';

// Modern Dropdown Component
const ModernDropdown = ({ value, onChange, options, placeholder, darkMode, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={`relative ${className}`}>
      {/* Dropdown Trigger */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={selectedOption ? `Selected: ${selectedOption.label}` : placeholder}
        className={`
          w-full px-4 py-3 rounded-xl text-left flex items-center justify-between
          glass-card-enhanced border-2 transition-all duration-300 focus-ring
          ${darkMode
            ? 'bg-gray-800/50 border-gray-600/50 text-white hover:border-primary-500/70 focus:border-primary-500'
            : 'bg-white/50 border-gray-300/50 text-slate-700 hover:border-primary-400/70 focus:border-primary-500'
          }
          ${isOpen ? 'ring-4 ring-primary-200/50 dark:ring-primary-800/50' : ''}
          focus:outline-none hover:shadow-lg transform hover:-translate-y-0.5
        `}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center space-x-3">
          {selectedOption?.icon && (
            <selectedOption.icon
              className={`${darkMode ? 'text-primary-400' : 'text-primary-600'}`}
              size={18}
            />
          )}
          <div className="flex flex-col">
            <span className="font-medium">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            {selectedOption && (
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                {selectedOption.description}
              </span>
            )}
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FiChevronDown className={darkMode ? 'text-gray-400' : 'text-gray-500'} size={20} />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            role="listbox"
            aria-label="Dropdown options"
            className={`
              absolute top-full left-0 right-0 mt-2 rounded-xl shadow-2xl border-2 z-50
              ${darkMode
                ? 'bg-gray-800/95 border-gray-600/50 backdrop-blur-md'
                : 'bg-white/95 border-gray-300/50 backdrop-blur-md'
              }
            `}
          >
            {/* Search Input */}
            {options.length > 4 && (
              <div className="p-3 border-b border-gray-200/20">
                <input
                  type="text"
                  placeholder="Search filters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`
                    w-full px-3 py-2 rounded-lg text-sm
                    ${darkMode
                      ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-200 text-slate-700 placeholder-slate-400'
                    }
                    border focus:outline-none focus:ring-2 focus:ring-primary-500
                  `}
                />
              </div>
            )}

            {/* Options List */}
            <div className="max-h-64 overflow-y-auto">
              {filteredOptions.map((option, index) => (
                <motion.button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  role="option"
                  aria-selected={value === option.value}
                  aria-label={`${option.label}: ${option.description}`}
                  className={`
                    w-full px-4 py-3 text-left flex items-center space-x-3 transition-all duration-200 focus-ring
                    ${value === option.value
                      ? darkMode
                        ? 'bg-primary-600/20 text-primary-300'
                        : 'bg-primary-50 text-primary-700'
                      : darkMode
                        ? 'hover:bg-gray-700/50 text-white'
                        : 'hover:bg-gray-50 text-slate-700'
                    }
                    ${index === 0 ? 'rounded-t-xl' : ''}
                    ${index === filteredOptions.length - 1 ? 'rounded-b-xl' : ''}
                  `}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 4 }}
                >
                  {option.icon && (
                    <option.icon
                      className={`
                        ${value === option.value
                          ? darkMode ? 'text-primary-400' : 'text-primary-600'
                          : darkMode ? 'text-gray-400' : 'text-slate-500'
                        }
                      `}
                      size={18}
                    />
                  )}
                  <div className="flex flex-col">
                    <span className="font-medium">{option.label}</span>
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      {option.description}
                    </span>
                    {option.tooltip && (
                      <span className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                        {option.tooltip}
                      </span>
                    )}
                  </div>
                  {value === option.value && (
                    <motion.div
                      className="ml-auto"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                      <FiCheck className={darkMode ? 'text-primary-400' : 'text-primary-600'} size={16} />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

const SettingsPanel = ({
  format,
  quality,
  onFormatChange,
  onQualityChange,
  onProcessImages,
  isProcessing,
  hasFiles,
  onAdvancedSettingsChange = () => {}
}) => {
  const { darkMode } = useTheme();

  // New state variables for advanced features
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [resizeEnabled, setResizeEnabled] = useState(false);
  const [resizeWidth, setResizeWidth] = useState(800);
  const [resizeHeight, setResizeHeight] = useState(600);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [watermarkEnabled, setWatermarkEnabled] = useState(false);
  const [watermarkText, setWatermarkText] = useState('© Your Name');
  const [watermarkOpacity, setWatermarkOpacity] = useState(50);
  const [watermarkPosition, setWatermarkPosition] = useState('bottomRight');
  const [watermarkColor, setWatermarkColor] = useState('#ffffff');
  const [watermarkSize, setWatermarkSize] = useState(16);
  const [watermarkFont, setWatermarkFont] = useState('Arial');
  const [filterType, setFilterType] = useState('none');
  const [rotationAngle, setRotationAngle] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [batchRenameEnabled, setBatchRenameEnabled] = useState(false);
  const [batchRenamePattern, setBatchRenamePattern] = useState('image-{index}');

  // Filter options with enhanced descriptions and tooltips
  const filterOptions = [
    {
      value: 'none',
      label: 'None',
      description: 'No filter applied',
      tooltip: 'Keep the original image without any color or effect modifications.',
      icon: FiImage
    },
    {
      value: 'grayscale',
      label: 'Grayscale',
      description: 'Convert to black and white',
      tooltip: 'Remove all color information, creating a classic black and white image effect.',
      icon: FiMonitor
    },
    {
      value: 'sepia',
      label: 'Sepia',
      description: 'Warm brownish tone',
      tooltip: 'Apply a vintage sepia tone effect with warm brown colors for a nostalgic look.',
      icon: FiCamera
    },
    {
      value: 'invert',
      label: 'Invert',
      description: 'Invert all colors',
      tooltip: 'Reverse all colors in the image, creating a negative film effect.',
      icon: FiRefreshCw
    },
    {
      value: 'blur',
      label: 'Blur',
      description: 'Add blur effect',
      tooltip: 'Apply a soft blur effect to reduce sharpness and create a dreamy appearance.',
      icon: FiLayers
    },
    {
      value: 'sharpen',
      label: 'Sharpen',
      description: 'Enhance image details',
      tooltip: 'Increase edge definition and clarity to make the image appear more crisp and detailed.',
      icon: FiZap
    }
  ];

  // Watermark position options
  const positionOptions = [
    { value: 'topLeft', label: 'Top Left' },
    { value: 'topCenter', label: 'Top Center' },
    { value: 'topRight', label: 'Top Right' },
    { value: 'middleLeft', label: 'Middle Left' },
    { value: 'middleCenter', label: 'Middle Center' },
    { value: 'middleRight', label: 'Middle Right' },
    { value: 'bottomLeft', label: 'Bottom Left' },
    { value: 'bottomCenter', label: 'Bottom Center' },
    { value: 'bottomRight', label: 'Bottom Right' }
  ];

  // Font options for watermark
  const fontOptions = [
    { value: 'Arial', label: 'Arial' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Verdana', label: 'Verdana' },
    { value: 'Courier New', label: 'Courier New' },
    { value: 'Impact', label: 'Impact' },
    { value: 'Comic Sans MS', label: 'Comic Sans MS' },
    { value: 'Trebuchet MS', label: 'Trebuchet MS' },
    { value: 'Palatino', label: 'Palatino' }
  ];
  // Comprehensive format support with proper implementation and fallbacks
  const formatOptions = [
    {
      value: 'jpg',
      label: 'JPG',
      description: 'Best for photos and complex images with many colors',
      tooltip: 'JPG is great for photos as it uses lossy compression. Good balance of quality and file size, but does not support transparency. Widely supported across all platforms.',
      icon: FiCamera,
      category: 'photo',
      supported: true,
      browserSupport: 'universal'
    },
    {
      value: 'jpeg',
      label: 'JPEG',
      description: 'Standard format for photos (same as JPG)',
      tooltip: 'JPEG is identical to JPG in functionality but with a different file extension. Some systems may require this specific extension for compatibility.',
      icon: FiCamera,
      category: 'photo',
      supported: true,
      browserSupport: 'universal'
    },
    {
      value: 'png',
      label: 'PNG',
      description: 'Best for images with transparency and screenshots',
      tooltip: 'PNG uses lossless compression and supports transparency. Ideal for images with text, logos, or when you need high quality with sharp details. Perfect for web graphics.',
      icon: FiLayers,
      category: 'graphics',
      supported: true,
      browserSupport: 'universal'
    },
    {
      value: 'webp',
      label: 'WEBP',
      description: 'Modern format with excellent compression and quality',
      tooltip: 'WebP is a modern format that offers both lossy and lossless compression with smaller file sizes than JPG or PNG. Supports transparency and is widely supported in modern browsers.',
      icon: FiGlobe,
      category: 'web',
      supported: true,
      browserSupport: 'modern'
    },
    {
      value: 'avif',
      label: 'AVIF',
      description: 'Next-gen format with superior compression',
      tooltip: 'AVIF offers excellent compression efficiency and quality, outperforming WebP and JPG. Supports HDR, wide color gamut, and transparency. Limited browser support - will fallback to WebP if not supported.',
      icon: FiZap,
      category: 'modern',
      supported: true,
      browserSupport: 'limited',
      fallback: 'webp'
    },
    {
      value: 'gif',
      label: 'GIF',
      description: 'Best for simple graphics and animations',
      tooltip: 'GIF supports simple animations and transparency but is limited to 256 colors. Best for simple graphics, icons, or animations with limited color palette.',
      icon: FiPlay,
      category: 'animation',
      supported: true,
      browserSupport: 'universal'
    },
    {
      value: 'bmp',
      label: 'BMP',
      description: 'Uncompressed format with high quality',
      tooltip: 'BMP is an uncompressed raster format that preserves maximum quality but results in large file sizes. Good for archival purposes or when no compression is desired.',
      icon: FiSquare,
      category: 'basic',
      supported: true,
      browserSupport: 'universal'
    },
    {
      value: 'tiff',
      label: 'TIFF',
      description: 'Professional format for high-quality images',
      tooltip: 'TIFF is a flexible format that can be lossless or lossy. It supports various color depths and is often used in professional printing, photography, and archiving.',
      icon: FiPrinter,
      category: 'professional',
      supported: true,
      browserSupport: 'universal'
    },
    {
      value: 'ico',
      label: 'ICO',
      description: 'Icon format for favicons and shortcuts',
      tooltip: 'ICO format for creating favicons and desktop icons. Supports multiple sizes (16x16, 32x32, 48x48) in a single file. Perfect for web favicons and application icons.',
      icon: FiMonitor,
      category: 'icon',
      supported: true,
      browserSupport: 'universal',
      specialHandling: 'icon'
    },
    {
      value: 'svg',
      label: 'SVG',
      description: 'Scalable Vector Graphics',
      tooltip: 'SVG is a vector format that scales without quality loss. This conversion creates an SVG wrapper around your raster image, maintaining scalability while preserving the original image data.',
      icon: FiLayers,
      category: 'vector',
      supported: true,
      browserSupport: 'universal',
      specialHandling: 'vector'
    }
  ];

  const getQualityTooltip = () => {
    if (quality > 80) {
      return 'High quality settings preserve most image details and result in larger file sizes. Best when quality is critical.';
    } else if (quality > 40) {
      return 'Balanced settings provide good quality with reasonable file sizes. Recommended for most use cases.';
    } else {
      return 'Low quality settings significantly reduce file size but may affect image details. Use when file size is more important than quality.';
    }
  };

  // Update parent component with advanced settings when they change
  useEffect(() => {
    const advancedSettings = {
      resize: resizeEnabled ? { width: resizeWidth, height: resizeHeight, maintainAspectRatio } : null,
      watermark: watermarkEnabled ? {
        text: watermarkText,
        opacity: watermarkOpacity,
        position: watermarkPosition,
        color: watermarkColor,
        size: watermarkSize,
        font: watermarkFont
      } : null,
      filter: filterType !== 'none' ? filterType : null,
      rotation: rotationAngle !== 0 ? rotationAngle : null,
      flip: (flipHorizontal || flipVertical) ? { horizontal: flipHorizontal, vertical: flipVertical } : null,
      batchRename: batchRenameEnabled ? { pattern: batchRenamePattern } : null
    };

    onAdvancedSettingsChange(advancedSettings);
  }, [
    resizeEnabled, resizeWidth, resizeHeight, maintainAspectRatio,
    watermarkEnabled, watermarkText, watermarkOpacity, watermarkPosition, watermarkColor, watermarkSize, watermarkFont,
    filterType, rotationAngle, flipHorizontal, flipVertical,
    batchRenameEnabled, batchRenamePattern, onAdvancedSettingsChange
  ]);

  // Save current settings as a profile
  const saveSettingsProfile = () => {
    const profileName = prompt('Enter a name for this settings profile:');
    if (!profileName) return;

    const profile = {
      name: profileName,
      format,
      quality,
      resize: resizeEnabled ? { width: resizeWidth, height: resizeHeight, maintainAspectRatio } : null,
      watermark: watermarkEnabled ? { text: watermarkText, opacity: watermarkOpacity, position: watermarkPosition } : null,
      filter: filterType,
      rotation: rotationAngle,
      flip: { horizontal: flipHorizontal, vertical: flipVertical },
      batchRename: batchRenameEnabled ? { pattern: batchRenamePattern } : null
    };

    // Get existing profiles from localStorage
    const existingProfilesJSON = localStorage.getItem('imageConverterProfiles');
    const existingProfiles = existingProfilesJSON ? JSON.parse(existingProfilesJSON) : [];

    // Add new profile
    const updatedProfiles = [...existingProfiles, profile];

    // Save to localStorage
    localStorage.setItem('imageConverterProfiles', JSON.stringify(updatedProfiles));

    alert(`Profile "${profileName}" saved successfully!`);
  };

  // Load a settings profile
  const loadSettingsProfile = () => {
    // Get profiles from localStorage
    const profilesJSON = localStorage.getItem('imageConverterProfiles');
    if (!profilesJSON) {
      alert('No saved profiles found.');
      return;
    }

    const profiles = JSON.parse(profilesJSON);
    if (profiles.length === 0) {
      alert('No saved profiles found.');
      return;
    }

    // Create a simple dropdown for profile selection
    const profileIndex = prompt(
      `Select a profile by number:\n${profiles.map((p, i) => `${i + 1}. ${p.name}`).join('\n')}`
    );

    if (!profileIndex) return;

    const index = parseInt(profileIndex) - 1;
    if (isNaN(index) || index < 0 || index >= profiles.length) {
      alert('Invalid selection.');
      return;
    }

    const selectedProfile = profiles[index];

    // Apply settings from profile
    onFormatChange({ target: { value: selectedProfile.format } });
    onQualityChange({ target: { value: selectedProfile.quality } });

    setResizeEnabled(!!selectedProfile.resize);
    if (selectedProfile.resize) {
      setResizeWidth(selectedProfile.resize.width);
      setResizeHeight(selectedProfile.resize.height);
      setMaintainAspectRatio(selectedProfile.resize.maintainAspectRatio);
    }

    setWatermarkEnabled(!!selectedProfile.watermark);
    if (selectedProfile.watermark) {
      setWatermarkText(selectedProfile.watermark.text);
      setWatermarkOpacity(selectedProfile.watermark.opacity);
      setWatermarkPosition(selectedProfile.watermark.position);
    }

    setFilterType(selectedProfile.filter || 'none');
    setRotationAngle(selectedProfile.rotation || 0);

    if (selectedProfile.flip) {
      setFlipHorizontal(selectedProfile.flip.horizontal);
      setFlipVertical(selectedProfile.flip.vertical);
    }

    setBatchRenameEnabled(!!selectedProfile.batchRename);
    if (selectedProfile.batchRename) {
      setBatchRenamePattern(selectedProfile.batchRename.pattern);
    }

    alert(`Profile "${selectedProfile.name}" loaded successfully!`);
  };

  return (
    <motion.div
      className="glass-card rounded-xl shadow-2xl p-6 backdrop-blur-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <motion.div
            animate={{ rotate: [0, 15, 0, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
          >
            <FiSettings className="text-xl mr-2 gradient-text" />
          </motion.div>
          <h2 className="text-xl font-semibold gradient-text">
            Conversion Settings
          </h2>
        </div>

        <label className="modern-toggle tooltip-modern">
          <span className="tooltip-text">{showAdvancedOptions ? 'Hide advanced options' : 'Show advanced options'}</span>
          <input
            type="checkbox"
            checked={showAdvancedOptions}
            onChange={() => setShowAdvancedOptions(!showAdvancedOptions)}
          />
          <span className="modern-toggle-slider"></span>
          <span className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>
            {showAdvancedOptions ? 'Advanced' : 'Basic'}
          </span>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-y-6">
        {/* Format Selection */}
        <div>
          <div className="flex items-center mb-3">
            <label className={`block font-medium ${darkMode ? 'text-white' : 'text-slate-700'}`}>
              Output Format
            </label>
            <Tooltip
              text="Select the desired image format for conversion."
              position="top"
              className="ml-2"
            >
              <button className={`
                transition-colors
                ${darkMode
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-slate-400 hover:text-slate-600'
                }
              `}>
                <FiHelpCircle size={16} />
              </button>
            </Tooltip>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 lg:gap-6">
            {formatOptions.map((option) => (
              <motion.div
                key={option.value}
                  className={`
                    group relative glass-card-enhanced rounded-xl p-4 cursor-pointer transition-all duration-300
                    border-2 overflow-hidden min-h-[120px] flex flex-col justify-center
                    ${format === option.value
                      ? darkMode
                        ? 'border-primary-500 bg-primary-900/30 shadow-glow ring-2 ring-primary-500/50'
                        : 'border-primary-500 bg-primary-50/80 shadow-glow ring-2 ring-primary-500/50'
                      : darkMode
                        ? 'border-gray-700/50 hover:border-primary-600/70 bg-gray-800/30 hover:bg-primary-900/20'
                        : 'border-gray-200/50 hover:border-primary-400/70 bg-white/30 hover:bg-primary-50/60'
                    }
                    hover:shadow-xl hover:-translate-y-1
                  `}
                  onClick={() => onFormatChange({ target: { value: option.value } })}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: formatOptions.indexOf(option) * 0.05 }}
                >
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 -top-px overflow-hidden rounded-2xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:animate-shimmer" />
                </div>

                {/* Glow effect for selected item */}
                {format === option.value && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-2xl blur-xl" />
                )}

                <div className="relative flex flex-col h-full justify-center items-center">
                  {/* Icon and format name */}
                  <div className="flex flex-col items-center text-center">
                    <div className={`
                      w-14 h-14 rounded-xl flex items-center justify-center mb-3
                      ${format === option.value
                        ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                        : darkMode
                          ? 'bg-gray-700/50 text-gray-300 group-hover:bg-primary-600/20 group-hover:text-primary-400'
                          : 'bg-gray-100/70 text-gray-600 group-hover:bg-primary-100 group-hover:text-primary-600'
                      }
                      transition-all duration-300
                    `}>
                      <option.icon size={24} />
                    </div>

                    <div className="flex flex-col items-center">
                      <span className={`
                        font-bold text-xl
                        ${format === option.value
                          ? darkMode ? 'text-primary-300' : 'text-primary-700'
                          : darkMode ? 'text-white' : 'text-slate-700'
                        }
                      `}>
                        {option.label}
                      </span>
                      <span className={`
                        text-sm font-medium capitalize mt-1
                        ${format === option.value
                          ? darkMode ? 'text-primary-400/80' : 'text-primary-600/80'
                          : darkMode ? 'text-gray-500' : 'text-slate-400'
                        }
                      `}>
                        {option.category}
                      </span>
                    </div>
                  </div>

                  {/* Selection indicator */}
                  {format === option.value && (
                    <motion.div
                      className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 shadow-lg"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                      <FiCheck className="text-white" size={12} />
                    </motion.div>
                  )}

                  {/* Browser support warning */}
                  {option.browserSupport === 'limited' && (
                    <Tooltip
                      text="Limited browser support"
                      position="top"
                    >
                      <motion.div
                        className="absolute -top-2 -left-2 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <span className="text-white text-xs font-bold">!</span>
                      </motion.div>
                    </Tooltip>
                  )}
                </div>
                </motion.div>
            ))}
          </div>
        </div>

        {/* Quality Slider */}
        <div>
          <div className="flex items-center mb-3">
            <label className={`block font-medium ${darkMode ? 'text-white' : 'text-slate-700'}`}>
              Image Quality: <span className={`font-semibold ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{quality}%</span>
            </label>
            <Tooltip
              text={getQualityTooltip()}
              position="top"
              className="ml-2"
            >
              <button className={`
                transition-colors
                ${darkMode
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-slate-400 hover:text-slate-600'
                }
              `}>
                <FiHelpCircle size={16} />
              </button>
            </Tooltip>
          </div>

          <div className="mt-4">
            <div className="flex items-center">
              <span className={`mr-3 text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Low</span>
              <motion.div
                className="w-full relative"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={quality}
                  onChange={onQualityChange}
                  className={`
                    w-full h-2 rounded-lg appearance-none cursor-pointer range-lg
                    ${darkMode ? 'bg-gray-700' : 'bg-slate-200'}
                  `}
                  style={{
                    background: darkMode
                      ? `linear-gradient(to right, #6366f1 ${quality}%, #374151 ${quality}%)`
                      : `linear-gradient(to right, #6366f1 ${quality}%, #e2e8f0 ${quality}%)`
                  }}
                />
                <motion.div
                  className={`
                    absolute h-4 w-4 rounded-full shadow-md border-2 pointer-events-none
                    ${darkMode ? 'bg-indigo-400 border-indigo-600' : 'bg-indigo-600 border-white'}
                  `}
                  style={{
                    left: `calc(${quality}% - 8px)`,
                    top: '-4px'
                  }}
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
              <span className={`ml-3 text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>High</span>
            </div>

            <div className="flex justify-between text-xs mt-1.5 ${darkMode ? 'text-gray-400' : 'text-slate-500'}">
              <span>Smaller Size</span>
              <span>Best Quality</span>
            </div>
          </div>

          <motion.div
            className={`
              rounded-lg p-4 mt-6 shadow-sm
              ${darkMode
                ? 'bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-800/50'
                : 'bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/50'
              }
            `}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-start">
              <motion.div
                animate={{
                  rotate: [0, 10, 0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 5
                }}
                className="flex-shrink-0"
              >
                {quality > 80 ? (
                  <FiZap className={`mt-1 mr-2.5 ${darkMode ? 'text-indigo-400' : 'text-indigo-500'}`} size={18} />
                ) : (
                  <FiHelpCircle className={`mt-1 mr-2.5 ${darkMode ? 'text-indigo-400' : 'text-indigo-500'}`} size={18} />
                )}
              </motion.div>
              <div>
                <div className={`font-semibold ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                  {quality > 80
                    ? "Optimal Quality"
                    : quality > 40
                    ? "Balanced Performance"
                    : "Maximum Compression"
                  }
                </div>
                <p className={`text-xs ${darkMode ? 'text-indigo-300/90' : 'text-indigo-600/90'}`}>
                  {quality > 80
                    ? "Preserves maximum detail. Ideal for archival or print."
                    : quality > 40
                    ? "Good balance of quality and file size. Great for web use."
                    : "Smallest file size. Suitable for previews or quick sharing."
                  }
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Advanced Options Toggle */}
      <div className="mt-8 mb-4">
        <motion.button
          className={`
            flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors
            ${darkMode
              ? 'bg-gray-800/50 hover:bg-gray-700/50 text-white border border-gray-700'
              : 'bg-white/50 hover:bg-gray-50/50 text-slate-700 border border-slate-200'
            }
          `}
          onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex items-center">
            <FiSliders className={`mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            <span className="font-medium">Advanced Options</span>
          </div>
          <motion.div
            animate={{ rotate: showAdvancedOptions ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FiChevronDown className={darkMode ? 'text-gray-400' : 'text-slate-400'} />
          </motion.div>
        </motion.button>
      </div>

      {/* Advanced Options Panel */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: showAdvancedOptions ? 'auto' : 0,
          opacity: showAdvancedOptions ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className={`
          rounded-lg p-5 mb-6
          ${darkMode
            ? 'bg-gray-800/50 border border-gray-700'
            : 'bg-white/50 border border-slate-200'
          }
        `}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resize Options */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <FiMaximize2 className={`mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-slate-700'}`}>Resize Image</h3>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={resizeEnabled}
                      onChange={(e) => setResizeEnabled(e.target.checked)}
                    />
                    <div className={`
                      w-11 h-6 rounded-full peer
                      ${darkMode
                        ? 'bg-gray-700 peer-checked:bg-indigo-600'
                        : 'bg-gray-200 peer-checked:bg-indigo-600'
                      }
                      peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300
                      after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                      after:bg-white after:border-gray-300 after:border after:rounded-full
                      after:h-5 after:w-5 after:transition-all
                      peer-checked:after:translate-x-full
                    `}></div>
                  </label>
                </div>
              </div>

              {resizeEnabled && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                        Width (px)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10000"
                        value={resizeWidth}
                        onChange={(e) => setResizeWidth(parseInt(e.target.value) || 1)}
                        className={`
                          w-full px-3 py-2 rounded-lg
                          ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-slate-300 text-slate-700'
                          }
                          border focus:outline-none focus:ring-2 focus:ring-indigo-500
                        `}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                        Height (px)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10000"
                        value={resizeHeight}
                        onChange={(e) => setResizeHeight(parseInt(e.target.value) || 1)}
                        className={`
                          w-full px-3 py-2 rounded-lg
                          ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-slate-300 text-slate-700'
                          }
                          border focus:outline-none focus:ring-2 focus:ring-indigo-500
                        `}
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="maintainAspectRatio"
                      checked={maintainAspectRatio}
                      onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <label
                      htmlFor="maintainAspectRatio"
                      className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}
                    >
                      Maintain aspect ratio
                    </label>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Watermark Options */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <FiType className={`mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-slate-700'}`}>Add Watermark</h3>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={watermarkEnabled}
                      onChange={(e) => setWatermarkEnabled(e.target.checked)}
                    />
                    <div className={`
                      w-11 h-6 rounded-full peer
                      ${darkMode
                        ? 'bg-gray-700 peer-checked:bg-indigo-600'
                        : 'bg-gray-200 peer-checked:bg-indigo-600'
                      }
                      peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300
                      after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                      after:bg-white after:border-gray-300 after:border after:rounded-full
                      after:h-5 after:w-5 after:transition-all
                      peer-checked:after:translate-x-full
                    `}></div>
                  </label>
                </div>
              </div>

              {watermarkEnabled && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Watermark Text */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                      Watermark Text
                    </label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      placeholder="© Your Name"
                      className={`
                        w-full px-4 py-3 rounded-xl
                        glass-card-enhanced border-2 transition-all duration-300
                        ${darkMode
                          ? 'bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 hover:border-primary-500/70 focus:border-primary-500'
                          : 'bg-white/50 border-gray-300/50 text-slate-700 placeholder-slate-400 hover:border-primary-400/70 focus:border-primary-500'
                        }
                        focus:outline-none focus:ring-4 focus:ring-primary-200/50 dark:focus:ring-primary-800/50
                        hover:shadow-lg transform hover:-translate-y-0.5
                      `}
                    />
                  </div>

                  {/* Font and Size Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                        Font Family
                      </label>
                      <ModernDropdown
                        value={watermarkFont}
                        onChange={setWatermarkFont}
                        options={fontOptions.map(option => ({
                          ...option,
                          description: `${option.label} font family`,
                          icon: FiType
                        }))}
                        placeholder="Select font family"
                        darkMode={darkMode}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                        Font Size: {watermarkSize}px
                      </label>
                      <input
                        type="range"
                        min="8"
                        max="72"
                        value={watermarkSize}
                        onChange={(e) => setWatermarkSize(parseInt(e.target.value))}
                        className={`
                          w-full h-2 rounded-lg appearance-none cursor-pointer
                          ${darkMode ? 'bg-gray-700' : 'bg-slate-200'}
                        `}
                        style={{
                          background: darkMode
                            ? `linear-gradient(to right, #6366f1 ${(watermarkSize - 8) / (72 - 8) * 100}%, #374151 ${(watermarkSize - 8) / (72 - 8) * 100}%)`
                            : `linear-gradient(to right, #6366f1 ${(watermarkSize - 8) / (72 - 8) * 100}%, #e2e8f0 ${(watermarkSize - 8) / (72 - 8) * 100}%)`
                        }}
                      />
                    </div>
                  </div>

                  {/* Color and Opacity Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                        Text Color
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={watermarkColor}
                          onChange={(e) => setWatermarkColor(e.target.value)}
                          className={`
                            w-12 h-12 rounded-xl border-2 cursor-pointer
                            ${darkMode ? 'border-gray-600' : 'border-gray-300'}
                            hover:scale-110 transition-transform duration-200
                          `}
                        />
                        <input
                          type="text"
                          value={watermarkColor}
                          onChange={(e) => setWatermarkColor(e.target.value)}
                          className={`
                            flex-1 px-3 py-2 rounded-lg text-sm
                            ${darkMode
                              ? 'bg-gray-700 border-gray-600 text-white'
                              : 'bg-white border-gray-300 text-slate-700'
                            }
                            border focus:outline-none focus:ring-2 focus:ring-primary-500
                          `}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                        Opacity: {watermarkOpacity}%
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={watermarkOpacity}
                        onChange={(e) => setWatermarkOpacity(parseInt(e.target.value))}
                        className={`
                          w-full h-2 rounded-lg appearance-none cursor-pointer
                          ${darkMode ? 'bg-gray-700' : 'bg-slate-200'}
                        `}
                        style={{
                          background: darkMode
                            ? `linear-gradient(to right, #6366f1 ${watermarkOpacity}%, #374151 ${watermarkOpacity}%)`
                            : `linear-gradient(to right, #6366f1 ${watermarkOpacity}%, #e2e8f0 ${watermarkOpacity}%)`
                        }}
                      />
                    </div>
                  </div>

                  {/* Position */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                      Position
                    </label>
                    <ModernDropdown
                      value={watermarkPosition}
                      onChange={setWatermarkPosition}
                      options={positionOptions.map(option => ({
                        ...option,
                        description: `Place watermark at ${option.label.toLowerCase()}`,
                        icon: FiMaximize2
                      }))}
                      placeholder="Select position"
                      darkMode={darkMode}
                    />
                  </div>

                  {/* Preview */}
                  <div className={`
                    p-4 rounded-xl border-2 border-dashed
                    ${darkMode ? 'border-gray-600 bg-gray-800/30' : 'border-gray-300 bg-gray-50/50'}
                  `}>
                    <div className="text-center">
                      <p className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Watermark Preview:
                      </p>
                      <div
                        className="inline-block px-3 py-1 rounded"
                        style={{
                          fontFamily: watermarkFont,
                          fontSize: `${Math.max(watermarkSize / 2, 12)}px`,
                          color: watermarkColor,
                          opacity: watermarkOpacity / 100,
                          backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                        }}
                      >
                        {watermarkText || '© Your Name'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Image Filters */}
            <div>
              <div className="flex items-center mb-3">
                <FiFilter className={`mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-slate-700'}`}>Image Filter</h3>
              </div>

              {/* Modern Filter Dropdown */}
              <ModernDropdown
                value={filterType}
                onChange={setFilterType}
                options={filterOptions}
                placeholder="Select a filter effect"
                darkMode={darkMode}
              />
            </div>

            {/* Rotation and Flip */}
            <div>
              <div className="flex items-center mb-3">
                <FiRotateCw className={`mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-slate-700'}`}>Rotation & Flip</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                    Rotation Angle
                  </label>
                  <ModernDropdown
                    value={rotationAngle.toString()}
                    onChange={(value) => setRotationAngle(parseInt(value))}
                    options={[
                      { value: '0', label: 'No Rotation', description: 'Keep original orientation', icon: FiImage },
                      { value: '90', label: '90° Clockwise', description: 'Rotate right', icon: FiRotateCw },
                      { value: '180', label: '180° Rotation', description: 'Flip upside down', icon: FiRefreshCw },
                      { value: '270', label: '90° Counter-Clockwise', description: 'Rotate left', icon: FiRotateCw }
                    ]}
                    placeholder="Select rotation"
                    darkMode={darkMode}
                  />
                </div>

                <div className="flex items-center space-x-4 mt-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="flipHorizontal"
                      checked={flipHorizontal}
                      onChange={(e) => setFlipHorizontal(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <label
                      htmlFor="flipHorizontal"
                      className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}
                    >
                      Flip Horizontal
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="flipVertical"
                      checked={flipVertical}
                      onChange={(e) => setFlipVertical(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <label
                      htmlFor="flipVertical"
                      className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}
                    >
                      Flip Vertical
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Batch Rename */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <FiCopy className={`mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-slate-700'}`}>Batch Rename</h3>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={batchRenameEnabled}
                      onChange={(e) => setBatchRenameEnabled(e.target.checked)}
                    />
                    <div className={`
                      w-11 h-6 rounded-full peer
                      ${darkMode
                        ? 'bg-gray-700 peer-checked:bg-indigo-600'
                        : 'bg-gray-200 peer-checked:bg-indigo-600'
                      }
                      peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300
                      after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                      after:bg-white after:border-gray-300 after:border after:rounded-full
                      after:h-5 after:w-5 after:transition-all
                      peer-checked:after:translate-x-full
                    `}></div>
                  </label>
                </div>
              </div>

              {batchRenameEnabled && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                      Naming Pattern
                    </label>
                    <input
                      type="text"
                      value={batchRenamePattern}
                      onChange={(e) => setBatchRenamePattern(e.target.value)}
                      placeholder="image-{index}"
                      className={`
                        w-full px-3 py-2 rounded-lg
                        ${darkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-slate-300 text-slate-700 placeholder-slate-400'
                        }
                        border focus:outline-none focus:ring-2 focus:ring-indigo-500
                      `}
                    />
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      Use {'{index}'} for sequential numbering, {'{date}'} for current date
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Profile Management */}
          <div className="mt-6 flex justify-between">
            <motion.button
              className={`
                flex items-center px-4 py-2 rounded-lg transition-colors
                ${darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-white hover:bg-gray-100 text-slate-700 border border-slate-200'
                }
              `}
              onClick={saveSettingsProfile}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiSave className="mr-2" />
              Save Profile
            </motion.button>

            <motion.button
              className={`
                flex items-center px-4 py-2 rounded-lg transition-colors
                ${darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-white hover:bg-gray-100 text-slate-700 border border-slate-200'
                }
              `}
              onClick={loadSettingsProfile}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiMove className="mr-2" />
              Load Profile
            </motion.button>
          </div>
        </div>
      </motion.div>

      <Tooltip
        text={!hasFiles
          ? "Please add images first"
          : isProcessing
          ? "Processing in progress..."
          : "Convert and compress all images with the selected settings"
        }
        position="top"
        className="block w-full mt-8"
      >
        <motion.button
          className={`
            w-full px-6 py-3 rounded-lg text-white flex items-center justify-center shadow-lg
            btn-modern
            ${isProcessing || !hasFiles
              ? 'opacity-60 cursor-not-allowed'
              : darkMode
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500'
            }
          `}
          onClick={onProcessImages}
          disabled={isProcessing || !hasFiles}
          whileHover={!isProcessing && hasFiles ? { scale: 1.02 } : {}}
          whileTap={!isProcessing && hasFiles ? { scale: 0.98 } : {}}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {isProcessing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mr-2"
              >
                <FiRefreshCw className="text-lg" />
              </motion.div>
              Processing Images...
            </>
          ) : (
            <>
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [0, -3, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
                className="mr-2"
              >
                <FiImage className="text-lg" />
              </motion.div>
              Convert & Compress
            </>
          )}
        </motion.button>
      </Tooltip>
    </motion.div>
  );
};

export default SettingsPanel;
