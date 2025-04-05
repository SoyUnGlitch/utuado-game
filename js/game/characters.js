// Character system for Utuado game
import * as THREE from 'three';

// Character System class
class CharacterSystem {
    constructor() {
        // Character categories
        this.categories = {
            LEADER: 'leader',
            SPECIALIST: 'specialist',
            COMMUNITY: 'community',
            EXTERNAL: 'external'
        };
        
        // Collection of characters
        this.characters = {
            // Community leaders
            leaders: [
                {
                    id: 'elena',
                    name: 'Elena Rodríguez',
                    role: 'Community Council President',
                    background: 'Former environmental engineer who returned to Utuado after Hurricane Maria',
                    expertise: 'Infrastructure planning and community organization',
                    portraitIndex: 0,
                    dialogues: [
                        "We need to focus on balancing our resources. The community's needs are diverse, but we must prioritize sustainability.",
                        "The council is concerned about our water reserves. We should consider expanding our collection systems.",
                        "I've been reviewing our community satisfaction metrics. People are generally happy, but they want more cultural activities.",
                        "The seasonal changes are becoming more extreme. We need to adapt our infrastructure accordingly."
                    ],
                    specialEffect: { knowledge: 5, materials: 5 }
                },
                {
                    id: 'carlos',
                    name: 'Carlos Reyes',
                    role: 'Cultural Elder',
                    background: 'Lifelong Utuado resident with deep knowledge of local history and traditions',
                    expertise: 'Taino cultural practices, traditional agriculture, storytelling',
                    portraitIndex: 1,
                    dialogues: [
                        "Our traditions hold wisdom about living with the land. We should not forget the old ways even as we embrace new technologies.",
                        "The Taino people understood how to read the seasons. Their agricultural calendar might help us today.",
                        "I'm concerned that our young people are losing connection with our cultural heritage.",
                        "In the old days, we prepared for hurricanes by strengthening community bonds, not just buildings."
                    ],
                    specialEffect: { knowledge: 10, food: 5 }
                },
                {
                    id: 'isabela',
                    name: 'Dr. Isabela Morales',
                    role: 'University Director',
                    background: 'Agricultural scientist who pioneered sustainable farming techniques',
                    expertise: 'Agroecology, climate-resilient crop varieties, educational program development',
                    portraitIndex: 2,
                    dialogues: [
                        "The university's research shows promising results for our new crop varieties. With proper implementation, we could increase yields by 30%.",
                        "I'm concerned about the soil quality in the eastern fields. We should consider crop rotation.",
                        "Our students have developed a new water filtration system that uses 40% less energy.",
                        "Education is our most renewable resource. We should invest more in knowledge sharing."
                    ],
                    specialEffect: { knowledge: 15, food: 10 }
                }
            ],
            
            // Technical specialists
            specialists: [
                {
                    id: 'miguel',
                    name: 'Miguel Torres',
                    role: 'Energy Systems Engineer',
                    background: 'Electrical engineer who helped develop the community\'s smart grid',
                    expertise: 'Renewable energy integration, microgrids, energy storage systems',
                    portraitIndex: 3,
                    dialogues: [
                        "The energy grid is stable, but we could optimize further. I recommend investing in additional storage capacity for the winter months.",
                        "Solar production is exceeding expectations this summer. We should consider expanding our panel array.",
                        "The hydroelectric system needs maintenance before the rainy season begins.",
                        "I've been working on a new algorithm that could improve energy distribution efficiency by 15%."
                    ],
                    specialEffect: { energy: 15, materials: -5 }
                },
                {
                    id: 'sophia',
                    name: 'Sophia Vega',
                    role: 'AI Systems Architect',
                    background: 'Computer scientist who returned to Puerto Rico after working in Silicon Valley',
                    expertise: 'Machine learning, environmental monitoring systems, user interface design',
                    portraitIndex: 4,
                    dialogues: [
                        "The AI systems are learning from our environmental data. Soon they'll be able to predict weather patterns with 95% accuracy.",
                        "I've implemented a new neural network for crop monitoring. It can detect plant diseases before they're visible to the human eye.",
                        "The community feedback system needs more data points. Could we install additional sensors?",
                        "I'm concerned about our computing infrastructure. We should upgrade before hurricane season."
                    ],
                    specialEffect: { knowledge: 10, energy: -5 }
                },
                {
                    id: 'javier',
                    name: 'Javier Acosta',
                    role: 'Water Management Specialist',
                    background: 'Hydrologist who previously worked with international development organizations',
                    expertise: 'Watershed management, water purification systems, flood prevention',
                    portraitIndex: 5,
                    dialogues: [
                        "The watershed analysis shows promising results. We could increase water capture by 25% with some strategic interventions.",
                        "I'm concerned about potential contamination in the southern aquifer. We should increase monitoring.",
                        "The new filtration system is working well, but maintenance costs are higher than expected.",
                        "We should consider implementing more greywater recycling systems throughout the community."
                    ],
                    specialEffect: { water: 15, materials: -5 }
                }
            ],
            
            // Community members
            community: [
                {
                    id: 'lucia',
                    name: 'Lucia Figueroa',
                    role: 'Agritourism Coordinator',
                    background: 'Former tourism professional who developed Utuado\'s agritourism program',
                    expertise: 'Visitor experience design, marketing, cultural interpretation',
                    portraitIndex: 6,
                    dialogues: [
                        "We've had a 20% increase in visitors this season. They're particularly interested in our sustainable farming practices.",
                        "I'm developing a new tour that showcases our AI integration with traditional agriculture.",
                        "Several visitors have expressed interest in investing in our renewable energy systems.",
                        "The cultural demonstrations have been our most popular attraction. We should expand those offerings."
                    ],
                    specialEffect: { food: 5, materials: 5, knowledge: 5 }
                },
                {
                    id: 'rafael',
                    name: 'Rafael Nieves',
                    role: 'Traditional Farmer',
                    background: 'Third-generation farmer who has adapted traditional methods with new techniques',
                    expertise: 'Crop rotation, seed saving, weather prediction, medicinal plants',
                    portraitIndex: 7,
                    dialogues: [
                        "My grandfather always said that when the frogs sing early, rain is coming. The AI says the same thing now, but with percentages.",
                        "The heritage seed bank is growing. We've recovered fifteen varieties that were nearly lost.",
                        "These new irrigation systems are efficient, but they need more maintenance than the old channels.",
                        "I've been teaching the young people about medicinal plants. Some are showing real interest."
                    ],
                    specialEffect: { food: 15, knowledge: 5 }
                },
                {
                    id: 'marisol',
                    name: 'Marisol Diaz',
                    role: 'Community Health Coordinator',
                    background: 'Nursing student who developed community health monitoring programs',
                    expertise: 'Preventive healthcare, emergency medical response, traditional healing practices',
                    portraitIndex: 8,
                    dialogues: [
                        "The community health metrics are improving. Our preventive care programs are showing results.",
                        "I'm concerned about the effects of heat stress during these increasingly hot summers.",
                        "The medicinal garden is thriving. We've been able to produce many of our own remedies.",
                        "We should consider expanding the cooling centers before next summer."
                    ],
                    specialEffect: { water: 5, food: 5, knowledge: 5 }
                }
            ],
            
            // External visitors
            external: [
                {
                    id: 'james',
                    name: 'Dr. James Chen',
                    role: 'Visiting Climate Scientist',
                    background: 'International researcher studying climate resilience models',
                    expertise: 'Climate modeling, adaptation strategies, comparative community studies',
                    portraitIndex: 9,
                    dialogues: [
                        "Your community's adaptation strategies are impressive. I'd like to document them for my research.",
                        "My climate models suggest you'll face increased rainfall variability in the coming years.",
                        "I've studied similar communities in Southeast Asia. They've had success with terraced water management systems.",
                        "The integration of traditional knowledge with climate science here is more advanced than most places I've studied."
                    ],
                    specialEffect: { knowledge: 20 }
                },
                {
                    id: 'alejandra',
                    name: 'Governor Alejandra Vázquez',
                    role: 'Puerto Rico\'s Governor',
                    background: 'Progressive politician with focus on sustainable development',
                    expertise: 'Policy development, resource allocation, coalition building',
                    portraitIndex: 10,
                    dialogues: [
                        "Your community's success could be a model for the rest of Puerto Rico. I'm interested in scaling these solutions.",
                        "The legislature is considering a bill to fund more community-based renewable energy projects.",
                        "How has the integration of AI technology affected your traditional decision-making processes?",
                        "I'm particularly impressed by your disaster preparedness systems. They could be implemented island-wide."
                    ],
                    specialEffect: { energy: 10, water: 10, food: 10, materials: 10 }
                },
                {
                    id: 'maya',
                    name: 'Maya Wilson',
                    role: 'International Aid Coordinator',
                    background: 'Disaster response specialist who first came to Puerto Rico after Hurricane Maria',
                    expertise: 'Emergency management, resource distribution, international funding mechanisms',
                    portraitIndex: 11,
                    dialogues: [
                        "Your community's self-sufficiency is remarkable. You've come so far since Hurricane Maria.",
                        "I can connect you with funding for expanded water storage systems if you're interested.",
                        "The emergency response protocols you've developed could be shared with other vulnerable communities.",
                        "How do you balance immediate needs with long-term resilience in your planning?"
                    ],
                    specialEffect: { materials: 20, knowledge: 10 }
                }
            ]
        };
        
        // Character models and positions in the 3D world
        this.characterModels = {};
    }
    
