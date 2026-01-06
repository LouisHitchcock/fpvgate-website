# GitHub Pages Setup Instructions

## Enable GitHub Pages

1. Go to your repository: https://github.com/LouisHitchcock/fpvgate-website
2. Click **Settings** → **Pages** (in the left sidebar)
3. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
4. Save the settings

The workflow will automatically deploy on the next push to main (which has already happened).

## Access Your Site

Once deployed, your site will be available at:
- **https://louishitchcock.github.io/fpvgate-website/**

You can also set up a custom domain if desired.

## Important: Binary File Names

The web flasher expects the following binary file names in each release:
- `bootloader.bin`
- `partitions.bin`
- `firmware.bin`
- `littlefs.bin`

Make sure your release process in the FPVGate repository produces binaries with these exact names.

## Testing the Flasher

1. Visit the deployed site
2. Go to the "Flash Firmware" page
3. The version dropdown should automatically populate with releases from FPVGate repo
4. Select a board and version
5. Click "Connect & Flash Device" (requires Chrome/Edge/Opera with device connected)

## Troubleshooting

### Versions not loading
- Check browser console for CORS or API errors
- Verify releases exist in FPVGate repository with assets

### Flash button not working
- Ensure using Chrome, Edge, or Opera (Web Serial API required)
- Check that ESP32-S3 is connected via USB
- Try holding BOOT button when connecting

### Wrong binary files
- Update the `BOARD_CONFIGS` in `flasher.js` if binary names change
- Ensure release assets match expected file names

## Future Enhancements

Potential improvements:
- Add board images/diagrams
- Include wiring guide on website
- Add FAQ section
- Show release notes for selected version
- Add manual manifest upload option
- Include troubleshooting wizard
