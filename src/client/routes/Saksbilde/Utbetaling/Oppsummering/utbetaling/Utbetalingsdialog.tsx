import React, { useContext, useState } from 'react';
import styled from '@emotion/styled';
import { useHistory } from 'react-router';
import { Normaltekst } from 'nav-frontend-typografi';
import { Error } from '../../../../../../types';
import { Avvisningsmodal } from './modal/Avvisningsmodal';
import { Utbetalingsmodal } from './modal/Utbetalingsmodal';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { useFjernEnToast, useLeggTilEnToast } from '../../../../../state/toastsState';
import { vedtaksstatusToast, vedtaksstatusToastKey } from '../../../../Oversikt/VedtaksstatusToast';
import { FetchedPersonContext, PersonContext } from '../../../../../context/PersonContext';
import { postSendTilInfotrygd, postUtbetalingsgodkjenning } from '../../../../../io/http';

enum Modalvisning {
    Godkjenning,
    Avvisning,
}

export enum Årsak {
    Feil = 'Feil vurdering og/eller beregning',
    InfotrygdRiktig = 'Allerede behandlet i infotrygd - riktig vurdering',
    InfotrygdFeil = 'Allerede behandlet i infotrygd - feil vurdering og/eller beregning',
}

export enum Begrunnelse {
    Vilkår = 'Vilkår ikke oppfylt',
    Arbeidsgiverperiode = 'Arbeidsgiverperiode beregnet feil',
    Egenmeldingsdager = 'Egenmeldingsdager beregnet feil',
    Maksdato = 'Maksdato beregnet feil',
    Dagsats = 'Dagsats beregnet feil',
    Sykepengegrunnlag = 'Sykepengegrunnlag beregnet feil',
    Inntektskilder = 'Inntektskilder og/eller ytelser tas ikke med i beregningen',
    Medlemskap = 'Vilkår om Lovvalg og medlemskap er ikke oppfylt',
    Faresignaler = 'Faresignaler påvirket utfallet av saken',
    Arbeidsuførhet = 'Vilkår om Arbeidsuførhet, aktivitetsplikt og/eller medvirkning er ikke oppfylt',
    Annet = 'Annet',
}

export type Avvisningsskjema = {
    årsak: Årsak;
    begrunnelser?: Begrunnelse[];
    kommentar?: string;
};

const Knapper = styled.div`
    display: flex;
    align-items: center;

    > *:not(:last-child) {
        margin-right: 1rem;
    }
`;

const useVedtakstoast = () => {
    const fjernEnToast = useFjernEnToast();
    const leggtilEnToast = useLeggTilEnToast();
    const fjernVedtakstoast = () => fjernEnToast(vedtaksstatusToastKey);

    const leggTilUtbetalingstoast = () =>
        leggtilEnToast(vedtaksstatusToast('Utbetalingen er sendt til oppdragsystemet.', fjernVedtakstoast));

    const leggTilInfotrygdtoast = () =>
        leggtilEnToast(vedtaksstatusToast('Saken er sendt til behandling i Infotrygd.', fjernVedtakstoast));

    return { leggTilUtbetalingstoast, leggTilInfotrygdtoast };
};

export const Utbetalingsdialog = () => {
    const history = useHistory();
    const { personTilBehandling, aktivVedtaksperiode } = useContext(PersonContext) as FetchedPersonContext;
    const { leggTilUtbetalingstoast, leggTilInfotrygdtoast } = useVedtakstoast();
    const [error, setError] = useState<Error | undefined>(undefined);
    const [isSending, setIsSending] = useState<boolean>(false);
    const [modalvisning, setModalvisning] = useState<Modalvisning | undefined>();

    const åpneGodkjenningsmodal = () => setModalvisning(Modalvisning.Godkjenning);
    const åpneAvvisningsmodal = () => setModalvisning(Modalvisning.Avvisning);
    const lukkModal = () => setModalvisning(undefined);

    const onError = ({ message, statusCode }: Error) => {
        setError({ message: `Kunne ikke fatte vedtak: ${message} (statuskode: ${statusCode ?? 'ukjent'})` });
        setIsSending(false);
        lukkModal();
    };

    const godkjennUtbetaling = () => {
        setIsSending(true);
        postUtbetalingsgodkjenning(aktivVedtaksperiode.oppgavereferanse, personTilBehandling.aktørId)
            .then(() => {
                leggTilUtbetalingstoast();
                history.push('/');
            })
            .catch(onError);
    };

    const avvisUtbetaling = (skjema: Avvisningsskjema) => {
        setIsSending(true);
        postSendTilInfotrygd(aktivVedtaksperiode.oppgavereferanse, personTilBehandling.aktørId, skjema)
            .then(() => {
                leggTilInfotrygdtoast();
                history.push('/');
            })
            .catch(onError);
    };

    return (
        <>
            <Knapper>
                <Hovedknapp mini onClick={åpneGodkjenningsmodal}>
                    Utbetal
                </Hovedknapp>
                <Knapp mini onClick={åpneAvvisningsmodal}>
                    Avvis
                </Knapp>
            </Knapper>
            {error && (
                <Normaltekst className="skjemaelement__feilmelding">
                    {error.message || 'En feil har oppstått.'}
                    {error.statusCode === 401 && <a href="/"> Logg inn</a>}
                </Normaltekst>
            )}
            {modalvisning === Modalvisning.Godkjenning && (
                <Utbetalingsmodal onClose={lukkModal} onApprove={godkjennUtbetaling} isSending={isSending} />
            )}
            {modalvisning === Modalvisning.Avvisning && (
                <Avvisningsmodal onClose={lukkModal} onApprove={avvisUtbetaling} isSending={isSending} />
            )}
        </>
    );
};
