import { UfullstendigVedtaksperiode, Vedtaksperiode } from 'internal-types';
import React, { ReactNode } from 'react';

import {
    Hendelse as LoggHendelse,
    Hendelsetype,
    LoggProvider as EksternLoggProvider,
} from '@navikt/helse-frontend-logg';

import { Periodetype } from '../../../modell/UtbetalingshistorikkElement';
import { usePerson } from '../../../state/person';
import { useAktivPeriode, useVedtaksperiode } from '../../../state/tidslinje';
import { NORSK_DATOFORMAT } from '../../../utils/date';

import { IkonDialog } from './icons/IkonDialog';
import { IkonDokumenter } from './icons/IkonDokumenter';
import { IkonHistorikk } from './icons/IkonHistorikk';
import { HendelseMedTidspunkt, mapAnnullering, mapDokumenter, mapGodkjenninger, mapOverstyringer } from './mapping';

interface LoggProviderProps {
    children: ReactNode | ReactNode[];
}

export const LoggProvider = ({ children }: LoggProviderProps) => {
    const aktivPeriode = useAktivPeriode();
    const vedtaksperiode = useVedtaksperiode(aktivPeriode?.id!);

    const person = usePerson();
    const annullertAvSaksbehandler = person?.utbetalinger?.find(
        (utb) =>
            utb.arbeidsgiverOppdrag.fagsystemId ===
            (vedtaksperiode as Vedtaksperiode)?.utbetalinger?.arbeidsgiverUtbetaling?.fagsystemId
    )?.annullering;

    const erFullstendig = (periode: Vedtaksperiode | UfullstendigVedtaksperiode): boolean => !!periode?.fullstendig;

    const dokumenter = (erFullstendig(vedtaksperiode) && mapDokumenter(vedtaksperiode as Vedtaksperiode)) || [];
    const overstyringer =
        (erFullstendig(vedtaksperiode) &&
            mapOverstyringer(aktivPeriode?.type === Periodetype.REVURDERING, vedtaksperiode as Vedtaksperiode)) ||
        [];
    const godkjenninger = (erFullstendig(vedtaksperiode) && mapGodkjenninger(vedtaksperiode as Vedtaksperiode)) || [];
    const annullering =
        (erFullstendig(vedtaksperiode) && annullertAvSaksbehandler && mapAnnullering(annullertAvSaksbehandler)) || [];

    let hendelser = [...dokumenter, ...overstyringer, ...godkjenninger, ...annullering]
        .sort(hendelsesorterer)
        .map(tilEksternType);

    if (aktivPeriode) {
        hendelser = hendelser.filter((it) => it.tidspunkt?.isSameOrBefore(aktivPeriode.opprettet));
    }

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
