import React from 'react';
import HelpIcon from './help-icon';
import styles from './help-icon-demo.css';

const HelpIconDemo = () => {
    const handleHelpClick = React.useCallback(() => {
        console.log('Help icon clicked!');
        // In real implementation, this would open help modal or navigate to help page
    }, []);

    const handleInteractiveClick = React.useCallback(() => {
        alert('Help is on the way!');
    }, []);

    return (
        <div className={styles.demoContainer}>
            <h1>HelpIcon Component Demo</h1>
            
            <section className={styles.section}>
                <h2>Sizes</h2>
                <div className={styles.row}>
                    <div className={styles.item}>
                        <HelpIcon size="small" onClick={handleHelpClick} />
                        <span>Small (24px)</span>
                    </div>
                    <div className={styles.item}>
                        <HelpIcon size="medium" onClick={handleHelpClick} />
                        <span>Medium (32px - Default)</span>
                    </div>
                    <div className={styles.item}>
                        <HelpIcon size="large" onClick={handleHelpClick} />
                        <span>Large (40px)</span>
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <h2>States</h2>
                <div className={styles.row}>
                    <div className={styles.item}>
                        <HelpIcon onClick={handleHelpClick} />
                        <span>Default</span>
                    </div>
                    <div className={styles.item}>
                        <HelpIcon onClick={handleHelpClick} disabled />
                        <span>Disabled</span>
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <h2>With Tooltip</h2>
                <div className={styles.row}>
                    <div className={styles.item}>
                        <HelpIcon 
                            onClick={handleHelpClick} 
                            tooltip="Click to get help"
                            ariaLabel="Get help and support"
                        />
                        <span>Hover to see tooltip</span>
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <h2>Interactive Demo</h2>
                <div className={styles.interactiveDemo}>
                    <p>Try clicking the help icon or using keyboard navigation (Tab + Enter/Space):</p>
                    <HelpIcon 
                        size="large"
                        onClick={handleInteractiveClick}
                        tooltip="Click me for help!"
                    />
                </div>
            </section>

            <section className={styles.section}>
                <h2>Custom Styling</h2>
                <div className={styles.row}>
                    <div className={styles.item}>
                        <HelpIcon 
                            onClick={handleHelpClick}
                            className={styles.customIcon}
                        />
                        <span>Custom styled</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HelpIconDemo;