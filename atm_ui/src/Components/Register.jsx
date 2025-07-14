import React from "react";
import { useForm } from "react-hook-form";
import { registerUser } from "../APIs/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigator = useNavigate();
  const onSubmit = async (data) => {
    const formData = { ...data };

    const file = data.profilePic?.[0];

    if (file) {
      const fileExt = file.name.split(".").pop();
      formData.fileExt = fileExt;
      formData.contentType = file.type;
      formData.imageFile = file;
    } else {
      formData.useDefaultImage = true;
    }

    registerUser(formData, navigator);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center font-sans">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-semibold mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              {...register("username", { required: "Username is required" })}
              placeholder="Your username"
              className="w-full px-4 py-3 bg-neutral-800 text-white border border-neutral-700 rounded-md focus:ring-1 focus:ring-gray-500 focus:outline-none"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value:
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email address",
                },
              })}
              placeholder="Your email"
              className="w-full px-4 py-3 bg-neutral-800 text-white border border-neutral-700 rounded-md focus:ring-1 focus:ring-gray-500 focus:outline-none"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              placeholder="Your password"
              className="w-full px-4 py-3 bg-neutral-800 text-white border border-neutral-700 rounded-md focus:ring-1 focus:ring-gray-500 focus:outline-none"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Profile Picture (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("profilePic")}
              className="w-full px-3 py-2 bg-neutral-800 text-white border border-neutral-700 rounded-md focus:outline-none"
            />
          </div>

          {/* Terms */}
          <p className="text-sm text-gray-400 text-center">
            By registering, you agree to our{" "}
            <Link to="/terms" className="text-gray-200 underline">
              Terms and Conditions
            </Link>.
          </p>

          {/* Submit */}
          <button
            type="submit"
            className="w-full px-4 py-3 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition duration-200"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
