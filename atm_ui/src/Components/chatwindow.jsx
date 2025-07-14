import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { sendMessageToMatch } from '../RealTime/socket';
import { useParams } from 'react-router-dom';

const ChatWindow = () => {
  const [messageInput, setMessageInput] = useState('');
  const { nameofmatch } = useParams();
  const messagesEndRef = useRef(null);
  const messages = useSelector((state) => state.messages[nameofmatch] || []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (messageInput.trim() === '') return;
    const msgfrom = localStorage.getItem('usernameforreact');
    sendMessageToMatch(msgfrom, nameofmatch, messageInput);
    setMessageInput('');
  };

  return (
    <div className="min-h-[90vh] bg-neutral-950 text-white font-sans px-4 py-6 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-neutral-900 rounded-xl shadow border border-neutral-800 flex flex-col">
        
        {/* Header */}
        <div className="px-4 py-3 border-b border-neutral-800 text-sm font-medium bg-neutral-800 rounded-t-xl text-center">
          Chat with <span className="text-gray-300">{nameofmatch}</span>
        </div>

        {/* Messages Section */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.received ? 'justify-start' : 'justify-end'
              }`}
            >
              <div className="bg-neutral-700 text-white px-4 py-2 rounded-lg max-w-[66%] text-sm break-words">
                {msg.msg}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Section */}
        <div className="px-4 py-3 border-t border-neutral-800 flex space-x-2 bg-neutral-900 rounded-b-xl">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-neutral-800 border border-neutral-700 text-white rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-white text-black rounded-md text-sm font-medium hover:bg-gray-200 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
