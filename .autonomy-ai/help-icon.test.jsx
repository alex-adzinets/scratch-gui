import React from 'react';
import {mount} from 'enzyme';
import {IntlProvider} from 'react-intl';
import HelpIcon from './help-icon.jsx';

describe('HelpIcon', () => {
    let wrapper;
    let mockConsoleLog;

    beforeEach(() => {
        mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
        if (wrapper) {
            wrapper.unmount();
        }
        mockConsoleLog.mockRestore();
    });

    test('renders without crashing', () => {
        wrapper = mount(
            <IntlProvider locale="en">
                <HelpIcon />
            </IntlProvider>
        );
        expect(wrapper.exists()).toBe(true);
    });

    test('renders IconButton component', () => {
        wrapper = mount(
            <IntlProvider locale="en">
                <HelpIcon />
            </IntlProvider>
        );
        const iconButton = wrapper.find('IconButton');
        expect(iconButton.exists()).toBe(true);
    });

    test('IconButton has correct props', () => {
        wrapper = mount(
            <IntlProvider locale="en">
                <HelpIcon />
            </IntlProvider>
        );
        const iconButton = wrapper.find('IconButton');
        expect(iconButton.prop('title')).toBe('');
        expect(typeof iconButton.prop('onClick')).toBe('function');
        expect(iconButton.prop('className')).toBe('help-icon-button');
    });

    test('renders ComingSoonTooltip wrapper', () => {
        wrapper = mount(
            <IntlProvider locale="en">
                <HelpIcon />
            </IntlProvider>
        );
        const tooltip = wrapper.find('ComingSoonTooltip');
        expect(tooltip.exists()).toBe(true);
        expect(tooltip.prop('tooltipId')).toBe('help-icon-tooltip');
        expect(tooltip.prop('place')).toBe('bottom');
        expect(tooltip.prop('delayShow')).toBe(300);
    });

    test('clicking help icon calls default console.log when no onClick prop provided', () => {
        wrapper = mount(
            <IntlProvider locale="en">
                <HelpIcon />
            </IntlProvider>
        );
        const iconButton = wrapper.find('IconButton');
        iconButton.prop('onClick')();
        expect(mockConsoleLog).toHaveBeenCalledWith('Help clicked');
    });

    test('clicking help icon calls custom onClick when provided', () => {
        const mockOnClick = jest.fn();
        wrapper = mount(
            <IntlProvider locale="en">
                <HelpIcon onClick={mockOnClick} />
            </IntlProvider>
        );
        const iconButton = wrapper.find('IconButton');
        iconButton.prop('onClick')();
        expect(mockOnClick).toHaveBeenCalled();
        expect(mockConsoleLog).not.toHaveBeenCalled();
    });

    test('passes disabled prop to IconButton', () => {
        wrapper = mount(
            <IntlProvider locale="en">
                <HelpIcon disabled={true} />
            </IntlProvider>
        );
        const iconButton = wrapper.find('IconButton');
        expect(iconButton.prop('disabled')).toBe(true);
    });

    test('passes className prop to ComingSoonTooltip', () => {
        const customClass = 'custom-help-class';
        wrapper = mount(
            <IntlProvider locale="en">
                <HelpIcon className={customClass} />
            </IntlProvider>
        );
        const tooltip = wrapper.find('ComingSoonTooltip');
        expect(tooltip.prop('className')).toBe(customClass);
    });
});