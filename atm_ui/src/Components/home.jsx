import React from "react";
import { useForm } from "react-hook-form";
import { getuserlocation } from "../APIs/methods";
import { loginUser } from "../APIs/api";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigator = useNavigate();
  const onLoginSubmit = (data) => {
    getuserlocation()
      .then((Response) => {
        const loginPayload = { ...data, ...Response };
        loginUser(loginPayload, navigator);
      })
      .catch(() => {
        console.log("The location API failed");
      });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center font-sans">
      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Section: App Description */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <div className="bg-neutral-950 border border-neutral-800 rounded-xl shadow-lg p-8 lg:p-10">
              <h1 className="text-4xl lg:text-5xl font-semibold text-white mb-4">
                Welcome to <span className="text-slate-300">Chicken Fish</span>
              </h1>
              <p className="text-base text-gray-400 leading-relaxed mb-6">
                A revolutionary way to exchange cash and digital currency with ease.
              </p>
              <button
                onClick={() => navigator("/readme")}
                className="inline-block px-6 py-3 bg-white text-black font-medium text-base rounded-lg hover:bg-gray-200 transition duration-200"
              >
                User Guide
              </button>
            </div>
          </div>

          {/* Right Section: Login and Register */}
          <div className="w-full lg:w-1/3 bg-neutral-900 rounded-xl p-6 border border-neutral-800 shadow">
            <h2 className="text-3xl font-semibold text-white mb-4">Get Started</h2>

            <p className="text-sm text-gray-400 mb-4">
              Please enable location on your device for accurate results.
            </p>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-4">
              
              {/* Email Field */}
              <div>
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  placeholder="Email"
                  className="w-full px-4 py-3 bg-neutral-800 text-white border border-neutral-700 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <input
                  type="password"
                  {...register("password", { required: "Password is required" })}
                  placeholder="Password"
                  className="w-full px-4 py-3 bg-neutral-800 text-white border border-neutral-700 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full px-4 py-3 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition duration-200"
              >
                Login
              </button>
            </form>

            {/* Register Button */}
            <div className="mt-6 text-center">
              <p className="text-gray-400">New here?</p>
              <button
                className="mt-4 px-6 py-3 bg-gray-100 text-black rounded-md font-medium hover:bg-gray-200 transition duration-200"
                onClick={() => navigator("/register")}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
