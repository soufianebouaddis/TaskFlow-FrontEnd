import { AuthProvider } from './context/AuthContext'
import { TaskProvider } from './context/TaskContext';
import Router from './router'
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <Router />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid #475569',
            },
            success: {
              style: {
                background: '#059669',
                border: '1px solid #10b981',
              },
            },
            error: {
              style: {
                background: '#dc2626',
                border: '1px solid #ef4444',
              },
            },
          }}
        />
      </TaskProvider>
    </AuthProvider>
  );
}

export default App
