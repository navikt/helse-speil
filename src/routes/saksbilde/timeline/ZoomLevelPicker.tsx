import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { TimelineZoomLevel } from '@typer/timeline';

import styles from './ZoomLevelPicker.module.css';

interface ZoomLevelPickerProps extends React.HTMLAttributes<HTMLDivElement> {
    availableZoomLevels: TimelineZoomLevel[];
    currentZoomLevel: TimelineZoomLevel;
    setActiveZoomLevel: (index: number) => void;
}

export const ZoomLevelPicker = ({
    availableZoomLevels,
    currentZoomLevel,
    setActiveZoomLevel,
    className,
    ...divProps
}: ZoomLevelPickerProps): ReactElement => {
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
