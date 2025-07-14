import React from 'react';
import { useNavigate } from 'react-router-dom';

function Readme() {
  const navigator = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-neutral-900 rounded-xl shadow border border-neutral-800 p-6">
        
        {/* Heading */}
        <h1 className="text-2xl font-semibold text-center mb-4">
          Welcome to ChickenFish
        </h1>

        {/* Description */}
        <p className="text-sm text-gray-400 mb-6 leading-relaxed text-center">
          Tired of long ATM lines? Whether you're depositing or withdrawing cash—what if we matched people wanting to deposit with those who want to withdraw?
        </p>

        {/* Steps List */}
        <ol className="list-decimal list-inside text-gray-300 space-y-4 text-sm">
          <li>
            <span className="font-medium text-white">Register and login:</span> Enter the amount you want to exchange.
          </li>
          <li>
            <span className="font-medium text-white">Choose your exchange type:</span> Cash or digital. We’ll find your match.
          </li>
          <li>
            <span className="font-medium text-white">Pick a match:</span> Choose the nearest user and send a chat request.
          </li>
          <li>
            <span className="font-medium text-white">Accept requests:</span> Let others reach out and start chatting.
          </li>
          <li>
            <span className="font-medium text-white">Start chatting:</span> Open chats and coordinate your exchange.
          </li>
          <li>
            <span className="font-medium text-white">Explore more matches:</span> Come back and find more users.
          </li>
        </ol>

        {/* Back Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigator('/')}
            className="px-4 py-2 bg-white text-black rounded-md text-sm font-medium hover:bg-gray-200 transition duration-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default Readme;


