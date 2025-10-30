// Demo user credentials for testing purposes only
// WARNING: In production, authentication MUST be handled server-side
// This client-side implementation is for demonstration only and provides no real security
const DEMO_USERS = {
    'demo': 'demo123',
    'admin': 'admin123',
    'user': 'password'
};

// Initialize login form event handlers
function initializeLoginForm() {
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
    
    // Pre-fill username if remembered
    const rememberedUser = localStorage.getItem('rememberedUser');
    const usernameInput = document.getElementById('username');
    
    if (rememberedUser && usernameInput) {
        usernameInput.value = rememberedUser;
        document.getElementById('rememberMe').checked = true;
    }
}

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const currentUsername = sessionStorage.getItem('username');
    
    if (isLoggedIn === 'true' && currentUsername) {
        showDashboard(currentUsername);
    } else {
        initializeLoginForm();
    }
});

// Authentication function (client-side demo only - NOT secure for production)
// In production, this would be an API call to a secure backend server
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
    
    // Restore login form instead of reloading page for better UX
    const container = document.querySelector('.container');
    container.innerHTML = `
        <div class="login-box">
            <h1>Welcome to User Portal</h1>
            <p class="subtitle">Please login to continue</p>
            
            <form id="loginForm">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" required autocomplete="username">
                    <span class="error-message" id="usernameError"></span>
                </div>
                
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required autocomplete="current-password">
                    <span class="error-message" id="passwordError"></span>
                </div>
                
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="rememberMe" name="rememberMe">
                        Remember me
                    </label>
                </div>
                
                <button type="submit" class="btn-primary">Login</button>
                
                <div class="error-message" id="generalError"></div>
            </form>
            
            <div class="info-box">
                <p><strong>Demo Credentials:</strong></p>
                <p>Username: <code>demo</code></p>
                <p>Password: <code>demo123</code></p>
            </div>
        </div>
    `;
    
    // Reattach form event listener
    initializeLoginForm();
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
