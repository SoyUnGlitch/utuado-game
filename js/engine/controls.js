// Controls setup for Utuado game
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Initialize controls
function initControls(camera, domElement) {
    console.log('Initializing controls...');
    
    // Create orbit controls
    const controls = new OrbitControls(camera, domElement);
    
    // Configure controls
    controls.enableDamping = true; // Smooth camera movement
    controls.dampingFactor = 0.05;
    
    controls.screenSpacePanning = false;
    
    controls.minDistance = 20; // Minimum zoom distance
    controls.maxDistance = 500; // Maximum zoom distance
    
    controls.maxPolarAngle = Math.PI / 2.1; // Limit vertical rotation to just below horizontal
    
    // Set initial target
    controls.target.set(0, 0, 0);
    controls.update();
    
    return controls;
}

// Update controls (called each frame)
function updateControls(controls) {
    if (controls) {
        controls.update();
    }
}

// Export functions
export { initControls, updateControls };
