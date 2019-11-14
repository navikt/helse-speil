import React, { useContext, useState } from 'react';
import InfotrygdList from '../InfotrygdList';
import InfotrygdListItem from '../InfotrygdListItem';
import { SimuleringContext } from '../../../context/SimuleringContext';
import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
import { toLocaleFixedNumberString } from '../../../utils/locale';
import './OppsummeringInfotrygd.less';
import { Knapp } from 'nav-frontend-knapper';
import { postVedtak } from '../../../io/http';
import { PersonContext } from '../../../context/PersonContext';
import { SaksoversiktContext } from '../../../context/SaksoversiktContext';
import InfoModal from '../../InfoModal';
import { Normaltekst } from 'nav-frontend-typografi';

const Beslutning = {
    GODKJENT: 'GODKJENT',
    AVVIST: 'AVVIST'
};

const OppsummeringInfotrygd = () => {
    const { personTilBehandling } = useContext(PersonContext);
    const { saksoversikt } = useContext(SaksoversiktContext);
    const [modalOpen, setModalOpen] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [beslutning, setBeslutning] = useState(undefined);
    const [error, setError] = useState(undefined);
    const simuleringContext = useContext(SimuleringContext);

    const fattVedtak = godkjent => {
        const behovId = saksoversikt.find(behov => behov.aktørId === personTilBehandling.aktørId)?.[
            '@id'
        ];
        setIsSending(true);
        postVedtak(behovId, personTilBehandling.aktørId, godkjent)
            .then(() => {
                setBeslutning(godkjent ? Beslutning.GODKJENT : Beslutning.AVVIST);
                setError(undefined);
            })
            .catch(err => setError(err))
            .finally(() => {
                setIsSending(false);
                setModalOpen(false);
            });
    };

    const simulering = simuleringContext.simulering?.simulering?.totalBelop
        ? `${toLocaleFixedNumberString(simuleringContext.simulering?.simulering?.totalBelop, 2)} kr`
        : simuleringContext.simulering?.feilMelding ?? 'Ikke tilgjengelig';

    return (
        <span className="OppsummeringInfotrygd">
            <InfotrygdList>
                {simuleringContext.error ? (
                    <InfotrygdListItem label={simuleringContext.error} status="!" />
                ) : (
                    <InfotrygdListItem label="Simulering">{simulering}</InfotrygdListItem>
                )}
            </InfotrygdList>
            <h2>Utbetaling</h2>
            <AlertStripeAdvarsel>
                Utbetaling skal kun skje hvis det ikke er funnet feil. Feil meldes umiddelbart inn
                til teamet for evaluering.
            </AlertStripeAdvarsel>
            <span className="Infotrygd__content OppsummeringInfotrygd">
                {beslutning ? (
                    <AlertStripeInfo>
                        {beslutning === Beslutning.GODKJENT
                            ? 'Utbetalingen er sendt til oppdragsystemet.'
                            : 'Saken er sendt til behandling i Infotrygd.'}
                    </AlertStripeInfo>
                ) : (
                    <span className="Infotrygd__buttons">
                        <span>
                            <button onClick={() => setModalOpen(true)}>UTBETAL</button>
                            {error && (
                                <Normaltekst className="skjemaelement__feilmelding">
                                    {error.message || 'En feil har oppstått.'}
                                    {error.statusCode === 401 && <a href="/"> Logg inn</a>}
                                </Normaltekst>
                            )}
                        </span>
                        <Knapp onClick={() => fattVedtak(false)} spinner={isSending && !modalOpen}>
                            Behandle i Infotrygd
                        </Knapp>
                    </span>
                )}
            </span>
            {modalOpen && (
                <InfoModal
                    onClose={() => setModalOpen(false)}
                    onApprove={() => fattVedtak(true)}
                    isSending={isSending}
                    infoMessage="Når du trykker ja blir utbetalingen sendt til oppdragsystemet. Dette kan ikke angres."
                />
            )}
        </span>
    );
};

export default OppsummeringInfotrygd;
