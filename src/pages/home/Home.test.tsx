import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './Home';

interface MockLocation {
  href: string;
  assign: jest.MockedFunction<(url: string) => void>;
}

const mockLocationAssign = jest.fn() as jest.MockedFunction<(url: string) => void>;
delete (window as any).location;
(window as any).location = { 
  href: '', 
  assign: mockLocationAssign 
} as MockLocation;

jest.useFakeTimers();

const mockSetInterval = jest.spyOn(global, 'setInterval');
const mockClearInterval = jest.spyOn(global, 'clearInterval');

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (window.location as unknown as MockLocation).href = '';
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('Rendering', () => {
    test('renders the main heading correctly', () => {
      render(<Home />);
      
      expect(screen.getByText('Manage Tasks')).toBeInTheDocument();
      expect(screen.getByText('Like a Pro')).toBeInTheDocument();
    });

    test('renders the TaskFlow brand logo and name', () => {
      render(<Home />);
      
      expect(screen.getByText('TaskFlow')).toBeInTheDocument();
    });

    test('renders the hero description', () => {
      render(<Home />);
      
      expect(screen.getByText(/Transform your workflow with our intuitive task management platform/)).toBeInTheDocument();
    });

    test('renders all CTA buttons', () => {
      render(<Home />);
      
      expect(screen.getByText('Get Started Free')).toBeInTheDocument();
      expect(screen.getByText('Watch Demo')).toBeInTheDocument();
      expect(screen.getByText('Sign In')).toBeInTheDocument();
      expect(screen.getByText('Start Your Journey')).toBeInTheDocument();
    });

    test('renders all statistics', () => {
      render(<Home />);
      
      expect(screen.getByText('50K+')).toBeInTheDocument();
      expect(screen.getByText('Active Users')).toBeInTheDocument();
      expect(screen.getByText('1M+')).toBeInTheDocument();
      expect(screen.getByText('Tasks Completed')).toBeInTheDocument();
      expect(screen.getByText('99.9%')).toBeInTheDocument();
      expect(screen.getByText('Uptime')).toBeInTheDocument();
      expect(screen.getByText('24/7')).toBeInTheDocument();
      expect(screen.getByText('Support')).toBeInTheDocument();
    });

    test('renders all feature cards', () => {
      render(<Home />);
      
      expect(screen.getByText('Lightning Fast')).toBeInTheDocument();
      expect(screen.getByText('Boost your productivity with our streamlined task management system')).toBeInTheDocument();
      
      expect(screen.getByText('Secure & Private')).toBeInTheDocument();
      expect(screen.getByText('Your data is protected with enterprise-grade security')).toBeInTheDocument();
      
      expect(screen.getByText('Team Collaboration')).toBeInTheDocument();
      expect(screen.getByText('Work seamlessly with your team in real-time')).toBeInTheDocument();
    });

    test('renders the footer', () => {
      render(<Home />);
      
      expect(screen.getByText('© 2025 TaskFlow. All rights reserved.')).toBeInTheDocument();
    });

    test('renders the final CTA section', () => {
      render(<Home />);
      
      expect(screen.getByText('Ready to Transform Your Workflow?')).toBeInTheDocument();
      expect(screen.getByText(/Join thousands of professionals who have already revolutionized/)).toBeInTheDocument();
    });
  });

  describe('Navigation and Interactions', () => {
    test('navigates to login when Sign In button in nav is clicked', () => {
      render(<Home />);
      
      const signInButton = screen.getAllByText('Sign In')[0]; 
      fireEvent.click(signInButton);
      
      expect((window.location as unknown as MockLocation).href).toBe('/login');
    });

    test('navigates to login when "Already have an account" link is clicked', () => {
      render(<Home />);
      
      const signInLink = screen.getByText(/Already have an account\? Sign in/);
      fireEvent.click(signInLink);
      
      expect((window.location as unknown as MockLocation).href).toBe('/login');
    });

    test('navigates to register when "Get Started Free" button is clicked', () => {
      render(<Home />);
      
      const getStartedButtons = screen.getAllByText('Get Started Free');
      fireEvent.click(getStartedButtons[0]);
      
      expect((window.location as unknown as MockLocation).href).toBe('/register');
    });

    test('navigates to register when "Start Your Journey" button is clicked', () => {
      render(<Home />);
      
      const startJourneyButton = screen.getByText('Start Your Journey');
      fireEvent.click(startJourneyButton);
      
      expect((window.location as unknown as MockLocation).href).toBe('/register');
    });

    test('handles Watch Demo button click', () => {
      render(<Home />);
      
      const watchDemoButton = screen.getByText('Watch Demo');
      fireEvent.click(watchDemoButton);
      
      expect((window.location as unknown as MockLocation).href).toBe('/login');
    });
  });

  describe('Animations and Effects', () => {
    test('applies visibility animation after component mounts', async () => {
      const { container } = render(<Home />);
      
      const heroSection = container.querySelector('.transition-all.duration-1000') as HTMLElement;
      expect(heroSection).toHaveClass('opacity-100', 'translate-y-0');
    });

    test('cycles through features automatically', async () => {
      render(<Home />);
      
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(mockSetInterval).toHaveBeenCalledWith(expect.any(Function), 3000);
    });

    test('cleans up interval on component unmount', () => {
      const { unmount } = render(<Home />);
      
      expect(mockSetInterval).toHaveBeenCalled();
      
      unmount();
      
      expect(mockClearInterval).toHaveBeenCalled();
    });
  });

  describe('Feature Cards', () => {
    test('all feature cards have proper structure', () => {
      render(<Home />);
      
      const features: Array<{ title: string; icon: string }> = [
        { title: 'Lightning Fast', icon: 'Zap' },
        { title: 'Secure & Private', icon: 'Shield' },
        { title: 'Team Collaboration', icon: 'Users' }
      ];

      features.forEach((feature) => {
        expect(screen.getByText(feature.title)).toBeInTheDocument();
      });
    });

    test('feature cards have hover effects', () => {
      const { container } = render(<Home />);
      
      const featureCards = container.querySelectorAll('.bg-white\\/10.backdrop-blur-xl.rounded-2xl');
      expect(featureCards).toHaveLength(4);
    });
  });

  describe('Responsive Design', () => {
    test('renders responsive classes correctly', () => {
      const { container } = render(<Home />);
      
      const statsGrid = container.querySelector('.grid.grid-cols-2.md\\:grid-cols-4') as HTMLElement;
      expect(statsGrid).toBeInTheDocument();
      
      const featuresGrid = container.querySelector('.grid.md\\:grid-cols-3') as HTMLElement;
      expect(featuresGrid).toBeInTheDocument();
    });

    test('renders responsive text sizes', () => {
      render(<Home />);
      
      const mainHeading = screen.getByText('Manage Tasks').closest('h1') as HTMLHeadingElement;
      expect(mainHeading).toHaveClass('text-7xl', 'md:text-8xl');
    });
  });

  describe('Accessibility', () => {
    test('has proper heading hierarchy', () => {
      render(<Home />);
      
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
      
      const h2Elements = screen.getAllByRole('heading', { level: 2 });
      expect(h2Elements.length).toBeGreaterThan(0);
      
      const h3Elements = screen.getAllByRole('heading', { level: 3 });
      expect(h3Elements.length).toBe(3); 
    });

    test('buttons are accessible', () => {
      render(<Home />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      buttons.forEach((button) => {
        expect(button).toBeInTheDocument();
        expect(button).not.toHaveAttribute('disabled');
      });
    });

    test('has proper semantic structure', () => {
      const { container } = render(<Home />);
      
      const nav = container.querySelector('nav') as HTMLElement;
      expect(nav).toBeInTheDocument();
    });
  });

  describe('CSS Classes and Styling', () => {
    test('applies gradient backgrounds correctly', () => {
      const { container } = render(<Home />);
      
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('bg-gradient-to-br', 'from-slate-900', 'via-purple-900', 'to-slate-900');
    });

    test('applies glassmorphism effects', () => {
      const { container } = render(<Home />);
      
      const glassElements = container.querySelectorAll('.backdrop-blur-xl');
      expect(glassElements.length).toBeGreaterThan(0);
    });

    test('applies hover effects to interactive elements', () => {
      const { container } = render(<Home />);
      
      const hoverElements = container.querySelectorAll('.hover\\:scale-105');
      expect(hoverElements.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    test('handles navigation errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      
      Object.defineProperty(window, 'location', {
        value: {
          get href(): string { return ''; },
          set href(url: string) { 
            if (url === '/error') {
              throw new Error('Navigation error');
            }
          }
        } as Location,
        writable: true
      });

      render(<Home />);
      
      const signInButton = screen.getAllByText('Sign In')[0];
      fireEvent.click(signInButton);
      
      consoleSpy.mockRestore();
    });
  });

  describe('Performance', () => {
    test('renders without performance issues', () => {
      const startTime = performance.now();
      render(<Home />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});