// Main entry point for Utuado: Sustainable Future - Minecraft Style
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VoxelWorld } from './voxel/VoxelWorld.js';
import { GameState } from './game/GameState.js';
import { ResourceManager } from './game/ResourceManager.js';
import { BuildingSystem } from './game/BuildingSystem.js';
import { EventSystem } from './game/EventSystem.js';
import { UIManager } from './ui/UIManager.js';
import { SeasonSystem } from './game/SeasonSystem.js';

// Game configuration
const config = {
    chunkSize: 16,
    worldSize: {
        width: 32,
        height: 16,
        depth: 32
    },
    blockSize: 1,
    startingResources: {
        energy: 100,
        water: 100,
        food: 100,
        materials: 100,
        knowledge: 50
    },
    dayLength: 60, // seconds per day
    seasonLength: 7, // days per season
};

class Game {
    constructor() {
        this.isInitialized = false;
        this.isPaused = false;
        this.clock = new THREE.Clock();
        this.loadingProgress = 0;
        
        // Initialize systems
        this.gameState = new GameState(config);
        this.resourceManager = new ResourceManager(config.startingResources);
        this.buildingSystem = new BuildingSystem();
        this.eventSystem = new EventSystem();
        this.seasonSystem = new SeasonSystem(config.dayLength, config.seasonLength);
        this.uiManager = new UIManager(this);
        
        // Setup loading screen
        this.setupLoadingScreen();
        
        // Start initialization
        this.init();
    }
    
    setupLoadingScreen() {
        this.progressFill = document.querySelector('.progress-fill');
        this.loadingText = document.querySelector('.loading-text');
        
        // Simulate loading progress
        const loadingInterval = setInterval(() => {
            this.loadingProgress += 1;
            this.progressFill.style.width = `${this.loadingProgress}%`;
            
            if (this.loadingProgress < 100) {
                this.loadingText.textContent = `Loading game assets... ${this.loadingProgress}%`;
            } else {
                this.loadingText.textContent = 'Click to start game';
                clearInterval(loadingInterval);
                
                // Add click event to start game
                document.getElementById('loading-screen').addEventListener('click', () => {
                    if (this.loadingProgress >= 100 && this.isInitialized) {
                        document.getElementById('loading-screen').classList.add('hidden');
                        this.start();
                    }
                });
            }
        }, 30);
    }
    
    async init() {
        try {
            // Initialize renderer
            this.renderer = new THREE.WebGLRenderer({ antialias: true });
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            document.getElementById('game-container').appendChild(this.renderer.domElement);
            
            // Initialize scene
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
            
            // Initialize camera
            this.camera = new THREE.PerspectiveCamera(
                70, 
                window.innerWidth / window.innerHeight, 
                0.1, 
                1000
            );
            this.camera.position.set(config.worldSize.width / 2, config.worldSize.height + 5, config.worldSize.depth + 10);
            this.camera.lookAt(config.worldSize.width / 2, 0, config.worldSize.depth / 2);
            
            // Initialize controls
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.screenSpacePanning = false;
            this.controls.minDistance = 5;
            this.controls.maxDistance = 50;
            this.controls.maxPolarAngle = Math.PI / 2.1; // Limit vertical rotation
            
            // Initialize lighting
            this.setupLighting();
            
            // Initialize voxel world
            this.voxelWorld = new VoxelWorld({
                chunkSize: config.chunkSize,
                worldSize: config.worldSize,
                blockSize: config.blockSize,
                scene: this.scene
            });
            
            // Generate terrain
            await this.voxelWorld.generateTerrain();
            
            // Setup raycasting for block interaction
            this.setupRaycasting();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Connect UI manager
            this.uiManager.init();
            
            // Mark as initialized
            this.isInitialized = true;
            
            // Handle window resize
            window.addEventListener('resize', () => this.onWindowResize());
            
        } catch (error) {
            console.error('Error initializing game:', error);
            this.loadingText.textContent = 'Error loading game. Please refresh.';
        }
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
        this.scene.add(ambientLight);
        
        // Directional light (sun)
        this.sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
        this.sunLight.position.set(1, 1, 0.5).normalize();
        this.sunLight.castShadow = true;
        this.scene.add(this.sunLight);
        
        // Update sun position based on time of day
        this.seasonSystem.onTimeUpdate((time) => {
            const dayProgress = time.dayProgress;
            const sunAngle = Math.PI * (dayProgress - 0.5);
            this.sunLight.position.x = Math.cos(sunAngle);
            this.sunLight.position.y = Math.sin(sunAngle) + 0.5;
            
            // Adjust light intensity based on time of day
            const intensity = Math.max(0.1, Math.sin(dayProgress * Math.PI));
            this.sunLight.intensity = intensity;
            
            // Adjust ambient light based on time of day
            ambientLight.intensity = 0.2 + (intensity * 0.3);
        });
    }
    
