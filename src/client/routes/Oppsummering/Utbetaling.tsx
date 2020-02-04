import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Panel } from 'nav-frontend-paneler';
import React, { useContext, useState } from 'react';
import { fetchPerson, postAnnullering, postVedtak } from '../../io/http';
import { SaksoversiktContext } from '../../context/SaksoversiktContext';
import { PersonContext } from '../../context/PersonContext';
import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
import './Utbetaling.less';
import InfoModal from '../../components/InfoModal';
import AnnulleringsModal from './AnnulleringsModal';
import { AuthContext } from '../../context/AuthContext';
import { utbetalingsreferanse } from '../../context/mapperGammel';
import VisDetaljerKnapp from '../../components/VisDetaljerKnapp';
import { Optional } from '../../context/types';
import { Behov } from '../../../types';
import { useTranslation } from 'react-i18next';
import { RequestError } from 'request-promise-native/errors';

enum Beslutning {
    Godkjent = 'GODKJENT',
    Avvist = 'AVVIST'
}

enum Tilstand {
    TilGodkjenning = 'TIL_GODKJENNING',
    TilUtbetaling = 'TIL_UTBETALING',
    TilInfotrygd = 'TIL_INFOTRYGD',
    Annullert = 'ANNULLERT'
}

interface Error {
    message: string;
    statusCode?: number;
}

const Utbetaling = () => {
    const { saksoversikt } = useContext(SaksoversiktContext);
    const { personTilBehandling, innsyn, enesteSak } = useContext(PersonContext);
    const { ident } = useContext(AuthContext).authInfo;
    const [isSending, setIsSending] = useState(false);
    const [beslutning, setBeslutning] = useState<Beslutning | undefined>(undefined);
    const [senderAnnullering, setSenderAnnullering] = useState(false);
    const [error, setError] = useState<Error | undefined>(undefined);
    const [modalOpen, setModalOpen] = useState(false);
    const [annulleringsmodalOpen, setAnnulleringsmodalOpen] = useState(false);
    const [tilstand, setTilstand] = useState(enesteSak?.tilstandType);
    const { t } = useTranslation();

    const fattVedtak = (godkjent: boolean) => {
        const behovId = saksoversikt.find(
            (behov: Behov) => behov.aktørId === personTilBehandling?.aktørId
        )?.['@id'];
        const vedtaksperiodeId = personTilBehandling?.oppsummering.vedtaksperiodeId;
        setIsSending(true);
        postVedtak(behovId, personTilBehandling?.aktørId, godkjent, vedtaksperiodeId)
            .then(() => {
                setBeslutning(godkjent ? Beslutning.Godkjent : Beslutning.Avvist);
                setError(undefined);
            })
            .catch((err: Error) => {
                console.error({ err });
                setError({
                    message: `Feil under fatting av vedtak. Kontakt en utvikler. (statuskode: ${err.statusCode ??
                        'ukjent'}`
                });
            })
            .finally(() => {
                setIsSending(false);
                setModalOpen(false);
            });
    };

    const fetchUtbetalingsreferanse = () => {
        return fetchPerson(personTilBehandling?.aktørId)
            .then(response => utbetalingsreferanse(response.data.person))
            .catch(err => console.error({ message: 'Kunne ikke hente utbetalingsreferanse' }));
    };

    const annullerUtbetaling = async () => {
        const utbetalingsref =
            personTilBehandling?.oppsummering.utbetalingsreferanse ??
            (await fetchUtbetalingsreferanse());
        setSenderAnnullering(true);
        postAnnullering(utbetalingsref as Optional<string>, personTilBehandling?.aktørId)
            .then(() => {
                setTilstand(Tilstand.Annullert);
                setError(undefined);
            })
            .catch((err: Error) => {
                console.error({ err });
                setError({
                    message:
                        err.statusCode === 409
                            ? 'Denne saken er allerede sendt til annullering.'
                            : `Feil under annullering av utbetaling. Kontakt en utvikler. (statuskode: ${err.statusCode ??
                                  'ukjent'}`
                });
            })
            .finally(() => {
                setAnnulleringsmodalOpen(false);
                setSenderAnnullering(false);
            });
    };

    return (
        <Panel className="Utbetaling">
            <Undertittel>{t('oppsummering.utbetaling')}</Undertittel>
            <AlertStripeAdvarsel>
                Utbetaling skal kun skje hvis det ikke er funnet feil. Feil meldes umiddelbart inn
                til teamet for evaluering.
            </AlertStripeAdvarsel>
            {tilstand === Tilstand.Annullert ? (
                <AlertStripeInfo>Utbetalingen er sendt til annullering.</AlertStripeInfo>
            ) : (tilstand === Tilstand.TilGodkjenning && beslutning === Beslutning.Godkjent) ||
              tilstand === Tilstand.TilUtbetaling ? (
                <div>
                    <AlertStripeInfo>Utbetalingen er sendt til oppdragsystemet.</AlertStripeInfo>
                    <Normaltekst>
                        {'Er det feil i utbetalingen er det mulig å '}
                        <VisDetaljerKnapp
                            onClick={() => setAnnulleringsmodalOpen(true)}
                            tekst="annullere utbetalingen fra oppdragssystemet"
                        />
                    </Normaltekst>
                </div>
            ) : !innsyn && tilstand === Tilstand.TilGodkjenning ? (
                beslutning ? (
                    <AlertStripeInfo>Saken er sendt til behandling i Infotrygd.</AlertStripeInfo>
                ) : (
                    <div className="knapperad">
                        <Hovedknapp onClick={() => setModalOpen(true)}>Utbetal</Hovedknapp>
                        <Knapp onClick={() => fattVedtak(false)} spinner={isSending && !modalOpen}>
                            Behandle i Infotrygd
                        </Knapp>
                    </div>
                )
            ) : (
                <AlertStripeInfo>
                    {tilstand === Tilstand.TilInfotrygd
                        ? 'Saken er sendt til behandling i Infotrygd.'
                        : innsyn && tilstand === Tilstand.TilGodkjenning
                        ? 'Saken står til godkjenning av saksbehandler.'
                        : 'Kunne ikke lese informasjon om sakens tilstand.'}
                </AlertStripeInfo>
            )}
            {error && (
                <Normaltekst className="skjemaelement__feilmelding">
                    {error.message || 'En feil har oppstått.'}
                    {error.statusCode === 401 && <a href="/"> Logg inn</a>}
                </Normaltekst>
            )}
            {modalOpen && (
                <InfoModal
                    onClose={() => setModalOpen(false)}
                    onApprove={() => fattVedtak(true)}
                    isSending={isSending}
                    infoMessage="Når du trykker ja blir utbetalingen sendt til oppdragsystemet."
                />
            )}
            {annulleringsmodalOpen && (
                <AnnulleringsModal
                    onClose={() => setAnnulleringsmodalOpen(false)}
                    onApprove={annullerUtbetaling}
                    faktiskNavIdent={ident ?? ''}
                    senderAnnullering={senderAnnullering}
                />
            )}
        </Panel>
    );
};

export default Utbetaling;
