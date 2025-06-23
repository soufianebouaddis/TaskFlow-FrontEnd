import { useState, useMemo } from 'react';

import { UserPlus, Trash, AlertCircle, Clock, CheckCircle, Plus, Users, Mail, Code, Pencil } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { useTaskContext } from '../../context/useTask';
import type { Task } from '../../types/task-type/Task';
import authService from '../../services/auth/authService';
import { taskService } from '../../services/task/taskService';
import EditTaskModal from '../../components/EditTaskModal';
import AddTaskModal from '../../components/AddTaskModal';
import AssignTaskModal from '../../components/AssignTaskModal';
import AddDeveloperToTeamModal from '../../components/AddDeveloperToTeamModal';
import ProfileModal from '../../components/Profile';
import Header from '../../components/Header';
import toast from 'react-hot-toast';

// Extended User interface to include developerDetails
interface ExtendedUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  role: string;
  developerDetails?: {
    team?: Array<{
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      developerType: string;
    }>;
    tasks?: Task[];
  };
}

// Extended Task interface to include assignedTo
interface ExtendedTask extends Task {
  assignedTo?: string;
}

const TaskPage = () => {
  const { user, fetchUser, logout } = useAuth();
  const { tasks, developers, addTask, assignTask, addDeveloperToTeam, loadTasks, isLoading } = useTaskContext();

  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [editableTask, setEditableTask] = useState<ExtendedTask | null>(null);

  const [showAddTask, setShowAddTask] = useState(false);
  const [showAssignTask, setShowAssignTask] = useState(false);
  const [showAddDeveloperToTeam, setShowAddDeveloperToTeam] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ExtendedTask | null>(null);

  const [newTask, setNewTask] = useState({
    taskLabel: '',
    taskState: 'TODO'
  });

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || ''
  });

  const handleAddTask = async () => {
    if (!newTask.taskLabel.trim()) return;

    try {
      await addTask(newTask);
      setNewTask({ taskLabel: '', taskState: 'TODO' });
      setShowAddTask(false);
    } catch (error) {
    }
  };

  const handleAssignTask = async (developerId: string) => {
    if (!selectedTask) return;
    try {
      await assignTask(selectedTask.id, developerId);
      setShowAssignTask(false);
      setSelectedTask(null);
    } catch (error) {
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (user?.id) {
        await authService.updateProfile(user.id, profileData);
        await fetchUser();
        setShowProfile(false);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleAddDeveloperToTeam = async (developerId: string) => {
    if (user?.id) {
      try {
        await addDeveloperToTeam(developerId, user.id);
        await fetchUser();
        setShowAddDeveloperToTeam(false);
      } catch (error) {
      }
    }
  };

  const filteredTasks = user?.role === 'DEVELOPER'
    ? (tasks as ExtendedTask[]).filter((task: ExtendedTask) => task.assignedTo === user?.id)
    : tasks;

  const tasksByStatus = {
    TODO: filteredTasks.filter(task => task.taskState === 'TODO'),
    IN_PROGRESS: filteredTasks.filter(task => task.taskState === 'IN_PROGRESS'),
    DONE: filteredTasks.filter(task => task.taskState === 'DONE')
  };

  const groupedTasks = useMemo(() => {
    if (user?.role === 'MANAGER') {
      return tasksByStatus;
    }

    const extendedUser = user as ExtendedUser;
    const devTasks = extendedUser?.developerDetails?.tasks || [];

    return devTasks.reduce((acc: Record<string, ExtendedTask[]>, task: ExtendedTask) => {
      const status = task.taskState;
      if (!acc[status]) acc[status] = [];
      acc[status].push(task);
      return acc;
    }, {} as Record<string, ExtendedTask[]>);
  }, [user, tasksByStatus]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'TODO': return <AlertCircle className="w-5 h-5 text-slate-400" />;
      case 'IN_PROGRESS': return <Clock className="w-5 h-5 text-purple-400" />;
      case 'DONE': return <CheckCircle className="w-5 h-5 text-green-400" />;
      default: return <AlertCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await taskService.deleteTask(taskId);
      await loadTasks();
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('Failed to delete task');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header user={user || {}} onOpenProfile={() => setShowProfile(true)} onLogout={logout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user?.role === 'MANAGER' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-300">Developers</p>
                    <p className="text-2xl font-bold text-white" data-testid="developers-count">{(user as ExtendedUser).developerDetails?.team?.length || 0}</p>
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
                    <p className="text-2xl font-bold text-white" data-testid="todo-count">{tasksByStatus.TODO.length}</p>
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
                    <p className="text-2xl font-bold text-white" data-testid="inprogress-count">{tasksByStatus.IN_PROGRESS.length}</p>
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
                    <p className="text-2xl font-bold text-white" data-testid="done-count">{tasksByStatus.DONE.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {(user as ExtendedUser).developerDetails?.team && (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 mb-8">
                <div className="px-6 py-4 border-b border-white/20 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">Team Members</h2>
                  <button
                    onClick={() => setShowAddDeveloperToTeam(true)}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Developer
                  </button>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(user as ExtendedUser).developerDetails?.team?.map((developer: any) => (
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Object.entries(groupedTasks).map(([status, statusTasks]) => (
            <div key={status} className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20">
              <div className="px-6 py-4 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    {getStatusIcon(status)}
                    <span className="ml-3">{status.replace('_', ' ')}</span>
                  </h3>
                  <span className="bg-white/10 text-slate-300 text-xs font-medium px-3 py-1 rounded-full border border-white/20">
                    {(statusTasks as ExtendedTask[]).length}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                {(statusTasks as ExtendedTask[]).map((task: ExtendedTask) => (
                  <div key={task.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-sm font-semibold text-white flex-1">{task.taskLabel}</h4>

                      {user?.role === 'MANAGER' && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedTask(task);
                              setShowAssignTask(true);
                            }}
                            className="p-1 text-slate-400 hover:text-purple-400 transition-colors"
                            title="Assign task"
                          >
                            <UserPlus className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-1 text-red-400 hover:text-red-600 transition-colors"
                            title="Delete task"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {user?.role === 'DEVELOPER' && (
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {['TODO', 'IN_PROGRESS', 'DONE'].map(newStatus => (
                          <button
                            key={newStatus}
                            disabled={task.taskState === newStatus}
                            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200 ${task.taskState === newStatus
                              ? 'bg-white/10 text-slate-500 cursor-not-allowed border border-white/20'
                              : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/30'
                              }`}
                          >
                            {newStatus.replace('_', ' ')}
                          </button>
                        ))}
                        <button
                          onClick={() => {
                            setEditableTask(task);
                            setShowEditTaskModal(true);
                          }}
                          className="p-1 text-purple-300 hover:text-purple-400 border border-purple-500/30 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 transition-all"
                          title="Edit task"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {(statusTasks as ExtendedTask[]).length === 0 && (
                  <div className="text-center py-8 text-slate-400">
                    <p className="text-sm">No tasks in this column</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showEditTaskModal && editableTask && (
        <EditTaskModal
          task={editableTask}
          onClose={() => {
            setShowEditTaskModal(false);
            setEditableTask(null);
          }}
          onSave={async () => {
            await loadTasks();
            setShowEditTaskModal(false);
            setEditableTask(null);
          }}
        />
      )}

      {showAddTask && user?.role === 'MANAGER' && (
        <AddTaskModal
          newTask={newTask}
          setNewTask={setNewTask}
          isLoading={isLoading}
          onAddTask={handleAddTask}
          onClose={() => setShowAddTask(false)}
        />
      )}

      {showAssignTask && selectedTask && (
        <AssignTaskModal
          selectedTask={{
            id: selectedTask.id.toString(),
            taskLabel: selectedTask.taskLabel
          }}
          developers={developers}
          onAssign={handleAssignTask}
          onClose={() => {
            setShowAssignTask(false);
            setSelectedTask(null);
          }}
        />
      )}

      {showProfile && user && (
        <ProfileModal
          profileData={profileData}
          setProfileData={setProfileData}
          isLoading={isLoading}
          onUpdate={handleUpdateProfile}
          onClose={() => setShowProfile(false)}
        />
      )}

      {showAddDeveloperToTeam && (
        <AddDeveloperToTeamModal
          developers={developers.filter(dev => 
            !(user as ExtendedUser)?.developerDetails?.team?.some((teamMember: any) => teamMember.email === dev.email)
          )}
          onAddToTeam={handleAddDeveloperToTeam}
          onClose={() => setShowAddDeveloperToTeam(false)}
          isLoading={isLoading}
        />
      )}

      {isLoading && !showAddTask && !showAssignTask && !showProfile && !showAddDeveloperToTeam && (
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