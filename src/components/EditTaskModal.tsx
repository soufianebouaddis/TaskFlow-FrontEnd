// components/EditTaskModal.tsx
import React, { useState, useEffect } from 'react';
import type { Task } from '../types/task-type/Task';
import { taskService } from '../services/task/taskService';
import { useAuth } from '../context/useAuth';

interface EditTaskModalProps {
    task: Task;
    onClose: () => void;
    onSave: () => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, onClose, onSave }) => {
    const [editedTask, setEditedTask] = useState<Task>(task);
    const {fetchUser} = useAuth();
    useEffect(() => {
        setEditedTask(task);
    }, [task]);

    const handleSave = async () => {
        try {
            await taskService.update(editedTask.id, editedTask);
            await fetchUser();
            onSave();
        } catch (error) {
            console.error('Failed to update task', error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl shadow-xl w-full max-w-md p-6">
                <h3 className="text-lg font-bold mb-6 text-white">Edit Task</h3>

                <div className="mb-4">
                    <label className="block text-sm text-slate-300 mb-1">Task Label</label>
                    <input
                        type="text"
                        className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={editedTask.taskLabel}
                        onChange={(e) => setEditedTask({ ...editedTask, taskLabel: e.target.value })}
                        placeholder="Enter task label"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm text-slate-300 mb-1">Status</label>
                    <select
                        value={editedTask.taskState}
                        onChange={(e) => setEditedTask({ ...editedTask, taskState: e.target.value })}
                        className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                            backgroundPosition: 'right 0.5rem center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '1.5em 1.5em',
                            paddingRight: '2.5rem'
                        }}
                    >
                        <option value="TODO" className="bg-slate-800 text-white">TODO</option>
                        <option value="IN_PROGRESS" className="bg-slate-800 text-white">IN PROGRESS</option>
                        <option value="DONE" className="bg-slate-800 text-white">DONE</option>
                    </select>
                </div>

                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-white/10 text-slate-300 border border-white/10 hover:bg-white/20 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-100 border border-purple-500/30 hover:from-purple-500/50 hover:to-pink-500/50 transition"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditTaskModal;