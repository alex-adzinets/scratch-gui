import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './help-icon.css';

const HelpIcon = ({
    size = 'medium',
    onClick = () => {},
    disabled = false,
    ariaLabel = 'Help',
    tooltip = null,
    className = ''
}) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const [isActive, setIsActive] = React.useState(false);

    const handleClick = React.useCallback((e) => {
        if (!disabled) {
            onClick(e);
        }
    }, [disabled, onClick]);

    const handleKeyDown = React.useCallback((e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick(e);
        }
    }, [disabled, onClick]);

    const handleMouseEnter = React.useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = React.useCallback(() => {
        setIsHovered(false);
        setIsActive(false);
    }, []);
    const handleMouseDown = React.useCallback(() => setIsActive(true), []);
    const handleMouseUp = React.useCallback(() => setIsActive(false), []);
    const handleFocus = React.useCallback(() => setIsFocused(true), []);
    const handleBlur = React.useCallback(() => setIsFocused(false), []);

    const iconClasses = classNames(
        styles.helpIcon,
        styles[`size${size.charAt(0).toUpperCase() + size.slice(1)}`],
        {
            [styles.hover]: isHovered && !disabled,
            [styles.active]: isActive && !disabled,
            [styles.focus]: isFocused && !disabled,
            [styles.disabled]: disabled
        },
        className
    );

    return (
        <button
            className={iconClasses}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            aria-label={ariaLabel}
            title={tooltip}
            type="button"
        >
            <div className={styles.backgroundLayer}>
                <span className={styles.questionMark}>?</span>
            </div>
        </button>
    );
};

HelpIcon.propTypes = {
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    ariaLabel: PropTypes.string,
    tooltip: PropTypes.string,
    className: PropTypes.string
};

export default HelpIcon;