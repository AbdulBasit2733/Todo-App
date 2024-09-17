import axios from "axios";
import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  const nameRef = useRef();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Capture form values
      const email = emailRef.current.value;
      const password = passwordRef.current.value;
      const name = nameRef.current.value;

      // Send registration request to the backend
      const response = await axios.post(`${API_URL}/auth/register`, {
        email,
        password,
        name,
      });

      // Check if registration is successful
      if (response.data.success) {
        alert(response.data.message);
        navigate("/login"); // Redirect to login page on success
      } else {
        alert(response.data.message); // Handle backend validation errors
      }
    } catch (error) {
      // Handle different error cases
      if (error.response) {
        // The request was made, and the server responded with a status code
        // that falls outside the range of 2xx (e.g., 400 for validation errors)
        alert(
          error.response.data.message || "An error occurred during registration"
        );
      } else if (error.request) {
        // The request was made, but no response was received
        alert("No response from server. Please try again later.");
      } else {
        // Something else happened in making the request
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <section id="register" className="bg-slate-900 min-h-screen font-barlow">
      <h1 className="text-white font-bold text-4xl text-center pt-10">
        Register
      </h1>
      <div className="flex justify-center items-start mt-20">
        <div className="w-[25rem] mx-auto">
          <form
            onSubmit={handleRegister}
            className="bg-white flex flex-col gap-y-2 px-10 py-10 rounded-md"
          >
            <label className="text-lg font-bold">Name</label>
            <input
              required
              ref={nameRef}
              type="text"
              placeholder="Enter Your Name"
              className="px-3 py-2 border rounded-md w-[20rem] mb-3"
            />

            <label className="text-lg font-bold">Email</label>
            <input
              required
              ref={emailRef}
              type="email"
              placeholder="Enter Your Email"
              className="px-3 py-2 border rounded-md w-[20rem] mb-3"
            />

            <label className="text-lg font-bold">Password</label>
            <input
              required
              type="password"
              ref={passwordRef}
              placeholder="Enter Your Password"
              className="px-3 py-2 border rounded-md w-[20rem] mb-5"
            />
            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="bg-black text-white px-5 py-2 rounded-md font-semibold"
              >
                Register
              </button>
              <p className="text-sm">
                Already Have an account ?{" "}
                <Link to={"/login"} className="text-blue-600 font-bold">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;
