import React from 'react';
import { Calendar, UserPlus } from 'lucide-react';

const TaskCards = ({ role, user, tasks, taskService, loadTasks, setSelectedTask, setShowAssignTask }) => {
  const handleStatusChange = async (taskId, newStatus) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (!taskToUpdate) return;
    console.log('Updating task:',tas);
    const updatedTask = { ...taskToUpdate, taskState: newStatus };

    try {
      await taskService.update(taskId, updatedTask);
      await loadTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const getStatusIcon = status => {
    switch (status) {
      case 'TODO':
        return <span className="mr-2">📝</span>;
      case 'IN_PROGRESS':
        return <span className="mr-2">🚧</span>;
      case 'DONE':
        return <span className="mr-2">✅</span>;
      default:
        return null;
    }
  };

  // Filter tasks by role
  const visibleTasks = role === 'MANAGER'
    ? tasks
    : tasks.filter(task =>
        user?.developerDetails?.tasks?.some(devTask => devTask.id === task.id)
      );

  // Group tasks by status
  const tasksByStatus = visibleTasks.reduce((groups, task) => {
    const key = task.taskState;
    if (!groups[key]) groups[key] = [];
    groups[key].push(task);
    return groups;
  }, {});

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {['TODO', 'IN_PROGRESS', 'DONE'].map(status => {
        const statusTasks = tasksByStatus[status] || [];

        return (
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
                    {role === 'MANAGER' && (
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

                  {role === 'DEVELOPER' && (
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
        );
      })}
    </div>
  );
};

export default TaskCards;
