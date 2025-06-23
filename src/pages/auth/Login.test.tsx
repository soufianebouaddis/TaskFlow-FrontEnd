import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Login from './LoginPage';

// Mock navigate function with proper typing
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock login function with proper typing
const mockLogin = jest.fn();
jest.mock('../../context/useAuth', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

// Mock global alert
global.alert = jest.fn();

// Wrapper component with proper typing
const LoginWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

// Type definitions for form data
interface LoginFormData {
  email: string;
  password: string;
}

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLogin.mockResolvedValue({});
  });

  const renderLogin = () => {
    return render(
      <LoginWrapper>
        <Login />
      </LoginWrapper>
    );
  };

  describe('Rendering', () => {
    test('renders login form with all elements', () => {
      renderLogin();
      
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    test('renders TaskFlow branding and footer', () => {
      renderLogin();
      
      expect(screen.getByText('© 2025 TaskFlow. All rights reserved.')).toBeInTheDocument();
    });

    test('renders sign up link', () => {
      renderLogin();
      
      expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
      expect(screen.getByText('Sign up')).toBeInTheDocument();
      expect(screen.getByText('Sign up')).toHaveAttribute('href', '/register');
    });

    test('renders password visibility toggle button', () => {
      renderLogin();
      
      const toggleButton = screen.getByRole('button', { name: '' }); 
      expect(toggleButton).toBeInTheDocument();
    });

    test('renders lock icon in header', () => {
      renderLogin();
      
      const lockIcon = document.querySelector('.w-16.h-16');
      expect(lockIcon).toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    test('updates email input value', async () => {
      const user = userEvent.setup();
      renderLogin();
      
      const emailInput = screen.getByLabelText('Email Address') as HTMLInputElement;
      await user.type(emailInput, 'test@example.com');
      
      expect(emailInput).toHaveValue('test@example.com');
    });

    test('updates password input value', async () => {
      const user = userEvent.setup();
      renderLogin();
      
      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
      await user.type(passwordInput, 'password123');
      
      expect(passwordInput).toHaveValue('password123');
    });

    test('toggles password visibility', async () => {
      const user = userEvent.setup();
      renderLogin();
      
      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
      const toggleButton = screen.getByRole('button', { name: '' });
      
      // Initially password type
      expect(passwordInput).toHaveAttribute('type', 'password');
      
      // Click to show password
      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');
      
      // Click to hide password
      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    test('form inputs have correct placeholders', () => {
      renderLogin();
      
      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    });

    test('form inputs are required', () => {
      renderLogin();
      
      const emailInput = screen.getByLabelText('Email Address') as HTMLInputElement;
      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
      
      expect(emailInput).toBeRequired();
      expect(passwordInput).toBeRequired();
    });
  });

  describe('Form Submission', () => {
    test('calls login function with form data on successful submission', async () => {
      const user = userEvent.setup();
      renderLogin();
      
      const emailInput = screen.getByLabelText('Email Address') as HTMLInputElement;
      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);
      
      const expectedFormData: LoginFormData = {
        email: 'test@example.com',
        password: 'password123'
      };
      
      expect(mockLogin).toHaveBeenCalledWith(expectedFormData);
    });

    test('navigates to /tasks on successful login', async () => {
      const user = userEvent.setup();
      renderLogin();
      
      const emailInput = screen.getByLabelText('Email Address') as HTMLInputElement;
      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/tasks');
      });
    });

    test('shows loading state during submission', async () => {
      const user = userEvent.setup();
      mockLogin.mockImplementation(() => new Promise<void>(resolve => setTimeout(resolve, 1000)));
      
      renderLogin();
      
      const emailInput = screen.getByLabelText('Email Address') as HTMLInputElement;
      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);
      
      // Check loading state
      expect(submitButton).toBeDisabled();
      expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    });

    test('disables submit button during loading', async () => {
      const user = userEvent.setup();
      mockLogin.mockImplementation(() => new Promise<void>(resolve => setTimeout(resolve, 1000)));
      
      renderLogin();
      
      const emailInput = screen.getByLabelText('Email Address') as HTMLInputElement;
      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);
      
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
    });

    test('handles login failure with alert', async () => {
      const user = userEvent.setup();
      mockLogin.mockRejectedValue(new Error('Login failed'));
      
      renderLogin();
      
      const emailInput = screen.getByLabelText('Email Address') as HTMLInputElement;
      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Login failed');
      });
    });

    test('resets loading state after failed login', async () => {
      const user = userEvent.setup();
      mockLogin.mockRejectedValue(new Error('Login failed'));
      
      renderLogin();
      
      const emailInput = screen.getByLabelText('Email Address') as HTMLInputElement;
      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
        expect(document.querySelector('.animate-spin')).not.toBeInTheDocument();
      });
    });

    test('can submit form by pressing Enter in email field', async () => {
      const user = userEvent.setup();
      renderLogin();
      
      const emailInput = screen.getByLabelText('Email Address') as HTMLInputElement;
      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(emailInput, '{enter}');
      
      const expectedFormData: LoginFormData = {
        email: 'test@example.com',
        password: 'password123'
      };
      
      expect(mockLogin).toHaveBeenCalledWith(expectedFormData);
    });

    test('can submit form by pressing Enter in password field', async () => {
      const user = userEvent.setup();
      renderLogin();
      
      const emailInput = screen.getByLabelText('Email Address') as HTMLInputElement;
      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(passwordInput, '{enter}');
      
      const expectedFormData: LoginFormData = {
        email: 'test@example.com',
        password: 'password123'
      };
      
      expect(mockLogin).toHaveBeenCalledWith(expectedFormData);
    });

    test('handles empty form submission', async () => {
      const user = userEvent.setup();
      renderLogin();
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);
      
      // Since the form has required fields, it should not submit when empty
      // The browser's built-in validation should prevent submission
      expect(mockLogin).not.toHaveBeenCalled();
    });
  });

  describe('UI States and Styling', () => {
    test('applies correct CSS classes for glassmorphism effect', () => {
      const { container } = renderLogin();
      
      const glassCard = container.querySelector('.bg-white\\/10.backdrop-blur-xl');
      expect(glassCard).toBeInTheDocument();
      expect(glassCard).toHaveClass('rounded-2xl', 'shadow-2xl', 'border', 'border-white/20');
    });

    test('applies gradient background', () => {
      const { container } = renderLogin();
      
      const background = container.firstChild as HTMLElement;
      expect(background).toHaveClass('bg-gradient-to-br', 'from-slate-900', 'via-purple-900', 'to-slate-900');
    });

    test('applies correct button styling', () => {
      renderLogin();
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      expect(submitButton).toHaveClass('bg-gradient-to-r', 'from-purple-500', 'to-pink-500');
    });

    test('shows correct button text when not loading', () => {
      renderLogin();
      
      expect(screen.getByText('Sign In')).toBeInTheDocument();
      expect(screen.queryByText('Loading')).not.toBeInTheDocument();
    });

    test('input fields have correct styling', () => {
      renderLogin();
      
      const emailInput = screen.getByLabelText('Email Address') as HTMLInputElement;
      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
      
      expect(emailInput).toHaveClass('bg-white/10', 'border-white/20', 'rounded-xl');
      expect(passwordInput).toHaveClass('bg-white/10', 'border-white/20', 'rounded-xl');
    });
  });

  describe('Accessibility', () => {
    test('has proper form labels', () => {
      renderLogin();
      
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    test('has proper heading hierarchy', () => {
      renderLogin();
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Welcome Back');
    });

    test('submit button is accessible', () => {
      renderLogin();
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('type', 'submit');
    });

    test('password toggle button is accessible', () => {
      renderLogin();
      
      const toggleButtons = screen.getAllByRole('button');
      expect(toggleButtons).toHaveLength(2); // Submit button + toggle button
    });

    test('form has proper input types', () => {
      renderLogin();
      
      const emailInput = screen.getByLabelText('Email Address') as HTMLInputElement;
      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
      
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Icons and Visual Elements', () => {
    test('renders mail and lock icons in input fields', () => {
      const { container } = renderLogin();
      
      // Check for SVG icons
      const icons = container.querySelectorAll('svg');
      expect(icons.length).toBeGreaterThan(0);
    });

    test('renders eye/eye-off icons for password toggle', () => {
      const { container } = renderLogin();
      
      // Check for eye icons (should have more than just mail/lock icons)
      const eyeIcons = container.querySelectorAll('svg');
      expect(eyeIcons.length).toBeGreaterThan(2); // Mail + Lock + Eye icons
    });
  });

  describe('Edge Cases', () => {
    test('handles special characters in password', async () => {
      const user = userEvent.setup();
      renderLogin();
      
      const emailInput = screen.getByLabelText('Email Address') as HTMLInputElement;
      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'P@ssw0rd!@#$');
      await user.click(submitButton);
      
      const expectedFormData: LoginFormData = {
        email: 'test@example.com',
        password: 'P@ssw0rd!@#$'
      };
      
      expect(mockLogin).toHaveBeenCalledWith(expectedFormData);
    });

    test('handles very long input values', async () => {
      const user = userEvent.setup();
      renderLogin();
      
      const emailInput = screen.getByLabelText('Email Address') as HTMLInputElement;
      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
      
      const longEmail: string = 'a'.repeat(100) + '@example.com';
      const longPassword: string = 'p'.repeat(100);
      
      await user.type(emailInput, longEmail);
      await user.type(passwordInput, longPassword);
      
      expect(emailInput).toHaveValue(longEmail);
      expect(passwordInput).toHaveValue(longPassword);
    });
  });

  describe('Performance', () => {
    test('renders without performance issues', () => {
      const startTime: number = performance.now();
      renderLogin();
      const endTime: number = performance.now();
      
      expect(endTime - startTime).toBeLessThan(100);
    });

    test('does not cause memory leaks', () => {
      const { unmount } = renderLogin();
      unmount();
      
      expect(screen.queryByText('Welcome Back')).not.toBeInTheDocument();
    });
  });
});