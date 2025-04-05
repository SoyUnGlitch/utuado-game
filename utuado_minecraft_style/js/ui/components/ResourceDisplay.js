// ResourceDisplay.js - Component for displaying resource information
export class ResourceDisplay {
    constructor(resourceManager) {
        this.resourceManager = resourceManager;
        this.element = document.getElementById('resources-panel');
        this.resourceElements = {
            energy: document.getElementById('energy'),
            water: document.getElementById('water'),
            food: document.getElementById('food'),
            materials: document.getElementById('materials'),
            knowledge: document.getElementById('knowledge')
        };
    }
    
    update() {
        const resources = this.resourceManager.getResources();
        
        for (const [resource, value] of Object.entries(resources)) {
            const element = this.resourceElements[resource];
            if (element) {
                const valueElement = element.querySelector('.resource-value');
                if (valueElement) {
                    valueElement.textContent = Math.floor(value);
                    
                    // Visual feedback for low resources
                    if (value < 20) {
                        valueElement.style.color = '#ff4d4d'; // Red for critical
                    } else if (value < 50) {
                        valueElement.style.color = '#ffcc00'; // Yellow for warning
                    } else {
                        valueElement.style.color = 'white'; // Normal
                    }
                }
            }
        }
    }
}
