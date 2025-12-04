// Seed data for Ladybug Hosting Platform
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const Server = require('./src/models/Server');

// Sample data for demonstration
const sampleUsers = [
  {
    username: 'john_doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    username: 'jane_smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    username: 'demo_user',
    email: 'demo@example.com',
    password: 'demo123',
    role: 'user'
  }
];

const sampleServers = [
  {
    name: 'Free Gaming Server 1',
    description: 'Perfect for indie game developers and small gaming communities. Fast SSD storage and low latency.',
    type: 'free',
    category: 'gaming',
    specs: {
      cpu: '2 Cores',
      ram: '4GB DDR4',
      storage: '50GB NVMe SSD',
      bandwidth: 'Unlimited 100Mbps'
    },
    location: 'US East',
    status: 'online',
    price: 0,
    capacity: {
      total: 10,
      used: 3
    },
    connectionDetails: {
      host: 'free-gaming-1.bot-hosting.net',
      port: 22,
      username: 'user',
      password: 'freePass123!',
      protocol: 'ssh'
    },
    tags: ['gaming', 'free', 'ssd', 'low-latency']
  },
  {
    name: 'Premium Gaming Server',
    description: 'High-performance gaming server with dedicated resources. Perfect for AAA games and large communities.',
    type: 'paid',
    category: 'gaming',
    specs: {
      cpu: '8 Cores Ryzen 9',
      ram: '32GB DDR4',
      storage: '500GB NVMe SSD',
      bandwidth: 'Unlimited 1Gbps'
    },
    location: 'US West',
    status: 'online',
    price: 49.99,
    currency: 'USD',
    capacity: {
      total: 5,
      used: 2
    },
    connectionDetails: {
      host: 'premium-gaming.bot-hosting.net',
      port: 22,
      username: 'gamer',
      password: 'premiumPass456!',
      protocol: 'ssh'
    },
    tags: ['gaming', 'premium', 'high-performance', 'ryzen']
  },
  {
    name: 'Free Web Hosting Server',
    description: 'Perfect for personal websites, portfolios, and small business sites. Easy setup with cPanel.',
    type: 'free',
    category: 'web',
    specs: {
      cpu: '1 Core',
      ram: '2GB DDR4',
      storage: '20GB SSD',
      bandwidth: '100GB/month'
    },
    location: 'Europe',
    status: 'online',
    price: 0,
    capacity: {
      total: 50,
      used: 27
    },
    connectionDetails: {
      host: 'free-web.bot-hosting.net',
      port: 2083,
      username: 'webuser',
      password: 'webPass789!',
      protocol: 'https'
    },
    tags: ['web', 'free', 'cpanel', 'ssl']
  },
  {
    name: 'Business Web Server',
    description: 'Professional web hosting with dedicated resources and premium support. Perfect for e-commerce.',
    type: 'paid',
    category: 'web',
    specs: {
      cpu: '4 Cores Xeon',
      ram: '16GB DDR4',
      storage: '200GB NVMe SSD',
      bandwidth: 'Unlimited'
    },
    location: 'US Central',
    status: 'online',
    price: 29.99,
    currency: 'USD',
    capacity: {
      total: 20,
      used: 8
    },
    connectionDetails: {
      host: 'business-web.bot-hosting.net',
      port: 2083,
      username: 'business',
      password: 'bizPass321!',
      'protocol': 'https'
    },
    tags: ['web', 'business', 'ssl', 'backup', 'cdn']
  },
  {
    name: 'Discord Bot Hosting',
    description: 'Optimized for Discord bots and automation. 24/7 uptime with automatic restarts.',
    type: 'free',
    category: 'bot',
    specs: {
      cpu: '2 Cores',
      ram: '3GB DDR4',
      storage: '25GB SSD',
      bandwidth: 'Unlimited'
    },
    location: 'US East',
    status: 'online',
    price: 0,
    capacity: {
      total: 25,
      used: 18
    },
    connectionDetails: {
      host: 'discord-bot.bot-hosting.net',
      port: 22,
      username: 'botuser',
      password: 'botPass111!',
      protocol: 'ssh'
    },
    tags: ['discord', 'bot', '24/7', 'nodejs', 'python']
  },
  {
    name: 'Premium Bot Server',
    description: 'High-performance bot hosting for multiple bots and complex automation tasks.',
    type: 'paid',
    category: 'bot',
    specs: {
      cpu: '6 Cores',
      ram: '12GB DDR4',
      storage: '100GB NVMe',
      bandwidth: 'Unlimited'
    },
    location: 'Europe',
    status: 'online',
    price: 39.99,
    currency: 'USD',
    capacity: {
      total: '15',
      used: 7
    },
    connectionDetails: {
      host: 'premium-bot.bot-hosting.net',
      port: 22,
      username: 'premiumbot',
      password: 'premBot222!',
      protocol: 'ssh'
    },
    tags: ['bot', 'premium', 'multi-bot', 'automation']
  },
  {
    name: 'MySQL Database Server',
    description: 'Optimized MySQL database hosting with daily backups and high availability.',
    type: 'free',
    category: 'database',
    specs: {
      cpu: '1 Core',
      ram: '2GB DDR4',
      storage: '30GB SSD',
      bandwidth: '50GB/month'
    },
    location: 'US Central',
    status: 'online',
    price: 0,
    capacity: {
      total: 30,
      used: 12
    },
    connectionDetails: {
      host: 'mysql-free.bot-hosting.net',
      port: 3306,
      username: 'dbuser',
      password: 'dbPass333!',
      protocol: 'mysql'
    },
    tags: ['mysql', 'database', 'free', 'backup']
  },
  {
    name: 'MongoDB Pro Server',
    description: 'Professional MongoDB hosting with clustering, sharding, and enterprise support.',
    type: 'paid',
    category: 'database',
    specs: {
      cpu: '4 Cores',
      ram: '8GB DDR4',
      storage: '200GB SSD',
      bandwidth: 'Unlimited'
    },
    location: 'Europe',
    status: 'online',
    price: 59.99,
    currency: 'USD',
    capacity: {
      total: 10,
      used: 4
    },
    connectionDetails: {
      host: 'mongodb-pro.bot-hosting.net',
      port: 27017,
      username: 'mongodb',
      password: 'mongoPro444!',
      protocol: 'mongodb'
    },
    tags: ['mongodb', 'nosql', 'clustering', 'professional']
  },
  {
    name: 'File Storage Server',
    description: 'Secure file storage with FTP access and web interface. Perfect for backups and file sharing.',
    type: 'free',
    category: 'storage',
    specs: {
      cpu: '1 Core',
      ram: '1GB DDR4',
      storage: '100GB HDD',
      bandwidth: '200GB/month'
    },
    location: 'Asia',
    status: 'online',
    price: 0,
    capacity: {
      total: 100,
      used: 45
    },
    connectionDetails: {
      host: 'storage-free.bot-hosting.net',
      port: '21',
      username: 'storage',
      password: 'storage555!',
      protocol: 'ftp'
    },
    tags: ['storage', 'ftp', 'files', 'backup', 'free']
  },
  {
    name: 'Cloud Storage Pro',
    description: 'Enterprise-grade storage with S3-compatible API, CDN, and advanced security features.',
    type: 'paid',
    category: 'storage',
    specs: {
      cpu: '2 Cores',
      ram: '4GB DDR4',
      storage: '1TB SSD',
      bandwidth: 'Unlimited'
    },
    location: 'US East',
    status: 'online',
    price: 79.99,
    currency: 'USD',
    capacity: {
      total: 50,
      used: '15'
    },
    connectionDetails: {
      host: 'storage-pro.bot-hosting.net',
      port: 443,
      username: 'cloud',
      password: 'cloudPro666!',
      protocol: 'https'
    },
    tags: ['storage', 'cloud', 's3', 'cdn', 'enterprise']
  },
  {
    name: 'Compute Instance Free',
    description: 'General-purpose computing server for development, testing, and small applications.',
    type: 'free',
    category: 'compute',
    specs: {
      cpu: '1 Core',
      ram: '2GB',
      storage: '25GB SSD',
      bandwidth: '500GB/month'
    },
    location: 'Europe',
    status: 'online',
    price: 0,
    capacity: {
      total: 40,
      used: 22
    },
    connectionDetails: {
      host: 'compute-free.bot-hosting.net',
      port: '22',
      username: 'compute',
      password: 'compute777!',
      protocol: 'ssh'
    },
    tags: ['compute', 'development', 'testing', 'docker', 'free']
  },
  {
    name: 'High Performance Computing',
    description: 'Premium computing power for data processing, machine learning, and intensive applications.',
    type: 'paid',
    category: 'compute',
    specs: {
      cpu: '16 Cores',
      ram: '64GB DDR4',
      storage: '500GB NVMe',
      bandwidth: 'Unlimited'
    },
    location: 'US West',
    status: 'online',
    price: 149.99,
    currency: 'USD',
    capacity: {
      total: 5,
      used: 2
    },
    connectionDetails: {
      host: 'compute-pro.bot-hosting.net',
      port: 22,
      username: 'hcp',
      password: 'hcpPro888!',
      protocol: 'ssh'
    },
    tags: ['compute', 'hpc', 'ml', 'gpu', 'premium']
  }
];

// Seed function
async function seedDatabase() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ladybug-hosting';
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await User.deleteMany({});
    await Server.deleteMany({});
    console.log('Cleared existing data');
    
    // Create users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.username}`);
    }
    
    // Create servers with random owners
    for (const serverData of sampleServers) {
      const randomOwner = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      serverData.owner = randomOwner._id;
      
      const server = new Server(serverData);
      await server.save();
      console.log(`Created server: ${server.name} (Owner: ${randomOwner.username})`);
    }
    
    console.log('\n✅ Database seeded successfully!');
    console.log(`Created ${sampleUsers.length} users`);
    console.log(`Created ${sampleServers.length} servers`);
    console.log('\n🐞 You can now start the application and explore Ladybug Hosting!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
  }
}

// Run seed function
if (require.main === module) {
  seedDatabase();
}

module.exports = { sampleUsers, sampleServers, seedDatabase };