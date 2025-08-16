import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig'
import { useState } from 'react';

const TaskList = ({ tasks, setTasks, setEditingTask }) => {
  const { user } = useAuth();
  const [view, setView] = useState('cards'); // 'cards' | 'table'
  
  const handleDelete = async (taskId) => {
    try {
      await axiosInstance.delete(`/api/emission/${taskId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      alert('Failed to delete emission record.');
    }
  };
 
  return (
    <div>
      <button
        onClick={() => setView((v) => (v === 'cards' ? 'table' : 'cards'))}
        className="mb-3 px-3 py-1 rounded bg-gray-200"
      >
        {view === 'cards' ? 'Switch to Table' : 'Switch to Cards'}
      </button>

      {view === 'cards' ? (
        <div>
      {tasks.map((task) => (
        <div key={task._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold">
              {task.type} {task.amount} {task.unit} 
            </h2>

          <p>factor: {task.factor}</p>
          <p className="text-sm text-gray-500">{task.createdAt ? new Date(task.createdAt).toLocaleString() : ''}</p>
          <div className="mt-2">
            <button
              onClick={() => setEditingTask(task)}
              className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(task._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  ) : (
    // --- table view ---
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-50">
              <th className="border p-2 text-left">Type</th>
              <th className="border p-2 text-left">Amount</th>
              <th className="border p-2 text-left">Unit</th>
              <th className="border p-2 text-left">Factor</th>
              <th className="border p-2 text-left">Carbon</th>
              <th className="border p-2 text-left">Created</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((e) => (
              <tr key={e._id}>
                <td className="border p-2">{e.type}</td>
                <td className="border p-2">{e.amount}</td>
                <td className="border p-2">{e.unit}</td>
                <td className="border p-2">{e.factor}</td>
                <td className="border p-2">
                  {typeof e.carbon === 'number' ? e.carbon.toFixed?.(3) : ''}
                </td>
                <td className="border p-2">
                  {e.createdAt ? new Date(e.createdAt).toLocaleString() : ''}
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => setEditingTask(e)}
                    className="mr-2 bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(e._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};


export default TaskList;
