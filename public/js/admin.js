// Ladybug Hosting - Admin JavaScript

let currentAdminUser = null;

// Check admin authentication status
async function checkAdminAuth() {
    try {
        // We'll check on the server side since sessions are used
        const response = await fetch('/api/admin/dashboard');
        if (response.ok) {
            const data = await response.json();
            currentAdminUser = { username: 'Ntando' }; // Hardcoded as per requirements
            showAdminDashboard();
            loadDashboardData();
        } else {
            showAdminLogin();
        }
    } catch (error) {
        showAdminLogin();
    }
}

// Show admin login form
function showAdminLogin() {
    document.getElementById('adminLoginSection').style.display = 'block';
    document.getElementById('adminDashboard').style.display = 'none';
}

// Show admin dashboard
function showAdminDashboard() {
    document.getElementById('adminLoginSection').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
}

// Handle admin login
async function handleAdminLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const loginData = Object.fromEntries(formData);
    
    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentAdminUser = data.admin;
            showAdminDashboard();
            loadDashboardData();
            showSuccess('Admin login successful!');
        } else {
            showError(data.error || 'Login failed');
        }
    } catch (error) {
        console.error('Admin login error:', error);
        showError('Login failed. Please try again.');
    }
}

// Handle admin logout
async function handleAdminLogout() {
    try {
        await fetch('/api/admin/logout', {
            method: 'POST'
        });
        
        currentAdminUser = null;
        showAdminLogin();
        showSuccess('Admin logout successful!');
    } catch (error) {
        console.error('Admin logout error:', error);
    }
}

// Load dashboard data
async function loadDashboardData() {
    try {
        const response = await fetch('/api/admin/dashboard');
        const data = await response.json();
        
        if (response.ok) {
            updateStats(data.stats);
            updateRecentServers(data.recentServers);
            updateRecentUsers(data.recentUsers);
        } else {
            showError('Failed to load dashboard data');
        }
    } catch (error) {
        console.error('Dashboard data error:', error);
        showError('Failed to load dashboard data');
    }
}

// Update statistics
function updateStats(stats) {
    document.getElementById('totalUsers').textContent = stats.totalUsers;
    document.getElementById('totalServers').textContent = stats.totalServers;
    document.getElementById('activeConnections').textContent = stats.activeConnections;
    document.getElementById('freeServers').textContent = stats.freeServers;
    document.getElementById('paidServers').textContent = stats.paidServers;
}

// Update recent servers table
function updateRecentServers(servers) {
    const tbody = document.getElementById('recentServers');
    tbody.innerHTML = servers.map(server => `
        <tr>
            <td>${server.name}</td>
            <td><span class="server-type type-${server.type}">${server.type.toUpperCase()}</span></td>
            <td><span class="server-status status-${server.status}"></span>${server.status}</td>
            <td>${server.owner}</td>
            <td>${new Date(server.createdAt).toLocaleDateString()}</td>
        </tr>
    `).join('');
}

