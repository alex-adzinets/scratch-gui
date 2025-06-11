// The following file was refactored by Autonomy AI
// Original file path: scratch-gui/src/components/icon-button/icon-button.jsx

import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import styles from './icon-button.css';

interface IconButtonProps {
  className?: string;
  disabled?: boolean;
  img: string;
  onClick: () => void;
  title: React.ReactNode;
}

const IconButton: React.FC<IconButtonProps> = ({
  img,
  disabled = false,
  className,
  title,
  onClick
}) => {
  const [imageError, setImageError] = useState(false);

  const handleClick = useCallback(() => {
    if (!disabled) {
      onClick();
    }
  }, [disabled, onClick]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if ((event.key === 'Enter' || event.key === ' ') && !disabled) {
      event.preventDefault();
      onClick();
    }
  }, [disabled, onClick]);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const containerClasses = classNames(
    styles.container,
    className,
    {
      [styles.disabled]: disabled,
      [styles.imageError]: imageError
    }
  );

  return (
    <button
      type="button"
      className={containerClasses}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={typeof title === 'string' ? title : 'Icon button'}
      title={typeof title === 'string' ? title : undefined}
    >
      {!imageError && (
        <img
          className={styles.icon}
          draggable={false}
          src={img}
          alt=""
          onError={handleImageError}
        />
      )}
      {imageError && (
        <div className={styles.iconFallback} aria-hidden="true">
          ?
        </div>
      )}
      <div className={styles.title}>
        {title}
      </div>
    </button>
  );
};

export default IconButton;
