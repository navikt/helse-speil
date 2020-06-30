import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import Panel from 'nav-frontend-paneler';
import React, { useContext, useState } from 'react';
import { postVedtak } from '../../io/http';
import { PersonContext } from '../../context/PersonContext';
import { AlertStripeAdvarsel, AlertStripeInfo } from 'nav-frontend-alertstriper';
import './Utbetaling.less';
import { Error } from '../../../types';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styled from '@emotion/styled';
import { Vedtaksperiode, Vedtaksperiodetilstand } from '../../context/types.internal';
import UtbetalingModal from './modal/UtbetalingModal';
import AvvinsningModal from './modal/AvvisningModal';
import { Avvisningverdier } from './modal/useSkjemaState';
import { useHistory } from 'react-router';
import { useSetRecoilState } from 'recoil';
import { toastState } from '../../state/toastState';

interface UtbetalingProps {
    className?: string;
}

const Utbetalingstittel = styled(Undertittel)`
    margin-bottom: 1rem;
`;

enum Modalvisning {
    Godkjenning,
    Avvisning,
    Lukket,
}

const Utbetaling = ({ className }: UtbetalingProps) => {
    const { personTilBehandling: _personTilBehandling, aktivVedtaksperiode: _aktivVedtaksperiode } = useContext(
        PersonContext
    );
    const personTilBehandling = _personTilBehandling!;
    const aktivVedtaksperiode = _aktivVedtaksperiode!;
    const { tilstand } = aktivVedtaksperiode;
    const [error, setError] = useState<Error | undefined>(undefined);
    const [isSending, setIsSending] = useState<boolean>(false);
    const [modalvisning, setModalvisning] = useState<Modalvisning>(Modalvisning.Lukket);
    const { t } = useTranslation();
    const history = useHistory();
    const setToast = useSetRecoilState(toastState);

    const fattVedtak = (godkjent: boolean, skjema?: Avvisningverdier) => {
        const oppgavereferanse = aktivVedtaksperiode.oppgavereferanse;
        setIsSending(true);
        postVedtak(oppgavereferanse, personTilBehandling.aktørId, godkjent, skjema)
            .then(() => {
                const toast = godkjent
                    ? 'Utbetalingen er sendt til oppdragsystemet.'
                    : 'Saken er sendt til behandling i Infotrygd.';
                setToast(toast);
                history.push('/');
            })
            .catch((err: Error) => {
                console.error({ err });
                setError({
                    message: `Kunne ikke fatte vedtak: ${err.message} (statuskode: ${err.statusCode ?? 'ukjent'})`,
                });
                setIsSending(false);
                setModalvisning(Modalvisning.Lukket);
            });
    };

    const Modal = () => {
        switch (modalvisning) {
            case Modalvisning.Godkjenning:
                return (
                    <UtbetalingModal
                        onClose={() => setModalvisning(Modalvisning.Lukket)}
                        onApprove={() => fattVedtak(true)}
                        isSending={isSending}
                    />
                );
            case Modalvisning.Avvisning:
                return (
                    <AvvinsningModal
                        onClose={() => setModalvisning(Modalvisning.Lukket)}
                        onApprove={(skjema: Avvisningverdier) => fattVedtak(false, skjema)}
                        isSending={isSending}
                    />
                );
            case Modalvisning.Lukket:
                return null;
        }
    };

    return (
        <Panel className={classNames(className, 'Utbetaling')}>
            <Utbetalingstittel>{t('oppsummering.utbetaling')}</Utbetalingstittel>
            {tilstand === Vedtaksperiodetilstand.Avslag ? (
                <AlertStripeInfo>Utbetalingen er sendt til annullering.</AlertStripeInfo>
            ) : tilstand === Vedtaksperiodetilstand.Feilet ? (
                <AlertStripeInfo>Utbetalingen feilet.</AlertStripeInfo>
            ) : tilstand === Vedtaksperiodetilstand.Oppgaver ? (
                harOppgavereferanse(aktivVedtaksperiode) ? (
                    <>
                        <AlertStripeAdvarsel>
                            Utbetaling skal kun skje hvis det ikke er funnet feil. Feil meldes umiddelbart inn til
                            teamet for evaluering.
                        </AlertStripeAdvarsel>
                        <div className="knapperad">
                            <Hovedknapp onClick={() => setModalvisning(Modalvisning.Godkjenning)}>Utbetal</Hovedknapp>
                            <Knapp
                                onClick={() => setModalvisning(Modalvisning.Avvisning)}
                                spinner={isSending && modalvisning !== Modalvisning.Godkjenning}
                            >
                                Behandle i Infotrygd
                            </Knapp>
                        </div>
                    </>
                ) : (
                    <AlertStripeAdvarsel>
                        Denne perioden kan ikke utbetales.
                        <br />
                        Det kan skyldes at den allerede er forsøkt utbetalt, men at det er forsinkelser i systemet.
                    </AlertStripeAdvarsel>
                )
            ) : tilstand === Vedtaksperiodetilstand.Utbetalt ? (
                <AlertStripeInfo>Utbetalingen er sendt til oppdragsystemet.</AlertStripeInfo>
            ) : (
                <AlertStripeInfo>Kunne ikke lese informasjon om sakens tilstand.</AlertStripeInfo>
            )}
            {error && (
                <Normaltekst className="skjemaelement__feilmelding">
                    {error.message || 'En feil har oppstått.'}
                    {error.statusCode === 401 && <a href="/"> Logg inn</a>}
                </Normaltekst>
            )}
            <Modal />
        </Panel>
    );
};

const harOppgavereferanse = (aktivVedtaksperiode: Vedtaksperiode) =>
    aktivVedtaksperiode.oppgavereferanse && aktivVedtaksperiode.oppgavereferanse !== '';

export default Utbetaling;
