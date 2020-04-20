import React, { useContext } from 'react';
import OversiktsLenke from './OversiktsLenke';
import { AuthContext } from '../../context/AuthContext';
import { Normaltekst } from 'nav-frontend-typografi';
import { Flatknapp, Knapp } from 'nav-frontend-knapper';
import { capitalizeName, extractNameFromEmail } from '../../utils/locale';
import { Tildeling } from '../../context/types';
import { Oppgave } from '../../../types';
import { somDato } from '../../context/mapping/vedtaksperiodemapper';
import { NORSK_DATOFORMAT } from '../../utils/date';

interface Props {
    oppgave: Oppgave;
    onUnassignCase: (id: string) => void;
    onAssignCase: (id: string, email?: string) => void;
    onSelectCase: (oppgave: Oppgave) => void;
    tildeling?: Tildeling;
}

const Oversiktslinje = ({ oppgave, tildeling, onUnassignCase, onAssignCase, onSelectCase }: Props) => {
    const { authInfo } = useContext(AuthContext);

    const formaterNavn = () => {
        if (oppgave.navn.mellomnavn) {
            return `${oppgave.navn.fornavn} ${oppgave.navn.mellomnavn} ${oppgave.navn.etternavn}`;
        } else {
            return `${oppgave.navn.fornavn} ${oppgave.navn.etternavn}`;
        }
    };

    const tildelingsCelle = tildeling ? (
        tildeling.userId ? (
            <>
                <Normaltekst>{capitalizeName(extractNameFromEmail(tildeling.userId))}</Normaltekst>
                {tildeling.userId === authInfo.email && (
                    <Flatknapp className="knapp--avmeld" onClick={() => onUnassignCase(oppgave.spleisbehovId)}>
                        Meld av
                    </Flatknapp>
                )}
            </>
        ) : (
            <Knapp mini onClick={() => onAssignCase(oppgave.spleisbehovId, authInfo.email)}>
                Tildel til meg
            </Knapp>
        )
    ) : (
        <span className="ventetekst">Henter informasjon..</span>
    );

    return (
        <tr className="row row--info">
            <td>
                <span>
                    <OversiktsLenke onClick={() => onSelectCase(oppgave)}>{formaterNavn()}</OversiktsLenke>
                </span>
            </td>
            <td>
                <Normaltekst>{`${somDato(oppgave['oppdatert']).format(NORSK_DATOFORMAT)}`}</Normaltekst>
            </td>
            <td>
                <span className="row__tildeling">{tildelingsCelle}</span>
            </td>
        </tr>
    );
};

export default Oversiktslinje;
