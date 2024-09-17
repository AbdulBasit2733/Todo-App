import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const Home = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const [done, setDone] = useState(false);

  const todoNameRef = useRef();
  const doneRef = useRef();

  const handleCheckboxChange = () => {
    setDone(doneRef.current.checked);
  };

  const handleDeleteTodo = async (id) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/deletetodo`,
        {
          id,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      if (response.data.success) {
        alert(response.data.message);
        loadComponent();
        setLoading(false);
      } else {
        alert(response.data.message);
        setLoading(false);
      }
    } catch (error) {
      alert(error);
      setLoading(false);
    }
  };

  const handleAddTodo = async () => {
    const todoName = todoNameRef.current.value;
    const todoDone = done;

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/addtodo`,
        {
          title: todoName,
          done: todoDone,
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      if (response.data.success) {
        alert(response.data.message);
        loadComponent();
        setLoading(false); // Reload the todos after adding
      } else {
        alert(response.data.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error adding todo:", error);
      alert("Failed to add todo");
      setLoading(false);
    }
  };

  const loadComponent = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/home`, {
        headers: {
          token: localStorage.getItem("token"), // Ensure token exists
        },
      });

      // Check if there are todos and they are loaded properly
      if (response.data && response.data.todos.length > 0) {
        setError(false);
        setTodos(response.data.todos);
        setLoading(false); // Set todos array properly
      } else {
        setError(true);
        setTodos([]);
        setLoading(false); // Clear todos if none are available
      }
    } catch (error) {
      console.error("Failed to load todos:", error);
      setError(true);
      setLoading(false); // Set error state if fetching fails
    }
  };

  useEffect(() => {
    if (!token) navigate("/login");
    loadComponent();
  }, []);

  return (
    <>
      {loading ? (
        <div className="text-center text-4xl text-blue-600 font-bold py-20">
          Loading...
        </div>
      ) : (
        <section className="min-h-screen w-full font-barlow">
          <div>
            <div className="flex justify-center items-center pt-10 gap-x-10">
              <h1 className="text-4xl text-center font-extrabold">
                Manage Your Todos Here
              </h1>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  setLoading(true);
                  if (!localStorage.getItem("token")) {
                    alert("Logout Successfully");
                    setTimeout(() => {
                      navigate("/login");
                      setLoading(false);
                    }, 3000);
                  }
                }}
                className="bg-black text-white font-bold px-5 py-2 rounded-md"
              >
                Logout
              </button>
            </div>
            <div className="flex justify-center items-center mt-20">
              <div className=" bg-black w-[30rem] rounded-lg">
                <div className="flex justify-center gap-x-5 items-center py-10">
                  <input
                    type="text"
                    ref={todoNameRef}
                    placeholder="Enter Todos Here"
                    className="px-3 py-2 rounded-md focus:outline-none font-semibold"
                  />
                  <input
                    type="checkbox"
                    ref={doneRef}
                    checked={done}
                    onChange={handleCheckboxChange}
                    placeholder="Enter Todos Here"
                    className="px-3 py-2 rounded-md focus:outline-none font-semibold"
                  />
                  <button
                    onClick={handleAddTodo}
                    className="bg-green-600 text-white px-5 py-2 rounded-md font-semibold"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-10 bg-black w-[40rem] mx-auto py-5 space-y-5 rounded-md">
              {error === false && todos && todos.length > 0 ? (
                todos.map((todo, index) => (
                  <div key={todo._id} className="flex flex-col">
                    <div className="flex justify-between gap-5 items-center px-10">
                      <div className="flex flex-1 justify-between items-center text-white font-bold">
                        <h3>{index + 1}</h3>
                        <p>{todo.title}</p>
                        {/* <p>{todo.done === true ? "done" : "done"}</p> */}
                        <button
                          onClick={() => handleDeleteTodo(todo._id)}
                          className="bg-red-600 text-white px-5 py-2 rounded-md font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                      <button
                        className={` text-green-600 font-bold capitalize text-sm ${
                          todo.done !== true && "line-through text-yellow-500"
                        }`}
                      >
                        {todo.done === true ? "done" : "done"}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-white text-center font-bold text-2xl">
                  No Todos Available
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Home;
