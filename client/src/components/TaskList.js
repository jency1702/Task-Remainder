// import React from "react";

// const TaskList = ({ tasks, onDelete }) => {
//   return (
//     <div className="space-y-4 mt-6">
//       {tasks.length === 0 && <p className="text-gray-500">No tasks found.</p>}
//       {tasks.map((task) => (
//         <div
//           key={task.id}
//           className="p-4 bg-blue-100 rounded shadow flex justify-between items-start"
//         >
//           <div>
//             <h3 className="text-lg font-bold text-blue-700">{task.title}</h3>
//             <p>{task.description}</p>
//           </div>
//           <button
//             onClick={() => onDelete(task.id)}
//             className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//           >
//             Delete
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default TaskList;

import React from "react";

const TaskList = ({ tasks, onDelete }) => {
  return (
    <div className="space-y-4 mt-6">
      {tasks.length === 0 && <p className="text-gray-500">No tasks found.</p>}
      {tasks.map((task) => (
        <div
          key={task.id}
          className="p-4 bg-blue-100 rounded shadow flex justify-between items-start"
        >
          <div>
            <h3 className="text-lg font-bold text-blue-700">{task.title}</h3>
            <p>{task.description}</p>
          </div>
          <button
            onClick={() => onDelete(task.id)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
