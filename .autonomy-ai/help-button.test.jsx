import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import HelpButton from './HelpButton.jsx';

// Mock the components
jest.mock('../src/components/icon-button/icon-button.jsx', () => {
  return function MockIconButton({ onClick, disabled, className, title, img }) {
    return (
      <button 
        onClick={onClick} 
        disabled={disabled} 
        className={className}
        data-testid="icon-button"
      >
        <img src={img} alt={title} />
      </button>
    );
  };
});

jest.mock('../src/components/coming-soon/coming-soon.jsx', () => ({
  ComingSoonTooltip: function MockComingSoonTooltip({ children, tooltipId, className }) {
    return (
      <div className={className} data-tooltip-id={tooltipId} data-testid="coming-soon-tooltip">
        {children}
      </div>
    );
  }
}));

jest.mock('./HelpButton.module.css', () => ({
  tooltipWrapper: 'tooltipWrapper',
  helpButton: 'helpButton'
}));

jest.mock('./help-icon.svg', () => 'help-icon.svg');

const renderWithIntl = (component) => {
  return render(
    <IntlProvider locale="en">
      {component}
    </IntlProvider>
  );
};

describe('HelpButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  test('renders correctly', () => {
    const { getByTestId } = renderWithIntl(<HelpButton />);
    
    expect(getByTestId('coming-soon-tooltip')).toBeInTheDocument();
    expect(getByTestId('icon-button')).toBeInTheDocument();
  });

  test('renders with ComingSoonTooltip wrapper', () => {
    const { getByTestId } = renderWithIntl(<HelpButton />);
    
    const tooltip = getByTestId('coming-soon-tooltip');
    expect(tooltip).toHaveAttribute('data-tooltip-id', 'help-button-tooltip');
  });

  test('renders IconButton with correct props', () => {
    const { getByTestId } = renderWithIntl(<HelpButton />);
    
    const iconButton = getByTestId('icon-button');
    expect(iconButton).toBeInTheDocument();
    
    const img = iconButton.querySelector('img');
    expect(img).toHaveAttribute('src', 'help-icon.svg');
  });

  test('calls default handler when clicked', () => {
    const { getByTestId } = renderWithIntl(<HelpButton />);
    
    const iconButton = getByTestId('icon-button');
    fireEvent.click(iconButton);
    
    expect(console.log).toHaveBeenCalledWith('Help button clicked');
  });

  test('calls custom onClick handler when provided', () => {
    const mockOnClick = jest.fn();
    const { getByTestId } = renderWithIntl(<HelpButton onClick={mockOnClick} />);
    
    const iconButton = getByTestId('icon-button');
    fireEvent.click(iconButton);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(console.log).not.toHaveBeenCalled();
  });

  test('applies custom className', () => {
    const customClass = 'custom-help-button';
    const { getByTestId } = renderWithIntl(<HelpButton className={customClass} />);
    
    const iconButton = getByTestId('icon-button');
    expect(iconButton).toHaveClass('helpButton');
    expect(iconButton).toHaveClass(customClass);
  });

  test('handles disabled state', () => {
    const { getByTestId } = renderWithIntl(<HelpButton disabled />);
    
    const iconButton = getByTestId('icon-button');
    expect(iconButton).toBeDisabled();
  });

  test('does not call handler when disabled and clicked', () => {
    const mockOnClick = jest.fn();
    const { getByTestId } = renderWithIntl(<HelpButton onClick={mockOnClick} disabled />);
    
    const iconButton = getByTestId('icon-button');
    fireEvent.click(iconButton);
    
    expect(mockOnClick).not.toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalled();
  });

  test('has proper component hierarchy', () => {
    const { getByTestId } = renderWithIntl(<HelpButton />);
    
    const tooltip = getByTestId('coming-soon-tooltip');
    const iconButton = getByTestId('icon-button');
    
    expect(tooltip.contains(iconButton.getElement ? iconButton.getElement() : iconButton)).toBe(true);
  });
});