// context/TaskContext.tsx
import { createContext, useEffect, useState, type ReactNode } from 'react';
import { taskService } from '../services/task/taskService';
import { managerService } from '../services/manager/managerService';
import { developerService } from '../services/developer/developerService';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

import type { Task, TaskRequest, UpdateRequest } from '../types/task-type/Task';
import type { Developer } from '../types/developer-type/Developer';

interface TaskContextType {
  tasks: Task[];
  developers: Developer[];
  loadTasks: () => Promise<void>;
  loadDevelopers: () => Promise<void>;
  addTask: (data: TaskRequest) => Promise<void>;
  assignTask: (taskId: number, developerId: string) => Promise<void>;
  addDeveloperToTeam: (developerId: string, managerId: string) => Promise<void>;
  updateTask: (taskId: number, task: UpdateRequest) => Promise<any>;
  isLoading: boolean;
}

export const TaskContext = createContext<TaskContextType>({} as TaskContextType);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadTasks = async () => {
    if (!user) return;
    
    try {
      const res = await taskService.tasks();
      setTasks(res.data.data);
    } catch (err) {
      console.error('Error loading tasks:', err);
      toast.error('Failed to load tasks');
    }
  };

  const loadDevelopers = async () => {
    if (!user) return;
    
    try {
      const res = await developerService.developers();
      setDevelopers(res.data.data); 
    } catch (err) {
      console.error('Error loading developers:', err);
      toast.error('Failed to load developers');
    }
  };

  const addTask = async (task: TaskRequest) => {
    try {
      setIsLoading(true);
      await taskService.add(task);
      await loadTasks();
      toast.success('Task added successfully!');
    } catch (err) {
      console.error('Error adding task:', err);
      toast.error('Failed to add task');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const assignTask = async (taskId: number, developerId: string) => {
    try {
      setIsLoading(true);
      await managerService.assignedTaskToDeveloper(taskId, developerId);
      await loadTasks();
      toast.success('Task assigned successfully!');
    } catch (err) {
      console.error('Error assigning task:', err);
      toast.error('Failed to assign task');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateTask = async (taskId: number, task: UpdateRequest) => {
    try {
      setIsLoading(true);
      const response = await taskService.update(taskId, task);
      await loadTasks();
      toast.success('Task updated successfully!');
      return response; 
    } catch (err) {
      console.error('Error updating task:', err);
      toast.error('Failed to update task');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addDeveloperToTeam = async (developerId: string, managerId: string) => {
    try {
      setIsLoading(true);
      await managerService.addDeveloperToTeam(managerId, developerId);
      await loadTasks();
      toast.success('Developer added to team successfully!');
    } catch (err) {
      console.error('Error adding developer to team:', err);
      toast.error('Failed to add developer to team');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadTasks();
      loadDevelopers();
    } else {
      setTasks([]);
      setDevelopers([]);
    }
  }, [user]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        developers,
        loadTasks,
        loadDevelopers,
        addTask,
        assignTask,
        addDeveloperToTeam,
        updateTask,
        isLoading,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};



