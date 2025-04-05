// Terrain generation for Utuado game
import * as THREE from 'three';
import { SimplexNoise } from 'three/addons/math/SimplexNoise.js';

// Initialize terrain
async function initTerrain(scene, assets) {
    console.log('Initializing terrain...');
    
    // Register terrain assets for loading
    assets.register();
    
    // Create terrain geometry
    const terrain = createTerrain();
    scene.add(terrain);
    
    // Add water
    const water = createWater();
    scene.add(water);
    
    // Mark terrain assets as loaded
    assets.loaded();
    
    return { terrain, water };
}

// Create terrain mesh
function createTerrain() {
    // Create a large plane for the terrain
    const geometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
    
    // Rotate to be horizontal
    geometry.rotateX(-Math.PI / 2);
    
    // Generate height map using simplex noise
    const noise = new SimplexNoise();
    const vertices = geometry.attributes.position.array;
    
    // Utuado is mountainous, so we'll create varied terrain
    for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i];
        const z = vertices[i + 2];
        
        // Multiple layers of noise for more natural terrain
        let height = 0;
        
        // Large mountains
        height += noise.noise(x * 0.002, z * 0.002) * 50;
        
        // Medium hills
        height += noise.noise(x * 0.01, z * 0.01) * 15;
        
        // Small details
        height += noise.noise(x * 0.05, z * 0.05) * 5;
        
        // Set minimum height for water level
        height = Math.max(height, -5);
        
        // Apply height to vertex
        vertices[i + 1] = height;
    }
    
    // Update normals for proper lighting
    geometry.computeVertexNormals();
    
    // Create material with texture
    const material = new THREE.MeshStandardMaterial({
        color: 0x3e5f34, // Green for vegetation
        roughness: 0.8,
        metalness: 0.2,
        flatShading: false
    });
    
    // Create mesh with geometry and material
    const terrain = new THREE.Mesh(geometry, material);
    
    // Enable shadows
    terrain.receiveShadow = true;
    
    return terrain;
}

// Create water surface
function createWater() {
    // Create a plane for water at sea level
    const geometry = new THREE.PlaneGeometry(1200, 1200);
    
    // Rotate to be horizontal
    geometry.rotateX(-Math.PI / 2);
    
    // Create material with blue color and transparency
    const material = new THREE.MeshStandardMaterial({
        color: 0x0077be,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.6
    });
    
    // Create mesh with geometry and material
    const water = new THREE.Mesh(geometry, material);
    
    // Position just below sea level
    water.position.y = -5.5;
    
    return water;
}

// Export functions
export { initTerrain };
