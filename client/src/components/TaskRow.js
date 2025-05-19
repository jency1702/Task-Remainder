import React, { useState } from "react";

const TaskRow = ({ task, deleteTask, updateTask, updateReminder }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [completed, setCompleted] = useState(task.completed || false);

  const saveEdit = () => {
    const updatedTask = {
      ...task,
      title: editTitle,
      description: editDescription,
      completed,
    };
    updateTask(updatedTask);
    setIsEditing(false);

    // TODO: Optionally, make an API call here to update backend
  };

  const toggleComplete = () => {
    const newCompleted = !completed;
    setCompleted(newCompleted);
    const updatedTask = { ...task, completed: newCompleted };
    updateTask(updatedTask);
  };

  return (
    <tr className="bg-gray-100 border-b">
      <td className="p-2 border">
        <input
          type="checkbox"
          checked={completed}
          onChange={toggleComplete}
          className="mr-2"
        />
        {isEditing ? (
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="border rounded p-1 w-full"
          />
        ) : (
          <span style={{ textDecoration: completed ? "line-through" : "none" }}>
            {task.title}
          </span>
        )}
      </td>

      <td className="p-2 border">
        {isEditing ? (
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="border rounded p-1 w-full"
          />
        ) : (
          <span style={{ textDecoration: completed ? "line-through" : "none" }}>
            {task.description}
          </span>
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
            onChange={(e) => updateReminder(task.id, e.target.value)}
          />
        )}
      </td>

      <td className="p-2 border">
        {isEditing ? (
          <>
            <button
              onClick={saveEdit}
              className="bg-green-500 text-white px-2 py-1 rounded mr-2 hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
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
  );
};

export default TaskRow;
