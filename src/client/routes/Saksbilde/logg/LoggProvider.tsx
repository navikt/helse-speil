import React, { ReactNode } from 'react';
import { IkonDialog } from './icons/IkonDialog';
import { IkonHistorikk } from './icons/IkonHistorikk';
import { IkonDokumenter } from './icons/IkonDokumenter';
import { HendelseMedTidspunkt, mapDokumenter, mapGodkjenninger, mapOverstyringer } from './mapping';
import {
    Hendelse as LoggHendelse,
    Hendelsetype,
    LoggProvider as EksternLoggProvider,
} from '@navikt/helse-frontend-logg';
import { NORSK_DATOFORMAT } from '../../../utils/date';
import { useAktivVedtaksperiode } from '../../../state/vedtaksperiode';

interface LoggProviderProps {
    children: ReactNode | ReactNode[];
}

export const LoggProvider = ({ children }: LoggProviderProps) => {
    const aktivVedtaksperiode = useAktivVedtaksperiode();

    const dokumenter = mapDokumenter(aktivVedtaksperiode);
    const overstyringer = mapOverstyringer(aktivVedtaksperiode);
    const godkjenninger = mapGodkjenninger(aktivVedtaksperiode);

    const hendelser = [...dokumenter, ...overstyringer, ...godkjenninger].sort(hendelsesorterer).map(tilEksternType);

    return (
        <EksternLoggProvider
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
        </EksternLoggProvider>
    );
};

const tilEksternType = (intern: HendelseMedTidspunkt) => ({
    ...intern,
    dato: intern.tidspunkt?.format(NORSK_DATOFORMAT) ?? 'Ukjent dato',
});

const hendelsesorterer = (a: HendelseMedTidspunkt, b: HendelseMedTidspunkt): number => {
    if (a.tidspunkt === undefined) return -1;
    if (b.tidspunkt === undefined) return 1;
    return b.tidspunkt.diff(a.tidspunkt);
};
