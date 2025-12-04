// Ladybug Hosting - Main JavaScript

let currentUser = null;
let servers = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadServers();
    checkAuthStatus();
});

// Check if user is authenticated
async function checkAuthStatus() {
    try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            updateAuthUI();
        }
    } catch (error) {
        console.log('Not authenticated');
    }
}

// Update authentication UI
function updateAuthUI() {
    const authButtons = document.querySelector('.auth-buttons');
    
    if (currentUser) {
        authButtons.innerHTML = `
            <span style="margin-right: 1rem;">Welcome, ${currentUser.username}!</span>
            <button class="btn btn-secondary" onclick="viewMyServers()">My Servers</button>
            <button class="btn btn-secondary" onclick="handleLogout()">Logout</button>
            <button class="btn btn-secondary" onclick="window.location.href='/admin'">Admin</button>
        `;
    } else {
        authButtons.innerHTML = `
            <button class="btn btn-secondary" onclick="showLoginModal()">Login</button>
            <button class="btn btn-primary" onclick="showRegisterModal()">Register</button>
            <button class="btn btn-secondary" onclick="window.location.href='/admin'">Admin</button>
        `;
    }
}

// Load servers from API
async function loadServers() {
    try {
        const response = await fetch('/api/servers');
        const data = await response.json();
        servers = data.servers;
        displayServers(servers);
    } catch (error) {
        console.error('Error loading servers:', error);
        showError('Failed to load servers. Please try again later.');
    }
}

// Display servers
function displayServers(serversToDisplay) {
    const serversList = document.getElementById('serversList');
    
    if (serversToDisplay.length === 0) {
        serversList.innerHTML = '<p style="text-align: center; color: #666;">No servers found matching your criteria.</p>';
        return;
    }
    
    serversList.innerHTML = serversToDisplay.map(server => `
        <div class="server-card">
            <div class="server-header">
                <h3 class="server-name">${server.name}</h3>
                <span class="server-type type-${server.type}">${server.type.toUpperCase()}</span>
            </div>
            <div class="server-status">
                <span class="server-status status-${server.status}"></span>
                ${server.status.charAt(0).toUpperCase() + server.status.slice(1)}
            </div>
            <p style="margin: 1rem 0; color: #666;">${server.description}</p>
            <div class="server-specs">
                <div class="spec-item">
                    <span>Location:</span>
                    <span>${server.location}</span>
                </div>
                ${server.specs.cpu ? `
                <div class="spec-item">
                    <span>CPU:</span>
                    <span>${server.specs.cpu}</span>
                </div>
                ` : ''}
                ${server.specs.ram ? `
                <div class="spec-item">
                    <span>RAM:</span>
                    <span>${server.specs.ram}</span>
                </div>
                ` : ''}
                ${server.specs.storage ? `
                <div class="spec-item">
                    <span>Storage:</span>
                    <span>${server.specs.storage}</span>
                </div>
                ` : ''}
                <div class="spec-item">
                    <span>Availability:</span>
                    <span>${server.availability}%</span>
                </div>
                ${server.price > 0 ? `
                <div class="spec-item">
                    <span>Price:</span>
                    <span>$${server.price}/${server.currency}</span>
                </div>
                ` : ''}
            </div>
            <div class="server-tags">
                ${server.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')}
            </div>
            <div class="server-actions">
                ${server.isConnected ? `
                    <button class="btn btn-success" onclick="viewServerDetails('${server.id}')">View Details</button>
                    <button class="btn btn-danger" onclick="disconnectServer('${server.id}')">Disconnect</button>
                ` : `
                    <button class="btn btn-primary" onclick="connectToServer('${server.id}')">Connect Now</button>
                    <button class="btn btn-secondary" onclick="viewServerDetails('${server.id}')">View Details</button>
                `}
            </div>
        </div>
    `).join('');
}

// Filter servers
function filterServers() {
    const typeFilter = document.getElementById('typeFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    
    let filteredServers = servers.filter(server => {
        const matchesType = !typeFilter || server.type === typeFilter;
        const matchesCategory = !categoryFilter || server.category === categoryFilter;
        const matchesSearch = !searchInput || 
            server.name.toLowerCase().includes(searchInput) ||
            server.description.toLowerCase().includes(searchInput) ||
            server.tags.some(tag => tag.toLowerCase().includes(searchInput));
        
        return matchesType && matchesCategory && matchesSearch;
    });
    
    displayServers(filteredServers);
}

// Connect to server
async function connectToServer(serverId) {
    if (!currentUser) {
        showLoginModal();
        return;
    }
    
    try {
        const response = await fetch(`/api/servers/${serverId}/connect`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showSuccess('Connected to server successfully!');
            // Store connection details and redirect
            localStorage.setItem('currentConnection', JSON.stringify(data.connectionDetails));
            window.location.href = `/server/${serverId}`;
        } else {
            showError(data.error || 'Failed to connect to server');
        }
    } catch (error) {
        console.error('Connection error:', error);
        showError('Failed to connect to server. Please try again.');
    }
}

// Disconnect from server
async function disconnectServer(serverId) {
    if (!confirm('Are you sure you want to disconnect from this server?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/servers/${serverId}/disconnect`, {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showSuccess(data.message);
            loadServers(); // Refresh server list
        } else {
            showError(data.error || 'Failed to disconnect');
        }
    } catch (error) {
        console.error('Disconnect error:', error);
        showError('Failed to disconnect from server');
    }
}

// View server details
function viewServerDetails(serverId) {
    window.location.href = `/server/${serverId}`;
}

// View my servers
function viewMyServers() {
    window.location.href = '/my-servers';
}

// Handle login
async function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const loginData = Object.fromEntries(formData);
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentUser = data.user;
            updateAuthUI();
            closeModal('loginModal');
            showSuccess('Login successful!');
        } else {
            showError(data.error || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('Login failed. Please try again.');
    }
}

// Handle registration
async function handleRegister(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const registerData = Object.fromEntries(formData);
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentUser = data.user;
            updateAuthUI();
            closeModal('registerModal');
            showSuccess('Registration successful!');
        } else {
            showError(data.error || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showError('Registration failed. Please try again.');
    }
}

// Handle logout
async function handleLogout() {
    try {
        await fetch('/api/auth/logout', {
            method: 'POST'
        });
        
        currentUser = null;
        updateAuthUI();
        showSuccess('Logged out successfully!');
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Modal functions
function showLoginModal() {
    document.getElementById('loginModal').classList.add('active');
}

function showRegisterModal() {
    document.getElementById('registerModal').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function switchToLogin() {
    closeModal('registerModal');
    showLoginModal();
}

function switchToRegister() {
    closeModal('loginModal');
    showRegisterModal();
}

// Utility functions
function scrollToServers() {
    document.getElementById('servers').scrollIntoView({ behavior: 'smooth' });
}

function showSuccess(message) {
    showAlert(message, 'success');
}

function showError(message) {
    showAlert(message, 'error');
}

function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    document.body.appendChild(alert);
    
    // Position the alert at the top
    alert.style.position = 'fixed';
    alert.style.top = '20px';
    alert.style.right = '20px';
    alert.style.zIndex = '3000';
    alert.style.maxWidth = '400px';
    
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Close modals when clicking outside
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
});

// Add keyboard support for modals
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});