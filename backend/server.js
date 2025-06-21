const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: ["http://localhost:5173", "https://lens-care.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", "https://lens-care.vercel.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));
app.use(morgan('dev'));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: [
        "'self'", 
        "http://localhost:5173", 
        "ws://localhost:5173",
        "https://lens-care.vercel.app",
        "wss://lens-care.vercel.app",
        "https://lenscare.onrender.com"
      ]
    }
  },
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false
})); // Improve security with HTTP headers

// Rate limiting to prevent abuse
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limit each IP to 100 requests per windowMs
}));

// Static files folder for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/frames', require('./routes/frameRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes')); // Add this line
app.use('/api/user/favorites', require('./routes/favoriteRoutes'));

// Make io instance available to our routes
app.set('io', io);

// Socket.io chat functionality
const messages = [];
const conversations = {};
const connectedUsers = {};
const onlineUsers = [];

io.on('connection', (socket) => {
  // console.log('New client connected'); // Remove this line
  
  // Send previous messages to client
  socket.emit('previousMessages', messages);
  
  // Admin connection
  socket.on('adminConnected', (data) => {
    socket.isAdmin = true;
    socket.adminId = data.adminId;
    socket.adminName = data.adminName;
    
    // Send all conversations to admin
    socket.emit('allConversations', conversations);
  });
  
  // User connection
  socket.on('userConnected', (userData) => {
    if (userData.userId && userData.userId !== 'guest') {
      socket.userId = userData.userId;
      socket.userName = userData.userName;
      connectedUsers[socket.id] = userData.userId;
      
      // Add to online users
      if (!onlineUsers.includes(userData.userId)) {
        onlineUsers.push(userData.userId);
        io.emit('onlineUsers', onlineUsers);
      }
      
      // Initialize conversation for this user if it doesn't exist
      if (!conversations[userData.userId]) {
        conversations[userData.userId] = {
          userName: userData.userName,
          messages: [],
          unread: false
        };
      }
    }
  });
  
  // Listen for new messages from regular users
  socket.on('sendMessage', (messageData) => {
    const userId = messageData.userId;
    
    // Store the message in overall array
    messages.push(messageData);
    
    // Organize messages into conversations
    if (userId && userId !== 'guest') {
      if (!conversations[userId]) {
        conversations[userId] = {
          userName: messageData.sender,
          messages: [],
          unread: true
        };
      }
      
      // Add message to the user's conversation
      conversations[userId].messages.push(messageData);
      conversations[userId].unread = true;
      
      // Notify ALL admins about new message - crucial fix!
      io.emit('allConversations', conversations);
    }
    
    // Broadcast to all clients
    io.emit('newMessage', messageData);
  });
  
  // Listen for messages from admins
  socket.on('adminMessage', (messageData) => {
    const recipientId = messageData.recipientId;
    
    // Add admin message to global messages array
    messages.push(messageData);
    
    // Add to conversation if recipient exists
    if (recipientId && conversations[recipientId]) {
      conversations[recipientId].messages.push(messageData);
      
      // Update all admins about the conversation change
      io.emit('allConversations', conversations);
    }
    
    // Send to all clients (recipient will filter by userId)
    io.emit('newMessage', messageData);
  });
  
  // Add new event handler inside io.on('connection'...)
  socket.on('markConversationRead', (data) => {
    const { userId } = data;
    
    if (conversations[userId]) {
      conversations[userId].unread = false;
      // Notify all admins about the updated conversation
      io.emit('allConversations', conversations);
    }
  });
  
  socket.on('disconnect', () => {
    // console.log('Client disconnected'); // Remove this line
    
    // Remove from online users if it was a user
    if (socket.userId) {
      const index = onlineUsers.indexOf(socket.userId);
      if (index !== -1) {
        onlineUsers.splice(index, 1);
        io.emit('onlineUsers', onlineUsers);
      }
    }
    
    // Remove from connected users
    delete connectedUsers[socket.id];
  });
});

// Base API route for testing
app.get('/api', (req, res) => {
  res.send('API is running...');
});

// Server setup
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});