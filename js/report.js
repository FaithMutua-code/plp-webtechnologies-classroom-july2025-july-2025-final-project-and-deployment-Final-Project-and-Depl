// Report form functionality

class ReportForm {
    constructor() {
        this.form = document.getElementById('waterReportForm');
        this.successMessage = document.getElementById('successMessage');
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        // Add event listeners
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.form.addEventListener('reset', () => this.handleReset());
        
        // Add real-time validation
        this.addRealTimeValidation();
        
        // Load saved form data if exists
        this.loadSavedData();
    }
    
    addRealTimeValidation() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';
        
        // Clear previous error
        this.clearError(field);
        
        switch (fieldName) {
            case 'reporterName':
                if (!value) {
                    errorMessage = 'Please enter your name';
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = 'Name must be at least 2 characters long';
                    isValid = false;
                } else if (!/^[a-zA-Z\s.'-]+$/.test(value)) {
                    errorMessage = 'Please enter a valid name';
                    isValid = false;
                }
                break;
                
            case 'location':
                if (!value) {
                    errorMessage = 'Please enter a location';
                    isValid = false;
                } else if (value.length < 3) {
                    errorMessage = 'Location must be at least 3 characters long';
                    isValid = false;
                }
                break;
                
            case 'waterStatus':
                if (!value) {
                    errorMessage = 'Please select a water status';
                    isValid = false;
                }
                break;
                
            case 'priority':
                if (!value) {
                    errorMessage = 'Please select a priority level';
                    isValid = false;
                }
                break;
                
            case 'notes':
                if (value && value.length > 500) {
                    errorMessage = 'Notes must be less than 500 characters';
                    isValid = false;
                }
                break;
                
            case 'contactConsent':
                if (!field.checked) {
                    errorMessage = 'Please provide consent to continue';
                    isValid = false;
                }
                break;
        }
        
        if (!isValid) {
            this.showError(field, errorMessage);
        }
        
        return isValid;
    }
    
    validateForm() {
        const requiredFields = this.form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    showError(field, message) {
        const errorElement = document.getElementById(field.name + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
        
        field.classList.add('error');
    }
    
    clearError(field) {
        const errorElement = document.getElementById(field.name + 'Error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
        
        field.classList.remove('error');
    }
    
    clearAllErrors() {
        const errorElements = this.form.querySelectorAll('.form-error');
        const inputElements = this.form.querySelectorAll('.form-input, .form-select, .form-textarea');
        
        errorElements.forEach(error => {
            error.textContent = '';
            error.classList.remove('show');
        });
        
        inputElements.forEach(input => {
            input.classList.remove('error');
        });
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        // Clear previous errors
        this.clearAllErrors();
        
        // Validate form
        if (!this.validateForm()) {
            this.showFormErrors();
            return;
        }
        
        // Get form data
        const formData = new FormData(this.form);
        const reportData = {
            id: Date.now(), // Simple ID generation
            reporterName: formData.get('reporterName'),
            location: formData.get('location'),
            status: formData.get('waterStatus'),
            priority: formData.get('priority'),
            notes: formData.get('notes') || '',
            timestamp: new Date(),
            reporter: formData.get('reporterName').split(' ')[0] + ' ' + 
                     formData.get('reporterName').split(' ').pop().charAt(0) + '.'
        };
        
        // Save report
        if (this.saveReport(reportData)) {
            this.showSuccess();
            this.clearSavedData();
        } else {
            this.showSubmissionError();
        }
    }
    
    saveReport(reportData) {
        try {
            const existingReports = Storage.get('waterReports') || [];
            existingReports.unshift(reportData); // Add to beginning of array
            
            // Keep only last 100 reports
            if (existingReports.length > 100) {
                existingReports.splice(100);
            }
            
            Storage.set('waterReports', existingReports);
            return true;
        } catch (error) {
            console.error('Error saving report:', error);
            return false;
        }
    }
    
    showSuccess() {
        this.form.style.display = 'none';
        this.successMessage.style.display = 'block';
        
        // Scroll to success message
        this.successMessage.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            this.resetForm();
        }, 10000);
    }
    
    showSubmissionError() {
        // Create and show error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error show';
        errorDiv.style.background = '#FEE2E2';
        errorDiv.style.border = '1px solid #FECACA';
        errorDiv.style.borderRadius = '0.5rem';
        errorDiv.style.padding = '1rem';
        errorDiv.style.marginTop = '1rem';
        errorDiv.innerHTML = `
            <strong>Submission Failed</strong><br>
            There was an error saving your report. Please try again.
        `;
        
        this.form.appendChild(errorDiv);
        
        // Remove error after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
    
    showFormErrors() {
        const firstError = this.form.querySelector('.form-error.show');
        if (firstError) {
            const field = firstError.previousElementSibling;
            if (field) {
                field.focus();
                field.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
        }
    }
    
    handleReset() {
        this.clearAllErrors();
        this.clearSavedData();
    }
    
    resetForm() {
        this.form.style.display = 'block';
        this.successMessage.style.display = 'none';
        this.form.reset();
        this.clearAllErrors();
        this.clearSavedData();
        
        // Scroll to top of form
        this.form.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
    
    // Auto-save form data as user types
    saveFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        Storage.set('reportFormData', data);
    }
    
    loadSavedData() {
        const savedData = Storage.get('reportFormData');
        if (!savedData) return;
        
        // Fill form with saved data
        Object.keys(savedData).forEach(key => {
            const field = this.form.querySelector(`[name="${key}"]`);
            if (field) {
                if (field.type === 'checkbox') {
                    field.checked = savedData[key] === 'on';
                } else {
                    field.value = savedData[key];
                }
            }
        });
    }
    
    clearSavedData() {
        Storage.remove('reportFormData');
    }
}

// Auto-save functionality
function setupAutoSave() {
    const form = document.getElementById('waterReportForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('input', debounce(() => {
            const reportForm = new ReportForm();
            reportForm.saveFormData();
        }, 1000));
    });
}

// Debounce utility function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Reset form function (called from success message button)
function resetForm() {
    const reportForm = new ReportForm();
    reportForm.resetForm();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ReportForm();
    setupAutoSave();
});

// Character counter for notes field
document.addEventListener('DOMContentLoaded', () => {
    const notesField = document.getElementById('notes');
    if (!notesField) return;
    
    // Create character counter
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.style.fontSize = '0.875rem';
    counter.style.color = '#6B7280';
    counter.style.textAlign = 'right';
    counter.style.marginTop = '0.25rem';
    
    notesField.parentNode.appendChild(counter);
    
    // Update counter
    function updateCounter() {
        const length = notesField.value.length;
        const maxLength = 500;
        counter.textContent = `${length}/${maxLength} characters`;
        
        if (length > maxLength * 0.9) {
            counter.style.color = '#EA580C';
        } else if (length > maxLength * 0.8) {
            counter.style.color = '#F59E0B';
        } else {
            counter.style.color = '#6B7280';
        }
    }
    
    notesField.addEventListener('input', updateCounter);
    updateCounter(); // Initial update
});