import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import EmissionForm from '../components/EmissionForm';
import TaskList from '../components/TaskList';
import { useAuth } from '../context/AuthContext';

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const fetchALL = async () => {
      try {
        const response = await axiosInstance.get('/api/emission', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTasks(response.data);
      } catch (error) {
        alert('Failed to fetch emissions.');
      }
    };

    fetchALL();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <EmissionForm
        emissions={tasks}
        setEmissions={setTasks}
        editing={editingTask}
        setEditing={setEditingTask}
      />
      <TaskList tasks={tasks} setTasks={setTasks} setEditing={setEditingTask} />
    </div>
  );
};

export default Tasks;
