// ResourceManager.js - Manages resources for Utuado game
export class ResourceManager {
    constructor(startingResources) {
        // Initialize resources
        this.resources = { ...startingResources };
        
        // Resource production/consumption rates per day
        this.baseRates = {
            energy: -5,
            water: -5,
            food: -5,
            materials: -2,
            knowledge: 1
        };
        
        // Building effects on resource rates
        this.buildingEffects = [];
        
        // Resource limits
        this.resourceLimits = {
            energy: 200,
            water: 200,
            food: 200,
            materials: 200,
            knowledge: 200
        };
        
        // Time tracking
        this.lastUpdateTime = 0;
        this.updateInterval = 1; // seconds between updates
    }
    
    // Start resource management
    start() {
        this.lastUpdateTime = Date.now() / 1000; // Convert to seconds
    }
    
    // Update resources based on time passed
    update(deltaTime) {
        const currentTime = Date.now() / 1000;
        
        // Check if it's time to update resources
        if (currentTime - this.lastUpdateTime >= this.updateInterval) {
            // Calculate time factor (portion of a day)
            const dayFraction = this.updateInterval / (24 * 60 * 60); // Assuming 1 game day = 24 real seconds
            
            // Update each resource
            for (const [resource, baseRate] of Object.entries(this.baseRates)) {
                // Calculate total rate including building effects
                let totalRate = baseRate;
                
                // Apply building effects
                for (const effect of this.buildingEffects) {
                    if (effect.resource === resource) {
                        totalRate += effect.rate;
                    }
                }
                
                // Apply rate to resource
                this.resources[resource] += totalRate * dayFraction;
                
                // Ensure resource stays within limits
                this.resources[resource] = Math.max(0, Math.min(this.resources[resource], this.resourceLimits[resource]));
            }
            
            // Update last update time
            this.lastUpdateTime = currentTime;
        }
    }
    
    // Get current resources
    getResources() {
        return { ...this.resources };
    }
    
    // Get specific resource
    getResource(resource) {
        return this.resources[resource];
    }
    
    // Add resources
    addResources(resources) {
        for (const [resource, amount] of Object.entries(resources)) {
            if (this.resources[resource] !== undefined) {
                this.resources[resource] += amount;
                this.resources[resource] = Math.max(0, Math.min(this.resources[resource], this.resourceLimits[resource]));
            }
        }
    }
    
    // Deduct resources
    deductResources(resources) {
        for (const [resource, amount] of Object.entries(resources)) {
            if (this.resources[resource] !== undefined) {
                this.resources[resource] -= amount;
                this.resources[resource] = Math.max(0, this.resources[resource]);
            }
        }
    }
    
    // Check if can afford resources
    canAfford(resources) {
        for (const [resource, amount] of Object.entries(resources)) {
            if (this.resources[resource] === undefined || this.resources[resource] < amount) {
                return false;
            }
        }
        return true;
    }
    
    // Apply building effect
    applyBuildingEffect(effect) {
        if (effect) {
            this.buildingEffects.push({ ...effect, id: Date.now() });
        }
    }
    
    // Remove building effect
    removeBuildingEffect(effect) {
        if (!effect) return;
        
        // Find matching effect
        const index = this.buildingEffects.findIndex(e => 
            e.resource === effect.resource && e.rate === effect.rate
        );
        
        if (index !== -1) {
            this.buildingEffects.splice(index, 1);
        }
    }
    
    // Apply seasonal effects to resources
    applySeasonalEffects(season) {
        switch (season) {
            case 'spring':
                // Spring increases water and food production
                this.addResources({ water: 10, food: 5 });
                break;
            case 'summer':
                // Summer increases energy but decreases water
                this.addResources({ energy: 10 });
                this.deductResources({ water: 5 });
                break;
            case 'fall':
                // Fall increases food but decreases energy
                this.addResources({ food: 10 });
                this.deductResources({ energy: 5 });
                break;
            case 'winter':
                // Winter decreases energy and food
                this.deductResources({ energy: 10, food: 5 });
                break;
        }
    }
    
    // Get resource production rates
    getResourceRates() {
        const rates = { ...this.baseRates };
        
        // Apply building effects
        for (const effect of this.buildingEffects) {
            rates[effect.resource] = (rates[effect.resource] || 0) + effect.rate;
        }
        
        return rates;
    }
    
    // Set resource limits
    setResourceLimits(limits) {
        for (const [resource, limit] of Object.entries(limits)) {
            if (this.resourceLimits[resource] !== undefined) {
                this.resourceLimits[resource] = limit;
            }
        }
    }
    
    // Get resource limits
    getResourceLimits() {
        return { ...this.resourceLimits };
    }
}