// Update recent users table
function updateRecentUsers(users) {
    const tbody = document.getElementById('recentUsers');
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
            <td>${user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</td>
        </tr>
    `).join('');
}

// Show dashboard view
function showDashboard() {
    hideAllViews();
    document.getElementById('dashboardView').style.display = 'block';
    loadDashboardData();
}

// Show servers view
function showServers() {
    hideAllViews();
    document.getElementById('serversView').style.display = 'block';
    loadServers();
}

// Show users view
function showUsers() {
    hideAllViews();
    document.getElementById('usersView').style.display = 'block';
    loadUsers();
}

// Show connections view
function showConnections() {
    hideAllViews();
    document.getElementById('connectionsView').style.display = 'block';
    loadConnections();
}

// Hide all views
function hideAllViews() {
    document.getElementById('dashboardView').style.display = 'none';
    document.getElementById('serversView').style.display = 'none';
    document.getElementById('usersView').style.display = 'none';
    document.getElementById('connectionsView').style.display = 'none';
}

// Load servers
async function loadServers() {
    try {
        const response = await fetch('/api/admin/servers');
        const data = await response.json();
        
        if (response.ok) {
            updateServersTable(data.servers);
        } else {
            showError('Failed to load servers');
        }
    } catch (error) {
        console.error('Load servers error:', error);
        showError('Failed to load servers');
    }
}

// Update servers table
function updateServersTable(servers) {
    const tbody = document.getElementById('serversTable');
    tbody.innerHTML = servers.map(server => `
        <tr>
            <td>${server.name}</td>
            <td><span class="server-type type-${server.type}">${server.type.toUpperCase()}</span></td>
            <td>${server.category}</td>
            <td><span class="server-status status-${server.status}"></span>${server.status}</td>
            <td>$${server.price}/${server.currency}</td>
            <td>${server.capacity.used}/${server.capacity.total}</td>
            <td>${server.owner}</td>
            <td>
                <button class="btn btn-secondary" onclick="editServer('${server.id}')">Edit</button>
                <button class="btn btn-warning" onclick="toggleServerStatus('${server.id}')">Toggle</button>
                <button class="btn btn-danger" onclick="deleteServer('${server.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Load users
async function loadUsers() {
    try {
        const response = await fetch('/api/admin/users');
        const data = await response.json();
        
        if (response.ok) {
            updateUsersTable(data.users);
        } else {
            showError('Failed to load users');
        }
    } catch (error) {
        console.error('Load users error:', error);
        showError('Failed to load users');
    }
}

// Update users table
function updateUsersTable(users) {
    const tbody = document.getElementById('usersTable');
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${user.isActive ? 'Active' : 'Inactive'}</td>
            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
            <td>${user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</td>
            <td>
                <button class="btn btn-secondary" onclick="viewUser('${user.id}')">View</button>
                <button class="btn btn-warning" onclick="toggleUserStatus('${user.id}')">Toggle</button>
            </td>
        </tr>
    `).join('');
}

// Load connections
async function loadConnections() {
    try {
        const response = await fetch('/api/admin/connections');
        const data = await response.json();
        
        if (response.ok) {
            updateConnectionsTable(data.connections);
        } else {
            showError('Failed to load connections');
        }
    } catch (error) {
        console.error('Load connections error:', error);
        showError('Failed to load connections');
    }
}

// Update connections table
function updateConnectionsTable(connections) {
    const tbody = document.getElementById('connectionsTable');
    tbody.innerHTML = connections.map(conn => `
        <tr>
            <td>${conn.user.username} (${conn.user.email})</td>
            <td>${conn.server.name} - ${conn.server.type}</td>
            <td>${new Date(conn.connectedAt).toLocaleDateString()}</td>
            <td>${new Date(conn.lastAccessed).toLocaleDateString()}</td>
            <td><span class="server-status status-${conn.status === 'active' ? 'online' : 'offline'}"></span>${conn.status}</td>
            <td>
                <button class="btn btn-danger" onclick="disconnectConnection('${conn.id}')">Disconnect</button>
            </td>
        </tr>
    `).join('');
}

// Show create server modal
function showCreateServerModal() {
    document.getElementById('createServerModal').classList.add('active');
}

// Handle create server
async function handleCreateServer(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const serverData = {
        name: formData.get('name'),
        description: formData.get('description'),
        type: formData.get('type'),
        category: formData.get('category'),
        price: parseFloat(formData.get('price')),
        location: formData.get('location'),
        capacity: {
            total: parseInt(formData.get('capacity')),
            used: 0
        },
        connectionDetails: {
            host: formData.get('host'),
            port: parseInt(formData.get('port')),
            username: formData.get('connUsername'),
            password: formData.get('connPassword'),
            protocol: 'ssh'
        },
        ownerUsername: formData.get('ownerUsername'),
        status: 'online',
        isPublic: true,
        tags: []
    };
    
    try {
        const response = await fetch('/api/admin/servers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(serverData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            closeModal('createServerModal');
            showSuccess('Server created successfully!');
            loadServers();
        } else {
            showError(data.error || 'Failed to create server');
        }
    } catch (error) {
        console.error('Create server error:', error);
        showError('Failed to create server');
    }
}

// Toggle server status
async function toggleServerStatus(serverId) {
    try {
        const response = await fetch(`/api/admin/servers/${serverId}/toggle-status`, {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showSuccess(`Server status changed to ${data.status}`);
            loadServers();
        } else {
            showError(data.error || 'Failed to toggle server status');
        }
    } catch (error) {
        console.error('Toggle status error:', error);
        showError('Failed to toggle server status');
    }
}

// Delete server
async function deleteServer(serverId) {
    if (!confirm('Are you sure you want to delete this server? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/admin/servers/${serverId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showSuccess(data.message);
            loadServers();
        } else {
            showError(data.error || 'Failed to delete server');
        }
    } catch (error) {
        console.error('Delete server error:', error);
        showError('Failed to delete server');
    }
}

// Utility functions
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
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
    
    alert.style.position = 'fixed';
    alert.style.top = '20px';
    alert.style.right = '20px';
    alert.style.zIndex = '3000';
    alert.style.maxWidth = '400px';
    
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
});

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