import React, { useState, useEffect } from "react";
import axios from "axios";
import AddTaskForm from "./components/AddTaskForm";

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editData, setEditData] = useState({ title: "", description: "" });

  useEffect(() => {
    axios
      .get("http://localhost:5000/tasks")
      .then((res) => setTasks(res.data))
      .catch((err) => console.error(err));
  }, []);

  const addTask = (taskData) => {
    axios
      .post("http://localhost:5000/api/tasks", taskData)
      .then((res) => {
        setTasks((prevTasks) => [...prevTasks, res.data]);
      })
      .catch((err) => console.error(err));
  };

  const deleteTask = (id) => {
    axios
      .delete(`http://localhost:5000/tasks/${id}`)
      .then(() => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      })
      .catch((err) => console.error(err));
  };

  const updateReminder = (id, reminder) => {
    axios
      .patch(`http://localhost:5000/tasks/${id}`, { reminder })
      .then(() => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === id ? { ...task, reminder } : task
          )
        );
      })
      .catch((err) => console.error(err));
  };

  const toggleComplete = (id, newStatus) => {
    axios
      .patch(`http://localhost:5000/tasks/${id}`, { is_completed: newStatus })
      .then(() => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === id ? { ...task, is_completed: newStatus } : task
          )
        );
      })
      .catch((err) => console.error(err));
  };

  // New: Start editing a task
  const startEditing = (task) => {
    setEditTaskId(task.id);
    setEditData({ title: task.title, description: task.description });
  };

  // New: Cancel editing
  const cancelEditing = () => {
    setEditTaskId(null);
    setEditData({ title: "", description: "" });
  };

  // New: Handle input change for editing
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // New: Save edited task
  const saveEdit = (id) => {
    axios
      .patch(`http://localhost:5000/tasks/${id}`, {
        title: editData.title,
        description: editData.description,
      })
      .then(() => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  title: editData.title,
                  description: editData.description,
                }
              : task
          )
        );
        setEditTaskId(null);
        setEditData({ title: "", description: "" });
      })
      .catch((err) => console.error(err));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.is_completed;
    if (filter === "pending") return !task.is_completed;
    return true;
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="w-full max-w-4xl p-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-blue-700 mb-4 text-center">
          Task Manager
        </h1>

        <AddTaskForm onAdd={addTask} />

        {/* Filter buttons */}
        <div className="mb-4 flex space-x-4 justify-center">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded ${
              filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded ${
              filter === "completed" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded ${
              filter === "pending" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Pending
          </button>
        </div>

        <h2 className="text-xl font-semibold text-blue-600 mt-6 mb-2">
          Your Tasks
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-blue-200 text-left">
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Reminder</th>
                <th className="p-2 border">Completed</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 p-4">
                    No tasks found.
                  </td>
                </tr>
              )}

              {filteredTasks.map((task) => (
                <tr key={task.id} className="bg-gray-100 border-b">
                  <td
                    className="p-2 border"
                    style={{
                      textDecoration: task.is_completed
                        ? "line-through"
                        : "none",
                      color: task.is_completed ? "#999" : "#000",
                    }}
                  >
                    {editTaskId === task.id ? (
                      <input
                        type="text"
                        name="title"
                        value={editData.title}
                        onChange={handleEditChange}
                        className="border rounded p-1 w-full"
                      />
                    ) : (
                      task.title
                    )}
                  </td>

                  <td
                    className="p-2 border"
                    style={{
                      textDecoration: task.is_completed
                        ? "line-through"
                        : "none",
                      color: task.is_completed ? "#999" : "#000",
                    }}
                  >
                    {editTaskId === task.id ? (
                      <input
                        type="text"
                        name="description"
                        value={editData.description}
                        onChange={handleEditChange}
                        className="border rounded p-1 w-full"
                      />
                    ) : (
                      task.description
                    )}
                  </td>

                  <td className="p-2 border">
                    {task.reminder ? (
                      new Date(task.reminder).toLocaleString()
                    ) : (
                      <input
                        type="datetime-local"
                        className="border rounded p-1"
                        min={new Date().toISOString().slice(0, 16)}
                        onChange={(e) =>
                          updateReminder(task.id, e.target.value)
                        }
                      />
                    )}
                  </td>

                  <td className="p-2 border text-center">
                    <input
                      type="checkbox"
                      checked={task.is_completed}
                      onChange={() =>
                        toggleComplete(task.id, !task.is_completed)
                      }
                    />
                  </td>

                  <td className="p-2 border">
                    {editTaskId === task.id ? (
                      <>
                        <button
                          onClick={() => saveEdit(task.id)}
                          className="bg-green-500 text-white px-2 py-1 rounded mr-2 hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(task)}
                          className="bg-yellow-400 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
