import { useEffect } from 'react';
import { useAuth } from '../auth/useAuth';
import authService from '../services/auth/authService';

const TaskPage = () => {
  const { user, logout } = useAuth();
  console.log('TaskPage user:', user);
  return (
    <div>
      <h1>Welcome {user?.email}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default TaskPage;
