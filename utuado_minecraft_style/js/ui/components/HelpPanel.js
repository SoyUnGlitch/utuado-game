// HelpPanel.js - Component for help information
export class HelpPanel {
    constructor(game) {
        this.game = game;
        this.element = document.getElementById('help-panel');
        this.toggleButton = document.getElementById('toggle-help');
        this.closeButton = document.getElementById('close-help');
        
        this.initialize();
    }
    
    initialize() {
        // Set up toggle button
        this.toggleButton.addEventListener('click', () => {
            this.toggle();
        });
        
        // Set up close button
        this.closeButton.addEventListener('click', () => {
            this.hide();
        });
    }
    
    toggle() {
        this.element.classList.toggle('hidden');
        
        // If opening help, pause game
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
}
