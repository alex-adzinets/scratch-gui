import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '../src/components/icon-button/icon-button.jsx';
import { ComingSoonTooltip } from '../src/components/coming-soon/coming-soon.jsx';
import helpIcon from './help-icon.svg';
import styles from './HelpButton.module.css';

const HelpButton = ({ className, onClick, disabled }) => {
  const handleHelpClick = () => {
    if (onClick) {
      onClick();
    } else {
      console.log('Help button clicked');
    }
  };

  return (
    <ComingSoonTooltip
      tooltipId="help-button-tooltip"
      className={styles.tooltipWrapper}
      place="bottom"
      delayShow={200}
      delayHide={100}
    >
      <IconButton
        img={helpIcon}
        title=""
        onClick={handleHelpClick}
        disabled={disabled}
        className={`${styles.helpButton} ${className || ''}`}
      />
    </ComingSoonTooltip>
  );
};

HelpButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
};

export default HelpButton;