// Camera setup for Utuado game
import * as THREE from 'three';

// Initialize the camera
function initCamera() {
    console.log('Initializing camera...');
    
    // Create perspective camera
    const camera = new THREE.PerspectiveCamera(
        75, // Field of view
        window.innerWidth / window.innerHeight, // Aspect ratio
        0.1, // Near clipping plane
        10000 // Far clipping plane
    );
    
    // Set initial camera position
    camera.position.set(100, 100, 100);
    camera.lookAt(0, 0, 0);
    
    return camera;
}

// Update camera (called each frame)
function updateCamera(camera) {
    // This function can be used for camera animations or following targets
    // Currently empty as the OrbitControls handle camera movement
}

// Export functions
export { initCamera, updateCamera };
