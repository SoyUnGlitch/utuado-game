// SeasonSystem.js - Manages seasons and time for Utuado game
export class SeasonSystem {
    constructor(dayLength, seasonLength) {
        // Time settings
        this.dayLength = dayLength; // seconds per day
        this.seasonLength = seasonLength; // days per season
        
        // Time tracking
        this.totalTime = 0; // seconds since game start
        this.dayTime = 0; // seconds into current day
        this.currentDay = 1;
        this.currentSeason = 'spring';
        
        // Season cycle
        this.seasons = ['spring', 'summer', 'fall', 'winter'];
        this.seasonIndex = 0;
        
        // Callbacks
        this.onDayChangeCallbacks = [];
        this.onSeasonChangeCallbacks = [];
        this.onTimeUpdateCallbacks = [];
    }
    
    // Start the season system
    start() {
        this.totalTime = 0;
        this.dayTime = 0;
        this.currentDay = 1;
        this.seasonIndex = 0;
        this.currentSeason = this.seasons[this.seasonIndex];
    }
    
    // Update time
    update(deltaTime) {
        // Update total time
        this.totalTime += deltaTime;
        
        // Update day time
        const previousDayTime = this.dayTime;
        this.dayTime += deltaTime;
        
        // Check for day change
        if (this.dayTime >= this.dayLength) {
            // Reset day time
            this.dayTime = this.dayTime % this.dayLength;
            
            // Increment day
            this.currentDay++;
            
            // Check for season change
            if ((this.currentDay - 1) % this.seasonLength === 0) {
                // Increment season
                this.seasonIndex = (this.seasonIndex + 1) % this.seasons.length;
                this.currentSeason = this.seasons[this.seasonIndex];
                
                // Trigger season change callbacks
                this.triggerSeasonChangeCallbacks();
            }
            
            // Trigger day change callbacks
            this.triggerDayChangeCallbacks();
        }
        
        // Trigger time update callbacks
        this.triggerTimeUpdateCallbacks();
    }
    
    // Get current season
    getCurrentSeason() {
        return this.currentSeason;
    }
    
    // Get current day
    getCurrentDay() {
        return this.currentDay;
    }
    
    // Get day progress (0.0 to 1.0)
    getDayProgress() {
        return this.dayTime / this.dayLength;
    }
    
    // Get total days elapsed
    getTotalDays() {
        return Math.floor(this.totalTime / this.dayLength) + 1;
    }
    
    // Register callback for day change
    onDayChange(callback) {
        this.onDayChangeCallbacks.push(callback);
    }
    
    // Register callback for season change
    onSeasonChange(callback) {
        this.onSeasonChangeCallbacks.push(callback);
    }
    
    // Register callback for time update
    onTimeUpdate(callback) {
        this.onTimeUpdateCallbacks.push(callback);
    }
    
    // Trigger day change callbacks
    triggerDayChangeCallbacks() {
        for (const callback of this.onDayChangeCallbacks) {
            callback({
                day: this.currentDay,
                season: this.currentSeason
            });
        }
    }
    
    // Trigger season change callbacks
    triggerSeasonChangeCallbacks() {
        for (const callback of this.onSeasonChangeCallbacks) {
            callback({
                season: this.currentSeason,
                day: this.currentDay
            });
        }
    }
    
    // Trigger time update callbacks
    triggerTimeUpdateCallbacks() {
        for (const callback of this.onTimeUpdateCallbacks) {
            callback({
                totalTime: this.totalTime,
                dayTime: this.dayTime,
                dayProgress: this.getDayProgress(),
                day: this.currentDay,
                season: this.currentSeason
            });
        }
    }
    
    // Get season color
    getSeasonColor() {
        switch (this.currentSeason) {
            case 'spring':
                return 0x7CFC00; // Bright green
            case 'summer':
                return 0x32CD32; // Lime green
            case 'fall':
                return 0xDAA520; // Golden rod
            case 'winter':
                return 0xF0F8FF; // Alice blue
            default:
                return 0x7CFC00;
        }
    }
    
    // Get season ambient light intensity
    getSeasonLightIntensity() {
        switch (this.currentSeason) {
            case 'spring':
                return 0.8;
            case 'summer':
                return 1.0;
            case 'fall':
                return 0.7;
            case 'winter':
                return 0.5;
            default:
                return 0.8;
        }
    }
    
    // Get season fog density
    getSeasonFogDensity() {
        switch (this.currentSeason) {
            case 'spring':
                return 0.01;
            case 'summer':
                return 0.005;
            case 'fall':
                return 0.02;
            case 'winter':
                return 0.03;
            default:
                return 0.01;
        }
    }
}
