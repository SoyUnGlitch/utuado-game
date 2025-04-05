// Notification.js - Component for displaying notifications
export class Notification {
    constructor() {
        this.element = null;
        this.timeout = null;
        this.createNotificationElement();
    }
    
    createNotificationElement() {
        // Create notification element if it doesn't exist
        if (!this.element) {
            this.element = document.createElement('div');
            this.element.id = 'notification';
            this.element.style.position = 'fixed';
            this.element.style.bottom = '70px';
            this.element.style.left = '50%';
            this.element.style.transform = 'translateX(-50%)';
            this.element.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            this.element.style.color = 'white';
            this.element.style.padding = '10px 20px';
            this.element.style.borderRadius = '5px';
            this.element.style.zIndex = '500';
            this.element.style.transition = 'opacity 0.3s';
            this.element.style.opacity = '0';
            document.body.appendChild(this.element);
        }
    }
    
    show(message, duration = 3000) {
        // Clear existing timeout
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        
        // Set message and show notification
        this.element.textContent = message;
        this.element.style.opacity = '1';
        
        // Hide after duration
        this.timeout = setTimeout(() => {
            this.element.style.opacity = '0';
        }, duration);
    }
    
    hide() {
        this.element.style.opacity = '0';
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }
}
