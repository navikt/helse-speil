import styled from '@emotion/styled';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';

import { Notes } from '@navikt/ds-icons';

import { Kilde } from '../../../components/Kilde';
import { LinkButton } from '../../../components/LinkButton';
import { usePerson } from '../../../state/person';

import { Hendelse, Hendelsetype } from './Historikk.types';

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

export const useUtbetalinger = (periode?: Tidslinjeperiode): Hendelse[] => {
    const utbetalingshistorikk =
        usePerson()?.arbeidsgivere.find((it) => it.organisasjonsnummer === periode?.organisasjonsnummer)
            ?.utbetalingshistorikk ?? [];

    return utbetalingshistorikk
        .filter((it) => it.id === periode?.beregningId)
        .filter((it) => it.utbetaling.vurdering)
        .map(({ utbetaling }: HistorikkElement, i) => {
            const { tidsstempel, automatisk, godkjent, ident } = (utbetaling as Required<UtbetalingshistorikkElement>)
                .vurdering;
            return {
                id: `utbetaling-${periode?.beregningId}-${i}`,
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

export const useUtbetalingsendringer = (onClickEndring: () => void, vedtaksperiode?: Vedtaksperiode): Hendelse[] =>
    (vedtaksperiode?.fullstendig &&
        vedtaksperiode.overstyringer.map((overstyring: Overstyring) => ({
            id: overstyring.hendelseId,
            timestamp: dayjs(overstyring.timestamp),
            title: <LinkButton onClick={onClickEndring}>Endret utbetalingsdager</LinkButton>,
            type: Hendelsetype.Historikk,
            body: (
                <BegrunnelseTekst>
                    <p>{overstyring.saksbehandlerNavn ?? overstyring.saksbehandlerIdent}</p>
                </BegrunnelseTekst>
            ),
        }))) ||
    [];

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
