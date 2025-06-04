import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DefaultHelpIcon, { HelpIcon } from './HelpIcon';

describe('HelpIcon Component', () => {
  describe('Rendering', () => {
    test('renders default help icon without props', () => {
      render(<DefaultHelpIcon />);
      const helpButton = screen.getByRole('button', { name: /help/i });
      expect(helpButton).toBeInTheDocument();
    });

    test('renders with custom aria label', () => {
      render(<HelpIcon ariaLabel="Get assistance" />);
      const helpButton = screen.getByRole('button', { name: /get assistance/i });
      expect(helpButton).toBeInTheDocument();
    });

    test('renders with custom class names', () => {
      const { container } = render(
        <HelpIcon 
          className="custom-wrapper" 
          iconClassName="custom-icon"
          tooltipClassName="custom-tooltip"
        />
      );
      expect(container.querySelector('.custom-wrapper')).toBeInTheDocument();
      expect(container.querySelector('.custom-icon')).toBeInTheDocument();
    });

    test('renders with correct Figma design structure', () => {
      const { container } = render(<HelpIcon />);
      
      // Check main container
      const container24px = container.querySelector('[role="button"]');
      expect(container24px).toBeInTheDocument();
      
      // Check background element
      const background = container.querySelector('.helpIconBackground');
      expect(background).toBeInTheDocument();
      
      // Check question mark symbol
      const symbol = container.querySelector('.helpIconSymbol');
      expect(symbol).toBeInTheDocument();
      expect(symbol).toHaveTextContent('?');
    });

    test('renders disabled state correctly', () => {
      render(<HelpIcon disabled={true} />);
      const helpButton = screen.getByRole('button');
      expect(helpButton).toHaveAttribute('aria-disabled', 'true');
      expect(helpButton).toHaveAttribute('tabIndex', '-1');
    });
  });

  describe('Interactions', () => {
    test('handles click events when not disabled', () => {
      const handleClick = jest.fn();
      render(<HelpIcon onClick={handleClick} />);
      
      const helpButton = screen.getByRole('button');
      fireEvent.click(helpButton);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('does not handle click events when disabled', () => {
      const handleClick = jest.fn();
      render(<HelpIcon onClick={handleClick} disabled={true} />);
      
      const helpButton = screen.getByRole('button');
      fireEvent.click(helpButton);
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    test('toggles tooltip visibility on click when showOnHover is false', () => {
      render(<HelpIcon showOnHover={false} helpContent="Test help content" />);
      const helpButton = screen.getByRole('button');
      
      // Initial state - tooltip should be hidden
      expect(helpButton).not.toHaveAttribute('aria-describedby');
      
      // Click to show
      fireEvent.click(helpButton);
      expect(helpButton).toHaveAttribute('aria-describedby');
      
      // Click again to hide
      fireEvent.click(helpButton);
      expect(helpButton).not.toHaveAttribute('aria-describedby');
    });

    test('shows tooltip on hover when showOnHover is true', async () => {
      render(<HelpIcon showOnHover={true} helpContent="Test help content" />);
      const helpButton = screen.getByRole('button');
      
      // Hover to show
      fireEvent.mouseEnter(helpButton);
      await waitFor(() => {
        expect(helpButton).toHaveAttribute('aria-describedby');
      });
      
      // Leave to hide
      fireEvent.mouseLeave(helpButton);
      await waitFor(() => {
        expect(helpButton).not.toHaveAttribute('aria-describedby');
      });
    });

    test('does not show tooltip on hover when disabled', () => {
      render(<HelpIcon showOnHover={true} helpContent="Test help content" disabled={true} />);
      const helpButton = screen.getByRole('button');
      
      fireEvent.mouseEnter(helpButton);
      expect(helpButton).not.toHaveAttribute('aria-describedby');
    });
  });

  describe('Keyboard Navigation', () => {
    test('handles Enter key press', () => {
      const handleClick = jest.fn();
      render(<HelpIcon onClick={handleClick} />);
      
      const helpButton = screen.getByRole('button');
      helpButton.focus();
      
      fireEvent.keyDown(helpButton, { key: 'Enter', code: 'Enter' });
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('handles Space key press', () => {
      const handleClick = jest.fn();
      render(<HelpIcon onClick={handleClick} />);
      
      const helpButton = screen.getByRole('button');
      helpButton.focus();
      
      fireEvent.keyDown(helpButton, { key: ' ', code: 'Space' });
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('handles Escape key to hide tooltip', () => {
      render(<HelpIcon helpContent="Test help content" showOnHover={false} />);
      const helpButton = screen.getByRole('button');
      
      // Focus and show tooltip
      helpButton.focus();
      fireEvent.click(helpButton);
      expect(helpButton).toHaveAttribute('aria-describedby');
      
      // Press Escape
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
      expect(helpButton).not.toHaveAttribute('aria-describedby');
    });

    test('does not handle keyboard events when disabled', () => {
      const handleClick = jest.fn();
      render(<HelpIcon onClick={handleClick} disabled={true} />);
      
      const helpButton = screen.getByRole('button');
      fireEvent.keyDown(helpButton, { key: 'Enter', code: 'Enter' });
      
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    test('has correct ARIA attributes', () => {
      render(<HelpIcon helpContent="Test help content" />);
      const helpButton = screen.getByRole('button');
      
      expect(helpButton).toHaveAttribute('aria-label', 'Help');
      expect(helpButton).toHaveAttribute('tabIndex', '0');
      expect(helpButton).toHaveAttribute('aria-disabled', 'false');
    });

    test('has correct ARIA attributes when disabled', () => {
      render(<HelpIcon disabled={true} />);
      const helpButton = screen.getByRole('button');
      
      expect(helpButton).toHaveAttribute('aria-disabled', 'true');
      expect(helpButton).toHaveAttribute('tabIndex', '-1');
    });

    test('announces help content to screen readers', () => {
      const helpContent = 'This is helpful information';
      render(<HelpIcon helpContent={helpContent} ariaLabel="Get help" showOnHover={false} />);
      
      const helpButton = screen.getByRole('button', { name: /get help/i });
      
      // Click to show tooltip
      fireEvent.click(helpButton);
      expect(helpButton).toHaveAttribute('aria-describedby');
    });
  });

  describe('Edge Cases', () => {
    test('handles rapid clicks gracefully', () => {
      const handleClick = jest.fn();
      render(<HelpIcon onClick={handleClick} />);
      const helpButton = screen.getByRole('button');
      
      // Rapid clicks
      for (let i = 0; i < 5; i++) {
        fireEvent.click(helpButton);
      }
      
      expect(handleClick).toHaveBeenCalledTimes(5);
    });

    test('renders without help content', () => {
      render(<HelpIcon helpContent={null} />);
      const helpButton = screen.getByRole('button');
      expect(helpButton).toBeInTheDocument();
      expect(helpButton).not.toHaveAttribute('aria-describedby');
    });

    test('handles tooltip position prop correctly', () => {
      const positions = ['top', 'right', 'bottom', 'left'];
      positions.forEach(position => {
        const { unmount } = render(
          <HelpIcon tooltipPosition={position} helpContent="Test" />
        );
        const helpButton = screen.getByRole('button');
        expect(helpButton).toBeInTheDocument();
        unmount();
      });
    });

    test('maintains functionality on mobile viewport', () => {
      // Mock mobile viewport
      global.innerWidth = 375;
      global.innerHeight = 667;
      
      render(<HelpIcon />);
      const helpButton = screen.getByRole('button');
      
      // Test touch interaction
      fireEvent.click(helpButton);
      expect(helpButton).toBeInTheDocument();
    });
  });
});