import React from 'react';
import PropTypes from 'prop-types';
import { Panel } from 'nav-frontend-paneler';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import './Varselpanel.less';

const Varselpanel = ({ avvik, children }) => (
    <Panel className="Varselpanel">
        {avvik && <AlertStripeAdvarsel>{avvik}</AlertStripeAdvarsel>}
        {children}
    </Panel>
);

Varselpanel.propTypes = {
    children: PropTypes.node.isRequired,
    avvik: PropTypes.string
};

Varselpanel.defaultProps = {
    avvik: undefined
};

export default Varselpanel;
