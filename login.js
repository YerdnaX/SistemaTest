// Demo user credentials (in production, this would be handled server-side)
const DEMO_USERS = {
    'demo': 'demo123',
    'admin': 'admin123',
    'user': 'password'
};

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const currentUsername = sessionStorage.getItem('username');
    
    if (isLoggedIn === 'true' && currentUsername) {
        showDashboard(currentUsername);
    }
});

// Form submission handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous errors
        clearErrors();
        
        // Get form values
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        // Validate inputs
        let isValid = true;
        
        if (username.length < 3) {
            showError('usernameError', 'Username must be at least 3 characters');
            isValid = false;
        }
        
        if (password.length < 6) {
            showError('passwordError', 'Password must be at least 6 characters');
            isValid = false;
        }
        
        if (!isValid) {
            return;
        }
        
        // Authenticate user
        if (authenticateUser(username, password)) {
            // Store session
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('username', username);
            sessionStorage.setItem('loginTime', new Date().toISOString());
            
            if (rememberMe) {
                localStorage.setItem('rememberedUser', username);
            }
            
            // Show dashboard
            showDashboard(username);
        } else {
            showError('generalError', 'Invalid username or password');
        }
    });
}

// Authentication function
function authenticateUser(username, password) {
    return DEMO_USERS[username] === password;
}

// Show error message
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// Clear all error messages
function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
    });
}

// Show dashboard after successful login
function showDashboard(username) {
    const loginTime = new Date(sessionStorage.getItem('loginTime'));
    const container = document.querySelector('.container');
    
    container.innerHTML = `
        <div class="dashboard">
            <h1>User Portal Dashboard</h1>
            <p class="welcome-message">Welcome back, <strong>${escapeHtml(username)}</strong>! 🎉</p>
            
            <div class="user-info">
                <h2>Session Information</h2>
                <div class="info-item">
                    <span class="info-label">Username:</span>
                    <span class="info-value">${escapeHtml(username)}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Login Time:</span>
                    <span class="info-value">${loginTime.toLocaleString()}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Session Status:</span>
                    <span class="info-value">Active</span>
                </div>
            </div>
            
            <button onclick="logout()" class="btn-secondary">Logout</button>
        </div>
    `;
}

// Logout function
function logout() {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('loginTime');
    
    location.reload();
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Pre-fill username if remembered
window.addEventListener('load', function() {
    const rememberedUser = localStorage.getItem('rememberedUser');
    const usernameInput = document.getElementById('username');
    
    if (rememberedUser && usernameInput) {
        usernameInput.value = rememberedUser;
        document.getElementById('rememberMe').checked = true;
    }
});
