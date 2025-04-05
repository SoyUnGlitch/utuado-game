// Resource management system for Utuado game
import * as THREE from 'three';

// Resource Manager class
class ResourceManager {
    constructor() {
        // Initial resource values
        this.resources = {
            energy: 100,
            water: 100,
            food: 100,
            materials: 50,
            knowledge: 20
        };
        
        // Resource production rates per building type
        this.productionRates = {
            solar_panel: { energy: 10 },
            wind_turbine: { energy: 15 },
            hydro_plant: { energy: 20, water: -5 },
            farm: { food: 15, water: -5 },
            water_collector: { water: 15 },
            university: { knowledge: 10, energy: -5 }
        };
        
        // Seasonal modifiers for resource production
        this.seasonalModifiers = {
            0: { energy: 1.0, water: 1.5, food: 1.2, materials: 1.0, knowledge: 1.0 }, // Spring
            1: { energy: 1.5, water: 0.7, food: 1.0, materials: 1.2, knowledge: 0.8 }, // Summer
            2: { energy: 0.8, water: 1.2, food: 1.5, materials: 1.3, knowledge: 1.0 }, // Fall
            3: { energy: 0.6, water: 1.0, food: 0.5, materials: 0.7, knowledge: 1.5 }  // Winter
        };
        
        // Resource consumption rates per population
        this.consumptionRates = {
            energy: 0.5,
            water: 0.8,
            food: 0.7,
            materials: 0.2,
            knowledge: 0.1
        };
        
        // Visual representation of resources
        this.resourceMeshes = {};
    }
    
    // Initialize visual representations of resources
    initVisuals(scene) {
        // This would create 3D visualizations for resource levels
        // For example, energy could be represented by glowing orbs
        // Water by flowing particles, etc.
    }
    
    // Update resources based on buildings, season, and population
    updateResources(buildings, season, population, aiLevels) {
        const seasonMod = this.seasonalModifiers[season];
        
        // Calculate production from buildings
        buildings.forEach(building => {
            const rates = this.productionRates[building.type];
            if (rates) {
                for (const resource in rates) {
                    // Apply AI system bonuses
                    let aiBonus = 1.0;
                    if (resource === 'energy' && aiLevels.energyManagement > 1) {
                        aiBonus += (aiLevels.energyManagement - 1) * 0.1;
                    } else if (resource === 'food' && aiLevels.agricultural > 1) {
                        aiBonus += (aiLevels.agricultural - 1) * 0.1;
                    } else if (resource === 'water' && aiLevels.environmentalMonitoring > 1) {
                        aiBonus += (aiLevels.environmentalMonitoring - 1) * 0.05;
                    }
                    
                    const amount = rates[resource] * seasonMod[resource] * aiBonus;
                    this.resources[resource] += amount;
                }
            }
        });
        
        // Calculate consumption from population
        for (const resource in this.consumptionRates) {
            const amount = this.consumptionRates[resource] * population;
            this.resources[resource] -= amount;
            
            // Ensure resources don't go below 0
            this.resources[resource] = Math.max(0, this.resources[resource]);
            
            // Cap resources at 999 for display purposes
            this.resources[resource] = Math.min(999, this.resources[resource]);
        }
        
        // Update visual representations
        this.updateVisuals();
        
        return this.resources;
    }
    
    // Update visual representations based on current resource levels
    updateVisuals() {
        // This would update the 3D visualizations based on current resource levels
    }
    
    // Check if there are enough resources for a purchase
    canAfford(costs) {
        for (const resource in costs) {
            if (this.resources[resource] < costs[resource]) {
                return false;
            }
        }
        return true;
    }
    
    // Deduct resources for a purchase
    purchase(costs) {
        if (this.canAfford(costs)) {
            for (const resource in costs) {
                this.resources[resource] -= costs[resource];
            }
            return true;
        }
        return false;
    }
    
    // Add resources (for events, trades, etc.)
    addResources(resources) {
        for (const resource in resources) {
            if (this.resources.hasOwnProperty(resource)) {
                this.resources[resource] += resources[resource];
                this.resources[resource] = Math.max(0, this.resources[resource]);
                this.resources[resource] = Math.min(999, this.resources[resource]);
            }
        }
        
        // Update visual representations
        this.updateVisuals();
    }
    
    // Get current resource values
    getResources() {
        return { ...this.resources };
    }
}

// Export the ResourceManager class
export { ResourceManager };
