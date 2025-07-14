import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { sendConnectRequest } from '../RealTime/socket';

const Matches = () => {
  const { cash } = useParams();
  const isCashMode = cash === "true";

  const users = useSelector((state) =>
    isCashMode ? state.userinfo.receivers : state.userinfo.donors
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans px-4 py-6 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        
        {/* Header */}
        <h1 className="text-3xl font-semibold mb-4 text-center">Matches</h1>
        {isCashMode && (
          <p className="mb-6 text-sm text-center text-gray-400">
            💵 Cash mode is enabled
          </p>
        )}
        
        <ul className="space-y-4">
          {users.map(([distance, user], index) => (
            <li
              key={index}
              onClick={() => {
                alert(`Chat request sent to ${user.username}`);
                sendConnectRequest(user.username);
              }}
              className="flex items-center bg-neutral-900 px-4 py-3 rounded-md border border-neutral-800 hover:bg-neutral-800 transition cursor-pointer"
            >
              {/* Avatar */}
              {user.s3_url && (
                <img
                  src={user.s3_url}
                  alt={`${user.username}'s avatar`}
                  className="w-10 h-10 rounded-full object-cover border border-neutral-700 mr-4"
                />
              )}

              {/* Info */}
              <div className="flex-1">
                <p className="text-sm font-medium">{user.username}</p>
                <p className="text-xs text-gray-400">{distance} km away</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Matches;
