import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Panel } from 'nav-frontend-paneler';
import React, { useContext, useState } from 'react';
import { postVedtak } from '../../io/http';
import { SaksoversiktContext } from '../../context/SaksoversiktContext';
import { PersonContext } from '../../context/PersonContext';
import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
import './Utbetaling.less';
import InfoModal from '../../components/InfoModal';
import { Behov, Error, VedtaksperiodeTilstand } from '../../../types';
import { useTranslation } from 'react-i18next';
import StatusUtbetalt from './StatusUtbetalt';

enum Beslutning {
    Godkjent = 'GODKJENT',
    Avvist = 'AVVIST'
}

const tilGodkjenning = (tilstand: string) => {
    return tilstand === VedtaksperiodeTilstand.AVVENTER_GODKJENNING;
};

const Utbetaling = () => {
    const { behovoversikt } = useContext(SaksoversiktContext);
    const { personTilBehandling, innsyn, aktivVedtaksperiode } = useContext(PersonContext);
    const [isSending, setIsSending] = useState(false);
    const [beslutning, setBeslutning] = useState<Beslutning | undefined>(undefined);
    const [error, setError] = useState<Error | undefined>(undefined);
    const [modalOpen, setModalOpen] = useState(false);
    const [tilstand, setTilstand] = useState(aktivVedtaksperiode!.tilstand);
    const { t } = useTranslation();

    const fattVedtak = (godkjent: boolean) => {
        const behovId = behovoversikt.find(
            (behov: Behov) => behov.aktørId === personTilBehandling?.aktørId
        )?.['@id'];
        const vedtaksperiodeId = aktivVedtaksperiode?.id;
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
                        'ukjent)'}`
                });
            })
            .finally(() => {
                setIsSending(false);
                setModalOpen(false);
            });
    };

    return (
        <Panel className="Utbetaling">
            <Undertittel>{t('oppsummering.utbetaling')}</Undertittel>
            <AlertStripeAdvarsel>
                Utbetaling skal kun skje hvis det ikke er funnet feil. Feil meldes umiddelbart inn
                til teamet for evaluering.
            </AlertStripeAdvarsel>
            {tilstand === VedtaksperiodeTilstand.ANNULLERT ? (
                <AlertStripeInfo>Utbetalingen er sendt til annullering.</AlertStripeInfo>
            ) : tilstand === VedtaksperiodeTilstand.UTBETALING_FEILET ? (
                <AlertStripeInfo>Utbetalingen feilet.</AlertStripeInfo>
            ) : (tilGodkjenning(tilstand) && beslutning === Beslutning.Godkjent) ||
              tilstand === VedtaksperiodeTilstand.TIL_UTBETALING ||
                  tilstand === VedtaksperiodeTilstand.UTBETALT ? (
                <StatusUtbetalt
                    setTilstand={setTilstand}
                    setError={setError}
                    personTilBehandling={personTilBehandling!}
                    utbetalingsreferanse={aktivVedtaksperiode!.utbetalingsreferanse!}
                />
            ) : !innsyn && tilGodkjenning(tilstand) ? (
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
                    {tilstand === VedtaksperiodeTilstand.TIL_INFOTRYGD
                        ? 'Saken er sendt til behandling i Infotrygd.'
                        : innsyn && tilGodkjenning(tilstand)
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
        </Panel>
    );
};

export default Utbetaling;
