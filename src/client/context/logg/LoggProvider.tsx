import React, { ReactNode, useContext } from 'react';
import { PersonContext } from '../PersonContext';
import { somNorskDato } from '../../mapping/vedtaksperiode';
import { IkonDialog } from './icons/IkonDialog';
import { IkonHistorikk } from './icons/IkonHistorikk';
import { IkonDokumenter } from './icons/IkonDokumenter';
import { mapDokumenter, mapGodkjenninger, mapOverstyringer } from './mapping';
import { Hendelse as LoggHendelse, Hendelsetype, LoggProvider } from '@navikt/helse-frontend-logg';

interface LoggProviderProps {
    children: ReactNode | ReactNode[];
}

export default ({ children }: LoggProviderProps) => {
    const { aktivVedtaksperiode } = useContext(PersonContext);

    const dokumenter = mapDokumenter(aktivVedtaksperiode);
    const overstyringer = mapOverstyringer(aktivVedtaksperiode);
    const godkjenninger = mapGodkjenninger(aktivVedtaksperiode);

    const hendelser = [...dokumenter, ...overstyringer, ...godkjenninger]
        .filter((hendelse) => hendelse.dato)
        .sort((a, b) => (somNorskDato(a.dato!).isAfter(somNorskDato(b.dato!)) ? -1 : 1));

    return (
        <LoggProvider
            hendelser={hendelser}
            filtere={[
                {
                    filterFunction: (_: LoggHendelse) => true,
                    renderProp: <IkonHistorikk />,
                    disabled: hendelser.length === 0,
                },
                {
                    filterFunction: (hendelse: LoggHendelse) => hendelse.type === Hendelsetype.Dokumenter,
                    renderProp: <IkonDokumenter />,
                    disabled: hendelser.find(({ type }) => type === Hendelsetype.Dokumenter) === undefined,
                },
                {
                    filterFunction: (hendelse: LoggHendelse) => hendelse.type === Hendelsetype.Meldinger,
                    renderProp: <IkonDialog />,
                    disabled: hendelser.find(({ type }) => type === Hendelsetype.Meldinger) === undefined,
                },
            ]}
        >
            {children}
        </LoggProvider>
    );
};
