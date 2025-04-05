// GameState.js - Manages the overall game state for Utuado game
export class GameState {
    constructor(config) {
        this.config = config;
        this.buildings = [];
        this.nextBuildingId = 1;
        this.population = 0;
        this.happiness = 100;
        this.sustainability = 50;
        this.aiLevel = 0;
    }
    
    // Add a building to the game state
    addBuilding(type, position) {
        const building = {
            id: this.nextBuildingId++,
            type,
            position,
            health: 100,
            createdAt: Date.now()
        };
        
        this.buildings.push(building);
        
        // Update game metrics based on building type
        this.updateMetricsForBuilding(type, true);
        
        return building.id;
    }
    
    // Remove a building from the game state
    removeBuilding(id) {
        const index = this.buildings.findIndex(b => b.id === id);
        
        if (index !== -1) {
            const building = this.buildings[index];
            
            // Update game metrics based on building type
            this.updateMetricsForBuilding(building.type, false);
            
            // Remove building
            this.buildings.splice(index, 1);
            
            return true;
        }
        
        return false;
    }
    
    // Get a building by ID
    getBuilding(id) {
        return this.buildings.find(b => b.id === id);
    }
    
    // Get a building at position
    getBuildingAt(x, y, z) {
        return this.buildings.find(b => 
            b.position.x === x && 
            b.position.y === y && 
            b.position.z === z
        );
    }
    
    // Get all buildings
    getAllBuildings() {
        return [...this.buildings];
    }
    
    // Get buildings by type
    getBuildingsByType(type) {
        return this.buildings.filter(b => b.type === type);
    }
    
    // Update game metrics based on building type
    updateMetricsForBuilding(type, isAdding) {
        const factor = isAdding ? 1 : -1;
        
        switch (type) {
            case 'house':
                this.population += 5 * factor;
                break;
            case 'community_center':
                this.population += 10 * factor;
                this.happiness += 5 * factor;
                break;
            case 'solar_panel':
            case 'wind_turbine':
            case 'hydro_plant':
                this.sustainability += 5 * factor;
                break;
            case 'farm':
            case 'greenhouse':
                this.sustainability += 3 * factor;
                break;
            case 'ai_hub':
                this.aiLevel += 1 * factor;
                break;
            case 'sensor_network':
                this.aiLevel += 0.5 * factor;
                break;
        }
        
        // Ensure values stay within bounds
        this.population = Math.max(0, this.population);
        this.happiness = Math.max(0, Math.min(100, this.happiness));
        this.sustainability = Math.max(0, Math.min(100, this.sustainability));
        this.aiLevel = Math.max(0, this.aiLevel);
    }
    
    // Get current population
    getPopulation() {
        return this.population;
    }
    
    // Get current happiness
    getHappiness() {
        return this.happiness;
    }
    
    // Get current sustainability
    getSustainability() {
        return this.sustainability;
    }
    
    // Get current AI level
    getAILevel() {
        return this.aiLevel;
    }
    
    // Update happiness based on resource levels
    updateHappiness(resources) {
        // Happiness decreases if resources are low
        let newHappiness = this.happiness;
        
        const resourceFactors = {
            energy: 0.2,
            water: 0.3,
            food: 0.3,
            materials: 0.1,
            knowledge: 0.1
        };
        
        // Calculate happiness change based on resources
        let happinessChange = 0;
        
        for (const [resource, factor] of Object.entries(resourceFactors)) {
            const resourceLevel = resources[resource];
            
            if (resourceLevel < 20) {
                // Critical shortage
                happinessChange -= factor * 2;
            } else if (resourceLevel < 50) {
                // Shortage
                happinessChange -= factor;
            } else if (resourceLevel > 80) {
                // Abundance
                happinessChange += factor * 0.5;
            }
        }
        
        // Apply change
        newHappiness += happinessChange;
        
        // Ensure happiness stays within bounds
        this.happiness = Math.max(0, Math.min(100, newHappiness));
        
        return this.happiness;
    }
    
    // Apply seasonal effects to game state
    applySeasonalEffects(season) {
        switch (season) {
            case 'spring':
                // Spring is good for farming
                this.happiness += 2;
                break;
            case 'summer':
                // Summer can be hot, affecting happiness
                this.happiness -= 1;
                break;
            case 'fall':
                // Fall is harvest season
                this.happiness += 1;
                break;
            case 'winter':
                // Winter is challenging
                this.happiness -= 2;
                break;
        }
        
        // Ensure happiness stays within bounds
        this.happiness = Math.max(0, Math.min(100, this.happiness));
        
        return this.happiness;
    }
    
    // Get game state summary
    getSummary() {
        return {
            buildingCount: this.buildings.length,
            population: this.population,
            happiness: this.happiness,
            sustainability: this.sustainability,
            aiLevel: this.aiLevel
        };
    }
}
