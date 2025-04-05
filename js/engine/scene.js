// Scene management for Utuado game
import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';
import { Water } from 'three/addons/objects/Water.js';

// Initialize the scene
function initScene() {
    console.log('Initializing scene...');
    
    // Create a new scene
    const scene = new THREE.Scene();
    
    // Set background color (sky blue)
    scene.background = new THREE.Color(0x87ceeb);
    
    // Add fog for distance effect
    scene.fog = new THREE.FogExp2(0x87ceeb, 0.002);
    
    // Add sky
    const sky = createSky();
    scene.add(sky);
    
    // Add ambient light for base illumination
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    scene.add(ambientLight);
    
    return scene;
}

// Create sky object
function createSky() {
    const sky = new Sky();
    sky.scale.setScalar(10000);
    
    const skyUniforms = sky.material.uniforms;
    skyUniforms['turbidity'].value = 10;
    skyUniforms['rayleigh'].value = 2;
    skyUniforms['mieCoefficient'].value = 0.005;
    skyUniforms['mieDirectionalG'].value = 0.8;
    
    return sky;
}

// Update the scene (called each frame)
function updateScene(scene, dayTime) {
    // Update sky based on time of day
    updateSky(scene, dayTime);
}

// Update sky based on time of day
function updateSky(scene, dayTime) {
    // Find the sky in the scene
    const sky = scene.children.find(child => child instanceof Sky);
    if (!sky) return;
    
    // Calculate sun position based on time of day
    const phi = Math.PI * (0.5 - 0.25); // Constant elevation
    const theta = Math.PI * (dayTime * 2 - 0.5); // Rotate based on time
    
    const sunPosition = new THREE.Vector3();
    sunPosition.x = Math.cos(phi) * Math.cos(theta);
    sunPosition.y = Math.sin(phi);
    sunPosition.z = Math.cos(phi) * Math.sin(theta);
    sunPosition.multiplyScalar(10000);
    
    // Update sky uniforms
    const skyUniforms = sky.material.uniforms;
    skyUniforms['sunPosition'].value.copy(sunPosition);
    
    // Find and update directional light (sun)
    const sunLight = scene.children.find(child => 
        child instanceof THREE.DirectionalLight && child.userData.isSun);
    
    if (sunLight) {
        sunLight.position.copy(sunPosition);
        
        // Adjust light intensity based on time of day
        // Brightest at noon (dayTime = 0.5), darkest at midnight (dayTime = 0 or 1)
        const intensity = Math.sin(dayTime * Math.PI) * 0.8 + 0.2;
        sunLight.intensity = intensity;
        
        // Adjust light color based on time of day
        // More orange/red at sunrise/sunset
        const sunriseWeight = Math.pow(Math.sin((dayTime - 0.25) * Math.PI * 2), 2) * 0.3;
        const sunsetWeight = Math.pow(Math.sin((dayTime - 0.75) * Math.PI * 2), 2) * 0.3;
        
        if (sunriseWeight > 0 || sunsetWeight > 0) {
            const weight = Math.max(sunriseWeight, sunsetWeight);
            sunLight.color.setRGB(1, 0.9 - weight * 0.5, 0.7 - weight * 0.5);
        } else {
            sunLight.color.setRGB(1, 1, 1);
        }
    }
}

// Export functions
export { initScene, updateScene };
