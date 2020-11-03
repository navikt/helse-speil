import { Hendelse, Kildetype, Overstyring, Vedtaksperiode } from 'internal-types';
import { NORSK_DATOFORMAT } from '../../utils/date';
import { Hendelsetype } from '@navikt/helse-frontend-logg';
import React from 'react';
import styled from '@emotion/styled';
import { HendelseMedId } from '@navikt/helse-frontend-logg/lib/src/types';

const BegrunnelseTekst = styled.div`
    margin-top: 0.5rem;
    color: #3e3832;
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

const datoForHendelse = (hendelse: Hendelse) => {
    const dato = hendelseFørsteDato(hendelse);
    return dato ? dato.format(NORSK_DATOFORMAT) : 'Ukjent dato';
};

export const mapDokumenter = (vedtaksperiode?: Vedtaksperiode): HendelseMedId[] =>
    vedtaksperiode
        ? vedtaksperiode.hendelser
              .filter((hendelse) => hendelse?.id)
              .map((hendelse: Hendelse) => ({
                  id: hendelse.id,
                  dato: datoForHendelse(hendelse),
                  navn: navnForHendelse(hendelse),
                  type: Hendelsetype.Dokumenter,
                  className: hendelse.type,
              }))
        : [];

export const mapOverstyringer = (vedtaksperiode?: Vedtaksperiode): HendelseMedId[] =>
    vedtaksperiode?.overstyringer.map((overstyring: Overstyring) => ({
        id: overstyring.hendelseId,
        dato: overstyring.timestamp.format(NORSK_DATOFORMAT),
        navn: 'Overstyrt: Sykmeldingsperiode',
        type: Hendelsetype.Historikk,
        beskrivelse: (
            <BegrunnelseTekst>
                <p>{overstyring.begrunnelse}</p>
                <p>{overstyring.saksbehandlerNavn}</p>
            </BegrunnelseTekst>
        ),
    })) ?? [];

export const mapGodkjenninger = (vedtaksperiode?: Vedtaksperiode): HendelseMedId[] => {
    const godkjenninger: HendelseMedId[] = [];
    if (vedtaksperiode?.automatiskBehandlet) {
        godkjenninger.push({
            id: 'automatisk',
            dato: vedtaksperiode.godkjenttidspunkt!.format(NORSK_DATOFORMAT),
            navn: 'Automatisk godkjent',
            type: Hendelsetype.Historikk,
        });
    }
    if (vedtaksperiode?.godkjentAv) {
        godkjenninger.push({
            id: 'sendt-til-utbetaling',
            dato: vedtaksperiode.godkjenttidspunkt!.format(NORSK_DATOFORMAT),
            navn: 'Sendt til utbetaling',
            type: Hendelsetype.Historikk,
            beskrivelse: <BegrunnelseTekst>{vedtaksperiode.godkjentAv}</BegrunnelseTekst>,
        });
    }
    return godkjenninger;
};
