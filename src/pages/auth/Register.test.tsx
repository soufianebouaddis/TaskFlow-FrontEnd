import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import authService from '../../services/auth/authService';
import Register from './RegisterPage';


jest.mock('../../services/auth/authService', () => ({
  register: jest.fn()
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

global.alert = jest.fn();

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Register Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    test('renders register form with all required fields', () => {
      renderWithRouter(<Register />);
      
      expect(screen.getByText('Create Account')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('John')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Doe')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('john.doe@example.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Select your role')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Confirm')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    test('renders role options correctly', () => {
      renderWithRouter(<Register />);
      
      const roleSelect = screen.getByDisplayValue('Select your role');
      fireEvent.click(roleSelect);
      
      expect(screen.getByText('Developer')).toBeInTheDocument();
      expect(screen.getByText('Project Manager')).toBeInTheDocument();
    });

    test('shows developer type field when developer role is selected', () => {
      renderWithRouter(<Register />);
      
      const roleSelect = screen.getByDisplayValue('Select your role');
      fireEvent.change(roleSelect, { target: { value: 'DEVELOPER' } });
      
      expect(screen.getByDisplayValue('Select developer type')).toBeInTheDocument();
    });

    test('hides developer type field when manager role is selected', () => {
      renderWithRouter(<Register />);
      
      const roleSelect = screen.getByDisplayValue('Select your role');
      fireEvent.change(roleSelect, { target: { value: 'MANAGER' } });
      
      expect(screen.queryByDisplayValue('Select developer type')).not.toBeInTheDocument();
    });

    test('renders developer type options when developer is selected', () => {
      renderWithRouter(<Register />);
      
      const roleSelect = screen.getByDisplayValue('Select your role');
      fireEvent.change(roleSelect, { target: { value: 'DEVELOPER' } });
      
      const devTypeSelect = screen.getByDisplayValue('Select developer type');
      fireEvent.click(devTypeSelect);
      
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
      expect(screen.getByText('Backend Developer')).toBeInTheDocument();
      expect(screen.getByText('Tester')).toBeInTheDocument();
    });

    test('renders sign in link', () => {
      renderWithRouter(<Register />);
      
      const signInLink = screen.getByText('Sign in');
      expect(signInLink).toBeInTheDocument();
      expect(signInLink).toHaveAttribute('href', '/login');
    });
  });

  describe('Form Interactions', () => {
    test('updates form fields when user types', () => {
      renderWithRouter(<Register />);
      
      const firstNameInput = screen.getByPlaceholderText('John') as HTMLInputElement;
      const lastNameInput = screen.getByPlaceholderText('Doe') as HTMLInputElement;
      const emailInput = screen.getByPlaceholderText('john.doe@example.com') as HTMLInputElement;
      const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm') as HTMLInputElement;
      
      fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
      fireEvent.change(lastNameInput, { target: { value: 'Smith' } });
      fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      
      expect(firstNameInput.value).toBe('Jane');
      expect(lastNameInput.value).toBe('Smith');
      expect(emailInput.value).toBe('jane@example.com');
      expect(passwordInput.value).toBe('password123');
      expect(confirmPasswordInput.value).toBe('password123');
    });

    test('updates role selection', () => {
      renderWithRouter(<Register />);
      
      const roleSelect = screen.getByDisplayValue('Select your role') as HTMLSelectElement;
      fireEvent.change(roleSelect, { target: { value: 'DEVELOPER' } });
      
      expect(roleSelect.value).toBe('DEVELOPER');
    });

    test('updates developer type selection', () => {
      renderWithRouter(<Register />);
      
      const roleSelect = screen.getByDisplayValue('Select your role') as HTMLSelectElement;
      fireEvent.change(roleSelect, { target: { value: 'DEVELOPER' } });
      
      const devTypeSelect = screen.getByDisplayValue('Select developer type') as HTMLSelectElement;
      fireEvent.change(devTypeSelect, { target: { value: 'FRONTEND' } });
      
      expect(devTypeSelect.value).toBe('FRONTEND');
    });

    test('toggles password visibility', () => {
      renderWithRouter(<Register />);
      
      const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;
      const toggleButton = passwordInput.parentElement?.querySelector('button') as HTMLButtonElement;
      
      expect(passwordInput.type).toBe('password');
      
      fireEvent.click(toggleButton);
      expect(passwordInput.type).toBe('text');
      
      fireEvent.click(toggleButton);
      expect(passwordInput.type).toBe('password');
    });

    test('toggles confirm password visibility', () => {
      renderWithRouter(<Register />);
      
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm') as HTMLInputElement;
      const toggleButton = confirmPasswordInput.parentElement?.querySelector('button') as HTMLButtonElement;
      
      expect(confirmPasswordInput.type).toBe('password');
      
      fireEvent.click(toggleButton);
      expect(confirmPasswordInput.type).toBe('text');
      
      fireEvent.click(toggleButton);
      expect(confirmPasswordInput.type).toBe('password');
    });
  });

  describe('Form Validation', () => {
    const fillBasicForm = () => {
      fireEvent.change(screen.getByPlaceholderText('John'), { target: { value: 'Jane' } });
      fireEvent.change(screen.getByPlaceholderText('Doe'), { target: { value: 'Smith' } });
      fireEvent.change(screen.getByPlaceholderText('john.doe@example.com'), { target: { value: 'jane@example.com' } });
      fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
      fireEvent.change(screen.getByPlaceholderText('Confirm'), { target: { value: 'password123' } });
    };

    test('shows error when passwords do not match', () => {
      renderWithRouter(<Register />);
      
      fillBasicForm();
      fireEvent.change(screen.getByPlaceholderText('Confirm'), { target: { value: 'differentpassword' } });
      fireEvent.change(screen.getByDisplayValue('Select your role'), { target: { value: 'MANAGER' } });
      
      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);
      
      expect(global.alert).toHaveBeenCalledWith('Passwords do not match');
    });

    test('shows error when no role is selected', () => {
      renderWithRouter(<Register />);
      
      fillBasicForm();
      
      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);
      
      expect(global.alert).toHaveBeenCalledWith('Please select a role');
    });

    test('shows error when developer is selected but no developer type', () => {
      renderWithRouter(<Register />);
      
      fillBasicForm();
      fireEvent.change(screen.getByDisplayValue('Select your role'), { target: { value: 'DEVELOPER' } });
      
      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);
      
      expect(global.alert).toHaveBeenCalledWith('Please select developer type');
    });
  });

  describe('Form Submission', () => {
    const fillCompleteForm = (role = 'MANAGER', devType = null) => {
      fireEvent.change(screen.getByPlaceholderText('John'), { target: { value: 'Jane' } });
      fireEvent.change(screen.getByPlaceholderText('Doe'), { target: { value: 'Smith' } });
      fireEvent.change(screen.getByPlaceholderText('john.doe@example.com'), { target: { value: 'jane@example.com' } });
      fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
      fireEvent.change(screen.getByPlaceholderText('Confirm'), { target: { value: 'password123' } });
      fireEvent.change(screen.getByDisplayValue('Select your role'), { target: { value: role } });
      
      if (role === 'DEVELOPER' && devType) {
        fireEvent.change(screen.getByDisplayValue('Select developer type'), { target: { value: devType } });
      }
    };

    test('submits form successfully for manager role', async () => {
      authService.register.mockResolvedValue({});
      renderWithRouter(<Register />);
      
      fillCompleteForm('MANAGER');
      
      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(authService.register).toHaveBeenCalledWith({
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          password: 'password123',
          role: 'MANAGER',
          developerType: null
        });
      });
      
      expect(mockNavigate).toHaveBeenCalledWith('/tasks');
    });

    test('submits form successfully for developer role', async () => {
      authService.register.mockResolvedValue({});
      renderWithRouter(<Register />);
      
      fillCompleteForm('DEVELOPER', 'FRONTEND');
      
      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(authService.register).toHaveBeenCalledWith({
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          password: 'password123',
          role: 'DEVELOPER',
          developerType: 'FRONTEND'
        });
      });
      
      expect(mockNavigate).toHaveBeenCalledWith('/tasks');
    });

    test('shows loading state during submission', async () => {
      authService.register.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      renderWithRouter(<Register />);
      
      fillCompleteForm('MANAGER');
      
      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);
      
      expect(submitButton).toBeDisabled();
      expect(screen.getByRole('button')).toHaveClass('disabled:opacity-50');
      
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });

    test('handles registration failure', async () => {
      const error = new Error('Registration failed');
      authService.register.mockRejectedValue(error);
      renderWithRouter(<Register />);
      
      fillCompleteForm('MANAGER');
      
      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Registration failed');
      });
      
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    test('resets loading state after failure', async () => {
      const error = new Error('Registration failed');
      authService.register.mockRejectedValue(error);
      renderWithRouter(<Register />);
      
      fillCompleteForm('MANAGER');
      
      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe('Accessibility', () => {
    test('has proper form labels', () => {
      renderWithRouter(<Register />);
      
      expect(screen.getByLabelText('First Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
      expect(screen.getByLabelText('Role')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    });

    test('has required attributes on form fields', () => {
      renderWithRouter(<Register />);
      
      expect(screen.getByPlaceholderText('John')).toBeRequired();
      expect(screen.getByPlaceholderText('Doe')).toBeRequired();
      expect(screen.getByPlaceholderText('john.doe@example.com')).toBeRequired();
      expect(screen.getByDisplayValue('Select your role')).toBeRequired();
      expect(screen.getByPlaceholderText('Password')).toBeRequired();
      expect(screen.getByPlaceholderText('Confirm')).toBeRequired();
    });

    test('shows developer type as required when developer role is selected', () => {
      renderWithRouter(<Register />);
      
      fireEvent.change(screen.getByDisplayValue('Select your role'), { target: { value: 'DEVELOPER' } });
      
      expect(screen.getByDisplayValue('Select developer type')).toBeRequired();
    });
  });
});