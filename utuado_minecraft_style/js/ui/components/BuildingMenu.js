// BuildingMenu.js - Component for building selection menu
export class BuildingMenu {
    constructor(game, buildingSystem) {
        this.game = game;
        this.buildingSystem = buildingSystem;
        this.element = document.getElementById('building-menu');
        this.toggleButton = document.getElementById('toggle-building-menu');
        this.selectedBuilding = null;
        
        this.initialize();
    }
    
    initialize() {
        // Set up toggle button
        this.toggleButton.addEventListener('click', () => {
            this.toggle();
        });
        
        // Set up building items
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
    
    toggle() {
        this.element.classList.toggle('hidden');
        
        // If opening menu, pause game
        if (!this.element.classList.contains('hidden')) {
            this.game.pause();
        } else {
            this.game.resume();
        }
    }
    
    show() {
        this.element.classList.remove('hidden');
        this.game.pause();
    }
    
    hide() {
        this.element.classList.add('hidden');
        this.game.resume();
    }
    
    getSelectedBuilding() {
        return this.selectedBuilding;
    }
    
    updateAvailability(gameState, resources) {
        const buildingItems = document.querySelectorAll('.building-item');
        
        buildingItems.forEach(item => {
            const buildingType = item.dataset.building;
            const buildingData = this.buildingSystem.getBuildingData(buildingType);
            
            // Check if building requirements are met
            const requirementsMet = this.buildingSystem.checkRequirements(
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
