import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { useAuth } from '../../context/useAuth';
import { useTaskContext } from '../../context/useTask';
import authService from '../../services/auth/authService';
import { taskService } from '../../services/task/taskService';
import TaskPage from './TaskPage';

// Mock the dependencies
jest.mock('../../context/useAuth');
jest.mock('../../context/useTask');
jest.mock('../../services/auth/authService');
jest.mock('../../services/task/taskService');
jest.mock('../../components/EditTaskModal', () => {
  return function MockEditTaskModal({ onClose, onSave }: any) {
    return (
      <div data-testid="edit-task-modal">
        <button onClick={onClose}>Close</button>
        <button onClick={onSave}>Save</button>
      </div>
    );
  };
});
jest.mock('../../components/AddTaskModal', () => {
  return function MockAddTaskModal({ onClose, onAddTask }: any) {
    return (
      <div data-testid="add-task-modal">
        <button onClick={onClose}>Close</button>
        <button onClick={onAddTask}>Add Task</button>
      </div>
    );
  };
});
jest.mock('../../components/AssignTaskModal', () => {
  return function MockAssignTaskModal({ onClose, onAssign }: any) {
    return (
      <div data-testid="assign-task-modal">
        <button onClick={onClose}>Close</button>
        <button onClick={() => onAssign(1)}>Assign</button>
      </div>
    );
  };
});
jest.mock('../../components/Profile', () => {
  return function MockProfileModal({ onClose, onUpdate }: any) {
    return (
      <div data-testid="profile-modal">
        <button onClick={onClose}>Close</button>
        <button onClick={onUpdate}>Update</button>
      </div>
    );
  };
});

// Mock Header component since it's not imported
jest.mock('../../components/Header', () => {
  return function MockHeader({ user, onOpenProfile, onLogout }: any) {
    return (
      <div data-testid="header">
        <span>{user?.firstName} {user?.lastName}</span>
        <button onClick={onOpenProfile}>Profile</button>
        <button onClick={onLogout}>Logout</button>
      </div>
    );
  };
});

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseTaskContext = useTaskContext as jest.MockedFunction<typeof useTaskContext>;
const mockAuthService = authService as jest.Mocked<typeof authService>;
const mockTaskService = taskService as jest.Mocked<typeof taskService>;

