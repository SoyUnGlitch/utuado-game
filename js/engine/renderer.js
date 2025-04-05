// Renderer setup for Utuado game
import * as THREE from 'three';

// Initialize the renderer
function initRenderer(container) {
    console.log('Initializing renderer...');
    
    // Create WebGL renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    // Set renderer size to match container
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    
    // Enable shadows
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Set pixel ratio for better quality on high-DPI displays
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Set tone mapping for better visual quality
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.5;
    
    // Add renderer to container
    container.appendChild(renderer.domElement);
    
    return renderer;
}

// Export functions
export { initRenderer };
