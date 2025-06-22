
import { AuthProvider } from './context/AuthContext'
import { TaskProvider } from './context/TaskContext';
import Router from './router'


function App() {
  return (
    <TaskProvider>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </TaskProvider>
  );
}

export default App
