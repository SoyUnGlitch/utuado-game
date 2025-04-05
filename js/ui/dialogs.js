// Dialog system for Utuado game
import * as THREE from 'three';

// Initialize dialog system
function initDialogs(gameState) {
    console.log('Initializing dialog system...');
    
    // Set up dialog close button
    document.getElementById('dialog-close').addEventListener('click', () => {
        hideDialog();
    });
    
    // Add ESC key handler to close dialog
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            hideDialog();
        }
    });
}

// Show dialog with content and options
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

// Show event dialog
function showEventDialog(event, gameState) {
    showDialog({
        title: event.title,
        description: event.description,
        options: event.options
    }, (optionIndex) => {
        // Apply the effect of the selected option
        const selectedOption = event.options[optionIndex];
        
        if (selectedOption.effect) {
            gameState.resources.addResources(selectedOption.effect);
        }
        
        // Record the event
        gameState.events.recordEvent(event);
    });
}

// Show character dialog
function showCharacterDialog(character, gameState) {
    // Get a random dialogue from the character
    const dialogue = gameState.characters.getRandomDialogue(character);
    
    showDialog({
        title: `${character.name} says:`,
        description: dialogue,
        options: [
            { text: 'Thank you for your insights' }
        ]
    }, () => {
        // Apply character's special effect if any
        if (character.specialEffect) {
            gameState.resources.addResources(character.specialEffect);
            
            // Show effect notification
            showDialog({
                title: 'Insight Gained',
                description: `${character.name}'s expertise has provided you with valuable resources.`,
                options: [
                    { text: 'Great!' }
                ]
            }, () => {});
        }
    });
}

// Show tutorial dialog
function showTutorialDialog(tutorialStep, gameState) {
    const tutorials = {
        welcome: {
            title: 'Welcome to Utuado: Sustainable Future',
            description: 'The year is 2039, and you are responsible for managing a sustainable community in Utuado, Puerto Rico. Your goal is to balance resource management, technological advancement, and cultural preservation.\n\nThis tutorial will guide you through the basics of the game.',
            options: [
                { text: 'Continue' }
            ],
            nextStep: 'resources'
        },
        resources: {
            title: 'Resource Management',
            description: 'Your community needs five key resources:\n\n⚡ Energy - Generated from renewable sources\n💧 Water - Collected and purified\n🌽 Food - Grown in sustainable farms\n🧱 Materials - Used for construction\n📚 Knowledge - Developed through research\n\nBalance production and consumption to keep your community thriving.',
            options: [
                { text: 'Continue' }
            ],
            nextStep: 'buildings'
        },
        buildings: {
            title: 'Building Structures',
            description: 'Click the Build button to construct various structures:\n\n- Solar Panels, Wind Turbines, and Hydro Plants generate energy\n- Farms produce food\n- Water Collectors gather water\n- Research Centers generate knowledge\n\nEach building requires resources to construct and may produce or consume resources over time.',
            options: [
                { text: 'Continue' }
            ],
            nextStep: 'seasons'
        },
        seasons: {
            title: 'Seasonal Cycle',
            description: 'The game progresses through four seasons: Spring, Summer, Fall, and Winter. Each season affects resource production differently:\n\n- Spring: Good for water and food\n- Summer: Excellent for energy\n- Fall: Good for food harvesting\n- Winter: Challenging for most resources\n\nPlan accordingly to maintain sustainability throughout the year.',
            options: [
                { text: 'Continue' }
            ],
            nextStep: 'ai'
        },
        ai: {
            title: 'AI Integration',
            description: 'Your community uses advanced AI systems to optimize resource management:\n\n- Energy Management AI\n- Agricultural AI\n- Environmental Monitoring AI\n- Disaster Preparedness AI\n- Community Management AI\n\nUpgrade these systems using knowledge resources to improve efficiency and resilience.',
            options: [
                { text: 'Continue' }
            ],
            nextStep: 'events'
        },
        events: {
            title: 'Events and Decisions',
            description: 'Throughout the game, you\'ll face various events that require decisions. These may include:\n\n- Seasonal challenges\n- Natural disasters\n- Community disputes\n- Technological opportunities\n\nYour choices will affect resource levels and community development.',
            options: [
                { text: 'Continue' }
            ],
            nextStep: 'characters'
        },
        characters: {
            title: 'Community Characters',
            description: 'Interact with various community members to gain insights and benefits:\n\n- Community Leaders provide guidance\n- Technical Specialists offer expertise\n- Community Members share local knowledge\n- External Visitors bring new perspectives\n\nClick the Community button to view and interact with characters.',
            options: [
                { text: 'Continue' }
            ],
            nextStep: 'controls'
        },
        controls: {
            title: 'Game Controls',
            description: 'Navigate the 3D environment:\n\n- Left-click to select and place buildings\n- Right-click to cancel placement\n- Mouse wheel to zoom in/out\n- Hold middle mouse button to rotate camera\n- ESC to cancel actions or close menus',
            options: [
                { text: 'Start Game' }
            ],
            nextStep: null
        }
    };
    
    const tutorial = tutorials[tutorialStep];
    
    if (!tutorial) {
        console.error('Invalid tutorial step:', tutorialStep);
        return;
    }
    
    showDialog(tutorial, () => {
        if (tutorial.nextStep) {
            showTutorialDialog(tutorial.nextStep, gameState);
        }
    });
}

// Show crisis dialog
function showCrisisDialog(resourceType, gameState) {
    const crisisEvent = gameState.events.events.crisis[resourceType];
    
    if (!crisisEvent) {
        console.error('No crisis event found for resource:', resourceType);
        return;
    }
    
    showEventDialog(crisisEvent, gameState);
}

// Show notification dialog
function showNotification(title, message, gameState) {
    showDialog({
        title: title,
        description: message,
        options: [
            { text: 'OK' }
        ]
    }, () => {});
}

// Show confirmation dialog
function showConfirmation(title, message, onConfirm, onCancel) {
    showDialog({
        title: title,
        description: message,
        options: [
            { text: 'Yes' },
            { text: 'No' }
        ]
    }, (optionIndex) => {
        if (optionIndex === 0) {
            onConfirm();
        } else {
            if (onCancel) onCancel();
        }
    });
}

// Export functions
export { 
    initDialogs, 
    showDialog, 
    hideDialog, 
    showEventDialog, 
    showCharacterDialog, 
    showTutorialDialog,
    showCrisisDialog,
    showNotification,
    showConfirmation
};
