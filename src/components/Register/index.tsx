import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../../../api/src/services/userService";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Register = ({ 
  onRegisterSuccess, 
  toggleAuthView 
}: { 
  onRegisterSuccess: (userRole: string) => void 
  toggleAuthView: () => void 
}) => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const { mutateAsync: registerUserMutation } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      const { token, userRole } = data;
  
      if (token) {
        localStorage.setItem("token", token);
        onRegisterSuccess(userRole);
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Registration failed. Please try again.');
    },
  });

  const handleUserDetailsChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    setUserDetails({
      ...userDetails,
      [name]: value,
    });
  };

  const handleRegister = async () => {
    const { name, email, password, role } = userDetails;
    try {
      await registerUserMutation({ name, email, password, role });
    } catch (error) {
      console.error("Registration failed", error);
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-4">
          <img src="/public/boarLogo.png" alt="App Logo" className="w-20 h-20" />
        </div>
        <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={userDetails.name}
            onChange={handleUserDetailsChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={userDetails.email}
            onChange={handleUserDetailsChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={userDetails.password}
            onChange={handleUserDetailsChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          />
          <select
            name="role"
            value={userDetails.role}
            onChange={handleUserDetailsChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 appearance-none"
          >
            <option value="" disabled>Select role</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
          <button
            onClick={handleRegister}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            Register
          </button>
        </div>
        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <span
            onClick={toggleAuthView}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Login here
          </span>
        </p>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        theme="dark"
      />
    </div>
  );
};
