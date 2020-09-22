import React, { ReactNode, useContext } from 'react';
import { Hendelse, Kildetype, Overstyring } from 'internal-types';
import { PersonContext } from './PersonContext';
import { NORSK_DATOFORMAT } from '../utils/date';
import {
    Hendelse as LoggHendelse,
    Hendelsestatus as LoggStatus,
    Hendelsetype as LoggType,
    LoggProvider,
} from '@navikt/helse-frontend-logg';
import styled from '@emotion/styled';
import { somNorskDato } from '../mapping/vedtaksperiode';

interface LoggProviderProps {
    children: ReactNode | ReactNode[];
}

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

const Begrunnelsesliste = styled.ul`
    list-style: disc outside none;
    margin-left: 1rem;
    margin-top: 1.25rem;
    font-weight: normal;
    li {
        margin-bottom: 0.5rem;
    }
`;

const BegrunnelseTekst = styled.p`
    margin-top: 0.5rem;
    color: #3e3832;
    line-height: 1.375rem;

    > p:not(:last-of-type) {
        margin-bottom: 0.25rem;
    }
`;

export default ({ children }: LoggProviderProps) => {
    const { aktivVedtaksperiode } = useContext(PersonContext);

    const dokumenter = aktivVedtaksperiode
        ? aktivVedtaksperiode.hendelser
              .filter((hendelse) => hendelse?.id)
              .map((hendelse: Hendelse) => ({
                  id: hendelse.id,
                  dato: datoForHendelse(hendelse),
                  navn: navnForHendelse(hendelse),
                  type: LoggType.Dokumenter,
              }))
        : [];

    const risikovurdering: LoggHendelse[] = aktivVedtaksperiode?.risikovurdering
        ? [
              {
                  id: 'risikovurdering',
                  dato: aktivVedtaksperiode.risikovurdering.opprettet.format(NORSK_DATOFORMAT),
                  navn: 'Faresignaler oppdaget',
                  type: LoggType.Historikk,
                  status: LoggStatus.Advarsel,
                  beskrivelse: (
                      <Begrunnelsesliste>
                          {aktivVedtaksperiode.risikovurdering.begrunnelser.map((begrunnelse, index) => (
                              <li key={index}>{begrunnelse}</li>
                          ))}
                      </Begrunnelsesliste>
                  ),
              },
          ]
        : [];

    const overstyringer: LoggHendelse[] =
        aktivVedtaksperiode?.overstyringer.map((overstyring: Overstyring) => ({
            id: overstyring.hendelseId,
            dato: overstyring.timestamp.format(NORSK_DATOFORMAT),
            navn: 'Overstyrt: Sykmeldingsperiode',
            type: LoggType.Dokumenter,
            beskrivelse: (
                <BegrunnelseTekst>
                    <p>{overstyring.begrunnelse}</p>
                    <p>{overstyring.saksbehandlerNavn}</p>
                </BegrunnelseTekst>
            ),
        })) ?? [];

    const hendelser = [...dokumenter, ...risikovurdering, ...overstyringer].sort((a, b) =>
        somNorskDato(a.dato).isAfter(somNorskDato(b.dato)) ? -1 : 1
    );

    return <LoggProvider hendelser={hendelser}>{children}</LoggProvider>;
};
