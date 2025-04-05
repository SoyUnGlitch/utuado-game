// Event system for Utuado game
import * as THREE from 'three';

// Event System class
class EventSystem {
    constructor() {
        // Event categories
        this.categories = {
            SEASONAL: 'seasonal',
            RANDOM: 'random',
            CRISIS: 'crisis',
            STORY: 'story'
        };
        
        // Collection of possible events
        this.events = {
            // Seasonal events
            seasonal: {
                0: [ // Spring
                    {
                        title: 'Spring Planting',
                        description: 'It\'s time to plant crops for the year. How would you like to allocate your agricultural resources?',
                        options: [
                            { text: 'Focus on staple crops', effect: { food: 20 } },
                            { text: 'Diversify with cash crops', effect: { food: 10, materials: 10 } },
                            { text: 'Experiment with new varieties', effect: { food: 5, knowledge: 15 } }
                        ]
                    },
                    {
                        title: 'Spring Rains',
                        description: 'Heavy spring rains have filled the reservoirs. How will you use this abundance of water?',
                        options: [
                            { text: 'Expand irrigation', effect: { water: 15, food: 10 } },
                            { text: 'Increase hydroelectric production', effect: { water: -5, energy: 20 } },
                            { text: 'Store for future use', effect: { water: 25 } }
                        ]
                    }
                ],
                1: [ // Summer
                    {
                        title: 'Hurricane Warning',
                        description: 'Meteorologists predict a hurricane might hit Utuado this season. How will you prepare?',
                        options: [
                            { text: 'Reinforce infrastructure', effect: { materials: -20, energy: -10 } },
                            { text: 'Stockpile resources', effect: { food: -10, water: -10 } },
                            { text: 'Evacuate vulnerable areas', effect: { energy: -5, knowledge: 5 } }
                        ]
                    },
                    {
                        title: 'Summer Heat Wave',
                        description: 'A prolonged heat wave is affecting the community. How will you respond?',
                        options: [
                            { text: 'Increase cooling in public spaces', effect: { energy: -15, water: -5 } },
                            { text: 'Adjust work schedules to cooler hours', effect: { food: -5, knowledge: 5 } },
                            { text: 'Deploy heat-resistant crop covers', effect: { materials: -10, food: 10 } }
                        ]
                    }
                ],
                2: [ // Fall
                    {
                        title: 'Harvest Festival',
                        description: 'The community wants to celebrate the harvest. How would you like to organize the festival?',
                        options: [
                            { text: 'Traditional celebration', effect: { food: -10, knowledge: 10 } },
                            { text: 'Educational showcase', effect: { knowledge: 15, energy: -5 } },
                            { text: 'Tourist-oriented event', effect: { materials: 10, food: -15 } }
                        ]
                    },
                    {
                        title: 'Fall Maintenance',
                        description: 'It\'s time for seasonal maintenance. Where will you focus your efforts?',
                        options: [
                            { text: 'Energy infrastructure', effect: { materials: -10, energy: 15 } },
                            { text: 'Water systems', effect: { materials: -10, water: 15 } },
                            { text: 'Agricultural equipment', effect: { materials: -10, food: 15 } }
                        ]
                    }
                ],
                3: [ // Winter
                    {
                        title: 'Winter Planning',
                        description: 'The community gathers to plan for the coming year. What will you prioritize?',
                        options: [
                            { text: 'Infrastructure improvements', effect: { materials: -15, knowledge: 5 } },
                            { text: 'Educational initiatives', effect: { knowledge: 15, energy: -5 } },
                            { text: 'Resource stockpiling', effect: { food: -10, water: -10, energy: -10 } }
                        ]
                    },
                    {
                        title: 'Winter Storm',
                        description: 'A severe winter storm has hit the region. How will you manage?',
                        options: [
                            { text: 'Focus on energy conservation', effect: { energy: 10, food: -5 } },
                            { text: 'Community warming centers', effect: { energy: -15, knowledge: 5 } },
                            { text: 'Accelerate greenhouse production', effect: { energy: -10, food: 15 } }
                        ]
                    }
                ]
            },
            
            // Random events that can occur at any time
            random: [
                {
                    title: 'Visiting Researchers',
                    description: 'A team from the mainland wants to study your sustainable practices. How will you respond?',
                    options: [
                        { text: 'Welcome them openly', effect: { knowledge: 15, energy: -5 } },
                        { text: 'Limit their access', effect: { knowledge: 5 } },
                        { text: 'Ask them to postpone', effect: {} }
                    ]
                },
                {
                    title: 'New Technology Offer',
                    description: 'A company offers to install experimental AI systems in exchange for data. What will you do?',
                    options: [
                        { text: 'Accept the offer', effect: { energy: 20, knowledge: -10 } },
                        { text: 'Negotiate limited implementation', effect: { energy: 10, knowledge: 5 } },
                        { text: 'Decline the offer', effect: { knowledge: 10 } }
                    ]
                },
                {
                    title: 'Community Dispute',
                    description: 'There\'s disagreement about water allocation between farmers and energy production. How will you resolve it?',
                    options: [
                        { text: 'Prioritize farming', effect: { food: 15, energy: -10 } },
                        { text: 'Prioritize energy', effect: { energy: 15, food: -10 } },
                        { text: 'Seek balanced solution', effect: { knowledge: 10, water: -5 } }
                    ]
                },
                {
                    title: 'Cultural Exchange',
                    description: 'A neighboring community proposes a cultural exchange program. How do you respond?',
                    options: [
                        { text: 'Enthusiastically participate', effect: { knowledge: 15, food: -5 } },
                        { text: 'Send a small delegation', effect: { knowledge: 5 } },
                        { text: 'Propose a virtual exchange', effect: { knowledge: 10, energy: -5 } }
                    ]
                },
                {
                    title: 'Innovative Farming Method',
                    description: 'A community member has developed an innovative farming technique. How will you respond?',
                    options: [
                        { text: 'Implement community-wide', effect: { food: 15, materials: -10 } },
                        { text: 'Test on a small scale first', effect: { food: 5, knowledge: 10 } },
                        { text: 'Document and study further', effect: { knowledge: 15 } }
                    ]
                }
            ],
            
            // Crisis events triggered by low resources
            crisis: {
                energy: {
                    title: 'Energy Crisis',
                    description: 'Energy reserves are critically low. How will you address this?',
                    options: [
                        { text: 'Emergency rationing', effect: { energy: 10, food: -5 } },
                        { text: 'Redirect resources to energy', effect: { energy: 20, materials: -10, water: -5 } },
                        { text: 'Seek external assistance', effect: { energy: 15, knowledge: -5 } }
                    ]
                },
                water: {
                    title: 'Water Shortage',
                    description: 'Water supplies are running dangerously low. What will you do?',
                    options: [
                        { text: 'Implement strict rationing', effect: { water: 10, food: -10 } },
                        { text: 'Develop new collection systems', effect: { water: 15, materials: -15 } },
                        { text: 'Divert energy to water purification', effect: { water: 20, energy: -15 } }
                    ]
                },
                food: {
                    title: 'Food Shortage',
                    description: 'Food reserves are critically low. How will you respond?',
                    options: [
                        { text: 'Emergency rationing', effect: { food: 10 } },
                        { text: 'Convert more land to farming', effect: { food: 15, materials: -10 } },
                        { text: 'Trade resources for food', effect: { food: 20, energy: -10, materials: -10 } }
                    ]
                },
                materials: {
                    title: 'Material Shortage',
                    description: 'Building and maintenance materials are running low. What\'s your solution?',
                    options: [
                        { text: 'Salvage from abandoned structures', effect: { materials: 15, energy: -5 } },
                        { text: 'Focus on recycling programs', effect: { materials: 10, knowledge: 5 } },
                        { text: 'Trade other resources for materials', effect: { materials: 20, energy: -10, food: -10 } }
                    ]
                }
            },
            
            // Story events that advance the narrative
            story: [
                {
                    title: 'University Research Breakthrough',
                    description: 'Researchers at the University of Puerto Rico at Utuado have made a breakthrough in sustainable agriculture. How will you utilize this?',
                    options: [
                        { text: 'Implement immediately', effect: { food: 20, knowledge: 10 } },
                        { text: 'Further develop the research', effect: { knowledge: 25, energy: -5 } },
                        { text: 'Share with neighboring communities', effect: { knowledge: 15, food: 10 } }
                    ]
                },
                {
                    title: 'AI System Evolution',
                    description: 'Your AI systems have begun showing signs of advanced learning and adaptation. How do you respond?',
                    options: [
                        { text: 'Expand AI responsibilities', effect: { energy: 15, water: 15, food: 15, knowledge: -10 } },
                        { text: 'Study the phenomenon', effect: { knowledge: 25, energy: -10 } },
                        { text: 'Implement safety protocols', effect: { knowledge: 10, energy: -5 } }
                    ]
                },
                {
                    title: 'Cultural Renaissance',
                    description: 'There\'s growing interest in reviving traditional Taino practices and knowledge. How will you support this?',
                    options: [
                        { text: 'Fund cultural programs', effect: { knowledge: 20, materials: -10 } },
                        { text: 'Integrate with education', effect: { knowledge: 15, energy: -5 } },
                        { text: 'Document and preserve', effect: { knowledge: 25, energy: -10 } }
                    ]
                }
            ]
        };
        
        // Track triggered events
        this.triggeredEvents = [];
    }
    
