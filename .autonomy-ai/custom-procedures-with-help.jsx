import React from 'react';
import PropTypes from 'prop-types';
import CustomProcedures from '../src/containers/custom-procedures.jsx';
import IconButton from '../src/components/icon-button/icon-button.jsx';
import { ComingSoonTooltip } from '../src/components/coming-soon/coming-soon.jsx';
import helpIcon from './assets/help-icon.svg';

const CustomProceduresWithHelp = ({
  isRtl,
  mutator,
  options,
  onExternalClose
}) => {
  const [isOpen, setIsOpen] = React.useState(true);
  
  const handleRequestClose = React.useCallback((newMutation) => {
    console.log('Custom procedure closed with mutation:', newMutation);
    setIsOpen(false);
    if (onExternalClose) {
      onExternalClose(newMutation);
    }
  }, [onExternalClose]);
  
  const handleHelpClick = React.useCallback(() => {
    // Help functionality will be implemented later
  }, []);
  
  const renderHelpButton = () => (
    <ComingSoonTooltip
      tooltipId="custom-procedures-help"
      place="bottom"
      delayShow={200}
      delayHide={100}
      className="help-button-wrapper"
    >
      <IconButton
        img={helpIcon}
        title=""
        onClick={handleHelpClick}
        className="help-button"
      />
    </ComingSoonTooltip>
  );
  
  if (!isOpen) {
    return null;
  }
  
  return (
    <div className="custom-procedures-container">
      <div className="modal-header">
        {renderHelpButton()}
      </div>
      <CustomProcedures
        onRequestClose={handleRequestClose}
        isRtl={isRtl}
        mutator={mutator}
        options={options}
      />
      <style jsx>{`
        .custom-procedures-container {
          position: relative;
        }
        
        .modal-header {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 1000;
        }
        
        .help-button-wrapper {
          display: inline-block;
        }
        
        :global(.help-button) {
          width: 24px;
          height: 24px;
          padding: 4px;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0);
          transition: background-color 0.2s ease;
          cursor: pointer;
        }
        
        :global(.help-button:hover) {
          background-color: rgba(0, 0, 0, 0.08);
        }
        
        :global(.help-button img) {
          width: 8px;
          height: 10px;
          filter: invert(0.5);
          draggable: false;
        }
        
        :global(.help-button .icon) {
          width: 8px;
          height: 10px;
        }
        
        :global(.help-button .title) {
          display: none;
        }
      `}</style>
    </div>
  );
};

CustomProceduresWithHelp.propTypes = {
  isRtl: PropTypes.bool,
  mutator: PropTypes.instanceOf(Element),
  options: PropTypes.shape({
    media: PropTypes.string,
    zoom: PropTypes.shape({
      controls: PropTypes.bool,
      wheel: PropTypes.bool,
      startScale: PropTypes.number
    }),
    comments: PropTypes.bool,
    collapse: PropTypes.bool
  }),
  onExternalClose: PropTypes.func
};

CustomProceduresWithHelp.defaultProps = {
  isRtl: false,
  mutator: undefined,
  options: undefined,
  onExternalClose: undefined
};

export default CustomProceduresWithHelp;