import { useEffect, useRef, useState } from 'react'
import './App.css'
import Header from './components/Header';
import MessageBubble from './components/MessageBubble';
import TypingIndicator from './components/TypingAvtar';
import InputArea from './components/InputArea';
import ChatSidebar from './components/ChatSidebar';
import { queryMessage, sendVoiceQuery } from './services/messageService';
import AudioResponse from './components/AudioResponse';
import { apiEndpoint } from "../src/constants/apiEndpoints";
function App() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [testMessage,setTestMessage]=useState(false)
  const messagesEndRef = useRef(null);
 const [activeId, setActiveId] = useState(null);
  // Auto-scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (text, signal) => {
    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsTyping(true);

    try {
      const messageResponse = await queryMessage(text, signal);

      const assistantMessage = {
        id: messages.length + 2,
        sender: 'namamigangeai',
        text: messageResponse.response,
        audioUrl: messageResponse.audio_url,
        // context: messageResponse.context,
        timestamp: new Date()
      };
    
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prevMessages => [...prevMessages, assistantMessage]);
      }, 1000);
    } catch (error) {
      console.error("Error fetching response:", error);
      setIsTyping(false);
    }
  };

  // const  handleSpeaking = async ()=>{
  //   try{
  //     setIsSpeaking(!isSpeaking);
  //     const audioFile = new File([audioBlob], "voice.webm", { type: "audio/webm" });
  //     setAudioBlog(audioFile);
  //   }
  //   catch(error){
  //     console.log(error);
  //   }
  // }

  // const handleVoiceUpload = async (audioBlob) => {
    
  
  //   try {

  //     setIsSpeaking(!isSpeaking);
  //     const result = await sendVoiceQuery(audioFile);
  //     console.log('Voice Query Result:', result);
  
  //     // Example usage:
  //     // setMessages(prev => [...prev, { sender: 'user', text: result.query }, { sender: 'bot', text: result.response }]);
  //     // Play result.audioUrl if needed
  
  //   } catch (error) {
  //     console.error("Error processing voice query:", error);
  //   }
  // };

  const handleVoiceResult = ({ query, response, audioUrl }) => {
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, sender: 'user', text: query },
      { id: prev.length + 2, sender: 'namamigangeai', text: '', audioUrl },
    ]);
  };
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Sidebar Component - This will be fixed positioned and won't affect the layout flow */}
      {/* <ChatSidebar /> */}

      {/* Main Chat Interface */}
      <Header />

     {
      messages?.length > 0 && (
        <div className="flex-grow overflow-y-auto p-4 pt-6 ">
        <div className="max-w-4xl mx-auto space-y-6">
        {messages.map((message) => {
  const isUser = message.sender === 'user';
  const hasText = message.text && message.text.trim() !== '';

  if (isUser || hasText) {
    return (
      <MessageBubble
        key={message.id}
        message={message}
        isUser={isUser}
      />
    );
  } else {
    return (
    


  <AudioResponse
    key={message.id}
    messageId={message.id}
    audioUrl={`${apiEndpoint.common}${message.audioUrl}`}
    activeId={activeId}
    setActiveId={setActiveId}
  />



    );
  }
})}

          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>
      )
     }

     
     <InputArea onSendMessage={handleSendMessage} isTyping={isTyping} messages={messages} handleVoiceResult={handleVoiceResult}/>
     
    </div>
  );
}

export default App;  