import axios from "axios";
import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  const nameRef = useRef();

  const handleRegister = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const name = nameRef.current.value;

    const response = await axios.post(
      "http://localhost:3000/api/todo-app/auth/register",
      {
        email,
        password,
        name,
      }
    );
    if (response.data.success) {
      alert(response.data.message);
      navigate("/login");
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
