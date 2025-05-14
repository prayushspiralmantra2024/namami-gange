import UserAvatar from "./UserAvtar";
import LogoAvtar from "./LogoAvtar";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { CircleCheckBig, Copy, Pause, Play, UserRound, Volume2, CircleStop } from "lucide-react";
import { useRef, useState } from "react";
import { apiEndpoint } from "../constants/apiEndpoints";
import TypewriterText from "./TypeWriterText";
import Tooltip from "./Tooltip";
const MessageBubble = ({ message, isUser }) =>{
  const [playing, setPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const audioRef = useRef(null);
  
 const handlePlayMessage = async () => {
  const audio = audioRef.current;
  if (!audio) return;

  if (!window.currentPlayingAudio) {
    window.currentPlayingAudio = {
      id: null,
      pauseOthers: async () => {},
    };
  }

  if (playing) {
    audio.pause();
    setPlaying(false);
    window.currentPlayingAudio.id = null;
  } else {
    // If another audio is playing, pause it and wait
    if (window.currentPlayingAudio.id !== message.id) {
      await window.currentPlayingAudio.pauseOthers(); // wait for pause to complete
    }

    // Register this audio as currently playing
    window.currentPlayingAudio.id = message.id;
    window.currentPlayingAudio.pauseOthers = async () => {
      if (audio && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
        setPlaying(false);
        // Wait for browser to register pause
        await new Promise(res => setTimeout(res, 50)); 
      }
    };

    try {
      await audio.play();
      setPlaying(true);

      audio.onended = () => {
        setPlaying(false);
        window.currentPlayingAudio.id = null;
      };
    } catch (err) {
      console.error("Audio playback failed:", err);
      setPlaying(false);
    }
  }
};

  
  const handleCopyMessage = async () => {
    try{
      await navigator.clipboard.writeText(message.text || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    catch(error){
      console.log(error)
    }
  };

  if (isUser) {
    return (
      <div className="flex justify-end items-center gap-2 text-blue-400">
      <div className="chat-bubble bg-[#0474b4] rounded-lg p-4 ">
          <p className="text-white">{message.text} </p>
        </div>
          {/* <UserRound className="w-6 h-6"/> */}
          <DotLottieReact
      src="https://lottie.host/7f050cd5-f645-439f-9b14-f08be674804a/Ni8P2HKklE.lottie"
      loop
      autoplay
      className="w-20"
    />
      </div>
    );
  } else {
    return (
      <div className="flex">
        {/* <DotLottieReact
          src="https://lottie.host/a4861d50-20c6-4d70-adc6-9bdaa5e2da73/0e81F3Dkpl.lottie"
          loop
          autoplay
          style={{ height: "100px", width: "150px" }}
        /> */}
        <div className="w-16 h-16 bot-logo mr-2">
        <img src="https://nmcg.nic.in/logo/GIF.gif" alt="namami-gange-ai-logo" />
        </div>
        <div className="chat-bubble bg-white rounded-lg shadow p-4 max-w-lg">
        <h1 className="text-lg font-semibold px-2 text-[#0474b4]">Namami Gange</h1>
          <p className="text-gray-800 p-2 whitespace-pre-wrap typewriter">{isUser ? (
            message.text
          ) : (
            <TypewriterText text={message.text} typingSpeed={10} />
          )}</p>

          <div className="option-buttons flex items-center mt-2 space-x-2">
          <Tooltip text="Copy">
          <button className="hover:bg-gray-100 cursor-pointer rounded-full p-2" onClick={handleCopyMessage}>
              {copied ? <CircleCheckBig className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </Tooltip>
            

            {message.audioUrl && (
              <>
                <audio ref={audioRef} src={`${apiEndpoint.common}${message.audioUrl}`} preload="auto" />
                <Tooltip text="Read Loud">
                <button className="hover:bg-gray-100 cursor-pointer rounded-full p-2" onClick={handlePlayMessage}>
                  {playing ? <CircleStop className="h-4 w-4" /> : 
                  
                  <Volume2 className="h-4 w-4" />
                 
                  }
                </button>
                </Tooltip>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default MessageBubble;
