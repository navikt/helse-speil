import React, { useContext, useEffect, useState } from 'react';
import OversiktsLenke from './OversiktsLenke';
import { AuthContext } from '../../context/AuthContext';
import { Normaltekst } from 'nav-frontend-typografi';
import { Flatknapp, Knapp } from 'nav-frontend-knapper';
import { capitalizeName, extractNameFromEmail } from '../../utils/locale';
import { Tildeling } from '../../context/types';
import { Behov } from '../../../types';
import { somDato } from '../../context/mapping/vedtaksperiodemapper';
import { NORSK_DATOFORMAT } from '../../utils/date';
import { getPersoninfo } from '../../io/http';

interface Props {
    behov: Behov;
    onUnassignCase: (id: string) => void;
    onAssignCase: (id: string, email?: string) => void;
    onSelectCase: (behov: Behov) => void;
    tildeling?: Tildeling;
}

const Oversiktslinje = ({ behov, tildeling, onUnassignCase, onAssignCase, onSelectCase }: Props) => {
    const { authInfo } = useContext(AuthContext);
    const [søkernavn, setSøkernavn] = useState(behov.aktørId);
    const [fetchFailedText, setFetchFailedText] = useState<string>();

    useEffect(() => {
        getPersoninfo(behov.aktørId)
            .then(personinfo => {
                setSøkernavn(personinfo.data?.navn);
            })
            .catch(() => setFetchFailedText('(Kunne ikke hente navn)'));
    }, [behov.aktørId]);

    const tildelingsCelle = tildeling ? (
        tildeling.userId ? (
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
        )
    ) : (
        <span className="ventetekst">Henter informasjon..</span>
    );

    return (
        <tr className="row row--info">
            <td>
                <span>
                    <OversiktsLenke onClick={() => onSelectCase(behov)}>{søkernavn}</OversiktsLenke> {fetchFailedText}
                </span>
            </td>
            <td>
                <Normaltekst>{`${somDato(behov['@opprettet']).format(NORSK_DATOFORMAT)}`}</Normaltekst>
            </td>
            <td>
                <span className="row__tildeling">{tildelingsCelle}</span>
            </td>
        </tr>
    );
};

export default Oversiktslinje;
