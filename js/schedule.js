// Schedule page functionality

class ScheduleManager {
    constructor() {
        this.scheduleGrid = document.getElementById('scheduleGrid');
        this.noResults = document.getElementById('noResults');
        this.locationFilter = document.getElementById('locationFilter');
        this.dateFilter = document.getElementById('dateFilter');
        this.allDeliveries = [];
        this.filteredDeliveries = [];
        
        this.init();
    }
    
    init() {
        this.loadDeliveries();
        this.setupEventListeners();
        this.displayDeliveries();
    }
    
    loadDeliveries() {
        this.allDeliveries = Storage.get('deliverySchedule') || [];
        this.filteredDeliveries = [...this.allDeliveries];
    }
    
    setupEventListeners() {
        if (this.locationFilter) {
            this.locationFilter.addEventListener('input', () => this.filterSchedule());
        }
        
        if (this.dateFilter) {
            this.dateFilter.addEventListener('change', () => this.filterSchedule());
        }
    }
    
    filterSchedule() {
        const locationQuery = this.locationFilter ? this.locationFilter.value.toLowerCase().trim() : '';
        const dateFilter = this.dateFilter ? this.dateFilter.value : 'all';
        
        this.filteredDeliveries = this.allDeliveries.filter(delivery => {
            // Location filter
            const matchesLocation = !locationQuery || 
                delivery.location.toLowerCase().includes(locationQuery);
            
            // Date filter
            let matchesDate = true;
            if (dateFilter !== 'all') {
                const deliveryDate = new Date(delivery.date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                switch (dateFilter) {
                    case 'today':
                        const todayEnd = new Date(today);
                        todayEnd.setHours(23, 59, 59, 999);
                        matchesDate = deliveryDate >= today && deliveryDate <= todayEnd;
                        break;
                        
                    case 'tomorrow':
                        const tomorrow = new Date(today);
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        const tomorrowEnd = new Date(tomorrow);
                        tomorrowEnd.setHours(23, 59, 59, 999);
                        matchesDate = deliveryDate >= tomorrow && deliveryDate <= tomorrowEnd;
                        break;
                        
                    case 'week':
                        const weekEnd = new Date(today);
                        weekEnd.setDate(weekEnd.getDate() + 7);
                        matchesDate = deliveryDate >= today && deliveryDate <= weekEnd;
                        break;
                }
            }
            
            return matchesLocation && matchesDate;
        });
        
        this.displayDeliveries();
    }
    
    clearFilters() {
        if (this.locationFilter) this.locationFilter.value = '';
        if (this.dateFilter) this.dateFilter.value = 'all';
        this.filteredDeliveries = [...this.allDeliveries];
        this.displayDeliveries();
    }
    
    displayDeliveries() {
        if (!this.scheduleGrid) return;
        
        if (this.filteredDeliveries.length === 0) {
            this.scheduleGrid.style.display = 'none';
            if (this.noResults) this.noResults.style.display = 'block';
            return;
        }
        
        this.scheduleGrid.style.display = 'grid';
        if (this.noResults) this.noResults.style.display = 'none';
        
        // Sort deliveries by date
        const sortedDeliveries = [...this.filteredDeliveries].sort((a, b) => 
            new Date(a.date) - new Date(b.date)
        );
        
        this.scheduleGrid.innerHTML = sortedDeliveries.map(delivery => 
            this.createDeliveryCard(delivery)
        ).join('');
        
        // Add animation to cards
        this.animateCards();
    }
    
    createDeliveryCard(delivery) {
        const deliveryDate = new Date(delivery.date);
        const now = new Date();
        const isToday = this.isToday(deliveryDate);
        const isTomorrow = this.isTomorrow(deliveryDate);
        const isPast = deliveryDate < now;
        const timeUntil = this.getTimeUntil(deliveryDate);
        
        let dateLabel = '';
        if (isPast) {
            dateLabel = 'Completed';
        } else if (isToday) {
            dateLabel = 'Today';
        } else if (isTomorrow) {
            dateLabel = 'Tomorrow';
        } else {
            dateLabel = formatDate(deliveryDate);
        }
        
        return `
            <div class="schedule-item ${isPast ? 'past-delivery' : ''}" data-delivery-id="${delivery.id}">
                <div class="schedule-header">
                    <div class="schedule-location">${delivery.location}</div>
                    <div class="schedule-date ${isPast ? 'past' : ''}">${dateLabel}</div>
                </div>
                
                <div class="schedule-time">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                        <path d="12 6v6l4 2" stroke="currentColor" stroke-width="2" fill="none"/>
                    </svg>
                    ${formatTime(deliveryDate)}
                    ${!isPast && timeUntil ? `<span class="time-until">(${timeUntil})</span>` : ''}
                </div>
                
                <div class="schedule-details">
                    <div class="delivery-capacity">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="currentColor"/>
                        </svg>
                        Capacity: ${delivery.capacity}
                    </div>
                    
                    <div class="delivery-duration">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                            <path d="12 6v6l4 2" stroke="currentColor" stroke-width="2" fill="none"/>
                        </svg>
                        Duration: ${delivery.estimatedDuration}
                    </div>
                    
                    ${delivery.details ? `<p class="delivery-notes">${delivery.details}</p>` : ''}
                </div>
                
                <div class="schedule-priority priority-${delivery.priority}">
                    ${this.getPriorityIcon(delivery.priority)}
                    ${this.getPriorityText(delivery.priority)} Priority
                </div>
            </div>
        `;
    }
    
    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }
    
