// FPVGate Web Flasher
const GITHUB_API = 'https://api.github.com/repos/LouisHitchcock/FPVGate/releases';
const GITHUB_RELEASE_BASE = 'https://github.com/LouisHitchcock/FPVGate/releases/download';

// Board configurations
const BOARD_CONFIGS = {
    esp32s3: {
        name: 'ESP32-S3 DevKitC-1 (8MB)',
        chipFamily: 'ESP32-S3',
        parts: [
            { path: 'bootloader.bin', offset: 0x0 },
            { path: 'partitions.bin', offset: 0x8000 },
            { path: 'firmware.bin', offset: 0x10000 },
            { path: 'littlefs.bin', offset: 0x410000 }
        ]
    },
    esp32s3supermini: {
        name: 'ESP32-S3 Super Mini (4MB)',
        chipFamily: 'ESP32-S3',
        parts: [
            { path: 'bootloader.bin', offset: 0x0 },
            { path: 'partitions.bin', offset: 0x8000 },
            { path: 'firmware.bin', offset: 0x10000 },
            { path: 'littlefs.bin', offset: 0x210000 }
        ]
    }
};

let releases = [];
let selectedBoard = null;
let selectedVersion = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadReleases();
    setupEventListeners();
});

// Load releases from GitHub API
async function loadReleases() {
    const versionSelect = document.getElementById('version-select');
    
    try {
        const response = await fetch(GITHUB_API);
        if (!response.ok) throw new Error('Failed to fetch releases');
        
        const data = await response.json();
        releases = data.filter(release => !release.draft && release.assets.length > 0);
        
        // Populate version dropdown
        versionSelect.innerHTML = '<option value="">Choose firmware version...</option>';
        releases.forEach(release => {
            const option = document.createElement('option');
            option.value = release.tag_name;
            option.textContent = `${release.tag_name}${release.prerelease ? ' (Pre-release)' : ''}${release.tag_name === releases[0].tag_name ? ' (Latest)' : ''}`;
            versionSelect.appendChild(option);
        });
        
        // Auto-select latest stable release
        if (releases.length > 0) {
            const latestStable = releases.find(r => !r.prerelease) || releases[0];
            versionSelect.value = latestStable.tag_name;
            selectedVersion = latestStable;
            updateVersionInfo();
        }
        
    } catch (error) {
        console.error('Error loading releases:', error);
        showError('Failed to load firmware versions. Please try again later.');
        versionSelect.innerHTML = '<option value="">Failed to load versions</option>';
    }
}

// Setup event listeners
function setupEventListeners() {
    const boardSelect = document.getElementById('board-select');
    const versionSelect = document.getElementById('version-select');
    
    boardSelect.addEventListener('change', (e) => {
        selectedBoard = e.target.value;
        updateFlashSection();
    });
    
    versionSelect.addEventListener('change', (e) => {
        const version = e.target.value;
        selectedVersion = releases.find(r => r.tag_name === version);
        updateVersionInfo();
        updateFlashSection();
    });
}

// Update version info display
function updateVersionInfo() {
    const versionInfo = document.getElementById('version-info');
    
    if (selectedVersion) {
        const date = new Date(selectedVersion.published_at).toLocaleDateString();
        versionInfo.textContent = `Released: ${date}${selectedVersion.prerelease ? ' (Pre-release)' : ''}`;
    } else {
        versionInfo.textContent = '';
    }
}

// Update flash section visibility and content
function updateFlashSection() {
    const flashSection = document.getElementById('flash-section');
    const errorSection = document.getElementById('error-section');
    
    errorSection.style.display = 'none';
    
    if (selectedBoard && selectedVersion) {
        flashSection.style.display = 'block';
        updateFlashInfo();
        prepareFlashButton();
    } else {
        flashSection.style.display = 'none';
    }
}

// Update flash information display
function updateFlashInfo() {
    const boardConfig = BOARD_CONFIGS[selectedBoard];
    
    document.getElementById('selected-board').textContent = boardConfig.name;
    document.getElementById('selected-version').textContent = selectedVersion.tag_name;
    document.getElementById('flash-description').textContent = 
        `Ready to flash ${selectedVersion.tag_name} firmware for ${boardConfig.name}`;
}

// Prepare the ESP Web Tools flash button
async function prepareFlashButton() {
    const installButton = document.getElementById('install-button');
    const loadingSection = document.getElementById('loading-section');
    const flashSection = document.getElementById('flash-section');
    
    loadingSection.style.display = 'block';
    flashSection.style.display = 'none';
    
    try {
        const manifest = await generateManifest();
        
        // Set manifest on the install button
        installButton.manifest = manifest;
        
        loadingSection.style.display = 'none';
        flashSection.style.display = 'block';
        
    } catch (error) {
        console.error('Error preparing flash:', error);
        showError('Failed to prepare firmware. Please try again.');
        loadingSection.style.display = 'none';
    }
}

// Generate ESP Web Tools manifest
async function generateManifest() {
    const boardConfig = BOARD_CONFIGS[selectedBoard];
    const version = selectedVersion.tag_name;
    
    // Build the manifest object
    const manifest = {
        name: `FPVGate ${version}`,
        version: version,
        home_assistant_domain: 'esphome',
        new_install_prompt_erase: true,
        builds: [
            {
                chipFamily: boardConfig.chipFamily,
                parts: boardConfig.parts.map(part => ({
                    path: `${GITHUB_RELEASE_BASE}/${version}/${part.path}`,
                    offset: part.offset
                }))
            }
        ]
    };
    
    return JSON.stringify(manifest);
}

// Show error message
function showError(message) {
    const errorSection = document.getElementById('error-section');
    const errorMessage = document.getElementById('error-message');
    
    errorMessage.textContent = message;
    errorSection.style.display = 'block';
}

// Check if browser supports Web Serial
if (!navigator.serial) {
    document.addEventListener('DOMContentLoaded', () => {
        const alertDiv = document.querySelector('.alert-info');
        alertDiv.className = 'alert alert-error';
        alertDiv.innerHTML = '<strong>Browser Not Supported!</strong><br>Please use Chrome, Edge, or Opera browser to flash your device.';
    });
}
