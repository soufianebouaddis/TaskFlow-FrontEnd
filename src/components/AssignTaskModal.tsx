// components/AssignTaskModal.tsx
import React from 'react';
import { ArrowRight, Code, Mail, X } from 'lucide-react';

interface Developer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  developerType: string;
}

interface Task {
  id: string;
  taskLabel: string;
}

interface AssignTaskModalProps {
  selectedTask: Task;
  developers: Developer[];
  onAssign: (developerId: string) => void;
  onClose: () => void;
  isLoading: boolean;
}

const AssignTaskModal: React.FC<AssignTaskModalProps> = ({
  selectedTask,
  developers,
  onAssign,
  onClose,
  isLoading,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">Assign Task</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-slate-300 text-sm mb-4">
            Assign "{selectedTask.taskLabel}" to a developer:
          </p>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {developers.map((developer) => (
              <div
                key={developer.id}
                onClick={() => onAssign(developer.id)}
                className="flex items-center p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 cursor-pointer transition-all duration-200"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-white">
                    {developer.firstName} {developer.lastName}
                  </p>
                  <p className="text-xs text-slate-400">{developer.developerType}</p>
                  <p className="text-xs text-slate-400 flex items-center mt-1">
                    <Mail className="w-3 h-3 mr-1" />
                    {developer.email}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 text-sm font-medium text-slate-300 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignTaskModal;
