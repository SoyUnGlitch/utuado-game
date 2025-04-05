// HUD (Heads-Up Display) for Utuado game
import * as THREE from 'three';

// Initialize UI elements
function initUI(gameState) {
    console.log('Initializing UI...');
    
    // Update resource display
    updateResourceDisplay(gameState.resources.getResources());
    
    // Update time display
    updateTimeDisplay(gameState.getSeasonName(), gameState.year);
    
    // Set up button event listeners
    setupButtonListeners(gameState);
}

// Update UI elements (called each frame)
function updateUI(gameState) {
    // Update resource display
    updateResourceDisplay(gameState.resources.getResources());
    
    // Update time display
    updateTimeDisplay(gameState.getSeasonName(), gameState.year);
}

// Update resource display with current values
function updateResourceDisplay(resources) {
    document.getElementById('energy-display').querySelector('.resource-value').textContent = 
        Math.floor(resources.energy);
    
    document.getElementById('water-display').querySelector('.resource-value').textContent = 
        Math.floor(resources.water);
    
    document.getElementById('food-display').querySelector('.resource-value').textContent = 
        Math.floor(resources.food);
    
    document.getElementById('materials-display').querySelector('.resource-value').textContent = 
        Math.floor(resources.materials);
    
    document.getElementById('knowledge-display').querySelector('.resource-value').textContent = 
        Math.floor(resources.knowledge);
}

// Update time display with current season and year
function updateTimeDisplay(season, year) {
    document.getElementById('season').textContent = season;
    document.getElementById('year').textContent = year;
}

// Set up button event listeners
function setupButtonListeners(gameState) {
    // Build button
    document.getElementById('build-btn').addEventListener('click', () => {
        showMenu('build-menu');
    });
    
    // Community button
    document.getElementById('community-btn').addEventListener('click', () => {
        populateCharacterList(gameState.characters.getAllCharacters());
        showMenu('community-menu');
    });
    
    // AI button
    document.getElementById('ai-btn').addEventListener('click', () => {
        updateAILevels(gameState.aiSystems);
        showMenu('ai-menu');
    });
    
    // Menu button
    document.getElementById('menu-btn').addEventListener('click', () => {
        showMenu('main-menu');
    });
    
    // Close buttons for all menus
    document.querySelectorAll('.menu-close').forEach(button => {
        button.addEventListener('click', () => {
            hideAllMenus();
        });
    });
    
    // Dialog close button
    document.getElementById('dialog-close').addEventListener('click', () => {
        hideDialog();
    });
    
    // Building options
    document.querySelectorAll('.building-option').forEach(option => {
        option.addEventListener('click', () => {
            const buildingType = option.getAttribute('data-building');
            selectBuildingForPlacement(gameState, buildingType);
        });
    });
    
    // AI system upgrade buttons
    document.querySelectorAll('.upgrade-btn').forEach(button => {
        button.addEventListener('click', () => {
            const systemType = button.parentElement.getAttribute('data-system');
            const cost = parseInt(button.getAttribute('data-cost'));
            upgradeAISystem(gameState, systemType, cost);
        });
    });
    
    // Main menu buttons
    document.getElementById('save-btn').addEventListener('click', () => {
        saveGame(gameState);
    });
    
    document.getElementById('load-btn').addEventListener('click', () => {
        loadGame(gameState);
    });
    
    document.getElementById('settings-btn').addEventListener('click', () => {
        showSettings();
    });
    
    document.getElementById('help-btn').addEventListener('click', () => {
        showHelp();
    });
    
    document.getElementById('about-btn').addEventListener('click', () => {
        showAbout();
    });
    
    // Add click event for canvas to place buildings
    const gameContainer = document.getElementById('game-container');
    gameContainer.addEventListener('click', (event) => {
        // Only handle clicks if we're in building placement mode
        if (gameState.buildingSystem && gameState.buildingSystem.selectedBuildingType) {
            const rect = gameContainer.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            placeBuilding(gameState, x, y);
        }
    });
    
    // Add mousemove event for building placement preview
    gameContainer.addEventListener('mousemove', (event) => {
        // Only update preview if we're in building placement mode
        if (gameState.buildingSystem && gameState.buildingSystem.selectedBuildingType) {
            const rect = gameContainer.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            updateBuildingPreview(gameState, x, y);
        }
    });
    
    // Add right-click event to cancel building placement
    gameContainer.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        
        // Only handle if we're in building placement mode
        if (gameState.buildingSystem && gameState.buildingSystem.selectedBuildingType) {
            cancelBuildingPlacement(gameState);
        }
    });
    
    // Add keyboard event for ESC to cancel building placement
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            // Cancel building placement if active
            if (gameState.buildingSystem && gameState.buildingSystem.selectedBuildingType) {
                cancelBuildingPlacement(gameState);
            }
            
            // Hide all menus
            hideAllMenus();
            
            // Hide dialog if visible
            hideDialog();
        }
    });
}

