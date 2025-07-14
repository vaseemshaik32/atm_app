import { getcashguys, getdigitalguys } from "../APIs/api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";

export const Content = () => {
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const [amount, setAmount] = useState(0);

  const username = localStorage.getItem("usernameforreact");
  const profilePicURL = localStorage.getItem("profilePicURL");

  const handleGetCash = () => {
    if (!amount) {
      alert("Please enter an amount!");
      return;
    }
    getcashguys(navigator, dispatch, amount);
  };

  const handleGetDigital = () => {
    if (!amount) {
      alert("Please enter an amount!");
      return;
    }
    getdigitalguys(navigator, dispatch, amount);
  };

  return (
    <div className="min-h-[75vh] bg-neutral-950 text-white font-sans px-4 py-6 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-neutral-900 rounded-xl shadow border border-neutral-800 p-6">
        
        {/* Header: Username + Avatar */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Welcome, {username}</h2>
          {profilePicURL && (
            <img
            src={profilePicURL}
            alt="Profile"
            className="w-[72px] h-[72px] rounded-full object-cover border border-neutral-700"
          />          
          )}
        </div>

        <p className="text-sm text-gray-400 mb-6">
          Enter an amount and choose an action:
        </p>

        {/* Input */}
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter Amount"
          className="w-full px-4 py-3 bg-neutral-800 text-white border border-neutral-700 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 mb-6"
        />

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={handleGetCash}
            className="flex-1 px-4 py-3 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition duration-200"
          >
            Get Cash
          </button>
          <button
            onClick={handleGetDigital}
            className="flex-1 px-4 py-3 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition duration-200"
          >
            Get Digital
          </button>
        </div>
      </div>
    </div>
  );
};
