import { useState, useEffect } from 'react';
import { MessageSquare, ChevronRight, ChevronLeft, X, Plus, Search } from 'lucide-react';

// Sample data for chat history
const initialChats = [
  { id: 1, title: "Website Redesign Ideas", date: "May 1", preview: "Here are some ideas for your website redesign..." },
  { id: 2, title: "Marketing Strategy", date: "Apr 29", preview: "The marketing strategy should focus on..." },
  { id: 3, title: "Code Review", date: "Apr 28", preview: "I've reviewed your code and here are my suggestions..." },
  { id: 4, title: "Product Launch Plan", date: "Apr 27", preview: "For the product launch, we should consider..." },
  { id: 5, title: "Budget Analysis", date: "Apr 26", preview: "After analyzing your budget, I recommend..." },
  { id: 6, title: "SEO Optimization", date: "Apr 25", preview: "To improve your SEO ranking, you should..." },
  { id: 7, title: "Content Calendar", date: "Apr 24", preview: "Here's a content calendar for the next quarter..." },
  { id: 8, title: "Performance Review", date: "Apr 23", preview: "Based on the performance metrics..." },
];

export default function ChatSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState(initialChats);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChat, setSelectedChat] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  // Check if the screen is mobile size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Filter chats based on search term
  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.preview.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Create new chat
  const handleNewChat = () => {
    const newChat = {
      id: chats.length + 1,
      title: "New Conversation",
      date: "Now",
      preview: "Start a new conversation..."
    };
    setChats([newChat, ...chats]);
    setSelectedChat(newChat.id);
  };

  return (
    <>
      {/* Mobile Toggle Button (when sidebar is closed) */}
      {!isOpen && (
        <>

        <button 
          onClick={() => setIsOpen(true)}
          className="fixed z-20 top-4 left-4 p-2 rounded-full cursor-pointer bg-white shadow-md text-gray-700 hover:bg-gray-50"
        >
          <ChevronRight size={24} />
        </button>
        </>
      )}
      
      {/* Sidebar */}
      <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                      fixed z-30 top-0 left-0 w-72 h-screen bg-white shadow-lg
                      transition-transform duration-300 ease-in-out flex flex-col`}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Chat History</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-2 rounded-full hover:bg-gray-100 cursor-pointer text-gray-600"
            >
              {isMobile ? <X size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* New Chat Button */}
        <div className="p-4">
          <button 
            onClick={handleNewChat}
            className="w-full flex items-center justify-center space-x-2 cursor-pointer bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus size={20} />
            <span>New Chat</span>
          </button>
        </div>
        
        {/* Chat List */}
        <div className="flex-1 overflow-y-auto pb-4">
          {filteredChats.length > 0 ? (
            filteredChats.map(chat => (
              <div 
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`px-4 py-3 border-l-4 cursor-pointer ${
                  selectedChat === chat.id 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-transparent hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <MessageSquare size={16} className={`mr-2 ${selectedChat === chat.id ? 'text-purple-500' : 'text-gray-500'}`} />
                    <h3 className={`font-medium ${selectedChat === chat.id ? 'text-purple-700' : 'text-gray-800'}`}>
                      {chat.title}
                    </h3>
                  </div>
                  <span className="text-xs text-gray-500">{chat.date}</span>
                </div>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">{chat.preview}</p>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
              <p>No conversations found</p>
            </div>
          )}
        </div>
        
        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold">
              U
            </div>
            <div>
              <p className="font-medium text-gray-800">User Name</p>
              <p className="text-xs text-gray-500">Premium Account</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay when sidebar is open on mobile */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}