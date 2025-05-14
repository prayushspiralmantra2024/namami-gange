import { useState } from "react";

const Tooltip = ({ text, children }) => {
    const [isVisible, setIsVisible] = useState(false);
  
    return (
      <div className="relative flex">
        <div 
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
          className="inline-block"
        >
          {children}
        </div>
        
        {isVisible && (
          <div className="absolute z-10 px-3 py-2 text-sm text-white bg-gray-800 rounded-md shadow-lg -mt-1 transform -translate-x-1/2 left-1/2 top-full">
            {text}
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 bg-gray-800"></div>
          </div>
        )}
      </div>
    );
  };

  
  export default Tooltip;