import React from "react";
import { useSelector } from "react-redux";
import { acceptConnectRequest } from "../RealTime/socket";

const Requests = () => {
  const chatrequestusers = useSelector((state) => state.req);

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans px-4 py-6 flex items-center justify-center">
      <div className="w-full max-w-xl bg-neutral-900 rounded-xl shadow border border-neutral-800 p-6">
        {/* Header */}
        <h3 className="text-2xl font-semibold text-center mb-6">Requests</h3>

        {/* Request List */}
        <ul className="space-y-4">
          {chatrequestusers.map((chatrequestuser) => (
            <li
              key={chatrequestuser}
              className="flex items-center justify-between px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-md hover:bg-neutral-700 transition duration-150"
            >
              <span className="text-sm font-medium">{chatrequestuser}</span>

              <button
                onClick={() =>
                  acceptConnectRequest(
                    chatrequestuser,
                    localStorage.getItem("usernameforreact")
                  )
                }
                className="px-4 py-2 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition duration-200"
              >
                Accept
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Requests;
