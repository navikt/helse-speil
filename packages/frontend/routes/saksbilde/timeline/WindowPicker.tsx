import React from 'react';
import classNames from 'classnames';

import styles from './WindowPicker.module.css';

interface WindowPickerProps extends React.HTMLAttributes<HTMLDivElement> {
    availableWindows: Array<TimelineWindow>;
    activeWindow: TimelineWindow;
    setActiveWindow: (window: TimelineWindow) => void;
}

export const WindowPicker: React.VFC<WindowPickerProps> = ({
    availableWindows,
    activeWindow,
    setActiveWindow,
    className,
    ...divProps
}) => {
    return (
        <div className={classNames(styles.WindowPicker, className)} {...divProps}>
            {availableWindows.map((window) => (
                <button
                    key={window.label}
                    className={classNames(styles.Picker, window.label === activeWindow.label && styles.active)}
                    onClick={() => setActiveWindow(window)}
                >
                    {window.label}
                </button>
            ))}
        </div>
    );
};