// Show a specific menu
function showMenu(menuId) {
    // Hide all menus first
    hideAllMenus();
    
    // Show the requested menu
    document.getElementById(menuId).classList.remove('hidden');
}

// Hide all menus
function hideAllMenus() {
    document.querySelectorAll('.game-menu').forEach(menu => {
        menu.classList.add('hidden');
    });
}

// Show dialog with event information
function showEventDialog(event, onOptionSelected) {
    const dialogTitle = document.getElementById('dialog-title');
    const dialogText = document.getElementById('dialog-text');
    const dialogOptions = document.getElementById('dialog-options');
    
    // Set dialog content
    dialogTitle.textContent = event.title;
    dialogText.textContent = event.description;
    
    // Clear previous options
    dialogOptions.innerHTML = '';
    
    // Add options
    event.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'dialog-option';
        optionElement.textContent = option.text;
        
        // Add click handler
        optionElement.addEventListener('click', () => {
            onOptionSelected(index);
            hideDialog();
        });
        
        dialogOptions.appendChild(optionElement);
    });
    
    // Show dialog
    document.getElementById('dialog-overlay').classList.remove('hidden');
}

// Hide dialog
function hideDialog() {
    document.getElementById('dialog-overlay').classList.add('hidden');
}

// Populate character list in community menu
function populateCharacterList(characters) {
    const characterList = document.getElementById('character-list');
    
    // Clear previous list
    characterList.innerHTML = '';
    
    // Add all characters
    const allCharacters = [
        ...characters.leaders,
        ...characters.specialists,
        ...characters.community,
        ...characters.external
    ];
    
    allCharacters.forEach(character => {
        const characterElement = document.createElement('div');
        characterElement.className = 'character-item';
        
        // Create character portrait (placeholder)
        const portrait = document.createElement('div');
        portrait.className = 'character-portrait';
        
        // Create character info
        const info = document.createElement('div');
        info.className = 'character-info';
        
        const name = document.createElement('h3');
        name.textContent = character.name;
        
        const role = document.createElement('p');
        role.textContent = character.role;
        
        info.appendChild(name);
        info.appendChild(role);
        
        // Add elements to character item
        characterElement.appendChild(portrait);
        characterElement.appendChild(info);
        
        // Add click handler to show character details
        characterElement.addEventListener('click', () => {
            showCharacterDetails(character);
        });
        
        characterList.appendChild(characterElement);
    });
}

// Show character details
function showCharacterDetails(character) {
    // Create a dialog for character details
    const event = {
        title: character.name,
        description: `${character.role}\n\n${character.background}\n\nExpertise: ${character.expertise}`,
        options: [
            { text: 'Talk to ' + character.name.split(' ')[0] },
            { text: 'Close' }
        ]
    };
    
    showEventDialog(event, (optionIndex) => {
        if (optionIndex === 0) {
            // Show dialogue
            const dialogue = {
                title: character.name + ' says:',
                description: character.dialogues[Math.floor(Math.random() * character.dialogues.length)],
                options: [
                    { text: 'Thank you for your insights' }
                ]
            };
            
            showEventDialog(dialogue, () => {});
        }
    });
}

// Update AI system levels display
function updateAILevels(aiSystems) {
    document.querySelectorAll('.ai-system').forEach(system => {
        const systemType = system.getAttribute('data-system');
        const levelElement = system.querySelector('.level-value');
        
        if (aiSystems[systemType]) {
            levelElement.textContent = aiSystems[systemType];
        }
    });
}

