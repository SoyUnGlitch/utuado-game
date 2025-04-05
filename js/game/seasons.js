// Season system for Utuado game
import * as THREE from 'three';

// Season System class
class SeasonSystem {
    constructor(scene, assets) {
        // Store references to the scene and assets
        this.scene = scene;
        this.assets = assets;
        
        // Season names
        this.seasonNames = ['Spring', 'Summer', 'Fall', 'Winter'];
        
        // Season colors and environmental effects
        this.seasonSettings = [
            // Spring
            {
                skyColor: new THREE.Color(0x87ceeb), // Light blue
                fogColor: new THREE.Color(0x87ceeb),
                fogDensity: 0.002,
                groundColor: new THREE.Color(0x4caf50), // Bright green
                lightIntensity: 1.0,
                rainProbability: 0.3,
                windIntensity: 0.5,
                particleSystem: null
            },
            // Summer
            {
                skyColor: new THREE.Color(0x4fc3f7), // Bright blue
                fogColor: new THREE.Color(0x4fc3f7),
                fogDensity: 0.001,
                groundColor: new THREE.Color(0x388e3c), // Deep green
                lightIntensity: 1.2,
                rainProbability: 0.1,
                windIntensity: 0.3,
                particleSystem: null
            },
            // Fall
            {
                skyColor: new THREE.Color(0xb3e5fc), // Pale blue
                fogColor: new THREE.Color(0xb3e5fc),
                fogDensity: 0.003,
                groundColor: new THREE.Color(0xd84315), // Orange-brown
                lightIntensity: 0.8,
                rainProbability: 0.4,
                windIntensity: 0.7,
                particleSystem: null
            },
            // Winter
            {
                skyColor: new THREE.Color(0xe3f2fd), // Very pale blue
                fogColor: new THREE.Color(0xe3f2fd),
                fogDensity: 0.004,
                groundColor: new THREE.Color(0x78909c), // Bluish gray
                lightIntensity: 0.6,
                rainProbability: 0.2,
                windIntensity: 0.9,
                particleSystem: null
            }
        ];
        
        // Current season
        this.currentSeason = 0;
        
        // Weather effects
        this.isRaining = false;
        this.rainParticles = null;
        
        // Wind effect
        this.windDirection = new THREE.Vector3(1, 0, 0);
        this.windSpeed = 0;
        
        // Terrain reference
        this.terrain = null;
    }
    
    // Initialize season effects
    async initSeasons() {
        console.log('Initializing seasons...');
        
        // Register season assets for loading
        this.assets.register();
        
        // Find terrain in scene
        this.terrain = this.findTerrain();
        
        // Initialize particle systems for weather effects
        this.initWeatherEffects();
        
        // Mark season assets as loaded
        this.assets.loaded();
    }
    
    // Find terrain mesh in scene
    findTerrain() {
        // Look for a large horizontal plane that's likely the terrain
        for (const child of this.scene.children) {
            if (child instanceof THREE.Mesh && 
                child.geometry instanceof THREE.PlaneGeometry &&
                child.geometry.parameters.width >= 500) {
                return child;
            }
        }
        return null;
    }
    
