// Menu system for Utuado game
import * as THREE from 'three';

// Initialize menus
function initMenus(gameState) {
    console.log('Initializing menus...');
    
    // Set up building menu
    initBuildingMenu(gameState);
    
    // Set up AI systems menu
    initAISystemsMenu(gameState);
    
    // Set up main menu
    initMainMenu(gameState);
}

// Initialize building menu with building options
function initBuildingMenu(gameState) {
    const buildingMenu = document.getElementById('build-menu');
    const menuContent = buildingMenu.querySelector('.menu-content');
    
    // Clear existing content
    menuContent.innerHTML = '';
    
    // Get building data from building system
    const buildingTypes = gameState.buildingSystem.buildingTypes;
    const buildingData = gameState.buildingSystem.buildingData;
    
    // Create building options
    for (const type in buildingTypes) {
        const buildingType = buildingTypes[type].toLowerCase();
        const building = buildingData[buildingType];
        
        const buildingOption = document.createElement('div');
        buildingOption.className = 'building-option';
        buildingOption.setAttribute('data-building', buildingType);
        
        const title = document.createElement('h3');
        title.textContent = building.name;
        
        const description = document.createElement('p');
        description.textContent = building.description;
        
        const costContainer = document.createElement('div');
        costContainer.className = 'building-cost';
        
        // Add cost icons
        for (const resource in building.cost) {
            const costItem = document.createElement('span');
            
            // Use emoji for resource icon
            let emoji = '';
            switch(resource) {
                case 'energy': emoji = '⚡'; break;
                case 'water': emoji = '💧'; break;
                case 'food': emoji = '🌽'; break;
                case 'materials': emoji = '🧱'; break;
                case 'knowledge': emoji = '📚'; break;
            }
            
            costItem.textContent = `${emoji} ${building.cost[resource]}`;
            costContainer.appendChild(costItem);
        }
        
        // Add production info if available
        if (Object.keys(building.production).length > 0) {
            const productionContainer = document.createElement('div');
            productionContainer.className = 'building-production';
            
            for (const resource in building.production) {
                const productionItem = document.createElement('span');
                
                // Use emoji for resource icon
                let emoji = '';
                switch(resource) {
                    case 'energy': emoji = '⚡'; break;
                    case 'water': emoji = '💧'; break;
                    case 'food': emoji = '🌽'; break;
                    case 'materials': emoji = '🧱'; break;
                    case 'knowledge': emoji = '📚'; break;
                }
                
                const value = building.production[resource];
                const sign = value >= 0 ? '+' : '';
                productionItem.textContent = `${emoji} ${sign}${value}`;
                productionContainer.appendChild(productionItem);
            }
            
            // Add production container to building option
            const productionLabel = document.createElement('p');
            productionLabel.textContent = 'Production:';
            productionLabel.className = 'production-label';
            
            buildingOption.appendChild(title);
            buildingOption.appendChild(description);
            buildingOption.appendChild(costContainer);
            buildingOption.appendChild(productionLabel);
            buildingOption.appendChild(productionContainer);
        } else {
            buildingOption.appendChild(title);
            buildingOption.appendChild(description);
            buildingOption.appendChild(costContainer);
        }
        
        // Add click handler
        buildingOption.addEventListener('click', () => {
            selectBuildingForPlacement(gameState, buildingType);
        });
        
        menuContent.appendChild(buildingOption);
    }
}