    isTomorrow(date) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return date.toDateString() === tomorrow.toDateString();
    }
    
    getTimeUntil(date) {
        const now = new Date();
        const diff = date - now;
        
        if (diff < 0) return null;
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (hours === 0) {
            return `in ${minutes} minutes`;
        } else if (hours < 24) {
            return `in ${hours}h ${minutes}m`;
        } else {
            const days = Math.floor(hours / 24);
            return `in ${days} day${days > 1 ? 's' : ''}`;
        }
    }
    
    getPriorityIcon(priority) {
        const icons = {
            'low': '🟢',
            'medium': '🟡',
            'high': '🟠',
            'urgent': '🔴'
        };
        return icons[priority] || '⚪';
    }
    
    getPriorityText(priority) {
        return priority.charAt(0).toUpperCase() + priority.slice(1);
    }
    
    animateCards() {
        const cards = this.scheduleGrid.querySelectorAll('.schedule-item');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 100);
        });
    }
}

// Global functions for button handlers
function filterSchedule() {
    if (window.scheduleManager) {
        window.scheduleManager.filterSchedule();
    }
}

function clearFilters() {
    if (window.scheduleManager) {
        window.scheduleManager.clearFilters();
    }
}

// Live update functionality
class LiveUpdates {
    constructor(scheduleManager) {
        this.scheduleManager = scheduleManager;
        this.init();
    }
    
    init() {
        // Update every minute to refresh time displays
        setInterval(() => {
            this.updateTimeDisplays();
        }, 60000);
        
        // Simulate new deliveries occasionally
        this.simulateUpdates();
    }
    
    updateTimeDisplays() {
        const cards = document.querySelectorAll('.schedule-item');
        cards.forEach(card => {
            const deliveryId = card.dataset.deliveryId;
            const delivery = this.scheduleManager.allDeliveries.find(d => d.id == deliveryId);
            
            if (delivery) {
                const timeElement = card.querySelector('.time-until');
                if (timeElement) {
                    const timeUntil = this.scheduleManager.getTimeUntil(new Date(delivery.date));
                    if (timeUntil) {
                        timeElement.textContent = `(${timeUntil})`;
                    } else {
                        timeElement.remove();
                    }
                }
            }
        });
    }
    
    simulateUpdates() {
        // Simulate occasional new deliveries (demo purposes)
        const locations = [
            'Pipeline, Nairobi',
            'Dandora, Nairobi',
            'Mukuru, Nairobi',
            'Korogocho, Nairobi'
        ];
        
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every 30 seconds
                const newDelivery = {
                    id: Date.now(),
                    location: locations[Math.floor(Math.random() * locations.length)],
                    date: new Date(Date.now() + Math.random() * 5 * 24 * 60 * 60 * 1000), // Random time in next 5 days
                    capacity: ['2000L', '3000L', '4000L', '5000L'][Math.floor(Math.random() * 4)],
                    priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
                    details: 'Emergency delivery scheduled due to critical shortage',
                    estimatedDuration: ['1 hour', '1.5 hours', '2 hours'][Math.floor(Math.random() * 3)]
                };
                
                this.addNewDelivery(newDelivery);
            }
        }, 30000);
    }
    
    addNewDelivery(delivery) {
        this.scheduleManager.allDeliveries.unshift(delivery);
        Storage.set('deliverySchedule', this.scheduleManager.allDeliveries);
        
        // Update display if it matches current filters
        this.scheduleManager.loadDeliveries();
        this.scheduleManager.filterSchedule();
        
        // Show notification
        this.showNotification(`New delivery scheduled: ${delivery.location}`);
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #0EA5E9;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.scheduleManager = new ScheduleManager();
    
    // Initialize live updates
    new LiveUpdates(window.scheduleManager);
    
    // Add additional styles for past deliveries and animations
    const additionalStyles = `
        <style>
            .past-delivery {
                opacity: 0.7;
                border-color: #D1D5DB;
            }
            
            .past-delivery .schedule-date.past {
                background: #F3F4F6;
                color: #6B7280;
            }
            
            .time-until {
                color: #0EA5E9;
                font-weight: 500;
            }
            
            .delivery-capacity,
            .delivery-duration {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: #6B7280;
                font-size: 0.875rem;
                margin-bottom: 0.5rem;
            }
            
            .delivery-notes {
                color: #6B7280;
                font-size: 0.875rem;
                font-style: italic;
                margin-top: 0.5rem;
            }
            
            .notification {
                font-weight: 500;
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
            }
            
            .schedule-item.fade-in {
                animation: slideIn 0.3s ease-out;
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', additionalStyles);
});