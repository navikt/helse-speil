import styled from '@emotion/styled';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';

import { Notes } from '@navikt/ds-icons';

import { Kilde } from '@components/Kilde';
import { LinkButton } from '@components/LinkButton';
import {
    useFørsteUtbetalingstidsstempelFørsteGenISkjæringstidspunkt,
    useUtbetalingstidsstempelFørsteGenForPeriode,
} from '@state/person';

import { Hendelse, Hendelsetype } from './Historikk.types';
import {
    Arbeidsforholdoverstyring,
    Dagoverstyring,
    GhostPeriode,
    Hendelse as ExternHendelse,
    Inntektoverstyring,
    Inntektsmelding,
    Kildetype,
    Maybe,
    Overstyring,
    Periode,
    SoknadArbeidsgiver,
    SoknadNav,
    Sykmelding,
} from '@io/graphql';
import { isBeregnetPeriode } from '@utils/typeguards';
import { useActivePeriod } from '@state/periodState';
import { ISO_TIDSPUNKTFORMAT } from '@utils/date';

const BegrunnelseTekst = styled.div`
    margin-top: 0.25rem;
    color: var(--navds-color-text-primary);
    line-height: 1.375rem;

    > p:last-of-type {
        margin-bottom: 0.25rem;
    }
`;

const isInntektsmelding = (hendelse: ExternHendelse): hendelse is Inntektsmelding =>
    hendelse.type === 'INNTEKTSMELDING';

const isSykmelding = (hendelse: ExternHendelse): hendelse is Sykmelding => hendelse.type === 'NY_SOKNAD';

const isSøknadNav = (hendelse: ExternHendelse): hendelse is SoknadNav => hendelse.type === 'SENDT_SOKNAD_NAV';

const isSøknadArbeidsgiver = (hendelse: ExternHendelse): hendelse is SoknadArbeidsgiver =>
    hendelse.type === 'SENDT_SOKNAD_ARBEIDSGIVER';

export const isDagoverstyring = (overstyring?: Maybe<Overstyring>): overstyring is Dagoverstyring =>
    (overstyring as Dagoverstyring)?.__typename === 'Dagoverstyring';

export const isInntektoverstyring = (overstyring?: Maybe<Overstyring>): overstyring is Inntektoverstyring =>
    (overstyring as Inntektoverstyring)?.__typename === 'Inntektoverstyring';

export const isArbeidsforholdoverstyring = (
    overstyring?: Maybe<Overstyring>,
): overstyring is Arbeidsforholdoverstyring =>
    (overstyring as Arbeidsforholdoverstyring)?.__typename === 'Arbeidsforholdoverstyring';

export const useDokumenter = (period: Periode | GhostPeriode): Hendelse[] => {
    if (!isBeregnetPeriode(period)) {
        return [];
    }

    return period.hendelser
        .map((hendelse) => {
            if (isInntektsmelding(hendelse)) {
                return {
                    id: hendelse.id,
                    timestamp: hendelse.mottattDato,
                    title: 'Inntektsmelding mottatt',
                    type: Hendelsetype.Dokument,
                    icon: <Kilde type={Kildetype.Inntektsmelding}>IM</Kilde>,
                };
            } else if (isSykmelding(hendelse)) {
                return {
                    id: hendelse.id,
                    timestamp: hendelse.rapportertDato,
                    title: 'Sykmelding mottatt',
                    type: Hendelsetype.Dokument,
                    icon: <Kilde type={Kildetype.Sykmelding}>SM</Kilde>,
                };
            } else if (isSøknadNav(hendelse) || isSøknadArbeidsgiver(hendelse)) {
                return {
                    id: hendelse.id,
                    timestamp: hendelse.rapportertDato,
                    title: 'Søknad mottatt',
                    type: Hendelsetype.Dokument,
                    icon: <Kilde type={Kildetype.Soknad}>SØ</Kilde>,
                };
            } else {
                return null;
            }
        })
        .filter((it) => it !== null) as Hendelse[];
};

