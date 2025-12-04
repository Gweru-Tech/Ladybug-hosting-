const express = require('express');
const Server = require('../models/Server');
const ServerConnection = require('../models/ServerConnection');
const router = express.Router();

// Get all servers (public)
router.get('/', async (req, res) => {
  try {
    const { type, category, search } = req.query;
    let query = { isPublic: true };

    if (type && ['free', 'paid'].includes(type)) {
      query.type = type;
    }

    if (category && ['gaming', 'web', 'bot', 'database', 'storage', 'compute'].includes(category)) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const servers = await Server.find(query)
      .populate('owner', 'username')
      .sort({ createdAt: -1 });

    res.json({
      servers: servers.map(server => ({
        id: server._id,
        name: server.name,
        description: server.description,
        type: server.type,
        category: server.category,
        specs: server.specs,
        location: server.location,
        status: server.status,
        price: server.price,
        currency: server.currency,
        availability: server.availabilityPercentage,
        capacity: server.capacity,
        owner: server.owner.username,
        tags: server.tags,
        createdAt: server.createdAt
      }))
    });
  } catch (error) {
    console.error('Get servers error:', error);
    res.status(500).json({ error: 'Failed to fetch servers' });
  }
});

// Get server details and connection info
router.get('/:id', async (req, res) => {
  try {
    const server = await Server.findById(req.params.id)
      .populate('owner', 'username');

    if (!server || !server.isPublic) {
      return res.status(404).json({ error: 'Server not found' });
    }

    // Check if user has access to this server
    let connectionDetails = null;
    let isConnected = false;

    if (req.session.userId) {
      const connection = await ServerConnection.findOne({
        user: req.session.userId,
        server: server._id,
        status: 'active'
      });

      if (connection) {
        isConnected = true;
        // Return connection details without sensitive info
        connectionDetails = {
          host: server.connectionDetails.host,
          port: server.connectionDetails.port,
          protocol: server.connectionDetails.protocol,
          connectedAt: connection.connectedAt
        };
      }
    }

    res.json({
      server: {
        id: server._id,
        name: server.name,
        description: server.description,
        type: server.type,
        category: server.category,
        specs: server.specs,
        location: server.location,
        status: server.status,
        price: server.price,
        currency: server.currency,
        availability: server.availabilityPercentage,
        capacity: server.capacity,
        owner: server.owner.username,
        tags: server.tags,
        createdAt: server.createdAt,
        isConnected,
        connectionDetails
      }
    });
  } catch (error) {
    console.error('Get server error:', error);
    res.status(500).json({ error: 'Failed to fetch server details' });
  }
});

// Connect to a server
router.post('/:id/connect', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const server = await Server.findById(req.params.id);
    if (!server || !server.isPublic) {
      return res.status(404).json({ error: 'Server not found' });
    }

    // Check capacity
    if (server.capacity.used >= server.capacity.total) {
      return res.status(400).json({ error: 'Server is at full capacity' });
    }

    // Check if already connected
    const existingConnection = await ServerConnection.findOne({
      user: req.session.userId,
      server: server._id
    });

    if (existingConnection) {
      return res.status(400).json({ error: 'Already connected to this server' });
    }

    // Create connection
    const connection = new ServerConnection({
      user: req.session.userId,
      server: server._id,
      sessionData: {
        authToken: generateConnectionToken(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
    });

    await connection.save();

    // Update server capacity
    server.capacity.used += 1;
    await server.save();

    res.json({
      message: 'Connected to server successfully',
      connectionDetails: {
        host: server.connectionDetails.host,
        port: server.connectionDetails.port,
        username: server.connectionDetails.username,
        password: server.connectionDetails.password,
        protocol: server.connectionDetails.protocol,
        authToken: connection.sessionData.authToken
      }
    });
  } catch (error) {
    console.error('Connect server error:', error);
    res.status(500).json({ error: 'Failed to connect to server' });
  }
});

// Disconnect from a server
router.post('/:id/disconnect', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const connection = await ServerConnection.findOne({
      user: req.session.userId,
      server: req.params.id
    });

    if (!connection) {
      return res.status(404).json({ error: 'Connection not found' });
    }

    await ServerConnection.findByIdAndDelete(connection._id);

    // Update server capacity
    const server = await Server.findById(req.params.id);
    if (server && server.capacity.used > 0) {
      server.capacity.used -= 1;
      await server.save();
    }

    res.json({ message: 'Disconnected from server successfully' });
  } catch (error) {
    console.error('Disconnect server error:', error);
    res.status(500).json({ error: 'Failed to disconnect from server' });
  }
});

// Get user's connected servers
router.get('/my/connections', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const connections = await ServerConnection.find({
      user: req.session.userId,
      status: 'active'
    }).populate('server');

    res.json({
      connections: connections.map(conn => ({
        id: conn._id,
        connectedAt: conn.connectedAt,
        lastAccessed: conn.lastAccessed,
        server: {
          id: conn.server._id,
          name: conn.server.name,
          type: conn.server.type,
          status: conn.server.status,
          connectionDetails: {
            host: conn.server.connectionDetails.host,
            port: conn.server.connectionDetails.port,
            protocol: conn.server.connectionDetails.protocol
          }
        }
      }))
    });
  } catch (error) {
    console.error('Get connections error:', error);
    res.status(500).json({ error: 'Failed to fetch connections' });
  }
});

// Helper function to generate connection token
function generateConnectionToken() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

module.exports = router;