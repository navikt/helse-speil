import { TimelineZoomLevel } from './timeline-types';
import classNames from 'classnames';
import React from 'react';

import styles from './ZoomLevelPicker.module.css';

interface ZoomLevelPickerProps extends React.HTMLAttributes<HTMLDivElement> {
    availableZoomLevels: Array<TimelineZoomLevel>;
    currentZoomLevel: TimelineZoomLevel;
    setActiveZoomLevel: (index: number) => void;
}

export const ZoomLevelPicker: React.FC<ZoomLevelPickerProps> = ({
    availableZoomLevels,
    currentZoomLevel,
    setActiveZoomLevel,
    className,
    ...divProps
}) => {
    return (
        <div className={classNames(styles.ZoomLevelPicker, className)} {...divProps}>
            {availableZoomLevels.map((zoomLevel, i) => (
                <button
                    key={zoomLevel.label}
                    className={classNames(styles.Picker, zoomLevel.label === currentZoomLevel.label && styles.active)}
                    onClick={() => setActiveZoomLevel(i)}
                >
                    {zoomLevel.label}
                </button>
            ))}
        </div>
    );
};
