// Lighting setup for Utuado game
import * as THREE from 'three';

// Initialize lighting
function initLighting(scene) {
    console.log('Initializing lighting...');
    
    // Add directional light (sun)
    const sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.position.set(0, 1000, 0);
    sunLight.castShadow = true;
    
    // Configure shadow properties for better quality
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 2000;
    sunLight.shadow.camera.left = -500;
    sunLight.shadow.camera.right = 500;
    sunLight.shadow.camera.top = 500;
    sunLight.shadow.camera.bottom = -500;
    sunLight.shadow.bias = -0.0005;
    
    // Mark this light as the sun for day/night cycle
    sunLight.userData.isSun = true;
    
    scene.add(sunLight);
    
    // Add hemisphere light for ambient illumination from sky and ground
    const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x3e5f34, 0.6);
    scene.add(hemiLight);
    
    return { sunLight, hemiLight };
}

// Export functions
export { initLighting };
