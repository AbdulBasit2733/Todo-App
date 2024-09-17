import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const Login = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token')
  const [loading, setLoading] = useState(false);

  const emailRef = useRef();
  const passwordRef = useRef();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(false);
      const email = emailRef.current.value;
      const password = passwordRef.current.value;
      const response = await axios.post(
        "http://localhost:3000/api/todo-app/auth/login",
        {
          email,
          password,
        }
      );
      if (response.data.success) {
        setLoading(true);
        alert(response.data.message);
        localStorage.setItem("token", response.data.token);
        setTimeout(() => {
          navigate("/todo-app/home");
          setLoading(false);
        }, 2000);
      } else {
        setLoading(false);
        alert(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      alert(error.message);
    }
  };

  useEffect(() => {
    if(token) navigate('/todo-app/home')
  },[token])

  return (
    <>
      {loading ? (
        <div className="text-center text-4xl text-blue-600 font-barlow font-bold">
          loading...
        </div>
      ) : (
        <section id="login" className="bg-slate-900 min-h-screen font-barlow ">
          <h1 className="text-white font-bold text-4xl text-center pt-10">
            Login
          </h1>
          <div className="flex justify-center items-start mt-20">
            <div className="w-[25rem] mx-auto">
              <form
                onSubmit={handleLogin}
                className="bg-white flex flex-col gap-y-2 px-10 py-10 rounded-md"
              >
                <label className="text-lg font-bold">Email</label>
                <input
                  ref={emailRef}
                  required
                  type="email"
                  placeholder="Enter Your Email"
                  className="px-3 py-2 border rounded-md w-[20rem] mb-3"
                />

                <label className="text-lg font-bold">Password</label>
                <input
                  type="password"
                  ref={passwordRef}
                  required
                  placeholder="Enter Your Password"
                  className="px-3 py-2 border rounded-md w-[20rem] mb-5"
                />
                <div className="flex justify-between items-center">
                  <button
                    type="submit"
                    className="bg-black text-white px-5 py-2 rounded-md font-semibold"
                  >
                    Login
                  </button>
                  <p className="text-sm">
                    Don't have an account ?{" "}
                    <Link to={"/register"} className="text-blue-600 font-bold">
                      Register
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Login;
