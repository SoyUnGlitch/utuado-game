// SeasonDisplay.js - Component for displaying season information
export class SeasonDisplay {
    constructor(seasonSystem) {
        this.seasonSystem = seasonSystem;
        this.element = document.getElementById('season-indicator');
        this.seasonText = this.element.querySelector('.season-text');
        this.dayCounter = this.element.querySelector('.day-counter');
        
        // Register for season updates
        this.seasonSystem.onSeasonChange(data => {
            this.update();
        });
        
        this.seasonSystem.onDayChange(data => {
            this.update();
        });
    }
    
    update() {
        const season = this.seasonSystem.getCurrentSeason();
        const day = this.seasonSystem.getCurrentDay();
        
        // Update text
        this.seasonText.textContent = season.charAt(0).toUpperCase() + season.slice(1);
        this.dayCounter.textContent = `Day ${day}`;
        
        // Update colors based on season
        switch (season) {
            case 'spring':
                this.element.style.backgroundColor = 'rgba(124, 252, 0, 0.5)'; // Bright green
                break;
            case 'summer':
                this.element.style.backgroundColor = 'rgba(255, 165, 0, 0.5)'; // Orange
                break;
            case 'fall':
                this.element.style.backgroundColor = 'rgba(218, 165, 32, 0.5)'; // Golden rod
                break;
            case 'winter':
                this.element.style.backgroundColor = 'rgba(135, 206, 235, 0.5)'; // Sky blue
                break;
            default:
                this.element.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        }
    }
}
