import React, { useContext } from 'react';
import OversiktsLenke from './OversiktsLenke';
import { toDate } from '../../utils/date';
import { AuthContext } from '../../context/AuthContext';
import { Normaltekst } from 'nav-frontend-typografi';
import { Flatknapp, Knapp } from 'nav-frontend-knapper';
import { capitalizeName, extractNameFromEmail } from '../../utils/locale';
import { Tildeling } from '../../context/types';
import { Behov } from '../../../types';

interface Props {
    behov: Behov;
    onUnassignCase: (id: string) => void;
    onAssignCase: (id: string, email?: string) => void;
    onSelectCase: (behov: Behov) => void;
    tildeling?: Tildeling;
}

const Oversiktslinje = ({
    behov,
    tildeling,
    onUnassignCase,
    onAssignCase,
    onSelectCase
}: Props) => {
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

export default Oversiktslinje;
