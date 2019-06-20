import React from 'react';
import PropTypes from 'prop-types';
import { Knapp } from 'nav-frontend-knapper';
import { withRouter } from 'react-router';
import './Navigasjonsknapper.css';

const Navigasjonsknapper = ({ history, previous, next }) => (
    <div className="Navigasjonsknapper">
        {previous && (
            <Knapp onClick={() => history.push(previous)}>FORRIGE</Knapp>
        )}
        {next && <Knapp onClick={() => history.push(next)}>NESTE</Knapp>}
    </div>
);

Navigasjonsknapper.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func
    }).isRequired,
    previous: PropTypes.string,
    next: PropTypes.string
};

export default withRouter(Navigasjonsknapper);
