import { useMutation } from "@tanstack/react-query"
import { loginUser } from "../../../api/src/services/userService"
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Login = ({
  onLoginSuccess, 
  toggleAuthView 
}: { 
  onLoginSuccess: (userRole: string) => void, 
  toggleAuthView: () => void 
}) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const { mutateAsync: loginUserMutation } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      const { token, userRole } = data;
  
      if (token) {
        localStorage.setItem("token", token);
        onLoginSuccess(userRole);
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Login failed. Please try again.');
    },
  })

  const handleCredentialsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setCredentials({
      ...credentials,
      [name]: value,
    });
  }

  const handleLogin = async () => {
    const { email, password } = credentials;
    try {
      await loginUserMutation({ email, password });
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-4">
          <img src="/public/boarLogo.png" alt="App Logo" className="w-20 h-20" />
        </div>
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
        <div className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={credentials.email}
            onChange={handleCredentialsChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleCredentialsChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            Login
          </button>
        </div>
        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <span
            onClick={toggleAuthView}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Register here
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
}
