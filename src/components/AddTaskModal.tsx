// components/AddTaskModal.tsx
import React from 'react';
import { ArrowRight, X } from 'lucide-react';

interface AddTaskModalProps {
  newTask: {
    taskLabel: string;
    taskState: string;
  };
  setNewTask: React.Dispatch<React.SetStateAction<{ taskLabel: string; taskState: string }>>;
  isLoading: boolean;
  onAddTask: () => void;
  onClose: () => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  newTask,
  setNewTask,
  isLoading,
  onAddTask,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">Add New Task</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Task Label</label>
            <input
              type="text"
              value={newTask.taskLabel}
              onChange={(e) => setNewTask({ ...newTask, taskLabel: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
              placeholder="Enter task description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Status</label>
            <select
              value={newTask.taskState}
              onChange={(e) => setNewTask({ ...newTask, taskState: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
            >
              <option value="TODO" className="bg-slate-800">To Do</option>
              <option value="IN_PROGRESS" className="bg-slate-800">In Progress</option>
              <option value="DONE" className="bg-slate-800">Done</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="px-6 py-3 text-sm font-medium text-slate-300 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onAddTask}
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
  );
};

export default AddTaskModal;
