import styled from '@emotion/styled';
import dayjs from 'dayjs';
import { Dokument, Kildetype, Notat, Overstyring, Utbetalingstype, Vedtaksperiode, Vurdering } from 'internal-types';
import React from 'react';
import { useMemo } from 'react';

import { Link } from '@navikt/ds-react';

import { Kilde } from '../../../components/Kilde';
import { Tidslinjeperiode } from '../../../modell/utbetalingshistorikkelement';
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
                    hendelse.type === Kildetype.Inntektsmelding
                        ? dayjs(hendelse.mottattTidspunkt)
                        : hendelse.rapportertDato && dayjs(hendelse.rapportertDato),
                title: (() => {
                    switch (hendelse.type) {
                        case Kildetype.Inntektsmelding:
                            return 'Inntektsmelding mottatt';
                        case Kildetype.Søknad:
                            return 'Søknad mottatt';
                        case Kildetype.Sykmelding:
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
                                case Kildetype.Søknad:
                                    return 'SØ';
                                case Kildetype.Sykmelding:
                                    return 'SM';
                                case Kildetype.Inntektsmelding:
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
        .map(({ utbetaling }, i) => {
            const { tidsstempel, automatisk, godkjent, ident } = utbetaling.vurdering as Vurdering;
            return {
                id: `utbetaling-${periode?.beregningId}-${i}`,
                timestamp: tidsstempel,
                title: automatisk
                    ? 'Automatisk godkjent'
                    : utbetaling.type === Utbetalingstype.ANNULLERING
                    ? 'Annullert'
                    : utbetaling.type === Utbetalingstype.REVURDERING
                    ? 'Revurdert'
                    : 'Sendt til utbetaling',
                type: Hendelsetype.Historikk,
                body: godkjent && !automatisk && <BegrunnelseTekst>{ident}</BegrunnelseTekst>,
            };
        });
};

export const useUtbetalingsendringer = (vedtaksperiode?: Vedtaksperiode): Hendelse[] =>
    (vedtaksperiode?.fullstendig &&
        vedtaksperiode.overstyringer.map((overstyring: Overstyring) => ({
            id: overstyring.hendelseId,
            timestamp: dayjs(overstyring.timestamp),
            title: 'Endret utbetalingsdager',
            type: Hendelsetype.Historikk,
            body: (
                <BegrunnelseTekst>
                    <p>{overstyring.begrunnelse}</p>
                    <p>{overstyring.saksbehandlerIdent ?? overstyring.saksbehandlerNavn}</p>
                </BegrunnelseTekst>
            ),
        }))) ||
    [];

export const useNotater = (notater: Notat[], onNotatLenkeClick: () => void): Hendelse[] =>
    useMemo(
        () =>
            notater.map((notat: Notat) => ({
                id: notat.id,
                timestamp: dayjs(notat.opprettet),
                title: (
                    <Link href="#" onClick={() => onNotatLenkeClick()}>
                        Lagt på vent
                    </Link>
                ),
                type: Hendelsetype.Historikk,
                body: (
                    <BegrunnelseTekst key={notat.id}>
                        <p>{notat.saksbehandler.navn}</p>
                    </BegrunnelseTekst>
                ),
            })),
        [JSON.stringify(notater.map((notat) => notat.id))]
    );
