import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { Plus, Users, Calendar, CheckCircle, Clock, AlertCircle, User, Mail, Code, X, ArrowRight, UserPlus, Settings } from 'lucide-react';
import { taskService } from '../services/task/taskService';
import { developerService } from '../services/developer/developerService';
import { managerService } from '../services/manager/managerService';
import authService from '../services/auth/authService';
import Header from '../components/Header';
import ProfileModal from '../components/Profile';
import AddTaskModal from '../components/AddTaskModal';
import AssignTaskModal from '../components/AssignTaskModal';
import { useTaskContext } from '../context/useTask';

const TaskPage = () => {
  const { user,fetchUser , logout } = useAuth();
  const { tasks, developers, addTask, assignTask, loadTasks, isLoading } = useTaskContext();

  const [showAddTask, setShowAddTask] = useState(false);
  const [showAssignTask, setShowAssignTask] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [newTask, setNewTask] = useState({
    taskLabel: '',
    taskState: 'TODO'
  });

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || ''
  });

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const handleAddTask = async () => {
    if (!newTask.taskLabel.trim()) return;

    await addTask(newTask);
    setNewTask({ taskLabel: '', taskState: 'TODO' });
    setShowAddTask(false);
  };

  const handleStatusChange = async (taskId, newStatus) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (!taskToUpdate) return;

    const updatedTask = { ...taskToUpdate, taskState: newStatus };

    try {
      await taskService.update(taskId, updatedTask);
      await loadTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleAssignTask = async (developerId) => {
    if (!selectedTask) return;
    await assignTask(selectedTask.id, developerId); 
    setShowAssignTask(false);
    setSelectedTask(null);
  };

  const handleUpdateProfile = async () => {
    try {
      await authService.updateProfile(user.id, profileData);
      await fetchUser();
      setShowProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
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
      <Header user={user} onOpenProfile={() => setShowProfile(true)} onLogout={logout} />

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
                    <p className="text-2xl font-bold text-white">{user.developerDetails?.team?.length || 0}</p>
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
            {user.developerDetails?.team && (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 mb-8">
                <div className="px-6 py-4 border-b border-white/20">
                  <h2 className="text-xl font-semibold text-white">Team Members</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {user.developerDetails.team.map(developer => (
                      <div key={developer.email} className="flex items-center p-4 bg-white/5 rounded-xl border border-white/10">
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
            )}

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
                      {user?.role === 'MANAGER' && (
                        <button
                          onClick={() => {
                            setSelectedTask(task);
                            setShowAssignTask(true);
                          }}
                          className="ml-2 p-1 text-slate-400 hover:text-purple-400 transition-colors"
                        >
                          <UserPlus className="w-4 h-4" />
                        </button>
                      )}
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
                            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200 ${task.taskState === newStatus
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
        <AddTaskModal
          newTask={newTask}
          setNewTask={setNewTask}
          isLoading={isLoading}
          onAddTask={handleAddTask}
          onClose={() => setShowAddTask(false)}
        />
      )}

      {/* Assign Task Modal */}
      {showAssignTask && selectedTask && (
        <AssignTaskModal
          selectedTask={selectedTask}
          developers={developers}
          onAssign={handleAssignTask}
          onClose={() => {
            setShowAssignTask(false);
            setSelectedTask(null);
          }}
          isLoading={isLoading}
        />
      )}


      {/* Profile Modal */}
      {showProfile && user && (
        <ProfileModal
          profileData={profileData}
          setProfileData={setProfileData}
          isLoading={isLoading}
          onUpdate={handleUpdateProfile}
          onClose={() => setShowProfile(false)}
        />
      )}

      {/* Loading Overlay */}
      {isLoading && !showAddTask && !showAssignTask && !showProfile && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
              <span className="text-white font-medium">Loading...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskPage;