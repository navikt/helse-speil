import React, { ReactNode, useContext } from 'react';
import { Hendelse, Kildetype } from './types.internal';
import { PersonContext } from './PersonContext';
import { NORSK_DATOFORMAT } from '../utils/date';
import { LoggProvider, Hendelsetype as LoggType } from '@navikt/helse-frontend-logg';

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

export default ({ children }: LoggProviderProps) => {
    const { aktivVedtaksperiode, personTilBehandling } = useContext(PersonContext);

    const dokumenter = aktivVedtaksperiode
        ? aktivVedtaksperiode.hendelser.map((hendelse: Hendelse) => ({
              id: hendelse.id,
              dato: datoForHendelse(hendelse),
              navn: navnForHendelse(hendelse),
              type: LoggType.Dokumenter
          }))
        : [];

    return <LoggProvider hendelser={dokumenter}>{children}</LoggProvider>;
};
