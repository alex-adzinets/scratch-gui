import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { ComingSoonTooltip } from '../src/components/coming-soon/coming-soon.jsx';
import styles from './HelpIcon.module.css';

const HelpIcon = ({
  helpContent,
  tooltipPosition,
  className,
  iconClassName,
  tooltipClassName,
  onClick,
  showOnHover,
  ariaLabel,
  disabled
}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const helpIconRef = useRef(null);
  const tooltipId = `help-tooltip-${Math.random().toString(36).substr(2, 9)}`;

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isFocused && e.key === 'Escape') {
        setIsTooltipVisible(false);
        helpIconRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFocused]);

  const handleClick = (e) => {
    if (disabled) return;
    
    e.preventDefault();
    e.stopPropagation();
    setIsTooltipVisible(!isTooltipVisible);
    
    if (onClick) {
      onClick(e);
    }
  };

  const handleFocus = () => {
    if (disabled) return;
    
    setIsFocused(true);
    if (!showOnHover) {
      setIsTooltipVisible(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleMouseEnter = () => {
    if (disabled) return;
    
    if (showOnHover) {
      setIsTooltipVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    
    if (showOnHover && !isFocused) {
      setIsTooltipVisible(false);
    }
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e);
    }
  };

  // Create the help icon content matching Figma design
  const helpIconContent = (
    <div
      ref={helpIconRef}
      className={classNames(
        styles.helpIconContainer,
        {
          [styles.disabled]: disabled,
          [styles.focused]: isFocused
        },
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={ariaLabel || 'Help'}
      aria-describedby={isTooltipVisible ? tooltipId : undefined}
      aria-disabled={disabled}
    >
      {/* Background element - positioned at 2px offset */}
      <div className={classNames(styles.helpIconBackground, iconClassName)} />
      
      {/* Question mark icon - centered with slight offset */}
      <div className={styles.helpIconSymbol}>
        ?
      </div>
    </div>
  );

  // Wrap with tooltip if help content is provided
  if (helpContent && !disabled) {
    return (
      <ComingSoonTooltip
        tooltipId={tooltipId}
        place={tooltipPosition}
        className={styles.tooltipWrapper}
        tooltipClassName={classNames(styles.helpTooltip, tooltipClassName)}
        delayShow={showOnHover ? 200 : 0}
        delayHide={showOnHover ? 200 : 0}
      >
        {helpIconContent}
      </ComingSoonTooltip>
    );
  }

  return helpIconContent;
};

HelpIcon.propTypes = {
  helpContent: PropTypes.node,
  tooltipPosition: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  className: PropTypes.string,
  iconClassName: PropTypes.string,
  tooltipClassName: PropTypes.string,
  onClick: PropTypes.func,
  showOnHover: PropTypes.bool,
  ariaLabel: PropTypes.string,
  disabled: PropTypes.bool
};

HelpIcon.defaultProps = {
  helpContent: 'Help information coming soon!',
  tooltipPosition: 'top',
  className: '',
  iconClassName: '',
  tooltipClassName: '',
  onClick: null,
  showOnHover: true,
  ariaLabel: 'Help',
  disabled: false
};

// Default export with no props as required
const DefaultHelpIcon = () => <HelpIcon />;

export default DefaultHelpIcon;
export { HelpIcon };