// Upgrade AI system
function upgradeAISystem(gameState, systemType, cost) {
    // Check if player can afford the upgrade
    if (gameState.resources.canAfford({ knowledge: cost })) {
        // Deduct resources
        gameState.resources.purchase({ knowledge: cost });
        
        // Upgrade system
        gameState.aiSystems[systemType]++;
        
        // Update display
        updateAILevels(gameState.aiSystems);
        
        // Show success message
        const event = {
            title: 'AI System Upgraded',
            description: `You have successfully upgraded the ${systemType} AI system to level ${gameState.aiSystems[systemType]}.`,
            options: [
                { text: 'Great!' }
            ]
        };
        
        showEventDialog(event, () => {});
    } else {
        // Show insufficient resources message
        const event = {
            title: 'Upgrade Failed',
            description: 'You do not have enough knowledge resources to upgrade this AI system.',
            options: [
                { text: 'I\'ll gather more resources' }
            ]
        };
        
        showEventDialog(event, () => {});
    }
}

// Select building for placement
function selectBuildingForPlacement(gameState, buildingType) {
    // Hide the build menu
    hideAllMenus();
    
    // Select the building type
    gameState.buildingSystem.selectBuildingType(buildingType);
    
    // Show placement instructions
    const buildingData = gameState.buildingSystem.getBuildingData(buildingType);
    
    const event = {
        title: 'Building Placement',
        description: `Click on the terrain to place the ${buildingData.name}. Right-click or press ESC to cancel.`,
        options: [
            { text: 'Got it' }
        ]
    };
    
    showEventDialog(event, () => {});
}

// Update building placement preview
function updateBuildingPreview(gameState, x, y) {
    gameState.buildingSystem.updatePlacementPreview(x, y, gameState.camera);
}

// Place building at current position
function placeBuilding(gameState, x, y) {
    const success = gameState.buildingSystem.placeBuilding(gameState.resources);
    
    if (success) {
        // Show success message
        const buildingType = gameState.buildingSystem.selectedBuildingType;
        const buildingData = gameState.buildingSystem.getBuildingData(buildingType);
        
        const event = {
            title: 'Building Constructed',
            description: `You have successfully constructed a ${buildingData.name}.`,
            options: [
                { text: 'Great!' }
            ]
        };
        
        showEventDialog(event, () => {});
    } else {
        // Building placement failed (invalid position or insufficient resources)
        // No need for a message as the preview color indicates validity
    }
}

// Cancel building placement
function cancelBuildingPlacement(gameState) {
    gameState.buildingSystem.cancelPlacement();
}

// Save game state
function saveGame(gameState) {
    try {
        // Create a simplified version of the game state for saving
        const saveData = {
            year: gameState.year,
            season: gameState.season,
            resources: gameState.resources.getResources(),
            aiSystems: { ...gameState.aiSystems },
            buildings: gameState.buildingSystem.buildings.map(building => ({
                type: building.type,
                position: {
                    x: building.position.x,
                    y: building.position.y,
                    z: building.position.z
                },
                rotation: {
                    x: building.rotation.x,
                    y: building.rotation.y,
                    z: building.rotation.z
                }
            }))
        };
        
        // Convert to JSON and save to localStorage
        localStorage.setItem('utuadoGameSave', JSON.stringify(saveData));
        
        // Show success message
        const event = {
            title: 'Game Saved',
            description: 'Your progress has been saved successfully.',
            options: [
                { text: 'Continue' }
            ]
        };
        
        showEventDialog(event, () => {});
    } catch (error) {
        console.error('Error saving game:', error);
        
        // Show error message
        const event = {
            title: 'Save Failed',
            description: 'There was an error saving your game: ' + error.message,
            options: [
                { text: 'OK' }
            ]
        };
        
        showEventDialog(event, () => {});
    }
}