    setupRaycasting() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.highlightedBlock = null;
        this.highlightMesh = new THREE.Mesh(
            new THREE.BoxGeometry(1.01, 1.01, 1.01),
            new THREE.MeshBasicMaterial({
                color: 0xffffff,
                opacity: 0.5,
                transparent: true,
                wireframe: true
            })
        );
        this.scene.add(this.highlightMesh);
        this.highlightMesh.visible = false;
    }
    
    setupEventListeners() {
        const canvas = this.renderer.domElement;
        
        // Mouse move for block highlighting
        canvas.addEventListener('mousemove', (event) => {
            event.preventDefault();
            
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });
        
        // Mouse click for block interaction
        canvas.addEventListener('click', (event) => {
            event.preventDefault();
            
            if (this.isPaused) return;
            
            // Check if a building is selected
            const selectedBuilding = this.uiManager.getSelectedBuilding();
            
            if (event.shiftKey) {
                // Remove block
                this.removeBlock();
            } else if (selectedBuilding) {
                // Place building
                this.placeBuilding(selectedBuilding);
            }
        });
        
        // Touch events for mobile
        canvas.addEventListener('touchstart', (event) => {
            if (event.touches.length === 1) {
                event.preventDefault();
                
                const touch = event.touches[0];
                this.mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
                this.mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
                
                // Long press detection for removing blocks
                this.touchStartTime = Date.now();
                this.touchTimer = setTimeout(() => {
                    this.removeBlock();
                }, 500);
            }
        });
        
        canvas.addEventListener('touchend', (event) => {
            if (event.changedTouches.length === 1) {
                event.preventDefault();
                
                clearTimeout(this.touchTimer);
                
                // If it was a short tap, place block
                if (Date.now() - this.touchStartTime < 500) {
                    const selectedBuilding = this.uiManager.getSelectedBuilding();
                    if (selectedBuilding) {
                        this.placeBuilding(selectedBuilding);
                    }
                }
            }
        });
        
        // Keyboard controls
        window.addEventListener('keydown', (event) => {
            if (event.key === 'b') {
                this.uiManager.toggleBuildingMenu();
            } else if (event.key === 'Escape') {
                this.uiManager.closeAllMenus();
            } else if (event.key === 'h') {
                this.uiManager.toggleHelpPanel();
            }
        });
    }
    
    start() {
        this.isPaused = false;
        this.clock.start();
        this.animate();
        
        // Start game systems
        this.seasonSystem.start();
        this.resourceManager.start();
        this.eventSystem.start(this.gameState, this.resourceManager, this.uiManager);
        
        // Update UI
        this.uiManager.updateResourceDisplay(this.resourceManager.getResources());
        this.uiManager.updateSeasonDisplay(this.seasonSystem.getCurrentSeason(), this.seasonSystem.getCurrentDay());
    }
    
    pause() {
        this.isPaused = true;
        this.clock.stop();
    }
    
    resume() {
        this.isPaused = false;
        this.clock.start();
    }
    
    animate() {
        if (!this.isInitialized) return;
        
        requestAnimationFrame(() => this.animate());
        
        if (!this.isPaused) {
            const delta = this.clock.getDelta();
            
            // Update controls
            this.controls.update();
            
            // Update raycasting
            this.updateRaycasting();
            
            // Update game systems
            this.seasonSystem.update(delta);
            this.resourceManager.update(delta);
            
            // Render scene
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    updateRaycasting() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        const intersects = this.raycaster.intersectObjects(this.voxelWorld.getMeshes());
        
        if (intersects.length > 0) {
            const intersect = intersects[0];
            
            // Calculate voxel position
            const voxelPosition = this.voxelWorld.getVoxelPositionFromIntersect(intersect);
            
            // Update highlight position
            if (voxelPosition) {
                this.highlightMesh.position.copy(voxelPosition).addScalar(0.5);
                this.highlightMesh.visible = true;
                this.highlightedBlock = voxelPosition;
            }
        } else {
            this.highlightMesh.visible = false;
            this.highlightedBlock = null;
        }
    }
    
    placeBuilding(buildingType) {
        if (!this.highlightedBlock) return;
        
        // Check if we can afford the building
        const buildingData = this.buildingSystem.getBuildingData(buildingType);
        if (!this.resourceManager.canAfford(buildingData.cost)) {
            this.uiManager.showNotification('Not enough resources to build ' + buildingData.name);
            return;
        }
        
        // Place the building
        const success = this.voxelWorld.placeBuilding(
            this.highlightedBlock.x,
            this.highlightedBlock.y + 1,
            this.highlightedBlock.z,
            buildingType
        );
        
        if (success) {
            // Deduct resources
            this.resourceManager.deductResources(buildingData.cost);
            
            // Add building to game state
            this.gameState.addBuilding(buildingType, {
                x: this.highlightedBlock.x,
                y: this.highlightedBlock.y + 1,
                z: this.highlightedBlock.z
            });
            
            // Apply building effects
            this.resourceManager.applyBuildingEffect(buildingData.effect);
            
            // Update UI
            this.uiManager.updateResourceDisplay(this.resourceManager.getResources());
            this.uiManager.showNotification(buildingData.name + ' built successfully');
        }
    }
    
    removeBlock() {
        if (!this.highlightedBlock) return;
        
        // Check if there's a building at this position
        const building = this.gameState.getBuildingAt(
            this.highlightedBlock.x,
            this.highlightedBlock.y,
            this.highlightedBlock.z
        );
        
        if (building) {
            // Remove building from game state
            this.gameState.removeBuilding(building.id);
            
            // Remove building effects
            const buildingData = this.buildingSystem.getBuildingData(building.type);
            this.resourceManager.removeBuildingEffect(buildingData.effect);
            
            // Update UI
            this.uiManager.updateResourceDisplay(this.resourceManager.getResources());
            this.uiManager.showNotification(buildingData.name + ' removed');
        }
        
        // Remove the block
        this.voxelWorld.removeVoxel(
            this.highlightedBlock.x,
            this.highlightedBlock.y,
            this.highlightedBlock.z
        );
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Start the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});

export default Game;
