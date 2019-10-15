import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import OversiktsLenke from './OversiktsLenke';
import { toDate } from '../../utils/date';
import { AuthContext } from '../../context/AuthContext';
import { Normaltekst } from 'nav-frontend-typografi';
import { Flatknapp, Knapp } from 'nav-frontend-knapper';
import { capitalizeName, extractNameFromEmail } from '../../utils/locale';

const Oversiktslinje = ({ behandling, tildeling, onUnassignCase, onAssignCase, onSelectCase }) => {
    const { authInfo } = useContext(AuthContext);

    const tildelingsCelle = tildeling ? (
        <>
            <Normaltekst>{capitalizeName(extractNameFromEmail(tildeling.userId))}</Normaltekst>
            {tildeling.userId === authInfo.email && (
                <Flatknapp
                    className="knapp--avmeld"
                    onClick={() => onUnassignCase(behandling.behandlingsId)}
                >
                    Meld av
                </Flatknapp>
            )}
        </>
    ) : (
        <Knapp mini onClick={() => onAssignCase(behandling.behandlingsId)}>
            Tildel til meg
        </Knapp>
    );

    return (
        <li className="row row--info">
            <OversiktsLenke onClick={() => onSelectCase(behandling)}>
                {behandling.personinfo?.navn ?? behandling.originalSøknad.aktorId}
            </OversiktsLenke>
            <Normaltekst>{`${toDate(behandling.originalSøknad.fom)} - ${toDate(
                behandling.originalSøknad.tom
            )}`}</Normaltekst>
            <span className="row__tildeling">{tildelingsCelle}</span>
        </li>
    );
};

Oversiktslinje.propTypes = {
    behandling: PropTypes.shape({
        behandlingsId: PropTypes.string.isRequired,
        personinfo: PropTypes.object,
        originalSøknad: PropTypes.object.isRequired
    }),
    tildeling: PropTypes.shape({ userId: PropTypes.string }),
    onAssignCase: PropTypes.func,
    onUnassignCase: PropTypes.func,
    onSelectCase: PropTypes.func
};

export default Oversiktslinje;
