import { useAtom } from 'jotai';
import React, { ReactElement } from 'react';

import { Chips } from '@navikt/ds-react';

import { useHarPorteføljestyringrolle } from '@hooks/brukerrolleHooks';
import { lagOppslåttSaksbehandlerVisningsnavn } from '@oversikt/filtermeny/SøkefeltSaksbehandlere';
import { TabType } from '@oversikt/tabState';
import { cn } from '@utils/tw';

import { Filter, FilterStatus, useSetDatofilter, valgtSaksbehandlerAtom } from '../state/filter';

interface FilterChipsProps {
    activeFilters: Filter[];
    toggleFilter: (label: string, status: FilterStatus) => void;
    setMultipleFilters: (filterStatus: FilterStatus, ...keys: string[]) => void;
    aktivTab: TabType;
}

export const FilterChips = ({
    activeFilters,
    toggleFilter,
    setMultipleFilters,
    aktivTab,
}: FilterChipsProps): ReactElement => {
    const [valgtSaksbehandler, setValgtSaksbehandler] = useAtom(valgtSaksbehandlerAtom);
    const harPorteføljestyringrolle = useHarPorteføljestyringrolle();
    const {
        datofilter,
        setOppgaveKlarFom,
        setOppgaveKlarTom,
        setBehandlingOpprettetFom,
        setBehandlingOpprettetTom,
        resetDatofilter,
    } = useSetDatofilter();
    const erFiltrertPåSaksbehandler = valgtSaksbehandler && aktivTab === TabType.TilGodkjenning;
    const visStartdatofilter = harPorteføljestyringrolle && aktivTab === TabType.TilGodkjenning;
    const harDatofilter =
        !!datofilter.oppgaveKlarFom ||
        !!datofilter.oppgaveKlarTom ||
        (visStartdatofilter && (!!datofilter.behandlingOpprettetFom || !!datofilter.behandlingOpprettetTom));
    if (activeFilters.length > 0 || erFiltrertPåSaksbehandler || harDatofilter) {
        return (
            <Chips className="mx-3 mt-1 mb-2">
                {erFiltrertPåSaksbehandler && (
                    <Chips.Removable key="valgtsaksbehandler" onClick={() => setValgtSaksbehandler(null)}>
                        {lagOppslåttSaksbehandlerVisningsnavn(valgtSaksbehandler)}
                    </Chips.Removable>
                )}
                {activeFilters.map((filter) => (
                    <Chips.Removable
                        className={cn({
                            'bg-ax-bg-danger-strong hover:bg-ax-bg-danger-strong-hover':
                                filter.status === FilterStatus.MINUS,
                        })}
                        key={filter.key}
                        onClick={() => toggleFilter(filter.key, FilterStatus.OFF)}
                    >
                        {filter.label}
                    </Chips.Removable>
                ))}
                {datofilter.oppgaveKlarFom && (
                    <Chips.Removable key="oppgaveKlarFom" onClick={() => setOppgaveKlarFom(undefined)}>
                        {`Oppgave klar fra: ${datofilter.oppgaveKlarFom.split('-').reverse().join('.')}`}
                    </Chips.Removable>
                )}
                {datofilter.oppgaveKlarTom && (
                    <Chips.Removable key="oppgaveKlarTom" onClick={() => setOppgaveKlarTom(undefined)}>
                        {`Oppgave klar til: ${datofilter.oppgaveKlarTom.split('-').reverse().join('.')}`}
                    </Chips.Removable>
                )}
                {visStartdatofilter && datofilter.behandlingOpprettetFom && (
                    <Chips.Removable key="behandlingOpprettetFom" onClick={() => setBehandlingOpprettetFom(undefined)}>
                        {`Startdato fra: ${datofilter.behandlingOpprettetFom.split('-').reverse().join('.')}`}
                    </Chips.Removable>
                )}
                {visStartdatofilter && datofilter.behandlingOpprettetTom && (
                    <Chips.Removable key="behandlingOpprettetTom" onClick={() => setBehandlingOpprettetTom(undefined)}>
                        {`Startdato til: ${datofilter.behandlingOpprettetTom.split('-').reverse().join('.')}`}
                    </Chips.Removable>
                )}
                {(activeFilters.length > 0 || harDatofilter) && (
                    <Chips.Removable
                        onClick={() => {
                            setMultipleFilters(FilterStatus.OFF, ...activeFilters.map((filter) => filter.key));
                            setValgtSaksbehandler(null);
                            resetDatofilter();
                        }}
                        data-color="neutral"
                    >
                        Nullstill alle
                    </Chips.Removable>
                )}
            </Chips>
        );
    }

    return (
        <Chips className="mx-3 mt-1 mb-2">
            <Chips.Toggle className="cursor-default" checkmark={false}>
                Ingen aktive filter
            </Chips.Toggle>
        </Chips>
    );
};
