import {useState, useEffect} from 'react';

const TypewriterText = ({ text = "", typingSpeed = 50 }) => {
    const [displayText, setDisplayText] = useState('');
    
    useEffect(() => {
      let charIndex = 0;
      setDisplayText('');
      
      const typing = setInterval(() => {
        if (charIndex < text.length) {
          setDisplayText(text.substring(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(typing);
        }
      }, typingSpeed);
      
      return () => clearInterval(typing);
    }, [text, typingSpeed]);
    
    return (
      <span 
        className="typing-text inline-block"
        style={{
          borderRight: displayText.length === text.length ? 'none' : '2px solid orange',
          animation: displayText.length === text.length ? 'none' : 'blink-caret 0.75s step-end infinite'
        }}
      >
        {displayText}
      </span>
    );
  };

  export default TypewriterText;