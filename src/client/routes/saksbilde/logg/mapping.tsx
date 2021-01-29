import { Hendelse, Kildetype, Overstyring, Vedtaksperiode } from 'internal-types';
import { Hendelsetype } from '@navikt/helse-frontend-logg';
import React from 'react';
import styled from '@emotion/styled';
import { HendelseMedId } from '@navikt/helse-frontend-logg/lib/src/types';
import { Dayjs } from 'dayjs';

const BegrunnelseTekst = styled.div`
    margin-top: 0.5rem;
    color: var(--navds-color-text-primary);
    line-height: 1.375rem;

    > p:not(:last-of-type) {
        margin-bottom: 0.25rem;
    }
`;

const navnForHendelse = (hendelse: Hendelse) => {
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
};

const hendelseFørsteDato = (hendelse: Hendelse) =>
    hendelse.type === Kildetype.Inntektsmelding ? hendelse.mottattTidspunkt : hendelse.rapportertDato;

export const mapDokumenter = (vedtaksperiode?: Vedtaksperiode): HendelseMedTidspunkt[] =>
    vedtaksperiode
        ? vedtaksperiode.hendelser
              ?.filter((hendelse) => hendelse?.id)
              .map((hendelse: Hendelse) => ({
                  id: hendelse.id,
                  tidspunkt: hendelseFørsteDato(hendelse),
                  navn: navnForHendelse(hendelse),
                  type: Hendelsetype.Dokumenter,
                  className: hendelse.type,
              }))
        : [];

export const mapOverstyringer = (vedtaksperiode?: Vedtaksperiode): HendelseMedTidspunkt[] =>
    vedtaksperiode?.overstyringer.map((overstyring: Overstyring) => ({
        id: overstyring.hendelseId,
        tidspunkt: overstyring.timestamp,
        navn: 'Overstyrt: Sykmeldingsperiode',
        type: Hendelsetype.Historikk,
        beskrivelse: (
            <BegrunnelseTekst>
                <p>{overstyring.begrunnelse}</p>
                <p>{overstyring.saksbehandlerNavn}</p>
            </BegrunnelseTekst>
        ),
    })) ?? [];

export const mapGodkjenninger = (vedtaksperiode?: Vedtaksperiode): HendelseMedTidspunkt[] => {
    const godkjenninger: HendelseMedTidspunkt[] = [];
    if (vedtaksperiode?.automatiskBehandlet) {
        godkjenninger.push({
            id: 'automatisk',
            tidspunkt: vedtaksperiode.godkjenttidspunkt,
            navn: 'Automatisk godkjent',
            type: Hendelsetype.Historikk,
        });
    }
    if (vedtaksperiode?.godkjentAv) {
        godkjenninger.push({
            id: 'sendt-til-utbetaling',
            tidspunkt: vedtaksperiode.godkjenttidspunkt,
            navn: 'Sendt til utbetaling',
            type: Hendelsetype.Historikk,
            beskrivelse: <BegrunnelseTekst>{vedtaksperiode.godkjentAv}</BegrunnelseTekst>,
        });
    }
    return godkjenninger;
};

export declare type HendelseMedTidspunkt = HendelseMedId & {
    tidspunkt?: Dayjs;
};
