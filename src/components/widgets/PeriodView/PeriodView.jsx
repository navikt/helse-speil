import React from 'react';
import { periodType } from './types';
import Labels from './Labels/Labels';
import PeriodRows from './PeriodRows/PeriodRows';
import { withPeriods } from './withPeriods';
import './PeriodView.css';

const PeriodView = withPeriods(({ periods }) => (
    <div className="PeriodeVisningWrapper">
        {periods && (
            <div className="PeriodView">
                <Labels periods={periods} />
                <PeriodRows periods={periods} />
            </div>
        )}
    </div>
));

PeriodView.propTypes = periodType;

export default PeriodView;
