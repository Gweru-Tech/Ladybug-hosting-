const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Server = require('../models/Server');
const ServerConnection = require('../models/ServerConnection');
const router = express.Router();

// Admin credentials (as requested)
const ADMIN_USERNAME = 'Ntando';
const ADMIN_PASSWORD = 'Ntando';

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    // Set admin session
    req.session.isAdmin = true;
    req.session.adminUsername = ADMIN_USERNAME;

    res.json({
      message: 'Admin login successful',
      admin: {
        username: ADMIN_USERNAME
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Admin login failed' });
  }
});

// Admin middleware
const adminAuth = (req, res, next) => {
  if (!req.session.isAdmin) {
    return res.status(401).json({ error: 'Admin access required' });
  }
  next();
};

// Get dashboard statistics
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalServers = await Server.countDocuments();
    const activeConnections = await ServerConnection.countDocuments({ status: 'active' });
    const freeServers = await Server.countDocuments({ type: 'free' });
    const paidServers = await Server.countDocuments({ type: 'paid' });

    const recentServers = await Server.find()
      .populate('owner', 'username')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalUsers,
        totalServers,
        activeConnections,
        freeServers,
        paidServers
      },
      recentServers: recentServers.map(server => ({
        id: server._id,
        name: server.name,
        type: server.type,
        status: server.status,
        owner: server.owner.username,
        createdAt: server.createdAt
      })),
      recentUsers: recentUsers.map(user => ({
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }))
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get all servers (admin view)
router.get('/servers', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, type, status, search } = req.query;
    let query = {};

    if (type && ['free', 'paid'].includes(type)) {
      query.type = type;
    }

    if (status && ['online', 'offline', 'maintenance'].includes(status)) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const servers = await Server.find(query)
      .populate('owner', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Server.countDocuments(query);

    res.json({
      servers: servers.map(server => ({
        id: server._id,
        name: server.name,
        description: server.description,
        type: server.type,
        category: server.category,
        status: server.status,
        price: server.price,
        capacity: server.capacity,
        owner: server.owner.username,
        isPublic: server.isPublic,
        createdAt: server.createdAt,
        lastUpdated: server.lastUpdated
      })),
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get servers error:', error);
    res.status(500).json({ error: 'Failed to fetch servers' });
  }
});

// Create new server
router.post('/servers', adminAuth, async (req, res) => {
  try {
    const serverData = req.body;

    // Find or create owner user
    let owner = await User.findOne({ username: serverData.ownerUsername });
    if (!owner) {
      owner = new User({
        username: serverData.ownerUsername,
        email: `${serverData.ownerUsername}@example.com`,
        password: 'defaultPassword123',
        role: 'user'
      });
      await owner.save();
    }

    const server = new Server({
      ...serverData,
      owner: owner._id
    });

    await server.save();
    await server.populate('owner', 'username');

    res.status(201).json({
      message: 'Server created successfully',
      server: {
        id: server._id,
        name: server.name,
        type: server.type,
        status: server.status,
        owner: server.owner.username
      }
    });
  } catch (error) {
    console.error('Create server error:', error);
    res.status(500).json({ error: 'Failed to create server' });
  }
});

// Update server
router.put('/servers/:id', adminAuth, async (req, res) => {
  try {
    const server = await Server.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('owner', 'username');

    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    res.json({
      message: 'Server updated successfully',
      server: {
        id: server._id,
        name: server.name,
        type: server.type,
        status: server.status,
        owner: server.owner.username
      }
    });
  } catch (error) {
    console.error('Update server error:', error);
    res.status(500).json({ error: 'Failed to update server' });
  }
});

// Delete server
router.delete('/servers/:id', adminAuth, async (req, res) => {
  try {
    const server = await Server.findByIdAndDelete(req.params.id);
    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    // Remove all connections to this server
    await ServerConnection.deleteMany({ server: req.params.id });

    res.json({ message: 'Server deleted successfully' });
  } catch (error) {
    console.error('Delete server error:', error);
    res.status(500).json({ error: 'Failed to delete server' });
  }
});

// Get server connections
router.get('/connections', adminAuth, async (req, res) => {
  try {
    const connections = await ServerConnection.find()
      .populate('user', 'username email')
      .populate('server', 'name type status')
      .sort({ connectedAt: -1 });

    res.json({
      connections: connections.map(conn => ({
        id: conn._id,
        user: conn.user,
        server: conn.server,
        connectedAt: conn.connectedAt,
        lastAccessed: conn.lastAccessed,
        status: conn.status
      }))
    });
  } catch (error) {
    console.error('Get connections error:', error);
    res.status(500).json({ error: 'Failed to fetch connections' });
  }
});

// Toggle server status
router.post('/servers/:id/toggle-status', adminAuth, async (req, res) => {
  try {
    const server = await Server.findById(req.params.id);
    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    server.status = server.status === 'online' ? 'offline' : 'online';
    await server.save();

    res.json({
      message: `Server status changed to ${server.status}`,
      status: server.status
    });
  } catch (error) {
    console.error('Toggle status error:', error);
    res.status(500).json({ error: 'Failed to toggle server status' });
  }
});

// Admin logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Admin logout successful' });
  });
});

module.exports = router;