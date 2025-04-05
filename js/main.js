// Main entry point for Utuado: Sustainable Future
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Import our modules
import { initScene, updateScene } from './engine/scene.js';
import { initRenderer } from './engine/renderer.js';
import { initCamera, updateCamera } from './engine/camera.js';
import { initLighting } from './engine/lighting.js';
import { initControls, updateControls } from './engine/controls.js';
import { initTerrain } from './engine/terrain.js';

import { ResourceManager } from './game/resources.js';
import { EventSystem } from './game/events.js';
import { CharacterSystem } from './game/characters.js';
import { BuildingSystem } from './game/buildings.js';
import { SeasonSystem } from './game/seasons.js';

import { initUI, updateUI } from './ui/hud.js';
import { initMenus } from './ui/menus.js';
import { initDialogs } from './ui/dialogs.js';

// Game state
const gameState = {
    // Game time tracking
    year: 2039,
    season: 0, // 0: Spring, 1: Summer, 2: Fall, 3: Winter
    seasonNames: ['Spring', 'Summer', 'Fall', 'Winter'],
    dayTime: 0.3, // 0-1 representing time of day
    
    // Community stats
    population: 100,
    satisfaction: 80,
    
    // Track completed events
    completedEvents: [],
    
    // Track built structures
    buildings: [],
    
    // Track AI system levels
    aiSystems: {
        energyManagement: 1,
        agricultural: 1,
        environmentalMonitoring: 1,
        disasterPreparedness: 1,
        communityManagement: 1
    },
    
    // Game systems
    resources: null,
    events: null,
    characters: null,
    buildingSystem: null,
    seasonSystem: null,
    
    // Three.js objects
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    
    // Helper functions
    getSeasonName: function() {
        return this.seasonNames[this.season];
    },
    
    advanceSeason: function() {
        this.season = (this.season + 1) % 4;
        if (this.season === 0) {
            this.year++;
        }
        return this.season;
    }
};

// Asset loading tracking
const assets = {
    totalAssets: 0,
    loadedAssets: 0,
    
    // Register an asset to be loaded
    register: function() {
        this.totalAssets++;
        updateLoadingProgress();
    },
    
    // Mark an asset as loaded
    loaded: function() {
        this.loadedAssets++;
        updateLoadingProgress();
    },
    
    // Check if all assets are loaded
    allLoaded: function() {
        return this.loadedAssets === this.totalAssets && this.totalAssets > 0;
    }
};

// Update loading progress bar
function updateLoadingProgress() {
    if (assets.totalAssets === 0) return;
    
    const progress = (assets.loadedAssets / assets.totalAssets) * 100;
    document.querySelector('.progress-fill').style.width = `${progress}%`;
    
    // If all assets are loaded, start the game
    if (assets.allLoaded()) {
        setTimeout(startGame, 500); // Small delay for visual feedback
    }
}

// Initialize the game
async function initGame() {
    console.log('Initializing game...');
    
    // Initialize Three.js components
    gameState.scene = initScene();
    gameState.renderer = initRenderer(document.getElementById('game-container'));
    gameState.camera = initCamera();
    initLighting(gameState.scene);
    gameState.controls = initControls(gameState.camera, gameState.renderer.domElement);
    
    // Initialize terrain
    await initTerrain(gameState.scene, assets);
    
    // Initialize game systems
    gameState.resources = new ResourceManager();
    gameState.events = new EventSystem();
    gameState.characters = new CharacterSystem();
    gameState.buildingSystem = new BuildingSystem(gameState.scene, assets);
    gameState.seasonSystem = new SeasonSystem(gameState.scene, assets);
    
    // Initialize UI
    initUI(gameState);
    initMenus(gameState);
    initDialogs(gameState);
    
    // Start loading assets
    loadAssets();
}

// Load all game assets
function loadAssets() {
    console.log('Loading assets...');
    
    // The specific asset loading will be handled by each system
    // that registered with the assets tracker
    
    // If no assets were registered, start the game
    if (assets.totalAssets === 0) {
        startGame();
    }
}

// Start the game
function startGame() {
    console.log('Starting game...');
    
    // Hide loading screen
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 500);
    
    // Start animation loop
    animate();
    
    // Trigger initial season setup
    gameState.seasonSystem.setSeason(gameState.season);
    
    // Update UI with initial values
    updateUI(gameState);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update controls
    updateControls(gameState.controls);
    
    // Update camera
    updateCamera(gameState.camera);
    
    // Update scene (includes day/night cycle)
    updateScene(gameState.scene, gameState.dayTime);
    
    // Render the scene
    gameState.renderer.render(gameState.scene, gameState.camera);
    
    // Update UI
    updateUI(gameState);
}

// Handle window resize
function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    gameState.camera.aspect = width / height;
    gameState.camera.updateProjectionMatrix();
    
    gameState.renderer.setSize(width, height);
}

// Add event listeners
window.addEventListener('resize', onWindowResize);

// Initialize the game when the page loads
window.addEventListener('load', initGame);

// Export game state for use in other modules
export { gameState, assets };