    // Initialize character models in the 3D world
    async initCharacters(scene, assets) {
        console.log('Initializing characters...');
        
        // Register character assets for loading
        assets.register();
        
        // In a full implementation, this would load 3D models for characters
        // For now, we'll create simple placeholder models
        
        // Create placeholder models for each character category
        await this.createCharacterPlaceholders(scene);
        
        // Mark character assets as loaded
        assets.loaded();
    }
    
    // Create placeholder models for characters
    async createCharacterPlaceholders(scene) {
        // Create a simple geometry for character placeholders
        const geometry = new THREE.CylinderGeometry(1, 1, 5, 8);
        
        // Create materials with different colors for different character types
        const leaderMaterial = new THREE.MeshStandardMaterial({ color: 0x9c27b0 }); // Purple for leaders
        const specialistMaterial = new THREE.MeshStandardMaterial({ color: 0x2196f3 }); // Blue for specialists
        const communityMaterial = new THREE.MeshStandardMaterial({ color: 0x4caf50 }); // Green for community
        const externalMaterial = new THREE.MeshStandardMaterial({ color: 0xff9800 }); // Orange for external
        
        // Create and position character models
        
        // Leaders (placed near central buildings)
        this.characters.leaders.forEach((character, index) => {
            const model = new THREE.Mesh(geometry, leaderMaterial);
            model.position.set(20 + index * 10, 2.5, 20);
            model.castShadow = true;
            model.receiveShadow = true;
            model.userData.characterId = character.id;
            model.userData.characterType = this.categories.LEADER;
            
            scene.add(model);
            this.characterModels[character.id] = model;
        });
        
        // Specialists (placed near technical areas)
        this.characters.specialists.forEach((character, index) => {
            const model = new THREE.Mesh(geometry, specialistMaterial);
            model.position.set(-20 - index * 10, 2.5, 20);
            model.castShadow = true;
            model.receiveShadow = true;
            model.userData.characterId = character.id;
            model.userData.characterType = this.categories.SPECIALIST;
            
            scene.add(model);
            this.characterModels[character.id] = model;
        });
        
        // Community members (placed throughout the settlement)
        this.characters.community.forEach((character, index) => {
            const model = new THREE.Mesh(geometry, communityMaterial);
            model.position.set(index * 15 - 15, 2.5, -20);
            model.castShadow = true;
            model.receiveShadow = true;
            model.userData.characterId = character.id;
            model.userData.characterType = this.categories.COMMUNITY;
            
            scene.add(model);
            this.characterModels[character.id] = model;
        });
        
        // External visitors (placed near the edge of the settlement)
        this.characters.external.forEach((character, index) => {
            const model = new THREE.Mesh(geometry, externalMaterial);
            model.position.set(index * 15 - 15, 2.5, -40);
            model.castShadow = true;
            model.receiveShadow = true;
            model.userData.characterId = character.id;
            model.userData.characterType = this.categories.EXTERNAL;
            
            scene.add(model);
            this.characterModels[character.id] = model;
        });
    }
    
