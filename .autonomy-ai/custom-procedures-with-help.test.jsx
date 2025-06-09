import React from 'react';
import { shallow, mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import { fireEvent } from '@testing-library/react';
import CustomProceduresWithHelp from './custom-procedures-with-help.jsx';
import CustomProcedures from '../src/containers/custom-procedures.jsx';
import IconButton from '../src/components/icon-button/icon-button.jsx';
import { ComingSoonTooltip } from '../src/components/coming-soon/coming-soon.jsx';

// Mock the help icon import
jest.mock('./assets/help-icon.svg', () => 'help-icon.svg');

// Mock child components
jest.mock('../src/containers/custom-procedures.jsx', () => {
  return function MockCustomProcedures(props) {
    return <div data-testid="custom-procedures" {...props} />;
  };
});

jest.mock('../src/components/icon-button/icon-button.jsx', () => {
  return function MockIconButton(props) {
    return (
      <button 
        data-testid="icon-button" 
        onClick={props.onClick}
        className={props.className}
      >
        {props.img && <img src={props.img} alt="" />}
        {props.title}
      </button>
    );
  };
});

jest.mock('../src/components/coming-soon/coming-soon.jsx', () => ({
  ComingSoonTooltip: function MockComingSoonTooltip(props) {
    return (
      <div 
        data-testid="coming-soon-tooltip"
        data-tooltip-id={props.tooltipId}
        data-place={props.place}
        className={props.className}
      >
        {props.children}
      </div>
    );
  }
}));

const defaultMessages = {
  'gui.customProcedures.help': {
    id: 'gui.customProcedures.help',
    defaultMessage: 'Help'
  }
};

const IntlWrapper = ({ children }) => (
  <IntlProvider locale="en" messages={defaultMessages}>
    {children}
  </IntlProvider>
);

describe('CustomProceduresWithHelp', () => {
  let wrapper;
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    consoleSpy.mockRestore();
  });

  describe('Component Rendering', () => {
    test('should render the component when isOpen is true', () => {
      wrapper = mount(
        <IntlWrapper>
          <CustomProceduresWithHelp />
        </IntlWrapper>
      );

      expect(wrapper.find('[data-testid="custom-procedures"]')).toHaveLength(1);
      expect(wrapper.find('[data-testid="icon-button"]')).toHaveLength(1);
      expect(wrapper.find('[data-testid="coming-soon-tooltip"]')).toHaveLength(1);
    });

    test('should not render anything when isOpen is false', () => {
      wrapper = mount(
        <IntlWrapper>
          <CustomProceduresWithHelp />
        </IntlWrapper>
      );

      // Simulate closing the modal
      const customProcedures = wrapper.find('[data-testid="custom-procedures"]');
      const onRequestClose = customProcedures.prop('onRequestClose');
      onRequestClose();

      wrapper.update();
      expect(wrapper.find('.custom-procedures-container')).toHaveLength(0);
    });

    test('should render help button with correct props', () => {
      wrapper = mount(
        <IntlWrapper>
          <CustomProceduresWithHelp />
        </IntlWrapper>
      );

      const tooltip = wrapper.find('[data-testid="coming-soon-tooltip"]');
      expect(tooltip.prop('data-tooltip-id')).toBe('custom-procedures-help');
      expect(tooltip.prop('data-place')).toBe('bottom');
      expect(tooltip.hasClass('help-button-wrapper')).toBe(true);

      const iconButton = wrapper.find('[data-testid="icon-button"]');
      expect(iconButton.hasClass('help-button')).toBe(true);
      expect(iconButton.find('img').prop('src')).toBe('help-icon.svg');
    });
  });

  describe('Event Handling', () => {
    test('should handle help button click without errors', () => {
      wrapper = mount(
        <IntlWrapper>
          <CustomProceduresWithHelp />
        </IntlWrapper>
      );

      const helpButton = wrapper.find('[data-testid="icon-button"]');
      
      expect(() => {
        fireEvent.click(helpButton.getDOMNode());
      }).not.toThrow();
    });

    test('should call handleRequestClose when CustomProcedures requests close', () => {
      wrapper = mount(
        <IntlWrapper>
          <CustomProceduresWithHelp />
        </IntlWrapper>
      );

      const customProcedures = wrapper.find('[data-testid="custom-procedures"]');
      const onRequestClose = customProcedures.prop('onRequestClose');
      const mockMutation = { test: 'mutation' };

      onRequestClose(mockMutation);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Custom procedure closed with mutation:',
        mockMutation
      );
    });

    test('should handle close without mutation parameter', () => {
      wrapper = mount(
        <IntlWrapper>
          <CustomProceduresWithHelp />
        </IntlWrapper>
      );

      const customProcedures = wrapper.find('[data-testid="custom-procedures"]');
      const onRequestClose = customProcedures.prop('onRequestClose');

      onRequestClose();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Custom procedure closed with mutation:',
        undefined
      );
    });
  });

  describe('Component Props', () => {
    test('should pass correct props to CustomProcedures', () => {
      wrapper = mount(
        <IntlWrapper>
          <CustomProceduresWithHelp />
        </IntlWrapper>
      );

      const customProcedures = wrapper.find('[data-testid="custom-procedures"]');
      expect(customProcedures.prop('isRtl')).toBe(false);
      expect(typeof customProcedures.prop('onRequestClose')).toBe('function');
    });

    test('should pass correct props to ComingSoonTooltip', () => {
      wrapper = mount(
        <IntlWrapper>
          <CustomProceduresWithHelp />
        </IntlWrapper>
      );

      const tooltip = wrapper.find('[data-testid="coming-soon-tooltip"]');
      expect(tooltip.prop('data-tooltip-id')).toBe('custom-procedures-help');
      expect(tooltip.prop('data-place')).toBe('bottom');
      expect(tooltip.hasClass('help-button-wrapper')).toBe(true);
    });

    test('should pass correct props to IconButton', () => {
      wrapper = mount(
        <IntlWrapper>
          <CustomProceduresWithHelp />
        </IntlWrapper>
      );

      const iconButton = wrapper.find('[data-testid="icon-button"]');
      expect(iconButton.find('img').prop('src')).toBe('help-icon.svg');
      expect(iconButton.hasClass('help-button')).toBe(true);
      expect(typeof iconButton.prop('onClick')).toBe('function');
    });
  });

  describe('State Management', () => {
    test('should initialize with isOpen state as true', () => {
      wrapper = mount(
        <IntlWrapper>
          <CustomProceduresWithHelp />
        </IntlWrapper>
      );

      expect(wrapper.find('.custom-procedures-container')).toHaveLength(1);
      expect(wrapper.find('[data-testid="custom-procedures"]')).toHaveLength(1);
    });

    test('should update isOpen state when handleRequestClose is called', () => {
      wrapper = mount(
        <IntlWrapper>
          <CustomProceduresWithHelp />
        </IntlWrapper>
      );

      // Initially should be open
      expect(wrapper.find('.custom-procedures-container')).toHaveLength(1);

      // Trigger close
      const customProcedures = wrapper.find('[data-testid="custom-procedures"]');
      const onRequestClose = customProcedures.prop('onRequestClose');
      onRequestClose();

      wrapper.update();

      // Should be closed now
      expect(wrapper.find('.custom-procedures-container')).toHaveLength(0);
    });
  });

  describe('Component Structure', () => {
    test('should have correct DOM structure', () => {
      wrapper = mount(
        <IntlWrapper>
          <CustomProceduresWithHelp />
        </IntlWrapper>
      );

      const container = wrapper.find('.custom-procedures-container');
      expect(container).toHaveLength(1);

      const header = wrapper.find('.modal-header');
      expect(header).toHaveLength(1);

      const tooltipWrapper = wrapper.find('.help-button-wrapper');
      expect(tooltipWrapper).toHaveLength(1);
    });

    test('should render components in correct hierarchy', () => {
      wrapper = mount(
        <IntlWrapper>
          <CustomProceduresWithHelp />
        </IntlWrapper>
      );

      const container = wrapper.find('.custom-procedures-container');
      const header = container.find('.modal-header');
      const tooltip = header.find('[data-testid="coming-soon-tooltip"]');
      const iconButton = tooltip.find('[data-testid="icon-button"]');

      expect(container.contains(header)).toBe(true);
      expect(header.contains(tooltip)).toBe(true);
      expect(tooltip.contains(iconButton)).toBe(true);
    });
  });
});