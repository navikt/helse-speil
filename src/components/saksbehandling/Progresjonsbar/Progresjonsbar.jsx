import React from 'react';
import PropTypes from 'prop-types';
import './Progresjonsbar.less';
import { Undertekst } from 'nav-frontend-typografi';

const Progresjonsbar = ({ current, total }) => {
    return (
        <div className="Progresjonsbar__wrapper">
            <div className="Progresjonsbar">
                <figure
                    className="Progresjonsbar__bar"
                    style={{
                        width: `${(current / total) * 100}%`,
                        borderWidth: current > 0 ? '0.25rem' : 0
                    }}
                />
            </div>
            <Undertekst className="Progresjonsbar__counter">
                {current}/{total}
            </Undertekst>
        </div>
    );
};

Progresjonsbar.propTypes = {
    current: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired
};

export default Progresjonsbar;
