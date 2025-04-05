// UIManager.js - Manages user interface for Utuado game
export class UIManager {
    constructor(game) {
        this.game = game;
        this.selectedBuilding = null;
        this.notificationTimeout = null;
        
        // UI elements
        this.resourcesPanel = document.getElementById('resources-panel');
        this.seasonIndicator = document.getElementById('season-indicator');
        this.buildingMenu = document.getElementById('building-menu');
        this.helpPanel = document.getElementById('help-panel');
        this.eventDialog = document.getElementById('event-dialog');
        
        // Buttons
        this.toggleBuildingMenuButton = document.getElementById('toggle-building-menu');
        this.toggleHelpButton = document.getElementById('toggle-help');
        this.closeHelpButton = document.getElementById('close-help');
    }
    
    // Initialize UI
    init() {
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize building menu
        this.initializeBuildingMenu();
    }
    
    // Set up event listeners
    setupEventListeners() {
        // Building menu toggle
        this.toggleBuildingMenuButton.addEventListener('click', () => {
            this.toggleBuildingMenu();
        });
        
        // Help panel toggle
        this.toggleHelpButton.addEventListener('click', () => {
            this.toggleHelpPanel();
        });
        
        // Close help button
        this.closeHelpButton.addEventListener('click', () => {
            this.closeHelpPanel();
        });
    }
    
    // Initialize building menu
    initializeBuildingMenu() {
        const buildingItems = document.querySelectorAll('.building-item');
        
        buildingItems.forEach(item => {
            item.addEventListener('click', () => {
                // Deselect all buildings
                buildingItems.forEach(i => i.classList.remove('selected'));
                
                // Select clicked building
                item.classList.add('selected');
                
                // Set selected building
                this.selectedBuilding = item.dataset.building;
            });
        });
    }
    
    // Toggle building menu
    toggleBuildingMenu() {
        this.buildingMenu.classList.toggle('hidden');
        
        // If opening menu, pause game
        if (!this.buildingMenu.classList.contains('hidden')) {
            this.game.pause();
        } else {
            this.game.resume();
        }
    }
    
    // Toggle help panel
    toggleHelpPanel() {
        this.helpPanel.classList.toggle('hidden');
        
        // If opening help, pause game
        if (!this.helpPanel.classList.contains('hidden')) {
            this.game.pause();
        } else {
            this.game.resume();
        }
    }
    
    // Close help panel
    closeHelpPanel() {
        this.helpPanel.classList.add('hidden');
        this.game.resume();
    }
    
    // Close all menus
    closeAllMenus() {
        this.buildingMenu.classList.add('hidden');
        this.helpPanel.classList.add('hidden');
        this.game.resume();
    }
    
    // Get selected building
    getSelectedBuilding() {
        return this.selectedBuilding;
    }
    
    // Update resource display
    updateResourceDisplay(resources) {
        for (const [resource, value] of Object.entries(resources)) {
            const element = document.getElementById(resource);
            if (element) {
                const valueElement = element.querySelector('.resource-value');
                if (valueElement) {
                    valueElement.textContent = Math.floor(value);
                }
            }
        }
    }
    
    // Update season display
    updateSeasonDisplay(season, day) {
        const seasonText = document.querySelector('.season-text');
        const dayCounter = document.querySelector('.day-counter');
        
        if (seasonText) {
            seasonText.textContent = season.charAt(0).toUpperCase() + season.slice(1);
        }
        
        if (dayCounter) {
            dayCounter.textContent = `Day ${day}`;
        }
    }
    
    // Show notification
    showNotification(message) {
        // Clear existing notification
        if (this.notificationTimeout) {
            clearTimeout(this.notificationTimeout);
        }
        
        // Check if notification element exists
        let notification = document.getElementById('notification');
        
        // Create notification element if it doesn't exist
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'notification';
            notification.style.position = 'fixed';
            notification.style.bottom = '70px';
            notification.style.left = '50%';
            notification.style.transform = 'translateX(-50%)';
            notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            notification.style.color = 'white';
            notification.style.padding = '10px 20px';
            notification.style.borderRadius = '5px';
            notification.style.zIndex = '500';
            notification.style.transition = 'opacity 0.3s';
            document.body.appendChild(notification);
        }
        
        // Set message
        notification.textContent = message;
        notification.style.opacity = '1';
        
        // Hide after 3 seconds
        this.notificationTimeout = setTimeout(() => {
            notification.style.opacity = '0';
        }, 3000);
    }
    
    // Show event dialog
    showEventDialog(title, description, choices, callback) {
        // Set title and description
        document.getElementById('event-title').textContent = title;
        document.getElementById('event-description').textContent = description;
        
        // Clear existing choices
        const choicesContainer = document.getElementById('event-choices');
        choicesContainer.innerHTML = '';
        
        // Add choices
        choices.forEach((choice, index) => {
            const choiceElement = document.createElement('div');
            choiceElement.className = 'event-choice';
            choiceElement.textContent = choice.text;
            choiceElement.addEventListener('click', () => {
                this.hideEventDialog();
                callback(index);
            });
            choicesContainer.appendChild(choiceElement);
        });
        
        // Show dialog
        this.eventDialog.classList.remove('hidden');
        
        // Pause game
        this.game.pause();
    }
    
    // Hide event dialog
    hideEventDialog() {
        this.eventDialog.classList.add('hidden');
        this.game.resume();
    }
    
    // Update building menu based on available buildings
    updateBuildingMenu(buildingSystem, gameState, resources) {
        const buildingItems = document.querySelectorAll('.building-item');
        
        buildingItems.forEach(item => {
            const buildingType = item.dataset.building;
            const buildingData = buildingSystem.getBuildingData(buildingType);
            
            // Check if building requirements are met
            const requirementsMet = buildingSystem.checkRequirements(
                buildingType,
                gameState,
                resources
            );
            
            // Check if resources are sufficient
            const canAfford = this.game.resourceManager.canAfford(buildingData.cost);
            
            // Update appearance based on availability
            if (!requirementsMet) {
                item.classList.add('locked');
                item.title = 'Requirements not met';
            } else if (!canAfford) {
                item.classList.add('unaffordable');
                item.classList.remove('locked');
                item.title = 'Not enough resources';
            } else {
                item.classList.remove('locked', 'unaffordable');
                item.title = buildingData.description;
            }
        });
    }
}
