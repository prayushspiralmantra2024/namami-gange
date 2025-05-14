import LogoAvtar from "./LogoAvtar";
const TypingIndicator = () => {
    return (
      <div className="flex">
        <div className="w-10 h-10 bot-logo">
        <img src="https://nmcg.nic.in/logo/GIF.gif" alt="namami-gange-ai-logo" />
        </div>
        <div className="chat-bubble bg-white rounded-lg shadow p-4">
          <div className="flex space-x-1">
            <div className="h-2 w-2 rounded-full bg-gray-400 animate-typing"></div>
            <div className="h-2 w-2 rounded-full bg-gray-400 animate-typing-delay-1"></div>
            <div className="h-2 w-2 rounded-full bg-gray-400 animate-typing-delay-2"></div>
          </div>
        </div>
      </div>
    );
  };

  export default TypingIndicator;