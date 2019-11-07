import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import OversiktsLenke from './OversiktsLenke';
import { toDate } from '../../utils/date';
import { AuthContext } from '../../context/AuthContext';
import { Normaltekst } from 'nav-frontend-typografi';
import { Flatknapp, Knapp } from 'nav-frontend-knapper';
import { capitalizeName, extractNameFromEmail } from '../../utils/locale';

const Oversiktslinje = ({ behov, tildeling, onUnassignCase, onAssignCase, onSelectCase }) => {
    const { authInfo } = useContext(AuthContext);

    const tildelingsCelle = tildeling ? (
        <>
            <Normaltekst>{capitalizeName(extractNameFromEmail(tildeling.userId))}</Normaltekst>
            {tildeling.userId === authInfo.email && (
                <Flatknapp className="knapp--avmeld" onClick={() => onUnassignCase(behov['@id'])}>
                    Meld av
                </Flatknapp>
            )}
        </>
    ) : (
        <Knapp mini onClick={() => onAssignCase(behov['@id'], authInfo.email)}>
            Tildel til meg
        </Knapp>
    );

    return (
        <li className="row row--info">
            <OversiktsLenke onClick={() => onSelectCase(behov)}>
                {behov.personinfo?.navn ?? behov.aktørId}
            </OversiktsLenke>
            <Normaltekst>{`${toDate(behov['@opprettet'])}`}</Normaltekst>
            <span className="row__tildeling">{tildelingsCelle}</span>
        </li>
    );
};

Oversiktslinje.propTypes = {
    behov: PropTypes.shape({
        '@id': PropTypes.string.isRequired,
        '@opprettet': PropTypes.string.isRequired,
        personinfo: PropTypes.object,
        aktørId: PropTypes.string.isRequired
    }),
    tildeling: PropTypes.shape({ userId: PropTypes.string }),
    onAssignCase: PropTypes.func,
    onUnassignCase: PropTypes.func,
    onSelectCase: PropTypes.func
};

export default Oversiktslinje;