export const getUtbetalingshendelse = (periode: Periode | GhostPeriode): Hendelse | null => {
    if (!isBeregnetPeriode(periode) || !periode.utbetaling.vurdering) {
        return null;
    }

    const { automatisk, godkjent, tidsstempel, ident } = periode.utbetaling.vurdering;

    return {
        id: `utbetaling-${periode.beregningId}`,
        timestamp: tidsstempel,
        title: automatisk
            ? 'Automatisk godkjent'
            : periode.utbetaling.type === 'ANNULLERING'
            ? 'Annullert'
            : periode.utbetaling.type === 'REVURDERING'
            ? 'Revurdert'
            : 'Sendt til utbetaling',
        type: Hendelsetype.Historikk,
        body: godkjent && !automatisk && <BegrunnelseTekst>{ident}</BegrunnelseTekst>,
    };
};

export const useDagoverstyringshendelser = (
    onClickEndring: (overstyring: Overstyring) => void,
    overstyringer: Array<Overstyring>,
): Hendelse[] => {
    const utbetalingstidFørsteGenForPeriode = useUtbetalingstidsstempelFørsteGenForPeriode();

    return overstyringer.filter(isDagoverstyring).map((overstyring: Dagoverstyring) => ({
        id: overstyring.hendelseId,
        timestamp: overstyring.timestamp,
        title: (
            <LinkButton onClick={() => onClickEndring(overstyring)}>
                {dayjs(overstyring.timestamp).isAfter(utbetalingstidFørsteGenForPeriode) ? 'Revurdert' : 'Endret'}{' '}
                utbetalingsdager
            </LinkButton>
        ),
        type: Hendelsetype.Historikk,
        body: (
            <BegrunnelseTekst>
                <p>{overstyring.saksbehandler.ident ?? overstyring.saksbehandler.navn}</p>
            </BegrunnelseTekst>
        ),
    }));
};

export const useInntektsoverstyringshendelser = (
    onClickEndring: (overstyring: Overstyring) => void,
    overstyringer: Array<Overstyring>,
): Hendelse[] => {
    const førsteUtbetalingstidsstempelISkjæringstidspunkt =
        useFørsteUtbetalingstidsstempelFørsteGenISkjæringstidspunkt();

    return overstyringer.filter(isInntektoverstyring).map((overstyring: Inntektoverstyring) => ({
        id: overstyring.hendelseId,
        timestamp: overstyring.timestamp,
        title: (
            <LinkButton onClick={() => onClickEndring(overstyring)}>
                {dayjs(overstyring.timestamp).isAfter(førsteUtbetalingstidsstempelISkjæringstidspunkt)
                    ? 'Revurdert'
                    : 'Endret'}{' '}
                inntekt
            </LinkButton>
        ),
        type: Hendelsetype.Historikk,
        body: (
            <BegrunnelseTekst>
                <p>{overstyring.saksbehandler.ident ?? overstyring.saksbehandler.navn}</p>
            </BegrunnelseTekst>
        ),
    }));
};

export const useArbeidsforholdoverstyringshendelser = (
    onClickEndring: (overstyring: Overstyring) => void,
    overstyringer: Array<Overstyring>,
): Hendelse[] => {
    const activePeriod = useActivePeriod();

    if (!isBeregnetPeriode(activePeriod)) {
        return [];
    }

    return overstyringer
        .filter(isArbeidsforholdoverstyring)
        .filter((it) => it.skjaeringstidspunkt === activePeriod.skjaeringstidspunkt)
        .map((it) => ({
            id: it.hendelseId,
            timestamp: it.timestamp,
            title: (
                <LinkButton onClick={() => onClickEndring(it)}>
                    {it.deaktivert ? 'Brukes ikke i beregningen' : 'Brukes i beregningen'}
                </LinkButton>
            ),
            type: Hendelsetype.Historikk,
            body: (
                <BegrunnelseTekst>
                    <p>{it.saksbehandler.ident ?? it.saksbehandler.navn}</p>
                </BegrunnelseTekst>
            ),
        }));
};

export const useNotater = (notater: Notat[], onClickNotat: () => void): Hendelse[] =>
    useMemo(
        () =>
            notater.map((notat: Notat) => ({
                id: notat.id,
                timestamp: notat.opprettet.format(ISO_TIDSPUNKTFORMAT),
                title: <LinkButton onClick={onClickNotat}>Lagt på vent</LinkButton>,
                type: Hendelsetype.Historikk,
                body: (
                    <BegrunnelseTekst key={notat.id}>
                        <p>{notat.saksbehandler.navn}</p>
                    </BegrunnelseTekst>
                ),
                icon: <Notes />,
            })),
        [JSON.stringify(notater.map((notat) => notat.id))],
    );
