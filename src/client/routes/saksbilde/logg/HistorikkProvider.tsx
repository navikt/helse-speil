import React, { useState } from 'react';

import { useAktivPeriode, useVedtaksperiode } from '../../../state/tidslinje';

import { Filter, Hendelse, HistorikkContext } from './HistorikkContext';
import { useAnnullering, useDokumenter, useGodkjenning, useOverstyring } from './mapping';

const byTimestamp = (a: Hendelse, b: Hendelse): number => {
    if (a.timestamp === undefined) return -1;
    if (b.timestamp === undefined) return 1;
    return b.timestamp.diff(a.timestamp);
};

export const HistorikkProvider: React.FC = ({ children }) => {
    const aktivPeriode = useAktivPeriode();
    const vedtaksperiode = useVedtaksperiode(aktivPeriode?.id!);

    const dokumenter = useDokumenter(vedtaksperiode);
    const annullering = useAnnullering(vedtaksperiode);
    const godkjenninger = useGodkjenning(vedtaksperiode);
    const overstyringer = useOverstyring(vedtaksperiode, aktivPeriode);

    const [filter, setFilter] = useState<Filter | null>(null);

    const hendelser = [...dokumenter, ...overstyringer, ...godkjenninger, ...annullering]
        .sort(byTimestamp)
        .filter((it) => !aktivPeriode || it.timestamp?.isSameOrBefore(aktivPeriode.opprettet));
    // .filter(filter ? filter : () => true);

    return (
        <HistorikkContext.Provider
            value={{
                hendelser: hendelser,
                setFilter: setFilter,
            }}
            // hendelser={[]}
            // filtere={[
            //     {
            //         filterFunction: (_: LoggHendelse) => true,
            //         renderProp: <IkonHistorikk />,
            //         disabled: hendelser.length === 0,
            //     },
            //     {
            //         filterFunction: (hendelse: LoggHendelse) => hendelse.type === Hendelsetype.Dokumenter,
            //         renderProp: <IkonDokumenter />,
            //         disabled: hendelser.find(({ type }) => type === Hendelsetype.Dokumenter) === undefined,
            //     },
            //     {
            //         filterFunction: (hendelse: LoggHendelse) => hendelse.type === Hendelsetype.Meldinger,
            //         renderProp: <IkonDialog />,
            //         disabled: hendelser.find(({ type }) => type === Hendelsetype.Meldinger) === undefined,
            //     },
            // ]}
        >
            {children}
        </HistorikkContext.Provider>
    );
};
