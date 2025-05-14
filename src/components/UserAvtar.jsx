const UserAvatar = () => {
    return (
      <div className="flex-shrink-0 ml-3">
        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    );
  };

  export default UserAvatar;