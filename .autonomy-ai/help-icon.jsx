import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '../src/components/icon-button/icon-button.jsx';
import {ComingSoonTooltip} from '../src/components/coming-soon/coming-soon.jsx';

const HelpIcon = ({className, onClick, disabled}) => {
    const handleHelpClick = () => {
        if (onClick) {
            onClick();
        } else {
            // Default help functionality placeholder
            console.log('Help clicked');
        }
    };

    return (
        <ComingSoonTooltip
            tooltipId="help-icon-tooltip"
            place="bottom"
            delayShow={300}
            className={className}
        >
            <IconButton
                img="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIHN0cm9rZT0iIzU3NUU3NSIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTZWMTRNMTIgOEMxMC4zNDMxIDggOSA5LjM0MzE1IDkgMTFIMTFDMTEgMTAuNDQ3NyAxMS40NDc3IDEwIDEyIDEwQzEyLjU1MjMgMTAgMTMgMTAuNDQ3NyAxMyAxMUMxMyAxMiAxMiAxMi41IDEyIDE0IiBzdHJva2U9IiM1NzVFNzUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iMTgiIHI9IjEiIGZpbGw9IiM1NzVFNzUiLz4KPC9zdmc+"
                title=""
                onClick={handleHelpClick}
                disabled={disabled}
                className="help-icon-button"
            />
        </ComingSoonTooltip>
    );
};

HelpIcon.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool
};

export default HelpIcon;