import { useState, useRef } from 'react';
import { sendVoiceQuery } from '../services/messageService';
import {Mic} from 'lucide-react';
import Tooltip from './Tooltip';

const VoiceInput = ({ onResult, messages }) => {
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      audioChunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      // const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      // const audioFile = new File([audioBlob], 'voice.webm', { type: 'audio/webm' });
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      const audioFile = new File([audioBlob], 'voice.wav', { type: 'audio/wav' });
      try {
        setTranscribing(true);
        const result = await sendVoiceQuery(audioFile);
        onResult(result); // handle result in parent
        setTranscribing(false);
      } catch (error) {
        console.error('Voice query failed', error);
        setTranscribing(false);
      }
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div>
      {/* <button
        onClick={recording ? stopRecording : startRecording}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {recording ? 'Stop Recording' : 'Start Voice Query'}
      </button> */}

      <button type="button" className={`absolute right-14  ${messages?.length > 0 ? 'top-2' : 'top-1/2 translate -translate-y-1/2' } text-[#0474b4]  p-1  rounded-full transition-all duration-500 ease-in-out ${recording ? 'transform scale-110 bg-[#0474b4] text-white' : 'hover:text-[#075888]'} ${transcribing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
               onClick={recording ? stopRecording : startRecording}
                >
      <Tooltip text="Tap to Speak" >
                
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
