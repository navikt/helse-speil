import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import Panel from 'nav-frontend-paneler';
import React, { useContext, useState } from 'react';
import { postVedtak } from '../../io/http';
import { PersonContext } from '../../context/PersonContext';
import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
import './Utbetaling.less';
import InfoModal from '../../components/InfoModal';
import { Error } from '../../../types';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styled from '@emotion/styled';
import { Vedtaksperiodetilstand } from '../../context/types.internal';

enum Beslutning {
    Godkjent = 'GODKJENT',
    Avvist = 'AVVIST',
}

interface UtbetalingProps {
    className?: string;
}

const Utbetalingstittel = styled(Undertittel)`
    margin-bottom: 1rem;
`;

const Utbetaling = ({ className }: UtbetalingProps) => {
    const { personTilBehandling, innsyn, aktivVedtaksperiode } = useContext(PersonContext);
    const [isSending, setIsSending] = useState<boolean>(false);
    const [beslutning, setBeslutning] = useState<Beslutning | undefined>(undefined);
    const [error, setError] = useState<Error | undefined>(undefined);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [tilstand] = useState<Vedtaksperiodetilstand>(aktivVedtaksperiode!.tilstand);
    const { t } = useTranslation();

    const fattVedtak = (godkjent: boolean) => {
        const vedtaksperiodeId = aktivVedtaksperiode?.id;
        const oppgavereferanse = aktivVedtaksperiode?.oppgavereferanse;
        setIsSending(true);
        postVedtak(oppgavereferanse, personTilBehandling?.aktørId, godkjent, vedtaksperiodeId)
            .then(() => {
                setBeslutning(godkjent ? Beslutning.Godkjent : Beslutning.Avvist);
                setError(undefined);
            })
            .catch((err: Error) => {
                console.error({ err });
                setError({
                    message: `Kunne ikke fatte vedtak: ${err.message} (statuskode: ${err.statusCode ?? 'ukjent'})`,
                });
            })
            .finally(() => {
                setIsSending(false);
                setModalOpen(false);
            });
    };

    return (
        <Panel className={classNames(className, 'Utbetaling')}>
            <Utbetalingstittel>{t('oppsummering.utbetaling')}</Utbetalingstittel>
            <AlertStripeAdvarsel>
                Utbetaling skal kun skje hvis det ikke er funnet feil. Feil meldes umiddelbart inn til teamet for
                evaluering.
            </AlertStripeAdvarsel>
            {tilstand === Vedtaksperiodetilstand.Avslag ? (
                <AlertStripeInfo>Utbetalingen er sendt til annullering.</AlertStripeInfo>
            ) : tilstand === Vedtaksperiodetilstand.Feilet ? (
                <AlertStripeInfo>Utbetalingen feilet.</AlertStripeInfo>
            ) : (tilstand === Vedtaksperiodetilstand.Oppgaver && beslutning === Beslutning.Godkjent) ||
              tilstand === Vedtaksperiodetilstand.TilUtbetaling ||
              tilstand === Vedtaksperiodetilstand.Utbetalt ? (
                <AlertStripeInfo>Utbetalingen er sendt til oppdragsystemet.</AlertStripeInfo>
            ) : !innsyn && tilstand === Vedtaksperiodetilstand.Oppgaver ? (
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
                    {tilstand === Vedtaksperiodetilstand.Venter
                        ? 'Saken er sendt til behandling i Infotrygd.'
                        : innsyn && tilstand === Vedtaksperiodetilstand.Oppgaver
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
