import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { useAuth } from '../../context/useAuth';
import { useTaskContext } from '../../context/useTask';
import authService from '../../services/auth/authService';
import { taskService } from '../../services/task/taskService';
import TaskPage from './TaskPage';

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
    id: '1',
    firstName: 'John',
    lastName: 'Manager',
    email: 'manager@example.com',
    role: 'MANAGER',
    password: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    developerDetails: {
      team: [
        {
          id: '2',
          firstName: 'Jane',
          lastName: 'Developer',
          email: 'jane@example.com',
          developerType: 'Frontend Developer',
          password: '',
          createdAt: new Date(),
          updatedAt: new Date(),
          role: 'DEVELOPER'
        },
        {
          id: '3',
          firstName: 'Bob',
          lastName: 'Developer',
          email: 'bob@example.com',
          developerType: 'Backend Developer',
          password: '',
          createdAt: new Date(),
          updatedAt: new Date(),
          role: 'DEVELOPER'
        }
      ]
    }
  };

  const mockDeveloperUser = {
    id: '2',
    firstName: 'Jane',
    lastName: 'Developer',
    email: 'jane@example.com',
    role: 'DEVELOPER',
    password: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    developerDetails: {
      tasks: [
        {
          id: 1,
          taskLabel: 'Developer Task 1',
          taskState: 'TODO',
          assignedTo: '2',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          taskLabel: 'Developer Task 2',
          taskState: 'IN_PROGRESS',
          assignedTo: '2',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    }
  };

  const mockTasks = [
    {
      id: 1,
      taskLabel: 'Task 1',
      taskState: 'TODO',
      assignedTo: '2',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      taskLabel: 'Task 2',
      taskState: 'IN_PROGRESS',
      assignedTo: '2',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      taskLabel: 'Task 3',
      taskState: 'DONE',
      assignedTo: '3',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const mockDevelopers = [
    { id: '2', firstName: 'Jane', lastName: 'Developer', email: 'jane@example.com', developerType: 'Frontend Developer', password: '', createdAt: new Date(), updatedAt: new Date(), role: 'DEVELOPER' },
    { id: '3', firstName: 'Bob', lastName: 'Developer', email: 'bob@example.com', developerType: 'Backend Developer', password: '', createdAt: new Date(), updatedAt: new Date(), role: 'DEVELOPER' }
  ];

  const mockTaskContextValue = {
    tasks: mockTasks,
    developers: mockDevelopers,
    addTask: jest.fn(),
    assignTask: jest.fn(),
    addDeveloperToTeam: jest.fn(),
    loadTasks: jest.fn(),
    loadDevelopers: jest.fn(),
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
      isLoading: false
    });

    mockUseTaskContext.mockReturnValue(mockTaskContextValue);
    mockTaskService.deleteTask.mockResolvedValue({ data: {} } as any);
    mockAuthService.updateProfile.mockResolvedValue({ data: {} } as any);
  });

  describe('Manager Role Tests', () => {
    it('renders manager dashboard with stats cards', () => {
      render(<TaskPage />);

      
      expect(screen.getByText('Developers')).toBeInTheDocument();
      expect(screen.getByText('To Do')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();


      expect(screen.getByTestId('developers-count')).toHaveTextContent('2');
      expect(screen.getByTestId('todo-count')).toHaveTextContent('1'); 
      expect(screen.getByTestId('inprogress-count')).toHaveTextContent('1'); 
      expect(screen.getByTestId('done-count')).toHaveTextContent('1'); 
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


      const assignButtons = screen.getAllByTitle('Assign task');
      expect(assignButtons).toHaveLength(mockTasks.length);


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
      mockTaskService.deleteTask.mockResolvedValue({ data: {} } as any);
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
        isLoading: false
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

    
      expect(screen.getAllByRole('button', { name: 'TODO' })).toHaveLength(2);
      expect(screen.getAllByRole('button', { name: 'IN PROGRESS' })).toHaveLength(2);
      expect(screen.getAllByRole('button', { name: 'DONE' })).toHaveLength(2);
    });

    it('shows edit buttons for developer tasks', () => {
      render(<TaskPage />);

      const editButtons = screen.getAllByTitle('Edit task');
      expect(editButtons).toHaveLength(2); 
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

      
      expect(screen.getByText('TODO')).toBeInTheDocument();
      expect(screen.getByText('IN PROGRESS')).toBeInTheDocument();
      expect(screen.getByText('DONE')).toBeInTheDocument();

      
      expect(screen.getByTestId('todo-count')).toHaveTextContent('1');
      expect(screen.getByTestId('inprogress-count')).toHaveTextContent('1');
      expect(screen.getByTestId('done-count')).toHaveTextContent('1');
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
        isLoading: false
      });

      mockAuthService.updateProfile.mockResolvedValue({ data: {} } as any);
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
    it('does not call loadTasks when user is null', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        fetchUser: jest.fn(),
        logout: jest.fn(),
        login: jest.fn(),
        isLoading: false
      });

      render(<TaskPage />);

      expect(mockTaskContextValue.loadTasks).not.toHaveBeenCalled();
    });
  });
});