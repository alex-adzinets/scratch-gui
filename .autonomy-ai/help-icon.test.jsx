import React from 'react';
import { mount, shallow } from 'enzyme';
import { IntlProvider } from 'react-intl';
import HelpIcon from './help-icon';

describe('HelpIcon', () => {
    const mockOnClick = jest.fn();
    const defaultProps = {
        onClick: mockOnClick
    };

    const mountWithIntl = (node) => {
        return mount(
            <IntlProvider locale="en">
                {node}
            </IntlProvider>
        );
    };

    beforeEach(() => {
        mockOnClick.mockClear();
    });

    describe('Rendering', () => {
        test('renders without crashing', () => {
            const wrapper = mountWithIntl(<HelpIcon {...defaultProps} />);
            expect(wrapper.find('button')).toHaveLength(1);
            expect(wrapper.find('.questionMark').text()).toBe('?');
        });

        test('applies correct size classes', () => {
            const sizes = ['small', 'medium', 'large'];
            sizes.forEach(size => {
                const wrapper = shallow(<HelpIcon {...defaultProps} size={size} />);
                const expectedClass = `size${size.charAt(0).toUpperCase() + size.slice(1)}`;
                expect(wrapper.hasClass(expectedClass)).toBe(true);
            });
        });

        test('applies custom className', () => {
            const wrapper = shallow(<HelpIcon {...defaultProps} className="custom-class" />);
            expect(wrapper.hasClass('custom-class')).toBe(true);
        });

        test('renders with correct aria-label', () => {
            const wrapper = shallow(<HelpIcon {...defaultProps} ariaLabel="Get help" />);
            expect(wrapper.prop('aria-label')).toBe('Get help');
        });

        test('renders with tooltip', () => {
            const wrapper = shallow(<HelpIcon {...defaultProps} tooltip="Click for help" />);
            expect(wrapper.prop('title')).toBe('Click for help');
        });

        test('renders background layer and question mark', () => {
            const wrapper = shallow(<HelpIcon {...defaultProps} />);
            expect(wrapper.find('.backgroundLayer')).toHaveLength(1);
            expect(wrapper.find('.questionMark')).toHaveLength(1);
        });
    });

    describe('Interaction', () => {
        test('calls onClick when clicked', () => {
            const wrapper = mountWithIntl(<HelpIcon {...defaultProps} />);
            wrapper.find('button').simulate('click');
            expect(mockOnClick).toHaveBeenCalledTimes(1);
        });

        test('does not call onClick when disabled', () => {
            const wrapper = mountWithIntl(<HelpIcon {...defaultProps} disabled />);
            wrapper.find('button').simulate('click');
            expect(mockOnClick).not.toHaveBeenCalled();
        });

        test('calls onClick on Enter key press', () => {
            const wrapper = mountWithIntl(<HelpIcon {...defaultProps} />);
            wrapper.find('button').simulate('keydown', { key: 'Enter' });
            expect(mockOnClick).toHaveBeenCalledTimes(1);
        });

        test('calls onClick on Space key press', () => {
            const wrapper = mountWithIntl(<HelpIcon {...defaultProps} />);
            wrapper.find('button').simulate('keydown', { key: ' ' });
            expect(mockOnClick).toHaveBeenCalledTimes(1);
        });

        test('does not call onClick on other key press', () => {
            const wrapper = mountWithIntl(<HelpIcon {...defaultProps} />);
            wrapper.find('button').simulate('keydown', { key: 'A' });
            expect(mockOnClick).not.toHaveBeenCalled();
        });
    });

    describe('Visual States', () => {
        test('applies hover state on mouse enter', () => {
            const wrapper = shallow(<HelpIcon {...defaultProps} />);
            wrapper.simulate('mouseenter');
            expect(wrapper.hasClass('hover')).toBe(true);
        });

        test('removes hover state on mouse leave', () => {
            const wrapper = shallow(<HelpIcon {...defaultProps} />);
            wrapper.simulate('mouseenter');
            wrapper.simulate('mouseleave');
            expect(wrapper.hasClass('hover')).toBe(false);
        });

        test('applies active state on mouse down', () => {
            const wrapper = shallow(<HelpIcon {...defaultProps} />);
            wrapper.simulate('mousedown');
            expect(wrapper.hasClass('active')).toBe(true);
        });

        test('applies focus state on focus', () => {
            const wrapper = shallow(<HelpIcon {...defaultProps} />);
            wrapper.simulate('focus');
            expect(wrapper.hasClass('focus')).toBe(true);
        });

        test('removes focus state on blur', () => {
            const wrapper = shallow(<HelpIcon {...defaultProps} />);
            wrapper.simulate('focus');
            wrapper.simulate('blur');
            expect(wrapper.hasClass('focus')).toBe(false);
        });

        test('applies disabled class when disabled', () => {
            const wrapper = shallow(<HelpIcon {...defaultProps} disabled />);
            expect(wrapper.hasClass('disabled')).toBe(true);
        });
    });

    describe('Accessibility', () => {
        test('has correct button type', () => {
            const wrapper = shallow(<HelpIcon {...defaultProps} />);
            expect(wrapper.prop('type')).toBe('button');
        });

        test('has disabled attribute when disabled', () => {
            const wrapper = shallow(<HelpIcon {...defaultProps} disabled />);
            expect(wrapper.prop('disabled')).toBe(true);
        });

        test('has default aria-label', () => {
            const wrapper = shallow(<HelpIcon {...defaultProps} />);
            expect(wrapper.prop('aria-label')).toBe('Help');
        });
    });

    describe('Props Validation', () => {
        test('uses default props correctly', () => {
            const wrapper = shallow(<HelpIcon />);
            expect(wrapper.hasClass('sizeMedium')).toBe(true);
            expect(wrapper.prop('disabled')).toBe(false);
            expect(wrapper.prop('aria-label')).toBe('Help');
        });
    });
});