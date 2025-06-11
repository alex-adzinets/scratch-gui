// The following file was refactored by Autonomy AI
// Original file path: scratch-gui/src/components/coming-soon/coming-soon.jsx

import { useState, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { defineMessages, injectIntl, intlShape, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import ReactTooltip from 'react-tooltip';

import styles from './coming-soon.css';

import awwCatIcon from './aww-cat.png';
import coolCatIcon from './cool-cat.png';

const messages = defineMessages({
    message1: {
        defaultMessage: 'Don't worry, we're on it {emoji}',
        description: 'One of the "coming soon" random messages for yet-to-be-done features',
        id: 'gui.comingSoon.message1'
    },
    message2: {
        defaultMessage: 'Coming Soon...',
        description: 'One of the "coming soon" random messages for yet-to-be-done features',
        id: 'gui.comingSoon.message2'
    },
    message3: {
        defaultMessage: 'We're working on it {emoji}',
        description: 'One of the "coming soon" random messages for yet-to-be-done features',
        id: 'gui.comingSoon.message3'
    }
});

// Custom hook for random message generation
const useRandomMessage = () => {
    const images = useMemo(() => [awwCatIcon, coolCatIcon], []);
    
    const getRandomMessage = useCallback(() => {
        const messageKeys = Object.keys(messages);
        const messageNumber = Math.floor(Math.random() * messageKeys.length) + 1;
        const imageNumber = Math.floor(Math.random() * images.length);
        
        return (
            <FormattedMessage
                {...messages[`message${messageNumber}`]}
                values={{
                    emoji: (
                        <img
                            className={styles.comingSoonImage}
                            src={images[imageNumber]}
                            alt="Coming soon emoji"
                        />
                    )
                }}
            />
        );
    }, [images]);

    return getRandomMessage;
};

const ComingSoonContent = ({ className, place, tooltipId }) => {
    const [isShowing, setIsShowing] = useState(false);
    const getRandomMessage = useRandomMessage();

    const handleShow = useCallback(() => {
        setIsShowing(true);
    }, []);

    const handleHide = useCallback(() => {
        setIsShowing(false);
    }, []);

    const tooltipClassName = useMemo(() => classNames(
        styles.comingSoon,
        className,
        {
            [styles.show]: isShowing,
            [styles.left]: place === 'left',
            [styles.right]: place === 'right',
            [styles.top]: place === 'top',
            [styles.bottom]: place === 'bottom'
        }
    ), [className, isShowing, place]);

    return (
        <ReactTooltip
            afterHide={handleHide}
            afterShow={handleShow}
            className={tooltipClassName}
            getContent={getRandomMessage}
            id={tooltipId}
        />
    );
};

ComingSoonContent.propTypes = {
    className: PropTypes.string,
    place: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
    tooltipId: PropTypes.string.isRequired
};

ComingSoonContent.defaultProps = {
    place: 'bottom'
};

const ComingSoon = injectIntl(ComingSoonContent);

const ComingSoonTooltip = ({ 
    children, 
    className, 
    delayHide, 
    delayShow, 
    place, 
    tooltipClassName, 
    tooltipId 
}) => (
    <div className={className}>
        <div
            data-delay-hide={delayHide}
            data-delay-show={delayShow}
            data-effect="solid"
            data-for={tooltipId}
            data-place={place}
            data-tip="tooltip"
        >
            {children}
        </div>
        <ComingSoon
            className={tooltipClassName}
            place={place}
            tooltipId={tooltipId}
        />
    </div>
);

ComingSoonTooltip.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    delayHide: PropTypes.number,
    delayShow: PropTypes.number,
    place: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
    tooltipClassName: PropTypes.string,
    tooltipId: PropTypes.string.isRequired
};

ComingSoonTooltip.defaultProps = {
    delayHide: 0,
    delayShow: 0,
    place: 'bottom'
};

export {
    ComingSoon as ComingSoonComponent,
    ComingSoonTooltip
};
