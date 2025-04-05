// EventSystem.js - Manages events for Utuado game
export class EventSystem {
    constructor() {
        // Event tracking
        this.events = [];
        this.activeEvent = null;
        this.eventTimer = 0;
        this.eventInterval = 60; // seconds between event checks
        this.lastEventTime = 0;
        
        // Event definitions
        this.eventDefinitions = [
            {
                id: 'drought',
                title: 'Drought',
                description: 'A severe drought is affecting the region. Water resources are dwindling.',
                condition: (gameState, resources) => {
                    return gameState.getCurrentSeason() === 'summer' && Math.random() < 0.3;
                },
                choices: [
                    {
                        text: 'Implement water rationing',
                        effect: (gameState, resourceManager) => {
                            resourceManager.deductResources({ water: 10 });
                            gameState.happiness -= 5;
                            return 'You implemented water rationing. The community is less happy, but water resources are preserved.';
                        }
                    },
                    {
                        text: 'Use AI to optimize water distribution',
                        condition: (gameState) => gameState.getAILevel() >= 2,
                        effect: (gameState, resourceManager) => {
                            resourceManager.deductResources({ water: 5, energy: 5 });
                            return 'The AI system optimized water distribution, minimizing the impact of the drought.';
                        }
                    },
                    {
                        text: 'Do nothing',
                        effect: (gameState, resourceManager) => {
                            resourceManager.deductResources({ water: 20 });
                            return 'Water resources have been severely depleted.';
                        }
                    }
                ]
            },
            {
                id: 'storm',
                title: 'Tropical Storm',
                description: 'A tropical storm is approaching Utuado. Prepare for heavy rain and strong winds.',
                condition: (gameState, resources) => {
                    return (gameState.getCurrentSeason() === 'summer' || gameState.getCurrentSeason() === 'fall') && Math.random() < 0.3;
                },
                choices: [
                    {
                        text: 'Reinforce buildings',
                        effect: (gameState, resourceManager) => {
                            resourceManager.deductResources({ materials: 15, energy: 10 });
                            return 'Buildings were reinforced and withstood the storm with minimal damage.';
                        }
                    },
                    {
                        text: 'Set up water collection systems',
                        effect: (gameState, resourceManager) => {
                            resourceManager.deductResources({ materials: 5, energy: 5 });
                            resourceManager.addResources({ water: 30 });
                            return 'You collected a significant amount of rainwater during the storm.';
                        }
                    },
                    {
                        text: 'Evacuate to higher ground',
                        effect: (gameState, resourceManager) => {
                            gameState.happiness -= 10;
                            return 'The community evacuated safely, but morale has decreased.';
                        }
                    }
                ]
            },
            {
                id: 'harvest',
                title: 'Bountiful Harvest',
                description: 'The farms are producing more food than expected this season.',
                condition: (gameState, resources) => {
                    return gameState.getCurrentSeason() === 'fall' && 
                           gameState.getBuildingsByType('farm').length > 0 && 
                           Math.random() < 0.5;
                },
                choices: [
                    {
                        text: 'Store the surplus',
                        effect: (gameState, resourceManager) => {
                            resourceManager.addResources({ food: 30 });
                            return 'You stored the surplus food for future use.';
                        }
                    },
                    {
                        text: 'Share with neighboring communities',
                        effect: (gameState, resourceManager) => {
                            resourceManager.addResources({ food: 15 });
                            gameState.happiness += 10;
                            return 'You shared the surplus with neighbors, improving community relations.';
                        }
                    },
                    {
                        text: 'Organize a festival',
                        effect: (gameState, resourceManager) => {
                            resourceManager.addResources({ food: 10 });
                            resourceManager.deductResources({ energy: 5 });
                            gameState.happiness += 15;
                            return 'The harvest festival boosted community morale significantly.';
                        }
                    }
                ]
            },
            {
                id: 'visitors',
                title: 'Visitors from San Juan',
                description: 'A group of visitors from San Juan is interested in your sustainable community.',
                condition: (gameState, resources) => {
                    return gameState.getSustainability() > 60 && Math.random() < 0.3;
                },
                choices: [
                    {
                        text: 'Give them a tour',
                        effect: (gameState, resourceManager) => {
                            resourceManager.deductResources({ energy: 5, food: 5 });
                            resourceManager.addResources({ knowledge: 10 });
                            return 'The visitors were impressed and shared valuable knowledge.';
                        }
                    },
                    {
                        text: 'Offer agritourism experiences',
                        condition: (gameState) => gameState.getBuildingsByType('farm').length > 1,
                        effect: (gameState, resourceManager) => {
                            resourceManager.deductResources({ energy: 10, food: 10 });
                            resourceManager.addResources({ materials: 20, knowledge: 5 });
                            return 'The visitors paid for agritourism experiences, providing resources for the community.';
                        }
                    },
                    {
                        text: 'Decline the visit',
                        effect: (gameState, resourceManager) => {
                            return 'You declined the visit to focus on community needs.';
                        }
                    }
                ]
            },
            {
                id: 'tech_breakthrough',
                title: 'AI Technology Breakthrough',
                description: 'Your AI systems have made a breakthrough in resource optimization.',
                condition: (gameState, resources) => {
                    return gameState.getAILevel() >= 3 && resources.knowledge > 70 && Math.random() < 0.3;
                },
                choices: [
                    {
                        text: 'Apply to energy systems',
                        effect: (gameState, resourceManager) => {
                            const energyBuildings = gameState.getBuildingsByType('solar_panel').length + 
                                                   gameState.getBuildingsByType('wind_turbine').length + 
                                                   gameState.getBuildingsByType('hydro_plant').length;
                            resourceManager.addResources({ energy: energyBuildings * 5 });
                            return 'Energy production has been optimized, increasing output.';
                        }
                    },
                    {
                        text: 'Apply to water management',
                        effect: (gameState, resourceManager) => {
                            resourceManager.addResources({ water: 25 });
                            return 'Water management has been optimized, increasing efficiency.';
                        }
                    },
                    {
                        text: 'Apply to food production',
                        effect: (gameState, resourceManager) => {
                            const foodBuildings = gameState.getBuildingsByType('farm').length + 
                                                 gameState.getBuildingsByType('greenhouse').length;
                            resourceManager.addResources({ food: foodBuildings * 5 });
                            return 'Food production has been optimized, increasing yields.';
                        }
                    }
                ]
            }
        ];
    }
    
