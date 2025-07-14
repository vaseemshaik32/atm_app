import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Chats = () => {
  const navigator = useNavigate();
  const chatusers = useSelector((state) => state.chts);

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans px-4 py-6 flex items-center justify-center">
      <div className="w-full max-w-xl bg-neutral-900 rounded-xl shadow border border-neutral-800 p-6">
        
        {/* Header */}
        <h3 className="text-2xl font-semibold mb-6 text-center">Chats</h3>
        
        {/* Chat List */}
        <ul className="space-y-3">
          {chatusers.map((chatuser) => (
            <li
              key={chatuser}
              className="cursor-pointer px-4 py-3 bg-neutral-800 border border-neutral-700 text-white rounded-md hover:bg-neutral-700 transition duration-150"
              onClick={() =>
                navigator(`/userdashboard/chatwindow/${chatuser}`)
              }
            >
              <span className="font-medium">{chatuser}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Chats;
