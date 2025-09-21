// Global utility functions and shared functionality

// Mobile navigation toggle
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const navToggle = document.querySelector('.nav-toggle');
    
    if (navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
        navToggle.classList.remove('active');
    } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'white';
        navLinks.style.padding = '1rem';
        navLinks.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        navToggle.classList.add('active');
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelector('.nav-links');
    const navToggle = document.querySelector('.nav-toggle');
    
    if (!nav.contains(event.target)) {
        navLinks.style.display = '';
        navToggle.classList.remove('active');
    }
});

// Utility function to format dates
function formatDate(date) {
    return new Intl.DateFormat('en-KE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

// Utility function to format time
function formatTime(date) {
    return new Intl.DateTimeFormat('en-KE', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).format(date);
}

// Utility function to get relative time
function getRelativeTime(date) {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return formatDate(date);
}

// Local storage utilities
const Storage = {
    get: function(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },
    
    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to localStorage:', error);
            return false;
        }
    },
    
    remove: function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    }
};

// Sample data for demonstration
const sampleReports = [
    {
        id: 1,
        location: 'Kibera, Nairobi',
        status: 'shortage',
        priority: 'high',
        reporter: 'Mary K.',
        notes: 'Water shortage for 3 days. Community needs urgent assistance.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
        id: 2,
        location: 'Eastlands, Nairobi',
        status: 'available',
        priority: 'low',
        reporter: 'John M.',
        notes: 'Water is currently available at the community tap.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
    },
    {
        id: 3,
        location: 'Mathare, Nairobi',
        status: 'truck-delivery',
        priority: 'medium',
        reporter: 'Grace W.',
        notes: 'Water truck scheduled for delivery this afternoon.',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
    },
    {
        id: 4,
        location: 'Kawangware, Nairobi',
        status: 'no-water',
        priority: 'urgent',
        reporter: 'Peter S.',
        notes: 'No water access for over a week. Emergency situation.',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000) // 8 hours ago
    },
    {
        id: 5,
        location: 'Huruma, Nairobi',
        status: 'available',
        priority: 'low',
        reporter: 'Anne L.',
        notes: 'Water restored after maintenance work.',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
    }
];

const sampleDeliveries = [
    {
        id: 1,
        location: 'Kibera Market, Nairobi',
        date: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        capacity: '5000L',
        priority: 'high',
        details: 'Emergency delivery due to prolonged shortage',
        estimatedDuration: '2 hours'
    },
    {
        id: 2,
        location: 'Mathare Primary School, Nairobi',
        date: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
        capacity: '3000L',
        priority: 'medium',
        details: 'Scheduled weekly delivery',
        estimatedDuration: '1.5 hours'
    },
    {
        id: 3,
        location: 'Kawangware Community Center, Nairobi',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        capacity: '4000L',
        priority: 'high',
        details: 'Special delivery for community event',
        estimatedDuration: '2.5 hours'
    },
    {
        id: 4,
        location: 'Eastlands Shopping Center, Nairobi',
        date: new Date(Date.now() + 26 * 60 * 60 * 1000), // Tomorrow + 2 hours
        capacity: '6000L',
        priority: 'medium',
        details: 'Regular maintenance delivery',
        estimatedDuration: '3 hours'
    },
    {
        id: 5,
        location: 'Huruma Health Clinic, Nairobi',
        date: new Date(Date.now() + 48 * 60 * 60 * 1000), // Day after tomorrow
        capacity: '2500L',
        priority: 'low',
        details: 'Medical facility priority delivery',
        estimatedDuration: '1 hour'
    }
];

// Initialize data if not exists
function initializeSampleData() {
    if (!Storage.get('waterReports')) {
        Storage.set('waterReports', sampleReports);
    }
    
    if (!Storage.get('deliverySchedule')) {
        Storage.set('deliverySchedule', sampleDeliveries);
    }
}

// Load recent reports for home page
function loadRecentReports() {
    const reportsGrid = document.getElementById('recentReportsGrid');
    if (!reportsGrid) return;
    
    const reports = Storage.get('waterReports') || [];
    const recentReports = reports.slice(0, 3); // Show only 3 most recent
    
    if (recentReports.length === 0) {
        reportsGrid.innerHTML = '<p class="text-center">No reports available.</p>';
        return;
    }
    
    reportsGrid.innerHTML = recentReports.map(report => `
        <div class="report-card fade-in">
            <div class="report-header">
                <div class="report-location">${report.location}</div>
                <div class="report-time">${getRelativeTime(new Date(report.timestamp))}</div>
            </div>
            <div class="report-status status-${report.status}">
                ${getStatusIcon(report.status)}
                ${getStatusText(report.status)}
            </div>
            <div class="report-reporter">Reported by ${report.reporter}</div>
        </div>
    `).join('');
}

// Get status icon
function getStatusIcon(status) {
    const icons = {
        'available': '💧',
        'shortage': '⚠️',
        'truck-delivery': '🚛',
        'no-water': '🚫'
    };
    return icons[status] || '❓';
}

// Get status text
function getStatusText(status) {
    const texts = {
        'available': 'Water Available',
        'shortage': 'Water Shortage',
        'truck-delivery': 'Truck Delivery',
        'no-water': 'No Water Access'
    };
    return texts[status] || 'Unknown Status';
}

// Update statistics on home page
function updateStats() {
    const reports = Storage.get('waterReports') || [];
    const deliveries = Storage.get('deliverySchedule') || [];
    
    // Count unique locations
    const uniqueLocations = new Set(reports.map(r => r.location)).size;
    
    // Update DOM elements if they exist
    const totalReportsEl = document.getElementById('totalReports');
    const totalLocationsEl = document.getElementById('totalLocations');
    const totalDeliveriesEl = document.getElementById('totalDeliveries');
    
    if (totalReportsEl) totalReportsEl.textContent = reports.length;
    if (totalLocationsEl) totalLocationsEl.textContent = uniqueLocations;
    if (totalDeliveriesEl) totalDeliveriesEl.textContent = deliveries.length;
}

// Initialize page based on current page
function initPage() {
    initializeSampleData();
    
    // Check which page we're on and initialize accordingly
    const path = window.location.pathname;
    
    if (path.includes('index.html') || path === '/' || path === '') {
        // Home page
        loadRecentReports();
        updateStats();
    }
    
    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add fade-in animation to elements as they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.stat-card, .report-card, .schedule-item, .info-card').forEach(el => {
        observer.observe(el);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initPage);

// Handle window resize for mobile menu
window.addEventListener('resize', function() {
    const navLinks = document.querySelector('.nav-links');
    const navToggle = document.querySelector('.nav-toggle');
    
    if (window.innerWidth > 768) {
        navLinks.style.display = '';
        navToggle.classList.remove('active');
    }
});