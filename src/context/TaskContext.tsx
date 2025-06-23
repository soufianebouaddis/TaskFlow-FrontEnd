// context/TaskContext.tsx
import { createContext, useEffect, useState, type ReactNode } from 'react';
import { taskService } from '../services/task/taskService';
import { managerService } from '../services/manager/managerService';
import { developerService } from '../services/developer/developerService';

import type { Task, TaskRequest, UpdateRequest } from '../types/task-type/Task';
import type { Developer } from '../types/developer-type/Developer';

interface TaskContextType {
  tasks: Task[];
  developers: Developer[];
  loadTasks: () => Promise<void>;
  addTask: (data: TaskRequest) => Promise<void>;
  assignTask: (taskId: number, developerId: number) => Promise<void>;
  updateTask: (taskId: number, task: any) => Promise<void>;
  isLoading: boolean;
}

export const TaskContext = createContext<TaskContextType>({} as TaskContextType);

export const TaskProvider = ({ children }: { children: ReactNode }) => {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadTasks = async () => {
    try {
      const res = await taskService.tasks();
      setTasks(res.data.data);
    } catch (err) {
      console.error('Error loading tasks:', err);
    }
  };

  const loadDevelopers = async () => {
    try {
      const res = await developerService.developers();
      setDevelopers(res.data.data); 
    } catch (err) {
      console.error('Error loading developers:', err);
    }
  };

  const addTask = async (task: TaskRequest) => {
    try {
      setIsLoading(true);
      await taskService.add(task);
      await loadTasks();
      window.location.reload(); 
    } catch (err) {
      console.error('Error adding task:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const assignTask = async (taskId: number, developerId: number) => {
    try {
      setIsLoading(true);
      await managerService.assignedTaskToDeveloper(taskId, developerId);
      await loadTasks();
    } catch (err) {
      console.error('Error assigning task:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateTask = async (taskId: number, task: UpdateRequest) => {
  try {
    setIsLoading(true);
    const response = await taskService.update(taskId, task);
    await loadTasks();
    return response; 
  } catch (err) {
    console.error('Error updating task:', err);
    throw err;
  } finally {
    setIsLoading(false);
  }
};
  useEffect(() => {
    loadTasks();
    loadDevelopers();
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        developers,
        loadTasks,
        addTask,
        assignTask,
        updateTask,
        isLoading,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};