    // Start event system
    start(gameState, resourceManager, uiManager) {
        this.gameState = gameState;
        this.resourceManager = resourceManager;
        this.uiManager = uiManager;
        this.lastEventTime = Date.now() / 1000;
    }
    
    // Update event system
    update(deltaTime) {
        // Update event timer
        this.eventTimer += deltaTime;
        
        // Check for new events
        if (this.eventTimer >= this.eventInterval && !this.activeEvent) {
            this.checkForEvents();
            this.eventTimer = 0;
        }
    }
    
    // Check for events
    checkForEvents() {
        // Get current game state and resources
        const gameState = this.gameState;
        const resources = this.resourceManager.getResources();
        
        // Filter events that meet conditions
        const possibleEvents = this.eventDefinitions.filter(event => {
            return event.condition(gameState, resources);
        });
        
        // If there are possible events, trigger one randomly
        if (possibleEvents.length > 0) {
            const randomEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
            this.triggerEvent(randomEvent);
        }
    }
    
    // Trigger an event
    triggerEvent(event) {
        this.activeEvent = event;
        
        // Filter valid choices based on conditions
        const validChoices = event.choices.filter(choice => {
            if (!choice.condition) return true;
            return choice.condition(this.gameState, this.resourceManager.getResources());
        });
        
        // Show event dialog
        this.uiManager.showEventDialog(
            event.title,
            event.description,
            validChoices,
            this.handleEventChoice.bind(this)
        );
    }
    
    // Handle event choice
    handleEventChoice(choiceIndex) {
        if (!this.activeEvent) return;
        
        const choice = this.activeEvent.choices[choiceIndex];
        
        // Apply effect
        const resultMessage = choice.effect(this.gameState, this.resourceManager);
        
        // Show result
        this.uiManager.showNotification(resultMessage);
        
        // Update UI
        this.uiManager.updateResourceDisplay(this.resourceManager.getResources());
        
        // Record event
        this.events.push({
            event: this.activeEvent,
            choice: choice,
            time: Date.now()
        });
        
        // Clear active event
        this.activeEvent = null;
    }
    
    // Get event history
    getEventHistory() {
        return [...this.events];
    }
    
    // Manually trigger a specific event (for testing or scenarios)
    triggerSpecificEvent(eventId) {
        const event = this.eventDefinitions.find(e => e.id === eventId);
        
        if (event) {
            this.triggerEvent(event);
            return true;
        }
        
        return false;
    }
}