    // Initialize weather effect particle systems
    initWeatherEffects() {
        // Rain particles
        const rainGeometry = new THREE.BufferGeometry();
        const rainVertices = [];
        
        // Create rain drop positions
        for (let i = 0; i < 5000; i++) {
            const x = Math.random() * 1000 - 500;
            const y = Math.random() * 200;
            const z = Math.random() * 1000 - 500;
            
            rainVertices.push(x, y, z);
        }
        
        rainGeometry.setAttribute('position', new THREE.Float32BufferAttribute(rainVertices, 3));
        
        const rainMaterial = new THREE.PointsMaterial({
            color: 0xaaaaaa,
            size: 0.5,
            transparent: true,
            opacity: 0.6
        });
        
        this.rainParticles = new THREE.Points(rainGeometry, rainMaterial);
        this.rainParticles.visible = false; // Start with rain off
        this.scene.add(this.rainParticles);
        
        // Initialize other weather effects for each season
        for (let i = 0; i < this.seasonSettings.length; i++) {
            // Fall leaves particles for autumn
            if (i === 2) { // Fall
                const leavesGeometry = new THREE.BufferGeometry();
                const leavesVertices = [];
                
                // Create leaf positions
                for (let j = 0; j < 1000; j++) {
                    const x = Math.random() * 800 - 400;
                    const y = Math.random() * 100 + 10;
                    const z = Math.random() * 800 - 400;
                    
                    leavesVertices.push(x, y, z);
                }
                
                leavesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(leavesVertices, 3));
                
                const leavesMaterial = new THREE.PointsMaterial({
                    color: 0xd84315,
                    size: 1.0,
                    transparent: true,
                    opacity: 0.8
                });
                
                this.seasonSettings[i].particleSystem = new THREE.Points(leavesGeometry, leavesMaterial);
                this.seasonSettings[i].particleSystem.visible = false;
                this.scene.add(this.seasonSettings[i].particleSystem);
            }
            
            // Snow particles for winter
            if (i === 3) { // Winter
                const snowGeometry = new THREE.BufferGeometry();
                const snowVertices = [];
                
                // Create snowflake positions
                for (let j = 0; j < 3000; j++) {
                    const x = Math.random() * 800 - 400;
                    const y = Math.random() * 200;
                    const z = Math.random() * 800 - 400;
                    
                    snowVertices.push(x, y, z);
                }
                
                snowGeometry.setAttribute('position', new THREE.Float32BufferAttribute(snowVertices, 3));
                
                const snowMaterial = new THREE.PointsMaterial({
                    color: 0xffffff,
                    size: 0.8,
                    transparent: true,
                    opacity: 0.8
                });
                
                this.seasonSettings[i].particleSystem = new THREE.Points(snowGeometry, snowMaterial);
                this.seasonSettings[i].particleSystem.visible = false;
                this.scene.add(this.seasonSettings[i].particleSystem);
            }
        }
    }
    
    // Set the current season
    setSeason(seasonIndex) {
        if (seasonIndex < 0 || seasonIndex >= this.seasonSettings.length) {
            console.error('Invalid season index:', seasonIndex);
            return;
        }
        
        console.log(`Setting season to ${this.seasonNames[seasonIndex]}`);
        this.currentSeason = seasonIndex;
        
        // Apply season settings
        const settings = this.seasonSettings[seasonIndex];
        
        // Update sky color
        if (this.scene.background) {
            this.scene.background.copy(settings.skyColor);
        }
        
        // Update fog
        if (this.scene.fog) {
            this.scene.fog.color.copy(settings.fogColor);
            if (this.scene.fog instanceof THREE.FogExp2) {
                this.scene.fog.density = settings.fogDensity;
            }
        }
        
        // Update terrain color if available
        if (this.terrain) {
            if (this.terrain.material instanceof THREE.MeshStandardMaterial) {
                this.terrain.material.color.copy(settings.groundColor);
            }
        }
        
        // Update light intensity
        const sunLight = this.findSunLight();
        if (sunLight) {
            sunLight.intensity = settings.lightIntensity;
        }
        
        // Set wind intensity
        this.windSpeed = settings.windIntensity;
        
        // Update wind direction (changes slightly each season)
        const angle = (seasonIndex / this.seasonSettings.length) * Math.PI * 2;
        this.windDirection.set(Math.cos(angle), 0, Math.sin(angle));
        
        // Hide all season-specific particle systems
        for (const season of this.seasonSettings) {
            if (season.particleSystem) {
                season.particleSystem.visible = false;
            }
        }
        
        // Show current season's particle system if it exists
        if (settings.particleSystem) {
            settings.particleSystem.visible = true;
        }
        
        // Determine if it should be raining based on probability
        this.setRaining(Math.random() < settings.rainProbability);
        
        return this.seasonNames[seasonIndex];
    }
    
    // Find the sun directional light
    findSunLight() {
        for (const child of this.scene.children) {
            if (child instanceof THREE.DirectionalLight && child.userData.isSun) {
                return child;
            }
        }
        return null;
    }
    
    // Set whether it's raining
    setRaining(isRaining) {
        this.isRaining = isRaining;
        
        if (this.rainParticles) {
            this.rainParticles.visible = isRaining;
        }
    }
    
    // Get current season name
    getCurrentSeasonName() {
        return this.seasonNames[this.currentSeason];
    }
    
    // Get current season index
    getCurrentSeasonIndex() {
        return this.currentSeason;
    }
    
    // Advance to the next season
    advanceSeason() {
        const nextSeason = (this.currentSeason + 1) % this.seasonSettings.length;
        return this.setSeason(nextSeason);
    }
    
    // Update season effects (called each frame)
    updateSeason(deltaTime) {
        // Update rain particles
        if (this.isRaining && this.rainParticles) {
            const positions = this.rainParticles.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                // Move rain drops down
                positions[i + 1] -= 1 * deltaTime;
                
                // Apply wind effect
                positions[i] += this.windDirection.x * this.windSpeed * 0.1 * deltaTime;
                positions[i + 2] += this.windDirection.z * this.windSpeed * 0.1 * deltaTime;
                
                // Reset rain drops that go below ground
                if (positions[i + 1] < 0) {
                    positions[i] = Math.random() * 1000 - 500;
                    positions[i + 1] = 200;
                    positions[i + 2] = Math.random() * 1000 - 500;
                }
            }
            
            this.rainParticles.geometry.attributes.position.needsUpdate = true;
        }
        
        // Update fall leaves
        if (this.currentSeason === 2 && this.seasonSettings[2].particleSystem) {
            const positions = this.seasonSettings[2].particleSystem.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                // Move leaves down slowly with some randomness
                positions[i + 1] -= (0.2 + Math.random() * 0.3) * deltaTime;
                
                // Apply wind effect with some swirling
                positions[i] += (this.windDirection.x * this.windSpeed + Math.sin(Date.now() * 0.001 + i) * 0.1) * deltaTime;
                positions[i + 2] += (this.windDirection.z * this.windSpeed + Math.cos(Date.now() * 0.001 + i) * 0.1) * deltaTime;
                
                // Reset leaves that go below ground
                if (positions[i + 1] < 0) {
                    positions[i] = Math.random() * 800 - 400;
                    positions[i + 1] = 100 + Math.random() * 20;
                    positions[i + 2] = Math.random() * 800 - 400;
                }
            }
            
            this.seasonSettings[2].particleSystem.geometry.attributes.position.needsUpdate = true;
        }
        
        // Update snow
        if (this.currentSeason === 3 && this.seasonSettings[3].particleSystem) {
            const positions = this.seasonSettings[3].particleSystem.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                // Move snow down slowly with some randomness
                positions[i + 1] -= (0.3 + Math.random() * 0.2) * deltaTime;
                
                // Apply wind effect with some swirling
                positions[i] += (this.windDirection.x * this.windSpeed + Math.sin(Date.now() * 0.0005 + i) * 0.05) * deltaTime;
                positions[i + 2] += (this.windDirection.z * this.windSpeed + Math.cos(Date.now() * 0.0005 + i) * 0.05) * deltaTime;
                
                // Reset snow that goes below ground
                if (positions[i + 1] < 0) {
                    positions[i] = Math.random() * 800 - 400;
                    positions[i + 1] = 200 + Math.random() * 20;
                    positions[i + 2] = Math.random() * 800 - 400;
                }
            }
            
            this.seasonSettings[3].particleSystem.geometry.attributes.position.needsUpdate = true;
        }
    }
}

// Export the SeasonSystem class
export { SeasonSystem };
