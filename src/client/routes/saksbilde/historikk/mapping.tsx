import styled from '@emotion/styled';
import dayjs from 'dayjs';
import { Dokument, Kildetype, Overstyring, Vedtaksperiode } from 'internal-types';
import React from 'react';

import { Kilde } from '../../../components/Kilde';
import { Periodetype, Tidslinjeperiode } from '../../../modell/UtbetalingshistorikkElement';
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

const mapRevurderingerOgOverstyringer = (vedtaksperiode: Vedtaksperiode, title: string): Hendelse[] =>
    vedtaksperiode.overstyringer.map((overstyring: Overstyring) => ({
        id: overstyring.hendelseId,
        timestamp: dayjs(overstyring.timestamp),
        title: title,
        type: Hendelsetype.Historikk,
        body: (
            <BegrunnelseTekst>
                <p>{overstyring.begrunnelse}</p>
                <p>{overstyring.saksbehandlerNavn}</p>
            </BegrunnelseTekst>
        ),
    }));

const mapRevurderinger = (vedtaksperiode: Vedtaksperiode): Hendelse[] =>
    mapRevurderingerOgOverstyringer(vedtaksperiode, 'Revurdert: Sykmeldingsperiode');

const mapOverstyringer = (vedtaksperiode: Vedtaksperiode): Hendelse[] =>
    mapRevurderingerOgOverstyringer(vedtaksperiode, 'Overstyrt: Sykmeldingsperiode');

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

export const useGodkjenning = (vedtaksperiode?: Vedtaksperiode): Hendelse[] =>
    (vedtaksperiode?.fullstendig &&
        ([
            vedtaksperiode.automatiskBehandlet && {
                id: 'automatisk',
                timestamp: dayjs(vedtaksperiode.godkjenttidspunkt),
                title: 'Automatisk godkjent',
                type: Hendelsetype.Historikk,
            },
            vedtaksperiode.godkjentAv && {
                id: 'sendt-til-utbetaling',
                timestamp: dayjs(vedtaksperiode.godkjenttidspunkt),
                title: 'Sendt til utbetaling',
                type: Hendelsetype.Historikk,
                body: <BegrunnelseTekst>{vedtaksperiode.godkjentAv}</BegrunnelseTekst>,
            },
        ].filter((it) => !!it) as Hendelse[])) ||
    [];

export const useOverstyring = (vedtaksperiode?: Vedtaksperiode, aktivPeriode?: Tidslinjeperiode): Hendelse[] =>
    (vedtaksperiode?.fullstendig && aktivPeriode?.type === Periodetype.REVURDERING
        ? mapRevurderinger(vedtaksperiode)
        : vedtaksperiode && mapOverstyringer(vedtaksperiode)) || [];

export const useAnnullering = (vedtaksperiode?: Vedtaksperiode): Hendelse[] => {
    const person = usePerson();

    const annullertAvSaksbehandler = person?.utbetalinger?.find(
        (it) => it.arbeidsgiverOppdrag.fagsystemId === vedtaksperiode?.utbetalinger?.arbeidsgiverUtbetaling?.fagsystemId
    )?.annullering;

    return (
        (vedtaksperiode?.fullstendig &&
            annullertAvSaksbehandler && [
                {
                    id: 'annullering',
                    timestamp: annullertAvSaksbehandler.annullertTidspunkt,
                    title: 'Annullert',
                    type: Hendelsetype.Historikk,
                    body: <BegrunnelseTekst>{annullertAvSaksbehandler.saksbehandlerNavn}</BegrunnelseTekst>,
                },
            ]) ||
        []
    );
};
