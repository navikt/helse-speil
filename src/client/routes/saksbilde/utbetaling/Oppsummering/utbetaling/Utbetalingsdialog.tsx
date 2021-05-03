import React, { useContext, useState } from 'react';
import styled from '@emotion/styled';
import { useHistory } from 'react-router';
import { Normaltekst } from 'nav-frontend-typografi';
import { Avvisningsmodal } from './Avvisningsmodal';
import { Utbetalingsmodal } from './Utbetalingsmodal';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { postAbonnerPåAktør, postSendTilInfotrygd, postUtbetalingsgodkjenning } from '../../../../../io/http';
import { AmplitudeContext } from '../../../AmplitudeContext';
import { Arbeidsgiver, Error, Person, Vedtaksperiode, Vedtaksperiodetilstand } from 'internal-types';
import { usePerson } from '../../../../../state/person';
import { useSetRecoilState } from 'recoil';
import { opptegnelsePollingTimeState } from '../../../../../state/opptegnelser';
import { Scopes, useAddEphemeralVarsel } from '../../../../../state/varsler';
import { nanoid } from 'nanoid';
import { Varseltype } from '@navikt/helse-frontend-varsel';

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
    margin-top: 2.5rem;

    > *:not(:last-child) {
        margin-right: 1rem;
    }
`;

const useVedtakstoast = () => {
    const timeToLiveMs = 5000;
    const addVarsel = useAddEphemeralVarsel();

    const addUtbetalingstoast = () => {
        addVarsel(
            {
                key: nanoid(),
                message: 'Utbetalingen er sendt til oppdragssystemet.',
                type: Varseltype.Suksess,
                scope: Scopes.GLOBAL,
            },
            timeToLiveMs
        );
    };

    const addInfotrygdtoast = () => {
        addVarsel(
            {
                key: nanoid(),
                message: 'Saken er sendt til behandling i Infotrygd.',
                type: Varseltype.Suksess,
                scope: Scopes.GLOBAL,
            },
            timeToLiveMs
        );
    };

    return { addUtbetalingstoast: addUtbetalingstoast, addInfotrygdtoast: addInfotrygdtoast };
};

interface UtbetalingsdialogProps {
    oppgavereferanse: string;
    harBeløpTilUtbetaling: boolean;
}

const skalPolleEtterNestePeriode = (personTilBehandling: Person) =>
    personTilBehandling.arbeidsgivere
        .flatMap((arbeidsgiver: Arbeidsgiver) =>
            arbeidsgiver.vedtaksperioder.flatMap((vedtaksperiode: Vedtaksperiode) => vedtaksperiode.tilstand)
        )
        .some((tilstand) => tilstand === Vedtaksperiodetilstand.VenterPåKiling);

export const Utbetalingsdialog = ({ oppgavereferanse, harBeløpTilUtbetaling }: UtbetalingsdialogProps) => {
    const history = useHistory();
    const personTilBehandling = usePerson() as Person;
    const { addUtbetalingstoast, addInfotrygdtoast } = useVedtakstoast();
    const [error, setError] = useState<Error | undefined>(undefined);
    const [isSending, setIsSending] = useState<boolean>(false);
    const [modalvisning, setModalvisning] = useState<Modalvisning | undefined>();
    const { logOppgaveForkastet, logOppgaveGodkjent } = useContext(AmplitudeContext);
    const setOpptegnelsePollingTime = useSetRecoilState(opptegnelsePollingTimeState);

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
        postUtbetalingsgodkjenning(oppgavereferanse, personTilBehandling.aktørId)
            .then(() => {
                logOppgaveGodkjent();
                addUtbetalingstoast();
                if (skalPolleEtterNestePeriode(personTilBehandling)) {
                    lukkModal();
                    setIsSending(false);
                    postAbonnerPåAktør(personTilBehandling.aktørId).then(() => {
                        setOpptegnelsePollingTime(1000);
                    });
                } else {
                    history.push('/');
                }
            })
            .catch((error) => {
                onError(error);
                setIsSending(false);
            });
    };

    const avvisUtbetaling = (skjema: Avvisningsskjema) => {
        setIsSending(true);
        const skjemaBegrunnelser: string[] = skjema.begrunnelser?.map((begrunnelse) => begrunnelse.valueOf()) ?? [];
        const skjemaKommentar: string[] = skjema.kommentar ? [skjema.kommentar] : [];
        const begrunnelser: string[] = [skjema.årsak.valueOf(), ...skjemaBegrunnelser, ...skjemaKommentar];

        postSendTilInfotrygd(oppgavereferanse, personTilBehandling.aktørId, skjema)
            .then(() => {
                logOppgaveForkastet(begrunnelser);
                addInfotrygdtoast();
                history.push('/');
            })
            .catch((error) => {
                setIsSending(false);
                onError(error);
            });
    };

    return (
        <>
            <Knapper>
                <Hovedknapp mini onClick={åpneGodkjenningsmodal}>
                    {harBeløpTilUtbetaling ? 'Utbetal' : 'Godkjenn'}
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
