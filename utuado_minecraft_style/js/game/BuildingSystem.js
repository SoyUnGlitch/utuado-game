// BuildingSystem.js - Manages buildings for Utuado game
export class BuildingSystem {
    constructor() {
        // Define building types and their properties
        this.buildingTypes = {
            'solar_panel': {
                name: 'Solar Panel',
                description: 'Generates energy from sunlight',
                category: 'energy',
                cost: {
                    energy: 10,
                    materials: 20
                },
                effect: {
                    resource: 'energy',
                    rate: 3
                },
                requirements: {}
            },
            'wind_turbine': {
                name: 'Wind Turbine',
                description: 'Generates energy from wind',
                category: 'energy',
                cost: {
                    energy: 15,
                    materials: 30
                },
                effect: {
                    resource: 'energy',
                    rate: 5
                },
                requirements: {}
            },
            'hydro_plant': {
                name: 'Hydro Plant',
                description: 'Generates energy from water flow',
                category: 'energy',
                cost: {
                    energy: 20,
                    materials: 40,
                    water: 10
                },
                effect: {
                    resource: 'energy',
                    rate: 8
                },
                requirements: {
                    nearWater: true
                }
            },
            'farm': {
                name: 'Farm',
                description: 'Produces food through agriculture',
                category: 'food',
                cost: {
                    energy: 10,
                    materials: 15,
                    water: 20
                },
                effect: {
                    resource: 'food',
                    rate: 5
                },
                requirements: {}
            },
            'greenhouse': {
                name: 'Greenhouse',
                description: 'Produces food in a controlled environment',
                category: 'food',
                cost: {
                    energy: 15,
                    materials: 25,
                    water: 15
                },
                effect: {
                    resource: 'food',
                    rate: 7
                },
                requirements: {}
            },
            'water_collector': {
                name: 'Water Collector',
                description: 'Collects rainwater',
                category: 'water',
                cost: {
                    energy: 5,
                    materials: 15
                },
                effect: {
                    resource: 'water',
                    rate: 4
                },
                requirements: {}
            },
            'water_filter': {
                name: 'Water Filter',
                description: 'Purifies water for consumption',
                category: 'water',
                cost: {
                    energy: 10,
                    materials: 20,
                    water: 5
                },
                effect: {
                    resource: 'water',
                    rate: 6
                },
                requirements: {}
            },
            'house': {
                name: 'House',
                description: 'Provides shelter for residents',
                category: 'community',
                cost: {
                    energy: 15,
                    materials: 30,
                    water: 5,
                    food: 5
                },
                effect: {
                    resource: 'knowledge',
                    rate: 1
                },
                requirements: {}
            },
            'community_center': {
                name: 'Community Center',
                description: 'Brings the community together',
                category: 'community',
                cost: {
                    energy: 25,
                    materials: 50,
                    water: 10,
                    food: 10
                },
                effect: {
                    resource: 'knowledge',
                    rate: 3
                },
                requirements: {
                    population: 10
                }
            },
            'ai_hub': {
                name: 'AI Hub',
                description: 'Central AI processing center',
                category: 'ai',
                cost: {
                    energy: 30,
                    materials: 30,
                    knowledge: 20
                },
                effect: {
                    resource: 'knowledge',
                    rate: 5
                },
                requirements: {
                    knowledge: 50
                }
            },
            'sensor_network': {
                name: 'Sensor Network',
                description: 'Monitors environmental conditions',
                category: 'ai',
                cost: {
                    energy: 20,
                    materials: 20,
                    knowledge: 10
                },
                effect: {
                    resource: 'energy',
                    rate: 2
                },
                requirements: {
                    knowledge: 30
                }
            }
        };
    }
    
    // Get all building types
    getAllBuildingTypes() {
        return Object.keys(this.buildingTypes);
    }
    
    // Get building data by type
    getBuildingData(type) {
        return this.buildingTypes[type];
    }
    
    // Get buildings by category
    getBuildingsByCategory(category) {
        const buildings = [];
        
        for (const [type, data] of Object.entries(this.buildingTypes)) {
            if (data.category === category) {
                buildings.push({
                    type,
                    ...data
                });
            }
        }
        
        return buildings;
    }
    
    // Get all building categories
    getAllCategories() {
        const categories = new Set();
        
        for (const data of Object.values(this.buildingTypes)) {
            categories.add(data.category);
        }
        
        return [...categories];
    }
    
    // Check if building requirements are met
    checkRequirements(type, gameState, resources) {
        const buildingData = this.buildingTypes[type];
        
        if (!buildingData) {
            return false;
        }
        
        const requirements = buildingData.requirements;
        
        // Check population requirement
        if (requirements.population && gameState.getPopulation() < requirements.population) {
            return false;
        }
        
        // Check knowledge requirement
        if (requirements.knowledge && resources.knowledge < requirements.knowledge) {
            return false;
        }
        
        // Other requirements can be checked here
        
        return true;
    }
    
    // Get building efficiency based on season
    getBuildingEfficiency(type, season) {
        const buildingData = this.buildingTypes[type];
        
        if (!buildingData) {
            return 1.0; // Default efficiency
        }
        
        // Adjust efficiency based on season and building type
        switch (type) {
            case 'solar_panel':
                // Solar panels are less efficient in winter
                return season === 'winter' ? 0.5 : 
                       season === 'summer' ? 1.5 : 
                       1.0;
            
            case 'wind_turbine':
                // Wind turbines are more efficient in fall and winter
                return (season === 'fall' || season === 'winter') ? 1.3 : 1.0;
            
            case 'hydro_plant':
                // Hydro plants are more efficient in spring
                return season === 'spring' ? 1.5 : 1.0;
            
            case 'farm':
                // Farms don't produce in winter
                return season === 'winter' ? 0.2 : 
                       season === 'summer' ? 1.5 : 
                       season === 'fall' ? 1.3 : 
                       1.0;
            
            case 'greenhouse':
                // Greenhouses are less affected by seasons
                return season === 'winter' ? 0.8 : 1.0;
            
            case 'water_collector':
                // Water collectors are more efficient in spring
                return season === 'spring' ? 1.5 : 
                       season === 'summer' ? 0.7 : 
                       1.0;
            
            default:
                return 1.0;
        }
    }
    
    // Get building upgrade options
    getBuildingUpgrades(type) {
        // This could be expanded in a more complex game
        return [];
    }
}
