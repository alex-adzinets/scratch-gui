// The following file was refactored by Autonomy AI
// Original file path: scratch-gui/src/containers/custom-procedures.jsx

import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import CustomProceduresComponent from '../components/custom-procedures/custom-procedures.jsx';
import ScratchBlocks from 'scratch-blocks';

/**
 * Deep merge objects with native JavaScript
 * @param {Object} target - Target object
 * @param {...Object} sources - Source objects to merge
 * @returns {Object} Merged object
 */
const deepMerge = (target, ...sources) => {
  if (!sources.length) return target;
  const source = sources.shift();

  if (source && typeof source === 'object' && !Array.isArray(source)) {
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
};

/**
 * Custom hook for managing block positioning logic
 * @param {Object} workspace - Scratch blocks workspace
 * @param {Object} mutationRoot - Root mutation block
 * @param {boolean} isRtl - Right-to-left layout flag
 * @param {number} rtlOffset - RTL positioning offset
 * @param {Function} setRtlOffset - Function to update RTL offset
 */
const useBlockPositioning = (workspace, mutationRoot, isRtl, rtlOffset, setRtlOffset) => {
  const positionBlock = useCallback(() => {
    if (!workspace || !mutationRoot) return;

    try {
      mutationRoot.onChangeFn();
      const metrics = workspace.getMetrics();
      const { x, y } = mutationRoot.getRelativeToSurfaceXY();
      const dy = (metrics.viewHeight / 2) - (mutationRoot.height / 2) - y;
      let dx;

      if (isRtl) {
        const ltrX = ((metrics.viewWidth / 2) - (mutationRoot.width / 2) + 25);
        const mirrorX = x - ((x - rtlOffset) * 2);
        
        if (mirrorX === ltrX) return;
        
        dx = mirrorX - ltrX;
        const midPoint = metrics.viewWidth / 2;
        
        if (x === 0) {
          if (mutationRoot.width < midPoint) {
            dx = ltrX;
          } else if (mutationRoot.width < metrics.viewWidth) {
            dx = midPoint - ((metrics.viewWidth - mutationRoot.width) / 2);
          } else {
            dx = midPoint + (mutationRoot.width - metrics.viewWidth);
          }
          mutationRoot.moveBy(dx, dy);
          setRtlOffset(mutationRoot.getRelativeToSurfaceXY().x);
          return;
        }
        
        if (mutationRoot.width > metrics.viewWidth) {
          dx = dx + mutationRoot.width - metrics.viewWidth;
        }
      } else {
        dx = (metrics.viewWidth / 2) - (mutationRoot.width / 2) - x;
        if (mutationRoot.width > metrics.viewWidth) {
          dx = metrics.viewWidth - mutationRoot.width - x;
        }
      }
      
      mutationRoot.moveBy(dx, dy);
    } catch (error) {
      console.error('Error positioning block:', error);
    }
  }, [workspace, mutationRoot, isRtl, rtlOffset, setRtlOffset]);

  return positionBlock;
};

/**
 * Custom hook for workspace setup and initialization
 * @param {Object} props - Component props
 * @param {Function} setWarp - Function to update warp state
 * @param {Function} setRtlOffset - Function to update RTL offset
 */
const useWorkspaceSetup = (props, setWarp, setRtlOffset) => {
  const workspaceRef = useRef(null);
  const mutationRootRef = useRef(null);
  const blocksRef = useRef(null);

  const positionBlock = useBlockPositioning(
    workspaceRef.current,
    mutationRootRef.current,
    props.isRtl,
    0,
    setRtlOffset
  );

  const setBlocks = useCallback((blocksElement) => {
    if (!blocksElement) return;

    try {
      blocksRef.current = blocksElement;
      
      const workspaceConfig = deepMerge(
        {},
        CustomProcedures.defaultOptions,
        props.options || {},
        { rtl: props.isRtl }
      );

      // Temporarily remove default toolbox
      const oldDefaultToolbox = ScratchBlocks.Blocks.defaultToolbox;
      ScratchBlocks.Blocks.defaultToolbox = null;
      
      workspaceRef.current = ScratchBlocks.inject(blocksElement, workspaceConfig);
      ScratchBlocks.Blocks.defaultToolbox = oldDefaultToolbox;

      // Create and configure procedure declaration block
      mutationRootRef.current = workspaceRef.current.newBlock('procedures_declaration');
      mutationRootRef.current.setMovable(false);
      mutationRootRef.current.setDeletable(false);
      mutationRootRef.current.contextMenu = false;

      // Add change listener for block positioning
      workspaceRef.current.addChangeListener(positionBlock);

      // Initialize block with mutation data
      if (props.mutator) {
        mutationRootRef.current.domToMutation(props.mutator);
      }
      
      mutationRootRef.current.initSvg();
      mutationRootRef.current.render();
      
      setWarp(mutationRootRef.current.getWarp());

      // Focus the block after initial positioning
      setTimeout(() => {
        if (mutationRootRef.current && mutationRootRef.current.focusLastEditor_) {
          mutationRootRef.current.focusLastEditor_();
        }
      }, 0);
    } catch (error) {
      console.error('Error setting up workspace:', error);
    }
  }, [props.options, props.isRtl, props.mutator, positionBlock, setWarp]);

  return {
    workspace: workspaceRef.current,
    mutationRoot: mutationRootRef.current,
    setBlocks
  };
};

/**
 * CustomProcedures component for creating and editing custom procedure blocks
 * @param {Object} props - Component props
 */
const CustomProcedures = (props) => {
  const [rtlOffset, setRtlOffset] = useState(0);
  const [warp, setWarp] = useState(false);

  const { workspace, mutationRoot, setBlocks } = useWorkspaceSetup(
    props,
    setWarp,
    setRtlOffset
  );

  // Cleanup workspace on unmount
  useEffect(() => {
    return () => {
      if (workspace) {
        try {
          workspace.dispose();
        } catch (error) {
          console.error('Error disposing workspace:', error);
        }
      }
    };
  }, [workspace]);

  const handleCancel = useCallback(() => {
    props.onRequestClose();
  }, [props]);

  const handleOk = useCallback(() => {
    try {
      const newMutation = mutationRoot ? mutationRoot.mutationToDom(true) : null;
      props.onRequestClose(newMutation);
    } catch (error) {
      console.error('Error creating mutation:', error);
      props.onRequestClose(null);
    }
  }, [mutationRoot, props]);

  const handleAddLabel = useCallback(() => {
    if (mutationRoot && mutationRoot.addLabelExternal) {
      try {
        mutationRoot.addLabelExternal();
      } catch (error) {
        console.error('Error adding label:', error);
      }
    }
  }, [mutationRoot]);

  const handleAddBoolean = useCallback(() => {
    if (mutationRoot && mutationRoot.addBooleanExternal) {
      try {
        mutationRoot.addBooleanExternal();
      } catch (error) {
        console.error('Error adding boolean:', error);
      }
    }
  }, [mutationRoot]);

  const handleAddTextNumber = useCallback(() => {
    if (mutationRoot && mutationRoot.addStringNumberExternal) {
      try {
        mutationRoot.addStringNumberExternal();
      } catch (error) {
        console.error('Error adding text/number:', error);
      }
    }
  }, [mutationRoot]);

  const handleToggleWarp = useCallback(() => {
    if (mutationRoot && mutationRoot.getWarp && mutationRoot.setWarp) {
      try {
        const newWarp = !mutationRoot.getWarp();
        mutationRoot.setWarp(newWarp);
        setWarp(newWarp);
      } catch (error) {
        console.error('Error toggling warp:', error);
      }
    }
  }, [mutationRoot]);

  return (
    <CustomProceduresComponent
      componentRef={setBlocks}
      warp={warp}
      onAddBoolean={handleAddBoolean}
      onAddLabel={handleAddLabel}
      onAddTextNumber={handleAddTextNumber}
      onCancel={handleCancel}
      onOk={handleOk}
      onToggleWarp={handleToggleWarp}
    />
  );
};

CustomProcedures.propTypes = {
  isRtl: PropTypes.bool,
  mutator: PropTypes.instanceOf(Element),
  onRequestClose: PropTypes.func.isRequired,
  options: PropTypes.shape({
    media: PropTypes.string,
    zoom: PropTypes.shape({
      controls: PropTypes.bool,
      wheel: PropTypes.bool,
      startScale: PropTypes.number
    }),
    comments: PropTypes.bool,
    collapse: PropTypes.bool,
    scrollbars: PropTypes.bool
  })
};

CustomProcedures.defaultOptions = {
  zoom: {
    controls: false,
    wheel: false,
    startScale: 0.9
  },
  comments: false,
  collapse: false,
  scrollbars: true
};

CustomProcedures.defaultProps = {
  options: CustomProcedures.defaultOptions,
  isRtl: false,
  mutator: null
};

const mapStateToProps = state => ({
  isRtl: state.locales.isRtl,
  mutator: state.scratchGui.customProcedures.mutator
});

export default connect(mapStateToProps)(CustomProcedures);
