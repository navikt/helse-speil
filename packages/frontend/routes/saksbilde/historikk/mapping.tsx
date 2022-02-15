import styled from '@emotion/styled';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';

import { Notes } from '@navikt/ds-icons';

import { Kilde } from '@components/Kilde';
import { LinkButton } from '@components/LinkButton';
import { useAktivPeriode } from '@state/tidslinje';
import { useOrganisasjonsnummer, usePerson } from '@state/person';
import { useOverstyrRevurderingIsEnabled, useRevurderingIsEnabled } from '@hooks/revurdering';
import { defaultUtbetalingToggles } from '@utils/featureToggles';

import { Hendelse, Hendelsetype } from './Historikk.types';
import { useIkkeUtbetaltVedSkjæringstidspunkt } from '../sykepengegrunnlag/inntekt/Inntekt';

const BegrunnelseTekst = styled.div`
    margin-top: 0.25rem;
    color: var(--navds-color-text-primary);
    line-height: 1.375rem;

    > p:last-of-type {
        margin-bottom: 0.25rem;
    }
`;

export const useDokumenter = (vedtaksperiode?: Vedtaksperiode): Hendelse[] =>
    (vedtaksperiode?.fullstendig &&
        vedtaksperiode.hendelser
            ?.filter((hendelse) => hendelse?.id)
            .map((hendelse: Dokument) => ({
                id: hendelse.id,
                timestamp:
                    hendelse.type === 'Inntektsmelding'
                        ? dayjs(hendelse.mottattTidspunkt)
                        : hendelse.rapportertDato && dayjs(hendelse.rapportertDato),
                title: (() => {
                    switch (hendelse.type) {
                        case 'Inntektsmelding':
                            return 'Inntektsmelding mottatt';
                        case 'Søknad':
                            return 'Søknad mottatt';
                        case 'Sykmelding':
                            return 'Sykmelding mottatt';
                        default:
                            return 'Hendelse';
                    }
                })(),
                type: Hendelsetype.Dokument,
                icon: (
                    <Kilde type={hendelse.type}>
                        {(() => {
                            switch (hendelse.type) {
                                case 'Søknad':
                                    return 'SØ';
                                case 'Sykmelding':
                                    return 'SM';
                                case 'Inntektsmelding':
                                    return 'IM';
                            }
                        })()}
                    </Kilde>
                ),
            }))) ||
    [];

export const useUtbetalinger = (
    periode?: TidslinjeperiodeMedSykefravær | TidslinjeperiodeUtenSykefravær
): Hendelse[] => {
    const utbetalingshistorikk =
        usePerson()?.arbeidsgivere.find((it) => it.organisasjonsnummer === periode?.organisasjonsnummer)
            ?.utbetalingshistorikk ?? [];

    if (periode?.tilstand === 'utenSykefravær') {
        return [];
    }

    const beregningId = periode ? (periode as TidslinjeperiodeMedSykefravær).beregningId : undefined;

    return utbetalingshistorikk
        .filter((it) => it.id === beregningId)
        .filter((it) => it.utbetaling.vurdering)
        .map(({ utbetaling }: HistorikkElement, i) => {
            const { tidsstempel, automatisk, godkjent, ident } = (utbetaling as Required<UtbetalingshistorikkElement>)
                .vurdering;
            return {
                id: `utbetaling-${beregningId}-${i}`,
                timestamp: tidsstempel,
                title: automatisk
                    ? 'Automatisk godkjent'
                    : utbetaling.type === 'ANNULLERING'
                    ? 'Annullert'
                    : utbetaling.type === 'REVURDERING'
                    ? 'Revurdert'
                    : 'Sendt til utbetaling',
                type: Hendelsetype.Historikk,
                body: godkjent && !automatisk && <BegrunnelseTekst>{ident}</BegrunnelseTekst>,
            };
        });
};

export const useTidslinjeendringer = (
    onClickEndring: (overstyring: Overstyring) => void,
    vedtaksperiode?: Vedtaksperiode
): Hendelse[] => {
    const revurderingIsEnabled = useRevurderingIsEnabled(defaultUtbetalingToggles);
    const overstyrRevurderingIsEnabled = useOverstyrRevurderingIsEnabled(defaultUtbetalingToggles);

    return (
        (vedtaksperiode?.fullstendig &&
            vedtaksperiode.overstyringer.map((overstyring: Overstyring) => ({
                id: overstyring.hendelseId,
                timestamp: dayjs(overstyring.timestamp),
                title: (
                    <LinkButton onClick={() => onClickEndring(overstyring)}>
                        {revurderingIsEnabled || overstyrRevurderingIsEnabled ? 'Revurdert' : 'Endret'} utbetalingsdager
                    </LinkButton>
                ),
                type: Hendelsetype.Historikk,
                body: (
                    <BegrunnelseTekst>
                        <p>{overstyring.saksbehandlerIdent ?? overstyring.saksbehandlerNavn}</p>
                    </BegrunnelseTekst>
                ),
            }))) ||
        []
    );
};