describe('TaskPage', () => {
  const mockManagerUser = {
    id: 1,
    firstName: 'John',
    lastName: 'Manager',
    email: 'manager@example.com',
    role: 'MANAGER' as const,
    developerDetails: {
      team: [
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Developer',
          email: 'jane@example.com',
          developerType: 'Frontend Developer'
        },
        {
          id: 3,
          firstName: 'Bob',
          lastName: 'Developer',
          email: 'bob@example.com',
          developerType: 'Backend Developer'
        }
      ]
    }
  };

  const mockDeveloperUser = {
    id: 2,
    firstName: 'Jane',
    lastName: 'Developer',
    email: 'jane@example.com',
    role: 'DEVELOPER' as const,
    developerDetails: {
      tasks: [
        {
          id: 1,
          taskLabel: 'Developer Task 1',
          taskState: 'TODO' as const,
          assignedTo: 2
        },
        {
          id: 2,
          taskLabel: 'Developer Task 2',
          taskState: 'IN_PROGRESS' as const,
          assignedTo: 2
        }
      ]
    }
  };

  const mockTasks = [
    {
      id: 1,
      taskLabel: 'Task 1',
      taskState: 'TODO' as const,
      assignedTo: 2
    },
    {
      id: 2,
      taskLabel: 'Task 2',
      taskState: 'IN_PROGRESS' as const,
      assignedTo: 2
    },
    {
      id: 3,
      taskLabel: 'Task 3',
      taskState: 'DONE' as const,
      assignedTo: 3
    }
  ];

  const mockDevelopers = [
    { id: 2, firstName: 'Jane', lastName: 'Developer', email: 'jane@example.com' },
    { id: 3, firstName: 'Bob', lastName: 'Developer', email: 'bob@example.com' }
  ];

  const mockTaskContextValue = {
    tasks: mockTasks,
    developers: mockDevelopers,
    addTask: jest.fn(),
    assignTask: jest.fn(),
    loadTasks: jest.fn(),
    updateTask: jest.fn(),
    isLoading: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseAuth.mockReturnValue({
      user: mockManagerUser,
      fetchUser: jest.fn(),
      logout: jest.fn(),
      login: jest.fn(),
      register: jest.fn(),
      isLoading: false,
      error: null
    });

    mockUseTaskContext.mockReturnValue(mockTaskContextValue);
  });

  describe('Manager Role Tests', () => {
    it('renders manager dashboard with stats cards', () => {
      render(<TaskPage />);

      // Check if stats cards are rendered
      expect(screen.getByText('Developers')).toBeInTheDocument();
      expect(screen.getByText('To Do')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();

      // Check stats values
      expect(screen.getByText('2')).toBeInTheDocument(); // Developers count
      expect(screen.getByText('1')).toBeInTheDocument(); // TODO tasks count
    });

    it('displays team members section for manager', () => {
      render(<TaskPage />);

      expect(screen.getByText('Team Members')).toBeInTheDocument();
      expect(screen.getByText('Jane Developer')).toBeInTheDocument();
      expect(screen.getByText('Bob Developer')).toBeInTheDocument();
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
      expect(screen.getByText('Backend Developer')).toBeInTheDocument();
    });

    it('shows Add New Task button for manager', () => {
      render(<TaskPage />);

      const addTaskButton = screen.getByText('Add New Task');
      expect(addTaskButton).toBeInTheDocument();
    });

    it('opens add task modal when Add New Task button is clicked', async () => {
      const user = userEvent.setup();
      render(<TaskPage />);

      const addTaskButton = screen.getByText('Add New Task');
      await user.click(addTaskButton);

      expect(screen.getByTestId('add-task-modal')).toBeInTheDocument();
    });

    it('displays assign and delete buttons for tasks when manager', () => {
      render(<TaskPage />);

      // Should show assign buttons (UserPlus icons)
      const assignButtons = screen.getAllByTitle('Assign task');
      expect(assignButtons).toHaveLength(mockTasks.length);

      // Should show delete buttons (Trash icons)
      const deleteButtons = screen.getAllByTitle('Delete task');
      expect(deleteButtons).toHaveLength(mockTasks.length);
    });

    it('opens assign task modal when assign button is clicked', async () => {
      const user = userEvent.setup();
      render(<TaskPage />);

      const assignButton = screen.getAllByTitle('Assign task')[0];
      await user.click(assignButton);

      expect(screen.getByTestId('assign-task-modal')).toBeInTheDocument();
    });

    it('calls deleteTask when delete button is clicked', async () => {
      const user = userEvent.setup();
      mockTaskService.deleteTask.mockResolvedValue(undefined);
      render(<TaskPage />);

      const deleteButton = screen.getAllByTitle('Delete task')[0];
      await user.click(deleteButton);

      expect(mockTaskService.deleteTask).toHaveBeenCalledWith(1);
      expect(mockTaskContextValue.loadTasks).toHaveBeenCalled();
    });
  });

  describe('Developer Role Tests', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: mockDeveloperUser,
        fetchUser: jest.fn(),
        logout: jest.fn(),
        login: jest.fn(),
        register: jest.fn(),
        isLoading: false,
        error: null
      });
    });

    it('does not show manager-specific elements for developer', () => {
      render(<TaskPage />);

      expect(screen.queryByText('Developers')).not.toBeInTheDocument();
      expect(screen.queryByText('Team Members')).not.toBeInTheDocument();
      expect(screen.queryByText('Add New Task')).not.toBeInTheDocument();
    });

    it('shows status change buttons for developer', () => {
      render(<TaskPage />);

      // Should show status buttons for developer tasks
      expect(screen.getAllByText('TODO')).toHaveLength(2); // One in column header, one in button
      expect(screen.getAllByText('IN PROGRESS')).toHaveLength(2);
      expect(screen.getAllByText('DONE')).toHaveLength(1);
    });

    it('shows edit buttons for developer tasks', () => {
      render(<TaskPage />);

      const editButtons = screen.getAllByTitle('Edit task');
      expect(editButtons).toHaveLength(2); // Two tasks for the developer
    });

    it('opens edit task modal when edit button is clicked', async () => {
      const user = userEvent.setup();
      render(<TaskPage />);

      const editButton = screen.getAllByTitle('Edit task')[0];
      await user.click(editButton);

      expect(screen.getByTestId('edit-task-modal')).toBeInTheDocument();
    });

    it('does not show assign/delete buttons for developer', () => {
      render(<TaskPage />);

      expect(screen.queryByTitle('Assign task')).not.toBeInTheDocument();
      expect(screen.queryByTitle('Delete task')).not.toBeInTheDocument();
    });
  });

  describe('Task Organization Tests', () => {
    it('organizes tasks by status correctly', () => {
      render(<TaskPage />);

      // Check column headers
      expect(screen.getByText('TODO')).toBeInTheDocument();
      expect(screen.getByText('IN PROGRESS')).toBeInTheDocument();
      expect(screen.getByText('DONE')).toBeInTheDocument();

      // Check task counts in column headers
      const todoSection = screen.getByText('TODO').closest('.bg-white\\/10');
      const inProgressSection = screen.getByText('IN PROGRESS').closest('.bg-white\\/10');
      const doneSection = screen.getByText('DONE').closest('.bg-white\\/10');

      expect(todoSection).toContainElement(screen.getByText('1'));
      expect(inProgressSection).toContainElement(screen.getByText('1'));
      expect(doneSection).toContainElement(screen.getByText('1'));
    });

    it('displays empty state when no tasks in column', () => {
      mockUseTaskContext.mockReturnValue({
        ...mockTaskContextValue,
        tasks: []
      });

      render(<TaskPage />);

      expect(screen.getAllByText('No tasks in this column')).toHaveLength(3);
    });
  });

  describe('Modal Interactions', () => {
    it('handles add task modal interactions', async () => {
      const user = userEvent.setup();
      render(<TaskPage />);

      // Open modal
      const addTaskButton = screen.getByText('Add New Task');
      await user.click(addTaskButton);

      expect(screen.getByTestId('add-task-modal')).toBeInTheDocument();

      // Close modal
      const closeButton = screen.getByText('Close');
      await user.click(closeButton);

      expect(screen.queryByTestId('add-task-modal')).not.toBeInTheDocument();
    });

    it('handles profile modal interactions', async () => {
      const user = userEvent.setup();
      render(<TaskPage />);

      // Open profile modal
      const profileButton = screen.getByText('Profile');
      await user.click(profileButton);

      expect(screen.getByTestId('profile-modal')).toBeInTheDocument();

      // Close modal
      const closeButton = screen.getByText('Close');
      await user.click(closeButton);

      expect(screen.queryByTestId('profile-modal')).not.toBeInTheDocument();
    });

    it('calls updateProfile when profile is updated', async () => {
      const user = userEvent.setup();
      const mockFetchUser = jest.fn();
      mockUseAuth.mockReturnValue({
        user: mockManagerUser,
        fetchUser: mockFetchUser,
        logout: jest.fn(),
        login: jest.fn(),
        register: jest.fn(),
        isLoading: false,
        error: null
      });

      mockAuthService.updateProfile.mockResolvedValue(undefined);
      render(<TaskPage />);

      // Open profile modal
      const profileButton = screen.getByText('Profile');
      await user.click(profileButton);

      // Update profile
      const updateButton = screen.getByText('Update');
      await user.click(updateButton);

      expect(mockAuthService.updateProfile).toHaveBeenCalled();
      expect(mockFetchUser).toHaveBeenCalled();
    });
  });

  describe('Loading States', () => {
    it('shows loading overlay when isLoading is true', () => {
      mockUseTaskContext.mockReturnValue({
        ...mockTaskContextValue,
        isLoading: true
      });

      render(<TaskPage />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('does not show loading overlay when modal is open', () => {
      mockUseTaskContext.mockReturnValue({
        ...mockTaskContextValue,
        isLoading: true
      });

      render(<TaskPage />);

      // Open add task modal
      fireEvent.click(screen.getByText('Add New Task'));

      // Loading overlay should not be shown when modal is open
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  describe('Task Assignment', () => {
    it('calls assignTask when task is assigned', async () => {
      const user = userEvent.setup();
      render(<TaskPage />);

      // Open assign modal
      const assignButton = screen.getAllByTitle('Assign task')[0];
      await user.click(assignButton);

      // Assign task
      const assignModalButton = screen.getByText('Assign');
      await user.click(assignModalButton);

      expect(mockTaskContextValue.assignTask).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('useEffect Hook', () => {
    it('calls loadTasks when user is available', () => {
      render(<TaskPage />);

      expect(mockTaskContextValue.loadTasks).toHaveBeenCalled();
    });

    it('does not call loadTasks when user is null', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        fetchUser: jest.fn(),
        logout: jest.fn(),
        login: jest.fn(),
        register: jest.fn(),
        isLoading: false,
        error: null
      });

      render(<TaskPage />);

      expect(mockTaskContextValue.loadTasks).not.toHaveBeenCalled();
    });
  });
});