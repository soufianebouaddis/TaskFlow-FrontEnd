import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/useAuth';
import { Plus, Users, Calendar, CheckCircle, Clock, AlertCircle, User, Mail, Code, X, ArrowRight } from 'lucide-react';
import { taskService } from '../services/task/taskService';


const TaskPage = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newTask, setNewTask] = useState({
    taskLabel: '',
    taskState: 'TODO'
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const response = await taskService.tasks();
      if (response.data.success) {
        setTasks(response.data.data || []);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };



  const handleAddTask = async () => {
    if (!newTask.taskLabel.trim()) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await taskService.add(newTask);
      if (response.data.success) {
        await loadTasks(); // Refresh tasks
        setNewTask({ taskLabel: '', taskState: 'TODO' });
        setShowAddTask(false);
      }
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const taskToUpdate = tasks.find(task => task.id === taskId);
      if (!taskToUpdate) return;

      const updatedTask = { ...taskToUpdate, taskState: newStatus };
      const response = await taskService.update(taskId, updatedTask);
      
      if (response.data.success) {
        await loadTasks(); // Refresh tasks
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'TODO': return <AlertCircle className="w-5 h-5 text-slate-400" />;
      case 'IN_PROGRESS': return <Clock className="w-5 h-5 text-purple-400" />;
      case 'DONE': return <CheckCircle className="w-5 h-5 text-green-400" />;
      default: return <AlertCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const filteredTasks = user?.role === 'DEVELOPER' 
    ? tasks.filter(task => task.assignedTo === user?.id) 
    : tasks;

  const tasksByStatus = {
    TODO: filteredTasks.filter(task => task.taskState === 'TODO'),
    IN_PROGRESS: filteredTasks.filter(task => task.taskState === 'IN_PROGRESS'),
    DONE: filteredTasks.filter(task => task.taskState === 'DONE')
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Task Dashboard</h1>
              <p className="text-slate-300 mt-1">Welcome back, {user?.firstName || user?.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30 backdrop-blur-sm">
                <User className="w-4 h-4 mr-2" />
                {user?.role}
              </span>
              <button
                onClick={logout}
                className="px-6 py-2 text-sm font-medium text-slate-300 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 backdrop-blur-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Manager View */}
        {user?.role === 'MANAGER' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-300">Developers</p>
                    <p className="text-2xl font-bold text-white">{user.developerDetails.team.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-slate-500 to-slate-600 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-300">To Do</p>
                    <p className="text-2xl font-bold text-white">{tasksByStatus.TODO.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-300">In Progress</p>
                    <p className="text-2xl font-bold text-white">{tasksByStatus.IN_PROGRESS.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-300">Completed</p>
                    <p className="text-2xl font-bold text-white">{tasksByStatus.DONE.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Developers Section */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 mb-8">
              <div className="px-6 py-4 border-b border-white/20">
                <h2 className="text-xl font-semibold text-white">Team Members</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {user.developerDetails.team.map(developer => (
                    <div key={developer.id} className="flex items-center p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <Code className="w-6 h-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-white">
                          {developer.firstName} {developer.lastName}
                        </p>
                        <p className="text-xs text-slate-400 flex items-center mt-1">
                          {developer.developerType}
                        </p>
                        <p className="text-xs text-slate-400 flex items-center mt-1">
                          <Mail className="w-3 h-3 mr-1" />
                          {developer.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Add Task Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowAddTask(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Task
              </button>
            </div>
          </>
        )}

        {/* Task Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
            <div key={status} className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20">
              <div className="px-6 py-4 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    {getStatusIcon(status)}
                    <span className="ml-3">{status.replace('_', ' ')}</span>
                  </h3>
                  <span className="bg-white/10 text-slate-300 text-xs font-medium px-3 py-1 rounded-full border border-white/20">
                    {statusTasks.length}
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                {statusTasks.map(task => (
                  <div key={task.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-sm font-semibold text-white flex-1">{task.taskLabel}</h4>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                      {task.updatedAt && (
                        <span className="text-slate-500">
                          Updated: {new Date(task.updatedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {user?.role === 'DEVELOPER' && (
                      <div className="flex space-x-2">
                        {['TODO', 'IN_PROGRESS', 'DONE'].map(newStatus => (
                          <button
                            key={newStatus}
                            onClick={() => handleStatusChange(task.id, newStatus)}
                            disabled={task.taskState === newStatus}
                            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200 ${
                              task.taskState === newStatus
                                ? 'bg-white/10 text-slate-500 cursor-not-allowed border border-white/20'
                                : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/30'
                            }`}
                          >
                            {newStatus.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {statusTasks.length === 0 && (
                  <div className="text-center py-8 text-slate-400">
                    <p className="text-sm">No tasks in this column</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTask && user?.role === 'MANAGER' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Add New Task</h3>
              <button
                onClick={() => setShowAddTask(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Task Label</label>
                <input
                  type="text"
                  value={newTask.taskLabel}
                  onChange={(e) => setNewTask({...newTask, taskLabel: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                  placeholder="Enter task description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Status</label>
                <select
                  value={newTask.taskState}
                  onChange={(e) => setNewTask({...newTask, taskState: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                >
                  <option value="TODO" className="bg-slate-800">To Do</option>
                  <option value="IN_PROGRESS" className="bg-slate-800">In Progress</option>
                  <option value="DONE" className="bg-slate-800">Done</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowAddTask(false)}
                  className="px-6 py-3 text-sm font-medium text-slate-300 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTask}
                  disabled={isLoading || !newTask.taskLabel.trim()}
                  className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/25"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Create Task</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && !showAddTask && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
              <span className="text-white font-medium">Loading tasks...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskPage;