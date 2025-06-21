import { useState, useEffect, useRef } from 'react';
import { getCurrentUser } from '../services/authService';
import io from 'socket.io-client';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const messageEndRef = useRef(null);
  const user = getCurrentUser();
const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
  
  // Create socket connection only once when component mounts
  useEffect(() => {
    const newSocket = io(socketUrl);
    setSocket(newSocket);
    
    return () => {
      newSocket.disconnect();
    };
  }, []);
  
  // Set up event listeners after socket is created
  useEffect(() => {
    if (!socket) return;
    
    // Generate a persistent guest ID if user isn't logged in
    const guestId = user ? null : localStorage.getItem('guestChatId') || `guest_${Date.now()}`;
    if (!user && guestId) {
      localStorage.setItem('guestChatId', guestId);
    }
    
    // Identify user or guest
    socket.emit('userConnected', { 
      userId: user ? user._id : guestId,
      userName: user ? user.name : 'Guest User'
    });
    
    // Function to handle previous messages
    const handlePreviousMessages = (previousMessages) => {
      const currentUserId = user ? user._id : guestId;
      const relevantMessages = previousMessages.filter(msg => 
        msg.userId === currentUserId || 
        msg.recipientId === currentUserId
      );
      setMessages(relevantMessages);
      
      // Count initial unread messages (from admin to user that aren't read)
      if (!isOpen && user) {
        const unreadMessages = relevantMessages.filter(msg => 
          msg.isAdmin && msg.recipientId === user._id
        );
        setUnreadCount(unreadMessages.length);
      }
    };
    
    // Function to handle new messages
    const handleNewMessage = (message) => {
      const currentUserId = user ? user._id : guestId;
      
      // Special handling for system notifications - make this work for guests too
      if (message.notification && ((user && message.recipient === user._id) || 
          (!user && message.recipient === guestId || message.recipient === 'all-guests'))) {
        // This never runs for guests
        // Format the notification as a chat message
        const notificationMessage = {
          content: message.content,
          sender: 'System',
          timestamp: message.timestamp,
          type: message.type || 'system',
          isAdmin: true
        };
        
        setMessages(prev => [...prev, notificationMessage]);
        
        if (!isOpen) {
          setUnreadCount(prev => prev + 1);
        }
        return;
      }
      
      // Update the message filtering
      if (
        message.userId === currentUserId || 
        message.recipientId === currentUserId
      ) {
        setMessages(prev => [...prev, message]);
        
        if (!isOpen && user && message.recipientId === user._id) {
          setUnreadCount(prev => prev + 1);
        }
      }
    };
    
    // Add event listeners
    socket.on('previousMessages', handlePreviousMessages);
    socket.on('newMessage', handleNewMessage);
    
    // Log socket connection status
    socket.on('connect', () => {
      // console.log('Socket connected successfully');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
    
    // Clean up event listeners
    return () => {
      socket.off('previousMessages', handlePreviousMessages);
      socket.off('newMessage', handleNewMessage);
      socket.off('connect');
      socket.off('connect_error');
    };
  }, [socket, user, isOpen]);
  
  // Reset unread count when opening chat
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      const guestId = !user ? localStorage.getItem('guestChatId') : null;
      const messageData = {
        sender: user ? user.name : 'Guest User',
        userId: user ? user._id : guestId,
        content: newMessage,
        timestamp: new Date(),
        isAdmin: user?.role === 'admin',
        isGuest: !user
      };
      
      // Emit message to server
      socket.emit('sendMessage', messageData);
      setNewMessage('');
    }
  };
  
  if (!isOpen) {
    return (
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={() => setIsOpen(true)}
          className="group relative bg-gradient-to-br from-black via-gray-900 to-black text-white p-5 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-2"
        >
          {/* Animated pulse ring */}
          <div className="absolute inset-0 rounded-full bg-white opacity-20 animate-ping"></div>
          
          <svg className="w-7 h-7 group-hover:scale-110 transition-transform duration-300 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          
          {/* Notification Badge with premium styling */}
          {unreadCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full shadow-lg border-2 border-white animate-bounce">
              <span className="font-bold">{unreadCount > 9 ? '9+' : unreadCount}</span>
            </div>
          )}
        </button>
      </div>
    );
  }
  
  return (
    <div className="fixed bottom-6 right-6 w-96 h-[32rem] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-100 backdrop-blur-lg">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-black via-gray-900 to-black text-white p-6 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 right-4 transform rotate-12">
            <svg width="20" height="10" viewBox="0 0 20 10" fill="currentColor" className="text-white">
              <path d="M5 5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0M1 5h3M11 5h3M6.5 5h2"/>
            </svg>
          </div>
        </div>
        
        <div className="flex justify-between items-center relative z-10">
          <div>
            <h3 className="font-black text-xl">LensCare Support</h3>
            <p className="text-gray-300 text-sm font-light">We're here to help</p>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="text-gray-300 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all duration-300 transform hover:scale-110 hover:rotate-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Messages area with premium styling */}
      <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-16 animate-fade-in">
            <div className="text-6xl mb-4 animate-bounce">💬</div>
            <p className="font-medium text-lg">No messages yet.</p>
            <p className="text-sm mt-2 text-gray-400">Start a conversation with us!</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 animate-slide-in ${msg.userId === (user?._id || 'guest') ? 'flex justify-end' : 'flex justify-start'}`}
            >
              <div
                className={`max-w-3/4 rounded-2xl p-4 shadow-lg transform transition-all duration-300 hover:scale-105 ${
                  msg.userId === (user?._id || 'guest') 
                    ? 'bg-gradient-to-br from-black via-gray-900 to-black text-white' 
                    : msg.type === 'system' 
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 text-blue-900'
                      : msg.type === 'appointment' 
                        ? 'bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 text-green-900'
                        : 'bg-white border border-gray-200 shadow-md'
                }`}
              >
                <p className="text-sm leading-relaxed font-medium">{msg.content}</p>
                <p className={`text-xs text-right mt-2 font-light ${
                  msg.userId === (user?._id || 'guest') ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messageEndRef} />
      </div>
      
      {/* Input area with premium styling */}
      <form onSubmit={sendMessage} className="p-6 bg-white border-t border-gray-100">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 placeholder-gray-400 font-medium"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-black via-gray-900 to-black text-white p-4 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;