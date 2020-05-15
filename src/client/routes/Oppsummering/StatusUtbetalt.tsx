import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { Normaltekst } from 'nav-frontend-typografi';
import React, { Dispatch, SetStateAction, useContext, useState } from 'react';
import AnnulleringsModal from './AnnulleringsModal';
import { postAnnullering } from '../../io/http';
import { Person, Vedtaksperiodetilstand } from '../../context/types.internal';
import { Error } from '../../../types';
import { AuthContext } from '../../context/AuthContext';
import { PersonContext } from '../../context/PersonContext';
import Lenkeknapp from '../../components/Lenkeknapp';

interface StatusUtbetaltProps {
    setTilstand: Dispatch<SetStateAction<Vedtaksperiodetilstand>>;
    setError: Dispatch<SetStateAction<Error | undefined>>;
    personTilBehandling: Person;
    utbetalingsreferanse?: string;
}

const StatusUtbetalt = ({ setTilstand, setError, personTilBehandling, utbetalingsreferanse }: StatusUtbetaltProps) => {
    const [annulleringsmodalOpen, setAnnulleringsmodalOpen] = useState(false);
    const [senderAnnullering, setSenderAnnullering] = useState(false);
    const { ident } = useContext(AuthContext);
    const { oppdaterPerson } = useContext(PersonContext);

    const annuller = () =>
        postAnnullering(personTilBehandling!.fødselsnummer, utbetalingsreferanse!, personTilBehandling?.aktørId)
            .then(() => {
                setTilstand(Vedtaksperiodetilstand.Avslag);
                setError(undefined);
            })
            .catch((err: Error) => {
                setAnnulleringsmodalOpen(false);
                setSenderAnnullering(false);
                setError({
                    message:
                        err.statusCode === 409
                            ? 'Denne saken er allerede sendt til annullering.'
                            : `Feil under annullering av utbetaling. Kontakt en utvikler. (statuskode: ${err.statusCode ??
                                  'ukjent)'}`
                });
            });

    const annullerUtbetaling = async () => {
        setSenderAnnullering(true);
        if (!utbetalingsreferanse) {
            oppdaterPerson(personTilBehandling.aktørId)
                .then(person => {
                    annuller();
                })
                .catch(err => {
                    setAnnulleringsmodalOpen(false);
                    setSenderAnnullering(false);
                    setError({
                        message:
                            'Kunne ikke sende saken til annullering. Mangler utbetalingsreferanse. Kontakt en utvikler.'
                    });
                });
        } else {
            annuller();
        }
    };

    return (
        <div>
            <AlertStripeInfo>Utbetalingen er sendt til oppdragsystemet.</AlertStripeInfo>
            <Normaltekst>
                {'Er det feil i utbetalingen er det mulig å '}
                <Lenkeknapp onClick={() => setAnnulleringsmodalOpen(true)}>
                    annullere utbetalingen fra oppdragssystemet
                </Lenkeknapp>
            </Normaltekst>
            {annulleringsmodalOpen && (
                <AnnulleringsModal
                    onClose={() => setAnnulleringsmodalOpen(false)}
                    onApprove={annullerUtbetaling}
                    faktiskNavIdent={ident ?? ''}
                    senderAnnullering={senderAnnullering}
                />
            )}
        </div>
    );
};

export default StatusUtbetalt;