// Load game state
function loadGame(gameState) {
    try {
        // Get save data from localStorage
        const saveDataJson = localStorage.getItem('utuadoGameSave');
        
        if (!saveDataJson) {
            // No save data found
            const event = {
                title: 'No Save Found',
                description: 'No saved game was found.',
                options: [
                    { text: 'OK' }
                ]
            };
            
            showEventDialog(event, () => {});
            return;
        }
        
        // Parse save data
        const saveData = JSON.parse(saveDataJson);
        
        // Confirm load
        const event = {
            title: 'Load Game',
            description: 'Are you sure you want to load the saved game? Your current progress will be lost.',
            options: [
                { text: 'Yes, load game' },
                { text: 'No, cancel' }
            ]
        };
        
        showEventDialog(event, (optionIndex) => {
            if (optionIndex === 0) {
                // Apply save data to game state
                gameState.year = saveData.year;
                gameState.season = saveData.season;
                
                // Update resources
                gameState.resources.addResources(saveData.resources);
                
                // Update AI systems
                for (const system in saveData.aiSystems) {
                    gameState.aiSystems[system] = saveData.aiSystems[system];
                }
                
                // Clear existing buildings
                gameState.buildingSystem.buildings.forEach(building => {
                    gameState.scene.remove(building.model);
                });
                gameState.buildingSystem.buildings = [];
                
                // Recreate buildings from save data
                saveData.buildings.forEach(buildingData => {
                    const buildingModel = gameState.buildingSystem.buildingModels[buildingData.type].clone();
                    buildingModel.position.set(
                        buildingData.position.x,
                        buildingData.position.y,
                        buildingData.position.z
                    );
                    buildingModel.rotation.set(
                        buildingData.rotation.x,
                        buildingData.rotation.y,
                        buildingData.rotation.z
                    );
                    gameState.scene.add(buildingModel);
                    
                    gameState.buildingSystem.buildings.push({
                        type: buildingData.type,
                        model: buildingModel,
                        position: buildingModel.position.clone(),
                        rotation: buildingModel.rotation.clone(),
                        health: 100,
                        efficiency: 100
                    });
                });
                
                // Update season
                gameState.seasonSystem.setSeason(gameState.season);
                
                // Update UI
                updateUI(gameState);
                
                // Show success message
                const successEvent = {
                    title: 'Game Loaded',
                    description: 'Your saved game has been loaded successfully.',
                    options: [
                        { text: 'Continue' }
                    ]
                };
                
                showEventDialog(successEvent, () => {});
            }
        });
    } catch (error) {
        console.error('Error loading game:', error);
        
        // Show error message
        const event = {
            title: 'Load Failed',
            description: 'There was an error loading your game: ' + error.message,
            options: [
                { text: 'OK' }
            ]
        };
        
        showEventDialog(event, () => {});
    }
}

// Show settings dialog
function showSettings() {
    const event = {
        title: 'Settings',
        description: 'Adjust game settings:',
        options: [
            { text: 'Graphics: High' },
            { text: 'Sound: On' },
            { text: 'Tutorial: On' },
            { text: 'Close' }
        ]
    };
    
    showEventDialog(event, (optionIndex) => {
        // Settings functionality would be implemented here
    });
}

// Show help dialog
function showHelp() {
    const event = {
        title: 'Help',
        description: 'Utuado: Sustainable Future is a simulation game where you manage a sustainable community in Puerto Rico.\n\n' +
                    'Controls:\n' +
                    '- Left-click to select and place buildings\n' +
                    '- Right-click to cancel placement\n' +
                    '- Mouse wheel to zoom in/out\n' +
                    '- Hold middle mouse button to rotate camera\n' +
                    '- ESC to cancel actions or close menus\n\n' +
                    'Manage your resources carefully and balance immediate needs with long-term sustainability.',
        options: [
            { text: 'Got it!' }
        ]
    };
    
    showEventDialog(event, () => {});
}

// Show about dialog
function showAbout() {
    const event = {
        title: 'About Utuado: Sustainable Future',
        description: 'Version 1.0\n\n' +
                    'This game explores the integration of advanced AI technologies with sustainable living practices in a future version of Utuado, Puerto Rico.\n\n' +
                    'Inspired by real initiatives like the Cooperativa Hidroeléctrica de la Montaña and agritourism development in the region.\n\n' +
                    'Created as an educational tool to promote sustainable development and cultural preservation.',
        options: [
            { text: 'Close' }
        ]
    };
    
    showEventDialog(event, () => {});
}

// Export functions
export { initUI, updateUI, showEventDialog };
