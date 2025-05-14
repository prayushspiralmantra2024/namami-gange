import { SendHorizontal, Mic } from "lucide-react";
import { useState, useRef } from "react";
import VoiceInput from "./VoiceInput";
import Tooltip from "./Tooltip";

const InputArea = ({ onSendMessage, isTyping, messages,handleVoiceResult }) => {
  const [message, setMessage] = useState('');
  const controllerRef = useRef(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() === '') return;
    // Abort previous request if still ongoing
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    // Create new AbortController
    const controller = new AbortController();
    controllerRef.current = controller;

    onSendMessage(message, controller.signal); // Pass signal to request
    setMessage('');
  };


  const handleStop = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
  };
  return (
    <div
    className={`transition-all duration-500 ease-in-out 
    ${messages.length === 0 
      ? 'flex flex-col items-center justify-center flex-grow' 
      : 'w-full p-4 bg-white shadow mt-auto'}`
    }>
    {
      messages?.length === 0 && (
        <div className='flex justify-center items-center flex-col'>
        <img alt="namami-gange-logo" src="https://nmcg.nic.in/logo/GIF.gif" className="w-20 h-20"/>
        <h1 className="text-2xl font-semibold mb-2 text-[#0474b4]">Chat with Namami Gange AI Assistant.</h1>
        <p className="mb-2">'Namami Gange Programme', is an Integrated Conservation Mission</p>
      </div>
      )
    }
    <div className={`${messages.length === 0 ? 'w-full max-w-3xl' : 'max-w-4xl mx-auto'}`}>
     
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`w-full rounded-lg   ${messages?.length > 0  ? 'pl-4 pr-16 py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#0474b4] focus:border-transparent': 'border border-[#0474b4] rounded-lg  focus:outline-none focus:ring-1 focus:ring-[#0474b4] focus:border-transparent px-2 py-4 h-20' }`}
            placeholder="How can I help you today?"
          />
          {
            isTyping ? (
                   
              <button
                type="button"
                onClick={handleStop}
                className={`absolute right-3 ${messages?.length > 0 ? 'top-2' : 'top-1/2 translate -translate-y-1/2' } bg-red-600 text-white  px-2 py-1 cursor-pointer hover:bg-red-400 rounded-full`}
              >
                ⏹
              </button>
                     
            )
              : (
                <button
                  type="submit"
                  className={`absolute right-3 ${messages?.length > 0 ? 'top-2' : 'top-1/2 translate -translate-y-1/2' } text-[#0474b4] hover:text-[#075888] p-1 hover:bg-[#8bd4ff] rounded-full ${isTyping || message.trim() === '' ? 'cursor-not-allowed opacity-10' : 'cursor-pointer'}`}
                >
                  <SendHorizontal />
                </button>
              )
          }

          {/* <button type="button" className={`absolute right-14  ${messages?.length > 0 ? 'top-2' : 'top-1/2 translate -translate-y-1/2' } text-[#0474b4]  p-1  rounded-full cursor-pointer transition-all duration-500 ease-in-out ${isSpeaking ? 'transform scale-110 bg-[#0474b4] text-white' : 'hover:text-[#075888]'}`}
          onClick={onSendSpeaking}
          ><Mic /></button> */}
  
          <VoiceInput onResult={handleVoiceResult} />
 
        </form>
        <div className="text-xs text-gray-500 mt-2 flex justify-end">
          <span>Namami Gange 1.0</span>
        </div>
      </div>
    </div>
  );
};

export default InputArea;