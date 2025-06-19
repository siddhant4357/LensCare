import { useState, useEffect, useRef } from 'react';
import { getCurrentUser } from '../services/authService';
import io from 'socket.io-client';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0); // Add unread counter
  const messageEndRef = useRef(null);
  const user = getCurrentUser();
  
  // Create socket connection only once when component mounts
  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);
    
    return () => {
      newSocket.disconnect();
    };
  }, []);
  
  // Set up event listeners after socket is created
  useEffect(() => {
    if (!socket) return;
    
    // Identify user
    if (user) {
      socket.emit('userConnected', { 
        userId: user._id, 
        userName: user.name
      });
    }
    
    // Function to handle previous messages
    const handlePreviousMessages = (previousMessages) => {
      const relevantMessages = previousMessages.filter(msg => 
        msg.userId === (user?._id || 'guest') || 
        msg.recipientId === (user?._id || 'guest')
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
      // console.log("Received message:", message); // Remove this line
      
      // Special handling for system notifications
      if (message.notification && user && message.recipient === user._id) {
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
      
      // Original message handling logic for regular chat messages
      if (
        message.userId === (user?._id || 'guest') || 
        message.recipientId === (user?._id || 'guest')
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
      // console.log('Socket connected successfully'); // Remove this line
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
      const messageData = {
        sender: user ? user.name : 'Guest',
        userId: user ? user._id : 'guest',
        content: newMessage,
        timestamp: new Date(),
        isAdmin: user?.role === 'admin'
      };
      
      // Emit message to server
      socket.emit('sendMessage', messageData);
      setNewMessage('');
    }
  };
  
  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 bg-black text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 relative"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        
        {/* Notification Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    );
  }
  
  return (
    <div className="fixed bottom-5 right-5 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col overflow-hidden z-50 border border-gray-200">
      <div className="bg-black text-white p-4 flex justify-between items-center">
        <h3 className="font-medium">LensCare Support</h3>
        <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-12">
            <p>No messages yet.</p>
            <p className="text-sm mt-2">Start a conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-3 ${msg.userId === (user?._id || 'guest') ? 'flex justify-end' : 'flex justify-start'}`}
            >
              <div
                className={`max-w-3/4 rounded-lg p-3 ${
                  msg.userId === (user?._id || 'guest') ? 'bg-black text-white' : 
                  msg.type === 'system' ? 'bg-blue-100 border-l-4 border-blue-500' :
                  msg.type === 'appointment' ? 'bg-green-100 border-l-4 border-green-500' :
                  'bg-gray-100'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs text-right mt-1 opacity-70">
                  {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messageEndRef} />
      </div>
      
      <form onSubmit={sendMessage} className="p-2 border-t border-gray-200">
        <div className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-black"
          />
          <button
            type="submit"
            className="bg-black text-white p-2 rounded-r hover:bg-gray-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;