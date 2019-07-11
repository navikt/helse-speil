import React from 'react';
import { periodType } from './types';
import Radnavn from './Radnavn/Radnavn';
import Tidslinjerader from './Tidslinjerader/Tidslinjerader';
import { withPeriods } from './withPeriods';
import './Tidslinje.css';

const Tidslinje = withPeriods(({ periods }) => (
    <div className="Tidslinje__wrapper">
        {periods && (
            <div className="Tidslinje">
                <Radnavn periods={periods} />
                <Tidslinjerader periods={periods} />
            </div>
        )}
    </div>
));

Tidslinje.propTypes = periodType;

export default Tidslinje;
