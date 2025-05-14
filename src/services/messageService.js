
import axios from "axios";
import { apiEndpoint } from "../constants/apiEndpoints";

export const queryMessage = async (message, signal) =>{
    try{
        const response = await axios.post(`${apiEndpoint.common}/query`,{
            query:message
        },
        {
            signal: signal, // Pass the signal here
            headers: {
              'Content-Type': 'application/json',
            },
        }
        );

        return response?.data;
    }   
    catch(err){
        console.log(err);
    }
}


export const sendVoiceQuery = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch(`${apiEndpoint.common}/voice_query`, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Voice query failed');
      }
  
      const data = await response.json();
  
      return {
        query: data.query,
        response: data.response,
        audioUrl: data.audio_url,
      };
    } catch (err) {
      console.error('Voice query error:', err);
      throw err;
    }
  };
  