export const useInntektendringer = (onClickEndring: (overstyring: ExternalInntektoverstyring) => void): Hendelse[] => {
    const organisasjonsnummer = useOrganisasjonsnummer();
    const arbeidsgiver = usePerson()!.arbeidsgivereV2.find((it) => it.organisasjonsnummer === organisasjonsnummer);
    const aktivPeriode = useAktivPeriode();
    const ikkeUtbetaltVedSkjæringstidspunkt = useIkkeUtbetaltVedSkjæringstidspunkt();

    if (!arbeidsgiver) {
        throw Error(`Fant ikke arbeidsgiver med organisasjonsnummer ${organisasjonsnummer}`);
    }

    if (!aktivPeriode.skjæringstidspunkt) {
        throw Error(`Fant ikke periode for skjæringstidspunkt ${aktivPeriode.skjæringstidspunkt}`);
    }

    const inntektoverstyringer = arbeidsgiver.overstyringer.filter(
        (it) => it.type === 'Inntekt'
    ) as ExternalInntektoverstyring[];
    return inntektoverstyringer
        .filter((it) => it.overstyrtInntekt.skjæringstidspunkt === aktivPeriode.skjæringstidspunkt)
        .map((it) => ({
            id: it.hendelseId,
            timestamp: dayjs(it.timestamp),
            title: (
                <LinkButton onClick={() => onClickEndring(it)}>
                    {ikkeUtbetaltVedSkjæringstidspunkt ? 'Endret' : 'Revurdert'} inntekt
                </LinkButton>
            ),
            type: Hendelsetype.Historikk,
            body: (
                <BegrunnelseTekst>
                    <p>{it.saksbehandlerIdent ?? it.saksbehandlerNavn}</p>
                </BegrunnelseTekst>
            ),
        }));
};

export const useArbeidsforholdendringer = (
    onClickEndring: (overstyring: ExternalArbeidsforholdoverstyring) => void
): Hendelse[] => {
    const organisasjonsnummer = useOrganisasjonsnummer();
    const arbeidsgiver = usePerson()!.arbeidsgivereV2.find((it) => it.organisasjonsnummer === organisasjonsnummer);
    const aktivPeriode = useAktivPeriode();

    if (!arbeidsgiver) {
        throw Error(`Fant ikke arbeidsgiver med organisasjonsnummer ${organisasjonsnummer}`);
    }

    if (!aktivPeriode.skjæringstidspunkt) {
        throw Error(`Fant ikke periode med skjæringstidspunkt ${aktivPeriode.skjæringstidspunkt}`);
    }

    const arbeidsforholdoverstyringer = arbeidsgiver.overstyringer.filter(
        (it) => it.type === 'Arbeidsforhold'
    ) as ExternalArbeidsforholdoverstyring[];
    return arbeidsforholdoverstyringer
        .filter((it) => it.overstyrtArbeidsforhold.skjæringstidspunkt === aktivPeriode.skjæringstidspunkt)
        .map((it) => ({
            id: it.hendelseId,
            timestamp: dayjs(it.timestamp),
            title: (
                <LinkButton onClick={() => onClickEndring(it)}>
                    {it.overstyrtArbeidsforhold.deaktivert ? 'Brukes ikke i beregningen' : 'Brukes i beregningen'}
                </LinkButton>
            ),
            type: Hendelsetype.Historikk,
            body: (
                <BegrunnelseTekst>
                    <p>{it.saksbehandlerIdent ?? it.saksbehandlerNavn}</p>
                </BegrunnelseTekst>
            ),
        }));
};

export const useNotater = (notater: Notat[], onClickNotat: () => void): Hendelse[] =>
    useMemo(
        () =>
            notater.map((notat: Notat) => ({
                id: notat.id,
                timestamp: dayjs(notat.opprettet),
                title: <LinkButton onClick={onClickNotat}>Lagt på vent</LinkButton>,
                type: Hendelsetype.Historikk,
                body: (
                    <BegrunnelseTekst key={notat.id}>
                        <p>{notat.saksbehandler.navn}</p>
                    </BegrunnelseTekst>
                ),
                icon: <Notes />,
            })),
        [JSON.stringify(notater.map((notat) => notat.id))]
    );
