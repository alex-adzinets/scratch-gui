// The following file was refactored by Autonomy AI
// Original file path: scratch-gui/src/components/coming-soon/coming-soon.jsx

import { useMemo, useState, useCallback } from 'react';
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
    return useMemo(() => {
        const images = [awwCatIcon, coolCatIcon];
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
                            alt="Cat emoji"
                        />
                    )
                }}
            />
        );
    }, []);
};

const ComingSoonContent = ({ className, place, tooltipId }) => {
    const [isShowing, setIsShowing] = useState(false);
    const randomMessage = useRandomMessage();

    const handleShow = useCallback(() => {
        // needed to set the opacity to 1, since the default is .9 on show
        setIsShowing(true);
    }, []);

    const handleHide = useCallback(() => {
        setIsShowing(false);
    }, []);

    const getContent = useCallback(() => randomMessage, [randomMessage]);

    return (
        <ReactTooltip
            afterHide={handleHide}
            afterShow={handleShow}
            className={classNames(
                styles.comingSoon,
                className,
                {
                    [styles.show]: isShowing,
                    [styles.left]: place === 'left',
                    [styles.right]: place === 'right',
                    [styles.top]: place === 'top',
                    [styles.bottom]: place === 'bottom'
                }
            )}
            getContent={getContent}
            id={tooltipId}
        />
    );
};

ComingSoonContent.propTypes = {
    className: PropTypes.string,
    intl: intlShape,
    place: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
    tooltipId: PropTypes.string.isRequired
};

ComingSoonContent.defaultProps = {
    place: 'bottom'
};

const ComingSoon = injectIntl(ComingSoonContent);

const ComingSoonTooltip = props => (
    <div className={props.className}>
        <div
            data-delay-hide={props.delayHide}
            data-delay-show={props.delayShow}
            data-effect="solid"
            data-for={props.tooltipId}
            data-place={props.place}
            data-tip="tooltip"
        >
            {props.children}
        </div>
        <ComingSoon
            className={props.tooltipClassName}
            place={props.place}
            tooltipId={props.tooltipId}
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
    delayShow: 0
};

export {
    ComingSoon as ComingSoonComponent,
    ComingSoonTooltip
};