    // Get a random character from a specific category
    getRandomCharacter(category) {
        let characterGroup;
        
        switch(category) {
            case this.categories.LEADER:
                characterGroup = this.characters.leaders;
                break;
            case this.categories.SPECIALIST:
                characterGroup = this.characters.specialists;
                break;
            case this.categories.COMMUNITY:
                characterGroup = this.characters.community;
                break;
            case this.categories.EXTERNAL:
                characterGroup = this.characters.external;
                break;
            default:
                // Default to community members if category is invalid
                characterGroup = this.characters.community;
        }
        
        return characterGroup[Math.floor(Math.random() * characterGroup.length)];
    }
    
    // Get a specific character by ID
    getCharacterById(id) {
        // Search through all character categories
        const allCharacters = [
            ...this.characters.leaders,
            ...this.characters.specialists,
            ...this.characters.community,
            ...this.characters.external
        ];
        
        return allCharacters.find(character => character.id === id);
    }
    
    // Get a random dialogue for a character
    getRandomDialogue(character) {
        return character.dialogues[Math.floor(Math.random() * character.dialogues.length)];
    }
    
    // Get all characters
    getAllCharacters() {
        return {
            leaders: [...this.characters.leaders],
            specialists: [...this.characters.specialists],
            community: [...this.characters.community],
            external: [...this.characters.external]
        };
    }
    
    // Update character animations and behaviors
    updateCharacters(deltaTime) {
        // In a full implementation, this would update character animations and behaviors
        // For now, we'll just make them rotate slowly
        
        for (const characterId in this.characterModels) {
            const model = this.characterModels[characterId];
            model.rotation.y += 0.01 * deltaTime;
        }
    }
}

// Export the CharacterSystem class
export { CharacterSystem };
