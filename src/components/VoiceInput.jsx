import { useState, useRef, useEffect } from 'react';
import { sendVoiceQuery } from '../services/messageService';
import { Mic } from 'lucide-react';
import Tooltip from './Tooltip';

const VoiceInput = ({ onResult, messages }) => {
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [isClientSide, setIsClientSide] = useState(false);
  const [audioSupported, setAudioSupported] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Check if we're in browser environment and audio is supported
  useEffect(() => {
    setIsClientSide(true);
    const checkAudioSupport = async () => {
      try {
        if (typeof window !== 'undefined' && 
            window.navigator && 
            window.navigator.mediaDevices && 
            window.navigator.mediaDevices.getUserMedia) {
          setAudioSupported(true);
        }
      } catch (err) {
        console.warn("Audio recording not supported:", err);
        setAudioSupported(false);
      }
    };
    
    checkAudioSupport();
  }, []);

  const startRecording = async () => {
    if (!isClientSide || !audioSupported) return;
    
    try {
      const stream = await window.navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], 'voice.wav', { type: 'audio/wav' });
        
        try {
          setTranscribing(true);
          const result = await sendVoiceQuery(audioFile);
          onResult(result);
          setTranscribing(false);
        } catch (error) {
          console.error('Voice query failed', error);
          setTranscribing(false);
        }
        
        // Clean up audio tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
      setAudioSupported(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
  };

  // Don't render the button if we're on server or audio isn't supported
  if (!isClientSide || !audioSupported) {
    return null; // Return nothing during SSR or if audio isn't supported
  }

  return (
    <div>
      <button 
        type="button" 
        className={`absolute right-14 ${messages?.length > 0 ? 'top-2' : 'top-1/2 -translate-y-1/2'} text-[#0474b4] p-1 rounded-full transition-all duration-500 ease-in-out ${recording ? 'transform scale-110 bg-[#0474b4] text-white' : 'hover:text-[#075888]'} ${transcribing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={recording ? stopRecording : startRecording}
        disabled={transcribing}
      >
        <Tooltip text="Tap to Speak">
          <Mic />
        </Tooltip>
      </button>
      {
        transcribing && (
          <div className="absolute top-1/2 right-16 transform -translate-x-1/2 -translate-y-1/2 text-sm text-gray-400">Transcribing...</div>
        )
      }
    </div>
  );
};

export default VoiceInput;