    // Initialize visual representations of events
    initVisuals(scene) {
        // This would create 3D visualizations for events
        // For example, weather events could have particle effects
    }
    
    // Get a random event from a specific category and subcategory
    getEvent(category, subcategory = null) {
        if (category === this.categories.SEASONAL && subcategory !== null) {
            const seasonEvents = this.events.seasonal[subcategory];
            return seasonEvents[Math.floor(Math.random() * seasonEvents.length)];
        } else if (category === this.categories.RANDOM) {
            return this.events.random[Math.floor(Math.random() * this.events.random.length)];
        } else if (category === this.categories.CRISIS && subcategory) {
            return this.events.crisis[subcategory];
        } else if (category === this.categories.STORY) {
            return this.events.story[Math.floor(Math.random() * this.events.story.length)];
        }
        
        // Default fallback
        return this.events.random[0];
    }
    
    // Check if a crisis event should be triggered based on resource levels
    checkForCrisis(resources) {
        const thresholds = {
            energy: 20,
            water: 20,
            food: 20,
            materials: 10
        };
        
        for (const resource in thresholds) {
            if (resources[resource] < thresholds[resource]) {
                return {
                    triggered: true,
                    resource: resource
                };
            }
        }
        
        return {
            triggered: false
        };
    }
    
    // Trigger a visual effect for an event
    triggerEventVisual(event, scene) {
        // This would create visual effects based on the event type
        // For example, a hurricane event might create wind and rain particles
    }
    
    // Record that an event has been triggered
    recordEvent(event) {
        this.triggeredEvents.push({
            title: event.title,
            timestamp: Date.now()
        });
    }
    
    // Get list of triggered events
    getTriggeredEvents() {
        return [...this.triggeredEvents];
    }
}

// Export the EventSystem class
export { EventSystem };
