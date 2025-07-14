import React from "react";
import Navbar from "./navbar";
import { Outlet } from "react-router-dom";

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col">
      {/* Navbar stays fixed */}
      <Navbar />

      {/* Main content */}
      <main className="mt-20 px-4 py-6 flex-1 w-full max-w-4xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