// Initialize AI systems menu
function initAISystemsMenu(gameState) {
    const aiMenu = document.getElementById('ai-menu');
    const menuContent = aiMenu.querySelector('.menu-content');
    
    // Clear existing content
    menuContent.innerHTML = '';
    
    // Create AI system entries
    const aiSystems = [
        {
            id: 'energyManagement',
            name: 'Energy Management AI',
            description: 'Optimizes energy distribution and storage',
            benefits: 'Increases energy production efficiency'
        },
        {
            id: 'agricultural',
            name: 'Agricultural AI',
            description: 'Monitors and optimizes crop growth',
            benefits: 'Increases food production efficiency'
        },
        {
            id: 'environmentalMonitoring',
            name: 'Environmental Monitoring AI',
            description: 'Predicts weather patterns and environmental changes',
            benefits: 'Improves water collection and reduces disaster impact'
        },
        {
            id: 'disasterPreparedness',
            name: 'Disaster Preparedness AI',
            description: 'Analyzes risks and coordinates emergency responses',
            benefits: 'Reduces damage from natural disasters'
        },
        {
            id: 'communityManagement',
            name: 'Community Management AI',
            description: 'Optimizes resource allocation and community satisfaction',
            benefits: 'Improves overall resource efficiency'
        }
    ];
    
    aiSystems.forEach(system => {
        const aiSystem = document.createElement('div');
        aiSystem.className = 'ai-system';
        aiSystem.setAttribute('data-system', system.id);
        
        const title = document.createElement('h3');
        title.textContent = system.name;
        
        const description = document.createElement('p');
        description.textContent = system.description;
        
        const benefits = document.createElement('p');
        benefits.className = 'ai-benefits';
        benefits.textContent = system.benefits;
        
        const level = document.createElement('div');
        level.className = 'ai-level';
        
        const levelLabel = document.createElement('span');
        levelLabel.textContent = 'Level: ';
        
        const levelValue = document.createElement('span');
        levelValue.className = 'level-value';
        levelValue.textContent = gameState.aiSystems[system.id] || 1;
        
        level.appendChild(levelLabel);
        level.appendChild(levelValue);
        
        // Calculate upgrade cost based on current level
        const currentLevel = gameState.aiSystems[system.id] || 1;
        const upgradeCost = 20 * currentLevel;
        
        const upgradeBtn = document.createElement('button');
        upgradeBtn.className = 'upgrade-btn';
        upgradeBtn.setAttribute('data-cost', upgradeCost);
        upgradeBtn.textContent = `Upgrade (📚 ${upgradeCost})`;
        
        // Add click handler for upgrade
        upgradeBtn.addEventListener('click', () => {
            upgradeAISystem(gameState, system.id, upgradeCost);
        });
        
        aiSystem.appendChild(title);
        aiSystem.appendChild(description);
        aiSystem.appendChild(benefits);
        aiSystem.appendChild(level);
        aiSystem.appendChild(upgradeBtn);
        
        menuContent.appendChild(aiSystem);
    });
}

// Initialize main menu
function initMainMenu(gameState) {
    // Main menu is static in HTML, no dynamic content needed
}

// Select building for placement
function selectBuildingForPlacement(gameState, buildingType) {
    // Hide the build menu
    hideAllMenus();
    
    // Select the building type in the building system
    gameState.buildingSystem.selectBuildingType(buildingType);
    
    // Show placement instructions
    const buildingData = gameState.buildingSystem.getBuildingData(buildingType);
    
    showDialog({
        title: 'Building Placement',
        description: `Click on the terrain to place the ${buildingData.name}. Right-click or press ESC to cancel.`,
        options: [
            { text: 'Got it' }
        ]
    }, () => {});
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
        showDialog({
            title: 'AI System Upgraded',
            description: `You have successfully upgraded the ${systemType} AI system to level ${gameState.aiSystems[systemType]}.`,
            options: [
                { text: 'Great!' }
            ]
        }, () => {});
    } else {
        // Show insufficient resources message
        showDialog({
            title: 'Upgrade Failed',
            description: 'You do not have enough knowledge resources to upgrade this AI system.',
            options: [
                { text: 'I\'ll gather more resources' }
            ]
        }, () => {});
    }
}

// Update AI system levels display
function updateAILevels(aiSystems) {
    document.querySelectorAll('.ai-system').forEach(system => {
        const systemType = system.getAttribute('data-system');
        const levelElement = system.querySelector('.level-value');
        
        if (aiSystems[systemType]) {
            levelElement.textContent = aiSystems[systemType];
            
            // Update upgrade button cost
            const upgradeBtn = system.querySelector('.upgrade-btn');
            const newCost = 20 * aiSystems[systemType];
            upgradeBtn.setAttribute('data-cost', newCost);
            upgradeBtn.textContent = `Upgrade (📚 ${newCost})`;
        }
    });
}

// Hide all menus
function hideAllMenus() {
    document.querySelectorAll('.game-menu').forEach(menu => {
        menu.classList.add('hidden');
    });
}

// Show dialog
function showDialog(dialogData, onOptionSelected) {
    const dialogTitle = document.getElementById('dialog-title');
    const dialogText = document.getElementById('dialog-text');
    const dialogOptions = document.getElementById('dialog-options');
    
    // Set dialog content
    dialogTitle.textContent = dialogData.title;
    dialogText.textContent = dialogData.description;
    
    // Clear previous options
    dialogOptions.innerHTML = '';
    
    // Add options
    dialogData.options.forEach((option, index) => {
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

// Export functions
export { initMenus, showDialog, hideDialog, hideAllMenus };
