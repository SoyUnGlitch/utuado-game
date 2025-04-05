// EventDialog.js - Component for displaying event dialogs
export class EventDialog {
    constructor(game) {
        this.game = game;
        this.element = document.getElementById('event-dialog');
        this.titleElement = document.getElementById('event-title');
        this.descriptionElement = document.getElementById('event-description');
        this.choicesContainer = document.getElementById('event-choices');
        this.callback = null;
    }
    
    show(title, description, choices, callback) {
        // Set title and description
        this.titleElement.textContent = title;
        this.descriptionElement.textContent = description;
        
        // Clear existing choices
        this.choicesContainer.innerHTML = '';
        
        // Add choices
        choices.forEach((choice, index) => {
            const choiceElement = document.createElement('div');
            choiceElement.className = 'event-choice';
            choiceElement.textContent = choice.text;
            choiceElement.addEventListener('click', () => {
                this.hide();
                if (callback) callback(index);
            });
            this.choicesContainer.appendChild(choiceElement);
        });
        
        // Show dialog
        this.element.classList.remove('hidden');
        this.callback = callback;
        
        // Pause game
        this.game.pause();
    }
    
    hide() {
        this.element.classList.add('hidden');
        this.game.resume();
    }
}
