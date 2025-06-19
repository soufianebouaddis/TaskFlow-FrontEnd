import { useAuth } from '../auth/useAuth';

const TaskPage = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Welcome {user?.email}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default TaskPage;
