# Ladybug Hosting Platform

A modern web hosting platform that provides seamless access to free and paid servers. Built with Node.js, Express, and MongoDB, this platform allows users to connect to servers without requiring authentication credentials for each connection.

## Features

### 🌟 Key Features
- **Instant Server Access**: Connect to servers with one click, no complex setup required
- **Free & Paid Servers**: Browse and connect to both free and premium server options
- **Shared Authentication**: Login once and access all servers without re-entering credentials
- **Admin Panel**: Complete server and user management with admin access
- **Real-time Terminal**: Built-in terminal interface for server management
- **Modern UI**: Responsive, user-friendly interface with smooth animations

### 🛠️ Technical Features
- **Authentication System**: Secure user registration and login
- **Server Management**: Add, edit, delete, and monitor servers
- **Connection Tracking**: Monitor active server connections
- **Role-based Access**: User and admin role separation
- **API Endpoints**: RESTful API for all platform functions
- **Session Management**: Secure session handling for persistent logins

## Quick Start

### Prerequisites
- Node.js 16+ 
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ladybug-hosting
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the application**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

5. **Access the application**
   - Main site: `http://localhost:3000`
   - Admin Panel: `http://localhost:3000/admin`

## Admin Panel

### Default Admin Credentials
- **Username**: `Ntando`
- **Password**: `Ntando`

### Admin Features
- Dashboard with statistics
- Server management (CRUD operations)
- User management and monitoring
- Connection tracking and management
- Real-time server status monitoring

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### Servers
- `GET /api/servers` - Get all servers (with filtering)
- `GET /api/servers/:id` - Get server details
- `POST /api/servers/:id/connect` - Connect to server
- `POST /api/servers/:id/disconnect` - Disconnect from server
- `GET /api/servers/my/connections` - Get user's connections

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/servers` - Get all servers (admin view)
- `POST /api/admin/servers` - Create new server
- `PUT /api/admin/servers/:id` - Update server
- `DELETE /api/admin/servers/:id` - Delete server
- `GET /api/admin/users` - Get all users
- `GET /api/admin/connections` - Get all connections

## Deployment on Render.com

### Step-by-Step Deployment

1. **Prepare Repository**
   - Push code to GitHub repository
   - Ensure `render.yaml` is properly configured

2. **Set Up Environment Variables**
   ```
   NODE_ENV=production
   PORT=10000
   SESSION_SECRET=your-secret
   JWT_SECRET=your-jwt-secret
   MONGODB_URI=your-mongodb-connection-string
   ```

3. **MongoDB Setup**
   - Option 1: Use Render MongoDB (add as service)
   - Option 2: Use external MongoDB (MongoDB Atlas recommended)

4. **Deploy to Render**
   ```bash
   # Using Render CLI
   render deploy
   
   # Or connect GitHub repo in Render dashboard
   ```

5. **Post-Deployment**
   - Configure domain (if using custom domain)
   - Set up SSL (automatically handled by Render)
   - Test all functionality

### Render Configuration

The `render.yaml` file includes:
- Web service configuration
- Environment variables
- Health checks
- Build settings

## Bot-Hosting.net Integration

This platform is designed to work seamlessly with Bot-Hosting.net infrastructure:

### Connection Methods
- **SSH**: Standard SSH connections with auto-generated credentials
- **HTTP/HTTPS**: Web-based server management
- **FTP**: File transfer capabilities

### Server Types
- **Gaming**: Game server hosting
- **Web**: Web application hosting
- **Bot**: Discord bot and automation servers
- **Database**: Database server instances
- **Storage**: File storage servers
- **Compute**: General computing servers

## Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Session Management**: Secure session handling with HTTP-only cookies
- **Rate Limiting**: Protection against API abuse
- **CORS Protection**: Proper cross-origin resource sharing setup
- **Input Validation**: Server-side input validation and sanitization

## File Structure

```
ladybug-hosting/
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── main.js
│   │   └── admin.js
│   ├── index.html
│   ├── admin.html
│   └── server.html
├── src/
│   ├── models/
│   │   ├── User.js
│   │   ├── Server.js
│   │   └── ServerConnection.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── servers.js
│   │   └── admin.js
│   └── server.js
├── config/
├── package.json
├── render.yaml
├── .env.example
└── README.md
```

## Development

### Adding New Features

1. **Backend**: Add routes in `/src/routes/`
2. **Models**: Define schemas in `/src/models/`
3. **Frontend**: Update pages in `/public/`
4. **Styles**: Add CSS in `/public/css/style.css`

### Database Schema

#### User Model
- username, email, password (hashed)
- role (user/admin), isActive
- timestamps, lastLogin

#### Server Model
- name, description, type (free/paid)
- specs, location, status
- connection details, capacity
- owner, tags, timestamps

#### ServerConnection Model
- user, server references
- connectedAt, lastAccessed
- status, sessionData

## Support

### Common Issues

1. **MongoDB Connection Issues**
   - Check connection string in .env
   - Ensure MongoDB is running
   - Verify network access

2. **Port Conflicts**
   - Change PORT in .env or render.yaml
   - Check for other services using the port

3. **Authentication Problems**
   - Clear browser cookies
   - Check JWT_SECRET configuration
   - Verify session settings

### Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes with descriptive messages
4. Push to fork
5. Create pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

---

**Ladybug Hosting** - Powered by Bot-Hosting.net Infrastructure