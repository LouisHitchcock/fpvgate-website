# FPVGate Website

Official website and web-based flasher for [FPVGate](https://github.com/LouisHitchcock/FPVGate) - Personal FPV Lap Timer for ESP32-S3.

## Features

- **Homepage**: Project information, features, supported hardware
- **Web Flasher**: Browser-based firmware flasher using ESP Web Tools
  - No command line required
  - Automatic release detection from GitHub
  - Board selection (ESP32-S3 DevKitC-1, ESP32-S3 Super Mini)
  - Version picker with latest/stable releases
  - One-click flashing via Web Serial API

## Technology

- Pure HTML/CSS/JavaScript
- [ESP Web Tools](https://esphome.github.io/esp-web-tools/) for firmware flashing
- GitHub API for automatic release detection
- GitHub Pages for hosting

## Development

### Local Testing

Simply open `index.html` in a web browser. For full functionality (Web Serial API), use a local server:

```bash
# Python 3
python -m http.server 8000

# Node.js (http-server)
npx http-server
```

Then navigate to `http://localhost:8000`

### Requirements

- Modern browser with Web Serial API support (Chrome, Edge, Opera)
- Internet connection for GitHub API and ESP Web Tools

## How It Works

1. **Release Detection**: Fetches latest releases from FPVGate GitHub repository via API
2. **Board Selection**: User selects their ESP32-S3 board type
3. **Version Selection**: User selects firmware version (auto-selects latest stable)
4. **Manifest Generation**: Creates ESP Web Tools manifest with correct binary URLs and offsets
5. **Flashing**: ESP Web Tools handles the actual flashing via Web Serial API

## Binary Structure

### ESP32-S3 DevKitC-1 (8MB)
- `0x0` - bootloader.bin
- `0x8000` - partitions.bin
- `0x10000` - firmware.bin
- `0x410000` - littlefs.bin

### ESP32-S3 Super Mini (4MB)
- `0x0` - bootloader.bin
- `0x8000` - partitions.bin
- `0x10000` - firmware.bin
- `0x210000` - littlefs.bin

## Deployment

This site is automatically deployed to GitHub Pages when pushed to the main branch.

## License

Licensed under CC BY-NC-SA 4.0, matching the FPVGate project license.

## Links

- [FPVGate Repository](https://github.com/LouisHitchcock/FPVGate)
- [Documentation](https://github.com/LouisHitchcock/FPVGate/tree/main/docs)
- [Issues](https://github.com/LouisHitchcock/FPVGate/issues)
