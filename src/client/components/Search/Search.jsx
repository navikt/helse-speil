import React, { useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import SearchIcon from './SearchIcon';
import { Keys } from '../../hooks/useKeyboard';
import { withRouter } from 'react-router';
import { BehandlingerContext } from '../../context/BehandlingerContext';
import { InnrapporteringContext } from '../../context/InnrapporteringContext';
import './Search.less';
import { EasterEggContext } from '../../context/EasterEggContext';

const Search = ({ history }) => {
    const ref = useRef();
    const { activate } = useContext(EasterEggContext);
    const { hentPerson } = useContext(BehandlingerContext);
    const { resetUserFeedback } = useContext(InnrapporteringContext);

    const keyTyped = event => {
        const isEnter = (event.charCode || event.keyCode) === Keys.ENTER;
        if (isEnter) {
            search(event.target.value);
        }
    };

    const goToStartPage = person => {
        if (person && history.location.pathname !== '/sykdomsvilkår') {
            history.push('/sykmeldingsperiode');
        }
    };

    const search = async value => {
        if (value.trim().toLowerCase() === 'infotrygd') {
            activate();
        } else if (value.trim().length !== 0) {
            hentPerson(value).then(person => {
                if (person) {
                    resetUserFeedback();
                    goToStartPage(person);
                }
            });
        }
    };

    return (
        <div className="Search">
            <input ref={ref} type="text" placeholder="FNR eller aktør" onKeyPress={keyTyped} />
            <button onClick={() => search(ref.current.value)}>
                <SearchIcon />
            </button>
        </div>
    );
};

Search.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
        location: PropTypes.shape({
            pathname: PropTypes.string.isRequired
        }).isRequired
    }).isRequired
};
export default withRouter(Search);
