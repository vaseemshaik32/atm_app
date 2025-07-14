import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { userlogout } from "../APIs/api.jsx";

export default function Navbar() {
  const navigator = useNavigate();

  const chats = useSelector((state) => state.chts);
  const requests = useSelector((state) => state.req);

  const [prevChatCount, setPrevChatCount] = useState(0);
  const [prevRequestCount, setPrevRequestCount] = useState(0);
  const [hasNewChats, setHasNewChats] = useState(false);
  const [hasNewRequests, setHasNewRequests] = useState(false);

  useEffect(() => {
    if (chats.length > prevChatCount) setHasNewChats(true);
    setPrevChatCount(chats.length);
  }, [chats]);

  useEffect(() => {
    if (requests.length > prevRequestCount) setHasNewRequests(true);
    setPrevRequestCount(requests.length);
  }, [requests]);

  const handleChatClick = () => {
    setHasNewChats(false);
    navigator("/userdashboard/chats");
  };

  const handleRequestClick = () => {
    setHasNewRequests(false);
    navigator("/userdashboard/requests");
  };

  const handlematchesclick = () => {
    const matchescash = localStorage.getItem("matchescash");
    if (!matchescash) {
      alert("Choose one of the options");
    } else {
      navigator(`/userdashboard/matches/${matchescash}`);
    }
  };

  return (
    <nav className="bg-neutral-900 text-white shadow-sm fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 border-b border-neutral-800">
      <div className="flex space-x-6 text-sm font-medium">
        {/* Chats */}
        <div
          onClick={handleChatClick}
          className="relative cursor-pointer hover:text-gray-300 transition duration-150"
        >
          {hasNewChats && (
            <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
          Chats
        </div>

        {/* Requests */}
        <div
          onClick={handleRequestClick}
          className="relative cursor-pointer hover:text-gray-300 transition duration-150"
        >
          {hasNewRequests && (
            <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
          Requests
        </div>

        {/* Matches */}
        <div
          onClick={handlematchesclick}
          className="cursor-pointer hover:text-gray-300 transition duration-150"
        >
          Matches
        </div>
      </div>

      <button
        onClick={() => userlogout(navigator)}
        className="px-4 py-2 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition duration-200"
      >
        Logout
      </button>
    </nav>
  );
}
